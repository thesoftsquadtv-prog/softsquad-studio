# Study with Juno v2: a 5-minute natural routine for Juno and Toffee (loops seamlessly).
import sys,os,math,asyncio,subprocess,random
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
import scene as S
from adults import person_adult
W,H=1920,1080; LOOP=600.0; FPS=30
CUDDLE=False   # True only for the one cuddle segment in the hour
STROKE=(249,287)
K=480/260; JX,JY=760,440            # Juno sprite placement/scale
PIV=(1000,1000)                      # body tilt pivot
def sm(a): a=max(0,min(1,a)); return a*a*(3-2*a)          # smoothstep
def ss(a): a=max(0,min(1,a)); return a*a*a*(a*(6*a-15)+10) # smootherstep
def lerp(a,b,u): return a+(b-a)*u
def lp(p,q,u): return (lerp(p[0],q[0],u),lerp(p[1],q[1],u))
def track(t,keys):
    """keys: list of (time, value) with value tuple/number; smootherstep between keys, held outside."""
    if t<=keys[0][0]: return keys[0][1]
    for (t0,v0),(t1,v1) in zip(keys,keys[1:]):
        if t0<=t<=t1:
            u=ss((t-t0)/(t1-t0)) if t1>t0 else 1
            if isinstance(v0,tuple): return tuple(lerp(a,b,u) for a,b in zip(v0,v1))
            return lerp(v0,v1,u)
    return keys[-1][1]
def rot(p,ang,c=PIV):
    a=math.radians(ang); x,y=p[0]-c[0],p[1]-c[1]
    return (c[0]+x*math.cos(a)-y*math.sin(a), c[1]+x*math.sin(a)+y*math.cos(a))
def J(x,y): return (JX+x*K, JY+y*K)
def ik(Sh,T,L1=135,L2=135,side=1):
    dx,dy=T[0]-Sh[0],T[1]-Sh[1]; d=min(math.hypot(dx,dy),L1+L2-1); d=max(d,abs(L1-L2)+1)
    a=math.atan2(dy,dx); b=math.acos((L1*L1+d*d-L2*L2)/(2*L1*d))
    c1=(Sh[0]+L1*math.cos(a+b),Sh[1]+L1*math.sin(a+b)); c2=(Sh[0]+L1*math.cos(a-b),Sh[1]+L1*math.sin(a-b))
    E=c1 if (c1[1]>c2[1]) else c2   # elbows hang down
    if side*(E[0]-Sh[0])<-40: E=c2 if E is c1 else c1
    return E
SLEEVE="#f1e6d6"; SKIN="#e8b48f"
def arm(Sh,T,side):
    # Resting: elbows hang beside the body at desk height, forearm foreshortened toward the viewer.
    # Reaching: true 2-bone IK. Blend between them by reach distance so nothing pops.
    d=math.hypot(T[0]-Sh[0],T[1]-Sh[1])
    Eh=(Sh[0]+side*14, min(Sh[1]+124, 806))
    Ei=ik(Sh,T,L1=128,L2=128,side=side)
    w=sm((d-150)/60)
    E=lp(Eh,Ei,w)
    return (f'<path d="M{Sh[0]:.1f} {Sh[1]:.1f} L{E[0]:.1f} {E[1]:.1f} L{T[0]:.1f} {T[1]:.1f}" stroke="{SLEEVE}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="M{Sh[0]:.1f} {Sh[1]:.1f} L{E[0]:.1f} {E[1]:.1f}" stroke="#e6d8c2" stroke-width="2" opacity=".5"/>')
def hand(T): return f'<circle cx="{T[0]:.1f}" cy="{T[1]:.1f}" r="15.5" fill="{SKIN}"/>'
# ---------- props ----------
def mug(x,y,tilt=0): # bottom-centre at (x,y)
    return (f'<g transform="translate({x:.1f},{y:.1f}) rotate({tilt:.1f})"><rect x="-32" y="-74" width="64" height="74" rx="12" fill="#f4efe8"/>'
            f'<path d="M32 -60 q28 0 28 22 q0 22 -28 22" stroke="#f4efe8" stroke-width="10" fill="none"/><rect x="-26" y="-68" width="52" height="9" rx="4.5" fill="#8a5f47"/>'
            f'<path d="M-14 -36 q14 -12 28 0 q-14 14 -28 0z" fill="#ff9fb5" opacity=".8"/></g>')
