# "everyone made it home tonight": first-snow hush (soft broadband air), a muffled wind on the picture's gust() curve,
# the barn lantern's bracket creaking at the gust peaks, a faint warm murmur of a full house behind the glass (low-passed
# voices + a clink of cutlery and a soft laugh now and then), a log fire's crackle through the walls, and an original slow
# piano lullaby (G - Em - C - D, 5 s each). Rendered 1.5 s past LOOP; the tail is crossfaded over the head so it loops.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR, mtof, rhodes
from scipy.io import wavfile
LOOP=20.0; XF=1.5; D=LOOP+XF; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(126)
WK=lambda k:2*np.pi*k/LOOP
gust=0.55+0.3*np.sin(WK(1)*t)+0.15*np.sin(WK(3)*t+1)+0.08*np.sin(WK(9)*t)
hush=bp(rng.standard_normal(n),400,5000)*0.012+lp(rng.standard_normal(n),200)*0.02
wind=bp(rng.standard_normal(n),120,650)*0.10*gust**1.8+bp(rng.standard_normal(n),600,1500)*0.012*np.maximum(0,gust-0.55)**1.5*3
# murmur of the house: noise shaped into syllable-ish bursts (3-5 Hz), formant band-passed, heavily low-passed (through glass)
mur=np.zeros(n)
for k in range(4):
    syl=np.clip(np.sin(2*np.pi*rng.uniform(3,5)*t+rng.uniform(0,6))+np.sin(2*np.pi*rng.uniform(0.2,0.5)*t+rng.uniform(0,6))*0.8,0,None)
    mur+=bp(rng.standard_normal(n),rng.uniform(250,450),rng.uniform(900,1400))*syl*0.02
mur=lp(mur,700)
for s0 in (3.2,11.4,17.8):     # soft distant laughs
    a=int(s0*SR);L=int(1.0*SR);tt=np.arange(L)/SR;env=np.clip(np.sin(2*np.pi*5.5*tt),0,None)*np.exp(-tt*2.2)
    mur[a:a+L]+=lp(bp(rng.standard_normal(L),300,1200)*env*0.05,800)
clink=np.zeros(n)
for s0 in rng.uniform(0,D,9):
    a=int(s0*SR);L=min(int(0.25*SR),n-a);tt=np.arange(L)/SR;clink[a:a+L]+=0.012*np.sin(2*np.pi*rng.uniform(2400,3600)*tt)*np.exp(-tt*22)
clink=lp(clink,3000)
fire=np.zeros(n); idx=rng.integers(0,n,int(D*14)); fire[idx]=rng.uniform(0.2,1,len(idx)); fire=lp(bp(fire,600,4000),2000)*0.05
creak=np.zeros(n)
for s0 in (4.6,14.6,24.6):
    a=int(s0*SR);L=min(int(0.5*SR),n-a)
    if L<=0:continue
    tt=np.arange(L)/SR;f=420+60*np.sin(tt*9);creak[a:a+L]+=0.007*np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*np.sin(np.pi*tt/0.5)
creak=bp(creak,350,2600)
mus=np.zeros(n)
def put(x,s0):
    i=int(s0*SR)
    if i>=n:return
    j=min(n,i+len(x));mus[i:j]+=x[:j-i]
chords=[[43,55,59,62],[40,52,55,59],[36,48,55,60],[38,50,54,57],[43,55,59,62]]     # G Em C D (G tail)
for i,ch in enumerate(chords):
    for k,m in enumerate(ch): put(rhodes(m,5.6,0.05 if k else 0.07,rng)*np.minimum(1,np.arange(int(5.6*SR))/SR/0.08),i*5.0+k*0.09)
mel=[(0.7,71),(1.8,74),(2.9,79),(4.0,78),(5.7,76),(6.8,74),(7.9,71),(9.0,67),(10.7,72),(11.8,76),(12.9,79),(14.0,76),
     (15.7,74),(16.8,72),(17.9,69),(19.0,74),(20.7,71),(21.2,74)]
for (s0,m) in mel: put(rhodes(m+12,2.8,0.065,rng)*np.exp(-np.arange(int(2.8*SR))/SR*0.7),s0)
mus=lp(mus,3600)
rev=np.zeros_like(mus)
for dl,g in ((0.051,0.35),(0.093,0.28),(0.147,0.22),(0.213,0.16),(0.31,0.1)): d=int(dl*SR);rev[d:]+=mus[:-d]*g
mus=mus+lp(rev,2500)
mix=hush+wind+mur+clink+fire+creak+mus*1.1
N=int(LOOP*SR);Xf=int(XF*SR);out=mix[:N].copy();fade=np.linspace(0,1,Xf)
out[:Xf]=out[:Xf]*fade+mix[N:N+Xf]*(1-fade)
out=out/np.abs(out).max()*0.9
wavfile.write(sys.argv[1],SR,(np.stack([out,np.roll(out,int(0.011*SR))*0.96],1)*32767).astype(np.int16))
print('ok')
