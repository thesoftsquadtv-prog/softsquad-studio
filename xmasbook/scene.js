// Soft Ambience — "the bookshop put its christmas lights up tonight". The same little bookshop-café as bookshop/, weeks later:
// the first snow of the winter. Snow on the slates, sills, awning and lamp; snowy pavement with footprints that lead to the
// door, tyre tracks through the snow on the cobbles. String lights along the fascia and the awning, a wreath on the door,
// and in the display window a little potted fir with twinkling lights and a star, the shop cat asleep at its foot.
// Falling snow in 3 depths; every motion repeats every LOOP (20 s) so the video loops seamlessly.
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
const LOOP=20, WK=k=>2*Math.PI*k/LOOP;
const gust=t=>0.55+0.3*Math.sin(WK(1)*t)+0.15*Math.sin(WK(3)*t+1)+0.08*Math.sin(WK(9)*t);
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function off(){const c=document.createElement('canvas');c.width=W*S;c.height=H*S;const q=c.getContext('2d');q.scale(S,S);return [c,q];}
function rr(q,x,y,w,h,r){q.beginPath();q.moveTo(x+r,y);q.arcTo(x+w,y,x+w,y+h,r);q.arcTo(x+w,y+h,x,y+h,r);q.arcTo(x,y+h,x,y,r);q.arcTo(x,y,x+w,y,r);q.closePath();}
function ell(q,x,y,rx,ry){q.beginPath();q.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
// layout
const GND=1560, CURB=1640;                         // facade foot / kerb line
const BLD={x0:150,x1:930};                          // the bookshop building
const DW={x:200,y:1290,w:370,h:200};                // display window glass
const DOOR={x:640,y:1290,w:150,h:270};              // shop door (glass upper half)
const SW={x:822,y:1290,w:80,h:150};                 // small side window
const LAMP={x:64,y:1150};                           // lamp-post lantern
const CHTOP=[788,360];
const FLASH=[];const SASHES=[];
function flashAt(t){let f=0,bolt=null;for(const [lt,a,bx,hasB] of FLASH){const d=t-lt;if(d>0&&d<1.2){let v=a*Math.exp(-d*7);if(d>0.16)v+=a*0.7*Math.exp(-(d-0.16)*9);f=Math.max(f,v);if(d<0.32&&hasB)bolt={bx,d,a,seed:lt*10};}}return {f,bolt};}

// ---------- static paint ----------
let SKY,BLDC,BLDR,STREET,INT;
function skyPaint(q){const g=q.createLinearGradient(0,0,0,1300);g.addColorStop(0,'#0b0f1a');g.addColorStop(0.5,'#171d2c');g.addColorStop(1,'#2a2f40');q.fillStyle=g;q.fillRect(0,0,W,1400);
 const r=rng(8);q.filter='blur(18px)';
 for(let i=0;i<55;i++){const x=r()*(W+300)-150,y=20+Math.pow(r(),1.1)*620,rx=120+r()*220,ry=40+r()*60;const lift=y/700;
  const cg=q.createRadialGradient(x,y+ry*0.4,4,x,y,rx);cg.addColorStop(0,`rgba(${64+lift*36|0},${72+lift*34|0},${92+lift*32|0},.5)`);cg.addColorStop(0.7,`rgba(${38+lift*24|0},${44+lift*24|0},${60+lift*24|0},.3)`);cg.addColorStop(1,'rgba(30,36,50,0)');
  q.fillStyle=cg;ell(q,x,y,rx,ry);q.fill();}
 for(let i=0;i<26;i++){const cx=r()*W,cy=120+r()*520;for(let k=0;k<8;k++){const px=cx+(k-4)*(26+r()*20),py=cy+Math.abs(k-4)*6+r()*10,pr=30+r()*36;const cg=q.createRadialGradient(px,py+pr*0.3,2,px,py,pr);cg.addColorStop(0,'rgba(88,96,118,.26)');cg.addColorStop(1,'rgba(60,66,84,0)');q.fillStyle=cg;q.beginPath();q.arc(px,py,pr,0,6.28);q.fill();}}
 q.filter='none';
 const hz=q.createLinearGradient(0,300,0,1300);hz.addColorStop(0,'rgba(150,150,180,0)');hz.addColorStop(1,'rgba(170,160,180,.22)');q.fillStyle=hz;q.fillRect(0,300,W,1000);}
function bricks(q,x,y,w,h,base,seed){q.save();q.beginPath();q.rect(x,y,w,h);q.clip();q.fillStyle=base;q.fillRect(x,y,w,h);const r=rng(seed);
 for(let yy=y;yy<y+h;yy+=22){const o=((yy-y)/22)%2?0:26;for(let xx=x-52+o;xx<x+w;xx+=52){const k=0.85+r()*0.3;q.fillStyle=shade(base,k);q.fillRect(xx+2,yy+2,48,18);}}
 q.restore();}
function shade(hex,k){const n=parseInt(hex.slice(1),16);const f=v=>clamp(Math.round(v*k),0,255);return `rgb(${f(n>>16)},${f((n>>8)&255)},${f(n&255)})`;}
function sash(q,x,y,w,h,lit,seed){const V=seed%4;SASHES.push([x,y,w,h]); // upper-floor sash window with frame, sill, glazing bars; lit=0..1 (warm, curtains)
 q.fillStyle='#d9d2c4';q.fillRect(x-12,y-14,w+24,h+28);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(x-12,y+h+8,w+24,6);
 q.fillStyle='#c9c1b2';q.fillRect(x-20,y+h+12,w+40,14);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(x-20,y+h+26,w+40,6);    // stone sill + its shadow
 if(lit>0){const g=q.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#f6c27c');g.addColorStop(1,'#e59a54');q.fillStyle=g;q.fillRect(x,y,w,h);
  // curtains drawn back to each side, folds
  for(const sd of [0,1]){const cx=sd?x+w:x;q.fillStyle='#a2493f';q.beginPath();q.moveTo(cx,y);q.lineTo(cx+(sd?-46:46),y);q.quadraticCurveTo(cx+(sd?-20:20),y+h*0.6,cx+(sd?-30:30),y+h);q.lineTo(cx,y+h);q.closePath();q.fill();
   q.strokeStyle='rgba(60,20,20,.35)';q.lineWidth=2;for(let k=1;k<4;k++){q.beginPath();q.moveTo(cx+(sd?-k*11:k*11),y+4);q.quadraticCurveTo(cx+(sd?-k*6:k*6),y+h*0.6,cx+(sd?-k*8:k*8),y+h);q.stroke();}}
  if(V==1){ // fairy lights looped across the top + a bookshelf
   q.fillStyle='rgba(90,50,30,.55)';q.fillRect(x+w*0.55,y+h*0.45,w*0.3,h*0.55);for(let k=0;k<3;k++){q.fillStyle='rgba(60,30,20,.5)';q.fillRect(x+w*0.55,y+h*(0.58+k*0.14),w*0.3,3);}
   for(let k=0;k<9;k++){const u=k/8;q.fillStyle='#fff2c0';ell(q,x+6+u*(w-12),y+14+Math.sin(u*Math.PI*2)*6+8,2.6,2.6);q.fill();}
  } else if(V==3){ // blind half down, warm glow below
   q.fillStyle='#e9dcc0';q.fillRect(x,y,w,h*0.45);q.strokeStyle='rgba(120,90,60,.3)';q.lineWidth=1.5;for(let k=1;k<8;k++){q.beginPath();q.moveTo(x,y+k*h*0.055);q.lineTo(x+w,y+k*h*0.055);q.stroke();}q.fillStyle='#b9a27a';q.fillRect(x+w/2-10,y+h*0.45,20,4);
  } else {
  // a lamp shade + plant silhouette inside
  q.fillStyle='rgba(120,60,30,.55)';q.beginPath();q.moveTo(x+w*0.62,y+h*0.52);q.lineTo(x+w*0.78,y+h*0.52);q.lineTo(x+w*0.82,y+h*0.68);q.lineTo(x+w*0.58,y+h*0.68);q.closePath();q.fill();
  q.fillStyle='rgba(255,236,190,.9)';q.fillRect(x+w*0.6,y+h*0.68,w*0.2,4);
  q.fillStyle='rgba(60,60,30,.6)';for(let k=0;k<7;k++){q.beginPath();q.ellipse(x+w*0.3+(k-3)*8,y+h*0.72-Math.abs(k-3)*7,6,16,(k-3)*0.3,0,6.28);q.fill();}
  q.fillStyle='rgba(90,50,30,.7)';q.fillRect(x+w*0.25,y+h*0.76,w*0.12,h*0.14);
  }
 } else {const g=q.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#28304a');g.addColorStop(1,'#141826');q.fillStyle=g;q.fillRect(x,y,w,h);
  q.fillStyle='rgba(150,165,210,.12)';q.beginPath();q.moveTo(x,y+h*0.35);q.lineTo(x+w*0.5,y);q.lineTo(x+w*0.7,y);q.lineTo(x,y+h*0.6);q.closePath();q.fill();}
 q.fillStyle='#d9d2c4';q.fillRect(x,y+h/2-5,w,10);q.fillRect(x+w/2-3,y,6,h/2);q.fillRect(x+w/2-3,y+h/2,6,h/2);       // meeting rail + bars
 if(lit>0){q.fillStyle='rgba(255,200,130,.35)';q.fillRect(x-20,y+h+12,w+40,4);}                                        // warm light catching the sill
}
function buildingsPaint(q){
 // --- left neighbour (taller, darker brick) ---
 q.fillStyle='#1c1a22';q.beginPath();q.moveTo(-40,430);q.lineTo(60,350);q.lineTo(160,430);q.lineTo(160,GND);q.lineTo(-40,GND);q.closePath();q.fill();
 bricks(q,-40,430,190,GND-430,'#3b2e2c',3);
 q.fillStyle='#211d26';q.beginPath();q.moveTo(-60,440);q.lineTo(60,340);q.lineTo(180,440);q.lineTo(170,450);q.lineTo(60,356);q.lineTo(-50,450);q.closePath();q.fill();
 sash(q,10,720,100,170,1,3);sash(q,10,1010,100,170,0,2);
 q.fillStyle='#2a2430';q.fillRect(-40,1240,190,GND-1240);q.fillStyle='#1a1722';q.fillRect(-40,1250,190,40);q.fillStyle='#b9a27a';q.font='italic 500 27px Corm, serif';q.textAlign='center';q.textBaseline='middle';
 q.fillStyle='#151824';q.fillRect(-20,1310,150,170);q.fillStyle='rgba(120,140,190,.12)';q.beginPath();q.moveTo(-20,1400);q.lineTo(70,1310);q.lineTo(110,1310);q.lineTo(-20,1440);q.closePath();q.fill();
 q.fillStyle='#3a3340';q.fillRect(-20,1480,150,GND-1480);q.strokeStyle='#3a3340';q.lineWidth=8;q.strokeRect(-20,1310,150,170);
 // --- right neighbour (lower, painted render, attic window lit) ---
 q.fillStyle='#4a4f5c';q.fillRect(920,560,200,GND-560);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(920,560,14,GND-560);
 q.fillStyle='#262833';q.beginPath();q.moveTo(910,570);q.lineTo(1000,470);q.lineTo(1120,470);q.lineTo(1120,570);q.closePath();q.fill();
 sash(q,975,740,90,160,0,4);sash(q,975,1010,90,160,1,5);
 q.fillStyle='#33303c';q.fillRect(930,1250,190,GND-1250);q.fillStyle='#d9d2c4';q.fillRect(966,1296,104,GND-1296);q.fillStyle='#2d3a55';q.fillRect(974,1340,88,GND-1340);
 q.fillStyle='#24304a';q.fillRect(974,1340,88,8);q.strokeStyle='rgba(255,255,255,.08)';q.lineWidth=3;q.strokeRect(984,1360,68,70);q.strokeRect(984,1446,68,90);
 q.fillStyle='#e8c46a';ell(q,1048,1450,5,5);q.fill();q.fillStyle='#1d2236';q.fillRect(974,1304,88,30);q.fillStyle='rgba(255,200,130,.25)';q.fillRect(978,1308,80,22);q.fillStyle='#d9d2c4';q.fillRect(1016,1304,4,30);
 q.fillStyle='#7d7a78';q.fillRect(958,GND,120,10);
 // --- the bookshop building: cream-grey render, slate roof with a chimney and a dormer ---
 const {x0,x1}=BLD;
 let g=q.createLinearGradient(0,600,0,GND);g.addColorStop(0,'#6b645c');g.addColorStop(1,'#5a534d');q.fillStyle=g;q.fillRect(x0,620,x1-x0,GND-620);
 q.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<9;i++){q.fillRect(x0,640+i*64,x1-x0,2);}                                  // render courses
 q.fillStyle='rgba(0,0,0,.28)';q.fillRect(x0,620,10,GND-620);q.fillRect(x1-10,620,10,GND-620);                       // party-wall shadow lines
 // roof (front slope seen nearly edge-on → a band of slates) + chimney stack on the ridge
 q.fillStyle='#2b2d38';q.beginPath();q.moveTo(x0-24,632);q.lineTo(x0+40,470);q.lineTo(x1-40,470);q.lineTo(x1+24,632);q.closePath();q.fill();
 q.save();q.beginPath();q.moveTo(BLD.x0-24,632);q.lineTo(BLD.x0+40,470);q.lineTo(BLD.x1-40,470);q.lineTo(BLD.x1+24,632);q.closePath();q.clip();
 const r=rng(12);for(let yy=480;yy<630;yy+=16){const t0=(yy-470)/162;const xa=lerp(x0+40,x0-24,t0),xb=lerp(x1-40,x1+24,t0);
  for(let xx=xa-30+((yy/16)%2)*15;xx<xb+30;xx+=30){q.fillStyle=shade('#343744',0.85+r()*0.3);q.fillRect(xx+1,yy,28,14);}}
 q.restore();q.strokeStyle='#1d1e27';q.lineWidth=8;q.beginPath();q.moveTo(BLD.x0-24,634);q.lineTo(BLD.x0+40,468);q.lineTo(BLD.x1-40,468);q.lineTo(BLD.x1+24,634);q.stroke();
 q.fillStyle='#1d1e27';q.fillRect(x0-30,628,x1-x0+60,12);                                                             // gutter
 // dormer with a small dark window
 q.fillStyle='#5f5952';q.fillRect(330,500,150,120);q.fillStyle='rgba(0,0,0,.22)';q.fillRect(330,500,14,120);q.fillRect(466,500,14,120);
 q.fillStyle='#2b2d38';q.beginPath();q.moveTo(316,506);q.lineTo(405,452);q.lineTo(494,506);q.closePath();q.fill();
 q.strokeStyle='#d9d2c4';q.lineWidth=5;q.beginPath();q.moveTo(314,508);q.lineTo(405,453);q.lineTo(496,508);q.stroke();q.fillStyle='#55595f';q.fillRect(324,616,162,6);
 sash(q,365,525,80,80,0,7);
 // chimney
 bricks(q,735,392,72,92,'#5b3e34',9);q.fillStyle='#463029';q.fillRect(729,384,84,14);
 q.fillStyle='#6b4636';q.fillRect(746,366,20,22);q.fillRect(778,370,20,18);                                           // pots
 q.fillStyle='rgba(0,0,0,.3)';q.fillRect(729,398,84,6);
 // upper floors: 2 × 2 sash windows, one lit
 sash(q,250,700,140,190,0,21);sash(q,680,700,140,190,1,22);sash(q,250,950,140,190,1,25);sash(q,680,950,140,190,0,24);
 // window box with trailing ivy under the lit first-floor window
 q.fillStyle='#3b2a22';q.fillRect(666,876,168,30);q.fillStyle='rgba(255,190,120,.25)';q.fillRect(666,876,168,3);
 for(let i=0;i<26;i++){const x=670+r()*160,L=20+r()*60;q.strokeStyle='#2f4a2e';q.lineWidth=2;q.beginPath();q.moveTo(x,890);q.quadraticCurveTo(x+(r()-0.5)*18,900+L*0.5,x+(r()-0.5)*10,900+L);q.stroke();
  for(let k=0;k<4;k++){q.fillStyle=k%2?'#3c5e38':'#456b40';ell(q,x+(r()-0.5)*12,896+r()*L,5,3.6);q.fill();}}
 for(let i=0;i<9;i++){q.fillStyle=i%3?'#b3262e':'#d6343c';ell(q,680+i*18,870+(i%2)*6,5,5);q.fill();}
 // downpipe on the right edge of the building
 q.fillStyle='#22232b';q.fillRect(x1-34,632,14,GND-632-10);q.fillStyle='rgba(255,255,255,.08)';q.fillRect(x1-32,632,3,GND-642);
 q.fillStyle='#22232b';q.beginPath();q.moveTo(x1-34,GND-20);q.lineTo(x1-20,GND-20);q.lineTo(x1-12,GND-6);q.lineTo(x1-26,GND-6);q.closePath();q.fill();     // shoe
 for(const yy of [760,1000,1240])q.fillRect(x1-38,yy,22,6);
 // --- shopfront: painted dark green timber, gold-lettered fascia, pilasters, stallriser ---
 q.fillStyle='#24413b';q.fillRect(x0+10,1172,x1-x0-20,GND-1172);
 q.fillStyle='#1b322d';q.fillRect(x0+10,1172,x1-x0-20,86);                                                           // fascia board
 q.fillStyle='#2e524a';q.fillRect(x0+10,1172,x1-x0-20,6);q.fillRect(x0+10,1252,x1-x0-20,6);
 q.fillStyle='#d8b36a';q.font="italic 500 58px Corm, serif";q.textAlign='center';q.textBaseline='middle';q.fillText('books & tea',(x0+x1)/2,1214);
 q.fillStyle='rgba(216,179,106,.55)';q.fillRect((x0+x1)/2-200,1240,400,2);
 for(const px of [x0+10,600,x1-46]){q.fillStyle='#2b4c45';q.fillRect(px,1258,36,GND-1258);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(px+30,1258,6,GND-1258);q.fillStyle='#355d54';q.fillRect(px,1258,4,GND-1258);}
 // display window: frame + glass hole (interior drawn live beneath), stallriser panels
 q.fillStyle='#1d3530';q.fillRect(DW.x-12,DW.y-12,DW.w+24,DW.h+24);q.clearRect(DW.x,DW.y,DW.w,DW.h);
 q.fillStyle='#1d3530';q.fillRect(DW.x+DW.w/2-5,DW.y,10,DW.h);
 q.fillStyle='#21403a';q.fillRect(DW.x-12,DW.y+DW.h+12,DW.w+24,GND-(DW.y+DW.h+12));q.strokeStyle='rgba(255,255,255,.07)';q.lineWidth=3;q.strokeRect(DW.x+6,DW.y+DW.h+22,DW.w/2-16,GND-(DW.y+DW.h)-36);q.strokeRect(DW.x+DW.w/2+10,DW.y+DW.h+22,DW.w/2-16,GND-(DW.y+DW.h)-36);
 // side window
 q.fillStyle='#1d3530';q.fillRect(SW.x-8,SW.y-8,SW.w+16,SW.h+16);q.clearRect(SW.x,SW.y,SW.w,SW.h);
 // door: frame, glass upper panel (hole), lower timber panels, brass handle + letterbox, a stone step
 q.fillStyle='#1d3530';q.fillRect(DOOR.x-12,DOOR.y-14,DOOR.w+24,DOOR.h+14);
 q.fillStyle='#2a4a43';q.fillRect(DOOR.x,DOOR.y,DOOR.w,DOOR.h);q.clearRect(DOOR.x+18,DOOR.y+16,DOOR.w-36,140);
 q.strokeStyle='rgba(255,255,255,.08)';q.lineWidth=3;q.strokeRect(DOOR.x+18,DOOR.y+176,DOOR.w-36,76);
 q.fillStyle='#c9a45a';q.fillRect(DOOR.x+DOOR.w-30,DOOR.y+160,8,30);q.fillRect(DOOR.x+48,DOOR.y+190,54,9);
 q.fillStyle='#8b8784';q.fillRect(DOOR.x-22,GND,DOOR.w+44,14);q.fillStyle='rgba(255,255,255,.12)';q.fillRect(DOOR.x-22,GND,DOOR.w+44,3);
 // fanlight above the door (glass hole too)
 q.clearRect(DOOR.x+8,DOOR.y-2-0,0,0);
}
// awning over the display window + door (striped canvas, scalloped valance), seen slightly from below
function awningPaint(q){ // the awning is rolled up for the winter: a striped canvas roll in its cassette under the fascia
 const xl=180,xr=800,y0=1262,h=26;
 q.fillStyle='rgba(0,0,0,.35)';q.fillRect(xl,y0+h,xr-xl,6);
 for(let i=0;i<31;i++){const x=lerp(xl,xr,i/31),w=(xr-xl)/31;q.fillStyle=i%2?'#e6dbc2':'#29514a';q.fillRect(x,y0,w+0.5,h);}
 const g=q.createLinearGradient(0,y0,0,y0+h);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(0.35,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.45)');q.fillStyle=g;q.fillRect(xl,y0,xr-xl,h);
 q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.moveTo(xl,y0+h-6);q.quadraticCurveTo((xl+xr)/2,y0+h+4,xr,y0+h-6);q.lineTo(xr,y0+h);q.quadraticCurveTo((xl+xr)/2,y0+h+10,xl,y0+h);q.fill();
 for(const ex of [xl-6,xr+6]){q.fillStyle='#1d3530';ell(q,ex,y0+h/2,9,h/2+3);q.fill();q.fillStyle='#2e524a';ell(q,ex,y0+h/2,5,h/2-2);q.fill();}
}
function streetPaint(q){
 // pavement: big flags, wet sheen
 let g=q.createLinearGradient(0,GND,0,CURB);g.addColorStop(0,'#2a2c34');g.addColorStop(1,'#34363f');q.fillStyle=g;q.fillRect(0,GND,W,CURB-GND);
 q.strokeStyle='rgba(0,0,0,.35)';q.lineWidth=2;for(let x=-40;x<W;x+=150){q.beginPath();q.moveTo(x,GND);q.lineTo(x-30,CURB);q.stroke();}q.beginPath();q.moveTo(0,GND+38);q.lineTo(W,GND+38);q.stroke();
 q.fillStyle='rgba(0,0,0,.4)';q.fillRect(0,GND,W,6);                                                                  // contact shadow at the wall foot
 // kerb stone
 q.fillStyle='#4a4c55';q.fillRect(0,CURB,W,12);q.fillStyle='#24252c';q.fillRect(0,CURB+12,W,16);q.fillStyle='rgba(255,255,255,.1)';q.fillRect(0,CURB,W,2);
 // cobbled road: rows get larger toward us
 g=q.createLinearGradient(0,CURB+28,0,H);g.addColorStop(0,'#1a1c23');g.addColorStop(1,'#22242c');q.fillStyle=g;q.fillRect(0,CURB+28,W,H-CURB-28);
 const r=rng(31);let y=CURB+34,row=0;while(y<H+40){const hgt=10+(y-CURB)*0.07,wd=hgt*2.1;const o=row%2?wd/2:0;
  for(let x=-wd+o;x<W+wd;x+=wd+3){const k=0.8+r()*0.4;const cg=q.createRadialGradient(x+wd*0.4,y,1,x+wd*0.5,y+hgt*0.5,wd*0.7);cg.addColorStop(0,shade('#3a3c46',k));cg.addColorStop(1,shade('#23252d',k));q.fillStyle=cg;rr(q,x,y,wd,hgt,hgt*0.45);q.fill();
   q.fillStyle='rgba(200,210,235,.06)';q.fillRect(x+wd*0.2,y+2,wd*0.5,2);}
  y+=hgt+3;row++;}
 // gutter channel water along the kerb
 q.fillStyle='rgba(120,135,170,.18)';q.fillRect(0,CURB+28,W,10);
}
function interiorPaint(q){ // the shop interior seen through glass (one room behind display window, door and side window)
 const x0=DW.x-10,x1=SW.x+SW.w+10,y0=1240,y1=GND;
 let g=q.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#c98a4e');g.addColorStop(1,'#a8693a');q.fillStyle=g;q.fillRect(x0,y0,x1-x0,y1-y0);
 // tall bookshelves across the back wall
 const r=rng(44);const cols=['#8e3b3b','#2f5d6b','#c9a24a','#4f6b3a','#6a4a7a','#d8cbb0','#9c5a2c','#334a6e','#b86b5a'];
 for(let sx=x0+10;sx<x1-10;sx+=118){q.fillStyle='#5a3a24';q.fillRect(sx,y0+10,110,y1-y0-30);
  for(let sy=y0+24;sy<y1-40;sy+=52){q.fillStyle='#3e2818';q.fillRect(sx+6,sy,98,46);let bx=sx+8;while(bx<sx+100){const bw=6+r()*9,bh=30+r()*14;q.fillStyle=cols[(r()*cols.length)|0];q.fillRect(bx,sy+46-bh,bw,bh);q.fillStyle='rgba(255,230,180,.25)';q.fillRect(bx+1,sy+46-bh+4,1.5,bh-8);bx+=bw+1;}
   q.fillStyle='#6b4630';q.fillRect(sx+4,sy+46,102,5);}}
 // warm lamp glow on the shelves from the pendants
 for(const lx of [300,520,740]){g=q.createRadialGradient(lx,1290,10,lx,1330,240);g.addColorStop(0,'rgba(255,214,150,.55)');g.addColorStop(1,'rgba(255,190,120,0)');q.fillStyle=g;q.fillRect(x0,y0,x1-x0,y1-y0);}
 // window seat in the display window: a cushioned bench along the glass, with a little table
 q.fillStyle='#6a4630';q.fillRect(DW.x,1440,DW.w,50);
 g=q.createLinearGradient(0,1414,0,1446);g.addColorStop(0,'#c07a6a');g.addColorStop(1,'#9d5a4c');q.fillStyle=g;rr(q,DW.x+8,1414,DW.w-16,34,14);q.fill();
 
}
// ---------- snow on everything (static layer painted over the buildings) ----------
const SNOW_A='#e9edf7',SNOW_B='#c3cbe0';
function snowCap(q,x0,y0,x1,y1,th,seed){ // an uneven soft cap along a ledge/edge from (x0,y0) to (x1,y1), thickness th, overhanging lumps
 const r=rng(seed);const n=Math.max(6,Math.hypot(x1-x0,y1-y0)/10|0);
 const g=q.createLinearGradient(0,Math.min(y0,y1)-th,0,Math.max(y0,y1)+th*0.6);g.addColorStop(0,SNOW_A);g.addColorStop(1,SNOW_B);q.fillStyle=g;
 q.beginPath();q.moveTo(x0-2,y0+th*0.3);
 for(let k=0;k<=n;k++){const u=k/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u);q.lineTo(x,y-th*(0.55+0.45*Math.sin(u*Math.PI))*(0.8+r()*0.35));}
 for(let k=n;k>=0;k--){const u=k/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u);q.lineTo(x,y+th*0.25+(r()<0.25?r()*th*0.5:0));}
 q.closePath();q.fill();
 q.fillStyle='rgba(255,255,255,.5)';q.beginPath();for(let k=0;k<=n;k++){const u=k/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u)-th*0.5*Math.sin(u*Math.PI)-th*0.45;k?q.lineTo(x,y):q.moveTo(x,y);}
 for(let k=n;k>=0;k--){const u=k/n;q.lineTo(lerp(x0,x1,u),lerp(y0,y1,u)-th*0.3*Math.sin(u*Math.PI)-th*0.25);}q.closePath();q.fill();}
