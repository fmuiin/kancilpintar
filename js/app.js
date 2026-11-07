/* Kancil Pintar: logika layar dan tiga permainan.
   Bagian: simpanan, layar, efek, komponen soal, lalu Petualangan, Tebak Gambar, Cari Pasangan. */
import { $, $$, rand, oneOf, shuffle, h, reduce } from './utils.js';
import { NUM, PRAISE, WORDS, LETTERS, COUNT_ITEMS, STOPS } from './data.js';
import { STAR, ICON_HOME, ICON_ON, ICON_OFF, KANCIL } from './art.js';
import { settings, ctx, sfx, say, stopVoice } from './audio.js';

/* ---------- penyimpanan ringan ---------- */
let stars=0;
try{settings.sound=localStorage.getItem('kp-sound')!=='off';stars=parseInt(localStorage.getItem('kp-stars'),10)||0}catch(e){}
let name='';
try{name=localStorage.getItem('kp-name')||''}catch(e){}
function save(){try{localStorage.setItem('kp-sound',settings.sound?'on':'off');localStorage.setItem('kp-stars',String(stars))}catch(e){}}
function addStars(n){stars+=n;save();paintHome()}
function paintHome(){
  $('#starCount').textContent=stars;
  $('#heroSub').textContent=name?'Halo, '+name+'! Ayo belajar!':'Ayo belajar huruf dan angka!';
  $('#renameBtn').textContent=name?'Ganti nama':'Isi nama';
  $('#soundBtn').innerHTML=settings.sound?ICON_ON:ICON_OFF;
  $('#soundBtn').setAttribute('aria-label',settings.sound?'Matikan suara':'Nyalakan suara');
}

/* ---------- waktu dan layar ---------- */
let timers=[];
function later(fn,ms){const t=setTimeout(()=>{timers=timers.filter(x=>x!==t);fn()},ms);timers.push(t);return t}
function clearTimers(){timers.forEach(clearTimeout);timers=[]}
let replayFn=null;
function show(id){
  clearTimers();closeOverlay();replayFn=null;
  stopVoice();
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
}
function goHome(){show('home');paintHome()}

/* ---------- efek ---------- */
const COLORS=['#FFC83D','#D9435A','#238A5A','#59B8E0'];
function burst(el){
  if(reduce||!el.animate)return;
  const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(let i=0;i<12;i++){
    const p=h('i','spark');p.style.left=cx+'px';p.style.top=cy+'px';p.style.background=COLORS[i%4];
    document.body.appendChild(p);
    const a=Math.random()*Math.PI*2,d=50+Math.random()*70;
    const an=p.animate([
      {transform:'translate(-50%,-50%) scale(1)',opacity:1},
      {transform:'translate(calc(-50% + '+Math.cos(a)*d+'px), calc(-50% + '+Math.sin(a)*d+'px)) scale(.3)',opacity:0}
    ],{duration:700,easing:'ease-out'});
    an.onfinish=()=>p.remove();
  }
}
function rain(){
  if(reduce||!document.body.animate)return;
  const ov=$('#ov');
  for(let i=0;i<30;i++){
    const p=h('i','conf');p.style.left=(Math.random()*100)+'%';p.style.top='-20px';p.style.background=COLORS[i%4];
    ov.appendChild(p);
    const an=p.animate([
      {transform:'translateY(0) rotate(0deg)'},
      {transform:'translateY('+(window.innerHeight+40)+'px) rotate('+(360+Math.random()*360)+'deg)'}
    ],{duration:2200+Math.random()*1800,delay:Math.random()*600,easing:'linear',fill:'forwards'});
    an.onfinish=()=>p.remove();
  }
}
function closeOverlay(){
  const ov=$('#ov');ov.hidden=true;
  $$('#ov .conf').forEach(n=>n.remove());
}
function showOverlay(o){
  $('#ovTitle').textContent=o.title;
  $('#ovSub').textContent=o.sub||'';
  $('#ovStars').innerHTML=o.stars?STAR+'<b>+'+o.stars+'</b> bintang':'';
  const it=$('#ovItems');it.innerHTML='';it.hidden=!o.reveal;
  $('#ovAgain').onclick=()=>{ctx();o.again()};
  $('#ovHome').onclick=goHome;
  $('#ov').hidden=false;
  sfx.win();rain();
  later(()=>say(o.speak||o.title),350);
  if(o.reveal){
    const r=o.reveal,start=2300;
    for(let i=0;i<r.n;i++){
      const s=h('span','item','<span class="em">'+r.e+'</span><span class="badge">'+(i+1)+'</span>');
      s.style.opacity='0';it.appendChild(s);
      later(()=>{s.style.opacity='1';s.classList.add('counted');sfx.pop();say(NUM[i+1])},start+i*900);
    }
    later(()=>say(NUM[r.n]+' '+r.word+'! Hebat sekali!'),start+r.n*900);
  }
}

