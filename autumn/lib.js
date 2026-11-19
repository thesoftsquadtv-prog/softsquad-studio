const C=document.getElementById('c'); let X=C.getContext('2d'); const W=1080,H=1920,S=1440/1080;
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const LOOP=20, WK=k=>2*Math.PI*k/LOOP; // everything that moves repeats every 20 s, so the loop is seamless
const gust=t=>0.55+0.3*Math.sin(WK(1)*t)+0.15*Math.sin(WK(3)*t+1)+0.08*Math.sin(WK(9)*t)
function off(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}
const lerp=(a,b,u)=>a+(b-a)*u;
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;r=Math.max(0,Math.min(255,r*k|0));g=Math.max(0,Math.min(255,g*k|0));b=Math.max(0,Math.min(255,b*k|0));return `rgb(${r},${g},${b})`}
// ---------------- static painting helpers (draw into ctx q) ----------------
function planks(q,x,y,w,h,base,seed,vertical){const r=rng(seed);
 q.fillStyle=base;q.fillRect(x,y,w,h);
 if(vertical){for(let px=x;px<x+w;px+=26){q.fillStyle=shade(base,0.85+r()*0.3);q.fillRect(px,y,24,h);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(px+24,y,2,h);
   for(let k=0;k<3;k++){q.fillStyle='rgba(0,0,0,.12)';q.beginPath();q.ellipse(px+6+r()*12,y+r()*h,2,5,0,0,6.28);q.fill();}}}
 else{for(let py=y;py<y+h;py+=22){q.fillStyle=shade(base,0.85+r()*0.3);q.fillRect(x,py,w,20);q.fillStyle='rgba(0,0,0,.32)';q.fillRect(x,py+20,w,2);
   q.fillStyle='rgba(255,255,255,.05)';q.fillRect(x,py,w,2);
   for(let k=0;k<w/120;k++){q.fillStyle='rgba(0,0,0,.25)';q.fillRect(x+r()*w,py,2,20);}}}
}
function stones(q,x,y,w,h,seed){const r=rng(seed);q.fillStyle='#2b2f36';q.fillRect(x,y,w,h);
 for(let py=y;py<y+h;py+=24){let px=x-(r()*20);while(px<x+w){const sw=34+r()*40;q.fillStyle=['#5b5f66','#4f545c','#666a70','#575049'][(r()*4)|0];
  q.beginPath();q.roundRect(px+2,py+2,sw-4,20,8);q.fill();q.fillStyle='rgba(255,255,255,.07)';q.beginPath();q.roundRect(px+4,py+3,sw-10,6,4);q.fill();
  if(r()<0.3){q.fillStyle='rgba(90,130,70,.55)';q.beginPath();q.ellipse(px+sw*0.5,py+4,sw*0.3,4,0,0,6.28);q.fill();}
  px+=sw;}}}
