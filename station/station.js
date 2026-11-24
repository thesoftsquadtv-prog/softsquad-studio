// Soft Ambience — "the little station waits for the last train". A small country railway station at night in a thunderstorm,
// seen front-on from across the tracks. Under the platform canopy (fretwork valance, cast-iron columns with curly brackets)
// two lanterns sway on their chains, a clock hangs at the centre (11:47), a suitcase and a dripping umbrella wait by the bench.
// Through the waiting-room window a pot-bellied stove glows with a kettle on top; the ticket office has a green desk lamp.
// Pines behind, chimney smoke tearing sideways, rain dripping off the valance onto the platform. Lightning in the first second
// (bolt 0.45 s, behind the pines) and a sheet flash at 12.24 s; the signal turns from red to green at 9.6 s (the last train is
// coming) and back to red as the loop closes. Every motion repeats every LOOP (20 s) so the video loops seamlessly.
const FLASH=[[0.39,0.34,985,1],[12.24,0.30,0,0]];
function flashAt(t){let f=0,bolt=null;for(const [lt,a,bx,hasB] of FLASH){const d=t-lt;if(d>0&&d<1.2){let v=a*Math.exp(-d*7);if(d>0.16)v+=a*0.7*Math.exp(-(d-0.16)*9);f=Math.max(f,v);if(d<0.32&&hasB)bolt={bx,d,a,seed:lt*10};}}return {f,bolt};}
const BLD={x0:170,x1:910,eave:760,ridge:600};
const CAN={y0:1012,y1:1072,soff:1110};             // canopy valance top/bottom, soffit meets the wall
const PLAT=1560, EDGE=1690, RAILF=1872, RAILB=1772; // platform surface, platform edge, near/far rail
const COLS=[120,400,680,960];
const LANT=[[260,1112],[820,1112]];                 // lantern chain hooks on the soffit
const WIN_L={x:186,y:1200,w:180,h:200}, WIN_R={x:714,y:1200,w:180,h:200}, DOOR={x:470,y:1180,w:140,h:290};
const SIG={x:1018,y:1196};
const CHTOP=[712,520];
const WARMS=[[260,1260,240,1],[820,1260,240,1],[540,1330,200,0.6]];
const sigGreen=t=>t>9.6&&t<19.6;

let SKY,TREES,BLDC,BLDR,PLATF,INT;
// ---------- pines: drooping overlapping tiers over a dark inner cone, painted once ----------
function pine(q,x,base,h,w,col,lit){const r=rng((x*7+h)|0);
 q.fillStyle=shade(col,0.7);q.beginPath();q.moveTo(x,base-h);q.lineTo(x+w*0.42,base);q.lineTo(x-w*0.42,base);q.closePath();q.fill();
 const tiers=7;for(let i=0;i<tiers;i++){const u=(i+1)/tiers,ty=base-h+h*u*0.98,tw=w*(0.16+0.5*u)*(0.9+r()*0.2);
  q.fillStyle=shade(col,0.85+r()*0.25);q.beginPath();q.moveTo(x+(r()-0.5)*6,ty-h/tiers*1.25);
  q.quadraticCurveTo(x+tw*0.45,ty-h/tiers*0.5,x+tw,ty+6+r()*8);q.quadraticCurveTo(x+tw*0.6,ty-2,x+tw*0.3,ty+4);q.quadraticCurveTo(x,ty-4,x-tw*0.3,ty+4);q.quadraticCurveTo(x-tw*0.6,ty-2,x-tw,ty+6+r()*8);
  q.quadraticCurveTo(x-tw*0.45,ty-h/tiers*0.5,x,ty-h/tiers*1.25);q.fill();
  if(lit){q.strokeStyle='rgba(150,170,220,.10)';q.lineWidth=2;q.beginPath();q.moveTo(x,ty-h/tiers*1.25);q.quadraticCurveTo(x-tw*0.45,ty-h/tiers*0.5,x-tw,ty+6);q.stroke();}}}
function treesPaint(q){const r=rng(41);
 for(let i=0;i<16;i++){const x=-40+i*76+r()*30;pine(q,x,980,300+r()*160,150+r()*50,'#1a2530',false);}
 for(const [x,h] of [[40,520],[150,430],[960,500],[1060,560],[880,380],[230,360]])pine(q,x,1000,h,h*0.42,'#121b22',true);
 const gg=q.createLinearGradient(0,960,0,PLAT);gg.addColorStop(0,'#0f161c');gg.addColorStop(1,'#0a0e12');q.fillStyle=gg;q.fillRect(0,960,W,PLAT-950);
 for(let i=0;i<14;i++){q.fillStyle='rgba(20,30,34,.9)';q.beginPath();q.ellipse(r()*W,PLAT-20-r()*60,40+r()*50,30+r()*30,0,0,6.28);q.fill();}}
