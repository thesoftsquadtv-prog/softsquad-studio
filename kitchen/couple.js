// ---------------- the couple, slow dancing ----------------
const MK='#8a5536',MK_SH='#5c341f',MK_LT='#a9724d';         // his skin
const KNIT='#dccdb5',KNIT_SH='#a8977c',KNIT_LT='#efe4d0';    // his cream sweater
const JOG='#3b3e46',JOG_SH='#24262c',JOG_LT='#4d515b';       // charcoal joggers
const TEE='#ad3a32',TEE_SH='#7c241f',TEE_LT='#c9564a';
function plaid(q,x0,y0,x1,y1){q.fillStyle='#1f2c47';q.fillRect(x0,y0,x1-x0,y1-y0);
 q.strokeStyle='rgba(130,160,210,.35)';q.lineWidth=3;for(let x=x0;x<x1;x+=24){q.beginPath();q.moveTo(x,y0);q.quadraticCurveTo(x+(x-520)*0.04,(y0+y1)/2,x+(x-520)*0.1,y1);q.stroke();}
 for(let y=y0+4;y<y1;y+=24){q.beginPath();q.moveTo(x0,y);q.quadraticCurveTo((x0+x1)/2,y+8,x1,y);q.stroke();}
 q.strokeStyle='rgba(8,12,28,.55)';q.lineWidth=7;for(let x=x0+2;x<x1;x+=48){q.beginPath();q.moveTo(x,y0);q.quadraticCurveTo(x+(x-520)*0.04,(y0+y1)/2,x+(x-520)*0.1,y1);q.stroke();}}
