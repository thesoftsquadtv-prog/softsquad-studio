// Soft Ambience — "windy autumn night". One cottage under a big maple; the wind pulls leaves across the garden,
// the garden gate swings and taps, the porch lantern sways, smoke streams from the chimney and a cat in the attic
// window watches the leaves go by. Every motion repeats every LOOP (20 s) so the video loops seamlessly.
// Needs lib.js (cottage/house painting helpers shared with the rainy lane).
const HT={tx:120,ty:1440,s:0.85};
const MOON={x:250,y:560,r:44};
const P2=Math.PI*2;
let SKY=null,STATIC=null;
function sky(q){
 const g=q.createLinearGradient(0,0,0,1150);g.addColorStop(0,'#0b1024');g.addColorStop(0.5,'#1d2140');g.addColorStop(0.85,'#3a2f44');g.addColorStop(1,'#4a3640');q.fillStyle=g;q.fillRect(0,0,W,1200);
 const r=rng(11);for(let i=0;i<160;i++){q.globalAlpha=0.25+r()*0.6;q.fillStyle='#e6ecff';q.beginPath();q.arc(r()*W,r()*700,r()*1.4+0.3,0,6.28);q.fill();}q.globalAlpha=1;
 const halo=q.createRadialGradient(MOON.x,MOON.y,MOON.r*0.8,MOON.x,MOON.y,MOON.r*7);halo.addColorStop(0,'rgba(255,236,200,.35)');halo.addColorStop(0.3,'rgba(240,220,200,.10)');halo.addColorStop(1,'rgba(240,220,200,0)');q.fillStyle=halo;q.fillRect(0,0,W,1200);
 const mg=q.createRadialGradient(MOON.x-12,MOON.y-12,4,MOON.x,MOON.y,MOON.r);mg.addColorStop(0,'#fffaf0');mg.addColorStop(1,'#efe0c4');q.fillStyle=mg;q.beginPath();q.arc(MOON.x,MOON.y,MOON.r,0,6.28);q.fill();
 q.fillStyle='rgba(180,160,140,.25)';for(const [dx,dy,rr] of [[-14,-6,9],[10,12,7],[14,-14,5],[-6,16,4]]){q.beginPath();q.arc(MOON.x+dx,MOON.y+dy,rr,0,6.28);q.fill();}}
function land(q){
 const r=rng(4);
 // far hills with a dark line of trees and two lit farm windows
 [['#2a2638',1030,0.5],['#221f2e',1085,0.8]].forEach(([col,base,sc],li)=>{q.fillStyle=col;q.beginPath();q.moveTo(0,H);for(let x=0;x<=W;x+=14){const th=(Math.sin(x*0.011+li*2)*0.5+0.5)*60*sc+r()*30*sc;q.lineTo(x,base-th);q.lineTo(x+7,base-th-18*sc-r()*20*sc);}q.lineTo(W,H);q.fill();});
 for(const [x,y] of [[640,1034],[700,1040]]){q.fillStyle='#ffc77a';q.fillRect(x,y,5,5);const g=q.createRadialGradient(x+2,y+2,1,x+2,y+2,18);g.addColorStop(0,'rgba(255,180,100,.4)');g.addColorStop(1,'rgba(255,180,100,0)');q.fillStyle=g;q.fillRect(x-18,y-18,40,40);}
 // garden: dark autumn grass with fallen leaves, moonlit on top
 const gg=q.createLinearGradient(0,1090,0,H);gg.addColorStop(0,'#2b2a22');gg.addColorStop(1,'#14140f');q.fillStyle=gg;q.fillRect(0,1088,W,H-1088);
 for(let i=0;i<2600;i++){const y=1090+Math.pow(r(),0.9)*(H-1090),k=(y-1090)/(H-1090),x=r()*W;q.strokeStyle=r()>0.5?'rgba(90,96,60,.5)':'rgba(50,56,36,.6)';q.lineWidth=1+k*1.4;q.beginPath();q.moveTo(x,y);q.lineTo(x+(r()-0.5)*6,y-(4+r()*9)*(0.4+k));q.stroke();}
 for(let i=0;i<520;i++){const y=1100+Math.pow(r(),0.7)*(H-1100),k=(y-1090)/(H-1090);let x=r()*W;if(r()<0.5)x=lerp(x,880+Math.sin(i)*120,0.6);leaf(q,x,y,(5+r()*5)*(0.5+k),r()*6.28,LEAFC[(r()*LEAFC.length)|0],0.35+0.35*r(),0.6);}
 q.fillStyle='rgba(10,8,20,.25)';q.fillRect(0,1100,W,H-1100);
 // leaves heaped against the foot of the maple and along the fence
 for(let i=0;i<260;i++){const x=780+r()*300,y=1560+r()*90;leaf(q,x,y,7+r()*7,r()*6.28,LEAFC[(r()*LEAFC.length)|0],0.7+0.3*r(),0.6);}
 // stepping stones from the gate up to the door
 const L=[[430,1900,1.5],[420,1790,1.3],[410,1700,1.15],[400,1620,1.0],[392,1545,0.9],[386,1480,0.8]];
 for(const [x,y,s] of L){q.fillStyle='#4b4740';q.beginPath();q.ellipse(x,y,50*s,15*s,0,0,6.28);q.fill();q.fillStyle='rgba(220,210,190,.10)';q.beginPath();q.ellipse(x+4*s,y-3*s,38*s,7*s,0,0,6.28);q.fill();
  q.fillStyle='rgba(255,180,110,.10)';q.beginPath();q.ellipse(x-8*s,y-4*s,24*s,5*s,0,0,6.28);q.fill();leaf(q,x+20*s,y,8*s,1,LEAFC[1],0.9,0.6);}}
