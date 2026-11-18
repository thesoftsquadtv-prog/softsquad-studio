# Landscape lofi scene: "Study with Juno – rainy night". Renders a seamless 20 s loop.
import sys,os,asyncio,random,subprocess,math
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,os.path.join(HERE,'..','chars'))
from adults import person_adult
sys.path.insert(0,os.path.join(HERE,'..','squad')); _c=os.getcwd()
from art import char as _char
os.chdir(_c)
TOFFEE_WALK=_char('Toffee','spark',False).replace('width="100%" height="100%"','width="260" height="310"')
W,H=1920,1080; LOOP=60.0; FPS=30
rnd=random.Random(4)
def skyline():
    s=''; x=150
    cols=['#2c2c55','#34326a','#29294c','#3a3672']
    while x<830:
        w=rnd.randint(60,110); h=rnd.randint(140,330); c=rnd.choice(cols)
        s+=f'<rect x="{x}" y="{700-h}" width="{w}" height="{h}" fill="{c}"/>'
        for wy in range(700-h+16,690,34):
            for wx in range(x+10,x+w-16,24):
                if rnd.random()<.35: s+=f'<rect x="{wx}" y="{wy}" width="10" height="14" rx="2" fill="#ffd98a" opacity="{rnd.uniform(.5,.95):.2f}"/>'
        x+=w+rnd.randint(4,12)
    return s
def sleeping_cat():
    return ('<g id="cat"><ellipse cx="0" cy="0" rx="78" ry="44" fill="#e8a865"/><path d="M-70 10 q-40 30 10 40 q60 6 110 -10" stroke="#e8a865" stroke-width="18" fill="none" stroke-linecap="round"/>'
            '<circle cx="58" cy="-14" r="38" fill="#eeb06c"/><path d="M34 -40 l6 -30 l20 22z M66 -46 l18 -26 l8 30z" fill="#eeb06c"/><path d="M40 -42 l4 -16 l10 12z M70 -46 l10 -14 l4 16z" fill="#f6c7a6"/>'
            '<path d="M44 -12 q8 6 16 0 M66 -12 q8 6 16 0" stroke="#5a3a2a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="62" cy="0" rx="4" ry="3" fill="#d9707a"/>'
            '<path d="M-30 -30 q10 -6 20 0 M-10 -36 q10 -6 20 0" stroke="#d2894a" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/></g>')

def side_cat(phase=0.0,moving=True,tail_t=0.0):
    """Toffee in side profile facing RIGHT, feet at y=0. phase drives the walk cycle."""
    import math as m
    sw=lambda off: (24*m.sin(2*m.pi*phase+off) if moving else 0)
    bob=(3*abs(m.sin(2*m.pi*phase)) if moving else 0)
    def leg(x,ang,col):
        return f'<g transform="translate({x},-38) rotate({ang:.1f})"><rect x="-7" y="0" width="14" height="40" rx="7" fill="{col}"/><ellipse cx="2" cy="38" rx="10" ry="6" fill="{col}"/></g>'
    far="#d9944f"; near="#eeb06c"
    tail=12*m.sin(2*m.pi*tail_t*0.8)
    g=f'<g transform="translate(0,{-bob:.1f})">'
    g+=leg(-36,sw(m.pi),far)+leg(40,sw(0),far)                       # far legs (behind body)
    g+=f'<path d="M-56 -58 q-34 -6 -40 -48 q-4 -22 12 -26" stroke="{near}" stroke-width="15" fill="none" stroke-linecap="round" transform="rotate({tail:.1f} -56 -58)"/>'
    g+=f'<ellipse cx="0" cy="-58" rx="64" ry="28" fill="{near}"/>'
    g+='<path d="M-30 -82 q6 10 0 20 M-12 -85 q6 10 0 20 M6 -85 q6 10 0 20" stroke="#d2894a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>'
    g+=leg(-28,sw(0),near)+leg(48,sw(m.pi),near)                      # near legs (in front)
    # head
    g+=f'<circle cx="66" cy="-86" r="30" fill="{near}"/>'
    g+=f'<path d="M48 -108 l4 -30 l20 20z" fill="{near}"/><path d="M70 -112 l14 -26 l10 28z" fill="{near}"/>'
    g+='<path d="M53 -112 l3 -16 l10 10z" fill="#f6c7a6"/><path d="M75 -114 l8 -14 l6 16z" fill="#f6c7a6"/>'
    g+='<ellipse cx="80" cy="-90" rx="4.5" ry="6" fill="#2a2438"/><circle cx="81.5" cy="-92" r="1.6" fill="#fff"/>'
    g+='<ellipse cx="95" cy="-80" rx="4" ry="3" fill="#d9707a"/><path d="M95 -77 q-3 6 -8 4" stroke="#5a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>'
    g+='<ellipse cx="74" cy="-76" rx="7" ry="3.5" fill="#ff8fa3" opacity=".35"/>'
    g+='<path d="M90 -78 l18 -4 M90 -75 l18 2" stroke="#fff" stroke-width="1.6" opacity=".7"/>'
    return g+'</g>'
