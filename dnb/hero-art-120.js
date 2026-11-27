/* Astréon V1.20 — original layered fantasy hero art; live poses and colours. */
(function(root){
'use strict';
const defaults={knight:['#42658e','#e1b68c','#514039'],mage:['#765697','#ad795b','#30283c'],ranger:['#577151','#d9ae87','#594036'],scout:['#397b85','#c39170','#332f35']};
const valid=(s,f)=>/^#[0-9a-f]{6}$/i.test(s||'')?s:f;
function shade(s,f){let n=parseInt(s.slice(1),16);return '#'+[16,8,0].map(k=>Math.round(Math.max(0,Math.min(255,((n>>k)&255)*f+(f>1?(f-1)*25:0)))).toString(16).padStart(2,'0')).join('')}
function hero(c,o={}){
 let kind=Object.hasOwn(defaults,o.character)?o.character:'knight',[base,sk,ha]=defaults[kind],col=valid(o.outfit,base),skin=valid(o.skin,sk),hair=valid(o.hair,ha),metal=valid(o.armor?.color,'#a9b5c5'),magic=valid(o.magic,'#b3dcf0'),t=o.time||0,run=o.pose==='run',air=o.pose==='jump',cast=o.pose==='cast',hurt=o.pose==='hurt',swing=run?Math.sin(t/85)*11:air?5:0;
 const G=(x,y,X,Y,...stops)=>{let g=c.createLinearGradient(x,y,X,Y);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g};
 const P=(d,fill,stroke='#182633',w=.55)=>{c.beginPath();for(let [op,...a] of d){if(op==='M')c.moveTo(...a);else if(op==='L')c.lineTo(...a);else if(op==='Q')c.quadraticCurveTo(...a);else if(op==='C')c.bezierCurveTo(...a);else c.closePath()}if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke()}};
 const line=(x,y,X,Y,s,w=.65)=>P([['M',x,y],['L',X,Y]],null,s,w);
 const E=(x,y,a,b,f,s=null)=>{c.beginPath();c.ellipse(x,y,a,b,0,0,Math.PI*2);c.fillStyle=f;c.fill();if(s){c.strokeStyle=s;c.lineWidth=.55;c.stroke()}};
 const gold=G(-10,-50,15,-26,'#7f5732','#f1d8a1','#b4894d','#614527'),steel=G(-17,-56,17,-35,'#405365',shade(metal,1.3),'#e2e8eb',shade(metal,.55)),cloth=G(-20,-55,19,-20,shade(col,.45),shade(col,1.35),col,shade(col,.45));
 function gem(x,y,r,color=magic){let g=c.createRadialGradient(x,y,0,x,y,r*3);g.addColorStop(0,color+'bb');g.addColorStop(1,color+'00');E(x,y,r*3,r*3,g);P([['M',x,y-r],['L',x+r,y],['L',x,y+r],['L',x-r,y],['Z']],G(x-r,y-r,x+r,y+r,'#f3f9ff',color,shade(color,.45)),'#e1c892',.6)}
 function stud(x,y){E(x,y,.8,.8,'#d7bd85','#6a563e')}
 c.save();c.translate(o.x||0,o.y||0);c.scale((o.scale||1)*(o.face===-1?-1:1),o.scale||1);
 if(!air)E(0,-1,22,3,'#060e1c77');c.translate(0,run?-Math.abs(Math.cos(t/85))*1.6:Math.sin(t/460)*.4);c.rotate(hurt?-.12:run?.045:0);
 // Long, separately lit cloak, embroidered edges and wind-blown hem.
 let hem=-25-swing*.6;
 P([['M',-12,-62],['C',-26,-57,-19,-36,hem,-8],['Q',-19,-4,-12,-11],['Q',-6,-3,6,-8],['Q',5,-30,10,-58],['Z']],G(-27,-50,6,-14,shade(col,.38),shade(col,1.16),shade(col,.52)));
 for(let j=0;j<5;j++)P([['M',-13+j*3,-58],['C',-15+j*2,-45,-18+j*4,-20,hem+j*6,-9]],null,j%2?'#101b2c65':shade(col,1.25),.65);
 P([['M',-15,-59],['Q',-21,-36,hem,-8],['Q',-19,-4,-12,-11],['Q',-6,-3,6,-8]],null,'#d6b77c',.85);
 // Layered boots, greaves, straps and knee guards.
 for(let side of [-1,1]){
  let x=side*6,fx=x+side*swing,ky=-18-(air?3:0),kx=x+side*swing*.48,fy=air?-5:0;
  P([['M',x-5,-35],['L',x+5,-35],['L',kx+4,ky],['L',kx-4,ky],['Z']],G(x-5,-34,x+6,ky,'#39444f',shade(col,.6),'#202b34'));
  P([['M',kx-4,ky],['L',kx+5,ky],['L',fx+3,fy-7],['L',fx-4,fy-7],['Z']],G(kx-5,ky,fx+5,fy-7,'#705a45','#b29a7a','#382c28'));
  if(kind==='knight'){P([['M',kx-5,ky-4],['L',kx+5,ky-4],['L',kx+6,ky+1],['L',kx,ky+5],['L',kx-5,ky+1],['Z']],steel);P([['M',kx-3,ky+4],['L',kx+3,ky+4],['L',fx+3,fy-8],['L',fx-3,fy-8],['Z']],steel);line(kx,ky+5,fx,fy-9,'#eff2f5',.7)}
  else{for(let j=0;j<3;j++){line(kx-3,ky+5+j*3,kx+3,ky+6+j*3,'#bc9d76',.8)}}
  P([['M',fx-4,fy-9],['L',fx+4,fy-9],['L',fx+6,fy-4],['Q',fx+12,fy-3,fx+11,fy+1],['L',fx-6,fy+1],['Z']],G(fx-6,fy-9,fx+10,fy+1,'#886d51','#483a31','#26282c'));line(fx-5,fy,fx+10,fy,'#bd9c6e',.75)
 }
 // Torso, leather undersuit, embroidered tabard and individual equipment.
 P([['M',-13,-58],['Q',0,-62,13,-58],['L',17,-46],['L',11,-33],['L',-10,-33],['L',-16,-47],['Z']],cloth);
 P([['M',-11,-57],['Q',0,-60,11,-57],['L',9,-42],['Q',0,-35,-9,-42],['Z']],kind==='knight'?steel:G(-11,-57,11,-42,shade(col,1.4),shade(col,.62),col));
 if(kind==='knight'){
  P([['M',-10,-55],['Q',0,-58,10,-55],['L',7,-42],['L',0,-38],['L',-7,-42],['Z']],null,'#e2c491',.85);line(0,-55,0,-40,'#e9edf0',.7);
  for(let i=0;i<4;i++){P([['M',-9,-44+i*2],['Q',0,-39+i*2,9,-44+i*2]],null,'#253744',.75)}
  P([['M',-6,-34],['L',7,-34],['L',9,-19],['L',0,-23],['L',-8,-19],['Z']],G(-8,-33,9,-20,col,shade(col,.6)));line(0,-33,0,-24,'#e5c28a',.9);
 }else{
  P([['M',-12,-56],['L',-5,-44],['L',0,-36],['L',5,-44],['L',12,-56]],null,'#cfb37c',1);
  P([['M',-8,-34],['L',8,-34],['L',12,-18],['L',0,-22],['L',-12,-18],['Z']],cloth);
  for(let j=0;j<3;j++)line(-8+j*4,-33,-11+j*5,-20,shade(col,1.2),.7);
 }
 P([['M',-13,-36],['L',13,-36],['L',12,-30],['L',-12,-30],['Z']],G(-12,-36,12,-30,'#7b593d','#48362c','#2b2626'));P([['M',-4,-37],['L',4,-37],['L',4,-30],['L',-4,-30],['Z']],null,'#e3c18a',1.1);line(0,-37,0,-30,'#e3c18a',.8);
 for(let i of [-9,-6,6,9])stud(i,-33);
 if(kind==='ranger'||kind==='scout'){P([['M',-12,-55],['L',-8,-58],['L',12,-34],['L',9,-31],['Z']],G(-11,-55,12,-34,'#af906a','#4c3629'));for(let i=0;i<4;i++)stud(-8+i*5,-53+i*6);P([['M',-14,-34],['L',-5,-35],['L',-5,-24],['L',-13,-23],['Z']],G(-14,-35,-5,-23,'#a18158','#473b2d'))}
 if(kind==='mage'){gem(0,-48,2.4);for(let i=-1;i<=1;i++)P([['M',i*4,-29],['L',i*4+2,-25],['L',i*4,-21],['L',i*4-2,-25],['Z']],null,'#e3c18a',.6)}
 // Shoulder armor, articulated bracers and hands.
 let hx=cast?28:air?19:17+swing*.5,hy=cast?-47:air?-39:-30;
 for(let side of [-1,1]){
  let ex=side===1?hx:-19-swing*.35,ey=side===1?hy:-31,el=side===1?19:-19;
  P([['M',side*10,-57],['Q',side*18,-61,side*22,-51],['L',side*18,-43],['L',side*8,-48],['Z']],kind==='knight'?steel:cloth);
  P([['M',side*11,-55],['Q',side*18,-57,side*20,-51],['L',side*16,-47]],null,'#d8bd83',.9);
  stud(side*17,-51);
  line(side*15,-48,el,-40,'#202b34',8);line(side*15,-48,el,-40,shade(col,.8),6.2);
  line(el,-40,ex,ey,'#1c2933',7);line(el,-40,ex,ey,kind==='knight'?metal:'#886d4d',5.5);
  line(el-1,-40,ex-1,ey-1,'#e0c3a2',.9);E(ex,ey,3.3,3.8,G(ex-4,ey-4,ex+3,ey+4,shade(skin,1.2),shade(skin,.7)),'#43332d')
 }
 // Class-specific silhouettes and equipment.
 if(kind==='knight'){
  c.save();c.translate(-20-swing*.35,-34);P([['M',-9,-12],['L',8,-12],['L',10,3],['Q',7,13,0,17],['Q',-8,12,-10,3],['Z']],G(-10,-12,10,17,'#d3d9d8','#627b90','#293e53'),'#e3c18a',1);P([['M',-6,-9],['L',5,-9],['L',7,3],['L',0,12],['L',-6,3],['Z']],cloth,'#bca478');P([['M',0,-7],['L',2,-1],['L',6,1],['L',2,3],['L',0,9],['L',-2,3],['L',-6,1],['L',-2,-1],['Z']],gold);c.restore();
  c.save();c.translate(hx,hy);c.rotate(cast?1.12:.25);P([['M',-2,2],['L',-3,-32],['L',0,-43],['L',3,-32],['L',2,2],['Z']],G(-3,-25,3,-25,'#4e677e','#f3f9ff','#a2b9cb','#4c6176'));line(0,-39,0,-2,'#f3f7fa',.7);P([['M',-8,-1],['Q',0,3,8,-1],['L',6,3],['L',-6,3],['Z']],gold);line(0,3,0,11,'#6b4b37',3);E(0,12,2.5,2.5,gold);c.restore()
 }else if(kind==='mage'){
  let sx=hx+8,sy=hy-35;line(hx-5,hy+23,sx,sy,'#2e2e32',4);line(hx-5,hy+23,sx,sy,'#c29d6c',2.5);P([['M',sx-6,sy+6],['Q',sx-10,sy-7,sx,sy-12],['Q',sx+10,sy-7,sx+6,sy+6]],null,'#e4c18a',1.5);gem(sx,sy-2,cast?5:3.8);
 }else if(kind==='ranger'){
  P([['M',-20,-55],['L',-13,-58],['L',-9,-27],['L',-18,-26],['Z']],G(-20,-57,-9,-27,'#b69569','#493b2d'));for(let i=0;i<3;i++){line(-18+i*3,-58,-17+i*3,-69,'#e3caa2',.75)}
  P([['M',hx+4,hy-19],['Q',hx+26,hy-5,hx+4,hy+20]],null,'#deb88b',2.7);P([['M',hx+4,hy-19],['L',hx+(cast?-8:4),hy],['L',hx+4,hy+20]],null,'#ebdfce',.65);if(cast)line(hx-8,hy,hx+26,hy,'#f2dfbd',1.1)
 }else{
  c.save();c.translate(hx,hy);c.rotate(cast?.8:.1);P([['M',-1,1],['L',4,-17],['L',13,-25],['L',9,-8],['L',3,2],['Z']],G(0,-18,13,-9,'#eef5f7','#7592a6','#32495c'));line(-3,1,7,5,'#dcb87d',2);c.restore();
  P([['M',-18,-35],['L',-8,-38],['L',-4,-29],['L',-15,-25],['Z']],G(-18,-35,-4,-25,'#d4c3a0','#77634d'));line(-14,-31,-7,-33,'#594e41',.6)
 }
 // Face with natural proportions, hair strands, sculpted headgear.
 P([['M',-5,-59],['L',-5,-66],['L',5,-66],['L',6,-59],['Z']],G(-5,-66,6,-59,shade(skin,.72),skin));
 P([['M',-9,-72],['Q',-10,-82,0,-84],['Q',10,-82,10,-73],['L',13,-69],['L',10,-67],['Q',10,-62,4,-60],['L',-2,-60],['Q',-8,-64,-9,-72],['Z']],G(-10,-83,12,-61,shade(skin,1.24),skin,shade(skin,.68)),'#453a35',.45);
 E(-6,-71,2,2.8,shade(skin,.85),'#6b5344');P([['M',-10,-70],['Q',-16,-84,-1,-87],['Q',10,-87,11,-79],['Q',5,-81,1,-77],['L',-4,-79],['L',-6,-70],['Z']],G(-12,-86,10,-69,shade(hair,1.35),hair,shade(hair,.58)));
 for(let j=0;j<5;j++)P([['M',-10+j*3,-82],['Q',-6+j*3,-88,0+j*2,-80]],null,shade(hair,1.5),.48);
 line(3,-75,9,-74,'#4c3730',.65);E(6.7,-72.6,1.2,.65,'#e1ded5');E(7.2,-72.6,.65,.65,'#263b3d');line(8,-66,10,-66,'#8a5546',.55);line(4,-64,8,-64,'#a57962',.45);
 if(kind==='knight'){
  P([['M',-13,-65],['L',-14,-78],['Q',-9,-90,2,-89],['Q',14,-86,14,-77],['L',12,-74],['L',-3,-75],['L',-4,-65],['Z']],G(-14,-87,14,-66,'#3b4e62','#dbe4e9','#8195a8','#354957'),'#223647',.7);
  P([['M',-13,-77],['Q',-1,-85,13,-77]],null,'#f0d7a2',1);line(-3,-75,12,-74,'#e5e9ec',.9);P([['M',-5,-86],['Q',-14,-94,-21,-88],['Q',-13,-88,-9,-82]],G(-21,-92,-5,-83,shade(col,1.4),col));
 }else if(kind==='mage'){
  P([['M',-15,-77],['Q',-10,-88,-9,-99],['Q',1,-93,4,-88],['L',15,-77],['Z']],G(-12,-99,15,-77,shade(col,.5),shade(col,1.4),col),'#302d40');
  P([['M',-22,-77],['Q',0,-82,23,-77],['L',19,-73],['Q',0,-77,-19,-73],['Z']],cloth,'#d7ba84');line(-12,-81,11,-81,'#d7ba84',.8);gem(1,-82,1.7)
 }else if(kind==='ranger'){
  P([['M',-11,-62],['Q',-22,-80,-8,-89],['Q',4,-95,16,-79],['L',7,-77],['Q',-4,-79,-5,-65],['Z']],G(-18,-89,16,-62,shade(col,.45),shade(col,1.4),col,shade(col,.5)));P([['M',-11,-62],['Q',-17,-80,-8,-87],['Q',4,-92,16,-79]],null,'#c5b07f',.75)
 }else{
  P([['M',-12,-66],['Q',-17,-84,-5,-89],['Q',7,-89,13,-80],['L',8,-77],['L',-4,-78],['L',-6,-65],['Z']],cloth);P([['M',-12,-79],['Q',0,-84,13,-79]],null,'#dfc392',1);P([['M',-10,-65],['L',4,-64],['L',1,-59],['L',-9,-58],['Z']],G(-10,-65,4,-58,shade(col,1.35),shade(col,.55)));
 }
 c.restore()
}
root.AstreonHero120={hero};
})(globalThis);