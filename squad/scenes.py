# Soft, flat scene backgrounds (1080x1920) + foreground overlays for The Soft Squad
# Layout rule: keep y 120-720 calm (captions live there); characters stand ~y 880-1640; floor from ~1540.
import random
SW,SH=1080,1920
def svg(body,bg):
    return f'<svg viewBox="0 0 {SW} {SH}" width="{SW}" height="{SH}" xmlns="http://www.w3.org/2000/svg"><rect width="{SW}" height="{SH}" fill="{bg}"/>{body}</svg>'
def fg(body,x=0,y=0,w=SW,h=SH):
    # foreground overlay as a full-canvas transparent SVG (placed with H(...,0,0,1080))
    return f'<svg viewBox="0 0 {SW} {SH}" width="{SW}" height="{SH}" style="display:block;pointer-events:none" xmlns="http://www.w3.org/2000/svg">{body}</svg>'
SHADOW='rgba(60,40,80,.10)'

def window(x,y,w,h,night=False):
    sky="#2c3566" if night else "#bfe3f7"
    s=f'<rect x="{x-14}" y="{y-14}" width="{w+28}" height="{h+28}" rx="26" fill="#ffffff"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{sky}"/>'
    if night:
        s+=f'<circle cx="{x+w*0.7}" cy="{y+h*0.3}" r="{w*0.13}" fill="#fff4c2"/><circle cx="{x+w*0.76}" cy="{y+h*0.26}" r="{w*0.12}" fill="{sky}"/>'
        rnd=random.Random(3)
        for _ in range(9): s+=f'<circle cx="{x+rnd.random()*w*0.9+10}" cy="{y+rnd.random()*h*0.8+10}" r="{rnd.choice([3,4,5])}" fill="#fff4c2" opacity=".85"/>'
    else:
        s+=f'<circle cx="{x+w*0.72}" cy="{y+h*0.3}" r="{w*0.14}" fill="#ffd166"/><ellipse cx="{x+w*0.3}" cy="{y+h*0.62}" rx="{w*0.2}" ry="{h*0.07}" fill="#ffffff" opacity=".9"/>'
    s+=f'<rect x="{x+w/2-5}" y="{y}" width="10" height="{h}" fill="#ffffff"/><rect x="{x}" y="{y+h/2-5}" width="{w}" height="10" fill="#ffffff"/>'
    return s
def floor(y,color,line=None):
    s=f'<rect x="0" y="{y}" width="{SW}" height="{SH-y}" fill="{color}"/>'
    if line: s+=f'<rect x="0" y="{y}" width="{SW}" height="12" fill="{line}"/>'
    return s
def plant(x,y,s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})"><path d="M0 0 q-60 -60 -20 -130 q20 60 20 130z" fill="#7cc48f"/><path d="M0 0 q60 -70 30 -150 q-30 70 -30 150z" fill="#5fae76"/>'
            f'<path d="M0 0 q-10 -90 10 -170 q10 90 -10 170z" fill="#8fd1a0"/><path d="M-50 0 h100 l-14 90 h-72z" fill="#e9a07a"/></g>')
def clock(x,y,t):
    return (f'<g transform="translate({x},{y})"><rect x="-80" y="-50" width="160" height="100" rx="24" fill="#2a2438"/><text x="0" y="22" text-anchor="middle" '
            f'font-family="Poppins,sans-serif" font-weight="700" font-size="58" fill="#ff7a8a">{t}</text></g>')

# ---------- scenes ----------
def bedroom(night=False,t="7:00"):
    b=floor(1520,"#d9c2a6","#c7ab8c")
    b+=window(660,330,300,340,night)
    b+='<rect x="110" y="360" width="190" height="240" rx="14" fill="#fff"/><rect x="128" y="378" width="154" height="204" rx="8" fill="#f4a6b8"/><circle cx="205" cy="460" r="46" fill="#ffd166"/>'
    b+='<ellipse cx="540" cy="1760" rx="420" ry="90" fill="#f0d3df"/>'
    # bed (behind characters): headboard + mattress at left
    b+='<rect x="-40" y="1060" width="560" height="380" rx="40" fill="#9c7bd1"/><rect x="-40" y="1300" width="620" height="260" rx="34" fill="#ffffff"/>'
    b+='<rect x="30" y="1230" width="230" height="110" rx="50" fill="#fdf6ff"/>'
    # nightstand + clock
    b+='<rect x="800" y="1330" width="200" height="220" rx="18" fill="#c99a6e"/><rect x="820" y="1420" width="160" height="10" fill="#b0855c"/>'
    b+=clock(900,1270,t)
    bg="#2f3157" if False else ("#e6dcf5" if night else "#f6ecfb")
    return svg(b,bg)