const LEAFC=['#d9622b','#e8913a','#c2412d','#f0b84a','#a8462a','#e07a3c'];
function leaf(q,x,y,s,a,col,alpha,shade){q.save();q.translate(x,y);q.rotate(a);q.globalAlpha=alpha;q.fillStyle=col;
 q.beginPath();q.moveTo(0,-s);q.quadraticCurveTo(s*0.9,-s*0.5,s*0.55,s*0.2);q.quadraticCurveTo(s*0.3,s*0.6,0,s);q.quadraticCurveTo(-s*0.3,s*0.6,-s*0.55,s*0.2);q.quadraticCurveTo(-s*0.9,-s*0.5,0,-s);q.fill();
 if(shade){q.fillStyle=`rgba(40,20,10,${shade*0.5})`;q.beginPath();q.moveTo(0,-s);q.quadraticCurveTo(-s*0.9,-s*0.5,-s*0.55,s*0.2);q.quadraticCurveTo(-s*0.3,s*0.6,0,s);q.fill();}
 q.strokeStyle='rgba(60,25,10,.45)';q.lineWidth=Math.max(0.6,s*0.08);q.beginPath();q.moveTo(0,-s*0.9);q.lineTo(0,s*1.25);q.stroke();q.restore();}
function porchBits(q){
 const {tx,ty,s}=HT;
 // pumpkins on the step either side of the door
 for(const [x,y,r,col] of [[tx+175*s,ty+6,26,'#d9772e'],[tx+150*s,ty+10,18,'#e8933c'],[tx+455*s,ty+6,22,'#c9692a']]){
  q.fillStyle='rgba(0,0,0,.35)';q.beginPath();q.ellipse(x,y+r*0.5,r*1.2,r*0.3,0,0,6.28);q.fill();
  for(let k=-2;k<=2;k++){const g=q.createLinearGradient(x+k*r*0.38-r*0.3,0,x+k*r*0.38+r*0.3,0);g.addColorStop(0,shade(col,0.7));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,0.75));q.fillStyle=g;q.beginPath();q.ellipse(x+k*r*0.36,y,r*0.42,r*0.78,0,0,6.28);q.fill();}
  q.fillStyle='#4a5a2e';q.fillRect(x-2,y-r*0.95,5,r*0.35);q.fillStyle='rgba(255,220,160,.18)';q.beginPath();q.ellipse(x-r*0.3,y-r*0.3,r*0.3,r*0.45,0.3,0,6.28);q.fill();}
 // wreath of dried leaves on the door
 const dx=tx+(240+60)*s,dy=ty-210*s*0.62;for(let k=0;k<22;k++){const a=k/22*6.28;leaf(q,dx+Math.cos(a)*18,dy+Math.sin(a)*18,7,a+1.6,LEAFC[k%LEAFC.length],1,0.4);}
 q.fillStyle='#8a2a26';q.beginPath();q.ellipse(dx,dy+20,6,4,0,0,6.28);q.fill();}
