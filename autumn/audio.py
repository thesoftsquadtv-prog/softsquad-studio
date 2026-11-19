# Windy autumn night: gusting wind (same gust curve as the picture), dry leaves rustling and skittering,
# the garden gate tapping its post when a gust lets it swing back, a distant owl, and a slow music-box/pad lullaby.
# Rendered 1.5 s longer than LOOP and the tail crossfaded over the head so the audio loops seamlessly with the video.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR
from scipy.io import wavfile
LOOP=20.0; XF=1.5; D=LOOP+XF; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(12)
WK=lambda k:2*np.pi*k/LOOP
gust=0.55+0.3*np.sin(WK(1)*t)+0.15*np.sin(WK(3)*t+1)+0.08*np.sin(WK(9)*t)
# wind: low roar + whistling band that rises with the gusts
w1=lp(rng.standard_normal(n),420)*0.09*(0.3+gust**2)
w2=bp(rng.standard_normal(n),700,1600)*0.035*np.clip(gust-0.45,0,1)*2
# leaves: crackly high rustle in bursts that follow the gusts
crack=np.zeros(n); idx=rng.integers(0,n,int(D*260)); crack[idx]=rng.uniform(0.2,1,len(idx))*np.clip(gust[idx]-0.3,0,1)
leaves=bp(crack,2500,9000)*0.5+bp(rng.standard_normal(n),3000,8000)*0.012*gust
# gate: a soft wooden tap each time the opening reaches a minimum (matches op(t) in scene.js)
op=np.maximum(0,0.25+0.45*gust*(0.6+0.4*np.sin(WK(4)*t)))
tap=np.zeros(n); mins=np.where((op[1:-1]<op[:-2])&(op[1:-1]<=op[2:]))[0]+1
for m in mins:
    if m+4000<n:
        tt=np.arange(4000)/SR; tap[m:m+4000]+=0.25*np.exp(-tt*40)*np.sin(2*np.pi*180*tt)+0.12*np.exp(-tt*60)*bp(rng.standard_normal(4000),800,3000)
# distant owl (two soft hoots)
owl=np.zeros(n)
for s0 in (8.2,9.0):
    a=int(s0*SR);L=int(0.45*SR);tt=np.arange(L)/SR;f=380-40*tt
    owl[a:a+L]+=0.05*np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/0.45)**2
# lullaby: music box over a warm pad, 4-bar phrase in F major at 60 bpm (20 s = 5 bars of 4 s → 5 chords)
def mtof(m): return 440*2**((m-69)/12)
mus=np.zeros(n)
chords=[[53,57,60,64],[50,53,57,60],[46,50,53,57],[48,52,55,60],[53,57,60,65]]
for i,ch in enumerate(chords):
    st=int(i*4.0*SR);L=int(4.6*SR)
    if st>=n:break
    L=min(L,n-st);tt=np.arange(L)/SR;env=np.minimum(1,tt/1.2)*np.minimum(1,(4.6-tt)/1.2)
    for m in ch: mus[st:st+L]+=0.016*env*(np.sin(2*np.pi*mtof(m)*tt)+0.3*np.sin(2*np.pi*mtof(m)*1.004*tt))
mel=[(0,72),(1,69),(2,67),(3,65),(4,69),(5,67),(6,65),(7,62),(8,65),(9,62),(10,60),(11,58),(12,64),(13,62),(14,60),(15,67),(16,65),(17.5,69)]
for (b,m) in mel:
    st=int((0.2+b)*SR);L=min(int(2.5*SR),n-st)
    if L<=0:continue
    tt=np.arange(L)/SR;f=mtof(m+12)
    mus[st:st+L]+=0.05*np.exp(-tt*2.2)*(np.sin(2*np.pi*f*tt)+0.25*np.sin(2*np.pi*f*2.01*tt)+0.1*np.sin(2*np.pi*f*3.98*tt))
mus=lp(mus,5000)
mix=w1+w2+leaves+tap+owl+mus
# crossfade the extra tail over the head → seamless loop
N=int(LOOP*SR);X=int(XF*SR);out=mix[:N].copy();fade=np.linspace(0,1,X)
out[:X]=out[:X]*fade+mix[N:N+X]*(1-fade)
out=out/np.abs(out).max()*0.9
wavfile.write(sys.argv[1],SR,(out*32767).astype(np.int16))
print('ok',len(mins),'gate taps')
