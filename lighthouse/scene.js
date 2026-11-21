// Soft Ambience — "the light stays on". A storm over the sea at night: the lighthouse on the headland sweeps its beam
// across the rain, a small fishing boat is still out there with its masthead lamp, and the keeper has left an oil lamp
// burning in the cottage window for whoever is coming home. Lightning far out at sea in the first second (hook) and
// again at 12.3 s; waves surge against the cliff foot and throw spray. Every motion repeats every LOOP (20 s).
// Needs lib.js (cottage helpers, rng, WK, gust).
const HZ=1040;
const TW={x:430,base:1306,top:706,rb:60,rt:40};   // tower: centre x, base y, gallery y, radius at base/top
const LAMP={x:430,y:640};                          // beam origin (lantern room)
const HT={tx:548,ty:1312,s:0.7};                   // keeper's cottage
const BOAT={x:150,y:1112};
const POST={x:792,y:1640};                          // lamp post by the path
const FLASH=[[0.45,0.24,170],[12.3,0.17,930]];
const EDGE=[[318,1310],[250,1380],[170,1470],[90,1570],[10,1680],[-30,1740]];   // cliff top edge (far → near)
const FOOT=[[262,1352],[178,1432],[80,1530],[-24,1640],[-130,1740],[-180,1800]];  // cliff foot on the sea
let SKY=null,CL=null,STATIC=null,SEA=null;
function flashAt(t){let f=0,bolt=null;for(const [lt,a,bx] of FLASH){const d=t-lt;if(d>0&&d<1.2){let v=a*Math.exp(-d*7);if(d>0.16)v+=a*0.7*Math.exp(-(d-0.16)*9);f=Math.max(f,v);if(d<0.32)bolt={bx,d,a,seed:lt*10};}}return {f,bolt};}
// ---------- static layers ----------
function skyPaint(q){const g=q.createLinearGradient(0,0,0,HZ+20);g.addColorStop(0,'#0b111d');g.addColorStop(0.5,'#1a2232');g.addColorStop(0.85,'#2f3647');g.addColorStop(1,'#454a59');q.fillStyle=g;q.fillRect(0,0,W,HZ+40);
 // a thinner patch in the clouds high on the right where a hidden moon silvers the edges
 const m=q.createRadialGradient(860,300,20,860,300,420);m.addColorStop(0,'rgba(150,165,195,.28)');m.addColorStop(1,'rgba(150,165,195,0)');q.fillStyle=m;q.fillRect(400,0,W,800);
 // low glow along the horizon (rain curtain far out)
 const h=q.createLinearGradient(0,HZ-140,0,HZ);h.addColorStop(0,'rgba(90,100,120,0)');h.addColorStop(1,'rgba(90,100,120,.35)');q.fillStyle=h;q.fillRect(0,HZ-140,W,140);
 // distant rain curtains hanging from the clouds over the sea
 const r=rng(3);for(let i=0;i<7;i++){const x=r()*W,w=60+r()*140;const gg=q.createLinearGradient(0,600,0,HZ);gg.addColorStop(0,'rgba(120,130,150,0)');gg.addColorStop(1,'rgba(120,130,150,.07)');q.fillStyle=gg;q.filter='blur(10px)';q.beginPath();q.moveTo(x,700);q.lineTo(x+w,700);q.lineTo(x+w-50,HZ);q.lineTo(x-50,HZ);q.fill();q.filter='none';}}
// heavy cloud deck: lumpy masses, darker on top, a little lighter underneath; kept on its own layer so lightning can light it
function cloudPaint(q){const r=rng(8);q.filter='blur(16px)';
 for(let i=0;i<70;i++){const x=r()*(W+300)-150,y=40+Math.pow(r(),1.3)*640,rx=120+r()*220,ry=40+r()*60;
  const g=q.createRadialGradient(x,y+ry*0.4,4,x,y,rx);const lift=y/700;
  g.addColorStop(0,`rgba(${70+lift*40|0},${78+lift*40|0},${96+lift*36|0},.55)`);g.addColorStop(0.7,`rgba(${40+lift*30|0},${46+lift*30|0},${62+lift*30|0},.35)`);g.addColorStop(1,'rgba(30,36,50,0)');
  q.fillStyle=g;q.beginPath();q.ellipse(x,y,rx,ry,0,0,6.28);q.fill();}
 for(let i=0;i<26;i++){const x=r()*W,y=120+r()*520,rx=90+r()*150;const g2=q.createRadialGradient(x,y-20,4,x,y-20,rx);g2.addColorStop(0,'rgba(12,16,26,.38)');g2.addColorStop(1,'rgba(12,16,26,0)');q.fillStyle=g2;q.beginPath();q.ellipse(x,y-20,rx,30+r()*30,0,0,6.28);q.fill();}
 // billows: clusters of small puffs along the cloud bases, lit a little from below
 for(let i=0;i<34;i++){const cx=r()*W,cy=200+r()*520;for(let k=0;k<9;k++){const px=cx+(k-4)*(26+r()*20),py=cy+Math.abs(k-4)*6+r()*10,pr=30+r()*36;const g=q.createRadialGradient(px,py+pr*0.3,2,px,py,pr);g.addColorStop(0,'rgba(92,100,120,.30)');g.addColorStop(1,'rgba(60,66,84,0)');q.fillStyle=g;q.beginPath();q.arc(px,py,pr,0,6.28);q.fill();}}
 q.filter='none';
 // silvered edges near the hidden moon
}
function seaPaint(q){const g=q.createLinearGradient(0,HZ,0,H);g.addColorStop(0,'#3a4152');g.addColorStop(0.04,'#232b39');g.addColorStop(0.35,'#18202c');g.addColorStop(1,'#0e141d');q.fillStyle=g;q.fillRect(0,HZ,W,H-HZ);
 // swell bands, closer = bigger
 const r=rng(12);for(let i=0;i<260;i++){const y=HZ+3+Math.pow(r(),1.8)*(H-HZ),k=(y-HZ)/(H-HZ);const w=20+k*260*r();q.fillStyle=r()>0.5?`rgba(70,82,104,${0.12+0.2*(1-k)})`:`rgba(5,8,14,${0.25})`;q.fillRect(r()*W,y,w,1+k*5);}}