function buildStatic(){
 const SS=S*1.1;const [cs,qs]=off(1584,2816);qs.scale(SS,SS);sky(qs);SKY=cs;
 const [c,q]=off(1584,2816);q.scale(SS,SS);land(q);
 house(q,{w:600,h:400,roofH:280,wall:'#c9b48e',roof:'#7a4a34',seed:57,stone:90,windows:[[50,90,150,140],[400,90,150,140]],door:[240,120,210],dormer:true,chim:0.22,porch:[220,160],sideWin:true},HT.tx,HT.ty,HT.s);
 porchBits(q);
 for(const [lx,ly,rad] of LIGHTS){const g=q.createRadialGradient(lx,ly+rad*0.9,5,lx,ly+rad*0.9,rad*1.6);g.addColorStop(0,'rgba(255,170,90,.16)');g.addColorStop(1,'rgba(255,170,90,0)');q.fillStyle=g;q.fillRect(lx-rad*2,ly,rad*4,rad*2.4);}
 STATIC=c;}
// ---------- animated ----------
function clouds(t){for(let i=0;i<7;i++){const r=rng(i+40);const y=120+r()*700,rx=180+r()*240,ry=30+r()*40,span=W+rx*2+200;const x=((r()*span+t*span/LOOP*(i%2?1:2))%span)-rx-100;
 const near=Math.hypot(x-MOON.x,y-MOON.y)<rx+80;X.save();X.filter='blur(18px)';X.fillStyle=near?'rgba(120,108,130,.55)':'rgba(48,46,72,.6)';X.beginPath();X.ellipse(x,y,rx,ry,0,0,6.28);X.fill();
 X.fillStyle='rgba(255,230,200,.10)';X.beginPath();X.ellipse(x-rx*0.1,y-ry*0.4,rx*0.7,ry*0.4,0,0,6.28);X.fill();X.restore();}}
function glow(t){for(const [x,y,rad,ph] of LIGHTS){const fl=0.82+0.1*Math.sin(WK(40)*t+ph)+0.08*Math.sin(WK(73)*t+ph*2);
 const g=X.createRadialGradient(x,y,3,x,y,rad);g.addColorStop(0,`rgba(255,180,100,${0.3*fl})`);g.addColorStop(1,'rgba(255,180,100,0)');X.fillStyle=g;X.fillRect(x-rad,y-rad,rad*2,rad*2);}}
function smoke(t){const G=gust(t);for(const [cx,cy,s] of CHIMNEYS){for(let i=0;i<18;i++){const p=((t/4+i/18)%1);const sx=cx+p*p*700*s*(0.5+G)+Math.sin(p*9+i)*8,sy=cy-p*150*s;const rr=(10+p*55)*s;
 const g=X.createRadialGradient(sx,sy,0,sx,sy,rr);g.addColorStop(0,`rgba(205,200,210,${(1-p)*0.32})`);g.addColorStop(1,'rgba(205,200,210,0)');X.fillStyle=g;X.fillRect(sx-rr,sy-rr,rr*2,rr*2);}}}
// porch lantern on an iron bracket, swaying with the gusts
function lantern(t){const {tx,ty,s}=HT;const G=gust(t);const lx=tx+(240+120+40)*s,ly=ty-(210+30)*s;
 const a=(0.15+0.22*G)*Math.sin(WK(9)*t)+0.05*Math.sin(WK(23)*t);
 X.fillStyle='#22160f';X.fillRect(lx-4,ly-6,8,30);X.fillRect(lx-4,ly-6,40,7);
 X.save();X.translate(lx+32,ly);X.rotate(a);
 const gl=X.createRadialGradient(0,40,4,0,40,170);gl.addColorStop(0,'rgba(255,200,120,.5)');gl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=gl;X.fillRect(-170,-130,340,340);
 X.strokeStyle='#22160f';X.lineWidth=3;X.beginPath();X.moveTo(0,0);X.lineTo(0,16);X.stroke();
 X.fillStyle='#22160f';X.beginPath();X.moveTo(-15,24);X.lineTo(15,24);X.lineTo(9,15);X.lineTo(-9,15);X.fill();
 const fl=0.9+0.1*Math.sin(WK(61)*t);X.fillStyle=`rgba(255,${205+20*fl|0},140,1)`;X.beginPath();X.roundRect(-12,25,24,34,4);X.fill();
 X.fillStyle='#fff3d0';X.beginPath();X.ellipse(0,44,3,6*fl,0,0,6.28);X.fill();
 X.strokeStyle='#22160f';X.lineWidth=3;X.strokeRect(-12,25,24,34);X.beginPath();X.moveTo(0,25);X.lineTo(0,59);X.stroke();X.fillRect(-15,58,30,5);X.restore();}
