# Original lofi music generator (numpy/scipy). Every note is synthesised here, so it is ours to use.
import numpy as np, sys
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
SR=44100
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b): return sosfilt(butter(2,[a,b],'band',fs=SR,output='sos'),x)
def mtof(m): return 440*2**((m-69)/12)
def env(n,a=0.005,d=1.5):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)*np.exp(-t/d); return e
def rhodes(m,dur,vel=1.0,rng=None):
    n=int(dur*SR); t=np.arange(n)/SR; f=mtof(m)
    det=1+(rng.uniform(-1,1)*0.0015 if rng is not None else 0)
    x=np.sin(2*np.pi*f*det*t)+0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t/0.4)+0.12*np.sin(2*np.pi*3*f*t)*np.exp(-t/0.15)
    x*=env(n,0.004,1.8)*(1+0.12*np.sin(2*np.pi*4.5*t))
    return x*vel
def bell(m,dur,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR; f=mtof(m)
    x=np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*f*2.01*t)*np.exp(-t/0.3)
    return x*env(n,0.01,0.9)*vel
def bass(m,dur):
    n=int(dur*SR); t=np.arange(n)/SR; f=mtof(m)
    x=np.sin(2*np.pi*f*t)+0.2*np.sin(2*np.pi*2*f*t)
    e=np.minimum(1,t/0.01)*np.minimum(1,np.maximum(0,(dur-t)/0.08))
    return x*e
def kick():
    n=int(0.35*SR); t=np.arange(n)/SR
    f=50+90*np.exp(-t/0.03); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t/0.12)
def snare(rng):
    n=int(0.25*SR); t=np.arange(n)/SR
    nz=bp(rng.standard_normal(n),900,5000)*np.exp(-t/0.06)
    return 0.6*nz+0.4*np.sin(2*np.pi*190*t)*np.exp(-t/0.05)
def hat(rng,open_=False):
    n=int((0.18 if open_ else 0.05)*SR); t=np.arange(n)/SR
    return hp(rng.standard_normal(n),7000)*np.exp(-t/(0.06 if open_ else 0.015))
def add(buf,x,pos):
    i=int(pos*SR)
    if i>=len(buf): return
    j=min(len(buf),i+len(x)); buf[i:j]+=x[:j-i]

PROGS=[  # (root midi, chord intervals) – jazzy 7th/9th voicings
 [(53,[0,4,7,11,14]),(52,[0,3,7,10,14]),(50,[0,3,7,10,14]),(48,[0,4,7,11,14])],   # Fmaj9 Em9 Dm9 Cmaj9
 [(51,[0,4,7,11,14]),(50,[0,3,7,10]),(48,[0,3,7,10,14]),(46,[0,4,7,11])],          # Ebmaj9 Dm7 Cm9 Bbmaj7
 [(45,[0,3,7,10,14]),(50,[0,4,7,10,14]),(43,[0,4,7,11,14]),(48,[0,4,7,11])],       # Am9 D9 Gmaj9 Cmaj7
 [(49,[0,4,7,11,14]),(54,[0,3,7,10]),(47,[0,3,7,10,14]),(52,[0,4,7,10,13])],       # Dbmaj9 F#m7 Bm9 E7b9
 [(50,[0,3,7,10,14]),(55,[0,4,7,10,14]),(48,[0,4,7,11,14]),(45,[0,3,7,10])],       # Dm9 G9 Cmaj9 Am7
 [(56,[0,4,7,11]),(55,[0,3,7,10,14]),(53,[0,3,7,10]),(51,[0,4,7,11,14])],          # Abmaj7 Gm9 Fm7 Ebmaj9
]
SCALE=[0,2,4,7,9]
def track(seed,bars=48,bpm=None):
    rng=np.random.default_rng(seed)
    bpm=bpm or rng.choice([70,72,75,78,80]); beat=60/bpm; bar=4*beat
    prog=PROGS[seed%len(PROGS)]
    total=bars*bar+3
    buf=np.zeros(int(total*SR)); drums=np.zeros_like(buf)
    sw=beat*0.5*0.16  # swing
    K=kick()
    for b in range(bars):
        t0=b*bar; root,iv=prog[b%4]
        intro=b<4; outro=b>=bars-4
        # chords: two hits per bar, slight strum
        for hit,vel in ((0,0.55),(2.5*beat,0.35)):
            if hit and intro: continue
            for k,i in enumerate(iv): add(buf,rhodes(root+12+i,bar,vel*0.32,rng),t0+hit+k*0.012)
        if not intro: add(buf,bass(root,beat*1.8)*0.38,t0); add(buf,bass(root+(7 if b%2 else 0),beat*1.4)*0.3,t0+2.5*beat)
        # melody: sparse pentatonic phrases
        if not intro and not outro and rng.random()<0.75:
            for s in range(8):
                if rng.random()<0.38:
                    m=root+24+SCALE[rng.integers(0,5)]+(12 if rng.random()<0.25 else 0)
                    add(buf,bell(m,1.2,0.16),t0+s*beat/2+(sw if s%2 else 0))
        # drums
        if not intro and not outro:
            add(drums,K*0.9,t0); add(drums,K*0.6,t0+2.5*beat)
            if rng.random()<0.3: add(drums,K*0.5,t0+1.75*beat)
            add(drums,snare(rng)*0.38,t0+beat); add(drums,snare(rng)*0.38,t0+3*beat)
            for s in range(8):
                add(drums,hat(rng,open_=(s==7 and rng.random()<0.3))*(0.12 if s%2 else 0.18),t0+s*beat/2+(sw if s%2 else 0))
    drums=lp(drums,6000)
    mix=lp(buf,3800)+drums
    # vinyl crackle + soft tape wobble feel
    n=len(mix); cr=np.zeros(n); idx=rng.integers(0,n,int(total*14)); cr[idx]=rng.uniform(-1,1,len(idx))*0.25
    mix+=lp(cr,5000)+lp(rng.standard_normal(n),900)*0.004
    mix=np.tanh(mix*1.2)
    f=np.ones(n); fi=int(2*SR); f[:fi]=np.linspace(0,1,fi); f[-fi:]=np.linspace(1,0,fi)
    return (mix*f*0.7).astype(np.float32)
def rain(sec,seed=9):
    rng=np.random.default_rng(seed); n=int(sec*SR)
    w=rng.standard_normal(n).astype(np.float32)
    r=lp(hp(w,400),5000)*0.035
    drops=np.zeros(n,np.float32); idx=rng.integers(0,n,int(sec*30)); drops[idx]=rng.uniform(0.2,1,len(idx))
    r+=bp(drops,2000,7000)*0.08
    lfo=1+0.25*np.sin(2*np.pi*np.arange(n)/SR/23)
    return (r*lfo).astype(np.float32)
if __name__=="__main__":
    out=sys.argv[1]; minutes=float(sys.argv[2]); base=int(sys.argv[3]) if len(sys.argv)>3 else 0
    parts=[]; L=0; s=base
    while L<minutes*60*SR:
        tr=track(s); parts.append(tr); parts.append(np.zeros(int(1.2*SR),np.float32)); L+=len(tr)+int(1.2*SR); s+=1
    mix=np.concatenate(parts)[:int(minutes*60*SR)]
    mix+=rain(len(mix)/SR)
    fo=int(4*SR); mix[-fo:]*=np.linspace(1,0,fo)
    mix=mix/np.max(np.abs(mix))*0.89
    wavfile.write(out,SR,(mix*32767).astype(np.int16))
    print("tracks",s-base,"seconds",len(mix)/SR)
