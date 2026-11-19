// safe space after dark — "first snow tonight, and i thought of you". Design space 1080x1920, rendered 1440x2560.
// She sits on a window seat with a knitted blanket round her shoulders (seen from behind), breathes on the cold glass
// and draws a small heart in the fog while the first snow falls on the street outside.
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
function off(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}
const gust=t=>0.5+0.3*Math.sin(t*0.37)+0.15*Math.sin(t*1.1+1)+0.05*Math.sin(t*2.9);
const WIN={x0:120,x1:960,y0:200,y1:1310,tr:470};           // window opening; transom (top lights) at tr
const LAMP={x:842,y:742};                                    // street lamp head, outside
const SK='#c48b67',SK_SH='#9a6649',SK_LT='#dba47f',HAIR='#2b1d19',HAIR_L='#5a3c2e';
// ---------------- static: the street outside ----------------
let OUT=null,ROOM=null;const SS=S*1.12;
function outside(q){
 const sky=q.createLinearGradient(0,WIN.y0,0,1150);sky.addColorStop(0,'#0a1124');sky.addColorStop(0.55,'#1b2747');sky.addColorStop(1,'#3a4566');q.fillStyle=sky;q.fillRect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,1150-WIN.y0);
 const r=rng(7);
 // low snow clouds, lit faintly orange by the town
 q.save();q.filter='blur(26px)';for(let i=0;i<14;i++){q.fillStyle=i%2?'rgba(70,78,110,.55)':'rgba(95,90,115,.45)';q.beginPath();q.ellipse(WIN.x0+r()*840,WIN.y0+40+r()*520,160+r()*200,40+r()*50,0,0,6.28);q.fill();}q.restore();
 // far hills under snow
 q.fillStyle='#55607e';q.beginPath();q.moveTo(WIN.x0,1060);for(let x=WIN.x0;x<=WIN.x1;x+=20)q.lineTo(x,1000-Math.sin(x*0.006)*40-Math.sin(x*0.017)*14);q.lineTo(WIN.x1,1100);q.lineTo(WIN.x0,1100);q.fill();
 q.fillStyle='rgba(200,210,235,.25)';q.beginPath();q.moveTo(WIN.x0,1060);for(let x=WIN.x0;x<=WIN.x1;x+=20)q.lineTo(x,1004-Math.sin(x*0.006)*40-Math.sin(x*0.017)*14);q.lineTo(WIN.x1,1015);q.lineTo(WIN.x0,1015);q.fill();
 // far pines on the hill
 for(let i=0;i<40;i++){const x=WIN.x0+r()*840,b=1005-Math.sin(x*0.006)*40+r()*30,h=30+r()*40;pine(q,x,b,h,'#2c3550','rgba(215,225,245,.55)',r);}
 // houses across the street, roofs deep in snow
 const HS=[[100,180,150,'#38324a'],[262,150,120,'#2e3a4e'],[400,210,170,'#41363f'],[600,165,140,'#30394f'],[760,200,150,'#3b3348'],[900,140,110,'#2f3747']];
 for(const [x,w,h,col] of HS){const bx=WIN.x0+x-90,base=1140,top=base-h,rh=w*0.42;
  q.fillStyle=col;q.fillRect(bx,top,w,h);
  q.fillStyle='rgba(0,0,0,.22)';q.fillRect(bx+w*0.8,top,w*0.2,h);
  // chimney
  if(x%3){q.fillStyle='#2a2532';q.fillRect(bx+w*0.7,top-rh*0.9,22,rh*0.8);q.fillStyle='#e8eef9';q.beginPath();q.roundRect(bx+w*0.7-3,top-rh*0.9-7,28,10,5);q.fill();}
  // roof and its thick snow cap
  q.fillStyle='#262230';q.beginPath();q.moveTo(bx-14,top+4);q.lineTo(bx+w/2,top-rh);q.lineTo(bx+w+14,top+4);q.fill();
  const sg=q.createLinearGradient(0,top-rh,0,top+8);sg.addColorStop(0,'#f3f6fd');sg.addColorStop(1,'#b8c4de');q.fillStyle=sg;
  q.beginPath();q.moveTo(bx-18,top+8);q.quadraticCurveTo(bx-20,top-2,bx-8,top-4);q.lineTo(bx+w/2,top-rh-8);q.lineTo(bx+w+8,top-4);q.quadraticCurveTo(bx+w+20,top-2,bx+w+18,top+8);
  for(let k=0;k<=8;k++){q.lineTo(bx+w+18-k*(w+36)/8,top+8+(k%2?5:2));}q.closePath();q.fill();
  // warm windows with a little room inside
  const nw=w>160?3:2;for(let k=0;k<nw;k++){const wx=bx+w*(0.14+k*(0.72/nw))+4,wy=top+h*0.28,ww=w*0.18,wh=h*0.3;if((x+k)%5==3)continue;
   const g=q.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,'#ffd796');g.addColorStop(1,'#e98f4c');q.fillStyle=g;q.fillRect(wx,wy,ww,wh);
   q.fillStyle='rgba(120,60,40,.45)';q.fillRect(wx,wy+wh*0.72,ww,2);q.strokeStyle='#241e2a';q.lineWidth=3;q.strokeRect(wx,wy,ww,wh);q.beginPath();q.moveTo(wx+ww/2,wy);q.lineTo(wx+ww/2,wy+wh);q.stroke();
   q.fillStyle='#eef2fb';q.fillRect(wx-3,wy+wh,ww+6,4);
   const gl=q.createRadialGradient(wx+ww/2,wy+wh/2,2,wx+ww/2,wy+wh/2,ww*1.6);gl.addColorStop(0,'rgba(255,180,100,.22)');gl.addColorStop(1,'rgba(255,180,100,0)');q.fillStyle=gl;q.fillRect(wx-ww*1.6,wy-ww*1.6,ww*4.2,ww*4.2);}
  // door with a wreath of snow on the step
  if(x==400||x==760){const dx=bx+w*0.42,dw=w*0.17,dh=h*0.4;q.fillStyle='#5a3a2c';q.fillRect(dx,base-dh,dw,dh);q.fillStyle='#ffcf8a';q.fillRect(dx+dw*0.25,base-dh+6,dw*0.5,dh*0.18);q.fillStyle='#e9eef8';q.fillRect(dx-6,base-4,dw+12,6);
   q.strokeStyle='#3e5a3c';q.lineWidth=5;q.beginPath();q.arc(dx+dw/2,base-dh*0.62,dw*0.26,0,6.28);q.stroke();q.fillStyle='#b8323c';q.beginPath();q.arc(dx+dw/2,base-dh*0.62+dw*0.26,3,0,6.28);q.fill();}}
 // snowy pines between houses
 for(const [x,h] of [[WIN.x0+60,160],[WIN.x0+450,120],[WIN.x0+690,140]])pine(q,x,1150,h,'#1f2a33','#e4ebf7',rng(x));
 // snow-covered street and pavement
 const gg=q.createLinearGradient(0,1140,0,WIN.y1);gg.addColorStop(0,'#c3cde3');gg.addColorStop(1,'#8e9ab8');q.fillStyle=gg;q.fillRect(WIN.x0,1138,WIN.x1-WIN.x0,WIN.y1-1138);
 q.fillStyle='rgba(60,70,100,.18)';q.fillRect(WIN.x0,1182,WIN.x1-WIN.x0,3);   // kerb under the snow
 // fresh snow: soft drifts and sparkle, one set of footprints to a front door
 for(let i=0;i<14;i++){const x=WIN.x0+r()*840,y=1150+r()*150;const g=q.createRadialGradient(x,y,4,x,y,90);g.addColorStop(0,'rgba(240,244,255,.18)');g.addColorStop(1,'rgba(240,244,255,0)');q.fillStyle=g;q.beginPath();q.ellipse(x,y,110,22,0,0,6.28);q.fill();}
 for(let i=0;i<260;i++){q.fillStyle=`rgba(255,255,255,${0.2+r()*0.5})`;q.fillRect(WIN.x0+r()*840,1145+r()*165,1.4,1.4);}
 for(let k=0;k<11;k++){const u=k/10,fx=lerp(WIN.x0+560,WIN.x0+760-90+170*0.42+15,u),fy=lerp(1300,1146,u),s=lerp(1,0.45,u);q.fillStyle='rgba(80,90,125,.35)';q.beginPath();q.ellipse(fx+(k%2?6:-6)*s,fy,4.5*s,2.4*s,0,0,6.28);q.fill();}
 // street lamp (black iron) and its warm pool on the snow
 const pool=q.createRadialGradient(LAMP.x,1240,10,LAMP.x,1240,230);pool.addColorStop(0,'rgba(255,196,120,.75)');pool.addColorStop(1,'rgba(255,196,120,0)');q.fillStyle=pool;q.save();q.scale(1,0.35);q.beginPath();q.ellipse(LAMP.x,1240/0.35,240,240,0,0,6.28);q.fill();q.restore();
 q.fillStyle='#16141b';q.fillRect(LAMP.x-5,LAMP.y+30,10,1238-LAMP.y-30);q.fillRect(LAMP.x-11,1226,22,14);q.fillStyle='#e6ecf8';q.beginPath();q.ellipse(LAMP.x,1238,26,7,0,0,6.28);q.fill();q.fillStyle='#16141b';q.fillRect(LAMP.x-9,LAMP.y+26,18,8);
 q.beginPath();q.moveTo(LAMP.x-20,LAMP.y-12);q.lineTo(LAMP.x+20,LAMP.y-12);q.lineTo(LAMP.x+12,LAMP.y+26);q.lineTo(LAMP.x-12,LAMP.y+26);q.closePath();q.fill();
 q.fillStyle='#ffe2a8';q.beginPath();q.moveTo(LAMP.x-15,LAMP.y-6);q.lineTo(LAMP.x+15,LAMP.y-6);q.lineTo(LAMP.x+9,LAMP.y+22);q.lineTo(LAMP.x-9,LAMP.y+22);q.closePath();q.fill();
 q.fillStyle='#16141b';q.beginPath();q.moveTo(LAMP.x-26,LAMP.y-12);q.lineTo(LAMP.x,LAMP.y-30);q.lineTo(LAMP.x+26,LAMP.y-12);q.fill();
 q.fillStyle='#eef3fc';q.beginPath();q.moveTo(LAMP.x-27,LAMP.y-13);q.quadraticCurveTo(LAMP.x,LAMP.y-40,LAMP.x+27,LAMP.y-13);q.quadraticCurveTo(LAMP.x,LAMP.y-22,LAMP.x-27,LAMP.y-13);q.fill();  // snow on the lamp cap
 const lg=q.createRadialGradient(LAMP.x,LAMP.y+8,4,LAMP.x,LAMP.y+8,200);lg.addColorStop(0,'rgba(255,214,150,.6)');lg.addColorStop(0.3,'rgba(255,200,130,.18)');lg.addColorStop(1,'rgba(255,200,130,0)');q.fillStyle=lg;q.fillRect(LAMP.x-200,LAMP.y-200,400,400);
}
function pine(q,x,b,h,col,snow,r){for(let k=0;k<4;k++){const y=b-h*0.18-k*h*0.22,w=h*(0.42-k*0.08);q.fillStyle=col;q.beginPath();q.moveTo(x-w,y);q.lineTo(x,y-h*0.34);q.lineTo(x+w,y);q.closePath();q.fill();
 q.fillStyle=snow;q.beginPath();q.moveTo(x-w*0.85,y-h*0.03);q.lineTo(x-w*0.1,y-h*0.28);q.lineTo(x+w*0.5,y-h*0.1);q.quadraticCurveTo(x,y-h*0.02,x-w*0.85,y-h*0.03);q.fill();}
 q.fillStyle=col;q.fillRect(x-h*0.03,b-h*0.2,h*0.06,h*0.2);}