def sippy(x,y,tilt=0):
    return (f'<g transform="translate({x:.1f},{y:.1f}) rotate({tilt:.1f})"><rect x="-24" y="-96" width="48" height="96" rx="14" fill="#c9b6f2" opacity=".95"/>'
            f'<rect x="-24" y="-60" width="48" height="60" rx="12" fill="#a8d8f0" opacity=".55"/><rect x="-27" y="-104" width="54" height="16" rx="8" fill="#9f8bd6"/>'
            f'<path d="M6 -104 l10 -40" stroke="#ff8fa3" stroke-width="7" stroke-linecap="round"/><circle cx="-6" cy="-40" r="6" fill="#fff" opacity=".5"/></g>')
def pen(x,y,ang=-35): return f'<g transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})"><rect x="-4" y="-48" width="8" height="52" rx="3" fill="#7a5fc0"/><path d="M-4 4 l4 9 l4 -9z" fill="#2a2438"/><rect x="-4" y="-48" width="8" height="10" rx="3" fill="#ffd166"/></g>'
def food_bowl(x): return f'<g transform="translate({x},812)"><path d="M-42 -26 h84 l-10 26 h-64z" fill="#f4a6b8"/><ellipse cx="0" cy="-26" rx="42" ry="8" fill="#e48aa0"/>' + ''.join(f'<circle cx="{-24+i*12}" cy="{-29-(i%2)*3}" r="6" fill="#b5703c"/>' for i in range(5)) + '</g>'
def water_bowl(x,ripple=0):
    r=f'<ellipse cx="0" cy="-26" rx="{12+ripple*22:.1f}" ry="{2+ripple*3:.1f}" fill="none" stroke="#fff" stroke-width="2" opacity="{0.8*(1-ripple):.2f}"/>' if ripple>0 else ''
    return f'<g transform="translate({x},812)"><path d="M-42 -26 h84 l-10 26 h-64z" fill="#8fc7e8"/><ellipse cx="0" cy="-26" rx="40" ry="8" fill="#cfeeff"/>{r}</g>'
def cat_bed_back(x,y): return f'<g transform="translate({x},{y})"><ellipse cx="0" cy="-14" rx="104" ry="34" fill="#e48aa0"/><ellipse cx="0" cy="-18" rx="86" ry="22" fill="#fff1f4"/></g>'
def cat_bed_front(x,y): return f'<g transform="translate({x},{y})"><path d="M-104 -14 q0 26 104 26 q104 0 104 -26 v6 q0 26 -104 26 q-104 0 -104 -26z" fill="#f4a6b8"/><path d="M-60 2 q60 16 120 0" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/></g>'
def zzz(x,y,t,on=1.0):
    s=''
    for j in range(3):
        p=((t/2.6)+j/3)%1
        s+=(f'<text x="{x+p*46+8*math.sin(p*6+j):.1f}" y="{y-p*110:.1f}" font-family="Poppins,sans-serif" font-weight="600" '
            f'font-size="{22+p*22:.0f}" fill="#e9e1ff" opacity="{on*math.sin(math.pi*p)*0.85:.2f}">z</text>')
    return s
