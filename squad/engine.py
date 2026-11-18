import asyncio, json, subprocess, os, sys, math
import numpy as np, wave
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from art import char
W,H,FPS=1080,1920,30
SCALE=float(os.environ.get('SQUAD_SCALE','1.3333333'))  # 1440x2560 output: YouTube gives higher-quality encodes to >1080p uploads
CSS="""*{box-sizing:border-box;margin:0;padding:0}html,body{width:1080px;height:1920px;overflow:hidden;background:#fffaf5}
.beat{position:absolute;inset:0;overflow:hidden}.el{position:absolute;left:0;top:0;transform-origin:50% 100%;will-change:transform}
.cap{font-family:Lora,serif;font-weight:700;color:#2a2438;text-align:center;line-height:1.12;transform-origin:50% 50%}
.sub{font-family:Poppins,sans-serif;font-weight:500;color:#2a2438;text-align:center;line-height:1.3;transform-origin:50% 50%}
.pill{background:#fff;border-radius:40px;padding:22px 34px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.phone{width:520px;height:300px;background:#1f1b2b;border-radius:48px;padding:26px;transform-origin:50% 50%}
.msg{background:#fff;border-radius:30px;padding:22px 26px;font-family:Poppins,sans-serif;font-size:40px;color:#2a2438}
.msg small{display:block;font-size:24px;color:#8a8399;margin-bottom:6px}
.cloud{background:#fff;border-radius:60px;padding:28px 36px;font-family:Poppins,sans-serif;font-size:34px;color:#2a2438;box-shadow:0 10px 30px rgba(0,0,0,.08);transform-origin:50% 100%}
.cloud div{margin:6px 0}.mood{position:absolute;inset:0}.scene{position:absolute;inset:0}.scene svg{display:block}"""
def build_html(ep):
    beats=[]
    for bi,b in enumerate(ep['beats']):
        els=[]
        for ei,e in enumerate(b['els']):
            eid=f"b{bi}e{ei}"
            if e['type']=='char':
                w=e['w']; h=w*310/260
                moods="".join(f'<div class="mood" data-m="{m}">{char(e["name"],m,e.get("deco",False))}</div>' for m in sorted(set(mm for _,mm in e['moods'])))
                els.append(f'<div class="el" id="{eid}" style="width:{w}px;height:{h}px">{moods}</div>')
            else:
                els.append(f'<div class="el" id="{eid}" style="{e.get("style","")}">{e["html"]}</div>')
        scene=f'<div class="scene">{b["scene"]}</div>' if b.get("scene") else ''
        beats.append(f'<div class="beat" id="b{bi}" style="background:{b["bg"]}">{scene}{"".join(els)}</div>')
    return f"<html><head><style>{CSS}</style></head><body>{''.join(beats)}</body></html>"
