import asyncio
from playwright.async_api import async_playwright
INK="#2a2438"
def eyes(cx,cy,mood,s=1):
    out=""
    for dx in (-30,30):
        x=cx+dx*s
        if mood=="sad":
            out+=f'<ellipse cx="{x}" cy="{cy+3*s}" rx="{17*s}" ry="{21*s}" fill="{INK}"/><circle cx="{x+6*s}" cy="{cy-5*s}" r="{6.5*s}" fill="#fff"/><circle cx="{x-6*s}" cy="{cy+10*s}" r="{3.5*s}" fill="#fff"/>'
            out+=(f'<path d="M{x-16*s} {cy-24*s} L{x+14*s} {cy-34*s}" stroke="{INK}" stroke-width="{4*s}" stroke-linecap="round"/>' if dx<0 else f'<path d="M{x+16*s} {cy-24*s} L{x-14*s} {cy-34*s}" stroke="{INK}" stroke-width="{4*s}" stroke-linecap="round"/>')
            out+=f'<path d="M{x+(-4 if dx<0 else 4)*s} {cy+22*s} q{-5*s} {12*s} 0 {17*s} q{5*s} {-5*s} 0 {-17*s}z" fill="#8cc4f0"/>'
        elif mood=="yowl":  # squeezed-shut eyes > <
            sg=-1 if dx<0 else 1
            out+=f'<path d="M{x-14*sg*s} {cy-12*s} L{x+12*sg*s} {cy} L{x-14*sg*s} {cy+12*s}" stroke="{INK}" stroke-width="{7*s}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
            # wailing: tear streams spraying out sideways from the outer corners
            ox=x+18*sg*s
            out+=f'<path d="M{ox} {cy+4*s} q{10*sg*s} {0*s} {13*sg*s} {24*s}" stroke="#8cc4f0" stroke-width="{7*s}" fill="none" stroke-linecap="round"/>'
            out+=f'<path d="M{ox} {cy+10*s} q{2*sg*s} {12*s} {4*sg*s} {34*s}" stroke="#8cc4f0" stroke-width="{5*s}" fill="none" stroke-linecap="round"/>'
            out+=f'<circle cx="{ox+14*sg*s}" cy="{cy+36*s}" r="{4*s}" fill="#8cc4f0"/><circle cx="{ox+4*sg*s}" cy="{cy+46*s}" r="{3.4*s}" fill="#8cc4f0"/>'
        elif mood=="coma":  # blissfully asleep: soft closed curves with two outer lashes
            sg=-1 if dx<0 else 1
            out+=f'<path d="M{x-16*s} {cy-2*s} q{16*s} {16*s} {32*s} 0" stroke="{INK}" stroke-width="{6.5*s}" fill="none" stroke-linecap="round"/>'
            out+=f'<path d="M{x+15*sg*s} {cy} l{6*sg*s} {3*s} M{x+11*sg*s} {cy+5*s} l{5*sg*s} {5*s}" stroke="{INK}" stroke-width="{3.6*s}" stroke-linecap="round"/>'
        elif mood=="happy":
            out+=f'<path d="M{x-17*s} {cy+4*s} q{17*s} {-26*s} {34*s} 0" stroke="{INK}" stroke-width="{8*s}" fill="none" stroke-linecap="round"/>'
        else:
            out+=f'<ellipse cx="{x}" cy="{cy}" rx="{18*s}" ry="{23*s}" fill="{INK}"/><ellipse cx="{x}" cy="{cy+9*s}" rx="{13*s}" ry="{9*s}" fill="#6a5a8e" opacity=".55"/><circle cx="{x+6*s}" cy="{cy-8*s}" r="{7.5*s}" fill="#fff"/><circle cx="{x-7*s}" cy="{cy+8*s}" r="{3.5*s}" fill="#fff"/><path d="M{x+11*s} {cy+6*s} l{2*s} {4*s} {4*s} {1*s} -{4*s} {1*s} -{2*s} {4*s} -{2*s} -{4*s} -{4*s} -{1*s} {4*s} -{1*s}z" fill="#fff"/>'
    if mood=="happy": m=f'<path d="M{cx-11*s} {cy+18*s} q{11*s} {16*s} {22*s} 0z" fill="#e8636f" stroke="{INK}" stroke-width="{4*s}" stroke-linejoin="round"/>'
    elif mood=="yowl": m=f'<path d="M{cx-17*s} {cy+18*s} q{17*s} {-6*s} {34*s} 0 q{2*s} {30*s} {-17*s} {32*s} q{-19*s} {-2*s} {-17*s} {-32*s}z" fill="#5a2a3a" stroke="{INK}" stroke-width="{4*s}" stroke-linejoin="round"/><ellipse cx="{cx}" cy="{cy+42*s}" rx="{9*s}" ry="{6*s}" fill="#e8636f"/><path d="M{cx-12*s} {cy+20*s} l{3*s} {7*s} l{3*s} {-6*s} M{cx+12*s} {cy+20*s} l{-3*s} {7*s} l{-3*s} {-6*s}" fill="#fff"/>'
    elif mood=="coma": m=f'<path d="M{cx-9*s} {cy+24*s} q{4.5*s} {6*s} {9*s} 0 q{4.5*s} {6*s} {9*s} 0" stroke="{INK}" stroke-width="{4*s}" fill="none" stroke-linecap="round"/>'
    elif mood=="sad": m=f'<path d="M{cx-9*s} {cy+30*s} q{9*s} {-9*s} {18*s} 0" stroke="{INK}" stroke-width="{4.5*s}" fill="none" stroke-linecap="round"/>'
    else: m=f'<path d="M{cx-8*s} {cy+24*s} q{4*s} {5*s} {8*s} 0 q{4*s} {5*s} {8*s} 0" stroke="{INK}" stroke-width="{4*s}" fill="none" stroke-linecap="round"/>'
    bl=f'<ellipse cx="{cx-54*s}" cy="{cy+22*s}" rx="{13*s}" ry="{8*s}" fill="#ff8fa3" opacity=".6"/><ellipse cx="{cx+54*s}" cy="{cy+22*s}" rx="{13*s}" ry="{8*s}" fill="#ff8fa3" opacity=".6"/>'
    return out+m+bl
