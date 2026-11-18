import asyncio, re
from playwright.async_api import async_playwright
src=open('chibi.py').read()
exec(src.split("def toffee")[0])  # reuse eyes(), limbs(), deco(), shadow()
def person(m,skin,hair_back,hair_front,top,top_dark,pants,shoes,extra_front="",extra_back=""):
    legs=f'<rect x="104" y="262" width="20" height="26" rx="9" fill="{pants}"/><rect x="136" y="262" width="20" height="26" rx="9" fill="{pants}"/><ellipse cx="112" cy="290" rx="17" ry="10" fill="{shoes}"/><ellipse cx="148" cy="290" rx="17" ry="10" fill="{shoes}"/>'
    torso=f'<path d="M88 225 q42 -22 84 0 l6 40 q-48 12 -96 0z" fill="{top}"/>'
    _,arms=limbs(top,m,by=222)
    arms=arms.replace('stroke-width="20"','stroke-width="18"')
    # hands: skin dots at arm ends
    ends=re.findall(r'M(\d+) (\d+) q(-?\d+) (-?\d+) (-?\d+) (-?\d+)',arms)
    hands="".join(f'<circle cx="{int(a)+int(e)}" cy="{int(b)+int(f)}" r="10" fill="{skin}"/>' for a,b,c,d,e,f in ends)
    head=f'<ellipse cx="130" cy="130" rx="80" ry="76" fill="{skin}"/><ellipse cx="52" cy="140" rx="10" ry="14" fill="{skin}"/><ellipse cx="208" cy="140" rx="10" ry="14" fill="{skin}"/>'
    return shadow()+hair_back+legs+torso+arms+hands+head+eyes(130,145,m,.9)+hair_front+extra_front+deco(m)
CH=[
 ("Ada","Soft Days with Ada","A warm, honest girl figuring out adulting one soft day at a time.",
  dict(skin="#8a5a3b",hair_back='<circle cx="62" cy="62" r="34" fill="#2b1d16"/><circle cx="198" cy="62" r="34" fill="#2b1d16"/>',
       hair_front='<path d="M50 120 q10 -78 80 -76 q70 -2 80 76 q-30 -38 -80 -40 q-50 2 -80 40z" fill="#2b1d16"/>',
       top="#f4a6b8",top_dark="#e48aa0",pants="#5b6fa8",shoes="#ffffff")),
 ("Milo","Milo's Mind","A sleepy, sweet overthinker in an oversized sweater.",
  dict(skin="#f2c9a5",hair_back="",
       hair_front='<path d="M48 128 q-6 -84 82 -86 q88 2 82 86 q-12 -30 -36 -40 q4 20 -10 24 q-6 -22 -36 -26 q-10 22 -32 22 q2 -18 -8 -26 q-30 14 -42 46z" fill="#6b4a32"/>',
       top="#9fc7a4",top_dark="#82b088",pants="#4a4e69",shoes="#e76f51")),
 ("Juno","Juno Feels","A dreamy girl with headphones who feels everything deeply.",
  dict(skin="#e8b48f",hair_back='<path d="M46 120 q-10 90 30 110 h108 q40 -20 30 -110z" fill="#3b2a4a"/>',
       hair_front='<path d="M50 130 q0 -86 80 -86 q80 0 80 86 q-14 -22 -34 -30 q-4 18 -16 22 q-6 -20 -30 -26 q-24 6 -30 26 q-12 -4 -16 -22 q-20 8 -34 30z" fill="#3b2a4a"/>',
       top="#b8a6e6",top_dark="#9f8bd6",pants="#2f3e5c",shoes="#f4d35e",
       extra_front='<path d="M44 140 q-4 -90 86 -94 q90 4 86 94" stroke="#ff8fa3" stroke-width="9" fill="none"/><rect x="34" y="122" width="22" height="40" rx="10" fill="#ff8fa3"/><rect x="204" y="122" width="22" height="40" rx="10" fill="#ff8fa3"/>')),
 ("Kemi","Little Kemi","A bright little go-getter with braids who never gives up for long.",
  dict(skin="#6e4630",hair_back='<path d="M60 110 q-30 60 -18 140" stroke="#1d1410" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M200 110 q30 60 18 140" stroke="#1d1410" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="42" cy="252" r="9" fill="#ffd166"/><circle cx="218" cy="252" r="9" fill="#ffd166"/>',
       hair_front='<path d="M50 124 q6 -82 80 -82 q74 0 80 82 q-30 -50 -80 -52 q-50 2 -80 52z" fill="#1d1410"/><path d="M130 44 v40" stroke="#3a2a22" stroke-width="3"/>',
       top="#ffb86b",top_dark="#f59f3a",pants="#3d7ea6",shoes="#ffffff")),
]
cards=""
for i,(n,brand,desc,kw) in enumerate(CH):
    poses="".join(f'<div class="pose"><svg viewBox="0 0 260 310" width="250" height="298">{person(m,**kw)}</svg><span>{lab}</span></div>' for m,lab in [("happy","Happy"),("sad","Overwhelmed"),("spark","Encouraging")])
    bg=["#fde9ee","#e6f2e7","#efeafb","#fff1df"][i]
    cards+=f'<div class="card" style="background:{bg}"><div class="num">Option {i+1}</div><h2>{brand}</h2><div class="who">Character: <b>{n}</b></div><p>{desc}</p><div class="poses">{poses}</div></div>'
html=f'''<html><head><style>*{{box-sizing:border-box;margin:0}}body{{width:1840px;font-family:Poppins,sans-serif;background:#fffdf8;color:#2a2438;padding:50px}}
h1{{font-family:Lora,serif;font-size:56px;margin-bottom:8px}}.sub{{font-size:22px;color:#666;margin-bottom:36px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:30px}}.card{{border-radius:28px;padding:34px}}
.num{{font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:#777}}h2{{font-family:Lora,serif;font-size:46px;margin:6px 0}}
.who{{font-size:20px}}p{{font-size:20px;margin:10px 0 18px;color:#444}}.poses{{display:flex;gap:6px;background:#ffffffaa;border-radius:20px;padding:12px}}
.pose{{display:flex;flex-direction:column;align-items:center;flex:1}}.pose span{{font-size:16px;color:#555}}</style></head>
<body><h1>Pick your character, round 3: humans</h1><div class="sub">Chibi people with big sparkly eyes. Concept sketches; I'll polish the one you choose.</div><div class="grid">{cards}</div></body></html>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1840,"height":1000})
        await pg.set_content(html); await pg.wait_for_timeout(400)
        await pg.screenshot(path="character-options-3.png",full_page=True); await b.close()
asyncio.run(main())