function snowPaint(q){
 // main roof: the slope is buried; a few slate courses show through near the gutter where the snow is thinner
 const {x0,x1}=BLD;q.save();q.beginPath();q.moveTo(x0-24,632);q.lineTo(x0+40,470);q.lineTo(x1-40,470);q.lineTo(x1+24,632);q.closePath();q.clip();
 let g=q.createLinearGradient(0,462,0,632);g.addColorStop(0,'#eef1f8');g.addColorStop(1,'#b9c2d8');q.fillStyle=g;q.fillRect(x0-40,460,x1-x0+80,180);
 const r=rng(5);
 q.restore();
 // dormer stands up out of the snow
 q.fillStyle='#5f5952';q.fillRect(330,500,150,120);q.fillStyle='rgba(0,0,0,.22)';q.fillRect(330,500,14,120);q.fillRect(466,500,14,120);
 q.fillStyle='#2b2d38';q.beginPath();q.moveTo(316,506);q.lineTo(405,452);q.lineTo(494,506);q.closePath();q.fill();
 q.strokeStyle='#d9d2c4';q.lineWidth=5;q.beginPath();q.moveTo(314,508);q.lineTo(405,453);q.lineTo(496,508);q.stroke();q.fillStyle='#55595f';q.fillRect(324,616,162,6);
 sash(q,365,525,80,80,0,7);
 snowCap(q,x0-34,634,x1+34,634,16,1);                     // overhanging lip along the gutter
 snowCap(q,x0+36,470,x1-36,470,14,2);                     // ridge
 snowCap(q,310,508,405,452,12,3);snowCap(q,405,452,500,508,12,4);   // dormer roof
 snowCap(q,322,618,488,618,8,5);
 snowCap(q,727,384,815,384,14,6);q.fillStyle='#6b4636';q.fillRect(746,360,20,26);q.fillRect(778,364,20,22);snowCap(q,744,360,768,360,5,61);snowCap(q,776,364,800,364,5,62);                         // chimney top (smoke still rises from the pots)
 snowCap(q,-60,440,60,342,14,7);snowCap(q,60,342,180,440,14,8);       // left neighbour gable
 {const g2=q.createLinearGradient(0,470,0,572);g2.addColorStop(0,'#e9edf6');g2.addColorStop(1,'#b6bfd4');q.fillStyle=g2;q.beginPath();q.moveTo(910,570);q.lineTo(1000,470);q.lineTo(1120,470);q.lineTo(1120,570);q.closePath();q.fill();}
 snowCap(q,904,572,1124,572,12,17);snowCap(q,906,572,1000,470,14,9);snowCap(q,996,470,1124,470,14,10);  // right neighbour roof
 for(const [x,y,w,h] of SASHES){snowCap(q,x-22,y+h+12,x+w+22,y+h+12,10,x+y);snowCap(q,x-14,y-14,x+w+14,y-14,7,x+y+1);}
 snowCap(q,BLD.x0+6,1172,BLD.x1-6,1172,11,12);            // top of the fascia
 snowCap(q,958,GND-1,1078,GND-1,6,13);
 snowCap(q,178,1262,802,1262,10,14);
 // ledge at the foot of the shopfront + the door step
 snowCap(q,BLD.x0,GND,BLD.x1,GND,8,15);snowCap(q,DOOR.x-24,GND,DOOR.x+DOOR.w+24,GND,7,16);
}
// the snowy street: pavement and road under snow, footprints that go to the shop door, tyre tracks through to the cobbles
function snowStreet(q){
 let g=q.createLinearGradient(0,GND,0,CURB);g.addColorStop(0,'#aeb6cc');g.addColorStop(1,'#c6cde0');q.fillStyle=g;q.fillRect(0,GND,W,CURB-GND);
 q.fillStyle='rgba(60,60,80,.25)';q.fillRect(0,GND,W,5);
 // kerb edge in snow
 q.fillStyle='#d4d9e8';q.fillRect(0,CURB,W,10);q.fillStyle='#5a5d6a';q.fillRect(0,CURB+10,W,6);q.fillStyle='#9aa2b8';q.fillRect(0,CURB+16,W,12);
 // road under snow; one car has passed: a pair of narrow wheel ruts (wider apart nearer the camera), slush ridges, slight wander
 g=q.createLinearGradient(0,CURB+28,0,H);g.addColorStop(0,'#b7bfd4');g.addColorStop(1,'#d2d8e7');q.fillStyle=g;q.fillRect(0,CURB+28,W,H-CURB-28);
 const r=rng(19);
 for(const [yc,wd] of [[1738,15],[1812,20]]){
  for(let x=-10;x<=W+10;x+=6){const y=yc+Math.sin(x*0.004+yc)*6;
   q.fillStyle='rgba(78,84,104,.55)';ell(q,x,y,5,wd*0.42);q.fill();
   q.fillStyle='rgba(40,44,58,.25)';if(r()<0.35){ell(q,x+r()*4,y+(r()-0.5)*wd*0.5,3,2);q.fill();}
   q.fillStyle='rgba(232,236,246,.9)';ell(q,x,y-wd*0.5-1,4+r()*2,2+r()*1.5);q.fill();
   q.fillStyle='rgba(150,158,182,.7)';ell(q,x,y+wd*0.5+1,4+r()*2,1.6+r());q.fill();}}
 // soft blue shadows in the snow surface
 q.save();q.filter='blur(6px)';for(let i=0;i<30;i++){q.fillStyle='rgba(120,130,170,.12)';ell(q,r()*W,CURB+60+r()*(H-CURB-60),40+r()*80,5+r()*6);q.fill();}q.restore();
 // the shop's stone doorstep with a lip of snow
 q.fillStyle='#8b8784';q.fillRect(DOOR.x-22,GND,DOOR.w+44,14);q.fillStyle='#6e6a68';q.fillRect(DOOR.x-22,GND+14,DOOR.w+44,4);snowCap(q,DOOR.x-24,GND,DOOR.x+DOOR.w+24,GND,6,90);
 // footprints: paired L/R hollows pressed into the snow, walking in from the left and turning up to the doorstep
 const P=[];for(let k=0;k<=24;k++){const u=k/24;const x=lerp(-20,DOOR.x+DOOR.w/2,u),y=lerp(CURB-16,GND+24,Math.pow(u,1.5));P.push([x,y]);}
 for(let k=1;k<P.length;k++){const [x,y]=P[k],[px,py]=P[k-1];const a=Math.atan2(y-py,x-px),side=k%2?1:-1;const nx=-Math.sin(a)*6*side,ny=Math.cos(a)*6*side;const sc=0.75+0.25*(1-k/24);
  q.save();q.translate(x+nx,y+ny);q.rotate(a);q.scale(sc,sc*0.55);
  const fg=q.createRadialGradient(0,-1,0,0,0,9);fg.addColorStop(0,'rgba(96,104,134,.55)');fg.addColorStop(1,'rgba(96,104,134,.12)');q.fillStyle=fg;ell(q,0,0,9,5);q.fill();ell(q,-11,0,4.5,4);q.fill();
  q.fillStyle='rgba(240,243,250,.55)';ell(q,0,5.5,8,1.6);q.fill();q.restore();}
}
// falling snow in 3 depths (near flakes larger/softer); all fall speeds are whole cycles per LOOP so it loops seamlessly
let SN=null;
function snow(t,front){if(!SN){const r=rng(3);SN=[];for(let i=0;i<700;i++)SN.push({x:r(),y:r(),z:r(),p:r()*6.28});}
 for(const d of SN){const isF=d.z>0.93;if(isF!==front)continue;const n=d.z<0.5?1:(d.z<0.85?2:3);const span=H+120;
  const y=((d.y*span+t*span*n/LOOP)%span)-60;const sw=Math.sin(WK(n*2)*t+d.p)*(8+d.z*16)+Math.sin(WK(1)*t+d.p*2)*10;const x=((d.x*(W+120)+sw)%(W+120)+W+120)%(W+120)-60;
  const rad=front?4.2+d.z*2:0.9+d.z*2.4,a=front?0.55:0.35+d.z*0.45;
  let warm=0;for(const [lx,ly,lr,k] of [[LAMP.x+20,LAMP.y+80,230,1],[DW.x+DW.w/2,GND-100,300,0.6],[490,1340,380,0.5]]){const dd=Math.hypot(x-lx,y-ly);if(dd<lr)warm=Math.max(warm,(1-dd/lr)*k);}
  X.fillStyle=`rgba(255,${(244-30*warm)|0},${(250-80*warm)|0},${a})`;
  if(front){X.save();X.filter='blur(2.5px)';ell(X,x,y,rad,rad);X.fill();X.restore();}else{ell(X,x,y,rad,rad*0.9);X.fill();}}}
