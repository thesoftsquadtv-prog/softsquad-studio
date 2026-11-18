# soft lofi + rain on the window + the phone buzzing when he calls (12.5 s on)
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, rain, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 18; n=int(D*SR); t=np.arange(n)/SR
m=track(11,bars=12,bpm=68)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,3200)*0.85
m*=1-0.45*np.clip((t-6.3)/1.2,0,1)*(t<8.6)          # music sinks as she drifts off...
m*=1+0.25*np.clip((t-12.6)/1.0,0,1)                  # ...and blooms when he calls
r=rain(D,seed=33)[:n]*0.55
rng=np.random.default_rng(4)
buzz=np.zeros(n)
for k in range(8):
    s0=12.5+k*0.8
    if s0>D-0.3: break
    a,b=int(s0*SR),int(min(D,s0+0.45)*SR); tt=np.arange(b-a)/SR
    motor=np.sign(np.sin(2*np.pi*150*tt))*0.5+np.sin(2*np.pi*300*tt)*0.3
    e=np.minimum(1,tt/0.02)*np.minimum(1,(0.45-tt)/0.03)
    buzz[a:b]+=bp(motor+0.3*rng.standard_normal(b-a),90,900)*e*0.16   # rattling on the mattress
mix=m+r+buzz
mix*=np.minimum(1,t/0.6)*np.minimum(1,(D-t)/1.2)
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
