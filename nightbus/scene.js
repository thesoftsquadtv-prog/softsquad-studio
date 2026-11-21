// safe space after dark — "text me when you get home". POV: the window seat of a night bus in the rain. Her phone in her
// left hand (thumb on the left edge, fingertips curled round the right edge). The city slides past as soft bokeh behind
// a rain-beaded window. 1.3 s: he's typing… 2.4 s: "text me when you get home 🤍". 6.4–8.4 s: her thumb reaches over,
// double-taps the bubble, a 🤍 reaction pops on it. 10.4 s: he's typing… 11.4 s: "i'll wait up 🌙". Caption hook up
// front ("six words that make me feel safe"), closing line from 12.4 s ("someone's waiting up for me").
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
const back=u=>{u=clamp(u,0,1);const c=1.7;return 1+(c+1)*Math.pow(u-1,3)+c*Math.pow(u-1,2)};
function off(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}
const SK='#b57d5b',SK_SH='#8a573c',SK_LT='#cf9a76',NAIL='#e8c6b4';
const PH={cx:550,cy:1385,w:500,h:1030,rot:-0.05};   // phone (centre, size, tilt)
const T_IN=2.4,T_TAP=[7.05,7.32],T_REPLY=11.4;
let CITY=null,DROPS=null;
// ---------- outside: the city at night, out of focus, sliding past ----------
function buildCity(){const [c,q]=off(3600,1500);const r=rng(4);   // a long strip of blurred buildings + windows, scrolled
 q.fillStyle='#120f20';q.fillRect(0,0,3600,1500);
 q.filter='blur(18px)';
 for(let i=0;i<40;i++){const x=r()*3600,w=120+r()*260,h=300+r()*900;q.fillStyle=['#1c1830','#221c36','#181628'][i%3];q.fillRect(x,1500-h,w,h);
  for(let k=0;k<26;k++){if(r()<0.45)continue;q.fillStyle=r()<0.8?'rgba(255,196,120,.55)':'rgba(170,200,255,.45)';q.fillRect(x+10+r()*(w-30),1500-h+20+r()*(h-60),16,22);}}
 // shop fronts glowing at street level
 for(let i=0;i<22;i++){const x=r()*3600;q.fillStyle=['rgba(255,150,120,.5)','rgba(255,210,140,.55)','rgba(150,220,200,.4)','rgba(240,130,190,.45)'][i%4];q.fillRect(x,1250+r()*80,140+r()*160,90+r()*60);}
 q.filter='none';
 // wrap the seam so the strip scrolls without a join
 const [c2,q2]=off(3600,1500);q2.drawImage(c,0,0);q2.globalAlpha=1;q2.drawImage(c,0,0,300,1500,3300,0,300,1500);CITY=c2;}
const RB=rng(17);const BOKEH=[...Array(70)].map(()=>({x:RB(),y:RB(),z:RB(),c:['255,200,130','255,170,110','255,120,100','150,210,255','255,225,170','140,235,180','240,150,210'][(RB()*7)|0],ph:RB()*6.28}));
function outside(t){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b0a18');g.addColorStop(0.5,'#161328');g.addColorStop(1,'#0e0c18');X.fillStyle=g;X.fillRect(0,0,W,H);
 const sx=(t*260)%3300;X.globalAlpha=0.9;X.drawImage(CITY,sx,0,1080/0.75,1500,0,180,1080,1125);X.drawImage(CITY,sx,0,1080/0.75,1500,0,180,1080,1125);X.globalAlpha=1;
 {const rd=X.createLinearGradient(0,1080,0,1420);rd.addColorStop(0,'rgba(14,12,24,0)');rd.addColorStop(0.5,'rgba(14,12,24,.7)');rd.addColorStop(1,'rgba(14,12,24,1)');X.fillStyle=rd;X.fillRect(0,1080,W,H-1080);
  // wet road below: streaks of reflected light, smeared by the motion
  X.save();X.globalCompositeOperation='lighter';for(const b of BOKEH){if(b.z<0.4)continue;const sp=120+b.z*520,span=W+400;const x=((b.x*span-t*sp)%span+span)%span-200;const rg=X.createLinearGradient(0,1300,0,1700);rg.addColorStop(0,`rgba(${b.c},0)`);rg.addColorStop(0.25,`rgba(${b.c},.055)`);rg.addColorStop(1,`rgba(${b.c},0)`);X.fillStyle=rg;X.fillRect(x-14-b.z*20,1300,28+b.z*40,400);}X.restore();}
 // street lights, traffic lights and car lights as soft bokeh discs drifting past (nearer = bigger, faster)
 X.save();X.globalCompositeOperation='lighter';
 for(const b of BOKEH){const sp=120+b.z*520,span=W+400;const x=((b.x*span-t*sp)%span+span)%span-200,y=260+b.y*1200,r=26+b.z*80;const a=(0.10+0.2*(1-b.z))*(0.85+0.15*Math.sin(t*2+b.ph));
  const gg=X.createRadialGradient(x,y,r*0.2,x,y,r);gg.addColorStop(0,`rgba(${b.c},${a*0.7})`);gg.addColorStop(0.85,`rgba(${b.c},${a})`);gg.addColorStop(1,`rgba(${b.c},0)`);X.fillStyle=gg;X.beginPath();X.arc(x,y,r,0,6.28);X.fill();}
 X.restore();}
