import sys,os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from fmt import *
EPS={}
def ep(n,slug,title,caption,tags):
    def deco(f): EPS[n]=dict(slug=slug,title=title,caption=caption,tags=tags,make=f); return f
    return deco

@ep(2,"ep02-milo-at-3am","Milo's Brain at 3AM 😵‍💫 #shorts",
 "3am and your brain says \"remember this?\" 😵‍💫 who else?? 🙋\n\n#thesoftsquad #relatable #overthinking #3am #animation #shorts",
 ["overthinking","3am thoughts","relatable","the soft squad","animation"])
def _():
    return build([
     hook("3:07 AM.<br>Milo's brain:",card("<small>brain · just now</small>hey. you awake? 👀",40),mood="sad"),
     who("Milo","“Remember when you waved back…”",sub="…and they were waving at the person behind you",moods=[[0,"sad"]],dur=4.6),
     who("Milo","“…and the waiter said ‘enjoy your meal’”",sub="and you said “you too” 💀",moods=[[0,"sad"]],dur=4.4),
     who("Kemi","“Milo. That was 2019.”",sub="*goes back to sleep*",dur=3.8),
     who("Juno","“I remember it too.”",sub="(not helping, Juno)",moods=[[0,"sad"]],dur=3.6),
     who("Toffee","*sleeps directly on Milo's face*",sub="problem solved 😌",moods=[[0,"spark"],[1.6,"happy"]],dur=3.8,size=70),
     endcard("Who else does<br>this at 3am?","Comment 🙋 if it's you"),
    ])

@ep(3,"ep03-plans-cancelled","When the Plans Get Cancelled 🫠 #shorts",
 "\"hey… can we reschedule?\" 🫠 which one are you? 👇\n\n#thesoftsquad #relatable #introvert #friends #animation #shorts",
 ["plans cancelled","introvert","relatable","the soft squad","animation"])
def _():
    return build([
     hook("When the plans<br>get cancelled",phone("Bestie","hey… can we reschedule? 🥺"),mood="spark"),
     who("Kemi","*already dressed*",sub="*already left the house*",moods=[[0,"happy"],[1.6,"sad"]],size=84),
     who("Milo","“Oh no… anyway 🥳”",sub="*throws a tiny party*",moods=[[0,"spark"]]),
     who("Juno","*secretly relieved*",sub="“It's totally fine!!” (it's a gift)",moods=[[0,"happy"]]),
     who("Amara","“No worries at all!! 💗”",sub="(was looking forward to it all week)",moods=[[0,"happy"],[1.6,"sad"]],dur=4.4),
     who("Toffee","*was never going anyway*",sub="*already in pyjamas since 2pm*",moods=[[0,"happy"]],size=74),
     endcard(),
    ])

@ep(4,"ep04-toffee-judges-routine","Toffee Judges Kemi's Morning Routine 🐱 #shorts",
 "the 5am morning routine vs. Toffee 😂 who wins? 👇\n\n#thesoftsquad #morningroutine #relatable #funny #animation #shorts",
 ["morning routine","5am","funny","the soft squad","animation"])
def _():
    return build([
     hook("Kemi's 5AM<br>morning routine",card("<small>alarm · 5:00 AM</small>⏰ RISE AND GRIND",40),mood="spark"),
     who("Kemi","Step 1: cold shower 🥶","",moods=[[0,"spark"]],dur=3.2),
     who("Toffee","*judging*","",moods=[[0,"sad"]],dur=2.6,size=96),
     who("Kemi","Step 2: journal<br>3 gratitudes ✍️",moods=[[0,"happy"]],dur=3.4),
     who("Toffee","*still judging*",moods=[[0,"sad"]],dur=2.6,size=96),
     who("Kemi","Step 3: green smoothie 🥬",sub="*it's 5:12 AM*",moods=[[0,"spark"]],dur=3.6),
     who("Toffee","Toffee's routine:",sub="sleep → snack → sleep → zoomies → sleep",moods=[[0,"happy"]],dur=4.4,size=84),
     group("Who's actually<br>winning? 😴",card("🐱 Toffee: 14 hours of sleep<br>💪 Kemi: 3 hours of sleep",40),dur=4.0),
     endcard("Team Kemi or<br>Team Toffee?","Comment 💪 or 😴",numbers=False),
    ])

