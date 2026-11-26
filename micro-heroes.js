/* Micro-Collège — original vector character renderer, no external assets. */
(function(root){
'use strict';
const defaults={ranger:{outfit:'#e0ac68',skin:'#e4b78a',hair:'#664636'},scout:{outfit:'#64c5cc',skin:'#c58e67',hair:'#44332f'},knight:{outfit:'#8faacb',skin:'#d9a77f',hair:'#51362d'},mage:{outfit:'#c5a2e3',skin:'#a66e50',hair:'#392d3c'}};
function tint(c,k){const v=parseInt(c.slice(1),16);return '#'+[16,8,0].map(n=>Math.max(0,Math.min(255,Math.round(((v>>n)&255)*k+(k>1?(k-1)*35:0)))).toString(16).padStart(2,'0')).join('')}
function draw(ctx,opts={}){
 const kind=defaults[opts.character]?opts.character:'ranger',d=defaults[kind],o=opts.outfit||d.outfit,skin=opts.skin||d.skin,hair=opts.hair||d.hair,armor=opts.armor||{},ac=armor.color||'#c5c8d3',magic=opts.magic||'#baffea',t=opts.time||0,pose=opts.pose||'idle',running=pose==='run',air=pose==='jump'||pose==='fall',casting=pose==='cast',hurt=pose==='hurt',victory=pose==='victory',accessory=opts.accessory||'scarf';
 const ink='#19263a',gold='#e5c789',bob=running?-Math.abs(Math.sin(t/85))*2:air?0:Math.sin(t/380)*1.1;
 const P=(d,fill,stroke=ink,w=1.25)=>{ctx.beginPath();for(const a of d){const [cmd,...args]=a;if(cmd==='M')ctx.moveTo(...args);else if(cmd==='L')ctx.lineTo(...args);else if(cmd==='Q')ctx.quadraticCurveTo(...args);else if(cmd==='C')ctx.bezierCurveTo(...args);else if(cmd==='Z')ctx.closePath()}if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke()}};
 const E=(x,y,rx,ry,col,stroke=null,w=1)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke()}};
 const L=(x,y,X,Y,col,w=1)=>P([['M',x,y],['L',X,Y]],null,col,w);
 const G=(x,y,X,Y,a,b)=>{const g=ctx.createLinearGradient(x,y,X,Y);g.addColorStop(0,a);g.addColorStop(1,b);return g};
 const gem=(x,y,k,col)=>{P([['M',x,y-k],['L',x+k*.65,y],['L',x,y+k],['L',x-k*.65,y],['Z']],G(x-k,y-k,x+k,y+k,'#f9ffff',col),ink,.65);L(x,y-k,x,y+k,'#ffffff90',.7)};
 const halo=(x,y,r,col)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+'99');g.addColorStop(1,col+'00');E(x,y,r,r,g)};
 const limb=(x,y,X,Y,width,col)=>{L(x,y,X,Y,ink,width+2.2);L(x,y,X,Y,col,width);L(x-1,y,X-1,Y,tint(col,1.22),Math.max(1,width*.25))};
 ctx.save();ctx.translate(opts.x||0,opts.y||0);ctx.scale((opts.scale||1)*(opts.face===-1?-1:1),opts.scale||1);
 if(!air)E(0,-1,22,4,'#101c304b');ctx.translate(0,bob);if(hurt)ctx.rotate(-.08*Math.sin(t/45));else if(running)ctx.rotate(.07);
 const swing=running?Math.sin(t/80)*10:0,back=air?-8:-swing,front=air?8:swing;
 // Cape or coat tails, articulated legs and boots.
 if(kind==='mage'||kind==='scout'||accessory==='cape'){P([['M',-8,-51],['Q',-22,-38,-25-Math.abs(swing),-22],['Q',-18,-18,-10,-20],['L',5,-44],['Z']],G(-15,-50,-15,-18,tint(o,.78),tint(o,.42)),ink);L(-12,-47,-21,-24,tint(o,1.18),1.2)}
 if(kind==='ranger'){P([['M',-15,-46],['Q',-24,-45,-23,-34],['L',-21,-25],['Q',-15,-22,-9,-28],['Z']],G(-23,-46,-9,-25,'#b98b5b','#5b4143'),ink);L(-21,-37,-12,-36,gold,1.5)}
 for(const [x,step,far] of [[-7,back,true],[6,front,false]]){const kneeX=x+step*.45,kneeY=-12-(air?4:0),footX=x+step,footY=-4-(air?5:Math.max(0,-step*.35));limb(x,-25,kneeX,kneeY,8,far?'#2a3c53':'#44546a');limb(kneeX,kneeY,footX,footY,7,far?'#354359':'#637089');P([['M',footX-5,footY-3],['L',footX+4,footY-3],['Q',footX+10,footY-1,footX+10,footY+3],['L',footX-6,footY+3],['Z']],G(footX,footY-3,footX,footY+3,'#846550','#352d3b'),ink);L(footX-3,footY-2,footX+3,footY-2,gold,.9)}
 const chest=G(-15,-49,14,-20,tint(o,1.25),tint(o,.68));
 P([['M',-13,-48],['Q',0,-55,13,-48],['L',17,-29],['L',11,-20],['Q',0,-17,-12,-20],['L',-16,-32],['Z']],chest,ink);
 P([['M',-8,-49],['L',1,-36],['L',9,-49]],null,gold,1.8);
 if(kind==='mage'){P([['M',-10,-24],['L',-15,-9],['L',-3,-13],['L',1,-26],['Z']],tint(o,.83));P([['M',3,-25],['L',6,-13],['L',16,-10],['L',11,-25],['Z']],tint(o,.75));gem(0,-36,3,gold)}
 if(kind==='scout'){L(-12,-47,10,-24,'#41615d',4);L(-12,-47,10,-24,'#b3d1a2',1)}
 if(kind==='ranger'){L(-10,-47,8,-23,'#785642',4);L(-10,-47,8,-23,gold,1)}
 P([['M',-14,-27],['L',14,-27],['L',12,-21],['L',-12,-21],['Z']],'#594653');P([['M',-3,-28],['L',4,-28],['L',4,-21],['L',-3,-21],['Z']],gold,ink,.8);E(.5,-24.5,1.6,1.5,'#4e4553');
 // Different armor silhouettes and emblems.
 if(armor.id&&armor.id!=='basic'||kind==='knight'){
  const c=armor.id&&armor.id!=='basic'?ac:o,metal=G(-16,-49,16,-24,tint(c,1.33),tint(c,.56));
  P([['M',-13,-46],['L',0,-50],['L',13,-46],['L',15,-33],['Q',8,-27,0,-24],['Q',-8,-27,-15,-33],['Z']],metal,ink);
  P([['M',-12,-45],['L',0,-48],['L',12,-45]],null,'#f8f2d5a0',1.5);
  for(const s of [-1,1]){P([['M',s*9,-48],['Q',s*19,-51,s*23,-42],['L',s*17,-34],['L',s*10,-39],['Z']],metal,ink);L(s*12,-45,s*19,-42,'#e6e9e9',1)}
  const id=armor.id||'basic';if(id==='phoenix'){P([['M',0,-29],['Q',-10,-37,-2,-44],['Q',-3,-36,3,-40],['Q',10,-32,0,-29],['Z']],'#ffda91',null)}
  else if(['ocean','tempest'].includes(id)){P([['M',-7,-37],['Q',-3,-42,1,-37],['Q',5,-32,8,-37]],null,'#e9ffff',2.2)}
  else if(['insulator','alloy'].includes(id)){P([['M',2,-44],['L',-5,-35],['L',0,-35],['L',-2,-29],['L',6,-39],['L',1,-39],['Z']],gold,null)}
  else if(['night','eclipse'].includes(id)){E(0,-37,6,6,'#f3d9ae');E(3,-39,5,5,tint(c,.65))}
  else{gem(0,-37,6,c);L(-8,-33,-3,-30,gold,1);L(8,-33,3,-30,gold,1)}
 }
 const armY=victory?-60:casting?-40:air?-36:-35,handX=victory?20:casting?26:19+front*.25;
 limb(-12,-44,-17-back*.3,-33,7,tint(o,.65));E(-17-back*.3,-32,4,4,skin,ink);
 limb(12,-44,handX,armY,7,tint(o,.9));E(handX,armY,4.7,4.2,G(handX-3,armY-4,handX+3,armY+4,tint(skin,1.16),skin),ink);
 const tipX=handX+(victory?2:13),tipY=armY-(victory?18:12);L(handX,armY,tipX,tipY,ink,4.5);L(handX,armY,tipX,tipY,'#d0ab71',2.5);halo(tipX,tipY,casting?19:11,magic);gem(tipX,tipY,casting?6:4,magic);
 if(casting){for(let i=0;i<5;i++){const a=t/80+i*Math.PI*2/5;E(tipX+Math.cos(a)*12,tipY+Math.sin(a)*8,1.3,1.3,magic)}}
 // Head: shaded skin, shaped hair, ears, eyes and expressive brows.
 const face=G(-13,-69,14,-46,tint(skin,1.14),tint(skin,.88));
 E(-11,-57,4,5,skin,ink);P([['M',-12,-62],['Q',-10,-73,3,-72],['Q',15,-71,16,-60],['L',18,-56],['L',15,-53],['Q',15,-45,5,-45],['Q',-8,-46,-11,-55],['Z']],face,ink);
 P([['M',-13,-60],['Q',-15,-75,-1,-76],['Q',11,-77,15,-67],['Q',5,-69,-1,-63],['L',-5,-67],['L',-9,-57],['Z']],G(-10,-76,12,-58,tint(hair,1.22),hair),ink);
 const blink=!casting&&!hurt&&t%4600>4430;
 if(blink)L(6,-59,13,-59,ink,1.5);else{E(9,-59,4.2,5.2,'#fff7e9',ink,.65);E(10.3,-59,2.4,3.8,hurt?'#92555b':'#365963');E(10.8,-60.8,1.05,1.05,'#fff');}
 L(5,-65,13,-64,ink,1.4);P([['M',6,-50],['Q',10,hurt?-53:-47,14,-50]],null,'#925d55',1.2);
 if(kind==='ranger'){P([['M',-17,-69],['L',-13,-82],['Q',-2,-87,10,-81],['L',16,-70],['Z']],G(-14,-83,15,-68,tint(o,1.23),tint(o,.63)),ink);P([['M',-21,-69],['Q',-1,-73,21,-69],['L',20,-65],['Q',-3,-62,-21,-66],['Z']],'#594653',ink);L(-13,-72,13,-72,gold,1.5);gem(-4,-73,3,gold)}
 else if(kind==='scout'){P([['M',-15,-49],['Q',-28,-71,-10,-82],['Q',2,-88,15,-75],['L',19,-66],['Q',4,-74,-7,-65],['L',-7,-50],['Z']],G(-23,-85,15,-49,tint(o,1.26),tint(o,.62)),ink);L(-12,-78,2,-81,'#d4f1d8',1.4)}
 else if(kind==='knight'){P([['M',-16,-52],['L',-17,-70],['Q',-10,-84,3,-84],['Q',18,-82,20,-68],['L',18,-64],['L',-4,-64],['L',-5,-52],['Z']],G(-17,-82,20,-52,'#dbe5ed',tint(o,.64)),ink);P([['M',-2,-78],['L',2,-91],['L',9,-82],['L',6,-76],['Z']],o,ink);L(-13,-69,16,-69,gold,1.3)}
 else{P([['M',-18,-69],['L',-6,-90],['L',2,-87],['L',17,-69],['Z']],G(-12,-91,16,-69,tint(o,1.25),tint(o,.55)),ink);P([['M',-24,-69],['Q',0,-74,24,-69],['L',22,-65],['Q',0,-62,-23,-65],['Z']],tint(o,.67),ink);gem(-1,-74,4,gold)}
 if(accessory==='scarf'){P([['M',-11,-48],['L',13,-47],['L',11,-42],['L',-10,-42],['L',-20-Math.abs(swing)*.5,-34],['L',-16,-44],['Z']],G(-12,-48,10,-34,'#a8e4d1','#4f9d99'),ink,.8)}
 if(accessory==='amulet'){P([['M',-7,-46],['L',0,-38],['L',7,-46]],null,gold,1.4);gem(0,-37,3,gold)}
 if(accessory==='glasses'){ctx.beginPath();ctx.ellipse(9,-59,6,6,0,0,Math.PI*2);ctx.strokeStyle='#4b4c57';ctx.lineWidth=1.6;ctx.stroke();L(3,-60,-5,-61,'#4b4c57',1.4)}
 if(victory){for(let i=0;i<6;i++){const a=t/550+i*Math.PI/3;gem(Math.cos(a)*28,-58+Math.sin(a)*25,2.5,gold)}}
 ctx.restore();
}
function portrait(kind,colors,accessory,armor,magic){
 const c=root.document?.createElement('canvas');if(!c||typeof c.toDataURL!=='function')return null;c.width=240;c.height=280;const ctx=c.getContext('2d');if(!ctx)return null;const g=ctx.createLinearGradient(0,0,240,280);g.addColorStop(0,'#1b2b45');g.addColorStop(1,'#465472');ctx.fillStyle=g;ctx.fillRect(0,0,240,280);ctx.beginPath();ctx.ellipse(120,126,82,101,0,0,Math.PI*2);ctx.fillStyle='#b9c9ed15';ctx.fill();ctx.strokeStyle='#dfd8bb40';ctx.lineWidth=2;ctx.stroke();draw(ctx,{character:kind,...colors,accessory,armor,magic,x:107,y:244,scale:2.35,time:120,pose:'idle'});return c.toDataURL('image/png')
}
root.MicroHeroes={draw,portrait,defaults};
})(globalThis);