// ---------------- static: the room ----------------
function room(q){
 // wall, warmed by a lamp off to the left
 q.fillStyle='#211a24';q.fillRect(0,0,W,H);
 const wl=q.createRadialGradient(-120,900,60,-120,900,1050);wl.addColorStop(0,'rgba(255,170,100,.30)');wl.addColorStop(0.5,'rgba(220,130,90,.10)');wl.addColorStop(1,'rgba(220,130,90,0)');q.fillStyle=wl;q.fillRect(0,0,W,H);
 const r=rng(3);q.globalAlpha=0.05;for(let i=0;i<5000;i++){q.fillStyle=r()>0.5?'#fff':'#000';q.fillRect(r()*W,r()*H,2,2);}q.globalAlpha=1;
 // window reveal (deep wall around the window), lit on its left face
 const rv=q.createLinearGradient(WIN.x0-70,0,WIN.x0,0);rv.addColorStop(0,'#5e4740');rv.addColorStop(1,'#46363a');q.fillStyle=rv;
 q.beginPath();q.moveTo(WIN.x0-70,WIN.y0-70);q.lineTo(WIN.x0,WIN.y0);q.lineTo(WIN.x0,WIN.y1);q.lineTo(WIN.x0-70,WIN.y1+40);q.fill();
 q.fillStyle='#2c2230';q.beginPath();q.moveTo(WIN.x1+70,WIN.y0-70);q.lineTo(WIN.x1,WIN.y0);q.lineTo(WIN.x1,WIN.y1);q.lineTo(WIN.x1+70,WIN.y1+40);q.fill();
 q.fillStyle='#3b2e34';q.beginPath();q.moveTo(WIN.x0-70,WIN.y0-70);q.lineTo(WIN.x1+70,WIN.y0-70);q.lineTo(WIN.x1,WIN.y0);q.lineTo(WIN.x0,WIN.y0);q.fill();
}
function curtains(q){
 // curtains: heavy linen, tied back, warm on the left
 for(const [x0,x1,lit] of [[0,150,1],[930,1080,0]]){const g=q.createLinearGradient(x0,0,x1,0);
  if(lit){g.addColorStop(0,'#8a5a50');g.addColorStop(0.5,'#a8706a');g.addColorStop(1,'#6d4644');}else{g.addColorStop(0,'#3a2730');g.addColorStop(0.5,'#4a3038');g.addColorStop(1,'#2a1d24');}
  q.fillStyle=g;q.beginPath();q.moveTo(x0,60);q.lineTo(x1,60);q.bezierCurveTo(x1-10,500,lit?x1-70:x1+10,800,lit?x0+90:x0+20,1000);q.bezierCurveTo(lit?x0+110:x0+40,1100,lit?x1-30:x1-40,1250,lit?x1-10:x1-20,1320);q.lineTo(x0,1320);q.closePath();q.fill();
  q.strokeStyle=lit?'rgba(60,30,30,.35)':'rgba(10,5,10,.4)';q.lineWidth=3;for(let k=1;k<5;k++){const xx=x0+k*(x1-x0)/5;q.beginPath();q.moveTo(xx,60);q.bezierCurveTo(xx,400,xx+(lit?-30:20)*k/5,800,lit?x0+70+k*6:x0+30+k*8,1000);q.stroke();}
  }
 q.fillStyle='#1a1418';q.fillRect(0,46,W,14);q.fillStyle='#8a6a48';q.beginPath();q.arc(14,53,10,0,6.28);q.arc(W-14,53,10,0,6.28);q.fill();
}
// window frame (drawn over the outside + fog, under her)
function frame(q){
 const fc='#d9cfc4',fs='#9a8c88';
 q.save();
 const fw=30;const gl=q.createLinearGradient(WIN.x0,0,WIN.x1,0);gl.addColorStop(0,'#e8dccd');gl.addColorStop(1,'#a99c9a');
 q.fillStyle=gl;q.fillRect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,fw);q.fillRect(WIN.x0,WIN.y0,fw,WIN.y1-WIN.y0);q.fillRect(WIN.x1-fw,WIN.y0,fw,WIN.y1-WIN.y0);
 q.fillRect(WIN.x0,WIN.tr-12,WIN.x1-WIN.x0,26);  // transom
 for(const u of [1/3,2/3]){const x=lerp(WIN.x0,WIN.x1,u);q.fillRect(x-8,WIN.y0,16,WIN.tr-WIN.y0);}
 q.fillStyle='rgba(0,0,0,.25)';q.fillRect(WIN.x0+fw,WIN.y0+fw,WIN.x1-WIN.x0-2*fw,4);q.fillRect(WIN.x0+fw,WIN.tr+14,WIN.x1-WIN.x0-2*fw,4);
 q.fillStyle='rgba(255,240,220,.35)';q.fillRect(WIN.x0,WIN.y0,4,WIN.y1-WIN.y0);q.fillRect(WIN.x0,WIN.tr-12,WIN.x1-WIN.x0,3);
 q.restore();}
