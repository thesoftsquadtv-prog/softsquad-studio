// Soft Ambience — "snowed in". First real snow on the cottage: snow falls in three depths, smoke rises lazily,
// someone just came home (fresh footprints from the gate to the door, a snow shovel by the cleared step), they now sit at
// the window with a hot drink, the cat in the attic window follows the flakes, fairy lights twinkle under the porch.
// Every motion repeats every LOOP (20 s) so the video loops seamlessly. Needs lib.js (WINTER mode).
const HT={tx:120,ty:1440,s:0.85};
const MOON={x:250,y:520,r:40};
let SKY=null,STATIC=null;
function sky(q){
 const g=q.createLinearGradient(0,0,0,1150);g.addColorStop(0,'#0e1530');g.addColorStop(0.55,'#26304f');g.addColorStop(0.9,'#46476a');g.addColorStop(1,'#56546f');q.fillStyle=g;q.fillRect(0,0,W,1200);
 const r=rng(11);for(let i=0;i<90;i++){q.globalAlpha=0.15+r()*0.4;q.fillStyle='#e6ecff';q.beginPath();q.arc(r()*W,r()*520,r()*1.2+0.3,0,6.28);q.fill();}q.globalAlpha=1;
 const halo=q.createRadialGradient(MOON.x,MOON.y,MOON.r*0.8,MOON.x,MOON.y,MOON.r*9);halo.addColorStop(0,'rgba(220,230,255,.32)');halo.addColorStop(0.3,'rgba(200,210,240,.10)');halo.addColorStop(1,'rgba(200,210,240,0)');q.fillStyle=halo;q.fillRect(0,0,W,1200);
 const mg=q.createRadialGradient(MOON.x-12,MOON.y-12,4,MOON.x,MOON.y,MOON.r);mg.addColorStop(0,'#fbfcff');mg.addColorStop(1,'#dfe4f0');q.fillStyle=mg;q.beginPath();q.arc(MOON.x,MOON.y,MOON.r,0,6.28);q.fill();
 q.fillStyle='rgba(150,160,185,.25)';for(const [dx,dy,rr] of [[-12,-6,8],[9,11,6],[13,-13,5],[-5,15,4]]){q.beginPath();q.arc(MOON.x+dx,MOON.y+dy,rr,0,6.28);q.fill();}}
// small snowy pine (used for the far tree line)
function pine(q,x,y,h,col,snow){const w=h*0.42;for(let k=0;k<4;k++){const ty=y-h+k*h*0.22,tw=w*(0.35+k*0.22);
 q.fillStyle=col;q.beginPath();q.moveTo(x,ty);q.lineTo(x+tw,ty+h*0.3);q.lineTo(x-tw,ty+h*0.3);q.fill();
 q.fillStyle=snow;q.beginPath();q.moveTo(x,ty+1);q.lineTo(x+tw*0.55,ty+h*0.17);q.quadraticCurveTo(x,ty+h*0.2,x-tw*0.55,ty+h*0.17);q.fill();}}
