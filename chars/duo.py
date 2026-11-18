import asyncio
from playwright.async_api import async_playwright
ns={}
exec(open('humans.py').read().split("cards=\"\"")[0],ns)
exec(open('chibi.py').read().split("opts=[")[0],ns)
person=ns['person']; toffee=ns['toffee']
amara=dict(skin="#8a5a3b",hair_back='<circle cx="60" cy="60" r="36" fill="#2b1d16"/><circle cx="200" cy="60" r="36" fill="#2b1d16"/><circle cx="60" cy="60" r="36" fill="none" stroke="#3a2a20" stroke-width="3" stroke-dasharray="4 6"/>',
  hair_front='<path d="M50 120 q10 -78 80 -76 q70 -2 80 76 q-30 -38 -80 -40 q-50 2 -80 40z" fill="#2b1d16"/><path d="M84 46 q18 -8 34 0" stroke="#ffd166" stroke-width="7" fill="none" stroke-linecap="round"/>',
  top="#f4a6b8",top_dark="#e48aa0",pants="#5b6fa8",shoes="#ffffff")
def scene(m_a,m_t,cap,bg):
    a=person(m_a,**amara)
    t=toffee(m_t)
    return f'''<div class="scene" style="background:{bg}"><svg viewBox="0 0 420 320" width="420" height="320">
<g transform="translate(10,5)">{a}</g><g transform="translate(250,140) scale(.6)">{t}</g></svg><span>{cap}</span></div>'''
scenes=scene("happy","happy","Good days: celebrating the little wins","#fde9ee")+scene("sad","spark","Hard days: Toffee is always there","#e9eef8")+scene("spark","happy","“You're doing better than you think.”","#fff1df")
logo=f'''<div class="logo"><svg viewBox="0 0 420 320" width="230" height="175"><g transform="translate(10,5)">{person("spark",**amara)}</g><g transform="translate(250,140) scale(.6)">{toffee("spark")}</g></svg>
<div><div class="brand">Amara <span>&amp;</span> Toffee</div><div class="tag">Soft days, big feelings, and a cat who gets it.</div></div></div>'''
html=f'''<html><head><style>*{{box-sizing:border-box;margin:0}}body{{width:1500px;font-family:Poppins,sans-serif;background:#fffaf5;color:#2a2438;padding:50px}}
.logo{{display:flex;align-items:center;gap:28px;background:#fff;border-radius:28px;padding:20px 34px;box-shadow:0 10px 30px rgba(0,0,0,.06)}}
.brand{{font-family:Lora,serif;font-weight:700;font-size:72px;line-height:1}}.brand span{{color:#e48aa0}}.tag{{font-size:26px;color:#666;margin-top:10px}}
.row{{display:flex;gap:24px;margin-top:30px}}.scene{{flex:1;border-radius:24px;padding:16px;display:flex;flex-direction:column;align-items:center}}
.scene span{{font-size:19px;color:#444;text-align:center;margin-top:4px}}
.about{{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:30px}}.box{{background:#fff;border-radius:22px;padding:26px 30px;font-size:20px;line-height:1.55}}
.box h3{{font-family:Lora,serif;font-size:30px;margin-bottom:8px}}</style></head><body>{logo}<div class="row">{scenes}</div>
<div class="about"><div class="box"><h3>Amara</h3>A warm, honest young woman figuring out adulting: work stress, overthinking, money worries, friendships, rest. She has bad days, and she's kind to herself anyway.</div>
<div class="box"><h3>Toffee</h3>Her caramel kitten and tiny emotional-support sidekick. Says nothing, understands everything. Brings the comfort (and the cute).</div></div></body></html>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1500,"height":900})
        await pg.set_content(html); await pg.wait_for_timeout(400)
        await pg.screenshot(path="amara-and-toffee.png",full_page=True); await b.close()
asyncio.run(main())
