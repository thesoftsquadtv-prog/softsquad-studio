# Acoustic guitar (Karplus-Strong plucked strings) + heavy gusting wind + rain. Wind follows the same gust() curve as the picture.
import numpy as np, sys
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile
SR=44100; DUR=float(sys.argv[2]) if len(sys.argv)>2 else 30
n=int(DUR*SR); t=np.arange(n)/SR; rng=np.random.default_rng(5)
def filt(x,kind,f,o=2): return sosfilt(butter(o,f,kind,fs=SR,output='sos'),x)
def gust(tt): return 0.55+0.3*np.sin(tt*0.42)+0.15*np.sin(tt*1.33+1)+0.08*np.sin(tt*3.1)
def pluck(freq,dur,vel):
    N=int(SR/freq); buf=rng.uniform(-1,1,N)*vel; buf=filt(buf,'low',min(6000,freq*12)) if N>20 else buf
    out=np.zeros(int(dur*SR)); b=buf.copy(); idx=0
    for i in range(len(out)):
        out[i]=b[idx]; nxt=(idx+1)%N; b[idx]=0.4985*(b[idx]+b[nxt]); idx=nxt
    return out
def mtof(m): return 440*2**((m-69)/12)
guitar=np.zeros(n+SR*4)
bpm=76; beat=60/bpm; e=beat/2
# fingerpicked progression: G - Em - C - D (open voicings), travis-style pattern
CH=[(43,[55,59,62,67]),(40,[55,59,64,67]),(48,[55,60,64,67]),(50,[54,57,62,66])]
pattern=[0,3,1,2,0,3,1,2]  # string order per eighth (0=bass)
cache={}
def note(m,d,v):
    k=(m,round(d,2)); 
    if k not in cache: cache[k]=pluck(mtof(m),d,1.0)
    return cache[k]*v
pos=2.0; bar=0
while pos<DUR-2:
    root,voi=CH[bar%4]
    for s,p in enumerate(pattern):
        tt=pos+s*e+(0.03 if s%2 else 0)+rng.uniform(-0.008,0.008)
        if p==0: m=root if s in (0,4) else root+7; v=0.55
        else: m=voi[p]; v=0.32+rng.uniform(-0.05,0.05)
        x=note(m,2.6,v); i=int(tt*SR); guitar[i:i+len(x)]+=x[:len(guitar)-i]
    # occasional melody note on top
    if bar%2==1:
        m=voi[3]+[2,0,4,-1][bar%4]; x=note(m+12,2.0,0.22); i=int((pos+5*e)*SR); guitar[i:i+len(x)]+=x
    pos+=8*e; bar+=1
guitar=guitar[:n]
# body resonance + room reverb
guitar=filt(guitar,'high',80)+0.25*filt(guitar,'band',[90,250])
ir_t=np.arange(int(2.2*SR))/SR; ir=rng.standard_normal(len(ir_t))*np.exp(-ir_t/0.55); ir=filt(ir,'low',5000); ir/=np.abs(ir).max()
guitar=guitar+0.18*fftconvolve(guitar,ir)[:n]/30
guitar=guitar/np.abs(guitar).max()*0.32
fade=np.minimum(1,t/2.5)*np.minimum(1,(DUR-t)/3); guitar*=fade
# wind: band-limited noise with moving resonance (whistle), driven by gust()
g=gust(t); white=rng.standard_normal(n)
body=filt(white,'band',[120,900],2); body/=np.abs(body).max()
howl=np.zeros(n); seg=SR//10
for k in range(0,n,seg):
    c=380+260*g[k]; howl[k:k+seg]=filt(white[k:k+seg+2000],'band',[c*0.92,c*1.08],2)[:len(howl[k:k+seg])]
howl/=np.abs(howl).max()
wind=(0.75*body+0.35*howl)*(0.25+0.85*g**2)
wind=filt(wind,'low',2500)/np.abs(wind).max()*0.62
# rain: soft hiss + drops; thunder rumbles at 11.2s and 23.6s to match the flashes
rain=filt(white,'high',1800)*0.05+filt(rng.standard_normal(n),'band',[400,1500])*0.03
drops=np.zeros(n); idx=rng.integers(0,n,int(DUR*40)); drops[idx]=rng.uniform(0.2,1,len(idx)); rain+=filt(drops,'band',[1500,6000])*0.15
th=np.zeros(n)
for tt,a in ((11.6,0.42),(23.9,0.3),(39.5,0.38),(53.3,0.28)):
    i=int(tt*SR); L=int(4*SR); tl=np.arange(L)/SR
    rb=filt(rng.standard_normal(L),'low',120,4)*np.exp(-tl/1.4)*np.minimum(1,tl/0.15); th[i:i+L]+=rb[:max(0,min(L,n-i))]/np.abs(rb).max()*a
mix=wind+rain+guitar+th
mix=np.tanh(mix*1.1)*fade.clip(0.0,1)**0.3
mix=mix/np.abs(mix).max()*0.92
st=np.stack([mix,np.roll(mix,int(0.012*SR))*0.96],1)  # slight stereo width
wavfile.write(sys.argv[1],SR,(st*32767).astype(np.int16))
print("wind rms",np.sqrt((wind**2).mean()),"guitar rms",np.sqrt((guitar**2).mean()))