function land(q){
 const r=rng(4);
 // far snowy hills with dark pines and two lit farm windows
 [['#5d6585',1030],['#4b5373',1080]].forEach(([col,base],li)=>{q.fillStyle=col;q.beginPath();q.moveTo(0,H);for(let x=0;x<=W;x+=20){q.lineTo(x,base-(Math.sin(x*0.006+li*2)*0.5+0.5)*50);}q.lineTo(W,H);q.fill();});
 for(let i=0;i<70;i++){const x=r()*W,b=1040+r()*50-(Math.sin(x*0.006)*0.5+0.5)*40;pine(q,x,b,30+r()*40,i%2?'#1c2436':'#222b40','rgba(200,210,235,.55)');}
 for(const [x,y] of [[640,1046],[690,1050]]){q.fillStyle='#ffc77a';q.fillRect(x,y,5,5);const g=q.createRadialGradient(x+2,y+2,1,x+2,y+2,18);g.addColorStop(0,'rgba(255,180,100,.4)');g.addColorStop(1,'rgba(255,180,100,0)');q.fillStyle=g;q.fillRect(x-18,y-18,40,40);}
 // the garden under fresh snow: moonlit blue-white, soft drifts, sparkle
 const gg=q.createLinearGradient(0,1090,0,H);gg.addColorStop(0,'#aab3cc');gg.addColorStop(0.5,'#8b95b3');gg.addColorStop(1,'#5f6886');q.fillStyle=gg;q.fillRect(0,1088,W,H-1088);
 for(let i=0;i<40;i++){const x=r()*W,y=1110+r()*(H-1110),k=(y-1090)/(H-1090);const rx=(90+r()*160)*(0.6+k),ry=rx*0.12;
  const g=q.createRadialGradient(x,y-ry*0.6,2,x,y,rx);g.addColorStop(0,'rgba(235,240,252,.35)');g.addColorStop(1,'rgba(235,240,252,0)');q.fillStyle=g;q.beginPath();q.ellipse(x,y,rx,ry*2,0,0,6.28);q.fill();
  q.fillStyle='rgba(40,48,80,.12)';q.beginPath();q.ellipse(x+rx*0.2,y+ry*1.4,rx*0.8,ry*0.6,0,0,6.28);q.fill();}
 for(let i=0;i<900;i++){const y=1095+Math.pow(r(),0.8)*(H-1095),k=(y-1090)/(H-1090);q.fillStyle=`rgba(255,255,255,${0.25+r()*0.5})`;q.fillRect(r()*W,y,1+k*1.5,1+k*1.5);}
 // warm light from the windows and door falling on the snow
 for(const [x,y,rx] of [[HT.tx+125*HT.s,1490,190],[HT.tx+345*HT.s,1500,170],[HT.tx+475*HT.s,1490,190]]){const g=q.createRadialGradient(x,y,10,x,y,rx);g.addColorStop(0,'rgba(255,190,120,.32)');g.addColorStop(1,'rgba(255,190,120,0)');q.fillStyle=g;q.save();q.translate(x,y);q.scale(1,0.32);q.translate(-x,-y);q.beginPath();q.arc(x,y,rx,0,6.28);q.fill();q.restore();}
 // fresh footprints from the gate up to the door: someone just came home
 const path=[[452,1960],[446,1880],[438,1800],[428,1720],[416,1650],[402,1590],[390,1535],[380,1490],[376,1462]];
 for(let i=0;i<path.length-1;i++){const [x0,y0]=path[i],[x1,y1]=path[i+1];for(let j=0;j<3;j++){const u=j/3,x=lerp(x0,x1,u),y=lerp(y0,y1,u),k=(y-1450)/500;const side=((i*3+j)%2?1:-1)*(7+k*8);
  const s=0.8+k*0.9;q.fillStyle='rgba(55,62,104,.62)';q.beginPath();q.ellipse(x+side,y,5.2*s,3.6*s,0,0,6.28);q.fill();q.beginPath();q.ellipse(x+side,y+7*s,4.2*s,2.8*s,0,0,6.28);q.fill();
  q.fillStyle='rgba(255,255,255,.4)';q.beginPath();q.ellipse(x+side,y-3*s,4.6*s,1.4*s,0,Math.PI,6.28);q.fill();}}
 }
// evergreen wreath with a red bow, firewood under snow, a snow shovel by the step
function porchBits(q){
 const {tx,ty,s}=HT;
 const dx=tx+(240+60)*s,dy=ty-210*s*0.62;
 for(let k=0;k<26;k++){const a=k/26*6.28;q.fillStyle=['#2c4a34','#3b5e42','#24402d'][k%3];q.beginPath();q.ellipse(dx+Math.cos(a)*18,dy+Math.sin(a)*18,8,4.5,a+1.6,0,6.28);q.fill();}
 for(let k=0;k<6;k++){const a=k/6*6.28+0.4;q.fillStyle='#c33a33';q.beginPath();q.arc(dx+Math.cos(a)*19,dy+Math.sin(a)*19,2.6,0,6.28);q.fill();}
 q.fillStyle='rgba(235,242,255,.85)';for(let k=0;k<6;k++){const a=-2.6+k*0.28;q.beginPath();q.ellipse(dx+Math.cos(a)*19,dy+Math.sin(a)*19-3,5,2.5,a+1.6,0,6.28);q.fill();}
 q.fillStyle='#b8302e';q.beginPath();q.moveTo(dx,dy+18);q.lineTo(dx-11,dy+12);q.lineTo(dx-11,dy+24);q.closePath();q.fill();q.beginPath();q.moveTo(dx,dy+18);q.lineTo(dx+11,dy+12);q.lineTo(dx+11,dy+24);q.closePath();q.fill();
 q.beginPath();q.moveTo(dx-2,dy+19);q.lineTo(dx-7,dy+34);q.lineTo(dx-2,dy+31);q.fill();q.beginPath();q.moveTo(dx+2,dy+19);q.lineTo(dx+7,dy+34);q.lineTo(dx+2,dy+31);q.fill();
 q.fillStyle='#8e2220';q.beginPath();q.arc(dx,dy+18,3.5,0,6.28);q.fill();
 // firewood stack against the wall, left of the door, capped with snow
 const fx=tx+150*s,fy=ty;q.fillStyle='rgba(20,25,45,.35)';q.beginPath();q.ellipse(fx,fy+4,62,9,0,0,6.28);q.fill();
 for(let row=0;row<3;row++)for(let k=0;k<5-row;k++){const lx=fx-48+row*12+k*24,ly=fy-10-row*20;q.fillStyle='#5a3a26';q.beginPath();q.arc(lx,ly,11,0,6.28);q.fill();q.fillStyle='#c79a6a';q.beginPath();q.arc(lx,ly,8,0,6.28);q.fill();q.strokeStyle='rgba(110,70,40,.6)';q.lineWidth=1;q.beginPath();q.arc(lx,ly,4,0,6.28);q.stroke();}
 q.fillStyle='#e3e9f5';q.beginPath();q.moveTo(fx-48,fy-60);q.quadraticCurveTo(fx-20,fy-80,fx+4,fy-66);q.quadraticCurveTo(fx+30,fy-56,fx+8,fy-46);q.lineTo(fx-30,fy-48);q.quadraticCurveTo(fx-56,fy-44,fx-48,fy-60);q.fill();
 // snow shovel leaning against the wall right of the door (the step has been cleared)
 const sx=tx+478*s,sy=ty+2;q.save();q.translate(sx,sy);q.rotate(0.16);
 q.fillStyle='rgba(20,25,45,.3)';q.beginPath();q.ellipse(-6,4,30,5,0,0,6.28);q.fill();
 q.strokeStyle='#8a5a36';q.lineWidth=6;q.lineCap='round';q.beginPath();q.moveTo(0,-30);q.lineTo(0,-150);q.stroke();
 q.strokeStyle='#2a2a2e';q.lineWidth=5;q.beginPath();q.moveTo(-10,-152);q.lineTo(10,-152);q.stroke();
 q.fillStyle='#b8302e';q.beginPath();q.moveTo(-24,0);q.lineTo(24,0);q.lineTo(20,-36);q.lineTo(-20,-36);q.closePath();q.fill();
 q.fillStyle='rgba(0,0,0,.2)';q.fillRect(4,-34,16,34);q.fillStyle='#e8eef8';q.beginPath();q.ellipse(-2,-6,18,5,0,0,6.28);q.fill();
 q.restore();}