def side_cat(phase=0.0,moving=True,tail_t=0.0,head=0.0,stretch=0.0):
    sw=lambda off:(22*math.sin(2*math.pi*phase+off) if moving else 0)
    bob=(3*abs(math.sin(2*math.pi*phase)) if moving else 0)
    def leg(x,ang,col): return f'<g transform="translate({x},-38) rotate({ang:.1f})"><rect x="-7" y="0" width="14" height="40" rx="7" fill="{col}"/><ellipse cx="2" cy="38" rx="10" ry="6" fill="{col}"/></g>'
    far,near="#d9944f","#eeb06c"; tail=12*math.sin(2*math.pi*tail_t*0.4)
    g=f'<g transform="translate(0,{-bob:.1f}) scale({1+stretch*0.12:.3f},{1-stretch*0.08:.3f})">'
    g+=leg(-36,sw(math.pi),far)+leg(40,sw(0),far)
    g+=f'<path d="M-56 -58 q-34 -6 -40 -48 q-4 -22 12 -26" stroke="{near}" stroke-width="15" fill="none" stroke-linecap="round" transform="rotate({tail:.1f} -56 -58)"/>'
    g+=f'<ellipse cx="0" cy="-58" rx="64" ry="28" fill="{near}"/>'
    g+='<path d="M-30 -82 q6 10 0 20 M-12 -85 q6 10 0 20 M6 -85 q6 10 0 20" stroke="#d2894a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>'
    g+=leg(-28,sw(0),near)+leg(48,sw(math.pi),near)
    hd=f'<circle cx="66" cy="-86" r="30" fill="{near}"/><path d="M48 -108 l4 -30 l20 20z" fill="{near}"/><path d="M70 -112 l14 -26 l10 28z" fill="{near}"/>'
    hd+='<path d="M53 -112 l3 -16 l10 10z" fill="#f6c7a6"/><path d="M75 -114 l8 -14 l6 16z" fill="#f6c7a6"/>'
    hd+=('<path d="M75 -90 q5 4 10 0" stroke="#2a2438" stroke-width="3" fill="none" stroke-linecap="round"/>' if head>20 else '<ellipse cx="80" cy="-90" rx="4.5" ry="6" fill="#2a2438"/><circle cx="81.5" cy="-92" r="1.6" fill="#fff"/>')
    hd+='<ellipse cx="95" cy="-80" rx="4" ry="3" fill="#d9707a"/><path d="M95 -77 q-3 6 -8 4" stroke="#5a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="74" cy="-76" rx="7" ry="3.5" fill="#ff8fa3" opacity=".35"/><path d="M90 -78 l18 -4 M90 -75 l18 2" stroke="#fff" stroke-width="1.6" opacity=".7"/>'
    g+=f'<g transform="rotate({head:.1f} 46 -70)">{hd}</g>'
    return g+'</g>'
# ---------- layout ----------
BEDX,BEDY=430,712; FOOD,WATER=470,560; HOPX=300; NEAR=1185
MUGP=(1300,812); CUPP=(800,812); PENP=(1100,796)
RREST=(1048,794); LREST=(952,794)
DESK2=('<rect x="0" y="830" width="1920" height="250" fill="#6b4a3a"/><rect x="0" y="812" width="1920" height="34" rx="6" fill="#8a5f47"/>'
 '<g transform="translate(1580,812)"><rect x="-70" y="-14" width="140" height="14" rx="6" fill="#3b3150"/><rect x="-6" y="-250" width="12" height="240" fill="#3b3150"/><path d="M-6 -250 l-90 -40" stroke="#3b3150" stroke-width="12" stroke-linecap="round"/><path d="M-170 -250 q60 -90 140 -20z" fill="#ffb56b"/><ellipse cx="-100" cy="-262" rx="70" ry="14" fill="#ffe2a8"/></g>'
 '<g transform="translate(690,812)"><rect x="-70" y="-34" width="150" height="34" rx="6" fill="#7a5fc0"/><rect x="-60" y="-64" width="140" height="30" rx="6" fill="#e48aa0"/><rect x="-50" y="-90" width="120" height="26" rx="6" fill="#f0c27a"/></g>')
def book(t,lines):
    s='<g transform="translate(1000,812)"><path d="M-170 -10 l170 -40 l170 40z" fill="#fff6e8"/><path d="M0 -50 v40" stroke="#e0d2bc" stroke-width="3"/>'
    s+='<g stroke="#cdbfa8" stroke-width="3">'+''.join(f'<path d="M{-140+i*6} {-14-i*7} l110 -24"/>' for i in range(4))+'</g>'
    for i,frac in enumerate(lines):   # handwritten notes on the right page
        if frac>0: s+=f'<path d="M{30+i*0} {-38+i*8} l{110*frac:.1f} {24*frac:.1f}" stroke="#7a5fc0" stroke-width="3" stroke-linecap="round" opacity=".8"/>'
    return s+'</g>'
