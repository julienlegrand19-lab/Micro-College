/* V36 — layered fantasy landscapes and material detail. Canvas only. */
(function(root){
'use strict';
const themes={
 relatifs:[['forest','#95d6ad','#21483e','#f3d9a0'],['mine','#b3a5e1','#342e4d','#ffc398'],['factory','#d5aa71','#384356','#fff1ad'],['orbit','#8db6ed','#252b54','#d4e4ff'],['fortress','#ee997e','#512d42','#ffdf94'],['eclipse','#c4a0f4','#342342','#e9d8ff']],
 pyramides:[['oasis','#d8c384','#3f675f','#fff0bc'],['obelisk','#a8b7d5','#4a4565','#f8dec8'],['papyrus','#e0bd79','#62604b','#fbebae'],['tomb','#dca58a','#60434e','#ffe2af'],['temple','#c0a3de','#493751','#f5dba4']],
 litteral:[['garden','#a1d9a2','#345f57','#f8efb9'],['workshop','#e2c28e','#59495e','#fff0a8'],['mirror','#a1d9f9','#394b79','#e4faff'],['library','#e3b4a1','#654c65','#f6dfb4'],['rune','#c7a6fa','#3d2c68','#f4e3ff']]
};
const theme=(ch,w)=>themes[ch]?.[w]||themes.relatifs[0],hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
function pen(c){const ink='#17263b';return {
 path(d,fill,stroke=null,w=1){c.beginPath();for(const [op,...a] of d){if(op==='M')c.moveTo(...a);else if(op==='L')c.lineTo(...a);else if(op==='Q')c.quadraticCurveTo(...a);else if(op==='C')c.bezierCurveTo(...a);else c.closePath()}if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.lineJoin='round';c.lineCap='round';c.stroke()}},
 poly(p,f,s=null,w=1){this.path(p.map((a,i)=>[i?'L':'M',...a]).concat([['Z']]),f,s,w)},
 oval(x,y,rx,ry,f,s=null,w=1){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=w;c.stroke()}},
 line(x,y,X,Y,f,w=1){this.path([['M',x,y],['L',X,Y]],null,f,w)},
 grad(x,y,X,Y,a,b){const g=c.createLinearGradient(x,y,X,Y);g.addColorStop(0,a);g.addColorStop(1,b);return g},
 glow(x,y,r,col){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+'66');g.addColorStop(1,col+'00');this.oval(x,y,r,r,g)},
 gem(x,y,r,col){this.poly([[x,y-r],[x+r*.62,y],[x,y+r],[x-r*.62,y]],this.grad(x-r,y-r,x+r,y+r,'#f8ffed',col),ink,.65);this.line(x,y-r,x,y+r,'#ffffff90',.7)},
 box(x,y,w,h,f,s=null){c.fillStyle=f;c.fillRect(x,y,w,h);if(s){c.strokeStyle=s;c.lineWidth=1;c.strokeRect(x,y,w,h)}},
 text(x,y,t,col,size=12){c.font='bold '+size+'px system-ui';c.fillStyle=col;c.textAlign='center';c.fillText(t,x,y)}
}}
function emblem(p,x,y,type,light,dark){
 if(['forest','garden','oasis'].includes(type)){p.path([['M',x-6,y+5],['Q',x-9,y-9,x+9,y-7],['Q',x+8,y+7,x-6,y+5],['Z']],light,dark);p.line(x-6,y+5,x+6,y-5,dark)}
 else if(['factory','workshop'].includes(type)){p.oval(x,y,6,6,light,dark);for(let i=0;i<8;i++){let a=i*Math.PI/4;p.line(x+Math.cos(a)*4,y+Math.sin(a)*4,x+Math.cos(a)*8,y+Math.sin(a)*8,light,2)}p.oval(x,y,2,2,dark)}
 else if(['library','papyrus'].includes(type)){p.path([['M',x-9,y-6],['Q',x-4,y-8,x,y-4],['Q',x+4,y-8,x+9,y-6],['L',x+9,y+6],['Q',x+4,y+3,x,y+7],['Q',x-4,y+3,x-9,y+6],['Z']],light,dark);p.line(x,y-4,x,y+7,dark)}
 else if(['eclipse','temple','rune'].includes(type)){p.oval(x,y,7,7,light);p.oval(x+3,y-3,6,6,dark)}
 else p.gem(x,y,7,light)
}
function creature(c,o){
 const [type,base,shade,trim]=theme(o.chapter,o.world),p=pen(c),friendly=!!o.friendly,light=friendly?'#9ce5be':base,dark=friendly?'#34635a':shade,ink='#18273b',t=o.time||0,k=o.kind,hover=k==='wraith',walk=Math.sin(t/105+o.x*.03),bob=hover?Math.sin(t/165+o.x*.04)*2:Math.abs(walk)*1.5,skin=p.grad(-23,-38,24,0,light,dark),face=p.grad(-12,-27,13,-8,'#415169','#1a263b');
 c.save();c.translate(o.x,o.y);c.scale((o.scale||1)*(o.dir===-1?-1:1),o.scale||1);
 if(o.flash>0&&!friendly)c.rotate(-Math.sin(t/40)*.08);
 if(!hover){p.oval(0,0,24,5,'#10233135');p.oval(0,0,16,2.6,'#08182777')}else p.oval(0,1,16,2.5,'#10233128');c.translate(0,-bob);
 // Each of the 16 habitats has distinct silhouettes and material motifs.
 if(['forest','garden','oasis'].includes(type)&&k!=='beetle'){
  if(type==='garden')p.path([['M',-3,-31],['Q',-17,-50,-25,-38],['Q',-11,-32,-3,-31],['Q',3,-48,19,-43],['Q',17,-31,-3,-31],['Z']],light,ink);
  else if(type==='forest')for(const s of [-1,1]){p.line(s*8,-28,s*16,-42,trim,2.4);p.line(s*13,-36,s*22,-39,trim,1.8)}
  else p.poly([[-20,-20],[-13,-42],[0,-32],[13,-42],[20,-20]],trim,ink);
  for(const s of [-1,1])p.oval(s*12+walk*2,-2,8,4,dark,ink);
  p.path([['M',-23,-6],['Q',-29,-22,-12,-30],['Q',0,-38,13,-30],['Q',28,-21,23,-6],['Q',0,4,-23,-6],['Z']],skin,ink,1.6);p.oval(-10,-25,8,3,'#ffffff48');for(const s of [-1,1]){p.path([['M',s*19,-24],['Q',s*23,-15,s*17,-9],['Q',s*13,-5,s*9,-6]],null,dark+'aa',1.3);if(!root.MicroPlayPrefs?.lite)for(let j=0;j<4;j++)p.line(s*(14+j%2*4),-23+j*3,s*(11+j%2*4),-21+j*3,trim+'70',.9)}
 }else if(k==='beetle'||type==='papyrus'){
  for(const s of [-1,1])for(let i=0;i<3;i++){p.line(s*13,-18+i*5,s*24,-12+i*4,dark,4);p.line(s*24,-12+i*4,s*(25+walk*3),-2,ink,2)}
  p.oval(0,-17,24,19,skin,ink,1.5);p.path([['M',0,-35],['Q',-20,-31,-21,-14],['L',0,-8],['L',21,-14],['Q',20,-31,0,-35],['Z']],p.grad(-22,-35,22,-8,trim,light),ink);p.line(0,-34,0,-9,ink,1.5);for(const s of [-1,1]){p.path([['M',s*2,-32],['Q',s*18,-26,s*18,-14]],null,'#ffffff90',1.2);p.path([['M',s*5,-27],['Q',s*14,-22,s*14,-15]],null,dark,1);if(!root.MicroPlayPrefs?.lite)for(let j=0;j<4;j++)p.oval(s*(6+j*3),-23+j*1.6,1,1,dark)}for(const s of [-1,1]){p.line(s*10,-31,s*17,-40,trim,2);p.oval(s*17,-40,2.5,2.5,light,ink)}
 }else if(hover){
  if(type==='mirror'){for(let i=0;i<3;i++)p.gem(-23+i*23,-21+Math.sin(t/220+i)*7,8,light);p.poly([[0,-45],[19,-27],[14,-7],[0,0],[-14,-7],[-19,-27]],skin,ink,1.3);p.poly([[0,-38],[12,-25],[9,-11],[0,-5],[-10,-11],[-12,-25]],face,trim)}
  else{p.path([['M',0,-44],['Q',-25,-39,-25,-16],['L',-27,-4],['L',-13,-11+walk*2],['L',-4,0],['L',8,-10],['L',23,-2],['Q',23,-37,0,-44],['Z']],skin,ink,1.5);p.oval(0,-24,14,13,face);for(const s of [-1,1]){p.path([['M',s*4,-40],['Q',s*20,-32,s*19,-18],['Q',s*17,-10,s*23,-3]],null,trim+'99',1.5);p.path([['M',s*12,-37],['Q',s*23,-29,s*22,-20]],null,light+'bb',1);p.path([['M',s*13,-19],['Q',s*10,-13,s*12,-7]],null,dark,1.1)}}
  if(type==='orbit'||type==='rune'||type==='eclipse'){for(let i=0;i<3;i++){let a=t/650+i*2.094;p.gem(Math.cos(a)*26,-21+Math.sin(a)*23,3,trim)}}
  if(type==='obelisk'||type==='temple')p.poly([[-15,-36],[-11,-45],[0,-40],[11,-45],[15,-36]],trim,ink);
 }else if(k==='dragon'||type==='fortress'){
  for(const s of [-1,1])p.poly([[s*6,-21],[s*31,-40+walk*3],[s*27,-10],[s*16,-16]],skin,ink);
  p.path([['M',-15,-9],['Q',-39,-2,-31,-20],['L',-27,-8],['L',-14,-19],['Z']],skin,ink);p.oval(0,-16,20,16,skin,ink,1.4);for(const s of [-1,1]){p.path([['M',s*10,-23],['Q',s*18,-17,s*14,-8],['L',s*19,-2],['L',s*7,-2],['Z']],skin,ink,1);for(let j=0;j<3;j++)p.line(s*(10+j*3),-4,s*(11+j*3),-1,trim,1);p.line(s*8,-23,s*28,-34+walk*3,trim+'a0',1)}if(!root.MicroPlayPrefs?.lite)for(let j=0;j<8;j++){const xx=-12+j%4*7,yy=-24+Math.floor(j/4)*7;p.path([['M',xx,yy],['Q',xx+2,yy+4,xx+5,yy]],null,trim+'88',.8)}
  for(const s of [-1,1])p.poly([[s*7,-26],[s*14,-40],[s*16,-24]],trim,ink);
 }else{
  const machine=['factory','workshop'].includes(type)||k==='robot';
  for(const s of [-1,1]){p.poly([[s*5,-14],[s*16,-14],[s*17+walk*s,-3],[s*22+walk*s,0],[s*5+walk*s,0]],skin,ink);p.oval(s*22,-16+walk*s,8,10,skin,ink)}
  p.poly([[-20,-26],[-13,-36],[13,-36],[20,-26],[16,-6],[0,-2],[-16,-6]],skin,ink,1.5);
  p.poly([[-13,-35],[-9,-42],[10,-42],[15,-34],[12,-21],[-12,-21]],p.grad(-13,-42,15,-21,trim,dark),ink);p.oval(0,-31,12,6,face);for(const s of [-1,1]){p.line(s*10,-40,s*13,-35,trim+'bc',1.1);p.path([['M',s*17,-24],['L',s*10,-18],['L',s*13,-9]],null,dark,1.5);if(machine){p.oval(s*15,-22,2,2,trim,dark,.8);for(let j=0;j<3;j++)p.line(s*5,-17+j*3,s*12,-17+j*3,ink,1)}else{p.path([['M',s*15,-25],['L',s*6,-20],['L',s*8,-14],['L',s*2,-10]],null,trim+'90',1.2)}}
  if(machine){p.line(0,-42,0,-49,trim,1.5);p.gem(0,-50,3,trim);for(const s of [-1,1]){p.oval(s*20,-16,4,4,dark);p.oval(s*20,-16,2,2,trim)}}
  else {p.line(-16,-23,-7,-13,trim,1.2);p.line(-7,-13,-13,-8,trim,1.2)}
  if(type==='library'){for(const s of [-1,1]){p.line(s*8,-39,s*23,-39,trim,1.5);p.line(s*20,-39,s*22,-24,trim);p.oval(s*22,-24,6,2.5,trim,ink)}}
  if(type==='tomb'||type==='mine')for(const s of [-1,1])p.gem(s*19,-26,5,light);
 }
 const ey=hover?-25: k==='golem'||k==='robot'||['mine','factory','workshop','library','tomb'].includes(type)?-30:-19;
 for(const s of [-1,1]){p.oval(s*7,ey,4,4.6,friendly?'#f8ffdf':'#ffe6ad',ink,.8);p.oval(s*7+1,ey+.2,1.8,2.8,ink);p.oval(s*7+.5,ey-1.6,1,1,'#fff');if(!friendly)p.line(s*7-s*4,ey-3,s*7+s*4,ey-5,ink,1.5)}
 p.path([['M',-4,ey+8],['Q',0,ey+(friendly?12:6),5,ey+8]],null,ink,1.2);
 if(!hover)emblem(p,0,-8,type,trim,dark);
 if(friendly){for(let i=0;i<3;i++){const a=t/520+i*2.094;p.gem(Math.cos(a)*25,-17+Math.sin(a)*16,2.5,'#d7f5a9')}}
 c.restore()
}
function burst(c,x,y,t,progress,col='#b8f5d0',kind='purify',size=1){if(!(progress>0))return;const p=pen(c),q=Math.max(0,Math.min(1,progress));c.save();c.globalAlpha=q;p.oval(x,y,(12+(1-q)*42)*size,(8+(1-q)*30)*size,null,col,2);for(let i=0;i<10;i++){let a=i*Math.PI/5+t*.001,r=(10+(1-q)*38)*size;p.gem(x+Math.cos(a)*r,y+Math.sin(a)*r*.8,2.6*size,col)}if(kind!=='purify'){const labels={heal:'+',grow:'↑',split:'×2',speed:'»',shield:'⛨'};p.text(x,y-25*size,labels[kind]||'✦',col,18*size)}c.restore()}
const old=root.MicroBestiary;
function enemy(c,o){
 const p=pen(c),[type,base,dark,trim]=theme(o.chapter,o.world);
 if(!o.boss){creature(c,o);return}
 // Keep the 16 authored boss models, with dramatic silhouettes, breathing and a distinct crest.
 c.save();c.translate(o.x,o.y);const breathe=1+Math.sin(o.time/340)*.012;c.scale(1,breathe);
 p.glow(0,-65,86,o.friendly?'#b9f4b7':base);
 if(!o.friendly){for(let i=0;i<(root.MicroPlayPrefs?.lite?4:10);i++){const a=i*Math.PI/5+o.time/2200;p.gem(Math.cos(a)*68,-65+Math.sin(a)*66,4,trim)}}
 const z=o.friendly?.65:1,phase=o.time/600,crest=o.friendly?'#bcebd0':trim;
 c.save();c.globalAlpha=.88*z;
 if(type==='forest'){for(const s of [-1,1]){p.path([['M',s*32,-99],['Q',s*48,-136,s*66,-143],['Q',s*56,-128,s*53,-116]],null,crest,3.8);for(let i=0;i<3;i++)p.gem(s*(44+i*9),-111-i*13,4,base)}}
 else if(type==='mine'){for(const s of [-1,1])for(let i=0;i<3;i++){const x=s*(39+i*13),y=-59-i*13;p.poly([[x-9,y+8],[x-8,y-11],[x,y-24],[x+10,y-4],[x+8,y+12]],p.grad(x-10,y-24,x+10,y+12,crest,dark),dark,1.2)}}
 else if(type==='factory'||type==='workshop'){for(const s of [-1,1]){const x=s*56,y=-87;p.oval(x,y,23,23,dark,base,2);for(let j=0;j<10;j++){const a=j*Math.PI/5+phase*s;p.line(x+Math.cos(a)*17,y+Math.sin(a)*17,x+Math.cos(a)*27,y+Math.sin(a)*27,base,5)}p.oval(x,y,10,10,base,dark);p.oval(x,y,5,5,crest)}}
 else if(type==='orbit'){p.oval(0,-81,83,29,null,crest+'9a',2);for(let i=0;i<4;i++){const a=phase+i*Math.PI/2;p.gem(Math.cos(a)*82,-81+Math.sin(a)*29,7,base)}}
 else if(type==='fortress'){for(const s of [-1,1]){const flap=Math.sin(phase*2)*8;p.path([['M',s*20,-63],['Q',s*49,-122,s*83,-107+flap],['L',s*73,-47],['L',s*56,-60],['L',s*42,-27],['Z']],p.grad(0,-110,s*83,-30,base,dark),crest,1.4);p.line(s*24,-62,s*73,-100+flap,crest+'80',1.8)}}
 else if(type==='eclipse'){p.oval(0,-103,48,48,null,crest,2);p.oval(0,-103,54,54,null,base+'77',1.2);p.oval(0,-103,31,31,dark);p.oval(11,-113,30,30,base+'40')}
 else if(type==='oasis'){for(const s of [-1,1]){p.poly([[s*19,-112],[s*48,-105],[s*67,-52],[s*37,-57]],p.grad(s*19,-112,s*67,-52,crest,base),dark);for(let i=0;i<4;i++)p.line(s*(24+i*7),-105+i*3,s*(39+i*6),-58,dark,2.4)}}
 else if(type==='obelisk'){for(const s of [-1,1])p.poly([[s*52-9,-28],[s*52-6,-109],[s*52,-126],[s*52+6,-109],[s*52+9,-28]],p.grad(s*52-9,-126,s*52+9,-28,base,dark),crest)}
 else if(type==='papyrus'){for(const s of [-1,1]){p.path([['M',s*9,-45],['Q',s*45,-112,s*77,-77],['Q',s*61,-49,s*20,-32],['Z']],p.grad(0,-105,s*77,-30,crest,base),dark,1.2);for(let i=1;i<4;i++)p.line(s*16,-45,s*(28+i*12),-84+i*3,dark,1.2)}}
 else if(type==='tomb'){for(const s of [-1,1]){p.poly([[s*36,-39],[s*58,-42],[s*60,-92],[s*45,-110],[s*30,-84]],base,dark);p.gem(s*48,-81,9,crest)}}
 else if(type==='temple'){p.oval(0,-120,36,17,null,crest,2.5);for(let i=0;i<5;i++)p.gem(-32+i*16,-120-Math.sin(i*Math.PI/4)*9,5,base)}
 else if(type==='garden'){for(const s of [-1,1]){p.path([['M',s*31,-55],['Q',s*56,-92,s*70,-70],['Q',s*65,-39,s*31,-55],['Z']],p.grad(s*31,-90,s*70,-40,crest,base),dark);p.line(s*32,-55,s*63,-69,dark,1.4)}}
 else if(type==='mirror'){for(let i=0;i<5;i++){const a=phase*.6+i*1.257;p.gem(Math.cos(a)*70,-83+Math.sin(a)*56,11,base)}}
 else if(type==='library'){for(const s of [-1,1]){p.line(s*29,-130,s*66,-130,crest,3);p.line(s*61,-130,s*50,-96,crest,1.8);p.line(s*61,-130,s*72,-96,crest,1.8);p.oval(s*61,-96,15,4,base,dark,1.3)}}
 else{p.oval(0,-88,70,80,null,crest+'99',2.2);for(let i=0;i<6;i++){const a=i*Math.PI/3+phase*.6;p.gem(Math.cos(a)*70,-88+Math.sin(a)*80,7,base)}}
 c.restore();
 old?.draw(c,{...o,x:0,y:0,scale:o.scale||1.85});
 p.oval(0,2,48,8,null,o.friendly?'#a4e7b6':base,1.8);
 if(o.attack&&!o.friendly){const v=.5+.5*Math.sin(o.time/55);p.glow(-30,-32,23+v*12,'#ffc091');p.oval(-30,-32,15+v*8,15+v*8,null,'#ffdea4',2)}
 c.restore()
}
function projectile(c,shot,t,col,hostile=false){const p=pen(c),id=shot.spell||shot.element||'light',x=shot.x,y=shot.y,d=shot.dir||1;c.save();p.glow(x,y,hostile?21:24,col);const lite=root.MicroPlayPrefs?.lite;for(let i=1;i<(lite?3:8);i++){c.globalAlpha=Math.max(.12,.85-i*.09);p.oval(x-d*i*5.5,y+Math.sin(i+t/65)*2,Math.max(1,5-i*.55),Math.max(.7,3-i*.3),col);if(!lite&&i%2===0)p.oval(x-d*i*6,y+Math.cos(i+t/90)*5,1.1,1.1,'#fff8dd')}c.globalAlpha=1;
 c.translate(x,y);c.scale(d,1);
 if(id==='lightning'){p.poly([[-9,-9],[4,-9],[0,-2],[10,-2],[-4,10],[0,2],[-8,2]],'#fff4b1',col,1.3)}
 else if(id==='fire'){p.path([['M',-18,0],['Q',-6,-3,-9,-9],['Q',0,-7,4,-10],['Q',18,0,5,9],['Q',-5,11,-18,0],['Z']],p.grad(-18,0,12,0,col,'#fff3b1'),col);p.path([['M',-7,1],['Q',4,-7,9,0],['Q',4,6,-7,1],['Z']],'#fff9dd')}
 else if(['water','air'].includes(id)){p.oval(0,0,9,7,null,col,2.3);p.oval(2,0,5,4,'#e7faff');p.oval(-4,-2,4,2,'#ffffff9a')}
 else if(['metal','earth','crystal'].includes(id)){c.rotate(t/130);p.gem(0,0,10,col)}
 else if(['shadow','astral','rune'].includes(id)){p.oval(0,0,8,8,id==='shadow'?'#3b2b66':col,'#f7eaff',1.4);p.oval(0,0,13,10,null,col,1.3)}
 else{p.gem(0,0,9,col);p.oval(0,0,3,3,'#fffdf2')}
 c.restore()
}
// Static landmark sprites: bounded cache, independent of camera and animation time.
const sceneryCache=new Map(),CACHE_LIMIT=36;
function landmark(c,type,base,dark,trim,variant,lite){
 const p=pen(c),v=variant,rand=n=>hash(v*97+n),H=100+rand(1)*38;
 const stone=p.grad(-65,-160,75,0,base,dark),face=p.grad(-55,-145,40,0,trim,dark);
 const arch=(x,y,w,h,fill)=>p.path([['M',x,y],['L',x,y-h*.65],['Q',x+w*.5,y-h*1.35,x+w,y-h*.65],['L',x+w,y],['Z']],fill);
 const block=(x,y,w,h)=>{p.box(x,y,w,h,stone,dark);p.line(x+1,y+1,x+w-1,y+1,trim+'85',.9)};
 if(type==='forest'||type==='garden'){
  const trunk=p.grad(-10,-H,14,0,base,dark);
  p.path([['M',-19,0],['Q',-7,-23,-9,-63],['L',-5,-H],['L',7,-H],['Q',4,-48,14,-16],['L',25,0],['Q',0,-7,-19,0],['Z']],trunk,dark);
  for(const s of [-1,1]){p.path([['M',s*3,-H*.48],['Q',s*16,-H*.7,s*36,-H*.82],['L',s*38,-H*.86],['Q',s*14,-H*.8,s*4,-H*.66],['Z']],dark);p.line(s*8,-7,s*3,-H*.48,trim+'60',1)}
  for(let i=0;i<8;i++){const x=(rand(i+11)-.5)*93,y=-H+rand(i+24)*48,rx=18+rand(i+45)*15; p.oval(x,y,rx,19+rand(i+31)*10,dark);p.oval(x-3,y-5,rx*.83,14,p.grad(x-10,y-18,x+10,y+12,base,dark));if(!lite)p.oval(x-8,y-10,rx*.5,5,trim+'28')}
  if(type==='garden')for(let j=0;j<5;j++){let x=-34+j*15;p.line(x,0,x+3,-13,dark,2);p.oval(x+3,-15,4,3,trim)}
  else if(!lite)for(let j=0;j<5;j++)p.line(-5+j*2,-8,-4+j,-45,trim+'40',.8);
 }else if(type==='oasis'){
  p.path([['M',-15,0],['Q',8,-H*.58,-8,-H],['L',3,-H],['Q',20,-H*.55,4,0],['Z']],stone,dark);
  for(let i=0;i<10;i++){let y=-i*H/10,x=5*Math.sin(i/3);p.line(x-6,y,x+7,y-3,dark,1.3)}
  for(let i=0;i<7;i++){const s=i%2?1:-1,x=s*(26+i*7),y=-H+7+i*2;p.path([['M',0,-H],['Q',x*.65,-H-27,x,y],['Q',x*.45,y-12,0,-H+6],['Z']],p.grad(0,-H-18,x,y,base,dark),dark,.7);if(!lite)p.line(0,-H+2,x,y,trim+'80',.8)}
  for(let i=0;i<3;i++)p.oval(i*6-6,-H+7,4,5,dark);
 }else if(type==='mine'||type==='mirror'){
  for(let j=0;j<4;j++){const x=-48+j*28,ht=45+rand(j+6)*105,w=12+rand(j+30)*11;
   p.poly([[x-w,0],[x-w,-ht*.65],[x+2,-ht],[x+w,-ht*.58],[x+w*.8,0]],stone,dark);
   p.poly([[x+2,-ht],[x+w,-ht*.58],[x+w*.8,0],[x,0]],dark);
   p.poly([[x-w,-ht*.65],[x+2,-ht],[x,-ht*.25]],trim+'80');
   p.line(x+2,-ht,x,0,trim+'80',1.2);
   if(!lite)p.path([['M',x-w,-ht*.4],['L',x-3,-ht*.3],['L',x-6,-ht*.18]],null,base,1);
  }
 }else if(type==='factory'||type==='workshop'){
  block(-49,-H,89,H);p.poly([[-56,-H],[-56,-H-10],[-35,-H-26],[-16,-H-10],[3,-H-26],[22,-H-10],[47,-H-10],[47,-H]],face,dark);
  block(26,-H-36,15,37);p.box(23,-H-38,21,6,dark);
  for(let j=0;j<3;j++){p.box(-37,-H+18+j*30,62,20,dark);p.box(-34,-H+21+j*30,56,5,trim+'80');for(let k=0;k<4;k++)p.line(-29+k*14,-H+20+j*30,-29+k*14,-H+36+j*30,base,1.3)}
  p.oval(27,-45,20,20,dark,trim,1.5);p.oval(27,-45,14,14,stone,dark);for(let j=0;j<8;j++){let t=j*Math.PI/4;p.line(27+Math.cos(t)*5,-45+Math.sin(t)*5,27+Math.cos(t)*16,-45+Math.sin(t)*16,dark,3)}p.oval(27,-45,5,5,trim,dark);
 }else if(type==='obelisk'||type==='tomb'||type==='temple'){
  if(type==='obelisk'){p.poly([[-24,0],[-18,-H],[0,-H-25],[19,-H],[25,0]],stone,dark);p.poly([[0,-H-25],[19,-H],[25,0],[0,0]],dark);for(let j=0;j<5;j++){const y=-H+16+j*18;p.line(-12,y,10,y,trim+'80',1);p.gem(-6,y+6,3,trim)}}
  else {const w=type==='temple'?64:53;block(-w,-H,w*2,H);p.poly([[-w-9,-H],[-w+3,-H-13],[w-3,-H-13],[w+9,-H]],face,dark);arch(-15,0,30,70,dark);for(const s of [-1,1]){block(s*35-9,-H+9,18,H-9);p.box(s*35-12,-H+6,24,7,trim+'aa');for(let j=1;j<5;j++)p.line(s*35-7,-H+12+j*18,s*35+7,-H+12+j*18,dark,1)}}
  p.box(-43,-5,86,5,dark);
 }else if(type==='library'||type==='papyrus'){
  block(-57,-H,114,H);p.box(-64,-H-9,128,9,face);
  for(let i=0;i<3;i++){let x=-49+i*34;arch(x,-8,30,H-21,dark);for(let j=0;j<3;j++){let y=-H+36+j*29;p.box(x+3,y,24,3,base);for(let k=0;k<4;k++){let ht=9+rand(i*30+j*5+k)*9;p.box(x+4+k*5,y-ht,4,ht,[trim,base,'#9b7897','#7795a7'][k])}}}
  for(let j=0;j<4;j++)p.line(-57+j*34,-H+8,-57+j*34,0,trim+'60',1.5);
 }else if(type==='fortress'){
  block(-51,-H,102,H);for(let j=0;j<4;j++)block(-51+j*27,-H-17,20,19);
  arch(-15,0,30,59,dark);arch(-10,-5,20,49,stone);p.line(0,-38,0,0,dark,2);
  for(const s of [-1,1]){arch(s*30-5,-H+37,10,26,dark);p.box(s*30-2,-H+20,4,13,'#f3bc75aa')}
  if(!lite)for(let j=0;j<4;j++){let y=-H+12+j*25;p.line(-50,y,50,y,dark,1);p.line(-28+j%2*14,y,-28+j%2*14,y+24,dark,1)}
 }else if(type==='orbit'){
  p.poly([[-57,-26],[-30,-42],[-21,-75],[28,-75],[40,-43],[60,-26],[35,-12],[-37,-12]],stone,dark);
  p.oval(4,-76,27,17,face,dark);p.oval(4,-76,18,11,'#8dc1e280',trim,1);p.box(-5,-66,18,22,dark);p.line(4,-88,4,-H-7,trim,1.5);p.oval(4,-H-7,3,3,base);
 }else{
  p.poly([[-39,0],[-29,-42],[29,-42],[39,0]],stone,dark);p.oval(0,-83,42,61,null,dark,9);p.oval(0,-83,42,61,null,base,3);p.oval(0,-83,34,52,null,trim+'95',1.5);
  for(let j=0;j<6;j++){let t=j*Math.PI/3;p.gem(Math.cos(t)*42,-83+Math.sin(t)*61,4,trim)}p.gem(0,-83,19,base);
 }
}
function drawLandmark(c,type,base,dark,trim,variant,lite,x,y){
 const key=type+':'+variant+':'+Number(lite);
 let tile=sceneryCache.get(key);
 if(!tile&&typeof c.drawImage==='function'&&root.document?.createElement){
  try{const img=root.document.createElement('canvas');img.width=184;img.height=214;const g=img.getContext('2d');if(g){g.translate(92,202);landmark(g,type,base,dark,trim,variant,lite);tile=img;sceneryCache.set(key,tile);if(sceneryCache.size>CACHE_LIMIT)sceneryCache.delete(sceneryCache.keys().next().value)}}catch{}
 }
 if(tile)c.drawImage(tile,x-92,y-202);else{c.save();c.translate(x,y);landmark(c,type,base,dark,trim,variant,lite);c.restore()}
}
function scenery(c,{chapter,world,cam=0,time=0,palette:p0}){
 const p=pen(c),[type,base,dark,trim]=theme(chapter,world),t=time,lite=!!root.MicroPlayPrefs?.lite,W=960,H=420;
 p.box(0,0,W,H,p.grad(0,0,0,H,p0.sky,p0.horizon));
 const sx=770-cam*.045,sy=78,night=['orbit','eclipse','rune','mirror'].includes(type);
 p.glow(sx,sy,140,trim);p.oval(sx,sy,43,43,p.grad(sx-20,sy-30,sx+20,sy+40,trim,base));
 if(night){p.oval(sx+14,sy-12,34,34,p0.sky);for(let i=0;i<(lite?14:38);i++){let x=((i*167-cam*.045)%990+990)%990,y=18+hash(i+5)*170;p.oval(x,y,.8+hash(i)*1.25,.8,trim+'99')}}
 else for(let i=0;i<5;i++){const x=((i*249-cam*.055+t*.002)%1250+1250)%1250-130,y=34+hash(i+9)*64;p.oval(x,y,76,15,'#f6eadb19');p.oval(x+28,y-7,42,17,'#f6eadb14')}
 const ridge=(spacing,speed,y,h,col,seed)=>{const shift=cam*speed,start=Math.floor(shift/spacing)-2,end=Math.ceil((shift+W)/spacing)+2,points=[[start*spacing-shift,H]];for(let i=start;i<=end;i++){const xx=i*spacing-shift,yy=y-h*hash(i+seed);points.push([xx,yy],[xx+spacing*.45,yy+12+hash(i+seed+8)*24])}points.push([end*spacing-shift+spacing,H]);p.poly(points,col)};
 ridge(165,.09,257,124,p0.mount+'80',47);
 ridge(128,.16,280,94,p0.mount,101);
 if(['oasis','obelisk','tomb','temple'].includes(type)){
  const shift=cam*.21;for(let i=Math.floor(shift/340)-1;i<=Math.ceil((shift+W)/340);i++){const x=i*340-shift,y=278,h=76+hash(i+9)*73;p.poly([[x-95,y],[x,y-h],[x+102,y]],p.grad(x-95,y-h,x+102,y,trim,base));p.poly([[x,y-h],[x+102,y],[x+9,y]],dark+'a0');if(!lite)for(let j=1;j<5;j++)p.line(x-j*18,y-h+j*h/5,x+j*19,y-h+j*h/5,dark+'40',.9)}
 }
 ridge(110,.29,303,45,p0.hill||p0.mount,83);
 const shift=cam*.38;for(let i=Math.floor(shift/155)-1;i<=Math.ceil((shift+W)/155)+1;i++){const x=i*155-shift,y=289+hash(i+12)*12;drawLandmark(c,type,base,dark,trim,((i%5)+5)%5,lite,x,y)}
 // Waterfall is attached to a distant rock, never to the screen or player.
 if(type==='forest'||type==='garden'){
  const shift=cam*.29,cell=640;for(let i=Math.floor(shift/cell)-1;i<=Math.ceil((shift+W)/cell);i++){const x=i*cell+330-shift;p.poly([[x-35,280],[x-24,146],[x+31,146],[x+47,280]],p0.mount);p.path([['M',x-8,148],['L',x+18,148],['Q',x+7,218,x+34,284],['L',x-8,284],['Q',x-19,211,x-8,148],['Z']],p.grad(x,148,x+15,284,'#d7f0e2b0','#77bad1a0'));for(let j=0;j<(lite?3:7);j++){let yy=152+(t*.047+j*22)%123;p.line(x-6+j%3*8,yy,x-2+j%3*8,yy+12,'#e7fffc80',1.4)}p.oval(x+9,283,31,7,'#e3f7ef35')}
 }
 for(let i=0;i<(lite?3:7);i++){const x=((i*181-cam*.21+t*.006)%1150+1150)%1150-80;p.oval(x,300+i%3*12,98,10,'#e7f3ff18')}
}
function platform(c,{chapter,world,a,b,y=334,main=false,cam=0,time=0,moving=false}){
 if(b<cam-80||a>cam+1040||b<=a)return;
 const p=pen(c),[type,base,dark,trim]=theme(chapter,world),w=b-a,depth=main?80:30,lite=!!root.MicroPlayPrefs?.lite,natural=['forest','garden','oasis'].includes(type),industrial=['factory','workshop','orbit'].includes(type),crystal=['mine','mirror','eclipse','rune'].includes(type);
 const l=Math.max(a,cam-50),r=Math.min(b,cam+1010),bevel=Math.min(9,w*.12);
 // The horizontal contact surface remains exactly at y; textures are fixed to the platform.
 p.poly([[a,y+5],[b,y+5],[b-bevel,y+depth],[a+w*.63,y+depth+Math.min(15,depth*.3)],[a+bevel,y+depth]],p.grad(a,y,a,y+depth,base,dark));
 p.box(a,y,w,Math.min(10,depth),p.grad(a,y,a,y+10,trim,base));p.line(a,y+1,b,y+1,trim,1.4);
 c.save();c.beginPath();c.rect(a,y+8,w,depth-8);c.clip();
 const start=Math.max(0,Math.floor((l-a)/32)-1),end=Math.ceil((r-a)/32);
 for(let i=start;i<=end;i++){
  const x=a+i*32,seed=world*997+i*31,offset=hash(seed)*6;
  if(natural){p.poly([[x,y+11],[x+10,y+10],[x+15,y+25+offset],[x+4,y+29]],dark+'a0');p.path([['M',x+7,y+11],['L',x+16,y+18],['L',x+12,y+27]],null,trim+'60',1);if(main&&!lite)for(let j=0;j<3;j++){let yy=y+36+j*12+hash(seed+j)*6;p.oval(x+8+j*4,yy,5+hash(seed+j)*4,2.4,dark+'aa')}}
  else if(industrial){p.box(x+2,y+12,28,14,dark,base);p.line(x+4,y+13,x+28,y+13,trim+'80',1);p.oval(x+7,y+19,2.8,2.8,trim,dark,.7);p.oval(x+25,y+19,2.8,2.8,trim,dark,.7);if(main)p.line(x+16,y+30,x+16,y+depth-5,base+'60',2)}
  else if(crystal){p.poly([[x+3,y+22],[x+8,y+12],[x+15,y+10],[x+21,y+21],[x+16,y+27]],p.grad(x,y+11,x+20,y+26,trim,dark));p.line(x+15,y+10,x+12,y+24,trim+'90',1);if(main&&!lite)p.gem(x+24,y+42+offset,4+hash(seed)*4,base)}
  else{p.line(x,y+19,x+32,y+19,dark,1.5);p.line(x+offset,y+9,x+offset,y+19,dark,1);p.line(x+16,y+19,x+16,y+30,dark,1);p.line(x+2,y+10,x+28,y+10,trim+'70',.8);if(main){for(let j=0;j<2;j++){let yy=y+40+j*18;p.line(x,yy,x+32,yy,dark,1);p.line(x+offset+j*9,yy-15,x+offset+j*9,yy,dark,1)}}}
 }
 c.restore();
 if(natural)for(let i=start;i<=end;i++){const x=a+i*32+8;if(x<a+4||x>b-4)continue;const q=hash(world*91+i);p.path([['M',x-4,y+1],['L',x-1,y-2-q*3],['L',x+2,y+1]],base);if(!lite&&q>.78)p.oval(x,y-3,1.6,1.6,trim)}
 if(moving){p.oval((a+b)/2,y+depth+8,Math.min(w*.35,36),5,null,base,1.3);p.gem((a+b)/2,y+depth+8,4,trim)}
}
function victory(c,{chapter,world,character,colors,accessory,armor,magic,time=0,name=''}){const p=pen(c),[type,base,dark,trim]=theme(chapter,world);p.box(0,0,960,300,p.grad(0,0,960,300,dark,'#233c54'));p.glow(480,160,185,base);for(let i=0;i<45;i++){const x=hash(i+3)*960,y=hash(i+88)*300;p.gem(x,y,2+hash(i+16)*3,i%2?base:trim)}p.oval(480,260,290,15,'#152c40aa');enemy(c,{chapter,world,x:610,y:260,boss:true,friendly:true,scale:2.1,time});root.MicroHeroes?.draw(c,{character,...colors,accessory,armor,magic,x:335,y:260,scale:2.25,time,pose:'victory'});p.text(480,31,'GARDIEN LIBÉRÉ',trim,23);p.text(480,55,name,'#f6eddc',16)}
root.MicroPolish={enemy,burst,projectile,scenery,platform,victory,themes};
})(globalThis);