// ---------- station building ----------
function buildingPaint(q){const {x0,x1,eave,ridge}=BLD;
 // walls: board-and-batten in deep green, cream trim
 const wg=q.createLinearGradient(0,eave,0,PLAT);wg.addColorStop(0,'#2f4a3e');wg.addColorStop(1,'#243a31');q.fillStyle=wg;q.fillRect(x0,eave,x1-x0,PLAT-eave);
 for(let x=x0+12;x<x1;x+=26){q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x,eave,4,PLAT-eave);q.fillStyle='rgba(255,255,255,.04)';q.fillRect(x+4,eave,2,PLAT-eave);}
 q.fillStyle='#d8cfb8';q.fillRect(x0-6,eave,12,PLAT-eave);q.fillRect(x1-6,eave,12,PLAT-eave);
 // hipped slate roof
 q.save();q.beginPath();q.moveTo(x0-34,eave);q.lineTo(x0+150,ridge);q.lineTo(x1-150,ridge);q.lineTo(x1+34,eave);q.closePath();q.clip();
 const rg=q.createLinearGradient(0,ridge,0,eave);rg.addColorStop(0,'#3a4250');rg.addColorStop(1,'#262c36');q.fillStyle=rg;q.fillRect(0,ridge,W,eave-ridge);
 const r=rng(5);for(let y=ridge+4,k=0;y<eave;y+=14,k++){for(let x=x0-40+(k%2)*13;x<x1+40;x+=26){q.fillStyle=shade('#323a46',0.85+r()*0.3);q.fillRect(x,y,24,12);}q.fillStyle='rgba(0,0,0,.35)';q.fillRect(x0-40,y+12,x1-x0+80,2);}
 q.restore();
 q.strokeStyle='#d8cfb8';q.lineWidth=5;q.beginPath();q.moveTo(x0-34,eave);q.lineTo(x0+150,ridge);q.lineTo(x1-150,ridge);q.lineTo(x1+34,eave);q.stroke();   // hip/ridge flashing
 q.fillStyle='#d8cfb8';q.fillRect(x0-40,eave-4,x1-x0+80,14);q.fillStyle='rgba(0,0,0,.4)';q.fillRect(x0-40,eave+10,x1-x0+80,6);   // fascia + its shadow
 // chimney (brick, with pots)
 q.fillStyle='#5a3a30';q.fillRect(CHTOP[0]-26,CHTOP[1],52,ridge-CHTOP[1]+30);for(let y=CHTOP[1];y<ridge+30;y+=12){q.fillStyle='rgba(0,0,0,.25)';q.fillRect(CHTOP[0]-26,y,52,2);}
 q.fillStyle='#4a2e26';q.fillRect(CHTOP[0]-32,CHTOP[1]-8,64,12);q.fillStyle='#8a5a40';q.fillRect(CHTOP[0]-14,CHTOP[1]-26,12,20);q.fillRect(CHTOP[0]+4,CHTOP[1]-22,12,16);
 // name board above the canopy
 q.fillStyle='#d8cfb8';q.fillRect(318,836,444,92);q.fillStyle='#1f3a30';q.fillRect(326,844,428,76);
 q.fillStyle='#efe6cf';q.font='700 50px Georgia, serif';q.textAlign='center';q.textBaseline='middle';q.fillText('WILLOW  HALT',540,884);
 // upper wall: two small round vents, a downpipe at the right end
 for(const x of [250,830]){q.fillStyle='#d8cfb8';q.beginPath();q.arc(x,886,22,0,6.28);q.fill();q.fillStyle='#1c2a24';q.beginPath();q.arc(x,886,16,0,6.28);q.fill();q.strokeStyle='#d8cfb8';q.lineWidth=2;for(let k=-1;k<=1;k++){q.beginPath();q.moveTo(x-14,886+k*6);q.lineTo(x+14,886+k*6);q.stroke();}}
 // windows + door (frames; the glass is cut out so the lit interior layer shows through)
 for(const w of [WIN_L,WIN_R]){q.fillStyle='#d8cfb8';q.fillRect(w.x-14,w.y-14,w.w+28,w.h+28);q.fillStyle='#bfb59c';q.fillRect(w.x-22,w.y+w.h+10,w.w+44,14);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(w.x-22,w.y+w.h+24,w.w+44,6);}
 q.fillStyle='#d8cfb8';q.fillRect(DOOR.x-14,DOOR.y-14,DOOR.w+28,DOOR.h+14);
 
 q.globalCompositeOperation='destination-out';for(const w of [WIN_L,WIN_R])q.fillRect(w.x,w.y,w.w,w.h);q.fillRect(DOOR.x+10,DOOR.y+10,DOOR.w-20,150);q.globalCompositeOperation='source-over';
 // glazing bars
 q.fillStyle='#d8cfb8';for(const w of [WIN_L,WIN_R]){q.fillRect(w.x+w.w/2-3,w.y,6,w.h);q.fillRect(w.x,w.y+w.h/2-3,w.w,6);}
 q.fillRect(DOOR.x+DOOR.w/2-3,DOOR.y+10,6,150);q.fillRect(DOOR.x+10,DOOR.y+84,DOOR.w-20,5);
 // door: lower panels, handle
 q.fillStyle='#2c4a3c';q.fillRect(DOOR.x+10,DOOR.y+160,DOOR.w-20,DOOR.h-160);q.strokeStyle='rgba(0,0,0,.35)';q.lineWidth=3;q.strokeRect(DOOR.x+20,DOOR.y+176,DOOR.w/2-28,DOOR.h-196);q.strokeRect(DOOR.x+DOOR.w/2+8,DOOR.y+176,DOOR.w/2-28,DOOR.h-196);
 q.fillStyle='#c9a45a';q.beginPath();q.arc(DOOR.x+DOOR.w/2-14,DOOR.y+214,5,0,6.28);q.arc(DOOR.x+DOOR.w/2+14,DOOR.y+214,5,0,6.28);q.fill();
 // a timetable board and a poster on the wall between the columns
 q.fillStyle='#e9e1cc';q.fillRect(632,1236,46,62);q.strokeStyle='#1f3a30';q.lineWidth=3;q.strokeRect(632,1236,46,62);q.fillStyle='rgba(40,50,46,.6)';for(let k=0;k<6;k++)q.fillRect(638,1246+k*8,34-(k%3)*6,3);
 q.fillStyle='#b8574a';q.fillRect(392,1236,52,72);q.fillStyle='#efd9a8';q.beginPath();q.arc(418,1262,12,0,6.28);q.fill();q.fillStyle='#2f4a3e';q.fillRect(398,1284,40,16);
 // sole plate / plinth
 q.fillStyle='#4a4038';q.fillRect(x0-6,PLAT-26,x1-x0+12,26);}
