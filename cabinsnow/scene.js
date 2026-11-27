// Soft Ambience — "cabin in the pines, thunderstorm". A small log cabin deep in a dark pine forest, heavy rain at night.
// Inside, by the fire, she reads in her armchair under a knitted blanket while her old dog sleeps on the hearth rug;
// the porch lantern swings a little on its beam, the woodpile is dry under the porch roof, smoke is torn off the stone
// chimney by the gusts, rain drips off the eaves. Lightning in the first second (hook, 0.45 s) and again at 12.3 s:
// the sky and the tree edges flash, the cabin stays a dark warm silhouette. When the thunder rolls (~13.4 s) the dog's
// ear twitches; she just turns the page (8.0 s). Every motion repeats every LOOP (20 s) so the video loops seamlessly.
// Needs lib.js (rng, off, WK, gust, roof, stones, shade).
const G0=1520;                                        // ground line of the front wall
const P=(x,d,h)=>[x+0.53*d,G0-h-0.13*d];             // world (x along the front, d depth back, h height) -> screen
const WIN={x:440,y:1220,w:300,h:220};                 // the big front window (screen = world at d=0)
const LANT={x:404,y:1318};                            // porch lantern: iron bracket on the right porch post, clear of the door
const FLASH=[];   // [time, strength, bolt x, bolt?]  2nd = sheet lightning in the clouds   // bolts visible at 0.45 s and 12.3 s
let SKY=null,CL=null,FAR=null,FARL=null,CAB=null,CABR=null,GRD=null,TREES=null;
function flashAt(t){let f=0,bolt=null;for(const [lt,a,bx,hasB] of FLASH){const d=t-lt;if(d>0&&d<1.2){let v=a*Math.exp(-d*7);if(d>0.16)v+=a*0.7*Math.exp(-(d-0.16)*9);f=Math.max(f,v);if(d<0.32&&hasB)bolt={bx,d,a,seed:lt*10};}}return {f,bolt};}
function poly(q,pts){q.beginPath();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();}
// rim mask: the silhouette of canvas c, minus itself shifted down a little -> only the upper edges remain (lit by the flash)
function rimOf(c,dx,dy,col){const [r,g]=off(c.width,c.height);g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);
 g.globalCompositeOperation='destination-out';g.drawImage(c,dx,dy);return r;}
// ---------------- sky ----------------
function skyPaint(q){const g=q.createLinearGradient(0,0,0,1400);g.addColorStop(0,'#0a0f19');g.addColorStop(0.45,'#161d2b');g.addColorStop(0.8,'#262d3c');g.addColorStop(1,'#323848');q.fillStyle=g;q.fillRect(0,0,W,1500);
 const m=q.createRadialGradient(300,420,20,300,420,460);m.addColorStop(0,'rgba(140,155,185,.16)');m.addColorStop(1,'rgba(140,155,185,0)');q.fillStyle=m;q.fillRect(0,0,W,1000);}
function cloudPaint(q){const r=rng(8);q.filter='blur(16px)';
 for(let i=0;i<60;i++){const x=r()*(W+300)-150,y=20+Math.pow(r(),1.2)*820,rx=120+r()*220,ry=40+r()*60;
  const g=q.createRadialGradient(x,y+ry*0.4,4,x,y,rx);const lift=y/900;
  g.addColorStop(0,`rgba(${66+lift*36|0},${74+lift*36|0},${92+lift*34|0},.5)`);g.addColorStop(0.7,`rgba(${38+lift*26|0},${44+lift*26|0},${60+lift*26|0},.32)`);g.addColorStop(1,'rgba(30,36,50,0)');
  q.fillStyle=g;q.beginPath();q.ellipse(x,y,rx,ry,0,0,6.28);q.fill();}
 for(let i=0;i<22;i++){const x=r()*W,y=80+r()*600,rx=90+r()*150;const g2=q.createRadialGradient(x,y-20,4,x,y-20,rx);g2.addColorStop(0,'rgba(10,14,22,.4)');g2.addColorStop(1,'rgba(10,14,22,0)');q.fillStyle=g2;q.beginPath();q.ellipse(x,y-20,rx,30+r()*30,0,0,6.28);q.fill();}
 for(let i=0;i<30;i++){const cx=r()*W,cy=160+r()*640;for(let k=0;k<9;k++){const px=cx+(k-4)*(26+r()*20),py=cy+Math.abs(k-4)*6+r()*10,pr=30+r()*36;const g=q.createRadialGradient(px,py+pr*0.3,2,px,py,pr);g.addColorStop(0,'rgba(88,96,116,.28)');g.addColorStop(1,'rgba(60,66,84,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,pr,0,6.28);q.fill();}}
 q.filter='none';}
// ---------------- pines ----------------
// a conifer: dark inner cone, drooping overlapping tiers with ragged needle-tipped skirts; no trunk shows between tiers
function pineShape(g,h,wmax,seed,pal,warm,snowK){if(snowK===undefined)snowK=1;const q=rng(seed);const n=Math.max(6,Math.round(h/62));
 {const cw=pal[0]===pal[1]?0.98:0.78;g.fillStyle=pal[0];g.beginPath();g.moveTo(0,-h-8);g.quadraticCurveTo(wmax*cw*0.58,-h*0.5,wmax*cw,-h*0.02);g.lineTo(-wmax*cw,-h*0.02);g.quadraticCurveTo(-wmax*cw*0.58,-h*0.5,0,-h-8);g.fill();}
 const tg=g.createLinearGradient(-12,0,12,0);tg.addColorStop(0,'#1d150f');tg.addColorStop(1,'#0a0706');if(window.TRUNKS)g.fillStyle=tg,g.fillRect(-h*0.018,-h*0.1,h*0.036,h*0.1+4);   // trunks hidden: the dark cone + low boughs reach the ground
 for(let k=0;k<n;k++){const u=k/(n-1);const y=-h+Math.pow(u,0.95)*h*0.9,w=(0.1+0.9*Math.pow(u,0.85))*wmax*(0.9+0.2*q()),th=h*(0.05+0.06*u);
  const lean=(q()-0.5)*0.15;const curve=x=>y+Math.pow(Math.abs(x)/w,1.5)*th*1.25+x*lean*0.1+Math.sin(x*0.06+k*1.7)*2;
  const base=pal[1+(k%3)];
  g.fillStyle=base;g.beginPath();g.moveTo(-w,curve(-w)+th*0.2);for(let x=-w;x<=w;x+=5)g.lineTo(x,curve(x)-2-Math.max(0,1-Math.abs(x)/w)*th*0.35);
  for(let x=w;x>=-w;x-=7){const d=th*0.95*(0.65+0.35*(1-Math.abs(x)/w));g.lineTo(x,curve(x)+d+(q()*12-3));g.lineTo(x-3.5,curve(x)+d-8-q()*6);}g.closePath();g.fill();
  // needles fanning down and out; lighter on the side facing the cabin light (warm) or the sky (cool)
  for(let m=0;m<w*1.8;m++){const x=(q()*2-1)*w,yy=curve(x)+q()*th*0.6,side=x<0?-1:1;const litSide=warm>0?x>w*0.15:x<-w*0.15;
   g.strokeStyle=litSide&&q()<0.55?pal[4]:(q()<0.5?base:pal[5]);g.lineWidth=1.3+q()*0.8;g.beginPath();g.moveTo(x,yy);g.lineTo(x+side*(3+q()*6),yy+6+q()*8);g.stroke();}
  // wet sheen along the top of each bough
  if(pal[1]!==pal[0]){g.strokeStyle='rgba(150,170,190,.10)';g.lineWidth=2;}else g.strokeStyle='rgba(0,0,0,0)';for(let x=-w*0.85;x<=w*0.85;x+=6+q()*10){if(q()<0.5)continue;g.beginPath();g.moveTo(x,curve(x)-1);g.lineTo(x+8+q()*10,curve(x+12)-1);g.stroke();}
  // fresh snow resting on the bough: uneven soft blobs along the top of the tier (thicker toward the trunk), never a band
  if(snowK>0){let x=-w*0.86;while(x<w*0.8){const run=10+q()*26;if(q()<0.5){   // a lump of snow lying on the bough: one merged shape, bumpy top, flat underside on the needles
     const top=[],bot=[];for(let xx=x;xx<=x+run;xx+=3){const c=Math.max(0,1-Math.abs(xx)/w),e=Math.sin(Math.PI*(xx-x)/run);const base=curve(xx)-1-c*th*0.3;
       top.push([xx,base-e*(2.5+q()*1.6)*(0.7+c*0.9)]);bot.push([xx,base+e*1.8]);}
     g.fillStyle=`rgba(${136+q()*14|0},${146+q()*14|0},${178+q()*14|0},${0.9*snowK})`;g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]+1.4):g.moveTo(p[0],p[1]+1.4));for(let i=bot.length-1;i>=0;i--)g.lineTo(bot[i][0],bot[i][1]+1.2);g.closePath();g.fill();
     g.fillStyle=`rgba(${206+q()*20|0},${214+q()*18|0},${232+q()*12|0},${0.95*snowK})`;g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));for(let i=bot.length-1;i>=0;i--)g.lineTo(bot[i][0],bot[i][1]-1);g.closePath();g.fill();}
    x+=run+4+q()*14;}}
  // shade under the tier above
  const sh=g.createLinearGradient(0,y,0,y+th*0.8);sh.addColorStop(0,pal[1]===pal[0]?'rgba(2,6,5,.12)':'rgba(2,6,5,.28)');sh.addColorStop(1,'rgba(2,6,5,0)');g.fillStyle=sh;g.beginPath();g.ellipse(0,y+th*0.3,w*0.55,th*0.6,0,0,6.28);g.fill();}
 if(warm){g.globalCompositeOperation='source-atop';const wg=g.createLinearGradient(warm>0?-wmax:wmax,0,warm>0?wmax:-wmax,0);wg.addColorStop(0,'rgba(255,160,90,0)');wg.addColorStop(1,`rgba(255,160,90,${0.10*Math.abs(warm)})`);g.fillStyle=wg;g.fillRect(-wmax,-h-20,wmax*2,h+30);g.globalCompositeOperation='source-over';}}
const PAL_NEAR=['#08110d','#0f1c16','#12211a','#16271f','#23392d','#0c1611'];
const PAL_MID=['#0b1512','#14211c','#16251f','#192a23','#26382f','#101b17'];
// big swaying pines: [base x, base y, height, max half-width, seed, warm side(+1 right/-1 left/0), sway amount, layer]
const PINES=[[985,1420,1150,250,11,-0.8,1.0,'back'],[70,1400,1040,230,23,0.9,1.0,'back'],[610,1300,880,190,31,0,0.8,'back'],[300,1300,760,170,37,0,0.8,'back'],
             [1015,1985,560,190,41,-0.5,1.3,'front']];
function buildTrees(){TREES=PINES.map(([x,y,h,w,seed,warm,amt,layer])=>{const R=1.5,pad=30;const cw=(w*2+pad*2),ch=(h+pad*2);const [c,g]=off(cw*R|0,ch*R|0);g.scale(R,R);g.translate(w+pad,h+pad-10);
  const pal=layer=='front'?PAL_NEAR:(h<900?PAL_MID:PAL_NEAR);pineShape(g,h,w,seed,pal,warm);
  return {x,y,h,w,amt,layer,c,rim:rimOf(c,0,7,'#c9d4ff'),ox:-(w+pad),oy:-(h+pad-10),cw,ch};});}
function drawTree(T,t,f){const G=gust(t);const sk=-(0.010+0.016*G)*T.amt+0.004*Math.sin(WK(4)*t+T.x*0.01)*T.amt;   // tops lean left with the wind
 X.save();X.translate(T.x,T.y);X.transform(1,0,sk,1,0,0);X.drawImage(T.c,T.ox,T.oy,T.cw,T.ch);
 if(f>0.002){X.globalAlpha=Math.min(1,f*3.2);X.globalCompositeOperation='lighter';X.drawImage(T.rim,T.ox,T.oy,T.cw,T.ch);}X.restore();}
// far forest: rows of small pine silhouettes in mist, painted once (plus a pale copy for the flash)
function farPaint(q){const r=rng(5);
 const rows=[[1060,'#29323f',0.55,380,520],[1180,'#1f2833',0.75,360,480],[1300,'#141c20',1,300,430]];
 rows.forEach(([by,col,k,hmin,hmax],ri)=>{
  const pal=[col,col,col,col,col,col];
  for(let x=-40;x<W+60;x+=(hmin*0.17+r()*hmin*0.2)){const h=hmin+r()*(hmax-hmin);q.save();q.translate(x,by+r()*30+30);pineShape(q,h,h*0.2,(x*7+ri*131)|0,pal,0);q.restore();}
  // mist between the rows
  const mg=q.createLinearGradient(0,by-40,0,by+60);mg.addColorStop(0,'rgba(60,70,88,0)');mg.addColorStop(0.6,`rgba(62,72,90,${0.45-ri*0.1})`);mg.addColorStop(1,'rgba(60,70,88,0)');q.fillStyle=mg;q.fillRect(0,by-40,W,100);});
 q.fillStyle='#0d1416';q.fillRect(0,1320,W,160);}
