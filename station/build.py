# builds station.html = font/style head from oncall + common.js (shared storm helpers from the bookshop) + station.js
import os
H=os.path.dirname(os.path.abspath(__file__))
o=open(H+'/../oncall/oncall.html').read();head=o[:o.find('<canvas')]
open(H+'/station.html','w').write(head+'<canvas id="c" width="1440" height="2560"></canvas>\n<script>\n'+open(H+'/common.js').read()+'\n'+open(H+'/station.js').read()+'\n</script></body></html>')