function landPaint(q){const r=rng(21);
 // cliff face below the edge: layered dark rock
 q.beginPath();q.moveTo(EDGE[0][0],EDGE[0][1]);for(const p of EDGE)q.lineTo(p[0],p[1]);for(let i=FOOT.length-1;i>=0;i--)q.lineTo(FOOT[i][0],FOOT[i][1]);q.closePath();
 const cg=q.createLinearGradient(0,1300,0,1880);cg.addColorStop(0,'#3b3a3f');cg.addColorStop(1,'#1d1d22');q.fillStyle=cg;q.fill();
 q.save();q.clip();for(let i=0;i<220;i++){const u=r(),e=pt(EDGE,u),f=pt(FOOT,u),v=r();const x=lerp(e[0],f[0],v),y=lerp(e[1],f[1],v),k=(y-1300)/600;
  q.fillStyle=r()>0.5?'rgba(90,88,92,.35)':'rgba(10,10,14,.45)';q.beginPath();q.moveTo(x,y);q.lineTo(x+(18+r()*40)*(0.6+k),y+(r()*6-3));q.lineTo(x+(10+r()*20)*(0.6+k),y+(8+r()*14)*(0.6+k));q.closePath();q.fill();}
 // strata lines and a wet sheen
 for(let s=1;s<6;s++){q.strokeStyle='rgba(15,15,20,.5)';q.lineWidth=2;q.beginPath();for(let i=0;i<=20;i++){const u=i/20,e=pt(EDGE,u),f=pt(FOOT,u);const p=[lerp(e[0],f[0],s/6),lerp(e[1],f[1],s/6)+Math.sin(i*1.3+s)*4];i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]);}q.stroke();}
 q.restore();
 // headland grass (everything right of the edge), dark wet greens, lighter toward the cottage windows
 q.beginPath();q.moveTo(EDGE[0][0],EDGE[0][1]);for(let x=EDGE[0][0];x<=W+20;x+=12)q.lineTo(x,RIM(x));q.lineTo(W+20,H+20);q.lineTo(-40,H+20);q.lineTo(-40,EDGE[EDGE.length-1][1]);for(let i=EDGE.length-1;i>=0;i--)q.lineTo(EDGE[i][0],EDGE[i][1]);q.closePath();
 const gg=q.createLinearGradient(0,1290,0,H);gg.addColorStop(0,'#26342c');gg.addColorStop(0.4,'#1c2820');gg.addColorStop(1,'#101812');q.fillStyle=gg;q.fill();
 q.save();q.clip();
 for(let i=0;i<1400;i++){const y=1295+Math.pow(r(),0.9)*(H-1295),k=(y-1290)/(H-1290),x=r()*W;q.strokeStyle=r()>0.5?`rgba(60,82,64,${0.4})`:`rgba(8,14,10,.5)`;q.lineWidth=1+k*2;q.beginPath();q.moveTo(x,y);q.lineTo(x-3-k*10,y-4-k*22);q.stroke();}
 // warm spill from the cottage on the grass in front of it
 const wl=q.createRadialGradient(670,1340,10,670,1340,300);wl.addColorStop(0,'rgba(255,170,90,.22)');wl.addColorStop(1,'rgba(255,170,90,0)');q.fillStyle=wl;q.save();q.translate(650,1340);q.scale(1,0.4);q.translate(-650,-1340);q.beginPath();q.arc(650,1340,300,0,6.28);q.fill();q.restore();
 q.restore();
 // stepping-stone path from the bottom of the frame up to the cottage door, in perspective
 const P=[[600,1960],[640,1830],[700,1720],[704,1620],[690,1520],[684,1440],[682,1380],[678,1336]];
 for(let i=0;i<P.length-1;i++){for(let j=0;j<2;j++){const u=j/2,x=lerp(P[i][0],P[i+1][0],u)+(j?14:-10),y=lerp(P[i][1],P[i+1][1],u),k=(y-1320)/600;const rx=(16+k*62)*(0.9+r()*0.2),ry=rx*0.38;
  q.fillStyle='rgba(5,8,6,.55)';q.beginPath();q.ellipse(x+2,y+ry*0.35,rx*1.05,ry,0,0,6.28);q.fill();
  const sg=q.createLinearGradient(0,y-ry,0,y+ry);sg.addColorStop(0,'#6e6c6b');sg.addColorStop(1,'#3e3d3f');q.fillStyle=sg;q.beginPath();q.ellipse(x,y,rx,ry,0,0,6.28);q.fill();
  q.fillStyle='rgba(255,190,120,.10)';q.beginPath();q.ellipse(x-rx*0.2,y-ry*0.3,rx*0.6,ry*0.4,0,0,6.28);q.fill();}}
 for(let i=0;i<26;i++){const u=i/25,x=lerp(TW.x+8,676,u)+Math.sin(i*2.3)*6,y=lerp(1312,1342,u)+Math.sin(i*1.7)*3;q.fillStyle=i%2?'#59585a':'#4a494c';q.beginPath();q.ellipse(x,y,6+u*3,2.4+u,0,0,6.28);q.fill();}
 window.PATH=P;}
const RIM=x=>1298-Math.sin(x*0.011)*6-Math.sin(x*0.037+1)*3-Math.max(0,(x-760)/320)*14;
// the far rim of the headland against the sea: a dark rocky lip, gorse and tussocks breaking the line
function rimPaint(q){const r=rng(52);q.fillStyle='#0f1512';q.beginPath();q.moveTo(EDGE[0][0]-4,EDGE[0][1]+2);for(let x=EDGE[0][0];x<=W+20;x+=10)q.lineTo(x,RIM(x)+1);for(let x=W+20;x>=EDGE[0][0];x-=10)q.lineTo(x,RIM(x)+7+Math.sin(x*0.09)*2);q.closePath();q.fill();
 for(let i=0;i<26;i++){const x=EDGE[0][0]+20+r()*(W-EDGE[0][0]),y=RIM(x)+3,w=10+r()*26,h=5+r()*12;q.fillStyle=r()>0.5?'#17221b':'#1d2b21';q.beginPath();q.ellipse(x,y,w,h,0,Math.PI,6.28);q.fill();}
 for(let i=0;i<90;i++){const x=EDGE[0][0]+r()*(W-EDGE[0][0]),y=RIM(x)+2;q.strokeStyle='#121b15';q.lineWidth=1.5;q.beginPath();q.moveTo(x,y);q.lineTo(x-4-r()*5,y-6-r()*10);q.stroke();}}
