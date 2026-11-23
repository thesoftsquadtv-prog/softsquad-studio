# builds lastslice.html = font/style head from oncall + scene.js
import os
H=os.path.dirname(os.path.abspath(__file__))
o=open(H+'/../oncall/oncall.html').read();head=o[:o.find('<canvas')]
open(H+'/lastslice.html','w').write(head+'<canvas id="c" width="1440" height="2560"></canvas>\n<script>\n'+open(H+'/scene.js').read()+'\n</script></body></html>')