// canopy: soffit planks (seen from below), valance fretwork, columns with spandrel brackets
function canopyPaint(q){
 q.fillStyle='#2a2520';q.beginPath();q.moveTo(40,CAN.y1);q.lineTo(1040,CAN.y1);q.lineTo(BLD.x1+30,CAN.soff);q.lineTo(BLD.x0-30,CAN.soff);q.closePath();q.fill();
 for(let i=0;i<=24;i++){const u=i/24;q.strokeStyle='rgba(0,0,0,.35)';q.lineWidth=2;q.beginPath();q.moveTo(lerp(40,1040,u),CAN.y1);q.lineTo(lerp(BLD.x0-30,BLD.x1+30,u),CAN.soff);q.stroke();}
 // valance: cream boards with pointed ends, green lower trim
 q.fillStyle='#e3d9bf';q.fillRect(30,CAN.y0,W-60,CAN.y1-CAN.y0-14);
 for(let x=30;x<W-30;x+=22){q.beginPath();q.moveTo(x,CAN.y1-14);q.lineTo(x+20,CAN.y1-14);q.lineTo(x+10,CAN.y1+6);q.closePath();q.fill();}
 q.fillStyle='#1f3a30';q.fillRect(30,CAN.y0,W-60,10);for(let x=36;x<W-30;x+=22){q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x+16,CAN.y0+10,3,CAN.y1-CAN.y0-24);q.fillStyle='#1f3a30';q.beginPath();q.arc(x+10,CAN.y0+26,3.5,0,6.28);q.fill();}
 q.fillStyle='rgba(0,0,0,.25)';q.fillRect(30,CAN.y0+10,W-60,4);
 // columns
 for(const x of COLS){const g=q.createLinearGradient(x-10,0,x+10,0);g.addColorStop(0,'#2e3a36');g.addColorStop(0.4,'#4a5a54');g.addColorStop(1,'#1c2422');q.fillStyle=g;q.fillRect(x-9,CAN.y1,18,PLAT-CAN.y1);
  q.fillStyle='#1c2422';q.fillRect(x-16,PLAT-30,32,30);q.fillRect(x-14,CAN.y1,28,14);for(const y of [1300,1420])q.fillRect(x-12,y,24,8);
  // curly spandrel brackets
  q.strokeStyle='#2e3a36';q.lineWidth=5;for(const s of [-1,1]){q.beginPath();q.moveTo(x+s*9,CAN.y1+70);q.quadraticCurveTo(x+s*14,CAN.y1+20,x+s*70,CAN.y1+10);q.stroke();q.beginPath();q.arc(x+s*30,CAN.y1+38,12,0,6.28);q.stroke();}}}