// big snowy spruce at the right, painted once into two layers (back boughs, front boughs) and swayed gently
const TREE={x:960,y:1640};let SP=null;const SPB={x:-330,y:-1260,w:660,h:1300};
function buildSpruce(){SP=[];const q=rng(17);
 const tiers=[];for(let k=0;k<12;k++){const u=k/11;tiers.push({y:-1150+Math.pow(u,0.92)*1030,w:(34+u*285)*(0.9+0.2*q()),th:70+u*70});}
 for(let L=0;L<2;L++){const [c,g]=off(SPB.w*1.4|0,SPB.h*1.4|0);g.scale(1.4,1.4);g.translate(-SPB.x,-SPB.y);
  if(L==0){const tg=g.createLinearGradient(-20,0,20,0);tg.addColorStop(0,'#4a3326');tg.addColorStop(1,'#1e140f');g.fillStyle=tg;g.fillRect(-18,-260,36,270);
   // dense dark inner foliage so no sky or trunk shows between the tiers
   g.fillStyle='#101c16';g.beginPath();g.moveTo(0,-1170);g.quadraticCurveTo(150,-600,250,-110);g.lineTo(-250,-110);g.quadraticCurveTo(-150,-600,0,-1170);g.fill();}
  tiers.forEach((T,k)=>{if((k%2)!==L&&L==0)return;
   const curve=x=>T.y+Math.pow(Math.abs(x)/T.w,1.6)*T.th*1.05+Math.sin(x*0.05+k*1.7)*4;
   // the bough skirt: a drooping band with a serrated, needle-tipped lower edge
   const base=['#15251d','#1a2d23','#1f3529'][k%3],lit=['#2b4a39','#30523f','#2a4636'][k%3];
   g.fillStyle=base;g.beginPath();g.moveTo(-T.w,curve(-T.w));
   for(let x=-T.w;x<=T.w;x+=6)g.lineTo(x,curve(x)-2);
   for(let x=T.w;x>=-T.w;x-=9){const d=T.th*0.95*(0.7+0.3*(1-Math.abs(x)/T.w));g.lineTo(x,curve(x)+d+(q()*16-4));g.lineTo(x-4,curve(x)+d-10-q()*6);}
   g.closePath();g.fill();
   // needles: strokes fanning down and out, lighter on the moonlit left
   for(let n=0;n<T.w*2.2;n++){const x=(q()*2-1)*T.w,y=curve(x)+q()*T.th*0.5,side=x<0?-1:1;
    g.strokeStyle=x<-T.w*0.2?lit:(q()<0.5?base:'#24402f');g.lineWidth=1.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+side*(4+q()*7),y+7+q()*9);g.stroke();}
   // shadow under the tier above
   const sh=g.createLinearGradient(0,T.y,0,T.y+40);sh.addColorStop(0,'rgba(5,10,10,.45)');sh.addColorStop(1,'rgba(5,10,10,0)');g.fillStyle=sh;g.beginPath();g.ellipse(0,T.y+16,T.w*0.6,26,0,0,6.28);g.fill();
   // snow resting along the top of the boughs: thick, lumpy, broken in places, brighter on the left
   // lumpy band of snow following each bough, with a few irregular breaks; thick near the trunk, thin at the tips
   let x=-T.w*(0.8+q()*0.15);const xe=T.w*(0.8+q()*0.15);
   while(x<xe){const len=30+q()*90,x2=Math.min(xe,x+len);
    const th=v=>(2+Math.pow(1-Math.abs(v)/T.w,1.4)*12)*(0.5+0.9*Math.abs(Math.sin(v*0.07+k*2.3)*Math.sin(v*0.19+k)));
    for(const [col,dy,sc] of [['rgba(130,145,190,.55)',5,1.05],[null,0,1]]){
     g.fillStyle=col||(x+x2<0?'#eef3fc':'#d6deee');g.beginPath();g.moveTo(x,curve(x)+dy);
     for(let v=x;v<=x2;v+=4)g.lineTo(v,curve(v)-th(v)*sc+dy+Math.sin(v*0.5+k)*1.2);
     for(let v=x2;v>=x;v-=4)g.lineTo(v,curve(v)+3+dy+Math.max(0,Math.sin(v*0.21+k*3))*5);
     g.closePath();g.fill();}
    x=x2+10+q()*40;}
   for(let c=0;c<T.w/14;c++){const cx=(q()*2-1)*T.w*0.85,cy=curve(cx)+8+q()*T.th*0.45;g.fillStyle=cx<0?'rgba(236,241,250,.9)':'rgba(205,214,234,.85)';g.beginPath();g.ellipse(cx,cy,4+q()*6,2+q()*2.5,(cx<0?-1:1)*0.3,0,6.28);g.fill();}
  });
  if(L==1){g.globalCompositeOperation='source-atop';const wg=g.createLinearGradient(-330,0,0,0);wg.addColorStop(0,'rgba(255,170,100,.16)');wg.addColorStop(1,'rgba(255,170,100,0)');g.fillStyle=wg;g.fillRect(-330,-700,330,700);g.globalCompositeOperation='source-over';}
  SP.push(c);}}
