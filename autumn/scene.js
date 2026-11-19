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
 for(const [x,y,s] of L){q.fillStyle='#2e2a25';q.beginPath();q.ellipse(x,y+3*s,52*s,16*s,0,0,6.28);q.fill();q.fillStyle='#5e5850';q.beginPath();q.ellipse(x,y,50*s,14*s,0,0,6.28);q.fill();q.fillStyle='rgba(0,0,0,.18)';for(let j=0;j<5;j++){q.beginPath();q.arc(x+(j-2)*16*s,y+((j*7)%5-2)*2*s,2*s,0,6.28);q.fill();}q.fillStyle='rgba(220,210,190,.10)';q.beginPath();q.ellipse(x+4*s,y-3*s,38*s,7*s,0,0,6.28);q.fill();
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
 for(const [cx,cy] of CHIMNEYS){q.fillStyle='#24262c';q.fillRect(cx-36*HT.s,cy+2*HT.s,72*HT.s,14*HT.s);q.fillStyle='rgba(255,255,255,.08)';q.fillRect(cx-36*HT.s,cy+2*HT.s,72*HT.s,3*HT.s);}
 for(const [lx,ly,rad] of LIGHTS){const g=q.createRadialGradient(lx,ly+rad*0.9,5,lx,ly+rad*0.9,rad*1.6);g.addColorStop(0,'rgba(255,170,90,.16)');g.addColorStop(1,'rgba(255,170,90,0)');q.fillStyle=g;q.fillRect(lx-rad*2,ly,rad*4,rad*2.4);}
 STATIC=c;}
// ---------- animated ----------
function clouds(t){for(let i=0;i<7;i++){const r=rng(i+40);const y=120+r()*700,rx=180+r()*240,ry=30+r()*40,span=W+rx*2+200;const x=((r()*span+t*span/LOOP*(i%2?1:2))%span)-rx-100;
 const near=Math.hypot(x-MOON.x,y-MOON.y)<rx+80;X.save();X.filter='blur(18px)';X.fillStyle=near?'rgba(120,108,130,.55)':'rgba(48,46,72,.6)';X.beginPath();X.ellipse(x,y,rx,ry,0,0,6.28);X.fill();
 X.fillStyle='rgba(255,230,200,.10)';X.beginPath();X.ellipse(x-rx*0.1,y-ry*0.4,rx*0.7,ry*0.4,0,0,6.28);X.fill();X.restore();}}
function glow(t){for(const [x,y,rad,ph] of LIGHTS){const fl=0.82+0.1*Math.sin(WK(40)*t+ph)+0.08*Math.sin(WK(73)*t+ph*2);
 const g=X.createRadialGradient(x,y,3,x,y,rad);g.addColorStop(0,`rgba(255,180,100,${0.3*fl})`);g.addColorStop(1,'rgba(255,180,100,0)');X.fillStyle=g;X.fillRect(x-rad,y-rad,rad*2,rad*2);}}
function smoke(t){const G=gust(t);for(const [cx,cy,s] of CHIMNEYS){for(let i=0;i<44;i++){const p=((t/4+i/44)%1);const sx=cx+p*p*700*s*(0.5+G)+Math.sin(p*9+i)*8,sy=cy-p*150*s;const rr=(16+p*70)*s;
 const g=X.createRadialGradient(sx,sy,0,sx,sy,rr);g.addColorStop(0,`rgba(205,200,210,${(1-p)*0.16})`);g.addColorStop(1,'rgba(205,200,210,0)');X.fillStyle=g;X.fillRect(sx-rr,sy-rr,rr*2,rr*2);}}}
// porch lantern on an iron bracket, swaying with the gusts
function lantern(t){const {tx,ty,s}=HT;const G=gust(t);const lx=tx+345*s,ly=ty-236*s;   // under the porch beam, right of the door
 const a=(0.10+0.16*G)*Math.sin(WK(9)*t)+0.04*Math.sin(WK(23)*t);
 // warm pool on the wall, door and step below
 const pl=X.createRadialGradient(lx,ly+90,10,lx,ly+140,230);pl.addColorStop(0,'rgba(255,190,110,.30)');pl.addColorStop(1,'rgba(255,190,110,0)');X.fillStyle=pl;X.fillRect(lx-240,ly-60,480,420);
 X.fillStyle='#22160f';X.fillRect(lx-7,ly-4,14,6);   // hook on the beam
 X.save();X.translate(lx,ly);X.rotate(a);
 X.strokeStyle='#22160f';X.lineWidth=2.5;for(let k=0;k<5;k++){X.beginPath();X.ellipse(0,5+k*6,2.2,3.4,0,0,6.28);X.stroke();}   // short chain
 X.fillStyle='#22160f';X.beginPath();X.moveTo(-15,40);X.lineTo(15,40);X.lineTo(8,31);X.lineTo(-8,31);X.fill();
 const fl=0.9+0.1*Math.sin(WK(61)*t);X.fillStyle=`rgba(255,${205+20*fl|0},140,1)`;X.beginPath();X.roundRect(-12,41,24,34,4);X.fill();
 X.fillStyle='#fff3d0';X.beginPath();X.ellipse(0,60,3,6*fl,0,0,6.28);X.fill();
 X.strokeStyle='#22160f';X.lineWidth=3;X.strokeRect(-12,41,24,34);X.beginPath();X.moveTo(0,41);X.lineTo(0,75);X.stroke();X.fillRect(-15,74,30,5);
 const gl=X.createRadialGradient(0,58,3,0,58,90);gl.addColorStop(0,'rgba(255,200,120,.45)');gl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=gl;X.fillRect(-90,-32,180,180);
 X.restore();}
