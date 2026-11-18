import asyncio
from playwright.async_api import async_playwright
async def go():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        pg=await b.new_page()
        await pg.set_content("<canvas id=c></canvas><script>const g=document.getElementById('c').getContext('webgl2');document.title=g?('ok '+g.getParameter(g.VERSION)+' | '+g.getParameter(g.getExtension('WEBGL_debug_renderer_info')?.UNMASKED_RENDERER_WEBGL||g.RENDERER)):'no webgl'</script>")
        print(await pg.title()); await b.close()
asyncio.run(go())
