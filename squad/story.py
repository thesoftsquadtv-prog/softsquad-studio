# Story episodes: "After Graduation" + "Milo's Crush" in the grown-up look, with scenes.
import sys,os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from fmt import *
from scenes import SCENES, blanket, sink, table, desk_front, cafe_table, bedroom, desk
ST={}
def story(n,slug,title,caption,tags):
    def deco(f): ST[n]=dict(slug=slug,title=title,caption=caption,tags=tags,make=f); return f
    return deco
PILL="background:rgba(255,255,255,.88);border-radius:34px;padding:14px 26px;box-shadow:0 8px 24px rgba(0,0,0,.08)"
fixed=lambda x,y:[[0,{"x":x,"y":y}]]
def cap(text,first,size=70,y=150):
    if first: return T(text,90,y,900,size,extra=PILL,kf=[[0,{"x":90,"y":y,"s":1.15,"o":1}],[0.35,{"x":90,"y":y,"s":1,"o":1},"back"]])
    return T(text,90,y,900,size,t0=0.15,extra=PILL)
def subt(text,t0=1.2,y=None): return T(text,140,y or 370,800,50,t0=t0,cls="sub",extra=PILL+";color:#5a536a")
def card(html,y=470,w=700,t0=0.6,first=False):
    x=(1080-w)//2
    inner=f'<div class="msg" style="font-size:40px;box-shadow:0 12px 30px rgba(0,0,0,.14)">{html}</div>'
    if first: return H(inner,x,y,w,kf=[[0,{"x":x,"y":y,"s":.9,"o":1}],[0.3,{"x":x,"y":y,"s":1,"o":1},"back"]])
    return H(inner,x,y,w,t0=t0)
def ch(name,x=220,y=880,w=640,moods="spark",bob=True,pop_in=False):
    m=[[0,moods]] if isinstance(moods,str) else moods
    return C(name,x,y,w,m,bob=bob,kf=None if pop_in else fixed(x,y))
def over(svg): return H(svg,0,0,1080,kf=fixed(0,0))
def toothbrush(x,y):
    return H('<svg viewBox="0 0 140 40" width="140" height="40"><rect x="0" y="14" width="100" height="12" rx="6" fill="#7fc8f8"/><rect x="96" y="6" width="40" height="22" rx="6" fill="#fff"/><g fill="#9fe3ff">'+''.join(f'<rect x="{100+i*8}" y="0" width="5" height="10" rx="2"/>' for i in range(4))+'</g></svg>',
             x,y,140,kf=[[0,{"x":x,"y":y}],[0.25,{"x":x+14,"y":y}],[0.5,{"x":x,"y":y}],[0.75,{"x":x+14,"y":y}],[1.0,{"x":x,"y":y}],[1.25,{"x":x+14,"y":y}],[1.5,{"x":x,"y":y}],[1.75,{"x":x+14,"y":y}],[2.0,{"x":x,"y":y}],[2.25,{"x":x+14,"y":y}],[2.5,{"x":x,"y":y}]])
def gradcap(cx,top,w):
    return H(f'<svg viewBox="0 0 120 70" width="{w}" height="{w*70/120}"><path d="M60 0 L120 22 L60 44 L0 22z" fill="#2a2438"/><path d="M28 32 v20 q32 18 64 0 v-20 l-32 12z" fill="#3b3450"/><path d="M60 22 L100 30 v24" stroke="#ffd166" stroke-width="4" fill="none"/><circle cx="100" cy="56" r="5" fill="#ffd166"/></svg>',
             cx-w/2,top,w,t0=0.3)
ROW=[("Milo",0,1030,330),("Kemi",250,1030,330),("Juno",500,1030,330),("Amara",750,1030,330)]
def squad_row(moods="spark",caps=False,toffee=True,toffee_mood=None):
    els=[]
    for n,x,y,w in ROW:
        els.append(ch(n,x,y,w,moods))
        if caps: els.append(gradcap(x+w/2,y-8,w*0.36))
    if toffee: els.append(ch("Toffee",420,1420,240,toffee_mood or moods))
    return els
def beat(scene,els,dur=3.4,sfx=None):
    return {"dur":dur,"bg":"#fff","scene":SCENES[scene]() if (isinstance(scene,str) and not scene.startswith("<svg")) else scene,"els":els,"sfx":sfx or [(0.15,"pop")]}