def limbs(color,mood,bx=130,by=225,dark=None):
    d=dark or color
    legs=f'<ellipse cx="{bx-24}" cy="{by+58}" rx="17" ry="12" fill="{d}"/><ellipse cx="{bx+24}" cy="{by+58}" rx="17" ry="12" fill="{d}"/>'
    if mood=="happy":   # arms up, cheering
        arms=f'<path d="M{bx-42} {by+5} q-40 -5 -64 -50" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M{bx+42} {by+5} q40 -5 64 -50" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/>'
    elif mood=="coma":   # paws resting on a round full tummy
        arms=f'<path d="M{bx-42} {by+4} q-12 26 22 36" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M{bx+42} {by+4} q12 26 -22 36" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/>'
    elif mood in ("sad","yowl"):   # hugging self
        arms=f'<path d="M{bx-42} {by+2} q-8 30 26 34" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M{bx+42} {by+2} q8 30 -26 34" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/>'
    else:               # open arms, offering a hug
        arms=f'<path d="M{bx-42} {by+5} q-35 0 -48 -18" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M{bx+42} {by+5} q35 0 48 -18" stroke="{color}" stroke-width="20" stroke-linecap="round" fill="none"/>'
    return legs,arms
def body(color,bx=130,by=225): return f'<ellipse cx="{bx}" cy="{by+20}" rx="48" ry="44" fill="{color}"/>'
def deco(mood):
    if mood=="happy": return '<g fill="#ffd166"><path d="M30 60 l5 11 12 2 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -2z"/><circle cx="230" cy="70" r="6"/></g>'
    if mood=="yowl": return '<g stroke="#e0475b" stroke-width="6" stroke-linecap="round"><path d="M26 58 l14 12 M20 84 l18 2 M32 36 l10 16"/><path d="M234 58 l-14 12 M240 84 l-18 2 M228 36 l-10 16"/></g>'
    if mood=="coma": return '<g fill="#8a86a8" font-family="Poppins,sans-serif" font-weight="700"><text x="196" y="74" font-size="30">z</text><text x="216" y="48" font-size="22" opacity=".75">z</text><text x="232" y="28" font-size="16" opacity=".5">z</text></g>'
    if mood=="sad": return '<g stroke="#8a86a8" stroke-width="4" fill="none" stroke-linecap="round"><path d="M215 55 c10 -10 22 0 12 10 c-10 10 2 20 12 10"/></g>'
    return '<path d="M210 55 c0 -11 16 -11 16 0 c0 -11 16 -11 16 0 c0 13 -16 21 -16 26 c0 -5 -16 -13 -16 -26z" fill="#ff7a8a"/>'
