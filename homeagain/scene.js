// safe space after dark — "he's home. we didn't even unpack." (third part of the hoodie story: hoodie/ → home/ → homeagain/).
// Same window seat, the night he's back. The first snow is falling over the town. Seen from behind: she's still in his grey
// hoodie, leaning her head on his shoulder; he (navy knit jumper, short coily hair) has his arm round her, hand on her far shoulder.
// His carry-on still stands by the seat, unopened. At 7.6 s he leans his head against hers and his thumb strokes her shoulder.
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
function off(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}

const SK='#e0b394',SK_SH='#b08062',SK_LT='#efc8ab',HAIR='#3a261c',HAIR_L='#6a4834';
const WIN={x0:150,x1:930,y0:196,y1:1176,tr:520,mul:540,fw:26};   // window opening, transom y, mullion x, frame width
const LEDGE=1176, SEAT_BACK=1200, SEAT_FRONT=1590;
const T_LEAN=7.6;
const breathAt=t=>Math.sin(t*2*Math.PI/4.6);
const turnAt=t=>3*Math.PI/180;      // turned a touch toward him
const tiltAt=t=>0;
const rollAt=t=>(10+2.5*ease((t-T_LEAN)/1.4)+0.6*Math.sin(t*0.7))*Math.PI/180;   // head resting on his shoulder; nestles in a little more at 7.6 s
let OUT=null,ROOM=null;const SS=S*1.18;

// ---------------- outside: night sky + a little town in the rain ----------------
const LIT=[];
function outPaint(q){const r=rng(5);
 const g=q.createLinearGradient(0,WIN.y0,0,WIN.y1);g.addColorStop(0,'#0c1027');g.addColorStop(0.5,'#1b1d3d');g.addColorStop(0.85,'#3a2f52');g.addColorStop(1,'#56405e');q.fillStyle=g;q.fillRect(0,0,W,1300);
 // soft rain clouds, painted blurred so they read as cloud (never as discs)
 q.save();q.filter='blur(26px)';for(let i=0;i<16;i++){const x=r()*W,y=200+r()*420,rw=120+r()*200;q.fillStyle=`rgba(${70+r()*30},${70+r()*20},${110+r()*30},${0.18+r()*0.18})`;q.beginPath();q.ellipse(x,y,rw,rw*0.32,0,0,6.28);q.fill();}q.restore();
 // a few stars between the clouds
 for(let i=0;i<0;i++){q.globalAlpha=0.2+r()*0.5;q.fillStyle='#e6ecff';q.beginPath();q.arc(r()*W,200+r()*320,r()*1.2+0.3,0,6.28);q.fill();}q.globalAlpha=1;
 // town glow on the low cloud
 const hz=q.createLinearGradient(0,760,0,1000);hz.addColorStop(0,'rgba(255,160,120,0)');hz.addColorStop(1,'rgba(255,170,120,.22)');q.fillStyle=hz;q.fillRect(0,760,W,260);
 // far hills
 q.fillStyle='#231f3a';q.beginPath();q.moveTo(0,980);for(let x=0;x<=W;x+=20)q.lineTo(x,960-28*Math.sin(x*0.004+1)-14*Math.sin(x*0.013));q.lineTo(W,1300);q.lineTo(0,1300);q.fill();
 for(let i=0;i<40;i++){q.fillStyle='rgba(255,210,150,.55)';q.fillRect(r()*W,955+r()*40,2,2);}
 // rooftops of the street below: gabled houses at two depths with chimneys and lit windows
 const row=(base,hmin,hmax,col,wcol,depth)=>{for(let x=-40;x<W+40;){const w=110+r()*120,h=hmin+r()*(hmax-hmin),pk=40+r()*40;
   q.fillStyle=col;q.beginPath();q.moveTo(x,base);q.lineTo(x,base-h);q.lineTo(x+w/2,base-h-pk);q.lineTo(x+w,base-h);q.lineTo(x+w,base);q.fill();
   if(r()<0.6){const cx=x+w*(0.2+r()*0.5);q.fillRect(cx,base-h-pk*0.7-30,16,40);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(cx-2,base-h-pk*0.7-32,20,5);}
   // snow on the roof: a soft cap with real thickness on both slopes, lumpy underside (no thin bright outline)
   {const P=[[x-6,base-h+3],[x+w/2,base-h-pk-4],[x+w+6,base-h+3]];const col=depth<1?'rgba(128,132,166,.62)':'rgba(150,154,188,.66)';q.fillStyle=col;
    q.beginPath();q.moveTo(P[0][0],P[0][1]);q.lineTo(P[1][0],P[1][1]);q.lineTo(P[2][0],P[2][1]);
    for(let j=20;j>=0;j--){const u=j/20,[ax,ay]=u>0.5?P[1]:P[0],[bx,by]=u>0.5?P[2]:P[1],v=u>0.5?(u-0.5)*2:u*2;q.lineTo(lerp(ax,bx,v),lerp(ay,by,v)+9+r()*5);}
    q.closePath();q.fill();}
   q.strokeStyle='rgba(255,190,160,.12)';q.lineWidth=2;q.beginPath();q.moveTo(x,base-h);q.lineTo(x+w/2,base-h-pk);q.lineTo(x+w,base-h);q.stroke();
   for(let k=0;k<3;k++){if(r()<0.8){const wx=x+14+k*(w-40)/2.4,wy=base-h+18+r()*20,ww=18*depth,wh=24*depth;LIT.push([wx,wy,ww,wh,r()]);q.fillStyle=wcol;q.fillRect(wx,wy,ww,wh);
     q.fillStyle='rgba(60,40,40,.6)';q.fillRect(wx+ww/2-1,wy,2,wh);q.fillRect(wx,wy+wh/2-1,ww,2);}}
   x+=w+2+r()*6;}};
 row(1080,40,90,'#26213f','rgba(255,196,130,.8)',0.8);
 row(1190,70,130,'#1f1b33','rgba(255,186,120,.9)',1.0);
 // wet street glimmer at the very bottom
 const st=q.createLinearGradient(0,1150,0,1190);st.addColorStop(0,'rgba(255,190,130,0)');st.addColorStop(1,'rgba(255,190,130,.15)');q.fillStyle=st;q.fillRect(0,1150,W,40);}