def page_turn(u):
    if u<=0 or u>=1: return ''
    sx=math.cos(math.pi*u); lift=-26*math.sin(math.pi*u)
    return f'<g transform="translate(1000,{812+lift:.1f}) scale({sx:.3f},1)"><path d="M0 -50 l170 40 l-170 0z" fill="#fffaf0" stroke="#e6d8c2" stroke-width="2"/></g>'
# ---------- Juno timeline ----------
def juno_state(T):
    t=T%300
    # right hand target, left hand target, tilt, eyes, mug pos/tilt, cup pos/tilt, pen state
    R=[(0,RREST),(25,RREST),(27.5,(1268,742)),(28.2,(1268,742)),(30.5,(1018,600)),(34.5,(1018,600)),(36.8,(1268,742)),(37.5,(1268,742)),(40,RREST),
       (60,RREST),(62,PENP),(62.6,PENP),(63.6,(1040,786)),(84,(1120,800)),(85,PENP),(85.6,PENP),(87.5,RREST),
   (300,RREST)]
    L=[(0,LREST),(150,LREST),(152.5,(826,720)),(153.2,(826,720)),(155.6,(994,676)),(160,(994,676)),(162.2,(826,720)),(162.9,(826,720)),(165,LREST),
       (268,LREST),(269.5,(1140,790)),(270.3,(1140,790)),(271.5,(880,790)),(273,LREST),(300,LREST)]
    rh=track(t,R); lh=track(t,L)
    # stroking Toffee: gentle back-and-forth along his back
    a0,a1=STROKE
    if CUDDLE and a0-2.5<T<a1+2.5:
        u=min(1,(T-(a0-2.5))/2.5,((a1+2.5)-T)/2.5); u=ss(u)
        base=lp(RREST,(1150,742),u)
        k=min(1,max(0,(T-a0)/1.2),max(0,(a1-T)/1.2)); ph=2*math.pi*(T-a0)/2.8
        rh=(base[0]-50*k*(0.5-0.5*math.cos(ph))+20*k, base[1]+8*k*math.sin(ph)+14*k)
    # writing: small natural loops while moving along the line
    if 63.6<t<84:
        u=(t-63.6)/20.4; line=int(u*4); fr=(u*4)%1
        rh=(1030+110*fr+4*math.sin(t*9), 778+line*8+24*fr+3*math.cos(t*11))
    tilt=1.4*math.sin(2*math.pi*t/4.8)
    doze=track(t,[(0,0),(205,0),(214,7.5),(231.5,8.5),(231.9,-1.2),(233,0),(300,0)])
    sip=track(t,[(0,0),(31,0),(32,-2.5),(34,-2.5),(35,0),(155.8,0),(156.6,-2),(159.5,-2),(160.2,0),(300,0)])
    tilt=tilt*(1 if doze<1 else 0.2)+doze+sip
    # eyes
    eyes="read"
    if 31<t<34.5 or 156<t<159.6: eyes="calm"
    if 200<t<231.6: eyes="calm" if t<206 else "sleep"
    if 231.6<=t<233.2: eyes="happy"
    blink=(t%5.3)<0.16 and eyes=="read"
    if blink: eyes="calm"
    if 63<t<85 or 268<t<273: eyes="read"
    mugp=MUGP; mugt=0; mug_held=27.8<t<37.6
    if mug_held: mugp=(rh[0]+28,rh[1]+44); mugt=-28 if 30.6<t<34.6 else 0
    cupp=CUPP; cupt=0; cup_held=152.8<t<162.6
    if cup_held: cupp=(lh[0]-24,lh[1]+58); cupt=8 if 155.8<t<160.2 else 0
    pen_held=62.4<t<85.4
    lines=[max(0,min(1,(t-63.6)/20.4*4-i)) for i in range(4)] if t<269.8 else [0,0,0,0]
    if 84<=t<269.8: lines=[1,1,1,1]
    if t<63.6: lines=[0,0,0,0]
    return dict(rh=rh,lh=lh,tilt=tilt,eyes=eyes,mugp=mugp,mugt=mugt,mug_held=mug_held,cupp=cupp,cupt=cupt,cup_held=cup_held,pen_held=pen_held,lines=lines,
                page=(t-269.6)/1.6 if 269.6<t<271.2 else 0, jz=(1 if 214<t<231 else 0))