// platform + track
function platformPaint(q){
 const pg=q.createLinearGradient(0,PLAT,0,EDGE);pg.addColorStop(0,'#3a3836');pg.addColorStop(1,'#2a2826');q.fillStyle=pg;q.fillRect(0,PLAT,W,EDGE-PLAT);
 const r=rng(12);for(let y=PLAT,k=0;y<EDGE;k++){const hh=24+k*8;for(let x=-(k%2)*40;x<W;x+=80+k*6){q.fillStyle=shade('#363432',0.85+r()*0.3);q.fillRect(x+2,y+2,78+k*6,hh-3);}y+=hh;}
 q.fillStyle='#d9d4c2';q.fillRect(0,EDGE-14,W,10);q.fillStyle='#4a4644';q.fillRect(0,EDGE-4,W,22);q.fillStyle='rgba(0,0,0,.5)';q.fillRect(0,EDGE+18,W,10);   // white safety line, coping stone
 // trackbed: ballast, sleepers, two rails (wet steel)
 const bg=q.createLinearGradient(0,EDGE+18,0,H);bg.addColorStop(0,'#1c1a1a');bg.addColorStop(1,'#2a2624');q.fillStyle=bg;q.fillRect(0,EDGE+18,W,H-EDGE);
 for(let i=0;i<1600;i++){const y=EDGE+24+r()*(H-EDGE);q.fillStyle=shade('#3a3532',0.6+r()*0.6);q.fillRect(r()*W,y,3+r()*3,2+r()*2);}
 for(let x=-20;x<W+20;x+=64){q.fillStyle='#2e2420';q.beginPath();q.moveTo(x,RAILB-8);q.lineTo(x+30,RAILB-8);q.lineTo(x+36,RAILF+26);q.lineTo(x-4,RAILF+26);q.closePath();q.fill();q.fillStyle='rgba(255,255,255,.04)';q.fillRect(x,RAILB-8,30,3);}
 for(const [y,h] of [[RAILB,9],[RAILF,13]]){q.fillStyle='#3e3a3a';q.fillRect(0,y,W,h);q.fillStyle='#8a8a92';q.fillRect(0,y,W,3);q.fillStyle='rgba(0,0,0,.5)';q.fillRect(0,y+h,W,4);}
 // bench (left), suitcase + umbrella beside it
 const bx=196,by=1486;q.fillStyle='rgba(0,0,0,.35)';q.fillRect(bx-6,PLAT-10,188,12);
 q.fillStyle='#1c2422';q.fillRect(bx+10,by,10,PLAT-by);q.fillRect(bx+156,by,10,PLAT-by);
 for(let k=0;k<3;k++){q.fillStyle=k%2?'#7a5a40':'#86644a';q.fillRect(bx,by-k*12,176,10);}
 for(let k=0;k<3;k++){q.fillStyle=k%2?'#7a5a40':'#86644a';q.fillRect(bx,by-80+k*14,176,11);}q.fillStyle='#1c2422';q.fillRect(bx+10,by-86,10,60);q.fillRect(bx+156,by-86,10,60);
 // suitcase (on the platform beside the bench, upright, with a strap and a luggage tag)
 const sx=392,sy=PLAT-96;q.fillStyle='rgba(0,0,0,.4)';q.fillRect(sx-4,PLAT-6,96,8);
 const sg=q.createLinearGradient(sx,0,sx+88,0);sg.addColorStop(0,'#9a4a3a');sg.addColorStop(1,'#6a2e26');q.fillStyle=sg;rr(q,sx,sy,88,94,8);q.fill();
 q.fillStyle='#d9c08a';q.fillRect(sx+16,sy,6,94);q.fillRect(sx+66,sy,6,94);q.fillStyle='#2a1a16';q.fillRect(sx+30,sy-14,28,6);q.fillRect(sx+30,sy-14,5,16);q.fillRect(sx+53,sy-14,5,16);
 q.fillStyle='#efe6cf';q.save();q.translate(sx+76,sy+14);q.rotate(0.3);q.fillRect(0,0,14,20);q.restore();
 // umbrella leaning against the bench end, closed, wet
 q.strokeStyle='#1a1a20';q.lineWidth=4;q.beginPath();q.moveTo(bx+186,PLAT-4);q.lineTo(bx+170,by-60);q.stroke();q.beginPath();q.arc(bx+165,by-64,8,Math.PI*1.9,Math.PI*0.9,true);q.stroke();
 q.fillStyle='#2a3a6a';q.beginPath();q.moveTo(bx+172,by-40);q.quadraticCurveTo(bx+194,by+10,bx+186,PLAT-14);q.lineTo(bx+178,PLAT-14);q.quadraticCurveTo(bx+168,by+10,bx+172,by-40);q.fill();
 // signal post (right, beyond the building), ladder, lamp head with two aspects
 q.fillStyle='#1a1c20';q.fillRect(SIG.x-5,SIG.y,10,PLAT+40-SIG.y);q.fillRect(SIG.x-16,PLAT+30,32,12);q.fillRect(SIG.x-22,SIG.y-10,44,84);q.fillStyle='#0c0d10';q.beginPath();q.arc(SIG.x,SIG.y+16,11,0,6.28);q.arc(SIG.x,SIG.y+50,11,0,6.28);q.fill();
 q.fillStyle='#22252a';q.fillRect(SIG.x-26,SIG.y-14,52,6);for(const y of [SIG.y+4,SIG.y+38]){q.beginPath();q.moveTo(SIG.x-14,y);q.lineTo(SIG.x+14,y);q.lineTo(SIG.x+16,y+6);q.lineTo(SIG.x-16,y+6);q.fill();}}
