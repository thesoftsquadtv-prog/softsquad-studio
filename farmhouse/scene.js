// Soft Ambience — "everyone made it home tonight" (Thanksgiving night). Design space 1080x1920, rendered 1440x2560.
// A white two-storey farmhouse with a wraparound porch in the first snow of the year: every window lit (dining table with
// candles and a pie, a fire in the living room, lamps upstairs), four snow-capped cars in the drive by the red barn, a lantern
// over the barn door, porch string lights, pumpkins on the steps, smoke from both chimneys. Story moment: at 7.6 s someone
// upstairs draws the curtain back to watch the snow (it closes again at 16 s). Everything moves on WK(k) → 20 s seamless loop.
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
const LOOP=20, WK=k=>2*Math.PI*k/LOOP;
const gust=t=>0.55+0.3*Math.sin(WK(1)*t)+0.15*Math.sin(WK(3)*t+1)+0.08*Math.sin(WK(9)*t);
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
const SS=S*1.12;function off(){const c=document.createElement('canvas');c.width=W*SS|0;c.height=H*SS|0;const q=c.getContext('2d');q.scale(SS,SS);return [c,q];}
function ell(q,x,y,rx,ry){q.beginPath();q.ellipse(x,y,rx,ry,0,0,Math.PI*2);}

// house geometry
const HX0=150,HX1=690,EAVE=790,RIDGE=610,GROUND=1350,PORCH_TOP=1050,PORCH_FLOOR=1318;
const CG={x:420,peak:560,w:200};                 // centre cross-gable over the door
const CHIM=[[236,520],[606,520]];                // chimney tops (x centre, y top)
const BARN={x0:745,x1:1000,top:1075,ground:1290,peak:905};
const LIGHTS=[];                                 // [x,y,r,phase] warm glows that flicker
let SKY=null,STATIC=null;

// ---------------- sky + far land ----------------
function skyPaint(q){const g=q.createLinearGradient(0,0,0,1250);g.addColorStop(0,'#141a33');g.addColorStop(0.55,'#262c4c');g.addColorStop(1,'#4a4865');q.fillStyle=g;q.fillRect(0,0,W,1400);
 // snow clouds: blurred billows, a little lighter where the hidden moon is
 const r=rng(12);q.save();q.filter='blur(22px)';
 for(let i=0;i<46;i++){const x=r()*(W+300)-150,y=40+Math.pow(r(),1.2)*700,rx=130+r()*220,ry=40+r()*60;const cg=q.createRadialGradient(x,y+ry*0.4,4,x,y,rx);
  cg.addColorStop(0,'rgba(108,112,146,.42)');cg.addColorStop(1,'rgba(70,74,104,0)');q.fillStyle=cg;ell(q,x,y,rx,ry);q.fill();}
 const mg=q.createRadialGradient(830,300,10,830,300,330);mg.addColorStop(0,'rgba(220,225,255,.45)');mg.addColorStop(0.3,'rgba(170,180,230,.18)');mg.addColorStop(1,'rgba(150,160,220,0)');q.fillStyle=mg;q.fillRect(400,0,680,700);
 q.restore();
 // distant snowy hills with a line of dark pines and one far farm light
 q.fillStyle='#8e90ac';q.beginPath();q.moveTo(0,1200);for(let x=0;x<=W;x+=20)q.lineTo(x,1150-40*Math.sin(x*0.003+0.6)-16*Math.sin(x*0.011));q.lineTo(W,1400);q.lineTo(0,1400);q.fill();
 const hz=q.createLinearGradient(0,1080,0,1220);hz.addColorStop(0,'rgba(200,205,235,0)');hz.addColorStop(1,'rgba(200,205,235,.25)');q.fillStyle=hz;q.fillRect(0,1080,W,140);
 const pr=rng(4);for(let x=-10;x<W+10;x+=8+pr()*16){const base=1150-40*Math.sin(x*0.003+0.6)-16*Math.sin(x*0.011)+6,h=26+pr()*40;q.fillStyle=`rgba(${40+pr()*12|0},${48+pr()*12|0},${66+pr()*10|0},.9)`;
  q.beginPath();q.moveTo(x,base-h);q.lineTo(x+h*0.22,base);q.lineTo(x-h*0.22,base);q.fill();}
 q.fillStyle='rgba(255,210,150,.9)';q.fillRect(118,1128,4,4);const fl=q.createRadialGradient(120,1130,0,120,1130,18);fl.addColorStop(0,'rgba(255,200,140,.4)');fl.addColorStop(1,'rgba(255,200,140,0)');q.fillStyle=fl;q.fillRect(100,1110,40,40);}

