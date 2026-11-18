import asyncio,os
from playwright.async_api import async_playwright
async def go():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":2560,"height":1440})
        await pg.goto("file://"+os.path.abspath("banner_amb.html"))
        await pg.evaluate("document.fonts.load(\"italic 500 150px Corm\")");await pg.wait_for_timeout(400)
        await pg.evaluate("render()");await pg.locator('canvas').screenshot(path="softambience-banner.png")
        await b.close()
asyncio.run(go())
