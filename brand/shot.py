import asyncio
from playwright.async_api import async_playwright
async def go():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":800,"height":800})
        import os;await pg.goto("file://"+os.path.abspath("logos.html"))
        await pg.evaluate("document.fonts.load(\"italic 500 92px Corm\")");await pg.wait_for_timeout(300)
        for n in range(3):
            await pg.evaluate(f"render({n})");await pg.locator('canvas').screenshot(path=f"opt{n+1}.png")
        await b.close()
asyncio.run(go())