function pt(A,u){const n=A.length-1,f=Math.min(n-1e-6,u*n),i=f|0,v=f-i;return [lerp(A[i][0],A[i+1][0],v),lerp(A[i][1],A[i+1][1],v)];}
// the lighthouse: white tower with two red bands, a few slit windows (one lit), gallery with railing, glazed lantern room, dome
function towerPaint(q){const {x,base,top,rb,rt}=TW;const R=y=>lerp(rb,rt,(base-y)/(base-top));
 q.fillStyle='rgba(0,0,0,.5)';q.beginPath();q.ellipse(x+20,base+4,rb*1.6,14,0,0,6.28);q.fill();
 // stone plinth
 q.fillStyle='#4b4a4d';q.beginPath();q.moveTo(x-rb-14,base+6);q.lineTo(x+rb+14,base+6);q.lineTo(x+rb+10,base-34);q.lineTo(x-rb-10,base-34);q.closePath();q.fill();
 q.fillStyle='rgba(0,0,0,.3)';q.fillRect(x+rb*0.3,base-34,rb*0.7+10,40);
 const body=new Path2D();body.moveTo(x-R(base-34),base-34);body.lineTo(x-rt,top);body.lineTo(x+rt,top);body.lineTo(x+R(base-34),base-34);body.closePath();
 q.save();q.clip(body);
 const sg=q.createLinearGradient(x-rb,0,x+rb,0);sg.addColorStop(0,'#cfd3da');sg.addColorStop(0.35,'#e9ecf0');sg.addColorStop(0.75,'#9fa5b0');sg.addColorStop(1,'#6c7280');q.fillStyle=sg;q.fillRect(x-rb-10,top,rb*2+20,base-top);
 for(const [y0,y1] of [[top+120,top+210],[top+330,top+420]]){const rg=q.createLinearGradient(x-rb,0,x+rb,0);rg.addColorStop(0,'#a8423b');rg.addColorStop(0.35,'#c9564b');rg.addColorStop(0.75,'#7e2e2c');rg.addColorStop(1,'#5a2122');q.fillStyle=rg;
  q.beginPath();q.moveTo(x-80,y0);q.quadraticCurveTo(x,y0+8,x+80,y0);q.lineTo(x+80,y1);q.quadraticCurveTo(x,y1+8,x-80,y1);q.closePath();q.fill();}
 // weathering streaks running down from the gallery
 const r=rng(5);for(let i=0;i<18;i++){const sx=x-rt+r()*rt*2;q.strokeStyle='rgba(60,60,70,.12)';q.lineWidth=2+r()*3;q.beginPath();q.moveTo(sx,top);q.lineTo(sx+(r()-0.5)*4,top+60+r()*200);q.stroke();}
 q.restore();
 // slit windows up the tower (the middle one lit, the keeper's stair lamp)
 for(const [wy,lit] of [[top+60,false],[top+270,true],[top+470,false]]){q.fillStyle=lit?'#f7c27a':'#2a2c33';q.beginPath();q.roundRect(x-10,wy,20,42,[10,10,0,0]);q.fill();q.strokeStyle='#3c3c44';q.lineWidth=2;q.stroke();
  if(lit){const g=q.createRadialGradient(x,wy+15,2,x,wy+15,40);g.addColorStop(0,'rgba(255,190,110,.4)');g.addColorStop(1,'rgba(255,190,110,0)');q.fillStyle=g;q.fillRect(x-40,wy-25,80,80);}}
 // door at the base
 q.fillStyle='#2d3038';q.beginPath();q.roundRect(x-24,base-126,48,92,[24,24,0,0]);q.fill();q.strokeStyle='#1c1e24';q.lineWidth=3;q.stroke();q.fillStyle='#55585f';q.fillRect(x-30,base-36,60,6);q.fillStyle='rgba(255,255,255,.08)';q.fillRect(x-20,base-118,6,80);q.fillStyle='#9b8a6a';q.beginPath();q.arc(x+14,base-78,3,0,6.28);q.fill();
 // gallery: overhanging deck + railing
 q.fillStyle='#22252c';q.beginPath();q.ellipse(x,top,rt+26,9,0,0,6.28);q.fill();q.fillRect(x-rt-26,top-2,(rt+26)*2,8);
 q.strokeStyle='#22252c';q.lineWidth=2.4;for(let i=0;i<=14;i++){const a=Math.PI*i/14,px=x-Math.cos(a)*(rt+22),py=top-2+Math.sin(a)*6;q.beginPath();q.moveTo(px,py);q.lineTo(px,py-30);q.stroke();}
 q.lineWidth=3;q.beginPath();q.ellipse(x,top-32,rt+22,6,0,0,Math.PI);q.stroke();q.beginPath();q.ellipse(x,top-17,rt+22,6,0,0,Math.PI);q.stroke();
 // lantern room base wall
 q.fillStyle='#2b2e36';q.fillRect(x-rt+4,top-34,(rt-4)*2,26);
 // glazing (lit) with astragals
 const gy0=top-104,gy1=top-34;const gl=q.createLinearGradient(0,gy0,0,gy1);gl.addColorStop(0,'#fff6d8');gl.addColorStop(1,'#ffd98a');q.fillStyle=gl;q.fillRect(x-rt+6,gy0,(rt-6)*2,gy1-gy0);
 q.strokeStyle='#23262d';q.lineWidth=3;for(const dx of [-0.66,-0.22,0.22,0.66]){q.beginPath();q.moveTo(x+dx*(rt-6),gy0);q.lineTo(x+dx*(rt-6),gy1);q.stroke();}q.beginPath();q.moveTo(x-rt+6,(gy0+gy1)/2);q.lineTo(x+rt-6,(gy0+gy1)/2);q.stroke();
 q.lineWidth=4;q.strokeRect(x-rt+6,gy0,(rt-6)*2,gy1-gy0);
 // dome roof, ventilator ball and lightning rod
 q.fillStyle='#3a2a2a';q.beginPath();q.moveTo(x-rt-4,gy0+2);q.quadraticCurveTo(x-rt+2,gy0-40,x,gy0-50);q.quadraticCurveTo(x+rt-2,gy0-40,x+rt+4,gy0+2);q.closePath();q.fill();
 q.fillStyle='rgba(255,255,255,.08)';q.beginPath();q.moveTo(x-rt,gy0);q.quadraticCurveTo(x-rt+6,gy0-34,x-6,gy0-46);q.lineTo(x-10,gy0-40);q.quadraticCurveTo(x-rt+12,gy0-28,x-rt+10,gy0);q.fill();
 q.fillStyle='#2a1f1f';q.beginPath();q.arc(x,gy0-56,8,0,6.28);q.fill();q.strokeStyle='#2a1f1f';q.lineWidth=2.5;q.beginPath();q.moveTo(x,gy0-62);q.lineTo(x,gy0-92);q.stroke();}
