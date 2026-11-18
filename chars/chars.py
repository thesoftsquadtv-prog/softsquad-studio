import asyncio
from playwright.async_api import async_playwright
INK="#2b2b3a"
def face(mood,cx,cy,s=1,eye=INK,blush="#ff9fa8"):
    # eyes
    if mood=="happy":
        eyes=f'<path d="M{cx-34*s} {cy} q{10*s} {-12*s} {20*s} 0" stroke="{eye}" stroke-width="{6*s}" fill="none" stroke-linecap="round"/><path d="M{cx+14*s} {cy} q{10*s} {-12*s} {20*s} 0" stroke="{eye}" stroke-width="{6*s}" fill="none" stroke-linecap="round"/>'
        mouth=f'<path d="M{cx-12*s} {cy+20*s} q{12*s} {14*s} {24*s} 0" stroke="{eye}" stroke-width="{5*s}" fill="#e8636f" stroke-linecap="round"/>'
    elif mood=="tired":
        eyes=f'<path d="M{cx-34*s} {cy} h{20*s}" stroke="{eye}" stroke-width="{6*s}" stroke-linecap="round"/><path d="M{cx+14*s} {cy} h{20*s}" stroke="{eye}" stroke-width="{6*s}" stroke-linecap="round"/><path d="M{cx-36*s} {cy-14*s} l{22*s} {6*s}" stroke="{eye}" stroke-width="{4*s}" stroke-linecap="round"/><path d="M{cx+36*s} {cy-14*s} l{-22*s} {6*s}" stroke="{eye}" stroke-width="{4*s}" stroke-linecap="round"/>'
        mouth=f'<path d="M{cx-10*s} {cy+26*s} q{10*s} {-8*s} {20*s} 0" stroke="{eye}" stroke-width="{5*s}" fill="none" stroke-linecap="round"/>'
    else: # sparkle/encouraging
        eyes=f'<ellipse cx="{cx-24*s}" cy="{cy}" rx="{9*s}" ry="{12*s}" fill="{eye}"/><ellipse cx="{cx+24*s}" cy="{cy}" rx="{9*s}" ry="{12*s}" fill="{eye}"/><circle cx="{cx-21*s}" cy="{cy-5*s}" r="{3.5*s}" fill="#fff"/><circle cx="{cx+27*s}" cy="{cy-5*s}" r="{3.5*s}" fill="#fff"/>'
        mouth=f'<path d="M{cx-9*s} {cy+20*s} q{9*s} {9*s} {18*s} 0" stroke="{eye}" stroke-width="{5*s}" fill="none" stroke-linecap="round"/>'
    bl=f'<ellipse cx="{cx-46*s}" cy="{cy+16*s}" rx="{11*s}" ry="{7*s}" fill="{blush}" opacity=".75"/><ellipse cx="{cx+46*s}" cy="{cy+16*s}" rx="{11*s}" ry="{7*s}" fill="{blush}" opacity=".75"/>'
    return eyes+mouth+bl
def drizzle(m):
    rain="" if m!="tired" else '<g stroke="#7fb3e6" stroke-width="6" stroke-linecap="round"><line x1="70" y1="215" x2="62" y2="245"/><line x1="110" y1="220" x2="102" y2="252"/><line x1="150" y1="215" x2="142" y2="245"/></g>'
    sun="" if m!="spark" else '<g fill="#ffd166"><circle cx="190" cy="40" r="20"/></g>'
    body='<path d="M45 190 h125 a40 40 0 0 0 5 -80 a55 55 0 0 0 -100 -20 a40 40 0 0 0 -30 100 z" fill="#ffffff" stroke="#c9d6ea" stroke-width="5"/>'
    return sun+body+rain+face(m,108,150,.9)
def pebble(m):
    tear='<path d="M70 160 q-6 14 0 20 q6 -6 0 -20z" fill="#7fb3e6"/>' if m=="tired" else ""
    star='<path d="M190 60 l6 14 15 2 -11 10 3 15 -13 -8 -13 8 3 -15 -11 -10 15 -2z" fill="#ffd166"/>' if m=="spark" else ""
    return f'<ellipse cx="110" cy="215" rx="80" ry="10" fill="#000" opacity=".08"/><path d="M30 170 C25 95 75 65 120 70 C175 75 200 120 192 170 C186 210 140 218 105 216 C60 214 34 205 30 170z" fill="#b9b2d8"/><path d="M70 92 q25 -12 45 -6" stroke="#d6d1ec" stroke-width="8" fill="none" stroke-linecap="round"/>'+star+tear+face(m,110,145,.9)
