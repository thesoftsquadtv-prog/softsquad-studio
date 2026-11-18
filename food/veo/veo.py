#!/usr/bin/env python3
"""AI video test pipeline for the food channel ("butter at the spa").

Veo was retired from the Gemini API on 22 Oct 2026; this now uses Gemini Omni Flash
(gemini-omni-1.2-flash) through the Interactions API: POST /v1beta/interactions with
response_format {type: video, aspect_ratio, duration "3s".."15s", resolution 360p|720p|1080p|4k,
delivery: uri}. 1080p/4K are upscaled by Google inside the same call (no separate step).
Omni has no negative-prompt field: write "no X" into the prompt itself.
Pricing (Nov 2026, paid tier): video output $12 / 1M tokens; 720p 5,792 tok/s (~$0.07/s),
1080p 8,688 tok/s (~$0.104/s), 4K 17,376 tok/s (~$0.209/s); thinking billed at $9 / 1M.

Usage:
  python3 food/veo/veo.py models                 # check the Omni model is available (free)
  python3 food/veo/veo.py gen OUTDIR [N_TAKES]   # generate takes (default 2) and download
  python3 food/veo/veo.py stills TAKE.mp4        # export review stills (5 moments)
  python3 food/veo/veo.py caption IN.mp4 OUT.mp4 # add caption, H.264 1080x1920 + AAC

Env: GEMINI_API_KEY (never printed); OMNI_RES (default 1080p), OMNI_DUR (default 8),
MAX_USD (default 3.00: refuses to start if the estimate is above it).
Needs generativelanguage.googleapis.com allowed in the environment's network settings.
"""
import json, os, subprocess, sys, time, threading, urllib.request, urllib.error

BASE = "https://generativelanguage.googleapis.com/v1beta"
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PREFER = ["gemini-omni-1.2-flash", "gemini-omni-1.1-flash"]
TOK_PER_S = {"360p": 1931, "720p": 5792, "1080p": 8688, "4k": 17376}
USD_VIDEO_TOK, USD_TEXT_TOK = 12.0 / 1e6, 9.0 / 1e6

PROMPT = (
    "A single continuous, unbroken shot with no scene cuts. Photorealistic macro food cinematography. "
    "A cosy home kitchen at night. A small rectangular pat of golden, slightly glossy butter has one tiny, "
    "cute, content face softly pressed into its top surface: two gently closed crescent eyes and a small "
    "blissful closed-mouth smile, nothing else on it. The butter slides slowly down into a hot black "
    "seasoned cast-iron pan that sits flat and level on a gas burner with a low blue flame. It settles, "
    "leans back and slowly melts in total bliss, like someone sinking into a hot tub after a long week: "
    "tiny golden bubbles foam and fizz around its softening edges, and soft wisps of steam curl upward. "
    "It is always the same single face, and it softens as the butter melts. Warm tungsten light from a "
    "hood lamp above the stove, a faint blue rainy window glow far behind, creamy bokeh, shallow depth of "
    "field, rich realistic textures of cast iron and melting butter. Slow, gentle push-in camera. "
    "Sound design: a soft steady sizzle and gentle bubbling, faint rain on the window, and one tiny, "
    "contented little sigh as the butter settles into the pan. No music, no dialogue, no speech. "
    "No text, no captions, no logos, no people, no hands, no utensils moving, no extra faces, no teeth, "
    "no open mouth, no cartoon or 3D-render look."
)
VARIANT = (
    " Camera angle: a low three-quarter view at the level of the pan rim, so the butter's face is seen "
    "clearly as it leans back."
)


def key():
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        sys.exit("GEMINI_API_KEY is not set in this environment")
    return k