function spruce(t){if(!SP)buildSpruce();const sw=Math.sin(WK(2)*t)*0.006+Math.sin(WK(5)*t+1)*0.003;
 X.save();X.translate(TREE.x,TREE.y);
 X.fillStyle='rgba(30,36,70,.35)';X.beginPath();X.ellipse(0,6,300,34,0,0,6.28);X.fill();   // shadow on the snow
 for(let L=0;L<2;L++){X.save();X.transform(1,0,-sw*(L?1.3:1),1,0,0);X.drawImage(SP[L],SPB.x,SPB.y,SPB.w,SPB.h);X.restore();}
 X.fillStyle='#e6ecf7';X.beginPath();X.ellipse(0,4,90,12,0,0,6.28);X.fill();   // snow heaped at the foot
 X.restore();}
function buildStatic(){
 const SS=S*1.1;const [cs,qs]=off(1584,2816);qs.scale(SS,SS);sky(qs);SKY=cs;
 const [c,q]=off(1584,2816);q.scale(SS,SS);land(q);
 house(q,{w:600,h:400,roofH:280,wall:'#cdb895',roof:'#5e3b2e',seed:57,stone:90,windows:[[50,90,150,140],[400,90,150,140]],door:[240,120,210],dormer:true,chim:0.22,porch:[220,160],sideWin:true},HT.tx,HT.ty,HT.s);
 porchBits(q);
 // the house's contact shadow is softer on snow: lift it, then heap soft drifts along the foot of the walls
 {const g=q.createLinearGradient(0,HT.ty-4,0,HT.ty+60);g.addColorStop(0,'rgba(170,180,205,.0)');g.addColorStop(0.3,'rgba(170,180,205,.55)');g.addColorStop(1,'rgba(170,180,205,0)');q.fillStyle=g;q.fillRect(HT.tx-80,HT.ty-4,700,64);}
 {const r=rng(66);for(let x=HT.tx-10;x<=HT.tx+510;x+=22){if(x>HT.tx+215&&x<HT.tx+340)continue;const h=8+r()*10,w=22+r()*14;const g=q.createLinearGradient(0,HT.ty-h,0,HT.ty+14);g.addColorStop(0,'#eef2fa');g.addColorStop(1,'rgba(200,210,230,0)');q.fillStyle=g;q.beginPath();q.ellipse(x,HT.ty+4,w,h+8,0,Math.PI,6.28);q.fill();q.beginPath();q.ellipse(x,HT.ty+4,w,10,0,0,Math.PI);q.fill();}}
 // side wall foot
 {const g=q.createLinearGradient(0,HT.ty-30,0,HT.ty);g.addColorStop(0,'#e4e9f4');g.addColorStop(1,'rgba(200,210,230,0)');q.fillStyle=g;q.beginPath();q.moveTo(HT.tx+520,HT.ty+6);q.lineTo(HT.tx+690,HT.ty-80);q.lineTo(HT.tx+690,HT.ty-62);q.quadraticCurveTo(HT.tx+600,HT.ty-14,HT.tx+520,HT.ty+18);q.fill();}
 for(const [cx,cy] of CHIMNEYS){q.fillStyle='#24262c';q.fillRect(cx-36*HT.s,cy+2*HT.s,72*HT.s,14*HT.s);q.fillStyle='#e3e9f5';q.beginPath();q.ellipse(cx-26*HT.s,cy+1*HT.s,22*HT.s,7*HT.s,0,Math.PI,6.28);q.fill();q.beginPath();q.ellipse(cx+26*HT.s,cy+1*HT.s,20*HT.s,6*HT.s,0,Math.PI,6.28);q.fill();}
 for(const [lx,ly,rad] of LIGHTS){const g=q.createRadialGradient(lx,ly+rad*0.9,5,lx,ly+rad*0.9,rad*1.6);g.addColorStop(0,'rgba(255,170,90,.14)');g.addColorStop(1,'rgba(255,170,90,0)');q.fillStyle=g;q.fillRect(lx-rad*2,ly,rad*4,rad*2.4);}
 STATIC=c;}
