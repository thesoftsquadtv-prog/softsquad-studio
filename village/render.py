import asyncio,subprocess,sys,os
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
async def go(mode,out,secs=30,fps=30,ts=None):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":2560,"height":1440})
        await pg.goto("file://"+HERE+"/"+os.environ.get("SCENE","scene.html"))
        if mode=="stills":
            for t in ts:
                await pg.evaluate(f"draw({t})"); await pg.screenshot(path=f"{out}_{t}.jpg",type="jpeg",quality=92)
        else:
            ff=subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","image2pipe","-framerate",str(fps),"-i","-","-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",out+".tmp.mp4"],stdin=subprocess.PIPE)
            for i in range(secs*fps):
                await pg.evaluate(f"draw({i/fps})"); ff.stdin.write(await pg.screenshot(type="jpeg",quality=94))
            ff.stdin.close(); ff.wait(); os.replace(out+".tmp.mp4",out)
        await b.close()
if sys.argv[1]=="stills": asyncio.run(go("stills",sys.argv[2],ts=[float(x) for x in sys.argv[3].split(",")]))
else: asyncio.run(go("video",sys.argv[2],secs=int(sys.argv[3])))