// ---------- the window glass: beads of rain, a few running back with the bus's motion, mist low down ----------
function buildDrops(){const [c,q]=off(1440,2560);q.scale(S,S);const r=rng(23);
 for(let i=0;i<520;i++){const x=r()*W,y=r()*H,rr=1.5+Math.pow(r(),3)*9;
  q.fillStyle='rgba(10,8,20,.35)';q.beginPath();q.ellipse(x+rr*0.15,y+rr*0.2,rr,rr*1.05,0,0,6.28);q.fill();
  const g=q.createRadialGradient(x-rr*0.3,y-rr*0.35,0,x,y,rr);g.addColorStop(0,'rgba(255,255,255,.32)');g.addColorStop(0.4,'rgba(200,190,230,.08)');g.addColorStop(1,'rgba(255,220,190,.18)');q.fillStyle=g;q.beginPath();q.arc(x,y,rr,0,6.28);q.fill();}
 DROPS=c;}
const RS=rng(41);const RUN=[...Array(6)].map(()=>({x:RS(),y:RS(),s:RS(),ph:RS()}));
function glass(t){X.drawImage(DROPS,0,0,1440,2560,0,0,W,H);
 for(const d of RUN){const span=W+300,p=((d.ph+t*(0.08+d.s*0.12))%1);const x=W+100-p*span,y=200+d.y*1300+p*40*(d.s+0.3);const rr=3+d.s*5;
  X.lineCap='round';for(let k=0;k<10;k++){const ax=x+k*14,ay=y-k*0.9+Math.sin(k*0.8+d.ph*9)*2,bx=x+(k+1)*14,by=y-(k+1)*0.9+Math.sin((k+1)*0.8+d.ph*9)*2;X.strokeStyle=`rgba(225,220,245,${0.24*(1-k/10)})`;X.lineWidth=rr*1.1*(1-k/11);X.beginPath();X.moveTo(ax,ay);X.lineTo(bx,by);X.stroke();}
  const g=X.createRadialGradient(x-rr*0.3,y-rr*0.3,0,x,y,rr);g.addColorStop(0,'rgba(255,255,255,.7)');g.addColorStop(1,'rgba(220,210,240,.2)');X.fillStyle=g;X.beginPath();X.arc(x,y,rr,0,6.28);X.fill();}
 const m=X.createLinearGradient(0,H*0.62,0,H);m.addColorStop(0,'rgba(190,180,215,0)');m.addColorStop(1,'rgba(190,180,215,.16)');X.fillStyle=m;X.fillRect(0,H*0.62,W,H*0.38);}