@ep(5,"ep05-soft-reminders","Soft Reminders From the Squad 💗 #shorts",
 "a few soft reminders for whoever needs them today 💗 send this to someone\n\n#thesoftsquad #selfcare #softlife #reminder #mentalhealth #shorts",
 ["soft reminders","self care","kindness","the soft squad","animation"])
def _():
    return build([
     hook("A few soft<br>reminders 💗",None,mood="happy",dur=3.0),
     quote("Amara","“You don't have to have it all figured out today.”"),
     quote("Milo","“Rest is productive too.”","even your phone needs charging 🔋"),
     quote("Juno","“Feeling things deeply is not a weakness.”"),
     quote("Kemi","“Small steps still count.”","slow progress is still progress"),
     quote("Toffee","“Drink some water.”","(and maybe take a nap)",mood="spark"),
     endcard("Send this to<br>someone 💗","who needs it today",numbers=False),
    ])

@ep(6,"ep06-texting-styles","Texting Styles of Your Friends 📱 #shorts",
 "every group chat has these 5 😂 which one are you? 👇\n\n#thesoftsquad #groupchat #texting #relatable #animation #shorts",
 ["texting styles","group chat","relatable","the soft squad","animation"])
def _():
    return build([
     hook("Texting styles<br>of your friends",phone("Group chat","5 new messages"),mood="spark"),
     who("Amara","The emoji queen",prop=phone("Amara","omg yesss 😭💗✨🥹🫶🎉🌸"),moods=[[0,"spark"]],dur=4.2),
     who("Kemi","Short and scary",prop=phone("Kemi","k."),moods=[[0,"happy"]],dur=3.6),
     who("Milo","Types for 10 minutes…",prop=phone("Milo","lol"),sub="*sends “lol”*",moods=[[0,"sad"],[1.6,"happy"]],dur=4.4),
     who("Juno","The voice note",prop=phone("Juno","🎤 ▶ ━━━━━━━━ 9:47"),moods=[[0,"happy"]],dur=4.0),
     who("Toffee","*leaves everyone on read*",prop=phone("Toffee","Seen ✓✓"),moods=[[0,"spark"]],dur=4.0,size=72),
     endcard(),
    ])

@ep(7,"ep07-at-a-party","Your Friends at a Party 🎉 #shorts",
 "every friend group at a party 😂 which one are you? 👇\n\n#thesoftsquad #party #introvert #relatable #animation #shorts",
 ["party","introvert","friends","the soft squad","animation"])
def _():
    return build([
     hook("Your friends<br>at a party 🎉",None,mood="spark",dur=3.0),
     who("Amara","Hosting everyone",sub="“Have you eaten? Do you need water? 💗”",moods=[[0,"happy"]]),
     who("Kemi","Networking",sub="*hands out 14 business cards*",moods=[[0,"spark"]]),
     who("Milo","Stays near the snacks",sub="*has eaten 40 chips*",moods=[[0,"happy"]]),
     who("Juno","Found the host's cat",sub="*spends the whole party with the cat*",moods=[[0,"spark"]]),
     who("Toffee","Is the cat",sub="*best night of his life*",moods=[[0,"spark"]],size=84),
     endcard("Which one are<br>you at a party?"),
    ])

@ep(8,"ep08-payday","The Squad on Payday 💸 #shorts",
 "payday hits different 💸 which one are you? 👇\n\n#thesoftsquad #payday #money #relatable #animation #shorts",
 ["payday","money","budgeting","the soft squad","animation"])
