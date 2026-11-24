const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
const LOOP=20, WK=k=>2*Math.PI*k/LOOP;
const gust=t=>0.55+0.3*Math.sin(WK(1)*t)+0.15*Math.sin(WK(3)*t+1)+0.08*Math.sin(WK(9)*t);
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function off(){const c=document.createElement('canvas');c.width=W*S;c.height=H*S;const q=c.getContext('2d');q.scale(S,S);return [c,q];}
function rr(q,x,y,w,h,r){q.beginPath();q.moveTo(x+r,y);q.arcTo(x+w,y,x+w,y+h,r);q.arcTo(x+w,y+h,x,y+h,r);q.arcTo(x,y+h,x,y,r);q.arcTo(x,y,x+w,y,r);q.closePath();}
function ell(q,x,y,rx,ry){q.beginPath();q.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
function skyPaint(q){const g=q.createLinearGradient(0,0,0,1300);g.addColorStop(0,'#0b0f1a');g.addColorStop(0.5,'#171d2c');g.addColorStop(1,'#2a2f40');q.fillStyle=g;q.fillRect(0,0,W,1400);
 const r=rng(8);q.filter='blur(18px)';
 for(let i=0;i<55;i++){const x=r()*(W+300)-150,y=20+Math.pow(r(),1.1)*620,rx=120+r()*220,ry=40+r()*60;const lift=y/700;
  const cg=q.createRadialGradient(x,y+ry*0.4,4,x,y,rx);cg.addColorStop(0,`rgba(${64+lift*36|0},${72+lift*34|0},${92+lift*32|0},.5)`);cg.addColorStop(0.7,`rgba(${38+lift*24|0},${44+lift*24|0},${60+lift*24|0},.3)`);cg.addColorStop(1,'rgba(30,36,50,0)');
  q.fillStyle=cg;ell(q,x,y,rx,ry);q.fill();}
 for(let i=0;i<26;i++){const cx=r()*W,cy=120+r()*520;for(let k=0;k<8;k++){const px=cx+(k-4)*(26+r()*20),py=cy+Math.abs(k-4)*6+r()*10,pr=30+r()*36;const cg=q.createRadialGradient(px,py+pr*0.3,2,px,py,pr);cg.addColorStop(0,'rgba(88,96,118,.26)');cg.addColorStop(1,'rgba(60,66,84,0)');q.fillStyle=cg;q.beginPath();q.arc(px,py,pr,0,6.28);q.fill();}}
 q.filter='none';}
function shade(hex,k){const n=parseInt(hex.slice(1),16);const f=v=>clamp(Math.round(v*k),0,255);return `rgb(${f(n>>16)},${f((n>>8)&255)},${f(n&255)})`;}
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
 for(const [lx,ly,lr,k] of WARMS){const dd=Math.hypot(x-lx,y-ly);if(dd<lr)warm=Math.max(warm,(1-dd/lr)*k);}
 X.strokeStyle=warm>0.05?`rgba(255,${215-40*warm|0},${235-110*warm|0},${a+0.3*warm})`:`rgba(200,212,235,${a})`;X.lineWidth=front?2.2:0.9+d.z;X.beginPath();X.moveTo(x,y);X.lineTo(x+len*0.25,y-len);X.stroke();}}
function grade(t){const {f}=flashAt(t);if(f>0.002){X.fillStyle=`rgba(180,195,255,${f*0.18})`;X.fillRect(0,0,W,H);}
 const v=X.createRadialGradient(W/2,H*0.6,H*0.3,W/2,H*0.6,H*0.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(3,5,10,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.035;for(let i=0;i<1400;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;}