// window seat: cushion on a deep ledge, panelled front, cushions, mug, candle, books
function seat(q){
 // seat top (receding to the glass) and cushion
 const top=q.createLinearGradient(0,WIN.y1,0,1440);top.addColorStop(0,'#8f8178');top.addColorStop(1,'#cbbcae');q.fillStyle=top;
 q.beginPath();q.moveTo(WIN.x0-70,WIN.y1+40);q.lineTo(WIN.x0,WIN.y1);q.lineTo(WIN.x1,WIN.y1);q.lineTo(WIN.x1+70,WIN.y1+40);q.lineTo(1080,1440);q.lineTo(0,1440);q.closePath();q.fill();
 // fabric texture + piping along the front edge
 const r=rng(21);q.globalAlpha=0.08;for(let i=0;i<2600;i++){q.fillStyle=r()>0.5?'#fff':'#5a4a40';q.fillRect(r()*W,WIN.y1+r()*130,2,1);}q.globalAlpha=1;
 const fr=q.createLinearGradient(0,1440,0,1500);fr.addColorStop(0,'#b9a99a');fr.addColorStop(1,'#7d6d63');q.fillStyle=fr;q.beginPath();q.roundRect(-10,1436,W+20,64,[0,0,22,22]);q.fill();
 q.strokeStyle='#e2d5c6';q.lineWidth=5;q.beginPath();q.moveTo(0,1438);q.lineTo(W,1438);q.stroke();q.strokeStyle='rgba(60,45,40,.4)';q.lineWidth=2;q.beginPath();q.moveTo(0,1443);q.lineTo(W,1443);q.stroke();
 // panelled base
 const pb=q.createLinearGradient(0,1500,0,H);pb.addColorStop(0,'#3d2f30');pb.addColorStop(1,'#1d1619');q.fillStyle=pb;q.fillRect(0,1500,W,H-1500);
 q.fillStyle='rgba(0,0,0,.45)';q.fillRect(0,1500,W,16);
 for(const x of [60,400,740]){q.strokeStyle='rgba(255,220,190,.10)';q.lineWidth=3;q.strokeRect(x,1570,280,260);q.strokeStyle='rgba(0,0,0,.4)';q.strokeRect(x+5,1575,280,260);}
 // dusty-rose square cushion leaning back into the corner of the reveal
 const cg=q.createLinearGradient(80,1170,280,1390);cg.addColorStop(0,'#c99694');cg.addColorStop(1,'#80525a');q.fillStyle=cg;
 q.beginPath();q.moveTo(92,1376);q.quadraticCurveTo(70,1290,96,1182);q.quadraticCurveTo(170,1166,262,1168);q.quadraticCurveTo(290,1270,280,1382);q.quadraticCurveTo(190,1398,92,1376);q.fill();
 
 q.fillStyle='rgba(255,220,210,.07)';q.beginPath();q.ellipse(150,1215,42,16,-0.3,0,6.28);q.fill();
 q.strokeStyle='#e3c4bd';q.lineWidth=3;q.beginPath();q.moveTo(92,1376);q.quadraticCurveTo(70,1290,96,1182);q.quadraticCurveTo(170,1166,262,1168);q.quadraticCurveTo(290,1270,280,1382);q.quadraticCurveTo(190,1398,92,1376);q.stroke();
 // books under the candle
 for(const [y,h,col,dx] of [[1392,22,'#5a6b7c',0],[1371,21,'#8a4c45',6],[1352,19,'#c8b48a',-4]]){q.fillStyle=col;q.beginPath();q.roundRect(792+dx,y,150,h,3);q.fill();q.fillStyle='rgba(255,250,235,.7)';q.fillRect(796+dx,y+3,144,3);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(792+dx,y+h-3,150,3);}
 q.fillStyle='rgba(0,0,0,.35)';q.beginPath();q.ellipse(868,1416,90,9,0,0,6.28);q.fill();
}
function buildStatic(){
 const [oc,oq]=off(1440*1.12|0,2560*1.12|0);oq.scale(SS,SS);outside(oq);OUT=oc;
 const [rc,rq]=off(1440*1.12|0,2560*1.12|0);rq.scale(SS,SS);room(rq);
 rq.save();rq.beginPath();rq.rect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0);rq.globalCompositeOperation='destination-out';rq.fill();rq.restore();curtains(rq);ROOM=rc;}
