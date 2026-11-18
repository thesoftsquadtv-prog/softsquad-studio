# Dough's soundtrack: gentle kitchen guitar, room tone, grumbly "hmph"s, squishes and flour puffs, a sigh and a final flop.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR
from scipy.io import wavfile
from scipy.signal import lfilter
D=float(sys.argv[2]); n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(5); out=np.zeros(n)
def put(x,at,g=1.0):
    a=int(at*SR); b=min(n,a+len(x)); out[a:b]+=x[:b-a]*g
def ks(f,dur,dec=0.996):                     # plucked string (Karplus-Strong)
    N=int(SR/f); buf=rng.uniform(-1,1,N); y=np.zeros(int(dur*SR))
    for i in range(len(y)): y[i]=buf[i%N]; buf[i%N]=dec*0.5*(buf[i%N]+buf[(i+1)%N])
    return lp(y,3500)
# light, playful guitar: a simple I-vi-IV-V picking pattern at a relaxed tempo
mtof=lambda m:440*2**((m-69)/12); beat=0.42
prog=[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]]
cache={}
for bar in range(int(D/(beat*4))+1):
    ch=prog[bar%4]
    for k,i in enumerate([0,2,1,3,2,1,3,2]):
        at=bar*beat*4+k*beat*0.5
        if at>D-0.5 or (14.3<at<15.2): continue
        m=ch[i]+(12 if k in (3,6) else 0); key=m
        if key not in cache: cache[key]=ks(mtof(m),1.6)
        put(cache[key],at,0.11*(0.8 if k%2 else 1.0))
for bar in range(int(D/(beat*4))+1):
    at=bar*beat*4
    if at<D-0.5 and not (14.3<at<15.2): put(ks(mtof(prog[bar%4][0]-12),2.2,0.997),at,0.13)
out*=1-0.6*((t>8.4)&(t<11.5))           # music dips for the deadpan stare
# room tone
out+=lp(rng.standard_normal(n),900)*0.004
def voice(f0,dur,formants,breath=0.15,glide=0.0):
    m=int(dur*SR); tt=np.arange(m)/SR; f=f0*(1+glide*tt/dur)
    ph=np.cumsum(f/SR); src=(2*(ph%1)-1)*0.6+rng.standard_normal(m)*breath
    y=sum(bp(src,a,b)*g for a,b,g in formants)
    e=np.minimum(1,tt/0.03)*np.minimum(1,(dur-tt)/0.08)
    return y*e
def hmph(at,pitch):
    put(voice(pitch,0.22,[(250,500,1.0),(800,1300,0.5)],0.25,-0.3),at,0.5)
    put(hp(rng.standard_normal(int(0.12*SR)),1500)*np.linspace(1,0,int(0.12*SR))**2,at+0.16,0.05)
def squish(at):
    m=int(0.28*SR); tt=np.arange(m)/SR
    thud=np.sin(2*np.pi*(90-60*tt/0.28)*tt)*np.exp(-tt*18)
    wet=bp(rng.standard_normal(m),300,1400)*np.exp(-tt*14)*(1+0.8*np.sin(2*np.pi*35*tt))
    put(thud*0.5+wet*0.25,at)
def puff(at,g=0.06):
    m=int(0.5*SR); tt=np.arange(m)/SR; put(bp(rng.standard_normal(m),800,6000)*np.exp(-tt*7)*np.minimum(1,tt/0.02),at,g)
def sigh(at,dur,g=0.4):
    m=int(dur*SR); tt=np.arange(m)/SR; e=np.sin(np.pi*tt/dur)**1.5
    put((bp(rng.standard_normal(m),400,2200)*0.8+voice(110,dur,[(300,700,1)],0.6,-0.35)*0.3)*e,at,g)
sigh(0.15,1.1)
for k,at in enumerate([1.8,2.9,4.0,5.1,6.2,7.3,11.8,12.9]):
    squish(at+0.05); squish(at+0.23); puff(at+0.1,0.035)
    hmph(at-0.05,[150,140,160,135,155,130,145,150][k])
# the stare: a tiny blink sound and a deadpan "...hm."
put(voice(120,0.35,[(250,600,1)],0.2,-0.2),10.0,0.25)
# proud little "hmp!" then the flop and a long contented sigh
put(voice(200,0.18,[(300,700,1),(900,1400,0.5)],0.2,0.4),13.6,0.35)
squish(14.45); squish(14.6); puff(14.5,0.08); sigh(14.9,1.4,0.35)
out=out/np.abs(out).max()*0.9; out*=np.minimum(1,t/0.3)*np.minimum(1,(D-t)/0.6)
wavfile.write(sys.argv[1],SR,(out*32767).astype(np.int16)); print('ok')
