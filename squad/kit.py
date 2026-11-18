# Helpers for writing episodes
def pop(x,y,t0=0.0,s0=.6,dy=60):
    return [[t0,{"x":x,"y":y+dy,"s":s0,"o":0}],[t0+0.4,{"x":x,"y":y,"s":1,"o":1},"back"]]
def C(name,x,y,w,moods=None,t0=0.05,bob=True,kf=None,deco=False):
    return {"type":"char","name":name,"w":w,"moods":moods or [[0,"happy"]],"kf":kf or pop(x,y,t0),"bob":{"a":7,"f":1.1} if bob else None,"deco":deco}
def T(text,x,y,w,size=88,t0=0.1,cls="cap",extra="",kf=None):
    html=f'<div class="{cls}" style="width:{w}px;font-size:{size}px;{extra}">{text}</div>'
    return {"type":"html","html":html,"style":f"width:{w}px","kf":kf or [[t0,{"x":x,"y":y+30,"s":.92,"o":0}],[t0+0.35,{"x":x,"y":y,"s":1,"o":1},"back"]]}
def H(html,x,y,w,t0=0.1,kf=None,style=""):
    return {"type":"html","html":html,"style":f"width:{w}px;{style}","kf":kf or [[t0,{"x":x,"y":y+40,"s":.85,"o":0}],[t0+0.4,{"x":x,"y":y,"s":1,"o":1},"back"]]}
def label(name,color):
    return f'<div class="sub pill" style="display:inline-block;font-size:44px;font-weight:600;color:{color}">{name}</div>'
