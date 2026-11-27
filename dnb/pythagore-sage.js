/* V1.29 — Pythagore, portrait original articulé, et manipulation de 25 briques. */
(function(root){
'use strict';
function draw(c,o={}){
 c.save();c.translate(o.x||0,o.y||0);c.scale(o.scale||1,o.scale||1);
 const grad=(x,y,X,Y,...colors)=>{let g=c.createLinearGradient(x,y,X,Y);colors.forEach((v,i)=>g.addColorStop(i/(colors.length-1),v));return g};
 const P=(d,f,s=null,w=1)=>{c.beginPath();for(let [op,...a] of d){if(op==='M')c.moveTo(...a);else if(op==='L')c.lineTo(...a);else if(op==='Q')c.quadraticCurveTo(...a);else if(op==='C')c.bezierCurveTo(...a);else c.closePath()}if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke()}};
 const E=(x,y,rx,ry,f,s=null)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=f;c.fill();if(s){c.strokeStyle=s;c.lineWidth=.8;c.stroke()}};
 const L=(x,y,X,Y,s,w=1)=>P([['M',x,y],['L',X,Y]],null,s,w);
 let linen=grad(-65,8,66,100,'#9b8b70','#fff7db','#d6c6a5','#8f8067'),blue=grad(-55,0,62,90,'#304d62','#7895a0','#3d5d72'),skin=grad(-35,-60,35,-20,'#a87959','#eac3a0','#bb8a65'),hair=grad(-35,-100,36,-10,'#8e8a7f','#faf5e4','#c4bcaa','#8f8c83');
 // Body, classical himation, neck, stationary forearms. No wizard accessories.
 E(0,115,68,8,'#243f4330');
 P([['M',-23,-13],['C',-47,-8,-65,8,-70,38],['L',-64,116],['L',64,116],['L',70,38],['C',63,10,42,-7,24,-13],['Z']],linen,'#88775f');
 P([['M',-28,-17],['L',-24,-36],['L',24,-36],['L',28,-17],['Q',0,10,-28,-17],['Z']],skin,'#9a735b');
 P([['M',-55,4],['Q',-22,28,12,43],['Q',45,52,66,81],['L',59,116],['L',13,116],['Q',6,71,-42,46],['L',-66,32],['Z']],blue,'#344e5b');
 for(let i=0;i<5;i++)P([['M',-53+i*4,11+i*3],['Q',-25+i*6,39+i*5,45+i*3,78+i*6]],null,i%2?'#b0c1c1':'#38576c',1.5);
 P([['M',-64,45],['Q',-55,52,-46,43],['L',-34,80],['L',-7,94],['Q',-1,103,-13,107],['L',-51,91],['Q',-61,85,-64,45],['Z']],skin,'#95725b');
 P([['M',64,45],['Q',55,53,46,43],['L',34,79],['L',8,94],['Q',1,103,13,107],['L',51,91],['Q',61,85,64,45],['Z']],skin,'#95725b');
 // Forehead, receding white curls, face and ears.
 E(-36,-51,9,15,skin,'#aa795b');E(36,-51,9,15,skin,'#aa795b');
 P([['M',-36,-65],['C',-38,-102,-21,-119,0,-118],['C',25,-119,39,-99,36,-65],['L',34,-31],['Q',30,-5,0,5],['Q',-31,-7,-34,-31],['Z']],skin,'#805d49');
 P([['M',-37,-51],['C',-49,-72,-44,-103,-24,-115],['Q',-4,-129,15,-117],['Q',37,-117,43,-88],['L',36,-55],['Q',28,-70,29,-91],['Q',14,-107,-1,-104],['Q',-26,-108,-30,-83],['L',-35,-52],['Z']],hair,'#9b9281');
 for(let side of [-1,1])for(let i=0;i<6;i++)E(side*(35+Math.sin(i)*3),-100+i*9,7,9,hair,'#b0a695');
 // Natural age marks and eyes.
 for(let i=0;i<3;i++)P([['M',-18+i*2,-94+i*5],['Q',0,-98+i*5,19-i*2,-94+i*5]],null,'#9f775e',.7);
 for(let side of [-1,1]){
 let x=side*15;
 P([['M',x-11,-72],['Q',x,-77,x+11,-70]],null,'#f3edda',4);
 P([['M',x-8,-64],['Q',x,-69,x+8,-64],['Q',x,-60,x-8,-64],['Z']],'#fff4dd','#8d6652');
 E(x+1,-64,3,3,'#5e6f67');E(x+1,-64,1.4,1.7,'#343b37');E(x+2,-65,.7,.7,'#fff');
 P([['M',x-8,-57],['Q',x,-53,x+8,-57]],null,'#a87a5d',.8);
 L(side*25,-58,side*30,-55,'#ac8169',.7);
 }
 P([['M',0,-70],['Q',-3,-54,-7,-47],['Q',0,-42,8,-47]],null,'#a37556',1.5);
 // Full curly beard and moustache framing a separate animated mouth.
 P([['M',-31,-45],['C',-39,-30,-30,-5,-19,11],['Q',-6,32,1,39],['Q',22,21,32,-4],['Q',39,-25,30,-45],['Q',20,-34,11,-35],['L',-11,-35],['Q',-21,-34,-31,-45],['Z']],hair,'#9b9281');
 for(let i=0;i<12;i++){let x=-27+i*5;P([['M',x,-28+Math.abs(x)*.1],['Q',x-4,-4,x*.55,13+Math.cos(i)*8],['Q',x*.4,23,x*.25,27]],null,i%3?'#eee7d7':'#a6a092',1.4)}
 E(0,-29,10,Math.max(1.1,1.1+(o.mouth||0)*4),'#68483c');
 P([['M',-1,-40],['Q',-10,-49,-27,-34],['Q',-14,-30,-1,-36],['Q',14,-30,27,-34],['Q',10,-49,1,-40],['Z']],hair,'#aaa291',.7);
 c.restore();
}
function brickPlan(){let a=[];for(let i=0;i<25;i++){let n=i<9?3:4,j=i<9?i:i-9;let sx=(i<9?14:80)+(j%n)*13,sy=(i<9?65:52)+Math.floor(j/n)*13;let dx=188+(i%5)*13,dy=46+Math.floor(i/5)*13;a.push({i,sx,sy,dx,dy,color:i<9?'#53966c':'#5597bb',edge:i<9?'#2e6846':'#2f6686'})}return a}
function bricks(){let plan=brickPlan();return '<svg viewBox="0 0 270 146" role="img" aria-label="Neuf briques vertes et seize briques bleues remplissent exactement le carré de vingt-cinq cases. Exemple de triangle 3, 4, 5."><g font-size="12" font-weight="bold" text-anchor="middle" fill="#243f43"><text x="34" y="23">3 × 3</text><text x="105" y="23">4 × 4</text><text x="220" y="23">5 × 5</text><text x="34" y="126">9</text><text x="105" y="126">16</text><text x="220" y="126">25</text></g><g stroke="#c1bba8" fill="#ede7d7"><rect x="14" y="65" width="39" height="39"/><rect x="80" y="52" width="52" height="52"/><rect x="188" y="46" width="65" height="65"/></g><path d="M143 79H176L169 72M176 79L169 86" stroke="#a27c43" stroke-width="2.5" fill="none"/>'+plan.map(b=>'<g data-brick="'+b.i+'" transform="translate('+b.sx+' '+b.sy+')"><rect x=".5" y=".5" width="12" height="12" rx="1.5" fill="'+b.edge+'"/><rect x=".5" y=".5" width="11" height="10" rx="1.2" fill="'+b.color+'"/><circle cx="6" cy="5" r="2.9" fill="#ffffff38" stroke="'+b.edge+'" stroke-width=".6"/><path d="M4 4Q6 2 8 4" stroke="#ffffff99" stroke-width=".7" fill="none"/></g>').join('')+'<text x="135" y="141" font-size="8.5" text-anchor="middle" fill="#243f43">Illustration du cas 3 – 4 – 5 : 9 + 16 = 25</text></svg>'}
function positions(progress){return brickPlan().map(b=>{let t=Math.max(0,Math.min(1,(progress-.12-b.i*.018)/.34));t=t*t*(3-2*t);return [b.sx+(b.dx-b.sx)*t,b.sy+(b.dy-b.sy)*t-Math.sin(t*Math.PI)*13]})}
root.AstreonSage=Object.freeze({draw,bricks,brickPlan,positions});
})(globalThis);