// ---------------- timeline ----------------
// 0–3.4 still, watching the snow · 3.4–4.6 turns a little and breathes on the glass · 4.7–5.3 lifts her hand
// 5.3–8.1 draws a heart in the fog · 8.2–9.0 hand back under the blanket · 9+ rests, heart slowly fades with the fog
const HC={x:640,y:805,s:3.3};
function heartPt(u,side){const a=u*Math.PI;const x=16*Math.pow(Math.sin(a),3),y=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);return [HC.x+side*x*HC.s,HC.y-y*HC.s+2*HC.s];}
const D1=[5.35,6.65],D2=[6.9,8.15];
function tip(t){ // fingertip position, and whether it touches the glass
 const rest=[600,1040];
 if(t<4.7||t>9.0)return null;
 if(t<5.35){const u=ease((t-4.7)/0.65);const s=heartPt(0,-1);return {p:[lerp(rest[0],s[0],u),lerp(rest[1],s[1],u)+ (1-u)*0],on:false};}
 if(t<D1[1]){const u=ease((t-D1[0])/(D1[1]-D1[0]));return {p:heartPt(u,-1),on:true};}
 if(t<D2[0]){const u=ease((t-D1[1])/(D2[0]-D1[1]));const a=heartPt(1,-1),b=heartPt(0,1);return {p:[lerp(a[0],b[0],u),lerp(a[1],b[1],u)-Math.sin(u*Math.PI)*14],on:false};}
 if(t<D2[1]){const u=ease((t-D2[0])/(D2[1]-D2[0]));return {p:heartPt(u,1),on:true};}
 const u=ease((t-8.2)/0.8);const e=heartPt(1,1);return {p:[lerp(e[0],rest[0],u),lerp(e[1],rest[1],u)],on:false};}
const turnAt=t=>{let a=0;a+=8*ease((t-3.2)/0.8);a-=2*ease((t-9.2)/1.5);a+=1.2*Math.sin(t*0.6)*ease(t/2);return a*Math.PI/180;};
const fogAt=t=>{if(t<3.6)return 0;const grow=ease((t-3.6)/0.7);const fade=1-0.75*ease((t-9.5)/6.5);return grow*fade;};
const breathAt=t=>Math.sin(t*2*Math.PI/4.6);
const armUp=t=>t<4.7?0:t<5.3?ease((t-4.7)/0.6):t<8.2?1:1-ease((t-8.2)/0.8);
// ---------------- fog + heart on the glass ----------------
const [FC,FQ]=off(1440,2560);
// ---------------- falling snow (outside) ----------------
const R1=rng(31);const FL=[...Array(520)].map(()=>({x:R1(),y:R1(),z:R1(),ph:R1()*6.28}));
function snow(t){X.save();X.beginPath();X.rect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0);X.clip();
 const G=gust(t);
 for(const f of FL){const z=0.25+f.z*0.75,sp=40+z*90;let y=(f.y*(WIN.y1-WIN.y0+80)+t*sp)%(WIN.y1-WIN.y0+80)+WIN.y0-40;
  let x=WIN.x0+f.x*(WIN.x1-WIN.x0+200)-100+Math.sin(t*0.9*(0.6+z)+f.ph)*12*z+(y-WIN.y0)*0.22*G*z+t*16*G*z;
  x=((x-WIN.x0)%(WIN.x1-WIN.x0+200)+(WIN.x1-WIN.x0+200))%(WIN.x1-WIN.x0+200)+WIN.x0-100;
  const d=Math.hypot(x-LAMP.x,y-LAMP.y),lit=Math.max(0,1-d/230);
  const rr=0.8+z*2.6;X.fillStyle=lit>0?`rgba(255,${235-lit*25|0},${215-lit*60|0},${0.45+0.4*z+0.15*lit})`:`rgba(232,238,252,${0.30+0.45*z})`;
  X.beginPath();X.arc(x,y,rr*(1+lit*0.3),0,6.28);X.fill();}
 X.restore();}
