/* Décors vectoriels originaux : aucune ressource externe. */
function arcadeScene(id,p=0){
 p=Math.max(0,Math.min(1,Number(p)||0));
 const palettes={lift:['#142b46','#3c8298','#7ff7df'],bridge:['#162f46','#8a577e','#f9cb82'],robot:['#202842','#33526e','#ffc36b'],division:['#111e49','#3e427b','#b7a0ff'],galaxy:['#171d48','#54407f','#6debe8'],memory:['#302244','#694768','#ffd3a5'],operator:['#133b43','#326569','#acf4ad'],vault:['#1c293b','#655246','#ffd078'],maze:['#132b35','#355a60','#8de4df'],boss:['#372338','#924b51','#ffad77'],hero:['#132b46','#514878','#8cf9e2']};
 const [bg,mid,light]=palettes[id]||palettes.hero;
 const R=(x,y,w,h,c,rx=0,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+c+'" '+extra+'/>';
 const C=(x,y,r,c,extra='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" '+extra+'/>';
 const P=(d,c,stroke='',w=1,extra='')=>'<path d="'+d+'" fill="'+c+'" '+(stroke?'stroke="'+stroke+'" stroke-width="'+w+'" ':'')+extra+'/>';
 const L=(x,y,X,Y,c,w=2)=>'<path d="M'+x+' '+y+'L'+X+' '+Y+'" stroke="'+c+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>';
 const T=(x,y,s,c='#fff',size=18)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="'+size+'" fill="'+c+'">'+s+'</text>';
 const group=(s,transform='',cl='')=>'<g '+(transform?'transform="'+transform+'" ':'')+(cl?'class="'+cl+'"':'')+'>'+s+'</g>';
 let s=R(0,0,640,260,bg);
 for(let i=0;i<70;i++){let x=(i*83+17)%640,y=(i*53+11)%180;s+=R(x,y,i%7===0?3:1,i%7===0?3:1,i%3===0?light:'#a9b9db',0,'opacity="'+(i%7===0?.8:.27)+'"')}
 const hills=()=>P('M0 196L72 118 130 159 192 88 277 180 341 116 432 164 515 92 640 182V260H0Z',mid,'',1,'opacity=".6"')+P('M0 229L82 177 174 211 265 156 351 214 461 165 550 200 640 149V260H0Z','#142538');
 const floor=()=>R(0,215,640,45,'#101a2c')+R(0,215,640,3,light,0,'opacity=".6"')+Array.from({length:12},(_,i)=>L(i*60-25,215,i*80-80,260,mid,1)).join('')+L(0,240,640,240,mid,1);
 const spark=(x,y)=>P('M'+x+' '+(y-9)+'l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z',light);
 const ship=(x,y,k=1)=>group(P('M0 -44L24 -11 23 24 12 35H-12L-23 24-24-11Z','#e3f3fa','#7dd9ed',3)+P('M-20 6L-39 35-15 26M20 6L39 35 15 26','#688bc7')+C(0,-10,11,'#274569')+C(-3,-13,5,'#94f8fa')+P('M-9 35L0 62 9 35Z','#ffb66b','',1,'class="arc-thrust"'), 'translate('+x+' '+y+') scale('+k+')','arc-float');
 const crystal=(x,y,k=1)=>group(P('M0 -35L24 -7 12 29-12 29-24-7Z',light,'#e3fffb',2)+P('M0 -35L0 29-24-7Z',mid)+P('M0 -35L24-7 0 3Z','#e4fffc','',1,'opacity=".6"'),'translate('+x+' '+y+') scale('+k+')','arc-float');
 if(id==='lift'){
  s+=R(30,22,580,205,'#1b2b3e',7,'stroke="#52758a" stroke-width="3"');
  for(let j=0;j<5;j++){let y=35+j*36;s+=R(52,y,536,29,'#233e55',2)+R(59,y+5,86,18,'#101f32',2)+T(102,y+19,['+2','+1','0','−1','−2'][j],light,15)+L(156,y+28,578,y+28,'#6c91a2',2)+R(470,y+5,100,19,'#4a7483',2)+R(483,y+8,12,10,'#f5c67c')+R(511,y+8,12,10,'#f5c67c')+R(539,y+8,12,10,'#f5c67c')}
  s+=R(239,25,162,198,'#101a2a',3)+L(250,25,250,222,'#537187',5)+L(390,25,390,222,'#537187',5);
  const y=48+Math.round(p*4)*31;
  s+=group(R(260,y,120,50,'#6f92a6',5,'stroke="#b7e3ee" stroke-width="2"')+R(267,y+8,106,35,'#18394d',3)+R(319,y+8,2,35,light)+R(277,y+14,34,20,'#66b7b9',2)+R(330,y+14,34,20,'#66b7b9',2)+C(367,y+5,3,light),'','arc-lift')+floor();
 }else if(id==='bridge'){
  s+=hills()+P('M0 136H155L210 260H0Z','#344c56')+P('M640 136H485L430 260H640Z','#344c56')+P('M0 136H155L170 154H0ZM640 136H485L470 154H640Z','#a0c18c');
  s+=P('M160 160Q320 242 480 160','none','#bda28a',4)+L(164,118,164,181,'#c39e72',7)+L(476,118,476,181,'#c39e72',7);
  for(let i=0;i<12;i++){const x=168+i*25,y=164+Math.sin(i/11*Math.PI)*34;s+=L(x,151+Math.sin(i/11*Math.PI)*32,x,y+16,'#876a5f',2)+R(x,y,22,12,i<Math.floor(12*p)?light:'#a57e62',2)}
  s+=C(102,111,12,'#f6c68e')+R(89,124,26,26,'#5a8cb7',5)+P('M89 109L102 91 115 109Z','#f2d486')+spark(519,100);
 }else if(id==='robot'){
  s+=R(20,24,600,190,'#26354b',9,'stroke="#52627c" stroke-width="3"');
  for(let i=0;i<8;i++){let x=44+i*77;s+=R(x,42,60,38,'#162a3a',4)+R(x+7,49,46,7,i<p*8?light:'#476276',2)+L(x+30,80,x+30,110,'#456276',2)}
  s+=floor()+R(213,194,214,21,'#54647b',4)+group(R(252,106,136,78,'#879cad',12,'stroke="#c7d6df" stroke-width="3"')+R(274,118,92,38,'#182b41',5)+Array.from({length:6},(_,i)=>R(282+i*13,129,10,16,i<p*6?light:'#536a7e',2)).join('')+R(270,53,100,59,'#9dafbc',12)+R(282,65,76,30,'#182b41',5)+C(303,79,7,light)+C(337,79,7,light)+L(320,53,320,37,'#b5c8d7',4)+C(320,34,7,light)+P('M250 120L219 142 209 177 226 183 239 153 260 142Z','#7790a8')+P('M390 120L421 142 431 177 414 183 401 153 380 142Z','#7790a8')+R(274,177,25,22,'#617991',4)+R(341,177,25,22,'#617991',4),'','arc-float');
 }else if(id==='division'){
  s+=C(535,63,52,'#594e83')+P('M490 54Q535 17 580 55M487 71Q535 38 585 71','none','#967cb2',5)+P('M0 225Q150 177 302 229T640 210V260H0Z','#26395a');
  s+=group(R(292,93,56,67,'#d1d9ee',7,'stroke="#869bc2" stroke-width="3"')+R(180,96,105,56,'#31558b',2,'stroke="#87b2e2" stroke-width="2"')+R(355,96,105,56,'#31558b',2,'stroke="#87b2e2" stroke-width="2"')+Array.from({length:5},(_,i)=>L(188+i*21,97,188+i*21,151,'#95b7e3',1)+L(363+i*21,97,363+i*21,151,'#95b7e3',1)).join('')+L(180,124,285,124,'#9dbee3',1)+L(355,124,460,124,'#9dbee3',1)+P('M294 88Q320 46 346 88Z','#dce4ef')+L(320,88,320,57,light,3)+C(320,56,5,light)+C(320,128,13,'#3a597c')+C(320,128,5,light),'','arc-float');
  for(let i=0;i<6;i++)s+=P('M'+(258-i*15)+' '+(52-i*5)+'Q320 '+(12-i*7)+' '+(382+i*15)+' '+(52-i*5),'none',light,2,'opacity="'+(i<p*6?.85:.12)+'"');
 }else if(id==='galaxy'){
  s+=C(500,72,64,'#584b90')+P('M438 80Q500 37 563 76','none','#b6a0e7',7)+C(110,57,25,'#3f8da2')+ship(320,92,1.1);
  ['+','−','0'].forEach((n,i)=>{const x=145+i*175,c=['#76e5b7','#ff94b0','#91baff'][i];s+=C(x,188,44,'#1b2846','stroke="'+c+'" stroke-width="6"')+C(x,188,34,'#293b62','stroke="'+c+'" stroke-width="2"')+T(x,202,n,c,40)});
 }else if(id==='memory'){
  s+=R(20,22,600,216,'#513a52',14,'stroke="#c49d81" stroke-width="4"')+R(30,32,580,196,'#322940',10,'stroke="#795e79" stroke-width="2"');
  for(let i=0;i<8;i++){let x=106+(i%4)*112,y=51+Math.floor(i/4)*87,opened=i<Math.round(p*8);s+=group(R(x,y,91,75,opened?'#f2dcb5':'#78577e',7,'stroke="'+(opened?'#ffebbd':'#bba0bc')+'" stroke-width="2"')+R(x+6,y+6,79,63,opened?'#fff0cf':'#493651',5)+T(x+45,y+49,opened?['+','−','×','÷'][i%4]:'✦',opened?'#72505c':light,32),'','arc-card')}
 }else if(id==='operator'){
  s+=R(26,20,588,208,'#1c444c',10,'stroke="#60928b" stroke-width="3"')+floor();
  const cols=['#86d9aa','#74b9d3','#e6b971','#c6a0df'];
  ['+','−','×','÷'].forEach((n,i)=>{const x=92+i*124;s+=group(R(x,72,100,100,cols[i],12,'stroke="#c9f0d8" stroke-width="2"')+C(x+50,72,16,cols[i])+C(x+100,122,14,bg)+T(x+49,137,n,'#153b45',48),'','arc-puzzle')});
  s+=spark(300,41)+spark(348,192);
 }else if(id==='vault'){
  s+=R(22,20,596,218,'#39404b',6,'stroke="#7c776d" stroke-width="3"')+R(54,38,532,187,'#232d3a',6,'stroke="#a18b69" stroke-width="4"')+R(92,49,260,165,'#8d795e',8,'stroke="#d6bf90" stroke-width="3"')+R(104,61,236,141,'#45505b',6)+C(222,131,58,'#29333f','stroke="#b4a486" stroke-width="7"')+C(222,131,18,'#c8b798','stroke="#e3d8ba" stroke-width="3"');
  for(let i=0;i<6;i++){const a=i*Math.PI/3;s+=L(222+Math.cos(a)*20,131+Math.sin(a)*20,222+Math.cos(a)*49,131+Math.sin(a)*49,'#c3ad87',7)}
  s+=R(382,67,154,122,'#171f2b',7,'stroke="#a69b84" stroke-width="3"');for(let i=0;i<8;i++){let x=395+i*16;s+=R(x,83,13,19,i<p*8?light:'#52616b',2)}
  for(let i=0;i<12;i++){let x=402+i%3*41,y=111+Math.floor(i/3)*17;s+=R(x,y,31,12,'#566575',2)}
 }else if(id==='maze'){
  s+=P('M0 0H640V260H0Z','#1b343c')+P('M0 0L160 68H480L640 0V260L480 195H160L0 260Z','#2f4d55')+P('M160 68H480V195H160Z','#1a2c38');
  for(let i=0;i<8;i++)s+=L(0,i*36,160,68+i*18,'#577179',2)+L(640,i*36,480,68+i*18,'#577179',2);
  for(let i=0;i<3;i++){const x=183+i*95;s+=P('M'+x+' 192V112Q'+(x+39)+' 66 '+(x+78)+' 112V192Z','#b18c69','#d0b698',3)+P('M'+(x+8)+' 192V115Q'+(x+39)+' 80 '+(x+70)+' 115V192Z','#38545d')+C(x+59,153,4,light)}
  s+=P('M160 195H480L640 260H0Z','#344f55')+L(320,195,320,260,'#84a7a1',2)+crystal(320,222,.42)+spark(320,49);
 }else if(id==='boss'){
  s+=hills()+P('M0 230L64 145 104 215 160 164 220 230 420 230 495 164 560 215 600 145 640 230V260H0Z','#382e42');
  s+=group(P('M302 120Q200 32 127 54L165 97 141 131 214 114 255 155Z','#b65d72','#f29b96',3)+P('M338 120Q440 32 513 54L475 97 499 131 426 114 385 155Z','#b65d72','#f29b96',3)+P('M278 174Q236 207 172 185Q205 229 293 205Z','#905368')+C(320,164,65,'#a95d70','stroke="#e2a199" stroke-width="3"')+P('M279 143Q320 122 361 143L349 194H291Z','#e2a78b')+P('M276 105L261 65 294 86 346 86 379 65 364 105Z','#ddad8c')+R(263,89,114,67,'#b96978',25,'stroke="#f1ada1" stroke-width="3"')+C(289,117,10,'#fff0b7')+C(351,117,10,'#fff0b7')+C(292,118,4,'#382d45')+C(348,118,4,'#382d45')+P('M299 138Q320 151 341 138','none','#593849',3)+R(278,207,33,17,'#a95d70',8)+R(329,207,33,17,'#a95d70',8),'','arc-float');
  s+=crystal(320,228,.35+.45*p);
 }else{
  s+=hills()+C(510,72,55,'#635b99')+ship(160,105,.85)+crystal(320,128,1.35)+group(R(416,107,88,76,'#758da5',10)+R(427,118,66,31,'#1b3650',5)+C(443,133,6,light)+C(477,133,6,light)+L(460,107,460,91,light,3)+C(460,87,5,light),'','arc-float')+floor();
  for(let i=0;i<4;i++)s+=spark(265+i*36,40+(i%2)*23);
 }
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" aria-hidden="true" focusable="false">'+s+'</svg>';
}