def blanket(color="#b79be6"):
    # foreground blanket that tucks a character into the bed (left side)
    return fg(f'<path d="M-40 1330 q300 -60 620 0 v300 h-620z" fill="{color}"/><path d="M-40 1330 q300 -60 620 0" stroke="#fff" stroke-width="14" fill="none" opacity=".7"/>')

def bathroom():
    b='<g opacity=".55">'+''.join(f'<rect x="{x}" y="{y}" width="116" height="116" rx="10" fill="#d4eef0"/>' for x in range(4,SW,120) for y in range(740,1520,120))+'</g>'
    b+='<ellipse cx="540" cy="860" rx="230" ry="280" fill="#ffffff"/><ellipse cx="540" cy="860" rx="205" ry="255" fill="#e3f4fa"/><path d="M420 700 l60 -60 M450 760 l90 -90" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".8"/>'
    b+=floor(1540,"#cfe3e6","#b7d2d6")
    return svg(b,"#eaf7f8")
def sink():
    return fg('<rect x="140" y="1380" width="800" height="70" rx="20" fill="#ffffff"/><rect x="180" y="1450" width="720" height="400" rx="20" fill="#f3f7f8"/>'
              '<rect x="520" y="1320" width="40" height="70" rx="12" fill="#b9c7cc"/><rect x="520" y="1320" width="110" height="26" rx="12" fill="#b9c7cc"/>'
              '<rect x="760" y="1290" width="44" height="92" rx="12" fill="#9fd7c3"/><rect x="200" y="1300" width="70" height="80" rx="14" fill="#ffd166"/>')

def kitchen():
    b=window(390,360,300,280)
    b+='<rect x="0" y="300" width="230" height="300" rx="12" fill="#f3c98b"/><rect x="850" y="300" width="230" height="300" rx="12" fill="#f3c98b"/>'
    b+='<circle cx="200" cy="450" r="9" fill="#c98a4b"/><circle cx="880" cy="450" r="9" fill="#c98a4b"/>'
    b+='<rect x="0" y="1180" width="1080" height="360" fill="#f6d9a8"/><rect x="0" y="1160" width="1080" height="40" fill="#e8b86f"/>'
    b+='<rect x="80" y="1040" width="90" height="120" rx="16" fill="#e48aa0"/><rect x="900" y="1060" width="110" height="100" rx="50" fill="#9fd7c3"/>'
    b+=floor(1540,"#e9cfa4","#d8b987")
    return svg(b,"#fff2df")
def table(items="cereal"):
    s='<rect x="120" y="1440" width="840" height="60" rx="24" fill="#c98a4b"/><rect x="200" y="1500" width="40" height="420" fill="#b0743a"/><rect x="840" y="1500" width="40" height="420" fill="#b0743a"/>'
    if items=="cereal": s+='<path d="M330 1390 h200 q0 60 -100 60 q-100 0 -100 -60z" fill="#ffffff"/><ellipse cx="430" cy="1390" rx="100" ry="18" fill="#ffd9a0"/><rect x="640" y="1350" width="80" height="90" rx="14" fill="#7a5fc0"/><path d="M720 1370 q40 0 40 30 q0 30 -40 30" stroke="#7a5fc0" stroke-width="12" fill="none"/>'
    return fg(s)