// ---------------- helpers ----------------
function clap(q,x,y,w,h,base,seed){const r=rng(seed);q.fillStyle=base;q.fillRect(x,y,w,h);
 for(let yy=y+14;yy<y+h;yy+=16){q.fillStyle='rgba(60,60,90,.16)';q.fillRect(x,yy,w,2);q.fillStyle='rgba(255,255,255,.10)';q.fillRect(x,yy+2,w,1);}
}
function interior(q,x,y,w,h,kind,seed){const r=rng(seed);
 const g=q.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#ffcf8a');g.addColorStop(1,'#e98f4c');q.fillStyle=g;q.fillRect(x,y,w,h);
 // back wall: wallpaper stripes + a picture or shelf so each room is different
 q.fillStyle='rgba(150,70,40,.12)';for(let xx=x+6;xx<x+w;xx+=12)q.fillRect(xx,y,4,h);
 if(kind=='dining'){ // pendant over a table with candles and a pie, chair backs
  q.strokeStyle='#5a3424';q.lineWidth=2;q.beginPath();q.moveTo(x+w/2,y);q.lineTo(x+w/2,y+h*0.28);q.stroke();
  q.fillStyle='#3d2a22';q.beginPath();q.moveTo(x+w/2-16,y+h*0.36);q.lineTo(x+w/2+16,y+h*0.36);q.lineTo(x+w/2+8,y+h*0.27);q.lineTo(x+w/2-8,y+h*0.27);q.fill();
  const pg=q.createRadialGradient(x+w/2,y+h*0.38,2,x+w/2,y+h*0.38,w*0.7);pg.addColorStop(0,'rgba(255,245,200,.7)');pg.addColorStop(1,'rgba(255,245,200,0)');q.fillStyle=pg;q.fillRect(x,y,w,h);
  q.fillStyle='#6b3a26';q.fillRect(x,y+h*0.72,w,h*0.06);q.fillStyle='#f3e6d0';q.fillRect(x,y+h*0.66,w,h*0.07);   // tablecloth edge + table
  for(const cx of [x+w*0.27,x+w*0.73]){q.fillStyle='#f6efe2';q.fillRect(cx-3.5,y+h*0.5,7,h*0.16);const cg=q.createRadialGradient(cx,y+h*0.46,0,cx,y+h*0.46,22);cg.addColorStop(0,'rgba(255,240,190,.9)');cg.addColorStop(1,'rgba(255,220,150,0)');q.fillStyle=cg;q.fillRect(cx-22,y+h*0.46-22,44,44);q.fillStyle='#fffbe0';q.beginPath();q.moveTo(cx,y+h*0.42);q.quadraticCurveTo(cx+4,y+h*0.47,cx,y+h*0.5);q.quadraticCurveTo(cx-4,y+h*0.47,cx,y+h*0.42);q.fill();}
  q.fillStyle='#b8682e';q.beginPath();q.moveTo(x+w*0.42,y+h*0.66);q.lineTo(x+w*0.58,y+h*0.66);q.lineTo(x+w*0.55,y+h*0.62);q.lineTo(x+w*0.45,y+h*0.62);q.fill();
  q.fillStyle='#5a2e1e';for(const cx of [x+w*0.1,x+w*0.9]){q.beginPath();q.roundRect(cx-10,y+h*0.5,20,h*0.18,[6,6,0,0]);q.fill();q.fillRect(cx-10,y+h*0.66,20,h*0.34);}}
 if(kind=='living'){ // fireplace glow low on the right, a framed picture, armchair back
  q.fillStyle='#7a4a34';q.fillRect(x+w*0.3,y+h*0.18,w*0.36,h*0.22);q.fillStyle='#d9b48a';q.fillRect(x+w*0.33,y+h*0.21,w*0.3,h*0.16);
  const fx0=x+w*0.62,fx1=x+w*0.96,fy0=y+h*0.5;q.fillStyle='#6a5c58';q.fillRect(fx0,fy0,fx1-fx0,y+h-fy0);q.fillStyle='#4a3c38';q.fillRect(fx0-4,fy0-6,fx1-fx0+8,7);
  const ox0=fx0+10,ox1=fx1-10,oy0=fy0+14;q.fillStyle='#1c1210';q.beginPath();q.moveTo(ox0,y+h);q.lineTo(ox0,oy0+10);q.quadraticCurveTo((ox0+ox1)/2,oy0-6,ox1,oy0+10);q.lineTo(ox1,y+h);q.fill();
  for(const [dx,hh,c] of [[0.3,0.5,'#ff8a2a'],[0.5,0.7,'#ffb347'],[0.7,0.45,'#ff8a2a'],[0.5,0.35,'#fff1a8']]){const fx=lerp(ox0,ox1,dx),fh=(y+h-oy0)*hh;q.fillStyle=c;q.beginPath();q.moveTo(fx-7,y+h-3);q.quadraticCurveTo(fx-6,y+h-fh*0.6,fx,y+h-fh);q.quadraticCurveTo(fx+6,y+h-fh*0.6,fx+7,y+h-3);q.fill();}
  const fg=q.createRadialGradient((ox0+ox1)/2,y+h,4,(ox0+ox1)/2,y+h,w*0.7);fg.addColorStop(0,'rgba(255,150,60,.55)');fg.addColorStop(1,'rgba(255,150,60,0)');q.fillStyle=fg;q.fillRect(x,y,w,h);
  q.fillStyle='#4e3a5a';q.beginPath();q.moveTo(x+w*0.05,y+h);q.lineTo(x+w*0.05,y+h*0.7);q.quadraticCurveTo(x+w*0.28,y+h*0.6,x+w*0.5,y+h*0.7);q.lineTo(x+w*0.5,y+h);q.fill();}
 if(kind=='lamp'){ // bedside lamp + headboard
  q.fillStyle='#6b4a3a';q.fillRect(x+w*0.2,y+h*0.66,w*0.62,h*0.34);q.fillStyle='#f4ead8';q.beginPath();q.moveTo(x+w*0.68,y+h*0.42);q.lineTo(x+w*0.86,y+h*0.42);q.lineTo(x+w*0.9,y+h*0.56);q.lineTo(x+w*0.64,y+h*0.56);q.fill();
  q.fillStyle='#8a6a50';q.fillRect(x+w*0.76,y+h*0.56,4,h*0.14);const lg=q.createRadialGradient(x+w*0.77,y+h*0.5,2,x+w*0.77,y+h*0.5,w*0.6);lg.addColorStop(0,'rgba(255,240,200,.6)');lg.addColorStop(1,'rgba(255,240,200,0)');q.fillStyle=lg;q.fillRect(x,y,w,h);}
 if(kind=='shelf'){ // bookshelf with books
  q.fillStyle='#6a4430';q.fillRect(x+w*0.1,y+h*0.3,w*0.8,4);q.fillRect(x+w*0.1,y+h*0.62,w*0.8,4);
  for(const sy of [y+h*0.3,y+h*0.62]){let bx=x+w*0.12;while(bx<x+w*0.86){const bw=4+r()*6,bh=h*(0.12+r()*0.12);q.fillStyle=['#7a3b3b','#3b5a7a','#6a7a3b','#c08a3e','#5a3b6a'][(r()*5)|0];q.fillRect(bx,sy-bh,bw,bh);bx+=bw+1;}}}
}
function sash(q,x,y,w,h,kind,seed,snowSill=true){interior(q,x,y,w,h,kind,seed);
 // white sash frame, mullions, sill with snow, dark shutters
 q.fillStyle='#2f3a52';q.fillRect(x-30,y-4,24,h+8);q.fillRect(x+w+6,y-4,24,h+8);
 q.strokeStyle='rgba(0,0,0,.25)';q.lineWidth=1;for(const sx of [x-30,x+w+6])for(let yy=y+8;yy<y+h;yy+=10){q.beginPath();q.moveTo(sx+3,yy);q.lineTo(sx+21,yy);q.stroke();}
 q.strokeStyle='#f2f0ea';q.lineWidth=8;q.strokeRect(x,y,w,h);q.lineWidth=5;q.beginPath();q.moveTo(x,y+h/2);q.lineTo(x+w,y+h/2);q.moveTo(x+w/2,y);q.lineTo(x+w/2,y+h);q.stroke();
 q.fillStyle='#e8e6e0';q.fillRect(x-10,y+h+2,w+20,9);
 if(snowSill){q.fillStyle='#f6f8ff';q.beginPath();q.moveTo(x-12,y+h+4);q.bezierCurveTo(x+w*0.2,y+h-6,x+w*0.7,y+h-5,x+w+12,y+h+4);q.lineTo(x+w+12,y+h+6);q.lineTo(x-12,y+h+6);q.fill();}
 q.fillStyle='rgba(255,255,255,.12)';q.fillRect(x+4,y+4,w/2-6,3);
 LIGHTS.push([x+w/2,y+h/2,Math.max(w,h)*1.1,seed%7]);}

