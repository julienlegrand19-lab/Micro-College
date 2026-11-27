/* Astréon 1.5 — original 2D painterly vector renderer, independent from Micro-Collège 4e. */
(function(root){
'use strict';
const colors={knight:['#8193aa','#e1b68c','#514039'],mage:['#79689c','#ad795b','#30283c'],ranger:['#768669','#d9ae87','#594036'],scout:['#417b89','#c39170','#332f35']};
const beasts=[
 ['#86cce0','#35436b','#b8efff'],['#9b9b8c','#454b53','#ffcd88'],['#b89463','#644837','#ffde96'],['#887ca6','#3c365c','#cdbbff'],['#ae896d','#433c42','#ffae5d'],['#926eaa','#342340','#e5b7ff']
];
function tint(c,k){let v=parseInt(c.slice(1,7),16);return '#'+[16,8,0].map(n=>Math.max(0,Math.min(255,Math.round(((v>>n)&255)*k+(k>1?(k-1)*25:0)))).toString(16).padStart(2,'0')).join('')}
function kit(c){
 const P=(d,f,s='#192029',w=.7)=>{c.beginPath();for(let [op,...a] of d){if(op==='M')c.moveTo(...a);else if(op==='L')c.lineTo(...a);else if(op==='Q')c.quadraticCurveTo(...a);else if(op==='C')c.bezierCurveTo(...a);else c.closePath()}if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=w;c.lineJoin='round';c.lineCap='round';c.stroke()}};
 const G=(x,y,X,Y,a,b)=>{let g=c.createLinearGradient(x,y,X,Y);g.addColorStop(0,a);g.addColorStop(.38,tint(a,1.08));g.addColorStop(1,b);return g};
 const E=(x,y,a,b,f,s=null)=>{c.beginPath();c.ellipse(x,y,a,b,0,0,Math.PI*2);c.fillStyle=f;c.fill();if(s){c.strokeStyle=s;c.lineWidth=.7;c.stroke()}};
 const L=(x,y,X,Y,s,w=1)=>P([['M',x,y],['L',X,Y]],null,s,w);
 const glow=(x,y,r,col)=>{let g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+'99');g.addColorStop(1,col+'00');E(x,y,r,r,g)};
 const limb=(x,y,X,Y,w,f)=>{L(x,y,X,Y,'#171c27',w+1.6);L(x,y,X,Y,f,w);L(x-1,y,X-1,Y,tint(f,1.35),Math.max(.7,w*.18))};
 return {P,G,E,L,glow,limb};
}
function hero(c,o={}){
 const kind=colors[o.character]?o.character:'knight',[base,sk,ha]=colors[kind],col=o.outfit||base,skin=o.skin||sk,hair=o.hair||ha,metal=o.armor?.color||'#a9b5c5',magic=o.magic||'#c4e7e5',t=o.time||0,pose=o.pose||'idle',run=pose==='run',air=pose==='jump',cast=pose==='cast',hurt=pose==='hurt';
 const {P,G,E,L,glow,limb}=kit(c);c.save();c.translate(o.x||0,o.y||0);c.scale((o.scale||1)*(o.face===-1?-1:1),o.scale||1);
 const sw=run?Math.sin(t/85)*13:air?7:0,bob=run?-Math.abs(Math.cos(t/85))*1.6:Math.sin(t/430)*.65;
 if(!air)E(0,-1,22,3.8,'#050a1470');c.translate(0,bob);c.rotate(hurt?-.12:run?.08:0);
 // Long cloak with separately shaded folds.
 P([['M',-9,-58],['Q',-21,-52,-20,-34],['Q',-22-sw*.4,-12,-30-sw*.35,-5],['Q',-15,-8,-6,-4],['Q',-4,-28,3,-54],['Z']],G(-22,-55,0,-12,tint(col,.88),tint(col,.38)));
 for(let j=0;j<4;j++)P([['M',-10-j*2,-52],['Q',-12-j*3,-29,-20-j*2-sw*.2,-10]],null,tint(col,.66),.65);
 // Articulated legs and high boots.
 for(let side of [-1,1]){let k=side*sw,fx=side*6+k,fy=air?-7-Math.max(0,k):0,kx=side*6+k*.55,ky=-15-Math.max(0,-k)*.2;limb(side*5,-31,kx,ky,8,tint(col,.54));limb(kx,ky,fx,fy-4,6.8,'#4c4542');P([['M',fx-4,fy-9],['L',fx+3,fy-9],['L',fx+4,fy-3],['L',fx+10,fy-1],['L',fx+9,fy+1],['L',fx-5,fy+1],['Z']],G(fx-4,fy-9,fx+8,fy,'#77635a','#27282d'));L(fx-3,fy-6,fx+3,fy-6,'#ae9980',.7)}
 // Tunic and fitted layered armor.
 P([['M',-11,-52],['Q',0,-57,11,-52],['L',15,-40],['L',8,-27],['L',-9,-27],['L',-14,-41],['Z']],G(-14,-53,14,-28,tint(col,1.35),tint(col,.48)));
 if(kind==='knight'){P([['M',-11,-51],['Q',0,-55,12,-50],['L',10,-39],['L',2,-31],['L',-9,-38],['Z']],G(-12,-54,13,-33,tint(metal,1.35),'#3e4b59'));for(let j=0;j<4;j++)L(-8,-43+j*2.7,9,-43+j*2.7,'#d7e3ed75',.7)}
 else{for(let j=0;j<5;j++)P([['M',-8+j*4,-50],['Q',-10+j*4,-38,-6+j*4,-31]],null,tint(col,.72),.7)}
 P([['M',-12,-32],['L',12,-32],['L',10,-27],['L',-11,-27],['Z']],'#45352f');P([['M',-1,-33],['L',5,-33],['L',5,-27],['L',-1,-27],['Z']],null,'#d6b77b',1.25);
 let hx=cast?29:air?20:13+sw*.65,hy=cast?-44:air?-39:-29;limb(-10,-49,-17,-38,7,tint(col,.65));limb(-17,-38,-15-sw*.4,-27,6,tint(col,.8));E(-15-sw*.4,-27,3,3,skin,'#362f32');
 limb(10,-49,17,-39,8,tint(col,.85));limb(17,-39,hx,hy,6,kind==='knight'?metal:tint(col,.73));E(hx,hy,3.7,3.3,G(hx-3,hy-3,hx+3,hy+3,tint(skin,1.2),skin),'#3b2e31');
 if(kind==='knight'){for(let s of [-1,1])P([['M',s*6,-52],['Q',s*15,-57,s*19,-48],['L',s*14,-42],['L',s*7,-45],['Z']],G(s*7,-55,s*18,-42,'#e1e5e9',metal));c.save();c.translate(hx,hy);c.rotate(cast?1.05:.36);P([['M',-2,3],['L',-3,-30],['L',0,-39],['L',3,-30],['L',2,3],['Z']],G(-3,-25,3,-25,'#eff6ff','#617991'));L(0,-36,0,-1,'#ffffffaa',.6);L(-7,1,7,1,'#d2aa70',2.4);L(0,1,0,9,'#694631',3);c.restore()}
 else if(kind==='mage'){let x=hx+8,y=hy-20;L(hx-4,hy+14,x,y,'#b19166',2.2);glow(x,y,cast?16:9,magic);P([['M',x,y-6],['L',x+4,y],['L',x,y+6],['L',x-4,y],['Z']],G(x-4,y-6,x+4,y+6,'#e6f4f4',magic))}
 else if(kind==='ranger'){P([['M',hx+7,hy-17],['Q',hx+25,hy,hx+7,hy+17]],null,'#c79c6f',2.3);L(hx+7,hy-17,hx+7,hy+17,'#e9d8bc',.65);if(cast)L(hx,hy,hx+27,hy,'#eee0c2',1.2)}
 else{P([['M',hx-1,hy],['L',hx+17,hy-9],['L',hx+12,hy+1],['Z']],G(hx,hy-9,hx+13,hy,'#e0e9ed','#637381'))}
 // Proportioned profile, hair, cloth or steel headgear.
 P([['M',-5,-56],['L',-5,-62],['L',5,-63],['L',7,-55],['Z']],skin);
 P([['M',-9,-68],['Q',-9,-79,1,-80],['Q',11,-78,10,-69],['L',13,-65],['L',10,-64],['L',9,-59],['Q',2,-54,-6,-61],['Z']],G(-8,-78,12,-60,tint(skin,1.24),tint(skin,.77)));
 P([['M',-10,-67],['Q',-15,-82,0,-84],['Q',11,-84,11,-75],['Q',5,-77,0,-72],['L',-5,-75],['L',-7,-65],['Z']],G(-9,-83,9,-70,tint(hair,1.32),hair));
 L(4,-70,9,-70,'#4b3434',.8);E(7,-68,1.1,1.2,'#293943');L(7,-62,10,-62,'#80544d',.7);
 if(kind==='knight'){P([['M',-13,-63],['L',-12,-76],['Q',-6,-87,5,-85],['Q',14,-81,14,-73],['L',12,-69],['L',-2,-70],['L',-4,-63],['Z']],G(-13,-85,14,-65,'#c9d1da','#45556a'));L(-9,-76,10,-76,'#e5e9e9',.8);L(-4,-69,12,-69,'#d9b477',1.1)}
 if(kind==='mage'){P([['M',-14,-74],['Q',-8,-85,-6,-96],['L',3,-89],['L',15,-74],['Z']],G(-10,-96,15,-74,tint(col,1.4),tint(col,.6)));P([['M',-21,-73],['Q',0,-78,22,-73],['L',19,-70],['L',-19,-70],['Z']],tint(col,.65))}
 if(kind==='ranger'||kind==='scout'){P([['M',-11,-59],['Q',-20,-76,-8,-86],['Q',4,-91,15,-76],['L',6,-76],['Q',-5,-76,-5,-63],['Z']],G(-15,-87,15,-62,tint(col,1.3),tint(col,.48)))}
 if(cast)glow(hx+10,hy-10,15,magic);
 c.restore();
}
function boss(c,o={}){
 let w=Math.max(0,Math.min(5,Number(o.territory)||0)),[light,dark,eye]=beasts[w],t=o.time||0,attack=!!o.attack,flash=Number(o.flash)||0,{P,G,E,L,glow,limb}=kit(c);
 c.save();c.translate(o.x||0,o.y||0);c.scale((o.scale||1)*(o.dir===-1?-1:1),o.scale||1);let bob=Math.sin(t/470)*1.3;E(0,-1,w===3?39:28,5,'#03091277');c.translate(0,bob);if(flash)c.globalAlpha=.88+.12*Math.cos(t/30);const body=G(-28,-65,30,-5,light,dark),ridge=tint(light,1.35);
 if(w===0||w===5){
  const hood=w===5?84:72;
  for(let i=0;i<5;i++){let x=-25+i*12,tail=Math.sin(t/350+i)*8;P([['M',x,-42],['Q',x-14,-17,x+tail,-2-i%2*4],['Q',x+9,-21,x+13,-42],['Z']],G(x,-42,x+8,-2,light,dark+'00'),null)}
  P([['M',-21,-50],['Q',-37,-36,-29,-5],['Q',-13,-14,-8,-5],['L',1,-18],['L',11,-4],['Q',37,-21,23,-51],['Z']],body);for(let i=0;i<7;i++)P([['M',-19+i*6,-49],['Q',-25+i*6,-29,-12+i*4,-15]],null,light+'88',.8);
  P([['M',-25,-43],['Q',-31,-hood,-4,-hood],['Q',23,-hood,26,-43],['L',13,-40],['Q',0,-52,-13,-40],['Z']],G(-25,-hood,25,-40,light,dark));
  P([['M',-16,-54],['Q',-15,-hood+9,0,-hood+8],['Q',15,-hood+8,17,-54],['L',8,-47],['L',-8,-47],['Z']],'#10101e');glow(0,-58,17,eye);E(-6,-59,3.2,1.7,eye);E(6,-59,3.2,1.7,eye);
  for(let s of [-1,1]){let ex=s*(attack?42:31),ey=attack?-54:-31;limb(s*19,-47,ex,ey,9,dark);P([['M',ex-5,ey-5],['L',ex+5,ey-5],['L',ex+7,ey+7],['L',ex,ey+3],['L',ex-7,ey+8],['Z']],body)}
  if(w===5){for(let i=0;i<7;i++){let a=i*2.399+t/1200,px=Math.cos(a)*37,py=-52+Math.sin(a)*31;P([['M',px,py-5],['L',px+3,py],['L',px,py+5],['L',px-3,py],['Z']],eye,'#4c3466')}}
 }else if(w===1||w===4){
  for(let s of [-1,1]){let fx=s*16;P([['M',s*7,-27],['L',s*22,-29],['L',fx+8,-6],['L',fx+13,0],['L',fx-11,0],['L',fx-9,-9],['Z']],body);P([['M',s*18,-59],['L',s*36,attack?-73:-48],['L',s*42,attack?-60:-29],['L',s*28,attack?-51:-18],['L',s*18,-34],['Z']],body);for(let j=0;j<3;j++)L(s*25,-44+j*5,s*33,-41+j*5,ridge,.8)}
  P([['M',-25,-54],['L',-16,-73],['L',17,-73],['L',27,-54],['L',19,-25],['L',0,-19],['L',-19,-25],['Z']],body);
  P([['M',-14,-71],['L',-11,-85],['L',10,-85],['L',15,-72],['L',10,-62],['L',-10,-62],['Z']],G(-13,-85,13,-62,ridge,dark));P([['M',-11,-74],['L',11,-74],['L',9,-69],['L',-9,-69],['Z']],'#181820');E(-5,-71,2.4,1.6,eye);E(5,-71,2.4,1.6,eye);
  if(w===1){for(let i=0;i<11;i++){let x=-19+(i*11)%38,y=-64+(i*13)%34;P([['M',x,y],['L',x+4,y+3],['L',x-1,y+7],['L',x+3,y+11]],null,i%3===0?eye:dark,.9)}}
  else {E(0,-43,12,12,dark,ridge);E(0,-43,7,7,eye,dark);for(let j=0;j<10;j++){let a=j*Math.PI/5+t/350;L(Math.cos(a)*9,-43+Math.sin(a)*9,Math.cos(a)*13,-43+Math.sin(a)*13,ridge,2)}for(let j=0;j<4;j++)L(-17,-56+j*6,-9,-56+j*6,'#d2aa8055',1)}
 }else if(w===2){
  // Feline body, four jointed legs and human-like ceremonial mask.
  for(let s of [-1,1]){limb(s*18,-23,s*22,-5,11,dark);E(s*22,-3,9,4,light,'#362d2b')}
  P([['M',-34,-25],['Q',-40,-46,-22,-48],['Q',-7,-49,16,-44],['Q',32,-41,34,-23],['Q',16,-10,-16,-13],['Z']],body);
  P([['M',-30,-26],['Q',-55,-36,-45,-52],['Q',-39,-60,-33,-52]],null,light,4);
  for(let j=0;j<8;j++)P([['M',-29+j*7,-40],['Q',-23+j*7,-32,-25+j*7,-23]],null,dark+'90',1.3);
  P([['M',13,-35],['L',9,-60],['L',16,-81],['L',40,-78],['L',47,-61],['L',42,-38],['Z']],G(9,-81,47,-38,light,dark));
  for(let j=0;j<5;j++)L(13+j*6,-72,16+j*5,-45,ridge,.85);
  P([['M',20,-69],['Q',29,-78,38,-68],['L',40,-58],['Q',29,-45,20,-58],['Z']],G(20,-70,40,-53,'#ddbb86','#78604c'));E(26,-64,2,1.4,eye);E(35,-64,2,1.4,eye);L(27,-54,35,-54,dark,1);glow(30,-75,10,eye);
 }else{
  // Dragon: organic curved membrane wings and scaled serpentine body.
  for(let s of [-1,1]){let wing=Math.sin(t/220)*6;P([['M',s*8,-46],['Q',s*23,-73-wing,s*53,-77-wing],['L',s*44,-52],['Q',s*30,-59,s*32,-34],['Q',s*19,-41,s*10,-24],['Z']],G(s*8,-30,s*48,-77,light,dark));for(let j=0;j<3;j++)L(s*10,-43,s*(33+j*7),-40-j*13-wing,ridge+'88',.85)}
  P([['M',-10,-15],['Q',-48,-2,-50,-25],['Q',-48,-39,-39,-34],['Q',-53,-15,-28,-14],['L',-4,-27],['Z']],body);
  P([['M',-23,-23],['Q',-28,-48,-8,-49],['Q',8,-50,17,-40],['L',28,-27],['Q',11,-8,-11,-11],['Z']],body);
  for(let j=0;j<12;j++){let x=-18+(j*13)%33,y=-42+(j*11)%26;P([['M',x-3,y],['Q',x,y+5,x+3,y]],null,ridge+'99',.7)}
  for(let s of [-1,1]){limb(s*10,-24,s*15,-5,9,dark);E(s*15,-2,8,3,light,'#252434')}
  P([['M',4,-37],['Q',7,-67,22,-68],['L',24,-80],['L',30,-70],['L',39,-73],['L',37,-63],['Q',51,-58,47,-48],['L',34,-45],['L',29,-30],['Z']],body);E(36,-58,2.6,1.8,eye);L(39,-50,48,-50,dark,1);if(attack)glow(49,-50,16,eye);
 }
 c.restore();
}
root.AstreonArt={hero,boss};
})(globalThis);