function buildStatic(){
 const SS=S*1.1;const mk=f=>{const [c,q]=off(1584,2816);q.scale(SS,SS);f(q);return c;};
 SKY=mk(skyPaint);CL=mk(cloudPaint);SEA=mk(seaPaint);
 STATIC=mk(q=>{landPaint(q);rimPaint(q);
  house(q,{w:360,h:220,roofH:160,wall:'#d8d2c4',roof:'#3c4148',seed:73,stone:70,windows:[[40,62,80,80],[240,62,80,80]],door:[150,66,140],chim:0.74,porch:[138,90],sideWin:true},HT.tx,HT.ty,HT.s);
  towerPaint(q);
  for(const [lx,ly,rad] of LIGHTS){const g=q.createRadialGradient(lx,ly+rad*0.9,5,lx,ly+rad*0.9,rad*1.6);g.addColorStop(0,'rgba(255,170,90,.14)');g.addColorStop(1,'rgba(255,170,90,0)');q.fillStyle=g;q.fillRect(lx-rad*2,ly,rad*4,rad*2.4);}
 });}
// ---------- animated ----------
function scud(t){for(let i=0;i<7;i++){const r=rng(i+60);const y=180+r()*560,rx=180+r()*240,ry=26+r()*34,span=W+rx*2+300;const x=((r()*span-t*span/LOOP*(1+(i%2)))%span+span)%span-rx-150;
 X.save();X.filter='blur(18px)';X.fillStyle=`rgba(${60+i*4},${66+i*4},${84+i*4},.45)`;X.beginPath();X.ellipse(x,y,rx,ry,0,0,6.28);X.fill();X.restore();}}
function skyLightning(t){const {f,bolt}=flashAt(t);if(f<=0.002)return;
 X.save();X.globalCompositeOperation='lighter';X.fillStyle=`rgba(110,125,175,${f*0.9})`;X.fillRect(-100,-100,W+200,HZ+100);X.restore();
 if(bolt&&!(bolt.d>0.08&&bolt.d<0.16)){const r=rng(bolt.seed|0);let x=bolt.bx,y=200;const pts=[[x,y]];while(y<HZ-4){y=Math.min(HZ-2,y+14+r()*26);x+=(r()-0.5)*44+(r()<0.15?(r()-0.5)*60:0);pts.push([x,y]);}
  const br=[];for(let i=3;i<pts.length-4;i+=4){if(r()<0.6){let bx=pts[i][0],by=pts[i][1];const b=[[bx,by]];for(let k=0;k<4;k++){by+=25+r()*25;bx+=(r()-0.3)*60*(r()<0.5?-1:1);b.push([bx,Math.min(by,HZ-30)]);}br.push(b);}}
  const al=(1-bolt.d/0.32);X.save();X.globalCompositeOperation='lighter';X.lineCap='round';X.lineJoin='round';
  for(const [lw,col] of [[12,`rgba(140,160,255,${0.14*al})`],[5,`rgba(190,205,255,${0.4*al})`],[1.8,`rgba(255,255,255,${0.95*al})`]]){X.strokeStyle=col;X.lineWidth=lw;
   X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();for(const b of br){X.lineWidth=lw*0.55;X.beginPath();b.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();X.lineWidth=lw;}}
  // its reflection on the sea, broken by the swell
  const last=pts[pts.length-1];const rg=X.createLinearGradient(0,HZ,0,HZ+160);rg.addColorStop(0,`rgba(200,210,255,${0.5*al})`);rg.addColorStop(1,'rgba(200,210,255,0)');X.fillStyle=rg;for(let k=0;k<9;k++)X.fillRect(last[0]-10+Math.sin(k*2.1)*8,HZ+2+k*16,20-k*1.6,5);
  X.restore();}}
// moving swell on the open sea: glints that drift and shimmer, whitecaps appearing and fading
function seaAnim(t){const r=rng(31);for(let i=0;i<170;i++){const y=HZ+4+Math.pow(r(),1.7)*(H-HZ-4),k=(y-HZ)/(H-HZ);const x0=r()*W,ph=r()*6.28,sp=1+(i%3);
 const x=((x0-t*W/LOOP*sp*0.25)%W+W)%W;const a=Math.max(0,Math.sin(WK(2+(i%4))*t+ph));
 X.fillStyle=`rgba(150,165,190,${0.14*a*(1-k*0.5)})`;X.fillRect(x,y,8+k*90,1+k*3);
 if(i%3==0&&a>0.6){X.fillStyle=`rgba(225,232,245,${(a-0.6)*0.9*(0.5+k)})`;X.beginPath();X.ellipse(x+10,y,4+k*24,1+k*3,0,0,6.28);X.fill();}}}
