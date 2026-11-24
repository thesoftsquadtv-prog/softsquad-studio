# "he flies home tomorrow": soft slow lofi, rain against the window (patter + the odd heavier drop), a quiet room tone,
# a distant jet passing over (3.6-12 s, panned right to left with the plane), and the phone's short buzz on the ledge at 8.6 s.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR
rng=np.random.default_rng(11)
m=track(57,bars=10,bpm=64)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2600)*0.75
m*=0.9+0.15*np.clip((t-9.9)/1.2,0,1)                       # opens a little with the second caption
rain=bp(rng.standard_normal(n),900,6000)*0.03+lp(rng.standard_normal(n),400)*0.03
pat=np.zeros(n);idx=rng.integers(0,n,int(D*50));pat[idx]=rng.uniform(0.2,1,len(idx));rain+=bp(pat,1500,6500)*0.12
room=lp(rng.standard_normal(n),250)*0.015
# distant jet: low filtered roar that swells and fades, moving right->left
jet=np.zeros(n);a,b=int(3.6*SR),int(12.2*SR);u=np.linspace(0,1,b-a);env=np.sin(np.pi*u)**2
jet[a:b]=lp(bp(rng.standard_normal(b-a),80,900),500)*env*0.09
pan=np.clip((t-3.6)/8.6,0,1)                                # 0 = right, 1 = left
buzz=np.zeros(n)
for s0 in (8.6,8.85):
    i=int(s0*SR);L=int(0.16*SR);tt=np.arange(L)/SR;buzz[i:i+L]+=np.sign(np.sin(2*np.pi*170*tt))*np.exp(-tt*8)*0.05
buzz=lp(bp(buzz,120,1800),1500)
base=m+rain+room+buzz
mix=np.stack([base+jet*(0.4+0.6*pan),base+jet*(1-0.6*pan)],1)
mix*=(np.minimum(1,t/0.4)*np.minimum(1,(D-t)/1.2))[:,None]
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