def tag(text): return f'<span style="display:block;font-size:30px;color:#8a8399;font-family:Poppins,sans-serif;font-weight:600">{text}</span>'
def screen(lines,title="laptop"):
    return f'<small>{title}</small>'+lines

# ---------------- episodes ----------------
@story(14,"ep14-we-graduated","The Soft Squad Graduated 🎓 Now What? #shorts",
 "we graduated!! 🎓 …now what? 😅 follow the squad figuring out adult life 💗\n\nwhat did you study? 👇\n\n#thesoftsquad #graduation #adulting #relatable #animation #shorts",
 ["graduation","adulting","after graduation","the soft squad","animation"])
def _():
    return build([
     beat("park",[cap("WE GRADUATED!! 🎓",True,88)]+squad_row("happy",caps=True),3.4,[(0,"ding"),(0.3,"pop")]),
     beat("park",[cap("Now what? 😶",False,96)]+squad_row("sad",toffee_mood="spark"),3.2,[(0.2,"buzz")]),
     beat("street",[cap("Rent. Jobs. Bills.<br>Adult life.",False,80),subt("“how do people do this??”",1.0)]+squad_row("sad",toffee=False),3.6),
     beat("cafe",[cap("Follow us figuring<br>it out together 💗",False,80),subt("a new episode every day",1.0)]+squad_row("spark"),3.6,[(0.15,"ding")]),
    ])

@story(15,"ep15-juno-day-one","After Graduation: Juno's First Monday 😭 #shorts",
 "day 1 of being a graduate: unemployed and emotional 😭 who else?? 🙋\n\nwhat's the most unrealistic job requirement you've seen? 👇\n\n#thesoftsquad #aftergraduation #jobsearch #relatable #animation #shorts",
 ["after graduation","job search","entry level","the soft squad","animation"])
def _():
    return build([
     beat(bedroom(False,"7:00"),[cap("Day 1 of being<br>a graduate ☀️",True,80),subt(tag("After Graduation · Juno"),0.6),ch("Juno",20,1020,520,"sad",bob=False),over(blanket())],3.2,[(0,"buzz")]),
     beat("bathroom",[cap("Brush teeth.<br>Stay positive. ✨",False,76),ch("Juno",220,860,640,"spark"),toothbrush(560,1065),over(sink())],3.0),
     beat("kitchen",[cap("Breakfast of<br>champions 🥣",False,76),ch("Juno",220,880,640,"happy"),over(table())],2.8),
     beat("desk",[cap("Time to apply 💻",False,80),card(screen("<b>Junior Assistant (Entry Level)</b><br>Requirements: <b style='color:#e0475b'>5+ years experience</b>","job listing"),470,760,0.5),ch("Juno",220,880,640,[[0,"spark"],[1.4,"sad"]]),over(desk_front())],3.6,[(0.5,"pop"),(1.4,"buzz")]),
     beat("desk",[cap("47 tabs later…",False,84),subt("*cries*",0.9),ch("Juno",220,880,640,"sad"),over(desk_front(papers=4))],3.0),
     beat("desk",[cap("*knock knock* 🚪",False,84),card("<small>Kemi · now</small>open the door. we brought snacks 🍕💗",500,720,0.5),ch("Juno",220,880,640,[[0,"sad"],[1.2,"spark"]]),over(desk_front(papers=4))],3.4,[(0.1,"thud"),(0.5,"ding")]),
    ])

@story(16,"ep16-milos-crush-1","Milo's Crush, Part 1: The Mirror 😳 #shorts",
 "Milo has been practising this for 3 weeks 😳 will he ever say it?? follow for part 2 💗\n\nwhat's the worst thing you've said when nervous? 👇\n\n#thesoftsquad #crush #shy #relatable #animation #shorts",
 ["crush","shy","awkward","the soft squad","animation"])