STATIC=f'''
<defs>
 <radialGradient id="lamp" cx="1580" cy="430" r="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".55"/><stop offset=".5" stop-color="#ff9f6a" stop-opacity=".12"/><stop offset="1" stop-color="#ff9f6a" stop-opacity="0"/></radialGradient>
 <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2547"/><stop offset="1" stop-color="#3b3158"/></linearGradient>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1d3d"/><stop offset="1" stop-color="#3b3a6e"/></linearGradient>
 <clipPath id="win"><rect x="150" y="130" width="680" height="570" rx="14"/></clipPath>
</defs>
<rect width="{W}" height="{H}" fill="url(#wall)"/>
<rect x="128" y="108" width="724" height="614" rx="28" fill="#4a3f6e"/>
<g clip-path="url(#win)"><rect x="150" y="130" width="680" height="570" fill="url(#sky)"/>
 <circle cx="700" cy="230" r="46" fill="#fff1c9"/><circle cx="720" cy="218" r="44" fill="#262650" opacity=".0"/>{skyline()}<g id="rain"></g></g>
<rect x="484" y="130" width="12" height="570" fill="#4a3f6e"/><rect x="150" y="410" width="680" height="12" fill="#4a3f6e"/>
<rect x="110" y="712" width="760" height="26" rx="10" fill="#5b4e83"/>
<g transform="translate(240,712)"><path d="M0 0 q-40 -40 -14 -90 q14 40 14 90z" fill="#6fa77f"/><path d="M0 0 q40 -50 20 -110 q-20 50 -20 110z" fill="#5f9670"/><path d="M-34 0 h68 l-10 -40 h-48z" fill="#c98a6a" transform="scale(1,-1)"/></g>
<rect x="1060" y="150" width="380" height="16" rx="6" fill="#6b5a8c"/>
{"".join(f'<rect x="{1080+i*38}" y="{70+(i%3)*8}" width="30" height="{80-(i%3)*8}" rx="4" fill="{c}"/>' for i,c in enumerate(["#e48aa0","#7a5fc0","#f0c27a","#6fa77f","#5f7fc0","#e48aa0","#c9a6ee"]))}
<rect width="{W}" height="{H}" fill="url(#lamp)"/>
<g id="lights"></g>
'''
DESK='''
<rect x="0" y="830" width="1920" height="250" fill="#6b4a3a"/><rect x="0" y="812" width="1920" height="34" rx="6" fill="#8a5f47"/>
<g transform="translate(1560,812)"><rect x="-70" y="-14" width="140" height="14" rx="6" fill="#3b3150"/><rect x="-6" y="-250" width="12" height="240" fill="#3b3150"/><path d="M-6 -250 l-90 -40" stroke="#3b3150" stroke-width="12" stroke-linecap="round"/><path d="M-170 -250 q60 -90 140 -20z" fill="#ffb56b"/><ellipse cx="-100" cy="-262" rx="70" ry="14" fill="#ffe2a8"/></g>
<g transform="translate(1000,812)"><path d="M-170 -10 l170 -40 l170 40z" fill="#fff6e8"/><path d="M0 -50 v40" stroke="#e0d2bc" stroke-width="3"/><g stroke="#cdbfa8" stroke-width="3">'''+''.join(f'<path d="M{-140+i*6} {-14-i*7} l{110} -24"/>' for i in range(4))+''.join(f'<path d="M{30} {-36+i*7} l{110} 24"/>' for i in range(4))+'''</g></g>
<g transform="translate(700,812)"><rect x="-60" y="-34" width="160" height="34" rx="6" fill="#7a5fc0"/><rect x="-50" y="-64" width="150" height="30" rx="6" fill="#e48aa0"/><rect x="-40" y="-90" width="130" height="26" rx="6" fill="#f0c27a"/></g>
<g transform="translate(1290,812)"><rect x="-34" y="-80" width="68" height="80" rx="12" fill="#f4efe8"/><path d="M34 -64 q30 0 30 24 q0 24 -30 24" stroke="#f4efe8" stroke-width="10" fill="none"/><rect x="-28" y="-74" width="56" height="10" rx="5" fill="#8a5f47"/></g>
'''
def html(t):
    # rain streaks: deterministic, period LOOP
    r=random.Random(11); rain=''
    for i in range(70):
        x0=r.uniform(150,830); sp=r.choice([1,2,3])*3  # cycles per loop
        ph=r.random(); y=130+((ph+sp*t/LOOP)%1)*640-70
        rain+=f'<path d="M{x0:.1f} {y:.1f} l-8 34" stroke="#b9c3ff" stroke-width="2" opacity=".45" stroke-linecap="round"/>'
    r=random.Random(5); lights=''
    for i in range(16):
        x=60+i*120; y=40+18*math.sin(i*0.9)
        tw=.55+.45*(0.5+0.5*math.sin(2*math.pi*(t/LOOP*2+r.random())))
        lights+=f'<path d="M{x-60} {40+18*math.sin((i-.5)*0.9):.1f} Q{x} {y+26:.1f} {x+60} {40+18*math.sin((i+.5)*0.9):.1f}" stroke="#2a2440" stroke-width="2" fill="none"/>'
        lights+=f'<circle cx="{x}" cy="{y+16:.1f}" r="9" fill="{["#ffd98a","#ffb3c7","#c9e4ff"][i%3]}" opacity="{tw:.2f}"/><circle cx="{x}" cy="{y+16:.1f}" r="22" fill="#ffd98a" opacity="{tw*0.12:.2f}"/>'
    breathe=1+0.025*math.sin(2*math.pi*t/LOOP*15)        # 4 s breaths
    sway=1.6*math.sin(2*math.pi*t/LOOP*15)                # gentle head sway
    steam=''
    for k in range(3):
        p=((t/LOOP*12)+k/3)%1
        steam+=f'<path d="M{1280+k*10} {720-p*90:.1f} q-14 -20 0 -40 q14 -20 0 -40" stroke="#ffffff" stroke-width="5" fill="none" opacity="{(1-p)*0.35:.2f}" stroke-linecap="round"/>'
    chair='<rect x="850" y="600" width="300" height="260" rx="40" fill="#5b4e83"/>'
    juno=chair+f'<g transform="translate(1000,1000) rotate({sway:.2f}) translate(-1000,-1000)"><svg x="760" y="440" width="480" height="572" viewBox="0 0 260 310">{person_adult("Juno","calm")}</svg></g>'
    # ---- Toffee's 60 s story: sill -> walks to Juno -> snuggles & purrs while she strokes him -> walks back ----
    def ease(a): return a*a*(3-2*a)
    def walker(x,flip=False,bob=0,moving=True):
        f='scale(-1,1)' if flip else ''
        return f'<g transform="translate({x:.1f},812) {f}">{side_cat(t*1.6,moving,t)}</g>'
    def curled(x,y=770,sc=1.0): return f'<g transform="translate({x:.1f},{y}) scale({sc},{sc*breathe:.4f})">{sleeping_cat()}</g>'
    SILL,NEAR=400,1185
    arm=''; purr=''
    if t<10 or t>=56: cat=curled(SILL)
    elif t<11.5: cat=walker(SILL,moving=False)
    elif t<17: a=ease((t-11.5)/5.5); cat=walker(SILL+(NEAR-SILL)*a)
    elif t<18.5: cat=walker(NEAR,moving=False) if t<17.6 else curled(NEAR,775,0.85)
    elif t<48:
        cat=curled(NEAR,775,0.85)
        if 19<t<47:
            k=min(1,(t-19)/0.8,(47-t)/0.8)
            hx=NEAR-40+60*(0.5-0.5*math.cos(2*math.pi*(t-19)/2.6)); hy=720+6*math.sin(2*math.pi*(t-19)/2.6)
            sx,sy=1066,661
            arm=(f'<g opacity="{k:.2f}"><path d="M{sx} {sy} Q{(sx+hx)/2+30:.1f} {sy+20:.1f} {hx:.1f} {hy:.1f}" stroke="#f1e6d6" stroke-width="31" fill="none" stroke-linecap="round"/>'
                 f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="16" fill="#e8b48f"/></g>')
            for j in range(3):
                p=((t-19)/3+j/3)%1
                purr+=f'<text x="{NEAR+60+p*40:.1f}" y="{720-p*70:.1f}" font-family="Poppins,sans-serif" font-size="{26+p*8:.0f}" fill="#ffd1dc" opacity="{(1-p)*0.8*k:.2f}">{"♡" if j==1 else "~"}</text>'
    elif t<49.5: cat=walker(NEAR,flip=True,moving=False)
    else: a=ease((t-49.5)/6.5); cat=walker(NEAR+(SILL-NEAR)*a,flip=True)
    cat=cat+arm+purr
    # sheer curtains swaying in the breeze (two panels, top-anchored)
    sw1=3.2*math.sin(2*math.pi*t/LOOP*6); sw2=3.2*math.sin(2*math.pi*t/LOOP*6+1.3)
    def curtain(x0,w,sk,flip):
        wave=" ".join(f"q{w/8:.1f} {14*math.sin(t*1.3+i):.1f} {w/4:.1f} 0" for i in range(4))
        return (f'<g transform="translate({x0},120) skewX({sk:.2f})"><path d="M0 0 h{w} v600 {""} l0 0 h-{w}z" fill="#ffffff" opacity=".0"/>'
                f'<path d="M0 0 h{w} v590 q-{w/8:.1f} 16 -{w/4:.1f} 0 q-{w/8:.1f} -16 -{w/4:.1f} 0 q-{w/8:.1f} 16 -{w/4:.1f} 0 q-{w/8:.1f} -16 -{w/4:.1f} 0z" fill="#f4eeff" opacity=".22"/>'
                + "".join(f'<path d="M{w*(i+0.5)/5:.1f} 0 v586" stroke="#ffffff" stroke-width="3" opacity=".12"/>' for i in range(5)) + '</g>')
    curtains=curtain(132,210,sw1,False)+curtain(640,210,sw2,True)+'<rect x="110" y="104" width="760" height="14" rx="7" fill="#6b5a8c"/>'

    body=STATIC.replace('<g id="rain"></g>',rain).replace('<g id="lights"></g>',lights)
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'+body+curtains+juno+DESK+cat+steam+
         '<text x="60" y="1040" font-family="Poppins,sans-serif" font-size="30" fill="#f6efe6" opacity=".6">the soft squad · study with juno</text></svg>')
    return svg