// beam: two opposite beams rotating once every 10 s; foreshortened toward the horizon when pointing away,
// rising and flaring when swinging toward us
function beamGeom(th){const cx=Math.cos(th),sz=Math.sin(th);const away=Math.max(0,-sz),toward=Math.max(0,sz);
 const len=1000*Math.abs(cx)+260*toward+120;const ex=LAMP.x+cx*len,ey=LAMP.y+(HZ-60-LAMP.y)*away*0.22-120*toward;const wd=40+70*toward+40*Math.abs(cx);return {ex,ey,wd,toward,away,cx};}
function beam(t,flareOnly){const th0=WK(2)*t;
 X.save();X.globalCompositeOperation='lighter';
 if(!flareOnly)for(const th of [th0,th0+Math.PI]){const b=beamGeom(th);if(Math.abs(b.cx)<0.05&&b.toward<0.5)continue;
  const dx=b.ex-LAMP.x,dy=b.ey-LAMP.y,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;
  const g=X.createLinearGradient(LAMP.x,LAMP.y,b.ex,b.ey);const a=0.20+0.25*b.toward;g.addColorStop(0,`rgba(255,240,200,${a})`);g.addColorStop(0.5,`rgba(255,235,190,${a*0.4})`);g.addColorStop(1,'rgba(255,235,190,0)');
  X.fillStyle=g;X.beginPath();X.moveTo(LAMP.x+nx*8,LAMP.y+ny*8);X.lineTo(b.ex+nx*b.wd,b.ey+ny*b.wd);X.lineTo(b.ex-nx*b.wd,b.ey-ny*b.wd);X.lineTo(LAMP.x-nx*8,LAMP.y-ny*8);X.closePath();X.fill();
  // brighter core
  X.fillStyle=g;X.globalAlpha=0.6;X.beginPath();X.moveTo(LAMP.x+nx*4,LAMP.y+ny*4);X.lineTo(b.ex+nx*b.wd*0.35,b.ey+ny*b.wd*0.35);X.lineTo(b.ex-nx*b.wd*0.35,b.ey-ny*b.wd*0.35);X.lineTo(LAMP.x-nx*4,LAMP.y-ny*4);X.closePath();X.fill();X.globalAlpha=1;}
 if(!flareOnly){X.restore();return;}
 // the lens flares as a beam swings past us
 const fl=Math.max(Math.pow(Math.max(0,Math.sin(th0)),6),Math.pow(Math.max(0,Math.sin(th0+Math.PI)),6));
 const rr=55+140*fl;const fg=X.createRadialGradient(LAMP.x,LAMP.y,2,LAMP.x,LAMP.y,rr);fg.addColorStop(0,`rgba(255,248,225,${0.55+0.4*fl})`);fg.addColorStop(0.25,`rgba(255,230,180,${0.22+0.25*fl})`);fg.addColorStop(1,'rgba(255,230,180,0)');X.fillStyle=fg;X.fillRect(LAMP.x-rr,LAMP.y-rr,rr*2,rr*2);
 X.restore();}
function seaGlint(t){const th0=WK(2)*t;for(const th of [th0,th0+Math.PI]){const b=beamGeom(th);if(b.cx>-0.2)continue;const k=Math.min(1,-b.cx);const gx=LAMP.x+(b.ex-LAMP.x)*0.55,gy=HZ+18+40*(1-b.away);
 const g=X.createRadialGradient(gx,gy,2,gx,gy,180);g.addColorStop(0,`rgba(255,238,200,${0.22*k})`);g.addColorStop(1,'rgba(255,238,200,0)');X.save();X.translate(gx,gy);X.scale(1,0.12);X.translate(-gx,-gy);X.fillStyle=g;X.fillRect(gx-180,gy-180,360,360);X.restore();
 for(let i=0;i<14;i++){const px=gx+(((i*67)%100)/100-0.5)*260,py=gy+(((i*31)%10)/10-0.4)*30;X.fillStyle=`rgba(255,240,210,${0.35*k*Math.max(0,Math.sin(WK(6)*t+i*1.9))})`;X.fillRect(px,py,10+(i%4)*6,1.5);}}}
// how strongly a beam is currently falling on the boat (screen-angle test)
function beamOnBoat(t){const th0=WK(2)*t;let best=0;for(const th of [th0,th0+Math.PI]){const b=beamGeom(th);const a1=Math.atan2(b.ey-LAMP.y,b.ex-LAMP.x),a2=Math.atan2(BOAT.y-LAMP.y,BOAT.x-LAMP.x);let d=Math.abs(a1-a2);d=Math.min(d,6.283-d);if(b.cx<0)best=Math.max(best,Math.exp(-d*d/0.004));}return best;}
// the little fishing boat still out on the water, riding the swell, masthead lamp lit
function boat(t){const bob=Math.sin(WK(3)*t)*4+Math.sin(WK(7)*t+1)*1.5,rot=Math.sin(WK(2)*t+0.6)*0.07+Math.sin(WK(5)*t)*0.03;const lit=beamOnBoat(t);
 // masthead lamp reflection on the water
 const rl=X.createLinearGradient(0,BOAT.y,0,BOAT.y+90);rl.addColorStop(0,'rgba(255,200,120,.35)');rl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=rl;for(let k=0;k<7;k++){X.fillRect(BOAT.x-6+Math.sin(WK(4)*t+k)*5,BOAT.y+6+k*12,12-k,3);}
 X.save();X.translate(BOAT.x,BOAT.y+bob);X.rotate(rot);X.scale(1.3,1.3);
 X.fillStyle='#1a1a20';X.beginPath();X.moveTo(-40,-6);X.lineTo(38,-8);X.quadraticCurveTo(34,6,22,8);X.lineTo(-30,8);X.quadraticCurveTo(-38,4,-40,-6);X.fill();   // hull
 X.fillStyle='#7a2a26';X.fillRect(-38,-6,76,3);
 X.fillStyle='#c9c8c4';X.fillRect(-18,-24,22,18);X.fillStyle='#ffd18a';X.fillRect(-14,-20,6,6);X.fillRect(-5,-20,6,6);   // wheelhouse, lit
 X.strokeStyle='#1a1a20';X.lineWidth=2;X.beginPath();X.moveTo(12,-8);X.lineTo(12,-52);X.moveTo(12,-46);X.lineTo(32,-10);X.stroke();
 const g=X.createRadialGradient(12,-54,1,12,-54,22);g.addColorStop(0,'rgba(255,220,150,.9)');g.addColorStop(1,'rgba(255,220,150,0)');X.fillStyle=g;X.fillRect(-10,-76,44,44);
 X.fillStyle='#fff2cf';X.beginPath();X.arc(12,-54,2.2,0,6.28);X.fill();
 if(lit>0.01){X.globalCompositeOperation='lighter';X.fillStyle=`rgba(255,240,205,${0.5*lit})`;X.fillRect(-40,-26,80,34);X.globalCompositeOperation='source-over';}
 X.restore();
 for(let k=0;k<5;k++){const w=(30+k*9)*(0.8+0.2*Math.sin(WK(4)*t+k));X.fillStyle=`rgba(190,200,220,${0.16-k*0.025})`;X.fillRect(BOAT.x-w/2+Math.sin(WK(3)*t+k*1.7)*6,BOAT.y+bob*0.5+12+k*5,w,1.6);}}