def _():
    return build([
     hook("When payday<br>finally hits 💸",phone("Bank","💰 Payment received"),mood="spark"),
     who("Kemi","*opens the budget spreadsheet*",sub="every cent has a job 📊",moods=[[0,"spark"]],size=70),
     who("Milo","“I deserve a treat.”",sub="*the treat is 6 treats*",moods=[[0,"happy"]]),
     who("Juno","“Saving for emergencies.”",sub="(the emergency is concert tickets)",moods=[[0,"happy"]]),
     who("Amara","*buys gifts for everyone else*",sub="has $3 left for herself",moods=[[0,"happy"],[1.6,"sad"]],size=70),
     who("Toffee","*receives one (1) fish treat*",sub="richest cat alive 🐟",moods=[[0,"spark"]],size=74),
     endcard("Which one are<br>you on payday?"),
    ])

@ep(9,"ep09-things-that-are-okay","Things That Are Actually Okay 🌱 #shorts",
 "gentle permission slips from the squad 🌱 which one did you need today?\n\n#thesoftsquad #selfcare #softlife #reminder #mentalhealth #shorts",
 ["self care","its okay","soft life","the soft squad","animation"])
def _():
    return build([
     hook("Things that are<br>actually okay 🌱",None,mood="happy",dur=3.0),
     quote("Juno","It's okay to leave early.","your social battery is real 🔋"),
     quote("Kemi","It's okay to say no.","“no” is a full sentence"),
     quote("Milo","It's okay to start over.","as many times as you need"),
     quote("Amara","It's okay to ask for help.","you'd help them too 💗"),
     quote("Toffee","It's okay to nap.","Toffee approves 🐾",mood="spark"),
     endcard("Which did you<br>need today?","Tell us in the comments 💬",numbers=False),
    ])

@ep(10,"ep10-sunday-night","Sunday Night Feelings 🌙 #shorts",
 "sunday night before monday 🌙 which one are you? 👇 (you've got this week 💪)\n\n#thesoftsquad #sundayscaries #monday #relatable #animation #shorts",
 ["sunday scaries","monday","relatable","the soft squad","animation"])
def _():
    return build([
     hook("Sunday night<br>before Monday 🌙",card("<small>calendar · tomorrow</small>📅 MONDAY",40),mood="sad"),
     who("Milo","*remembers every task at once*",sub="😵‍💫😵‍💫😵‍💫",moods=[[0,"sad"]],size=70),
     who("Kemi","*colour-codes the whole week*",sub="Monday: ready. 📒",moods=[[0,"spark"]],size=70),
     who("Juno","“Where did the weekend go?”",sub="*stares out the window*",moods=[[0,"sad"]]),
     who("Amara","*texts everyone*",prop=phone("Amara","you've got this week!! 💗"),moods=[[0,"happy"]]),
     who("Toffee","“What's a Monday?”",sub="*every day is Saturday*",moods=[[0,"spark"]]),
     endcard("You've got<br>this week 💪","Which one are you? 👇"),
    ])


# ---------- "What if you could see..." series ----------
def meter(label,val,color,pct=None,size=84):
    bar=f'<div style="height:22px;background:#eee8f2;border-radius:11px;margin-top:10px;overflow:hidden"><div style="width:{pct}%;height:100%;background:{color};border-radius:11px"></div></div>' if pct is not None else ''
    return (f'<div style="background:#fff;border-radius:36px;padding:18px 30px 22px;box-shadow:0 10px 30px rgba(0,0,0,.12);font-family:Poppins,sans-serif;text-align:center">'
            f'<div style="font-size:30px;color:#8a8399;font-weight:500">{label}</div>'
            f'<div style="font-size:{size}px;font-weight:700;color:{color};line-height:1.1">{val}</div>{bar}</div>')
def chip(val,color):
    return f'<div style="background:#fff;border-radius:24px;padding:6px 0;box-shadow:0 6px 16px rgba(0,0,0,.12);font:700 34px Poppins,sans-serif;color:{color};text-align:center">{val}</div>'
