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

## Running the channel (autonomous — Charity's standing approval, 18 Nov 2026)
Charity: "it doesn't need my permission to post, it should create a video every day and post it with funny titles, remember we want people to laugh and feel good."
- **Make one new video every day and schedule it yourself — a video goes out EVERY day.** No approval step. (Charity, 21 Nov: "don't be too strict with it so that videos can go out every day… you're talented, you don't have to try too hard to be great.") Work with the confidence of an experienced creator: plan it well, make it once, make it fun, ship it.
  - The review is a **polish pass, not a gate**. Only these are blockers that must be fixed before posting: a broken or melting face, extra/missing limbs or faces, a character turning into something else, unreadable/garbled text, a realistic human in a skit (the cook must be animated), or anything disturbing. Fix those with a cut, a crop, a freeze, a caption or one re-take.
  - Small imperfections (a slightly odd hand, a bit of stylised steam, a prop not quite right) are fine — note them in the log as lessons and post anyway.
  - If a skit still has a blocker after one fix within budget, post a simpler video instead (one shot, a food moment) — but never leave the day empty.
- **Accounts:** YouTube @thecrumbclub (UC_H2r0rLOvUhpxDi2N0CztQ); Metricool brand **8212990** (timezone Africa/Lagos).
- **Slot:** 19:00 Lagos daily (Charity: everything out by 19:00). Always `getScheduledPosts` for blogId 8212990 first; never double-post a day. If the next night is already filled, make the following night's video.
- **Order:** first post = the butter-at-the-spa video made 18 Nov (night of 18→19 Nov, 19:00). Then one new video per day. Thanksgiving turkey skit must post 24 or 25 Nov (Thanksgiving is Thu 26 Nov).
- **Variety:** rotate the three kinds (kitchen chaos, food moments, food in love) and different foods/cuisines; never the same food two days running; check the last 7 posts so nothing repeats (YouTube inauthentic-content policy). Ride the calendar (Thanksgiving, Christmas, New Year diets, Valentine's, Super Bowl snacks).

## Planned schedule (Charity, 20 Nov) — follow this before the free rotation
- ~~21 Nov corn skit (failed review; redo as an animated skit later)~~ — corn escapes under the table (Charity's original idea — cook tosses ingredients in confidently, corn sneaks off and falls under the table, she finds it and uses it anyway while it screams, tastes, "…oh no" face). Short punchy title, e.g. "the corn tried it 🌽".
- **24 Nov (Tue):** Thanksgiving skit: family cooking together, the turkey keeps escaping between shots, guests arrive to a very sweaty turkey. Title "happy thanksgiving 🦃".
- After that: a cooking/kitchen-chaos skit at least every 3rd day, food moments and food in love in between.

## Look of the cooking skits (Charity, 21 Nov) — IMPORTANT
- The cook must be an **animated, cute and funny cartoon person, NOT a realistic human.** Charity saw the 21 Nov corn skit with a photoreal woman and rejected it: "i expected the person cooking to be an animated person, that looks cute and funny".
- So kitchen-chaos skits are made **entirely in one original cute 3D-animated style** (whole scene, cook AND food): soft rounded shapes, big expressive eyes, exaggerated funny expressions and reactions, warm cosy kitchen, bright soft lighting, stylised textures. The food characters are cartoon too, so cook and food match. Our own original designs only — never imitate a specific studio's or film's characters, and never name a studio/film in prompts or titles.
- The cook is a recurring character with a fixed design sheet (make one reference image first and reuse it every skit so viewers recognise her/him). Comic timing: big oblivious smile while cooking, double-take, the "…oh no" face exaggerated.
- Single-food moments and food-in-love videos (butter at the spa, marshmallows) **stay photoreal** — no humans in them, and they're working.
- Disclosure: animated skits are still AI-generated → keep `isAiGeneratedContent: true` for Crumb Club.

## Creative director's standard (Charity, 21 Nov)
Work like an award-winning creator with 20 years of craft whose videos are unique and irresistible, and whose audience binges the whole page. Concretely:
- **A world, not random clips.** Crumb Club has a recurring cast with names and personalities so people come back for *them*:
  - **Mama Mo** — the cute, oblivious, overconfident cartoon home cook (fixed design sheet, apron, headwrap, huge proud smile). She never notices the food is alive.
  - **Corny** — the dramatic corn cob, always trying to escape, always gets caught. The channel's mascot (matches the profile picture).
  - **Eggbert** — the anxious egg who's terrified of the pan.
  - **Saltine** — the chaotic salt shaker who sabotages dishes on purpose (why everything tastes off).
  - Guest foods rotate (turkey, pancakes, dumplings…). Keep the cast's designs identical across videos (reference sheets in food/cast/).
- **Series + cliffhangers:** run short arcs ("Corny's great escape, part 1/2/3", "Eggbert vs the frying pan") ending on a tease ("part 2 tomorrow 👀") so people subscribe to see what happens. Pin a comment asking what should happen next and use the best answers.
- **A signature:** the same tiny sting sound on the title card and a recurring catchphrase/gag (Saltine's wink to camera, Corny's scream) so videos are recognisable in one second.
- **Binge design:** every ending loops or points to the next episode; titles of a series are numbered; ask Charity to add series playlists in YouTube Studio once 3+ episodes exist.
- **Variety inside the format:** alternate skits (Mama Mo's kitchen), food moments (photoreal, "me after…"), food in love, and seasonal specials — but the cast and tone stay consistent.
- **Self-critique like a pro:** before posting, ask "would I stop scrolling for this? would I watch it twice? would I send it to a friend?" If any answer is no, it isn't finished.

## Make people laugh (Charity, 21 Nov: "more effort… people need to watch and laugh, they need to be engaged")
Every video is a tiny comedy, not just a pretty clip. Before generating anything, write a **beat sheet** (shot by shot, with the second each beat lands) and check it against this list:
1. **Hook in the first second:** something is already happening (the corn already mid-escape, a scream, a ridiculous caption). Never open on a calm establishing shot.
2. **Relatable setup:** the joke is about something viewers live (cooking for the in-laws, pretending you can cook, Monday leftovers, diet starting "tomorrow").
3. **Escalation:** at least 2–3 beats that get bigger (corn sneaks → corn slips → corn hides → corn gets caught), not one gag.
4. **Twist / payoff at the end:** a punchline the viewer didn't see coming (she tastes it and it's the best thing she's ever made, and the corn is offended; or the salt shaker winks at camera). The last second should make people rewatch or comment.
5. **Big, readable reactions:** exaggerated faces, double-takes, side-eye at the camera, held for long enough to read on a phone.
6. **Sound sells the joke:** comic timing in audio: a tiny scream, a thud, a record-scratch pause, a gulp, a "boing". Silence just before the payoff.
7. **Caption = the joke's setup, not a description:** e.g. "me pretending i know what i'm doing in the kitchen", "the corn had other plans".
8. **Built to loop:** the last frame flows back into the first so people watch twice.
9. **Comment bait in the description:** a question people want to answer ("which ingredient would YOU save? 👇", "tag the friend who cooks like this").
10. **Reviewer's extra question:** besides "what's out of place?", ask a fresh reviewer: "Is this actually funny? Where's the laugh? Would you send it to a friend?" If the answer is no, punch it up (sharper caption, stronger reaction, better ending) before posting.

## Charity's notes on the corn skit (21 Nov) — how she wants a story told
- **Don't squeeze a story into 3 shots.** Show every beat that makes it funny: the corn **tiptoeing away scared** (glancing back, sweating), the **slip and fall** under the table, the cook **still cooking, oblivious**, "time for the corn" → **empty counter, double-take, search**, she **checks under the table, finds it, happy grin**, picks it up while it panics, **drops it in the pot (splash)**, the corn **floating in the soup, scared, staring up at her** while she stirs, she **tastes** it → **big dramatic reaction**. ~9 shots, 35–45 s, with sound effects on every beat.
- **Physical logic for the story:** once the corn is in the pot it is IN the pot (floating, scared), **not looking at the camera** like a narrator. Characters react to each other, not to us, unless the gag is a deliberate wink.
- **"Add more drama":** suspense music for the escape, slow-motion fall, dramatic music for the search, exaggerated taste reaction (eyes watering, cheeks puffing, fanning mouth).

## Skit lessons (21 Nov corn skit failed review 3×)
- Omni redraws a food character whenever it moves fast (face design changes, black-dot pupils, plush/felt look). Keep the food's on-screen motion **small and slow**; show fast action through a **cut or a sound** (e.g. a thud off-screen, then the corn already under the table).
- Spell out the face in **every** shot prompt (eye shape and colour: soft cocoa eyes with highlights, never black dots; mouth; where it sits on the food).
- Start the tasting shot with the spoon **already at her lips** so the "…oh no" face follows a visible taste.
- Test each shot at **720p** first (cheaper), then render the approved ones at 1080p.
- **What worked (21 Nov, 'the corn tried it'):** 3 shots × 6 s at 720p ($0.42 each), upscaled with lanczos (fine for the cartoon style), made the whole skit for $1.54. Shots 2 and 3 were made as edits of shot 1's frame (previous_interaction_id), which kept the cook and corn the same. End on a **freeze-frame of the peak reaction**, because Omni takes relax the face in the last second. Skit captions: Inter ExtraBold on a dark plate (`box=1`), with double spaces between words; a plain outline reads as a different font over dark shots.
- Skit-day budget: see the spend cap in "Running the channel" (Charity decides; default $3).

## Titles, descriptions, hashtags
Goal: people laugh, feel good, share and tag a friend.
- **Title** (≤ 60 chars, funny, plain words, at most 1 emoji, no clickbait lies, never "Ghibli"). Match the title to the kind of video (Charity, 18 Nov):
  - **Food moments & food in love → personal first-person** ("it should be personalized like 'me after…'"): "me after…", "me when…", "me trying to…", "POV: you're the…" so viewers see themselves in the food.
  - **Cooking / kitchen-chaos skits → NO "me after"**: short, punchy and funny, 2–6 words, or simply the occasion. E.g. "happy thanksgiving 🦃", "the corn tried it 🌽", "dinner had other plans", "he was not on the menu", "one ingredient got away". Examples —
  - "me after a hot shower on a long week 🧈" (first post, 18 Nov)
  - "the corn knew what was coming 🌽"
  - "nobody told the cook the egg had plans"
  - "me pretending I can cook for my in-laws"
- **Description:** one funny line + a question that invites comments ("which food would you rescue? 👇") + `Subscribe and join the Crumb Club 🌽` + 3–5 hashtags: `#shorts #funnyfood #foodcomedy` plus 1–2 specific (`#thanksgiving`, `#butter`).
- No Kindly Ledger link. No mention of Charity's country.

## Publishing (exact steps)
1. Final MP4: H.264 1080×1920, crf ~18–20, AAC, < 95 MB; filename `crumb-YYYYMMDD-slug.mp4`.
2. Attach + clone `thesoftsquadtv-prog/softsquad-media` (add_repo, push access), copy into `v/`, commit, `git -c push.negotiate=true push origin HEAD:main`.
3. Media URL: `https://raw.githubusercontent.com/thesoftsquadtv-prog/softsquad-media/main/v/<file>.mp4`.
4. Metricool `createScheduledPost`: blogId 8212990, providers YouTube only, publicationDate = the 19:00 Lagos slot (timezone Africa/Lagos), text = description, media = [URL], `youtubeData`: `{title, type: "short", privacy: "public", madeForKids: false, isAiGeneratedContent: true, category: "COMEDY"}` (fall back to ENTERTAINMENT if COMEDY is rejected). Check the response: media URL should become static.metricool.com. Then delete the file from `softsquad-media/v/` and push.
5. Log the post (date, title, idea, cost, review notes) by appending to `food/crumb_log.md` in softsquad-studio, commit + push. Never commit the key.
6. Report to Charity in 3–4 lines (SendUserMessage / push): what was posted and when, the cost, anything she must do.

**If Metricool tools aren't available in your run** (no `createScheduledPost`): don't stop. Push the finished MP4 to `softsquad-media/queue/crumb-YYYYMMDD-slug.mp4` plus a matching `.json` with `{"blogId":8212990,"publicationDate":"YYYY-MM-DDT19:00:00","timezone":"Africa/Lagos","title":...,"text":...,"category":"COMEDY"}`, log it as "queued", and say so in the report. The daily manager (which has Metricool) schedules anything in `queue/` on its next run.

## Learning loop
Every run: check Metricool analytics for brand 8212990 (lags 2–3 days) and the public view counts on @thecrumbclub. Note in `crumb_log.md` which kinds/foods/titles get the most views, likes and comments, and lean into them. Spend cap $3/day (Charity can raise it).

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