// the window pillar on the left and the rubber seal; dim bus interior light on it
function frame(){const g=X.createLinearGradient(0,0,86,0);g.addColorStop(0,'#2a2733');g.addColorStop(0.7,'#3a3644');g.addColorStop(1,'#1d1b24');X.fillStyle=g;X.fillRect(0,0,74,H);
 X.fillStyle='#141218';X.fillRect(70,0,14,H);X.fillStyle='rgba(255,255,255,.06)';X.fillRect(8,0,4,H);}
// ---------- the phone ----------
const MSG=[ // [side(0 his,1 hers), text, appearAt]
 [1,'leaving now 🚌',-1],[0,'is it raining where you are?',-1],[1,'pouring 🌧️ bus is taking forever',-1],
 [0,'text me when you get home 🤍',T_IN],[0,"i'll wait up 🌙",T_REPLY]];
function wrapText(q,s,maxW){const words=s.split(' ');const lines=[];let cur='';for(const w of words){const tst=cur?cur+' '+w:w;if(q.measureText(tst).width>maxW&&cur){lines.push(cur);cur=w;}else cur=tst;}if(cur)lines.push(cur);return lines;}
function screen(t,q){const SW=PH.w-32,SH=PH.h-32;
 q.fillStyle='#0f0e14';q.fillRect(0,0,SW,SH);
 // status bar + header
 q.fillStyle='#e9e6f2';q.font='600 22px Inter';q.textBaseline='middle';q.textAlign='left';q.fillText('23:47',40,34);q.textAlign='right';q.fillText('▮▮▮  82%',SW-40,34);
 q.fillStyle='#17161e';q.fillRect(0,62,SW,104);q.fillStyle='rgba(255,255,255,.06)';q.fillRect(0,165,SW,1);
 q.fillStyle='#b9a7e6';q.font='400 44px Inter';q.textAlign='left';q.fillText('‹',26,112);
 const av=q.createLinearGradient(80,80,140,140);av.addColorStop(0,'#8f7bd0');av.addColorStop(1,'#d58fae');q.fillStyle=av;q.beginPath();q.arc(104,112,30,0,6.28);q.fill();
 q.fillStyle='#fff';q.font='600 28px Inter';q.textAlign='center';q.fillText('S',104,113);
 q.textAlign='left';q.fillStyle='#f3f0fa';q.font='600 30px Inter';q.fillText('Sam 🤍',150,100);
 const typingHim=(t>1.3&&t<T_IN)||(t>10.4&&t<T_REPLY);q.fillStyle='#9a96aa';q.font='400 21px Inter';q.fillText(typingHim?'typing…':'online',150,132);
 // messages, bottom-aligned above the input bar; newer ones push the older ones up smoothly
 q.font='400 31px Inter';const maxW=SW*0.64,padX=24,padY=16,lh=40,gap=14;
 const shown=MSG.filter(m=>m[2]<0||t>=m[2]);
 const items=shown.map(m=>{const lines=wrapText(q,m[1],maxW);const w=Math.max(...lines.map(l=>q.measureText(l).width))+padX*2;const h=lines.length*lh+padY*2;return {m,lines,w,h};});
 let typingH=0;const tyOn=(t>1.3&&t<T_IN)?clamp((t-1.3)/0.25,0,1):(t>10.4&&t<T_REPLY)?clamp((t-10.4)/0.25,0,1):0;if(tyOn>0)typingH=(66+gap)*tyOn;
 let y=SH-112-typingH;const rx0=clamp((t-T_TAP[1])/0.3,0,1)*34;
 for(let i=items.length-1;i>=0;i--){const it=items[i],m=it.m;let k=1;if(m[2]>=0)k=back((t-m[2])/0.35);const hh=(it.h+gap)*clamp((t-m[2])/0.25,0,1);
  const yy=y-it.h;const x=m[0]?SW-24-it.w:24;
  q.save();q.globalAlpha=clamp(m[2]<0?1:(t-m[2])/0.15,0,1);q.translate(x+(m[0]?it.w:0),yy+it.h);q.scale(k,k);q.translate(-(x+(m[0]?it.w:0)),-(yy+it.h));
  if(m[0]){const bg=q.createLinearGradient(x,yy,x+it.w,yy+it.h);bg.addColorStop(0,'#8a75cf');bg.addColorStop(1,'#a77fc4');q.fillStyle=bg;}else q.fillStyle='#2a2833';
  q.beginPath();q.roundRect(x,yy,it.w,it.h,[30,30,m[0]?8:30,m[0]?30:8]);q.fill();
  q.fillStyle='#f6f3fb';q.textAlign='left';q.textBaseline='middle';it.lines.forEach((l,j)=>q.fillText(l,x+padX,yy+padY+lh*0.5+j*lh+1));
  // the heart reaction she double-taps onto his message
  if(m[1].startsWith('text me')&&t>T_TAP[1]+0.05){const rk=back((t-T_TAP[1]-0.05)/0.4);const rx=x+it.w-6,ry=yy-4;q.save();q.translate(rx,ry);q.scale(rk,rk);
   q.fillStyle='#3a3745';q.beginPath();q.arc(0,0,27,0,6.28);q.fill();q.strokeStyle='#0f0e14';q.lineWidth=4;q.stroke();q.font='28px "Noto Color Emoji"';q.textAlign='center';q.fillText('🤍',0,2);q.restore();}
  q.restore();
  y-=(m[2]<0?it.h+gap:hh)+(m[1].startsWith('text me')?rx0:0);
  if(i==items.length-1&&m[1].startsWith("i'll")){}
 }
 // typing indicator bubble (his side)
 if(tyOn>0){const yy=SH-112-66*tyOn;q.save();q.globalAlpha=tyOn;q.fillStyle='#2a2833';q.beginPath();q.roundRect(24,yy,110,62,[30,30,30,8]);q.fill();
  for(let k=0;k<3;k++){const b=Math.max(0,Math.sin(t*7-k*0.9));q.fillStyle=`rgba(230,226,240,${0.45+0.5*b})`;q.beginPath();q.arc(54+k*25,yy+31-b*5,7,0,6.28);q.fill();}q.restore();}
 // read receipt under her last message is implied; input bar
 q.fillStyle='#17161e';q.fillRect(0,SH-96,SW,96);q.fillStyle='#24222c';q.beginPath();q.roundRect(80,SH-78,SW-170,58,29);q.fill();
 q.fillStyle='#6f6b80';q.font='400 26px Inter';q.textAlign='left';q.fillText('message',106,SH-48);
 q.fillStyle='#b9a7e6';q.font='400 38px Inter';q.textAlign='center';q.fillText('+',42,SH-48);
 q.fillStyle='#8a75cf';q.beginPath();q.arc(SW-48,SH-49,26,0,6.28);q.fill();q.fillStyle='#fff';q.beginPath();q.moveTo(SW-48,SH-62);q.lineTo(SW-38,SH-48);q.lineTo(SW-58,SH-48);q.closePath();q.fill();q.fillRect(SW-51,SH-50,6,14);
 // a soft ring where her thumb taps
 for(const tt of T_TAP){const d=t-tt;if(d>0&&d<0.45){q.strokeStyle=`rgba(255,255,255,${0.35*(1-d/0.45)})`;q.lineWidth=3;q.beginPath();q.arc(TAPPT[0],TAPPT[1],14+d*90,0,6.28);q.stroke();}}}