# ---------- Toffee timeline ----------
def side_yawn(x,y,flip,u,stretch):
    """standing in bed, stretching and yawning (u 0..1)"""
    f='scale(-1,1)' if flip else ''
    yawn=math.sin(math.pi*min(1,max(0,(u-0.35)/0.5)))
    g=side_cat(0,False,0,head=-18*yawn,stretch=stretch)
    if yawn>0.05: g+=f'<g transform="rotate({-18*yawn:.1f} 46 -70)"><ellipse cx="90" cy="-74" rx="{5+5*yawn:.1f}" ry="{2+8*yawn:.1f}" fill="#b5566a"/></g>'
    return f'<g transform="translate({x:.1f},{y:.1f}) {f}">{g}</g>'
def toffee(t,breathe):
    curled=lambda x,y,sc=0.8: f'<g transform="translate({x:.1f},{y:.1f}) scale({sc},{sc*breathe:.4f})">{S.sleeping_cat()}</g>'
    def walk(x,y,flip=False,moving=True,head=0,stretch=0):
        f='scale(-1,1)' if flip else ''
        return f'<g transform="translate({x:.1f},{y:.1f}) {f}">{side_cat(t*1.5,moving,t,head,stretch)}</g>'
    bed_y=BEDY-6; EAT,DRINK=FOOD-80,WATER-80
    out=''; on_sill=True
    if t<200 or (not CUDDLE and t>=241) or (CUDDLE and t>=310): out=curled(BEDX,bed_y-26)
    elif t<205: u=(t-200)/5; out=side_yawn(BEDX,bed_y,True,u,0.8*math.sin(math.pi*min(1,u*1.6)))
    elif t<206.3:
        u=sm((t-205)/1.3); out=walk(lerp(BEDX,HOPX,u),lerp(bed_y,812,u)-70*math.sin(math.pi*u),flip=True,moving=False,stretch=0.3*math.sin(math.pi*u)); on_sill=False
    elif t<207.2: out=walk(HOPX,812,flip=(t<206.7),moving=False); on_sill=False
    elif t<209.5: u=sm((t-207.2)/2.3); out=walk(lerp(HOPX,EAT,u),812); on_sill=False
    elif t<223: out=walk(EAT,812,moving=False,head=32+5*math.sin(t*6)); on_sill=False
    elif t<225: u=sm((t-223)/2); out=walk(lerp(EAT,DRINK,u),812); on_sill=False
    elif t<234: out=walk(DRINK,812,moving=False,head=38+2.5*math.sin(t*25)); on_sill=False
    elif not CUDDLE:
        on_sill=False
        if t<235: out=walk(DRINK,812,flip=(t>234.5),moving=False)
        elif t<238: u=sm((t-235)/3); out=walk(lerp(DRINK,HOPX,u),812,flip=True)
        elif t<238.6: out=walk(HOPX,812,flip=False,moving=False)
        elif t<239.9: u=sm((t-238.6)/1.3); out=walk(lerp(HOPX,BEDX,u),lerp(812,bed_y,u)-80*math.sin(math.pi*u),moving=False,stretch=0.3*math.sin(math.pi*u))
        else: out=walk(BEDX,bed_y,flip=(t>240.4),moving=False,head=10*sm((t-239.9)/1.1)); on_sill=True
    else:
        on_sill=False
        if t<244: u=sm((t-234)/10); out=walk(lerp(DRINK,NEAR,u),812)
        elif t<247: out=walk(NEAR,812,moving=False,head=-6)
        elif t<290: out=curled(NEAR,775,0.85)
        elif t<292: out=walk(NEAR,812,flip=True,moving=False,stretch=0.5*math.sin(math.pi*(t-290)/2))
        elif t<303: u=sm((t-292)/11); out=walk(lerp(NEAR,HOPX,u),812,flip=True)
        elif t<303.6: out=walk(HOPX,812,moving=False)
        elif t<304.9: u=sm((t-303.6)/1.3); out=walk(lerp(HOPX,BEDX,u),lerp(812,bed_y,u)-80*math.sin(math.pi*u),moving=False,stretch=0.3*math.sin(math.pi*u))
        else: out=walk(BEDX,bed_y,flip=(t>305.4),moving=False,head=10*sm((t-304.9)/1.1)); on_sill=True
    water_r=((t*2.2)%1) if 225<t<234 else 0
    purr=''
    if CUDDLE and 249<t<287:
        k=min(1,(t-249)/1.2,(287-t)/1.2)
        for j in range(3):
            p=((t-249)/3+j/3)%1
            purr+=f'<text x="{NEAR+60+p*40:.1f}" y="{720-p*70:.1f}" font-family="Poppins,sans-serif" font-size="{26+p*8:.0f}" fill="#ffd1dc" opacity="{(1-p)*0.8*k:.2f}">{"♡" if j==1 else "~"}</text>'
    asleep_end=241 if not CUDDLE else 310
    zon=0
    if t<198: zon=1
    elif t<200: zon=(200-t)/2
    elif t>asleep_end+3: zon=min(1,(t-asleep_end-3)/3)
    zs=zzz(BEDX+40,bed_y-70,t,zon) if zon>0 else ''
    return out,purr,zs,water_r,on_sill