function roof(q,pts,base,seed){ // pts: polygon; shingles clipped inside
 const r=rng(seed);q.save();q.beginPath();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();q.clip();
 const ys=pts.map(p=>p[1]),xs=pts.map(p=>p[0]);const y0=Math.min(...ys),y1=Math.max(...ys),x0=Math.min(...xs),x1=Math.max(...xs);
 q.fillStyle=shade(base,0.7);q.fillRect(x0,y0,x1-x0,y1-y0);
 for(let py=y0;py<y1+20;py+=20){const o=((py/20)|0)%2?15:0;for(let px=x0-30+o;px<x1+30;px+=30){q.fillStyle=shade(base,0.8+r()*0.4);
  q.beginPath();q.moveTo(px,py);q.lineTo(px+28,py);q.lineTo(px+28,py+14);q.quadraticCurveTo(px+14,py+24,px,py+14);q.closePath();q.fill();
  q.fillStyle='rgba(0,0,0,.25)';q.fillRect(px,py+18,28,2);}}
 // moss patches
 for(let k=0;k<12;k++){const mx=x0+r()*(x1-x0),my=y0+(0.4+0.6*r())*(y1-y0);const g=q.createRadialGradient(mx,my,2,mx,my,30+r()*40);
  g.addColorStop(0,'rgba(78,104,60,.55)');g.addColorStop(1,'rgba(78,104,60,0)');q.fillStyle=g;q.fillRect(mx-70,my-70,140,140);
  for(let d=0;d<20;d++){q.fillStyle=r()>0.5?'rgba(110,140,80,.35)':'rgba(60,90,50,.4)';q.beginPath();q.arc(mx+(r()-0.5)*50,my+(r()-0.5)*30,2+r()*3,0,6.28);q.fill();}}
 // wet sheen
 const sh=q.createLinearGradient(x0,y0,x1,y1);sh.addColorStop(0,'rgba(170,200,230,.05)');sh.addColorStop(0.5,'rgba(170,200,230,0)');sh.addColorStop(1,'rgba(170,200,230,.03)');q.fillStyle=sh;q.fillRect(x0,y0,x1-x0,y1-y0);
 q.restore();
 q.strokeStyle='#2a1d17';q.lineWidth=10;q.lineJoin='round';q.beginPath();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();
}
function windowFrame(q,x,y,w,h,seed,round,interior){ // interior drawn warm; frame, mullions, sill + flower box
 const r=rng(seed);
 q.save();q.beginPath();round?q.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,6.28):q.roundRect(x,y,w,h,6);q.clip();
 const g=q.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#ffcf8a');g.addColorStop(1,'#e98a4a');q.fillStyle=g;q.fillRect(x,y,w,h);
 // room silhouettes: shelf, books, plant, hanging lamp
 q.fillStyle='rgba(120,55,30,.55)';q.fillRect(x,y+h*0.55,w,6);
 for(let k=0;k<6;k++){q.fillStyle=['#a24e3a','#7a5a9a','#c2843a','#5d7a4a'][k%4];q.globalAlpha=0.55;q.fillRect(x+8+k*(w/8),y+h*0.55-18-r()*10,w/12,18+r()*10);}q.globalAlpha=1;
 q.fillStyle='rgba(70,110,60,.7)';for(let k=0;k<5;k++){q.beginPath();q.ellipse(x+w*0.8+(r()-0.5)*14,y+h*0.62-k*7,9,5,r()*3,0,6.28);q.fill();}
 q.strokeStyle='rgba(90,40,20,.5)';q.lineWidth=2;q.beginPath();q.moveTo(x+w*0.35,y);q.lineTo(x+w*0.35,y+h*0.25);q.stroke();q.fillStyle='#fff1c8';q.beginPath();q.arc(x+w*0.35,y+h*0.3,8,0,6.28);q.fill();
 if(interior==='person'){q.fillStyle='rgba(70,35,40,.55)';q.beginPath();q.arc(x+w*0.55,y+h*0.58,16,0,6.28);q.fill();q.fillRect(x+w*0.55-22,y+h*0.66,44,h);}
 // curtains
 q.fillStyle='rgba(200,90,90,.55)';q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(x+w*0.22,y+h*0.5,x+w*0.08,y+h);q.lineTo(x,y+h);q.fill();
 q.beginPath();q.moveTo(x+w,y);q.quadraticCurveTo(x+w*0.78,y+h*0.5,x+w*0.92,y+h);q.lineTo(x+w,y+h);q.fill();
 // rain-streaked glass
 if(interior!=='watcher'&&interior!=='open'){q.strokeStyle='rgba(255,255,255,.18)';q.lineWidth=1.5;}for(let k=0;k<0;k++){const sx=x+r()*w;q.beginPath();q.moveTo(sx,y+r()*h*0.3);q.lineTo(sx+(r()-0.5)*6,y+h);q.stroke();}
 q.restore();
 q.strokeStyle='#3a2418';q.lineWidth=8;q.beginPath();round?q.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,6.28):q.roundRect(x,y,w,h,6);q.stroke();
 if(interior==='watcher')window.WATCH={x,y,w,h}; if(interior==='open')window.OPENW={x,y,w,h};
 if(interior!=='watcher'&&interior!=='open'){q.lineWidth=5;q.beginPath();q.moveTo(x+w/2,y);q.lineTo(x+w/2,y+h);q.moveTo(x,y+h/2);q.lineTo(x+w,y+h/2);q.stroke();}
 if(!round){q.fillStyle='#4a2e1f';q.fillRect(x-10,y+h,w+20,10);
  q.fillStyle='#6b4026';q.fillRect(x-4,y+h+10,w+8,24);q.fillStyle='#5a3520';q.fillRect(x-4,y+h+30,w+8,4);
  for(let k=0;k<9;k++){q.fillStyle=['#e86a7a','#ffd166','#f4a6c8','#ff8f5a'][k%4];q.beginPath();q.arc(x+4+k*(w/8),y+h+6-r()*8,6,0,6.28);q.fill();
   q.fillStyle='#4f7a46';q.beginPath();q.ellipse(x+k*(w/8),y+h+12,8,5,r(),0,6.28);q.fill();}}
 return {x,y,w,h};
}
function door(q,x,y,w,h,seed){planks(q,x,y,w,h,'#6a3f2a',seed,true);q.strokeStyle='#2c1a10';q.lineWidth=8;q.beginPath();q.roundRect(x,y,w,h,[w/2,w/2,0,0]);q.stroke();
 q.fillStyle='#e0b36a';q.beginPath();q.arc(x+w*0.8,y+h*0.55,6,0,6.28);q.fill();q.fillStyle='#ffcf8a';q.fillRect(x+w*0.3,y+h*0.15,w*0.4,h*0.18);
 q.strokeStyle='#2c1a10';q.lineWidth=4;q.strokeRect(x+w*0.3,y+h*0.15,w*0.4,h*0.18);}