// cat in the round attic window, tail swishing as it watches the leaves
function cat(t){const {tx,ty,s}=HT;
 X.save();X.translate(tx,ty);X.scale(s,s);
 X.beginPath();X.ellipse(300,-495,30,27,0,0,6.28);X.save();X.clip();
 const sw=Math.sin(WK(5)*t)*0.6+Math.sin(WK(11)*t)*0.25,look=Math.sin(WK(2)*t)*2.2;
 X.fillStyle='#24181a';X.strokeStyle='#24181a';X.lineCap='round';
 X.beginPath();X.ellipse(300,-474,15,15,0,0,6.28);X.fill();                       // haunches
 X.beginPath();X.ellipse(300+look*0.3,-488,10,12,0,0,6.28);X.fill();               // chest
 const hx=300+look,hy=-504;X.beginPath();X.ellipse(hx,hy,10,9,0,0,6.28);X.fill();   // head
 for(const d of [-1,1]){X.beginPath();X.moveTo(hx+d*9,hy-3);X.lineTo(hx+d*8,hy-17);X.lineTo(hx+d*2,hy-8);X.closePath();X.fill();}   // ears
 X.lineWidth=4.5;X.beginPath();X.moveTo(312,-466);X.quadraticCurveTo(328,-468,326+sw*6,-484-Math.abs(sw)*3);X.stroke();   // tail, swishing
 X.restore();
 // window bars and frame in front of her
 X.strokeStyle='#3a2418';X.lineWidth=4;X.beginPath();X.moveTo(300,-522);X.lineTo(300,-468);X.moveTo(270,-495);X.lineTo(330,-495);X.stroke();
 X.lineWidth=7;X.beginPath();X.ellipse(300,-495,31,28,0,0,6.28);X.stroke();
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
 const G=gust(t);const op=Math.max(0,0.25+0.45*G*(0.6+0.4*Math.sin(WK(4)*t)));const c=Math.cos(0.1+op*1.25);
 X.save();X.translate(FENCE.gx+2,0);X.scale(c,1);
 X.strokeStyle='#bfb3a0';X.lineWidth=7;X.beginPath();X.moveTo(0,y-58);X.lineTo(FENCE.gw-4,y-58);X.moveTo(0,y-24);X.lineTo(FENCE.gw-4,y-24);X.stroke();X.strokeStyle='#a99d8a';X.lineWidth=5;X.beginPath();X.moveTo(6,y-28);X.lineTo(FENCE.gw-8,y-58);X.stroke();
 for(const x of [3,32,61,90]){pick(x,88,1.1);}X.restore();
 X.fillStyle='#3a3a3a';X.fillRect(FENCE.gx-4,y-70,10,6);X.fillRect(FENCE.gx-4,y-34,10,6);}   // hinges
