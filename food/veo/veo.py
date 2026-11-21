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
  python3 food/veo/veo.py frame OUT.png [EDIT PREV_ID]  # 2K 9:16 start frame (Nano Banana 2.1)
  python3 food/veo/veo.py animate FRAME.png OUTDIR      # Omni image-to-video, one take
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
            "background": False, "store": True, "stream": False}  # URI delivery requires store=true
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


IMG_MODEL = "gemini-nano-banana-2.1"  # ~$0.05 per 2K image (Nov 2026)
FRAME_PROMPT = (
    "Photorealistic macro food photograph, vertical 9:16, shot on a full-frame camera with a 100mm macro "
    "lens at f/2.8. A cosy home kitchen at night. A well-seasoned, real black cast-iron skillet sits flat "
    "and level on the grate of a gas hob; exactly one long cast-iron handle is visible, extending out of "
    "frame to the lower right; the pan has a single smooth round rim (no spouts). Under it, a gas burner "
    "shows a ring of small separate blue flame jets with orange tips. Resting on the inner edge of the "
    "skillet, just about to slide down into the pan, is one small rectangular pat of fresh golden butter, "
    "real butter texture with soft slightly glossy edges. On the butter's top face there is one tiny, cute, "
    "clean face gently pressed into the butter: two softly closed crescent eyes curving downward and one "
    "small content smile, a faint warm blush on each cheek. Nothing else on the butter: no eyebrows, no "
    "extra lines, no nose, no marks. The pan surface is hot with a faint shimmer; only a few very faint, "
    "thin, low wisps of steam just above the pan surface, nothing curly or stylised. Warm tungsten light "
    "from a range-hood lamp above (lamp itself out of frame), a rainy window glowing deep blue in the "
    "softly blurred background with raindrops on the glass, a few blurred jars and a wooden spoon pot on "
    "the counter far behind. Shallow depth of field, butter and pan rim tack sharp, rich realistic "
    "textures. Leave calm, darker, uncluttered space in the top quarter of the frame. No text, no people, "
    "no hands, no utensils touching the butter, no cartoon or 3D-render look."
)
I2V_PROMPT = (
    "Use this image as the exact first frame and animate it as one single continuous, unbroken shot, no "
    "scene cuts, photorealistic macro food footage. The pat of butter slowly slides off the inner edge of "
    "the cast-iron skillet down onto the hot pan surface and settles there like someone sinking into a hot "
    "tub after a long week. Over the eight seconds it visibly softens, slumps and shrinks: its edges round "
    "off, it loses height, and it spreads into a pool of foamy, gently bubbling melted golden butter, so "
    "by the end it is a small soft rounded mound sitting in a wide foamy pool. Its tiny face stays intact, "
    "the same single face the whole time: softly closed crescent eyes and a small blissful smile, sinking "
    "lower but never distorting, splitting or gaining extra marks. Only faint, thin, low wisps of steam "
    "rise just above the pan. The gas flame jets flicker gently. Camera: very slow, gentle push-in toward "
    "the butter, steady, no shake. Keep the warm night-kitchen lighting and the rainy blue window. "
    "Sound design: a soft sizzle that begins exactly as the butter touches the pan and builds into gentle "
    "bubbling, faint rain on the window, and one tiny, soft, contented sigh as the butter settles. "
    "No music, no dialogue, no speech. No text, no people, no hands, no extra faces, no curly cartoon steam."
)


def _interact(body, timeout=600):
    return call("POST", f"{BASE}/interactions", body, timeout=timeout)


def _save_image(d, dst):
    import base64
    for step in d.get("steps", []):
        if step.get("type") == "model_output":
            for c in step.get("content", []):
                if c.get("type") == "image" and c.get("data"):
                    open(dst, "wb").write(base64.b64decode(c["data"]))
                    return True
    return False


def _img_cost(u):
    u = u or {}
    out = sum(m.get("tokens", 0) for m in u.get("output_tokens_by_modality", []) if m.get("modality") == "image")
    txt = u.get("total_output_tokens", 0) - out + u.get("total_thought_tokens", 0)
    return out * 30e-6 + txt * 7.5e-6 + u.get("total_input_tokens", 0) * 1.5e-6


def frame(dst, instruction=None, prev=None):
    """Make (or, with prev = previous interaction id, edit) a still: 2K 9:16 by default
    (env IMG_AR e.g. 16:9 / 1:1, IMG_SIZE 1K/2K/4K). instruction='@file.txt' reads the prompt from a file."""
    if instruction and instruction.startswith("@"):
        instruction = open(instruction[1:]).read().strip()
    ok, msg = probe(IMG_MODEL)
    if not ok:
        sys.exit(f"{IMG_MODEL} not available (nothing spent): {msg}")
    body = {"model": IMG_MODEL, "input": instruction or FRAME_PROMPT,
            "response_format": {"type": "image", "mime_type": "image/jpeg",
                                "aspect_ratio": os.environ.get("IMG_AR", "9:16"),
                                "image_size": os.environ.get("IMG_SIZE", "2K")}}
    if prev:
        body["previous_interaction_id"] = prev
    d = _interact(body)
    if not _save_image(d, dst):
        sys.exit(f"no image returned: status {d.get('status')}, " +
                 json.dumps([s.get("type") for s in d.get("steps", [])]))
    cost = _img_cost(d.get("usage"))
    print(f"saved {dst}  id={d.get('id')}  ~${cost:.3f}")
    with open(os.path.splitext(dst)[0] + ".json", "w") as f:
        json.dump({"id": d.get("id"), "usage": d.get("usage"), "prompt": body["input"], "prev": prev,
                   "cost_usd": round(cost, 4)}, f, indent=1)