// ---------------- scene composition ----------------
const LIGHTS=[]; // warm light sources for flicker glow overlays [x,y,radius,phase]
const CHIMNEYS=[];
function cottage(q,o){ // o:{x,y(ground),w,h,roofH,wall,roof,seed,stone,windows:[...],door,dormer,chim,round}
 const {x,y,w,h,roofH}=o; const top=y-h;
 // stone base
 if(o.stone) stones(q,x,y-o.stone,w,o.stone,o.seed+1);
 planks(q,x,top,w,h-(o.stone||0),o.wall,o.seed+2,o.vertical);
 // timber frame beams
 q.fillStyle='#3a2418';q.fillRect(x-6,top,14,h);q.fillRect(x+w-8,top,14,h);q.fillRect(x-6,top-4,w+12,12);
 // windows
 (o.windows||[]).forEach((wn,i)=>{const R=windowFrame(q,x+wn[0],top+wn[1],wn[2],wn[3],o.seed+10+i,wn[4],wn[5]);LIGHTS.push([R.x+R.w/2,R.y+R.h/2,Math.max(R.w,R.h)*1.6,o.seed+i]);});
 if(o.door&&o.doorOpen){doorway(q,x+o.door[0],y-o.door[2],o.door[1],o.door[2]);}else if(o.door){door(q,x+o.door[0],y-o.door[2],o.door[1],o.door[2],o.seed+30);}
 // roof
 const ov=40;
 if(o.chim){const cx=x+w*o.chim, cy=top-roofH*0.62; stones(q,cx,cy-110,54,top-cy+110,o.seed+50);q.fillStyle='#2b2f36';q.fillRect(cx-6,cy-122,66,16);CHIMNEYS.push([cx+27,cy-124]);}
 roof(q,[[x-ov,top+6],[x+w/2,top-roofH],[x+w+ov,top+6],[x+w+ov,top+26],[x-ov,top+26]],o.roof,o.seed+40);
 if(o.chim){const cx=x+w*o.chim, cy=top-roofH*0.62; const rx=cx+27; const ry= rx<x+w/2 ? lerp(top+6,top-roofH,(rx-(x-ov))/(w/2+ov)) : lerp(top-roofH,top+6,(rx-(x+w/2))/(w/2+ov));
  q.save();q.beginPath();q.rect(cx,cy-110,54,Math.max(0,ry-(cy-110)+6));q.clip();stones(q,cx,cy-110,54,ry-cy+120,o.seed+50);q.restore();q.fillStyle='#2b2f36';q.fillRect(cx-6,cy-122,66,16);}
 if(o.dormer){const dx=x+w*0.5-60, dy=top-roofH*0.5; planks(q,dx,dy,120,90,o.wall,o.seed+60,true);
  windowFrame(q,dx+28,dy+16,64,58,o.seed+61,true);LIGHTS.push([dx+60,dy+45,110,o.seed+61]);
  roof(q,[[dx-20,dy+4],[dx+60,dy-60],[dx+140,dy+4],[dx+140,dy+18],[dx-20,dy+18]],o.roof,o.seed+62);}
 if(o.lanternAnim){window.LANT={x:x+o.lanternAnim[0],y:top+o.lanternAnim[1]};}
 if(o.lantern){const lx=x+o.lantern[0],ly=top+o.lantern[1];q.fillStyle='#2c1a10';q.fillRect(lx-3,ly-30,6,30);q.fillRect(lx-14,ly,28,6);
  q.fillStyle='#ffd58a';q.beginPath();q.roundRect(lx-11,ly+6,22,30,5);q.fill();q.strokeStyle='#2c1a10';q.lineWidth=3;q.strokeRect(lx-11,ly+6,22,30);LIGHTS.push([lx,ly+20,160,o.seed+70]);}
 // porch overhang + steps
 if(o.porch){const [px,pw]=o.porch;q.fillStyle='#3a2418';q.fillRect(x+px,y-o.door[2]-26,pw,14);q.fillRect(x+px+6,y-o.door[2]-12,10,o.door[2]+12);q.fillRect(x+px+pw-16,y-o.door[2]-12,10,o.door[2]+12);
  q.fillStyle='#5b5f66';q.fillRect(x+px-10,y,pw+20,14);q.fillStyle='#4f545c';q.fillRect(x+px,y+14,pw,12);}
}
function doorway(q,x,y,w,h){window.DOOR={x,y,w,h};
 q.save();q.beginPath();q.roundRect(x,y,w,h,[w/2,w/2,0,0]);q.clip();
 const g=q.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#f6c07e');g.addColorStop(1,'#b8643a');q.fillStyle=g;q.fillRect(x,y,w,h);
 q.fillStyle='rgba(110,50,30,.55)';q.fillRect(x,y+h*0.72,w,h*0.28);           // floor inside
 q.fillStyle='rgba(170,60,50,.6)';q.beginPath();q.ellipse(x+w*0.5,y+h*0.86,w*0.4,h*0.06,0,0,6.28);q.fill(); // rug
 q.fillStyle='rgba(90,40,25,.5)';q.fillRect(x+w*0.62,y+h*0.32,w*0.3,h*0.4);  // a cabinet in the hall
 q.fillStyle='#fff1c8';q.beginPath();q.arc(x+w*0.3,y+h*0.26,7,0,6.28);q.fill();
 q.restore();q.strokeStyle='#2c1a10';q.lineWidth=8;q.beginPath();q.roundRect(x,y,w,h,[w/2,w/2,0,0]);q.stroke();}