// ---------------- ground ----------------
const PATH=[[560,1960],[540,1840],[480,1740],[400,1660],[330,1600],[302,1566]];
const PUD=[{x:600,y:1655,rx:125,ry:19},{x:226,y:1705,rx:58,ry:10}];
function groundPaint(q){const r=rng(21);
 const gg=q.createLinearGradient(0,1330,0,H);gg.addColorStop(0,'#141b17');gg.addColorStop(0.3,'#18201a');gg.addColorStop(1,'#0c110d');q.fillStyle=gg;q.fillRect(0,1330,W,H-1330);
 // pine-needle litter, moss and small stones
 for(let i=0;i<2600;i++){const y=1340+Math.pow(r(),0.85)*(H-1340),k=(y-1330)/(H-1330),x=r()*W;const a=r()*3.14;const L=3+k*12;
  q.strokeStyle=['rgba(90,62,40,.45)','rgba(60,44,30,.5)','rgba(40,58,40,.45)','rgba(8,10,8,.5)'][(r()*4)|0];q.lineWidth=0.8+k*1.2;q.beginPath();q.moveTo(x,y);q.lineTo(x+Math.cos(a)*L,y+Math.sin(a)*L*0.35);q.stroke();}
 for(let i=0;i<60;i++){const y=1360+r()*(H-1360),k=(y-1330)/(H-1330),x=r()*W;const g=q.createRadialGradient(x,y,1,x,y,20+k*60);g.addColorStop(0,'rgba(48,72,44,.35)');g.addColorStop(1,'rgba(48,72,44,0)');q.fillStyle=g;q.save();q.translate(x,y);q.scale(1,0.35);q.translate(-x,-y);q.fillRect(x-90,y-90,180,180);q.restore();}
 // window light spilling over the wet ground in front of the cabin
 q.save();const cxw=WIN.x+WIN.w/2-20,cyw=1560;q.translate(cxw,cyw);q.scale(1,0.32);const wl=q.createRadialGradient(0,0,10,0,0,260);wl.addColorStop(0,'rgba(255,165,85,.16)');wl.addColorStop(0.6,'rgba(255,165,85,.06)');wl.addColorStop(1,'rgba(255,165,85,0)');q.fillStyle=wl;q.fillRect(-260,-260,520,520);q.restore();
 // stepping-stone path to the porch step
 for(let i=0;i<PATH.length-1;i++){for(let j=0;j<2;j++){const u=j/2,x=lerp(PATH[i][0],PATH[i+1][0],u)+(j?12:-8),y=lerp(PATH[i][1],PATH[i+1][1],u),k=(y-1520)/440;const rx=(26+k*60)*(0.9+r()*0.2),ry=rx*0.34;
  q.fillStyle='rgba(3,5,4,.6)';q.beginPath();q.ellipse(x+2,y+ry*0.4,rx*1.04,ry*1.05,0,0,6.28);q.fill();
  const sg=q.createLinearGradient(0,y-ry,0,y+ry);sg.addColorStop(0,'#5d5c5a');sg.addColorStop(1,'#353436');q.fillStyle=sg;q.beginPath();q.ellipse(x,y,rx,ry,(r()-0.5)*0.1,0,6.28);q.fill();
  q.fillStyle='rgba(255,185,120,.12)';q.beginPath();q.ellipse(x-rx*0.15,y-ry*0.35,rx*0.6,ry*0.35,0,0,6.28);q.fill();
  q.fillStyle='rgba(160,175,200,.10)';q.beginPath();q.ellipse(x+rx*0.2,y-ry*0.45,rx*0.35,ry*0.18,0,0,6.28);q.fill();}}}
// ---------------- the cabin ----------------
function logRow(q,x0,x1,y,hgt,base,r,lit){ // one horizontal round log, lit from above, dark underside; chinking line under it
 const g=q.createLinearGradient(0,y,0,y+hgt);g.addColorStop(0,shade(base,1.18));g.addColorStop(0.35,shade(base,1.0));g.addColorStop(0.85,shade(base,0.62));g.addColorStop(1,shade(base,0.45));
 q.fillStyle=g;q.beginPath();q.roundRect(x0,y,x1-x0,hgt,hgt*0.45);q.fill();
 for(let k=0;k<(x1-x0)/26;k++){const bx=x0+r()*(x1-x0);q.strokeStyle=`rgba(20,12,8,${0.2+r()*0.2})`;q.lineWidth=1;q.beginPath();q.moveTo(bx,y+hgt*(0.25+r()*0.2));q.lineTo(bx+20+r()*50,y+hgt*(0.3+r()*0.3));q.stroke();}
 for(let k=0;k<(x1-x0)/90;k++){const kx=x0+r()*(x1-x0);q.fillStyle='rgba(25,14,8,.45)';q.beginPath();q.ellipse(kx,y+hgt*0.5,3.5,2.4,0,0,6.28);q.fill();}
 q.fillStyle='rgba(205,190,160,.35)';q.fillRect(x0+4,y+hgt-2.5,x1-x0-8,2.5);}
function logEnd(q,cx,cy,rad,r){ // sawn end of a log: pale end grain with rings and a check crack
 q.fillStyle='#2a1a10';q.beginPath();q.arc(cx,cy,rad+1.5,0,6.28);q.fill();
 const g=q.createRadialGradient(cx-rad*0.3,cy-rad*0.3,1,cx,cy,rad);g.addColorStop(0,'#b78f61');g.addColorStop(1,'#7a5434');q.fillStyle=g;q.beginPath();q.arc(cx,cy,rad,0,6.28);q.fill();
 q.strokeStyle='rgba(70,44,24,.45)';q.lineWidth=0.9;for(let k=1;k<4;k++){q.beginPath();q.arc(cx+(r()-0.5),cy+(r()-0.5),rad*k/4.2,0,6.28);q.stroke();}
 q.strokeStyle='rgba(40,24,14,.6)';q.lineWidth=1.2;q.beginPath();const a=r()*6.28;q.moveTo(cx,cy);q.lineTo(cx+Math.cos(a)*rad*0.9,cy+Math.sin(a)*rad*0.9);q.stroke();}