/* ---------- komponen soal ---------- */
function speakerEl(text,small){
  const d=h('div','speaker'+(small?' small':''),'<div class="kav">'+KANCIL+'</div><div class="bubble"></div>');
  d.querySelector('.bubble').textContent=text;
  return d;
}
function mountQuiz(root,q){
  root.innerHTML='';
  const sp=speakerEl(q.prompt);
  const vis=h('div','visual');vis.appendChild(q.visual);
  const ans=h('div','answers');
  const btns=[];let wrongs=0,locked=false;
  q.options.forEach(o=>{
    const b=h('button','ans',o.html);b.type='button';b.setAttribute('aria-label',o.label||'');
    b.addEventListener('click',()=>{
      if(locked)return;ctx();
      if(o.correct){
        locked=true;b.classList.add('right');ans.classList.add('done');
        sp.querySelector('.kav').classList.add('hop');
        sfx.ok();burst(b);say(oneOf(PRAISE)+(name&&Math.random()<.5?' '+name+'.':'')+' '+q.right);
        const first=wrongs===0;
        later(()=>q.onRight(first),1900);
      }else{
        wrongs++;b.classList.add('wrong');sfx.no();say('Coba lagi ya!');
        later(()=>b.classList.remove('wrong'),450);
        if(wrongs>=2)btns.forEach((x,i)=>{if(q.options[i].correct)x.classList.add('hint')});
      }
    });
    btns.push(b);ans.appendChild(b);
  });
  root.appendChild(sp);root.appendChild(vis);root.appendChild(ans);
  replayFn=()=>say(q.speak);
  later(()=>say(q.speak),350);
}
function countVisual(n,emoji){
  const wrap=h('div','items');let c=0;
  for(let i=0;i<n;i++){
    const b=h('button','item','<span class="em">'+emoji+'</span><span class="badge"></span>');
    b.type='button';b.setAttribute('aria-label','Hitung');
    b.addEventListener('click',()=>{
      if(b.classList.contains('counted'))return;
      ctx();c++;b.classList.add('counted');
      b.querySelector('.badge').textContent=c;sfx.pop();say(NUM[c]);
    });
    wrap.appendChild(b);
  }
  return wrap;
}
function numOptions(n,max){
  const s=[n];
  shuffle([n-2,n-1,n+1,n+2]).forEach(x=>{if(s.length<3&&x>=1&&x<=max&&s.indexOf(x)<0)s.push(x)});
  let k=1;while(s.length<3){if(s.indexOf(k)<0)s.push(k);k++}
  return shuffle(s).map(x=>({html:String(x),label:String(x),correct:x===n}));
}
function countQ(n){
  const it=oneOf(COUNT_ITEMS);
  return{
    prompt:'Ada berapa '+it.n+'? Ayo hitung!',
    speak:'Ayo hitung! Ada berapa '+it.n+'? Sentuh gambarnya satu satu.',
    visual:countVisual(n,it.e),
    options:numOptions(n,6),
    right:NUM[n]+'! Ada '+NUM[n]+' '+it.n
  };
}
function letterPicQ(){
  const w=oneOf(WORDS),used={},others=[];used[w.l]=true;
  shuffle(WORDS).forEach(x=>{if(others.length<2&&!used[x.l]){used[x.l]=true;others.push(x)}});
  return{
    prompt:'Mana yang diawali huruf '+w.l+'?',
    speak:'Huruf '+w.l+'. Mana gambar yang diawali huruf '+w.l+'?',
    visual:h('div','bigletter',w.l+'<span class="lo">'+w.l.toLowerCase()+'</span>'),
    options:shuffle([w].concat(others)).map(x=>({html:'<span class="em">'+x.e+'</span>',label:x.w,correct:x===w})),
    right:w.l+' untuk '+w.w
  };
}
function wordQ(w){
  const ls=shuffle(LETTERS.filter(l=>l!==w.l)).slice(0,2);
  return{
    prompt:w.w+' diawali huruf apa?',
    speak:'Ini '+w.w+'. '+w.w+' diawali huruf apa?',
    visual:h('div','pic','<span class="em">'+w.e+'</span><span class="word">'+w.w+'</span>'),
    options:shuffle([w.l].concat(ls)).map(l=>({html:l,label:l,correct:l===w.l})),
    right:w.l+' untuk '+w.w
  };
}

