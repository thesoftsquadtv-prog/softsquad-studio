// safe space after dark — "he saved me the last slice". Late night, she has just got home: the kitchen is dark except the
// under-cabinet light he left on. On the counter: the last slice of pumpkin pie on a plate, a fork on a folded napkin, a little
// folded note in his handwriting, her keys just dropped, a mug of tea still steaming, and his phone-message at 7.2 s.
// Design space 1080x1920, rendered 1440x2560. Counter plane projected with K (vertical squash ≈ looking down ~30°).
const C=document.getElementById('c');const X=C.getContext('2d');const W=1080,H=1920,S=1440/1080;
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=u=>u<0?0:u>1?1:u*u*(3-2*u);
const K=0.5, BACK=1010, FRONT=1790;           // counter back edge / front edge (screen y)
const PC=[500,1330];                           // plate centre on the counter
const P=(cx,cy,u,v,h=0)=>[cx+u,cy+v*K-h];
const BUZZ=7.2;
function ell(q,x,y,rx,ry){q.beginPath();q.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
function rr(q,x,y,w,h,r){q.beginPath();q.moveTo(x+r,y);q.arcTo(x+w,y,x+w,y+h,r);q.arcTo(x+w,y+h,x,y+h,r);q.arcTo(x,y+h,x,y,r);q.arcTo(x,y,x+w,y,r);q.closePath();}
function heartPath(q,x,y,s){q.beginPath();q.moveTo(x,y+s*0.8);q.bezierCurveTo(x-s*1.2,y-s*0.1,x-s*0.6,y-s*0.95,x,y-s*0.35);q.bezierCurveTo(x+s*0.6,y-s*0.95,x+s*1.2,y-s*0.1,x,y+s*0.8);}

// ---------- static layer (drawn once) ----------
let STATIC=null;const SR=2;
function buildStatic(){
 const c=document.createElement('canvas');c.width=W*SR;c.height=H*SR;const q=c.getContext('2d');q.scale(SR,SR);
 // back wall
 let g=q.createLinearGradient(0,0,0,BACK);g.addColorStop(0,'#1a1a2a');g.addColorStop(1,'#2a2530');q.fillStyle=g;q.fillRect(0,0,W,BACK);
 // window (left) — the night outside is drawn live; here only the frame, sill and a small plant
 // tiles under the cabinet (right)
 const tx0=560;q.save();q.beginPath();q.rect(tx0,330,W-tx0,BACK-330);q.clip();
 q.fillStyle='#3a3440';q.fillRect(tx0,330,W-tx0,BACK-330);
 for(let r=0;r<12;r++){const y=330+r*58;for(let k=-1;k<7;k++){const x=tx0+k*118+(r%2?59:0);
   const tg=q.createLinearGradient(x,y,x,y+56);tg.addColorStop(0,'#4a4250');tg.addColorStop(1,'#3e3745');q.fillStyle=tg;rr(q,x+2,y+2,114,54,6);q.fill();
   q.fillStyle='rgba(255,255,255,.05)';q.fillRect(x+8,y+6,100,4);}}
 q.restore();
 // upper cabinet (right) with the strip light under it
 g=q.createLinearGradient(0,0,0,330);g.addColorStop(0,'#2b2320');g.addColorStop(1,'#3a2e28');q.fillStyle=g;q.fillRect(tx0-10,0,W-tx0+10,330);
 q.fillStyle='rgba(0,0,0,.25)';q.fillRect(tx0-10,0,8,330);q.fillRect(820,0,6,320);
 q.strokeStyle='rgba(255,220,180,.10)';q.lineWidth=2;q.strokeRect(tx0+24,30,230,270);q.strokeRect(850,30,206,270);
 q.fillStyle='#b9a58c';rr(q,800,190,8,56,4);q.fill();rr(q,872,190,8,56,4);q.fill();
 q.fillStyle='#211a17';q.fillRect(tx0-10,318,W-tx0+10,16);                       // cabinet bottom rail
 q.fillStyle='#2a221e';q.fillRect(tx0+6,332,W-tx0-12,10);                           // strip housing (glow drawn live)
 q.fillStyle='#d6d0c8';q.globalAlpha=.5;q.fillRect(tx0-12,332,3,BACK-332);q.globalAlpha=1;     // tile edge trim
 q.fillStyle='rgba(0,0,0,.25)';q.fillRect(tx0-30,332,18,BACK-332);
 // warm wash down the tiles from the strip (lights the wall below it, falling off)
 g=q.createLinearGradient(0,334,0,BACK);g.addColorStop(0,'rgba(255,196,120,.55)');g.addColorStop(0.35,'rgba(255,170,100,.22)');g.addColorStop(1,'rgba(255,150,90,.08)');
 q.fillStyle=g;q.fillRect(tx0,334,W-tx0,BACK-334);
 // window frame
 const wx=70,wy=170,ww=420,wh=680;
 q.fillStyle='#2e2a35';rr(q,wx-26,wy-26,ww+52,wh+52,8);q.fill();
 q.fillStyle='#d8d2c8';q.globalAlpha=.16;rr(q,wx-26,wy-26,ww+52,wh+52,8);q.fill();q.globalAlpha=1;
 q.fillStyle='#24202b';q.fillRect(wx-10,wy-10,ww+20,wh+20);q.fillStyle='rgba(150,170,220,.10)';q.fillRect(wx-10,wy-10,10,wh+20);
 q.clearRect(wx,wy,ww,wh);                                                         // glass: night is drawn live underneath
 // sill (deep enough for a pot), lit cool from the window above
 q.fillStyle='#3b3540';q.beginPath();q.moveTo(wx-46,wy+wh+22);q.lineTo(wx+ww+46,wy+wh+22);q.lineTo(wx+ww+60,wy+wh+58);q.lineTo(wx-60,wy+wh+58);q.closePath();q.fill();
 q.fillStyle='rgba(150,170,220,.18)';q.fillRect(wx-46,wy+wh+22,ww+92,6);
 q.fillStyle='#2a2530';q.fillRect(wx-60,wy+wh+58,ww+120,16);
 // counter top (warm oak butcher block) in perspective
 g=q.createLinearGradient(0,BACK,0,FRONT);g.addColorStop(0,'#5a4030');g.addColorStop(1,'#7a5538');q.fillStyle=g;q.fillRect(0,BACK,W,FRONT-BACK);
 const r=rng(11);
 for(let i=0;i<22;i++){ // staves converge slightly toward the back
   const xf=-200+i*76,xb=lerp(xf,540,0.22);q.strokeStyle='rgba(30,18,10,.28)';q.lineWidth=1.6;q.beginPath();q.moveTo(xb,BACK);q.lineTo(xf,FRONT);q.stroke();
   for(let j=0;j<5;j++){const u=r(),x1=lerp(xb,xf,u)+r()*60,y1=lerp(BACK,FRONT,u);q.strokeStyle=`rgba(${r()>.5?'255,220,170':'40,22,12'},.06)`;q.lineWidth=1;q.beginPath();q.moveTo(x1,y1);q.lineTo(x1+(xf-xb)*0.12,y1+90);q.stroke();}}
 // warm pool on the counter under the strip light (right-back) and a soft spill toward the plate
 g=q.createRadialGradient(820,1060,20,820,1080,640);g.addColorStop(0,'rgba(255,200,130,.55)');g.addColorStop(0.5,'rgba(255,170,100,.18)');g.addColorStop(1,'rgba(255,150,90,0)');
 q.save();q.beginPath();q.rect(0,BACK,W,FRONT-BACK);q.clip();q.fillStyle=g;q.fillRect(0,BACK,W,FRONT-BACK);q.restore();
 // back edge shadow line where counter meets wall
 q.fillStyle='rgba(0,0,0,.35)';q.fillRect(0,BACK-3,W,8);
 // counter front edge + face
 q.fillStyle='#8a6242';q.fillRect(0,FRONT,W,10);q.fillStyle='rgba(255,220,170,.18)';q.fillRect(0,FRONT,W,2);
 g=q.createLinearGradient(0,FRONT+10,0,H);g.addColorStop(0,'#3a2a20');g.addColorStop(1,'#1b1412');q.fillStyle=g;q.fillRect(0,FRONT+10,W,H-FRONT-10);
 q.fillStyle='rgba(0,0,0,.3)';q.fillRect(0,FRONT+10,W,14);
 q.strokeStyle='rgba(255,220,180,.06)';q.lineWidth=2;q.strokeRect(40,FRONT+40,470,200);q.strokeRect(570,FRONT+40,470,200);
 STATIC=c;
}

// ---------- window: night, rain, bokeh ----------
function windowNight(t){
 const wx=70,wy=170,ww=420,wh=680;
 X.save();rr(X,wx,wy,ww,wh,4);X.clip();
 let g=X.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,'#0f1630');g.addColorStop(0.7,'#1d2546');g.addColorStop(1,'#2b2a48');X.fillStyle=g;X.fillRect(wx,wy,ww,wh);
 // distant blurred windows / street lights
 const r=rng(5);X.filter='blur(10px)';
 for(let i=0;i<26;i++){const x=wx+r()*ww,y=wy+wh*0.45+r()*wh*0.55,s=8+r()*22,warm=r()>0.35;
   X.fillStyle=warm?`rgba(255,${170+(r()*50|0)},110,${0.35+r()*0.35})`:`rgba(150,180,255,${0.25+r()*0.3})`;ell(X,x,y,s,s);X.fill();}
 X.filter='none';
 // rain streaks outside (falling, fixed angle)
 X.strokeStyle='rgba(190,205,240,.22)';X.lineWidth=1.4;
 for(let i=0;i<70;i++){const rr2=rng(100+i);const x0=wx+rr2()*ww,sp=900+rr2()*500,ph=rr2();const y=wy+(((t*sp/wh)+ph)%1)*(wh+80)-60;
   X.beginPath();X.moveTo(x0,y);X.lineTo(x0-6,y+42);X.stroke();}
 // drops on the glass: static beads + a few running drops with trails
 for(let i=0;i<90;i++){const rb=rng(300+i);const x=wx+rb()*ww,y=wy+rb()*wh,s=1.5+rb()*3.5;
   X.fillStyle='rgba(120,140,190,.22)';ell(X,x,y,s,s*1.15);X.fill();X.strokeStyle='rgba(10,15,35,.45)';X.lineWidth=0.8;X.stroke();X.fillStyle='rgba(225,235,255,.7)';ell(X,x-s*0.3,y-s*0.35,s*0.4,s*0.4);X.fill();}
 for(let i=0;i<6;i++){const rb=rng(700+i);const x=wx+30+rb()*(ww-60),per=5+rb()*6,ph=rb()*per;const u=((t+ph)%per)/per;const y=wy+u*wh*1.1;
   X.strokeStyle='rgba(180,200,240,.16)';X.lineWidth=2.4;X.beginPath();X.moveTo(x,y-140*u-20);X.quadraticCurveTo(x+3,y-40,x,y);X.stroke();
   X.fillStyle='rgba(120,140,190,.3)';ell(X,x,y,4.5,5.5);X.fill();X.strokeStyle='rgba(10,15,35,.5)';X.lineWidth=0.8;X.stroke();X.fillStyle='rgba(220,232,255,.6)';ell(X,x-1.4,y-1.8,1.6,1.6);X.fill();}
 X.restore();
 // mullions (drawn over the glass)
 X.fillStyle='#2e2a35';X.fillRect(wx+ww/2-9,wy,18,wh);X.fillRect(wx,wy+wh*0.42-9,ww,18);
 X.fillStyle='rgba(150,170,220,.16)';X.fillRect(wx+ww/2-9,wy,3,wh);X.fillRect(wx,wy+wh*0.42-9,ww,3);
}
// small fern in a pot on the sill, swaying a touch in the draft
function strip(t){
 const fl=1+0.015*Math.sin(t*2.3);X.save();X.fillStyle='#fff2d6';X.fillRect(570,340,500,4);
 X.globalCompositeOperation='screen';X.filter='blur(6px)';X.fillStyle=`rgba(255,214,150,${0.8*fl})`;X.fillRect(566,336,508,12);
 X.filter='blur(22px)';X.fillStyle=`rgba(255,190,120,${0.45*fl})`;X.fillRect(560,330,520,40);X.restore();}
