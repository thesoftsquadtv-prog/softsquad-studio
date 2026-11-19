# first snow: soft lofi, winter wind outside (gusts match the snow drift), her breath on the glass (3.6 s)
# and the faint squeak of a fingertip on wet glass while she draws the heart (5.35–6.65, 6.9–8.15)
import sys,os,numpy as np
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','lofi'))
from music import track, lp, hp, bp, SR
from scipy.io import wavfile
D=float(sys.argv[2]) if len(sys.argv)>2 else 16; n=int(D*SR); t=np.arange(n)/SR
m=track(23,bars=10,bpm=66)[:n]
if len(m)<n: m=np.pad(m,(0,n-len(m)))
m=lp(m,2600)*0.8
m*=1-0.35*np.clip((t-3.4)/0.6,0,1)*np.clip((9.2-t)/0.8,0,1)   # music steps back while she breathes and draws
rng=np.random.default_rng(7)
gust=0.5+0.3*np.sin(t*0.37)+0.15*np.sin(t*1.1+1)+0.05*np.sin(t*2.9)
wind=bp(rng.standard_normal(n),180,900)*0.05*(0.4+gust)+lp(rng.standard_normal(n),300)*0.03*gust
breath=np.zeros(n); a,b=int(3.6*SR),int(4.4*SR); tt=np.arange(b-a)/SR
breath[a:b]=bp(rng.standard_normal(b-a),300,2500)*np.sin(np.pi*tt/0.8)**2*0.10
sq=np.zeros(n)
for (s0,s1) in [(5.35,6.65),(6.9,8.15)]:
    a,b=int(s0*SR),int(s1*SR); tt=np.arange(b-a)/SR; L=s1-s0
    f=2100+300*np.sin(2*np.pi*tt/L*2)+rng.standard_normal(b-a).cumsum()*0.02
    ph=2*np.pi*np.cumsum(f)/SR
    amp=(0.5+0.5*np.abs(np.sin(2*np.pi*tt*7)))*np.minimum(1,tt/0.05)*np.minimum(1,(L-tt)/0.08)
    sq[a:b]=(np.sin(ph)+0.3*np.sin(2*ph))*amp*0.010
sq=bp(sq,1200,5000)
mix=m+wind+breath+sq
mix*=np.minimum(1,t/0.5)*np.minimum(1,(D-t)/1.2)
mix=mix/np.abs(mix).max()*0.9
wavfile.write(sys.argv[1],SR,(mix*32767).astype(np.int16))
print('ok')