def _():
    return build([
     beat("bathroom",[cap("Milo is practising<br>in the mirror 😳",True,76),subt(tag("Milo's Crush · Part 1"),0.5),ch("Milo",220,860,640,"spark"),over(sink())],3.0,[(0,"pop")]),
     beat("bathroom",[cap("“Kemi… I really,<br>really like…”",False,78),ch("Milo",220,860,640,"happy"),over(sink())],3.0),
     beat("street",[cap("*Kemi walks past*",False,80),ch("Kemi",30,900,560,"spark",pop_in=True),ch("Milo",520,900,560,[[0,"spark"],[1.0,"sad"]])],2.8,[(0.2,"pop"),(1.0,"buzz")]),
     beat("street",[cap("Milo: “…the weather.”",False,78),subt("Kemi: “…okay? 😂”",1.0),ch("Kemi",30,900,560,"happy"),ch("Milo",520,900,560,"sad")],3.4,[(0.2,"thud")]),
     beat("street",[cap("Toffee: 🤦",False,96),subt("Follow for Part 2 💗",0.8),ch("Toffee",290,1000,500,"sad")],3.0,[(0.2,"pop")]),
    ])

@story(17,"ep17-kemi-day-one","After Graduation: Kemi's First Monday 💼 #shorts",
 "Kemi had 200 applications done before breakfast 💼 who's this friend in your group? 👇\n\nhow many applications have YOU sent? 💬\n\n#thesoftsquad #aftergraduation #jobsearch #hustle #animation #shorts",
 ["after graduation","job search","hustle","the soft squad","animation"])
def _():
    return build([
     beat(bedroom(True,"5:00"),[cap("5:00 AM.<br>Kemi is already up. 💼",True,76),subt(tag("After Graduation · Kemi"),0.5),ch("Kemi",220,880,640,"spark")],3.0,[(0,"buzz")]),
     beat(desk(True),[cap("By 6 AM:",False,84),card(screen("Applications sent: <b style='color:#3aa46a'>200 ✅</b><br><span style='font-size:30px'>🟩🟩🟨🟩🟥🟩🟨🟩 colour-coded</span>","job tracker.xlsx"),470,760,0.4),ch("Kemi",220,880,640,"happy"),over(desk_front())],3.4,[(0.4,"ding")]),
     beat("desk",[cap("Toffee's contribution:",False,76),subt("*sleeps on the keyboard*",0.9),ch("Kemi",120,880,600,"spark"),ch("Toffee",640,1180,300,"happy",bob=False),over(desk_front(laptop=False))],3.2),
     beat("street",[cap("Interview #1 💼",False,84),ch("Kemi",220,880,640,"spark")],2.6),
     beat("street_evening",[cap("“We'll be in touch.”",False,80),subt("(they won't)",1.0),ch("Kemi",220,880,640,"sad")],3.2,[(0.2,"thud")]),
     beat("street_evening",[cap("Interview #2: tomorrow.<br>Kemi doesn't quit. 💪",False,72),ch("Kemi",220,880,640,"spark")],3.0,[(0.2,"ding")]),
    ])

@story(18,"ep18-milos-crush-2","Milo's Crush, Part 2: The Coffee Shop ☕ #shorts",
 "the barista ruined Milo's moment 😭☕ is Kemi's laugh a sign?? follow for part 3 💗\n\nhas a barista ever spelled your name wrong? 👇\n\n#thesoftsquad #crush #coffee #relatable #animation #shorts",
 ["crush","coffee shop","awkward","the soft squad","animation"])
def _():
    return build([
     beat("cafe",[cap("Coffee with Kemi ☕",True,82),subt(tag("Milo's Crush · Part 2"),0.5),ch("Milo",60,900,520,"spark"),ch("Kemi",520,900,520,"happy"),over(cafe_table())],3.0,[(0,"pop")]),
     beat("cafe",[cap("Barista:",False,84),card("☕ <b>Oat latte for… MOLO?</b>",470,720,0.3),ch("Milo",60,900,520,[[0,"spark"],[1.0,"sad"]]),ch("Kemi",520,900,520,"spark"),over(cafe_table())],3.0,[(0.3,"ding")]),
     beat("cafe",[cap("*Kemi laughs* 😂",False,84),ch("Milo",60,900,520,"sad"),ch("Kemi",520,900,520,"happy"),over(cafe_table())],2.8),
     beat("cafe",[cap("Milo: “She laughed.<br>Is that a sign??”",False,76),ch("Milo",220,880,640,"spark")],3.0),
     beat(bedroom(True,"11:52"),[cap("That night:",False,84),card("<small>Kemi · now</small>lol see you tomorrow MOLO 😂☕",480,720,0.4),ch("Milo",20,1020,520,"happy",bob=False),over(blanket("#9fc7a4"))],3.4,[(0.4,"buzz")]),
     beat(bedroom(True,"11:52"),[cap("Follow for Part 3 💗",False,84),ch("Milo",20,1020,520,"happy",bob=False),over(blanket("#9fc7a4")),ch("Toffee",700,1250,260,"spark")],2.6),
    ])

