# "we fell asleep on the phone again": slow lofi (no drums feel), quiet room tone, his breathing through the phone
# (period 4.2 s, synced to the waveform in oncall.html), a soft whispered two-beat "good-night" at 8.4/9.1 s,
# and a few slow drips from the window ledge now that the rain has stopped.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR
rng=np.random.default_rng(7)
m=track(23,bars=10,bpm=62)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2400)*0.7
m*=1+0.2*np.clip((t-10.2)/1.0,0,1)                       # blooms with the second caption
room=lp(rng.standard_normal(n),300)*0.02
# his breathing on the call: phone-speaker band, inhale/exhale on the 4.2 s cycle
ph=np.maximum(0,np.sin(t*2*np.pi/4.2))**1.5
breath=bp(rng.standard_normal(n),400,2600)*ph*0.05
# whisper "good-night": two breathy syllables
wh=np.zeros(n)
for a,b in [(8.4,8.95),(9.1,9.6)]:
    i,j=int(a*SR),int(b*SR);tt=np.arange(j-i)/SR;e=np.sin(np.pi*tt/(b-a))**2
    wh[i:j]+=bp(rng.standard_normal(j-i),700,3200)[:j-i]*e*0.11
wh=bp(wh,600,3400)
drip=np.zeros(n)
for s0 in [1.7,5.9,11.3,14.6]:
    i=int(s0*SR);L=int(0.18*SR);tt=np.arange(L)/SR;f=1800-2600*tt
    drip[i:i+L]+=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*28)*0.05
mix=m+room+breath+wh+drip
mix*=np.minimum(1,t/0.4)*np.minimum(1,(D-t)/1.2)
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