// ---------- animated ----------
function clouds(t){for(let i=0;i<6;i++){const r=rng(i+40);const y=120+r()*650,rx=200+r()*260,ry=34+r()*40,span=W+rx*2+200;const x=((r()*span+t*span/LOOP*(i%2?1:-1))%span+span)%span-rx-100;
 const near=Math.hypot(x-MOON.x,y-MOON.y)<rx+80;X.save();X.filter='blur(20px)';X.fillStyle=near?'rgba(150,155,185,.5)':'rgba(70,74,105,.55)';X.beginPath();X.ellipse(x,y,rx,ry,0,0,6.28);X.fill();X.restore();}}
function glow(t){for(const [x,y,rad,ph] of LIGHTS){const fl=0.85+0.08*Math.sin(WK(40)*t+ph)+0.07*Math.sin(WK(73)*t+ph*2);
 const g=X.createRadialGradient(x,y,3,x,y,rad);g.addColorStop(0,`rgba(255,180,100,${0.3*fl})`);g.addColorStop(1,'rgba(255,180,100,0)');X.fillStyle=g;X.fillRect(x-rad,y-rad,rad*2,rad*2);}}
// chimney smoke rising almost straight up in the still, snowy air
function smoke(t){for(const [cx,cy,s] of CHIMNEYS){for(let i=0;i<40;i++){const p=((t/5+i/40)%1);const sx=cx+p*p*120*s+Math.sin(p*7+i*0.7+WK(1)*t)*10*p,sy=cy-p*420*s;const rr=(14+p*60)*s;
 const g=X.createRadialGradient(sx,sy,0,sx,sy,rr);g.addColorStop(0,`rgba(215,215,228,${(1-p)*0.15})`);g.addColorStop(1,'rgba(215,215,228,0)');X.fillStyle=g;X.fillRect(sx-rr,sy-rr,rr*2,rr*2);}}}