def call(method, url, body=None, timeout=120):
    req = urllib.request.Request(url, method=method, headers={"x-goog-api-key": key(),
                                 "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode()[:1200]}")


def probe(name):
    """GET one model directly; returns (ok, Google's exact message). Never spends money."""
    try:
        d = call("GET", f"{BASE}/models/{name}", timeout=60)
        return True, ",".join(d.get("supportedGenerationMethods", []))
    except RuntimeError as e:
        return False, str(e)


def pick():
    msgs = []
    for p in PREFER:
        ok, msg = probe(p)
        if ok:
            return p
        msgs.append(f"{p}: {msg}")
    sys.exit("No Gemini Omni Flash model available to this key (nothing generated, nothing spent):\n  "
             + "\n  ".join(msgs))


def estimate(n, dur, res):
    return n * dur * TOK_PER_S[res] * USD_VIDEO_TOK


def video_part(d):
    for step in d.get("steps", []):
        if step.get("type") == "model_output":
            for c in step.get("content", []):
                if c.get("type") == "video":
                    return c
    return None


def one_take(i, model, res, dur, outdir, log):
    body = {"model": model, "input": PROMPT + (VARIANT if i % 2 else ""),
            "response_format": {"type": "video", "aspect_ratio": "9:16", "duration": f"{dur}s",
                                "resolution": res, "delivery": "uri"},
            "background": False, "store": False, "stream": False}
    t0 = time.time()
    try:  # no automatic retry: a timed-out call may still be billed
        d = call("POST", f"{BASE}/interactions", body, timeout=900)
    except Exception as e:
        log[i] = {"error": str(e)}; print(f"take {i + 1} error: {e}"); return
    meta = {k: v for k, v in d.items() if k != "steps"}
    meta["steps"] = [{**s, "content": [{k: (v if k != "data" else f"<{len(v)} b64 chars>")
                                         for k, v in c.items()} for c in s.get("content", [])]}
                     for s in d.get("steps", [])]
    meta["seconds"] = round(time.time() - t0)
    log[i] = meta
    v = video_part(d)
    dst = os.path.join(outdir, f"take{i + 1}.mp4")
    if not v:
        print(f"take {i + 1}: no video returned (status {d.get('status')})"); return
    if v.get("data"):
        import base64
        open(dst, "wb").write(base64.b64decode(v["data"]))
    else:
        req = urllib.request.Request(v["uri"], headers={"x-goog-api-key": key()})
        for _ in range(60):  # file may still be processing
            try:
                with urllib.request.urlopen(req, timeout=300) as r, open(dst, "wb") as f:
                    f.write(r.read())
                break
            except urllib.error.HTTPError as e:
                if e.code not in (404, 409, 425, 503):
                    raise
                time.sleep(5)
    print(f"take {i + 1} saved {dst} ({meta['seconds']} s)")


def gen(outdir, n=2):
    os.makedirs(outdir, exist_ok=True)
    res, dur = os.environ.get("OMNI_RES", "1080p"), int(os.environ.get("OMNI_DUR", "8"))
    cap, est = float(os.environ.get("MAX_USD", "3.00")), estimate(n, dur, res)
    if est > cap:
        sys.exit(f"estimate ${est:.2f} is above MAX_USD ${cap:.2f}; nothing sent")
    model = pick()  # free availability check before any paid call
    print(f"model: {model}  {n} x {dur}s {res} 9:16  video estimate ~${est:.2f} (+ thinking tokens)")
    log = [None] * n
    ts = [threading.Thread(target=one_take, args=(i, model, res, dur, outdir, log)) for i in range(n)]
    [t.start() for t in ts]; [t.join() for t in ts]
    json.dump({"model": model, "resolution": res, "duration": dur, "prompt": PROMPT, "variant": VARIANT,
               "responses": log}, open(os.path.join(outdir, "meta.json"), "w"), indent=1)
    print("usage:", json.dumps([(r or {}).get("usage") for r in log]))


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
    # warm glow layer (blurred, warm) under crisp soft-white text; blend in RGB (gbrp),
    # blending YUV planes shifts the chroma and turns the whole frame purple
    glow = f"[0:v]scale=1080:1920:flags=lanczos,setsar=1,format=gbrp,split[a][b];" \
           f"[b]drawbox=c=black@1:t=fill,{line('me after a hot shower', 300, 1)},{line('on a long week', 400, 1)}," \
           f"gblur=sigma=14[g];" \
           f"[a][g]blend=all_mode=screen:all_opacity=0.55[c];" \
           f"[c]{line('me after a hot shower', 300, 0)},{line('on a long week', 400, 0)},format=yuv420p[v]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-filter_complex", glow,
                    "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-crf", "18", "-preset", "slow",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", dst],
                   check=True)
    print("captioned:", dst)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "models"
    if cmd == "models":
        print("would use:", pick())
    elif cmd == "gen":
        gen(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 2)
    elif cmd == "stills":
        stills(sys.argv[2])
    elif cmd == "caption":
        caption(sys.argv[2], sys.argv[3])