// ---------------- the room: wall, window frame, ledge, window seat, curtains ----------------
function roomPaint(q){const r=rng(17);
 // wall (dusky plaster, warmer near the lamp on the left)
 const wg=q.createLinearGradient(0,0,W,0);wg.addColorStop(0,'#4a3a44');wg.addColorStop(0.5,'#2f2a3c');wg.addColorStop(1,'#26233a');q.fillStyle=wg;q.fillRect(0,0,W,SEAT_BACK+10);
 const lw=q.createRadialGradient(230,1080,20,230,1080,520);lw.addColorStop(0,'rgba(255,180,110,.32)');lw.addColorStop(1,'rgba(255,180,110,0)');q.fillStyle=lw;q.fillRect(0,500,800,720);
 // cut the glass panes out of the wall so the town shows through
 q.globalCompositeOperation='destination-out';q.fillStyle='#000';q.fillRect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0);q.globalCompositeOperation='source-over';
 // window frame: painted wood, mullion + transom, sashes
 const fr='#c9c3cf',frs='#8f889c';
 const bar=(x,y,w,h)=>{const g=q.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,fr);g.addColorStop(1,frs);q.fillStyle=g;q.fillRect(x,y,w,h);};
 // inner reveal (depth of the wall) in perspective: we look slightly down and to the centre
 q.fillStyle='#3b3448';q.beginPath();q.moveTo(WIN.x0-40,WIN.y0-36);q.lineTo(WIN.x1+40,WIN.y0-36);q.lineTo(WIN.x1,WIN.y0);q.lineTo(WIN.x0,WIN.y0);q.fill();
 q.fillStyle='#463d52';q.beginPath();q.moveTo(WIN.x0-40,WIN.y0-36);q.lineTo(WIN.x0,WIN.y0);q.lineTo(WIN.x0,WIN.y1);q.lineTo(WIN.x0-40,WIN.y1+4);q.fill();
 q.fillStyle='#2c283c';q.beginPath();q.moveTo(WIN.x1+40,WIN.y0-36);q.lineTo(WIN.x1,WIN.y0);q.lineTo(WIN.x1,WIN.y1);q.lineTo(WIN.x1+40,WIN.y1+4);q.fill();
 const fw=WIN.fw;
 bar(WIN.x0,WIN.y0,WIN.x1-WIN.x0,fw);bar(WIN.x0,WIN.y1-fw,WIN.x1-WIN.x0,fw);bar(WIN.x0,WIN.y0,fw,WIN.y1-WIN.y0);bar(WIN.x1-fw,WIN.y0,fw,WIN.y1-WIN.y0);
 bar(WIN.x0,WIN.tr-10,WIN.x1-WIN.x0,20);bar(WIN.mul-9,WIN.y0,18,WIN.tr-WIN.y0);
 // glazing beads (thin inner lines) and a highlight along the top edges
 q.strokeStyle='rgba(40,34,50,.5)';q.lineWidth=2;
 for(const [x0,y0,x1,y1] of [[WIN.x0+fw,WIN.y0+fw,WIN.mul-9,WIN.tr-10],[WIN.mul+9,WIN.y0+fw,WIN.x1-fw,WIN.tr-10],[WIN.x0+fw,WIN.tr+10,WIN.x1-fw,WIN.y1-fw]])q.strokeRect(x0+1,y0+1,x1-x0-2,y1-y0-2);
 q.fillStyle='rgba(255,255,255,.18)';q.fillRect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,3);q.fillRect(WIN.x0,WIN.tr-10,WIN.x1-WIN.x0,3);
 // lamp warmth on the left side of the frame
 const fl=q.createRadialGradient(230,1080,10,230,1080,420);fl.addColorStop(0,'rgba(255,170,100,.35)');fl.addColorStop(1,'rgba(255,170,100,0)');q.save();q.beginPath();
 q.rect(WIN.x0,WIN.y0,fw,WIN.y1-WIN.y0);q.rect(WIN.x0,WIN.y1-fw,WIN.x1-WIN.x0,fw);q.rect(WIN.mul-9,WIN.y0,18,WIN.tr-WIN.y0);q.clip();q.fillStyle=fl;q.fillRect(0,600,800,700);q.restore();
 // ledge (sill board) — we see its top surface
 q.fillStyle='#d8d2dc';q.beginPath();q.moveTo(WIN.x0-46,LEDGE-6);q.lineTo(WIN.x1+46,LEDGE-6);q.lineTo(WIN.x1+60,LEDGE+14);q.lineTo(WIN.x0-60,LEDGE+14);q.fill();
 q.fillStyle='#9d96a8';q.fillRect(WIN.x0-60,LEDGE+14,WIN.x1-WIN.x0+120,10);
 const lg=q.createRadialGradient(230,LEDGE,10,230,LEDGE,380);lg.addColorStop(0,'rgba(255,170,100,.4)');lg.addColorStop(1,'rgba(255,170,100,0)');q.fillStyle=lg;q.fillRect(0,LEDGE-8,700,34);
 // seat: upholstered pad, front edge, panelled base, floor
 const sg=q.createLinearGradient(0,SEAT_BACK,0,SEAT_FRONT);sg.addColorStop(0,'#6d5f6e');sg.addColorStop(1,'#8b7a86');q.fillStyle=sg;
 q.beginPath();q.moveTo(70,LEDGE+24);q.lineTo(1010,LEDGE+24);q.lineTo(1080,SEAT_FRONT);q.lineTo(0,SEAT_FRONT);q.fill();
 const sw=q.createRadialGradient(240,1300,10,240,1300,420);sw.addColorStop(0,'rgba(255,170,100,.25)');sw.addColorStop(1,'rgba(255,170,100,0)');q.fillStyle=sw;q.fillRect(0,LEDGE+24,800,SEAT_FRONT-LEDGE);
 // piping along the pad's front edge + a soft roll
 q.fillStyle='#5a4c5a';q.fillRect(0,SEAT_FRONT-4,W,22);q.fillStyle='rgba(255,220,200,.10)';q.fillRect(0,SEAT_FRONT-4,W,4);
 const bg=q.createLinearGradient(0,SEAT_FRONT+18,0,1740);bg.addColorStop(0,'#2e2838');bg.addColorStop(1,'#1d1a26');q.fillStyle=bg;q.fillRect(0,SEAT_FRONT+18,W,1740-SEAT_FRONT-18);
 for(const x of [40,390,740]){q.strokeStyle='rgba(0,0,0,.35)';q.lineWidth=3;q.strokeRect(x,SEAT_FRONT+50,300,190);q.strokeStyle='rgba(255,255,255,.05)';q.lineWidth=2;q.strokeRect(x+4,SEAT_FRONT+54,300,190);}
 const fg=q.createLinearGradient(0,1740,0,H);fg.addColorStop(0,'#2a1e1c');fg.addColorStop(1,'#140e10');q.fillStyle=fg;q.fillRect(0,1740,W,H-1740);
 for(let i=0;i<8;i++){q.strokeStyle='rgba(0,0,0,.4)';q.lineWidth=2;q.beginPath();q.moveTo(0,1760+i*24+i*i*2);q.lineTo(W,1760+i*24+i*i*2);q.stroke();}
 q.fillStyle='rgba(0,0,0,.45)';q.fillRect(0,1740,W,10);
 // curtains: linen drapes at both sides, pooled folds, tied back loosely
 curtain(q,-30,150,1196,1);curtain(q,950,150,1196,-1);
 // curtain rail across the top, with finials
 q.fillStyle='#1d1a24';q.fillRect(-10,132,W+20,10);q.beginPath();q.arc(14,137,11,0,6.28);q.arc(W-14,137,11,0,6.28);q.fill();
 // a plump throw cushion tucked into the left corner, leaning on the glass: rounded corners pulled into soft points, piped seam
 q.save();q.translate(214,1296);q.rotate(-0.07);const pg=q.createRadialGradient(-20,-24,10,0,0,120);pg.addColorStop(0,'#d99aa0');pg.addColorStop(0.7,'#b8737c');pg.addColorStop(1,'#8e5560');q.fillStyle=pg;
 const cush=new Path2D();cush.moveTo(-84,-66);cush.quadraticCurveTo(0,-50,84,-68);cush.quadraticCurveTo(68,0,86,64);cush.quadraticCurveTo(0,50,-86,66);cush.quadraticCurveTo(-68,0,-84,-66);q.fill(cush);
 q.strokeStyle='#8e5560';q.lineWidth=4;q.stroke(cush);q.strokeStyle='rgba(255,220,220,.25)';q.lineWidth=1.5;q.beginPath();q.moveTo(-70,-56);q.quadraticCurveTo(0,-44,70,-58);q.stroke();
 q.strokeStyle='rgba(90,40,50,.3)';q.lineWidth=6;q.filter='blur(3px)';q.beginPath();q.moveTo(-70,-50);q.quadraticCurveTo(-20,-8,-74,52);q.stroke();q.beginPath();q.moveTo(70,-52);q.quadraticCurveTo(26,6,72,50);q.stroke();q.filter='none';
 const ch=q.createRadialGradient(-30,-30,5,-30,-30,90);ch.addColorStop(0,'rgba(255,200,150,.35)');ch.addColorStop(1,'rgba(255,200,150,0)');q.fillStyle=ch;q.fill(cush);q.restore();
 q.fillStyle='rgba(0,0,0,.3)';q.filter='blur(6px)';q.beginPath();q.ellipse(216,1362,92,7,0,0,6.28);q.fill();q.filter='none';}
function throwBlanket(q){const x0=650,x1=930,top=SEAT_FRONT-60;
 const P=new Path2D();P.moveTo(x0,top+10);P.bezierCurveTo(x0+90,top-6,x1-80,top-4,x1,top+6);P.lineTo(x1+6,SEAT_FRONT+10);P.bezierCurveTo(x1+10,SEAT_FRONT+90,x1-6,SEAT_FRONT+170,x1+4,SEAT_FRONT+230);
 P.bezierCurveTo(x1-90,SEAT_FRONT+246,x0+80,SEAT_FRONT+232,x0+6,SEAT_FRONT+220);P.bezierCurveTo(x0+12,SEAT_FRONT+150,x0-2,SEAT_FRONT+80,x0-4,SEAT_FRONT+12);P.closePath();
 q.save();q.translate(0,10);q.filter='blur(8px)';q.fillStyle='rgba(0,0,0,.35)';q.fill(P);q.restore();q.filter='none';
 const g=q.createLinearGradient(0,top,0,SEAT_FRONT+240);g.addColorStop(0,'#d9c9ad');g.addColorStop(0.3,'#cbb999');g.addColorStop(0.35,'#a8987c');g.addColorStop(1,'#7e705c');q.fillStyle=g;q.fill(P);
 q.save();q.clip(P);
 // cable-knit columns running over the seat edge and down
 for(let c=0;c<7;c++){const cx=x0+24+c*40;for(let y=top;y<SEAT_FRONT+240;y+=16){q.strokeStyle='rgba(90,76,56,.28)';q.lineWidth=2;q.beginPath();q.moveTo(cx-8,y);q.quadraticCurveTo(cx,y+8,cx+8,y);q.stroke();q.beginPath();q.moveTo(cx-8,y+8);q.quadraticCurveTo(cx,y+16,cx+8,y+8);q.stroke();}
  q.strokeStyle='rgba(70,58,44,.22)';q.lineWidth=3;q.beginPath();q.moveTo(cx+20,top);q.lineTo(cx+20,SEAT_FRONT+240);q.stroke();}
 // the fold over the front edge: a light ridge, then shade underneath
 q.fillStyle='rgba(255,240,215,.22)';q.fillRect(x0-10,SEAT_FRONT-6,x1-x0+30,8);
 const sh=q.createLinearGradient(0,SEAT_FRONT+6,0,SEAT_FRONT+60);sh.addColorStop(0,'rgba(40,30,30,.35)');sh.addColorStop(1,'rgba(40,30,30,0)');q.fillStyle=sh;q.fillRect(x0-10,SEAT_FRONT+6,x1-x0+30,54);
 q.filter='blur(4px)';q.strokeStyle='rgba(60,48,36,.3)';q.lineWidth=12;for(const fx of [710,800,870]){q.beginPath();q.moveTo(fx,SEAT_FRONT+20);q.quadraticCurveTo(fx+8,SEAT_FRONT+120,fx-4,SEAT_FRONT+226);q.stroke();}q.filter='none';
 q.restore();
 // fringe, uneven and soft
 q.lineCap='round';for(let i=0;i<34;i++){const x=x0+10+i*8.2+((i*7)%3);const y=SEAT_FRONT+228+Math.sin(i*0.9)*5;const L=14+((i*5)%7)*3;q.strokeStyle=i%3?'rgba(200,184,154,.9)':'rgba(170,154,126,.9)';q.lineWidth=2.2;q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(x+3,y+L*0.6,x+1+((i*3)%4)-1.5,y+L);q.stroke();}}
function curtain(q,x,y0,y1,dir){const w=160;const g=q.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#5e4a58');g.addColorStop(1,'#4a3c4c');q.fillStyle=g;
 q.beginPath();q.moveTo(x,y0);q.lineTo(x+w,y0);q.bezierCurveTo(x+w-(dir>0?10:0),y0+400,x+w-(dir>0?40:-10),y0+700,x+w-(dir>0?30:0),y1);q.lineTo(x,y1);q.closePath();q.fill();
 for(let i=0;i<6;i++){const fx=x+14+i*26;q.strokeStyle=i%2?'rgba(20,14,24,.35)':'rgba(255,220,210,.06)';q.lineWidth=10;q.beginPath();q.moveTo(fx,y0+6);q.bezierCurveTo(fx+3,y0+300,fx-(dir>0?8:-4),y0+700,fx-(dir>0?4:-2),y1);q.stroke();}
 for(let i=0;i<7;i++){q.fillStyle='#2a2430';q.beginPath();q.arc(x+12+i*24,y0+2,4,0,6.28);q.fill();}}

function buildStatic(){const mk=f=>{const [c,q]=off(W*SS|0,H*SS|0);q.scale(SS,SS);f(q);return c;};OUT=mk(outPaint);ROOM=mk(roomPaint);}

