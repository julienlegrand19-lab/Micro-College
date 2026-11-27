/* V1.21 - six distinct, brighter painted-vector landscapes. Cached by the caller. */
(function(root){
'use strict';
const palettes=[
 ['#72bada','#dbf3ee','#427b91','#60a693','#d1d49a'],
 ['#79b9dd','#e9f4f4','#6f91aa','#a3b7c1','#e6ded0'],
 ['#89c7dc','#ffe0ac','#c68c57','#c9a06a','#f0c98c'],
 ['#6579b6','#f3c1a8','#687daa','#8597b3','#e5c7a6'],
 ['#89aeb6','#f4ddb1','#8c8f76','#a9a487','#d1b58a'],
 ['#8caacb','#eee1ed','#9887b3','#a9aac8','#d6c6e7']
];
function landscape(c,w){
 const [sky,horizon,far,mid,ground]=palettes[w],W=840,H=320;
 const G=(x,y,X,Y,...stops)=>{let g=c.createLinearGradient(x,y,X,Y);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g};
 const P=(a,fill,stroke=null,width=1)=>{c.beginPath();a.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}};
 const R=(x,y,w,h,fill)=>{c.fillStyle=fill;c.fillRect(x,y,w,h)};
 const E=(x,y,rx,ry,col)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=col;c.fill()};
 const L=(x,y,X,Y,col,width=1)=>{c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.strokeStyle=col;c.lineWidth=width;c.stroke()};
 const pillar=(x,y,h,s=24)=>{R(x,y,s,h,G(x,y,x+s,y,'#b8b8b1','#f5e5c7','#81949d'));R(x-4,y-5,s+8,7,'#e2d4b8');R(x-4,y+h-5,s+8,7,'#9b9e96');for(let j=7;j<s;j+=7)L(x+j,y+3,x+j,y+h-7,'#89999970')};
 c.save();R(0,0,W,H,G(0,0,0,H,sky,horizon));let sun=c.createRadialGradient(665,57,8,665,57,93);sun.addColorStop(0,'#fff6d8');sun.addColorStop(.33,'#fff0cda0');sun.addColorStop(1,'#fff0cd00');R(565,-43,200,200,sun);E(665,57,25,25,'#fff5d5');
 for(let i=0;i<7;i++){let x=40+i*137,y=33+(i*19)%53;E(x,y,56,8,'#ffffff45');E(x+18,y-5,33,9,'#ffffff42')}
 if(w===3)for(let i=0;i<30;i++)E((i*97+19)%W,(i*39+8)%125,1.3,1.3,'#fff7ddbb');
 for(let i=-1;i<8;i++){let x=i*139,y=112+(i*31+91)%55;P([[x-90,238],[x,y],[x+36,y-25],[x+125,238]],far);if(w===1)P([[x-25,y+35],[x,y],[x+36,y-25],[x+67,y+37],[x+35,y+19],[x+18,y+28],[x,y+14]],'#eef4f4')}
 for(let i=-1;i<7;i++){let x=i*170,y=169+(i*43+150)%50;P([[x-60,260],[x,y],[x+55,y-17],[x+180,260]],mid)}
 if(w===0){
 R(0,211,W,109,G(0,211,0,320,'#95d9dd','#3a929f'));for(let i=0;i<32;i++){let x=(i*89)%W,y=220+(i*19)%94;L(x,y,x+25+i%5*11,y,'#e2fbec9a',1.3)}
 for(let i=0;i<4;i++){let x=65+i*229,y=125+(i%2)*35;P([[x-67,y],[x-24,y-18],[x+67,y-7],[x+48,y+24],[x+5,y+62],[x-35,y+37]],G(x,y-20,x,y+65,'#8dc69c','#598c76','#53677a'));P([[x-67,y],[x-24,y-18],[x+67,y-7],[x+41,y+11],[x-40,y+11]],'#a7cc83');for(let j=0;j<3;j++)L(x+16+j*10,y+13,x+9+j*10,y+47,'#d3faf2',2)}
 }else if(w===1){
 for(let i=0;i<7;i++)pillar(252+i*52,131,112,23);P([[231,131],[420,47],[610,131]],G(260,50,550,140,'#f4e3c9','#a8b7c2'),'#879ba9',1.5);P([[250,129],[420,62],[590,129]],null||'#dbe7e7');L(244,131,599,131,'#fbedd5',5);R(239,242,364,11,'#dedfd5');R(218,253,404,8,'#aebfc6');
 }else if(w===2){
 for(let i=0;i<3;i++){let x=45+i*213;P([[x,245],[x+111,78+(i%2)*33],[x+222,245]],'#deb378');P([[x+111,78+(i%2)*33],[x+222,245],[x+145,245]],'#ad7951')}
 for(let i=0;i<4;i++)pillar(510+i*54,143,100,27);R(494,131,208,12,'#e8c28c');P([[488,131],[598,91],[710,131]],'#ecc998');for(let i=0;i<6;i++)L(520+i*30,135,520+i*30,142,'#9d734d',2)
 }else if(w===3){
 for(let i=0;i<3;i++){let x=125+i*250,y=137+(i%2)*30;R(x,y,92,109,G(x,y,x+92,y,'#9aabc6','#e1d8dd','#8995b5'));c.beginPath();c.arc(x+46,y,46,Math.PI,0);c.fillStyle=G(x,y-45,x+90,y,'#c8d6ed','#778eae');c.fill();L(x+44,y-14,x+90,y-59,'#e3cf9f',10);L(x+44,y-14,x+90,y-59,'#f4e6be',4);R(x+38,y+45,16,40,'#6b80a1')}
 }else if(w===4){
 for(let i=0;i<5;i++){let x=55+i*170;R(x,136,135,114,G(x,136,x+135,250,'#b0a18a','#c8b99a','#777e76'));P([[x-7,136],[x+67,88],[x+142,136]],'#8b6857');R(x+30,100,20,37,'#9e7a63');E(x+67,191,25,25,'#d4a266');for(let j=0;j<12;j++){let a=j*Math.PI/6;L(x+67+Math.cos(a)*22,191+Math.sin(a)*22,x+67+Math.cos(a)*30,191+Math.sin(a)*30,'#735e47',6)}E(x+67,191,14,14,'#89775c')}
 }else{
 for(let i=0;i<7;i++){let x=28+i*125,y=116+(i%3)*25;P([[x-20,252],[x-24,y+42],[x,y],[x+24,y+42],[x+20,252]],G(x-24,y,x+24,252,'#d7e3ef','#afabd1','#7e94b9'),'#f7f0ff',1);L(x,y,x,252,'#f6e8ff',2)}
 P([[300,253],[300,145],[420,65],[540,145],[540,253]],G(300,65,540,253,'#ddd4eb','#aeacce','#8886ae'),'#eee4f6',3);E(420,175,48,68,'#90a8d1');E(420,175,42,61,'#cfd9ef')
 }
 R(0,253,W,67,G(0,253,0,320,ground,'#87928e'));L(0,253,W,253,'#f5e6bf',2);
 for(let i=0;i<22;i++){let x=i*43;L(x,255,x-13,320,'#637c7c40');}for(let y of [277,305])L(0,y,W,y,'#637c7c40');
 for(let i=0;i<42;i++){let x=(i*71+17)%W,y=259+(i*23)%58;E(x,y,1.5,1,'#f4e7ca88')}
 c.restore()
}
root.AstreonDaylight=Object.freeze({landscape,palettes});
})(globalThis);