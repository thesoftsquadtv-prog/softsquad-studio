// safe space after dark — "he's almost home" (sequel to the hoodie night). Design space 1080x1920, rendered 1440x2560.
// Same window seat, 6:04 am. The rain has stopped and dawn is coming up over the town; she never went to bed and is still in
// his oversized grey hoodie, the lamp and fairy lights still on from the night. At 2.4 s the phone on the ledge lights:
// "him ♥ just landed / 20 min away" and she turns to it; at 11.0 s a second one: "still in my hoodie?". The sun's rim
// clears the hills at ~9 s and warm light grows through the glass.
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
function off(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}

const SK='#e0b394',SK_SH='#b08062',SK_LT='#efc8ab',HAIR='#3a261c',HAIR_L='#6a4834';
const WIN={x0:150,x1:930,y0:196,y1:1176,tr:520,mul:540,fw:26};   // window opening, transom y, mullion x, frame width
const LEDGE=1176, SEAT_BACK=1200, SEAT_FRONT=1590;

const PHONE={x:804,y:1182,w:86,h:172,lean:0.93};
const T_MSG=2.4,T_MSG2=11.0;
const SUN={x:700,y:968,r:46};const sunU=t=>ease((t-1)/13);   // the sun's disc rises from behind the hills
const breathAt=t=>Math.sin(t*2*Math.PI/4.6);
// head: follows the plane (it moves right→left), then turns to the phone when it lights up, then settles
const turnAt=t=>{let a=0;a+=3*ease(t/2);                                  // watching the sunrise, a touch to the right
 a+=9*ease((t-T_MSG-0.25)/0.8);a-=9*ease((t-6.4)/2.2);                    // turns to read the first message, back to the window
 a+=12*ease((t-T_MSG2-0.2)/0.7);a+=0.6*Math.sin(t*0.6)*ease(t/2);return a*Math.PI/180;};
const tiltAt=t=>(-3*ease(t/2)+3*ease((t-T_MSG-0.2)/0.8)-3*ease((t-6.4)/2.2)+4*ease((t-T_MSG2-0.2)/0.7))*Math.PI/180;
let OUT=null,LAND=null,ROOM=null;const SS=S*1.18;

// ---------------- outside: night sky + a little town in the rain ----------------
const LIT=[];
function skyPaint(q){const r=rng(5);
 // dawn: deep blue overhead warming to peach and gold at the horizon
 const g=q.createLinearGradient(0,WIN.y0,0,1000);g.addColorStop(0,'#34407a');g.addColorStop(0.35,'#5a5a92');g.addColorStop(0.62,'#a66f8e');g.addColorStop(0.82,'#e8a08a');g.addColorStop(1,'#f8c98e');q.fillStyle=g;q.fillRect(0,0,W,1300);
 // the last few stars, only high up
 // soft clouds left over from the rain: blurred, lit pink from below
 q.save();q.filter='blur(24px)';for(let i=0;i<14;i++){const x=r()*W,y=330+r()*420,rw=110+r()*190;const warm=clamp((y-330)/420,0,1);
  q.fillStyle=`rgba(${lerp(110,240,warm)|0},${lerp(95,150,warm)|0},${lerp(150,140,warm)|0},${0.16+r()*0.16})`;q.beginPath();q.ellipse(x,y,rw,rw*0.26,0,0,6.28);q.fill();}q.restore();}
