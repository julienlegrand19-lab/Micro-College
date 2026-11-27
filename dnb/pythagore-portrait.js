/* V1.32 : portrait original de Pythagore. Déformation douce par maillage continu,
   mains immobiles, aucun changement de sprite. Repli vers le dessin vectoriel. */
(function(root){
'use strict';
let image=null,ready=false,layer=null;
if(typeof Image==='function'){image=new Image();image.onload=()=>{ready=true};image.onerror=()=>{ready=false};image.src='pythagore-portrait.webp?v=132'}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function smooth(a,b,x){let u=clamp((x-a)/(b-a),0,1);return u*u*(3-2*u)}
// The bottom 35% (hands) is fixed. Head moves gently around the shoulders.
function point(x,y,o){
 let p=o.pose||{},head=1-smooth(.34,.62,y),body=1-smooth(.45,.65,y);
 let shift=(p.tilt||0)*.31,vertical=(p.nod||0)*.0015;
 let px=x+head*(shift*(1-y)*2+(p.gaze||0)*.0008);
 let py=y+head*(vertical+(x-.5)*shift*.5)+body*(o.breath||0)*.002;
 // Local, deliberately subtle lower-lip and jaw motion, not phoneme lip sync.
 let mouthX=.51,mouthY=.273;
 let weight=y<.65?Math.exp(-(((x-mouthX)/.083)**2+((y-mouthY)/.037)**2)):0;
 py+=Math.max(0,o.mouth||0)*weight*.004;
 return [px,py]
}
function triangle(c,img,s0,s1,s2,d0,d1,d2){
 const a=s1[0]-s0[0],b=s1[1]-s0[1],d=s2[0]-s0[0],e=s2[1]-s0[1],det=a*e-b*d;
 if(Math.abs(det)<1e-10)return;
 const x=d1[0]-d0[0],y=d1[1]-d0[1],X=d2[0]-d0[0],Y=d2[1]-d0[1];
 let A=(x*e-X*b)/det,B=(y*e-Y*b)/det,C=(X*a-x*d)/det,D=(Y*a-y*d)/det,E=d0[0]-A*s0[0]-C*s0[1],F=d0[1]-B*s0[0]-D*s0[1];
 let center=[(d0[0]+d1[0]+d2[0])/3,(d0[1]+d1[1]+d2[1])/3];
 const expand=q=>{let dx=q[0]-center[0],dy=q[1]-center[1],l=Math.hypot(dx,dy)||1;return [q[0]+dx/l*.5,q[1]+dy/l*.5]};
 let q=[d0,d1,d2].map(expand);
 c.save();c.beginPath();c.moveTo(...q[0]);c.lineTo(...q[1]);c.lineTo(...q[2]);c.closePath();c.clip();c.transform(A,B,C,D,E,F);c.drawImage(img,0,0);c.restore();
}
function draw(c,o){
 if(!ready||!image.naturalWidth)return root.AstreonSage.draw(c,o);
 let w=150*(o.scale||1),h=w*image.naturalHeight/image.naturalWidth;
 c.save();c.translate((o.x||0)-w/2,(o.y||0)-h*.52);
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 if(!o.animate){c.drawImage(image,0,0,w,h);c.restore();return}
 // Small continuous mesh, composed in a transparent buffer. Fixed lower half.
 if(!layer){layer=document.createElement('canvas')}
 let pw=Math.ceil(w+24),ph=Math.ceil(h+24);
 if(layer.width!==pw||layer.height!==ph){layer.width=pw;layer.height=ph}
 let g=layer.getContext('2d');g.clearRect(0,0,pw,ph);g.save();g.translate(12,12);
 g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 const xs=[0,.30,.43,.49,.55,.63,.76,1],ys=[0,.15,.23,.27,.31,.39,.53,.65];
 const S=(x,y)=>[x*image.naturalWidth,y*image.naturalHeight],T=(x,y)=>{let p=point(x,y,o);return [p[0]*w,p[1]*h]};
 for(let j=0;j<ys.length-1;j++)for(let i=0;i<xs.length-1;i++){
 let x=xs[i],X=xs[i+1],y=ys[j],Y=ys[j+1];
 let a=S(x,y),b=S(X,y),d=S(x,Y),e=S(X,Y),A=T(x,y),B=T(X,y),D=T(x,Y),E=T(X,Y);
 triangle(g,image,a,b,e,A,B,E);triangle(g,image,a,e,d,A,E,D)
 }
 let cut=Math.round(image.naturalHeight*.65),ratio=cut/image.naturalHeight;
 g.drawImage(image,0,cut,image.naturalWidth,image.naturalHeight-cut,0,h*ratio,w,h*(1-ratio));
 g.restore();c.drawImage(layer,-12,-12);c.restore()
}
root.AstreonPortrait=Object.freeze({draw,point,isReady:()=>ready});
})(globalThis);