def shadow(): return '<ellipse cx="130" cy="297" rx="70" ry="9" fill="#000" opacity=".08"/>'
def toffee_box():
    # "the new cat bed arrived. she sleeps in the box": the plush bed sits empty beside her (price tag still on);
    # she's curled in the open cardboard box, chin on her paws on the rim, eyes softly closed
    c="#e9a868"; d="#c9844a"; K="#c99a62"; Kd="#a87a46"; Ki="#7d5a34"
    s='<g transform="translate(34 0)"><ellipse cx="-62" cy="300" rx="84" ry="8" fill="#000" opacity=".08"/><ellipse cx="140" cy="299" rx="88" ry="9" fill="#000" opacity=".10"/>'
    # the empty plush cat bed (round, raised rim, cushion inside) with a price tag on a string
    s+='<ellipse cx="-62" cy="276" rx="80" ry="26" fill="#9a8fc9"/><ellipse cx="-62" cy="266" rx="80" ry="24" fill="#b7addf"/><ellipse cx="-62" cy="270" rx="56" ry="14" fill="#e9e4f7"/>'
    s+='<path d="M-136 262 q74 -22 148 0" stroke="#d4ccf0" stroke-width="5" fill="none" stroke-linecap="round"/>'
    s+='<path d="M6 262 q14 4 16 16" stroke="#8a86a8" stroke-width="2" fill="none"/><g transform="rotate(18 26 286)"><rect x="16" y="278" width="20" height="28" rx="3" fill="#fff8e6" stroke="#d9c9a0" stroke-width="1.5"/><circle cx="26" cy="283" r="2.2" fill="#d9c9a0"/><path d="M20 292 h12 M20 298 h8" stroke="#e0475b" stroke-width="2.2" stroke-linecap="round"/></g>'
    s+='<g transform="translate(140 0)"><g transform="translate(-130 0)">'
    s+=f'<path d="M58 196 h144 l4 22 h-152z" fill="{Ki}"/>'  # inside back wall (shadowed)
    s+='<path d="M180 210 q40 -2 50 -26" stroke="#d9944f" stroke-width="14" fill="none" stroke-linecap="round"/>'  # tail curling over the rim
    s+=f'<path d="M58 196 l-30 -26 l-6 44 l32 6z" fill="{Kd}"/><path d="M202 196 l30 -26 l6 44 l-32 6z" fill="{Kd}"/>'  # open side flaps
    s+=f'<ellipse cx="130" cy="210" rx="62" ry="22" fill="{d}"/>'  # her rounded back curled inside the box
    # head at ~80% of the box mouth, low, so the rim cuts across her chin
    s+='<g transform="translate(130 150) scale(0.74) translate(-130 -150)">'
    s+='<path d="M58 95 l4 -62 52 38z" fill="#e9a868"/><path d="M202 95 l-4 -62 -52 38z" fill="#e9a868"/><path d="M68 82 l3 -32 27 20z" fill="#f7cdb0"/><path d="M192 82 l-3 -32 -27 20z" fill="#f7cdb0"/>'
    s+=f'<ellipse cx="130" cy="140" rx="88" ry="76" fill="{c}"/><path d="M112 71 q18 -12 36 0" stroke="{d}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M118 85 q12 -7 24 0" stroke="{d}" stroke-width="6" fill="none" stroke-linecap="round"/>'
    s+='<g stroke="#b9773f" stroke-width="3" stroke-linecap="round"><line x1="38" y1="155" x2="62" y2="157"/><line x1="40" y1="167" x2="62" y2="165"/><line x1="222" y1="155" x2="198" y2="157"/><line x1="220" y1="167" x2="198" y2="165"/></g>'
    s+=eyes(130,145,"coma",1)+'</g>'
    s+=f'<path d="M50 214 h160 l-6 82 h-148z" fill="{K}"/><path d="M50 214 h160 v7 h-160z" fill="{Kd}"/>'  # front panel + rim edge
    s+='<path d="M120 221 h20 v75 h-20z" fill="#e6c995" opacity=".75"/>'  # packing tape
    s+='<rect x="150" y="246" width="38" height="24" rx="3" fill="#f6efe2"/><path d="M155 254 h26 M155 261 h18" stroke="#b9a58a" stroke-width="2.4" stroke-linecap="round"/>'  # shipping label
    for x in (104,156): s+=f'<ellipse cx="{x}" cy="214" rx="19" ry="11" fill="{c}"/><path d="M{x-6} 219 v-5 M{x} 220 v-6 M{x+6} 219 v-5" stroke="{d}" stroke-width="2.2" stroke-linecap="round"/>'  # paws over the rim
    s+='<g fill="#8a86a9" font-family="Poppins,sans-serif" font-weight="700"><text x="186" y="96" font-size="28">z</text><text x="206" y="72" font-size="20" opacity=".75">z</text><text x="222" y="52" font-size="15" opacity=".5">z</text></g>'
    s+='</g></g></g>'
    return s
