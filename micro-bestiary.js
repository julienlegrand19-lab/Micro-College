/* Original bestiary — vector artwork, shared by the three campaigns. */
(function(root){
'use strict';
const designs={
 relatifs:[['stag','#8bbfa0','#233d45','leaf'],['basalt','#a193b0','#343045','crack'],['engine','#d3ac65','#444c62','gear'],['star','#8faee2','#313760','star'],['dragon','#df9478','#56364c','flame'],['eclipse','#bda2df','#31213f','moon']],
 pyramides:[['sphinx','#e5be79','#79654e','sun'],['veil','#b0bfd8','#3d4564','eye'],['scarab','#dbb45a','#3e695f','sun'],['sand','#cc9a79','#6c4a4b','sand'],['pharaoh','#c8b3e4','#46385c','ankh']],
 litteral:[['scribe','#9dbda4','#395b59','book'],['automaton','#d4b87b','#4f425d','gear'],['mirror','#a4d5f3','#454d80','diamond'],['balance','#c7a8a0','#574658','balance'],['archon','#c8a9eb','#392a5a','rune']]
};
function draw(ctx,{chapter='relatifs',world=0,kind='golem',x=0,y=0,time=0,scale=1,dir=1,boss=false,friendly=false,flash=0,attack=false,exposed=false,purity=0}={}){
 const data=designs[chapter]?.[world]||designs.relatifs[0],name=boss?data[0]:kind,light=friendly?'#9ae2bd':boss&&root.MicroBossStage?root.MicroBossStage.mix(data[1],'#9ae2bd',Math.min(1,Math.max(0,purity))):data[1],dark=friendly?'#365d64':boss&&root.MicroBossStage?root.MicroBossStage.mix(data[2],'#365d64',Math.min(1,Math.max(0,purity))):data[2],ink='#19263b',edge='#f0e2bd',eyes=friendly?'#f7ffdc':'#ffe3a2',t=time;
 const grad=(x,y,X,Y,a,b)=>{const g=ctx.createLinearGradient(x,y,X,Y);g.addColorStop(0,a);g.addColorStop(1,b);return g};
 const P=(d,fill,stroke=ink,w=1.15)=>{ctx.beginPath();for(const [cmd,...a] of d){if(cmd==='M')ctx.moveTo(...a);else if(cmd==='L')ctx.lineTo(...a);else if(cmd==='Q')ctx.quadraticCurveTo(...a);else if(cmd==='C')ctx.bezierCurveTo(...a);else if(cmd==='Z')ctx.closePath()}if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke()}};
 const E=(x,y,rx,ry,c,stroke=null,w=1)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke()}};
 const L=(x,y,X,Y,c,w=1)=>P([['M',x,y],['L',X,Y]],null,c,w);
 const glow=(x,y,r,col)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+'70');g.addColorStop(1,col+'00');E(x,y,r,r,g)};
 const gem=(x,y,k,col=light)=>{P([['M',x,y-k],['L',x+k*.65,y],['L',x,y+k],['L',x-k*.65,y],['Z']],grad(x-k,y-k,x+k,y+k,'#f9ffff',col),ink,.8);L(x,y-k,x,y+k,'#ffffff90',.7)};
 const emblem=(x,y,icon)=>{ctx.save();ctx.translate(x,y);const c=friendly?'#efffd9':edge;if(icon==='gear'){for(let i=0;i<8;i++){const a=i*Math.PI/4;L(Math.cos(a)*4,Math.sin(a)*4,Math.cos(a)*8,Math.sin(a)*8,c,2)}E(0,0,5,5,c);E(0,0,2,2,dark)}else if(icon==='balance'){L(-8,-5,8,-5,c,1.8);L(0,-8,0,7,c,1.8);L(-5,7,5,7,c,1.8);for(const d of [-1,1]){P([['M',d*6,-5],['L',d*10,3],['L',d*2,3],['Z']],c,null)}}else if(icon==='book'){P([['M',-8,-6],['Q',-3,-7,0,-3],['Q',4,-7,8,-6],['L',8,6],['Q',4,4,0,8],['Q',-4,4,-8,6],['Z']],c,ink,.5);L(0,-3,0,8,dark)}else if(icon==='moon'){E(0,0,7,7,c);E(3,-3,6,6,dark)}else if(icon==='ankh'){E(0,-5,3.8,5,c);E(0,-5,2,3,dark);L(0,-1,0,9,c,2);L(-6,2,6,2,c,2)}else if(icon==='eye'){P([['M',-8,0],['Q',0,-8,8,0],['Q',0,8,-8,0],['Z']],c,null);E(0,0,3,3,dark)}else if(icon==='sun'||icon==='star'){for(let i=0;i<8;i++){const a=i*Math.PI/4;L(Math.cos(a)*5,Math.sin(a)*5,Math.cos(a)*8,Math.sin(a)*8,c,1.5)}E(0,0,4,4,c)}else if(icon==='leaf'){P([['M',-7,6],['Q',-10,-9,8,-7],['Q',10,7,-7,6],['Z']],c,null);L(-7,6,6,-5,dark)}else if(icon==='flame'){P([['M',-5,6],['Q',-10,-1,0,-9],['Q',0,-3,5,-5],['Q',11,5,0,8],['Z']],c,null)}else if(icon==='sand'){P([['M',-6,-7],['L',6,-7],['L',0,0],['L',6,7],['L',-6,7],['L',0,0],['Z']],c,null)}else if(icon==='crack'){P([['M',-5,-8],['L',2,-3],['L',-2,2],['L',6,8]],null,c,2)}else gem(0,0,7,c);ctx.restore()};
 const bob=Math.sin(t/220+x*.05)*2,walk=Math.sin(t/115+x*.03)*3;
 ctx.save();ctx.translate(x,y);ctx.scale(scale*(dir===-1?-1:1),scale);
 if(!boss&&friendly){glow(0,-13,27,light);for(let i=0;i<3;i++){const a=t/500+i*Math.PI*2/3;gem(Math.cos(a)*23,-16+Math.sin(a)*13,2.1,'#d7f9a9')}}
 if(boss){glow(0,-32,45,light);ctx.beginPath();ctx.ellipse(0,0,34,8,0,0,Math.PI*2);ctx.strokeStyle=light+'a0';ctx.lineWidth=1.8;ctx.stroke();for(let i=0;i<5;i++){const a=t/950+i*Math.PI*2/5;gem(Math.cos(a)*33,-33+Math.sin(a)*34,2,light)}}
 if(flash>0)ctx.globalAlpha=.74;
 const metal=grad(-25,-60,24,0,light,dark);
 if(['stag','sphinx','dragon'].includes(name)){
  const dragon=name==='dragon',sphinx=name==='sphinx',stag=name==='stag',stride=walk*(boss?.65:1),fur=grad(-22,-45,15,-9,light,dark);
  E(0,0,29,5,'#101d2f66');
  // Four weight-bearing limbs, a curved spine and separate head/neck volumes.
  for(const [xx,s,far] of [[-18,-1,true],[13,1,true],[-16,1,false],[15,-1,false]]){
   const k=xx+stride*s,foot=k+stride*s*.65,cc=far?dark:metal;
   P([['M',xx-5,-24],['Q',xx+7,-25,k+5,-15],['L',foot+4,-4],['L',foot+7,0],['L',foot-5,0],['L',k-4,-11],['Z']],cc,ink,1);
   L(k-2,-12,foot-2,-3,light+'95',1);L(foot-4,-1,foot+5,-1,edge,.8)
  }
  if(dragon){P([['M',-19,-20],['C',-47,-8,-53,-36,-43,-42],['Q',-43,-21,-19,-29],['Z']],fur);P([['M',-10,-33],['Q',-16,-78,-44,-68],['L',-34,-39],['L',-26,-46],['L',-14,-26],['Z']],grad(-44,-70,-8,-23,light,dark));for(let j=0;j<3;j++)L(-12,-34,-38+j*9,-59+j*9,edge+'75',1)}
  else P([['M',-23,-27],['Q',-35,-39,-34,-31],['Q',-35,-23,-24,-20],['Z']],fur);
  P([['M',-27,-27],['C',-26,-43,-12,-45,0,-38],['Q',12,-43,25,-35],['L',26,-21],['Q',13,-12,-11,-15],['Q',-29,-15,-27,-27],['Z']],fur);
  P([['M',-24,-34],['Q',-12,-42,-1,-36],['Q',10,-39,19,-34]],null,edge+'85',1.2);
  P([['M',9,-22],['Q',12,-34,18,-41],['L',19,-53],['Q',26,-62,32,-52],['L',31,-37],['Q',29,-23,21,-20],['Z']],metal);
  const head=grad(14,-64,38,-42,light,dark);
  P([['M',17,-51],['Q',13,-62,23,-65],['Q',33,-65,36,-55],['L',43,-50],['Q',42,-44,34,-44],['L',24,-46],['Z']],head);
  if(stag){for(const s of [-1,1]){const xx=22+s*5;P([['M',xx,-62],['Q',xx+s*10,-72,xx+s*9,-87],['M',xx+s*8,-76],['L',xx+s*19,-82],['M',xx+s*9,-82],['L',xx+s*14,-91]],null,edge,2.7)}P([['M',18,-61],['L',8,-66],['Q',8,-56,18,-54],['Z']],metal)}
  if(sphinx){P([['M',16,-61],['Q',25,-72,36,-62],['L',40,-57],['L',35,-54],['L',32,-59],['L',24,-56],['L',19,-35],['L',10,-38],['Z']],grad(12,-64,37,-35,'#f1d899',dark));for(let i=0;i<5;i++)L(14+i*.8,-57+i*4,24+i*.4,-55+i*4,'#405c75',1.6)}
  if(dragon){for(let j=0;j<3;j++)P([['M',17+j*6,-60],['L',14+j*6,-72+j*2],['L',23+j*6,-62],['Z']],edge,ink,.8);for(let j=0;j<5;j++)P([['M',-24+j*8,-35],['L',-21+j*8,-44],['L',-16+j*8,-36],['Z']],light,ink,.6)}
  E(33,-55,3.8,2.8,eyes,ink,.65);E(34,-55,1.2,2,ink);E(33,-56,.7,.7,'#fff');E(40,-50,1.4,1.1,ink);P([['M',34,-47],['Q',38,friendly?-44:-48,41,-47]],null,ink,1);
  if(!root.MicroPlayPrefs?.lite){for(let j=0;j<12;j++){const xx=-22+(j%6)*7,yy=-33+Math.floor(j/6)*9;P([['M',xx,yy],['Q',xx+2,yy+3,xx+5,yy+1]],null,dragon?edge+'7a':light+'80',.8)}}
  emblem(4,-25,data[3]);
 }else if(['wraith','star','eclipse','veil','mirror','archon','pharaoh'].includes(name)){
  ctx.translate(0,bob);const w=boss?31:23,h=boss?76:48;
  if(name==='mirror'){for(let i=0;i<5;i++){const a=t/800+i*Math.PI*2/5;gem(Math.cos(a)*36,-38+Math.sin(a)*38,5+i%2*2,light)}P([['M',0,-h],['L',w,-h*.7],['L',w*.75,-9],['L',0,0],['L',-w*.75,-9],['L',-w,-h*.7],['Z']],metal);P([['M',0,-h+8],['L',w*.7,-h*.68],['L',w*.5,-12],['L',0,-4],['L',-w*.5,-12],['L',-w*.7,-h*.68],['Z']],grad(-25,-70,25,0,'#e6f4ff',dark));L(-14,-37,13,-65,'#ffffff99',2)}
  else{P([['M',0,-h],['Q',-w,-h*.8,-w,-h*.38],['L',-w-5,-7],['L',-w*.35,-15+bob],['L',-3,0],['L',8,-13],['L',w+3,-4],['L',w,-h*.42],['Q',w,-h*.8,0,-h],['Z']],metal);P([['M',-w*.54,-h*.65],['Q',0,-h*.9,w*.54,-h*.65],['L',w*.38,-h*.33],['Q',0,-h*.23,-w*.38,-h*.33],['Z']],'#20263d');L(-w*.8,-h*.39,-w*.37,-8,light+'bb',1.3);L(w*.8,-h*.39,w*.37,-8,light+'bb',1.3)}
  if(name!=='mirror'){for(const s of [-1,1]){P([['M',s*w*.69,-h*.67],['Q',s*w*.95,-h*.32,s*w*.62,-6],['M',s*w*.46,-h*.35],['Q',s*w*.3,-h*.2,s*w*.17,-4]],null,light+'80',1.4);P([['M',s*w*.65,-h*.67],['Q',s*w*.7,-h*.49,s*w*.44,-h*.4]],null,edge+'60',1)}}
  const ey=-h*.55;E(-8,ey,4,2.6,eyes);E(8,ey,4,2.6,eyes);if(friendly)P([['M',-4,ey+8],['Q',0,ey+12,4,ey+8]],null,eyes,1.5);if(boss)emblem(0,-18,data[3]);
  if(name==='pharaoh'){P([['M',-17,-h+8],['L',-24,-h-4],['L',24,-h-4],['L',17,-h+8],['Z']],grad(-24,-h,24,-h+8,'#e4c078',dark));gem(0,-h-5,7,'#ebd390')}
  if(name==='archon'||name==='eclipse'){for(const s of [-1,1])P([['M',s*14,-h+10],['L',s*24,-h-12],['L',s*24,-h+8],['Z']],metal);gem(0,-h,5,light)}
  if(name==='star')for(let i=0;i<5;i++)gem(Math.cos(t/900+i*1.26)*32,-38+Math.sin(t/900+i*1.26)*32,3,'#d6ecff');
 }else if(['slime','beetle','scarab'].includes(name)){
  E(0,0,22,4,'#101d2f55');if(name!=='slime'){for(const s of [-1,1])for(let i=0;i<3;i++){L(s*12,-21+i*6,s*(25+i%2*3),-14+i*6,dark,3);L(s*(25+i%2*3),-14+i*6,s*24+walk,0,ink,2)}}
  const yy=boss?-39:-25;P([['M',-24,-7],['Q',-29,yy,-12,yy-5],['Q',0,yy-12,12,yy-5],['Q',29,yy,24,-7],['Q',0,5,-24,-7],['Z']],metal);P([['M',-18,yy+4],['Q',0,yy-9,15,yy+2]],null,'#ffffff88',2);
  if(name!=='slime'){L(0,yy-5,0,-9,ink,1.8);for(const s of [-1,1])P([['M',s*10,yy-3],['L',s*17,yy-12],['L',s*21,yy-9]],null,edge,1.8)}
  if(name!=='slime'){for(const s of [-1,1]){P([['M',s*3,yy-3],['Q',s*16,yy+3,s*19,-13],['L',s*8,-9]],null,edge+'aa',1.2);for(let j=0;j<3;j++)E(s*(8+j*4),yy+8+j*4,1.2,1.2,dark)}}else{E(-11,yy+10,5,2.8,'#ffffff60');E(12,-10,3,2,light+'aa')}
  const ey=yy+12;E(-8,ey,4.5,5,eyes,ink);E(8,ey,4.5,5,eyes,ink);E(-7,ey+1,2,3,ink);E(9,ey+1,2,3,ink);P([['M',-5,-10],['Q',0,friendly?-5:-14,5,-10]],null,ink,1.3);if(boss)emblem(0,yy+1,data[3])
 }else{
  const robot=['robot','engine','automaton'].includes(name),h=boss?62:42;
  E(0,0,24,4,'#101d2f55');
  for(const s of [-1,1]){const fx=s*12+walk*(s===1?1:-1);P([['M',s*5,-17],['L',s*17,-19],['L',fx+5,-6],['L',fx+9,0],['L',fx-8,0],['Z']],metal);const ay=attack?-h*.72:-h*.4;P([['M',s*17,-h*.7],['L',s*32,ay-6],['L',s*35,ay+9],['L',s*24,ay+17],['L',s*16,-h*.35],['Z']],metal);L(s*23,ay-2,s*31,ay+2,edge,1.4)}
  P([['M',-24,-h*.65],['L',-16,-h],['L',16,-h],['L',25,-h*.65],['L',18,-12],['L',0,-6],['L',-18,-12],['Z']],metal);
  P([['M',-15,-h],['L',-10,-h-9],['L',11,-h-9],['L',16,-h],['L',13,-h+15],['L',-13,-h+15],['Z']],grad(-14,-h-8,14,-h+15,light,dark));
  for(const s of [-1,1]){P([['M',s*15,-h*.87],['L',s*21,-h*.63],['L',s*15,-h*.28]],null,edge+'a0',1.2);if(robot){for(let j=0;j<3;j++)L(s*7,-h*.43+j*4,s*16,-h*.43+j*4,dark,2);E(s*19,-h*.6,2.5,2.5,edge,dark,.8)}else{P([['M',s*18,-h*.7],['L',s*10,-h*.53],['L',s*14,-h*.34],['L',s*6,-h*.23]],null,dark,1.4)}}
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
