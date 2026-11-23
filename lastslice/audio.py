# "he saved me the last slice": soft slow lofi, rain on the window, low fridge hum, a little kettle-tick as the mug cools,
# and his message: the phone buzzes twice against the wooden counter at 7.2 s (synced with the jitter in scene.js).
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR
rng=np.random.default_rng(24)
m=track(31,bars=10,bpm=64)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2600)*0.62
m*=1+0.25*np.clip((t-10.0)/1.0,0,1)                         # blooms with the second caption
rain=bp(rng.standard_normal(n),900,6000)*0.05*(1+0.15*np.sin(t*0.7))
pat=np.zeros(n)
for s0 in rng.uniform(0,D,90):                                # individual drops tapping the glass
    i=int(s0*SR);L=int(0.03*SR)
    if i+L<n: pat[i:i+L]+=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*180)*0.05
rain+=hp(pat,1500)
hum=(np.sin(2*np.pi*50*t)*0.006+np.sin(2*np.pi*100*t)*0.003)*(1+0.1*np.sin(t*0.3))
buzz=np.zeros(n)
for a in (7.2,7.48):
    i=int(a*SR);L=int(0.2*SR);tt=np.arange(L)/SR
    sig=np.sign(np.sin(2*np.pi*155*tt))*0.5+np.sin(2*np.pi*310*tt)*0.3
    buzz[i:i+L]+=lp(sig,900)[:L]*np.minimum(1,tt/0.01)*np.minimum(1,(0.2-tt)/0.03)*0.09
mix=m+rain+hum+buzz
mix*=np.minimum(1,t/0.3)*np.minimum(1,(D-t)/1.2)
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