def toffee(m):
    if m=="box": return toffee_box()
    c="#e9a868"; d="#c9844a"
    legs,arms=limbs(c,m,dark=d)
    tail='<path d="M166 272 q42 14 60 -6" stroke="#d9944f" stroke-width="15" fill="none" stroke-linecap="round"/>'
    ears=('<path d="M58 95 l4 -62 52 38z" fill="#e9a868"/><path d="M202 95 l-4 -62 -52 38z" fill="#e9a868"/><path d="M68 82 l3 -32 27 20z" fill="#f7cdb0"/><path d="M192 82 l-3 -32 -27 20z" fill="#f7cdb0"/>' if m not in ("sad","yowl") else '<path d="M55 108 l-22 -48 56 18z" fill="#e9a868"/><path d="M205 108 l22 -48 -56 18z" fill="#e9a868"/>')
    head=f'<ellipse cx="130" cy="135" rx="88" ry="76" fill="{c}"/><path d="M112 66 q18 -12 36 0" stroke="{d}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M118 80 q12 -7 24 0" stroke="{d}" stroke-width="6" fill="none" stroke-linecap="round"/>'
    whisk='<g stroke="#b9773f" stroke-width="3" stroke-linecap="round"><line x1="38" y1="150" x2="62" y2="152"/><line x1="40" y1="162" x2="62" y2="160"/><line x1="222" y1="150" x2="198" y2="152"/><line x1="220" y1="162" x2="198" y2="160"/></g>'
    belly='<ellipse cx="130" cy="250" rx="28" ry="24" fill="#f7cdb0"/>' if m!="coma" else '<ellipse cx="130" cy="252" rx="56" ry="46" fill="#e9a868"/><ellipse cx="130" cy="254" rx="36" ry="30" fill="#f7cdb0"/>'
    return shadow()+tail+legs+body(c)+belly+arms+ears+head+whisk+eyes(130,140,m,1)+deco(m)
def drizzle(m):
    c="#ffffff"; legs,arms=limbs("#d3e0f2",m,dark="#b7c8e2")
    head='<path d="M50 190 h160 a48 48 0 0 0 4 -96 a62 62 0 0 0 -118 -22 a48 48 0 0 0 -46 118z" fill="#fff" stroke="#c9d6ea" stroke-width="5"/>'
    rain='<g stroke="#8cc4f0" stroke-width="6" stroke-linecap="round"><line x1="40" y1="40" x2="34" y2="62"/><line x1="226" y1="36" x2="220" y2="58"/></g>' if m=="sad" else ""
    sun='<circle cx="225" cy="45" r="22" fill="#ffd166"/>' if m=="spark" else ""
    return shadow()+sun+legs+body("#dfe8f6")+arms+head+rain+eyes(130,135,m,.95)+(deco(m) if m=="happy" else "")