let TAPPT=[150,820];
const SCR=off(1,1);
function phoneMotion(t){return {dx:3*Math.sin(t*0.9)+1.2*Math.sin(t*2.3),dy:2.5*Math.sin(t*1.3)+0.8*Math.sin(t*7.1)*Math.max(0,Math.sin(t*0.7)),rot:PH.rot+0.006*Math.sin(t*0.8)};}
// thumb: base fixed in the palm below the phone's lower-left corner; the tip rests on the left edge, then reaches to tap
function thumbTip(t){const rest=[-246,284],reach=[-92,322];let u=ease((t-6.4)/0.6)*(1-ease((t-7.8)/0.6));
 let press=0;for(const tt of T_TAP){const d=t-tt;if(d>-0.08&&d<0.12)press=Math.max(press,1-Math.abs(d-0.02)/0.1);}
 return {x:lerp(rest[0],reach[0],u),y:lerp(rest[1],reach[1],u)+press*4,u,press};}
function hand(t,front){// coordinates local to the phone centre (before rotation)
 const hw=PH.w/2,hh=PH.h/2;
 if(!front){// fingers curled round the right edge, from behind: index, middle, ring; little finger under the bottom corner
  // one continuous hand mass behind the phone: four fingers side by side, curling round the right edge (index on top,
  // biggest; little finger smallest and lowest), darker where they go behind the phone
  const F=[[34,98,58,0.42],[128,96,64,0.36],[218,90,58,0.30],[298,72,44,0.24]];   // centre y, width, reach past edge, tilt
  const x0=hw-4;const P=new Path2D();P.moveTo(x0-30,F[0][0]-F[0][1]/2-10);
  for(const [fy,fw,fl,rt] of F){const ty=fy+Math.sin(rt)*fl*0.5;P.lineTo(x0+fl*0.55,fy-fw/2+4);P.bezierCurveTo(x0+fl+2,fy-fw/2+10,x0+fl+6,ty-4,x0+fl,ty+fw*0.16);P.bezierCurveTo(x0+fl-6,fy+fw/2-6,x0+fl*0.6,fy+fw/2-2,x0+fl*0.45,fy+fw/2);}
  P.lineTo(x0-30,F[3][0]+F[3][1]/2+16);P.closePath();
  const g=X.createLinearGradient(x0,0,x0+70,0);g.addColorStop(0,'#5e3826');g.addColorStop(0.35,SK_SH);g.addColorStop(0.75,SK);g.addColorStop(1,SK_LT);X.fillStyle=g;X.fill(P);
  X.save();X.clip(P);
  for(let i=0;i<F.length;i++){const [fy,fw,fl,rt]=F[i];
   // crease between this finger and the next, soft shadow under each finger
   const yb=fy+fw/2;X.strokeStyle='rgba(60,30,18,.6)';X.lineWidth=2.5;X.beginPath();X.moveTo(x0-10,yb-6);X.quadraticCurveTo(x0+fl*0.4,yb,x0+fl*0.62,yb-4);X.stroke();
   const sh=X.createLinearGradient(0,yb-26,0,yb);sh.addColorStop(0,'rgba(60,30,18,0)');sh.addColorStop(1,'rgba(60,30,18,.3)');X.fillStyle=sh;X.fillRect(x0-10,yb-26,fl+20,26);
   // a joint crease where the finger bends round the edge
   X.strokeStyle='rgba(80,45,30,.4)';X.lineWidth=1.6;X.beginPath();X.moveTo(x0+fl*0.42,fy-fw*0.34);X.quadraticCurveTo(x0+fl*0.48,fy,x0+fl*0.42,fy+fw*0.3);X.stroke();
   // nail: just a sliver at the curled tip
   X.fillStyle='rgba(232,198,182,.75)';X.beginPath();X.moveTo(x0+fl-8,fy-fw*0.26);X.quadraticCurveTo(x0+fl+3,fy,x0+fl-2,fy+fw*0.2);X.quadraticCurveTo(x0+fl-6,fy,x0+fl-8,fy-fw*0.26);X.fill();}
  // cool screen light on the upper edges
  X.fillStyle='rgba(170,170,255,.08)';X.fillRect(x0,F[0][0]-80,90,420);
  X.restore();
  // heel of the palm under the phone, going out of frame
  const pg=X.createLinearGradient(0,hh-30,0,hh+160);pg.addColorStop(0,SK);pg.addColorStop(1,SK_SH);X.fillStyle=pg;
  X.beginPath();X.moveTo(-hw+30,hh-10);X.bezierCurveTo(-hw+60,hh+40,-60,hh+60,hw-70,hh+10);X.lineTo(hw-40,hh+200);X.lineTo(-hw-40,hh+200);X.closePath();X.fill();
  return;}
 // thumb, in front of the screen edge: a tapered digit from the thenar pad to the tip, nail on top, screen-lit edge
 const tp=thumbTip(t);const bx=-hw-70,by=hh+110;const ang=Math.atan2(tp.y-by,tp.x-bx),L=Math.hypot(tp.x-bx,tp.y-by);
 X.save();X.translate(bx,by);X.rotate(ang);
 const tg=X.createLinearGradient(0,-60,0,60);tg.addColorStop(0,SK_LT);tg.addColorStop(0.5,SK);tg.addColorStop(1,SK_SH);X.fillStyle=tg;
 X.beginPath();X.moveTo(-60,-110);X.bezierCurveTo(L*0.35,-78,L*0.7,-50,L-30,-44);X.bezierCurveTo(L+12,-40,L+26,-6,L+20,14);X.bezierCurveTo(L+12,40,L-30,46,L*0.6,52);X.bezierCurveTo(L*0.3,62,40,110,-60,140);X.closePath();X.fill();
 // knuckle crease and the soft pad shadow
 X.strokeStyle='rgba(90,50,32,.35)';X.lineWidth=2.5;X.beginPath();X.moveTo(L*0.58,-46);X.quadraticCurveTo(L*0.6,0,L*0.57,48);X.stroke();
 X.strokeStyle='rgba(90,50,32,.25)';X.lineWidth=2;X.beginPath();X.moveTo(L*0.62,-40);X.quadraticCurveTo(L*0.645,0,L*0.61,44);X.stroke();
 // nail
 const ng=X.createLinearGradient(L-70,0,L+10,0);ng.addColorStop(0,'#d9ab95');ng.addColorStop(1,NAIL);X.fillStyle=ng;X.beginPath();X.moveTo(L-74,-26);X.bezierCurveTo(L-20,-32,L+8,-24,L+8,-2);X.bezierCurveTo(L+8,20,L-20,28,L-74,22);X.quadraticCurveTo(L-84,-2,L-74,-26);X.fill();
 X.fillStyle='rgba(255,255,255,.28)';X.beginPath();X.ellipse(L-30,-12,26,5,0,0,6.28);X.fill();
 X.strokeStyle='rgba(120,70,50,.35)';X.lineWidth=1.5;X.beginPath();X.moveTo(L-74,-26);X.quadraticCurveTo(L-84,-2,L-74,22);X.stroke();
 {const cg=X.createLinearGradient(0,-80,0,20);cg.addColorStop(0,'rgba(165,165,255,.16)');cg.addColorStop(1,'rgba(165,165,255,0)');X.fillStyle=cg;X.beginPath();X.moveTo(-60,-110);X.bezierCurveTo(L*0.35,-78,L*0.7,-50,L-30,-44);X.bezierCurveTo(L+12,-40,L+26,-6,L+20,14);X.lineTo(-60,14);X.closePath();X.fill();}
 // cool screen light along the inner edge
 X.strokeStyle=`rgba(200,195,255,${0.25+0.15*tp.u})`;X.lineWidth=3;X.beginPath();X.moveTo(L*0.3,-74);X.bezierCurveTo(L*0.55,-52,L-60,-46,L-30,-44);X.stroke();
 X.restore();}