def desk(night=False):
    b=window(640,320,320,320,night)
    b+='<rect x="90" y="420" width="300" height="20" rx="8" fill="#c99a6e"/>'+''.join(f'<rect x="{110+i*44}" y="{330+(i%2)*14}" width="34" height="{90-(i%2)*14}" rx="6" fill="{c}"/>' for i,c in enumerate(["#e48aa0","#7a5fc0","#ffd166","#5fae76","#4a8ac0"]))
    b+=plant(320,420,0.7)
    b+='<rect x="140" y="560" width="140" height="160" rx="10" fill="#fff"/>'+''.join(f'<rect x="160" y="{585+i*30}" width="{100-i*12}" height="12" rx="6" fill="#ffd166"/>' for i in range(4))
    b+=floor(1540,"#d9c2a6","#c7ab8c")
    return svg(b,"#efe9fb" if not night else "#ddd6f0")
def desk_front(laptop=True,papers=0):
    s='<rect x="60" y="1400" width="960" height="56" rx="20" fill="#c99a6e"/><rect x="120" y="1456" width="44" height="470" fill="#b0855c"/><rect x="916" y="1456" width="44" height="470" fill="#b0855c"/>'
    if laptop: s+='<path d="M360 1240 h360 l20 160 h-400z" fill="#c9cdd8"/><path d="M330 1400 h420 v18 h-420z" fill="#a9aebb"/><circle cx="540" cy="1320" r="16" fill="#e9ebf0"/>'
    for i in range(papers): s+=f'<rect x="{150+i*16}" y="{1370-i*8}" width="150" height="40" rx="6" fill="#fff" transform="rotate({-6+i*4} {225+i*16} {1390-i*8})"/>'
    s+='<rect x="820" y="1330" width="80" height="80" rx="14" fill="#fff"/><path d="M900 1350 q36 0 36 26 q0 26 -36 26" stroke="#fff" stroke-width="12" fill="none"/>'
    return fg(s)

def street(evening=False):
    sky="#ffd9c2" if evening else "#cde9f7"
    b=f'<rect width="{SW}" height="1300" fill="{sky}"/>'
    rnd=random.Random(7); x=-20
    cols=["#b8a6dc","#9fb7d9","#e8b5c4","#a9cbb7","#c9b3e6","#f0c88f"]
    while x<SW:
        w=rnd.randint(150,240); h=rnd.randint(380,700); c=rnd.choice(cols)
        b+=f'<rect x="{x}" y="{1300-h}" width="{w}" height="{h}" rx="10" fill="{c}"/>'
        for wy in range(1300-h+40,1260,90):
            for wx in range(x+24,x+w-40,60):
                lit=evening and rnd.random()<.5
                b+=f'<rect x="{wx}" y="{wy}" width="34" height="46" rx="6" fill="{"#fff1b8" if lit else "#ffffff"}" opacity="{.95 if lit else .55}"/>'
        x+=w+rnd.randint(8,22)
    b+='<rect x="0" y="1290" width="1080" height="260" fill="#e7e1ea"/><rect x="0" y="1290" width="1080" height="14" fill="#d3cbd9"/>'
    b+='<rect x="930" y="900" width="18" height="400" fill="#4b4560"/><rect x="890" y="880" width="100" height="34" rx="14" fill="#4b4560"/><ellipse cx="940" cy="922" rx="34" ry="10" fill="#fff1b8"/>'
    b+='<rect x="0" y="1550" width="1080" height="370" fill="#8c86a0"/>'+''.join(f'<rect x="{x}" y="1720" width="110" height="18" rx="9" fill="#f5f1fa"/>' for x in range(30,SW,200))
    b+='<rect x="0" y="1540" width="1080" height="20" fill="#bdb5c8"/>'
    b+=plant(80,1290,0.8)
    return svg(b,sky)

