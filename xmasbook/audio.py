# "the bookshop put its christmas lights up tonight": a hushed snowy street — soft snow-muffled air, a gentle wind that
# swells with the same gust() curve the picture uses, the hanging basket's chains creaking at the gust peaks, a faint
# muffled murmur/clink from inside the shop, and a slow original music-box/piano piece (C - Am - Dm - G, 5 s each).
# Rendered 1.5 s past LOOP; the tail is crossfaded over the head so the audio loops seamlessly.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR, mtof, rhodes
from scipy.io import wavfile
LOOP=20.0; XF=1.5; D=LOOP+XF; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(41)
WK=lambda k:2*np.pi*k/LOOP
gust=0.55+0.3*np.sin(WK(1)*t)+0.15*np.sin(WK(3)*t+1)+0.08*np.sin(WK(9)*t)
hush=lp(rng.standard_normal(n),500)*0.03
wind=bp(rng.standard_normal(n),150,700)*0.08*gust**1.7+bp(rng.standard_normal(n),600,1500)*0.012*np.maximum(0,gust-0.5)**1.5*3
creak=np.zeros(n)
for s0 in (4.6,14.6,24.6):
    a=int(s0*SR);L=min(int(0.45*SR),n-a)
    if L<=0:continue
    tt=np.arange(L)/SR;f=380+70*np.sin(tt*11);creak[a:a+L]+=0.006*np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*np.sin(np.pi*tt/0.45)
creak=bp(creak,350,2600)
clink=np.zeros(n)
for s0 in rng.uniform(0,LOOP,7):
    a=int(s0*SR);L=min(int(0.3*SR),n-a);tt=np.arange(L)/SR;clink[a:a+L]+=0.012*np.sin(2*np.pi*rng.uniform(2400,3400)*tt)*np.exp(-tt*25)
murmur=lp(bp(rng.standard_normal(n),200,900),600)*0.01*(1+0.4*np.sin(2*np.pi*0.3*t))
# music box over a soft piano; chords 4 s each, last chord = first so the loop resolves
mus=np.zeros(n)
def put(x,s0):
    i=int(s0*SR)
    if i>=n:return
    j=min(n,i+len(x));mus[i:j]+=x[:j-i]
chords=[[48,55,60,64],[45,52,57,60],[50,57,60,65],[43,50,55,59],[48,55,60,64]]     # C Am Dm G (C tail)
for i,ch in enumerate(chords):
    for k,m in enumerate(ch): put(rhodes(m,5.6,0.05 if k else 0.07,rng)*np.minimum(1,np.arange(int(5.6*SR))/SR/0.08),i*5.0+k*0.08)
mel=[(0.5,76),(1.5,74),(2.5,72),(3.5,67),(5.5,72),(6.5,71),(7.5,69),(8.5,64),(10.5,69),(11.5,72),(12.5,74),(13.5,77),
     (15.5,74),(16.5,71),(17.5,67),(18.5,71),(20.5,76),(21.0,74)]
for (s0,m) in mel: put(rhodes(m+12,2.8,0.07,rng)*np.exp(-np.arange(int(2.8*SR))/SR*0.7),s0)
mus=lp(mus,3800)
# a little room reverb on the music (simple multi-tap)
rev=np.zeros_like(mus)
for dl,g in ((0.051,0.35),(0.093,0.28),(0.147,0.22),(0.213,0.16),(0.31,0.1)): d=int(dl*SR);rev[d:]+=mus[:-d]*g
mus=mus+lp(rev,2500)
mix=hush+wind+creak+lp(clink,4000)+murmur+mus*1.2
N=int(LOOP*SR);X=int(XF*SR);out=mix[:N].copy();fade=np.linspace(0,1,X)
out[:X]=out[:X]*fade+mix[N:N+X]*(1-fade)
out=out/np.abs(out).max()*0.9
wavfile.write(sys.argv[1],SR,(np.stack([out,np.roll(out,int(0.011*SR))*0.96],1)*32767).astype(np.int16))
print('ok')