// ---------------- glass: reflections of the room ----------------
function glass(t){X.save();X.beginPath();X.rect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0);X.clip();
 const g=X.createLinearGradient(WIN.x0,0,WIN.x0+420,0);g.addColorStop(0,'rgba(255,190,140,.10)');g.addColorStop(1,'rgba(255,190,140,0)');X.fillStyle=g;X.fillRect(WIN.x0,WIN.y0,420,WIN.y1-WIN.y0);
 // faint reflection of the candle flame, set back in the glass
 const fl=0.85+0.1*Math.sin(t*9.1)+0.05*Math.sin(t*23);const cg=X.createRadialGradient(866,1262,1,866,1262,34);cg.addColorStop(0,`rgba(255,200,130,${0.5*fl})`);cg.addColorStop(1,'rgba(255,200,130,0)');X.fillStyle=cg;X.fillRect(830,1226,72,72);
 X.fillStyle=`rgba(255,226,170,${0.35*fl})`;X.beginPath();X.ellipse(866,1266,2.5,6,0,0,6.28);X.fill();
 // condensation creeping in from the cold bottom corners of the pane
 for(const [cx,cy] of [[WIN.x0,WIN.y1],[WIN.x1,WIN.y1]]){const cgr=X.createRadialGradient(cx,cy,10,cx,cy,170);cgr.addColorStop(0,'rgba(210,220,240,.22)');cgr.addColorStop(1,'rgba(210,220,240,0)');X.fillStyle=cgr;X.fillRect(cx-170,cy-170,340,340);}
 X.restore();
 // snow banked against the outside of the bottom of the glass
 X.fillStyle='#dfe6f5';X.beginPath();X.moveTo(WIN.x0,WIN.y1);for(let x=WIN.x0;x<=WIN.x1;x+=12)X.lineTo(x,WIN.y1-8-Math.sin(x*0.03)*3-Math.sin(x*0.11)*2);X.lineTo(WIN.x1,WIN.y1);X.fill();}
// ---------------- her ----------------
const NECK=[432,948];
function arm(t){const k=armUp(t);if(k<=0)return;const T=tip(t);if(!T)return;const [fx,fy]=T.p;
 // forearm in a sage sweater sleeve, rising from behind her right shoulder (the rest of the arm is hidden by her body)
 const HS=1.3;const wx=fx+6*HS,wy=fy+92*HS;   // wrist (hand drawn 1.3x about it)
 const ex=lerp(575,clamp(fx-40,570,610),k),ey=lerp(1150,1060,k); // elbow (hidden behind the shoulder)
 const sg=X.createLinearGradient(wx-30,0,wx+30,0);sg.addColorStop(0,'#5d6e58');sg.addColorStop(0.5,'#8a9b80');sg.addColorStop(1,'#4f5f4b');
 X.strokeStyle=sg;X.lineCap='round';X.lineWidth=52;X.beginPath();X.moveTo(ex,ey);X.quadraticCurveTo(lerp(ex,wx,0.5)+10,lerp(ey,wy,0.5),wx,wy+16);X.stroke();
 X.strokeStyle='rgba(40,50,38,.35)';X.lineWidth=2;for(let i=0;i<4;i++){const u=0.3+i*0.18;const px=lerp(ex,wx,u)+6,py=lerp(ey,wy+16,u);X.beginPath();X.moveTo(px-20,py+4);X.quadraticCurveTo(px,py-2,px+22,py+3);X.stroke();}
 X.save();X.translate(wx,wy);X.scale(HS,HS);X.translate(-wx,-wy);const FX=wx+(fx-wx)/HS,FY=wy+(fy-wy)/HS;
 // ribbed cuff, pushed up a little
 X.fillStyle='#7d8e74';X.beginPath();X.ellipse(wx,wy+14,27,13,-0.15,0,6.28);X.fill();X.strokeStyle='rgba(40,50,38,.4)';X.lineWidth=1.4;for(let i=-3;i<=3;i++){X.beginPath();X.moveTo(wx+i*7,wy+4);X.lineTo(wx+i*7+1,wy+24);X.stroke();}
 // back of her right hand (palm to the glass): index finger straight up to the glass, the other three curled away, thumb on the left
 const hg=X.createLinearGradient(wx-26,wy,wx+26,wy-60);hg.addColorStop(0,SK_SH);hg.addColorStop(0.5,SK);hg.addColorStop(1,SK_LT);
 // thumb, angled up and out
 X.strokeStyle=SK_SH;X.lineCap='round';X.lineWidth=14;X.beginPath();X.moveTo(wx-14,wy-10);X.quadraticCurveTo(wx-28,wy-22,wx-31,wy-40);X.stroke();
 X.strokeStyle=SK;X.lineWidth=9;X.beginPath();X.moveTo(wx-13,wy-12);X.quadraticCurveTo(wx-25,wy-23,wx-28,wy-39);X.stroke();
 // back of the hand
 X.fillStyle=hg;X.beginPath();X.moveTo(wx-18,wy+8);X.bezierCurveTo(wx-24,wy-14,wx-22,wy-38,wx-17,wy-50);X.quadraticCurveTo(wx+2,wy-56,wx+22,wy-48);X.bezierCurveTo(wx+26,wy-30,wx+24,wy-8,wx+18,wy+8);X.closePath();X.fill();
 // three curled fingers: their backs rise a little above the knuckles, then fold away from us
 for(let i=0;i<3;i++){const kx=wx-1+i*9.6,ky=wy-50+i*1.6;const fg=X.createLinearGradient(kx-5,0,kx+5,0);fg.addColorStop(0,SK_SH);fg.addColorStop(0.5,SK_LT);fg.addColorStop(1,SK);
  X.fillStyle=fg;X.beginPath();X.roundRect(kx-4.8,ky-17+i*2,9.6,20,4.8);X.fill();X.strokeStyle='rgba(110,62,44,.45)';X.lineWidth=1;X.beginPath();X.moveTo(kx+4.8,ky-14+i*2);X.lineTo(kx+4.8,ky+2);X.stroke();}
 // index finger, straight with a gentle joint, tip resting on the glass
 const fg2=X.createLinearGradient(FX-8,0,FX+8,0);fg2.addColorStop(0,SK_LT);fg2.addColorStop(0.6,SK);fg2.addColorStop(1,SK_SH);
 X.strokeStyle=fg2;X.lineWidth=11;X.lineCap='round';X.beginPath();X.moveTo(wx-11,wy-46);X.quadraticCurveTo(FX-2,FY+24,FX,FY+5);X.stroke();
 X.strokeStyle='rgba(120,70,50,.45)';X.lineWidth=1.1;for(const v of [0.35,0.7]){const px=lerp(wx-11,FX,v),py=lerp(wy-46,FY+5,v);X.beginPath();X.moveTo(px-3.5,py);X.quadraticCurveTo(px,py-1.2,px+3.5,py);X.stroke();}
 // knuckle highlights
 X.fillStyle='rgba(255,226,205,.45)';for(let i=0;i<4;i++){X.beginPath();X.ellipse(wx-11+i*9.6,wy-47+i*1.2,3.2,2,0,0,6.28);X.fill();}
 // window light on the edge of her hand
 X.strokeStyle='rgba(190,205,240,.45)';X.lineWidth=2;X.beginPath();X.moveTo(wx+20,wy+4);X.bezierCurveTo(wx+26,wy-14,wx+28,wy-40,wx+22,wy-54);X.stroke();X.restore();}
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
 const g=X.createLinearGradient(250,960,710,1300);g.addColorStop(0,'#eee2cd');g.addColorStop(0.4,'#d6c6ad');g.addColorStop(0.8,'#a4927e');g.addColorStop(1,'#7c6c60');X.fillStyle=g;X.fill(P);
 X.save();X.clip(P);
 // knit texture: rows of small V stitches that follow the curve of her back
 for(let row=0;row<26;row++){const y0=1000+row*17;const bow=(1-row/26)*26;for(let c=0;c<30;c++){const x=262+c*15+(row%2)*7;const yy=y0+Math.pow((x-458)/220,2)*bow-bow*0.2;
  X.strokeStyle='rgba(105,85,66,.20)';X.lineWidth=1.6;X.beginPath();X.moveTo(x-5,yy-4);X.lineTo(x,yy+3);X.lineTo(x+5,yy-4);X.stroke();}}
 // folds hanging from the shoulder points and the elbows (soft shadow + light ridge)
 for(const [x0,y0,cx,cy,x1,y1,w,a] of [[300,1010,330,1180,300,1420,44,.08],[612,1012,580,1170,600,1430,48,.10],[648,1250,622,1340,640,1426,26,.08]]){
  X.strokeStyle=`rgba(70,52,40,${a})`;X.lineWidth=w;X.lineCap='round';X.beginPath();X.moveTo(x0,y0);X.quadraticCurveTo(cx,cy,x1,y1);X.stroke();
  }
 // spine hollow and the curve of her back
 const sp=X.createLinearGradient(420,0,500,0);sp.addColorStop(0,'rgba(70,52,40,0)');sp.addColorStop(0.5,'rgba(70,52,40,.10)');sp.addColorStop(1,'rgba(70,52,40,0)');X.fillStyle=sp;X.fillRect(420,980,80,330);
 // lamp warmth on her left shoulder, shading under the arms
 const wl=X.createRadialGradient(290,1010,10,290,1030,260);wl.addColorStop(0,'rgba(255,205,150,.32)');wl.addColorStop(1,'rgba(255,205,150,0)');X.fillStyle=wl;X.fillRect(150,900,420,520);
 const lo=X.createLinearGradient(0,1300,0,1440);lo.addColorStop(0,'rgba(60,40,30,0)');lo.addColorStop(1,'rgba(60,40,30,.25)');X.fillStyle=lo;X.fillRect(200,1300,520,140);
 X.restore();
 // cool window light along her right side
 X.strokeStyle='rgba(185,200,240,.42)';X.lineWidth=3;X.beginPath();X.moveTo(618,1007-k*18+b);X.bezierCurveTo(630,1028-k*18+b,634,1060-k*16,636,1095-k*14);X.bezierCurveTo(638,1130-k*10,650,1170,656,1210);X.stroke();
 // edge of the blanket lifted where her arm comes out (the inside of the knit shows)
