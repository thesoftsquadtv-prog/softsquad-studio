import sys,os,asyncio; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from fmt import *; from scenes import *
S=lambda: [[0,{"x":0,"y":0}]]
def still(scene,els,cap):
    return {"dur":1,"bg":"#fff","scene":scene,"els":[T(cap,90,170,900,72,kf=[[0,{"x":90,"y":170}]])]+els}
fix=lambda x,y:[[0,{"x":x,"y":y}]]
B=[
 still(SCENES["bedroom_night"](),[C("Juno",20,1020,520,[[0,"sad"]],kf=fix(20,1020),bob=False),H(blanket(),0,0,1080,kf=fix(0,0))],"3:07 AM. Juno is awake."),
 still(SCENES["bathroom"](),[C("Milo",220,860,640,[[0,"sad"]],kf=fix(220,860),bob=False),H(sink(),0,0,1080,kf=fix(0,0))],"Milo rehearses in the mirror"),
 still(SCENES["kitchen"](),[C("Amara",220,880,640,[[0,"happy"]],kf=fix(220,880),bob=False),H(table(),0,0,1080,kf=fix(0,0))],"Breakfast"),
 still(SCENES["desk"](),[C("Juno",220,880,640,[[0,"sad"]],kf=fix(220,880),bob=False),H(desk_front(papers=3),0,0,1080,kf=fix(0,0))],"47 tabs open"),
 still(SCENES["street"](),[C("Kemi",80,880,560,[[0,"spark"]],kf=fix(80,880),bob=False),C("Milo",560,900,540,[[0,"happy"]],kf=fix(560,900),bob=False)],"Walking to the interview"),
 still(SCENES["cafe"](),[C("Milo",220,860,640,[[0,"sad"]],kf=fix(220,860),bob=False),H(cafe_table(),0,0,1080,kf=fix(0,0))],"The coffee shop"),
 still(SCENES["park"](),[C("Kemi",60,900,520,[[0,"happy"]],kf=fix(60,900),bob=False),C("Toffee",600,1180,360,[[0,"spark"]],kf=fix(600,1180),bob=False)],"A walk in the park"),
]
ep=build(B)
asyncio.run(engine.stills(ep,[i+0.5 for i in range(len(B))],"out/scn"))