/* ---------- 1. Petualangan Kancil ---------- */
let advIdx=0;
function buildTrail(){
  const t=$('#trail');t.innerHTML='';
  STOPS.forEach(s=>t.appendChild(h('div','stop',s.e)));
  t.appendChild(h('div','marker',KANCIL));
  updateTrail(0);
}
function updateTrail(i){
  const t=$('#trail');
  t.style.setProperty('--p',String(i/(STOPS.length-1)));
  $$('#trail .stop').forEach((s,k)=>{s.classList.toggle('done',k<i);s.classList.toggle('now',k===i)});
}
function startAdv(){
  show('adv');advIdx=0;buildTrail();
  const scene=$('#advScene');scene.style.setProperty('--scene',STOPS[0].bg);scene.dataset.deco='🥒';
  $('#advChip').textContent='Mulai';
  const root=$('#advQuiz');root.innerHTML='';
  const text='Halo'+(name?', '+name:'')+'! Aku Kancil. Aku lapar. Ayo cari timun bersamaku!';
  const vis=h('div','visual','<div class="journey">'+STOPS.map(s=>'<span>'+s.e+'</span>').join('<s>›</s>')+'</div>');
  const go=h('button','btn leaf','Ayo Jalan!');go.type='button';
  go.addEventListener('click',()=>{ctx();sfx.pop();advStop()});
  root.appendChild(speakerEl(text));root.appendChild(vis);root.appendChild(go);
  replayFn=()=>say(text);
  later(()=>say(text),350);
}
function advStop(){
  const s=STOPS[advIdx];updateTrail(advIdx);
  const scene=$('#advScene');scene.style.setProperty('--scene',s.bg);scene.dataset.deco=s.e;
  $('#advChip').textContent=s.name;
  const q=s.type==='count'?countQ(rand(1,s.max)):letterPicQ();
  q.onRight=()=>{advIdx++;if(advIdx>=STOPS.length)advWin();else advStop()};
  mountQuiz($('#advQuiz'),q);
}
function advWin(){
  addStars(3);
  showOverlay({
    title:'Hore! Kancil dapat timun!',
    sub:'Terima kasih sudah membantu Kancil.',
    speak:'Hore'+(name?', '+name:'')+'! Kancil dapat timun!',
    stars:3,
    reveal:{e:'🥒',n:5,word:'timun'},
    again:startAdv
  });
}

/* ---------- 2. Tebak Gambar ---------- */
let tg=null;
function startTg(){
  show('tg');
  tg={i:0,good:0,words:shuffle(WORDS).slice(0,8),types:shuffle(['L','L','L','L','L','C','C','C'])};
  const d=$('#tgDots');d.innerHTML='';
  for(let i=0;i<8;i++)d.appendChild(h('i'));
  tgNext();
}
function tgNext(){
  if(tg.i>=8){tgEnd();return}
  $$('#tgDots i').forEach((d,k)=>{d.className=k<tg.i?'on':(k===tg.i?'now':'')});
  const q=tg.types[tg.i]==='L'?wordQ(tg.words[tg.i]):countQ(rand(1,5));
  q.onRight=first=>{if(first)tg.good++;tg.i++;tgNext()};
  mountQuiz($('#tgQuiz'),q);
}
function tgEnd(){
  $$('#tgDots i').forEach(d=>d.className='on');
  const earned=Math.max(1,tg.good);
  addStars(earned);
  showOverlay({
    title:'Hebat! '+tg.good+' dari 8 benar',
    sub:'Kancil senang sekali!',
    speak:'Hebat'+(name?', '+name:'')+'! Kamu menjawab '+NUM[tg.good]+' soal dengan benar pada percobaan pertama!',
    stars:earned,
    again:startTg
  });
}