// waves surging against the cliff foot; three big sets throw spray (each fully inside the loop)
const SETS=[[3.0,0.25],[9.6,0.6],[15.4,0.85]];
function surf(t){X.save();X.beginPath();X.moveTo(-400,HZ);X.lineTo(EDGE[0][0]+6,EDGE[0][1]);for(const p of EDGE)X.lineTo(p[0]+4,p[1]+6);X.lineTo(-400,H+200);X.closePath();X.clip();
 for(let i=0;i<=30;i++){const u=i/30,p=pt(FOOT,u),k=(p[1]-1380)/500;const s=Math.sin(WK(4)*t+u*9)*0.5+0.5;
  const fr=(22+k*40)*(0.7+0.5*s),fx=p[0]-4+Math.sin(u*37)*10,fy=p[1]+4;const fg=X.createRadialGradient(fx,fy,1,fx,fy,fr);fg.addColorStop(0,`rgba(225,232,242,${0.22+0.25*s})`);fg.addColorStop(1,'rgba(225,232,242,0)');X.fillStyle=fg;X.beginPath();X.ellipse(fx,fy,fr,fr*0.45,-0.7,0,6.28);X.fill();}
 // rocks at the foot, wet tops catching the light
 const r=rng(44);for(let i=0;i<16;i++){const u=r(),p=pt(FOOT,u),k=(p[1]-1380)/500,rr=(10+r()*16)*(0.7+k*1.4);const cx=p[0]+r()*24-4,cy=p[1]+4;
  X.fillStyle='#24252b';X.beginPath();for(let j=0;j<7;j++){const a=Math.PI+j/6*Math.PI,rad=rr*(0.75+r()*0.35);X.lineTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad*0.8);}X.lineTo(cx+rr,cy+rr*0.25);X.lineTo(cx-rr,cy+rr*0.25);X.closePath();X.fill();
  X.fillStyle='rgba(150,160,180,.22)';X.beginPath();X.ellipse(cx-rr*0.25,cy-rr*0.5,rr*0.45,rr*0.14,-0.2,0,6.28);X.fill();}
 X.restore();
 for(const [t0,u0] of SETS){const d=t-t0;if(d<0||d>2.4)continue;const p=pt(FOOT,u0),k=(p[1]-1380)/500,sc=0.7+k*1.3;const q=rng((t0*10)|0);
  {const mr=(60+120*Math.min(1,d))*sc,mx=p[0]+20*d,my=p[1]-90*sc*Math.min(1,d*1.5)+50*d*d;const mg=X.createRadialGradient(mx,my,2,mx,my,mr);mg.addColorStop(0,`rgba(220,228,240,${0.32*Math.max(0,1-d/2.4)})`);mg.addColorStop(1,'rgba(220,228,240,0)');X.fillStyle=mg;X.fillRect(mx-mr,my-mr,mr*2,mr*2);}
  for(let n=0;n<70;n++){const ang=-Math.PI/2+(q()-0.5)*1.3,v=(160+q()*240)*sc,life=d/(1.6+q()*0.8);if(life>1)continue;
   const x=p[0]+Math.cos(ang)*v*d*0.9+20,y=p[1]+Math.sin(ang)*v*d+240*sc*d*d-40*d;const rr=(3+q()*8)*sc*(0.6+life);
   const vx=Math.cos(ang)*v*0.9,vy=Math.sin(ang)*v+480*sc*d-40;const sp=Math.hypot(vx,vy)||1;X.strokeStyle=`rgba(232,238,246,${0.45*(1-life)})`;X.lineWidth=rr*0.45;X.lineCap='round';X.beginPath();X.moveTo(x,y);X.lineTo(x-vx/sp*rr*2.2,y-vy/sp*rr*2.2);X.stroke();}}}
// chimney smoke torn sideways by the wind
function smoke(t){for(const [cx,cy,s] of CHIMNEYS){for(let i=0;i<36;i++){const p=((t/2.5+i/36)%1);const G=gust(t-p*2);const sx=cx-p*(170+80*G)*s+Math.sin(p*7+i*0.9)*34*p+Math.sin(i*2.7)*10*p,sy=cy-p*300*s+p*p*90*s;const rr=(16+p*90)*s*(0.7+0.5*Math.abs(Math.sin(i*1.9)));
 const g=X.createRadialGradient(sx,sy,0,sx,sy,rr);g.addColorStop(0,`rgba(175,178,192,${(1-p)*0.26})`);g.addColorStop(1,'rgba(190,192,205,0)');X.fillStyle=g;X.fillRect(sx-rr,sy-rr,rr*2,rr*2);}}}
function glow(t){for(const [x,y,rad,ph] of LIGHTS){const fl=0.85+0.08*Math.sin(WK(40)*t+ph)+0.07*Math.sin(WK(73)*t+ph*2);
 const g=X.createRadialGradient(x,y,3,x,y,rad);g.addColorStop(0,`rgba(255,180,100,${0.26*fl})`);g.addColorStop(1,'rgba(255,180,100,0)');X.fillStyle=g;X.fillRect(x-rad,y-rad,rad*2,rad*2);}}