def html(t):
    st=S.html(t%20)   # reuse rain/lights/curtains timing from v1 page builder is 60s-based; rebuild here instead
    return None
def frame(t):
    import scene
    # background pieces from scene.html internals: rebuild minimal by calling scene.html and stripping its foreground is messy; recompute here
    r=random.Random(11); rain=''
    for i in range(70):
        x0=r.uniform(150,830); sp=r.choice([1,2,3])*15
        ph=r.random(); y=130+((ph+sp*t/LOOP)%1)*640-70
        rain+=f'<path d="M{x0:.1f} {y:.1f} l-8 34" stroke="#b9c3ff" stroke-width="2" opacity=".45" stroke-linecap="round"/>'
    r=random.Random(5); lights=''
    for i in range(16):
        x=60+i*120; y=40+18*math.sin(i*0.9)
        tw=.55+.45*(0.5+0.5*math.sin(2*math.pi*(t/LOOP*10+r.random())))
        lights+=f'<path d="M{x-60} {40+18*math.sin((i-.5)*0.9):.1f} Q{x} {y+26:.1f} {x+60} {40+18*math.sin((i+.5)*0.9):.1f}" stroke="#2a2440" stroke-width="2" fill="none"/>'
        lights+=f'<circle cx="{x}" cy="{y+16:.1f}" r="9" fill="{["#ffd98a","#ffb3c7","#c9e4ff"][i%3]}" opacity="{tw:.2f}"/><circle cx="{x}" cy="{y+16:.1f}" r="22" fill="#ffd98a" opacity="{tw*0.12:.2f}"/>'
    sw1=3.2*math.sin(2*math.pi*t/LOOP*30); sw2=3.2*math.sin(2*math.pi*t/LOOP*30+1.3)
    def curtain(x0,w,sk):
        return (f'<g transform="translate({x0},120) skewX({sk:.2f})">'
                f'<path d="M0 0 h{w} v590 q-{w/8:.1f} 16 -{w/4:.1f} 0 q-{w/8:.1f} -16 -{w/4:.1f} 0 q-{w/8:.1f} 16 -{w/4:.1f} 0 q-{w/8:.1f} -16 -{w/4:.1f} 0z" fill="#f4eeff" opacity=".22"/>'
                + "".join(f'<path d="M{w*(i+0.5)/5:.1f} 0 v586" stroke="#ffffff" stroke-width="3" opacity=".12"/>' for i in range(5)) + '</g>')
    curtains=curtain(132,210,sw1)+curtain(640,210,sw2)+'<rect x="110" y="104" width="760" height="14" rx="7" fill="#6b5a8c"/>'
    body=S.STATIC.replace('<g id="rain"></g>',rain).replace('<g id="lights"></g>',lights)
    js=juno_state(t)
    breathe=1+0.025*math.sin(2*math.pi*t/4.0)
    jb=1+0.006*math.sin(2*math.pi*t/4.4)
    tilt=js["tilt"]
    chair='<rect x="850" y="600" width="300" height="260" rx="40" fill="#5b4e83"/>'
    juno=chair+(f'<g transform="translate({PIV[0]},{PIV[1]}) rotate({tilt:.2f}) scale(1,{jb:.4f}) translate({-PIV[0]},{-PIV[1]})">'
                f'<svg x="{JX}" y="{JY}" width="480" height="572" viewBox="0 0 260 310">{person_adult("Juno",js["eyes"],no_arms=True)}</svg></g>')
    shR=rot(J(164,122),tilt); shL=rot(J(96,122),tilt)
    cat,purr,zs,wr,on_sill=toffee(t,breathe)
    steam=''
    if not js["mug_held"]:
        for k in range(3):
            p=((t/1.7)+k/3)%1
            steam+=f'<path d="M{MUGP[0]-10+k*10} {MUGP[1]-92-p*90:.1f} q-14 -20 0 -40 q14 -20 0 -40" stroke="#ffffff" stroke-width="5" fill="none" opacity="{(1-p)*0.35:.2f}" stroke-linecap="round"/>'
    props=''
    if not js["mug_held"]: props+=mug(*MUGP)
    if not js["cup_held"]: props+=sippy(*CUPP)
    if not js["pen_held"]: props+=pen(*PENP)
    held=''
    if js["mug_held"]: held+=mug(*js["mugp"],js["mugt"])
    if js["cup_held"]: held+=sippy(*js["cupp"],js["cupt"])
    if js["pen_held"]: held+=pen(js["rh"][0]+6,js["rh"][1]+4,-30)
    jz=zzz(1040,520,t,1.0) if js["jz"] else ''
    bed=cat_bed_back(BEDX,BEDY)
    fg=(DESK2+book(t,js["lines"])+page_turn(js["page"])+food_bowl(FOOD)+water_bowl(WATER,wr)+props+steam)
    arms=arm(shL,js["lh"],-1)+arm(shR,js["rh"],1)
    sill_layer=bed+(cat if on_sill else '')+cat_bed_front(BEDX,BEDY)
    desk_cat='' if on_sill else cat
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'+body+curtains+sill_layer+juno+fg+desk_cat+arms+held+hand(js["lh"])+hand(js["rh"])+purr+zs+jz+
         '<text x="60" y="1040" font-family="Poppins,sans-serif" font-size="30" fill="#f6efe6" opacity=".6">the soft squad · study with juno</text></svg>')
    return svg