if(false){X.fillStyle=`rgba(120,104,88,${k})`;X.beginPath();X.moveTo(566,975-k*12+b);X.quadraticCurveTo(598,986-k*20+b,614,1004-k*18+b);X.quadraticCurveTo(594,1008-k*8+b,566,996+b);X.closePath();X.fill();}
 // fringe where it rests on the cushion
 X.strokeStyle='#cbb99f';X.lineWidth=3;X.lineCap='round';for(let i=0;i<34;i++){const x=222+i*14.2;const y=1424+Math.sin(x*0.035)*6+Math.sin(x*0.11)*2;X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+3,y+9,x+1,y+15);X.stroke();}
 X.fillStyle='rgba(30,20,20,.3)';X.beginPath();X.ellipse(458,1446,250,9,0,0,6.28);X.fill();
 // sweater collar (sage rib) showing at the neck
 X.fillStyle='#7d8e74';X.beginPath();X.moveTo(384,952+b*0.3);X.quadraticCurveTo(432,930+b*0.3,482,952+b*0.3);X.quadraticCurveTo(432,970+b*0.3,384,952+b*0.3);X.fill();
 X.strokeStyle='rgba(40,50,38,.18)';X.lineWidth=1;for(let i=-5;i<=5;i++){X.beginPath();X.moveTo(432+i*8,945+b*0.3);X.lineTo(432+i*8.6,958+b*0.3);X.stroke();}}