// cat in the round attic window, tail swishing as it watches the leaves
function cat(t){const {tx,ty,s}=HT;const cx=tx+300*s,by=ty-466*s;   // dormer window: round, 64x58, centred (300,-495) in house coords
 X.save();X.beginPath();X.ellipse(cx,by-29*s,31*s,28*s,0,0,6.28);X.clip();
 const sw=Math.sin(WK(5)*t)*0.6+Math.sin(WK(11)*t)*0.25,look=Math.sin(WK(2)*t)*2.5;
 X.fillStyle='#2a1c1a';
 X.beginPath();X.ellipse(cx,by-8*s,13*s,16*s,0,0,6.28);X.fill();                 // body
 X.beginPath();X.arc(cx+look*s*0.3,by-28*s,8.5*s,0,6.28);X.fill();              // head
 for(const d of [-1,1]){X.beginPath();X.moveTo(cx+look*s*0.3+d*7*s,by-33*s);X.lineTo(cx+look*s*0.3+d*4*s,by-41*s);X.lineTo(cx+look*s*0.3+d*1*s,by-35*s);X.fill();}
 X.strokeStyle='#2a1c1a';X.lineWidth=3.2*s;X.lineCap='round';X.beginPath();X.moveTo(cx+10*s,by+4*s);X.quadraticCurveTo(cx+22*s,by+2*s,cx+20*s+sw*8*s,by-12*s+Math.abs(sw)*3*s);X.stroke();
 X.restore();}
// the garden gate on its hinge, swinging and tapping the post with the gusts
const FENCE={y:1690,gx:385,gw:110};
function fence(t){const y=FENCE.y;
 const pick=(x,h,k)=>{X.fillStyle='#d9cfbd';X.beginPath();X.moveTo(x,y-h);X.lineTo(x+8*k,y-h-12*k);X.lineTo(x+16*k,y-h);X.lineTo(x+16*k,y);X.lineTo(x,y);X.fill();X.fillStyle='rgba(0,0,0,.28)';X.fillRect(x+11*k,y-h,5*k,h);};
 X.fillStyle='rgba(0,0,0,.3)';X.fillRect(0,y-2,W,8);
 for(const [x0,x1] of [[-10,FENCE.gx-14],[FENCE.gx+FENCE.gw+14,W+10]]){X.strokeStyle='#bfb3a0';X.lineWidth=7;X.beginPath();X.moveTo(x0,y-58);X.lineTo(x1,y-58);X.moveTo(x0,y-24);X.lineTo(x1,y-24);X.stroke();for(let x=x0+6;x<x1-10;x+=34)pick(x,88,1.1);}
 // gate posts
 for(const x of [FENCE.gx-14,FENCE.gx+FENCE.gw]){X.fillStyle='#cfc3ae';X.fillRect(x,y-108,16,110);X.fillStyle='#e9dfcd';X.beginPath();X.arc(x+8,y-110,9,0,6.28);X.fill();X.fillStyle='rgba(0,0,0,.25)';X.fillRect(x+11,y-104,5,106);}
 // gate: hinged on the left post, opens away from us; foreshortened by cos(angle)
 const G=gust(t);const op=Math.max(0,0.25+0.45*G*(0.6+0.4*Math.sin(WK(4)*t)));const c=Math.cos(op*1.2);
 X.save();X.translate(FENCE.gx+2,0);X.scale(c,1);
 X.strokeStyle='#bfb3a0';X.lineWidth=7;X.beginPath();X.moveTo(0,y-60);X.lineTo(FENCE.gw-2,y-60);X.moveTo(0,y-26);X.lineTo(FENCE.gw-2,y-26);X.stroke();X.strokeStyle='#a99d8a';X.lineWidth=5;X.beginPath();X.moveTo(6,y-28);X.lineTo(FENCE.gw-8,y-58);X.stroke();
 for(let x=4;x<FENCE.gw-12;x+=34){pick(x,80,1.05);}X.restore();
 X.fillStyle='#3a3a3a';X.fillRect(FENCE.gx-4,y-70,10,6);X.fillRect(FENCE.gx-4,y-34,10,6);}   // hinges
