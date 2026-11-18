import asyncio,subprocess,sys,os
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
SC=1080/810; CLIP={"x":445,"y":0,"width":810,"height":1440}
async def go(out,secs,fps=30,still=None):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":2560,"height":1440},device_scale_factor=SC)
        await pg.goto("file://"+HERE+"/cottages_short.html")
        await pg.evaluate("document.fonts.load('italic 500 62px Corm')");await pg.wait_for_timeout(300)
        if still is not None:
            for t in still:
                await pg.evaluate(f"draw({t})");await pg.screenshot(path=f"{out}_{t}.jpg",type="jpeg",quality=92,clip=CLIP)
        else:
            ff=subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","image2pipe","-framerate",str(fps),"-i","-","-vf","scale=1080:1920","-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",out+".tmp.mp4"],stdin=subprocess.PIPE)
            for i in range(int(secs*fps)):
                await pg.evaluate(f"draw({i/fps})");ff.stdin.write(await pg.screenshot(type="jpeg",quality=94,clip=CLIP))
            ff.stdin.close();ff.wait();os.replace(out+".tmp.mp4",out)
        await b.close()
if sys.argv[1]=="stills": asyncio.run(go(sys.argv[2],0,still=[float(x) for x in sys.argv[3].split(",")]))
else: asyncio.run(go(sys.argv[2],float(sys.argv[3])))