// ---------------- animated: outside ----------------
function townLights(t){for(const [x,y,w,h,ph] of LIT){if(ph<0.86)continue;const k=0.5+0.5*Math.sin(t*2*Math.PI/8+ph*20);X.fillStyle=`rgba(255,${190+20*k|0},140,${0.2*k})`;X.fillRect(x,y,w,h);}}
function plane(t){const u=planeU(t);if(t<PLANE.t0||t>PLANE.t1)return;const x=lerp(PLANE.x0,PLANE.x1,u),y=lerp(PLANE.y0,PLANE.y1,u)+Math.sin(u*3)*6;
 const fade=Math.min(1,(t-PLANE.t0)/0.6,(PLANE.t1-t)/0.6);
 // faint body glow, steady nav lights (left wing red, right wing green — flying away from us to the left), white tail, red beacon, double white strobe
 const halo=X.createRadialGradient(x,y,0,x,y,22);halo.addColorStop(0,`rgba(255,240,230,${0.10*fade})`);halo.addColorStop(1,'rgba(255,240,230,0)');X.fillStyle=halo;X.fillRect(x-22,y-22,44,44);
 const dot=(dx,dy,c,r,a)=>{if(a<=0)return;const g=X.createRadialGradient(x+dx,y+dy,0,x+dx,y+dy,r*4);g.addColorStop(0,c.replace('A',a*fade));g.addColorStop(1,c.replace('A',0));X.fillStyle=g;X.fillRect(x+dx-r*4,y+dy-r*4,r*8,r*8);X.fillStyle=c.replace('A',Math.min(1,a*1.4)*fade);X.beginPath();X.arc(x+dx,y+dy,r,0,6.28);X.fill();};
 dot(-22,2,'rgba(255,70,70,A)',2.4,0.95);dot(22,-1,'rgba(90,255,140,A)',2.4,0.85);dot(0,3,'rgba(255,255,255,A)',1.8,0.5);
 const bk=(t*1.0)%1;dot(0,-2,'rgba(255,60,50,A)',1.8,bk<0.12?1:0.15);
 const sb=(t*0.9+0.3)%1;dot(-22,2,'rgba(255,255,255,A)',3.4,(sb<0.05||(sb>0.1&&sb<0.15))?1:0);}
const R1=rng(31);const RAIN=[...Array(120)].map(()=>({x:R1(),p:R1(),s:0.9+R1()*0.6,l:14+R1()*22}));
function rainOut(t){X.save();X.beginPath();X.rect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0);X.clip();X.strokeStyle='rgba(200,210,240,.10)';X.lineWidth=1.2;
 for(const d of RAIN){const y=WIN.y0+((d.p+t*d.s*0.9)%1)*(WIN.y1-WIN.y0),x=WIN.x0+d.x*(WIN.x1-WIN.x0)-(y-WIN.y0)*0.08;X.beginPath();X.moveTo(x,y);X.lineTo(x-d.l*0.12,y+d.l);X.stroke();}X.restore();}
// drops on the glass: static beads + a few running drops (each runs then re-forms higher up)
const R2=rng(44);const BEADS=[...Array(260)].map(()=>({x:WIN.x0+R2()*(WIN.x1-WIN.x0),y:WIN.y0+R2()*(WIN.y1-WIN.y0),r:1.2+R2()*R2()*4.5}));
const RUN=[...Array(14)].map(()=>({x:WIN.x0+40+R2()*(WIN.x1-WIN.x0-80),p:R2(),T:4+R2()*6,r:2.6+R2()*1.8,w:R2()*6.28}));
function glassDrops(t){X.save();X.beginPath();X.rect(WIN.x0+WIN.fw,WIN.y0+WIN.fw,WIN.x1-WIN.x0-2*WIN.fw,WIN.y1-WIN.y0-2*WIN.fw);X.clip();
 const bead=(x,y,r,a)=>{X.fillStyle=`rgba(200,205,235,${0.10*a})`;X.beginPath();X.ellipse(x,y,r,r*1.15,0,0,6.28);X.fill();X.fillStyle=`rgba(255,215,170,${0.18*a})`;X.beginPath();X.ellipse(x,y+r*0.45,r*0.6,r*0.4,0,0,6.28);X.fill();X.fillStyle=`rgba(255,255,255,${0.55*a})`;X.beginPath();X.arc(x-r*0.3,y-r*0.35,Math.max(0.6,r*0.28),0,6.28);X.fill();};
 for(const b of BEADS)bead(b.x,b.y,b.r,0.8);
 for(const d of RUN){const u=((t/d.T)+d.p)%1;const y=WIN.y0+40+ease(u)*(WIN.y1-WIN.y0-80),x=d.x+Math.sin(u*9+d.w)*5;const a=Math.min(1,u*8,(1-u)*8);
  X.strokeStyle=`rgba(200,205,235,${0.16*a})`;X.lineWidth=d.r*0.8;X.lineCap='round';X.beginPath();const u0=Math.max(0,u-0.12);X.moveTo(d.x+Math.sin(u0*9+d.w)*5,WIN.y0+40+ease(u0)*(WIN.y1-WIN.y0-80));
  for(let k=0;k<=10;k++){const uu=u0+(u-u0)*k/10;X.lineTo(d.x+Math.sin(uu*9+d.w)*5,WIN.y0+40+ease(uu)*(WIN.y1-WIN.y0-80));}X.stroke();bead(x,y,d.r,a);}
 X.restore();}
// ---------------- animated: room ----------------
// fairy lights strung along the curtain rail between two hooks, drooping in shallow swags
function fairy(t){const hk=[[184,214],[896,214]];for(const [x,y] of hk){X.fillStyle='#d8d2dc';X.beginPath();X.arc(x,y-4,4,0,6.28);X.fill();X.strokeStyle='#d8d2dc';X.lineWidth=3;X.beginPath();X.moveTo(x,y-2);X.lineTo(x,y+4);X.arc(x+4,y+4,4,Math.PI,0,true);X.stroke();}
 const pts=[];for(let i=0;i<=60;i++){const u=i/60,x=lerp(184,896,u),s=(u*4)%1;pts.push([x,222+Math.sin(s*Math.PI)*26]);}
 X.strokeStyle='rgba(30,24,30,.9)';X.lineWidth=1.6;X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();
 pts.forEach((p,i)=>{if(i%3)return;const tw=0.75+0.25*Math.sin(t*1.4+i*1.3);const g=X.createRadialGradient(p[0],p[1]+5,0,p[0],p[1]+5,24);g.addColorStop(0,`rgba(255,196,120,${0.42*tw})`);g.addColorStop(1,'rgba(255,196,120,0)');X.fillStyle=g;X.fillRect(p[0]-24,p[1]-19,48,48);
  X.fillStyle=`rgba(255,236,190,${0.8+0.2*tw})`;X.beginPath();X.ellipse(p[0],p[1]+5,2.6,4,0,0,6.28);X.fill();});}
// small table lamp on the left end of the ledge (the warm source lighting her left side)
function lamp(t){const x=232,y=LEDGE+2;const fl=1+0.01*Math.sin(t*3);
 const pool=X.createRadialGradient(x,y,4,x,y,170);pool.addColorStop(0,`rgba(255,190,110,${0.75*fl})`);pool.addColorStop(1,'rgba(255,190,110,0)');X.save();X.translate(x,y);X.scale(1,0.18);X.fillStyle=pool;X.beginPath();X.arc(0,0,170,0,6.28);X.fill();X.restore();
 X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(x+6,y,40,6,0,0,6.28);X.fill();
 const bg=X.createLinearGradient(x-30,0,x+30,0);bg.addColorStop(0,'#e6d2b8');bg.addColorStop(1,'#9c8670');X.fillStyle=bg;X.beginPath();X.moveTo(x-26,y);X.bezierCurveTo(x-38,y-40,x-24,y-70,x-8,y-82);X.lineTo(x+8,y-82);X.bezierCurveTo(x+24,y-70,x+38,y-40,x+26,y);X.closePath();X.fill();
 X.fillStyle='#6d5a48';X.fillRect(x-3,y-104,6,24);
 const sh=X.createLinearGradient(0,y-170,0,y-100);sh.addColorStop(0,'#ffe9c8');sh.addColorStop(1,'#ffd197');X.fillStyle=sh;X.beginPath();X.moveTo(x-36,y-170);X.lineTo(x+36,y-170);X.lineTo(x+54,y-100);X.lineTo(x-54,y-100);X.closePath();X.fill();
 X.fillStyle='rgba(255,250,235,.8)';X.beginPath();X.ellipse(x,y-100,54,6,0,0,6.28);X.fill();
 const gl=X.createRadialGradient(x,y-130,10,x,y-130,260);gl.addColorStop(0,'rgba(255,200,120,.32)');gl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=gl;X.fillRect(x-260,y-390,520,520);}
// little trailing plant at the right end of the ledge
function plantR(){const x=878,y=LEDGE+2,r=rng(8);X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(x+4,y,44,6,0,0,6.28);X.fill();
 const pg=X.createLinearGradient(x-40,0,x+40,0);pg.addColorStop(0,'#c98c6a');pg.addColorStop(1,'#7c4a38');X.fillStyle=pg;X.beginPath();X.moveTo(x-36,y-62);X.lineTo(x+36,y-62);X.lineTo(x+28,y);X.lineTo(x-28,y);X.fill();X.fillStyle='#a8674e';X.fillRect(x-39,y-68,78,10);
 for(let i=0;i<40;i++){const a=-Math.PI*(0.1+r()*0.8),rr=20+r()*46,lx=x+Math.cos(a)*rr*1.1,ly=y-70+Math.sin(a)*rr*0.9;X.fillStyle=['#3f6e44','#4f8452','#36603b'][i%3];X.save();X.translate(lx,ly);X.rotate(a+1.6);X.beginPath();X.moveTo(0,-9);X.quadraticCurveTo(9,0,0,9);X.quadraticCurveTo(-9,0,0,-9);X.fill();X.restore();}
 for(let k=0;k<0;k++){let px=x+22-k*6,py=y-64;X.strokeStyle='#2c4a30';X.lineWidth=2;X.beginPath();X.moveTo(px,py);for(let j=0;j<6;j++){px+=6+k*2;py+=14;X.lineTo(px,py);}X.stroke();}}