// big maple at the right, swaying; its canopy reaches over the garden
const TREE={x:985,y:1600};
const clamp01=v=>Math.max(0,Math.min(1,v));
function maple(t){const G=gust(t);const sw=(Math.sin(WK(3)*t)*0.6+Math.sin(WK(7)*t+1)*0.3)*G;
 X.save();X.translate(TREE.x,TREE.y);
 const tg=X.createLinearGradient(-60,0,70,0);tg.addColorStop(0,'#3a2a22');tg.addColorStop(0.5,'#241a15');tg.addColorStop(1,'#140e0b');X.fillStyle=tg;
 X.beginPath();X.moveTo(-70,0);X.quadraticCurveTo(-30,-300,-40+sw*12,-640);X.lineTo(30+sw*12,-640);X.quadraticCurveTo(30,-300,80,0);X.fill();
 X.strokeStyle='#241a15';X.lineCap='round';for(const [x1,y1,x2,y2,w] of [[-20,-420,-260,-640,26],[0,-560,-180,-860,20],[10,-520,160,-820,20],[-10,-640,-60,-960,16]]){X.lineWidth=w;X.beginPath();X.moveTo(x1+sw*8,y1);X.quadraticCurveTo((x1+x2)/2+sw*16,(y1+y2)/2,x2+sw*30,y2);X.stroke();}
 X.strokeStyle='rgba(255,190,130,.15)';X.lineWidth=6;X.beginPath();X.moveTo(-64,-10);X.quadraticCurveTo(-28,-300,-38+sw*12,-630);X.stroke();   // window-glow on the trunk
 // canopy: a dark core, then hundreds of small leaf clusters, moonlit from the upper left and warmed by the windows below
 const q=rng(8);const CL=[];for(let k=0;k<520;k++){const a=q()*6.28,rr=Math.pow(q(),0.6);const ex=-90+Math.cos(a)*rr*300,ey=-830+Math.sin(a)*rr*250*(Math.sin(a)>0?0.9:1);CL.push([ex,ey,10+q()*20,q(),q()]);}
 CL.sort((p,r2)=>p[1]-r2[1]);
 X.fillStyle='#3a1a14';X.beginPath();X.ellipse(-90+sw*25,-830,280,220,0,0,6.28);X.fill();
 for(const [ex,ey,br,u,v] of CL){const bend=sw*(30+(ey+1080)*0.05)*(1+u*0.4);const bx=ex+bend+Math.sin(WK(5)*t+u*20)*3*G,by=ey+Math.cos(WK(4)*t+v*20)*2*G;
  const lit=clamp01((-(ex+90)*0.6-(ey+830))/320+0.5);const warm=clamp01((ey+700)/160);
  const base=['#6e2a19','#86381f','#a04f25','#752d1a','#ab6c2c','#5e2316'][(u*6)|0];
  X.fillStyle=base;X.beginPath();X.ellipse(bx,by,br*1.15,br*0.9,v*3,0,6.28);X.fill();
  X.fillStyle=`rgba(225,225,245,${0.13*lit})`;X.beginPath();X.ellipse(bx-br*0.3,by-br*0.3,br*0.6,br*0.4,v*3,0,6.28);X.fill();
  X.fillStyle=`rgba(255,170,90,${0.18*warm})`;X.beginPath();X.ellipse(bx,by+br*0.3,br*0.7,br*0.4,0,0,6.28);X.fill();
  X.fillStyle='rgba(30,10,8,.22)';X.beginPath();X.ellipse(bx+br*0.4,by+br*0.4,br*0.5,br*0.3,0,0,6.28);X.fill();}
 // a few leaves standing out at the edge of the canopy
 for(let k=0;k<70;k++){const a=q()*6.28;const ex=-90+Math.cos(a)*(290+q()*30),ey=-830+Math.sin(a)*(240+q()*25);leaf(X,ex+sw*40,ey,6+q()*4,a+q(),LEAFC[k%LEAFC.length],0.9,0.3);}
 X.restore();}