/* ---------- 3. Cari Pasangan ---------- */
const MEM=[
  {pairs:3,cols:3,mode:'same'},
  {pairs:4,cols:4,mode:'same'},
  {pairs:4,cols:4,mode:'letter'}
];
let memLv=0;
function startMem(){
  show('mem');
  const L=MEM[memLv];
  let words=[];
  if(L.mode==='letter'){
    const seen={};
    shuffle(WORDS).forEach(w=>{if(words.length<L.pairs&&!seen[w.l]){seen[w.l]=true;words.push(w)}});
  }else{
    words=shuffle(WORDS).slice(0,L.pairs);
  }
  const cards=[];
  words.forEach((w,i)=>{
    cards.push({id:i,kind:'pic',w:w});
    cards.push({id:i,kind:L.mode==='letter'?'let':'pic',w:w});
  });
  $('#memTitle').textContent='Level '+(memLv+1);
  const msg=L.mode==='same'?'Cari dua gambar yang sama!':'Cocokkan gambar dengan huruf awalnya!';
  const sp=$('#memSpeaker');sp.innerHTML='';sp.appendChild(speakerEl(msg,true).children[0]);sp.appendChild(speakerEl(msg,true).children[1]);
  const grid=$('#mgrid');grid.innerHTML='';
  grid.style.setProperty('--cols',String(L.cols));
  grid.className='mgrid'+(L.cols===4?' c4':'');
  let first=null,busy=false,matched=0;
  shuffle(cards).forEach(c=>{
    const face=c.kind==='pic'
      ?'<span class="em">'+c.w.e+'</span><span class="cap">'+c.w.w+'</span>'
      :'<span class="let">'+c.w.l+'</span>';
    const b=h('button','mc','<span class="inner"><span class="face back"></span><span class="face front">'+face+'</span></span>');
    b.type='button';b.setAttribute('aria-label','Kartu');
    b.addEventListener('click',()=>{
      if(busy||b.classList.contains('up'))return;
      ctx();b.classList.add('up');sfx.pop();
      say(c.kind==='pic'?c.w.w:'Huruf '+c.w.l);
      if(!first){first={b:b,c:c};return}
      const a=first;first=null;busy=true;
      if(a.c.id===c.id){
        later(()=>{
          a.b.classList.add('done');b.classList.add('done');
          sfx.ok();burst(b);say('Cocok! '+c.w.w);matched++;busy=false;
          if(matched===L.pairs)later(memWin,1300);
        },500);
      }else{
        later(()=>{a.b.classList.remove('up');b.classList.remove('up');busy=false},1100);
      }
    });
    grid.appendChild(b);
  });
  replayFn=()=>say(msg);
  later(()=>say(msg),350);
}
function memWin(){
  addStars(2);
  showOverlay({
    title:'Hore, semuanya cocok!',
    sub:memLv<MEM.length-1?'Kartu berikutnya lebih seru.':'Kamu jago sekali!',
    speak:'Hore'+(name?', '+name:'')+'! Semua kartu sudah cocok!',
    stars:2,
    again:()=>{memLv=Math.min(memLv+1,MEM.length-1);startMem()}
  });
}

/* ---------- pasang ---------- */
$('#heroKancil').innerHTML=KANCIL;
$('#starIco').innerHTML=STAR;
$('#ovKancil').innerHTML=KANCIL;
$$('[data-home]').forEach(b=>{b.innerHTML=ICON_HOME;b.addEventListener('click',goHome)});
$$('.replay').forEach(b=>{b.innerHTML=ICON_ON;b.addEventListener('click',()=>{ctx();if(replayFn)replayFn()})});
$('#soundBtn').addEventListener('click',()=>{
  ctx();settings.sound=!settings.sound;save();paintHome();
  if(!settings.sound){stopVoice();}else{sfx.pop()}
});
$('#goAdv').addEventListener('click',()=>{ctx();startAdv()});
$('#goTg').addEventListener('click',()=>{ctx();startTg()});
$('#goMem').addEventListener('click',()=>{ctx();memLv=0;startMem()});
$('#nameKancil').innerHTML=KANCIL;
function finishName(skip){
  if(!skip){
    name=$('#nameInput').value.trim().slice(0,20);
    try{localStorage.setItem('kp-name',name)}catch(e){}
  }
  goHome();
  if(!skip&&name)say('Halo, '+name+'! Senang berkenalan.');
}
$('#nameForm').addEventListener('submit',e=>{e.preventDefault();ctx();finishName(false)});
$('#nameSkip').addEventListener('click',()=>{ctx();finishName(true)});
$('#renameBtn').addEventListener('click',()=>{show('namescr');$('#nameInput').value=name});
paintHome();
if(name){goHome()}else{show('namescr')}

/* ---------- aplikasi bisa dipasang di layar utama HP ---------- */
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
