# night bus, "text me when you get home": soft lofi under the low hum of the bus engine, tyres hissing on the wet road,
# rain ticking on the window, a gentle two-note chime when his messages land (2.4 s, 11.4 s) with a short haptic buzz,
# two tiny taps when her thumb double-taps (7.05, 7.32 s) and a soft pop as the 🤍 reaction appears.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(12)
m=track(57,bars=10,bpm=70)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2600)*0.75
engine=lp(rng.standard_normal(n),90)*0.10*(1+0.15*np.sin(t*0.7))+0.02*np.sin(2*np.pi*46*t)*(1+0.3*np.sin(t*0.4))
tyres=bp(rng.standard_normal(n),700,3500)*0.012*(1+0.2*np.sin(t*1.1))
drops=np.zeros(n);idx=rng.integers(0,n,int(D*25));drops[idx]=rng.uniform(0.2,1,len(idx));rain=bp(drops,1500,6000)*0.06+bp(rng.standard_normal(n),2000,8000)*0.004
fx=np.zeros(n)
def put(s0,sig):
    a=int(s0*SR);L=min(len(sig),n-a)
    if L>0: fx[a:a+L]+=sig[:L]
def chime(f1,f2):
    L=int(1.4*SR);tt=np.arange(L)/SR;s=np.zeros(L)
    s+=0.10*np.exp(-tt*5)*np.sin(2*np.pi*f1*tt)
    o=int(0.11*SR);s[o:]+=0.10*np.exp(-tt[:L-o]*4.5)*np.sin(2*np.pi*f2*tt[:L-o]);return s
def buzz():
    L=int(0.22*SR);tt=np.arange(L)/SR;return 0.06*np.sin(2*np.pi*170*tt)*np.sin(np.pi*tt/0.22)
def tap():
    L=int(0.04*SR);tt=np.arange(L)/SR;return 0.05*bp(rng.standard_normal(L),1500,5000)*np.exp(-tt*120)
def pop():
    L=int(0.2*SR);tt=np.arange(L)/SR;f=600+900*np.exp(-tt*25);return 0.08*np.exp(-tt*18)*np.sin(2*np.pi*np.cumsum(f)/SR)
for s0 in (2.4,11.4): put(s0,chime(1174.7,1568.0)); put(s0,buzz())
for s0 in (7.05,7.32): put(s0,tap())
put(7.4,pop())
mix=m+engine+tyres+rain+fx
mix*=np.minimum(1,t/0.4)*np.minimum(1,(D-t)/1.2)
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