// door swinging in the wind (hinged on its left edge, opening inwards)
function doorAnim(t){const D=window.DOOR;if(!D)return;const G=gust(t);
 const open=0.42+0.32*G+0.12*Math.sin(t*1.9)+0.05*Math.sin(t*5.3);const th=open*Math.PI/2;const c=Math.cos(th),sn=Math.sin(th);
 // light spilling out over the porch
 const sp=X.createLinearGradient(0,D.y+D.h,0,D.y+D.h+150);sp.addColorStop(0,`rgba(255,185,110,${0.35*(1-c)})`);sp.addColorStop(1,'rgba(255,185,110,0)');
 X.fillStyle=sp;X.beginPath();X.moveTo(D.x+D.w*c,D.y+D.h);X.lineTo(D.x+D.w,D.y+D.h);X.lineTo(D.x+D.w+90,D.y+D.h+150);X.lineTo(D.x-20+D.w*c,D.y+D.h+150);X.fill();
 const cy=D.y+D.h*0.55;
 const P=(u,v)=>{const ax=D.x+u*D.w*c;const yy=D.y+v*D.h;const k=1-0.16*sn*u;return [ax,cy+(yy-cy)*k];};
 const archV=u=>{const r=D.w/2,dx=u*D.w-r;return (r-Math.sqrt(Math.max(0,r*r-dx*dx)))/D.h;};
 const path=new Path2D();for(let i=0;i<=16;i++){const u=i/16;const p=P(u,archV(u));i?path.lineTo(p[0],p[1]):path.moveTo(p[0],p[1]);}
 const b1=P(1,1),b0=P(0,1);path.lineTo(b1[0],b1[1]);path.lineTo(b0[0],b0[1]);path.closePath();
 const dg=X.createLinearGradient(D.x,0,D.x+D.w*c,0);dg.addColorStop(0,'#5a341f');dg.addColorStop(1,shade('#6a3f2a',0.75-0.25*sn));X.fillStyle=dg;X.fill(path);
 X.save();X.clip(path);X.strokeStyle='rgba(0,0,0,.35)';X.lineWidth=2;for(let k=1;k<5;k++){const a=P(k/5,0),b=P(k/5,1);X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke();}
 const wa=P(0.3,0.15),wb=P(0.7,0.33);X.fillStyle='rgba(255,207,138,.8)';X.fillRect(wa[0],wa[1],wb[0]-wa[0],wb[1]-wa[1]);X.restore();
 // door edge (thickness) catching the light
 const e0=P(1,archV(1)+0.02),e1=P(1,1);X.strokeStyle=`rgba(230,170,110,${0.3+0.5*sn})`;X.lineWidth=3+5*sn;X.beginPath();X.moveTo(e0[0],e0[1]);X.lineTo(e1[0],e1[1]);X.stroke();
 const hd=P(0.82,0.55);X.fillStyle='#e0b36a';X.beginPath();X.arc(hd[0],hd[1],5,0,6.28);X.fill();}