def wif_hook(title,chips,prop=None,prop_w=520):
    b=hook(title,prop,mood="spark",dur=3.2,size=74,prop_x=(1080-prop_w)//2,prop_w=prop_w)
    for i,(n,x,y,w) in enumerate(SQ):
        v,c=chips[n]; cw=150; cx=x+w//2-cw//2
        b["els"].append(H(chip(v,c),cx,y-80 if n!="Toffee" else y-70,cw,t0=0.35+0.12*i))
    b["sfx"]+= [(0.35+0.12*i,"pop") for i in range(5)]
    return b
def reveal(name,line,label,val,color,pct=None,sub=None,moods=None,dur=4.2,size=76,swap=None,msize=84):
    b=who(name,line,sub=sub,prop=meter(label,val,color,pct,size=msize),moods=moods,dur=dur,size=size,prop_w=560,prop_y=400)
    if swap:  # (time, val, color, pct): meter changes mid-beat
        t,v2,c2,p2=swap; m=b["els"][2]
        m["kf"]=m["kf"]+[[t-0.05,{"o":1}],[t,{"o":0}]]
        x=(1080-560)//2
        b["els"].insert(3,H(meter(label,v2,c2,p2,size=msize),x,400,560,kf=[[t-0.01,{"x":x,"y":400,"s":1.25,"o":0}],[t,{"x":x,"y":400,"s":1.25,"o":1}],[t+0.35,{"x":x,"y":400,"s":1,"o":1},"back"]]))
        b["sfx"].append((t,"buzz"))
    return b

RED,AMB,GRN,PUR="#e0475b","#e39b2d","#3aa46a","#7a5fc0"
TOF="#b06a2c"

@ep(11,"ep11-what-if-social-battery","What If You Could See Everyone's Social Battery? 🔋 #shorts",
 "what if you could see everyone's social battery? 🔋 which one are you? 👇\n\nwhat's your battery at right now? drop a % 💬\n\n#thesoftsquad #socialbattery #introvert #relatable #animation #shorts",
 ["social battery","introvert","what if","the soft squad","animation"])
def _():
    return build([
     wif_hook("What if you could see<br>everyone's social battery? 🔋",
        {"Milo":("47%",AMB),"Kemi":("100%",GRN),"Juno":("2%",RED),"Amara":("100%",GRN),"Toffee":("∞",PUR)}),
     reveal("Kemi","Kemi: fully charged","🔋 social battery","100%",GRN,100,sub="*hosting a brunch for 30 people*",moods=[[0,"spark"]]),
     reveal("Milo","Milo: 47%","🔋 social battery","47%",AMB,47,sub="drops 10% every time someone says “quick call?”",moods=[[0,"happy"],[1.6,"sad"]]),
     reveal("Juno","Juno: 2%","🔋 social battery","2%",RED,2,sub="*has been at the party for 4 minutes*",moods=[[0,"sad"]]),
     reveal("Amara","Amara: 100%… right?","🔋 social battery","100%",GRN,100,sub="(she was hiding it the whole time)",moods=[[0,"happy"],[2.0,"sad"]],swap=(2.0,"0%",RED,0),dur=4.6),
     reveal("Toffee","Toffee: ∞","🔋 social battery","∞",PUR,None,sub="has never been charged. never needed it.",moods=[[0,"spark"]]),
     endcard("What's your<br>battery at? 🔋","Drop your % in the comments 👇",numbers=False),
    ])

@ep(12,"ep12-what-if-overthinking","What If You Could See Everyone's Overthinking Level? 🧠 #shorts",
 "what if you could see everyone's overthinking level? 🧠 which one are you? 👇\n\nrate your overthinking 1-10 in the comments 💬\n\n#thesoftsquad #overthinking #relatable #anxiety #animation #shorts",
 ["overthinking","what if","relatable","the soft squad","animation"])
def _():
    return build([
     wif_hook("What if you could see<br>everyone's overthinking level? 🧠",
        {"Milo":("???",RED),"Kemi":("3",GRN),"Juno":("88",AMB),"Amara":("64",AMB),"Toffee":("0",PUR)}),
     reveal("Kemi","Kemi: 3","🧠 overthinking level","3",GRN,3,sub="already decided. moving on.",moods=[[0,"spark"]]),
     reveal("Amara","Amara: 64","🧠 overthinking level","64",AMB,64,sub="*rewrote “ok” 9 times before sending*",moods=[[0,"happy"],[1.6,"sad"]]),
     reveal("Juno","Juno: 88","🧠 overthinking level","88",AMB,88,sub="*still thinking about a dream from 2021*",moods=[[0,"sad"]]),
     reveal("Milo","Milo: …","🧠 overthinking level","99",RED,99,sub="⚠️ brain overheating ⚠️",moods=[[0,"sad"]],swap=(1.6,"9,999+",RED,100),dur=4.6),
     reveal("Toffee","Toffee: 0","🧠 overthinking level","0",PUR,0,sub="thinks about nothing. pure peace. 🐾",moods=[[0,"happy"]]),
     endcard("What's your<br>level? 🧠","Rate yourself 1–10 in the comments 👇",numbers=False),
    ])

@ep(13,"ep13-what-if-sleep","What If You Could See How Much Sleep Everyone Got? 😴 #shorts",
 "what if you could see how much sleep everyone actually got? 😴 which one are you? 👇\n\nhow many hours did YOU get last night? 💬\n\n#thesoftsquad #sleep #tired #relatable #animation #shorts",
 ["sleep","tired","what if","the soft squad","animation"])
def _():
    return build([
     wif_hook("What if you could see<br>how much sleep everyone got? 😴",
        {"Milo":("2h",RED),"Kemi":("4h",AMB),"Juno":("11h",GRN),"Amara":("6h",AMB),"Toffee":("19h",PUR)}),
     reveal("Kemi","Kemi: 4 hours","😴 sleep last night","4h",AMB,33,sub="“sleep is for people without goals” 💪",moods=[[0,"spark"]]),
     reveal("Milo","Milo: 2 hours","😴 sleep last night","2h",RED,16,sub="brain replayed 2019 again 😵‍💫",moods=[[0,"sad"]]),
     reveal("Amara","Amara: 6 hours","😴 sleep last night","6h",AMB,50,sub="woke up to answer everyone's texts 💗",moods=[[0,"happy"]]),
     reveal("Juno","Juno: 11 hours","😴 sleep last night","11h",GRN,92,sub="…still tired",moods=[[0,"happy"],[1.6,"sad"]]),
     reveal("Toffee","Toffee: 19 hours","😴 sleep last night","19h",PUR,100,sub="and a nap after this 🐾",moods=[[0,"spark"]]),
     endcard("How much did<br>you sleep? 😴","Tell us in the comments 👇",numbers=False),
    ])

@ep(14,"ep14-what-if-love-language","What If You Could See Everyone's Love Language? 💗 #shorts",
 "what if you could see everyone's love language? 💗 which one are you? 👇\n\nwhat's YOUR love language? tell us in the comments 💬\n\n#thesoftsquad #lovelanguage #relatable #friendship #animation #shorts",
 ["love language","what if","relatable","the soft squad","animation"])
def _():
    L="💗 love language"
    return build([
     wif_hook("What if you could see<br>everyone's love language? 💗",
        {"Milo":("words",GRN),"Kemi":("acts",AMB),"Juno":("time",PUR),"Amara":("gifts?",RED),"Toffee":("touch",TOF)},
        prop=card("<small>the 5 love languages</small>words · acts · time<br>gifts · touch",46),prop_w=640),
     reveal("Kemi","Kemi's love language:",L,"acts of service",AMB,None,sub="*already fixed your CV*",moods=[[0,"spark"]],msize=58),
     reveal("Milo","Milo's love language:",L,"words of affirmation",GRN,None,sub="*3 drafts later: “hey”*",moods=[[0,"happy"],[1.6,"sad"]],msize=46),
     reveal("Juno","Juno's love language:",L,"quality time",PUR,None,sub="*sits with you in silence*",moods=[[0,"calm"]],msize=58),
     reveal("Amara","Amara's love language:",L,"gifts 🎁",RED,None,sub="*knows your dog's birthday*",moods=[[0,"happy"],[2.0,"spark"]],swap=(2.0,"all five 💗",RED,None),dur=4.6,msize=58),
     reveal("Toffee","Toffee's love language:",L,"physical touch",TOF,None,sub="*4-second cuddles only*",moods=[[0,"spark"]],msize=58),
     endcard("What's your<br>love language?","Tell us in the comments 👇",numbers=False),
    ])

@ep(15,"ep15-what-if-friendsgiving","What If You Could See What Everyone Brings to Friendsgiving? 🦃 #shorts",
 "what if you could see what everyone's bringing to friendsgiving? 🦃 which one are you? 👇\n\nwhat are YOU bringing this year? tell us in the comments 💬\n\n#thesoftsquad #friendsgiving #thanksgiving #relatable #friends #animation #shorts",
 ["friendsgiving","thanksgiving","what if","the soft squad","animation"])
def _():
    L="🦃 Friendsgiving"
    return build([
     wif_hook("What if you could see<br>what everyone brings<br>to Friendsgiving? 🦃",
        {"Milo":("chips",AMB),"Kemi":("menu",GRN),"Juno":("ice",PUR),"Amara":("pies",RED),"Toffee":("none",TOF)}),
     reveal("Kemi","Kemi is bringing:",L,"3-course menu",GRN,None,sub="*with printed name cards*",moods=[[0,"spark"]],msize=58),
     reveal("Milo","Milo is bringing:",L,"1 bag of chips",AMB,None,sub="*half-eaten in the car*",moods=[[0,"happy"],[1.6,"sad"]],msize=58),
     reveal("Juno","Juno is bringing:",L,"a bag of ice 🧊",PUR,None,sub="*arrives 2 hours late*",moods=[[0,"calm"]],msize=58),
     reveal("Amara","Amara is bringing:",L,"4 pies 🥧",RED,None,sub="*+ tupperware for all*",moods=[[0,"happy"],[2.0,"spark"]],swap=(2.0,"everything 💗",RED,None),dur=4.6,msize=58),
     reveal("Toffee","Toffee is bringing:",L,"none 🐾",TOF,None,sub="*arms open. for the turkey.*",moods=[[0,"spark"]],msize=58),
     endcard("What are you<br>bringing? 🦃","Tell us in the comments 👇",numbers=False),
    ])

@ep(16,"ep16-what-if-sunday-scaries","What If You Could See Everyone's Sunday Scaries? 😰 #shorts",
 "what if you could see everyone's sunday scaries? 😰 which one are you? 👇\n\nwhat % are your sunday scaries at right now? drop it below 💬\n\n#thesoftsquad #sundayscaries #sundaynight #relatable #adulting #animation #shorts",
 ["sunday scaries","sunday night","what if","the soft squad","animation"])
def _():
    L="😰 Sunday scaries"
    return build([
     wif_hook("What if you could see<br>everyone's Sunday scaries? 😰",
        {"Milo":("73%",AMB),"Kemi":("0%",GRN),"Juno":("100%",RED),"Amara":("40%",AMB),"Toffee":("0%",PUR)}),
     reveal("Juno","Juno: 100%",L,"100%",RED,100,sub="*it started at breakfast*",moods=[[0,"sad"]]),
     reveal("Amara","Amara: 40%",L,"40%",AMB,40,sub="*remembered Friday's email*",moods=[[0,"happy"],[1.6,"calm"]]),
     reveal("Milo","Milo: 73%",L,"73%",AMB,73,sub="*opened his laptop “just to check”… 3 hours ago*",moods=[[0,"sad"]]),
     reveal("Kemi","Kemi: totally calm?",L,"0%",GRN,0,sub="*just remembered the 9am presentation*",moods=[[0,"spark"],[2.0,"sad"]],swap=(2.0,"97%",RED,97),dur=4.6),
     reveal("Toffee","Toffee: 0%",L,"0%",PUR,0,sub="*has never had a Monday*",moods=[[0,"happy"]]),
     endcard("What's your<br>% today? 😰","Drop your % below 👇",numbers=False),
    ])

# browser-style "tabs open in your head" prop
def tabs(label,count,color,titles,sound=None,size=84):
    strip="".join(f'<div style="flex:1;min-width:0;background:{"#fff" if i==0 else "#ece6f1"};border-radius:14px 14px 0 0;padding:8px 12px;font-size:26px;color:#5a536a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left">{"🔊 " if sound==i else ""}{t}</div>' for i,t in enumerate(titles))
    return (f'<div style="background:#fff;border-radius:30px;box-shadow:0 10px 30px rgba(0,0,0,.12);font-family:Poppins,sans-serif;overflow:hidden">'
            f'<div style="display:flex;gap:6px;background:#d9d1e2;padding:12px 14px 0">{strip}</div>'
            f'<div style="padding:14px 24px 20px;text-align:center"><div style="font-size:30px;color:#8a8399;font-weight:500">{label}</div>'
            f'<div style="font-size:{size}px;font-weight:700;color:{color};line-height:1.1">{count}</div></div></div>')
def treveal(name,line,count,color,titles,sub=None,moods=None,dur=4.2,sound=None,swap=None,msize=84):
    L="🗂️ tabs open in their head"
    b=who(name,line,sub=sub,prop=tabs(L,count,color,titles,sound,msize),moods=moods,dur=dur,size=76,prop_w=600,prop_y=400)
    if swap:
        t,c2,col2,ti2,snd2=swap; m=b["els"][2]
        m["kf"]=m["kf"]+[[t-0.05,{"o":1}],[t,{"o":0}]]
        x=(1080-600)//2
        b["els"].insert(3,H(tabs(L,c2,col2,ti2,snd2,msize),x,400,600,kf=[[t-0.01,{"x":x,"y":400,"s":1.25,"o":0}],[t,{"x":x,"y":400,"s":1.25,"o":1}],[t+0.35,{"x":x,"y":400,"s":1,"o":1},"back"]]))
        b["sfx"].append((t,"buzz"))
    return b

@ep(17,"ep17-what-if-tabs","What If You Could See How Many Tabs Are Open in Everyone's Head? 🗂️ #shorts",
 "what if you could see how many tabs are open in everyone's head? 🗂️ which one are you? 👇\n\nhow many tabs are open in YOUR head right now? drop the number 💬\n\n#thesoftsquad #overthinking #mentalload #relatable #adulting #animation #shorts",
 ["tabs open in my head","mental load","what if","relatable","the soft squad","animation"])
def _():
    return build([
     wif_hook("What if you could see<br>how many tabs are open<br>in everyone's head? 🗂️",
        {"Milo":("64",AMB),"Kemi":("3",GRN),"Juno":("213",RED),"Amara":("12",GRN),"Toffee":("1",PUR)}),
     treveal("Kemi","Kemi: 3 tabs","3",GRN,["to-do list","gym 6am","calendar"],sub="*closes each one the second it's done*",moods=[[0,"spark"]]),
     treveal("Milo","Milo: 64 tabs","64",AMB,["emails","2019 😬","…"],sub="*music is playing in one. can't find which* 🎵",moods=[[0,"happy"],[1.6,"listen"]]),
     treveal("Juno","Juno: 213 tabs","213",RED,["read later","read later","read later"],sub="*all “read later”. none read.*",moods=[[0,"calm"]]),
     treveal("Amara","Amara: just a few?","12",GRN,["my plans","groceries","…"],sub="*+ everyone else's problems*",moods=[[0,"happy"],[2.0,"sad"]],swap=(2.0,"146",RED,["kemi's cv","milo's crush","…"],None),dur=4.8),
     treveal("Toffee","Toffee: 1 tab","1",PUR,["🐟 snacks"],sub="*open since 2022.<br>no regrets.*",moods=[[0,"happy"]]),
     endcard("Tabs open in<br>your head? 🗂️","Drop your number below 👇",numbers=False),
    ])

if __name__=="__main__":
    n=int(sys.argv[1]); e=EPS[n]
    sys.argv=[sys.argv[0]]+sys.argv[2:]
    main(e["make"](),e["slug"])