function plant(t){
 const x=400,y=870+12;X.save();
 // pot
 X.fillStyle='#b9775a';X.beginPath();X.moveTo(x-38,y-60);X.lineTo(x+38,y-60);X.lineTo(x+30,y+8);X.lineTo(x-30,y+8);X.closePath();X.fill();
 X.fillStyle='#a3664c';X.fillRect(x-42,y-66,84,14);X.fillStyle='rgba(150,170,220,.25)';X.fillRect(x-42,y-66,6,14);
 X.fillStyle='rgba(0,0,0,.35)';ell(X,x,y+10,40,6);X.fill();
 // fronds
 for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*0.32+Math.sin(t*0.9+i)*0.03;const L=90+((i*37)%30);
   const ex=x+Math.cos(a)*L,ey=y-62+Math.sin(a)*L;X.strokeStyle='#3f6b4a';X.lineWidth=3;X.beginPath();X.moveTo(x,y-62);X.quadraticCurveTo(x+Math.cos(a)*L*0.5,y-62+Math.sin(a)*L*0.6-14,ex,ey);X.stroke();
   for(let k=1;k<9;k++){const u=k/9,px=lerp(x,ex,u),py=lerp(y-62,ey,u)-Math.sin(u*Math.PI)*10,l=12*(1-u*0.6);
     X.fillStyle=k%2?'#4f8059':'#467452';for(const sd of[-1,1]){X.beginPath();X.ellipse(px+sd*l*0.6*Math.sin(a),py-sd*l*0.6*Math.cos(a),l,3.2,a+sd*0.9,0,Math.PI*2);X.fill();}}}
 X.restore();
}