// ---------------- the farmhouse ----------------
function farmhouse(q){
 // chimneys (behind the roof snow), brick with a snow cap
 for(const [cx,cy] of CHIM){q.fillStyle='#6a3a30';q.fillRect(cx-22,cy,44,140);q.fillStyle='rgba(0,0,0,.2)';for(let yy=cy+8;yy<cy+140;yy+=10)q.fillRect(cx-22,yy,44,2);
  q.fillStyle='#4a2a24';q.fillRect(cx-26,cy-6,52,10);q.fillStyle='#f4f6ff';q.beginPath();q.moveTo(cx-28,cy-4);q.quadraticCurveTo(cx,cy-18,cx+28,cy-4);q.fill();}
 // main roof: side-gabled, thick with fresh snow; slate shows only at the eave edge
 const rf=[[HX0-34,EAVE],[HX0+40,RIDGE],[HX1-40,RIDGE],[HX1+34,EAVE]];
 q.fillStyle='#3a3f52';q.beginPath();rf.forEach((p,i)=>i?q.lineTo(...p):q.moveTo(...p));q.fill();
 const sg=q.createLinearGradient(0,RIDGE,0,EAVE);sg.addColorStop(0,'#f3f5ff');sg.addColorStop(1,'#c9cfe6');q.fillStyle=sg;
 q.beginPath();q.moveTo(HX0-30,EAVE-14);q.lineTo(HX0+38,RIDGE-6);q.lineTo(HX1-38,RIDGE-6);q.lineTo(HX1+30,EAVE-14);
 for(let x=HX1+30;x>=HX0-30;x-=18)q.lineTo(x,EAVE-14+Math.sin(x*0.13)*3+((x*7)%5));q.fill();
 q.fillStyle='#e9ecf8';q.fillRect(HX0-34,EAVE-4,HX1-HX0+68,10);                                    // eave fascia
 // walls
 clap(q,HX0,EAVE,HX1-HX0,GROUND-EAVE,'#dcdbe2',3);
 const sh=q.createLinearGradient(0,EAVE,0,EAVE+60);sh.addColorStop(0,'rgba(30,30,60,.4)');sh.addColorStop(1,'rgba(30,30,60,0)');q.fillStyle=sh;q.fillRect(HX0,EAVE,HX1-HX0,60);
 q.fillStyle='#f2f0ea';q.fillRect(HX0-6,EAVE,12,GROUND-EAVE);q.fillRect(HX1-6,EAVE,12,GROUND-EAVE);   // corner boards
 // centre cross-gable with a little arched attic window
 const g0=CG.x-CG.w/2,g1=CG.x+CG.w/2;
 q.save();q.beginPath();q.moveTo(g0,EAVE+8);q.lineTo(CG.x,CG.peak+18);q.lineTo(g1,EAVE+8);q.closePath();q.clip();clap(q,g0,CG.peak,CG.w,EAVE-CG.peak+10,'#dcdbe2',5);q.restore();
 q.strokeStyle='#3a3f52';q.lineWidth=16;q.beginPath();q.moveTo(g0-22,EAVE+20);q.lineTo(CG.x,CG.peak);q.lineTo(g1+22,EAVE+20);q.stroke();
 q.strokeStyle='#f4f6ff';q.lineWidth=10;q.lineCap='round';q.beginPath();q.moveTo(g0-24,EAVE+12);q.lineTo(CG.x,CG.peak-8);q.lineTo(g1+24,EAVE+12);q.stroke();
 q.strokeStyle='#eceae4';q.lineWidth=5;q.beginPath();q.moveTo(g0-14,EAVE+22);q.lineTo(CG.x,CG.peak+10);q.lineTo(g1+14,EAVE+22);q.stroke();
 interior(q,CG.x-24,690,48,58,'shelf',21);q.strokeStyle='#f2f0ea';q.lineWidth=5;q.beginPath();q.moveTo(CG.x-24,748);q.lineTo(CG.x-24,712);q.arc(CG.x,712,24,Math.PI,0);q.lineTo(CG.x+24,748);q.closePath();q.stroke();
 q.beginPath();q.moveTo(CG.x,690);q.lineTo(CG.x,748);q.stroke();LIGHTS.push([CG.x,720,60,2]);
 // upstairs windows (the right one is the curtain window — drawn live)
 sash(q,218,830,86,124,'lamp',31);sash(q,377,810,86,124,'shelf',33);
 interior(q,536,830,86,124,'lamp',35);   // live curtains go over this one
 // porch: shed roof band with snow, posts, railings, floor, lattice, steps
 q.fillStyle='#3a3f52';q.beginPath();q.moveTo(HX0-30,PORCH_TOP+44);q.lineTo(HX0-10,PORCH_TOP);q.lineTo(HX1+10,PORCH_TOP);q.lineTo(HX1+30,PORCH_TOP+44);q.fill();
 q.fillStyle='#f4f6ff';q.beginPath();q.moveTo(HX0-34,PORCH_TOP+40);q.lineTo(HX0-14,PORCH_TOP-6);for(let x=HX0-14;x<=HX1+14;x+=16)q.lineTo(x,PORCH_TOP-8-Math.abs(Math.sin(x*0.07))*5);q.lineTo(HX1+34,PORCH_TOP+40);
 q.quadraticCurveTo(lerp(HX0,HX1,0.5),PORCH_TOP+34,HX0-34,PORCH_TOP+40);q.fill();
 q.fillStyle='#e9ecf8';q.fillRect(HX0-30,PORCH_TOP+40,HX1-HX0+60,10);
 // under the porch roof: the ground-floor rooms and the door (in shadow except their own light)
 q.fillStyle='rgba(20,20,45,.35)';q.fillRect(HX0,PORCH_TOP+50,HX1-HX0,PORCH_FLOOR-PORCH_TOP-50);
 interior(q,186,1112,170,150,'dining',41);LIGHTS.push([271,1187,190,1]);q.strokeStyle='#f2f0ea';q.lineWidth=8;q.strokeRect(186,1112,170,150);q.lineWidth=5;q.beginPath();q.moveTo(271,1112);q.lineTo(271,1262);q.moveTo(186,1187);q.lineTo(356,1187);q.stroke();
 q.fillStyle='#2f3a52';q.fillRect(156,1108,24,158);
 sash(q,512,1112,128,150,'living',45,false);
 // front door: deep green, half-glass, wreath, warm fanlight
 const dx=388,dy=1100,dw=64,dh=210;q.fillStyle='#ffd08a';q.beginPath();q.arc(dx+dw/2,dy,dw/2,Math.PI,0);q.fill();q.strokeStyle='#f2f0ea';q.lineWidth=5;q.stroke();
 q.fillStyle='#24453a';q.fillRect(dx,dy,dw,dh);interior(q,dx+12,dy+16,dw-24,60,'living',47);q.strokeStyle='#1a3029';q.lineWidth=3;q.strokeRect(dx+12,dy+16,dw-24,60);q.strokeRect(dx+12,dy+96,dw-24,90);
 q.strokeStyle='#f2f0ea';q.lineWidth=7;q.strokeRect(dx-4,dy-2,dw+8,dh+4);
 q.fillStyle='#c9a24a';ell(q,dx+dw-12,dy+122,4,4);q.fill();
 q.strokeStyle='#3d6a3f';q.lineWidth=9;ell(q,dx+dw/2,dy+120,17,17);q.stroke();q.fillStyle='#b23a30';q.fillRect(dx+dw/2-5,dy+132,10,8);
 LIGHTS.push([dx+dw/2,dy,70,4]);
 // porch light by the door (bracket lantern), lighting the door frame
 q.fillStyle='#2a2a2a';q.fillRect(dx+dw+14,dy+40,4,18);q.fillStyle='#1d1d22';q.fillRect(dx+dw+8,dy+56,16,26);q.fillStyle='#ffe2a4';q.fillRect(dx+dw+11,dy+60,10,18);LIGHTS.push([dx+dw+16,dy+68,110,5]);
 // posts and railing
 for(const px of [HX0-14,276,368,472,564,HX1+2]){q.fillStyle='#ecebe5';q.fillRect(px,PORCH_TOP+50,14,PORCH_FLOOR-PORCH_TOP-50);q.fillStyle='rgba(0,0,0,.12)';q.fillRect(px+10,PORCH_TOP+50,4,PORCH_FLOOR-PORCH_TOP-50);}
 for(const [a,b] of [[HX0-14,368],[472,HX1+16]]){q.fillStyle='#ecebe5';q.fillRect(a,1252,b-a,8);q.fillRect(a,1304,b-a,6);
  for(let x=a+14;x<b-6;x+=14){q.fillRect(x,1260,5,44);}
  q.fillStyle='#f6f8ff';q.beginPath();q.moveTo(a-2,1254);for(let x=a;x<=b;x+=12)q.lineTo(x,1247-Math.abs(Math.sin(x*0.09))*3);q.lineTo(b+2,1254);q.fill();}
 q.fillStyle='#bfbcc4';q.fillRect(HX0-20,PORCH_FLOOR,HX1-HX0+40,12);
 q.fillStyle='#2b2e40';q.fillRect(HX0-14,PORCH_FLOOR+12,HX1-HX0+28,GROUND-PORCH_FLOOR-12);
 q.strokeStyle='rgba(200,200,215,.35)';q.lineWidth=2;for(let x=HX0-10;x<HX1+20;x+=12){q.beginPath();q.moveTo(x,PORCH_FLOOR+12);q.lineTo(x+18,GROUND);q.moveTo(x+18,PORCH_FLOOR+12);q.lineTo(x,GROUND);q.stroke();}
 {q.save();q.filter='blur(7px)';const dg=q.createLinearGradient(0,GROUND-16,0,GROUND+46);dg.addColorStop(0,'#eef1fb');dg.addColorStop(0.45,'#dfe3f2');dg.addColorStop(1,'rgba(195,200,224,0)');q.fillStyle=dg;
  q.beginPath();q.moveTo(HX0-90,GROUND+30);q.quadraticCurveTo(HX0-60,GROUND-10,HX0-20,GROUND-12);for(let x=HX0-20;x<=HX1+20;x+=20)q.lineTo(x,GROUND-6-8*Math.abs(Math.sin(x*0.02)));
  q.quadraticCurveTo(HX1+40,GROUND-10,HX1+60,GROUND+30);q.quadraticCurveTo(lerp(HX0,HX1,0.5),GROUND+60,HX0-90,GROUND+30);q.fill();q.restore();}
 for(let i=0;i<3;i++){const sy=PORCH_FLOOR+12+i*18,sw=110+i*16;q.fillStyle='#d6d3da';q.fillRect(CG.x-sw/2,sy,sw,6);q.fillStyle='#9a97a4';q.fillRect(CG.x-sw/2,sy+6,sw,12);
  q.fillStyle='#f6f8ff';q.beginPath();q.moveTo(CG.x-sw/2,sy+1);q.quadraticCurveTo(CG.x-sw*0.3,sy-4,CG.x-sw*0.18,sy+1);q.fill();q.beginPath();q.moveTo(CG.x+sw*0.2,sy+1);q.quadraticCurveTo(CG.x+sw*0.34,sy-4,CG.x+sw/2,sy+1);q.fill();}
 // pumpkins on the steps, dusted with snow, sitting on the treads
 for(const [x,y,r,c] of [[CG.x-62,1328,13,'#d8742a'],[CG.x+60,1346,16,'#c9661f'],[CG.x+44,1350,10,'#e0943a']]){q.fillStyle='rgba(0,0,0,.3)';ell(q,x+2,y+r*0.85,r*1.1,3);q.fill();
  const pg=q.createRadialGradient(x-r*0.3,y-r*0.3,1,x,y,r*1.2);pg.addColorStop(0,c);pg.addColorStop(1,'#7a3a12');q.fillStyle=pg;ell(q,x,y,r*1.15,r*0.85);q.fill();
  q.strokeStyle='rgba(90,40,10,.5)';q.lineWidth=1.2;for(const k of [-0.5,0,0.5]){q.beginPath();q.ellipse(x+k*r*0.5,y,r*0.35,r*0.82,0,0,6.28);q.stroke();}
  q.fillStyle='#4a5a2a';q.fillRect(x-1.5,y-r*0.85-5,3,6);q.fillStyle='#f6f8ff';ell(q,x-r*0.2,y-r*0.7,r*0.55,r*0.18);q.fill();}
 // a soft snow drift banking against the lattice and the house corners
}

