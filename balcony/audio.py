# balcony, "tonight, i am": soft lofi, the city far below (low traffic hum, the odd distant car), a light night breeze,
# and a gentle shimmer of chimes as the shooting star crosses (7.4–8.5 s); the music opens up a little after it.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR
m=track(41,bars=10,bpm=68)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2400+1400*np.clip((t-8.0)/2.0,0,1).mean())*0.8
m*=0.85+0.15*np.clip((t-8.2)/1.5,0,1)
rng=np.random.default_rng(5)
city=lp(rng.standard_normal(n),140)*0.05+bp(rng.standard_normal(n),200,600)*0.01
for s0 in (2.6,11.3):   # a car passing far below
    a=int(s0*SR);L=int(3.2*SR);tt=np.arange(L)/SR;env=np.sin(np.pi*tt/3.2)**2
    city[a:a+L]+=bp(rng.standard_normal(L),300,1400)*0.03*env
breeze=bp(rng.standard_normal(n),400,2500)*0.012*(0.6+0.4*np.sin(t*0.5))
chime=np.zeros(n)
for i,(s0,mi) in enumerate([(7.45,88),(7.6,91),(7.75,95),(7.92,100),(8.1,103)]):
    a=int(s0*SR);L=min(int(3.5*SR),n-a);tt=np.arange(L)/SR;f=440*2**((mi-69)/12)
    chime[a:a+L]+=0.03*np.exp(-tt*1.4)*(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*f*2.01*tt))
mix=m+city+breeze+chime
mix*=np.minimum(1,t/0.5)*np.minimum(1,(D-t)/1.2)
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