// phone propped against the glass on the ledge, screen facing into the room; lights up with his message
function phone(t){const {x,y,w,h,lean}=PHONE;const on=clamp((t-T_MSG)/0.25,0,1)*(1-0.35*clamp((t-T_MSG-5)/1.5,0,1));
 const bz=(t>T_MSG&&t<T_MSG+0.5&&((t-T_MSG)%0.25)<0.16)?Math.sin(t*170)*1.2:0;
 // screen glow on the ledge and the glass behind (soft gradient, never a disc)
 if(on>0){const g=X.createRadialGradient(x,y-h*0.5,10,x,y-h*0.4,190);g.addColorStop(0,`rgba(190,200,255,${0.38*on})`);g.addColorStop(1,'rgba(190,200,255,0)');X.fillStyle=g;X.fillRect(x-200,y-h-160,400,300);}
 X.save();X.translate(x+bz,y);X.rotate(0.05);X.scale(1,lean);
 X.fillStyle='rgba(0,0,0,.45)';X.beginPath();X.ellipse(4,2,w*0.55,5,0,0,6.28);X.fill();
 X.fillStyle='#1b1a22';X.beginPath();X.roundRect(-w/2,-h,w,h,11);X.fill();X.strokeStyle='rgba(255,255,255,.18)';X.lineWidth=1.2;X.stroke();
 // screen
 const sx=-w/2+4,sy=-h+10,sw=w-8,sh=h-8;
 const sg=X.createLinearGradient(0,sy,0,sy+sh);sg.addColorStop(0,`rgb(${lerp(14,56,on)|0},${lerp(14,48,on)|0},${lerp(20,92,on)|0})`);sg.addColorStop(1,`rgb(${lerp(10,120,on)|0},${lerp(10,84,on)|0},${lerp(16,120,on)|0})`);X.fillStyle=sg;X.beginPath();X.roundRect(sx,sy,sw,sh,8);X.fill();
 if(on>0){X.globalAlpha=on;X.textAlign='center';X.fillStyle='#fff';X.font='600 25px Poppins, sans-serif';X.fillText('11:48',0,sy+40);X.font='9px Poppins, sans-serif';X.fillStyle='rgba(255,255,255,.8)';X.fillText('Wednesday 25',0,sy+54);
  // notification card
  X.fillStyle='rgba(255,255,255,.88)';X.beginPath();X.roundRect(sx+3,sy+64,sw-6,52,8);X.fill();
  X.textAlign='left';X.fillStyle='#2a2438';X.font='700 12px Poppins, sans-serif';X.fillText('him',sx+9,sy+82);heart(sx+40,sy+78,4.6,1,'#e0475b');
  X.font='600 9.4px Poppins, sans-serif';X.fillStyle='#3a3448';X.fillText('home at 6am',sx+8,sy+97);X.font='9.4px Poppins, sans-serif';X.fillText('keep it warm',sx+8,sy+109);
  X.globalAlpha=1;}
 // glass reflection streak
 X.fillStyle='rgba(255,255,255,.05)';X.beginPath();X.moveTo(sx+sw*0.6,sy);X.lineTo(sx+sw,sy);X.lineTo(sx+sw,sy+sh*0.3);X.closePath();X.fill();
 X.restore();}
function seatProps(){
 // paperback, open and face-down (a tent), in perspective on the seat
 {const x=690,y=1500;X.fillStyle='rgba(20,10,20,.4)';X.filter='blur(4px)';X.beginPath();X.ellipse(x,y+8,96,12,0,0,6.28);X.fill();X.filter='none';
  for(const s of [-1,1]){const g=X.createLinearGradient(x,0,x+s*90,0);g.addColorStop(0,s<0?'#3f5a78':'#34506c');g.addColorStop(1,s<0?'#55739a':'#2a425c');X.fillStyle=g;
   X.beginPath();X.moveTo(x,y-34);X.lineTo(x+s*88,y-6);X.lineTo(x+s*84,y+8);X.lineTo(x,y-18);X.closePath();X.fill();
   X.fillStyle='#efe6d4';X.beginPath();X.moveTo(x+s*84,y+8);X.lineTo(x+s*86,y+2);X.lineTo(x+s*4,y-22);X.lineTo(x,y-18);X.closePath();X.fill();}
  X.fillStyle='#22344a';X.fillRect(x-3,y-36,6,20);X.fillStyle='#d9ceb8';for(const s of [-1,1]){X.beginPath();X.moveTo(x+s*84,y+8);X.lineTo(x+s*84,y+13);X.lineTo(x+s*2,y-13);X.lineTo(x,y-18);X.closePath();X.fill();}
  }
 // mug, half-drunk, handle to the right
 {const x=842,y=1474;X.fillStyle='rgba(20,10,20,.4)';X.filter='blur(3px)';X.beginPath();X.ellipse(x+4,y+4,34,7,0,0,6.28);X.fill();X.filter='none';
  const g=X.createLinearGradient(x-28,0,x+28,0);g.addColorStop(0,'#e7d7c5');g.addColorStop(1,'#a8927e');X.fillStyle=g;X.beginPath();X.moveTo(x-28,y-58);X.lineTo(x+28,y-58);X.lineTo(x+26,y-4);X.quadraticCurveTo(x,y+4,x-26,y-4);X.closePath();X.fill();
  X.strokeStyle='#b8a28c';X.lineWidth=7;X.beginPath();X.moveTo(x+25,y-46);X.bezierCurveTo(x+48,y-48,x+48,y-14,x+24,y-16);X.stroke();
  X.fillStyle='#d8c8b6';X.beginPath();X.ellipse(x,y-58,28,7,0,0,6.28);X.fill();X.fillStyle='#5a3a26';X.beginPath();X.ellipse(x,y-56,24,5,0,0,6.28);X.fill();
  X.fillStyle='rgba(255,255,255,.25)';X.fillRect(x-20,y-52,5,40);}}
function heart(x,y,s,a,col){X.save();X.globalAlpha*=a;X.fillStyle=col||'#fbe4ea';X.beginPath();X.moveTo(x,y+s*0.8);X.bezierCurveTo(x-s*1.2,y-s*0.1,x-s*0.6,y-s*0.95,x,y-s*0.35);X.bezierCurveTo(x+s*0.6,y-s*0.95,x+s*1.2,y-s*0.1,x,y+s*0.8);X.fill();X.restore();}