// string lights: warm bulbs on a dark wire, twinkling (whole cycles per LOOP)
function bulbs(t,pts,seed){const r=rng(seed);const C=['255,214,140','255,214,140','255,120,110','140,220,150','255,200,90'];
 X.strokeStyle='rgba(20,22,26,.85)';X.lineWidth=1.6;X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();
 pts.forEach((p,i)=>{if(i%2)return;const c=C[(r()*C.length)|0],k=1+((r()*3)|0),ph=r()*6.28;const tw=0.7+0.3*Math.sin(WK(k)*t+ph);
  const g=X.createRadialGradient(p[0],p[1]+4,0,p[0],p[1]+4,20);g.addColorStop(0,`rgba(${c},${0.45*tw})`);g.addColorStop(1,`rgba(${c},0)`);X.fillStyle=g;X.fillRect(p[0]-20,p[1]-16,40,40);
  X.fillStyle=`rgba(${c},${0.85+0.15*tw})`;ell(X,p[0],p[1]+4,2.8,4);X.fill();X.fillStyle='rgba(255,255,255,.6)';ell(X,p[0]-0.6,p[1]+2.6,1,1.4);X.fill();});}
function shopLights(t){
 const f=[];for(let i=0;i<=80;i++){const u=i/80,x=lerp(BLD.x0+16,BLD.x1-16,u),s2=(u*7)%1;f.push([x,1180+Math.sin(s2*Math.PI)*12]);}bulbs(t,f,4);
 const v=[];for(let i=0;i<=84;i++){const u=i/84,x=lerp(176,804,u),s2=(u*9)%1;v.push([x,1292+Math.sin(s2*Math.PI)*12]);}bulbs(t,v,9);
 // hooks at each end of both strings
 for(const [x,y] of [[BLD.x0+16,1180],[BLD.x1-16,1180],[176,1292],[804,1292]]){X.fillStyle='#22252c';ell(X,x,y-2,3.5,3.5);X.fill();}}
