// safe space after dark — "i didn't think i'd be okay again. tonight, i am." Design space 1080x1920, rendered 1440x2560.
// She sits on a floor cushion on a high balcony at night, wrapped in a knitted blanket (seen from behind), a warm drink in
// her hands (steam rising past her shoulder), her phone face-down beside her. The city glows below; a shooting star
// crosses the sky at 7.4 s and she turns her head to follow it.
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
function off(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}
const gust=t=>0.5+0.3*Math.sin(t*0.37)+0.15*Math.sin(t*1.1+1)+0.05*Math.sin(t*2.9);

const SK='#c48b67',SK_SH='#9a6649',SK_LT='#dba47f',HAIR='#2b1d19',HAIR_L='#5a3c2e';
const HZ=930;                 // horizon (eye level)
const RAIL={top:1010,bot:1330};
const STAR={t0:7.4,t1:8.5,x0:930,y0:150,x1:640,y1:420};
const breathAt=t=>Math.sin(t*2*Math.PI/4.6);
const armUp=t=>0;
const turnAt=t=>{let a=0;a+=7*ease((t-7.5)/0.9);a-=7*ease((t-11.5)/2.2);a+=1.0*Math.sin(t*0.6)*ease(t/2);return a*Math.PI/180;};
let SKY=null,CITY=null,DECK=null;const SS=S*1.14;
function skyPaint(q){const g=q.createLinearGradient(0,0,0,HZ+60);g.addColorStop(0,'#0a0d22');g.addColorStop(0.45,'#1b1d3f');g.addColorStop(0.8,'#3b2f55');g.addColorStop(1,'#6b4a66');q.fillStyle=g;q.fillRect(0,0,W,1300);
 const r=rng(3);for(let i=0;i<260;i++){const y=Math.pow(r(),1.4)*HZ*0.85;q.globalAlpha=(0.2+r()*0.7)*(1-y/HZ);q.fillStyle=r()>0.8?'#ffe9d0':'#e6ecff';q.beginPath();q.arc(r()*W,y,r()*1.5+0.3,0,6.28);q.fill();}q.globalAlpha=1;
 // crescent moon, upper left
 const mx=190,my=250;const h=q.createRadialGradient(mx,my,20,mx,my,260);h.addColorStop(0,'rgba(240,230,255,.22)');h.addColorStop(1,'rgba(240,230,255,0)');q.fillStyle=h;q.fillRect(0,0,500,520);
 {const [mc,mq]=off(120,120);mq.fillStyle='#f7f1e6';mq.beginPath();mq.arc(60,60,38,0,6.28);mq.fill();mq.globalCompositeOperation='destination-out';mq.beginPath();mq.arc(76,50,34,0,6.28);mq.fill();q.drawImage(mc,mx-60,my-60);}
 // city haze glowing up from below the horizon
 const hz=q.createLinearGradient(0,HZ-260,0,HZ+40);hz.addColorStop(0,'rgba(255,150,120,0)');hz.addColorStop(1,'rgba(255,160,120,.28)');q.fillStyle=hz;q.fillRect(0,HZ-260,W,300);}
// the city below: three depths of buildings with lit windows, a lit bridge far away, a river of car lights
const WINS=[];
function cityPaint(q){const r=rng(9);
 // far: hazy towers
 for(let x=-20;x<W;){const w=30+r()*60,h=40+r()*170;q.fillStyle='#2a2443';q.fillRect(x,HZ-h,w,h+200);for(let k=0;k<h/9;k++)if(r()<0.35){q.fillStyle='rgba(255,210,150,.5)';q.fillRect(x+3+r()*(w-6),HZ-h+4+k*9,2,2);}x+=w+r()*6;}
 // bridge with a string of lights
 q.strokeStyle='#3b3157';q.lineWidth=4;q.beginPath();q.moveTo(0,HZ+18);q.quadraticCurveTo(W/2,HZ-12,W,HZ+18);q.stroke();
 for(let i=0;i<60;i++){const u=i/59,x=u*W,y=HZ+18-4*u*(1-u)*30*1;q.fillStyle='rgba(255,220,160,.8)';q.fillRect(x,y-2,2.5,2.5);}
 // mid buildings
 for(let x=-30;x<W;){const w=60+r()*90,h=60+r()*230,b=HZ+70;q.fillStyle=r()<0.5?'#1d1932':'#211c38';q.fillRect(x,b-h,w,h+400);
  for(let yy=b-h+10;yy<b+300;yy+=14)for(let xx=x+6;xx<x+w-8;xx+=12){if(r()<0.32){const warm=r()<0.8;WINS.push([xx,yy,warm?0:1,r()*6.28,r()<0.12]);}}
  if(r()<0.4){q.fillStyle='rgba(255,90,90,.9)';q.beginPath();q.arc(x+w/2,b-h-6,2.5,0,6.28);q.fill();}
  x+=w+r()*10;}
 for(const [xx,yy,c] of WINS){q.fillStyle=c?'rgba(190,210,255,.75)':'rgba(255,205,140,.85)';q.fillRect(xx,yy,6,8);}
 // haze over the city lights
 const hz=q.createLinearGradient(0,HZ-100,0,HZ+300);hz.addColorStop(0,'rgba(80,60,110,.0)');hz.addColorStop(0.5,'rgba(80,60,110,.25)');hz.addColorStop(1,'rgba(30,25,50,.6)');q.fillStyle=hz;q.fillRect(0,HZ-100,W,500);}
