#!/usr/bin/env python3
"""Veo test pipeline for the food channel ("butter at the spa").

Usage:
  python3 food/veo/veo.py models                 # list available Veo models (access check)
  python3 food/veo/veo.py gen OUTDIR [N_TAKES]   # generate takes (default 2), poll, download
  python3 food/veo/veo.py stills TAKE.mp4        # export review stills (5 moments)
  python3 food/veo/veo.py caption IN.mp4 OUT.mp4 # add caption, H.264 1080x1920 + AAC

Needs GEMINI_API_KEY in the environment and generativelanguage.googleapis.com
allowed in the cloud environment's network settings. The key is never printed.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error

BASE = "https://generativelanguage.googleapis.com/v1beta"
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PREFER = ["veo-3.1-fast-generate-preview", "veo-3.1-fast-generate-001",
          "veo-3.1-generate-preview", "veo-3.1-generate-001"]

PROMPT = (
    "Photorealistic macro food cinematography, vertical 9:16, 8 seconds. "
    "A cosy home kitchen at night. A small rectangular pat of golden, slightly glossy butter with a tiny, "
    "cute, content face pressed softly into its surface - two gently closed crescent eyes and a small "
    "blissful smile, nothing else - slides slowly into a hot black cast-iron pan sitting flat on a gas "
    "burner. It settles, leans back and slowly melts in total bliss; tiny golden bubbles foam around its "
    "edges like a little hot tub, and soft wisps of steam curl upward. The face stays the same single face "
    "and softens as it melts. Warm tungsten practical light from above the stove, faint blue window glow "
    "and rain-blurred bokeh in the background, shallow depth of field, rich realistic textures of seasoned "
    "cast iron and melting butter. Slow, gentle push-in camera. "
    "Audio: soft steady sizzle and gentle bubbling, a faint rain patter, and one tiny contented sigh "
    "as the butter settles. No music, no speech, no text, no people, no hands."
)
VARIANT = (
    " Seen from a low three-quarter angle at pan level, the butter's bliss reads like someone sinking into "
    "a warm bath after a long day."
)
NEG = "text, captions, watermark, logo, people, hands, extra faces, multiple faces, teeth, open mouth, distorted face, cartoon, 3D render look"


def key():
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        sys.exit("GEMINI_API_KEY is not set in this environment")
    return k


def call(method, url, body=None):
    req = urllib.request.Request(url, method=method, headers={"x-goog-api-key": key(),
                                 "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:800]}")


def veo_models():
    out, tok = [], ""
    while True:
        d = call("GET", f"{BASE}/models?pageSize=200" + (f"&pageToken={tok}" if tok else ""))
        out += [m["name"].split("/")[-1] for m in d.get("models", []) if "veo" in m["name"]]
        tok = d.get("nextPageToken")
        if not tok:
            return out


def pick(models):
    for p in PREFER:
        if p in models:
            return p
    fast = [m for m in models if "3.1" in m and "fast" in m] or [m for m in models if "3.1" in m]
    if not fast:
        sys.exit(f"No Veo 3.1 model available: {models}")
    return sorted(fast)[-1]


def gen(outdir, n=2):
    os.makedirs(outdir, exist_ok=True)
    model = pick(veo_models())
    print("model:", model)
    ops = []
    for i in range(n):
        body = {"instances": [{"prompt": PROMPT + (VARIANT if i % 2 else "")}],
                "parameters": {"aspectRatio": "9:16", "resolution": "1080p", "durationSeconds": 8,
                               "negativePrompt": NEG, "seed": 1101 + i * 37}}
        op = call("POST", f"{BASE}/models/{model}:predictLongRunning", body)
        print("take", i + 1, "op:", op["name"])
        ops.append(op["name"])
    for i, name in enumerate(ops):
        while True:
            d = call("GET", f"{BASE}/{name}")
            if d.get("done"):
                break
            time.sleep(10)
        if "error" in d:
            print("take", i + 1, "error:", d["error"]); continue
        resp = d["response"].get("generateVideoResponse", d["response"])
        if resp.get("raiFilteredReasons"):
            print("take", i + 1, "filtered:", resp["raiFilteredReasons"])
        for s in resp.get("generatedSamples", []):
            uri = s["video"]["uri"]
            dst = os.path.join(outdir, f"take{i + 1}.mp4")
            req = urllib.request.Request(uri, headers={"x-goog-api-key": key()})
            with urllib.request.urlopen(req, timeout=300) as r, open(dst, "wb") as f:
                f.write(r.read())
            print("saved", dst)
    json.dump({"model": model, "prompt": PROMPT, "variant": VARIANT, "takes": n},
              open(os.path.join(outdir, "meta.json"), "w"), indent=1)


def stills(path):
    base = os.path.splitext(path)[0]
    for t in (0.2, 2.0, 4.0, 6.0, 7.8):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t), "-i", path,
                        "-frames:v", "1", f"{base}_{t:.1f}s.png"], check=True)
    print("stills written next to", path)


def font_ttf():
    ttf = os.path.join(HERE, "cormorant-italic.ttf")
    if not os.path.exists(ttf):
        from fontTools.ttLib import TTFont
        f = TTFont(os.path.join(ROOT, "fonts", "cormorant-garamond-latin-500-italic.woff2"))
        f.flavor = None
        f.save(ttf)
    return ttf


def caption(src, dst):
    ttf = font_ttf()
    # fade: fully visible from frame 0, hold to 4.2 s, fade out by 5.2 s
    alpha = "if(lt(t,4.2),1,if(lt(t,5.2),1-(t-4.2),0))"
    def line(txt, y, glow):
        c = "0xFFD9A0" if glow else "0xFFF8F0"
        s = (f"drawtext=fontfile={ttf}:text='{txt}':fontsize=82:fontcolor={c}:"
             f"x=(w-text_w)/2:y={y}:alpha='{alpha}'")
        return s
    # warm glow layer (blurred, warm) under crisp soft-white text
    glow = f"[0:v]scale=1080:1920:flags=lanczos,setsar=1,split[a][b];" \
           f"[b]drawbox=c=black@1:t=fill,{line('me after a hot shower', 300, 1)},{line('on a long week', 400, 1)}," \
           f"gblur=sigma=14,colorchannelmixer=aa=0.9[g];" \
           f"[a][g]blend=all_mode=screen:all_opacity=0.55[c];" \
           f"[c]{line('me after a hot shower', 300, 0)},{line('on a long week', 400, 0)}[v]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-filter_complex", glow,
                    "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-crf", "18", "-preset", "slow",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", dst],
                   check=True)
    print("captioned:", dst)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "models"
    if cmd == "models":
        print("\n".join(veo_models()) or "no Veo models listed")
    elif cmd == "gen":
        gen(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 2)
    elif cmd == "stills":
        stills(sys.argv[2])
    elif cmd == "caption":
        caption(sys.argv[2], sys.argv[3])
