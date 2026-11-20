# Snowed in: the hush of falling snow (soft, muffled wind), a fire crackling indoors behind the glass,
# a faint wind-chime tinkle under the porch, and a slow celesta/pad lullaby in D major.
# Rendered 1.5 s longer than LOOP and the tail crossfaded over the head so the audio loops seamlessly.
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import lp, hp, bp, SR
from scipy.io import wavfile
LOOP=20.0; XF=1.5; D=LOOP+XF; n=int(D*SR); t=np.arange(n)/SR; rng=np.random.default_rng(31)
WK=lambda k:2*np.pi*k/LOOP
# muffled snowy air: very low, slow-breathing wind
breath=0.6+0.25*np.sin(WK(1)*t)+0.15*np.sin(WK(2)*t+0.7)
wind=lp(rng.standard_normal(n),260)*0.07*breath+bp(rng.standard_normal(n),300,900)*0.008*breath
# fire indoors: soft pops and a low roar, lowpassed as if heard through the window
pops=np.zeros(n); idx=rng.integers(0,n,int(D*14)); pops[idx]=rng.uniform(0.3,1,len(idx))
fire=lp(bp(pops,600,5000)*0.9,2500)+lp(rng.standard_normal(n),180)*0.015
# wind chime: a few gentle notes when the breath of wind peaks
chime=np.zeros(n)
for s0,m in [(3.1,86),(3.5,90),(13.2,88),(13.7,93),(14.1,86)]:
    a=int(s0*SR);L=min(int(3*SR),n-a);tt=np.arange(L)/SR;f=440*2**((m-69)/12)
    chime[a:a+L]+=0.022*np.exp(-tt*1.6)*(np.sin(2*np.pi*f*tt)+0.4*np.sin(2*np.pi*f*2.76*tt))
def mtof(m): return 440*2**((m-69)/12)
mus=np.zeros(n)
chords=[[50,54,57,62],[47,50,54,59],[43,47,50,55],[45,49,52,57],[50,54,57,62]]   # D Bm G A D, 4 s each
for i,ch in enumerate(chords):
    st=int(i*4.0*SR);L=min(int(4.6*SR),n-st)
    if L<=0:break
    tt=np.arange(L)/SR;env=np.minimum(1,tt/1.3)*np.minimum(1,(4.6-tt)/1.3)
    for m in ch: mus[st:st+L]+=0.015*env*(np.sin(2*np.pi*mtof(m)*tt)+0.3*np.sin(2*np.pi*mtof(m)*1.003*tt))
mel=[(0,74),(1.5,73),(2,71),(3,69),(4,71),(5.5,69),(6,66),(7,62),(8,67),(9.5,66),(10,64),(11,62),(12,64),(13,66),(14,69),(15,67),(16,66),(17.5,62)]
for (b,m) in mel:
    st=int((0.25+b)*SR);L=min(int(2.6*SR),n-st)
    if L<=0:continue
    tt=np.arange(L)/SR;f=mtof(m+12)
    mus[st:st+L]+=0.045*np.exp(-tt*2.0)*(np.sin(2*np.pi*f*tt)+0.2*np.sin(2*np.pi*f*2.0*tt)+0.08*np.sin(2*np.pi*f*4.07*tt))
mus=lp(mus,4800)
mix=wind+fire*0.5+chime+mus
N=int(LOOP*SR);X=int(XF*SR);out=mix[:N].copy();fade=np.linspace(0,1,X)
out[:X]=out[:X]*fade+mix[N:N+X]*(1-fade)
out=out/np.abs(out).max()*0.9
wavfile.write(sys.argv[1],SR,(out*32767).astype(np.int16))
print('ok')