PAGE='<html><head><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet"></head><body style="margin:0;overflow:hidden" id="b"></body></html>'
async def render(out,scale=4/3,seconds=LOOP,still=None):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":W,"height":H},device_scale_factor=scale)
        await pg.set_content('<html><body style="margin:0;overflow:hidden"></body></html>')
        if still is not None:
            await pg.evaluate("h=>document.body.innerHTML=h",html(still)); await pg.screenshot(path=out,type="png"); await b.close(); return
        ow,oh=int(W*scale),int(H*scale)
        ff=subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","image2pipe","-framerate",str(FPS),"-i","-","-c:v","libx264","-preset","veryfast","-crf","18","-pix_fmt","yuv420p","-g","60",out+".tmp.mp4"],stdin=subprocess.PIPE)
        for i in range(int(seconds*FPS)):
            await pg.evaluate("h=>document.body.innerHTML=h",html(i/FPS))
            ff.stdin.write(await pg.screenshot(type="jpeg",quality=95))
        ff.stdin.close(); ff.wait(); os.replace(out+".tmp.mp4",out)
        await b.close()
if __name__=="__main__":
    if sys.argv[1]=="still": asyncio.run(render(sys.argv[2],1,still=float(sys.argv[3])))
    else: asyncio.run(render(sys.argv[2]))