// porch lantern hanging from the beam, barely moving
function lantern(t){const {tx,ty,s}=HT;const lx=tx+345*s,ly=ty-236*s;const a=0.03*Math.sin(WK(3)*t)+0.015*Math.sin(WK(7)*t);
 const pl=X.createRadialGradient(lx,ly+90,10,lx,ly+140,230);pl.addColorStop(0,'rgba(255,190,110,.30)');pl.addColorStop(1,'rgba(255,190,110,0)');X.fillStyle=pl;X.fillRect(lx-240,ly-60,480,420);
 X.fillStyle='#22160f';X.fillRect(lx-7,ly-4,14,6);
 X.save();X.translate(lx,ly);X.rotate(a);
 X.strokeStyle='#22160f';X.lineWidth=2.5;for(let k=0;k<5;k++){X.beginPath();X.ellipse(0,5+k*6,2.2,3.4,0,0,6.28);X.stroke();}
 X.fillStyle='#22160f';X.beginPath();X.moveTo(-15,40);X.lineTo(15,40);X.lineTo(8,31);X.lineTo(-8,31);X.fill();
 X.fillStyle='#e8eef8';X.beginPath();X.ellipse(0,32,9,3,0,Math.PI,6.28);X.fill();   // a pinch of snow on the lantern cap
 const fl=0.9+0.1*Math.sin(WK(61)*t);X.fillStyle=`rgba(255,${205+20*fl|0},140,1)`;X.beginPath();X.roundRect(-12,41,24,34,4);X.fill();
 X.fillStyle='#fff3d0';X.beginPath();X.ellipse(0,60,3,6*fl,0,0,6.28);X.fill();
 X.strokeStyle='#22160f';X.lineWidth=3;X.strokeRect(-12,41,24,34);X.beginPath();X.moveTo(0,41);X.lineTo(0,75);X.stroke();X.fillRect(-15,74,30,5);
 const gl=X.createRadialGradient(0,58,3,0,58,90);gl.addColorStop(0,'rgba(255,200,120,.45)');gl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=gl;X.fillRect(-90,-32,180,180);
 X.restore();}
// warm fairy lights strung under the porch beam, twinkling
function fairy(t){const {tx,ty,s}=HT;const x0=tx+226*s,x1=tx+374*s,y0=ty-(210+20)*s;
 X.strokeStyle='rgba(30,20,15,.8)';X.lineWidth=1.5;X.beginPath();X.moveTo(x0,y0);X.quadraticCurveTo((x0+x1)/2,y0+22,x1,y0);X.stroke();
 for(let k=0;k<9;k++){const u=(k+0.5)/9,x=lerp(x0,x1,u),y=y0+22*2*u*(1-u)+3;const tw=0.6+0.4*Math.sin(WK(3+k%4)*t+k*1.7);
  const g=X.createRadialGradient(x,y,0,x,y,10);g.addColorStop(0,`rgba(255,215,140,${0.75*tw})`);g.addColorStop(1,'rgba(255,215,140,0)');X.fillStyle=g;X.fillRect(x-10,y-10,20,20);
  X.fillStyle=`rgba(255,236,190,${0.6+0.4*tw})`;X.beginPath();X.arc(x,y,2.4,0,6.28);X.fill();}}
// cat in the round attic window, head following the snowflakes, tail curling
function cat(t){const {tx,ty,s}=HT;
 X.save();X.translate(tx,ty);X.scale(s,s);
 X.beginPath();X.ellipse(300,-495,30,27,0,0,6.28);X.save();X.clip();
 const sw=Math.sin(WK(4)*t)*0.6+Math.sin(WK(9)*t)*0.25,look=Math.sin(WK(3)*t)*2.4,up=Math.max(0,Math.sin(WK(2)*t+1))*2.5;
 X.fillStyle='#24181a';X.strokeStyle='#24181a';X.lineCap='round';
 X.beginPath();X.ellipse(300,-474,15,15,0,0,6.28);X.fill();
 X.beginPath();X.ellipse(300+look*0.3,-488,10,12,0,0,6.28);X.fill();
 const hx=300+look,hy=-504-up;X.beginPath();X.ellipse(hx,hy,10,9,0,0,6.28);X.fill();
 for(const d of [-1,1]){X.beginPath();X.moveTo(hx+d*9,hy-3);X.lineTo(hx+d*8,hy-17);X.lineTo(hx+d*2,hy-8);X.closePath();X.fill();}
 X.lineWidth=4.5;X.beginPath();X.moveTo(312,-466);X.quadraticCurveTo(328,-468,326+sw*6,-484-Math.abs(sw)*3);X.stroke();
 X.restore();
 X.strokeStyle='#3a2418';X.lineWidth=4;X.beginPath();X.moveTo(300,-522);X.lineTo(300,-468);X.moveTo(270,-495);X.lineTo(330,-495);X.stroke();
 X.lineWidth=7;X.beginPath();X.ellipse(300,-495,31,28,0,0,6.28);X.stroke();
 X.fillStyle='#e6ecf6';X.beginPath();X.ellipse(300,-466,24,4,0,Math.PI,6.28);X.fill();   // snow on the little sill
 X.restore();}