// a wreath hung on the door, over the glass
function wreath(t){const cx=DOOR.x+DOOR.w/2,cy=DOOR.y+58;X.save();X.translate(cx,cy);X.scale(0.74,0.74);X.translate(-cx,-cy);
 X.fillStyle='rgba(0,0,0,.3)';ell(X,cx+3,cy+4,40,40);X.fill();
 const r=rng(33);for(let i=0;i<70;i++){const a=r()*6.28,rr2=26+r()*10;X.fillStyle=['#1f4a2c','#2c5e38','#3a7046'][i%3];X.save();X.translate(cx+Math.cos(a)*rr2,cy+Math.sin(a)*rr2);X.rotate(a+1.57+(r()-0.5));ell(X,0,0,10,4);X.fill();X.restore();}
 for(let i=0;i<9;i++){const a=i/9*6.28+0.3;X.fillStyle='#c42a30';ell(X,cx+Math.cos(a)*30,cy+Math.sin(a)*30,4.2,4.2);X.fill();X.fillStyle='rgba(255,255,255,.5)';ell(X,cx+Math.cos(a)*30-1.2,cy+Math.sin(a)*30-1.2,1.2,1.2);X.fill();}
 // snow resting on the top of the wreath
 X.fillStyle='rgba(235,240,250,.85)';for(let i=0;i<6;i++){const a=-2.3+i*0.33;ell(X,cx+Math.cos(a)*33,cy+Math.sin(a)*34-1,2.4,1.6);X.fill();}
 // red velvet bow at the bottom
 X.fillStyle='#b3242b';X.beginPath();X.moveTo(cx,cy+34);X.quadraticCurveTo(cx-24,cy+20,cx-20,cy+42);X.closePath();X.fill();X.beginPath();X.moveTo(cx,cy+34);X.quadraticCurveTo(cx+24,cy+20,cx+20,cy+42);X.closePath();X.fill();
 X.beginPath();X.moveTo(cx-3,cy+36);X.lineTo(cx-12,cy+58);X.lineTo(cx-4,cy+54);X.closePath();X.fill();X.beginPath();X.moveTo(cx+3,cy+36);X.lineTo(cx+12,cy+58);X.lineTo(cx+4,cy+54);X.closePath();X.fill();
 X.fillStyle='#8e1a20';ell(X,cx,cy+35,5,4);X.fill();
 X.strokeStyle='#5a3a24';X.lineWidth=1.8;X.beginPath();X.moveTo(cx,cy-38);X.lineTo(cx,DOOR.y-40);X.stroke();X.restore();}