def sprig(m):
    c="#9fd89a"; d="#76b971"; legs,arms=limbs(c,m,dark=d)
    rot=-30 if m!="sad" else 40
    leaves=f'<path d="M130 70 v-30" stroke="#4f9a5a" stroke-width="8" stroke-linecap="round"/><g transform="rotate({rot} 130 42)"><path d="M130 42 q34 -40 70 -12 q-34 34 -70 12z" fill="#5bb36a"/></g><g transform="rotate({-rot} 130 42)"><path d="M130 42 q-34 -40 -70 -12 q34 34 70 12z" fill="#6cc07a"/></g>'
    head=f'<ellipse cx="130" cy="140" rx="86" ry="74" fill="{c}"/>'
    return shadow()+legs+body(c)+arms+head+leaves+eyes(130,140,m,1)+deco(m)
def puddle(m):
    c="#ffd76a"; d="#f5b83f"; legs,arms=limbs(c,m,dark="#f59f3a")
    head=f'<ellipse cx="130" cy="138" rx="86" ry="78" fill="{c}"/><path d="M118 62 q8 -26 22 -8 q4 -20 18 -6" stroke="{d}" stroke-width="7" fill="none" stroke-linecap="round"/>'
    beak='<ellipse cx="130" cy="172" rx="20" ry="11" fill="#f59f3a"/>'
    boots='<ellipse cx="106" cy="283" rx="19" ry="13" fill="#5aa4d6"/><ellipse cx="154" cy="283" rx="19" ry="13" fill="#5aa4d6"/>'
    e=eyes(130,130,m,.95).replace(f'<path d="M{130-11*.95}','<path data-x="m" d="M{0}'.format(130-11*.95))
    return shadow()+legs+boots+body(c)+arms+head+eyes(130,128,m,.95).split('<path d="M119')[0]+beak+deco(m)
opts=[("Toffee","Toffee Thoughts","A cosy caramel kitten who overthinks everything, then finds the soft way through.",toffee,"#f8e8d8"),
      ("Drizzle","Drizzle Days","A little cloud whose weather matches their mood. Rainy days are okay; the sun comes back.",drizzle,"#dbe8f7"),
      ("Sprig","Grow Slow Club","A tiny sprout growing at their own pace. Slow growth still counts.",sprig,"#e3f3df"),
      ("Puddle","Puddle Days","A little duckling in rain boots, splashing through life's messy days.",puddle,"#fff3d6")]
cards=""
for i,(n,brand,desc,fn,bg) in enumerate(opts):
    poses="".join(f'<div class="pose"><svg viewBox="0 0 260 310" width="250" height="298">{fn(m)}</svg><span>{lab}</span></div>' for m,lab in [("happy","Happy"),("sad","Overwhelmed"),("spark","Encouraging")])
    cards+=f'<div class="card" style="background:{bg}"><div class="num">Option {i+1}</div><h2>{brand}</h2><div class="who">Character: <b>{n}</b></div><p>{desc}</p><div class="poses">{poses}</div></div>'
html=f'''<html><head><style>*{{box-sizing:border-box;margin:0}}body{{width:1840px;font-family:Poppins,sans-serif;background:#fffdf8;color:{INK};padding:50px}}
h1{{font-family:Lora,serif;font-size:56px;margin-bottom:8px}}.sub{{font-size:22px;color:#666;margin-bottom:36px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:30px}}.card{{border-radius:28px;padding:34px}}
.num{{font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:#777}}h2{{font-family:Lora,serif;font-size:46px;margin:6px 0}}
.who{{font-size:20px}}p{{font-size:20px;margin:10px 0 18px;color:#444}}.poses{{display:flex;gap:6px;background:#ffffffaa;border-radius:20px;padding:12px}}
.pose{{display:flex;flex-direction:column;align-items:center;flex:1}}.pose span{{font-size:16px;color:#555}}</style></head>
<body><h1>Pick your character, round 2</h1><div class="sub">Chibi style: arms, legs and big sparkly eyes. Concept sketches; I'll polish the one you choose.</div><div class="grid">{cards}</div></body></html>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1840,"height":1000})
        await pg.set_content(html); await pg.wait_for_timeout(400)
        await pg.screenshot(path="character-options-2.png",full_page=True); await b.close()
asyncio.run(main())