function cabinPaint(q){const r=rng(73);const LOG='#6b4a33',H0=28,LH=31,NL=11;  // wall h 0..370
 // contact shadow on the ground
 {q.save();q.filter='blur(10px)';q.fillStyle='rgba(0,0,0,.45)';poly(q,[[110,G0-6],P(770,0,-2),P(770,345,-2),[P(770,345,0)[0]+16,P(770,345,0)[1]+14],[P(780,0,0)[0]+10,G0+22],[90,G0+26]]);q.fill();q.restore();}
 // --- stone chimney (from the fireplace inside) rising through the back slope: painted first, walls and roof hide its foot ---
 chimneyPaint(q,r);
 // --- side (gable) wall, receding to the back right, in shadow ---
 const s0=P(760,0,0),s1=P(760,340,0),s2=P(760,340,370),s3=P(760,0,370),pk=P(760,170,600);
 q.save();poly(q,[s0,s1,s2,pk,s3]);q.clip();
 {q.save();q.transform(1,-0.13/0.53,0,1,0,0);const rr=rng(77);for(let row=0;row<2;row++){const a=P(760,0,H0-row*14),yy=a[1]+760*0.13/0.53;let xx=754-rr()*10;while(xx<960){const sw=22+rr()*22;q.fillStyle=['#3f4248','#383b41','#46484d','#3c3732'][(rr()*4)|0];q.beginPath();q.roundRect(xx+1.5,yy+1.5,sw-3,12,5);q.fill();xx+=sw;}}q.restore();}
 for(let i=0;i<NL;i++){const h=H0+i*LH;q.save();q.transform(1,-0.13/0.53,0,1,0,0);   // skew so the logs run along the depth
  const a=P(760,0,h+LH),xx=a[0],yy=a[1]+xx*0.13/0.53;logRow(q,xx-10,xx+190,yy,LH,'#4d3626',r);q.restore();}
 // gable boards above the wall plate
 q.save();poly(q,[s3,s2,pk]);q.clip();for(let d=0;d<=340;d+=22){const a=P(760,d,370),b=P(760,d,640);q.fillStyle=shade('#4a3424',0.8+r()*0.3);poly(q,[a,P(760,d+21,370),P(760,d+21,640),b]);q.fill();q.strokeStyle='rgba(0,0,0,.4)';q.lineWidth=1.5;q.beginPath();q.moveTo(a[0],a[1]);q.lineTo(b[0],b[1]);q.stroke();}q.restore();
 const sg=q.createLinearGradient(s0[0],0,s1[0],0);sg.addColorStop(0,'rgba(6,10,18,.35)');sg.addColorStop(1,'rgba(6,10,18,.6)');q.fillStyle=sg;q.fillRect(s0[0]-2,pk[1]-10,200,700);
 q.restore();
 // --- front wall: stone footing + 11 courses of logs ---
 q.save();q.beginPath();q.rect(110,G0-H0,660,H0);q.clip();stones(q,120,G0-H0,640,H0+4,5);q.restore();
 for(let i=0;i<NL;i++){const y=G0-H0-(i+1)*LH;logRow(q,112,768,y,LH,hexShade(LOG,0.92+r()*0.16),r);}
 // corner notches: log ends of the side wall poke out at the front corners (alternate courses)
 for(let i=0;i<NL;i++){const y=G0-H0-(i+0.5)*LH;logEnd(q,768,y,LH*0.5-0.8,r);}
 // --- the big window (interior is animated, drawn later through this hole) ---
 q.save();q.globalCompositeOperation='destination-out';q.fillRect(WIN.x,WIN.y,WIN.w,WIN.h);q.restore();
 // frame, sill and a small drip-cap over it
 q.strokeStyle='#2c1c12';q.lineWidth=12;q.strokeRect(WIN.x-2,WIN.y-2,WIN.w+4,WIN.h+4);
 q.fillStyle='#3d2819';q.fillRect(WIN.x-16,WIN.y-16,WIN.w+32,10);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(WIN.x-10,WIN.y-6,WIN.w+20,5);
 q.fillStyle='#4a3020';q.fillRect(WIN.x-18,WIN.y+WIN.h+4,WIN.w+36,12);q.fillStyle='#2c1c12';q.fillRect(WIN.x-18,WIN.y+WIN.h+16,WIN.w+36,4);
 q.fillStyle='rgba(255,190,120,.25)';q.fillRect(WIN.x-14,WIN.y+WIN.h+4,WIN.w+28,2);
 // --- front door (under the porch) ---
 const dx=250,dw=100,dy=G0-240,dh=222;planks(q,dx,dy,dw,dh,'#5a3a26',9,true);
 q.fillStyle='#3a2416';q.fillRect(dx,dy+22,dw,10);q.fillRect(dx,dy+dh-40,dw,10);q.save();q.translate(dx,dy);q.strokeStyle='#3a2416';q.lineWidth=8;q.beginPath();q.moveTo(6,dh-36);q.lineTo(dw-6,30);q.stroke();q.restore();
 q.strokeStyle='#22150d';q.lineWidth=6;q.strokeRect(dx-3,dy-3,dw+6,dh+3);
 q.fillStyle='#1d1d22';q.fillRect(dx+dw-18,dy+dh*0.5-12,6,24);q.fillStyle='#b38a4a';q.beginPath();q.arc(dx+dw-15,dy+dh*0.5+4,3,0,6.28);q.fill();
 // small lit pane in the door
 q.fillStyle='#e9a25e';q.fillRect(dx+30,dy+52,40,30);q.strokeStyle='#22150d';q.lineWidth=4;q.strokeRect(dx+30,dy+52,40,30);q.beginPath();q.moveTo(dx+50,dy+52);q.lineTo(dx+50,dy+82);q.stroke();
 // --- porch deck ---
 const d0=P(100,0,18),d1=P(445,0,18),d2=P(445,-115,18),d3=P(100,-115,18);
 q.fillStyle='#4a3424';poly(q,[d0,d1,d2,d3]);q.fill();for(let x=100;x<445;x+=17){const a=P(x,0,18),b=P(x,-115,18);q.strokeStyle='rgba(0,0,0,.35)';q.lineWidth=1.5;q.beginPath();q.moveTo(a[0],a[1]);q.lineTo(b[0],b[1]);q.stroke();}
 q.fillStyle='rgba(170,190,210,.07)';poly(q,[d0,d1,d2,d3]);q.fill();
 q.fillStyle='#2e2016';poly(q,[d3,d2,P(445,-115,0),P(100,-115,0)]);q.fill();q.fillStyle='#22170f';poly(q,[d1,d2,P(445,-115,0),P(445,0,0)]);q.fill();
 // stone step at the door
 {const X0=312,X1=428,a=P(X0,-115,9),b=P(X1,-115,9),c=P(X1,-152,9),e=P(X0,-152,9);   // screen-centred under the door (x 250..350)
  q.save();q.filter='blur(5px)';q.fillStyle='rgba(0,0,0,.55)';poly(q,[P(X0-4,-118,0),P(X1+8,-118,0),P(X1+8,-158,0),[P(X0-4,-158,0)[0],P(X0-4,-158,0)[1]+6]]);q.fill();q.restore();
  q.fillStyle='#4e3826';poly(q,[a,b,c,e]);q.fill();for(const dd of [-127,-140]){const p0=P(X0,dd,9),p1=P(X1,dd,9);q.strokeStyle='rgba(20,12,6,.6)';q.lineWidth=1.5;q.beginPath();q.moveTo(p0[0],p0[1]);q.lineTo(p1[0],p1[1]);q.stroke();}
  q.fillStyle='#33241a';poly(q,[e,c,P(X1,-152,0),P(X0,-152,0)]);q.fill();q.fillStyle='#241910';poly(q,[b,c,P(X1,-152,0),P(X1,-115,0)]);q.fill();
  const lg=q.createLinearGradient(e[0],0,c[0],0);lg.addColorStop(0,'rgba(255,180,100,.10)');lg.addColorStop(1,'rgba(255,180,100,.28)');q.fillStyle=lg;poly(q,[a,b,c,e]);q.fill();}
 // --- woodpile stacked on the porch against the wall, left of the door ---
 woodpile(q,r);
 // --- main roof: front plane with cedar shakes, barge boards on the gable ---
 const rf=[P(90,-25,336),P(792,-25,336),P(792,170,600),P(90,170,600)];
 {const bP=P(792,170,600),bB=P(792,365,336),bA=P(792,-25,336);q.fillStyle='#120c09';poly(q,[bA,bP,bB,P(760,340,370),P(760,170,600),P(760,0,370)]);q.fill();}
 roof(q,rf,'#4a3f3a',40);
 q.save();poly(q,rf);q.clip();{const g=q.createLinearGradient(0,rf[2][1],0,rf[0][1]);g.addColorStop(0,'rgba(120,135,165,.16)');g.addColorStop(0.5,'rgba(60,70,90,.05)');g.addColorStop(1,'rgba(5,6,10,.3)');q.fillStyle=g;q.fillRect(0,rf[2][1],1000,400);}q.restore();
 // roof thickness on the right gable: barge board along both slopes, dark soffit under it
 const bA=P(792,-25,336),bP=P(792,170,600),bB=P(792,365,336);
 q.fillStyle='#1a120d';poly(q,[bA,bP,bB,[bB[0],bB[1]+16],[bP[0],bP[1]+18],[bA[0],bA[1]+16]]);q.fill();
 q.strokeStyle='#3b2619';q.lineWidth=11;q.lineJoin='round';q.beginPath();q.moveTo(bA[0],bA[1]+6);q.lineTo(bP[0],bP[1]+6);q.lineTo(bB[0],bB[1]+6);q.stroke();
 q.strokeStyle='rgba(150,170,195,.18)';q.lineWidth=2;q.beginPath();q.moveTo(bA[0],bA[1]+1);q.lineTo(bP[0],bP[1]+1);q.lineTo(bB[0],bB[1]+1);q.stroke();
{const a=P(90,170,600),b=P(792,170,600);q.strokeStyle='#2a201c';q.lineWidth=9;q.lineCap='round';q.beginPath();q.moveTo(a[0]+4,a[1]+2);q.lineTo(b[0],b[1]+2);q.stroke();q.strokeStyle='rgba(160,175,200,.16)';q.lineWidth=2;q.beginPath();q.moveTo(a[0]+4,a[1]-1);q.lineTo(b[0],b[1]-1);q.stroke();}
 // front eave fascia + soffit shadow on the wall under it
 {const a=P(90,-25,336),b=P(792,-25,336);q.fillStyle='#2a1b12';q.fillRect(a[0],a[1]-2,b[0]-a[0],12);const g=q.createLinearGradient(0,a[1]+10,0,a[1]+60);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(112,a[1]+10,656,50);}
 // --- porch roof (lean-to under the main eave) on two log posts ---
 const pr=[P(100,0,312),P(445,0,312),P(445,-118,252),P(100,-118,252)];
 q.fillStyle='rgba(0,0,0,.4)';q.fillRect(100,pr[0][1],345,30);
 roof(q,pr,'#4a3f3a',44);
 const f0=P(100,-118,252),f1=P(445,-118,252);
 for(const px of [112,428]){const top=P(px,-108,252),bot=P(px,-108,18);const g=q.createLinearGradient(top[0]-8,0,top[0]+8,0);g.addColorStop(0,'#6a4a32');g.addColorStop(0.5,'#4f3624');g.addColorStop(1,'#2a1c12');q.fillStyle=g;q.fillRect(top[0]-8,top[1],16,bot[1]-top[1]);
  q.fillStyle='rgba(0,0,0,.4)';q.beginPath();q.ellipse(bot[0]+4,bot[1]+1,12,3,0,0,6.28);q.fill();
  q.strokeStyle='#3a271a';q.lineWidth=5;q.beginPath();q.moveTo(top[0],top[1]+40);q.lineTo(top[0]+(px<200?30:-30),top[1]+6);q.stroke();}  // knee braces
 // porch beam (a peeled log) under the front edge of the porch roof
 {const g=q.createLinearGradient(0,f0[1],0,f0[1]+16);g.addColorStop(0,'#6e4e35');g.addColorStop(1,'#2e1f14');q.fillStyle=g;q.beginPath();q.roundRect(f0[0]-6,f0[1],f1[0]-f0[0]+12,16,7);q.fill();logEnd(q,f1[0]+6,f0[1]+8,8,r);}
 // grass tufts overlapping the foot of the walls, the deck and the side wall, so the cabin sits in the ground
 const tuft=(x,y,k)=>{for(let b=0;b<0;b++){const h=(7+r()*13)*k,lean=(r()-0.6)*0.9;q.strokeStyle=['#3a3830','#4a4436','#2c2c2a','#56503e'][(r()*4)|0];q.lineWidth=1.1*k;q.beginPath();q.moveTo(x+(r()-0.5)*10*k,y+2);q.quadraticCurveTo(x+lean*h*0.4,y-h*0.6,x+lean*h,y-h);q.stroke();}};
 for(let x=446;x<790;x+=11+r()*12)tuft(x,G0+3+r()*3,1);
 for(let d=10;d<350;d+=14+r()*14){const p=P(774,d,0);tuft(p[0],p[1]+3,0.9);}
 for(let x=30;x<240;x+=12+r()*14)tuft(x,P(100,-118,0)[1]+4+r()*3,1);
 tuft(372,P(428,-118,0)[1]+4,1);tuft(436,1528,1);
 cabinSnow(q);
}
function woodpile(q,r){const xL=118,xR=228,dF=-62,dB=-8,hT=196;
 const fA=P(xL,dF,18),fB=P(xR,dF,hT);const bTop=[P(xL,dF,hT),P(xR,dF,hT),P(xR,dB,hT),P(xL,dB,hT)];
 // right side: the bark lengths of the end logs of each row, running back to the wall (shadowed)
 q.fillStyle='#120b07';poly(q,[P(xR,dF,18),P(xR,dB,18),P(xR,dB,hT),P(xR,dF,hT)]);q.fill();
 for(let h=18,k=0;h<hT-4;h+=16.5,k++){const a0=P(xR,dF,h+1),a1=P(xR,dB,h+1),b0=P(xR,dF,h+15.5),b1=P(xR,dB,h+15.5);
  const g=q.createLinearGradient(0,b0[1],0,a0[1]);g.addColorStop(0,'#5a3f2a');g.addColorStop(0.5,'#3e2a1c');g.addColorStop(1,'#20150d');q.fillStyle=g;
  q.beginPath();q.moveTo(a0[0],a0[1]);q.lineTo(a1[0],a1[1]);q.quadraticCurveTo(a1[0]+3,(a1[1]+b1[1])/2,b1[0],b1[1]);q.lineTo(b0[0],b0[1]);q.quadraticCurveTo(b0[0]+3,(a0[1]+b0[1])/2,a0[0],a0[1]);q.fill();
  for(let m=0;m<3;m++){const u=r(),p0=P(xR,lerp(dF,dB,u),h+5+r()*6);q.strokeStyle='rgba(20,12,6,.6)';q.lineWidth=1;q.beginPath();q.moveTo(p0[0],p0[1]);q.lineTo(p0[0]+6,p0[1]-1.5);q.stroke();}}
 q.fillStyle='rgba(0,0,0,.35)';poly(q,[P(xR,dF,18),P(xR,dB,18),P(xR,dB,hT),P(xR,dF,hT)]);q.fill();
 // top: rounded bark of the top row
 q.fillStyle='#3b2819';poly(q,bTop);q.fill();for(let x=xL+8;x<xR;x+=17){const a=P(x,dF,hT),b=P(x,dB,hT);q.strokeStyle='rgba(15,9,5,.6)';q.lineWidth=1.5;q.beginPath();q.moveTo(a[0],a[1]);q.lineTo(b[0],b[1]);q.stroke();}
 // front: stacked split log ends, roughly round/wedge, tightly packed in staggered rows
 q.fillStyle='#160e09';q.fillRect(fA[0],fB[1],fB[0]-fA[0],fA[1]-fB[1]);
 let row=0;for(let y=fA[1]-9;y>fB[1]+4;y-=16.5){const o=row%2?8:0;for(let x=fA[0]+8+o;x<fB[0]-6;x+=17){const rr=7.6+r()*1.4;
  q.save();q.translate(x+(r()-0.5)*2,y+(r()-0.5)*2);q.rotate(r()*6.28);
  q.fillStyle='#2a1a10';q.beginPath();q.arc(0,0,rr+1.3,0,6.28);q.fill();
  const g=q.createRadialGradient(-2,-2,1,0,0,rr);g.addColorStop(0,['#c29a6a','#b48a5c','#a87c50'][(r()*3)|0]);g.addColorStop(1,'#6f4c2f');q.fillStyle=g;
  if(r()<0.4){q.beginPath();q.moveTo(0,-rr);q.arc(0,0,rr,-Math.PI/2,Math.PI*0.9);q.closePath();q.fill();}else{q.beginPath();q.arc(0,0,rr,0,6.28);q.fill();}
  q.strokeStyle='rgba(70,44,24,.5)';q.lineWidth=0.8;q.beginPath();q.arc(0.5,0.5,rr*0.55,0,6.28);q.stroke();q.restore();}row++;}
 // the lantern side is lit, the far side in shadow
 const lg=q.createLinearGradient(fA[0],0,fB[0],0);lg.addColorStop(0,'rgba(0,0,0,.35)');lg.addColorStop(1,'rgba(255,170,90,.08)');q.fillStyle=lg;q.fillRect(fA[0],fB[1],fB[0]-fA[0],fA[1]-fB[1]);}
const CHIM={x0:636,x1:706,d0:228,d1:298,top:735};
function chimneyPaint(q,r){const {x0,x1,d0,d1,top}=CHIM;
 const F=[P(x0,d0,0),P(x1,d0,0),P(x1,d0,top),P(x0,d0,top)],R=[P(x1,d0,0),P(x1,d1,0),P(x1,d1,top),P(x1,d0,top)];
 for(const [face,dark,seed] of [[F,1,61],[R,0.62,62]]){q.save();poly(q,face);q.clip();const xs=face.map(p=>p[0]),ys=face.map(p=>p[1]);const X0=Math.min(...xs),X1=Math.max(...xs),Y0=Math.min(...ys),Y1=Math.max(...ys);
  q.fillStyle='#24262b';q.fillRect(X0,Y0,X1-X0,Y1-Y0);const rr=rng(seed);
  const skew=face===R?-0.13/0.53:0;q.transform(1,skew,0,1,0,0);
  for(let y=Y0-40;y<Y1+40;y+=20){let x=X0-10-rr()*14;while(x<X1+10){const sw=22+rr()*26;const yy=y-(face===R?skew*x:0);
   q.fillStyle=['#45474d','#3d4046','#4d4f54','#463f39','#383a40'][(rr()*5)|0];q.beginPath();q.roundRect(x+1.5,yy+1.5,sw-3,17,6);q.fill();
   q.fillStyle='rgba(160,175,200,.07)';q.beginPath();q.roundRect(x+3,yy+2.5,sw-8,5,3);q.fill();x+=sw;}}
  q.restore();if(dark<1){q.fillStyle='rgba(5,8,14,.5)';poly(q,face);q.fill();}}
 // cap slab and a short clay flue
 const c0=P(x0-6,d0-8,top),c1=P(x1+6,d0-8,top),c2=P(x1+6,d1+8,top),c3=P(x0-6,d1+8,top);
 q.fillStyle='#3c3e44';poly(q,[c0,c1,[c1[0],c1[1]+12],[c0[0],c0[1]+12]]);q.fill();q.fillStyle='#2c2e33';poly(q,[c1,c2,[c2[0],c2[1]+12],[c1[0],c1[1]+12]]);q.fill();q.fillStyle='#34363b';poly(q,[c0,c1,c2,c3]);q.fill();
 const m=P((x0+x1)/2,(d0+d1)/2,top);q.fillStyle='#5a3a2c';q.fillRect(m[0]-11,m[1]-24,22,22);q.fillStyle='#3e271d';q.fillRect(m[0]+4,m[1]-24,7,22);q.fillStyle='#120c0a';q.beginPath();q.ellipse(m[0],m[1]-24,11,3.5,0,0,6.28);q.fill();
 window.CHTOP=[m[0],m[1]-26];
 // wet streaks down the front face
 for(let k=0;k<6;k++){const u=r(),a=P(lerp(x0,x1,u),d0,top-10);q.strokeStyle='rgba(150,165,190,.07)';q.lineWidth=2;q.beginPath();q.moveTo(a[0],a[1]);q.lineTo(a[0],a[1]+40+r()*80);q.stroke();}}
function buildStatic(){
 const SS=S*1.1;const mk=f=>{const [c,q]=off(1584,2816);q.scale(SS,SS);f(q);return c;};
 SKY=mk(skyPaint);CL=mk(cloudPaint);FAR=mk(farPaint);GRD=mk(groundPaint);CAB=mk(cabinPaint);CABR=rimOf(CAB,0,7,'#8e9cd0');buildTrees();}
// ---------------- animated ----------------
function scud(t){for(let i=0;i<6;i++){const r=rng(i+60);const y=140+r()*620,rx=180+r()*240,ry=26+r()*34,span=W+rx*2+300;const x=((r()*span-t*span/LOOP*(1+(i%2)))%span+span)%span-rx-150;
 X.save();X.filter='blur(18px)';X.fillStyle=`rgba(${56+i*4},${62+i*4},${80+i*4},.42)`;X.beginPath();X.ellipse(x,y,rx,ry,0,0,6.28);X.fill();X.restore();}}
