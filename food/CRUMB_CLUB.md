# Crumb Club — channel playbook

Faceless YouTube Shorts channel (4th brand). **A funny food world: the food is alive, has feelings and little dramas, and the humans never notice.** Photoreal, made with Google's models through the Gemini API (`food/veo/veo.py`).

## What the channel is
Charity's words: "very spontaneous, different foods, different relatable things… it has to get traction, engagement and a lot of subscribers." Generic and fun, not an emotions channel.

Three kinds of video, rotated freely:
1. **Kitchen chaos (comedy skits, 15–30 s, 2–3 shots).** A cosy, confident home cook (woman, man, couple, family) cooks happily while the ingredients are secretly alive and trying to escape. The cook never notices. Example (Charity's idea): she tosses things into the pot like a pro; the corn cob sneaks off, falls under the table; she looks around, finds it under the table and uses it anyway while it screams; at the end she tastes it and makes the "…oh no, this doesn't taste nice" face. The audience knows what the cook doesn't — that's the joke.
2. **Food moments (8–15 s, one shot).** Foods living human moments: butter at the spa after a long week, the last popcorn kernel that won't pop, leftovers partying in the fridge until the light comes on.
3. **Food in love (8–15 s).** Marshmallow sinking into hot chocolate, cookie dunked in warm milk, two dumplings cuddling in the steamer, toast and butter. Sweet and tender (cuddles, hugs, leaning on each other, forehead kisses) — **never sexual or innuendo**.

Also: holidays and moments (Thanksgiving family cooking with an escaping turkey, Christmas cookies, New Year's diet). Different foods from all over the world.

## Tone rules
- Slapstick, not distressing: screaming, running, dramatic faces, playing dead are fine; no gore, no real pain, nothing disturbing. Family-friendly in spirit (but `madeForKids: false`).
- Food faces: one clean, cute, consistent face per food (expressive eyes, small mouth); no extra marks, no sticker look.
- Humans: warm, natural, cosy home clothes; the same person must look the same in every shot of a video.
- Physical logic as always (CLAUDE.md Rule #1): pans with handles on burners, separate gas jets, faint realistic steam, nothing floating at frame one.
- Caption hook: short, lowercase, funny, on screen from frame one (Cormorant italic for soft pieces; for comedy skits a bolder clean caption is fine).

## How to make one (proven 18 Nov 2026)
1. **Start frame first**: make a 9:16 still with the image model (Nano Banana) and fix it until nothing is out of place. Fixing a still costs pennies; fixing video costs ~$0.84 per take.
2. **Animate** the approved still with Gemini Omni Flash (`gemini-omni-1.2-flash`, Interactions API, `store=true`, 1080p in one call, 3–15 s). For skits, make one start frame per shot from a reference sheet of the cook + kitchen so they stay consistent, then stitch the shots.
3. "What's out of place?" review (separate reviewer agent, stills from 4+ moments), caption, loudness-normalise (−16 LUFS), H.264 1080×1920 + AAC.
4. Cost: ~$0.85–1.25 per single-shot video, ~$1.50–3 per skit. Cap $3/day unless Charity raises it. Never auto-retry a paid call.

**Environment:** these runs need Charity's **Default** cloud environment (it has `GEMINI_API_KEY` and Google's domains allowed). Scheduled tasks inherit the environment of the session that creates them, so create Crumb Club tasks from a Default session.

## Publishing
- Disclose as altered/synthetic content (photoreal AI): `isAiGeneratedContent: true` for this channel (unlike the other three).
- Cadence to start: 1/day around 02:00 Lagos (US evening). Ramp with data.
- Launch piece: Thanksgiving family-cooking skit with the escaping turkey (Thanksgiving is Thu 26 Nov 2026), posted 24–25 Nov.

## First ideas backlog
- Corn escapes under the table (Charity's original skit)
- Egg trying not to get cracked → omelette, furious
- Dad's BBQ: sausages playing dead
- Salt shaker overdoes it on purpose (explains the "doesn't taste nice" face)
- 3am fridge: leftovers party until the light comes on
- Butter at the spa (done — the approved test)
- Marshmallow + hot chocolate: "when he finally texts back"
- Pancake flipped too early
- Thanksgiving: turkey keeps escaping between shots; guests arrive to a sweaty turkey