async def render(out,scale=4/3,t0=0,t1=LOOP,stills=None):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":W,"height":H},device_scale_factor=scale)
        await pg.set_content('<html><body style="margin:0;overflow:hidden"></body></html>')
        if stills:
            for t in stills:
                await pg.evaluate("h=>document.body.innerHTML=h",frame(t)); await pg.screenshot(path=f"{out}_{t}.png")
            await b.close(); return
        ff=subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","image2pipe","-framerate",str(FPS),"-i","-","-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p","-g","60",out+".tmp.mp4"],stdin=subprocess.PIPE)
        for i in range(int(t0*FPS),int(t1*FPS)):
            await pg.evaluate("h=>document.body.innerHTML=h",frame(i/FPS))
            ff.stdin.write(await pg.screenshot(type="jpeg",quality=94))
        ff.stdin.close(); ff.wait(); os.replace(out+".tmp.mp4",out); await b.close()
if __name__=="__main__":
    if "cuddle" in sys.argv: CUDDLE=True
    if sys.argv[1]=="stills": asyncio.run(render(sys.argv[2],1,stills=[float(x) for x in sys.argv[3].split(",")]))
    else:
        asyncio.run(render(sys.argv[2],t0=float(sys.argv[3]),t1=float(sys.argv[4])))
