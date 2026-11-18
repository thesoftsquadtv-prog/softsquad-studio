import sys,numpy as np; sys.path.insert(0,'../lofi')
from music import track, rain, lp, hp, SR
from scipy.io import wavfile
D=20; n=D*SR
m=track(7,bars=16,bpm=75)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
r=rain(D,seed=21)[:n]*0.6
rng=np.random.default_rng(2); sz=hp(rng.standard_normal(n),3000)*0.012*(1+0.5*np.sin(np.arange(n)/SR*7))  # soft pan sizzle
mix=m+r+sz; t=np.arange(n)/SR; mix*=np.minimum(1,t/1.0)*np.minimum(1,(D-t)/1.5)
mix=mix/np.abs(mix).max()*0.9
wavfile.write('kitchen.wav',SR,(mix*32767).astype(np.int16))
