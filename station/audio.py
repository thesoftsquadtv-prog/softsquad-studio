# "the little station waits for the last train": heavy rain on the platform and a soft drum on the canopy roof, wind in the
# pines on the picture's gust() curve, valance drips plinking on the stone, thunder ~1.1 s after each flash (0.39 / 12.24 s),
# lantern chains creaking at the gust peaks, the stove's soft crackle, a relay click as the signal turns green (9.6 s) and a
# distant two-tone train horn answering (10.4 s), and an original slow piano piece (F - Dm - Bb - C, 5 s each).
# Rendered 1.5 s past LOOP; the tail is crossfaded over the head so the audio loops seamlessly.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR, mtof, rhodes
from scipy.io import wavfile
LOOP=20.0; XF=1.5; D=LOOP+XF; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(57)
WK=lambda k:2*np.pi*k/LOOP
gust=0.55+0.3*np.sin(WK(1)*t)+0.15*np.sin(WK(3)*t+1)+0.08*np.sin(WK(9)*t)
# heavy rain: broadband hiss + low wash + dense patter on the roof (slightly gust-modulated)
rain=bp(rng.standard_normal(n),800,7500)*0.055*(0.85+0.2*gust)+lp(rng.standard_normal(n),450)*0.05
drops=np.zeros(n); idx=rng.integers(0,n,int(D*140)); drops[idx]=rng.uniform(0.2,1,len(idx)); rain+=bp(drops,1500,7000)*0.13
# wind through the pines: a soft roar that swells with the gusts, plus a higher whistle at the peaks
wind=bp(rng.standard_normal(n),150,800)*0.12*gust**1.7+bp(rng.standard_normal(n),700,1900)*0.02*np.maximum(0,gust-0.5)**1.5*3
# eave drips: individual plinks on the porch boards and stones
drip=np.zeros(n)
for s0 in rng.uniform(0,D,int(D*3)):
    a=int(s0*SR);L=min(int(0.08*SR),n-a)
    if L<=0:continue
    tt=np.arange(L)/SR;f=rng.uniform(900,1700);drip[a:a+L]+=0.05*np.sin(2*np.pi*f*tt*(1+tt*4))*np.exp(-tt*60)
# rain drumming on the awning canvas (low, soft thuds) + the downpipe gurgle
fire=np.zeros(n); idx=rng.integers(0,n,int(D*60)); fire[idx]=rng.uniform(0.3,1,len(idx)); fire=lp(bp(fire,120,900),700)*0.5
fire+=bp(rng.standard_normal(n),300,1400)*0.012*(1+0.5*np.sin(2*np.pi*3.1*t)*np.sin(2*np.pi*0.7*t))
# thunder: crack then a long low roll (close-ish for the first, further for the second)
thunder=np.zeros(n)
def roll(s0,amp,crack):
    a=int(s0*SR);L=min(int(6.5*SR),n-a)
    if L<=0:return
    tt=np.arange(L)/SR;env=(1-np.exp(-tt*10))*np.exp(-tt*0.7)*(1+0.5*np.sin(tt*4.7)*np.exp(-tt*0.4))
    thunder[a:a+L]+=amp*lp(rng.standard_normal(L),150)*env*2.4+amp*crack*bp(rng.standard_normal(L),250,1800)*np.exp(-tt*5)
for s0,a,c in ((1.5,0.55,0.45),(13.35,0.42,0.2),(21.5,0.55,0.45)): roll(s0,a,c)
# lantern chain creak at the gust peaks
creak=np.zeros(n)
for s0 in (4.6,14.6,24.6):
    a=int(s0*SR);L=min(int(0.45*SR),n-a)
    if L<=0:continue
    tt=np.arange(L)/SR;f=380+70*np.sin(tt*11);creak[a:a+L]+=0.009*np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*np.sin(np.pi*tt/0.45)
creak=bp(creak,350,2600)
page=np.zeros(n)
# stove crackle (quiet, inside) + signal relay click + distant train horn (two detuned tones, soft attack, far away)
idx=rng.integers(0,n,int(D*9));cr=np.zeros(n);cr[idx]=rng.uniform(0.2,1,len(idx));page+=bp(cr,1200,5000)*0.05
a=int(9.6*SR);L=int(0.05*SR);tt=np.arange(L)/SR;page[a:a+L]+=0.08*np.exp(-tt*120)*np.sin(2*np.pi*2200*tt)
for s0,dur in ((10.4,1.3),(11.9,2.0)):
    a=int(s0*SR);L=min(int(dur*SR),n-a);tt=np.arange(L)/SR;env=np.minimum(1,tt/0.25)*np.minimum(1,(dur-tt)/0.5)
    hz=(np.sin(2*np.pi*311*tt)+0.8*np.sin(2*np.pi*370*tt)+0.3*np.sin(2*np.pi*622*tt))*env*0.035
    h2=np.zeros(n);h2[a:a+L]=hz;h2=lp(h2,1400)
    for dl,g in ((0.12,0.5),(0.31,0.35),(0.55,0.22)): d=int(dl*SR);h2[d:]+=h2[:-d]*g
    page+=h2
# piano lullaby (F major), warm and slow; chords 4 s each, last chord = first so the loop resolves
mus=np.zeros(n)
def put(x,s0):
    i=int(s0*SR)
    if i>=n:return
    j=min(n,i+len(x));mus[i:j]+=x[:j-i]
chords=[[41,53,57,60],[38,50,53,57],[46,53,58,62],[48,52,55,58],[41,53,57,60]]     # F Dm Bb C7 (F tail)
for i,ch in enumerate(chords):
    for k,m in enumerate(ch): put(rhodes(m,5.6,0.05 if k else 0.07,rng)*np.minimum(1,np.arange(int(5.6*SR))/SR/0.08),i*5.0+k*0.08)
mel=[(0.6,69),(1.6,72),(2.6,77),(3.8,76),(5.6,74),(6.6,72),(7.6,69),(8.8,65),(10.6,70),(11.6,74),(12.6,77),(13.8,74),
     (15.6,72),(16.6,70),(17.6,67),(18.8,72),(20.6,69),(21.1,72)]
for (s0,m) in mel: put(rhodes(m+12,2.8,0.07,rng)*np.exp(-np.arange(int(2.8*SR))/SR*0.7),s0)
mus=lp(mus,3800)
# a little room reverb on the music (simple multi-tap)
rev=np.zeros_like(mus)
for dl,g in ((0.051,0.35),(0.093,0.28),(0.147,0.22),(0.213,0.16),(0.31,0.1)): d=int(dl*SR);rev[d:]+=mus[:-d]*g
mus=mus+lp(rev,2500)
mix=rain*0.95+wind+drip+fire+thunder+creak+page+mus*1.1
N=int(LOOP*SR);X=int(XF*SR);out=mix[:N].copy();fade=np.linspace(0,1,X)
out[:X]=out[:X]*fade+mix[N:N+X]*(1-fade)
out=out/np.abs(out).max()*0.9
wavfile.write(sys.argv[1],SR,(np.stack([out,np.roll(out,int(0.011*SR))*0.96],1)*32767).astype(np.int16))
print('ok')