// ---------------- the barn + silo ----------------
function barn(q){const {x0,x1,top,ground,peak}=BARN,cx=(x0+x1)/2,w=x1-x0;
 // gambrel gable wall (red boards) with the roof seen only as thin snow-capped rakes along its edges
 const rp=[[x0-6,top],[x0+22,top-80],[cx,peak],[x1-22,top-80],[x1+6,top]];
 q.save();q.beginPath();rp.forEach((p,i)=>i?q.lineTo(...p):q.moveTo(...p));q.closePath();q.clip();q.fillStyle='#8a2f2a';q.fillRect(x0-10,peak,w+20,top-peak+4);
 for(let x=x0+2;x<x1;x+=12){q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x,peak,2,top-peak);}q.restore();
 q.lineJoin='round';q.strokeStyle='#45313a';q.lineWidth=14;q.beginPath();rp.forEach((p,i)=>i?q.lineTo(...p):q.moveTo(...p));q.stroke();
 q.strokeStyle='#eef1fc';q.lineWidth=9;q.beginPath();rp.forEach((p,i)=>i?q.lineTo(p[0],p[1]-7):q.moveTo(p[0],p[1]-7));q.stroke();
 q.fillStyle='#eef1fc';for(const [px,py] of [[x0-8,top-4],[x1+8,top-4]]){ell(q,px,py,10,5);q.fill();}
 // red board-and-batten walls with white trim
 q.fillStyle='#8a2f2a';q.fillRect(x0,top-2,w,ground-top+2);for(let x=x0+8;x<x1;x+=12){q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x,top,2,ground-top);}
  q.strokeStyle='#efece6';q.lineWidth=5;q.strokeRect(x0+2,top+2,w-4,ground-top-4);
 // hayloft door + big X-braced doors
 q.fillStyle='#6e241f';q.fillRect(cx-24,top-62,48,50);q.strokeRect(cx-24,top-62,48,50);q.beginPath();q.moveTo(cx-24,top-62);q.lineTo(cx+24,top-12);q.moveTo(cx+24,top-62);q.lineTo(cx-24,top-12);q.stroke();
 const d0=cx-58,d1=cx+58,dt=ground-128;q.fillStyle='#7a2925';q.fillRect(d0,dt,d1-d0,ground-dt);q.strokeRect(d0,dt,d1-d0,ground-dt);q.beginPath();q.moveTo(cx,dt);q.lineTo(cx,ground);
 for(const [a,b] of [[d0,cx],[cx,d1]]){q.moveTo(a,dt);q.lineTo(b,ground);q.moveTo(b,dt);q.lineTo(a,ground);}q.stroke();
 // lantern bracket over the doors (lantern itself is live)
 q.fillStyle='#222';q.fillRect(cx-3,dt-74,6,10);q.fillRect(cx-3,dt-74,26,4);
 // snow banked at the barn's foot
 {const dg=q.createLinearGradient(0,ground-12,0,ground+34);dg.addColorStop(0,'#eef1fb');dg.addColorStop(0.5,'#dce1f0');dg.addColorStop(1,'rgba(195,200,224,0)');q.fillStyle=dg;q.save();q.filter='blur(2px)';q.beginPath();q.moveTo(x0-40,ground+34);for(let x=x0-40;x<=x1+40;x+=18)q.lineTo(x,ground-4-6*Math.abs(Math.sin(x*0.05)));q.lineTo(x1+40,ground+34);q.fill();q.restore();}}

