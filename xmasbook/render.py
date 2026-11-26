import asyncio,subprocess,sys,os
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
async def go(out,secs,fps=30,still=None):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1440,"height":2560})
        msgs=[];pg.on("pageerror",lambda e:msgs.append(str(e)))
        await pg.goto("file://"+HERE+"/xmasbook.html",timeout=180000)
        await pg.evaluate("document.fonts.load('italic 500 70px Corm')");await pg.wait_for_timeout(300);await pg.evaluate("draw(0)")
        OFF=float(os.environ.get("TOFF","0"));await pg.evaluate(f"window.TOFF={OFF};window.CAMP={os.environ.get('CAMP','60')};"+(f"window.CAP={os.environ['CAP']};" if os.environ.get("CAP") else ""))
        if msgs: print("ERR",msgs)
        if still is not None:
            for t in still:
                await pg.evaluate(f"draw({t+OFF})");await pg.screenshot(path=f"{out}_{t}.jpg",type="jpeg",quality=92)
        else:
            ff=subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","image2pipe","-framerate",str(fps),"-i","-","-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",out+".tmp.mp4"],stdin=subprocess.PIPE)
            for i in range(int(secs*fps)):
                await pg.evaluate(f"draw({i/fps+OFF})");ff.stdin.write(await pg.screenshot(type="jpeg",quality=94))
            ff.stdin.close();ff.wait();os.replace(out+".tmp.mp4",out)
        await b.close()
if sys.argv[1]=="stills": asyncio.run(go(sys.argv[2],0,still=[float(x) for x in sys.argv[3].split(",")]))
else: asyncio.run(go(sys.argv[2],float(sys.argv[3])))