function skyLightning(t){const {f,bolt}=flashAt(t);if(f<=0.002)return;
 X.save();X.globalCompositeOperation='lighter';const sg=X.createLinearGradient(0,0,0,1350);sg.addColorStop(0,`rgba(110,125,175,${f*0.8})`);sg.addColorStop(1,`rgba(140,150,190,${f*0.5})`);X.fillStyle=sg;X.fillRect(-100,-100,W+200,1450);X.restore();
 if(bolt&&!(bolt.d>0.08&&bolt.d<0.16)){const r=rng(bolt.seed|0);let x=bolt.bx,y=430;const pts=[[x,y]];while(y<1000){y=Math.min(1000,y+14+r()*26);x+=(r()-0.5)*44+(r()<0.15?(r()-0.5)*60:0);pts.push([x,y]);}
  const br=[];for(let i=3;i<pts.length-4;i+=4){if(r()<0.6){let bx=pts[i][0],by=pts[i][1];const b=[[bx,by]];for(let k=0;k<4;k++){by+=25+r()*25;bx+=(r()-0.3)*60*(r()<0.5?-1:1);b.push([bx,by]);}br.push(b);}}
  const al=(1-bolt.d/0.32);X.save();X.globalCompositeOperation='lighter';X.lineCap='round';X.lineJoin='round';
  for(const [lw,col] of [[22,`rgba(140,160,255,${0.12*al})`],[8,`rgba(190,205,255,${0.42*al})`],[3,`rgba(255,255,255,${0.98*al})`]]){X.strokeStyle=col;X.lineWidth=lw;
   const fade=y=>Math.max(0,Math.min(1,(660-y)/150));   // the bolt dissolves into the rain haze before it reaches the far pines
   for(let i=1;i<pts.length;i++){const k=fade(pts[i][1]);if(k<=0)break;X.globalAlpha=k;X.beginPath();X.moveTo(pts[i-1][0],pts[i-1][1]);X.lineTo(pts[i][0],pts[i][1]);X.stroke();}X.globalAlpha=1;
   for(const b of br){X.lineWidth=lw*0.55;for(let i=1;i<b.length;i++){const k=fade(b[i][1]);if(k<=0)break;X.globalAlpha=k;X.beginPath();X.moveTo(b[i-1][0],b[i-1][1]);X.lineTo(b[i][0],b[i][1]);X.stroke();}X.globalAlpha=1;X.lineWidth=lw;}}
  X.restore();}}
// ---- inside the window: log room, stone fireplace with a live fire, her armchair, the dog on the rug ----
function fireLevel(t){return 0.82+0.07*Math.sin(WK(37)*t)+0.06*Math.sin(WK(59)*t+1)+0.05*Math.sin(WK(83)*t+2);}
function interior(t){const {x,y,w,h}=WIN;const fl=fireLevel(t);const {f}=flashAt(t);
 X.save();X.beginPath();X.rect(x,y,w,h);X.clip();
 // back wall: warm logs, brighter toward the fire on the right
 for(let i=0;i<9;i++){const yy=y+i*22-6;const g=X.createLinearGradient(0,yy,0,yy+22);g.addColorStop(0,'#a8683a');g.addColorStop(0.5,'#8a5530');g.addColorStop(1,'#5a3420');X.fillStyle=g;X.fillRect(x,yy,w,22);X.fillStyle='rgba(230,190,140,.25)';X.fillRect(x,yy+20,w,2);}
 const FX=x+238,FY=y+168;   // fire centre
 const wg=X.createRadialGradient(FX,FY-10,10,FX,FY-10,260);wg.addColorStop(0,`rgba(255,170,80,${0.55*fl})`);wg.addColorStop(0.5,`rgba(240,120,50,${0.22*fl})`);wg.addColorStop(1,'rgba(60,20,10,.35)');X.fillStyle=wg;X.fillRect(x,y,w,h);
 // a small framed picture and a shelf with jars on the back wall
 X.fillStyle='#3a2416';X.fillRect(x+92,y+30,44,34);X.fillStyle='#8aa0a8';X.fillRect(x+97,y+35,34,24);X.fillStyle='#4f6b5a';X.beginPath();X.moveTo(x+97,y+59);X.lineTo(x+110,y+44);X.lineTo(x+120,y+52);X.lineTo(x+131,y+42);X.lineTo(x+131,y+59);X.fill();
 // floor boards
 const fy=y+172;{const g=X.createLinearGradient(0,fy,0,y+h);g.addColorStop(0,'#6a3c22');g.addColorStop(1,'#4a2816');X.fillStyle=g;X.fillRect(x,fy,w,h);X.fillStyle='rgba(255,190,120,.18)';X.fillRect(x,fy,w,2);}
 // stone fireplace (right pane)
 const sx=x+190,sw=100;X.fillStyle='#6d6461';X.fillRect(sx,y+70,sw,fy-y-70);
 const sr=rng(91);for(let yy=y+72;yy<fy;yy+=15){let xx=sx+(sr()*8)-6;while(xx<sx+sw){const s2=16+sr()*16;X.fillStyle=['#8b7f78','#7a6f6a','#958a80','#6a605c'][(sr()*4)|0];X.beginPath();X.roundRect(Math.max(sx,xx)+1,yy+1,Math.min(s2,sx+sw-xx)-2,13,4);X.fill();xx+=s2;}}
 X.fillStyle='#4a2c1a';X.fillRect(sx-8,y+66,sw+16,8);   // mantel beam
 // candle + small things on the mantel
 X.fillStyle='#efe3c8';X.fillRect(sx+12,y+52,6,14);X.fillStyle=`rgba(255,220,140,${0.9*fl})`;X.beginPath();X.ellipse(sx+15,y+48,2,4,0,0,6.28);X.fill();
 X.fillStyle='#b08a4a';X.beginPath();X.roundRect(sx+58,y+54,10,12,3);X.fill();X.fillStyle='#d8b878';X.fillRect(sx+58,y+56,10,2);X.fillStyle='#3a2416';X.fillRect(sx+74,y+50,14,16);X.fillStyle='#9aa8a0';X.fillRect(sx+76,y+52,10,12);
 // fire opening
 const ox=sx+22,ow=56,oy=y+120,oh=fy-oy;X.fillStyle='#120806';X.beginPath();X.moveTo(ox,fy);X.lineTo(ox,oy+14);X.quadraticCurveTo(ox+ow/2,oy-6,ox+ow,oy+14);X.lineTo(ox+ow,fy);X.closePath();X.fill();
 X.save();X.clip();
 const bk=X.createRadialGradient(ox+ow/2,fy-8,2,ox+ow/2,fy-14,38);bk.addColorStop(0,`rgba(150,60,20,${0.55*fl})`);bk.addColorStop(1,'rgba(30,10,5,0)');X.fillStyle=bk;X.fillRect(ox,oy,ow,oh);   // firelit firebox
 // flame tongues of different heights, leaning and licking up between the logs
 for(let k=0;k<6;k++){const ph=k*1.37,base=[0.5,1,0.62,0.85,0.4,0.7][k];const hgt=(8+15*base)*(0.75+0.25*Math.sin(WK(29+k*7)*t+ph)+0.12*Math.sin(WK(67+k*5)*t+ph*2));
  const bx=ox+13+k*6.2+Math.sin(k*2.3)*1.5,by=fy-11-(k%3==1?3:0),sway=2.5*Math.sin(WK(19+k*3)*t+ph)+1.5*Math.sin(WK(41+k)*t),wd=1.8+base*1.6;
  const g=X.createLinearGradient(0,by,0,by-hgt);g.addColorStop(0,'rgba(255,245,190,.95)');g.addColorStop(0.35,'rgba(255,185,70,.9)');g.addColorStop(0.8,'rgba(235,90,25,.55)');g.addColorStop(1,'rgba(200,50,15,0)');X.fillStyle=g;
  X.beginPath();X.moveTo(bx-wd,by);X.bezierCurveTo(bx-wd*1.1,by-hgt*0.35,bx-wd*0.2+sway*0.6,by-hgt*0.6,bx+sway,by-hgt);X.bezierCurveTo(bx+wd*0.5+sway*0.5,by-hgt*0.55,bx+wd*1.2,by-hgt*0.3,bx+wd,by);X.closePath();X.fill();}
 // three split logs resting across the andirons: bark, glowing undersides, a pale end grain
 const logs=[[ox+ow/2-6,fy-8,30,5.5,-0.08],[ox+ow/2+6,fy-9,28,5,0.1],[ox+ow/2,fy-14,24,4.5,0.02]];
 for(const [lx,ly,lw,lh,rot] of logs){X.save();X.translate(lx,ly);X.rotate(rot);X.fillStyle='#3b2416';X.beginPath();X.roundRect(-lw/2,-lh/2,lw,lh,lh/2);X.fill();
  const ug=X.createLinearGradient(0,-lh/2,0,lh/2);ug.addColorStop(0,'rgba(0,0,0,0)');ug.addColorStop(1,`rgba(255,120,40,${0.75*fl})`);X.fillStyle=ug;X.beginPath();X.roundRect(-lw/2,-lh/2,lw,lh,lh/2);X.fill();
  X.fillStyle='#9a6a42';X.beginPath();X.ellipse(lw/2-1,0,1.6,lh/2-0.4,0,0,6.28);X.fill();X.strokeStyle='rgba(20,10,5,.6)';X.lineWidth=0.6;X.beginPath();X.moveTo(-lw/2+3,-1);X.lineTo(lw/2-5,-0.5);X.stroke();X.restore();}
 const eg=X.createRadialGradient(ox+ow/2,fy-10,2,ox+ow/2,fy-10,26);eg.addColorStop(0,`rgba(255,190,80,${0.3*fl})`);eg.addColorStop(1,'rgba(200,60,20,0)');X.fillStyle=eg;X.fillRect(ox,oy,ow,oh);
 // ember bed with pulsing coals
 X.fillStyle='#2a0f07';X.beginPath();X.ellipse(ox+ow/2,fy-1.5,24,3,0,0,6.28);X.fill();
 for(let k=0;k<14;k++){const ex=ox+10+((k*37)%36),ey=fy-1.5+((k*13)%3)-1,eb=0.5+0.5*Math.sin(WK(11+k*3)*t+k*2.1);X.fillStyle=`rgba(255,${110+eb*90|0},${30+eb*30|0},${0.55+0.45*eb})`;X.beginPath();X.ellipse(ex,ey,1.6+eb*0.8,1.1,0,0,6.28);X.fill();}
 // andirons (iron firedogs) front left/right
 X.fillStyle='#141012';for(const ax of [ox+9,ox+ow-12]){X.fillRect(ax,fy-14,3,13);X.fillRect(ax-3,fy-2,9,2.5);X.beginPath();X.arc(ax+1.5,fy-15,2.2,0,6.28);X.fill();}
 X.restore();
 X.fillStyle='#5a524f';X.fillRect(sx-6,fy-2,sw+12,8);   // hearth slab
 // rug + the sleeping dog
 X.fillStyle='#8a3a2e';X.beginPath();X.ellipse(x+222,fy+18,74,12,0,0,6.28);X.fill();X.strokeStyle='rgba(230,180,120,.5)';X.lineWidth=1.5;X.beginPath();X.ellipse(x+222,fy+18,64,9,0,0,6.28);X.stroke();
 dog(t,x+214,fy+12,fl);
 {X.save();X.globalCompositeOperation='lighter';const fg=X.createRadialGradient(x+240,fy-6,4,x+240,fy-6,90);fg.addColorStop(0,`rgba(255,140,50,${0.10+0.25*(fl-0.72)})`);fg.addColorStop(1,'rgba(255,140,50,0)');X.fillStyle=fg;X.fillRect(x+150,fy-60,180,100);X.restore();}
 xtree(t,x+21,fy+10,y+40);
 reader(t,fl,fy);
 // firelight flicker over the whole room; lightning briefly cools it
 X.fillStyle=`rgba(255,150,60,${0.06*(fl-0.8)*6})`;X.fillRect(x,y,w,h);
 if(f>0.002){X.fillStyle=`rgba(170,190,255,${f*0.25})`;X.fillRect(x,y,w,h);}
 X.restore();}
// the old dog asleep on the hearth rug, curled nose-to-tail; breathing; the ear lifts when the thunder rolls (13.4 s)
function dog(t,cx,cy,fl){const br=Math.sin(WK(7)*t)*0.9;const tw=Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(t-13.55)/0.7))));
 const fur='#b07a45',dk='#7a4f2a',lt='#d9a46a';
 X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(cx,cy+6,40,6,0,0,6.28);X.fill();
 // body (back toward us is the top curve), rising with each breath
 {const g=X.createRadialGradient(cx+10,cy-16,2,cx,cy-4,40);g.addColorStop(0,lt);g.addColorStop(0.55,fur);g.addColorStop(1,dk);X.fillStyle=g;
  X.beginPath();X.moveTo(cx-34,cy+2);X.bezierCurveTo(cx-40,cy-14,cx-20,cy-21-br,cx+2,cy-20-br);X.bezierCurveTo(cx+22,cy-19-br,cx+32,cy-12,cx+30,cy+4);X.closePath();X.fill();}
 // hind leg folded against the belly (a soft shade, not a patch), tail curled round the front
 X.strokeStyle='rgba(90,55,28,.55)';X.lineWidth=1.4;X.beginPath();X.moveTo(cx-30,cy-2);X.quadraticCurveTo(cx-22,cy-14,cx-10,cy-4);X.stroke();
 X.strokeStyle=dk;X.lineWidth=5;X.lineCap='round';X.beginPath();X.moveTo(cx-33,cy);X.quadraticCurveTo(cx-28,cy+8,cx-4,cy+6);X.stroke();X.strokeStyle=fur;X.lineWidth=3;X.beginPath();X.moveTo(cx-31,cy-1);X.quadraticCurveTo(cx-27,cy+6,cx-6,cy+5);X.stroke();
 // head resting on the front paws at the right end, eyes closed
 const hx=cx+30,hy=cy-4;X.fillStyle=fur;X.beginPath();X.ellipse(hx,hy,12,9,0.15,0,6.28);X.fill();
 X.beginPath();X.ellipse(hx+11,hy+3,8,5,0.2,0,6.28);X.fill();X.fillStyle='#2a1a10';X.beginPath();X.ellipse(hx+18,hy+2,2.4,2,0,0,6.28);X.fill();   // muzzle + nose
 X.strokeStyle='#3a2414';X.lineWidth=1.2;X.beginPath();X.arc(hx+4,hy-1,2.6,0.2,2.6);X.stroke();   // closed eye
 X.fillStyle=lt;X.beginPath();X.ellipse(hx+12,hy+9,10,3,0,0,6.28);X.fill();   // front paws
 // ear: lies flat, lifts briefly at the thunder
 X.save();X.translate(hx-4,hy-6);X.rotate(-0.4-0.9*tw);X.fillStyle=dk;X.beginPath();X.ellipse(-6,0,8,4.5,0,0,6.28);X.fill();X.restore();}