def cafe():
    b='<rect x="0" y="0" width="1080" height="1540" fill="#f6e3d3"/>'
    b+='<rect x="90" y="300" width="380" height="300" rx="18" fill="#3b3540"/>'+''.join(f'<rect x="130" y="{350+i*55}" width="{260-(i%3)*50}" height="14" rx="7" fill="#f6f1e9" opacity=".85"/><rect x="{400}" y="{350+i*55}" width="40" height="14" rx="7" fill="#ffd166"/>' for i in range(4))
    for lx in (640,860):
        b+=f'<rect x="{lx-2}" y="0" width="4" height="250" fill="#6b5b4f"/><path d="M{lx-60} 300 q60 -80 120 0z" fill="#e8a24b"/><ellipse cx="{lx}" cy="306" rx="40" ry="10" fill="#fff1b8"/>'
    b+='<rect x="0" y="1150" width="1080" height="390" fill="#c98a4b"/><rect x="0" y="1130" width="1080" height="40" fill="#e0a868"/>'
    b+='<rect x="770" y="950" width="200" height="190" rx="20" fill="#a9aebb"/><rect x="800" y="980" width="140" height="60" rx="12" fill="#3b3540"/><rect x="830" y="1080" width="30" height="40" fill="#6b5b4f"/>'
    b+='<rect x="100" y="1040" width="70" height="90" rx="10" fill="#fff"/><rect x="190" y="1060" width="60" height="70" rx="10" fill="#fff"/>'
    b+=plant(1000,1130,0.7)
    b+=floor(1540,"#e2c7ad","#cfae8f")
    return svg(b,"#f6e3d3")
def cafe_table():
    return fg('<ellipse cx="540" cy="1470" rx="300" ry="44" fill="#ffffff"/><rect x="520" y="1480" width="40" height="440" fill="#b9b1c4"/>'
              '<rect x="430" y="1390" width="70" height="80" rx="14" fill="#fff"/><path d="M500 1410 q32 0 32 24 q0 24 -32 24" stroke="#fff" stroke-width="10" fill="none"/><path d="M450 1370 q10 -20 0 -40 M480 1370 q10 -20 0 -40" stroke="#c9b6a8" stroke-width="6" fill="none" stroke-linecap="round"/>'
              '<rect x="600" y="1400" width="70" height="70" rx="12" fill="#e48aa0"/>')

def park():
    b='<rect width="1080" height="1200" fill="#cdeaf7"/><circle cx="860" cy="360" r="80" fill="#ffd166"/>'
    b+='<ellipse cx="800" cy="520" rx="120" ry="34" fill="#fff" opacity=".9"/><ellipse cx="220" cy="460" rx="100" ry="28" fill="#fff" opacity=".9"/>'
    b+='<ellipse cx="200" cy="1260" rx="520" ry="200" fill="#a9d9a8"/><ellipse cx="900" cy="1240" rx="480" ry="190" fill="#9bd19c"/>'
    for tx,ts in ((120,1.0),(960,1.15)):
        b+=f'<g transform="translate({tx},1250) scale({ts})"><rect x="-18" y="-160" width="36" height="200" rx="10" fill="#a8774d"/><circle cx="0" cy="-260" r="120" fill="#6fbf7f"/><circle cx="-70" cy="-200" r="80" fill="#7fcb8d"/><circle cx="70" cy="-200" r="80" fill="#5fae76"/></g>'
    b+='<rect x="0" y="1250" width="1080" height="670" fill="#b6e0b0"/>'
    b+='<path d="M380 1920 q60 -340 160 -670 h40 q40 330 140 670z" fill="#efe3c8"/>'
    b+='<rect x="700" y="1390" width="300" height="30" rx="12" fill="#c98a4b"/><rect x="700" y="1330" width="300" height="24" rx="12" fill="#c98a4b"/><rect x="720" y="1420" width="18" height="90" fill="#8a5a3b"/><rect x="962" y="1420" width="18" height="90" fill="#8a5a3b"/>'
    rnd=random.Random(5)
    for _ in range(14): b+=f'<circle cx="{rnd.randint(20,1060)}" cy="{rnd.randint(1300,1880)}" r="8" fill="{rnd.choice(["#ffd166","#f4a6b8","#fff"])}"/>'
    return svg(b,"#cdeaf7")

SCENES={"bedroom":bedroom,"bedroom_night":lambda:bedroom(True,"3:07"),"bathroom":bathroom,"kitchen":kitchen,"desk":desk,"desk_night":lambda:desk(True),
        "street":street,"street_evening":lambda:street(True),"cafe":cafe,"park":park}
