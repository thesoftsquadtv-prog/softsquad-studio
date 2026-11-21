# "the light stays on": steady rain, wind gusting with the same gust() curve the picture uses (grass, smoke, lamp),
# the sea surging against the cliff with three big sets that land with the spray (3.0, 9.6, 15.4 s), thunder rolling in
# ~1.1 s after each flash (0.45 and 12.3 s), the lamp-post lantern creaking on its bracket, and a slow, warm music-box
# lullaby (A minor -> F -> C -> G -> Am, 4 s each) so the storm feels safe. Rendered 1.5 s past LOOP; the tail is
# crossfaded over the head so the audio loops seamlessly.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR
from scipy.io import wavfile
LOOP=20.0; XF=1.5; D=LOOP+XF; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(47)
WK=lambda k:2*np.pi*k/LOOP
gust=0.55+0.3*np.sin(WK(1)*t)+0.15*np.sin(WK(3)*t+1)+0.08*np.sin(WK(9)*t)
rain=bp(rng.standard_normal(n),900,7000)*0.05+lp(rng.standard_normal(n),500)*0.04
drops=np.zeros(n); idx=rng.integers(0,n,int(D*90)); drops[idx]=rng.uniform(0.2,1,len(idx)); rain+=bp(drops,2000,8000)*0.12
wind=bp(rng.standard_normal(n),180,900)*0.11*gust**1.6+bp(rng.standard_normal(n),900,2400)*0.015*gust**2
# open sea: low wash rising and falling
sea=lp(rng.standard_normal(n),300)*0.09*(0.6+0.4*np.sin(WK(4)*t)**2)
def surge(s0,amp):
    a=int(s0*SR);L=min(int(3.2*SR),n-a)
    if L<=0:return
    tt=np.arange(L)/SR;env=np.where(tt<0.25,tt/0.25,np.exp(-(tt-0.25)*1.6))
    sea[a:a+L]+=amp*(lp(rng.standard_normal(L),900)*0.5+bp(rng.standard_normal(L),900,5000)*0.25)*env
    sea[a:a+L]+=amp*0.6*np.sin(2*np.pi*48*tt)*np.exp(-tt*6)
for s0 in (3.0,9.6,15.4,23.0): surge(s0-0.08,0.55)
# thunder: a crack then a long low roll, lowpassed (far out at sea)
thunder=np.zeros(n)
def roll(s0,amp):
    a=int(s0*SR);L=min(int(6*SR),n-a)
    if L<=0:return
    tt=np.arange(L)/SR;env=(1-np.exp(-tt*8))*np.exp(-tt*0.75)*(1+0.5*np.sin(tt*5.3)*np.exp(-tt*0.4))
    thunder[a:a+L]+=amp*lp(rng.standard_normal(L),160)*env*2.2+amp*0.25*bp(rng.standard_normal(L),200,900)*np.exp(-tt*4)
for s0,a in ((1.55,0.5),(13.4,0.38),(21.55,0.5)): roll(s0,a)
# lantern creak on the bracket at the gust peaks
creak=np.zeros(n)
for s0 in (4.2,14.1,24.2):
    a=int(s0*SR);L=min(int(0.5*SR),n-a)
    if L<=0:continue
    tt=np.arange(L)/SR;f=320+60*np.sin(tt*9);creak[a:a+L]+=0.012*np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*np.sin(np.pi*tt/0.5)
creak=bp(creak,300,2500)
def mtof(m): return 440*2**((m-69)/12)
mus=np.zeros(n)
chords=[[45,52,57,60],[41,48,53,57],[48,52,55,60],[43,50,55,59],[45,52,57,60],[45,52,57,60]]   # Am F C G Am (+ Am tail = head)
for i,ch in enumerate(chords):
    st=int(i*4.0*SR);L=min(int(4.6*SR),n-st)
    if L<=0:break
    tt=np.arange(L)/SR;env=np.minimum(1,tt/1.3)*np.minimum(1,(4.6-tt)/1.3)
    for m in ch: mus[st:st+L]+=0.013*env*(np.sin(2*np.pi*mtof(m)*tt)+0.3*np.sin(2*np.pi*mtof(m)*1.003*tt))
mel=[(0,76),(1,72),(2,71),(3,69),(4,72),(5.5,69),(6,65),(7,67),(8,67),(9,72),(10,76),(11,74),(12,71),(13,67),(14,69),(15,71),(16,72),(17.5,69),(20,76),(21,72)]
for (b,m) in mel:
    st=int((0.25+b)*SR);L=min(int(2.6*SR),n-st)
    if L<=0:continue
    tt=np.arange(L)/SR;f=mtof(m+12)
    mus[st:st+L]+=0.04*np.exp(-tt*2.2)*(np.sin(2*np.pi*f*tt)+0.25*np.sin(2*np.pi*f*2.0*tt)+0.08*np.sin(2*np.pi*f*4.07*tt))
mus=lp(mus,4200)
mix=rain*0.9+wind+sea+thunder+creak+mus
N=int(LOOP*SR);X=int(XF*SR);out=mix[:N].copy();fade=np.linspace(0,1,X)
out[:X]=out[:X]*fade+mix[N:N+X]*(1-fade)
out=out/np.abs(out).max()*0.9
wavfile.write(sys.argv[1],SR,(out*32767).astype(np.int16))
print('ok')