function drape(t){const k=armUp(t);if(k<=0.02)return;const T=tip(t);if(!T)return;const [fx,fy]=T.p;const HS=1.3;const wx=fx+6*HS,wy=fy+92*HS;
 const ex=lerp(575,clamp(fx-40,570,610),k),ey=lerp(1150,1060,k);
 // where the sleeve leaves her shoulder line, the knit falls over the forearm in a soft fold
 const u=0.42,px=lerp(ex,wx,u)+6,py=lerp(ey,wy+16,u);const ang=Math.atan2(wy+16-ey,wx-ex);
 X.save();X.translate(px,py);X.rotate(ang);X.globalAlpha=Math.min(1,k*1.5);
 const g=X.createLinearGradient(0,-40,0,40);g.addColorStop(0,'#cdbca3');g.addColorStop(0.6,'#ab9983');g.addColorStop(1,'#857464');X.fillStyle=g;
 X.beginPath();X.moveTo(-70,-36);X.quadraticCurveTo(-10,-46,18,-34);X.quadraticCurveTo(34,0,20,36);X.quadraticCurveTo(-20,44,-70,38);X.closePath();X.fill();
 X.strokeStyle='rgba(105,85,66,.22)';X.lineWidth=1.6;for(let r=-28;r<=28;r+=14){for(let c=-60;c<10;c+=15){X.beginPath();X.moveTo(c-5,r-4);X.lineTo(c,r+3);X.lineTo(c+5,r-4);X.stroke();}}
 X.strokeStyle='rgba(70,52,40,.35)';X.lineWidth=3;X.beginPath();X.moveTo(18,-34);X.quadraticCurveTo(34,0,20,36);X.stroke();
 X.strokeStyle='rgba(185,200,240,.35)';X.lineWidth=2;X.beginPath();X.moveTo(-60,38);X.quadraticCurveTo(-20,44,20,36);X.stroke();
 X.restore();}
function head(t){const b=breathAt(t)*2,a=turnAt(t),tn=a/(8*Math.PI/180);
 X.save();X.translate(NECK[0],NECK[1]+b*0.5);X.rotate(a*0.5);
 // nape of the neck
 const ng=X.createLinearGradient(-26,0,26,0);ng.addColorStop(0,SK_LT);ng.addColorStop(0.5,SK);ng.addColorStop(1,SK_SH);X.fillStyle=ng;X.beginPath();X.moveTo(-33,6);X.quadraticCurveTo(-30,-12,-29,-30);X.lineTo(29,-30);X.quadraticCurveTo(30,-12,33,6);X.closePath();X.fill();
 
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
 X.lineCap='round';for(let i=0;i<14;i++){const u=i/13;X.strokeStyle=i%4==1?'rgba(150,108,82,.40)':'rgba(105,74,58,.40)';X.lineWidth=1.4;X.beginPath();X.moveTo(-34+u*20,-66-u*40);X.quadraticCurveTo(-4+u*10,-80-u*30+((i*5)%7),24+u*8,-62-u*44);X.stroke();}
 X.fillStyle='rgba(170,125,95,.18)';X.beginPath();X.ellipse(-12,-100,16,6,-0.3,0,6.28);X.fill();
 // loose wisps at the nape and over the ears, moving with her breath
 X.strokeStyle=HAIR;X.lineWidth=1.5;X.strokeStyle='rgba(43,29,25,.7)';X.lineWidth=1.1;for(const [x0,y0,dx,dy] of [[46,-74,8,34],[-48,-78,-7,32]]){X.beginPath();X.moveTo(x0,y0);X.bezierCurveTo(x0+dx*0.3,y0+dy*0.4,x0+dx+Math.sin(t*0.8+x0)*2,y0+dy*0.7,x0+dx*0.6,y0+dy);X.stroke();}
 // rim light: warm lamp on the left of her hair, cool window light on the right
 X.strokeStyle='rgba(255,180,120,.45)';X.lineWidth=3;X.beginPath();X.moveTo(-48,-34);X.bezierCurveTo(-64,-70,-64,-140,-36,-168);X.stroke();
 X.strokeStyle='rgba(170,190,240,.35)';X.lineWidth=2.5;X.beginPath();X.moveTo(42,-166);X.bezierCurveTo(66,-140,64,-70,48,-30);X.stroke();
 X.restore();}
// ---------------- props on the seat ----------------
function props(t){
 // mug of tea on the seat, steam curling in the warm air
 const mx=738,my=1386;X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(mx,my+3,42,8,0,0,6.28);X.fill();
 const mg=X.createLinearGradient(mx-38,0,mx+38,0);mg.addColorStop(0,'#d8b39a');mg.addColorStop(0.4,'#b8836a');mg.addColorStop(1,'#6c4a3e');X.fillStyle=mg;
 X.beginPath();X.moveTo(mx-36,my-72);X.lineTo(mx-34,my-6);X.quadraticCurveTo(mx,my+6,mx+34,my-6);X.lineTo(mx+36,my-72);X.closePath();X.fill();
 X.strokeStyle='#8a5e4d';X.lineWidth=9;X.beginPath();X.arc(mx+36,my-40,17,-1.45,1.45);X.stroke();
 X.fillStyle='#4a2a1e';X.beginPath();X.ellipse(mx,my-72,36,8,0,0,6.28);X.fill();X.fillStyle='#7a4a30';X.beginPath();X.ellipse(mx,my-71,31,5.5,0,0,6.28);X.fill();
 X.strokeStyle='rgba(255,230,210,.5)';X.lineWidth=2;X.beginPath();X.ellipse(mx,my-72,36,8,0,3.3,6.1);X.stroke();
 for(let i=0;i<5;i++){const p=((t*0.22+i/5)%1);const sx=mx-6+Math.sin(p*7+i+t*0.8)*12*p,sy=my-80-p*90;X.strokeStyle=`rgba(235,230,235,${0.13*Math.sin(p*Math.PI)})`;X.lineWidth=5+p*8;X.beginPath();X.moveTo(sx,sy);X.quadraticCurveTo(sx+10*Math.sin(t+i),sy-20,sx-4,sy-40);X.stroke();}
 // candle in a glass jar on the books, its warm light on the seat, books and mug
 {const sg=X.createRadialGradient(868,1400,10,868,1400,230);sg.addColorStop(0,'rgba(255,180,100,.28)');sg.addColorStop(1,'rgba(255,180,100,0)');X.fillStyle=sg;X.fillRect(638,1280,460,240);}
 const cx=868,cy=1350,fl=0.85+0.1*Math.sin(t*9.1)+0.05*Math.sin(t*23);
 const cg=X.createRadialGradient(cx,cy-44,4,cx,cy-44,190);cg.addColorStop(0,`rgba(255,190,110,${0.35*fl})`);cg.addColorStop(1,'rgba(255,190,110,0)');X.fillStyle=cg;X.fillRect(cx-190,cy-234,380,380);
 X.fillStyle='rgba(255,240,220,.18)';X.beginPath();X.roundRect(cx-30,cy-62,60,62,8);X.fill();
 X.fillStyle='#efe2cf';X.fillRect(cx-25,cy-34,50,32);X.fillStyle='#d8c7ae';X.beginPath();X.ellipse(cx,cy-34,25,5,0,0,6.28);X.fill();
 X.strokeStyle='#2a1c18';X.lineWidth=2;X.beginPath();X.moveTo(cx,cy-36);X.lineTo(cx,cy-42);X.stroke();
 const sw=Math.sin(t*3.1)*1.5;X.fillStyle=`rgba(255,214,140,${0.95})`;X.beginPath();X.moveTo(cx-6,cy-42);X.quadraticCurveTo(cx-5,cy-56,cx+sw,cy-64*fl-2);X.quadraticCurveTo(cx+5,cy-56,cx+6,cy-42);X.quadraticCurveTo(cx,cy-37,cx-6,cy-42);X.fill();
 X.fillStyle='#fff6dc';X.beginPath();X.ellipse(cx,cy-45,2.5,5,0,0,6.28);X.fill();
 X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=2;X.beginPath();X.roundRect(cx-30,cy-62,60,62,8);X.stroke();X.strokeStyle='rgba(255,255,255,.5)';X.beginPath();X.moveTo(cx-24,cy-54);X.lineTo(cx-24,cy-10);X.stroke();}