// the person who just came home: at the left window, side-on, holding a mug in both hands; sips, and the steam curls
function sitter(t){const {tx,ty,s}=HT;const wx=50,wy=-400+90,ww=150,wh=140;
 X.save();X.translate(tx,ty);X.scale(s,s);
 X.beginPath();X.roundRect(wx+4,wy+4,ww-8,wh-8,6);X.clip();
 const sip=Math.pow(Math.max(0,Math.sin(WK(2)*t-1.2)),3);   // twice a loop she lifts the mug to sip
 const br=Math.sin(WK(5)*t)*0.8;
 const px=wx+ww*0.2,py=wy+wh*0.7;const sil='rgba(70,38,36,.9)';
 X.fillStyle=sil;
 // shoulders and back in a soft jumper, side-on, facing right toward the window
 X.beginPath();X.moveTo(px-24,wy+wh);X.quadraticCurveTo(px-26,py-16+br,px-10,py-24+br);X.quadraticCurveTo(px+12,py-26+br,px+20,py-8+br);X.lineTo(px+24,wy+wh);X.closePath();X.fill();
 X.fillRect(px-3,py-34+br,10,14);   // neck
 const hx=px+3,hy=py-46+br-sip*2;
 X.beginPath();X.ellipse(hx,hy,12,14,0.15,0,6.28);X.fill();                                  // head
 X.beginPath();X.moveTo(hx+10,hy-2);X.lineTo(hx+15,hy+4);X.lineTo(hx+10,hy+6);X.closePath();X.fill();   // small nose in profile
 // long hair falling from the crown down her back to the shoulder blades
 X.beginPath();X.moveTo(hx+6,hy-13);X.quadraticCurveTo(hx-14,hy-18,hx-14,hy);X.quadraticCurveTo(hx-16,py-8,hx-20,py+6+br);X.lineTo(hx-8,py+4+br);X.quadraticCurveTo(hx-4,hy+8,hx+2,hy-4);X.closePath();X.fillStyle='rgba(45,24,24,.95)';X.fill();
 // forearm from the elbow up to the mug held at chest height in both hands
 const mx=px+24,my=py-12-sip*16;X.strokeStyle=sil;X.lineWidth=9;X.lineCap='round';X.beginPath();X.moveTo(px+4,py+8+br);X.quadraticCurveTo(px+14,py+6,mx-6,my+6);X.stroke();
 X.fillStyle='#b5523e';X.beginPath();X.roundRect(mx-6,my-8,14,16,3);X.fill();X.strokeStyle='#b5523e';X.lineWidth=2.5;X.beginPath();X.arc(mx+9,my,4.5,-1.2,1.2);X.stroke();
 X.fillStyle=sil;X.beginPath();X.ellipse(mx-5,my+3,5,5,0,0,6.28);X.fill();
 for(let k=0;k<3;k++){const p=((t/2.5+k/3)%1);X.strokeStyle=`rgba(255,248,235,${0.45*(1-p)*(1-sip)})`;X.lineWidth=2;X.beginPath();X.moveTo(mx+k*3-2,my-10-p*4);X.quadraticCurveTo(mx+6*Math.sin(p*6+k),my-18-p*14,mx+k*2,my-24-p*22);X.stroke();}
 X.restore();
 X.save();X.translate(tx,ty);X.scale(s,s);X.strokeStyle='#3a2418';X.lineWidth=5;X.beginPath();X.moveTo(wx+ww/2,wy);X.lineTo(wx+ww/2,wy+wh);X.moveTo(wx,wy+wh/2);X.lineTo(wx+ww,wy+wh/2);X.stroke();X.restore();}
// white picket fence with snow on the rails and the tops of the pickets; the gate is shut
const FENCE={y:1700,gx:385,gw:110};
function fence(){const y=FENCE.y;
 const pick=(x,h)=>{X.fillStyle='#ddd5c6';X.beginPath();X.moveTo(x,y-h);X.lineTo(x+9,y-h-13);X.lineTo(x+18,y-h);X.lineTo(x+18,y);X.lineTo(x,y);X.fill();X.fillStyle='rgba(30,35,70,.3)';X.fillRect(x+12,y-h,6,h);
  X.fillStyle='#f2f6fd';X.beginPath();X.moveTo(x-1,y-h-1);X.lineTo(x+9,y-h-14);X.lineTo(x+19,y-h-1);X.quadraticCurveTo(x+9,y-h+3,x-1,y-h-1);X.fill();};
 X.fillStyle='rgba(30,35,70,.25)';X.fillRect(0,y-2,W,8);
 const rails=(x0,x1)=>{X.strokeStyle='#c7bfae';X.lineWidth=7;X.beginPath();X.moveTo(x0,y-58);X.lineTo(x1,y-58);X.moveTo(x0,y-24);X.lineTo(x1,y-24);X.stroke();X.strokeStyle='#eef3fb';X.lineWidth=4;X.beginPath();X.moveTo(x0,y-63);X.lineTo(x1,y-63);X.moveTo(x0,y-29);X.lineTo(x1,y-29);X.stroke();};
 for(const [x0,x1] of [[-10,FENCE.gx-14],[FENCE.gx+FENCE.gw+14,W+10]]){rails(x0,x1);for(let x=x0+6;x<x1-12;x+=34)pick(x,88);}
 // gate: rails end at its last picket and it fills the opening
 rails(FENCE.gx+2,FENCE.gx+FENCE.gw-2);X.strokeStyle='#b3aa98';X.lineWidth=5;X.beginPath();X.moveTo(FENCE.gx+6,y-28);X.lineTo(FENCE.gx+FENCE.gw-6,y-56);X.stroke();
 for(const x of [FENCE.gx+3,FENCE.gx+32,FENCE.gx+61,FENCE.gx+FENCE.gw-21])pick(x,88);
 for(const x of [FENCE.gx-14,FENCE.gx+FENCE.gw]){X.fillStyle='#d3cbb9';X.fillRect(x,y-108,16,110);X.fillStyle='rgba(30,35,70,.28)';X.fillRect(x+11,y-104,5,106);X.fillStyle='#f2f6fd';X.beginPath();X.ellipse(x+8,y-111,12,7,0,0,6.28);X.fill();}
 X.fillStyle='#3a3a3a';X.fillRect(FENCE.gx-4,y-70,10,6);X.fillRect(FENCE.gx-4,y-34,10,6);
 // drift along the bottom of the fence
 X.fillStyle='#c9d2e6';X.beginPath();X.moveTo(-10,y+6);for(let x=-10;x<W+20;x+=40)X.quadraticCurveTo(x+20,y-14-((x*13)%11),x+40,y+2);X.lineTo(W+20,y+20);X.lineTo(-10,y+20);X.fill();}