// balcony: glass panels between metal posts with a timber handrail, decking, potted plants, a floor lantern
function deckPaint(q){const r=rng(21);
 // decking (warm wood planks running away from us)
 const dg=q.createLinearGradient(0,RAIL.bot,0,H);dg.addColorStop(0,'#3a2c2a');dg.addColorStop(1,'#1e1716');q.fillStyle=dg;q.fillRect(0,RAIL.bot-4,W,H-RAIL.bot+4);
 for(let i=-14;i<=14;i++){const xt=540+i*44,xb=540+i*120;q.strokeStyle='rgba(10,6,6,.45)';q.lineWidth=2;q.beginPath();q.moveTo(xt,RAIL.bot);q.lineTo(xb,H);q.stroke();}
 for(let y=RAIL.bot+30,k=0;y<H;k++){q.strokeStyle='rgba(10,6,6,.18)';q.lineWidth=1;q.beginPath();q.moveTo(0,y);q.lineTo(W,y);q.stroke();y+=30+k*12;}
 // glass panels (tinted, with a faint reflection streak) and posts
 const gl=q.createLinearGradient(0,RAIL.top,0,RAIL.bot);gl.addColorStop(0,'rgba(140,160,210,.10)');gl.addColorStop(1,'rgba(40,40,70,.35)');q.fillStyle=gl;q.fillRect(0,RAIL.top,W,RAIL.bot-RAIL.top);
 for(const x of [120,400,680,960]){q.fillStyle='rgba(255,255,255,.05)';q.beginPath();q.moveTo(x+40,RAIL.top);q.lineTo(x+90,RAIL.top);q.lineTo(x+20,RAIL.bot);q.lineTo(x-30,RAIL.bot);q.fill();}
 for(const x of [-6,270,550,830,1080]){q.fillStyle='#16141e';q.fillRect(x-7,RAIL.top-6,14,RAIL.bot-RAIL.top+6);q.fillStyle='rgba(255,200,150,.12)';q.fillRect(x-7,RAIL.top,3,RAIL.bot-RAIL.top);}
 q.fillStyle='#2a1c18';q.fillRect(-10,RAIL.top-22,W+20,20);q.fillStyle='#4a332a';q.fillRect(-10,RAIL.top-22,W+20,5);   // timber handrail
 q.fillStyle='#120e14';q.fillRect(-10,RAIL.bot-6,W+20,10);
 // potted plants: a tall olive-ish plant at the left, a trailing pothos and a small succulent at the right
 plant(q,150,1580,1.1,0);plant(q,960,1520,1.0,1);
 // little side table at the right with a candle jar
}
function plant(q,x,y,s,kind){const r=rng(40+kind);
 q.fillStyle='rgba(0,0,0,.35)';q.beginPath();q.ellipse(x,y+4,70*s,12*s,0,0,6.28);q.fill();
 const pg=q.createLinearGradient(x-60*s,0,x+60*s,0);pg.addColorStop(0,'#b46a4e');pg.addColorStop(1,'#6e3a2c');q.fillStyle=pg;q.beginPath();q.moveTo(x-58*s,y-120*s);q.lineTo(x+58*s,y-120*s);q.lineTo(x+44*s,y);q.lineTo(x-44*s,y);q.closePath();q.fill();
 q.fillStyle='#8e4f3a';q.fillRect(x-62*s,y-128*s,124*s,16*s);
 if(kind==0){q.strokeStyle='#3a2a1e';q.lineWidth=5*s;q.beginPath();q.moveTo(x,y-126*s);q.quadraticCurveTo(x-10*s,y-300*s,x+6*s,y-470*s);q.stroke();
  for(let i=0;i<120;i++){const a=r()*6.28,rr=Math.sqrt(r()),cx=x+Math.cos(a)*rr*110*s,cy=y-420*s+Math.sin(a)*rr*150*s;q.fillStyle=['#2f4a33','#3d5e3f','#27402c','#4a6e48'][(r()*4)|0];q.save();q.translate(cx,cy);q.rotate(r()*6.28);q.beginPath();q.ellipse(0,0,15*s,5*s,0,0,6.28);q.fill();q.restore();}}
 else{for(let i=0;i<9;i++){let px=x+(i-4)*12*s,py=y-126*s;const dir=i<4?-1:1;q.strokeStyle='#2c4a30';q.lineWidth=2.5*s;q.beginPath();q.moveTo(px,py);const len=60+r()*160;for(let k=0;k<len;k+=12){px+=dir*(2+r()*3)*s;py+=(k<30?-6:9)*s;q.lineTo(px,py);}q.stroke();
   let qx=x+(i-4)*12*s,qy=y-126*s;for(let k=0;k<len;k+=18){qx+=dir*(3.5)*s*1.5;qy+=(k<30?-9:13)*s;q.fillStyle=['#3f6e44','#4f8452','#36603b'][k%3];q.save();q.translate(qx,qy);q.rotate(dir*0.6);q.beginPath();q.moveTo(0,-9*s);q.quadraticCurveTo(10*s,0,0,9*s);q.quadraticCurveTo(-10*s,0,0,-9*s);q.fill();q.restore();}}}}