function landPaint(q){const r=rng(9);
 // far hills, cool violet in the backlight, with a rim of dawn along the top
 const hill=x=>960-28*Math.sin(x*0.004+1)-14*Math.sin(x*0.013);
 q.fillStyle='#4a3d63';q.beginPath();q.moveTo(0,980);for(let x=0;x<=W;x+=20)q.lineTo(x,hill(x));q.lineTo(W,1300);q.lineTo(0,1300);q.fill();
 q.strokeStyle='rgba(255,200,150,.35)';q.lineWidth=2;q.beginPath();for(let x=0;x<=W;x+=20)x?q.lineTo(x,hill(x)):q.moveTo(x,hill(x));q.stroke();
 for(let i=0;i<14;i++){q.fillStyle='rgba(255,220,170,.45)';q.fillRect(r()*W,958+r()*36,2,2);}
 // rooftops: backlit silhouettes; only a few early kitchens lit
 const row=(base,hmin,hmax,col,wcol,depth,pl)=>{for(let x=-40;x<W+40;){const w=110+r()*120,h=hmin+r()*(hmax-hmin),pk=40+r()*40;
   q.fillStyle=col;q.beginPath();q.moveTo(x,base);q.lineTo(x,base-h);q.lineTo(x+w/2,base-h-pk);q.lineTo(x+w,base-h);q.lineTo(x+w,base);q.fill();
   if(r()<0.6){const cx=x+w*(0.2+r()*0.5);q.fillRect(cx,base-h-pk*0.7-30,16,40);q.fillStyle='rgba(0,0,0,.2)';q.fillRect(cx-2,base-h-pk*0.7-32,20,5);}
   q.strokeStyle='rgba(255,200,150,.28)';q.lineWidth=2;q.beginPath();q.moveTo(x+w/2,base-h-pk);q.lineTo(x,base-h);q.stroke();
   for(let k=0;k<3;k++){if(r()<pl){const wx=x+14+k*(w-40)/2.4,wy=base-h+18+r()*20,ww=18*depth,wh=24*depth;LIT.push([wx,wy,ww,wh,r()]);q.fillStyle=wcol;q.fillRect(wx,wy,ww,wh);
     q.fillStyle='rgba(60,40,40,.6)';q.fillRect(wx+ww/2-1,wy,2,wh);q.fillRect(wx,wy+wh/2-1,ww,2);}else r();}
   x+=w+2+r()*6;}};
 row(1080,40,90,'#56476e','rgba(255,206,140,.7)',0.8,0.12);
 row(1190,70,130,'#2c243c','rgba(255,196,130,.85)',1.0,0.16);
 const st=q.createLinearGradient(0,1150,0,1190);st.addColorStop(0,'rgba(255,200,150,0)');st.addColorStop(1,'rgba(255,200,150,.18)');q.fillStyle=st;q.fillRect(0,1150,W,40);}

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

function buildStatic(){const mk=f=>{const [c,q]=off(W*SS|0,H*SS|0);q.scale(SS,SS);f(q);return c;};OUT=mk(skyPaint);LAND=mk(landPaint);ROOM=mk(roomPaint);}

// ---------------- animated: outside ----------------
function townLights(t){for(const [x,y,w,h,ph] of LIT){if(ph<0.86)continue;const k=0.5+0.5*Math.sin(t*2*Math.PI/8+ph*20);X.fillStyle=`rgba(255,${190+20*k|0},140,${0.2*k})`;X.fillRect(x,y,w,h);}}
// the sun: a soft-edged disc rising behind the hills (drawn between sky and land layers), with a broad glow that grows
const RS=rng(3);const STARS=[...Array(22)].map(()=>[RS()*W,200+RS()*160,RS()*1.1+0.3,0.15+RS()*0.35]);
function sunrise(t){const fa=1-ease((t-2)/8);if(fa>0)for(const [x,y,r,a] of STARS){X.globalAlpha=a*fa;X.fillStyle='#e6ecff';X.beginPath();X.arc(x,y,r,0,6.28);X.fill();}X.globalAlpha=1;
 const u=sunU(t),x=SUN.x,y=SUN.y+SUN.r*1.1-u*SUN.r*1.5;
 const gl=X.createRadialGradient(x,y,SUN.r*0.6,x,y,520);gl.addColorStop(0,`rgba(255,214,150,${0.30+0.35*u})`);gl.addColorStop(0.4,`rgba(255,180,130,${0.10+0.16*u})`);gl.addColorStop(1,'rgba(255,170,130,0)');
 X.fillStyle=gl;X.fillRect(x-540,y-540,1080,1080);
 const d=X.createRadialGradient(x,y,0,x,y,SUN.r);d.addColorStop(0,'rgba(255,250,228,1)');d.addColorStop(0.8,'rgba(255,232,180,1)');d.addColorStop(1,'rgba(255,214,150,0)');
 X.fillStyle=d;X.beginPath();X.arc(x,y,SUN.r,0,6.28);X.fill();}