// the oil lamp left burning on the sill of the left window, for whoever is still out at sea
function sillLamp(t){const {tx,ty,s}=HT;const wx=tx+40*s,wy=ty+(-220+62)*s,ww=80*s,wh=80*s;const cx=wx+ww*0.5,by=wy+wh-3;
 X.save();X.beginPath();X.rect(wx+3,wy+3,ww-6,wh-6);X.clip();
 const fl=0.9+0.06*Math.sin(WK(53)*t)+0.04*Math.sin(WK(97)*t);
 const g=X.createRadialGradient(cx+12,by-18,2,cx+12,by-18,44);g.addColorStop(0,`rgba(255,236,170,${0.85*fl})`);g.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=g;X.fillRect(wx,wy,ww,wh);
 const cx2=cx+12;X.fillStyle='#4a2a1c';X.beginPath();X.ellipse(cx2,by-3,9,4,0,0,6.28);X.fill();X.fillRect(cx2-3,by-8,6,5);                  // brass base
 X.fillStyle='rgba(255,246,220,.55)';X.beginPath();X.moveTo(cx2-6,by-8);X.quadraticCurveTo(cx2-9,by-18,cx2-4,by-26);X.lineTo(cx2+4,by-26);X.quadraticCurveTo(cx2+9,by-18,cx2+6,by-8);X.closePath();X.fill();   // glass chimney
 X.fillStyle='#fff6d6';X.beginPath();X.ellipse(cx2,by-15,2.2,4.5*fl,0,0,6.28);X.fill();
 X.restore();
 // redraw the cross mullion over it so the lamp sits behind the glass
 X.strokeStyle='#3a2418';X.lineWidth=5*s;X.beginPath();X.moveTo(wx+ww/2,wy);X.lineTo(wx+ww/2,wy+wh);X.moveTo(wx,wy+wh/2);X.lineTo(wx+ww,wy+wh/2);X.stroke();}
// iron lamp post by the path: lantern hangs from the bracket arm and swings with the gusts; warm pool on the wet stones
function lampPost(t){const {x,y}=POST;const G=gust(t);const a=0.05*G*Math.sin(WK(3)*t)+0.08*(G-0.55);
 const pl=X.createRadialGradient(x-40,y+10,10,x-40,y+10,200);pl.addColorStop(0,'rgba(255,190,110,.32)');pl.addColorStop(1,'rgba(255,190,110,0)');X.save();X.translate(x-40,y+10);X.scale(1,0.35);X.translate(-(x-40),-(y+10));X.fillStyle=pl;X.beginPath();X.arc(x-40,y+10,200,0,6.28);X.fill();X.restore();
 X.fillStyle='rgba(0,0,0,.45)';X.beginPath();X.ellipse(x+6,y+4,22,6,0,0,6.28);X.fill();
 X.fillStyle='#1b1c20';X.fillRect(x-6,y-250,12,252);X.fillRect(x-12,y-8,24,10);
 X.strokeStyle='#1b1c20';X.lineWidth=6;X.beginPath();X.moveTo(x,y-240);X.lineTo(x-74,y-240);X.stroke();X.lineWidth=3;X.beginPath();X.moveTo(x,y-210);X.quadraticCurveTo(x-30,y-212,x-50,y-238);X.stroke();
 const hx=x-66,hy=y-238;X.save();X.translate(hx,hy);X.rotate(a);
 X.strokeStyle='#1b1c20';X.lineWidth=2.5;X.beginPath();X.moveTo(0,0);X.lineTo(0,12);X.stroke();
 X.fillStyle='#1b1c20';X.beginPath();X.moveTo(-16,24);X.lineTo(16,24);X.lineTo(9,12);X.lineTo(-9,12);X.fill();
 const fl=0.9+0.1*Math.sin(WK(61)*t);X.fillStyle=`rgba(255,${205+20*fl|0},140,1)`;X.beginPath();X.roundRect(-12,25,24,34,4);X.fill();X.fillStyle='#fff3d0';X.beginPath();X.ellipse(0,43,3,6*fl,0,0,6.28);X.fill();
 X.strokeStyle='#1b1c20';X.lineWidth=3;X.strokeRect(-12,25,24,34);X.beginPath();X.moveTo(0,25);X.lineTo(0,59);X.stroke();X.fillRect(-15,58,30,5);
 const gl=X.createRadialGradient(0,42,3,0,42,110);gl.addColorStop(0,'rgba(255,200,120,.45)');gl.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=gl;X.fillRect(-110,-68,220,220);
 X.restore();}
// rain puddles in the hollows of the path: they mirror the lamp light and ring with drops
const PUD=[[548,1770,62,11],[598,1575,34,6],[852,1745,52,9]];
function puddles(t){for(const [x,y,rx,ry] of PUD){X.fillStyle='rgba(8,12,10,.35)';X.beginPath();X.ellipse(x,y+1,rx*1.06,ry*1.2,0,0,6.28);X.fill();X.save();X.beginPath();X.ellipse(x,y,rx,ry,0,0,6.28);X.clip();
 const g=X.createLinearGradient(0,y-ry,0,y+ry);g.addColorStop(0,'#3c4458');g.addColorStop(1,'#272d3b');X.fillStyle=g;X.fillRect(x-rx,y-ry,rx*2,ry*2);
 const lx=POST.x-66;const rg=X.createRadialGradient(x+(lx-x)*0.25,y,1,x+(lx-x)*0.25,y,rx*0.9);rg.addColorStop(0,`rgba(255,200,130,${0.6*Math.max(0.25,1-Math.abs(lx-x)/400)})`);rg.addColorStop(1,'rgba(255,200,130,0)');X.fillStyle=rg;X.fillRect(x-rx,y-ry,rx*2,ry*2);
 for(let k=0;k<6;k++){const p=((t*1.5+k/6+x*0.01)%1);const px=x+(((k*53+x)%100)/100-0.5)*rx*1.4,py=y+(((k*29)%10)/10-0.5)*ry;X.strokeStyle=`rgba(230,235,250,${(1-p)*0.6})`;X.lineWidth=1.2;X.beginPath();X.ellipse(px,py,2+p*rx*0.3,0.6+p*ry*0.35,0,0,6.28);X.stroke();}
 X.restore();const e=X.createRadialGradient(x,y,rx*0.8,x,y,rx*1.15);e.addColorStop(0,'rgba(20,30,24,0)');e.addColorStop(1,'rgba(20,30,24,0)');}}