function buildStatic(){const mk=f=>{const [c,q]=off(W*SS|0,H*SS|0);q.scale(SS,SS);f(q);return c;};SKY=mk(skyPaint);CITY=mk(cityPaint);DECK=mk(deckPaint);}
// ---------------- animated ----------------
function cityLights(t){for(const [x,y,c,ph,blink] of WINS){if(!blink)continue;const on=Math.sin(t*0.5+ph)>0.2;if(!on){X.fillStyle='#1d1932';X.fillRect(x,y,6,8);}}
 // cars on the far avenue: a slow ribbon of head/tail lights
 for(let i=0;i<26;i++){const r=rng(i+70);const dir=i%2?1:-1;const span=W+100;const x=((r()*span+dir*t*(18+r()*12))%span+span)%span-50,y=HZ+150+(i%2)*8;
  X.fillStyle=dir>0?'rgba(255,90,80,.85)':'rgba(255,240,210,.9)';X.fillRect(x,y,4,2.5);}}
// string lights draped along the handrail, gently twinkling
function stringLights(t){const pts=[];for(let i=0;i<=5;i++)pts.push(-20+i*230);
 X.strokeStyle='rgba(20,14,14,.9)';X.lineWidth=1.6;
 for(let s=0;s<5;s++){const x0=pts[s],x1=pts[s+1],y0=RAIL.top-18;X.beginPath();X.moveTo(x0,y0);X.quadraticCurveTo((x0+x1)/2,y0+60,x1,y0);X.stroke();
  for(let k=1;k<8;k++){const u=k/8,x=lerp(x0,x1,u),y=y0+60*2*u*(1-u)+4;const tw=0.7+0.3*Math.sin(t*1.3+s*2+k*1.1);
   const g=X.createRadialGradient(x,y,0,x,y,26);g.addColorStop(0,`rgba(255,200,130,${0.45*tw})`);g.addColorStop(1,'rgba(255,200,130,0)');X.fillStyle=g;X.fillRect(x-26,y-26,52,52);
   X.fillStyle=`rgba(255,236,190,${0.75+0.25*tw})`;X.beginPath();X.ellipse(x,y+3,3,4.5,0,0,6.28);X.fill();}}}