// casement window blown open: two sashes flapping outside the frame, curtain fluttering out
function openWindowAnim(t){const O=window.OPENW;if(!O)return;const G=gust(t);
 const sash=(hx,dir,ph)=>{const phi=1.75+0.55*G*Math.sin(t*1.6+ph)+0.2*Math.sin(t*4.1+ph);const c=Math.cos(phi),sn=Math.sin(phi);const sw=O.w/2;
  const ex=hx+dir*sw*c, k=1+0.18*sn;const cy=O.y+O.h/2;const top0=O.y,bot0=O.y+O.h;
  const pts=[[hx,top0],[ex,cy+(top0-cy)*k],[ex,cy+(bot0-cy)*k],[hx,bot0]];
  X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.closePath();
  X.fillStyle='rgba(170,200,230,.22)';X.fill();X.strokeStyle='#3a2418';X.lineWidth=7;X.stroke();
  X.lineWidth=4;X.beginPath();X.moveTo(hx,(top0+bot0)/2);X.lineTo(ex,cy);X.stroke();
  X.strokeStyle='rgba(255,230,190,.35)';X.lineWidth=2;X.beginPath();X.moveTo(hx+(ex-hx)*0.3,top0+8);X.lineTo(hx+(ex-hx)*0.6,bot0-10);X.stroke();};
 // curtain billowing out of the window
 const cg=X.createLinearGradient(O.x,0,O.x+O.w+60,0);cg.addColorStop(0,'rgba(250,246,240,.9)');cg.addColorStop(1,'rgba(250,246,240,.45)');X.fillStyle=cg;
 X.beginPath();X.moveTo(O.x+O.w*0.55,O.y+4);for(let i=0;i<=10;i++){const v=i/10;const out=G*70*Math.pow(v,1.3);X.lineTo(O.x+O.w*0.62+out+Math.sin(t*3.2+v*5)*10*v,O.y+4+v*O.h*1.05-G*25*v*v);}
 for(let i=10;i>=0;i--){const v=i/10;const out=G*50*Math.pow(v,1.3);X.lineTo(O.x+O.w*0.9+out+Math.sin(t*3.2+v*5+0.6)*10*v,O.y+4+v*O.h*1.05-G*25*v*v);}X.closePath();X.fill();
 sash(O.x,-1,0);sash(O.x+O.w,1,1.3);}
