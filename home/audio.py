# "he's almost home": dawn after the rain — soft slow lofi, a quiet room tone, a last few drips off the gutter,
# early birds waking outside (small synthesized chirps, sparse, panned), and the phone's short buzz on the ledge at 2.4 s and 11.0 s.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR
rng=np.random.default_rng(26)
m=track(62,bars=10,bpm=66)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2800)*0.75
m*=0.88+0.18*np.clip((t-9.4)/1.2,0,1)                       # opens a little with the second caption
room=lp(rng.standard_normal(n),250)*0.012
drip=np.zeros(n)
for s0 in np.cumsum(rng.uniform(1.2,2.6,12)):
    i=int(s0*SR)
    if i+4000<n: tt=np.arange(4000)/SR; f=900+600*rng.random(); drip[i:i+4000]+=np.sin(2*np.pi*(f+800*np.exp(-tt*60))*tt)*np.exp(-tt*40)*0.05
L=np.zeros(n);R=np.zeros(n)
def chirp(at,f0,pan,amp):
    for k in range(rng.integers(2,5)):
        i=int((at+k*0.11)*SR);ln=int(0.07*SR)
        if i+ln>=n: return
        tt=np.arange(ln)/SR;f=f0*(1+0.35*np.sin(np.pi*tt/0.07))+rng.uniform(-80,80)
        sig=np.sin(2*np.pi*np.cumsum(np.full(ln,1.0)*f)/SR)*np.sin(np.pi*tt/0.07)**2*amp
        L[i:i+ln]+=sig*(1-pan);R[i:i+ln]+=sig*pan
for at in np.cumsum(rng.uniform(0.9,2.2,14)):
    chirp(at,rng.uniform(2600,4200),rng.uniform(0.15,0.85),0.035*rng.uniform(0.5,1))
buzz=np.zeros(n)
for m0 in (2.4,11.0):
    for s0 in (m0,m0+0.25):
        i=int(s0*SR);Lb=int(0.16*SR);tt=np.arange(Lb)/SR;buzz[i:i+Lb]+=np.sign(np.sin(2*np.pi*170*tt))*np.exp(-tt*8)*0.05
buzz=lp(bp(buzz,120,1800),1500)
base=m+room+drip+buzz
mix=np.stack([base+lp(L,7000),base+lp(R,7000)],1)
mix*=(np.minimum(1,t/0.4)*np.minimum(1,(D-t)/1.2))[:,None]
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