// leaves blowing across the garden: each crosses the frame a whole number of times per loop, tumbling as it goes
const R0=rng(91);const FLY=[...Array(110)].map(()=>({x:R0(),y:R0(),z:R0(),n:1+((R0()*3)|0),ph:R0()*6.28,c:LEAFC[(R0()*LEAFC.length)|0],sp:1+((R0()*3)|0)}));
function leaves(t,front){const G=gust(t);for(const f of FLY){const isFront=f.z>0.85;if(isFront!==front)continue;const span=W+300;
 const x=((f.x*span+t*span*f.n/LOOP)%span)-150;const y0=180+f.y*1500;const y=y0+Math.sin(WK(f.n*2)*t+f.ph)*60*(0.5+G)+Math.sin(WK(7)*t+f.ph*3)*12;
 const s=(4+f.z*9)*(front?2.4:1);const a=WK(f.sp*3)*t+f.ph;const flip=Math.cos(WK(f.sp*4)*t+f.ph);
 X.save();if(front)X.filter='blur(3px)';X.translate(x,y);X.scale(1,Math.max(0.15,Math.abs(flip)));leaf(X,0,0,s,a,f.c,0.85,flip<0?0.5:0.15);X.restore();}}
// leaves skittering along the ground in the gusts
const R1=rng(23);const SKIT=[...Array(36)].map(()=>({x:R1(),y:1720+R1()*170,n:1+((R1()*2)|0),ph:R1()*6.28,c:LEAFC[(R1()*LEAFC.length)|0]}));
function skitter(t){for(const f of SKIT){const span=W+200;const x=((f.x*span+t*span*f.n/LOOP)%span)-100;const hop=Math.max(0,Math.sin(WK(f.n*6)*t+f.ph))*14;leaf(X,x,f.y-hop,9,WK(f.n*5)*t+f.ph,f.c,0.95,0.4);}}
function grade(t){const v=X.createRadialGradient(W/2,H*0.55,H*0.3,W/2,H*0.55,H*0.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(5,3,12,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(255,160,90,.14)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.045;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function caption(t){if(t>6.4)return;const a=Math.min(1,0.45+t/1.0)*Math.max(0,Math.min(1,(6.2-t)/1.5));
 X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*6,y=260;const bl=Math.max(0,(t-4.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
 X.font="italic 500 72px Corm, serif";X.shadowColor='rgba(255,190,120,.6)';X.shadowBlur=28;X.fillStyle='#fbf1e2';
 const C1=(window.CAP||['let the wind','sing you to sleep']);for(let k=0;k<2;k++){X.fillText(C1[0],x,y);X.fillText(C1[1],x,y+84);X.shadowBlur=0;}
 X.filter='none';X.globalAlpha=a*0.6;X.strokeStyle='#fbf1e2';X.lineWidth=1.5;X.beginPath();X.moveTo(x-55,y+140);X.lineTo(x+55,y+140);X.stroke();X.restore();}
window.draw=function(t){if(!STATIC)buildStatic();
 const tc=t-(window.TOFF||0);const z=1.1+0.03*(1-Math.cos(WK(1)*t))/2,Fx=520+20*Math.sin(WK(1)*t),Fy=1200;const ox=S*(Fx-Fx*z),oy=S*(Fy-Fy*z);
 X.setTransform(1,0,0,1,0,0);X.setTransform(z/1.1,0,0,z/1.1,ox,oy);X.drawImage(SKY,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);clouds(t);
 X.setTransform(z/1.1,0,0,z/1.1,ox,oy);X.drawImage(STATIC,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);smoke(t);cat(t);glow(t);lantern(t);leaves(t,false);maple(t);fence(t);skitter(t);leaves(t,true);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(tc);};
draw(0);
