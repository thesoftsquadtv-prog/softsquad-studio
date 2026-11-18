import asyncio
from playwright.async_api import async_playwright
ns={}
exec(open('humans.py').read().split("cards=\"\"")[0],ns)
exec(open('chibi.py').read().split("opts=[")[0],ns)
person=ns['person']; toffee=ns['toffee']; CH=ns['CH']
d={n:kw for n,_,_,kw in CH}
exec(open('duo.py').read().split("def scene")[0].split("toffee=ns['toffee']")[1],ns)
amara=ns['amara']
members=[("Amara","The soft heart","Kind to everyone except herself. Learning to rest.",amara,"happy","#fde9ee"),
         ("Milo","The overthinker","Replays one conversation from 2019 at 3am.",d["Milo"],"sad","#e6f2e7"),
         ("Kemi","The go-getter","Has 4 side hustles and a 5am alarm. Secretly tired.",d["Kemi"],"spark","#fff1df"),
         ("Juno","The big feeler","Cries at adverts. Loves loudly. Feels everything.",d["Juno"],"happy","#efeafb")]
group="".join(f'<g transform="translate({i*230},{0 if i%2==0 else 20})">{person(m,**kw)}</g>' for i,(_,_,_,kw,m,_) in enumerate(members))
cards="".join(f'<div class="m" style="background:{bg}"><svg viewBox="0 0 260 310" width="170" height="203">{person(mood,**kw)}</svg><div><h3>{n}</h3><b>{role}</b><p>{desc}</p></div></div>' for n,role,desc,kw,mood,bg in members)
cat=f'<div class="m" style="background:#f8e8d8"><svg viewBox="0 0 260 310" width="170" height="203">{toffee("spark")}</svg><div><h3>Toffee</h3><b>The cat who gets it</b><p>Amara\'s kitten. Silent judge of everyone, best hugger in the group.</p></div></div>'
html=f'''<html><head><style>*{{box-sizing:border-box;margin:0}}body{{width:1600px;font-family:Poppins,sans-serif;background:#fffaf5;color:#2a2438;padding:50px}}
.hero{{background:linear-gradient(#ffe9d6,#fff6ee);border-radius:30px;padding:30px 40px 10px;text-align:center}}
.brand{{font-family:Lora,serif;font-weight:700;font-size:84px}}.tag{{font-size:28px;color:#555;margin-top:4px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px}}.m{{display:flex;gap:16px;align-items:center;border-radius:22px;padding:14px 20px}}
.m h3{{font-family:Lora,serif;font-size:34px}}.m b{{font-size:19px;color:#c2577a}}.m p{{font-size:19px;color:#444;margin-top:4px}}</style></head><body>
<div class="hero"><div class="brand">The Soft Squad</div><div class="tag">Four friends, one cat, and every feeling you've ever had.</div>
<svg viewBox="0 0 1180 340" width="1180" height="340"><g transform="translate(20,10)">{group}</g><g transform="translate(940,170) scale(.55)">{toffee("happy")}</g></svg></div>
<div class="grid">{cards}{cat}<div class="m" style="background:#fff;display:block"><h3>Why it works</h3><p>Every viewer finds "their" character, so comments fill up with "I'm Milo 😭". Funny skits, emotional moments and feel-good endings all fit one channel.</p></div></div></body></html>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1600,"height":900})
        await pg.set_content(html); await pg.wait_for_timeout(400)
        await pg.screenshot(path="the-soft-squad.png",full_page=True); await b.close()
asyncio.run(main())