@story(19,"ep19-amara-day-one","After Graduation: Amara Helps Everyone… Except Herself 💗 #shorts",
 "Amara fixed everyone's CV and forgot her own 💗 tag the Amara in your life 👇\n\nwho's the friend that helps everyone? 💬\n\n#thesoftsquad #aftergraduation #friendship #relatable #animation #shorts",
 ["after graduation","friendship","helping","the soft squad","animation"])
def _():
    return build([
     beat("cafe",[cap("“Amara, can you check<br>my CV real quick?” 🥺",True,72),subt(tag("After Graduation · Amara"),0.5),ch("Amara",220,880,640,"happy"),over(cafe_table())],3.0,[(0,"pop")]),
     beat("desk",[cap("Fixed everyone's CV 💗",False,78),card(screen("✅ Milo_CV_final_FINAL.docx<br>✅ Juno_CV.docx<br>✅ Kemi_cover_letter.docx","documents"),460,760,0.4),ch("Amara",220,880,640,"happy"),over(desk_front())],3.4,[(0.4,"ding")]),
     beat(desk(True),[cap("11:58 PM",False,92),subt("*remembers her own CV*",0.8),ch("Amara",220,880,640,[[0,"spark"],[0.9,"sad"]]),over(desk_front())],3.0,[(0.9,"buzz")]),
     beat(desk(True),[cap("Amara's CV:",False,84),card(screen("<span style='color:#8a8399'>(blank)</span>","Amara_CV.docx"),470,700,0.3),ch("Amara",220,880,640,"sad"),over(desk_front())],3.0),
     beat(desk(True),[cap("*phone buzzes*",False,84),card("<small>Juno · now</small>your turn 💗 we're coming over to help you",470,760,0.4),ch("Amara",220,880,640,[[0,"sad"],[1.3,"happy"]]),over(desk_front())],3.6,[(0.4,"buzz"),(1.3,"ding")]),
    ])

@story(20,"ep20-milos-crush-3","Milo's Crush, Part 3: Toffee Pressed SEND 😱 #shorts",
 "Toffee pressed SEND 😱😱 what should Kemi reply?? 👇 part 4 coming soon\n\n#thesoftsquad #crush #texting #relatable #animation #shorts",
 ["crush","texting","cliffhanger","the soft squad","animation"])
def _():
    return build([
     beat(bedroom(True,"11:47"),[cap("11:47 PM. Milo is<br>texting Kemi… 📱",True,74),subt(tag("Milo's Crush · Part 3"),0.5),card("<small>To: Kemi ✏️</small>hey so I was wondering if",500,720,first=True),ch("Milo",20,1020,520,"spark",bob=False),over(blanket("#9fc7a4"))],3.2,[(0,"pop")]),
     beat(bedroom(True,"11:52"),[cap("*deletes everything*",False,80),card("<small>To: Kemi ✏️</small><span style='color:#b5b0c2'>|</span>",500,720,0.3),ch("Milo",20,1020,520,"sad",bob=False),over(blanket("#9fc7a4"))],2.8),
     beat(bedroom(True,"12:31"),[cap("*types it again*",False,80),card("<small>To: Kemi ✏️</small>hey so I was wondering if",500,720,0.3),ch("Milo",20,1020,520,"spark",bob=False),over(blanket("#9fc7a4"))],2.8),
     beat(bedroom(True,"12:32"),[cap("Toffee steps on<br>the phone 🐾",False,80),ch("Milo",20,1020,520,"spark",bob=False),over(blanket("#9fc7a4")),ch("Toffee",640,1180,300,"spark",pop_in=True)],2.8,[(0.2,"pop")]),
     beat(bedroom(True,"12:32"),[cap("SENT. 😱",False,110),card("<small>Kemi · Delivered ✓✓</small>hey so I was wondering if",500,720,0.2),ch("Milo",20,1020,520,"sad",bob=False),over(blanket("#9fc7a4")),ch("Toffee",640,1180,300,"happy")],3.0,[(0.2,"buzz")]),
     beat(bedroom(True,"12:33"),[cap("Kemi is typing…",False,84),subt("Part 4 coming soon 💗",1.0),ch("Milo",20,1020,520,"sad",bob=False),over(blanket("#9fc7a4"))],3.0,[(0.2,"ding")]),
    ])

