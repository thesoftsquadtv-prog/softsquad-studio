import asyncio,subprocess,sys,os
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
PAGE=os.environ.get("PAGE","dough.html")
ARGS=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
async def go(out,secs,fps=30,still=None):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=ARGS)
        pg=await b.new_page(viewport={"width":1440,"height":2560})
        errs=[];pg.on("pageerror",lambda e:errs.append(str(e)));pg.on("console",lambda m:errs.append(m.text) if m.type=="error" else None)
        await pg.goto("file://"+HERE+"/"+PAGE,timeout=300000)
        await pg.evaluate("document.fonts.load('italic 500 100px Corm')");await pg.wait_for_timeout(500)
        if errs: print("ERR",errs[:5])
        if still is not None:
            for t in still:
                await pg.evaluate(f"draw({t})");await pg.screenshot(path=f"{out}_{t}.jpg",type="jpeg",quality=92)
        else:
            ff=subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","image2pipe","-framerate",str(fps),"-i","-","-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",out+".tmp.mp4"],stdin=subprocess.PIPE)
            for i in range(int(secs*fps)):
                await pg.evaluate(f"draw({i/fps})");ff.stdin.write(await pg.screenshot(type="jpeg",quality=94))
            ff.stdin.close();ff.wait();os.replace(out+".tmp.mp4",out)
        await b.close()
if sys.argv[1]=="stills": asyncio.run(go(sys.argv[2],0,still=[float(x) for x in sys.argv[3].split(",")]))
else: asyncio.run(go(sys.argv[2],float(sys.argv[3])))