// ---------------- her, in his hoodie ----------------
const CX=540,NECK=[540,968];
function hoodie(t){X.save();X.translate(CX,966);X.scale(0.74,0.9);X.translate(-CX,-966);hoodieRaw(t);X.restore();}
function hoodieRaw(t){const b=breathAt(t)*2.4;
 // oversized: shoulder seams drop onto her upper arms; arms wrap forward round her knees, so from behind we see
 // the rounded shoulders, the elbows bulging out at the sides, the body widening a little to a ribbed hem on the seat.
 const P=new Path2D();
 P.moveTo(CX-70,962+b*0.3);
 P.bezierCurveTo(CX-120,966+b,CX-168,980+b,CX-190,1010+b);          // left shoulder slope (rounded, soft)
 P.bezierCurveTo(CX-212,1040+b,CX-222,1090,CX-226,1140);              // dropped shoulder over the upper arm
 P.bezierCurveTo(CX-230,1200,CX-236,1260,CX-232,1300);                // sleeve hanging down her side to the elbow
 P.bezierCurveTo(CX-228,1330,CX-214,1346,CX-200,1352);                // elbow bends forward (forearm goes to her lap)
 P.bezierCurveTo(CX-198,1376,CX-206,1398,CX-210,1418);                // body to the hem
 P.bezierCurveTo(CX-120,1432,CX+120,1432,CX+210,1418);
 P.bezierCurveTo(CX+206,1398,CX+198,1376,CX+200,1352);
 P.bezierCurveTo(CX+214,1346,CX+228,1330,CX+232,1300);
 P.bezierCurveTo(CX+236,1260,CX+230,1200,CX+226,1140);
 P.bezierCurveTo(CX+222,1090,CX+212,1040+b,CX+190,1010+b);
 P.bezierCurveTo(CX+168,980+b,CX+120,966+b,CX+70,962+b*0.3);P.closePath();
 // cross-legged: her knees (soft dark leggings) show either side of the hem, resting on the seat
 for(const s of [-1]){const kx=CX+s*262,ky=1404;
  X.fillStyle='rgba(20,10,20,.35)';X.beginPath();X.ellipse(kx+s*6,ky+22,74,12,0,0,6.28);X.fill();
  const kg=X.createRadialGradient(kx-s*10,ky-18,6,kx,ky,80);kg.addColorStop(0,s<0?'#7a6a7c':'#665c74');kg.addColorStop(1,'#3e3548');X.fillStyle=kg;
  X.beginPath();X.moveTo(kx-s*110,ky-20);X.bezierCurveTo(kx-s*50,ky-40,kx+s*30,ky-58,kx+s*70,ky-34);X.bezierCurveTo(kx+s*92,ky-18,kx+s*84,ky+16,kx+s*50,ky+24);X.lineTo(kx-s*110,ky+24);X.closePath();X.fill();
  X.fillStyle='rgba(255,255,255,.08)';X.beginPath();X.ellipse(kx+s*52,ky-36,22,9,s*-0.3,0,6.28);X.fill();
  X.strokeStyle=s<0?'rgba(255,190,130,.35)':'rgba(185,200,240,.3)';X.lineWidth=3;X.beginPath();X.moveTo(kx-s*30,ky-42);X.bezierCurveTo(kx+s*20,ky-40,kx+s*52,ky-24,kx+s*64,ky-4);X.stroke();}
 // contact shadow on the seat
 X.fillStyle='rgba(20,10,20,.38)';X.beginPath();X.ellipse(CX,1428,250,16,0,0,6.28);X.fill();
 const g=X.createLinearGradient(CX-240,980,CX+240,1380);g.addColorStop(0,'#b5b2b8');g.addColorStop(0.45,'#8f8d96');g.addColorStop(1,'#5f5e6c');X.fillStyle=g;X.fill(P);
 X.save();X.clip(P);
 // heather fleck texture
 const r=rng(3);for(let i=0;i<1300;i++){X.fillStyle=r()>0.5?'rgba(255,255,255,.07)':'rgba(30,30,40,.08)';X.fillRect(CX-240+r()*480,960+r()*480,2,1.3);}
 // where each sleeve meets the body: a soft shadow crease from the armpit down to the bent elbow
 X.filter='blur(3px)';for(const sd of [-1,1]){X.strokeStyle='rgba(40,40,56,.32)';X.lineWidth=8;X.beginPath();X.moveTo(CX+sd*172,1110);X.bezierCurveTo(CX+sd*176,1190,CX+sd*184,1270,CX+sd*196,1350);X.stroke();
  X.strokeStyle='rgba(255,255,255,.10)';X.lineWidth=5;X.beginPath();X.moveTo(CX+sd*186,1120);X.bezierCurveTo(CX+sd*192,1200,CX+sd*198,1270,CX+sd*206,1340);X.stroke();}X.filter='none';
 // shoulder seams sitting low on the upper arms (oversized fit)
 X.strokeStyle='rgba(50,48,60,.35)';X.lineWidth=2;for(const s of [-1,1]){X.beginPath();X.moveTo(CX+s*176,1000+b);X.bezierCurveTo(CX+s*170,1040,CX+s*176,1080,CX+s*188,1120);X.stroke();}
 // tension folds: from the shoulder blades out toward the elbows as her arms pull forward
 X.lineCap='round';X.filter='blur(5px)';
 for(const [x0,y0,cx,cy,x1,y1,w,a] of [[-80,1170,-150,1190,-210,1240,26,.07],[80,1170,150,1190,210,1240,26,.08],[-150,1300,-130,1340,-160,1390,20,.08],[150,1300,130,1340,160,1390,20,.10]]){
  X.strokeStyle=`rgba(40,40,56,${a})`;X.lineWidth=w;X.beginPath();X.moveTo(CX+x0,y0);X.quadraticCurveTo(CX+cx,cy,CX+x1,y1);X.stroke();
  X.strokeStyle=`rgba(255,250,250,${a*0.35})`;X.lineWidth=3;X.beginPath();X.moveTo(CX+x0,y0-w*0.6);X.quadraticCurveTo(CX+cx,cy-w*0.6,CX+x1,y1-w*0.6);X.stroke();}
 X.filter='none';
 // slack fabric bunching above the hem band
 for(let i=0;i<9;i++){const x=CX-190+i*47;X.strokeStyle='rgba(40,40,56,.08)';X.lineWidth=9;X.beginPath();X.moveTo(x,1386);X.quadraticCurveTo(x+10,1366,x+4,1344);X.stroke();}
 // spine hollow
 const sp=X.createLinearGradient(CX-40,0,CX+40,0);sp.addColorStop(0,'rgba(40,40,56,0)');sp.addColorStop(0.5,'rgba(40,40,56,.12)');sp.addColorStop(1,'rgba(40,40,56,0)');X.fillStyle=sp;X.fillRect(CX-40,1150,80,240);
 // warm lamp light on her left side, cool window/phone light on the right
 const wl=X.createRadialGradient(CX-260,1100,10,CX-240,1140,300);wl.addColorStop(0,'rgba(255,190,120,.34)');wl.addColorStop(1,'rgba(255,190,120,0)');X.fillStyle=wl;X.fillRect(CX-260,960,360,480);
 const on=0;if(on>0){const pl=X.createRadialGradient(CX+300,1120,10,CX+300,1120,240);pl.addColorStop(0,`rgba(170,185,255,${0.22*on})`);pl.addColorStop(1,'rgba(170,185,255,0)');X.fillStyle=pl;X.fillRect(CX,960,280,420);}
 // ribbed hem band, slightly gathered where it sits on the seat
 X.fillStyle='rgba(70,70,84,.55)';X.beginPath();X.moveTo(CX-214,1384);X.bezierCurveTo(CX-120,1394,CX+120,1394,CX+214,1384);X.lineTo(CX+216,1440);X.lineTo(CX-216,1440);X.fill();
 X.strokeStyle='rgba(40,40,52,.35)';X.lineWidth=1.4;for(let i=0;i<54;i++){const x=CX-208+i*7.8;const y0=1388+Math.pow((x-CX)/214,2)*-4+3;X.beginPath();X.moveTo(x,y0);X.lineTo(x+0.6,1426);X.stroke();}
 X.strokeStyle='rgba(255,255,255,.12)';X.lineWidth=2;X.beginPath();X.moveTo(CX-214,1384);X.bezierCurveTo(CX-120,1394,CX+120,1394,CX+214,1384);X.stroke();
 X.restore();
 // rim lights along the outline
 X.strokeStyle='rgba(255,190,130,.45)';X.lineWidth=3;X.beginPath();X.moveTo(CX-190,1010+b);X.bezierCurveTo(CX-212,1040+b,CX-220,1090,CX-222,1140);X.bezierCurveTo(CX-226,1190,CX-236,1236,CX-232,1268);X.stroke();
 X.strokeStyle='rgba(185,200,240,.35)';X.lineWidth=2.5;X.beginPath();X.moveTo(CX+190,1010+b);X.bezierCurveTo(CX+212,1040+b,CX+220,1090,CX+222,1140);X.bezierCurveTo(CX+226,1190,CX+236,1236,CX+232,1268);X.stroke();
 hood(t,b);}
// the hood lies on her upper back: a soft rounded bag, centre seam, its rolled opening edge round the nape showing the lining
function hood(t,b){const y=b*0.5-10;const H=new Path2D();
 H.moveTo(CX-104,968+y);H.bezierCurveTo(CX-130,1010+y,CX-124,1090+y,CX-92,1134+y);H.bezierCurveTo(CX-60,1168+y,CX+60,1168+y,CX+92,1134+y);
 H.bezierCurveTo(CX+124,1090+y,CX+130,1010+y,CX+104,968+y);H.bezierCurveTo(CX+60,956+y,CX-60,956+y,CX-104,968+y);H.closePath();
 // shadow it casts on the back
 X.save();X.translate(0,8);X.fillStyle='rgba(30,30,44,.28)';X.filter='blur(6px)';X.fill(H);X.restore();
 const g=X.createLinearGradient(CX-130,970,CX+130,1160);g.addColorStop(0,'#b9b6bc');g.addColorStop(0.5,'#97959e');g.addColorStop(1,'#6c6b78');X.fillStyle=g;X.fill(H);
 X.save();X.clip(H);
 const r=rng(9);for(let i=0;i<360;i++){X.fillStyle=r()>0.5?'rgba(255,255,255,.07)':'rgba(30,30,40,.08)';X.fillRect(CX-130+r()*260,960+r()*210,2,1.3);}
 // soft crumples where the empty hood folds over itself
 for(const [x0,y0,cx,cy,x1,y1,w,a] of [[-84,1000,-70,1070,-52,1130,16,.10],[86,1000,72,1070,56,1130,16,.12]]){X.filter='blur(5px)';X.strokeStyle=`rgba(40,40,56,${a})`;X.lineWidth=w;X.lineCap='round';X.beginPath();X.moveTo(CX+x0,y0+y);X.quadraticCurveTo(CX+cx,cy+y,CX+x1,y1+y);X.stroke();}X.filter='none';
 X.strokeStyle='rgba(50,48,60,.4)';X.lineWidth=1.8;X.beginPath();X.moveTo(CX,990+y);X.bezierCurveTo(CX+2,1050+y,CX-1,1110+y,CX,1160+y);X.stroke();   // centre seam
 const wl=X.createRadialGradient(CX-150,1040,10,CX-150,1040,170);wl.addColorStop(0,'rgba(255,190,120,.3)');wl.addColorStop(1,'rgba(255,190,120,0)');X.fillStyle=wl;X.fillRect(CX-150,960,200,220);
 X.restore();
 // rolled opening edge round the neck: a band of lining (darker) with a stitched hem line
 X.strokeStyle='#6f6c78';X.lineWidth=14;X.lineCap='round';X.beginPath();X.moveTo(CX-102,972+y);X.bezierCurveTo(CX-60,960+y,CX+60,960+y,CX+102,972+y);X.stroke();
 X.strokeStyle='#4f4d5a';X.lineWidth=5;X.beginPath();X.moveTo(CX-98,966+y);X.bezierCurveTo(CX-58,955+y,CX+58,955+y,CX+98,966+y);X.stroke();
 X.strokeStyle='rgba(220,220,230,.25)';X.lineWidth=1;X.setLineDash([3,3]);X.beginPath();X.moveTo(CX-96,978+y);X.bezierCurveTo(CX-58,968+y,CX+58,968+y,CX+96,978+y);X.stroke();X.setLineDash([]);}