@story(21,"ep21-milo-day-one","After Graduation: Milo's First Application 😵‍💫 #shorts",
 "3 hours to write \"Dear Hiring Manager\" 😵‍💫 then Toffee took over 🐾 who else overthinks applications? 👇\n\n#thesoftsquad #aftergraduation #jobsearch #overthinking #animation #shorts",
 ["after graduation","job application","overthinking","the soft squad","animation"])
def _():
    return build([
     beat("desk",[cap("Milo's first<br>job application ✍️",True,80),subt(tag("After Graduation · Milo"),0.5),card(screen("Dear Hiring Manager,","cover_letter.docx"),500,720,first=True),ch("Milo",220,880,640,"spark"),over(desk_front())],3.0,[(0,"pop")]),
     beat("desk",[cap("1 hour later…",False,84),card(screen("Dear Hiring Manager,","cover_letter.docx"),500,720,0.2),ch("Milo",220,880,640,"sad"),over(desk_front())],2.6),
     beat(desk(True),[cap("3 hours later…",False,84),card(screen("Dear Hiring Manager, I","cover_letter.docx"),500,720,0.2),ch("Milo",220,880,640,"sad"),over(desk_front(papers=4))],2.6),
     beat(desk(True),[cap("Toffee walks across<br>the keyboard 🐾",False,76),card(screen("Dear Hiring Manager, I mmmmmeeeoww ✅ <b>SENT</b>","cover_letter.docx"),500,720,0.6),ch("Milo",120,880,600,"sad"),ch("Toffee",640,1180,300,"spark",pop_in=True),over(desk_front(laptop=False,papers=4))],3.4,[(0.2,"pop"),(0.6,"buzz")]),
     beat("desk",[cap("Next morning:",False,84),card("<small>Inbox · 8:02 AM</small><b>Re: Application</b> — We'd love to interview you! 🎉",500,760,0.4),ch("Milo",220,880,640,[[0,"sad"],[1.0,"happy"]]),over(desk_front())],3.4,[(0.4,"ding")]),
     beat("desk",[cap("Toffee for CEO. 🐾",False,90),ch("Toffee",290,1000,500,"spark")],2.6,[(0.2,"pop")]),
    ])

@story(22,"ep22-toffee-gets-a-job","After Graduation: Toffee Got a Job First 🐾 #shorts",
 "the squad: 0 job offers. Toffee: employed 😌🐾 who's the Toffee of your friend group? 👇\n\n#thesoftsquad #aftergraduation #cat #funny #animation #shorts",
 ["after graduation","cat","funny","the soft squad","animation"])
def _():
    return build([
     beat("cafe",[cap("Meanwhile,<br>Toffee… 🐾",True,90),subt(tag("After Graduation · Toffee"),0.5),ch("Toffee",290,1000,500,"spark")],2.8,[(0,"pop")]),
     beat("cafe",[cap("Sees a sign:",False,84),card("<b>NOW HIRING: Shop Cat 🐾</b><br>Requirements: be cute",470,760,0.3),ch("Toffee",290,1000,500,"spark")],3.0,[(0.3,"ding")]),
     beat("cafe",[cap("Day 1:",False,90),card("🏆 <b>Employee of the Month:</b> Toffee",470,760,0.3),ch("Toffee",290,1000,500,"happy")],3.0,[(0.3,"ding")]),
     beat("street_evening",[cap("The squad: 0 offers 😭<br>Toffee: employed 😌",False,74)]+squad_row("sad",toffee_mood="happy"),3.6,[(0.2,"thud")]),
    ])
if __name__=="__main__":
    n=int(sys.argv[1]); e=ST[n]
    sys.argv=[sys.argv[0]]+sys.argv[2:]
    main(e["make"](),e["slug"])