// the lit interiors behind the glass
function interiorPaint(q){
 for(const w of [WIN_L,WIN_R,{x:DOOR.x+10,y:DOOR.y+10,w:DOOR.w-20,h:150}]){const g=q.createLinearGradient(0,w.y,0,w.y+w.h);g.addColorStop(0,'#c98a4e');g.addColorStop(1,'#8a5432');q.fillStyle=g;q.fillRect(w.x-4,w.y-4,w.w+8,w.h+8);}
 // waiting room (left): panelled dado, a bench, pot-bellied stove with its flue going up, kettle on top
 const L=WIN_L;q.fillStyle='rgba(90,50,30,.5)';q.fillRect(L.x,L.y+L.h*0.62,L.w,L.h*0.38);
 q.fillStyle='#5a3a26';q.fillRect(L.x+100,L.y+L.h*0.66,80,12);q.fillRect(L.x+104,L.y+L.h*0.66,8,40);
 const sx=L.x+56,sy=L.y+L.h*0.62;q.fillStyle='#1e1a18';q.fillRect(sx-4,L.y,8,sy-L.y-50);q.beginPath();q.ellipse(sx,sy-20,30,38,0,0,6.28);q.fill();q.fillRect(sx-24,sy+10,48,10);q.fillRect(sx-20,sy+18,6,30);q.fillRect(sx+14,sy+18,6,30);
 q.fillStyle='#2a2422';q.beginPath();q.ellipse(sx,sy-58,22,6,0,0,6.28);q.fill();
 q.fillStyle='#6a6e76';q.beginPath();q.ellipse(sx+2,sy-70,16,10,0,0,6.28);q.fill();q.fillRect(sx-2,sy-86,8,6);q.strokeStyle='#6a6e76';q.lineWidth=3;q.beginPath();q.moveTo(sx+16,sy-72);q.lineTo(sx+28,sy-82);q.stroke();
 // ticket office (right): counter, posters, a green banker's lamp, pigeonholes
 const R=WIN_R;q.fillStyle='#5a3a26';q.fillRect(R.x,R.y+R.h*0.64,R.w,R.h*0.36);q.fillStyle='#6e4a32';q.fillRect(R.x,R.y+R.h*0.62,R.w,8);
 for(let i=0;i<4;i++)for(let j=0;j<3;j++){q.fillStyle='rgba(70,40,24,.6)';q.fillRect(R.x+96+i*20,R.y+22+j*22,16,18);q.fillStyle='rgba(240,230,210,.6)';if((i+j)%2)q.fillRect(R.x+98+i*20,R.y+30+j*22,12,8);}
 q.fillStyle='#2f6a4a';q.beginPath();q.ellipse(R.x+52,R.y+R.h*0.5,24,10,0,Math.PI,0);q.fill();q.fillStyle='#c9a45a';q.fillRect(R.x+50,R.y+R.h*0.5,4,22);q.fillRect(R.x+40,R.y+R.h*0.6,24,4);
 q.fillStyle='#e8d8b0';q.fillRect(R.x+24,R.y+R.h*0.6-10,30,8);
 // door: through the glass, the waiting room's wall clock and a coat hook with a scarf
 q.fillStyle='rgba(90,50,30,.45)';q.fillRect(DOOR.x+60,DOOR.y+30,40,26);
 q.fillStyle='#a2493f';q.fillRect(DOOR.x+30,DOOR.y+96,10,50);}