// the little potted fir in the display window: drooping overlapping tiers over a dark inner cone, lights, baubles, a star
// a little stack of books on the window seat with a lit candle-lantern on top
function books(x,base){const C=[['#8e3b3b',64,14],['#2f5d6b',58,12],['#c9a24a',52,13]];let y=base;
 X.fillStyle='rgba(60,25,20,.3)';ell(X,x,base+1,40,4);X.fill();
 C.forEach(([c,w,h],i)=>{y-=h;X.fillStyle=c;rr(X,x-w/2+(i%2?4:-3),y,w,h,2);X.fill();X.fillStyle='#efe6d2';X.fillRect(x-w/2+(i%2?4:-3)+w-6,y+2,4,h-4);});
 X.fillStyle='#2a2a30';X.fillRect(x-10,y-26,20,26);X.fillStyle='#ffe2a0';X.fillRect(x-7,y-22,14,19);X.fillStyle='#2a2a30';X.fillRect(x-12,y-30,24,5);
 const g=X.createRadialGradient(x,y-12,1,x,y-12,40);g.addColorStop(0,'rgba(255,214,150,.45)');g.addColorStop(1,'rgba(255,214,150,0)');X.fillStyle=g;X.fillRect(x-40,y-52,80,80);}
function tree(t,cx,base){const h=84,potH=22;
 // glow it casts on the glass and seat
 const gg=X.createRadialGradient(cx,base-70,6,cx,base-70,140);gg.addColorStop(0,'rgba(255,214,150,.35)');gg.addColorStop(1,'rgba(255,214,150,0)');X.fillStyle=gg;X.fillRect(cx-150,base-220,300,240);
 // pot wrapped in burlap
 X.fillStyle='#8a6a48';X.beginPath();X.moveTo(cx-24,base-potH);X.lineTo(cx+24,base-potH);X.lineTo(cx+19,base);X.lineTo(cx-19,base);X.closePath();X.fill();
 X.fillStyle='rgba(60,40,24,.35)';for(let k=0;k<5;k++)X.fillRect(cx-22+k*10,base-potH,2,potH);X.fillStyle='#b3242b';X.fillRect(cx-24,base-potH+8,48,5);
 X.fillStyle='rgba(60,25,20,.35)';ell(X,cx,base+1,30,4);X.fill();
 const top=base-potH-h;X.fillStyle='#173a24';X.beginPath();X.moveTo(cx,top+6);X.lineTo(cx+40,base-potH-4);X.lineTo(cx-40,base-potH-4);X.closePath();X.fill();
 for(let k=0;k<5;k++){const u=k/4,y=top+18+u*(h-26),hw=10+u*38,sw=Math.sin(WK(1)*t+k)*0.6;
  const g=X.createLinearGradient(cx-hw,0,cx+hw,0);g.addColorStop(0,'#2f6a3e');g.addColorStop(0.6,'#24563a');g.addColorStop(1,'#1a4029');X.fillStyle=g;
  X.beginPath();X.moveTo(cx+sw,y-20-u*4);X.quadraticCurveTo(cx+hw*0.6,y-6,cx+hw+2,y+8);X.quadraticCurveTo(cx+hw*0.5,y+3,cx+hw*0.3,y+10);X.quadraticCurveTo(cx,y+4,cx-hw*0.3,y+10);X.quadraticCurveTo(cx-hw*0.5,y+3,cx-hw-2,y+8);X.quadraticCurveTo(cx-hw*0.6,y-6,cx+sw,y-20-u*4);X.fill();
  X.strokeStyle='rgba(120,170,120,.25)';X.lineWidth=1.2;for(let j=-3;j<=3;j++){X.beginPath();X.moveTo(cx+j*hw*0.22,y+6);X.lineTo(cx+j*hw*0.26,y+1);X.stroke();}}
 // lights spiralling round (twinkle), baubles, star
 const r=rng(71);for(let i=0;i<22;i++){const u=i/22,y=top+18+u*(h-30),hw=(10+u*36)*0.85,x=cx+Math.sin(u*Math.PI*5.5)*hw;if(Math.cos(u*Math.PI*5.5)<-0.35)continue;
  const tw=0.6+0.4*Math.sin(WK(1+(i%3))*t+i*1.7);const g=X.createRadialGradient(x,y,0,x,y,9);g.addColorStop(0,`rgba(255,226,160,${0.7*tw})`);g.addColorStop(1,'rgba(255,226,160,0)');X.fillStyle=g;X.fillRect(x-9,y-9,18,18);X.fillStyle=`rgba(255,244,210,${0.8+0.2*tw})`;ell(X,x,y,1.8,1.8);X.fill();}
 for(const [u,dx,c] of [[0.35,-10,'#c42a30'],[0.55,14,'#d9a441'],[0.78,-22,'#c42a30'],[0.8,24,'#7aa8d8'],[0.62,-2,'#7aa8d8']]){const y=top+22+u*(h-30);X.fillStyle=c;ell(X,cx+dx,y,4.6,4.6);X.fill();X.fillStyle='rgba(255,255,255,.6)';ell(X,cx+dx-1.4,y-1.4,1.3,1.3);X.fill();}
 const sg=X.createRadialGradient(cx,top,1,cx,top,36);sg.addColorStop(0,`rgba(255,226,140,${0.55+0.15*Math.sin(WK(2)*t)})`);sg.addColorStop(1,'rgba(255,226,140,0)');X.fillStyle=sg;X.fillRect(cx-36,top-36,72,72);
 X.fillStyle='#ffd76a';X.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr2=k%2?5.5:13;X.lineTo(cx+Math.cos(a)*rr2,top+Math.sin(a)*rr2);}X.closePath();X.fill();}