// falling snow in three depths; each flake falls a whole number of frame-heights per loop and drifts sideways
const R0=rng(91);const FL=[...Array(520)].map(()=>({x:R0(),y:R0(),z:R0(),ph:R0()*6.28}));
function snow(t,front){for(const f of FL){const isFront=f.z>0.965;if(isFront!==front)continue;
 const n=f.z<0.45?1:(f.z<0.8?2:3);const span=H+60;const y=((f.y*span+t*span*n/LOOP)%span)-30;
 const x=f.x*W+Math.sin(WK(n+1)*t+f.ph)*(14+f.z*26)+Math.sin(WK(1)*t)*10;
 const r=front?3.2+f.z*2.5:0.9+f.z*2.6;const a=front?0.55:0.45+f.z*0.45;
 if(front){const g=X.createRadialGradient(x,y,0,x,y,r*1.6);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(0.55,`rgba(240,245,255,${a*0.6})`);g.addColorStop(1,'rgba(240,245,255,0)');X.fillStyle=g;X.beginPath();X.arc(x,y,r*1.6,0,6.28);X.fill();}
 else{X.fillStyle=`rgba(245,248,255,${a})`;X.beginPath();X.arc(x,y,r,0,6.28);X.fill();}}}
function grade(t){const v=X.createRadialGradient(W/2,H*0.55,H*0.3,W/2,H*0.55,H*0.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,8,22,.55)');X.fillStyle=v;X.fillRect(0,0,W,H);
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(120,150,230,.10)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.04;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function caption(t){if(t>6.4)return;const a=Math.min(1,0.45+t/1.0)*Math.max(0,Math.min(1,(6.2-t)/1.5));
 X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*6,y=260;const bl=Math.max(0,(t-4.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
 X.font="italic 500 76px Corm, serif";X.shadowColor='rgba(170,200,255,.55)';X.shadowBlur=28;X.fillStyle='#f6f8ff';
 const C1=(window.CAP||['snowed in,','nowhere to be']);for(let k=0;k<2;k++){X.fillText(C1[0],x,y);X.fillText(C1[1],x,y+88);X.shadowBlur=0;}
 X.filter='none';X.globalAlpha=a*0.6;X.strokeStyle='#f6f8ff';X.lineWidth=1.5;X.beginPath();X.moveTo(x-55,y+146);X.lineTo(x+55,y+146);X.stroke();X.restore();}
window.draw=function(t){if(!STATIC)buildStatic();
 const tc=t-(window.TOFF||0);const z=1.1+0.03*(1-Math.cos(WK(1)*t))/2,Fx=520+20*Math.sin(WK(1)*t),Fy=1200;const ox=S*(Fx-Fx*z),oy=S*(Fy-Fy*z);
 X.setTransform(1,0,0,1,0,0);X.setTransform(z/1.1,0,0,z/1.1,ox,oy);X.drawImage(SKY,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);clouds(t);
 X.setTransform(z/1.1,0,0,z/1.1,ox,oy);X.drawImage(STATIC,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);smoke(t);sitter(t);cat(t);glow(t);fairy(t);lantern(t);snow(t,false);spruce(t);fence();snow(t,true);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(tc);};
draw(0);