// ---------- animated ----------
function interiorLive(t){
 // stove fire glow flickering through its door, warm light on the room
 const L=WIN_L,sx=L.x+56,sy=L.y+L.h*0.62;const fl=0.8+0.12*Math.sin(WK(23)*t)+0.08*Math.sin(WK(37)*t+1);
 X.save();X.beginPath();X.rect(L.x,L.y,L.w,L.h);X.clip();
 const g=X.createRadialGradient(sx,sy-14,2,sx,sy-14,90);g.addColorStop(0,`rgba(255,170,80,${0.55*fl})`);g.addColorStop(1,'rgba(255,140,60,0)');X.fillStyle=g;X.fillRect(L.x,L.y,L.w,L.h);
 X.fillStyle=`rgba(255,${150+40*fl|0},70,${0.9})`;rr(X,sx-12,sy-30,24,22,6);X.fill();X.fillStyle=`rgba(255,230,150,${0.6*fl})`;X.beginPath();X.ellipse(sx,sy-16,6,8,0,0,6.28);X.fill();
 // kettle steam (the kettle sits on the stove top, so the steam has a visible source)
 for(let i=0;i<8;i++){const p=((t/2.5+i/8)%1);const x=sx+30+p*14+Math.sin(p*5+i)*4,y=sy-84-p*60;const rad=4+p*12;const sg=X.createRadialGradient(x,y,0,x,y,rad);sg.addColorStop(0,`rgba(255,240,225,${0.3*Math.sin(p*Math.PI)})`);sg.addColorStop(1,'rgba(255,240,225,0)');X.fillStyle=sg;X.fillRect(x-rad,y-rad,rad*2,rad*2);}
 X.restore();
 // banker's lamp pool on the ticket counter
 const R=WIN_R;X.save();X.beginPath();X.rect(R.x,R.y,R.w,R.h);X.clip();const lg=X.createRadialGradient(R.x+52,R.y+R.h*0.6,2,R.x+52,R.y+R.h*0.6,70);lg.addColorStop(0,'rgba(255,230,160,.5)');lg.addColorStop(1,'rgba(255,230,160,0)');X.fillStyle=lg;X.fillRect(R.x,R.y,R.w,R.h);X.restore();}
function glassFX(t){const {f}=flashAt(t);for(const w of [WIN_L,WIN_R,{x:DOOR.x+10,y:DOOR.y+10,w:DOOR.w-20,h:150}]){X.save();X.beginPath();X.rect(w.x,w.y,w.w,w.h);X.clip();
 X.fillStyle=`rgba(200,215,255,${0.05+f*0.3})`;X.beginPath();X.moveTo(w.x+w.w*0.55,w.y);X.lineTo(w.x+w.w*0.8,w.y);X.lineTo(w.x+w.w*0.3,w.y+w.h);X.lineTo(w.x+w.w*0.05,w.y+w.h);X.closePath();X.fill();X.restore();}}
// lanterns on chains under the canopy, swaying gently with the gusts that get in under the roof
function lanterns(t){LANT.forEach(([hx,hy],i)=>{const a=(0.035*Math.sin(WK(3)*t+i*1.3)+0.025*(gust(t)-0.55))*(i?1:-1);const L=48;
 const lx=hx+Math.sin(a)*L,ly=hy+Math.cos(a)*L;
 // warm pool on the platform + on the wall behind
 const pool=X.createRadialGradient(lx,PLAT+30,10,lx,PLAT+30,300);pool.addColorStop(0,'rgba(255,190,110,.34)');pool.addColorStop(1,'rgba(255,190,110,0)');X.save();X.translate(lx,PLAT+30);X.scale(1,0.3);X.translate(-lx,-PLAT-30);X.fillStyle=pool;X.fillRect(lx-300,PLAT-300,600,700);X.restore();
 const wl=X.createRadialGradient(lx,ly+30,10,lx,ly+30,260);wl.addColorStop(0,'rgba(255,190,110,.22)');wl.addColorStop(1,'rgba(255,190,110,0)');X.fillStyle=wl;X.fillRect(lx-260,ly-230,520,520);
 // chain
 X.strokeStyle='#15171a';X.lineWidth=2.2;for(let k=0;k<12;k++){const u0=k/12,u1=(k+1)/12;X.beginPath();X.ellipse(hx+Math.sin(a)*L*(u0+u1)/2,hy+Math.cos(a)*L*(u0+u1)/2,k%2?1.5:3,4,a,0,6.28);X.stroke();}
 X.fillStyle='#15171a';X.fillRect(hx-10,hy-4,20,6);
 X.save();X.translate(lx,ly);X.rotate(-a);
 X.fillStyle='#15171a';X.beginPath();X.moveTo(-26,6);X.lineTo(26,6);X.lineTo(14,-12);X.lineTo(-14,-12);X.closePath();X.fill();X.beginPath();X.arc(0,-14,6,0,6.28);X.lineWidth=2.5;X.stroke();
 const gg=X.createLinearGradient(0,6,0,62);gg.addColorStop(0,'#ffe2a6');gg.addColorStop(1,'#ffb766');X.fillStyle=gg;X.beginPath();X.moveTo(-20,6);X.lineTo(20,6);X.lineTo(16,62);X.lineTo(-16,62);X.closePath();X.fill();
 X.fillStyle='#fff6d8';X.beginPath();X.ellipse(0,32,5,10,0,0,6.28);X.fill();
 X.strokeStyle='#15171a';X.lineWidth=3;X.beginPath();X.moveTo(-20,6);X.lineTo(-16,62);X.moveTo(20,6);X.lineTo(16,62);X.moveTo(0,6);X.lineTo(0,62);X.stroke();X.fillRect(-20,62,40,7);X.beginPath();X.moveTo(-8,69);X.lineTo(8,69);X.lineTo(0,78);X.fill();
 const gl=X.createRadialGradient(0,34,6,0,34,90);gl.addColorStop(0,'rgba(255,200,120,.45)');gl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=gl;X.fillRect(-90,-56,180,180);
 X.restore();});}