// ---------- live layers ----------
function interiorLive(t){ // pendants, cat, teapot steam — clipped to the glass openings
 const {f}=flashAt(t);
 X.save();X.beginPath();X.rect(DW.x,DW.y,DW.w,DW.h);X.rect(DOOR.x+18,DOOR.y+16,DOOR.w-36,140);X.rect(SW.x,SW.y,SW.w,SW.h);X.clip();
 X.drawImage(INT,0,0,W*S,H*S,0,0,W,H);
 // pendant lamps hanging from the ceiling (above the glass top) on cords; a slow tiny sway from the door draught
 for(const [lx,len] of [[SW.x+SW.w/2,46]]){const sw=Math.sin(WK(2)*t+lx)*1.2;X.strokeStyle='#2a1c14';X.lineWidth=2;X.beginPath();X.moveTo(lx,DW.y-30);X.lineTo(lx+sw,DW.y+len);X.stroke();
  const gy=DW.y+len+16;const g=X.createRadialGradient(lx+sw,gy,2,lx+sw,gy,90);g.addColorStop(0,'rgba(255,236,190,.95)');g.addColorStop(0.2,'rgba(255,214,150,.6)');g.addColorStop(1,'rgba(255,190,120,0)');X.fillStyle=g;X.fillRect(lx-100,gy-100,200,200);
  X.fillStyle='#fff3d6';ell(X,lx+sw,gy,17,17);X.fill();X.fillStyle='#c9a45a';X.fillRect(lx+sw-5,gy-21,10,7);}
 books(DW.x+70,1418);tree(t,DW.x+318,1420);
 // the shop cat asleep on the cushion: curled loaf, tail wrapped round, breathing; ear flicks at the thunder
 X.save();X.translate(DW.x+246,1416);X.scale(0.62,0.62);cat(t,0,0);X.restore();
 X.restore();
 // lightning seen through the glass from inside? no — the room stays warm. A faint cool flash on the glass only:
 if(f>0.002){X.save();X.globalCompositeOperation='lighter';X.fillStyle=`rgba(140,160,220,${f*0.15})`;X.fillRect(DW.x,DW.y,DW.w,DW.h);X.restore();}
}
function cat(t,cx,cy){
 const br=1+0.025*Math.sin(WK(6)*t);                // breathing (6 breaths per 20 s loop)
 let tw=0;for(const tt of [1.55,13.45]){const d=((t-tt)%LOOP+LOOP)%LOOP;if(d<0.5)tw=Math.max(tw,Math.sin(d/0.5*Math.PI));}
 const tip=Math.sin(WK(4)*t)*0.25;
 X.save();
 X.fillStyle='rgba(60,25,20,.35)';ell(X,cx,cy-2,74,9);X.fill();
 // body: a round curled heap, higher at the back (right), one colour with the head
 X.save();X.translate(cx+8,cy-28);X.scale(1,br);
 let g=X.createRadialGradient(10,-20,6,0,0,76);g.addColorStop(0,'#f2b673');g.addColorStop(1,'#cf8644');X.fillStyle=g;
 X.beginPath();X.moveTo(-66,22);X.bezierCurveTo(-70,-20,-30,-40,10,-38);X.bezierCurveTo(52,-36,72,-10,68,18);X.quadraticCurveTo(0,32,-66,22);X.fill();
 // tabby stripes curving over the back
 X.strokeStyle='rgba(150,78,34,.45)';X.lineWidth=5;X.lineCap='round';
 for(const a of [-0.9,-0.45,0,0.45,0.9]){const px=Math.sin(a)*56,py=-34+Math.abs(a)*10;X.beginPath();X.moveTo(px-6,py);X.quadraticCurveTo(px+2,py+10,px+2*Math.sign(a||1),py+20);X.stroke();}
 X.restore();
 // back paw tucked + tail wrapping round the front of the body, tip resting over the nose side
 X.strokeStyle='#d58c4a';X.lineWidth=14;X.lineCap='round';X.beginPath();X.moveTo(cx+70,cy-12);X.quadraticCurveTo(cx+50,cy+4,cx,cy-2);X.quadraticCurveTo(cx-28,cy-4,cx-40+tip*8,cy-12-tip*5);X.stroke();
 X.strokeStyle='rgba(150,78,34,.5)';X.lineWidth=4;for(const u of [0.25,0.5,0.75]){const px=lerp(cx+66,cx-30,u);X.beginPath();X.moveTo(px,cy-10);X.lineTo(px-2,cy+2);X.stroke();}
 // head resting on the front of the body (overlaps it), eyes closed
 const hx=cx-44,hy=cy-30;
 X.fillStyle='#ecaa64';ell(X,hx,hy,30,24);X.fill();
 X.fillStyle='rgba(150,78,34,.35)';X.beginPath();X.moveTo(hx-6,hy-22);X.lineTo(hx-2,hy-12);X.lineTo(hx+2,hy-22);X.fill();
 X.fillStyle='#e29d5c';X.beginPath();X.moveTo(hx-26,hy-8);X.lineTo(hx-24,hy-38);X.lineTo(hx-6,hy-20);X.closePath();X.fill();
 X.fillStyle='#f4c0a0';X.beginPath();X.moveTo(hx-22,hy-14);X.lineTo(hx-21,hy-31);X.lineTo(hx-10,hy-20);X.closePath();X.fill();
 X.save();X.translate(hx+12,hy-18);X.rotate(-0.1+tw*0.45);X.fillStyle='#e29d5c';X.beginPath();X.moveTo(-8,4);X.lineTo(6,-22);X.lineTo(13,3);X.closePath();X.fill();X.fillStyle='#f4c0a0';X.beginPath();X.moveTo(-2,2);X.lineTo(6,-13);X.lineTo(9,2);X.closePath();X.fill();X.restore();
 X.strokeStyle='#5a3020';X.lineWidth=2.4;X.lineCap='round';X.beginPath();X.arc(hx-12,hy-1,6,0.25,Math.PI-0.25);X.stroke();X.beginPath();X.arc(hx+9,hy-2,6,0.25,Math.PI-0.25);X.stroke();
 X.fillStyle='#c96a6a';ell(X,hx-2,hy+8,3,2.2);X.fill();
 X.strokeStyle='rgba(255,240,220,.6)';X.lineWidth=1;for(const s2 of[-1,1]){X.beginPath();X.moveTo(hx-2+s2*8,hy+10);X.lineTo(hx-2+s2*26,hy+8);X.stroke();}
 X.fillStyle='#f6dcc0';ell(X,hx+6,hy+22,12,6);X.fill();ell(X,hx+26,hy+23,11,6);X.fill();
 X.restore();
}
function glassFX(t){ // reflections + beads on the shop glass
 for(const [x,y,w,h] of [[DW.x,DW.y,DW.w,DW.h],[DOOR.x+18,DOOR.y+16,DOOR.w-36,140],[SW.x,SW.y,SW.w,SW.h]]){
  X.save();X.beginPath();X.rect(x,y,w,h);X.clip();
  const g=X.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'rgba(170,190,230,.10)');g.addColorStop(0.5,'rgba(170,190,230,0)');g.addColorStop(1,'rgba(170,190,230,.06)');X.fillStyle=g;X.fillRect(x,y,w,h);
  X.fillStyle='rgba(255,255,255,.05)';X.beginPath();X.moveTo(x+w*0.15,y);X.lineTo(x+w*0.3,y);X.lineTo(x,y+h*0.5);X.lineTo(x,y+h*0.3);X.closePath();X.fill();
  for(const [cx2,cy2] of [[x,y+h],[x+w,y+h],[x,y],[x+w,y]]){const g2=X.createRadialGradient(cx2,cy2,0,cx2,cy2,Math.min(w,h)*0.45);g2.addColorStop(0,'rgba(235,240,252,.32)');g2.addColorStop(1,'rgba(235,240,252,0)');X.fillStyle=g2;X.fillRect(x,y,w,h);}
  X.restore();}
 // "open" sign hanging inside the door glass (seen from outside), on two strings
 const ox=DOOR.x+DOOR.w/2,oy=DOOR.y+126;X.strokeStyle='#3a2a1c';X.lineWidth=1.4;X.beginPath();X.moveTo(ox-36,oy-10);X.lineTo(ox-36,DOOR.y+16);X.moveTo(ox+36,oy-10);X.lineTo(ox+36,DOOR.y+16);X.stroke();
 X.fillStyle='#f3ead6';rr(X,ox-40,oy-10,80,34,5);X.fill();X.fillStyle='#8e3b3b';X.font='600 21px Poppins, sans-serif';X.textAlign='center';X.textBaseline='middle';X.fillText('OPEN',ox,oy+8);
}
// awning drips: a row of drop streams off the valance points onto the pavement
function drips(t){const y0=1345,y1=GND+20;
 for(let i=0;i<14;i++){const x=lerp(172,822,(i+0.5)/14);for(let k=0;k<2;k++){const p=((t*(5+i%3)/LOOP*4+i*0.37+k/2)%1);const y=y0+p*p*(y1-y0);
  const nearGlass=x>DW.x-10&&x<DOOR.x+DOOR.w+10&&y<GND;X.strokeStyle=nearGlass?'rgba(255,220,170,.55)':'rgba(190,205,230,.35)';X.lineWidth=1.8;X.beginPath();X.moveTo(x,y-8-p*12);X.lineTo(x,y);X.stroke();
  if(p>0.92){const s=(p-0.92)/0.08;X.fillStyle=`rgba(220,225,240,${0.4*(1-s)})`;ell(X,x-3-s*6,y1-s*8+s*s*6,1.3,1.6);X.fill();ell(X,x+3+s*6,y1-s*9+s*s*6,1.3,1.6);X.fill();}}}
 // downpipe spill into the gutter
 const px=BLD.x1-14;X.strokeStyle='rgba(170,185,220,.35)';X.lineWidth=5;X.lineCap='round';X.beginPath();X.moveTo(px,GND-8);X.quadraticCurveTo(px+10,GND-6,px+14,GND+6);X.stroke();
 for(let k=0;k<6;k++){const p=((t*2.5+k/6)%1);X.fillStyle=`rgba(200,210,235,${0.35*(1-p)})`;ell(X,px+14+(k%2?1:-1)*p*14,GND+6-p*10+p*p*10,1.4,1.6);X.fill();}
}
// lamp post with a hanging flower basket on its arm, swinging with the gusts
function lampPost(t){
 const {x,y}=LAMP;const G=gust(t);const {f}=flashAt(t);
 // light pool on the wet pavement
 X.save();X.globalCompositeOperation='screen';let g=X.createRadialGradient(x+10,GND+40,10,x+10,GND+40,260);g.addColorStop(0,'rgba(255,200,130,.35)');g.addColorStop(1,'rgba(255,200,130,0)');X.fillStyle=g;X.save();X.translate(x+10,GND+40);X.scale(1,0.32);X.translate(-(x+10),-(GND+40));X.fillRect(x-260,GND-300,540,700);X.restore();
 // cone of light with rain glinting in it
 X.restore();
 // post (cast iron, fluted), base on the pavement near the kerb
 X.fillStyle='#16181e';X.fillRect(x-8,y+30,16,CURB-6-(y+30));X.fillRect(x-18,CURB-60,36,54);X.fillRect(x-22,CURB-10,44,10);
 X.fillStyle='rgba(255,210,150,.18)';X.fillRect(x+4,y+30,3,CURB-60-(y+30));
 X.fillStyle='rgba(0,0,0,.45)';ell(X,x,CURB-2,34,6);X.fill();
 // arm out to the right with a scroll
 X.strokeStyle='#16181e';X.lineWidth=7;X.beginPath();X.moveTo(x,y+70);X.lineTo(x+74,y+70);X.stroke();X.lineWidth=4;X.beginPath();X.moveTo(x+6,y+70);X.quadraticCurveTo(x+36,y+104,x+56,y+72);X.stroke();X.fillStyle='#16181e';ell(X,x+74,y+70,5,5);X.fill();
 // lantern head
 X.fillStyle='#16181e';X.beginPath();X.moveTo(x-30,y-6);X.lineTo(x+30,y-6);X.lineTo(x+8,y-34);X.lineTo(x-8,y-34);X.closePath();X.fill();X.fillRect(x-4,y-46,8,14);
 g=X.createRadialGradient(x,y+14,2,x,y+14,120);g.addColorStop(0,'rgba(255,236,190,.9)');g.addColorStop(0.25,'rgba(255,210,140,.45)');g.addColorStop(1,'rgba(255,190,120,0)');X.fillStyle=g;X.fillRect(x-130,y-110,260,260);
 X.fillStyle='#e9edf7';X.beginPath();X.moveTo(x-30,y-6);X.quadraticCurveTo(x-20,y-22,x-8,y-36);X.lineTo(x+8,y-36);X.quadraticCurveTo(x+22,y-22,x+31,y-6);X.quadraticCurveTo(x,y-14,x-30,y-6);X.fill();
 X.fillStyle='#e9edf7';X.beginPath();X.moveTo(x+2,y+67);X.quadraticCurveTo(x+38,y+61,x+76,y+67);X.lineTo(x+2,y+67);X.fill();
 X.fillStyle='#ffe9b8';X.beginPath();X.moveTo(x-24,y-6);X.lineTo(x+24,y-6);X.lineTo(x+16,y+34);X.lineTo(x-16,y+34);X.closePath();X.fill();
 X.strokeStyle='#16181e';X.lineWidth=3;X.beginPath();X.moveTo(x,y-6);X.lineTo(x,y+34);X.stroke();X.fillStyle='#16181e';X.fillRect(x-20,y+32,40,6);
 // hanging basket: chains from the arm end, pivot swing with the gust (lags slightly)
 const ax=x+72,ay=y+72,ang=0.08*(gust(t-0.4)-0.55)*2.2+0.03*Math.sin(WK(7)*t);
 X.save();X.translate(ax,ay);X.rotate(-ang);
 X.strokeStyle='#2a2c33';X.lineWidth=1.6;X.beginPath();X.moveTo(0,0);X.lineTo(-26,64);X.moveTo(0,0);X.lineTo(26,64);X.moveTo(0,0);X.lineTo(0,62);X.stroke();
 for(let i=0;i<16;i++){const rr2=rng(500+i);const vx=-30+rr2()*60,L=20+rr2()*50;X.strokeStyle='#2c4a2c';X.lineWidth=2;X.beginPath();X.moveTo(vx,74);X.quadraticCurveTo(vx+(rr2()-0.5)*14+ang*60,74+L*0.6,vx+ang*90,74+L);X.stroke();
  X.fillStyle=i%2?'#3c5e38':'#4a7044';ell(X,vx+ang*90,74+L,5,3.5);X.fill();}
 X.fillStyle='#2a1f1a';X.beginPath();X.moveTo(-34,64);X.lineTo(34,64);X.quadraticCurveTo(30,96,0,98);X.quadraticCurveTo(-30,96,-34,64);X.fill();
 X.fillStyle='rgba(255,200,130,.25)';X.beginPath();X.moveTo(-34,64);X.lineTo(34,64);X.lineTo(30,70);X.lineTo(-30,70);X.closePath();X.fill();
 const r=rng(77);for(let i=0;i<12;i++){X.fillStyle=i%2?'#1f4a2c':'#2c5e38';X.save();X.translate(-30+r()*60,60-r()*14);X.rotate(r()*3);ell(X,0,0,9,4);X.fill();X.restore();}
 for(let i=0;i<9;i++){X.fillStyle='#c42a30';ell(X,-26+r()*52,58-r()*12,3.6,3.6);X.fill();}
 X.fillStyle='#e9edf7';X.beginPath();X.moveTo(-34,60);X.quadraticCurveTo(-24,44,-8,48);X.quadraticCurveTo(6,40,20,48);X.quadraticCurveTo(32,46,34,60);X.quadraticCurveTo(0,56,-34,60);X.fill();
 X.restore();
 if(f>0.002){X.save();X.globalCompositeOperation='lighter';X.strokeStyle=`rgba(170,185,230,${f*0.6})`;X.lineWidth=2;X.beginPath();X.moveTo(x-7,y+40);X.lineTo(x-7,CURB-60);X.stroke();X.restore();}
}
// street reflections of the shop glow, lamp and windows (streaky, broken by ripples)
function reflections(t){X.save();
 for(const [x,y,rx,ry,a] of [[DW.x+DW.w/2,GND+30,280,60,0.30],[DOOR.x+DOOR.w/2,GND+26,110,40,0.26],[SW.x+40,GND+24,80,30,0.2],[DW.x+DW.w/2+60,CURB+70,420,90,0.13],[LAMP.x+10,CURB-24,150,42,0.32]]){
  X.save();X.translate(x,y);X.scale(1,ry/rx);const g=X.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(255,184,110,${a})`);g.addColorStop(1,'rgba(255,184,110,0)');X.fillStyle=g;X.fillRect(-rx,-rx,rx*2,rx*2);X.restore();}
 // sparkle in the snow where the shop light reaches (tiny glints that twinkle, whole cycles per LOOP)
 const r=rng(8);for(let i=0;i<70;i++){const x=r()*W,y=GND+8+r()*(H-GND-10),k=1+(i%3);const v=Math.max(0,Math.sin(WK(k)*t+r()*6.28));const near=Math.max(0,1-Math.hypot(x-480,(y-GND)*1.6)/600);
  if(v*near>0.05){X.fillStyle=`rgba(255,240,210,${v*near*0.8})`;ell(X,x,y,1.3,1.3);X.fill();}}
 X.restore();}
function smoke(t){const [cx,cy]=CHTOP;for(let i=0;i<30;i++){const p=((t/2.5+i/30)%1);const G=gust(t-p*2);
 const sx=cx-p*(170+90*G)+Math.sin(p*7+i*0.9)*24*p,sy=cy-p*170+p*p*60;const r2=(10+p*64)*(0.7+0.5*Math.abs(Math.sin(i*1.9)));
 const g=X.createRadialGradient(sx,sy,0,sx,sy,r2);g.addColorStop(0,`rgba(150,154,170,${(1-p)*(1-p)*0.38})`);g.addColorStop(1,'rgba(120,124,138,0)');X.fillStyle=g;X.fillRect(sx-r2,sy-r2,r2*2,r2*2);}}
function scud(t){for(let i=0;i<6;i++){const r=rng(i+60);const y=120+r()*420,rx=180+r()*240,ry=26+r()*34,span=W+rx*2+300;const x=((r()*span-t*span/LOOP*(1+(i%2)))%span+span)%span-rx-150;
 X.save();X.filter='blur(18px)';X.fillStyle=`rgba(${56+i*4},${62+i*4},${80+i*4},.42)`;X.beginPath();X.ellipse(x,y,rx,ry,0,0,6.28);X.fill();X.restore();}}
function skyLightning(t){const {f,bolt}=flashAt(t);if(f<=0.002)return;
 X.save();X.globalCompositeOperation='lighter';const sg=X.createLinearGradient(0,0,0,700);sg.addColorStop(0,`rgba(110,125,175,${f*0.8})`);sg.addColorStop(1,`rgba(140,150,190,${f*0.5})`);X.fillStyle=sg;X.fillRect(-100,-100,W+200,850);X.restore();
 if(bolt&&!(bolt.d>0.08&&bolt.d<0.16)){const r=rng(bolt.seed|0);let x=bolt.bx,y=60;const pts=[[x,y]];while(y<560){y=Math.min(560,y+14+r()*26);x+=(r()-0.5)*44+(r()<0.15?(r()-0.5)*60:0);pts.push([x,y]);}
  const br=[];for(let i=3;i<pts.length-4;i+=4){if(r()<0.6){let bx=pts[i][0],by=pts[i][1];const b=[[bx,by]];for(let k=0;k<4;k++){by+=25+r()*25;bx+=(r()-0.3)*60*(r()<0.5?-1:1);b.push([bx,by]);}br.push(b);}}
  const al=(1-bolt.d/0.32);X.save();X.globalCompositeOperation='lighter';X.lineCap='round';X.lineJoin='round';
  for(const [lw,col] of [[22,`rgba(140,160,255,${0.12*al})`],[8,`rgba(190,205,255,${0.42*al})`],[3,`rgba(255,255,255,${0.98*al})`]]){X.strokeStyle=col;X.lineWidth=lw;
   const fade=y=>Math.max(0,Math.min(1,(430-y)/110));
   for(let i=1;i<pts.length;i++){const k=fade(pts[i][1]);if(k<=0)break;X.globalAlpha=k;X.beginPath();X.moveTo(pts[i-1][0],pts[i-1][1]);X.lineTo(pts[i][0],pts[i][1]);X.stroke();}X.globalAlpha=1;
   for(const b of br){X.lineWidth=lw*0.55;for(let i=1;i<b.length;i++){if(fade(b[i][1])<=0)break;X.globalAlpha=fade(b[i][1]);X.beginPath();X.moveTo(b[i-1][0],b[i-1][1]);X.lineTo(b[i][0],b[i][1]);X.stroke();}X.globalAlpha=1;X.lineWidth=lw;}}
  X.restore();}}
let DR=null;
function rain(t,front){if(!DR){const r=rng(3);DR=[];for(let i=0;i<520;i++)DR.push({x:r(),y:r(),z:r()});}
 for(const d of DR){const isF=d.z>0.94;if(isF!==front)continue;const n=d.z<0.5?13:(d.z<0.85?17:22);const span=H+200;
 const y=((d.y*span+t*span*n/LOOP)%span)-100;const x=((d.x*(W+500)-(y+100)*0.25)%(W+500)+W+500)%(W+500)-250;
 const len=front?60:14+d.z*30,a=front?0.24:0.1+d.z*0.2;let warm=0;
 for(const [lx,ly,lr,k] of [[LAMP.x+20,LAMP.y+120,200,1],[DW.x+DW.w/2,GND-60,260,0.6]]){const dd=Math.hypot(x-lx,y-ly);if(dd<lr)warm=Math.max(warm,(1-dd/lr)*k);}
 X.strokeStyle=warm>0.05?`rgba(255,${215-40*warm|0},${235-110*warm|0},${a+0.3*warm})`:`rgba(200,212,235,${a})`;X.lineWidth=front?2.2:0.9+d.z;X.beginPath();X.moveTo(x,y);X.lineTo(x+len*0.25,y-len);X.stroke();}}
function grade(t){const {f}=flashAt(t);if(f>0.002){X.fillStyle=`rgba(180,195,255,${f*0.18})`;X.fillRect(0,0,W,H);}
 const v=X.createRadialGradient(W/2,H*0.6,H*0.3,W/2,H*0.6,H*0.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(3,5,10,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.035;for(let i=0;i<1400;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function caption(t){if(t>6.4)return;const a=Math.min(1,0.85+t/1.0)*Math.max(0,Math.min(1,(6.2-t)/1.5));
 X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*6,y=230;const bl=Math.max(0,(t-4.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
 X.font="italic 500 74px Corm, serif";X.shadowColor='rgba(255,210,160,.5)';X.shadowBlur=28;X.fillStyle='#fbf6ee';
 const C1=(window.CAP||['the bookshop put its','christmas lights up tonight']);for(let k=0;k<2;k++){X.fillText(C1[0],x,y);X.fillText(C1[1],x,y+86);X.shadowBlur=0;}
 X.restore();}
let READY=false;
function buildStatic(){let q;[SKY,q]=off();skyPaint(q);[BLDC,q]=off();buildingsPaint(q);awningPaint(q);[STREET,q]=off();streetPaint(q);snowStreet(q);snowPaint(q);[INT,q]=off();interiorPaint(q);
 // rooftop rim layer for the flashes: bright edges along roof lines and chimney tops
 [BLDR,q]=off();q.strokeStyle='rgba(190,205,255,.9)';q.lineWidth=3;q.beginPath();q.moveTo(-40,430);q.lineTo(60,350);q.lineTo(160,430);q.moveTo(BLD.x0+40,470);q.lineTo(BLD.x1-40,470);q.moveTo(729,384);q.lineTo(813,384);q.moveTo(1000,470);q.lineTo(1120,470);q.moveTo(316,506);q.lineTo(405,452);q.lineTo(494,506);q.stroke();
 q.fillStyle='rgba(150,165,220,.28)';q.beginPath();q.moveTo(BLD.x0-24,632);q.lineTo(BLD.x0+40,470);q.lineTo(BLD.x1-40,470);q.lineTo(BLD.x1+24,632);q.closePath();q.fill();q.fillStyle='rgba(150,165,220,.2)';q.fillRect(735,392,72,92);q.fillRect(330,500,150,6);
 READY=true;}
window.draw=function(t){if(!READY)buildStatic();
 const {f}=flashAt(t);
 const z=1.0+0.03*(1-Math.cos(WK(1)*t))/2,Fx=520+14*Math.sin(WK(1)*t),Fy=1300;const ox=S*(Fx-Fx*z),oy=S*(Fy-Fy*z);
 const L=()=>X.setTransform(z,0,0,z,ox,oy),A=()=>X.setTransform(S*z,0,0,S*z,ox,oy);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 L();X.drawImage(SKY,0,0);A();scud(t);smoke(t);
 A();interiorLive(t);
 L();X.drawImage(BLDC,0,0);if(f>0.002){X.save();X.globalAlpha=Math.min(1,f*2.2);X.globalCompositeOperation='lighter';X.drawImage(BLDR,0,0);X.restore();}
 L();X.drawImage(STREET,0,0);
 A();glassFX(t);wreath(t);shopLights(t);reflections(t);snow(t,false);lampPost(t);snow(t,true);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);
};