// ---------------- ground, drive, cars, fence ----------------
function car(q,x,y,w,col,seed,facing=1){const h=w*0.32,r=rng(seed);q.save();q.translate(x,y);q.scale(facing,1);
 q.fillStyle='rgba(10,12,30,.35)';q.filter='blur(4px)';ell(q,0,2,w*0.55,7);q.fill();q.filter='none';
 // body
 const bg=q.createLinearGradient(0,-h,0,0);bg.addColorStop(0,col);bg.addColorStop(1,shade(col,0.55));q.fillStyle=bg;
 q.beginPath();q.moveTo(-w/2,-h*0.25);q.quadraticCurveTo(-w/2,-h*0.62,-w*0.42,-h*0.62);q.lineTo(-w*0.24,-h*0.66);q.lineTo(-w*0.12,-h);q.lineTo(w*0.26,-h);q.lineTo(w*0.38,-h*0.64);
 q.quadraticCurveTo(w/2,-h*0.6,w/2,-h*0.28);q.lineTo(w/2,-h*0.12);q.lineTo(-w/2,-h*0.12);q.closePath();q.fill();
 // windows (dark, catching the house's warm light)
 const wg=q.createLinearGradient(-w*0.2,0,w*0.3,0);wg.addColorStop(0,'#1a1e30');wg.addColorStop(1,'#3a3040');q.fillStyle=wg;
 q.beginPath();q.moveTo(-w*0.2,-h*0.66);q.lineTo(-w*0.1,-h*0.93);q.lineTo(w*0.06,-h*0.93);q.lineTo(w*0.06,-h*0.66);q.fill();
 q.beginPath();q.moveTo(w*0.1,-h*0.66);q.lineTo(w*0.1,-h*0.93);q.lineTo(w*0.24,-h*0.93);q.lineTo(w*0.34,-h*0.66);q.fill();
 q.fillStyle='rgba(255,200,140,.25)';q.fillRect(-w*0.08,-h*0.9,w*0.04,h*0.2);
 // snow on roof, bonnet and boot (soft rounded caps)
 q.fillStyle='#f4f6ff';q.beginPath();q.moveTo(-w*0.13,-h*0.98);q.quadraticCurveTo(w*0.07,-h*1.16,w*0.27,-h*0.98);q.closePath();q.fill();
 q.beginPath();q.moveTo(-w*0.5,-h*0.55);q.quadraticCurveTo(-w*0.38,-h*0.74,-w*0.22,-h*0.66);q.lineTo(-w*0.48,-h*0.6);q.closePath();q.fill();
 q.beginPath();q.moveTo(w*0.36,-h*0.65);q.quadraticCurveTo(w*0.45,-h*0.74,w*0.5,-h*0.52);q.closePath();q.fill();
 // wheels, door line, lights
 for(const wx of [-w*0.3,w*0.3]){q.fillStyle='#14151c';ell(q,wx,-h*0.1,w*0.1,w*0.1);q.fill();q.fillStyle='#55596a';ell(q,wx,-h*0.1,w*0.045,w*0.045);q.fill();}
 q.strokeStyle='rgba(0,0,0,.3)';q.lineWidth=1.2;q.beginPath();q.moveTo(w*0.08,-h*0.64);q.lineTo(w*0.08,-h*0.18);q.stroke();
 q.fillStyle='#e8d8b0';q.fillRect(-w*0.5,-h*0.42,6,6);q.fillStyle='#7a1a1a';q.fillRect(w*0.5-5,-h*0.44,5,7);
 // snow banked against the tyres

 q.restore();}
