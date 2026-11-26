/* Original bestiary — vector artwork, shared by the three campaigns. */
(function(root){
'use strict';
const designs={
 relatifs:[['stag','#8bbfa0','#233d45','leaf'],['basalt','#a193b0','#343045','crack'],['engine','#d3ac65','#444c62','gear'],['star','#8faee2','#313760','star'],['dragon','#df9478','#56364c','flame'],['eclipse','#bda2df','#31213f','moon']],
 pyramides:[['sphinx','#e5be79','#79654e','sun'],['veil','#b0bfd8','#3d4564','eye'],['scarab','#dbb45a','#3e695f','sun'],['sand','#cc9a79','#6c4a4b','sand'],['pharaoh','#c8b3e4','#46385c','ankh']],
 litteral:[['scribe','#9dbda4','#395b59','book'],['automaton','#d4b87b','#4f425d','gear'],['mirror','#a4d5f3','#454d80','diamond'],['balance','#c7a8a0','#574658','balance'],['archon','#c8a9eb','#392a5a','rune']]
};
function draw(ctx,{chapter='relatifs',world=0,kind='golem',x=0,y=0,time=0,scale=1,dir=1,boss=false,friendly=false,flash=0,attack=false,exposed=false}={}){
 const data=designs[chapter]?.[world]||designs.relatifs[0],name=boss?data[0]:kind,light=friendly?'#9ae2bd':data[1],dark=friendly?'#365d64':data[2],ink='#19263b',edge='#f0e2bd',eyes=friendly?'#f7ffdc':'#ffe3a2',t=time;
 const grad=(x,y,X,Y,a,b)=>{const g=ctx.createLinearGradient(x,y,X,Y);g.addColorStop(0,a);g.addColorStop(1,b);return g};
 const P=(d,fill,stroke=ink,w=1.15)=>{ctx.beginPath();for(const [cmd,...a] of d){if(cmd==='M')ctx.moveTo(...a);else if(cmd==='L')ctx.lineTo(...a);else if(cmd==='Q')ctx.quadraticCurveTo(...a);else if(cmd==='C')ctx.bezierCurveTo(...a);else if(cmd==='Z')ctx.closePath()}if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke()}};
 const E=(x,y,rx,ry,c,stroke=null,w=1)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke()}};
 const L=(x,y,X,Y,c,w=1)=>P([['M',x,y],['L',X,Y]],null,c,w);
 const glow=(x,y,r,col)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+'70');g.addColorStop(1,col+'00');E(x,y,r,r,g)};
 const gem=(x,y,k,col=light)=>{P([['M',x,y-k],['L',x+k*.65,y],['L',x,y+k],['L',x-k*.65,y],['Z']],grad(x-k,y-k,x+k,y+k,'#f9ffff',col),ink,.8);L(x,y-k,x,y+k,'#ffffff90',.7)};
 const emblem=(x,y,icon)=>{ctx.save();ctx.translate(x,y);const c=friendly?'#efffd9':edge;if(icon==='gear'){for(let i=0;i<8;i++){const a=i*Math.PI/4;L(Math.cos(a)*4,Math.sin(a)*4,Math.cos(a)*8,Math.sin(a)*8,c,2)}E(0,0,5,5,c);E(0,0,2,2,dark)}else if(icon==='balance'){L(-8,-5,8,-5,c,1.8);L(0,-8,0,7,c,1.8);L(-5,7,5,7,c,1.8);for(const d of [-1,1]){P([['M',d*6,-5],['L',d*10,3],['L',d*2,3],['Z']],c,null)}}else if(icon==='book'){P([['M',-8,-6],['Q',-3,-7,0,-3],['Q',4,-7,8,-6],['L',8,6],['Q',4,4,0,8],['Q',-4,4,-8,6],['Z']],c,ink,.5);L(0,-3,0,8,dark)}else if(icon==='moon'){E(0,0,7,7,c);E(3,-3,6,6,dark)}else if(icon==='ankh'){E(0,-5,3.8,5,c);E(0,-5,2,3,dark);L(0,-1,0,9,c,2);L(-6,2,6,2,c,2)}else if(icon==='eye'){P([['M',-8,0],['Q',0,-8,8,0],['Q',0,8,-8,0],['Z']],c,null);E(0,0,3,3,dark)}else if(icon==='sun'||icon==='star'){for(let i=0;i<8;i++){const a=i*Math.PI/4;L(Math.cos(a)*5,Math.sin(a)*5,Math.cos(a)*8,Math.sin(a)*8,c,1.5)}E(0,0,4,4,c)}else if(icon==='leaf'){P([['M',-7,6],['Q',-10,-9,8,-7],['Q',10,7,-7,6],['Z']],c,null);L(-7,6,6,-5,dark)}else if(icon==='flame'){P([['M',-5,6],['Q',-10,-1,0,-9],['Q',0,-3,5,-5],['Q',11,5,0,8],['Z']],c,null)}else if(icon==='sand'){P([['M',-6,-7],['L',6,-7],['L',0,0],['L',6,7],['L',-6,7],['L',0,0],['Z']],c,null)}else if(icon==='crack'){P([['M',-5,-8],['L',2,-3],['L',-2,2],['L',6,8]],null,c,2)}else gem(0,0,7,c);ctx.restore()};
 const bob=Math.sin(t/180+x*.05)*2,walk=Math.sin(t/115+x*.03)*3;
 ctx.save();ctx.translate(x,y);ctx.scale(scale*(dir===-1?-1:1),scale);
 if(!boss&&friendly){glow(0,-13,27,light);for(let i=0;i<3;i++){const a=t/500+i*Math.PI*2/3;gem(Math.cos(a)*23,-16+Math.sin(a)*13,2.1,'#d7f9a9')}}
 if(boss){glow(0,-32,45,light);ctx.beginPath();ctx.ellipse(0,0,34,8,0,0,Math.PI*2);ctx.strokeStyle=light+'a0';ctx.lineWidth=1.8;ctx.stroke();for(let i=0;i<5;i++){const a=t/950+i*Math.PI*2/5;gem(Math.cos(a)*33,-33+Math.sin(a)*34,2,light)}}
 if(flash>0)ctx.globalAlpha=.74;
 const metal=grad(-25,-60,24,0,light,dark);
 if(['stag','sphinx','dragon'].includes(name)){
  const dragon=name==='dragon',sphinx=name==='sphinx';
  E(0,0,24,4,'#101d2f66');
  if(dragon){for(const s of [-1,1])P([['M',s*7,-31],['Q',s*33,-75,s*43,-52],['L',s*39,-11],['L',s*27,-23],['L',s*15,-14],['Z']],grad(0,-60,s*40,-10,light,dark),ink);P([['M',-16,-11],['Q',-38,-1,-43,-21],['L',-37,-10],['Q',-25,-11,-18,-20],['Z']],metal)}
  for(const s of [-1,1]){P([['M',s*10,-24],['L',s*17,-16],['L',s*18+walk,-5],['L',s*24+walk,0],['L',s*9+walk,0],['L',s*7,-16],['Z']],metal)}
  P([['M',-24,-29],['Q',-19,-45,1,-42],['Q',23,-39,23,-23],['Q',13,-9,-9,-13],['Q',-28,-17,-24,-29],['Z']],metal);
  P([['M',-12,-39],['Q',-19,-53,-9,-60],['Q',0,-66,12,-59],['L',19,-44],['L',14,-37],['Z']],metal);
  if(name==='stag'){for(const s of [-1,1]){const xx=s*9;P([['M',xx,-58],['L',xx+s*10,-69],['L',xx+s*9,-84],['M',xx+s*10,-69],['L',xx+s*20,-76],['M',xx+s*9,-79],['L',xx+s*16,-86]],null,edge,2.6)}}
  if(sphinx){P([['M',-13,-58],['L',-27,-43],['L',-20,-21],['L',-7,-39],['L',7,-39],['L',20,-21],['L',27,-43],['L',13,-58],['Z']],grad(-20,-55,20,-21,'#e8c77d',dark));for(const s of [-1,1])for(let i=0;i<3;i++)L(s*(11+i*3),-54+i*5,s*(18+i*2),-34+i*3,'#385777',1.8)}
  if(dragon)for(const s of [-1,1])P([['M',s*8,-56],['L',s*19,-70],['L',s*13,-52],['Z']],edge);
  E(9,-49,3.5,4,eyes,ink);E(10,-49,1.3,2,ink);E(-8,-49,3,3.7,eyes,ink);E(-7,-49,1.3,2,ink);P([['M',2,-40],['Q',7,friendly?-36:-42,13,-40]],null,ink,1.2);emblem(0,-25,data[3]);
 }else if(['wraith','star','eclipse','veil','mirror','archon','pharaoh'].includes(name)){
  ctx.translate(0,bob);const w=boss?31:23,h=boss?76:48;
  if(name==='mirror'){for(let i=0;i<5;i++){const a=t/800+i*Math.PI*2/5;gem(Math.cos(a)*36,-38+Math.sin(a)*38,5+i%2*2,light)}P([['M',0,-h],['L',w,-h*.7],['L',w*.75,-9],['L',0,0],['L',-w*.75,-9],['L',-w,-h*.7],['Z']],metal);P([['M',0,-h+8],['L',w*.7,-h*.68],['L',w*.5,-12],['L',0,-4],['L',-w*.5,-12],['L',-w*.7,-h*.68],['Z']],grad(-25,-70,25,0,'#e6f4ff',dark));L(-14,-37,13,-65,'#ffffff99',2)}
  else{P([['M',0,-h],['Q',-w,-h*.8,-w,-h*.38],['L',-w-5,-7],['L',-w*.35,-15+bob],['L',-3,0],['L',8,-13],['L',w+3,-4],['L',w,-h*.42],['Q',w,-h*.8,0,-h],['Z']],metal);P([['M',-w*.54,-h*.65],['Q',0,-h*.9,w*.54,-h*.65],['L',w*.38,-h*.33],['Q',0,-h*.23,-w*.38,-h*.33],['Z']],'#20263d');L(-w*.8,-h*.39,-w*.37,-8,light+'bb',1.3);L(w*.8,-h*.39,w*.37,-8,light+'bb',1.3)}
  const ey=-h*.55;E(-8,ey,4,2.6,eyes);E(8,ey,4,2.6,eyes);if(friendly)P([['M',-4,ey+8],['Q',0,ey+12,4,ey+8]],null,eyes,1.5);if(boss)emblem(0,-18,data[3]);
  if(name==='pharaoh'){P([['M',-17,-h+8],['L',-24,-h-4],['L',24,-h-4],['L',17,-h+8],['Z']],grad(-24,-h,24,-h+8,'#e4c078',dark));gem(0,-h-5,7,'#ebd390')}
  if(name==='archon'||name==='eclipse'){for(const s of [-1,1])P([['M',s*14,-h+10],['L',s*24,-h-12],['L',s*24,-h+8],['Z']],metal);gem(0,-h,5,light)}
  if(name==='star')for(let i=0;i<5;i++)gem(Math.cos(t/900+i*1.26)*32,-38+Math.sin(t/900+i*1.26)*32,3,'#d6ecff');
 }else if(['slime','beetle','scarab'].includes(name)){
  E(0,0,22,4,'#101d2f55');if(name!=='slime'){for(const s of [-1,1])for(let i=0;i<3;i++){L(s*12,-21+i*6,s*(25+i%2*3),-14+i*6,dark,3);L(s*(25+i%2*3),-14+i*6,s*24+walk,0,ink,2)}}
  const yy=boss?-39:-25;P([['M',-24,-7],['Q',-29,yy,-12,yy-5],['Q',0,yy-12,12,yy-5],['Q',29,yy,24,-7],['Q',0,5,-24,-7],['Z']],metal);P([['M',-18,yy+4],['Q',0,yy-9,15,yy+2]],null,'#ffffff88',2);
  if(name!=='slime'){L(0,yy-5,0,-9,ink,1.8);for(const s of [-1,1])P([['M',s*10,yy-3],['L',s*17,yy-12],['L',s*21,yy-9]],null,edge,1.8)}
  const ey=yy+12;E(-8,ey,4.5,5,eyes,ink);E(8,ey,4.5,5,eyes,ink);E(-7,ey+1,2,3,ink);E(9,ey+1,2,3,ink);P([['M',-5,-10],['Q',0,friendly?-5:-14,5,-10]],null,ink,1.3);if(boss)emblem(0,yy+1,data[3])
 }else{
  const robot=['robot','engine','automaton'].includes(name),h=boss?62:42;
  E(0,0,24,4,'#101d2f55');
  for(const s of [-1,1]){const fx=s*12+walk*(s===1?1:-1);P([['M',s*5,-17],['L',s*17,-19],['L',fx+5,-6],['L',fx+9,0],['L',fx-8,0],['Z']],metal);const ay=attack?-h*.72:-h*.4;P([['M',s*17,-h*.7],['L',s*32,ay-6],['L',s*35,ay+9],['L',s*24,ay+17],['L',s*16,-h*.35],['Z']],metal);L(s*23,ay-2,s*31,ay+2,edge,1.4)}
  P([['M',-24,-h*.65],['L',-16,-h],['L',16,-h],['L',25,-h*.65],['L',18,-12],['L',0,-6],['L',-18,-12],['Z']],metal);
  P([['M',-15,-h],['L',-10,-h-9],['L',11,-h-9],['L',16,-h],['L',13,-h+15],['L',-13,-h+15],['Z']],grad(-14,-h-8,14,-h+15,light,dark));
  P([['M',-11,-h+1],['L',11,-h+1],['L',10,-h+10],['L',-10,-h+10],['Z']],'#202e43');
  E(-6,-h+5,3,2.7,eyes);E(6,-h+5,3,2.7,eyes);if(robot){L(0,-h-9,0,-h-17,edge,1.8);E(0,-h-18,3,3,light,ink)}
  else {L(-16,-h*.62,-6,-h*.45,edge,1.5);L(-6,-h*.45,-13,-h*.3,edge,1)}
  if(name==='scribe'){P([['M',-20,-h*.45],['Q',-11,-h*.55,0,-h*.39],['Q',11,-h*.55,20,-h*.45],['L',19,-h*.14],['Q',10,-h*.22,0,-h*.06],['Q',-10,-h*.22,-19,-h*.14],['Z']],'#dfc99e',ink);L(0,-h*.39,0,-h*.06,dark,1);L(-14,-h*.36,-4,-h*.27,dark,1);L(4,-h*.27,14,-h*.36,dark,1)}
  else emblem(0,-h*.38,boss?data[3]:robot?'gear':'crack');
  if(name==='balance'){for(const s of [-1,1]){L(s*8,-h-11,s*31,-h-11,edge,2);L(s*27,-h-11,s*20,-h+5,edge,1);L(s*27,-h-11,s*34,-h+5,edge,1);E(s*27,-h+5,9,3,light,ink)}}
  if(name==='basalt'||name==='sand'){for(const s of [-1,1])gem(s*23,-h*.65,7,light)}
 }
 if(boss&&exposed){glow(0,-27,34,'#c7ffe6');gem(0,-27,4,'#f3fff2')}
 if(boss&&friendly){for(let i=0;i<8;i++){const a=t/700+i*Math.PI/4;gem(Math.cos(a)*39,-32+Math.sin(a)*38,3,'#e7ffd1')}}
 ctx.restore()
}
root.MicroBestiary={draw,designs};
})(globalThis);
