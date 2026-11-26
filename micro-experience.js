/* V37 — original item illustrations, lightweight screen transitions. */
(function(root){
'use strict';
const cache=new Map(),limit=64;
function icon(kind,item){
 const color=/^#[0-9a-f]{6}$/i.test(item?.color||'')?item.color:'#a9d8db',id=item?.id||'basic',key=kind+':'+id+':'+color;
 if(cache.has(key))return cache.get(key);
 try{
 const c=root.document.createElement('canvas');c.width=100;c.height=100;const g=c.getContext('2d');if(!g||!c.toDataURL)return null;
 const grad=(x,y,X,Y,a,b)=>{const p=g.createLinearGradient(x,y,X,Y);p.addColorStop(0,a);p.addColorStop(1,b);return p};
 const path=(pts,fill,stroke='#152334',w=1.6)=>{g.beginPath();for(let i=0;i<pts.length;i++)i?g.lineTo(...pts[i]):g.moveTo(...pts[i]);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.stroke()}};
 const ellipse=(x,y,rx,ry,fill,stroke=null,w=1)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.stroke()}};
 const line=(x,y,X,Y,col,w=1)=>{g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.strokeStyle=col;g.lineWidth=w;g.stroke()};
 const metal=grad(25,15,75,90,'#eaf6ef',color),shade=grad(20,20,85,90,color,'#233047');
 g.fillStyle=grad(0,0,100,100,'#32475e','#0f2034');g.fillRect(0,0,100,100);ellipse(50,50,40,40,null,color+'66',1.3);ellipse(50,50,34,34,null,'#e6d9b433',1);
 const gem=(x,y,r)=>{path([[x,y-r],[x+r*.7,y],[x,y+r],[x-r*.7,y]],metal);line(x,y-r,x,y+r,'#ffffffaa',1)};
 if(kind==='armor'){
  path([[30,25],[42,18],[50,24],[58,18],[70,25],[83,36],[72,53],[65,47],[64,75],[50,85],[36,75],[35,47],[28,53],[17,36]],shade);
  path([[34,28],[50,33],[66,28],[65,63],[50,75],[35,63]],metal);
  for(const s of [-1,1]){path([[50+s*16,29],[50+s*28,33],[50+s*29,43],[50+s*18,47]],metal);line(50+s*18,32,50+s*25,36,'#fff4cf',1.6);ellipse(50+s*12,60,2,2,'#f8e2af','#152334')}
  line(35,66,50,75,'#eef5ed',1.5);line(50,75,65,66,'#eef5ed',1.5);gem(50,49,10);
 }else{
  const glow=g.createRadialGradient(50,50,0,50,50,43);glow.addColorStop(0,color+'c0');glow.addColorStop(1,color+'00');ellipse(50,50,43,43,glow);
  if(id==='fire'){path([[50,15],[64,35],[60,43],[76,37],[79,62],[68,80],[44,85],[25,70],[25,49],[38,54]],shade);path([[50,42],[61,58],[67,63],[59,77],[46,77],[36,66]],metal)}
  else if(id==='water'){path([[50,15],[73,45],[77,62],[68,79],[50,86],[32,79],[23,62],[27,45]],metal);ellipse(43,55,7,17,'#ffffff80')}
  else if(id==='lightning'){path([[59,13],[27,55],[47,55],[39,88],[76,39],[55,39]],metal)}
  else if(id==='heal'){path([[43,23],[57,23],[57,43],[77,43],[77,57],[57,57],[57,77],[43,77],[43,57],[23,57],[23,43],[43,43]],metal)}
  else if(['shadow','astral'].includes(id)){ellipse(50,50,30,30,metal);ellipse(63,40,27,27,'#182940');gem(25,25,5)}
  else if(id==='air'){for(let i=0;i<3;i++){g.beginPath();g.ellipse(50,42+i*9,30-i*5,10,0,0,Math.PI*1.6);g.strokeStyle=color;g.lineWidth=4-i*.5;g.stroke()}}
  else if(id==='metal'){ellipse(50,50,26,26,shade,'#d7e5df',2);for(let i=0;i<8;i++){const a=i*Math.PI/4;line(50+Math.cos(a)*22,50+Math.sin(a)*22,50+Math.cos(a)*34,50+Math.sin(a)*34,color,8)}ellipse(50,50,9,9,'#122638','#e1e9d8',2)}
  else{gem(50,50,31);if(id==='rune'||id==='light')for(const s of [-1,1]){gem(50+s*28,27,5);gem(50+s*24,75,4)}}
 }
 const src=c.toDataURL('image/png');cache.set(key,src);if(cache.size>limit)cache.delete(cache.keys().next().value);return src;
 }catch{return null}
}
function decorate(el,kind,item,compact=false){const src=icon(kind,item);if(!src)return;const img=root.document.createElement('img');img.className=compact?'item-art compact':'item-art';img.src=src;img.alt='';img.setAttribute('aria-hidden','true');if(compact&&el.prepend)el.prepend(img);else el.append(img)}
function enter(el){if(!el?.classList)return;el.classList.remove('screen-enter');if(el.id==='play')return;void el.offsetWidth;el.classList.add('screen-enter')}
const sounds={
 rune:[[523,0,.15],[659,.07,.17],[784,.14,.23]],
 retry:[[330,0,.13],[294,.10,.18]],
 coin:[[880,0,.12],[1175,.055,.17]],
 purify:[[392,0,.23],[523,.07,.24],[659,.14,.26],[1047,.21,.32]],
 boss:[[262,0,.32],[392,.10,.28],[523,.2,.3],[784,.3,.38]],
 shield:[[220,0,.19],[440,.035,.15],[660,.07,.2]],
 hit:[[196,0,.12],[147,.06,.17]],
 victory:[[523,0,.24],[659,.11,.24],[784,.22,.28],[1047,.34,.45],[523,.34,.45]]
};
function sound(ctx,ok=true,kind='rune'){
 if(!ctx||root.document?.hidden)return false;
 const notes=sounds[kind==='rune'&&!ok?'retry':kind]||sounds[ok?'rune':'retry'];
 const now=ctx.currentTime;
 for(const [hz,delay,duration] of notes){const t=now+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=kind==='hit'?'sine':'triangle';o.frequency.setValueAtTime(hz,t);if(kind==='hit')o.frequency.exponentialRampToValueAtTime(hz*.65,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(kind==='hit'?.035:.042,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+duration+.01)}
 return true;
}
root.MicroExperience={icon,decorate,enter,sound};
})(globalThis);