function shade(hex,k){const n=parseInt(hex.slice(1),16);const f=v=>clamp(Math.round(v*k),0,255);return `rgb(${f(n>>16)},${f((n>>8)&255)},${f(n&255)})`;}
function pine(q,x,y,h,dark){const r=rng(x|0);q.fillStyle=dark;q.beginPath();q.moveTo(x,y-h);q.lineTo(x+h*0.26,y);q.lineTo(x-h*0.26,y);q.fill();
 for(let k=0;k<5;k++){const ty=y-h+h*(0.12+k*0.18),tw=h*(0.08+k*0.05);q.fillStyle='#eef1fb';for(let j=0;j<4;j++){const u=r()*2-1;if(Math.abs(u)>0.9)continue;ell(q,x+u*tw*0.8,ty+Math.abs(u)*6+r()*4,tw*(0.18+r()*0.16),3+r()*3);q.fill();}}}
function groundPaint(q){
 // yard: deep fresh snow, cool blue in the shadows, gently rolling
 const g=q.createLinearGradient(0,1200,0,H);g.addColorStop(0,'#c3c8e0');g.addColorStop(0.4,'#b1b7d4');g.addColorStop(1,'#8c93b8');q.fillStyle=g;
 q.beginPath();q.moveTo(0,1230);q.quadraticCurveTo(300,1200,620,1250);q.quadraticCurveTo(860,1280,W,1240);q.lineTo(W,H);q.lineTo(0,H);q.fill();
 const r=rng(77);q.save();q.filter='blur(6px)';for(let i=0;i<40;i++){const x=r()*W,y=1380+r()*520;q.fillStyle=`rgba(${r()<0.5?'255,255,255':'110,118,160'},.10)`;ell(q,x,y,80+r()*160,8+r()*12);q.fill();}q.restore();
 // mid-distance pines between house and barn, and a pair at the far left
 for(const [x,y,h] of [[712,1250,190],[742,1262,150],[40,1262,230],[96,1270,170]])pine(q,x,y,h,'#22303a');
 // drive: two tyre ruts curving from the bottom right up to the barn yard
 q.strokeStyle='rgba(120,128,165,.45)';q.lineWidth=14;q.lineCap='round';
 for(const o of [-34,34]){q.beginPath();q.moveTo(895+o*1.3,H);q.bezierCurveTo(895+o*1.1,1700,900+o*0.85,1580,905+o*0.75,1500);q.stroke();}
 // a path of footprints from the steps down across the yard (paired prints)
 for(let i=0;i<24;i++){const u=i/23,x=lerp(CG.x,880,u*u*0.4+u*0.6)+Math.sin(u*4)*14,y=lerp(1384,1900,u),s=lerp(0.7,1.6,u),side=i%2?1:-1;
  q.fillStyle='rgba(100,108,150,.42)';ell(q,x+side*8*s,y,4.6*s,8*s);q.fill();q.fillStyle='rgba(100,108,150,.25)';ell(q,x+side*8*s,y-9*s,3.6*s,4*s);q.fill();}
}
function mailbox(q){const x=745,y=1790;q.fillStyle='rgba(20,24,50,.3)';q.save();q.filter='blur(4px)';ell(q,x+10,y+4,40,8);q.fill();q.restore();
 q.fillStyle='#5a4638';q.fillRect(x-6,y-120,12,124);q.fillStyle='#3d4250';q.beginPath();q.moveTo(x-44,y-120);q.lineTo(x+40,y-120);q.lineTo(x+40,y-168);q.arc(x-2,y-168,42,0,Math.PI,true);q.closePath();q.fill();
 q.fillStyle='rgba(255,255,255,.1)';q.fillRect(x-40,y-170,8,48);q.fillStyle='#b23a30';q.fillRect(x+40,y-176,5,40);q.fillRect(x+40,y-176,20,12);
 q.fillStyle='#f4f6ff';q.beginPath();q.moveTo(x-48,y-168);q.arc(x-2,y-168,46,Math.PI,0);q.quadraticCurveTo(x-2,y-196,x-48,y-168);q.fill();
 q.strokeStyle='#3d6a3f';q.lineWidth=6;ell(q,x-2,y-142,13,13);q.stroke();q.fillStyle='#b23a30';q.fillRect(x-6,y-133,8,6);}
function bigPine(q){const x=40,y=1900,h=700,r=rng(5);
 for(let k=0;k<9;k++){const ty=y-h+k*h*0.105,tw=h*(0.06+k*0.03),th=h*0.16;q.fillStyle=k%2?'#1d2a32':'#22323b';
  q.beginPath();q.moveTo(x,ty-th*0.4);q.quadraticCurveTo(x+tw*0.5,ty+th*0.3,x+tw,ty+th*0.75);q.quadraticCurveTo(x,ty+th*0.55,x-tw,ty+th*0.75);q.quadraticCurveTo(x-tw*0.5,ty+th*0.3,x,ty-th*0.4);q.fill();
  q.fillStyle='#e6eaf6';q.filter='blur(1.5px)';for(let j=0;j<6;j++){const u=r()*2-1;const sx=x+u*tw*0.85,sy=ty+th*(0.15+Math.abs(u)*0.5)+r()*8;ell(q,sx,sy,tw*(0.08+r()*0.1),4+r()*4);q.fill();}q.filter='none';}}
function fence(q){ // split-rail fence across the foreground with snow on the rails and post tops
 const y=1640,G0=815,G1=975;for(let x=-30;x<W+60;x+=150){if(x>G0-10&&x<G1+10)continue;q.fillStyle='#5a4638';q.fillRect(x,y-110,16,140);q.fillStyle='#f4f6ff';ell(q,x+8,y-112,11,5);q.fill();}
 for(const [ax,bx] of [[-30,G0+8],[G1,W+60]])for(const ry0 of [y-86,y-40]){const yy=x=>ry0+(x+30)/(W+90)*10;q.fillStyle='#6b5444';q.beginPath();q.moveTo(ax,yy(ax));q.lineTo(bx,yy(bx));q.lineTo(bx,yy(bx)+10);q.lineTo(ax,yy(ax)+10);q.fill();
  q.fillStyle='#f4f6ff';q.beginPath();q.moveTo(ax,yy(ax)+1);for(let x=ax;x<=bx;x+=24)q.lineTo(x,yy(x)-4-Math.abs(Math.sin(x*0.05))*2);q.lineTo(bx,yy(bx)+1);q.fill();}
 for(const gx of [G0,G1]){q.fillStyle='#5a4638';q.fillRect(gx-10,y-124,20,156);q.fillStyle='#f4f6ff';ell(q,gx,y-126,13,6);q.fill();}
 q.fillStyle='#e6eaf6';q.beginPath();q.moveTo(0,y+30);for(let x=0;x<=W;x+=30)q.lineTo(x,y+18-8*Math.abs(Math.sin(x*0.013)));q.lineTo(W,H);q.lineTo(0,H);q.fill();}