// rope fence along the cliff edge: posts grow toward us, the rope sags and shivers in the wind
function fence(t){const G=gust(t);const posts=[];for(let i=0;i<6;i++){const u=0.04+i*0.19,p=pt(EDGE,u);const k=(p[1]-1300)/400;posts.push([p[0]+30+k*40,p[1]+10+k*22,30+k*90,3+k*7]);}
 for(let i=0;i<posts.length-1;i++){const [x0,y0,h0]=posts[i],[x1,y1,h1]=posts[i+1];for(const f of [0.85,0.5]){const sag=10+((h0+h1)/2)*0.15+Math.sin(WK(5)*t+i)*3*G;
  X.strokeStyle='#8a7458';X.lineWidth=1.5+(h0+h1)/90;X.beginPath();X.moveTo(x0,y0-h0*f);X.quadraticCurveTo((x0+x1)/2,(y0-h0*f+y1-h1*f)/2+sag,x1,y1-h1*f);X.stroke();}}
 for(const [x,y,h,w] of posts){X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(x+w,y+2,w*2,w*0.6,0,0,6.28);X.fill();X.fillStyle='#3a2c22';X.fillRect(x-w,y-h,w*2,h);X.fillStyle='#5a4636';X.fillRect(x-w,y-h,w*0.7,h);X.fillStyle='#2a1f18';X.fillRect(x-w,y-h,w*2,w*0.6);}}
// long coastal grass in the foreground corners, all leaning with the same gust
function grass(t){const G=gust(t);const q=rng(7);
 for(const [bx0,bx1,by] of [[-30,330,1935],[860,1110,1935],[500,560,1940]]){for(let i=0;i<(bx1-bx0)/7;i++){const bx=bx0+q()*(bx1-bx0),h=90+q()*170,ph=q()*6.28;const bend=-(0.25+0.55*G)+0.12*Math.sin(WK(5)*t+ph+bx*0.01);
  X.strokeStyle=['#0b130e','#121d15','#18261c','#1f2f22'][i%4];X.lineWidth=2+q()*3;X.beginPath();X.moveTo(bx,by);X.quadraticCurveTo(bx+bend*h*0.3,by-h*0.55,bx+bend*h*0.85,by-h*(1-0.3*Math.abs(bend)));X.stroke();}}}
// rain in three depths, slanting with the wind; each drop falls a whole number of frame-heights per loop
const RR=rng(77);const DR=[...Array(760)].map(()=>({x:RR(),y:RR(),z:RR()}));
function rain(t,front){for(const d of DR){const isF=d.z>0.93;if(isF!==front)continue;const n=d.z<0.5?13:(d.z<0.85?17:22);const span=H+200;
 const y=((d.y*span+t*span*n/LOOP)%span)-100;const x=((d.x*(W+500)-(y+100)*0.32)%(W+500)+W+500)%(W+500)-250;
 const len=front?60:14+d.z*30,a=front?0.28:0.12+d.z*0.22;X.strokeStyle=`rgba(205,215,235,${a})`;X.lineWidth=front?2.4:0.9+d.z;X.beginPath();X.moveTo(x,y);X.lineTo(x+len*0.32,y-len);X.stroke();}}
function grade(t){const {f}=flashAt(t);if(f>0.002){X.fillStyle=`rgba(180,195,255,${f*0.35})`;X.fillRect(0,0,W,H);}
 const v=X.createRadialGradient(W/2,H*0.5,H*0.3,W/2,H*0.5,H*0.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(4,6,14,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.04;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
function caption(t){if(t>6.4)return;const a=Math.min(1,0.45+t/1.0)*Math.max(0,Math.min(1,(6.2-t)/1.5));
 X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*6,y=250;const bl=Math.max(0,(t-4.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
 X.font="italic 500 74px Corm, serif";X.shadowColor='rgba(255,220,170,.5)';X.shadowBlur=28;X.fillStyle='#fbf6ee';
 const C1=(window.CAP||['the light stays on','till every boat is home']);for(let k=0;k<2;k++){X.fillText(C1[0],x,y);X.fillText(C1[1],x,y+86);X.shadowBlur=0;}
 X.filter='none';X.globalAlpha=a*0.6;X.strokeStyle='#fbf6ee';X.lineWidth=1.5;X.beginPath();X.moveTo(x-55,y+146);X.lineTo(x+55,y+146);X.stroke();X.restore();}
window.draw=function(t){if(!STATIC)buildStatic();
 const tc=t-(window.TOFF||0);const z=1.1+0.03*(1-Math.cos(WK(1)*t))/2,Fx=520+16*Math.sin(WK(1)*t),Fy=1150;const ox=S*(Fx-Fx*z),oy=S*(Fy-Fy*z);
 const L=()=>X.setTransform(z/1.1,0,0,z/1.1,ox,oy),A=()=>X.setTransform(S*z,0,0,S*z,ox,oy);
 X.setTransform(1,0,0,1,0,0);L();X.drawImage(SKY,0,0);X.drawImage(CL,0,0);
 A();{const {f}=flashAt(t);if(f>0.002){X.save();X.globalAlpha=Math.min(1,f*4);X.globalCompositeOperation='lighter';L();X.drawImage(CL,0,0);X.restore();A();}}
 scud(t);skyLightning(t);
 L();X.save();X.beginPath();X.rect(0,HZ*S*1.1,1584,2816);X.clip();X.drawImage(SEA,0,0);X.restore();
 A();seaAnim(t);seaGlint(t);boat(t);beam(t,false);
 L();X.drawImage(STATIC,0,0);
 A();surf(t);smoke(t);glow(t);sillLamp(t);beam(t,true);fence(t);rain(t,false);lampPost(t);grass(t);rain(t,true);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(tc);};
draw(0);