// her: curled up in the armchair in profile, facing the fire; long hair down her back, knees drawn up under a knitted
// blanket that drapes over the chair arm, the open book resting on her knees
const PAGE=[8.0,0.7];
function reader(t,fl,fy){const {x,y}=WIN;const br=Math.sin(WK(5)*t)*0.6;
 const cx=x+44,seatY=fy-30,armY=seatY-14;
 const ch='#7d3a2c',chL='#a6513a',chD='#4f2119';
 const skin='#c98b67',top='#e9dfcd',topD='#bfb29c',hair='#3b2218',hairL='#6a3f28';
 // legs + wing back of the chair
 X.fillStyle=chD;X.fillRect(cx+2,fy-8,5,10);X.fillRect(cx+88,fy-8,5,10);
 X.fillStyle=ch;X.beginPath();X.roundRect(cx-8,y+80,30,fy-y-86,[16,10,4,4]);X.fill();
 X.fillStyle='rgba(255,170,100,.25)';X.fillRect(cx+14,y+86,6,fy-y-96);   // fire catching the inner edge of the wing
 X.fillStyle=ch;X.beginPath();X.roundRect(cx-4,seatY-4,100,24,6);X.fill();   // seat cushion
 // torso in a cream jumper (leaning back a little), shoulders breathing
 const shX=cx+33,shY=y+92+br;
 X.fillStyle=top;X.beginPath();X.moveTo(cx+18,seatY);X.quadraticCurveTo(cx+18,shY+14,shX-6,shY);X.quadraticCurveTo(shX+6,shY-5,shX+14,shY+2);X.quadraticCurveTo(shX+19,shY+22,cx+52,seatY);X.closePath();X.fill();
 X.fillStyle=topD;X.beginPath();X.moveTo(cx+18,seatY);X.quadraticCurveTo(cx+18,shY+14,shX-6,shY);X.lineTo(shX-2,shY+3);X.quadraticCurveTo(cx+24,shY+18,cx+25,seatY);X.closePath();X.fill();
 // neck + head in profile, tilted down toward the book
 const hx=shX+6,hy=shY-17;X.fillStyle=skin;X.beginPath();X.moveTo(hx-5,shY+1);X.lineTo(hx-3,hy+6);X.lineTo(hx+5,hy+6);X.lineTo(hx+4,shY+1);X.closePath();X.fill();
 X.beginPath();X.ellipse(hx+1,hy,9.5,11.5,0.3,0,6.28);X.fill();
 X.beginPath();X.moveTo(hx+8,hy-2);X.quadraticCurveTo(hx+13.5,hy+3,hx+8.5,hy+5);X.closePath();X.fill();       // nose
 X.fillStyle='rgba(255,170,110,.5)';X.beginPath();X.ellipse(hx+5,hy+3,3.5,5,0.3,0,6.28);X.fill();              // firelit cheek
 X.fillStyle='#fbf3ea';X.beginPath();X.ellipse(hx+5.6,hy+1.6,1.9,1.15,0.35,0,6.28);X.fill();X.fillStyle='#4a2a1a';X.beginPath();X.ellipse(hx+6.1,hy+2.1,1.15,1.0,0,0,6.28);X.fill();   // open eye, iris low = looking down at the page
 X.strokeStyle='#2a140c';X.lineWidth=1.2;X.beginPath();X.moveTo(hx+3.6,hy+0.6);X.quadraticCurveTo(hx+5.8,hy-0.1,hx+7.8,hy+1.6);X.stroke();X.lineWidth=0.8;X.beginPath();X.moveTo(hx+3,hy-2.6);X.quadraticCurveTo(hx+5.5,hy-3.6,hx+7.5,hy-2.2);X.stroke();   // upper lid + brow
 // long hair: over the crown and down her back, past the shoulder blades, tucked behind the ear
 X.fillStyle=hair;X.beginPath();X.moveTo(hx+8,hy-8);X.quadraticCurveTo(hx+2,hy-15,hx-8,hy-10);X.quadraticCurveTo(hx-14,hy,hx-13,shY+12);X.quadraticCurveTo(hx-13,shY+30,hx-9,shY+36);
 X.lineTo(hx-4,shY+30);X.quadraticCurveTo(hx-6,shY+10,hx-3,hy+8);X.quadraticCurveTo(hx-1,hy-1,hx+3,hy-3);X.quadraticCurveTo(hx+6,hy-5,hx+8,hy-8);X.closePath();X.fill();
 X.strokeStyle=hairL;X.lineWidth=0.9;for(const o of [-8,-5]){X.beginPath();X.moveTo(hx-1,hy-11);X.quadraticCurveTo(hx+o-4,hy+6,hx+o-1,shY+26);X.stroke();}
 X.fillStyle=skin;X.beginPath();X.ellipse(hx-1,hy+1,2,3,0.2,0,6.28);X.fill();   // ear peeking from the hair
 // chair arm (the near side panel) in front of her hip
 X.fillStyle=ch;X.beginPath();X.roundRect(cx-2,armY,98,fy-armY-6,[8,8,3,3]);X.fill();
 X.fillStyle=chL;X.beginPath();X.roundRect(cx-2,armY,98,7,6);X.fill();
 X.strokeStyle='rgba(40,12,8,.4)';X.lineWidth=1;X.beginPath();X.moveTo(cx+2,armY+12);X.lineTo(cx+92,armY+12);X.stroke();
 // knees drawn up under the blanket; the blanket falls over the arm and hangs down the side of the chair
 const kx=cx+78,ky=y+104;
 const bl='#7f9a86',blD='#5f7a68',blL='#a7bfa9';
 X.fillStyle=bl;X.beginPath();X.moveTo(cx+24,seatY-6);X.quadraticCurveTo(cx+40,ky+4,kx-6,ky-1);X.quadraticCurveTo(kx+8,ky-3,kx+14,ky+10);
 X.quadraticCurveTo(kx+19,armY+10,kx+18,fy-20);X.quadraticCurveTo(kx+4,fy-16,kx-8,fy-19);X.quadraticCurveTo(kx-20,fy-14,kx-32,fy-18);X.quadraticCurveTo(kx-36,armY+20,cx+34,armY+4);X.closePath();X.fill();
 X.strokeStyle=blD;X.lineWidth=1.4;for(const [a,b] of [[kx-4,kx-10],[kx+6,kx+6],[kx-18,kx-24]]){X.beginPath();X.moveTo(a,ky+6);X.quadraticCurveTo((a+b)/2+3,armY+8,b,fy-19);X.stroke();}
 X.strokeStyle=blL;X.lineWidth=2;for(const yy of [armY+16,armY+22]){X.beginPath();X.moveTo(kx-32,yy+2);X.quadraticCurveTo(kx-8,yy+6,kx+17,yy);X.stroke();}   // cream knit stripes
 X.strokeStyle='rgba(255,180,110,.35)';X.lineWidth=1.5;X.beginPath();X.moveTo(kx-6,ky-1);X.quadraticCurveTo(kx+8,ky-3,kx+14,ky+10);X.stroke();   // fire on the knee
 X.strokeStyle='#b9c9b6';X.lineWidth=1.1;const fr=rng(5);for(let i=0;i<12;i++){const fx=kx-30+i*4.1;X.beginPath();X.moveTo(fx,fy-18+(i%3));X.lineTo(fx+(fr()-0.5)*2.5,fy-12+fr()*5);X.stroke();}   // fringe, uneven
 // near arm: sleeve from the shoulder down to the elbow on her knee, forearm up to the book
 const bkx=kx-8,bky=ky-12;
 X.strokeStyle=top;X.lineWidth=7;X.lineCap='round';X.lineJoin='round';X.beginPath();X.moveTo(shX+4,shY+6);X.quadraticCurveTo(shX+6,shY+22,shX+14,shY+24);X.lineTo(bkx-9,bky+7);X.stroke();
 X.strokeStyle=topD;X.lineWidth=1.2;X.beginPath();X.moveTo(shX+10,shY+27);X.lineTo(bkx-10,bky+11);X.stroke();
 // book open on her knees, tipped toward her face
 X.save();X.translate(bkx,bky);X.rotate(-0.5);
 X.fillStyle='#6a2a22';X.fillRect(-14,-1,28,4);
 X.fillStyle='#f5ead2';X.beginPath();X.moveTo(0,0);X.quadraticCurveTo(-7,-5,-13,-2);X.lineTo(-13,1);X.lineTo(0,2);X.closePath();X.fill();
 X.beginPath();X.moveTo(0,0);X.quadraticCurveTo(7,-5,13,-2);X.lineTo(13,1);X.lineTo(0,2);X.closePath();X.fill();
 X.strokeStyle='rgba(120,90,60,.5)';X.lineWidth=0.6;X.beginPath();X.moveTo(0,0);X.lineTo(0,2);X.stroke();
 const pu=(t-PAGE[0])/PAGE[1];if(pu>0&&pu<1){const a=Math.PI*pu;X.fillStyle='#fff6e2';X.beginPath();X.moveTo(0,0);X.quadraticCurveTo(Math.cos(a)*6,-Math.sin(a)*9,Math.cos(a)*13,-1-Math.sin(a)*9);X.lineTo(Math.cos(a)*13,1-Math.sin(a)*8);X.lineTo(0,2);X.closePath();X.fill();}
 X.restore();
 X.fillStyle=skin;X.beginPath();X.ellipse(bkx-8,bky+6,4.2,3.2,-0.4,0,6.28);X.fill();   // hand holding the lower edge
 X.beginPath();X.ellipse(bkx+9,bky-4,3.4,2.6,-0.4,0,6.28);X.fill();                    // far hand's fingers at the top of the page
 X.strokeStyle=`rgba(255,170,90,${0.45*fl})`;X.lineWidth=1.3;X.beginPath();X.arc(hx+1,hy,10,-0.9,0.9);X.stroke();}
// glass: dim reflection, beads, and rivulets running down (each falls a whole number of times per loop)
const RIV=[...Array(7)].map((_,i)=>{const r=rng(200+i);return {x:r(),ph:r(),n:1+((r()*3)|0),len:20+r()*40};});
function glass(t){const {x,y,w,h}=WIN;X.save();X.beginPath();X.rect(x,y,w,h);X.clip();
 const g=X.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'rgba(170,185,220,.16)');g.addColorStop(0.35,'rgba(170,185,220,0)');g.addColorStop(1,'rgba(170,185,220,.08)');X.fillStyle=g;X.fillRect(x,y,w,h);
 X.fillStyle='rgba(255,255,255,.07)';X.beginPath();X.moveTo(x+30,y);X.lineTo(x+80,y);X.lineTo(x+20,y+h);X.lineTo(x-30,y+h);X.closePath();X.fill();
 for(const [fx,fy,sx] of [[x,y+h,1],[x+w,y+h,-1],[x+w/2,y+h,-1],[x+w/2,y+h,1]]){const fg=X.createRadialGradient(fx,fy,0,fx,fy,46);fg.addColorStop(0,'rgba(225,232,248,.42)');fg.addColorStop(1,'rgba(225,232,248,0)');X.fillStyle=fg;X.fillRect(Math.min(fx,fx+sx*46),fy-46,46,46);}
 const r=rng(301);for(let i=0;i<0;i++){const bx=x+r()*w,by=y+r()*h,rr=0.6+r()*1.1;X.fillStyle='rgba(255,240,215,.22)';X.beginPath();X.arc(bx,by,rr,0,6.28);X.fill();}
 for(const v of []){const p=((t*v.n/LOOP+v.ph)%1);const yy=y-v.len+p*(h+v.len*2),xx=x+v.x*w+Math.sin(p*9+v.ph*6)*2;
  X.strokeStyle='rgba(255,235,205,.16)';X.lineWidth=1;X.beginPath();X.moveTo(xx,yy-v.len);X.lineTo(xx+1,yy);X.stroke();X.fillStyle='rgba(255,240,215,.35)';X.beginPath();X.arc(xx+1,yy,1.4,0,6.28);X.fill();}
 X.restore();
 // window frame + centre mullion drawn over everything inside
 X.strokeStyle='#2c1c12';X.lineWidth=9;X.beginPath();X.moveTo(x+w/2,y);X.lineTo(x+w/2,y+h);X.stroke();X.strokeStyle='rgba(255,190,120,.25)';X.lineWidth=1.5;X.beginPath();X.moveTo(x+w/2+4,y);X.lineTo(x+w/2+4,y+h);X.stroke();}
// warm glow around the window + light falling on the logs beside it
function glowAnim(t){const fl=fireLevel(t);const {x,y,w,h}=WIN;
 {const cx=x+w/2-10,cy=1592;X.save();X.translate(cx,cy);X.scale(1,0.32);const pg=X.createRadialGradient(0,0,10,0,0,380);pg.addColorStop(0,`rgba(255,170,95,${0.50*fl})`);pg.addColorStop(0.5,`rgba(255,170,95,${0.22*fl})`);pg.addColorStop(1,'rgba(255,165,85,0)');X.fillStyle=pg;X.fillRect(-380,-380,760,760);X.restore();}
 const g=X.createRadialGradient(x+w/2,y+h/2,40,x+w/2,y+h/2,330);g.addColorStop(0,`rgba(255,170,90,${0.18*fl})`);g.addColorStop(1,'rgba(255,170,90,0)');X.fillStyle=g;X.fillRect(x-300,y-300,w+600,h+600);}
