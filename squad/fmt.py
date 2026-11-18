# Reusable beat templates for Soft Squad episodes
import sys,os,asyncio; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from kit import *; import engine
COL={"Milo":("#4a8a55","#e6f2e7"),"Kemi":("#c97a1e","#fff1df"),"Juno":("#7a5fc0","#efeafb"),
     "Amara":("#c2577a","#fde9ee"),"Toffee":("#b06a2c","#f8e8d8")}
SQ=[("Milo",30,1140,250),("Kemi",250,1170,230),("Juno",450,1140,250),("Amara",670,1160,240),("Toffee",880,1330,170)]
phone=lambda sender,text,small="now": f'<div class="phone"><div class="msg"><small>{sender} · {small}</small>{text}</div></div>'
card=lambda html,size=44: f'<div class="msg" style="font-size:{size}px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.1)">{html}</div>'
cloud=lambda items: '<div class="cloud">'+"".join(f"<div>{i}</div>" for i in items)+'</div>'

def squad(mood="spark",t0=1.2):
    return [C(n,x,y,w,[[0,mood]] if isinstance(mood,str) else mood,t0=t0+0.08*i) for i,(n,x,y,w) in enumerate(SQ)]

def hook(title,prop=None,mood="spark",dur=3.0,bg="#fff3e6",size=104,prop_x=280,prop_w=520):
    # Visible from frame 0 with a punch-in, so the first frame stops the scroll
    punch=lambda x,y:[[0,{"x":x,"y":y,"s":1.18,"o":1}],[0.35,{"x":x,"y":y,"s":1,"o":1},"back"]]
    els=[T(title,90,150,900,size,kf=punch(90,150))]
    if prop: els.append(H(prop,prop_x,560,prop_w,kf=[[0,{"x":prop_x,"y":560,"s":0.9,"o":1}],[0.3,{"x":prop_x,"y":560,"s":1.06,"o":1},"back"],[0.5,{"x":prop_x,"y":560,"s":1,"r":-3}],[0.62,{"x":prop_x,"y":560,"r":3}],[0.74,{"x":prop_x,"y":560,"r":0}]]))
    els+=[C(n,x,y,w,[[0,mood]],kf=[[0,{"x":x,"y":y,"s":1,"o":1}]]) for (n,x,y,w) in SQ]
    return {"dur":dur,"bg":bg,"els":els,"sfx":[(0.0,"buzz" if prop else "pop"),(0.5,"pop")]}

def who(name,line,sub=None,prop=None,moods=None,dur=4.0,size=80,sub_t=1.6,prop_w=520,prop_x=None,prop_y=400):
    c,bg=COL[name]
    els=[H(label(name,c),90,150,400),T(line,90,260,900,size,t0=0.25)]
    if prop: els.append(H(prop,prop_x if prop_x is not None else (1080-prop_w)//2,prop_y,prop_w,t0=0.9))
    if sub: els.append(T(sub,90,640 if not prop else 730,900,60,t0=sub_t,cls="sub",extra="color:#8a8399"))
    w,x,y=(500,290,900) if name=="Toffee" else (640,220,880)
    els.append(C(name,x,y,w,moods or [[0,"happy"]],t0=0.0))
    sfx=[(0.3,"pop")]+([(0.9,"pop")] if prop else [])+([(sub_t,"ding")] if sub else [])
    return {"dur":dur,"bg":bg,"els":els,"sfx":sfx}

def quote(name,text,small=None,dur=4.6,mood="happy"):
    c,bg=COL[name]
    els=[H(label(name,c),90,150,400),T(text,90,300,900,84,t0=0.3)]
    if small: els.append(T(small,90,690,900,52,t0=1.4,cls="sub",extra="color:#8a8399"))
    w,x,y=(500,290,900) if name=="Toffee" else (640,220,880)
    els.append(C(name,x,y,w,[[0,mood]],t0=0.0))
    return {"dur":dur,"bg":bg,"els":els,"sfx":[(0.3,"pop")]+([(1.4,"ding")] if small else [])}

def group(title,prop=None,mood="happy",dur=4.0,bg="#fff3e6",prop_w=620,size=80):
    els=[T(title,90,170,900,size)]
    if prop: els.append(H(prop,(1080-prop_w)//2,440,prop_w,t0=0.5))
    els+=squad(mood,t0=1.3)
    return {"dur":dur,"bg":bg,"els":els,"sfx":[(0.5,"ding"),(1.3,"pop")]}

def endcard(q="Which one<br>are you?",cta="Tag your friends 👇",numbers=True,dur=4.5):
    row=[("Milo",40),("Kemi",250),("Juno",450),("Amara",660)]
    els=[T(q,90,150,900,120),T(cta,90,500,900,58,t0=0.4,cls="sub")]
    for i,(n,x) in enumerate(row):
        els.append(C(n,x,880,250,[[0,"spark"]],t0=0.3+0.12*i))
        if numbers: els.append(T(str(i+1),x,1220,250,90,t0=0.4+0.12*i))
    els.append(C("Toffee",850,1000,190,[[0,"spark"]],t0=0.8))
    if numbers: els.append(T("5",850,1220,190,90,t0=0.9))
    els.append(T("Follow for a new episode<br>every day 💗",90,1440,900,56,t0=1.2,cls="sub",extra="font-weight:600;color:#c2577a"))
    return {"dur":dur,"bg":"#fff3e6","els":els,"sfx":[(0.3,"pop")]}

def build(beats):
    sfx=[];acc=0
    for b in beats:
        for t,k in b.pop("sfx",[]): sfx.append((acc+t,k))
        acc+=b["dur"]
    return {"beats":beats,"sfx":sfx}

def main(ep,slug):
    out=os.path.join(os.path.dirname(os.path.abspath(__file__)),"out")
    if len(sys.argv)>1 and sys.argv[1]=="stills":
        ts=[float(x) for x in sys.argv[2].split(",")]
        asyncio.run(engine.stills(ep,ts,out+"/"+slug.split('-')[0]))
    else:
        asyncio.run(engine.render(ep,out+"/"+slug+".mp4"))