function phone(t){const m=phoneMotion(t);const hw=PH.w/2,hh=PH.h/2;
 X.save();X.translate(PH.cx+m.dx,PH.cy+m.dy);X.rotate(m.rot);
 hand(t,false);
 // body: thin dark aluminium edge, rounded corners, a hint of side thickness on the right
 X.fillStyle='#0a0a0e';X.beginPath();X.roundRect(-hw+3,-hh+6,PH.w,PH.h,64);X.fill();
 const eg=X.createLinearGradient(-hw,0,hw,0);eg.addColorStop(0,'#3b3a44');eg.addColorStop(0.5,'#1a1a20');eg.addColorStop(1,'#4a4854');X.fillStyle=eg;X.beginPath();X.roundRect(-hw,-hh,PH.w,PH.h,64);X.fill();
 X.fillStyle='#050507';X.beginPath();X.roundRect(-hw+8,-hh+8,PH.w-16,PH.h-16,58);X.fill();
 // screen
 const [sc,sq]=SCR;const SW=PH.w-32,SHh=PH.h-32;if(sc.width!=SW*2){sc.width=SW*2;sc.height=SHh*2;}
 sq.setTransform(2,0,0,2,0,0);TAPPT=[thumbTip(7.1).x+hw-16+8,thumbTip(7.1).y+hh-16-18];screen(t,sq);
 X.save();X.beginPath();X.roundRect(-hw+16,-hh+16,SW,SHh,50);X.clip();X.drawImage(sc,-hw+16,-hh+16,SW,SHh);
 // glass sheen
 const gl=X.createLinearGradient(-hw,-hh,hw,hh);gl.addColorStop(0,'rgba(255,255,255,.06)');gl.addColorStop(0.4,'rgba(255,255,255,0)');gl.addColorStop(1,'rgba(255,255,255,.02)');X.fillStyle=gl;X.fillRect(-hw,-hh,PH.w,PH.h);
 X.restore();
 // camera notch pill
 X.fillStyle='#000';X.beginPath();X.roundRect(-58,-hh+30,116,34,17);X.fill();
 hand(t,true);
 X.restore();
 // the screen's glow spilling on the glass and pillar
 const gg=X.createRadialGradient(PH.cx,PH.cy,200,PH.cx,PH.cy,820);gg.addColorStop(0,'rgba(170,160,230,.10)');gg.addColorStop(1,'rgba(170,160,230,0)');X.fillStyle=gg;X.fillRect(0,0,W,H);}