// puddles: irregular shapes that fade into the grass; they mirror the dark sky and the pines, the big one holds a soft,
// broken warm smear of the window; raindrop rings of different sizes start at staggered times
let PCV=null;
function puddleMask(p,seed){const R=1.5,pad=20;const w=(p.rx+pad)*2,h=(p.ry+pad)*2;const [c,g]=off(w*R|0,h*R|0);g.scale(R,R);g.translate(w/2,h/2);const r=rng(seed);
 const ph=[r()*6,r()*6,r()*6];g.filter='blur(5px)';g.fillStyle='#fff';g.beginPath();for(let i=0;i<=60;i++){const a=i/60*6.283;const k=1+0.13*Math.sin(a*2+ph[0])+0.08*Math.sin(a*3+ph[1])+0.05*Math.sin(a*5+ph[2]);
  const xx=Math.cos(a)*p.rx*k,yy=Math.sin(a)*p.ry*k;i?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.closePath();g.fill();g.filter='none';
 const [c2,g2]=off(c.width,c.height);return {mask:c,buf:c2,bg:g2,w,h,R};}
function puddles(t){const fl=fireLevel(t);if(!PCV)PCV=PUD.map((p,i)=>puddleMask(p,90+i));
 PUD.forEach((p,i)=>{const M=PCV[i],q=M.bg;q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-over';q.clearRect(0,0,M.buf.width,M.buf.height);q.setTransform(M.R,0,0,M.R,M.w/2*M.R,M.h/2*M.R);
  const {rx,ry}=p;
  // mirrored night sky: lighter toward the far edge (sky reflected low), dark near edge
  const g=q.createLinearGradient(0,-ry,0,ry);g.addColorStop(0,'#383e4b');g.addColorStop(1,'#1c2029');q.fillStyle=g;q.fillRect(-rx-20,-ry-20,rx*2+40,ry*2+40);
  // reflected pine trunks/silhouettes hanging down from the far edge
  const tr=rng(70+i);q.filter='blur(2.5px)';for(let k=0;k<4;k++){const tx=(tr()*2-1)*rx*0.9,tw=3+tr()*4,L=ry*(0.8+tr()*0.8);const tg=q.createLinearGradient(0,-ry-6,0,-ry+L);tg.addColorStop(0,'rgba(10,16,14,.5)');tg.addColorStop(1,'rgba(10,16,14,0)');q.fillStyle=tg;q.fillRect(tx-tw,-ry-6,tw*2,L+6);}q.filter='none';
  if(i==0){ // window smear, broken into wobbling bands by the ripples
   for(let k=0;k<6;k++){const yy=-ry+ry*2*(k/6),wob=Math.sin(WK(6)*t+k*1.7)*4+Math.sin(WK(11)*t+k)*2;const wd=WIN.w*0.36*(1-k*0.07);
    const sg=q.createRadialGradient(wob,yy+ry/6,2,wob,yy+ry/6,wd);sg.addColorStop(0,`rgba(255,180,100,${(0.55-k*0.06)*fl})`);sg.addColorStop(1,'rgba(255,180,100,0)');q.fillStyle=sg;q.save();q.translate(wob,yy+ry/6);q.scale(1,0.22);q.translate(-wob,-(yy+ry/6));q.fillRect(-wd+wob,yy+ry/6-wd,wd*2,wd*2);q.restore();}}
  else{const lg=q.createRadialGradient(10,-2,1,10,-2,rx*0.7);lg.addColorStop(0,`rgba(255,200,130,${0.35*fl})`);lg.addColorStop(1,'rgba(255,200,130,0)');q.fillStyle=lg;q.fillRect(-rx,-ry,rx*2,ry*2);}
  // raindrop rings: each slot restarts at its own phase and size, landing in a new spot every cycle
  for(let k=0;k<(i?5:9);k++){const rate=1+(k%3)*0.5,cyc=t*rate+k*0.37;const ph=cyc%1,n=Math.floor(cyc)+k*7;const h1=Math.sin(n*12.9898+i*78.233)*43758.5453,h2=Math.sin(n*39.3468+i*11.135)*24634.6345;
   const u=h1-Math.floor(h1),v=h2-Math.floor(h2);const px=(u*2-1)*rx*0.8,py=(v*2-1)*ry*0.55;const sz=(0.5+0.6*((k*0.618)%1))*rx*0.16;
   q.strokeStyle=`rgba(215,225,245,${(1-ph)*0.45})`;q.lineWidth=0.9;q.beginPath();q.ellipse(px,py,1+ph*sz,0.4+ph*sz*0.3,0,0,6.28);q.stroke();
   if(ph>0.25){q.strokeStyle=`rgba(215,225,245,${(1-ph)*0.25})`;q.beginPath();q.ellipse(px,py,(ph-0.25)*sz*0.9,(ph-0.25)*sz*0.27,0,0,6.28);q.stroke();}}
  q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='destination-in';q.drawImage(M.mask,0,0);
  X.drawImage(M.buf,p.x-M.w/2,p.y-M.h/2,M.w,M.h);});}
// porch lantern hanging from an iron hook under the porch beam; swings a little with the gusts; warm pool on the deck
function lantern(t){const G=gust(t);const a=0.05*(G-0.55)+0.03*Math.sin(WK(3)*t)+0.012*Math.sin(WK(8)*t);const fl=0.9+0.06*Math.sin(WK(61)*t)+0.04*Math.sin(WK(97)*t);
 const deck=[LANT.x-6,1546];{X.save();X.translate(LANT.x-30,1600);X.scale(1,0.3);const sp=X.createRadialGradient(0,0,6,0,0,230);sp.addColorStop(0,`rgba(255,180,100,${0.38*fl})`);sp.addColorStop(1,'rgba(255,180,100,0)');X.fillStyle=sp;X.fillRect(-230,-230,460,460);X.restore();}
 const pl=X.createRadialGradient(deck[0],deck[1],6,deck[0],deck[1],170);pl.addColorStop(0,`rgba(255,190,110,${0.34*fl})`);pl.addColorStop(1,'rgba(255,190,110,0)');X.save();X.translate(deck[0],deck[1]);X.scale(1,0.3);X.translate(-deck[0],-deck[1]);X.fillStyle=pl;X.beginPath();X.arc(deck[0],deck[1],170,0,6.28);X.fill();X.restore();
 const wg=X.createRadialGradient(LANT.x,LANT.y+50,6,LANT.x,LANT.y+50,190);wg.addColorStop(0,`rgba(255,185,105,${0.30*fl})`);wg.addColorStop(1,'rgba(255,185,105,0)');X.fillStyle=wg;X.fillRect(LANT.x-190,LANT.y-140,380,380);
 X.fillStyle='#16130f';X.fillRect(377,LANT.y-8,6,14);X.fillRect(379,LANT.y-6,LANT.x-376,3.5);X.strokeStyle='#16130f';X.lineWidth=2.4;X.beginPath();X.moveTo(381,LANT.y+14);X.quadraticCurveTo(388,LANT.y+2,LANT.x-6,LANT.y-4);X.stroke();X.lineWidth=2;X.beginPath();X.arc(LANT.x,LANT.y+3.5,3,0,6.28);X.stroke();   // bracket screwed to the post + scroll brace   // eye bolt in the underside of the beam   // hook screwed into the beam
 X.save();X.translate(LANT.x,LANT.y+2);X.rotate(a);
 X.strokeStyle='#16130f';X.lineWidth=2;for(let k=0;k<3;k++){X.beginPath();X.ellipse(0,4+k*6,1.8,3.4,k%2?0:1.57,0,6.28);X.stroke();}   // chain links
 X.fillStyle='#16130f';X.beginPath();X.arc(0,24,4,Math.PI,0);X.fill();X.beginPath();X.moveTo(-15,34);X.lineTo(15,34);X.lineTo(7,24);X.lineTo(-7,24);X.closePath();X.fill();   // ring + roof
 X.fillStyle=`rgb(255,${206+18*fl|0},140)`;X.beginPath();X.roundRect(-11,35,22,32,3);X.fill();
 const ig=X.createRadialGradient(0,52,1,0,52,10);ig.addColorStop(0,'#fffbe8');ig.addColorStop(1,'rgba(255,240,200,0)');X.fillStyle=ig;X.beginPath();X.ellipse(0,52,4,8*fl,0,0,6.28);X.fill();
 X.strokeStyle='#16130f';X.lineWidth=2.5;X.strokeRect(-11,35,22,32);X.beginPath();X.moveTo(0,35);X.lineTo(0,67);X.stroke();X.fillStyle='#16130f';X.fillRect(-14,66,28,5);
 const gl=X.createRadialGradient(0,50,3,0,50,80);gl.addColorStop(0,`rgba(255,205,130,${0.5*fl})`);gl.addColorStop(1,'rgba(255,205,130,0)');X.fillStyle=gl;X.fillRect(-80,-30,160,160);
 X.restore();}
// rain dripping off the eaves in strings of drops, each string looping a whole number of times
const DRIPS=[...Array(26)].map((_,i)=>{const r=rng(400+i);const porch=i<10;const x=porch?lerp(48,372,r()):lerp(450,780,r());return {x,porch,ph:r(),n:5+((r()*4)|0)};});
function drips(t){for(const d of DRIPS){const y0=d.porch?1302:1197,y1=d.porch?1534:1534;for(let k=0;k<3;k++){const p=((t*d.n/LOOP+d.ph+k/3)%1);const y=y0+p*p*(y1-y0);
  const nearWin=!d.porch&&d.x>WIN.x-10&&d.x<WIN.x+WIN.w+10&&y>WIN.y-10&&y<WIN.y+WIN.h+40;
  X.strokeStyle=nearWin?'rgba(255,215,160,.55)':'rgba(190,205,230,.30)';X.lineWidth=1.6;X.beginPath();X.moveTo(d.x,y-6-p*10);X.lineTo(d.x,y);X.stroke();
  if(p>0.93){const s=(p-0.93)/0.07;X.strokeStyle=`rgba(200,215,235,${0.25*(1-s)})`;X.lineWidth=1;X.beginPath();X.moveTo(d.x-2-s*5,y1-s*4);X.lineTo(d.x-1,y1);X.moveTo(d.x+2+s*5,y1-s*4);X.lineTo(d.x+1,y1);X.stroke();}}}}
// chimney smoke torn sideways (to the left) by the gusts, thinning out
function smoke(t){const [cx,cy]=window.CHTOP;for(let i=0;i<34;i++){const p=((t/2.5+i/34)%1);const G=gust(t-p*2);
 const sx=cx-p*(190+90*G)+Math.sin(p*7+i*0.9)*26*p,sy=cy-p*190+p*p*70;const rr=(10+p*70)*(0.7+0.5*Math.abs(Math.sin(i*1.9)));
 const g=X.createRadialGradient(sx,sy,0,sx,sy,rr);g.addColorStop(0,`rgba(128,130,142,${(1-p)*(1-p)*0.3})`);g.addColorStop(1,'rgba(128,130,142,0)');X.fillStyle=g;X.fillRect(sx-rr,sy-rr,rr*2,rr*2);}}
// ferns in the bottom corners, swaying with the same gust
function ferns(t){const G=gust(t);const q=rng(19);
 for(const [bx,by,n,sz] of [[-10,1930,6,1.2],[130,1950,4,0.9],[790,1950,4,0.95],[1090,1920,5,1.15]]){for(let i=0;i<n;i++){const ang=-Math.PI/2+(i/(n-1)-0.5)*2.0+(q()-0.5)*0.2;const L=(140+q()*90)*sz;const bend=-(0.15+0.3*G)+0.08*Math.sin(WK(5)*t+i+bx*0.01);
  const pts=[];for(let s=0;s<=12;s++){const u=s/12;const a=ang+bend*u*1.4+(ang>-Math.PI/2?0.6:-0.6)*u*u;let x=bx,y=by;for(let k=0;k<s;k++){const uu=k/12;const aa=ang+bend*uu*1.4+(ang>-Math.PI/2?0.6:-0.6)*uu*uu;x+=Math.cos(aa)*L/12;y+=Math.sin(aa)*L/12;}pts.push([x,y,a]);}
  X.strokeStyle='#14241a';X.lineWidth=2.4;X.beginPath();pts.forEach((p,k)=>k?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();
  for(let s=1;s<12;s++){const [x,y,a]=pts[s];const ll=(1-s/12)*28*sz+5;for(const sd of [-1,1]){const aa=a+sd*1.15;X.fillStyle=['#16281c','#1b3222','#213b28'][(s+i)%3];X.beginPath();X.ellipse(x+Math.cos(aa)*ll/2,y+Math.sin(aa)*ll/2,ll/2,ll*0.16+1.2,aa,0,6.28);X.fill();}}}}}
// rain in three depths, slanting to the left with the wind; each drop falls a whole number of frame-heights per loop.
// drops passing through the window/lantern light turn warm.
const RR=rng(77);const DR=[...Array(820)].map(()=>({x:RR(),y:RR(),z:RR()}));
function rain(t,front){const LS=[[WIN.x+WIN.w/2,WIN.y+WIN.h/2,260,0.9],[LANT.x,LANT.y+50,180,1],[WIN.x+WIN.w/2-10,1580,210,0.7]];
 for(const d of DR){const isF=d.z>0.93;if(isF!==front)continue;const n=d.z<0.5?13:(d.z<0.85?17:22);const span=H+200;
 const y=((d.y*span+t*span*n/LOOP)%span)-100;const x=((d.x*(W+500)-(y+100)*0.3)%(W+500)+W+500)%(W+500)-250;
 const len=front?60:14+d.z*30,a=front?0.26:0.11+d.z*0.2;let warm=0;if(!front&&d.z>0.55)for(const [lx,ly,lr,k] of LS){const dd=Math.hypot(x-lx,y-ly);if(dd<lr)warm=Math.max(warm,(1-dd/lr)*k);}
 X.strokeStyle=warm>0.05?`rgba(255,${215-40*warm|0},${235-110*warm|0},${a+0.3*warm})`:`rgba(200,212,235,${a})`;X.lineWidth=front?2.2:0.9+d.z;X.beginPath();X.moveTo(x,y);X.lineTo(x+len*0.3,y-len);X.stroke();}}
function grade(t){const {f}=flashAt(t);if(f>0.002){X.fillStyle=`rgba(180,195,255,${f*0.22})`;X.fillRect(0,0,W,H);}
 const v=X.createRadialGradient(W/2,H*0.55,H*0.3,W/2,H*0.55,H*0.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(3,5,10,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.035;for(let i=0;i<1400;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function caption(t){if(t>6.4)return;const a=Math.min(1,0.45+t/1.0)*Math.max(0,Math.min(1,(6.2-t)/1.5));
 X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*6,y=250;const bl=Math.max(0,(t-4.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
 X.font="italic 500 74px Corm, serif";X.shadowColor='rgba(255,210,160,.5)';X.shadowBlur=28;X.fillStyle='#fbf6ee';
 const C1=(window.CAP||['first snow at the cabin,','so the tree went up']);for(let k=0;k<2;k++){X.fillText(C1[0],x,y);X.fillText(C1[1],x,y+86);X.shadowBlur=0;}
 X.filter='none';X.globalAlpha=a*0.6;X.strokeStyle='#fbf6ee';X.lineWidth=1.5;X.beginPath();X.moveTo(x-55,y+146);X.lineTo(x+55,y+146);X.stroke();X.restore();}
window.draw=function(t){if(!STATIC_OK){buildStatic();STATIC_OK=true;}
 const tc=t-(window.TOFF||0);const {f}=flashAt(t);
 const z=1.0+0.03*(1-Math.cos(WK(1)*t))/2,Fx=520+14*Math.sin(WK(1)*t),Fy=1350;const ox=S*(Fx-Fx*z),oy=S*(Fy-Fy*z);
 const L=()=>X.setTransform(z/1.1,0,0,z/1.1,ox,oy),A=()=>X.setTransform(S*z,0,0,S*z,ox,oy);
 X.setTransform(1,0,0,1,0,0);L();X.drawImage(SKY,0,0);X.drawImage(CL,0,0);
 if(f>0.002){X.save();X.globalAlpha=Math.min(1,f*4);X.globalCompositeOperation='lighter';X.drawImage(CL,0,0);X.restore();}
 A();scud(t);snowFall(t,0);
 L();X.drawImage(FAR,0,0);
 L();X.drawImage(GRD,0,0);
 A();for(const T of TREES)if(T.layer=='back')drawTree(T,t,f);
 A();interior(t);
 L();X.drawImage(CAB,0,0);if(f>0.002){X.save();X.globalAlpha=Math.min(1,f*2.2);X.globalCompositeOperation='lighter';X.drawImage(CABR,0,0);X.restore();
  A();X.save();X.globalCompositeOperation='lighter';const gg=X.createLinearGradient(0,1528,0,H);gg.addColorStop(0,`rgba(120,140,200,${f*0.35})`);gg.addColorStop(1,`rgba(120,140,200,${f*0.12})`);X.fillStyle=gg;X.fillRect(0,1528,W,H-1528);
  const rg=X.createLinearGradient(0,880,0,1200);rg.addColorStop(0,`rgba(150,165,220,${f*0.35})`);rg.addColorStop(1,'rgba(150,165,220,0)');X.fillStyle=rg;X.beginPath();const a=P(90,-25,336),b=P(792,-25,336),c=P(792,170,600),d=P(90,170,600);X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.lineTo(c[0],c[1]);X.lineTo(d[0],d[1]);X.closePath();X.fill();X.restore();}
 A();glass(t);glowAnim(t);smoke(t);porchLights(t);wreath(t);lantern(t);snowFall(t,1);
 for(const T of TREES)if(T.layer=='front')drawTree(T,t,f);
 snowFall(t,2);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(tc);};
let STATIC_OK=false;

// ======================= first snow at the cabin (overrides + additions) =======================
var SNOW_A='#d3dae9',SNOW_B='#9ea9c4';
function ell(q,x,y,rx,ry){q.beginPath();q.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
function snowCap(q,x0,y0,x1,y1,th,seed){const r=rng(seed);const n=Math.max(6,Math.hypot(x1-x0,y1-y0)/10|0);
 const g=q.createLinearGradient(0,Math.min(y0,y1)-th,0,Math.max(y0,y1)+th*0.6);g.addColorStop(0,SNOW_A);g.addColorStop(1,SNOW_B);q.fillStyle=g;
 q.beginPath();q.moveTo(x0-2,y0+th*0.3);
 for(let k=0;k<=n;k++){const u=k/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u);q.lineTo(x,y-th*(0.55+0.45*Math.sin(u*Math.PI))*(0.8+r()*0.35));}
 for(let k=n;k>=0;k--){const u=k/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u);q.lineTo(x,y+th*0.25+(r()<0.25?r()*th*0.5:0));}
 q.closePath();q.fill();
 q.fillStyle='rgba(235,240,250,.45)';q.beginPath();for(let k=0;k<=n;k++){const u=k/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u)-th*0.5*Math.sin(u*Math.PI)-th*0.45;k?q.lineTo(x,y):q.moveTo(x,y);}
 for(let k=n;k>=0;k--){const u=k/n;q.lineTo(lerp(x0,x1,u),lerp(y0,y1,u)-th*0.3*Math.sin(u*Math.PI)-th*0.25);}q.closePath();q.fill();}
// sky: a snowing night is never black: low cloud lit from below by the snow, no stars
function skyPaint(q){const g=q.createLinearGradient(0,0,0,1400);g.addColorStop(0,'#141a27');g.addColorStop(0.45,'#232a3b');g.addColorStop(0.8,'#353d50');g.addColorStop(1,'#465066');q.fillStyle=g;q.fillRect(0,0,W,1500);}
// far forest: snowy floor between the rows, mist of falling snow
function farPaint(q){const r=rng(5);
 const rows=[[1060,'#303a4a',0.55,380,520],[1180,'#252e3b',0.75,360,480],[1300,'#19212a',1,300,430]];
 rows.forEach(([by,col,k,hmin,hmax],ri)=>{const pal=[col,col,col,col,col,col];
  for(let x=-40;x<W+60;x+=(hmin*0.17+r()*hmin*0.2)){const h=hmin+r()*(hmax-hmin);q.save();q.translate(x,by+r()*30+30);pineShape(q,h,h*0.2,(x*7+ri*131)|0,pal,0,0.22+ri*0.08);q.restore();}
  const mg=q.createLinearGradient(0,by-40,0,by+60);mg.addColorStop(0,'rgba(90,100,124,0)');mg.addColorStop(0.6,`rgba(92,102,126,${0.5-ri*0.1})`);mg.addColorStop(1,'rgba(90,100,124,0)');q.fillStyle=mg;q.fillRect(0,by-40,W,100);});
 const fg=q.createLinearGradient(0,1320,0,1480);fg.addColorStop(0,'#59627a');fg.addColorStop(1,'#6a738c');q.fillStyle=fg;q.fillRect(0,1320,W,160);}
// ground under fresh snow: soft drifts, blue hollows, a trodden line of footprints from the bottom of the frame to the step
var STEP=[302,1546];
function groundPaint(q){const r=rng(21);
 const gg=q.createLinearGradient(0,1330,0,H);gg.addColorStop(0,'#6c7590');gg.addColorStop(0.25,'#8c95b0');gg.addColorStop(0.7,'#9aa3bd');gg.addColorStop(1,'#7f88a3');q.fillStyle=gg;q.fillRect(0,1330,W,H-1330);
 // gentle drifts: long soft light ridges with blue shade on their lee side
 q.save();q.filter='blur(10px)';for(let i=0;i<26;i++){const y=1380+Math.pow(r(),0.8)*(H-1400),k=(y-1330)/(H-1330),x=r()*W,rx=(90+r()*160)*(0.6+k);
  q.fillStyle='rgba(215,222,240,.07)';ell(q,x,y,rx*1.4,(18+r()*14)*(0.6+k));q.fill();q.fillStyle='rgba(60,70,100,.05)';ell(q,x+rx*0.3,y+(16+r()*8)*(0.6+k),rx,(10+r()*8)*(0.6+k));q.fill();}q.restore();
 // shade pooled under the big pines on both sides
 for(const [x,y,rx] of [[70,1470,260],[985,1470,280],[1015,1990,300]]){q.save();q.translate(x,y);q.scale(1,0.28);const g=q.createRadialGradient(0,0,10,0,0,rx);g.addColorStop(0,'rgba(30,38,58,.45)');g.addColorStop(1,'rgba(30,38,58,0)');q.fillStyle=g;q.fillRect(-rx,-rx,rx*2,rx*2);q.restore();}
 // a few dry grass stalks and a fern frond poking through, very sparse
 for(let i=0;i<0;i++){const y=1400+r()*(H-1420),k=(y-1330)/(H-1330),x=r()*W;if(Math.abs(x-lerp(560,STEP[0],Math.pow((H-y)/(H-STEP[1]),1)))<90)continue;const h=(6+r()*12)*(0.5+k);q.strokeStyle=['rgba(70,62,48,.7)','rgba(54,60,50,.7)','rgba(90,80,60,.6)'][(r()*3)|0];q.lineWidth=0.8+k;q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(x+(r()-0.5)*6,y-h*0.6,x+(r()-0.5)*10,y-h);q.stroke();}
 // sparkle: a scatter of tiny bright crystals
 for(let i=0;i<500;i++){const y=1360+r()*(H-1360),x=r()*W;q.fillStyle=`rgba(240,245,255,${0.25+r()*0.4})`;q.fillRect(x,y,1.2,1.2);}
 // footprints: one pair of boots came in from the bottom of the frame, curving onto the step: paired L/R soft hollows
 const Pt=[];const N=24;for(let k=0;k<=N;k++){const u=k/N;const x=lerp(600,STEP[0],Math.pow(u,0.9))+Math.sin(u*3.2)*38,y=lerp(H+20,STEP[1],Math.pow(u,0.75));Pt.push([x,y]);}
 for(let k=1;k<Pt.length;k++){const [x,y]=Pt[k],[px,py]=Pt[k-1];const a=Math.atan2(y-py,x-px),side=k%2?1:-1;const dep=Math.max(0,(y-1500)/(H-1500));const sc=0.8+1.5*dep;
  const nx=-Math.sin(a)*5*sc*side,ny=Math.cos(a)*5*sc*side*0.4;
  q.save();q.translate(x+nx,y+ny);q.rotate(a);q.scale(sc,sc*0.5);
  const fg=q.createRadialGradient(0,-1,0,0,0,10);fg.addColorStop(0,'rgba(66,74,104,.42)');fg.addColorStop(0.7,'rgba(66,74,104,.22)');fg.addColorStop(1,'rgba(66,74,104,0)');q.fillStyle=fg;ell(q,0,0,10,5.5);q.fill();
  q.fillStyle='rgba(225,232,246,.35)';ell(q,1,5,7,1.3);q.fill();q.restore();}}
// snow on the cabin: painted over the finished cabin layer
function drift(q,x0,y0,x1,y1,th,seed){const r=rng(seed);const n=Math.max(8,Math.hypot(x1-x0,y1-y0)/8|0);const ph=r()*6;
 const top=[];for(let k=0;k<=n;k++){const u=k/n,taper=Math.min(1,u*5,(1-u)*5);top.push([lerp(x0,x1,u),lerp(y0,y1,u)-th*taper*(0.75+0.25*Math.sin(u*9+ph))]);}
 const g=q.createLinearGradient(0,Math.min(y0,y1)-th,0,Math.max(y0,y1)+6);g.addColorStop(0,'#b4bdd3');g.addColorStop(0.7,'#97a0ba');g.addColorStop(1,'#8c95b0');q.fillStyle=g;
 q.beginPath();top.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.lineTo(x1,y1+8);q.lineTo(x0,y0+8);q.closePath();q.fill();
 q.strokeStyle='rgba(225,232,246,.35)';q.lineWidth=2;q.beginPath();top.forEach((p,i)=>i?q.lineTo(p[0],p[1]+1):q.moveTo(p[0],p[1]+1));q.stroke();}
function cabinSnow(q){const r=rng(808);
 const roofSnow=(pts,seed)=>{q.save();poly(q,pts);q.clip();const ys=pts.map(p=>p[1]);const y0=Math.min(...ys),y1=Math.max(...ys);
  const g=q.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#c3cbde');g.addColorStop(0.6,'#aeb8d0');g.addColorStop(1,'#98a3bf');q.fillStyle=g;q.fillRect(0,y0-10,W,y1-y0+20);
  // soft wind-ripples across the slope (blurred, low contrast), never hard bands
  const rr=rng(seed);q.filter='blur(14px)';for(let i=0;i<5;i++){const x=lerp(pts[0][0],pts[1][0],rr()),y=lerp(y0,y1,rr());q.fillStyle='rgba(225,232,246,.10)';ell(q,x,y,120+rr()*90,16+rr()*10);q.fill();}q.filter='none';
  q.restore();};
 // main roof: the whole front slope is white; a thick lip hangs over the front eave; snow rides up over the ridge
 const rf=[P(90,-25,336),P(792,-25,336),P(792,170,600),P(90,170,600)];roofSnow(rf,1);
 {const a=P(86,170,600),b=P(796,170,600);q.strokeStyle='#c9d1e3';q.lineWidth=12;q.lineCap='round';q.beginPath();q.moveTo(a[0],a[1]-2);q.lineTo(b[0],b[1]-2);q.stroke();q.strokeStyle='rgba(235,240,250,.6)';q.lineWidth=4;q.beginPath();q.moveTo(a[0],a[1]-5);q.lineTo(b[0],b[1]-5);q.stroke();}
 {const a=P(84,-25,336),b=P(798,-25,336);snowCap(q,a[0],a[1]+6,b[0],b[1]+6,16,4);
  // icicles of uneven length along the eave (tapered, glassy, a warm glint where the window light reaches them)
  for(let x=a[0]+14;x<b[0]-8;x+=14+r()*26){if(r()<0.35)continue;const L=6+r()*r()*34,y=a[1]+10;const near=x>WIN.x-20&&x<WIN.x+WIN.w+20;
   const g=q.createLinearGradient(0,y,0,y+L);g.addColorStop(0,near?'rgba(255,226,190,.85)':'rgba(214,224,242,.85)');g.addColorStop(1,'rgba(214,224,242,.05)');q.fillStyle=g;q.beginPath();q.moveTo(x-2.6,y);q.lineTo(x+2.6,y);q.lineTo(x+0.3,y+L);q.closePath();q.fill();}}
 // gable: snow riding along the barge board on both slopes
 {const bA=P(792,-25,336),bP=P(792,170,600),bB=P(792,365,336);snowCap(q,bA[0]+2,bA[1]+2,bP[0],bP[1]+2,9,5);snowCap(q,bP[0],bP[1]+2,bB[0]-2,bB[1]+2,8,6);}
 // porch roof: white, with its own lip at the front edge
 const pr=[P(100,0,312),P(445,0,312),P(445,-118,252),P(100,-118,252)];roofSnow(pr,2);
 {const a=P(96,-118,252),b=P(449,-118,252);snowCap(q,a[0],a[1]+4,b[0],b[1]+4,12,7);}
 // chimney: thick cap on the slab; the clay pot stands out of it
 {const {x0,x1,d0,d1,top}=CHIM;const c0=P(x0-6,d0-8,top),c1=P(x1+6,d0-8,top);snowCap(q,c0[0],c0[1]+1,c1[0]+10,c1[1]-8,11,8);
  const m=P((x0+x1)/2,(d0+d1)/2,top);q.fillStyle='#5a3a2c';q.fillRect(m[0]-11,m[1]-24,22,14);q.fillStyle='#3e271d';q.fillRect(m[0]+4,m[1]-24,7,14);q.fillStyle='#120c0a';ell(q,m[0],m[1]-24,11,3.5);q.fill();
  q.fillStyle='rgba(215,222,238,.9)';q.beginPath();q.ellipse(m[0]-8,m[1]-24,4,1.6,0,0,6.28);q.fill();}
 // window: snow on the sill and on the drip cap
 snowCap(q,WIN.x-20,WIN.y+WIN.h+4,WIN.x+WIN.w+20,WIN.y+WIN.h+4,8,9);snowCap(q,WIN.x-18,WIN.y-16,WIN.x+WIN.w+18,WIN.y-16,6,10);
 // the porch deck's open front edge catches a little blown snow; the step is snowed over with the prints pressed into it
 
 {const X0=312,X1=428,a=P(X0,-115,9),b=P(X1,-115,9),c=P(X1,-152,9),e=P(X0,-152,9);q.fillStyle='#a9b3cb';poly(q,[[a[0]-2,a[1]-3],[b[0]+2,b[1]-3],[c[0]+2,c[1]-3],[e[0]-2,e[1]-3]]);q.fill();
  {const g=q.createLinearGradient(0,e[1],0,P(X0,-152,0)[1]);g.addColorStop(0,'#6a4a32');g.addColorStop(1,'#3a2818');q.fillStyle=g;poly(q,[[e[0],e[1]+1],[c[0],c[1]+1],P(X1,-152,-4),P(X0,-152,-4)]);q.fill();}
  snowCap(q,e[0]-2,e[1]-2,c[0]+2,c[1]-2,6,12);
  {const f0=P(X0,-152,0),f1=P(X1,-152,0);q.save();q.filter='blur(4px)';q.fillStyle='rgba(30,36,60,.35)';q.fillRect(f0[0]-6,f0[1]-2,f1[0]-f0[0]+14,8);q.restore();drift(q,f0[0]-14,f0[1]+6,f1[0]+14,f1[1]+6,5,17);}
  for(const [u,v] of [[0.35,0.45],[0.62,0.7]]){const px=lerp(e[0],b[0],u),py=lerp(c[1],a[1],v);q.fillStyle='rgba(60,68,96,.16)';ell(q,px,py,10,3);q.fill();}
  const lg=q.createLinearGradient(e[0],0,c[0],0);lg.addColorStop(0,'rgba(255,180,100,.06)');lg.addColorStop(1,'rgba(255,180,100,.22)');q.fillStyle=lg;poly(q,[a,b,c,e]);q.fill();}
 // drifts banked against the foot of the walls (soft, uneven) so the cabin sits in the snow
 drift(q,440,G0+12,780,G0+12,30,13);{const p0=P(778,-8,0),p1=P(778,330,0);drift(q,p0[0],p0[1]+12,p1[0],p1[1]+12,24,14);}drift(q,24,P(100,-118,0)[1]+12,250,P(250,-118,0)[1]+12,16,15);
 // woodpile top is under the porch roof: dry. A dusting on the porch posts' feet only.
}
// ---- animated additions ----
// the little christmas tree in the corner of the room (where the floor lamp was): drooping tiers over a dark cone,
// warm bulbs twinkling in whole cycles per LOOP, a gold star on top, its glow on the logs behind
function xtree(t,cx,base,top){const h=base-top,r=rng(55);
 const gl=X.createRadialGradient(cx,base-h*0.5,4,cx,base-h*0.5,120);gl.addColorStop(0,'rgba(255,200,120,.32)');gl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=gl;X.fillRect(cx-120,top-70,240,h+120);
 // pot
 X.fillStyle='#7a3a2a';X.beginPath();X.moveTo(cx-9,base-12);X.lineTo(cx+9,base-12);X.lineTo(cx+7,base);X.lineTo(cx-7,base);X.closePath();X.fill();X.fillStyle='#93503a';X.fillRect(cx-10,base-14,20,4);
 X.fillStyle='#1a2a1c';X.beginPath();X.moveTo(cx,top);X.lineTo(cx+17,base-14);X.lineTo(cx-17,base-14);X.closePath();X.fill();
 const n=5;for(let k=0;k<n;k++){const u=k/(n-1),y=top+6+u*(h-26),w=4+u*20;X.fillStyle=['#1f4a2c','#245433','#2c5e38'][k%3];
  X.beginPath();X.moveTo(cx-w,y+8);X.quadraticCurveTo(cx,y-4,cx+w,y+8);for(let x=w;x>=-w;x-=3){X.lineTo(cx+x,y+9+(Math.abs(x)%2?2:0)+r()*1.5);}X.closePath();X.fill();}
 const C=['255,214,140','255,120,110','140,220,150','255,200,90','150,190,255'];
 for(let i=0;i<16;i++){const u=0.12+0.85*(i/15),y=top+u*(h-18),w=(4+u*17)*0.85,x=cx+((i*0.618)%1*2-1)*w;const c=C[i%5],tw=0.6+0.4*Math.sin(WK(1+(i%3))*t+i*1.7);
  const g=X.createRadialGradient(x,y,0,x,y,6);g.addColorStop(0,`rgba(${c},${0.7*tw})`);g.addColorStop(1,`rgba(${c},0)`);X.fillStyle=g;X.fillRect(x-6,y-6,12,12);X.fillStyle=`rgba(${c},1)`;X.beginPath();X.arc(x,y,1.2,0,6.28);X.fill();}
 X.fillStyle='#ffd166';X.save();X.translate(cx,top-1);X.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?2.4:5.6;X.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}X.closePath();X.fill();X.restore();
 const sg=X.createRadialGradient(cx,top-1,0,cx,top-1,14);sg.addColorStop(0,'rgba(255,220,140,.5)');sg.addColorStop(1,'rgba(255,220,140,0)');X.fillStyle=sg;X.fillRect(cx-14,top-15,28,28);}
// string lights on the porch beam and along the main eave, each string hung from a hook at both ends
function bulbs(t,pts,seed){const r=rng(seed);const C=['255,214,140','255,214,140','255,120,110','140,220,150','255,200,90'];
 X.strokeStyle='rgba(18,16,16,.9)';X.lineWidth=1.5;X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();
 pts.forEach((p,i)=>{if(i%2)return;const c=C[(r()*C.length)|0],k=1+((r()*3)|0),ph=r()*6.28;const tw=0.7+0.3*Math.sin(WK(k)*t+ph);
  const g=X.createRadialGradient(p[0],p[1]+4,0,p[0],p[1]+4,18);g.addColorStop(0,`rgba(${c},${0.45*tw})`);g.addColorStop(1,`rgba(${c},0)`);X.fillStyle=g;X.fillRect(p[0]-18,p[1]-14,36,36);
  X.fillStyle=`rgba(${c},${0.85+0.15*tw})`;ell(X,p[0],p[1]+4,2.6,3.8);X.fill();X.fillStyle='rgba(255,255,255,.6)';ell(X,p[0]-0.6,p[1]+2.6,0.9,1.3);X.fill();});}
function porchLights(t){const f0=P(100,-118,252),f1=P(445,-118,252);const y0=f0[1]+16;
 const a=[];for(let i=0;i<=56;i++){const u=i/56,x=lerp(f0[0]+8,f1[0]-2,u),s2=(u*4)%1;a.push([x,y0+Math.sin(s2*Math.PI)*12]);}bulbs(t,a,4);
 const e0=P(470,-25,336),e1=P(780,-25,336);const b=[];for(let i=0;i<=52;i++){const u=i/52,x=lerp(e0[0],e1[0],u),s2=(u*3)%1;b.push([x,e0[1]+14+Math.sin(s2*Math.PI)*12]);}bulbs(t,b,9);
 for(const [x,y] of [[f0[0]+8,y0],[f1[0]-2,y0],[e0[0],e0[1]+14],[e1[0],e1[1]+14]]){X.fillStyle='#1e1a18';ell(X,x,y-1,3,3);X.fill();}}
// a wreath on the door, below the lit pane, hung on a ribbon from a nail at the top of the door
function wreath(t){const cx=300,cy=G0-240+138;X.save();X.translate(cx,cy);X.scale(0.6,0.6);X.translate(-cx,-cy);
 X.strokeStyle='#8e1a20';X.lineWidth=4;X.beginPath();X.moveTo(cx,cy-34);X.lineTo(cx,cy-82);X.stroke();X.fillStyle='#16130f';ell(X,cx,cy-84,3.5,3.5);X.fill();
 X.fillStyle='rgba(0,0,0,.35)';ell(X,cx+4,cy+5,40,40);X.fill();
 const r=rng(33);for(let i=0;i<80;i++){const a=r()*6.28,rr2=26+r()*10;X.fillStyle=['#1f4a2c','#2c5e38','#3a7046'][i%3];X.save();X.translate(cx+Math.cos(a)*rr2,cy+Math.sin(a)*rr2);X.rotate(a+1.57+(r()-0.5));ell(X,0,0,10,4);X.fill();X.restore();}
 for(let i=0;i<9;i++){const a=i/9*6.28+0.3;X.fillStyle='#c42a30';ell(X,cx+Math.cos(a)*30,cy+Math.sin(a)*30,4.2,4.2);X.fill();X.fillStyle='rgba(255,255,255,.5)';ell(X,cx+Math.cos(a)*30-1.2,cy+Math.sin(a)*30-1.2,1.2,1.2);X.fill();}
 X.fillStyle='rgba(255,190,120,.18)';ell(X,cx+18,cy-4,22,30);X.fill();   // the lantern's warm light on its right side
 X.fillStyle='#b3242b';X.beginPath();X.moveTo(cx,cy+34);X.quadraticCurveTo(cx-24,cy+20,cx-20,cy+42);X.closePath();X.fill();X.beginPath();X.moveTo(cx,cy+34);X.quadraticCurveTo(cx+24,cy+20,cx+20,cy+42);X.closePath();X.fill();
 X.beginPath();X.moveTo(cx-3,cy+36);X.lineTo(cx-12,cy+58);X.lineTo(cx-4,cy+54);X.closePath();X.fill();X.beginPath();X.moveTo(cx+3,cy+36);X.lineTo(cx+12,cy+58);X.lineTo(cx+4,cy+54);X.closePath();X.fill();
 X.fillStyle='#8e1a20';ell(X,cx,cy+35,5,4);X.fill();X.restore();}
// falling snow: layer 0 far (behind the cabin), 1 mid, 2 near (big soft flakes); radial-gradient dots, no per-flake blur.
// every flake falls a whole number of frame-heights per LOOP, so the 20 s loop is seamless
var SN=null;
function snowFall(t,layer){if(!SN){const r=rng(3);SN=[];for(let i=0;i<900;i++)SN.push({x:r(),y:r(),z:r(),p:r()*6.28});}
 const LS=[[WIN.x+WIN.w/2,WIN.y+WIN.h/2,300,0.9],[LANT.x,LANT.y+50,200,1]];
 for(const d of SN){const L=d.z<0.45?0:(d.z<0.96?1:2);if(L!==layer)continue;const n=L==0?1:(L==1?2:3);const span=H+120;
  const y=((d.y*span+t*span*n/LOOP)%span)-60;const G=gust(t);const sw=Math.sin(WK(n*2)*t+d.p)*(8+d.z*16)+Math.sin(WK(1)*t+d.p*2)*12-G*10*d.z;const x=((d.x*(W+120)+sw)%(W+120)+W+120)%(W+120)-60;
  const rad=L==2?4.2+d.z*2.0:0.8+d.z*2.4,a=L==2?0.9:0.3+d.z*0.5;let warm=0;if(L>0)for(const [lx,ly,lr,k] of LS){const dd=Math.hypot(x-lx,y-ly);if(dd<lr)warm=Math.max(warm,(1-dd/lr)*k);}
  const col=`${255},${(242-34*warm)|0},${(250-90*warm)|0}`;
  if(L==2){const g=X.createRadialGradient(x,y,0,x,y,rad*1.8);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);X.fillStyle=g;X.fillRect(x-rad*1.8,y-rad*1.8,rad*3.6,rad*3.6);}
  else{X.fillStyle=`rgba(${col},${a})`;ell(X,x,y,rad,rad*0.9);X.fill();}}}

draw(0);
