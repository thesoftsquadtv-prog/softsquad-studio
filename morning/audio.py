# "the first morning he's back": blue snowy morning, the heart on the window — slow warm lofi, a hushed snowy room tone,
# soft gusts against the glass, the lamp's faint hum, and a quiet fabric rustle when they lean in at 7.6 s.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR
rng=np.random.default_rng(27)
m=track(83,bars=10,bpm=66)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2600)*0.75
m*=0.86+0.2*np.clip((t-9.4)/1.2,0,1)                       # opens a little with the second caption
hush=lp(rng.standard_normal(n),420)*0.02
gust=lp(hp(rng.standard_normal(n),300),1400)*(0.012+0.018*np.clip(np.sin(2*np.pi*t/7.3+1)**2,0,1))
hum=np.sin(2*np.pi*60*t)*0.0025
rus=np.zeros(n); i=int(7.6*SR); L=int(0.9*SR); tt=np.arange(L)/SR
rus[i:i+L]=bp(rng.standard_normal(L),900,4200)*np.sin(np.pi*tt/0.9)**2*0.05
# a robin somewhere in the snowy garden: two soft distant phrases
bird=np.zeros(n)
for t0 in (3.1,11.8):
    for k,f0 in enumerate((3900,4300,3600,4100)):
        i0=int((t0+k*0.16)*SR);L=int(0.11*SR);tt=np.arange(L)/SR
        bird[i0:i0+L]+=np.sin(2*np.pi*(f0+900*np.sin(np.pi*tt/0.11))*tt)*np.sin(np.pi*tt/0.11)**2*0.012
# the drip's tiny tick on the glass when it lets go at 8.2 s
tick=np.zeros(n);i0=int(8.2*SR);L=int(0.05*SR);tt=np.arange(L)/SR;tick[i0:i0+L]=np.sin(2*np.pi*2600*tt)*np.exp(-tt*90)*0.02
base=m+hush+hum+rus+lp(bird,6000)+tick
mix=np.stack([base+gust*0.8,base+np.roll(gust,int(0.03*SR))],1)
mix*=(np.minimum(1,t/0.4)*np.minimum(1,(D-t)/1.2))[:,None]
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