function head(t){const b=breathAt(t)*2,a=turnAt(t),tl=tiltAt(t),tn=a/(8*Math.PI/180);
 X.save();X.translate(NECK[0],NECK[1]-2+b*0.5);X.scale(1.08,1.08);X.rotate(rollAt(t)+a*0.5);
 // nape of the neck (≈ half the head width, short) rising out of the hood
 const ng=X.createLinearGradient(-26,0,26,0);ng.addColorStop(0,SK_LT);ng.addColorStop(0.5,SK);ng.addColorStop(1,SK_SH);X.fillStyle=ng;X.beginPath();X.moveTo(-28,10);X.quadraticCurveTo(-26,-12,-25,-30);X.lineTo(25,-30);X.quadraticCurveTo(26,-12,28,10);X.closePath();X.fill();
 X.translate(0,-22);X.rotate(a*0.5);X.scale(1,1+tl*0.6);   // chin up = back of head foreshortens slightly
 if(tn>0.05){const k=Math.min(1.4,tn);X.fillStyle=SK_SH;X.beginPath();X.ellipse(48,-52,10*k+2,30,0.15,0,6.28);X.fill();X.fillStyle=`rgba(240,200,180,${0.3*Math.min(1,k)})`;X.beginPath();X.ellipse(51,-54,5*k+1,20,0.15,0,6.28);X.fill();}
 if(tn<-0.05){const k=Math.min(1.4,-tn);X.fillStyle=SK_SH;X.beginPath();X.ellipse(-48,-52,10*k+2,30,-0.15,0,6.28);X.fill();X.fillStyle=`rgba(255,200,160,${0.35*Math.min(1,k)})`;X.beginPath();X.ellipse(-51,-54,5*k+1,20,-0.15,0,6.28);X.fill();}
 for(const s of [-1,1]){X.fillStyle=SK_SH;X.beginPath();X.ellipse(s*55,-72,8,15,s*0.15,0,6.28);X.fill();X.fillStyle=SK;X.beginPath();X.ellipse(s*54,-72,5,11,s*0.15,0,6.28);X.fill();}
 const hg=X.createRadialGradient(-30,-110,10,0,-80,110);hg.addColorStop(0,HAIR_L);hg.addColorStop(0.5,HAIR);hg.addColorStop(1,'#1a110c');X.fillStyle=hg;
 {const nk=X.createLinearGradient(-40,0,40,0);nk.addColorStop(0,SK_LT);nk.addColorStop(0.5,SK);nk.addColorStop(1,SK_SH);X.fillStyle=nk;X.beginPath();X.ellipse(0,-22,40,20,0,0,6.28);X.fill();X.fillStyle=hg;}
 X.beginPath();X.moveTo(-46,-22);X.bezierCurveTo(-64,-70,-64,-140,-36,-168);X.bezierCurveTo(-12,-186,22,-184,42,-166);X.bezierCurveTo(66,-140,64,-70,46,-22);X.bezierCurveTo(34,-18,22,-30,10,-30);X.quadraticCurveTo(0,-24,-10,-30);X.bezierCurveTo(-22,-30,-34,-18,-46,-22);X.fill();
 {const hs=X.createLinearGradient(0,-28,0,-8);hs.addColorStop(0,'rgba(90,55,40,.30)');hs.addColorStop(1,'rgba(90,55,40,0)');X.fillStyle=hs;X.fillRect(-36,-28,72,20);}
 X.strokeStyle='rgba(140,100,75,0)';X.lineWidth=1.4;for(let i=0;i<16;i++){const sx=-56+i*7.5;X.beginPath();X.moveTo(sx*0.9,-162+Math.abs(sx)*0.5);X.quadraticCurveTo(sx*0.8,-110,sx*0.3,-84);X.stroke();}
 // messy top-knot bun sitting high on the crown so it breaks the head outline (reads as a bun, never as a disc on the back of the head)
 X.save();X.translate(0,-170);
 const bg=X.createRadialGradient(-10,-14,3,0,-2,44);bg.addColorStop(0,'#7a5640');bg.addColorStop(0.7,HAIR);bg.addColorStop(1,'#2a1a12');X.fillStyle=bg;
 X.beginPath();X.moveTo(-36,10);X.bezierCurveTo(-48,-14,-30,-40,-4,-40);X.bezierCurveTo(24,-44,44,-24,40,0);X.bezierCurveTo(38,16,20,22,0,22);X.bezierCurveTo(-18,22,-32,18,-36,10);X.fill();
 // twisted strands: short slanted S-strokes laid across the knot like a twisted rope (no closed rings, no spiral)
 X.lineCap='round';for(let i=0;i<9;i++){const x0=-30+i*7.5,y0=12-Math.abs(i-4)*1.5;X.strokeStyle=i%2?'rgba(176,128,94,.42)':'rgba(16,9,5,.38)';X.lineWidth=i%2?2.2:1.6;
  X.beginPath();X.moveTo(x0-4,y0);X.bezierCurveTo(x0-12,y0-14,x0+12,y0-22,x0+6,y0-38+Math.abs(i-4)*3);X.stroke();}
 // a few loose ends sticking out of the knot
 X.strokeStyle='rgba(150,108,78,.7)';X.lineWidth=1.2;for(const [x0,y0,x1,y1] of [[-26,-30,-36,-38]]){X.beginPath();X.moveTo(x0,y0);X.quadraticCurveTo((x0+x1)/2+4,(y0+y1)/2-6,x1,y1);X.stroke();}
 X.strokeStyle='rgba(255,180,120,.45)';X.lineWidth=2.4;X.beginPath();X.moveTo(-36,10);X.bezierCurveTo(-48,-14,-30,-40,-4,-40);X.stroke();
 X.restore();
 // hair gathered up toward the crown: soft strand lines converging upward
 X.strokeStyle='rgba(150,108,80,.09)';X.lineWidth=1.2;for(let i=0;i<9;i++){const sx=-46+i*11+((i*7)%5);X.beginPath();X.moveTo(sx*0.9,-30);X.quadraticCurveTo(sx*0.95,-100,sx*0.3,-158);X.stroke();}
 X.strokeStyle='rgba(110,76,54,.55)';X.lineWidth=1.1;for(const [x0,y0,dx,dy] of [[-48,-78,-7,32]]){X.beginPath();X.moveTo(x0,y0);X.bezierCurveTo(x0+dx*0.3,y0+dy*0.4,x0+dx+Math.sin(t*0.8+x0)*2,y0+dy*0.7,x0+dx*0.6,y0+dy);X.stroke();}
 X.strokeStyle='rgba(255,180,120,.5)';X.lineWidth=3;X.beginPath();X.moveTo(-48,-34);X.bezierCurveTo(-64,-70,-64,-140,-36,-168);X.stroke();
 X.strokeStyle=`rgba(255,196,140,0.3)`;X.lineWidth=2.5;X.beginPath();X.moveTo(42,-166);X.bezierCurveTo(66,-140,64,-70,48,-30);X.stroke();
 X.restore();}


// ---------------- grade + caption ----------------
function grade(t){const v=X.createRadialGradient(540,1000,300,540,1000,1250);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,4,14,.62)');X.fillStyle=v;X.fillRect(0,0,W,H);
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(150,110,190,.10)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.04;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
// ---------------- snow outside the glass ----------------
const RF=rng(71);const FLAKES=[...Array(260)].map(()=>({x:RF(),p:RF(),d:RF()<0.35?1:(RF()<0.5?0.6:0.35),w:RF()*6.28,a:0.5+RF()*0.5}));
function snowOut(t){X.save();X.beginPath();X.rect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0);X.clip();
 for(const f of FLAKES){const sp=34+60*f.d;const y=WIN.y0-20+(((f.p*1100+t*sp)%1040));const x=WIN.x0-30+f.x*(WIN.x1-WIN.x0+60)+Math.sin(t*0.9*f.d+f.w)*14*f.d+t*6*f.d;
  const r=0.8+2.0*f.d;X.fillStyle=`rgba(236,240,255,${0.3*f.a+0.4*f.d*f.a})`;X.beginPath();X.ellipse(x,y,r,r*0.85,f.w,0,6.28);X.fill();
  }
 // snow already settled on the outside sill, seen through the bottom of the glass: soft uneven mounds
 const r=rng(12);X.fillStyle='rgba(222,226,244,.9)';for(let k=0;k<44;k++){const x=WIN.x0+WIN.fw+k*(WIN.x1-WIN.x0-2*WIN.fw)/43;X.beginPath();X.ellipse(x,WIN.y1-WIN.fw-4,14+r()*10,6+r()*5,0,Math.PI,0);X.fill();}
 X.fillRect(WIN.x0+WIN.fw,WIN.y1-WIN.fw-4,WIN.x1-WIN.x0-2*WIN.fw,4);
 X.restore();}
// a little frost creeping in from the corners of each pane
function frost(){X.save();for(const [x,y,sx,sy] of [[WIN.x0+WIN.fw,WIN.y1-WIN.fw,1,-1],[WIN.x1-WIN.fw,WIN.y1-WIN.fw,-1,-1],[WIN.x0+WIN.fw,WIN.y0+WIN.fw,1,1],[WIN.x1-WIN.fw,WIN.y0+WIN.fw,-1,1],[WIN.mul-9,WIN.y0+WIN.fw,-1,1],[WIN.mul+9,WIN.y0+WIN.fw,1,1]]){
  const g=X.createRadialGradient(x,y,0,x,y,120);g.addColorStop(0,'rgba(220,228,250,.20)');g.addColorStop(1,'rgba(220,228,250,0)');X.fillStyle=g;X.fillRect(x-(sx<0?120:0),y-(sy<0?120:0),120,120);}X.restore();}
// two mugs on the ledge (his and hers), steam curling up into the lamp light
function mugs(t){for(const [x,c1,c2,ph,hd] of [[860,'#e8dccb','#a8957f',0,1],[912,'#5d7795','#34465e',1.7,-1]]){const y=LEDGE+2;
  X.fillStyle='rgba(10,6,14,.45)';X.filter='blur(3px)';X.beginPath();X.ellipse(x+5,y,32,6,0,0,6.28);X.fill();X.filter='none';
  const g=X.createLinearGradient(x-26,0,x+26,0);g.addColorStop(0,c1);g.addColorStop(1,c2);X.fillStyle=g;X.beginPath();X.moveTo(x-25,y-58);X.lineTo(x+25,y-58);X.lineTo(x+23,y-4);X.quadraticCurveTo(x,y+3,x-23,y-4);X.closePath();X.fill();
  X.strokeStyle=c2;X.lineWidth=7;X.beginPath();X.moveTo(x+23*hd,y-46);X.bezierCurveTo(x+45*hd,y-48,x+45*hd,y-15,x+22*hd,y-17);X.stroke();
  X.fillStyle=c1;X.beginPath();X.ellipse(x,y-58,25,6,0,0,6.28);X.fill();X.fillStyle='#4a2c1c';X.beginPath();X.ellipse(x,y-57,21,4.4,0,0,6.28);X.fill();
  X.fillStyle='rgba(255,255,255,.18)';X.fillRect(x-18,y-52,4,40);
  // steam: soft wisps that start at the cup and fade as they rise
  X.save();X.filter='blur(6px)';for(let k=0;k<3;k++){const u=((t*0.22+k/3+ph*0.1)%1);const sy=y-66-u*120,sx=x+Math.sin(u*5+k*2+ph)*12;X.fillStyle=`rgba(255,240,225,${0.09*Math.sin(Math.PI*u)})`;X.beginPath();X.ellipse(sx,sy,4+u*5,14+u*8,Math.sin(u*4+k)*0.4,0,6.28);X.fill();}X.restore();}}