JS="""
window.EP=null;
function ease(k,t){t=Math.max(0,Math.min(1,t));if(k=='back'){const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)}
 if(k=='in')return t*t*t; if(k=='lin')return t; return 1-Math.pow(1-t,3)}
function interp(kf,t){ // kf: [[time,{x,y,s,r,o}],ease]
 let a=kf[0][1],last=kf[kf.length-1];
 if(t<=kf[0][0])return Object.assign({x:0,y:0,s:1,r:0,o:1},kf[0][1]);
 for(let i=1;i<kf.length;i++){ if(t<=kf[i][0]){const p=kf[i-1],q=kf[i];const u=ease(q[2]||'out',(t-p[0])/(q[0]-p[0]));
   const A=Object.assign({x:0,y:0,s:1,r:0,o:1},p[1]),B=Object.assign({},A,q[1]);const R={};for(const k in B)R[k]=A[k]+(B[k]-A[k])*u;return R}}
 const R=Object.assign({x:0,y:0,s:1,r:0,o:1});for(const i of kf)Object.assign(R,i[1]);return R}
function render(T){
 let acc=0;
 EP.beats.forEach((b,bi)=>{const d=document.getElementById('b'+bi);const t=T-acc;const on=t>=0&&t<b.dur;d.style.display=on?'block':'none';
  if(on){const tin=bi==0?1:Math.min(1,t/0.22);d.style.transform=`scale(${1.04-0.04*ease('out',tin)})`;d.style.opacity=Math.min(1,0.35+tin);
   b.els.forEach((e,ei)=>{const el=document.getElementById('b'+bi+'e'+ei);const v=interp(e.kf,t);
     let bob=0,sq=1;if(e.bob){bob=Math.sin((t+ei)*Math.PI*2*(e.bob.f||1.2))*(e.bob.a||8);sq=1+Math.sin((t+ei)*Math.PI*4*(e.bob.f||1.2))*0.012}
     el.style.transform=`translate(${v.x}px,${v.y+bob}px) rotate(${v.r}deg) scale(${v.s*sq},${v.s/sq})`;el.style.opacity=v.o;
     if(e.moods){let cur=e.moods[0][1];for(const m of e.moods)if(t>=m[0])cur=m[1];el.querySelectorAll('.mood').forEach(n=>n.style.display=n.dataset.m==cur?'block':'none')}
   })}
  acc+=b.dur})}
"""
def music(dur,path,sfx=()):
    sr=44100;n=int(dur*sr);t=np.arange(n)/sr;out=np.zeros(n)
    bpm=82;beat=60/bpm
    chords=[[261.63,329.63,392.0,493.88],[220.0,261.63,329.63,392.0],[174.61,220.0,261.63,329.63],[196.0,246.94,293.66,349.23]]
    bar=beat*4
    for i in range(int(dur/bar)+1):
        st=int(i*bar*sr);ln=int(bar*sr);seg=np.arange(min(ln,n-st))/sr
        if len(seg)<=0:break
        env=np.minimum(1,seg/0.4)*np.minimum(1,(bar-seg)/0.5)
        for f in chords[i%4]:
            out[st:st+len(seg)]+=0.05*env*(np.sin(2*np.pi*f*seg)+0.4*np.sin(2*np.pi*f*1.003*seg))
        for k in range(8):  # soft pluck arpeggio
            s2=st+int(k*beat/2*sr);f=chords[i%4][k%4]*2
            L=min(int(0.6*sr),n-s2)
            if L<=0:continue
            tt=np.arange(L)/sr;out[s2:s2+L]+=0.06*np.exp(-tt*6)*np.sin(2*np.pi*f*tt)
    for (ts,kind) in sfx:
        s2=int(ts*sr)
        if kind=='pop':
            L=int(.18*sr);tt=np.arange(L)/sr;f=500+1400*np.exp(-tt*30);sig=0.25*np.exp(-tt*22)*np.sin(2*np.pi*np.cumsum(f)/sr)
        elif kind=='buzz':
            L=int(.6*sr);tt=np.arange(L)/sr;sig=0.18*np.sign(np.sin(2*np.pi*180*tt))*(np.sin(2*np.pi*6*tt)>0)*np.exp(-tt*1.5)
        elif kind=='ding':
            L=int(1.0*sr);tt=np.arange(L)/sr;sig=0.22*np.exp(-tt*4)*(np.sin(2*np.pi*1046*tt)+0.5*np.sin(2*np.pi*1568*tt))
        elif kind=='fall':
            L=int(.7*sr);tt=np.arange(L)/sr;f=900*np.exp(-tt*2.5);sig=0.18*np.exp(-tt*3)*np.sin(2*np.pi*np.cumsum(f)/sr)
        elif kind=='thud':
            L=int(.3*sr);tt=np.arange(L)/sr;sig=0.5*np.exp(-tt*25)*np.sin(2*np.pi*70*tt)
        L=min(len(sig),n-s2)
        if L>0: out[s2:s2+L]+=sig[:L]
    fade=np.minimum(1,(dur-t)/1.2);out*=np.clip(fade,0,1)
    out=np.clip(out/ max(1e-6,np.max(np.abs(out)))*0.8,-1,1)
    data=(np.stack([out,out],1)*32767).astype(np.int16)
    with wave.open(path,'wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(data.tobytes())
async def frames(ep,times):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":W,"height":H},device_scale_factor=SCALE)
        await pg.set_content(build_html(ep)); await pg.add_script_tag(content=JS)
        await pg.evaluate("e=>{window.EP=e}",{"beats":[{"dur":x["dur"],"els":[{k:v for k,v in e.items() if k in("kf","bob","moods")} for e in x["els"]]} for x in ep["beats"]]})
        await pg.wait_for_timeout(500)
        for t in times:
            await pg.evaluate(f"render({t})")
            yield await pg.screenshot(type="jpeg",quality=95)
        await b.close()
async def stills(ep,times,prefix):
    i=0
    async for img in frames(ep,times):
        open(f"{prefix}_{i}.jpg","wb").write(img); i+=1
async def render(ep,out):
    dur=sum(b['dur'] for b in ep['beats']); N=int(dur*FPS)
    tmp=out.replace('.mp4','.video.tmp.mp4')
    ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(FPS),"-i","-","-c:v","libx264","-preset","veryfast","-crf","17","-pix_fmt","yuv420p",tmp],stdin=subprocess.PIPE)
    async for img in frames(ep,[i/FPS for i in range(N)]): ff.stdin.write(img)
    ff.stdin.close(); assert ff.wait()==0
    wav=out.replace('.mp4','.wav'); music(dur,wav,ep.get('sfx',[]))
    final=out.replace('.mp4','.tmp.mp4')
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",tmp,"-i",wav,"-map","0:v","-map","1:a","-c:v","copy","-c:a","aac","-b:a","160k","-shortest",final],check=True)
    os.replace(final,out); os.remove(tmp); os.remove(wav)