// the hanging clock at the centre of the canopy (11:47), on a bracket from the valance beam
function clock(){const x=540,y=1150;X.fillStyle='#15171a';X.fillRect(x-4,CAN.y1,8,y-CAN.y1-34);X.fillRect(x-30,CAN.y1+2,60,8);
 X.beginPath();X.arc(x,y,36,0,6.28);X.fill();X.fillStyle='#f1ead6';X.beginPath();X.arc(x,y,30,0,6.28);X.fill();
 X.strokeStyle='#22201c';X.lineWidth=2;for(let k=0;k<12;k++){const a=k*Math.PI/6;X.beginPath();X.moveTo(x+Math.sin(a)*24,y-Math.cos(a)*24);X.lineTo(x+Math.sin(a)*28,y-Math.cos(a)*28);X.stroke();}
 const hm=(11+47/60)/12*2*Math.PI,mm=47/60*2*Math.PI;X.lineCap='round';X.lineWidth=3.5;X.beginPath();X.moveTo(x,y);X.lineTo(x+Math.sin(hm)*15,y-Math.cos(hm)*15);X.stroke();X.lineWidth=2.4;X.beginPath();X.moveTo(x,y);X.lineTo(x+Math.sin(mm)*23,y-Math.cos(mm)*23);X.stroke();
 X.fillStyle='#22201c';X.beginPath();X.arc(x,y,3,0,6.28);X.fill();X.fillStyle='rgba(255,210,150,.14)';X.beginPath();X.arc(x-6,y-6,26,0,6.28);X.fill();}
// signal lamp: red, then green at 9.6 s (with a soft halo) — the last train is on its way
function signal(t){const g=sigGreen(t),k=g?clamp((t-9.6)/0.4,0,1)*clamp((19.6-t)/0.1,0,1):0;
 const lamp=(y,col,a)=>{const hal=X.createRadialGradient(SIG.x,y,1,SIG.x,y,60);hal.addColorStop(0,col.replace('A',0.55*a));hal.addColorStop(1,col.replace('A',0));X.fillStyle=hal;X.fillRect(SIG.x-60,y-60,120,120);X.fillStyle=col.replace('A',0.4+0.6*a);X.beginPath();X.arc(SIG.x,y,8,0,6.28);X.fill();};
 lamp(SIG.y+16,'rgba(255,60,50,A)',1-k);lamp(SIG.y+50,'rgba(80,255,150,A)',k);
}
// rails + puddles mirror the lantern light; the platform's wet sheen
function wet(t){const {f}=flashAt(t);X.save();X.globalCompositeOperation='screen';
 LANT.forEach(([hx],i)=>{for(const [y,w,a] of [[RAILB+1,180,0.5],[RAILF+1,220,0.55]]){const g=X.createLinearGradient(hx-w,0,hx+w,0);g.addColorStop(0,'rgba(255,200,130,0)');g.addColorStop(0.5,`rgba(255,210,150,${a})`);g.addColorStop(1,'rgba(255,200,130,0)');X.fillStyle=g;X.fillRect(hx-w,y,w*2,3);}
  // streaky vertical reflection of the lantern on the wet platform
  const rx=hx,ry=PLAT+20;const sg=X.createLinearGradient(0,ry,0,ry+110);sg.addColorStop(0,'rgba(255,200,120,.30)');sg.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=sg;X.filter='blur(5px)';for(let k=-2;k<=2;k++){const wv=Math.sin(WK(5)*t+k+i)*2;X.fillRect(rx+k*7+wv,ry,4,110-Math.abs(k)*20);}X.filter='none';});
 X.restore();}