// ---------------- grade + caption ----------------
function grade(t){const v=X.createRadialGradient(520,980,300,520,980,1250);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,4,14,.62)');X.fillStyle=v;X.fillRect(0,0,W,H);
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(130,110,190,.10)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.04;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function heartIcon(x,y,s,a){X.save();X.globalAlpha=a;X.fillStyle='#fbe4ea';X.beginPath();X.moveTo(x,y+s*0.8);X.bezierCurveTo(x-s*1.2,y-s*0.1,x-s*0.6,y-s*0.95,x,y-s*0.35);X.bezierCurveTo(x+s*0.6,y-s*0.95,x+s*1.2,y-s*0.1,x,y+s*0.8);X.fill();X.restore();}
function caption(t){
 const a=Math.min(1,0.5+t/0.9)*clamp((5.6-t)/1.2,0,1);
 if(a>0){X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*4,y=486;const bl=Math.max(0,(t-4.6)*1.5);if(bl>0)X.filter=`blur(${bl}px)`;
  X.font="italic 500 72px Corm, serif";X.shadowColor='rgba(170,190,255,.6)';X.shadowBlur=30;X.fillStyle='#f4f1fa';
  for(let k=0;k<2;k++){X.fillText('first snow tonight,',x,y);X.fillText('and i thought of you',x,y+88);X.shadowBlur=0;}
  X.filter='none';X.globalAlpha=a*0.6;X.strokeStyle='#f4f1fa';X.lineWidth=1.5;X.beginPath();X.moveTo(x-55,y+146);X.lineTo(x+55,y+146);X.stroke();X.restore();}
 const b=clamp((t-10.2)/1.2,0,1);
 if(b>0){X.save();X.globalAlpha=b;X.textAlign='center';X.textBaseline='middle';const x=540,y=520-b*10;X.font="italic 500 78px Corm, serif";X.shadowColor='rgba(255,180,200,.6)';X.shadowBlur=30;X.fillStyle='#fbeef2';
  for(let k=0;k<2;k++){X.fillText('wish you could see it',x,y);X.shadowBlur=0;}X.restore();heartIcon(x+330,y-2,20,b);}}
// ---------------- frame ----------------
window.draw=function(t){if(!OUT)buildStatic();
 const z=1.16+0.07*ease(t/16),F=[540,880],ox=S*(F[0]-F[0]*z),oy=S*(F[1]-F[1]*z);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 X.setTransform(z/1.12,0,0,z/1.12,ox,oy);X.drawImage(OUT,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);snow(t);
 // the fog layer lives in screen space at the current zoom
 X.save();fogDraw(t,z,ox,oy);X.restore();
 glass(t);
 X.setTransform(z/1.12,0,0,z/1.12,ox,oy);X.drawImage(ROOM,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);frame(X);seat(X);props(t);arm(t);blanket(t);drape(t);head(t);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);};
function fogDraw(t,z,ox,oy){const a=fogAt(t);if(a<=0)return;FQ.setTransform(1,0,0,1,0,0);FQ.clearRect(0,0,1440,2560);FQ.setTransform(S*z,0,0,S*z,ox,oy);
 for(const [dx,dy,rx,ry,al] of [[-30,40,90,70,.30],[10,0,110,90,.26],[40,-40,80,70,.20],[-50,-20,70,80,.20],[20,60,70,50,.22],[-10,-70,60,50,.14]]){const cx=HC.x+dx,cy=HC.y+dy;
  const g=FQ.createRadialGradient(cx,cy,5,cx,cy,Math.max(rx,ry));g.addColorStop(0,`rgba(214,222,238,${al*a})`);g.addColorStop(0.6,`rgba(205,214,232,${al*0.6*a})`);g.addColorStop(1,'rgba(205,214,232,0)');
  FQ.fillStyle=g;FQ.beginPath();FQ.ellipse(cx,cy,rx,ry,0,0,6.28);FQ.fill();}
 const r=rng(5);FQ.fillStyle=`rgba(235,240,250,${0.35*a})`;for(let i=0;i<160;i++){const an=r()*6.28,rr=Math.sqrt(r())*120;FQ.beginPath();FQ.arc(HC.x-6+Math.cos(an)*rr*1.1,HC.y+10+Math.sin(an)*rr*0.95,0.6+r()*0.9,0,6.28);FQ.fill();}
 FQ.globalCompositeOperation='destination-out';FQ.strokeStyle='rgba(0,0,0,.8)';FQ.lineWidth=10;FQ.filter='blur(1.2px)';FQ.lineCap='round';FQ.lineJoin='round';
 for(const [d,side] of [[D1,-1],[D2,1]]){if(t<d[0])continue;const uu=ease(clamp((t-d[0])/(d[1]-d[0]),0,1));FQ.beginPath();for(let k=0;k<=60;k++){const p=heartPt(k/60*uu,side);k?FQ.lineTo(p[0],p[1]):FQ.moveTo(p[0],p[1]);}FQ.stroke();}
 FQ.globalCompositeOperation='source-over';FQ.filter='none';
 X.setTransform(1,0,0,1,0,0);X.drawImage(FC,0,0);X.setTransform(S*z,0,0,S*z,ox,oy);
}
draw(0);