// ---------- grade + caption ----------
function grade(t){const v=X.createRadialGradient(540,1050,380,540,1050,1250);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,4,14,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.035;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function heartIcon(x,y,s,a){X.save();X.globalAlpha=a;X.fillStyle='#fbe4ea';X.beginPath();X.moveTo(x,y+s*0.8);X.bezierCurveTo(x-s*1.2,y-s*0.1,x-s*0.6,y-s*0.95,x,y-s*0.35);X.bezierCurveTo(x+s*0.6,y-s*0.95,x+s*1.2,y-s*0.1,x,y+s*0.8);X.fill();X.restore();}
function caption(t){
 const a=Math.min(1,0.55+t/0.9)*clamp((6.6-t)/1.2,0,1);
 if(a>0){X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*3,y=330;const bl=Math.max(0,(t-5.6)*1.5);if(bl>0)X.filter=`blur(${bl}px)`;
  X.font="italic 500 72px Corm, serif";X.shadowColor='rgba(200,170,255,.65)';X.shadowBlur=30;X.fillStyle='#f6f2fb';
  for(let k=0;k<2;k++){X.fillText('six words that',x,y);X.fillText('make me feel safe',x-24,y+88);X.shadowBlur=0;}
  X.filter='none';const tw=X.measureText('make me feel safe').width;X.restore();heartIcon(x-24+tw/2+34,y+84,17,a);}
 const b=clamp((t-12.4)/1.3,0,1);
 if(b>0){X.save();X.globalAlpha=b;X.textAlign='center';X.textBaseline='middle';const x=540,y=380-b*10;X.font="italic 500 76px Corm, serif";X.shadowColor='rgba(255,180,210,.6)';X.shadowBlur=30;X.fillStyle='#fbeef3';
  for(let k=0;k<2;k++){X.fillText("someone's waiting",x,y);X.fillText('up for me',x-22,y+90);X.shadowBlur=0;}const tw=X.measureText('up for me').width;X.restore();heartIcon(x-22+tw/2+34,y+86,18,b);}}
window.draw=function(t){if(!CITY){buildCity();buildDrops();}
 const z=1+0.035*ease(t/16),F=[540,1150],ox=S*(F[0]-F[0]*z),oy=S*(F[1]-F[1]*z);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 const zf=1+(z-1)*0.4,oxf=S*(F[0]-F[0]*zf),oyf=S*(F[1]-F[1]*zf);
 X.setTransform(S*zf,0,0,S*zf,oxf,oyf);outside(t);glass(t);frame();
 X.setTransform(S*z,0,0,S*z,ox,oy);phone(t);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);};
draw(0);
