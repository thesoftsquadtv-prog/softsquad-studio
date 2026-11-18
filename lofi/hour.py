# Build ~60 min of music track-by-track to keep memory low, then concat with ffmpeg.
import numpy as np, subprocess, os
from scipy.io import wavfile
from music import track, rain, SR
os.makedirs('parts',exist_ok=True); total=0; i=0; names=[]
while total<61*60:
    tr=track(i); gap=np.zeros(int(1.2*SR),np.float32)
    x=np.concatenate([tr,gap]); r=rain(len(x)/SR+0.1,seed=100+i)[:len(x)]; x=x+r
    x=x/max(1e-6,np.max(np.abs(x)))*0.89
    fn=f'parts/t{i:02d}.wav'; wavfile.write(fn,SR,(x*32767).astype(np.int16)); names.append(fn)
    total+=len(x)/SR; i+=1
open('parts/list.txt','w').write("".join(f"file '{os.path.basename(n)}'\n" for n in names))
print(i,"tracks",round(total/60,1),"min")
