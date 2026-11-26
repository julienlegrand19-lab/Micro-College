/* V25 – Original illustrated bestiary, scenery and spell effects. Canvas only. */
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
 if(!hover)p.oval(0,0,23,4,'#10233155');c.translate(0,-bob);
 // Each of the 16 habitats has distinct silhouettes and material motifs.
 if(['forest','garden','oasis'].includes(type)&&k!=='beetle'){
  if(type==='garden')p.path([['M',-3,-31],['Q',-17,-50,-25,-38],['Q',-11,-32,-3,-31],['Q',3,-48,19,-43],['Q',17,-31,-3,-31],['Z']],light,ink);
  else if(type==='forest')for(const s of [-1,1]){p.line(s*8,-28,s*16,-42,trim,2.4);p.line(s*13,-36,s*22,-39,trim,1.8)}
  else p.poly([[-20,-20],[-13,-42],[0,-32],[13,-42],[20,-20]],trim,ink);
  for(const s of [-1,1])p.oval(s*12+walk*2,-2,8,4,dark,ink);
  p.path([['M',-23,-6],['Q',-29,-22,-12,-30],['Q',0,-38,13,-30],['Q',28,-21,23,-6],['Q',0,4,-23,-6],['Z']],skin,ink,1.6);p.oval(-10,-25,8,3,'#ffffff48');
 }else if(k==='beetle'||type==='papyrus'){
  for(const s of [-1,1])for(let i=0;i<3;i++){p.line(s*13,-18+i*5,s*24,-12+i*4,dark,4);p.line(s*24,-12+i*4,s*(25+walk*3),-2,ink,2)}
  p.oval(0,-17,24,19,skin,ink,1.5);p.path([['M',0,-35],['Q',-20,-31,-21,-14],['L',0,-8],['L',21,-14],['Q',20,-31,0,-35],['Z']],p.grad(-22,-35,22,-8,trim,light),ink);p.line(0,-34,0,-9,ink,1.5);for(const s of [-1,1]){p.line(s*10,-31,s*17,-40,trim,2);p.oval(s*17,-40,2.5,2.5,light,ink)}
 }else if(hover){
  if(type==='mirror'){for(let i=0;i<3;i++)p.gem(-23+i*23,-21+Math.sin(t/220+i)*7,8,light);p.poly([[0,-45],[19,-27],[14,-7],[0,0],[-14,-7],[-19,-27]],skin,ink,1.3);p.poly([[0,-38],[12,-25],[9,-11],[0,-5],[-10,-11],[-12,-25]],face,trim)}
  else{p.path([['M',0,-44],['Q',-25,-39,-25,-16],['L',-27,-4],['L',-13,-11+walk*2],['L',-4,0],['L',8,-10],['L',23,-2],['Q',23,-37,0,-44],['Z']],skin,ink,1.5);p.oval(0,-24,14,13,face);for(const s of [-1,1])p.line(s*19,-22,s*13,-9,trim+'99',1.5)}
  if(type==='orbit'||type==='rune'||type==='eclipse'){for(let i=0;i<3;i++){let a=t/650+i*2.094;p.gem(Math.cos(a)*26,-21+Math.sin(a)*23,3,trim)}}
  if(type==='obelisk'||type==='temple')p.poly([[-15,-36],[-11,-45],[0,-40],[11,-45],[15,-36]],trim,ink);
 }else if(k==='dragon'||type==='fortress'){
  for(const s of [-1,1])p.poly([[s*6,-21],[s*31,-40+walk*3],[s*27,-10],[s*16,-16]],skin,ink);
  p.path([['M',-15,-9],['Q',-39,-2,-31,-20],['L',-27,-8],['L',-14,-19],['Z']],skin,ink);p.oval(0,-16,20,16,skin,ink,1.4);
  for(const s of [-1,1])p.poly([[s*7,-26],[s*14,-40],[s*16,-24]],trim,ink);
 }else{
  const machine=['factory','workshop'].includes(type)||k==='robot';
  for(const s of [-1,1]){p.poly([[s*5,-14],[s*16,-14],[s*17+walk*s,-3],[s*22+walk*s,0],[s*5+walk*s,0]],skin,ink);p.oval(s*22,-16+walk*s,8,10,skin,ink)}
  p.poly([[-20,-26],[-13,-36],[13,-36],[20,-26],[16,-6],[0,-2],[-16,-6]],skin,ink,1.5);
  p.poly([[-13,-35],[-9,-42],[10,-42],[15,-34],[12,-21],[-12,-21]],p.grad(-13,-42,15,-21,trim,dark),ink);p.oval(0,-31,12,6,face);
  if(machine){p.line(0,-42,0,-49,trim,1.5);p.gem(0,-50,3,trim);for(const s of [-1,1]){p.oval(s*20,-16,4,4,dark);p.oval(s*20,-16,2,2,trim)}}
  else {p.line(-16,-23,-7,-13,trim,1.2);p.line(-7,-13,-13,-8,trim,1.2)}
  if(type==='library'){for(const s of [-1,1]){p.line(s*8,-39,s*23,-39,trim,1.5);p.line(s*20,-39,s*22,-24,trim);p.oval(s*22,-24,6,2.5,trim,ink)}}
  if(type==='tomb'||type==='mine')for(const s of [-1,1])p.gem(s*19,-26,5,light);
 }
 const ey=hover?-25: k==='golem'||k==='robot'||['mine','factory','workshop','library','tomb'].includes(type)?-30:-19;
 for(const s of [-1,1]){p.oval(s*7,ey,4,4.6,friendly?'#f8ffdf':'#ffe6ad',ink,.8);p.oval(s*7+1,ey+.2,1.8,2.8,ink);p.oval(s*7+.5,ey-1.6,1,1,'#fff');if(!friendly)p.line(s*7-4,ey-5,s*7+4,ey-3,ink,1.5)}
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
function projectile(c,shot,t,col,hostile=false){const p=pen(c),id=shot.spell||shot.element||'light',x=shot.x,y=shot.y,d=shot.dir||1;c.save();p.glow(x,y,hostile?21:24,col);for(let i=1;i<(root.MicroPlayPrefs?.lite?3:6);i++)p.oval(x-d*i*6,y+Math.sin(i+t/65)*2,Math.max(1,5-i*.7),2.5,col+'99');
 c.translate(x,y);c.scale(d,1);
 if(id==='lightning'){p.poly([[-9,-9],[4,-9],[0,-2],[10,-2],[-4,10],[0,2],[-8,2]],'#fff4b1',col,1.3)}
 else if(id==='fire'){p.path([['M',-14,0],['Q',-2,-13,5,-8],['Q',17,0,5,8],['Q',-2,13,-14,0],['Z']],p.grad(-14,0,10,0,col,'#fff3b1'),col)}
 else if(['water','air'].includes(id)){p.oval(0,0,9,7,null,col,2.3);p.oval(2,0,5,4,'#e7faff');p.oval(-4,-2,4,2,'#ffffff9a')}
 else if(['metal','earth','crystal'].includes(id)){c.rotate(t/130);p.gem(0,0,10,col)}
 else if(['shadow','astral','rune'].includes(id)){p.oval(0,0,8,8,id==='shadow'?'#3b2b66':col,'#f7eaff',1.4);p.oval(0,0,13,10,null,col,1.3)}
 else{p.gem(0,0,9,col);p.oval(0,0,3,3,'#fffdf2')}
 c.restore()
}
function scenery(c,{chapter,world,cam=0,time=0,palette:p0}){
 const p=pen(c),[type,base,dark,trim]=theme(chapter,world),t=time;
 const W=960,H=420;p.box(0,0,W,H,p.grad(0,0,0,H,p0.sky,p0.horizon));
 p.glow(770-cam*.045,78,130,trim);p.oval(770-cam*.045,78,43,43,trim+'bb');
 for(let i=0;i<(root.MicroPlayPrefs?.lite?12:40);i++){const x=((i*167-cam*.045)%990+990)%990,y=18+hash(i+5)*170;p.oval(x,y,1+hash(i)*1.2,1,trim+'65')}
 for(let i=-1;i<7;i++){const x=i*190-(cam*.16)%190,h=60+hash(i+20)*115;p.poly([[x-70,278],[x+40,278-h],[x+135,278]],p0.mount)}
 for(let i=-1;i<8;i+=(root.MicroPlayPrefs?.lite?2:1)){const x=i*155-(cam*.38)%155,y=265+hash(i+12)*26;
  if(['forest','garden','oasis'].includes(type)){
   p.line(x,y,x+5,y-92,dark,10);for(let j=0;j<6;j++){let a=j*Math.PI/3;p.oval(x+5+Math.cos(a)*28,y-81+Math.sin(a)*21,28,21,j%2?dark:p0.tree);p.oval(x+Math.cos(a)*27,y-88+Math.sin(a)*20,17,7,base+'45')}
  }else if(['mine','mirror'].includes(type)){
   for(let j=0;j<3;j++){const xx=x-35+j*35,ht=34+hash(i*3+j)*74;p.poly([[xx-14,y],[xx-18,y-ht*.63],[xx,y-ht],[xx+18,y-ht*.55],[xx+12,y]],p.grad(xx-18,y-ht,xx+18,y,base,dark));p.line(xx,y-ht,xx,y,trim+'80',1.2)}
  }else if(['factory','workshop'].includes(type)){
   p.box(x-38,y-115,76,115,p.grad(x-38,y-115,x+38,y,base,dark));for(let j=0;j<4;j++)p.box(x-27,y-102+j*25,53,9,dark);p.oval(x+15,y-115,25,25,base,dark,2);for(let j=0;j<8;j++){const a=j*Math.PI/4+t/1800;p.line(x+15+Math.cos(a)*7,y-115+Math.sin(a)*7,x+15+Math.cos(a)*21,y-115+Math.sin(a)*21,dark,4)}p.oval(x+15,y-115,7,7,dark)
  }else if(['obelisk','tomb','temple'].includes(type)){
   p.poly([[x-29,y],[x-21,y-128],[x,y-152],[x+21,y-128],[x+29,y]],p.grad(x-29,y-152,x+29,y,base,dark));p.line(x,y-152,x,y,trim+'60',1);for(let j=0;j<5;j++)p.gem(x-8,y-115+j*20,3,trim)
  }else if(['library','papyrus'].includes(type)){
   p.box(x-42,y-116,84,116,dark,base);for(let j=0;j<4;j++){p.box(x-38,y-89+j*27,76,4,base);for(let k=0;k<8;k++){const ht=12+hash(i*7+k)*10;p.box(x-35+k*9,y-90+j*27-ht,7,ht,[base,trim,'#9b7897','#7795a7'][k%4])}}
  }else if(type==='fortress'){p.box(x-43,y-92,86,92,dark);for(let j=0;j<4;j++)p.box(x-43+j*24,y-104,15,20,dark);p.glow(x,y-49,31,'#ffb77c');p.box(x-8,y-70,16,45,base)}
  else{p.glow(x,y-75,62,base);p.oval(x,y-75,46,65,null,base+'99',2);p.oval(x,y-75,32,49,null,trim+'65',1);for(let j=0;j<6;j++){const a=j*Math.PI/3+t/2400;p.gem(x+Math.cos(a)*45,y-75+Math.sin(a)*62,4,base)}p.gem(x,y-75,19,base)}
 }
 for(let i=0;i<(root.MicroPlayPrefs?.lite?3:10);i++){const x=((i*137-cam*.21+t*.009)%1100+1100)%1100-70;p.oval(x,300+i%4*22,74,9,'#e7f3ff18')}
}
function platform(c,{chapter,world,a,b,y=334,main=false,cam=0,time=0,moving=false}){if(b<cam-80||a>cam+1040)return;const p=pen(c),[type,base,dark,trim]=theme(chapter,world),w=b-a,depth=main?54:24;const l=Math.max(a,cam-50),r=Math.min(b,cam+1010);
 p.poly([[a,y+8],[b,y+8],[b-12,y+depth],[a+w*.6,y+depth+20],[a+12,y+depth]],p.grad(a,y,a,y+depth+20,base,dark));p.box(a,y,w,10,p.grad(a,y,a,y+10,trim,base));p.line(a,y+1,b,y+1,'#f7f4dfaa',1.5);
 for(let x=Math.ceil(l/27)*27;x<r-6;x+=(root.MicroPlayPrefs?.lite?54:27)){if(['forest','garden','oasis'].includes(type)){p.poly([[x,y+9],[x+7,y+24],[x+14,y+9]],dark);p.line(x+4,y,x+7,y-5,base,1.5)}else if(['factory','workshop'].includes(type)){p.oval(x+6,y+17,6,6,dark,trim,.8);p.oval(x+6,y+17,2,2,base)}else if(['mine','mirror','orbit','eclipse','rune'].includes(type)){p.gem(x+6,y+15,6,base)}else{p.line(x,y+15,x+19,y+15,dark,1);p.line(x+8,y+15,x+8,y+24,dark,1);if(x%81===0)emblem(p,x+8,y+28,type,trim,dark)}}
 if(moving){p.oval((a+b)/2,y+depth+12,Math.min(w*.35,36),5,null,base,1.3);p.gem((a+b)/2,y+depth+12,4,trim)}
}
function victory(c,{chapter,world,character,colors,accessory,armor,magic,time=0,name=''}){const p=pen(c),[type,base,dark,trim]=theme(chapter,world);p.box(0,0,960,300,p.grad(0,0,960,300,dark,'#233c54'));p.glow(480,160,185,base);for(let i=0;i<45;i++){const x=hash(i+3)*960,y=hash(i+88)*300;p.gem(x,y,2+hash(i+16)*3,i%2?base:trim)}p.oval(480,260,290,15,'#152c40aa');enemy(c,{chapter,world,x:610,y:260,boss:true,friendly:true,scale:2.1,time});root.MicroHeroes?.draw(c,{character,...colors,accessory,armor,magic,x:335,y:260,scale:2.25,time,pose:'victory'});p.text(480,31,'GARDIEN LIBÉRÉ',trim,23);p.text(480,55,name,'#f6eddc',16)}
root.MicroPolish={enemy,burst,projectile,scenery,platform,victory,themes};
})(globalThis);
