/* V26 – Boss staging. Visual vocabulary is independent of randomly selected combat affinities. */
(function(root){
'use strict';
const choreography={
 relatifs:[['Branches des brumes','branches'],['Fracture du basalte','stones'],['Impulsion magnétique','gears'],['Convergence stellaire','orbit'],['Souffle du dragon','wings'],['Anneau de l’Éclipse','eclipse']],
 pyramides:[['Réveil du Sphinx','sun'],['Voile des obélisques','pillars'],['Envol du scarabée','wings'],['Tempête du colosse','stones'],['Sceau du pharaon','ankh']],
 litteral:[['Grimoire du Scribe','book'],['Réacteur de l’Automate','gears'],['Éclats du Miroir','crystal'],['Équilibre du Titan','scales'],['Cercle de l’Archonte','runes']]
};
const clamp=n=>Math.max(0,Math.min(1,n));
function mix(a,b,f){if(!/^#[0-9a-f]{6}$/i.test(a))return b;return '#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-f)+parseInt(b.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('')}
function stage(ctx,o){
 const [title,style]=choreography[o.chapter]?.[o.world]||choreography.relatifs[0],b=o.boss,t=o.time||0,px=b.x,y=334,ratio=clamp(b.hp/Math.max(1,b.max)),purity=1-ratio,entry=clamp((b.introLeft||0)/1.4),end=clamp((b.clearLeft||0)/1.15),attack=!!o.active&&b.hp>0&&b.clock<.4&&entry===0,launch=clamp((b.castLeft||0)/.32),base=o.accent,energy=o.elementColor||'#ffd69a',color=mix(base,'#a4f5c2',purity);
 const line=(x,y,X,Y,col,w=1)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke()};
 const oval=(x,y,rx,ry,col,fill=false,w=1)=>{ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);if(fill){ctx.fillStyle=col;ctx.fill()}else{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke()}};
 const poly=(a,col,fill=true)=>{ctx.beginPath();a.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(fill){ctx.closePath();ctx.fillStyle=col;ctx.fill()}else{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke()}};
 const gem=(x,y,r,col)=>poly([[x,y-r],[x+r*.65,y],[x,y+r],[x-r*.65,y]],col);
 const glow=(x,y,r,col)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+'66');g.addColorStop(1,col+'00');oval(x,y,r,r,g,true)};
 const text=(x,y,s,col,size)=>{ctx.font='bold '+size+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=col;ctx.fillText(s,x,y)};
 ctx.save();ctx.translate(px,y);
 if(entry>0){const r=18+(1-entry)*85;glow(0,-75,100,color);oval(0,-73,r,r*1.1,color+'aa',false,2);oval(0,0,70*(1-entry)+12,12,base,false,2);for(let i=0;i<8;i++){const a=i*Math.PI/4+t/420;gem(Math.cos(a)*r,-70+Math.sin(a)*r,3+entry*4,base)}}
 // Partial cleansing changes the halo and the number of dark seals.
 if(b.hp>0&&o.active){const n=Math.ceil(ratio*6);for(let i=0;i<6;i++){const a=i*Math.PI/3+t/1800;const x=Math.cos(a)*66,yy=-77+Math.sin(a)*62;if(i<n){oval(x,yy,5,5,'#293048',true);oval(x,yy,5,5,base,false,1.3)}else gem(x,yy,4,'#b3f8c7')}}
 if(attack||launch>0){const a=attack?clamp(1-b.clock/.4):launch;ctx.globalAlpha=.45+.55*a;const col=energy;
  switch(style){
   case 'branches':for(const s of [-1,1]){poly([[s*13,-54],[s*36,-85],[s*58,-95-a*18]],col,false);poly([[s*36,-85],[s*25,-114]],col,false);gem(s*58,-95-a*18,5,col)}break;
   case 'stones':for(let i=0;i<5;i++){const q=i*1.257+t/400;gem(Math.cos(q)*(45+18*a),-66+Math.sin(q)*43,7,col)}break;
   case 'gears':for(const s of [-1,1]){const x=s*47;oval(x,-75,18+6*a,18+6*a,col,false,2);for(let i=0;i<8;i++){const q=i*Math.PI/4+t/130;line(x+Math.cos(q)*14,-75+Math.sin(q)*14,x+Math.cos(q)*26,-75+Math.sin(q)*26,col,2)}}break;
   case 'orbit':for(let i=0;i<4;i++){const q=i*Math.PI/2+t/160;gem(Math.cos(q)*75,-72+Math.sin(q)*30,6,col)}oval(0,-72,75,30,col,false,1.5);break;
   case 'wings':for(const s of [-1,1]){poly([[s*18,-58],[s*(45+25*a),-107],[s*65,-44],[s*39,-62]],col+'55');line(s*18,-58,s*(45+25*a),-107,col,2)}break;
   case 'eclipse':oval(0,-86,39+18*a,39+18*a,col,false,3);oval(0,-86,29,29,'#202038',true);break;
   case 'sun':for(let i=0;i<12;i++){const q=i*Math.PI/6;line(Math.cos(q)*30,-93+Math.sin(q)*30,Math.cos(q)*(44+15*a),-93+Math.sin(q)*(44+15*a),col,2)}break;
   case 'pillars':for(const s of [-1,1]){poly([[s*53-7,-25],[s*53,-120-a*18],[s*53+7,-25]],col+'77');gem(s*53,-120-a*18,6,col)}break;
   case 'ankh':oval(0,-113,12,17,col,false,3);line(0,-96,0,-62,col,3);line(-16,-87,16,-87,col,3);break;
   case 'book':for(const s of [-1,1]){poly([[0,-90],[s*(32+10*a),-106],[s*(32+10*a),-64],[0,-51]],col+'77');for(let i=0;i<3;i++)line(s*5,-84+i*9,s*27,-96+i*9,col,1)}break;
   case 'crystal':for(let i=0;i<6;i++){const q=i*Math.PI/3+t/180;gem(Math.cos(q)*73,-80+Math.sin(q)*55,8+4*a,col)}break;
   case 'scales':{const tip=8*Math.sin(t/90);line(-59,-105-tip,59,-105+tip,col,3);line(0,-118,0,-66,col,2);for(const s of [-1,1]){line(s*52,-105+s*tip,s*42,-77+s*tip,col);line(s*52,-105+s*tip,s*62,-77+s*tip,col);oval(s*52,-77+s*tip,12,4,col,false,2)}}break;
   default:oval(0,-83,60,67,col,false,2);for(let i=0;i<6;i++){const q=i*Math.PI/3+t/260;gem(Math.cos(q)*61,-83+Math.sin(q)*66,7,col)}
  }
  ctx.globalAlpha=1;
  if(launch>0){glow(-35,-32,23+launch*18,col);oval(-35,-32,12+(1-launch)*20,9+(1-launch)*10,col,false,2)}
 }
 if(end>0){const r=12+(1-end)*100;glow(0,-75,105,'#b9ffc9');oval(0,-75,r,r*.75,'#e3ffd3',false,2);for(let i=0;i<14;i++){const q=i*Math.PI/7+t/500;gem(Math.cos(q)*r,-75+Math.sin(q)*r*.72,3+end*4,'#e4ffb9')}}
 ctx.restore();
 return {purity,title,attack,launch,entry,end}
}
function banner(ctx,o){const b=o.boss;if(!o.active&&!(b.clearLeft>0))return;const entry=b.introLeft>0,end=b.clearLeft>0;if(!entry&&!end)return;
 const [title]=choreography[o.chapter]?.[o.world]||choreography.relatifs[0];ctx.save();ctx.fillStyle='#111b2bdf';ctx.fillRect(0,0,960,85);ctx.fillRect(0,388,960,32);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=end?'#bdffd0':'#e6d5aa';ctx.font='bold 14px system-ui';ctx.fillText(end?'MALÉDICTION DISSIPÉE':'LE GARDIEN S’ÉVEILLE',480,20);ctx.fillStyle='#fff7e2';ctx.font='bold 26px system-ui';ctx.fillText(o.name,480,49);ctx.fillStyle='#ded9f3';ctx.font='14px system-ui';ctx.fillText(end?'Le cristal est désormais accessible.':title,480,72);ctx.restore()
}
root.MicroBossStage={stage,banner,choreography,mix};
})(globalThis);
