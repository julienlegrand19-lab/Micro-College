/* Clairval, original hand-drawn-style tile world, cached at load. */
(function(root){
'use strict';
const E=root.ClairvalEngine,T=E.T;
function map(c,unlocked){
 const w=E.W*T,h=E.H*T;
 const rect=(x,y,a,b,f)=>{c.fillStyle=f;c.fillRect(x,y,a,b)};
 const ell=(x,y,rx,ry,f)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=f;c.fill()};
 const poly=(p,f,s)=>{c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=f;c.fill();if(s){c.strokeStyle=s;c.lineWidth=1.5;c.stroke()}};
 const line=(x,y,X,Y,s,width=1)=>{c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.strokeStyle=s;c.lineWidth=width;c.lineCap='round';c.stroke()};
 const grad=(x,y,X,Y,...a)=>{let g=c.createLinearGradient(x,y,X,Y);a.forEach((v,i)=>g.addColorStop(i/(a.length-1),v));return g};
 rect(0,0,w,h,grad(0,0,w,h,'#c7df8a','#a7c980','#d2dd9c'));
 for(let i=0;i<1700;i++){let x=E.hash(i+'x')%w,y=E.hash(i+'y')%h;ell(x,y,1+i%3,.9+i%2,['#7ba85f55','#f0edb788','#a5b66e66'][i%3]);if(i%13===0){line(x,y,x-2,y-5,'#65984f80');line(x,y,x+3,y-6,'#65984f80');ell(x+3,y-6,1.8,1.8,['#ffe8a5','#f2d3e2','#f6f7df'][i%3])}}
 // Paths, village square, eastern gardens.
 const road=(p,width=32)=>{c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle='#a8a876';c.lineWidth=width+7;c.lineJoin='round';c.lineCap='round';c.stroke();c.strokeStyle='#e2d4a9';c.lineWidth=width;c.stroke();c.strokeStyle='#eadbb8';c.lineWidth=width-10;c.stroke()};
 road([[20,420],[430,420]]);road([[180,260],[180,420],[180,550]]);road([[340,260],[340,420]]);road([[260,420],[260,600]]);
 road([[520,420],[1010,420]]);road([[700,260],[700,420],[620,420],[620,700]]);road([[900,300],[900,420],[860,420],[860,700]]);
 rect(115,350,195,132,'#d7cba7');for(let y=354;y<482;y+=13)for(let x=118;x<307;x+=22)rect(x+((y%2)*7),y,19,10,'#e5d8b7');
 // River, banks and water glints.
 rect(11*T-6,0,2*T+12,h,'#88a46e');rect(11*T,0,2*T,h,grad(440,0,520,0,'#5ea5a8','#8bd1cd','#53a5b2'));
 for(let i=0;i<110;i++){let x=448+E.hash(i+'water')%65,y=E.hash(i+'r')%h;line(x,y,x+9+i%9,y,'#d8f8e9a0',1.2)}
 if(unlocked){rect(432,360,96,80,'#8e6849');for(let x=432;x<528;x+=9){rect(x,364,8,72,grad(x,365,x+8,430,'#e4b47b','#b58a57'));line(x,365,x,435,'#805e47',.8)}line(432,363,528,363,'#70513b',5);line(432,437,528,437,'#70513b',5);for(let x of [434,470,510,526])for(let y of [363,437])ell(x,y,3,3,'#76563f')}
 else{for(let x of [423,435,516,528]){rect(x,370,7,60,'#866448');line(x-8,380,x+15,412,'#b17f53',6)}line(438,394,456,406,'#bd8d5f',7);line(505,409,520,394,'#bd8d5f',7)}
 // Fountain.
 ell(260,380,29,25,'#919d86');ell(260,378,26,22,'#d9ddd0');ell(260,378,21,17,'#70bdc5');ell(260,378,9,7,'#c1d5d0');line(260,377,260,361,'#e4f8e8',3);ell(260,360,3,3,'#efffff');
 // Houses with roofs, eaves, masonry, windows and doors.
 for(let s of E.sites){if(!s.building)continue;let [a,b,n,m]=s.building,x=a*T+3,y=b*T+4,bw=n*T-6,bh=m*T-9;
 ell(x+bw/2,y+bh+4,bw*.55,13,'#53684a35');rect(x+7,y+24,bw-14,bh-24,grad(x,y,x+bw,y,'#d6c6a0','#f2e3bf','#c6b494'));rect(x+6,y+bh-7,bw-12,7,'#998d75');
 for(let i=0;i<Math.floor(bw/44);i++){let wx=x+19+i*44,wy=y+bh-36;rect(wx-3,wy-3,22,25,'#8d765a');rect(wx,wy,16,19,'#7ba9b7');line(wx+8,wy,wx+8,wy+19,'#f1dfb8',2);line(wx,wy+9,wx+16,wy+9,'#f1dfb8',2)}
 let roofY=y+3,rh=bh*.62;poly([[x-5,roofY+rh],[x+bw/2,roofY-12],[x+bw+5,roofY+rh],[x+bw-4,roofY+rh+7],[x+5,roofY+rh+7]],grad(x,roofY,x+bw,roofY+rh,s.color,'#495f68'),'#52615a');
 for(let j=1;j<6;j++){let v=j/6;line(x+bw/2-(bw/2+5)*v,roofY-12+(rh+12)*v,x+bw/2+(bw/2+5)*v,roofY-12+(rh+12)*v,'#e6debf50',1.6)}
 line(x+bw/2,roofY-12,x+bw/2,roofY+rh+6,'#e4d7b17a',2);
 let dx=s.x*T+20;rect(dx-10,y+bh-28,20,28,'#66574a');rect(dx-6,y+bh-23,12,23,'#9b7955');ell(dx+4,y+bh-12,1.7,1.7,'#f2d596');
 if(s.id==='stars'){ell(x+bw/2,y+rh*.6,34,27,'#c1d8e0');line(x+bw/2,y+rh*.6,x+bw/2+43,y+rh*.6-35,'#d5bb78',10)}
 if(s.id==='forge'){rect(x+bw-39,y+15,23,37,'#a88168');rect(x+bw-43,y+10,31,9,'#795d52');for(let i=0;i<3;i++)ell(x+bw-28+i*7,y+3-i*8,9+i*3,5+i*2,'#dce4d06a')}
 if(s.id==='mirror'){poly([[x+bw/2,y-22],[x+bw/2+13,y+1],[x+bw/2,y+24],[x+bw/2-13,y+1]],'#e4cef2','#a395c9')}
 if(s.id==='robot'){rect(x+bw-35,y+18,20,29,'#668b96');ell(x+bw-25,y+18,10,10,'#b4d7df')}
 // hanging sign by the door
 rect(dx+14,y+bh-38,4,30,'#775f43');rect(dx+13,y+bh-37,25,17,'#eccd8e');rect(dx+15,y+bh-35,21,13,s.color);
 }
 for(let [a,b] of E.trees){let x=a*T+20,y=b*T+20;ell(x+5,y+9,23,14,'#5c78404d');rect(x-4,y-4,8,21,'#8d6a46');ell(x,y-8,20,20,'#50845a');ell(x-9,y-9,14,15,'#6fa466');ell(x+6,y-15,15,14,'#81b574');ell(x-5,y-20,12,9,'#9ac67e');ell(x+7,y-6,13,13,'#63965d')}
 // Flower beds, crates and wooden fences without blocking walkable routes.
 for(let [x,y] of [[85,315],[380,315],[566,245],[960,345],[782,685],[568,688]]){ell(x,y,17,8,'#718f4d70');for(let j=0;j<5;j++)ell(x-12+j*6,y-4+(j%2)*3,3,3,['#e8c1d7','#fcdf8e','#f2f1ca'][j%3])}
}
root.ClairvalArt=Object.freeze({map});
})(globalThis);