// floor lantern beside her cushion (left), candle flickering; warm pool on the decking
function lantern(t){const x=240,y=1650;const fl=0.9+0.06*Math.sin(t*9.1)+0.04*Math.sin(t*14.3);
 const pool=X.createRadialGradient(x,y+10,10,x,y+10,330);pool.addColorStop(0,`rgba(255,170,90,${0.45*fl})`);pool.addColorStop(1,'rgba(255,170,90,0)');X.fillStyle=pool;X.save();X.translate(x,y+10);X.scale(1,0.35);X.beginPath();X.arc(0,0,330,0,6.28);X.fill();X.restore();
 X.fillStyle='rgba(0,0,0,.4)';X.beginPath();X.ellipse(x,y+6,46,9,0,0,6.28);X.fill();
 X.fillStyle='#1b1512';X.beginPath();X.moveTo(x-34,y);X.lineTo(x+34,y);X.lineTo(x+30,y-10);X.lineTo(x-30,y-10);X.fill();
 const gg=X.createLinearGradient(0,y-110,0,y-10);gg.addColorStop(0,`rgba(255,200,120,${0.55*fl})`);gg.addColorStop(1,`rgba(255,160,80,${0.75*fl})`);X.fillStyle=gg;X.fillRect(x-28,y-112,56,102);
 X.fillStyle='#f3e6d0';X.fillRect(x-9,y-44,18,34);X.fillStyle='#fff6d8';X.beginPath();X.ellipse(x,y-54+Math.sin(t*7)*0.8,4,9*fl,Math.sin(t*3.3)*0.06,0,6.28);X.fill();
 X.strokeStyle='#1b1512';X.lineWidth=5;X.strokeRect(x-30,y-114,60,106);X.lineWidth=3;X.beginPath();X.moveTo(x,y-114);X.lineTo(x,y-10);X.moveTo(x-30,y-62);X.lineTo(x+30,y-62);X.stroke();
 X.fillStyle='#1b1512';X.beginPath();X.moveTo(x-38,y-114);X.lineTo(x+38,y-114);X.lineTo(x,y-142);X.closePath();X.fill();X.lineWidth=3;X.beginPath();X.arc(x,y-150,9,0,6.28);X.stroke();
 const gl=X.createRadialGradient(x,y-60,10,x,y-60,170);gl.addColorStop(0,`rgba(255,190,110,${0.25*fl})`);gl.addColorStop(1,'rgba(255,190,110,0)');X.fillStyle=gl;X.fillRect(x-170,y-230,340,340);}
// floor cushion she sits on (visible round her hips), her phone face-down on the deck to her right
function cushion(){X.fillStyle='rgba(0,0,0,.4)';X.beginPath();X.ellipse(458,1470,300,28,0,0,6.28);X.fill();
 const cg=X.createLinearGradient(0,1400,0,1480);cg.addColorStop(0,'#8a5a6a');cg.addColorStop(1,'#5a3644');X.fillStyle=cg;X.beginPath();X.roundRect(170,1400,580,72,34);X.fill();
 X.strokeStyle='rgba(30,10,20,.35)';X.lineWidth=2;X.beginPath();X.moveTo(190,1436);X.quadraticCurveTo(460,1446,730,1436);X.stroke();
 X.fillStyle='rgba(255,190,140,.18)';X.beginPath();X.ellipse(260,1410,70,8,0,0,6.28);X.fill();
 // phone face-down, lying flat on the deck within reach of her right hand (portrait phone seen at a low angle)
 X.save();X.translate(770,1530);X.scale(1,0.42);X.rotate(1.1);
 X.fillStyle='rgba(0,0,0,.45)';X.beginPath();X.roundRect(-36,-68,76,144,14);X.fill();
 X.fillStyle='#2e2937';X.beginPath();X.roundRect(-38,-74,76,148,14);X.fill();
 X.fillStyle='#3d3748';X.beginPath();X.roundRect(-34,-70,68,140,12);X.fill();
 X.fillStyle='#1c1922';X.beginPath();X.roundRect(-28,-64,30,30,8);X.fill();X.fillStyle='#57516a';X.beginPath();X.arc(-20,-56,5,0,6.28);X.arc(-6,-42,5,0,6.28);X.fill();
 X.restore();}