// his carry-on, standing on the floor in front of the seat, still zipped, the airline tag still on the handle
function suitcase(){const x=846,y0=1500,w=196,h=410;
 X.save();X.filter='blur(14px)';X.fillStyle='rgba(8,6,14,.5)';X.beginPath();X.moveTo(x-w/2-6,y0+30);X.lineTo(x-w/2-56,y0+60);X.lineTo(x-w/2-60,y0+h);X.lineTo(x-w/2+10,y0+h);X.closePath();X.fill();X.restore();
 X.fillStyle='rgba(0,0,0,.4)';X.filter='blur(10px)';X.beginPath();X.ellipse(x-30,y0+h-6,110,14,0,0,6.28);X.fill();X.filter='none';
 // retracted trolley handle tubes
 X.fillStyle='#2a2a32';X.fillRect(x-48,y0-22,9,30);X.fillRect(x+39,y0-22,9,30);X.fillStyle='#3a3a44';X.beginPath();X.roundRect(x-52,y0-30,104,14,6);X.fill();
 const g=X.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#6f8db0');g.addColorStop(0.5,'#5a7697');g.addColorStop(1,'#3d526c');X.fillStyle=g;X.beginPath();X.roundRect(x-w/2,y0,w,h,22);X.fill();
 // hard-shell ribs + the zip seam round the edge
 for(const dx of [-38,0,38]){X.fillStyle='rgba(255,255,255,.10)';X.fillRect(x+dx-3,y0+26,4,h-52);X.fillStyle='rgba(0,0,0,.14)';X.fillRect(x+dx+1,y0+26,4,h-52);}
 X.strokeStyle='rgba(20,26,40,.5)';X.lineWidth=2.4;X.beginPath();X.roundRect(x-w/2+7,y0+7,w-14,h-14,17);X.stroke();
 // lamp warmth on its left edge, window chill on the right
 X.fillStyle='rgba(255,190,130,.16)';X.beginPath();X.roundRect(x-w/2,y0,16,h,[22,0,0,22]);X.fill();
 // top carry handle + the paper airline tag looped through it
 X.strokeStyle='#23232b';X.lineWidth=8;X.lineCap='round';X.beginPath();X.moveTo(x-26,y0+2);X.bezierCurveTo(x-24,y0-14,x+24,y0-14,x+26,y0+2);X.stroke();
 X.strokeStyle='#e9dfc8';X.lineWidth=2;X.beginPath();X.moveTo(x+18,y0-10);X.quadraticCurveTo(x+30,y0-4,x+31,y0+12);X.stroke();
 X.save();X.translate(x+31,y0+44);X.rotate(0.03);X.fillStyle='#f3ead6';X.beginPath();X.roundRect(-10,-32,22,66,3);X.fill();
 X.fillStyle='#2f6f8f';X.fillRect(-10,-14,22,10);X.fillStyle='rgba(60,50,40,.55)';for(let k=0;k<4;k++)X.fillRect(-6,4+k*6,14,2);X.restore();}

// ---------------- him ----------------
const MX=700, MN=[700,926];          // his centre line and the base of his neck (he sits a little taller)
const MSK='#8a5638',MSK_SH='#5e3824',MSK_LT='#a8704e',KNIT='#33405e';
const mBreath=t=>Math.sin(t*2*Math.PI/5.2+1.1);
const mLean=t=>(-7-4*ease((t-T_LEAN)/1.4))*Math.PI/180;      // head tilts toward her, then rests against hers at 7.6 s
function himBody(t){X.save();X.translate(MX,1430);X.scale(0.82,1);X.translate(-MX,-1430);himBodyRaw(t);X.restore();}
function himBodyRaw(t){const b=mBreath(t)*2.2;
 const P=new Path2D();
 P.moveTo(MX-64,922+b*0.3);
 P.bezierCurveTo(MX-120,926+b,MX-170,944+b,MX-192,978+b);         // left shoulder (toward her) slopes down: that arm goes round her
 P.bezierCurveTo(MX-206,1000,MX-206,1040,MX-200,1080);
 P.bezierCurveTo(MX-196,1180,MX-196,1300,MX-200,1424);
 P.bezierCurveTo(MX-100,1436,MX+100,1436,MX+206,1424);
 P.bezierCurveTo(MX+214,1380,MX+220,1330,MX+228,1290);           // right sleeve, elbow bent forward
 P.bezierCurveTo(MX+240,1220,MX+240,1110,MX+232,1040);
 P.bezierCurveTo(MX+226,990,MX+212,962+b,MX+186,946+b);
 P.bezierCurveTo(MX+150,930+b,MX+110,924+b,MX+64,922+b*0.3);P.closePath();
 X.fillStyle='rgba(14,8,18,.4)';X.beginPath();X.ellipse(MX+10,1432,230,15,0,0,6.28);X.fill();
 // his knee, folded, peeking out on the right
 {const kx=MX+252,ky=1408;X.fillStyle='rgba(14,8,18,.35)';X.beginPath();X.ellipse(kx,ky+22,60,10,0,0,6.28);X.fill();
  const kg=X.createRadialGradient(kx+10,ky-18,6,kx,ky,80);kg.addColorStop(0,'#4f5866');kg.addColorStop(1,'#272c36');X.fillStyle=kg;
  X.beginPath();X.moveTo(kx-60,ky-24);X.bezierCurveTo(kx-10,ky-44,kx+40,ky-50,kx+62,ky-28);X.bezierCurveTo(kx+78,ky-10,kx+70,ky+18,kx+40,ky+24);X.lineTo(kx-60,ky+24);X.closePath();X.fill();
  X.strokeStyle='rgba(185,200,240,.25)';X.lineWidth=2.5;X.beginPath();X.moveTo(kx-10,ky-42);X.bezierCurveTo(kx+30,ky-46,kx+56,ky-32,kx+64,ky-10);X.stroke();}

 const g=X.createLinearGradient(MX-200,930,MX+220,1420);g.addColorStop(0,'#46557a');g.addColorStop(0.5,KNIT);g.addColorStop(1,'#222a40');X.fillStyle=g;X.fill(P);
 X.save();X.clip(P);
 // knit texture: fine vertical rib columns + heather flecks
 for(let x=MX-220;x<MX+240;x+=9){X.strokeStyle='rgba(10,14,30,.16)';X.lineWidth=1.3;X.beginPath();X.moveTo(x,930);X.lineTo(x+2,1430);X.stroke();X.strokeStyle='rgba(160,175,215,.06)';X.beginPath();X.moveTo(x+4,930);X.lineTo(x+6,1430);X.stroke();}
 const r=rng(14);for(let i=0;i<900;i++){X.fillStyle=r()>0.5?'rgba(190,200,235,.06)':'rgba(8,10,20,.10)';X.fillRect(MX-220+r()*460,920+r()*510,2,1.3);}
 // shoulder blades + spine hollow, folds pulled toward the arm that reaches round her
 X.filter='blur(6px)';X.lineCap='round';
 for(const [x0,y0,cx,cy,x1,y1,w,a] of [[-10,1150,-80,1080,-170,990,22,.08],[110,1000,100,1080,80,1160,26,.10],[-120,1010,-110,1090,-90,1170,26,.08],[150,1260,170,1320,200,1380,18,.12]]){
  X.strokeStyle=`rgba(8,10,24,${a})`;X.lineWidth=w;X.beginPath();X.moveTo(MX+x0,y0);X.quadraticCurveTo(MX+cx,cy,MX+x1,y1);X.stroke();
  X.strokeStyle=`rgba(170,185,230,${a*0.4})`;X.lineWidth=4;X.beginPath();X.moveTo(MX+x0,y0-w*0.6);X.quadraticCurveTo(MX+cx,cy-w*0.6,MX+x1,y1-w*0.6);X.stroke();}
 X.filter='none';
 X.filter='blur(18px)';X.fillStyle='rgba(8,10,24,.13)';X.beginPath();X.ellipse(MX+6,1220,22,170,0,0,6.28);X.fill();X.filter='none';
 // right sleeve set off from the body by an armpit-to-elbow crease
 X.fillStyle='rgba(150,170,225,.08)';X.beginPath();X.moveTo(MX+150,940);X.bezierCurveTo(MX+170,1060,MX+178,1180,MX+196,1300);X.lineTo(MX+260,1300);X.lineTo(MX+260,940);X.closePath();X.fill();
 X.strokeStyle='rgba(8,10,24,.5)';X.lineWidth=2.5;X.beginPath();X.moveTo(MX+172,1070);X.bezierCurveTo(MX+180,1160,MX+186,1230,MX+198,1296);X.stroke();
 X.filter='blur(3px)';X.strokeStyle='rgba(8,10,24,.45)';X.lineWidth=9;X.beginPath();X.moveTo(MX+178,1040);X.bezierCurveTo(MX+186,1150,MX+194,1230,MX+208,1300);X.stroke();X.strokeStyle='rgba(170,185,230,.12)';X.lineWidth=10;X.beginPath();X.moveTo(MX+212,1050);X.bezierCurveTo(MX+222,1140,MX+224,1220,MX+222,1290);X.stroke();X.filter='none';
 // cool window light on his right side, warm lamp spill reaching across her onto his left
 const wl=X.createRadialGradient(MX+240,1080,10,MX+240,1100,300);wl.addColorStop(0,'rgba(170,190,240,.16)');wl.addColorStop(1,'rgba(170,190,240,0)');X.fillStyle=wl;X.fillRect(MX,920,260,520);
 // ribbed hem band on the seat
 X.fillStyle='rgba(16,20,36,.25)';X.beginPath();X.moveTo(MX-202,1388);X.bezierCurveTo(MX-100,1398,MX+100,1398,MX+210,1388);X.lineTo(MX+212,1440);X.lineTo(MX-204,1440);X.fill();
 X.strokeStyle='rgba(8,10,22,.35)';X.lineWidth=1.4;for(let i=0;i<54;i++){const x=MX-198+i*7.6;X.beginPath();X.moveTo(x,1394);X.lineTo(x+0.5,1430);X.stroke();}
 X.restore();
 // rim light: cool on the right shoulder/arm
 X.strokeStyle='rgba(180,198,245,.38)';X.lineWidth=2.5;X.beginPath();X.moveTo(MX+186,946+b);X.bezierCurveTo(MX+212,962+b,MX+226,990,MX+232,1040);X.bezierCurveTo(MX+240,1110,MX+240,1200,MX+232,1260);X.stroke();
 // ribbed crew collar
 X.fillStyle='#28324c';X.beginPath();X.moveTo(MX-64,924+b*0.3);X.bezierCurveTo(MX-30,910,MX+30,910,MX+64,924+b*0.3);X.bezierCurveTo(MX+30,922,MX-30,922,MX-64,924+b*0.3);X.fill();
 X.strokeStyle='rgba(150,165,210,.18)';X.lineWidth=1;for(let k=-50;k<=50;k+=6){X.beginPath();X.moveTo(MX+k,918+Math.abs(k)*0.12);X.lineTo(MX+k,930+Math.abs(k)*0.12);X.stroke();}}