// someone sitting at the window, chin resting on both hands, watching the rain
function sideWall(q,o){const {w,h,roofH}=o,top=-h,dx=w*0.34,dy=w*0.17,ov=40;
 const k=-dy/dx;
 // wall
 q.save();q.beginPath();q.moveTo(w,top);q.lineTo(w+dx,top-dy);q.lineTo(w+dx,-dy);q.lineTo(w,0);q.closePath();q.clip();
 q.save();q.transform(1,k,0,1,w,0);planks(q,0,top-10,dx+10,h+20,hexShade(o.wall,0.78),o.seed+80,o.vertical);if(o.stone)stones(q,0,-o.stone,dx+10,o.stone+4,o.seed+81);q.restore();
 const g=q.createLinearGradient(w,0,w+dx,0);g.addColorStop(0,'rgba(10,15,30,.12)');g.addColorStop(1,'rgba(10,15,30,.38)');q.fillStyle=g;q.fillRect(w-5,top-dy-10,dx+10,h+dy+20);
 if(o.sideWin){q.save();q.transform(1,k,0,1,w,0);const sw=dx*0.38,sx=dx*0.32,sy=top+h*0.25;const gg=q.createLinearGradient(0,sy,0,sy+sw);gg.addColorStop(0,'#ffcf8a');gg.addColorStop(1,'#d9824a');q.fillStyle=gg;q.fillRect(sx,sy,sw,sw*1.1);q.strokeStyle='#3a2418';q.lineWidth=6;q.strokeRect(sx,sy,sw,sw*1.1);q.lineWidth=3;q.beginPath();q.moveTo(sx+sw/2,sy);q.lineTo(sx+sw/2,sy+sw*1.1);q.stroke();q.restore();LIGHTS.push([w+dx*0.5,top+h*0.3-dy*0.5,dx*0.9,o.seed+90]);}
 q.restore();
 q.strokeStyle='#3a2418';q.lineWidth=12;q.beginPath();q.moveTo(w+dx,top-dy);q.lineTo(w+dx,-dy);q.stroke();
 // roof running back from the front gable
 const A=[w/2,top-roofH],E=[w+ov,top+6],E2=[w+ov,top+26];
 roof(q,[A,[A[0]+dx,A[1]-dy],[E[0]+dx,E[1]-dy],[E2[0]+dx,E2[1]-dy],E2,E],o.roof,o.seed+82);
 q.fillStyle='rgba(10,15,30,.28)';q.beginPath();q.moveTo(A[0],A[1]);q.lineTo(A[0]+dx,A[1]-dy);q.lineTo(E2[0]+dx,E2[1]-dy);q.lineTo(E2[0],E2[1]);q.closePath();q.fill();}
const HOUSES=[];
function hexShade(hex,k){const n=parseInt(hex.slice(1),16);const c=[n>>16,(n>>8)&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*k))));return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');}
function house(q,o,tx,ty,s){const n0=LIGHTS.length,c0=CHIMNEYS.length;
 q.save();q.translate(tx,ty);q.scale(s,s);
 const cs=q.createRadialGradient(o.w*0.6,6,10,o.w*0.6,6,o.w*0.9);cs.addColorStop(0,'rgba(5,8,10,.55)');cs.addColorStop(1,'rgba(5,8,10,0)');q.fillStyle=cs;q.beginPath();q.ellipse(o.w*0.62,4,o.w*0.85,40,-0.12,0,6.28);q.fill();
 sideWall(q,o);cottage(q,Object.assign({x:0,y:0},o));q.restore();
 for(let i=n0;i<LIGHTS.length;i++){const L=LIGHTS[i];LIGHTS[i]=[tx+L[0]*s,ty+L[1]*s,L[2]*s,L[3]];}
 for(let i=c0;i<CHIMNEYS.length;i++){const c=CHIMNEYS[i];CHIMNEYS[i]=[tx+c[0]*s,ty+c[1]*s,s];}
 const T=[tx,ty,s];['WATCH','OPENW','DOOR','LANT'].forEach(k=>{if(window[k]&&!window[k].T)window[k].T=T;});
 const refl=[];
 HOUSES.push({o,T,refl,eave:[tx+(-40)*s,tx+(o.w+40)*s,ty+(-o.h+26)*s]});}