function couple(t){
 const q=X; q.save();
 // one slow sway shared by both, weight shifting foot to foot
 const ph=t*2*Math.PI/4.6, sw=2.2*Math.sin(ph), shift=6*Math.sin(ph), bob=3*Math.abs(Math.sin(ph)), turn=Math.sin(ph*0.5);
 const cs=q.createRadialGradient(545,1612,10,545,1612,200);cs.addColorStop(0,'rgba(25,10,5,.5)');cs.addColorStop(1,'rgba(25,10,5,0)');q.fillStyle=cs;q.beginPath();q.ellipse(545,1612,200,32,0,0,6.28);q.fill();
 q.translate(540+shift,1610);q.rotate(sw*Math.PI/180);q.translate(-540,-1610-bob);
 const lagH=sw*3;   // fabric lags behind the sway
 // ===== HIM (behind her, facing us) =====
 // joggers + socked feet
 const lift=Math.max(0,Math.sin(ph))*8, lift2=Math.max(0,-Math.sin(ph))*8;
 shape(q,[[503,1040,54],[492,1200,46],[484,1400,38],[478,1560,30]],JOG,JOG_SH,JOG_LT);
 shape(q,[[617,1040,54],[628,1200,46],[636,1400,38],[642,1560,30]],JOG,JOG_SH,JOG_LT);
 q.strokeStyle='rgba(15,15,20,.5)';q.lineWidth=3;[[478,1548],[642,1548]].forEach(([x,y])=>{q.beginPath();q.moveTo(x-30,y);q.quadraticCurveTo(x,y+6,x+30,y);q.stroke();});
 const sock=(x,dy)=>{const g=q.createLinearGradient(x-34,0,x+34,0);g.addColorStop(0,'#8e8e96');g.addColorStop(0.5,'#c9c9cf');g.addColorStop(1,'#8e8e96');q.fillStyle=g;q.beginPath();q.moveTo(x-26,1560-dy);q.quadraticCurveTo(x-38,1590-dy,x-36,1600-dy);q.quadraticCurveTo(x,1612-dy,x+36,1600-dy);q.quadraticCurveTo(x+38,1590-dy,x+26,1560-dy);q.closePath();q.fill();};
 sock(472,lift);sock(648,lift2);
 // sweater torso: soft drape, ribbed hem
 const sweat=new Path2D();sweat.moveTo(528,722);sweat.quadraticCurveTo(560,732,592,722);sweat.quadraticCurveTo(650,730,672,768);
 sweat.quadraticCurveTo(682,820,670,880);sweat.quadraticCurveTo(664,980,668+lagH*0.5,1058);sweat.quadraticCurveTo(560,1072,452+lagH*0.5,1058);
 sweat.quadraticCurveTo(456,980,450,880);sweat.quadraticCurveTo(438,820,448,768);sweat.quadraticCurveTo(470,730,528,722);sweat.closePath();
 const sg=q.createLinearGradient(440,0,680,0);sg.addColorStop(0,KNIT_SH);sg.addColorStop(0.3,KNIT);sg.addColorStop(0.6,KNIT_LT);sg.addColorStop(1,KNIT_SH);q.fillStyle=sg;q.fill(sweat);
 q.save();q.clip(sweat);q.strokeStyle='rgba(120,100,70,.18)';q.lineWidth=2;for(let x=450;x<680;x+=9){q.beginPath();q.moveTo(x,730);q.quadraticCurveTo(x+(x-560)*0.03,900,x+(x-560)*0.02,1070);q.stroke();}
 q.fillStyle='rgba(90,70,45,.35)';q.fillRect(440,1036,250,40);q.strokeStyle='rgba(90,70,45,.3)';for(let x=452;x<670;x+=7){q.beginPath();q.moveTo(x,1040);q.lineTo(x,1070);q.stroke();}q.restore();
 // his upper arms (sleeved), hanging at his sides before wrapping round her
 shape(q,[[460,768,34],[446,850,30],[444,940,26]],KNIT,KNIT_SH,KNIT_LT);
 shape(q,[[660,768,34],[674,850,30],[676,940,26]],KNIT,KNIT_SH,KNIT_LT);
 // ===== HER ARMS go up around his neck (drawn before his neck so her hands tuck behind it) =====
 const nz=Math.sin(ph+1)*2;
 shape(q,[[452,892,24],[432,846,21],[424,804,19],[468,764,16],[530,744+nz,13]],SK,SK_SH,SK_LT);
 shape(q,[[590,892,24],[610,846,21],[628,806,19],[612,768,16],[592,744+nz,13]],SK,SK_SH,SK_LT);
 q.strokeStyle='rgba(150,90,60,.3)';q.lineWidth=2;q.beginPath();q.arc(424,806,9,2.4,4.6);q.stroke();q.beginPath();q.arc(628,808,9,-1.4,0.7);q.stroke();
 // ===== HIS NECK + HEAD (tilted down toward her) =====
 q.save();q.translate(560,722);q.rotate((-7+sw*0.6)*Math.PI/180);q.translate(-560,-722);
 const ng=q.createLinearGradient(536,0,584,0);ng.addColorStop(0,MK_SH);ng.addColorStop(0.5,MK);ng.addColorStop(1,MK_SH);q.fillStyle=ng;q.beginPath();q.moveTo(536,660);q.lineTo(584,660);q.lineTo(588,732);q.lineTo(532,732);q.fill();
 q.fillStyle='rgba(40,20,10,.35)';q.beginPath();q.ellipse(560,676,26,9,0,0,6.28);q.fill();
 // ears
 q.fillStyle=MK_SH;q.beginPath();q.ellipse(507,612,9,16,0.1,0,6.28);q.fill();q.beginPath();q.ellipse(613,612,9,16,-0.1,0,6.28);q.fill();
 // face
 const hg=q.createLinearGradient(508,0,612,0);hg.addColorStop(0,MK_SH);hg.addColorStop(0.3,MK);hg.addColorStop(0.62,MK_LT);hg.addColorStop(1,MK_SH);q.fillStyle=hg;
 q.beginPath();q.moveTo(510,596);q.quadraticCurveTo(508,660,540,684);q.quadraticCurveTo(560,694,580,684);q.quadraticCurveTo(612,660,610,596);q.quadraticCurveTo(608,546,560,544);q.quadraticCurveTo(512,546,510,596);q.fill();
 // short beard / stubble along the jaw
 q.fillStyle='rgba(25,14,10,.55)';q.beginPath();q.moveTo(512,630);q.quadraticCurveTo(514,672,540,686);q.quadraticCurveTo(560,696,580,686);q.quadraticCurveTo(606,672,608,630);q.quadraticCurveTo(600,668,580,666);q.quadraticCurveTo(560,660,540,666);q.quadraticCurveTo(520,668,512,630);q.fill();
 q.beginPath();q.moveTo(542,646);q.quadraticCurveTo(560,640,578,646);q.quadraticCurveTo(560,652,542,646);q.fill();
 // low fade hair
 q.fillStyle='#1a120e';q.beginPath();q.moveTo(508,604);q.quadraticCurveTo(502,540,560,530);q.quadraticCurveTo(618,540,612,604);q.quadraticCurveTo(606,572,596,566);q.quadraticCurveTo(560,558,524,566);q.quadraticCurveTo(514,572,508,604);q.fill();
 const hr=rng(77);q.fillStyle='rgba(70,50,40,.5)';for(let k=0;k<70;k++){const a=-2.9+hr()*2.8,d=40+hr()*14;q.fillRect(560+Math.cos(a)*d*1.05,575+Math.sin(a)*d*0.85,2,2);}
 // closed, content eyes + brows + nose + soft smile
 q.strokeStyle='#1c110c';q.lineCap='round';q.lineWidth=3;q.beginPath();q.moveTo(530,604);q.quadraticCurveTo(540,611,550,604);q.moveTo(570,604);q.quadraticCurveTo(580,611,590,604);q.stroke();
 q.lineWidth=4;q.strokeStyle='rgba(25,14,10,.85)';q.beginPath();q.moveTo(526,588);q.quadraticCurveTo(538,582,551,586);q.moveTo(569,586);q.quadraticCurveTo(582,582,594,588);q.stroke();
 q.strokeStyle='rgba(50,25,15,.6)';q.lineWidth=2.5;q.beginPath();q.moveTo(554,628);q.quadraticCurveTo(560,634,566,628);q.stroke();
 q.strokeStyle='#4a2418';q.lineWidth=3;q.beginPath();q.moveTo(546,657);q.quadraticCurveTo(560,665,575,656);q.stroke();
 q.fillStyle='rgba(255,210,170,.12)';q.beginPath();q.ellipse(578,590,20,10,0,0,6.28);q.fill();
 q.restore();
 // crew neck rib
 q.strokeStyle='#bfae92';q.lineWidth=9;q.beginPath();q.moveTo(526,724);q.quadraticCurveTo(560,744,594,724);q.stroke();
 // ===== HER (back to us, cheek on his chest) =====
 // legs from behind: calves, back of knees, heels
 const herL=[[488,1244,46],[484,1330,35],[482,1388,28],[481,1452,31],[483,1530,19],[485,1596,14]];
 const herR=[[556,1244,46],[560,1330,35],[562,1388,28],[563,1452,31],[561,1530,19],[559,1596-lift2*0.6,14]];
 shape(q,herL,SK,SK_SH,SK_LT);shape(q,herR,SK,SK_SH,SK_LT);
 q.strokeStyle='rgba(140,80,55,.4)';q.lineWidth=2;[[482,1384],[562,1384]].forEach(([x,y])=>{q.beginPath();q.moveTo(x-14,y);q.quadraticCurveTo(x,y+5,x+14,y);q.stroke();});
 q.strokeStyle='rgba(140,80,55,.25)';[[481,1452],[563,1452]].forEach(([x,y])=>{q.beginPath();q.moveTo(x,y-40);q.quadraticCurveTo(x+2,y,x,y+50);q.stroke();});
 const heel=(x,y)=>{const g=q.createRadialGradient(x-4,y-4,2,x,y,18);g.addColorStop(0,SK_LT);g.addColorStop(1,SK_SH);q.fillStyle=g;q.beginPath();q.ellipse(x,y,15,17,0,0,6.28);q.fill();q.fillStyle='rgba(230,150,130,.5)';q.beginPath();q.ellipse(x,y+10,11,6,0,0,6.28);q.fill();};
 heel(485,1608);heel(559,1608-lift2*0.6);
 q.fillStyle='rgba(60,25,15,.3)';q.beginPath();q.ellipse(490,1250,44,10,0,0,6.28);q.fill();q.beginPath();q.ellipse(556,1250,44,10,0,0,6.28);q.fill();
 // shorts from behind
 const sh=new Path2D();sh.moveTo(446,1116);sh.lineTo(596,1116);sh.quadraticCurveTo(616,1168,612,1252);sh.quadraticCurveTo(570,1266,526,1250);sh.quadraticCurveTo(522,1222,518,1250);sh.quadraticCurveTo(474,1266,432,1252);sh.quadraticCurveTo(426,1168,446,1116);sh.closePath();
 q.save();q.clip(sh);plaid(q,420,1110,630,1270);
 const pg=q.createLinearGradient(430,0,615,0);pg.addColorStop(0,'rgba(0,0,0,.4)');pg.addColorStop(0.5,'rgba(255,255,255,.05)');pg.addColorStop(1,'rgba(0,0,0,.4)');q.fillStyle=pg;q.fillRect(420,1110,210,160);
 q.strokeStyle='rgba(0,0,0,.4)';q.lineWidth=2.5;q.beginPath();q.moveTo(521,1130);q.quadraticCurveTo(522,1200,520,1244);q.stroke();
 q.lineWidth=2;q.beginPath();q.moveTo(470,1214);q.quadraticCurveTo(495,1226,518,1218);q.moveTo(526,1218);q.quadraticCurveTo(549,1226,574,1214);q.stroke();q.restore();
 // sleeves of her tee wrapped round the raised upper arms
 shape(q,[[452,896,31],[440,864,29],[434,840,27]],TEE,TEE_SH,TEE_LT);shape(q,[[590,896,31],[602,864,29],[608,840,27]],TEE,TEE_SH,TEE_LT);
 q.fillStyle=TEE_SH;q.beginPath();q.ellipse(434,840,27,8,-0.35,0,6.28);q.fill();q.beginPath();q.ellipse(608,840,27,8,0.35,0,6.28);q.fill();
 // tee back: arms raised pull it up at the sides; hem lags the sway
 const tee=new Path2D();tee.moveTo(492,868);tee.quadraticCurveTo(519,878,548,868);tee.quadraticCurveTo(590,870,612,892);tee.quadraticCurveTo(618,930,604,962);
 tee.quadraticCurveTo(598,1050,612+lagH,1134);tee.quadraticCurveTo(560,1146,520,1142);tee.quadraticCurveTo(478,1146,430+lagH,1134);tee.quadraticCurveTo(444,1050,438,962);tee.quadraticCurveTo(424,930,430,892);tee.quadraticCurveTo(452,870,492,868);tee.closePath();
 const tg=q.createLinearGradient(425,0,620,0);tg.addColorStop(0,TEE_SH);tg.addColorStop(0.3,TEE);tg.addColorStop(0.55,TEE_LT);tg.addColorStop(0.8,TEE);tg.addColorStop(1,TEE_SH);q.fillStyle=tg;q.fill(tee);
 q.save();q.clip(tee);const fold=(a,b,c,d,w,al)=>{q.strokeStyle=`rgba(90,20,16,${al})`;q.lineWidth=w;q.lineCap='round';q.beginPath();q.moveTo(a[0],a[1]);q.bezierCurveTo(b[0],b[1],c[0],c[1],d[0],d[1]);q.stroke();};
 fold([440,930],[480,960],[500,1000],[512,1060],5,.33);fold([604,930],[566,960],[548,1000],[532,1060],5,.33);
 fold([452,1010],[470,1050],[470,1090],[462,1134],4,.25);fold([592,1010],[574,1050],[574,1090],[582,1134],4,.25);
 q.strokeStyle='rgba(90,20,16,.25)';q.lineWidth=2.5;q.beginPath();q.moveTo(520,900);q.quadraticCurveTo(522,980,520,1050);q.stroke();
 q.fillStyle='rgba(60,10,8,.25)';q.fillRect(420,1120,210,30);q.restore();
 q.strokeStyle='#8e2a24';q.lineWidth=7;q.beginPath();q.moveTo(494,870);q.quadraticCurveTo(519,882,546,870);q.stroke();
 // nape of the neck
 const nk=q.createLinearGradient(498,0,540,0);nk.addColorStop(0,SK_SH);nk.addColorStop(0.5,SK);nk.addColorStop(1,SK_SH);q.fillStyle=nk;q.beginPath();q.moveTo(500,826);q.lineTo(540,826);q.lineTo(544,872);q.lineTo(496,872);q.fill();
 // head turned, cheek resting on his chest
 q.save();q.translate(516,800);q.rotate((-13+Math.sin(ph+0.4)*1.2)*Math.PI/180);q.translate(-516,-800);
 // a sliver of her face: cheek, closed eye, ear (turned toward our left)
 q.fillStyle=SK;q.beginPath();q.ellipse(468,806,22,36,0.15,0,6.28);q.fill();
 q.strokeStyle='#2a1a18';q.lineWidth=2.4;q.lineCap='round';q.beginPath();q.moveTo(452,794);q.quadraticCurveTo(460,800,468,796);q.stroke();
 q.lineWidth=1.5;q.beginPath();q.moveTo(455,797);q.lineTo(452,802);q.moveTo(460,799);q.lineTo(459,804);q.stroke();
 q.fillStyle='rgba(240,120,110,.3)';q.beginPath();q.ellipse(462,818,11,6,0,0,6.28);q.fill();
 // hair (back of head) + bun + loose strands
 q.fillStyle=HAIR;q.beginPath();q.ellipse(518,796,55,62,0,0,6.28);q.fill();
 q.beginPath();q.ellipse(526,730,36,27,-0.15,0,6.28);q.fill();
 q.fillStyle=SK_SH;q.beginPath();q.ellipse(476,808,8,13,0.2,0,6.28);q.fill();
 q.strokeStyle='#3e2c2c';q.lineWidth=2;q.beginPath();q.arc(526,730,19,0.4,2.6);q.stroke();q.beginPath();q.arc(526,730,10,3.4,5.6);q.stroke();
 q.strokeStyle='rgba(70,50,45,.7)';q.lineWidth=1.8;for(let k=0;k<7;k++){q.beginPath();q.moveTo(492+k*9,756);q.quadraticCurveTo(496+k*9,800,500+k*7,850);q.stroke();}
 const fl=Math.sin(ph)*2.5;q.strokeStyle=HAIR;q.lineWidth=3;q.beginPath();q.moveTo(470,780);q.quadraticCurveTo(462+fl,812,468+fl,846);q.stroke();
 q.strokeStyle='rgba(255,200,150,.3)';q.lineWidth=3;q.beginPath();q.arc(518,790,48,-2.5,-0.7);q.stroke();
 q.restore();
 // ===== HIS FOREARMS wrap round her waist, hands resting on her lower back =====
 shape(q,[[444,936,25],[452,1000,22],[476,1052,19],[500,1074,16]],KNIT,KNIT_SH,KNIT_LT);
 shape(q,[[676,936,25],[668,1000,22],[628,1052,19],[588,1074,16]],KNIT,KNIT_SH,KNIT_LT);
 q.fillStyle='#bfae92';q.beginPath();q.ellipse(500,1074,9,17,-0.9,0,6.28);q.fill();q.beginPath();q.ellipse(588,1074,9,17,0.9,0,6.28);q.fill();
 const hand=(x,y,dir)=>{const g=q.createLinearGradient(x,y-16,x,y+16);g.addColorStop(0,MK_LT);g.addColorStop(1,MK_SH);q.fillStyle=g;
  q.beginPath();q.ellipse(x+dir*16,y+4,20,14,dir*0.15,0,6.28);q.fill();
  for(let k=0;k<4;k++){q.beginPath();q.ellipse(x+dir*(36+k*1),y-6+k*6.5,13,4.6,dir*(0.12+k*0.05),0,6.28);q.fill();q.strokeStyle='rgba(40,20,10,.35)';q.lineWidth=1;q.stroke();}};
 hand(504,1076,1);hand(584,1076,-1);
 q.restore();
}