// drips from the valance points onto the front of the platform, with splashes
function drips(t){const pts=[];for(let x=40;x<W-30;x+=22)pts.push(x+10);
 pts.forEach((x,i)=>{const r=rng(i+90);if(r()<0.55)return;const T=20/(2+Math.floor(r()*4)),ph=r();const u=((t/T+ph)%1);const fall=0.42;
  if(u<fall){const y=CAN.y1+6+Math.pow(u/fall,2)*(PLAT+70-CAN.y1);X.strokeStyle='rgba(210,220,240,.45)';X.lineWidth=2;X.beginPath();X.moveTo(x,y-10);X.lineTo(x,y);X.stroke();}
  else if(u<fall+0.08){const p=(u-fall)/0.08;X.strokeStyle=`rgba(220,230,250,${0.5*(1-p)})`;X.lineWidth=1.3;X.beginPath();X.ellipse(x,PLAT+72,3+p*12,1+p*2.5,0,0,6.28);X.stroke();}
  else{const k=1-Math.min(1,(u-fall)/0.4);X.fillStyle=`rgba(220,230,250,${0.5*k})`;X.beginPath();X.ellipse(x,CAN.y1+8,2,2.6+1.5*(1-k),0,0,6.28);X.fill();}});}
function smoke(t){const [cx,cy]=CHTOP;for(let i=0;i<30;i++){const p=((t/2.5+i/30)%1);const G=gust(t-p*2);const x=cx+p*p*260*G+Math.sin(p*7+i)*8*p,y=cy-18-p*150+p*p*40;const rad=10+p*46;
 const g=X.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,`rgba(140,145,160,${0.18*Math.pow(Math.sin(Math.min(0.5,p)*Math.PI)*(1-p),0.6)})`);g.addColorStop(1,'rgba(140,145,160,0)');X.fillStyle=g;X.fillRect(x-rad,y-rad,rad*2,rad*2);}}
function caption(t){if(t>6.4)return;const a=Math.min(1,0.45+t/1.0)*Math.max(0,Math.min(1,(6.2-t)/1.5));
 X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*6,y=250;const bl=Math.max(0,(t-4.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
 X.font="italic 500 74px Corm, serif";X.shadowColor='rgba(255,210,160,.5)';X.shadowBlur=28;X.fillStyle='#fbf6ee';
 const C1=(window.CAP||['the last train is late.','the stove is lit.']);for(let k=0;k<2;k++){X.fillText(C1[0],x,y);X.fillText(C1[1],x,y+86);X.shadowBlur=0;}
 X.restore();}
let READY=false;
function buildStatic(){let q;[SKY,q]=off();skyPaint(q);[TREES,q]=off();treesPaint(q);[BLDC,q]=off();buildingPaint(q);canopyPaint(q);[PLATF,q]=off();platformPaint(q);[INT,q]=off();interiorPaint(q);
 // flash rim layer: lights only the roof polygon, the ridge, chimney and the pine tops (no translucent boxes)
 [BLDR,q]=off();q.save();q.beginPath();q.moveTo(BLD.x0-34,BLD.eave);q.lineTo(BLD.x0+150,BLD.ridge);q.lineTo(BLD.x1-150,BLD.ridge);q.lineTo(BLD.x1+34,BLD.eave);q.closePath();q.clip();
 const fg=q.createLinearGradient(0,BLD.ridge,0,BLD.eave);fg.addColorStop(0,'rgba(150,165,220,.35)');fg.addColorStop(1,'rgba(150,165,220,.05)');q.fillStyle=fg;q.fillRect(0,BLD.ridge,W,BLD.eave-BLD.ridge);q.restore();
 q.strokeStyle='rgba(190,205,255,.9)';q.lineWidth=3;q.beginPath();q.moveTo(BLD.x0+150,BLD.ridge);q.lineTo(BLD.x1-150,BLD.ridge);q.moveTo(CHTOP[0]-32,CHTOP[1]-8);q.lineTo(CHTOP[0]+32,CHTOP[1]-8);q.stroke();
 q.fillStyle='rgba(150,165,220,.18)';q.fillRect(0,PLAT,W,EDGE-PLAT);
 READY=true;}
window.draw=function(t){if(!READY)buildStatic();
 const {f}=flashAt(t);
 const z=1.0+0.03*(1-Math.cos(WK(1)*t))/2,Fx=540+14*Math.sin(WK(1)*t),Fy=1300;const ox=S*(Fx-Fx*z),oy=S*(Fy-Fy*z);
 const L=()=>X.setTransform(z,0,0,z,ox,oy),A=()=>X.setTransform(S*z,0,0,S*z,ox,oy);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 L();X.drawImage(SKY,0,0);A();scud(t);skyLightning(t);
 L();X.drawImage(TREES,0,0);A();smoke(t);
 L();X.drawImage(INT,0,0);A();interiorLive(t);
 L();X.drawImage(BLDC,0,0);if(f>0.002){X.save();X.globalAlpha=Math.min(1,f*2.2);X.globalCompositeOperation='lighter';X.drawImage(BLDR,0,0);X.restore();}
 L();X.drawImage(PLATF,0,0);
 A();glassFX(t);clock();lanterns(t);signal(t);wet(t);drips(t);rain(t,false);rain(t,true);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);
};