// big maple at the right, swaying; its canopy reaches over the garden
const TREE={x:985,y:1600};
const clamp01=v=>Math.max(0,Math.min(1,v));
// canopy painted once into three depth layers of leaf clumps (with sky gaps), drawn each frame with a little parallax sway
let CAN=null;const CK=1440/1080*1.15,CB={x:-430,y:-1140,w:700,h:660};
function buildCanopy(){CAN=[];const q=rng(8);
 const dark=['#4e1d12','#5e2316','#6a2a18'],mid=['#7a2f1c','#8e3a20','#a04f25','#93421f'],lite=['#b0602a','#c27a30','#b9552a','#cf8c3a'];
 for(let L=0;L<3;L++){const [c,g]=off(CB.w*CK|0,CB.h*CK|0);g.scale(CK,CK);g.translate(-CB.x,-CB.y);
  const N=[150,190,140][L];
  for(let k=0;k<N;k++){const a=q()*6.28,rr=Math.sqrt(q())*(L==2?0.92:1);const cx=-90+Math.cos(a)*rr*300,cy=-830+Math.sin(a)*rr*245;
   if(L>0&&Math.sin(cx*0.031+L)*Math.cos(cy*0.037)>0.55)continue;   // leave gaps where the sky and branches show through
   const lit=clamp01((-(cx+90)*0.6-(cy+830))/300+0.45),warm=clamp01((cy+690)/150);
   const pal=L==0?dark:(lit>0.6&&L==2?lite:mid);const R=14+q()*16;
   for(let j=0;j<8;j++){const an=q()*6.28,d=Math.sqrt(q())*R;const col=pal[(q()*pal.length)|0];
    leaf(g,cx+Math.cos(an)*d,cy+Math.sin(an)*d*0.8,7+q()*5,q()*6.28,col,1,0.25+0.3*(1-lit));}
   
   }
  CAN.push(c);}}
function maple(t){if(!CAN)buildCanopy();const G=gust(t);const sw=(Math.sin(WK(3)*t)*0.6+Math.sin(WK(7)*t+1)*0.3)*G;
 X.save();X.translate(TREE.x,TREE.y);
 X.drawImage(CAN[0],CB.x+sw*16,CB.y,CB.w,CB.h);
 // trunk with a root flare, and limbs reaching up into the crown
 const tg=X.createLinearGradient(-70,0,80,0);tg.addColorStop(0,'#46332a');tg.addColorStop(0.45,'#2a1e18');tg.addColorStop(1,'#140e0b');X.fillStyle=tg;
 X.beginPath();X.moveTo(-120,6);X.quadraticCurveTo(-70,-10,-56,-70);X.quadraticCurveTo(-34,-320,-30+sw*6,-600);X.lineTo(24+sw*6,-600);X.quadraticCurveTo(30,-320,58,-70);X.quadraticCurveTo(80,-10,130,6);X.closePath();X.fill();
 X.strokeStyle='rgba(0,0,0,.35)';X.lineWidth=2;for(const o of [-30,-12,6,22]){X.beginPath();X.moveTo(o*1.4,-20);X.bezierCurveTo(o,-200,o*0.8+4,-380,o*0.6+sw*4,-580);X.stroke();}
 X.strokeStyle='rgba(255,190,130,.16)';X.lineWidth=7;X.beginPath();X.moveTo(-60,-60);X.quadraticCurveTo(-36,-320,-30+sw*6,-590);X.stroke();   // window glow on the trunk
 X.strokeStyle='#2a1e18';X.lineCap='round';
 for(const [x1,y1,cx,cy,x2,y2,w] of [[-8,-580,-80,-680,-210,-760,22],[0,-590,-20,-720,-70,-930,18],[6,-585,60,-680,110,-850,18],[-20,-640,-180,-700,-300,-700,12],[-60,-800,-30,-880,-10,-1000,9],[60,-760,120,-800,170,-760,9]]){
  const k=(-y2-560)/450;X.lineWidth=w;X.beginPath();X.moveTo(x1+sw*6,y1);X.quadraticCurveTo(cx+sw*(10+12*k),cy,x2+sw*(14+16*k),y2);X.stroke();}
 X.drawImage(CAN[1],CB.x+sw*24,CB.y,CB.w,CB.h);
 X.drawImage(CAN[2],CB.x+sw*32,CB.y+Math.abs(sw)*2,CB.w,CB.h);
 X.restore();}
// leaves blowing across the garden: each crosses the frame a whole number of times per loop, tumbling as it goes
const R0=rng(91);const FLY=[...Array(110)].map(()=>({x:R0(),y:R0(),z:R0(),n:1+((R0()*3)|0),ph:R0()*6.28,c:LEAFC[(R0()*LEAFC.length)|0],sp:1+((R0()*3)|0)}));
function leaves(t,front){const G=gust(t);for(const f of FLY){const isFront=f.z>0.85;if(isFront!==front)continue;const span=W+300;
 const x=((f.x*span+t*span*f.n/LOOP)%span)-150;const y0=180+f.y*1500;const y=y0+Math.sin(WK(f.n*2)*t+f.ph)*60*(0.5+G)+Math.sin(WK(7)*t+f.ph*3)*12;
 const s=(4+f.z*9)*(front?1.6:1);const a=WK(f.sp*3)*t+f.ph;const flip=Math.cos(WK(f.sp*4)*t+f.ph);
 X.save();X.translate(x,y);X.scale(1,Math.max(0.4,Math.abs(flip)));leaf(X,0,0,s,a,f.c,0.85,flip<0?0.5:0.15);X.restore();}}
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