const R1=rng(31);const RAIN=[...Array(120)].map(()=>({x:R1(),p:R1(),s:0.9+R1()*0.6,l:14+R1()*22}));
function rainOut(t){X.save();X.beginPath();X.rect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0);X.clip();X.strokeStyle='rgba(200,210,240,.10)';X.lineWidth=1.2;
 for(const d of RAIN){const y=WIN.y0+((d.p+t*d.s*0.9)%1)*(WIN.y1-WIN.y0),x=WIN.x0+d.x*(WIN.x1-WIN.x0)-(y-WIN.y0)*0.08;X.beginPath();X.moveTo(x,y);X.lineTo(x-d.l*0.12,y+d.l);X.stroke();}X.restore();}
// drops on the glass: static beads + a few running drops (each runs then re-forms higher up)
const R2=rng(44);const BEADS=[...Array(260)].map(()=>({x:WIN.x0+R2()*(WIN.x1-WIN.x0),y:WIN.y0+R2()*(WIN.y1-WIN.y0),r:1.2+R2()*R2()*4.5}));
const RUN=[...Array(14)].map(()=>({x:WIN.x0+40+R2()*(WIN.x1-WIN.x0-80),p:R2(),T:4+R2()*6,r:2.6+R2()*1.8,w:R2()*6.28}));
function glassDrops(t){X.save();X.beginPath();X.rect(WIN.x0+WIN.fw,WIN.y0+WIN.fw,WIN.x1-WIN.x0-2*WIN.fw,WIN.y1-WIN.y0-2*WIN.fw);X.clip();
 const bead=(x,y,r,a)=>{X.fillStyle=`rgba(200,205,235,${0.10*a})`;X.beginPath();X.ellipse(x,y,r,r*1.15,0,0,6.28);X.fill();X.fillStyle=`rgba(255,205,160,${0.26*a})`;X.beginPath();X.ellipse(x,y+r*0.45,r*0.6,r*0.4,0,0,6.28);X.fill();X.fillStyle=`rgba(255,255,255,${0.55*a})`;X.beginPath();X.arc(x-r*0.3,y-r*0.35,Math.max(0.6,r*0.28),0,6.28);X.fill();};
 for(const b of BEADS)bead(b.x,b.y,b.r*0.85,0.6);
 for(const d of RUN.slice(0,0)){const u=((t/d.T)+d.p)%1;const y=WIN.y0+40+ease(u)*(WIN.y1-WIN.y0-80),x=d.x+Math.sin(u*9+d.w)*5;const a=Math.min(1,u*8,(1-u)*8);
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
function phone(t){const {x,y,w,h,lean}=PHONE;const on=clamp((t-T_MSG)/0.25,0,1)*(1-0.35*clamp((t-T_MSG-5)/1.5,0,1)+0.35*clamp((t-T_MSG2)/0.25,0,1));
 const bz=[T_MSG,T_MSG2].some(m=>t>m&&t<m+0.5&&((t-m)%0.25)<0.16)?Math.sin(t*170)*1.2:0;
 // screen glow on the ledge and the glass behind (soft gradient, never a disc)
 if(on>0){const g=X.createRadialGradient(x,y-h*0.5,10,x,y-h*0.4,190);g.addColorStop(0,`rgba(190,200,255,${0.38*on})`);g.addColorStop(1,'rgba(190,200,255,0)');X.fillStyle=g;X.fillRect(x-200,y-h-160,400,300);}
 X.save();X.translate(x+bz,y);X.rotate(0.05);X.scale(1,lean);
 X.fillStyle='rgba(0,0,0,.45)';X.beginPath();X.ellipse(4,2,w*0.55,5,0,0,6.28);X.fill();
 X.fillStyle='#1b1a22';X.beginPath();X.roundRect(-w/2,-h,w,h,11);X.fill();X.strokeStyle='rgba(255,255,255,.18)';X.lineWidth=1.2;X.stroke();
 // screen
 const sx=-w/2+4,sy=-h+10,sw=w-8,sh=h-8;
 const sg=X.createLinearGradient(0,sy,0,sy+sh);sg.addColorStop(0,`rgb(${lerp(14,56,on)|0},${lerp(14,48,on)|0},${lerp(20,92,on)|0})`);sg.addColorStop(1,`rgb(${lerp(10,120,on)|0},${lerp(10,84,on)|0},${lerp(16,120,on)|0})`);X.fillStyle=sg;X.beginPath();X.roundRect(sx,sy,sw,sh,8);X.fill();
 if(on>0){X.globalAlpha=on;X.textAlign='center';X.fillStyle='#fff';X.font='600 25px Poppins, sans-serif';X.fillText(t<T_MSG2?'6:04':'6:05',0,sy+40);X.font='9px Poppins, sans-serif';X.fillStyle='rgba(255,255,255,.8)';X.fillText('Thursday 26',0,sy+54);
  const two=t>=T_MSG2,pop=two?ease((t-T_MSG2)/0.3):1;
  if(two){X.fillStyle='rgba(255,255,255,.5)';X.beginPath();X.roundRect(sx+7,sy+111,sw-14,8,4);X.fill();}   // the earlier message stacked underneath
  X.save();X.translate(0,(1-pop)*-10);X.globalAlpha=on*pop;
  X.fillStyle='rgba(255,255,255,.9)';X.beginPath();X.roundRect(sx+3,sy+64,sw-6,52,8);X.fill();
  X.textAlign='left';X.fillStyle='#2a2438';X.font='700 12px Poppins, sans-serif';X.fillText('him',sx+9,sy+82);heart(sx+40,sy+78,4.6,1,'#e0475b');
  X.font='600 9.4px Poppins, sans-serif';X.fillStyle='#3a3448';
  if(two){X.fillText('still in my',sx+8,sy+97);X.fillText('hoodie?',sx+8,sy+109);}else{X.fillText('just landed',sx+8,sy+97);X.font='9.4px Poppins, sans-serif';X.fillText('20 min away',sx+8,sy+109);}
  X.restore();X.globalAlpha=1;}
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
 for(const s of [-1,1]){const kx=CX+s*262,ky=1404;
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
 const on=clamp((t-T_MSG)/0.25,0,1);if(on>0){const pl=X.createRadialGradient(CX+300,1120,10,CX+300,1120,240);pl.addColorStop(0,`rgba(170,185,255,${0.22*on})`);pl.addColorStop(1,'rgba(170,185,255,0)');X.fillStyle=pl;X.fillRect(CX,960,280,420);}
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
 X.save();X.translate(NECK[0],NECK[1]-2+b*0.5);X.scale(1.08,1.08);X.rotate(a*0.5);
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
 X.strokeStyle='rgba(110,76,54,.6)';X.lineWidth=1.2;for(const [x0,y0,x1,y1] of [[24,-34,40,-48],[-26,-30,-42,-40],[36,-10,52,-14]]){X.beginPath();X.moveTo(x0,y0);X.quadraticCurveTo((x0+x1)/2+4,(y0+y1)/2-6,x1,y1);X.stroke();}
 X.strokeStyle='rgba(255,180,120,.45)';X.lineWidth=2.4;X.beginPath();X.moveTo(-36,10);X.bezierCurveTo(-48,-14,-30,-40,-4,-40);X.stroke();
 X.restore();
 // hair gathered up toward the crown: soft strand lines converging upward
 X.strokeStyle='rgba(150,108,80,.09)';X.lineWidth=1.2;for(let i=0;i<9;i++){const sx=-46+i*11+((i*7)%5);X.beginPath();X.moveTo(sx*0.9,-30);X.quadraticCurveTo(sx*0.95,-100,sx*0.3,-158);X.stroke();}
 X.strokeStyle='rgba(110,76,54,.55)';X.lineWidth=1.1;for(const [x0,y0,dx,dy] of [[-48,-78,-7,32]]){X.beginPath();X.moveTo(x0,y0);X.bezierCurveTo(x0+dx*0.3,y0+dy*0.4,x0+dx+Math.sin(t*0.8+x0)*2,y0+dy*0.7,x0+dx*0.6,y0+dy);X.stroke();}
 X.strokeStyle='rgba(255,180,120,.5)';X.lineWidth=3;X.beginPath();X.moveTo(-48,-34);X.bezierCurveTo(-64,-70,-64,-140,-36,-168);X.stroke();
 X.strokeStyle=`rgba(255,196,140,${0.25+0.3*sunU(t)})`;X.lineWidth=2.5;X.beginPath();X.moveTo(42,-166);X.bezierCurveTo(66,-140,64,-70,48,-30);X.stroke();
 X.restore();}

// dawn through the glass: warm light catches the sill top and the inside edges of the frame, growing as the sun clears the hills
function dawnLight(t){const u=0.35+0.65*sunU(t);
 const g=X.createRadialGradient(SUN.x,LEDGE,20,SUN.x,LEDGE,520);g.addColorStop(0,`rgba(255,200,140,${0.32*u})`);g.addColorStop(1,'rgba(255,200,140,0)');
 X.fillStyle=g;X.beginPath();X.moveTo(WIN.x0-46,LEDGE-6);X.lineTo(WIN.x1+46,LEDGE-6);X.lineTo(WIN.x1+60,LEDGE+14);X.lineTo(WIN.x0-60,LEDGE+14);X.fill();
 const f=X.createLinearGradient(0,WIN.y0,0,WIN.y1);f.addColorStop(0,'rgba(255,190,150,0)');f.addColorStop(1,`rgba(255,196,150,${0.22*u})`);X.fillStyle=f;
 X.fillRect(WIN.x0+WIN.fw-3,WIN.tr+10,3,WIN.y1-WIN.tr-10-WIN.fw);X.fillRect(WIN.x1-WIN.fw,WIN.tr+10,3,WIN.y1-WIN.tr-10-WIN.fw);
 X.fillStyle=`rgba(255,200,150,${0.25*u})`;X.fillRect(WIN.x0+WIN.fw,WIN.y1-WIN.fw,WIN.x1-WIN.x0-2*WIN.fw,3);
 X.save();X.filter='blur(30px)';const sp=X.createLinearGradient(0,LEDGE+24,0,LEDGE+260);sp.addColorStop(0,`rgba(255,196,140,${0.22*u})`);sp.addColorStop(1,'rgba(255,196,140,0)');X.fillStyle=sp;
 X.beginPath();X.moveTo(WIN.x0+60,LEDGE+30);X.lineTo(WIN.x1-40,LEDGE+30);X.lineTo(WIN.x1+40,LEDGE+250);X.lineTo(WIN.x0+120,LEDGE+250);X.fill();X.filter='none';X.restore();}
// ---------------- grade + caption ----------------
function grade(t){const v=X.createRadialGradient(540,1000,300,540,1000,1250);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,4,14,.62)');X.fillStyle=v;X.fillRect(0,0,W,H);
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(150,110,190,.10)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.04;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function caption(t){
 const a=Math.min(1,0.55+t/0.9)*clamp((7.4-t)/1.0,0,1);
 if(a>0){X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540,y=560-t*3;
  X.font="italic 500 76px Corm, serif";X.shadowColor='rgba(90,50,90,.75)';X.shadowBlur=30;X.fillStyle='#fdf6f2';
  for(let k=0;k<2;k++){X.fillText('i waited up all night',x,y);X.fillText('in his hoodie.',x,y+90);X.shadowBlur=0;}X.restore();}
 const b=clamp((t-9.4)/1.2,0,1);
 if(b>0){X.save();X.globalAlpha=b;X.textAlign='center';X.textBaseline='middle';const x=540,y=500-b*10;X.font="italic 500 76px Corm, serif";X.shadowColor='rgba(90,50,90,.75)';X.shadowBlur=30;X.fillStyle='#fdf6f2';
  const tw=X.measureText('for thanksgiving').width;for(let k=0;k<2;k++){X.fillText("he's almost home",x,y);X.fillText('for thanksgiving',x-20,y+90);X.shadowBlur=0;}X.restore();heart(x-20+tw/2+36,y+86,18,b,'#ffd9e2');}}
// ---------------- frame ----------------
window.draw=function(t){if(!OUT)buildStatic();
 const z=1.24+0.06*ease(t/16),F=[540,840],ox=S*(F[0]-F[0]*z),oy=S*(F[1]-F[1]*z);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 const zf=1+(z-1)*0.6,oxf=S*(F[0]-F[0]*zf),oyf=S*(F[1]-F[1]*zf);   // the town is far: slight parallax
 X.setTransform(zf/1.18,0,0,zf/1.18,oxf,oyf);X.drawImage(OUT,0,0);
 X.setTransform(S*zf,0,0,S*zf,oxf,oyf);sunrise(t);X.setTransform(zf/1.18,0,0,zf/1.18,oxf,oyf);X.drawImage(LAND,0,0);
 X.setTransform(S*zf,0,0,S*zf,oxf,oyf);townLights(t);
 X.setTransform(z/1.18,0,0,z/1.18,ox,oy);X.drawImage(ROOM,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);dawnLight(t);glassDrops(t);fairy(t);lamp(t);plantR();phone(t);seatProps();head(t);hoodie(t);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);};
draw(0);