function buildStatic(){{const [c,q]=off();skyPaint(q);SKY=c;}
 const [c,q]=off();groundPaint(q);barn(q);
 for(const [x,y,w,col,s,f] of [[1075,1385,250,'#2f5a46',4,-1],[880,1392,250,'#7a2a2a',1,1],[860,1500,300,'#33506e',2,-1]])car(q,x,y,w,col,s,f);
 farmhouse(q);STATIC=c;}

// ---------------- live layers ----------------
function lightPools(t){ // warm light from the windows lying on the snow (soft, blurred)
 for(const [x,y,w] of [[271,1400,220],[576,1400,170],[420,1420,130]]){const fl=0.92+0.05*Math.sin(WK(31)*t+x)+0.03*Math.sin(WK(47)*t);
  const g=X.createRadialGradient(x,y,4,x,y,w);g.addColorStop(0,`rgba(255,190,120,${0.5*fl})`);g.addColorStop(1,'rgba(255,190,120,0)');X.save();X.translate(x,y);X.scale(1,0.28);X.translate(-x,-y);X.fillStyle=g;X.fillRect(x-w,y-w,w*2,w*2);X.restore();}}
function glow(t){X.save();X.globalCompositeOperation='lighter';for(const [x,y,rad,ph] of LIGHTS){const fl=0.85+0.08*Math.sin(WK(40)*t+ph)+0.07*Math.sin(WK(73)*t+ph*2);
 const g=X.createRadialGradient(x,y,2,x,y,rad);g.addColorStop(0,`rgba(255,170,90,${0.16*fl})`);g.addColorStop(1,'rgba(255,170,90,0)');X.fillStyle=g;X.fillRect(x-rad,y-rad,rad*2,rad*2);}X.restore();}
// upstairs right window: someone draws the curtain back at 7.6 s to watch the snow, and lets it fall again at 16 s
const CW={x:536,y:830,w:86,h:124};
function curtainWindow(t){const {x,y,w,h}=CW;const open=ease((t-7.6)/1.4)*(1-ease((t-16)/1.6));
 // a figure's soft shadow appears behind the glass only while the curtain is open (no detail, just a silhouette of shoulders)
 if(open>0.05){X.save();X.beginPath();X.rect(x,y,w/2,h);X.clip();X.globalAlpha=open;const hx=x+w*0.3,hy=y+h*0.4;
  X.fillStyle='#3a2620';X.beginPath();X.moveTo(hx-12,hy-4);X.quadraticCurveTo(hx-14,hy+30,hx-20,y+h*0.72);X.lineTo(hx+12,y+h*0.72);X.quadraticCurveTo(hx+14,hy+20,hx+12,hy-4);X.fill();
  X.fillStyle='#7a5a6e';X.beginPath();X.moveTo(x+2,y+h);X.quadraticCurveTo(x+4,y+h*0.66,hx,y+h*0.62);X.quadraticCurveTo(x+w*0.5,y+h*0.64,x+w*0.5,y+h*0.7);X.lineTo(x+w*0.5,y+h);X.fill();
  X.fillStyle='#2e1e1a';X.beginPath();X.ellipse(hx,hy,11,13,0,0,6.28);X.fill();
  X.strokeStyle='rgba(255,210,150,.6)';X.lineWidth=1.4;X.beginPath();X.ellipse(hx,hy,11,13,0,-1.2,1.0);X.stroke();X.restore();}
 // two curtain panels (cream linen) — the left one is gathered back as she opens it
 const lw=lerp(w*0.52,w*0.14,open);const sw=Math.sin(WK(2)*t)*1.2;
 for(const [x0,ww,dir] of [[x,lw,1],[x+w-w*0.5,w*0.5,-1]]){const g=X.createLinearGradient(x0,0,x0+ww,0);g.addColorStop(0,'rgba(255,236,205,.92)');g.addColorStop(1,'rgba(235,200,160,.92)');X.fillStyle=g;
  X.beginPath();X.moveTo(x0,y);X.lineTo(x0+ww,y);X.quadraticCurveTo(x0+ww+sw*dir,y+h*0.6,x0+ww+(dir>0?-ww*0.1*open:0),y+h);X.lineTo(x0,y+h);X.closePath();X.fill();
  if(dir>0&&open>0.05){X.fillStyle='#e8b896';X.beginPath();X.ellipse(x0+ww+1,y+h*0.52,3.2,5,0.2,0,6.28);X.fill();}
  X.strokeStyle='rgba(180,120,80,.25)';X.lineWidth=1.2;for(let k=1;k<4;k++){const fx=x0+ww*k/4;X.beginPath();X.moveTo(fx,y+2);X.quadraticCurveTo(fx+sw,y+h*0.5,fx-(dir>0?ww*0.06*open:0),y+h-2);X.stroke();}}
 // frame + mullions + sill over the top
 X.fillStyle='#2f3a52';X.fillRect(x-30,y-4,24,h+8);X.fillRect(x+w+6,y-4,24,h+8);
 X.strokeStyle='#f2f0ea';X.lineWidth=8;X.strokeRect(x,y,w,h);X.lineWidth=5;X.beginPath();X.moveTo(x,y+h/2);X.lineTo(x+w,y+h/2);X.moveTo(x+w/2,y);X.lineTo(x+w/2,y+h);X.stroke();
 X.fillStyle='#e8e6e0';X.fillRect(x-10,y+h+2,w+20,9);X.fillStyle='#f6f8ff';X.beginPath();X.moveTo(x-12,y+h+4);X.bezierCurveTo(x+w*0.2,y+h-6,x+w*0.7,y+h-5,x+w+12,y+h+4);X.lineTo(x+w+12,y+h+6);X.lineTo(x-12,y+h+6);X.fill();}