def sprig(m):
    leaf_rot = -35 if m!="tired" else 35
    star='<g fill="#ffd166"><circle cx="45" cy="60" r="7"/><circle cx="185" cy="80" r="5"/></g>' if m=="spark" else ""
    return f'''<ellipse cx="110" cy="222" rx="70" ry="9" fill="#000" opacity=".08"/>
<rect x="45" y="95" width="130" height="125" rx="62" fill="#a8d8a0"/>
<path d="M110 98 q0 -25 0 -40" stroke="#4f9a5a" stroke-width="7" stroke-linecap="round" fill="none"/>
<g transform="rotate({leaf_rot} 110 60)"><path d="M110 60 q30 -35 60 -10 q-30 30 -60 10z" fill="#5bb36a"/></g>
<g transform="rotate({-leaf_rot} 110 60)"><path d="M110 60 q-30 -35 -60 -10 q30 30 60 10z" fill="#6cc07a"/></g>'''+star+face(m,110,155,.85)
def toffee(m):
    tail='<path d="M170 205 q45 -10 30 -60" stroke="#c98a4b" stroke-width="16" fill="none" stroke-linecap="round"/>'
    ears=('<path d="M52 92 l10 -48 38 30z" fill="#d99a5b"/><path d="M168 92 l-10 -48 -38 30z" fill="#d99a5b"/><path d="M62 82 l6 -24 18 15z" fill="#f2c7a5"/><path d="M158 82 l-6 -24 -18 15z" fill="#f2c7a5"/>'
          if m!="tired" else '<path d="M48 100 l-14 -40 42 18z" fill="#d99a5b"/><path d="M172 100 l14 -40 -42 18z" fill="#d99a5b"/>')
    heart='<path d="M190 55 c0 -10 15 -10 15 0 c0 -10 15 -10 15 0 c0 12 -15 20 -15 24 c0 -4 -15 -12 -15 -24z" fill="#ff7a8a"/>' if m=="spark" else ""
    return f'''<ellipse cx="110" cy="225" rx="75" ry="9" fill="#000" opacity=".08"/>{tail}
<rect x="62" y="150" width="96" height="72" rx="40" fill="#d99a5b"/>
{ears}<ellipse cx="110" cy="128" rx="72" ry="62" fill="#e0a465"/>
<path d="M95 72 q15 -10 30 0" stroke="#c07f42" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M100 86 q10 -6 20 0" stroke="#c07f42" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M70 185 q40 18 80 0" stroke="#5aa4a0" stroke-width="12" fill="none" stroke-linecap="round"/>'''+heart+face(m,110,135,.85)
chars=[("Drizzle","Drizzle Days","A little cloud whose weather matches their mood. Rainy days are okay; the sun always comes back.",drizzle,"#dbe8f7"),
       ("Pebble","Pebble & Me","A small, steady stone. Quiet, a bit shy, and stronger than they think.",pebble,"#ece8f6"),
       ("Sprig","Grow Slow Club","A tiny sprout learning to grow at their own pace. Slow growth still counts.",sprig,"#e3f3df"),
       ("Toffee","Toffee Thoughts","A cosy caramel cat who overthinks everything, then finds the soft way through.",toffee,"#f8e8d8")]
cards=""
for i,(n,brand,desc,fn,bg) in enumerate(chars):
    poses="".join(f'<div class="pose"><svg viewBox="0 0 230 250" width="230" height="250">{fn(m)}</svg><span>{lab}</span></div>' for m,lab in [("happy","Happy"),("tired","Overwhelmed"),("spark","Encouraging")])
    cards+=f'<div class="card" style="background:{bg}"><div class="num">Option {i+1}</div><h2>{brand}</h2><div class="who">Character: <b>{n}</b></div><p>{desc}</p><div class="poses">{poses}</div></div>'
html=f'''<html><head><style>*{{box-sizing:border-box;margin:0}}body{{width:1800px;font-family:Poppins,sans-serif;background:#fffdf8;color:{INK};padding:50px}}
h1{{font-family:Lora,serif;font-size:56px;margin-bottom:8px}}.sub{{font-size:22px;color:#666;margin-bottom:36px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:30px}}.card{{border-radius:28px;padding:34px}}
.num{{font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:#777}}h2{{font-family:Lora,serif;font-size:46px;margin:6px 0}}
.who{{font-size:20px}}p{{font-size:20px;margin:10px 0 18px;color:#444;max-width:720px}}.poses{{display:flex;gap:10px;background:#ffffffaa;border-radius:20px;padding:12px}}
.pose{{display:flex;flex-direction:column;align-items:center;flex:1}}.pose span{{font-size:16px;color:#555;margin-top:-6px}}</style></head>
<body><h1>Pick your character</h1><div class="sub">Original characters for your feel-good, relatable channel. Rough concept sketches: I'll refine the one you choose.</div><div class="grid">{cards}</div></body></html>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1800,"height":1000})
        await pg.set_content(html); await pg.wait_for_timeout(400)
        await pg.screenshot(path="character-options.png",full_page=True); await b.close()
asyncio.run(main())
