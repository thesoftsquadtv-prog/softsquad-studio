# "first snow at the cabin, so the tree went up": hushed snowy pines — snow-muffled air, a soft wind that swells with
# the picture's gust() curve, the fire crackling behind the glass (a log pops at 13.5 s when the dog's ear lifts), and
# a slow original music box over piano (D - Bm - G - A, 5 s each). Rendered 1.5 s past LOOP; tail crossfaded over the head.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR, mtof, rhodes
from scipy.io import wavfile
LOOP=20.0; XF=1.5; D=LOOP+XF; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(41)
WK=lambda k:2*np.pi*k/LOOP
gust=0.55+0.3*np.sin(WK(1)*t)+0.15*np.sin(WK(3)*t+1)+0.08*np.sin(WK(9)*t)
hush=lp(rng.standard_normal(n),500)*0.03
wind=bp(rng.standard_normal(n),150,700)*0.08*gust**1.7+bp(rng.standard_normal(n),600,1500)*0.012*np.maximum(0,gust-0.5)**1.5*3
crack=np.zeros(n)
for s0 in rng.uniform(0,LOOP+XF,90):
    a=int(s0*SR);L=min(int(0.02*SR),n-a)
    if L<=0:continue
    crack[a:a+L]+=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*300)*rng.uniform(0.01,0.04)
for s0 in (13.5,):
    a=int(s0*SR);L=int(0.09*SR);crack[a:a+L]+=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*60)*0.12
crack=lp(bp(crack,700,5000),3000)*0.55   # behind the glass: muffled
roar=lp(rng.standard_normal(n),300)*0.006
# music box over a soft piano; chords 4 s each, last chord = first so the loop resolves
mus=np.zeros(n)
def put(x,s0):
    i=int(s0*SR)
    if i>=n:return
    j=min(n,i+len(x));mus[i:j]+=x[:j-i]
chords=[[50,57,62,66],[47,54,59,62],[43,50,55,59],[45,52,57,61],[50,57,62,66]]     # D Bm G A (D tail)
for i,ch in enumerate(chords):
    for k,m in enumerate(ch): put(rhodes(m,5.6,0.05 if k else 0.07,rng)*np.minimum(1,np.arange(int(5.6*SR))/SR/0.08),i*5.0+k*0.08)
mel=[(0.5,78),(1.5,76),(2.5,74),(3.5,69),(5.5,71),(6.5,74),(7.5,73),(8.5,71),(10.5,67),(11.5,71),(12.5,74),(13.5,76),
     (15.5,73),(16.5,76),(17.5,73),(18.5,69),(20.5,78),(21.0,76)]
for (s0,m) in mel: put(rhodes(m+12,2.8,0.07,rng)*np.exp(-np.arange(int(2.8*SR))/SR*0.7),s0)
mus=lp(mus,3800)
# a little room reverb on the music (simple multi-tap)
rev=np.zeros_like(mus)
for dl,g in ((0.051,0.35),(0.093,0.28),(0.147,0.22),(0.213,0.16),(0.31,0.1)): d=int(dl*SR);rev[d:]+=mus[:-d]*g
mus=mus+lp(rev,2500)
mix=hush+wind+crack+roar+mus*1.2
N=int(LOOP*SR);X=int(XF*SR);out=mix[:N].copy();fade=np.linspace(0,1,X)
out[:X]=out[:X]*fade+mix[N:N+X]*(1-fade)
out=out/np.abs(out).max()*0.9
wavfile.write(sys.argv[1],SR,(np.stack([out,np.roll(out,int(0.011*SR))*0.96],1)*32767).astype(np.int16))
print('ok')
