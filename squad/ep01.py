import sys,os,asyncio; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from kit import *; import engine
phone=lambda sender,text,small="now": f'<div class="phone"><div class="msg"><small>{sender} · {small}</small>{text}</div></div>'
B=[]
# 0 hook
B.append({"dur":3.2,"bg":"#fff3e6","els":[
 T("When someone texts you",90,170,900,96),
 H(phone("Bestie","we need to talk."),280,560,520,t0=0.7),
 C("Milo",30,1140,250,[[0,"spark"]],t0=1.2),C("Kemi",250,1170,230,[[0,"spark"]],t0=1.3),
 C("Juno",450,1140,250,[[0,"spark"]],t0=1.4),C("Amara",670,1160,240,[[0,"spark"]],t0=1.5),C("Toffee",880,1330,170,[[0,"spark"]],t0=1.6)]})
# 1 Milo
cloud='<div class="cloud"><div>• the time I said "you too" to the waiter</div><div>• the wave that wasn\'t for me</div><div>• that email with no greeting</div><div>• 2019. all of 2019.</div></div>'
B.append({"dur":4.6,"bg":"#e6f2e7","els":[
 H(label("Milo","#4a8a55"),90,150,400),T("*replays every conversation since 2019*",90,260,900,62,t0=0.25,cls="sub"),
 H(cloud,140,470,800,t0=0.9),C("Milo",220,880,640,[[0,"sad"]],t0=0.0)]})
# 2 Kemi
deck='<div class="msg" style="font-size:44px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.1)"><small>slide 1 of 17</small><b>WHY I AM INNOCENT</b><br><span style="font-size:30px;color:#8a8399">a presentation by Kemi</span></div>'
B.append({"dur":4.0,"bg":"#fff1df","els":[
 H(label("Kemi","#c97a1e"),90,150,400),T("“Locked in.”",90,260,900,96,t0=0.25),
 H(deck,180,520,720,t0=1.0),C("Kemi",220,880,640,[[0,"spark"]])]})
# 3 Juno
B.append({"dur":3.8,"bg":"#efeafb","els":[
 H(label("Juno","#7a5fc0"),90,150,400),T("*already crying*",90,260,900,70,t0=0.2,cls="sub"),
 T("“I'm not crying,<br>you're crying.”",90,480,900,92,t0=1.1),C("Juno",220,880,640,[[0,"sad"]])]})
# 4 Amara
B.append({"dur":4.6,"bg":"#fde9ee","els":[
 H(label("Amara","#c2577a"),90,150,400),T("“Of course! Are you okay? 💗”",90,260,900,80,t0=0.25),
 T("(is not okay)",90,640,900,64,t0=2.2,cls="sub",extra="color:#8a8399"),
 C("Amara",220,880,640,[[0,"happy"],[2.1,"sad"]])]})
# 5 Toffee knocks phone
tbl='<div style="width:760px;height:40px;background:#c98a4b;border-radius:20px"></div>'
ph='<div style="width:150px;height:260px;background:#1f1b2b;border-radius:28px"></div>'
B.append({"dur":3.6,"bg":"#f8e8d8","els":[
 H(label("Toffee","#b06a2c"),90,150,400),T("*knocks phone off the table*",90,260,900,64,t0=0.25,cls="sub"),
 H(tbl,160,1330,760,t0=0.0,kf=[[0,{"x":160,"y":1330}]]),
 H(ph,640,1070,150,kf=[[0,{"x":640,"y":1070,"o":1}],[1.4,{"x":640,"y":1070,"r":0}],[1.9,{"x":900,"y":1200,"r":70},"in"],[2.5,{"x":980,"y":2100,"r":160},"in"]]),
 C("Toffee",210,830,500,[[0,"spark"],[1.9,"happy"]])]})
# 6 reveal
B.append({"dur":4.2,"bg":"#fff3e6","els":[
 T("The message:",90,170,900,80),
 H(phone("Bestie","we need to talk… about which pizza to order 🍕","now"),230,420,620,t0=0.5),
 C("Milo",30,1140,250,[[0,"happy"]],t0=1.3),C("Kemi",250,1170,230,[[0,"happy"]],t0=1.35),
 C("Juno",450,1140,250,[[0,"happy"]],t0=1.4),C("Amara",670,1160,240,[[0,"happy"]],t0=1.45),C("Toffee",880,1330,170,[[0,"happy"]],t0=1.5)]})
# 7 end card
row=[("Milo",40,"1"),("Kemi",250,"2"),("Juno",450,"3"),("Amara",660,"4")]
els=[T("Which one<br>are you?",90,150,900,120),T("Tag your friends 👇",90,500,900,58,t0=0.4,cls="sub")]
for i,(n,x,num) in enumerate(row):
    els.append(C(n,x,880,250,[[0,"spark"]],t0=0.3+0.12*i))
    els.append(T(num,x,1220,250,90,t0=0.4+0.12*i))
els.append(C("Toffee",850,1000,190,[[0,"spark"]],t0=0.8)); els.append(T("5",850,1220,190,90,t0=0.9))
els.append(T("The Soft Squad",90,1560,900,64,t0=1.2,cls="sub",extra="font-weight:600;color:#c2577a"))
B.append({"dur":4.5,"bg":"#fff3e6","els":els})
starts=[];acc=0
for b in B: starts.append(acc); acc+=b["dur"]
SFX=[(0.7,"buzz"),(1.2,"pop"),(starts[1]+0.9,"pop"),(starts[2]+1.0,"pop"),(starts[3]+1.1,"pop"),(starts[4]+2.2,"pop"),(starts[5]+1.9,"fall"),(starts[5]+2.5,"thud"),(starts[6]+0.5,"ding"),(starts[7]+0.3,"pop")]
EP={"beats":B,"sfx":SFX}
if __name__=="__main__":
    out=os.path.join(os.path.dirname(os.path.abspath(__file__)),"out")
    if sys.argv[1]=="stills":
        ts=[float(x) for x in sys.argv[2].split(",")]
        asyncio.run(engine.stills(EP,ts,out+"/ep01"))
    else:
        asyncio.run(engine.render(EP,out+"/ep01-we-need-to-talk.mp4"))