// porch string lights swagging between the posts, twinkling softly
function porchLights(t){const posts=[HX0-7,276+7,368+7,472+7,564+7,HX1+9];X.strokeStyle='rgba(30,26,30,.9)';X.lineWidth=1.4;
 for(let i=0;i<posts.length-1;i++){const a=posts[i],b=posts[i+1],y0=PORCH_TOP+56;X.beginPath();for(let k=0;k<=16;k++){const u=k/16,x=lerp(a,b,u),y=y0+Math.sin(u*Math.PI)*18;k?X.lineTo(x,y):X.moveTo(x,y);}X.stroke();
  for(let k=1;k<8;k++){const u=k/8,x=lerp(a,b,u),y=y0+Math.sin(u*Math.PI)*18+5,tw=0.75+0.25*Math.sin(WK(7+((i*3+k)%5))*t+k*1.7+i);
   const g=X.createRadialGradient(x,y,0,x,y,16);g.addColorStop(0,`rgba(255,200,120,${0.5*tw})`);g.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=g;X.fillRect(x-16,y-16,32,32);
   X.fillStyle=`rgba(255,236,190,${0.75+0.25*tw})`;ell(X,x,y,2.2,3.2);X.fill();}}}
// barn lantern on its bracket, swaying with the gusts, with a warm pool on the snow under the doors
function barnLantern(t){const cx=(BARN.x0+BARN.x1)/2,dt=BARN.ground-128;const px=cx+20,py=dt-70;const a=0.06*Math.sin(WK(3)*t)*gust(t)+0.02*Math.sin(WK(7)*t);
 const pool=X.createRadialGradient(cx,BARN.ground+6,4,cx,BARN.ground+6,120);pool.addColorStop(0,'rgba(255,190,110,.4)');pool.addColorStop(1,'rgba(255,190,110,0)');X.save();X.translate(cx,BARN.ground+6);X.scale(1,0.25);X.fillStyle=pool;X.beginPath();X.arc(0,0,120,0,6.28);X.fill();X.restore();
 X.save();X.translate(px,py);X.rotate(a);X.strokeStyle='#222';X.lineWidth=1.5;X.beginPath();X.moveTo(0,0);X.lineTo(0,10);X.stroke();
 const g=X.createRadialGradient(0,22,2,0,22,70);g.addColorStop(0,'rgba(255,200,120,.55)');g.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=g;X.fillRect(-70,-48,140,140);
 X.fillStyle='#1d1d22';X.fillRect(-8,10,16,4);X.fillRect(-7,32,14,4);X.fillStyle='#ffe3a6';X.fillRect(-6,14,12,18);X.strokeStyle='#1d1d22';X.lineWidth=1.5;X.strokeRect(-6,14,12,18);
 X.fillStyle='#f4f6ff';X.beginPath();X.moveTo(-9,10);X.quadraticCurveTo(0,4,9,10);X.fill();X.restore();}
function smoke(t){for(const [cx,cy] of CHIM){for(let i=0;i<34;i++){const p=((t/5+i/34)%1);const G=gust(t);const sx=cx+p*p*150*G+Math.sin(p*7+i*0.7+WK(1)*t)*10*p,sy=cy-6-p*360;const rr=8+p*52;
 const g=X.createRadialGradient(sx,sy,0,sx,sy,rr);const a=0.13*Math.min(1,0.35+p*5)*(1-p);g.addColorStop(0,`rgba(205,208,228,${a})`);g.addColorStop(1,'rgba(205,208,228,0)');X.fillStyle=g;X.fillRect(sx-rr,sy-rr,rr*2,rr*2);}}}
const R0=rng(91);const FL=[...Array(560)].map(()=>({x:R0(),y:R0(),z:R0(),ph:R0()*6.28}));
function snow(t,front){for(const f of FL){const isFront=f.z>0.965;if(isFront!==front)continue;
 const n=f.z<0.45?1:(f.z<0.8?2:3);const span=H+60;const y=((f.y*span+t*span*n/LOOP)%span)-30;
 const x=f.x*W+Math.sin(WK(n+1)*t+f.ph)*(14+f.z*26)+Math.sin(WK(1)*t)*10*gust(t);
 const r=front?3.2+f.z*2.5:0.9+f.z*2.6;const a=front?0.55:0.45+f.z*0.45;
 if(front){const g=X.createRadialGradient(x,y,0,x,y,r*1.6);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(0.55,`rgba(240,245,255,${a*0.6})`);g.addColorStop(1,'rgba(240,245,255,0)');X.fillStyle=g;X.beginPath();X.arc(x,y,r*1.6,0,6.28);X.fill();}
 else{X.fillStyle=`rgba(245,248,255,${a})`;X.beginPath();X.arc(x,y,r,0,6.28);X.fill();}}}
let FENCE=null;
function grade(t){const v=X.createRadialGradient(W/2,H*0.55,H*0.3,W/2,H*0.55,H*0.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,8,22,.5)');X.fillStyle=v;X.fillRect(0,0,W,H);
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(120,150,230,.10)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.04;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function caption(t){if(t>6.4)return;const a=Math.min(1,0.45+t/1.0)*Math.max(0,Math.min(1,(6.2-t)/1.5));
 X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*6,y=250;const bl=Math.max(0,(t-4.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
 X.font="italic 500 76px Corm, serif";X.shadowColor='rgba(255,200,150,.5)';X.shadowBlur=28;X.fillStyle='#fbf7f2';
 const C1=(window.CAP||['everyone made it','home tonight']);for(let k=0;k<2;k++){X.fillText(C1[0],x,y);X.fillText(C1[1],x,y+88);X.shadowBlur=0;}
 X.filter='none';X.globalAlpha=a*0.6;X.strokeStyle='#fbf7f2';X.lineWidth=1.5;X.beginPath();X.moveTo(x-55,y+146);X.lineTo(x+55,y+146);X.stroke();X.restore();}
window.draw=function(t){if(!STATIC){buildStatic();const [c,q]=off();fence(q);mailbox(q);bigPine(q);FENCE=c;}
 const tc=t-(window.TOFF||0);const z=1.12+0.03*(1-Math.cos(WK(1)*t))/2,Fx=560+16*Math.sin(WK(1)*t),Fy=1290;const ox=S*(Fx-Fx*z),oy=S*(Fy-Fy*z);
 X.setTransform(1,0,0,1,0,0);const zs=1+(z-1)*0.5,oxs=S*(Fx-Fx*zs),oys=S*(Fy-Fy*zs);X.setTransform(zs/1.12,0,0,zs/1.12,oxs,oys);X.drawImage(SKY,0,0);
 X.setTransform(z/1.12,0,0,z/1.12,ox,oy);X.drawImage(STATIC,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);smoke(t);lightPools(t);curtainWindow(t);glow(t);porchLights(t);barnLantern(t);snow(t,false);
 X.setTransform(z/1.12,0,0,z/1.12,ox,oy);X.drawImage(FENCE,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);snow(t,true);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(tc);};
draw(0);