def animate(img, outdir):
    """Image-to-video: one Omni take from a start frame (8 s, 1080p, 9:16)."""
    import base64
    res, dur = os.environ.get("OMNI_RES", "1080p"), int(os.environ.get("OMNI_DUR", "8"))
    cap, est = float(os.environ.get("MAX_USD", "1.00")), estimate(1, dur, res)
    if est > cap:
        sys.exit(f"estimate ${est:.2f} is above MAX_USD ${cap:.2f}; nothing sent")
    model = pick()
    os.makedirs(outdir, exist_ok=True)
    mime = "image/png" if img.lower().endswith(".png") else "image/jpeg"
    body = {"model": model,
            "input": [{"type": "image", "data": base64.b64encode(open(img, "rb").read()).decode(),
                       "mime_type": mime},
                      {"type": "text", "text": I2V_PROMPT}],
            "generation_config": {"video_config": {"task": "image_to_video"}},
            "response_format": {"type": "video", "aspect_ratio": "9:16", "duration": f"{dur}s",
                                "resolution": res, "delivery": "uri"},
            "background": False, "store": True, "stream": False}
    if os.environ.get("I2V_FILE"):  # per-shot prompt for skits
        body["input"][1]["text"] = open(os.environ["I2V_FILE"]).read().strip()
    print(f"model: {model}  1 x {dur}s {res} 9:16 from {os.path.basename(img)}  ~${est:.2f} + thinking")
    t0 = time.time()
    d = _interact(body, timeout=900)  # no automatic retry: a timed-out call may still be billed
    v = video_part(d)
    meta = {k: v2 for k, v2 in d.items() if k != "steps"}
    meta["seconds"] = round(time.time() - t0)
    json.dump({"model": model, "prompt": body["input"][1]["text"], "frame": img, "response": meta},
              open(os.path.join(outdir, "meta.json"), "w"), indent=1)
    if not v:
        sys.exit(f"no video returned: status {d.get('status')}")
    dst = os.path.join(outdir, "take.mp4")
    if v.get("data"):
        open(dst, "wb").write(base64.b64decode(v["data"]))
    else:
        req = urllib.request.Request(v["uri"], headers={"x-goog-api-key": key()})
        for _ in range(60):
            try:
                with urllib.request.urlopen(req, timeout=300) as r, open(dst, "wb") as f:
                    f.write(r.read())
                break
            except urllib.error.HTTPError as e:
                if e.code not in (404, 409, 425, 503):
                    raise
                time.sleep(5)
    print(f"saved {dst} ({meta['seconds']} s)  usage: {json.dumps(d.get('usage'))}")


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
    y1 = int(os.environ.get("CAP_Y", "170"))  # top line; keep clear of the subject's path
    y2 = y1 + 100
    # fade: fully visible from frame 0, hold to 4.2 s, fade out by 5.2 s
    alpha = "if(lt(t,4.2),1,if(lt(t,5.2),1-(t-4.2),0))"
    def line(txt, y, kind):
        c = {"glow": "0xFFD9A0", "text": "0xFFF8F0", "shadow": "0x1A0E06"}[kind]
        return (f"drawtext=fontfile={ttf}:text='{txt}':fontsize=82:fontcolor={c}:"
                f"x=(w-text_w)/2:y={y}:alpha='{alpha}'")
    def both(kind):
        return f"{line('me after a hot shower', y1, kind)},{line('on a long week', y2, kind)}"
    # 1) soft dark shadow (blurred, alpha) so the words read over bright windows and steam;
    # 2) warm glow (blurred, screen-blended); 3) crisp soft-white text on top.
    # Blend in RGB (gbrp): blending YUV planes shifts the chroma and turns the frame purple.
    glow = f"[0:v]scale=1080:1920:flags=lanczos,setsar=1,format=gbrp,split=3[a][b][s];" \
           f"[s]format=rgba,colorchannelmixer=aa=0,{both('shadow')},gblur=sigma=16,colorchannelmixer=aa=0.75[sh];" \
           f"[a][sh]overlay=format=auto,format=gbrp[a2];" \
           f"[b]drawbox=c=black@1:t=fill,{both('glow')},gblur=sigma=14[g];" \
           f"[a2][g]blend=all_mode=screen:all_opacity=0.55[c];" \
           f"[c]{both('text')},format=yuv420p[v]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-filter_complex", glow,
                    "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-crf", "18", "-preset", "slow",
                    "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000",
                    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", dst],
                   check=True)
    print("captioned:", dst)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "models"
    if cmd == "models":
        print("would use:", pick())
    elif cmd == "gen":
        gen(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 2)
    elif cmd == "frame":   # frame OUT.png [EDIT_INSTRUCTION PREV_ID]
        frame(sys.argv[2], *(sys.argv[3:5]))
    elif cmd == "animate":  # animate FRAME.png OUTDIR
        animate(sys.argv[2], sys.argv[3])
    elif cmd == "stills":
        stills(sys.argv[2])
    elif cmd == "caption":
        caption(sys.argv[2], sys.argv[3])