// steam from the mug she holds against her chest, rising past her right shoulder and drifting with the air
function steam(t){for(let i=0;i<14;i++){const p=((t/3.6+i/14)%1);const x=508+p*26+Math.sin(p*6+i*1.7)*9+Math.sin(t*0.7)*4*p,y=955-p*200;const r=8+p*26;
 const g=X.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(240,236,248,${0.2*Math.sin(p*Math.PI)})`);g.addColorStop(1,'rgba(240,236,248,0)');X.fillStyle=g;X.fillRect(x-r,y-r,r*2,r*2);}}
// shooting star
function star(t){const u=(t-STAR.t0)/(STAR.t1-STAR.t0);if(u<0||u>1.3)return;const k=ease(Math.min(1,u));const x=lerp(STAR.x0,STAR.x1,k),y=lerp(STAR.y0,STAR.y1,k);const fade=u<1?Math.sin(Math.min(1,u)*Math.PI*0.9+0.3):Math.max(0,1-(u-1)/0.3);
 const tl=X.createLinearGradient(x,y,x+(STAR.x0-STAR.x1)*0.35,y+(STAR.y0-STAR.y1)*0.35);tl.addColorStop(0,`rgba(255,250,235,${0.9*fade})`);tl.addColorStop(1,'rgba(255,250,235,0)');
 X.strokeStyle=tl;X.lineWidth=3;X.lineCap='round';X.beginPath();X.moveTo(x,y);X.lineTo(x+(STAR.x0-STAR.x1)*0.35,y+(STAR.y0-STAR.y1)*0.35);X.stroke();
 const g=X.createRadialGradient(x,y,0,x,y,16);g.addColorStop(0,`rgba(255,255,245,${fade})`);g.addColorStop(1,'rgba(255,255,245,0)');X.fillStyle=g;X.fillRect(x-16,y-16,32,32);}
// ---------------- her ----------------
const NECK=[432,948];
function blanket(t){const b=breathAt(t)*2,k=armUp(t);
 // a chunky knitted blanket wrapped round her shoulders: rounded shoulders, elbows and arms bulging under it, pooled on the cushion.
 // Her right shoulder lifts a little and the edge opens when she raises her arm to the glass.
 const P=new Path2D();const L=(x,y)=>[x,y+b];
 P.moveTo(390,950+b*0.3);
 P.bezierCurveTo(350,958+b,314,975+b,297,1005+b);P.bezierCurveTo(285,1028+b,280,1060,279,1095);   // left shoulder, rounded
 P.bezierCurveTo(276,1130,264,1170,258,1210);P.bezierCurveTo(254,1250,262,1290,256,1330);          // upper arm and elbow under the knit
 P.bezierCurveTo(250,1370,232,1396,214,1414);
 P.bezierCurveTo(262,1430,300,1418,340,1430);P.bezierCurveTo(390,1442,440,1428,492,1438);P.bezierCurveTo(548,1446,600,1430,650,1432);P.bezierCurveTo(672,1430,690,1424,702,1414); // hem pooled in soft waves
 P.bezierCurveTo(680,1394,664,1366,660,1330);P.bezierCurveTo(654,1290,662,1250,656,1210);
 P.bezierCurveTo(650,1170,638,1130-k*10,636,1095-k*14);P.bezierCurveTo(634,1060-k*16,630,1028-k*18+b,618,1005-k*18+b);
 P.bezierCurveTo(602,975-k*12+b,566,958+b,476,950+b*0.3);P.closePath();
 const g=X.createLinearGradient(250,960,710,1300);g.addColorStop(0,'#c6cbd8');g.addColorStop(0.4,'#a2aabd');g.addColorStop(0.8,'#767e95');g.addColorStop(1,'#545a6f');X.fillStyle=g;X.fill(P);
 X.save();X.clip(P);
 // knit texture: rows of small V stitches that follow the curve of her back
 for(let row=0;row<26;row++){const y0=1000+row*17;const bow=(1-row/26)*26;for(let c=0;c<30;c++){const x=262+c*15+(row%2)*7;const yy=y0+Math.pow((x-458)/220,2)*bow-bow*0.2;
  X.strokeStyle='rgba(55,62,84,.22)';X.lineWidth=1.6;X.beginPath();X.moveTo(x-5,yy-4);X.lineTo(x,yy+3);X.lineTo(x+5,yy-4);X.stroke();}}
 // folds hanging from the shoulder points and the elbows (soft shadow + light ridge)
 for(const [x0,y0,cx,cy,x1,y1,w,a] of [[300,1010,330,1180,300,1420,44,.15],[612,1012,580,1170,600,1430,48,.17],[648,1250,622,1340,640,1426,26,.14],[420,1180,400,1300,380,1430,30,.06],[520,1200,540,1320,520,1432,28,.05]]){
  X.strokeStyle=`rgba(40,46,66,${a})`;X.lineWidth=w;X.lineCap='round';X.beginPath();X.moveTo(x0,y0);X.quadraticCurveTo(cx,cy,x1,y1);X.stroke();
  }
 // spine hollow and the curve of her back
 const sp=X.createLinearGradient(420,0,500,0);sp.addColorStop(0,'rgba(40,46,66,0)');sp.addColorStop(0.5,'rgba(40,46,66,.10)');sp.addColorStop(1,'rgba(40,46,66,0)');X.fillStyle=sp;X.fillRect(420,980,80,330);
 // lamp warmth on her left shoulder, shading under the arms
 const wl=X.createRadialGradient(290,1010,10,290,1030,260);wl.addColorStop(0,'rgba(255,200,140,.30)');wl.addColorStop(1,'rgba(255,205,150,0)');X.fillStyle=wl;X.fillRect(150,900,420,520);
 const lo=X.createLinearGradient(0,1300,0,1440);lo.addColorStop(0,'rgba(30,30,50,0)');lo.addColorStop(1,'rgba(30,30,50,.25)');X.fillStyle=lo;X.fillRect(200,1300,520,140);
 X.restore();
 // cool window light along her right side
 X.strokeStyle='rgba(185,200,240,.42)';X.lineWidth=3;X.beginPath();X.moveTo(618,1007-k*18+b);X.bezierCurveTo(630,1028-k*18+b,634,1060-k*16,636,1095-k*14);X.bezierCurveTo(638,1130-k*10,650,1170,656,1210);X.stroke();
 // edge of the blanket lifted where her arm comes out (the inside of the knit shows)
if(false){X.fillStyle=`rgba(120,104,88,${k})`;X.beginPath();X.moveTo(566,975-k*12+b);X.quadraticCurveTo(598,986-k*20+b,614,1004-k*18+b);X.quadraticCurveTo(594,1008-k*8+b,566,996+b);X.closePath();X.fill();}
 // fringe where it rests on the cushion
 X.lineCap='round';for(let i=0;i<46;i++){const x=220+i*10.4;const y=1426+Math.sin(x*0.035)*6+Math.sin(x*0.11)*2;const L=10+((i*7)%5)*3;X.strokeStyle=i%3?'rgba(150,158,180,.85)':'rgba(120,128,150,.85)';X.lineWidth=2;X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+4,y+L*0.6,x+2+((i*3)%4)-1,y+L);X.stroke();}
 X.fillStyle='rgba(30,20,20,.3)';X.beginPath();X.ellipse(458,1446,250,9,0,0,6.28);X.fill();
 // sweater collar (sage rib) showing at the neck
 X.fillStyle='#a8687a';X.beginPath();X.moveTo(384,952+b*0.3);X.quadraticCurveTo(432,930+b*0.3,482,952+b*0.3);X.quadraticCurveTo(432,970+b*0.3,384,952+b*0.3);X.fill();
 X.strokeStyle='rgba(60,30,40,.2)';X.lineWidth=1;for(let i=-5;i<=5;i++){X.beginPath();X.moveTo(432+i*8,945+b*0.3);X.lineTo(432+i*8.6,958+b*0.3);X.stroke();}}
function drape(t){const k=armUp(t);if(k<=0.02)return;const T=tip(t);if(!T)return;const [fx,fy]=T.p;const HS=1.3;const wx=fx+6*HS,wy=fy+92*HS;
 const ex=lerp(575,clamp(fx-40,570,610),k),ey=lerp(1150,1060,k);
 // where the sleeve leaves her shoulder line, the knit falls over the forearm in a soft fold
 const u=0.42,px=lerp(ex,wx,u)+6,py=lerp(ey,wy+16,u);const ang=Math.atan2(wy+16-ey,wx-ex);
 X.save();X.translate(px,py);X.rotate(ang);X.globalAlpha=Math.min(1,k*1.5);
 const g=X.createLinearGradient(0,-40,0,40);g.addColorStop(0,'#cdbca3');g.addColorStop(0.6,'#ab9983');g.addColorStop(1,'#857464');X.fillStyle=g;
 X.beginPath();X.moveTo(-70,-36);X.quadraticCurveTo(-10,-46,18,-34);X.quadraticCurveTo(34,0,20,36);X.quadraticCurveTo(-20,44,-70,38);X.closePath();X.fill();
 X.strokeStyle='rgba(105,85,66,.22)';X.lineWidth=1.6;for(let r=-28;r<=28;r+=14){for(let c=-60;c<10;c+=15){X.beginPath();X.moveTo(c-5,r-4);X.lineTo(c,r+3);X.lineTo(c+5,r-4);X.stroke();}}
 X.strokeStyle='rgba(40,46,66,.35)';X.lineWidth=3;X.beginPath();X.moveTo(18,-34);X.quadraticCurveTo(34,0,20,36);X.stroke();
 X.strokeStyle='rgba(185,200,240,.35)';X.lineWidth=2;X.beginPath();X.moveTo(-60,38);X.quadraticCurveTo(-20,44,20,36);X.stroke();
 X.restore();}
function head(t){const b=breathAt(t)*2,a=turnAt(t),tn=a/(8*Math.PI/180);
 X.save();X.translate(NECK[0],NECK[1]+8+b*0.5);X.scale(1.12,1.12);X.rotate(a*0.5);
 // nape of the neck
 const ng=X.createLinearGradient(-26,0,26,0);ng.addColorStop(0,SK_LT);ng.addColorStop(0.5,SK);ng.addColorStop(1,SK_SH);X.fillStyle=ng;X.beginPath();X.moveTo(-30,14);X.quadraticCurveTo(-27,-12,-26,-30);X.lineTo(26,-30);X.quadraticCurveTo(27,-12,30,14);X.closePath();X.fill();
 
 X.translate(0,-22);X.rotate(a*0.5);
 // her right cheek starts to show as she turns towards the glass
 if(tn>0.05){X.fillStyle=SK_SH;X.beginPath();X.ellipse(48,-52,10*tn+2,30,0.15,0,6.28);X.fill();X.fillStyle=`rgba(230,190,170,${0.3*tn})`;X.beginPath();X.ellipse(51,-54,5*tn+1,20,0.15,0,6.28);X.fill();}
 // ears, half hidden by hair
 for(const s of [-1,1]){X.fillStyle=SK_SH;X.beginPath();X.ellipse(s*55,-72,8,15,s*0.15,0,6.28);X.fill();X.fillStyle=SK;X.beginPath();X.ellipse(s*54,-72,5,11,s*0.15,0,6.28);X.fill();}
 // back of the head
 const hg=X.createRadialGradient(-30,-110,10,0,-80,110);hg.addColorStop(0,HAIR_L);hg.addColorStop(0.5,HAIR);hg.addColorStop(1,'#17100e');X.fillStyle=hg;
 X.beginPath();X.moveTo(-46,-22);X.bezierCurveTo(-64,-70,-64,-140,-36,-168);X.bezierCurveTo(-12,-186,22,-184,42,-166);X.bezierCurveTo(66,-140,64,-70,46,-22);X.bezierCurveTo(26,-6,-26,-6,-46,-22);X.fill();
 // soft shadow where the hair meets the nape
 {const hs=X.createLinearGradient(0,-16,0,4);hs.addColorStop(0,'rgba(60,35,25,.35)');hs.addColorStop(1,'rgba(60,35,25,0)');X.fillStyle=hs;X.fillRect(-30,-16,60,20);}
 // hair combed back into the bun, strand lines
 X.strokeStyle='rgba(120,85,65,.35)';X.lineWidth=1.4;for(let i=0;i<16;i++){const sx=-56+i*7.5;X.beginPath();X.moveTo(sx*0.9,-162+Math.abs(sx)*0.5);X.quadraticCurveTo(sx*0.8,-110,sx*0.3,-84);X.stroke();}
 // thin dark hair tie at the base of the bun (mostly hidden), then a loosely twisted bun
 X.fillStyle='#3d2a24';X.beginPath();X.ellipse(0,-54,22,5,0.04,0,6.28);X.fill();
 const bg=X.createRadialGradient(-14,-94,4,0,-82,46);bg.addColorStop(0,'#5e4031');bg.addColorStop(0.6,HAIR);bg.addColorStop(1,'#160e0c');X.fillStyle=bg;
 X.beginPath();X.moveTo(-36,-70);X.bezierCurveTo(-46,-98,-20,-118,4,-114);X.bezierCurveTo(34,-112,46,-90,38,-68);X.bezierCurveTo(30,-54,-26,-52,-36,-70);X.fill();
 X.lineCap='round';for(let i=0;i<9;i++){const a0=i*0.7;X.strokeStyle=i%3==1?'rgba(160,118,90,.5)':'rgba(110,78,60,.5)';X.lineWidth=1.6;X.beginPath();for(let k=0;k<=12;k++){const a=a0+k*0.32,rr=8+k*2.3;const px=Math.cos(a)*rr*1.25,py=-90+Math.sin(a)*rr*0.75;k?X.lineTo(px,py):X.moveTo(px,py);}X.stroke();}
 X.fillStyle='rgba(170,125,95,.18)';X.beginPath();X.ellipse(-12,-100,16,6,-0.3,0,6.28);X.fill();
 // loose wisps at the nape and over the ears, moving with her breath
 X.strokeStyle=HAIR;X.lineWidth=1.5;X.strokeStyle='rgba(43,29,25,.7)';X.lineWidth=1.1;for(const [x0,y0,dx,dy] of [[46,-74,8,34],[-48,-78,-7,32]]){X.beginPath();X.moveTo(x0,y0);X.bezierCurveTo(x0+dx*0.3,y0+dy*0.4,x0+dx+Math.sin(t*0.8+x0)*2,y0+dy*0.7,x0+dx*0.6,y0+dy);X.stroke();}
 // rim light: warm lamp on the left of her hair, cool window light on the right
 X.strokeStyle='rgba(255,180,120,.45)';X.lineWidth=3;X.beginPath();X.moveTo(-48,-34);X.bezierCurveTo(-64,-70,-64,-140,-36,-168);X.stroke();
 X.strokeStyle='rgba(170,190,240,.35)';X.lineWidth=2.5;X.beginPath();X.moveTo(42,-166);X.bezierCurveTo(66,-140,64,-70,48,-30);X.stroke();
 X.restore();}

// ---------------- grade + caption ----------------
function grade(t){const v=X.createRadialGradient(520,980,300,520,980,1250);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,4,14,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(150,110,190,.10)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.04;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function heartIcon(x,y,s,a){X.save();X.globalAlpha=a;X.fillStyle='#fbe4ea';X.beginPath();X.moveTo(x,y+s*0.8);X.bezierCurveTo(x-s*1.2,y-s*0.1,x-s*0.6,y-s*0.95,x,y-s*0.35);X.bezierCurveTo(x+s*0.6,y-s*0.95,x+s*1.2,y-s*0.1,x,y+s*0.8);X.fill();X.restore();}
function caption(t){
 const a=Math.min(1,0.5+t/0.9)*clamp((6.4-t)/1.2,0,1);
 if(a>0){X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*4,y=470;const bl=Math.max(0,(t-5.4)*1.5);if(bl>0)X.filter=`blur(${bl}px)`;
  X.font="italic 500 70px Corm, serif";X.shadowColor='rgba(200,170,255,.6)';X.shadowBlur=30;X.fillStyle='#f4f1fa';
  for(let k=0;k<2;k++){X.fillText("i didn't think i'd be",x,y);X.fillText('okay again',x,y+86);X.shadowBlur=0;}
  X.filter='none';X.globalAlpha=a*0.6;X.strokeStyle='#f4f1fa';X.lineWidth=1.5;X.beginPath();X.moveTo(x-55,y+144);X.lineTo(x+55,y+144);X.stroke();X.restore();}
 const b=clamp((t-9.6)/1.3,0,1);
 if(b>0){X.save();X.globalAlpha=b;X.textAlign='center';X.textBaseline='middle';const x=540,y=500-b*10;X.font="italic 500 80px Corm, serif";X.shadowColor='rgba(255,180,200,.6)';X.shadowBlur=30;X.fillStyle='#fbeef2';
  const tw=X.measureText('tonight, i am').width;for(let k=0;k<2;k++){X.fillText('tonight, i am',x-24,y);X.shadowBlur=0;}X.restore();heartIcon(x-24+tw/2+34,y-4,18,b);}}
// ---------------- frame ----------------
window.draw=function(t){if(!SKY)buildStatic();
 const z=1.14+0.06*ease(t/16),F=[520,900],ox=S*(F[0]-F[0]*z),oy=S*(F[1]-F[1]*z);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 // sky and city sit far away: they move a little less with the push-in (parallax)
 const zf=1+(z-1)*0.5,oxf=S*(F[0]-F[0]*zf),oyf=S*(F[1]-F[1]*zf);
 X.setTransform(zf/1.14,0,0,zf/1.14,oxf,oyf);X.drawImage(SKY,0,0);
 X.setTransform(S*zf,0,0,S*zf,oxf,oyf);star(t);
 X.setTransform(zf/1.14,0,0,zf/1.14,oxf,oyf);X.drawImage(CITY,0,0);
 X.setTransform(S*zf,0,0,S*zf,oxf,oyf);cityLights(t);
 X.setTransform(z/1.14,0,0,z/1.14,ox,oy);X.drawImage(DECK,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);stringLights(t);lantern(t);cushion();head(t);blanket(t);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);};
draw(0);