// ---------- the pie on its plate ----------
function plate(){
 const [cx,cy]=PC;
 // contact shadow (light from back-right → shadow falls front-left)
 X.save();X.filter='blur(14px)';X.fillStyle='rgba(20,10,5,.55)';ell(X,cx-24,cy+22,250,118);X.fill();X.restore();
 // plate body
 let g=X.createLinearGradient(cx-250,cy-120,cx+250,cy+120);g.addColorStop(0,'#cfcac4');g.addColorStop(0.55,'#f4efe8');g.addColorStop(1,'#fffaf1');
 X.fillStyle='#bdb6ae';ell(X,cx,cy+10,250,122);X.fill();                       // underside rim thickness
 X.fillStyle=g;ell(X,cx,cy,250,120);X.fill();
 X.strokeStyle='rgba(120,100,90,.25)';X.lineWidth=2;ell(X,cx,cy,178,84);X.stroke();   // well of the plate
 X.fillStyle='rgba(255,255,255,.55)';X.beginPath();X.ellipse(cx+40,cy-58,150,30,0,Math.PI*1.05,Math.PI*1.9);X.lineWidth=5;X.strokeStyle='rgba(255,250,240,.7)';X.stroke();
 // a thin gold band on the rim
 X.strokeStyle='rgba(200,160,90,.55)';X.lineWidth=2.4;ell(X,cx,cy,236,112);X.stroke();
 // crumbs
 const r=rng(42);for(let i=0;i<14;i++){const a=r()*6.28,d=60+r()*120;X.fillStyle=r()>0.5?'#c98a4a':'#a8692f';ell(X,cx+Math.cos(a)*d,cy+Math.sin(a)*d*K+10,1.5+r()*2.2,1.2+r()*1.6);X.fill();}
}
function pie(t){
 const [cx,cy]=PC;const T=[-150,70],R=300,h=62;   // tip (plane coords), radius, filling height
 const pt=(th,rad=R)=>[T[0]+Math.cos(th)*rad,T[1]+Math.sin(th)*rad];
 const a0=-1.15,a1=-0.28;                       // wedge between these plane angles (≈ 50°)
 const scr=(p,hh=0)=>P(cx,cy,p[0],p[1],hh);
 // shadow of the slice on the plate
 X.save();X.filter='blur(8px)';X.fillStyle='rgba(90,50,30,.35)';X.beginPath();let s0=scr(T);X.moveTo(s0[0]-14,s0[1]+8);
 for(let k=0;k<=20;k++){const p=scr(pt(lerp(a0,a1,k/20)));X.lineTo(p[0]-14,p[1]+8);}X.closePath();X.fill();X.restore();
 // bottom crust visible along the front cut face + the cut face itself (T → pt(a1))
 const B1=scr(T),B2=scr(pt(a1)),T1=scr(T,h),T2=scr(pt(a1),h);
 let g=X.createLinearGradient(0,T1[1],0,B1[1]);g.addColorStop(0,'#d77a2c');g.addColorStop(0.78,'#c06420');g.addColorStop(0.8,'#e3b56e');g.addColorStop(1,'#c99554');
 X.fillStyle=g;X.beginPath();X.moveTo(B1[0],B1[1]);X.lineTo(B2[0],B2[1]);X.lineTo(T2[0],T2[1]);X.lineTo(T1[0],T1[1]);X.closePath();X.fill();
 // cut-face texture: a few soft fork-smooth marks
 X.strokeStyle='rgba(255,190,120,.10)';X.lineWidth=1.5;for(let k=1;k<3;k++){const u=k/4;X.beginPath();X.moveTo(lerp(B1[0],B2[0],0.1),lerp(T1[1],B1[1],u*0.75)+lerp(0,B2[1]-B1[1],0.1));X.lineTo(lerp(B1[0],B2[0],0.9),lerp(T1[1],B1[1],u*0.75)+lerp(0,B2[1]-B1[1],0.9));X.stroke();}
 // crust side under the back rim, visible at the right end (end of arc near a1)
 const cr=[];for(let k=0;k<=24;k++)cr.push(pt(lerp(a1,a0,k/24)));
 // top filling surface
 g=X.createLinearGradient(T1[0],T1[1],scr(pt(-0.7),h)[0],scr(pt(-0.7),h)[1]);g.addColorStop(0,'#e48a38');g.addColorStop(1,'#cf6f26');
 X.fillStyle=g;X.beginPath();X.moveTo(T1[0],T1[1]);for(const p of [pt(a1,R-26),...cr.map((_,k)=>pt(lerp(a1,a0,k/24),R-26)),pt(a0,R-26)]){const s=scr(p,h);X.lineTo(s[0],s[1]);}X.closePath();X.fill();
 // the slight cut-edge lip catching light
 X.strokeStyle='rgba(255,200,140,.55)';X.lineWidth=2;X.beginPath();X.moveTo(T1[0],T1[1]);X.lineTo(scr(pt(a1,R-26),h)[0],scr(pt(a1,R-26),h)[1]);X.stroke();
 // glossy highlight from the strip light (back-right)
 X.save();X.globalCompositeOperation='screen';const hp=scr(pt(-0.62,R*0.62),h);g=X.createRadialGradient(hp[0],hp[1],2,hp[0],hp[1],70);g.addColorStop(0,'rgba(255,220,170,.45)');g.addColorStop(1,'rgba(255,220,170,0)');X.fillStyle=g;X.beginPath();X.ellipse(hp[0],hp[1],80,34,-0.3,0,Math.PI*2);X.fill();X.restore();
 // cinnamon dusting
 const r=rng(9);for(let i=0;i<40;i++){const th=lerp(a0+0.06,a1-0.06,r()),rd=30+r()*(R-70);const s=scr(pt(th,rd),h);X.fillStyle=`rgba(120,50,15,${0.25+r()*0.3})`;ell(X,s[0],s[1],0.9+r()*1.4,0.7+r());X.fill();}
 // crust rim along the arc: one continuous puffy band (golden, darker underside), gently crimped, a little higher than the filling
 const arcPts=(rad,hh)=>{const a=[];for(let k=0;k<=40;k++)a.push(scr(pt(lerp(a0,a1,k/40),rad),hh));return a;};
 const stroke=(pts,w,col)=>{X.strokeStyle=col;X.lineWidth=w;X.lineCap='round';X.lineJoin='round';X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();};
 stroke(arcPts(R-14,h+2),34,'#a86b2e');
 stroke(arcPts(R-14,h+7),30,'#d49a52');
 stroke(arcPts(R-16,h+11),18,'#e8b770');
 stroke(arcPts(R-18,h+14),7,'rgba(255,232,180,.75)');
 for(let k=1;k<12;k++){const th=lerp(a0,a1,k/12);const o=scr(pt(th,R-2),h+4),i2=scr(pt(th,R-22),h+12);X.strokeStyle='rgba(150,90,35,.45)';X.lineWidth=2;X.beginPath();X.moveTo(o[0],o[1]);X.lineTo(lerp(o[0],i2[0],0.6),lerp(o[1],i2[1],0.6));X.stroke();}
 // crust side where the cut meets the rim: a short rounded wall, darker
 const cw1=scr(pt(a1,R-2),h+2),cw0=scr(pt(a1,R-2));X.strokeStyle='#b57a3a';X.lineWidth=26;X.lineCap='round';X.beginPath();X.moveTo(cw1[0]-8,cw1[1]);X.lineTo(cw0[0]-8,cw0[1]-16);X.stroke();
 // whipped cream dollop near the crust
 const wc=scr(pt(-0.78,R*0.6),h);const sw=t=>0;
 for(let k=0;k<4;k++){const yy=wc[1]-k*14,rx=48-k*10,ry=24-k*4.4;let wg=X.createRadialGradient(wc[0]+8,yy-6,2,wc[0],yy,rx);wg.addColorStop(0,'#fffdf8');wg.addColorStop(1,'#eadfce');X.fillStyle=wg;ell(X,wc[0]+k*2,yy,rx,ry);X.fill();
   X.strokeStyle='rgba(190,170,150,.45)';X.lineWidth=1.2;X.beginPath();X.ellipse(wc[0]+k*2,yy+2,rx*0.9,ry*0.75,0,0.2,Math.PI-0.2);X.stroke();}
 X.fillStyle='#fffdf8';X.beginPath();X.moveTo(wc[0]+2,wc[1]-66);X.quadraticCurveTo(wc[0]+20,wc[1]-50,wc[0]+14,wc[1]-40);X.lineTo(wc[0]-8,wc[1]-44);X.closePath();X.fill();
 // cream sits on filling: soft shadow under it
}
// fork resting on a folded linen napkin, right of the plate
function napkinFork(){
 const nx=880,ny=1380;X.save();X.translate(nx,ny);X.scale(1.4,1.4);X.translate(-nx,-ny);
 X.save();X.filter='blur(8px)';X.fillStyle='rgba(20,10,5,.45)';X.beginPath();X.moveTo(nx-92,ny-40);X.lineTo(nx+62,ny-52);X.lineTo(nx+80,ny+86);X.lineTo(nx-80,ny+100);X.closePath();X.fill();X.restore();
 X.fillStyle='#e9e1d3';X.beginPath();X.moveTo(nx-100,ny-58);X.lineTo(nx+60,ny-70);X.lineTo(nx+76,ny+70);X.lineTo(nx-86,ny+84);X.closePath();X.fill();
 X.strokeStyle='rgba(150,130,110,.45)';X.lineWidth=2;X.beginPath();X.moveTo(nx-92,ny+8);X.lineTo(nx+68,ny-2);X.stroke();          // fold line
 X.fillStyle='rgba(255,240,215,.35)';X.beginPath();X.moveTo(nx-100,ny-58);X.lineTo(nx+60,ny-70);X.lineTo(nx+63,ny-50);X.lineTo(nx-97,ny-38);X.closePath();X.fill();
 X.strokeStyle='#a9886a';X.setLineDash([5,5]);X.lineWidth=1.4;X.beginPath();X.moveTo(nx-84,ny+70);X.lineTo(nx+66,ny+58);X.stroke();X.setLineDash([]);
 // fork lying diagonally on the napkin, tines toward the back
 X.save();X.translate(nx+8,ny+12);X.rotate(-0.58);X.scale(0.66,0.66);
 X.fillStyle='rgba(40,25,15,.35)';X.save();X.translate(-6,10);X.filter='blur(3px)';rr(X,-150,-7,170,14,7);X.fill();X.restore();
 let g=X.createLinearGradient(0,-8,0,8);g.addColorStop(0,'#f6f4f0');g.addColorStop(0.5,'#b9b7b4');g.addColorStop(1,'#7b7a78');
 X.fillStyle=g;X.beginPath();X.moveTo(-150,-6);X.quadraticCurveTo(-160,0,-150,6);X.lineTo(20,4);X.lineTo(20,-4);X.closePath();X.fill();
 X.beginPath();X.moveTo(20,-4);X.quadraticCurveTo(40,-14,60,-15);X.lineTo(60,15);X.quadraticCurveTo(40,14,20,4);X.closePath();X.fill();
 for(let i=0;i<4;i++){const y=-14+i*9.4;X.fillStyle=g;rr(X,58,y,48,5.6,2.8);X.fill();}
 X.fillStyle='rgba(255,240,220,.7)';X.fillRect(-140,-3.5,150,1.6);
 X.restore();
 X.restore();
}
// his note: a small folded card standing on the counter, handwriting in blue ink
function note(t){
 const x=118,y=1520,w=330,h=190;
 // tight contact shadow at the base (light from back-right → falls slightly front-left)
 X.save();X.filter='blur(6px)';X.fillStyle='rgba(20,10,5,.55)';X.beginPath();X.moveTo(x-10,y+h-2);X.lineTo(x+w-4,y+h-14);X.lineTo(x+w-14,y+h+10);X.lineTo(x-22,y+h+20);X.closePath();X.fill();X.restore();
 // back panel of the tent: its foot sits further back on the counter, so it shows as a darker sliver above/right of the front panel
 X.fillStyle='#cbbfa8';X.beginPath();X.moveTo(x,y);X.lineTo(x+w,y-10);X.lineTo(x+w+16,y+h-74);X.lineTo(x+w,y+h-10);X.closePath();X.fill();
 X.save();X.translate(x,y);X.transform(1,-0.03,0,1,0,0);
 let g=X.createLinearGradient(0,0,0,h);g.addColorStop(0,'#fbf4e6');g.addColorStop(1,'#efe3cc');X.fillStyle=g;X.fillRect(0,0,w,h);
 X.fillStyle='rgba(255,210,150,.12)';X.fillRect(w*0.55,0,w*0.45,h);
 X.strokeStyle='rgba(110,90,70,.55)';X.lineWidth=2.4;X.beginPath();X.moveTo(0,0.5);X.lineTo(w,0.5);X.stroke();   // fold crease
 X.fillStyle='rgba(255,255,255,.5)';X.fillRect(0,2,w,2);
 X.fillStyle='#2b3a73';X.textAlign='left';X.textBaseline='alphabetic';X.font="italic 500 46px Corm, serif";
 X.fillText('saved you',30,72);X.fillText('the last slice',30,124);
 X.font="italic 500 29px Corm, serif";X.fillText('(fought your uncle for it)',30,168);
 heartPath(X,268,60,15);X.lineWidth=2.6;X.strokeStyle='#b8455e';X.stroke();
 X.restore();
}
// her keys, just dropped on the counter
function keys(){
 const x=600,y=1738;X.save();X.translate(x,y);X.scale(1.35,1.35);X.translate(-x,-y);
 X.filter='blur(4px)';X.fillStyle='rgba(20,10,5,.5)';ell(X,x+10,y+12,70,16);X.fill();X.filter='none';
 X.strokeStyle='#c9c6c0';X.lineWidth=4;ell(X,x,y,26,12);X.stroke();X.strokeStyle='rgba(255,255,255,.6)';X.lineWidth=1.2;X.beginPath();X.ellipse(x,y,26,12,0,3.6,5.2);X.stroke();
 // key 1 (brass), lying flat — squashed
 let g=X.createLinearGradient(x+20,y-10,x+20,y+10);g.addColorStop(0,'#f0d28a');g.addColorStop(1,'#a8823c');X.fillStyle=g;
 X.beginPath();X.ellipse(x+40,y+2,17,9,0.1,0,Math.PI*2);X.fill();X.fillStyle='#5a4630';ell(X,x+36,y+1,4,2.4);X.fill();
 X.fillStyle=g;X.beginPath();X.moveTo(x+55,y-2);X.lineTo(x+120,y+4);X.lineTo(x+122,y+9);X.lineTo(x+112,y+11);X.lineTo(x+108,y+8);X.lineTo(x+100,y+11);X.lineTo(x+94,y+8);X.lineTo(x+55,y+7);X.closePath();X.fill();
 // key 2 (silver), pointing the other way
 g=X.createLinearGradient(x-60,y-6,x-60,y+14);g.addColorStop(0,'#f2f2f0');g.addColorStop(1,'#8d8c8a');X.fillStyle=g;
 X.beginPath();X.ellipse(x-34,y+8,15,9,-0.2,0,Math.PI*2);X.fill();X.fillStyle='#4a4a4a';ell(X,x-30,y+7,3.5,2.2);X.fill();
 X.fillStyle=g;X.beginPath();X.moveTo(x-46,y+12);X.lineTo(x-100,y+24);X.lineTo(x-102,y+29);X.lineTo(x-94,y+30);X.lineTo(x-90,y+26);X.lineTo(x-84,y+28);X.lineTo(x-46,y+20);X.closePath();X.fill();
 // little felt heart keychain on a short chain from the ring
 X.strokeStyle='#bdbab4';X.lineWidth=1.6;X.beginPath();X.moveTo(x+2,y+12);X.lineTo(x+4,y+19);X.stroke();
 X.save();X.translate(x+4,y+26);X.rotate(0.3);X.scale(1,0.6);heartPath(X,0,0,14);X.fillStyle='#c4546f';X.fill();X.restore();
 X.restore();
}
// her canvas tote, dropped at the back-left of the counter as she came in
function bag(){
 const x=200,y=1175;X.save();
 X.filter='blur(10px)';X.fillStyle='rgba(15,8,5,.55)';ell(X,x-10,y+6,140,26);X.fill();X.filter='none';
 // straps flopped over to the left
 X.strokeStyle='#b49b7c';X.lineWidth=12;X.lineCap='round';X.beginPath();X.moveTo(x-70,y-150);X.bezierCurveTo(x-120,y-210,x-190,y-120,x-150,y-10);X.stroke();
 X.strokeStyle='#a68d6f';X.beginPath();X.moveTo(x+40,y-160);X.bezierCurveTo(x+20,y-230,x-110,y-200,x-100,y-120);X.stroke();
 // body: slouched, wider at the bottom, top edge sagging
 let g=X.createLinearGradient(x-130,0,x+130,0);g.addColorStop(0,'#a99474');g.addColorStop(0.6,'#d2bf9e');g.addColorStop(1,'#e6d6b8');X.fillStyle=g;
 X.beginPath();X.moveTo(x-112,y-150);X.quadraticCurveTo(x-10,y-130,x+102,y-166);X.quadraticCurveTo(x+122,y-80,x+130,y-8);X.quadraticCurveTo(x,y+18,x-132,y-4);X.quadraticCurveTo(x-126,y-80,x-112,y-150);X.closePath();X.fill();
 X.strokeStyle='rgba(90,70,50,.35)';X.lineWidth=2;X.beginPath();X.moveTo(x-112,y-150);X.quadraticCurveTo(x-10,y-130,x+102,y-166);X.stroke();
 // soft folds
 X.strokeStyle='rgba(110,90,65,.28)';X.lineWidth=3;X.beginPath();X.moveTo(x-40,y-128);X.quadraticCurveTo(x-30,y-70,x-50,y-6);X.moveTo(x+50,y-146);X.quadraticCurveTo(x+60,y-80,x+40,y-2);X.stroke();
 // a book corner peeking out + a small printed motif
 X.fillStyle='#6f5a8a';X.beginPath();X.moveTo(x-30,y-136);X.lineTo(x+40,y-150);X.lineTo(x+44,y-140);X.lineTo(x-28,y-127);X.closePath();X.fill();
 X.fillStyle='rgba(120,70,60,.45)';X.beginPath();X.arc(x+12,y-70,16,0,Math.PI*2);X.fill();
 X.restore();
}
// a mug of tea he made, still steaming (back right, in the strip light)
function mug(t){
 const x=860,y=1105;X.save();
 X.filter='blur(8px)';X.fillStyle='rgba(20,10,5,.5)';ell(X,x-14,y+8,62,18);X.fill();X.filter='none';
 let g=X.createLinearGradient(x-50,0,x+50,0);g.addColorStop(0,'#cdbfae');g.addColorStop(0.5,'#efe6da');g.addColorStop(1,'#fff8ee');
 X.fillStyle=g;X.beginPath();X.moveTo(x-48,y-110);X.lineTo(x-48,y-6);X.ellipse(x,y-6,48,15,0,Math.PI,0,true);X.lineTo(x+48,y-110);X.closePath();X.fill();
 // handle (on the left, away from the light)
 X.strokeStyle='#d6c9b8';X.lineWidth=11;X.beginPath();X.moveTo(x-46,y-90);X.bezierCurveTo(x-88,y-88,x-88,y-36,x-46,y-38);X.stroke();
 X.strokeStyle='rgba(0,0,0,.12)';X.lineWidth=3;X.beginPath();X.moveTo(x-48,y-84);X.bezierCurveTo(x-80,y-82,x-80,y-42,x-48,y-44);X.stroke();
 // rim + tea
 X.fillStyle='#e7ddd0';ell(X,x,y-110,48,15);X.fill();X.fillStyle='#7a4a22';ell(X,x,y-108,42,12);X.fill();
 X.fillStyle='rgba(255,210,160,.35)';ell(X,x+12,y-111,16,4);X.fill();
 // tea-bag string over the rim + tag hanging outside
 X.strokeStyle='#efe9df';X.lineWidth=1.4;X.beginPath();X.moveTo(x+10,y-106);X.quadraticCurveTo(x+40,y-120,x+46,y-108);X.quadraticCurveTo(x+52,y-80,x+50,y-66);X.stroke();
 X.fillStyle='#e9c37a';rr(X,x+40,y-68,22,26,3);X.fill();
 X.restore();
}
function steam(t){
 const x=860,y=1105-118;
 for(let i=0;i<4;i++){const ph=(t*0.28+i/4)%1;const yy=y-ph*230;const a=Math.sin(ph*Math.PI)*0.16;
   X.save();X.globalAlpha=a;X.filter='blur(9px)';X.strokeStyle='#f4ece4';X.lineWidth=16+ph*24;X.lineCap='round';
   X.beginPath();const xx=x+Math.sin(t*1.3+i*1.7)*10;X.moveTo(xx,yy);X.bezierCurveTo(xx+22,yy-30,xx-22,yy-60,xx+6,yy-96);X.stroke();X.restore();}
}
// his message lands on her phone lying flat on the counter (front right)
const PH={x:775,y:1585,w:216,h:440,rot:-0.12};     // in plane units; drawn squashed by K
let PHS=null;
function phoneScreen(t){ // offscreen screen texture (portrait), then mapped flat
 if(!PHS){PHS=document.createElement('canvas');PHS.width=500;PHS.height=940;}
 const q=PHS.getContext('2d');const on=clamp((t-BUZZ)/0.25,0,1);
 q.clearRect(0,0,500,940);q.fillStyle='#07070b';q.fillRect(0,0,500,940);
 if(on>0){q.globalAlpha=on;let g=q.createLinearGradient(0,0,0,940);g.addColorStop(0,'#2a3866');g.addColorStop(1,'#4a3a5e');q.fillStyle=g;q.fillRect(0,0,500,940);
  q.fillStyle='rgba(255,255,255,.95)';q.textAlign='center';q.font='300 104px Poppins, sans-serif';q.fillText('1:47',250,230);
  q.font='500 26px Poppins, sans-serif';q.fillText('Tuesday 24 November',250,280);
  // notification card
  const sl=ease((t-BUZZ-0.15)/0.4);q.save();q.translate(0,(1-sl)*-30);q.globalAlpha=on*sl;
  q.fillStyle='rgba(255,255,255,.88)';rr(q,26,360,448,180,32);q.fill();
  q.fillStyle='#6fbf73';rr(q,48,384,44,44,11);q.fill();q.fillStyle='#fff';q.beginPath();q.ellipse(70,404,13,11,0,0,Math.PI*2);q.fill();q.beginPath();q.moveTo(63,412);q.lineTo(60,421);q.lineTo(70,414);q.fill();
  q.textAlign='left';q.fillStyle='#4a4558';q.font='600 32px Poppins, sans-serif';q.fillText('babe',108,418);q.fillStyle='#8a8399';q.font='400 28px Poppins, sans-serif';q.textAlign='right';q.fillText('now',452,416);
  q.textAlign='left';q.fillStyle='#1d1a26';q.font='500 34px Poppins, sans-serif';q.fillText('home safe?',52,476);q.fillText('left the light on',52,520);
  const tw=q.measureText('left the light on').width;heartPath(q,52+tw+26,512,13);q.fillStyle='#e0566f';q.fill();
  q.restore();q.globalAlpha=1;}
 return on;
}
function phone(t){
 const on=phoneScreen(t);
 const jit=(t>BUZZ&&t<BUZZ+0.55)?Math.sin(t*170)*2.2*(1-(t-BUZZ)/0.55):0;
 X.save();X.translate(PH.x+jit,PH.y);X.scale(1,K);X.rotate(PH.rot);
 // shadow
 X.save();X.filter='blur(10px)';X.fillStyle='rgba(15,8,5,.6)';rr(X,-PH.w/2-14,-PH.h/2+10,PH.w+10,PH.h+12,40);X.fill();X.restore();
 // body thickness (seen at the front edge because it's flat on the counter)
 X.fillStyle='#16151a';rr(X,-PH.w/2,-PH.h/2+16,PH.w,PH.h,36);X.fill();
 X.fillStyle='#2b2a30';rr(X,-PH.w/2,-PH.h/2,PH.w,PH.h,36);X.fill();
 X.fillStyle='rgba(255,255,255,.12)';rr(X,-PH.w/2+2,-PH.h/2+2,PH.w-4,PH.h-4,34);X.lineWidth=2;X.strokeStyle='rgba(255,255,255,.14)';X.stroke();
 X.save();rr(X,-PH.w/2+10,-PH.h/2+10,PH.w-20,PH.h-20,28);X.clip();X.drawImage(PHS,-PH.w/2+10,-PH.h/2+10,PH.w-20,PH.h-20);
 // glass reflection of the strip light
 X.fillStyle='rgba(255,220,180,.08)';X.beginPath();X.moveTo(-PH.w/2,-PH.h/2);X.lineTo(PH.w/2,-PH.h/2);X.lineTo(PH.w/2,-PH.h/2+90);X.lineTo(-PH.w/2,-PH.h/2+200);X.closePath();X.fill();
 X.restore();X.restore();
 // cool glow on the counter around the phone + on the pie side when the screen is on
 if(on>0){X.save();X.globalCompositeOperation='screen';let g=X.createRadialGradient(PH.x,PH.y,30,PH.x,PH.y,320);g.addColorStop(0,`rgba(120,140,220,${0.42*on})`);g.addColorStop(1,'rgba(120,140,220,0)');
  X.fillStyle=g;X.fillRect(PH.x-400,PH.y-400,800,800);X.restore();}
 return on;
}
// ---------- captions ----------
function heart(x,y,s,a){X.save();X.globalAlpha=a;heartPath(X,x,y,s);X.fillStyle='#fbe4ea';X.fill();X.restore();}
function caption(t){
 let a=Math.min(1,0.5+t/0.8)*clamp((6.6-t)/1.2,0,1);
 if(a>0){X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const x=540+t*4,y=470;const bl=Math.max(0,(t-5.6)*1.6);if(bl>0)X.filter=`blur(${bl}px)`;
  X.font="italic 500 82px Corm, serif";X.shadowColor='rgba(255,190,140,.55)';X.shadowBlur=30;X.fillStyle='#fbf1e6';
  for(let k=0;k<2;k++){X.fillText('he saved me',x,y);X.fillText('the last slice',x,y+94);X.shadowBlur=0;}
  X.filter='none';X.restore();}
 const b=clamp((t-10.0)/1.0,0,1);
 if(b>0){X.save();X.globalAlpha=b;X.textAlign='center';X.textBaseline='middle';const x=540,y=500-b*10;X.font="italic 500 80px Corm, serif";X.shadowColor='rgba(255,170,190,.6)';X.shadowBlur=30;X.fillStyle='#fbeef2';
  for(let k=0;k<2;k++){X.fillText('it was never',x,y);X.fillText('about the pie',x,y+92);X.shadowBlur=0;}
  const tw=X.measureText('about the pie').width;X.restore();heart(x+tw/2+36,y+88,22,b);}
}
function grade(t){
 const v=X.createRadialGradient(520,1300,300,520,1250,1300);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,4,10,.6)');X.fillStyle=v;X.fillRect(0,0,W,H);
 // darken the top so the caption reads
 let g=X.createLinearGradient(0,0,0,900);g.addColorStop(0,'rgba(6,5,12,.45)');g.addColorStop(1,'rgba(6,5,12,0)');X.fillStyle=g;X.fillRect(0,0,W,900);
 X.save();X.filter='blur(60px)';X.fillStyle='rgba(8,6,14,.38)';ell(X,540,560,380,150);X.fill();X.restore();
 X.globalCompositeOperation='soft-light';X.fillStyle='rgba(255,170,110,.10)';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over';
 const q=rng(((t*30)|0)+9);X.globalAlpha=0.035;for(let i=0;i<1500;i++){X.fillStyle=q()>0.5?'#fff':'#000';X.fillRect(q()*W,q()*H,2,2);}X.globalAlpha=1;
}
window.draw=function(t){
 if(!STATIC)buildStatic();
 const z=1.0+0.07*ease(t/16),F=[520,1300],ox=S*(F[0]-F[0]*z),oy=S*(F[1]-F[1]*z);
 X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,1440,2560);
 X.setTransform(S*z,0,0,S*z,ox,oy);windowNight(t);
 X.setTransform(z*S/SR,0,0,z*S/SR,ox,oy);X.drawImage(STATIC,0,0);
 X.setTransform(S*z,0,0,S*z,ox,oy);
 // the static frame was drawn over the glass; redraw glass region content is beneath it, so draw mullions + plant after
 strip(t);plant(t);mug(t);steam(t);plate();pie(t);napkinFork();keys();note(t);phone(t);
 X.setTransform(S,0,0,S,0,0);grade(t);caption(t);
};