// his head from behind: short coily black hair with a soft tapered nape, ears, neck ~half the head width
function himHead(t){const b=mBreath(t)*2;X.save();X.translate(MN[0],MN[1]+b*0.5);X.rotate(mLean(t));X.scale(1.14,1.14);
 const ng=X.createLinearGradient(-30,0,30,0);ng.addColorStop(0,MSK_LT);ng.addColorStop(0.5,MSK);ng.addColorStop(1,MSK_SH);X.fillStyle=ng;
 X.beginPath();X.moveTo(-30,4);X.quadraticCurveTo(-29,-20,-28,-60);X.lineTo(28,-60);X.quadraticCurveTo(29,-20,30,4);X.closePath();X.fill();
 X.translate(0,-6);
 // ears
 for(const s of [-1,1]){X.fillStyle=MSK_SH;X.beginPath();X.ellipse(s*58,-76,9,17,s*0.18,0,6.28);X.fill();X.fillStyle=MSK;X.beginPath();X.ellipse(s*57,-76,5.5,12,s*0.18,0,6.28);X.fill();}
 // back of the head (skin under the faded nape)
 X.fillStyle=MSK;X.beginPath();X.ellipse(0,-98,58,72,0,0,6.28);X.fill();
 // hair: dense coily crop, faded to skin at the nape with a soft W-ish hairline (no blunt horizontal edge)
 const hg=X.createRadialGradient(-18,-140,8,0,-100,110);hg.addColorStop(0,'#2c2522');hg.addColorStop(0.6,'#16110f');hg.addColorStop(1,'#0c0907');
 X.fillStyle=hg;X.beginPath();X.moveTo(-56,-66);X.bezierCurveTo(-68,-120,-50,-168,0,-172);X.bezierCurveTo(50,-168,68,-120,56,-66);
 X.bezierCurveTo(50,-46,30,-34,0,-32);X.bezierCurveTo(-30,-34,-50,-46,-56,-66);X.fill();
 // faded nape: hair thins out into skin over ~22px (gradient, never a blunt line)
 const fd=X.createLinearGradient(0,-38,0,-16);fd.addColorStop(0,'rgba(16,11,9,.8)');fd.addColorStop(1,'rgba(16,11,9,0)');X.fillStyle=fd;
 X.beginPath();X.moveTo(-30,-38);X.bezierCurveTo(-18,-36,18,-36,30,-38);X.bezierCurveTo(26,-22,14,-16,0,-16);X.bezierCurveTo(-14,-16,-26,-22,-30,-38);X.fill();
 // coil texture: tiny curls stippled over the crop
 const r=rng(23);X.lineWidth=0.9;for(let i=0;i<1500;i++){const a=r()*6.28,rr=Math.sqrt(r());const x=Math.cos(a)*rr*54,y=-110+Math.sin(a)*rr*62;if(y>-36-Math.abs(x)*0.5)continue;
  X.strokeStyle=r()>0.5?'rgba(74,62,56,.22)':'rgba(0,0,0,.25)';X.beginPath();X.arc(x,y,0.8+r()*1.1,r()*6,r()*6+3.2);X.stroke();}
 // rim lights: warm lamp on the side toward her (left), cool window on the right
 X.strokeStyle='rgba(255,186,130,.35)';X.lineWidth=2.6;X.beginPath();X.moveTo(-58,-70);X.bezierCurveTo(-66,-120,-50,-166,-10,-172);X.stroke();
 X.strokeStyle='rgba(180,198,245,.32)';X.lineWidth=2.4;X.beginPath();X.moveTo(58,-70);X.bezierCurveTo(66,-120,50,-166,10,-172);X.stroke();
 X.restore();}
// his left arm round her back: sleeve from his shoulder across her upper back, hand resting on her far shoulder (thumb strokes at 7.6 s)
function himArm(t){const b=mBreath(t)*2,st=t>T_LEAN?Math.sin((t-T_LEAN)*2.2)*4*ease((t-T_LEAN)/0.6)*(1-ease((t-T_LEAN-4.5)/1)):0;
 const HW=[398,1058];
 const arm=new Path2D();arm.moveTo(MX-150,1004+b);arm.bezierCurveTo(MX-190,1030,560,1062,500,1068);arm.quadraticCurveTo(440,1070,HW[0]+6,HW[1]+2);
 // soft cast shadow on her hoodie under the arm
 X.save();X.translate(0,14);X.filter='blur(10px)';X.strokeStyle='rgba(30,26,40,.45)';X.lineWidth=46;X.lineCap='round';X.stroke(arm);X.restore();X.filter='none';
 X.lineCap='round';X.strokeStyle='#1e2638';X.lineWidth=52;X.stroke(arm);
 const g=X.createLinearGradient(0,980,0,1070);g.addColorStop(0,'#53638a');g.addColorStop(0.5,'#3c4a6c');g.addColorStop(1,'#2a3552');X.strokeStyle=g;X.lineWidth=47;X.stroke(arm);
 // knit ribs along the sleeve + a fold where the elbow bends, lamp warmth on the forearm
 X.save();X.clip((()=>{const c=new Path2D();c.rect(HW[0],960,MX-HW[0],180);return c;})());
 X.setLineDash([2,6]);X.strokeStyle='rgba(10,14,30,.35)';X.lineWidth=40;X.stroke(arm);X.setLineDash([]);X.restore();
 X.filter='blur(3px)';X.strokeStyle='rgba(10,14,30,.4)';X.lineWidth=4;X.beginPath();X.moveTo(514,1048);X.quadraticCurveTo(506,1066,514,1086);X.stroke();X.filter='none';
 // ribbed cuff + his hand cupping her shoulder (fingers curve over the top, toward us we see the back of the hand)
 X.fillStyle='#2c3754';X.beginPath();X.roundRect(HW[0]-2,HW[1]-24,16,46,6);X.fill();
 X.save();X.translate(HW[0]-2,HW[1]-2);X.rotate(-0.55+st*0.01);
 const hg=X.createLinearGradient(-50,0,0,0);hg.addColorStop(0,MSK_LT);hg.addColorStop(1,MSK);X.fillStyle=hg;
 X.beginPath();X.moveTo(2,-10);X.bezierCurveTo(-14,-22,-36,-26,-50,-18);X.bezierCurveTo(-60,-10,-58,10,-48,20);X.bezierCurveTo(-30,30,-10,24,2,18);X.closePath();X.fill();
 X.strokeStyle='rgba(60,30,20,.35)';X.lineWidth=1.3;for(const yy of [-8,2,12]){X.beginPath();X.moveTo(-40,yy-2);X.lineTo(-56,yy);X.stroke();}
 // thumb along the top of her shoulder
 X.fillStyle=MSK;X.beginPath();X.ellipse(-22+st,-22,14,6,-0.2,0,6.28);X.fill();
 X.strokeStyle='rgba(255,190,140,.35)';X.lineWidth=1.6;X.beginPath();X.moveTo(-50,-18);X.bezierCurveTo(-60,-10,-58,10,-48,20);X.stroke();
 X.restore();}

// ---------------- her: same girl in his hoodie, leaning into him ----------------
const HX=455;const herLean=t=>(5+1*ease((t-T_LEAN)/1.4))*Math.PI/180;
function her(t){X.save();X.translate(HX,1470);X.rotate(herLean(t));X.translate(-CX,-1428);head(t);hoodie(t);X.restore();}
function capLines(lines,y,a,heartAfter){X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';X.font="italic 500 76px Corm, serif";X.shadowColor='rgba(70,40,80,.8)';X.shadowBlur=30;X.fillStyle='#fdf6f2';
 for(let k=0;k<2;k++){lines.forEach((l,i)=>X.fillText(l,540,y+i*90));X.shadowBlur=0;}
 const tw=X.measureText(lines[lines.length-1]).width;X.restore();if(heartAfter)heart(540+tw/2+42,y+(lines.length-1)*90-6,25,a,'#ffc4d2');}
function caption(t){
 const a=Math.min(1,0.55+t/0.9)*clamp((7.2-t)/1.0,0,1);if(a>0)capLines(["he\u2019s home.","we didn\u2019t even unpack."],560-t*3,a,false);
 const b=clamp((t-9.2)/1.2,0,1);if(b>0)capLines(['first snow of the year,','and he’s here for it'],540-b*10,b,true);}
// ---------------- frame ----------------
window.draw=function(t){if(!OUT)buildStatic();
 const z=1.24+0.06*ease(t/16),F=[560,880],ox=S*(F[0]-F[0]*z),oy=S*(F[1]-F[1]*z);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 const zf=1+(z-1)*0.6,oxf=S*(F[0]-F[0]*zf),oyf=S*(F[1]-F[1]*zf);
 X.setTransform(zf/1.18,0,0,zf/1.18,oxf,oyf);X.drawImage(OUT,0,0);
 X.setTransform(S*zf,0,0,S*zf,oxf,oyf);townLights(t);
 X.setTransform(S*z,0,0,S*z,ox,oy);snowOut(t);
 X.setTransform(z/1.18,0,0,z/1.18,ox,oy);X.drawImage(ROOM,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);frost();fairy(t);lamp(t);mugs(t);X.save();X.translate(560,1432);X.scale(0.87,0.87);X.translate(-560,-1432);himBody(t);himHead(t);her(t);himArm(t);X.restore();suitcase();
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);};
draw(0);
