/* V1.30 — école antique imaginaire de Crotone, décor et élèves séparés. */
(function(root){
'use strict';
const colors=[['#a98256','#47352a','#b47648'],['#e1ba91','#5d4434','#537a79'],['#b98660','#302d29','#a4a17a']];
function path(c,d,fill,stroke=null,w=1){c.beginPath();for(let [op,...a] of d){if(op==='M')c.moveTo(...a);else if(op==='L')c.lineTo(...a);else if(op==='Q')c.quadraticCurveTo(...a);else if(op==='C')c.bezierCurveTo(...a);else c.closePath()}if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.lineJoin='round';c.lineCap='round';c.stroke()}}
function ellipse(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill()}
function gradient(c,x,y,X,Y,...v){let g=c.createLinearGradient(x,y,X,Y);v.forEach((s,i)=>g.addColorStop(i/(v.length-1),s));return g}
function poly(c,p,f){path(c,[...p.map((v,i)=>[i?'L':'M',...v]),['Z']],f)}
function scenery(c){
 c.fillStyle=gradient(c,0,0,0,540,'#94bfce','#f7eed2','#c9bc95');c.fillRect(0,0,960,540);
 ellipse(c,780,95,35,35,'#fff6cf');poly(c,[[0,280],[170,100],[290,234],[415,137],[600,290]],'#9baea9');poly(c,[[370,280],[580,135],[710,250],[865,145],[960,244],[960,350]],'#b2c0ab');
 c.fillStyle=gradient(c,0,236,0,360,'#a4b7a0','#d3d5ab');c.fillRect(0,250,960,100);
 c.fillStyle='#8caaa8';c.fillRect(550,250,410,70);for(let i=0;i<11;i++){let x=560+i*37;path(c,[['M',x,270+(i%3)*12],['L',x+28,270+(i%3)*12]],null,'#d7e4d7',1.8)}
 for(let i=0;i<5;i++){let x=78+i*173;c.fillStyle='#8a8b68';c.fillRect(x,245,8,90);for(let j=0;j<4;j++)ellipse(c,x+Math.cos(j*2.4)*14,250-j*19,15,28,'#71876b')}
 c.fillStyle=gradient(c,0,340,0,540,'#d9cdb2','#b09d7c');c.fillRect(0,341,960,199);
 for(let i=0;i<7;i++)path(c,[['M',0,351+i*i*4.6],['L',960,351+i*i*4.6]],null,'#af9f85',1);
 for(let i=-5;i<10;i++)path(c,[['M',480+i*43,342],['L',480+i*130,540]],null,'#b3a184',1);
 for(let x of [25,245,715,935]){c.fillStyle=gradient(c,x-24,0,x+24,0,'#a89c83','#f7efd4','#c0b49a');c.fillRect(x-19,32,38,309);for(let j=-12;j<=12;j+=6){c.fillStyle='#c1b69d';c.fillRect(x+j,46,2,283)}c.fillStyle='#c4b598';c.fillRect(x-30,30,60,13);c.fillRect(x-26,330,52,16)}
 c.fillStyle=gradient(c,0,0,0,46,'#ab9b82','#e3d2b0');c.fillRect(0,0,960,29);c.fillStyle='#9e8d70';c.fillRect(0,29,960,8);
 poly(c,[[0,37],[960,37],[960,47],[0,47]],'#c9b99b');
}
function pupil(c,o){
 let [skin,hair,robe]=colors[o.id%3],s=o.scale||1; c.save();c.translate(o.x,o.y);c.scale((o.face||1)*s,s);
 const G=(x,y,X,Y,...v)=>gradient(c,x,y,X,Y,...v);const P=(d,f,st,w)=>path(c,d,f,st,w);
 ellipse(c,0,94,43,9,'#35413a36');
 P([['M',-19,5],['Q',-43,12,-46,45],['L',-40,94],['L',43,94],['Q',46,35,28,12],['L',16,5],['Z']],G(-40,10,40,90,'#e4d6b7',robe,'#5b635b'),'#6c6858');
 P([['M',-25,17],['L',28,58],['L',40,93],['L',9,94],['L',-43,42],['Z']],G(-38,17,38,94,robe,'#e1c7a2',robe));
 for(let j=0;j<3;j++)P([['M',-28+j*8,22],['Q',-5+j*5,54,24+j*4,90]],null,'#f3d9b677',1.5);
 P([['M',-18,9],['L',-16,-9],['L',16,-9],['L',18,10],['Q',0,23,-18,9],['Z']],skin,'#8e6248');
 ellipse(c,-27,-29,6,9,skin);ellipse(c,27,-29,6,9,skin);
 P([['M',-27,-43],['Q',-28,-71,0,-74],['Q',29,-70,28,-42],['L',24,-16],['Q',10,2,0,3],['Q',-18,-1,-25,-19],['Z']],G(-30,-60,30,-15,'#896349',skin,'#ab7756'),'#805b48');
 P([['M',-26,-25],['Q',-41,-66,-12,-77],['Q',10,-88,28,-64],['Q',34,-48,25,-35],['L',17,-59],['Q',0,-48,-15,-59],['L',-22,-34],['Z']],G(-28,-75,29,-36,hair,'#6e5842',hair));
 for(let j=0;j<6;j++)P([['M',-20+j*8,-66],['Q',-10+j*5,-79,-2+j*4,-64]],null,'#ab947055',1.6);
 for(let x of [-10,13]){P([['M',x-6,-37],['Q',x,-40,x+6,-37]],null,hair,1.7);ellipse(c,x+1,-32,5,2.4,'#fff1d5');ellipse(c,x+2,-32,2,2,'#303e3a')}
 P([['M',2,-38],['Q',1,-27,7,-24]],null,'#97664b',1.2);ellipse(c,5,-15,6,1.1+(o.mouth||0)*3,'#754638');
 P([['M',-36,46],['Q',-24,44,-20,53],['L',8,69],['Q',16,75,7,80],['L',-32,68],['Z']],skin,'#926d51');
 P([['M',34,48],['L',40,66],['L',15,79],['Q',4,76,10,69],['Z']],skin,'#926d51');
 // wax tablet at rest
 P([['M',-22,72],['L',24,66],['L',34,91],['L',-15,96],['Z']],'#8b6846','#604d36',2);P([['M',-16,76],['L',21,72],['L',27,87],['L',-12,91],['Z']],'#d2ba8b');
 c.restore()
}
function table(c,x,y,w){poly(c,[[x,y],[x+w,y],[x+w-15,y+22],[x+10,y+22]],'#c09c69');c.fillStyle='#8b6b48';c.fillRect(x+17,y+22,16,75);c.fillRect(x+w-37,y+22,16,75);c.fillStyle='#d8b888';c.fillRect(x,y, w,5)}
function draw(c,o){
 scenery(c);
 let shot=o.shot,voice=o.speaker,open=o.mouth;
 if(shot==='wide'){
  root.AstreonSage.draw(c,{x:477,y:253,scale:1.55,mouth:voice==='Pythagore'?open:0});
  pupil(c,{id:0,x:150,y:352,scale:1.43,face:1,mouth:voice==='Nikos'?open:0});
  pupil(c,{id:1,x:768,y:343,scale:1.42,face:-1,mouth:voice==='Daphné'?open:0});
  pupil(c,{id:2,x:307,y:400,scale:1.23,face:1,mouth:voice==='Léon'?open:0});
  table(c,370,415,230);
  poly(c,[[420,405],[520,405],[520,415],[420,415]],'#e4cfaa');
  path(c,[['M',445,410],['L',445,380],['L',496,410],['Z']],null,'#8f6340',3);
 }else if(shot==='student'){
  root.AstreonSage.draw(c,{x:795,y:245,scale:1.24,mouth:0});
  let id=voice==='Nikos'?0:voice==='Daphné'?1:2;
  pupil(c,{id,x:445,y:300,scale:2.55,face:1,mouth:open});
  pupil(c,{id:(id+1)%3,x:150,y:348,scale:1.2,face:1,mouth:0});
  table(c,260,478,375);
 }else{
  pupil(c,{id:0,x:60,y:412,scale:.92,face:1,mouth:0});
  root.AstreonSage.draw(c,{x:195,y:270,scale:1.82,mouth:voice==='Pythagore'?open:0});
  table(c,22,472,325);
 }
 // soft vignette, not a dark scene
 let g=c.createRadialGradient(480,270,240,480,270,565);g.addColorStop(0,'#fff4d000');g.addColorStop(1,'#69573822');c.fillStyle=g;c.fillRect(0,0,960,540)
}
root.AstreonClassroom=Object.freeze({draw});
})(globalThis);
