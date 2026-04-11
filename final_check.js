
// ════════════════════════════════════════
// DATA STORE — localStorage (works on Android/real browser)
// ════════════════════════════════════════
const LS='gyt_';
const save=(k,v)=>{try{localStorage.setItem(LS+k,JSON.stringify(v))}catch(e){}};
const load=(k,d)=>{try{const v=localStorage.getItem(LS+k);return v?JSON.parse(v):d}catch(e){return d}};

let exercises=load('ex',[]);
let program=load('prog',[]);
let programs=load('programs',[]);
let activeProgramId=load('activeProg','');
// migrate old program to programs if needed
if(program.length&&!programs.length){
  const pid='p'+Date.now();
  programs=[{id:pid,name:'برنامجي الأول',days:program}];
  activeProgramId=pid;
  save('programs',programs);save('activeProg',activeProgramId);
}
function getActiveProgram(){return programs.find(p=>p.id===activeProgramId)||programs[0]||null;}
function syncProgram(){const p=getActiveProgram();program=p?p.days:[];save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}}
syncProgram();
let sessions=load('sess',[]);
let cfg=load('cfg',{dark:true,fs:16,restAuto:true,restSecs:90,unit:'kg',sound:true,vib:true,wakelock:false});
let profile=load('profile',{name:'',age:30,height:170,weight:73});
let weightLog=load('weightLog',[]);
let lastDay=load('lastday','');

// ── DEFAULT EXERCISES
const DEF_EX=[
  // PUSH – Chest
  {id:'e1',name:'Bench Press',cat:'Chest',icon:'🏋️',sets:4,reps:8,eq:'Barbell',safety:'safe',notes:'',subs:['e2','e3'],murl:''},
  {id:'e2',name:'Incline Dumbbell Press',cat:'Chest',icon:'🏋️',sets:4,reps:10,eq:'Dumbbell',safety:'safe',notes:'',subs:['e1','e3'],murl:''},
  {id:'e3',name:'Cable Crossover',cat:'Chest',icon:'💪',sets:3,reps:12,eq:'Cable',safety:'safe',notes:'',subs:['e2','e4'],murl:''},
  {id:'e4',name:'Pec Deck Fly',cat:'Chest',icon:'🦅',sets:3,reps:12,eq:'Machine',safety:'safe',notes:'',subs:['e3'],murl:''},
  {id:'e30',name:'Pec Dec Machine',cat:'Chest',icon:'🦅',sets:3,reps:12,eq:'Machine',safety:'safe',notes:'',subs:['e4'],murl:''},
  // PUSH – Shoulders
  {id:'e5',name:'Dumbbell Lateral Raise',cat:'Shoulders',icon:'↔️',sets:4,reps:15,eq:'Dumbbell',safety:'caution',notes:'Shoulder issue – limit range of motion',subs:['e6','e7'],murl:''},
  {id:'e6',name:'Cable Lateral Raise',cat:'Shoulders',icon:'↔️',sets:3,reps:15,eq:'Cable',safety:'caution',notes:'Shoulder – be careful with overhead',subs:['e5'],murl:''},
  {id:'e7',name:'Dumbbell Front Raise',cat:'Shoulders',icon:'⬆️',sets:3,reps:12,eq:'Dumbbell',safety:'caution',notes:'Avoid full overhead extension',subs:['e6'],murl:''},
  // PUSH – Triceps
  {id:'e8',name:'Tricep Pushdown',cat:'Triceps',icon:'💪',sets:4,reps:12,eq:'Cable',safety:'safe',notes:'',subs:['e9','e10'],murl:''},
  {id:'e9',name:'Overhead Tricep Extension',cat:'Triceps',icon:'💪',sets:3,reps:12,eq:'Dumbbell',safety:'caution',notes:'Neck & shoulder – use light weight',subs:['e8','e10'],murl:''},
  {id:'e10',name:'Skull Crusher',cat:'Triceps',icon:'💀',sets:3,reps:10,eq:'EZ-Bar',safety:'caution',notes:'',subs:['e8'],murl:''},
  {id:'e11',name:'Close Grip Bench Press',cat:'Triceps',icon:'🏋️',sets:3,reps:10,eq:'Barbell',safety:'safe',notes:'',subs:['e8'],murl:''},
  // PULL – Back
  {id:'e12',name:'Lat Pulldown',cat:'Back',icon:'🔽',sets:4,reps:10,eq:'Cable',safety:'safe',notes:'',subs:['e13','e14'],murl:''},
  {id:'e13',name:'Seated Cable Row',cat:'Back',icon:'🔁',sets:4,reps:10,eq:'Cable',safety:'safe',notes:'',subs:['e12','e15'],murl:''},
  {id:'e14',name:'Pull-Up',cat:'Back',icon:'⬆️',sets:3,reps:8,eq:'Bodyweight',safety:'safe',notes:'',subs:['e12'],murl:''},
  {id:'e15',name:'Dumbbell Row',cat:'Back',icon:'🏋️',sets:3,reps:12,eq:'Dumbbell',safety:'safe',notes:'',subs:['e13'],murl:''},
  {id:'e16',name:'Straight Arm Pulldown',cat:'Back',icon:'⬇️',sets:3,reps:12,eq:'Cable',safety:'safe',notes:'',subs:['e12'],murl:''},
  {id:'e17',name:'Reverse Pec Deck',cat:'Back',icon:'🦅',sets:3,reps:15,eq:'Machine',safety:'safe',notes:'',subs:['e16'],murl:''},
  {id:'e29',name:'Chin-Up',cat:'Back',icon:'⬆️',sets:3,reps:8,eq:'Bodyweight',safety:'safe',notes:'',subs:['e12'],murl:''},
  // PULL – Biceps
  {id:'e18',name:'Barbell Curl',cat:'Biceps',icon:'💪',sets:4,reps:10,eq:'Barbell',safety:'safe',notes:'',subs:['e19','e20'],murl:''},
  {id:'e19',name:'Dumbbell Hammer Curl',cat:'Biceps',icon:'🔨',sets:3,reps:12,eq:'Dumbbell',safety:'safe',notes:'',subs:['e18'],murl:''},
  {id:'e20',name:'Incline Dumbbell Curl',cat:'Biceps',icon:'💪',sets:3,reps:12,eq:'Dumbbell',safety:'safe',notes:'',subs:['e18'],murl:''},
  {id:'e21',name:'Cable Curl',cat:'Biceps',icon:'🔁',sets:3,reps:12,eq:'Cable',safety:'safe',notes:'',subs:['e18','e19'],murl:''},
  // LEGS
  {id:'e22',name:'Leg Press',cat:'Legs',icon:'🦵',sets:4,reps:12,eq:'Machine',safety:'safe',notes:'Lower back – use controlled range',subs:['e23','e24'],murl:''},
  {id:'e23',name:'Leg Extension',cat:'Legs',icon:'🦵',sets:4,reps:15,eq:'Machine',safety:'safe',notes:'',subs:['e22'],murl:''},
  {id:'e24',name:'Seated Leg Curl',cat:'Legs',icon:'🦵',sets:4,reps:12,eq:'Machine',safety:'safe',notes:'',subs:['e25'],murl:''},
  {id:'e25',name:'Lying Leg Curl',cat:'Legs',icon:'🦵',sets:4,reps:12,eq:'Machine',safety:'safe',notes:'',subs:['e24'],murl:''},
  {id:'e26',name:'Calf Raise',cat:'Legs',icon:'👟',sets:4,reps:20,eq:'Machine',safety:'safe',notes:'',subs:[],murl:''},
  {id:'e27',name:'Hip Abductor',cat:'Legs',icon:'🦵',sets:3,reps:15,eq:'Machine',safety:'safe',notes:'',subs:[],murl:''},
  {id:'e28',name:'Smith Machine Squat',cat:'Legs',icon:'🏋️',sets:3,reps:10,eq:'Smith',safety:'caution',notes:'Lower back – controlled depth',subs:['e22'],murl:''},
  // CORE
  {id:'e31',name:'Plank',cat:'Core',icon:'🧱',sets:3,reps:1,eq:'Bodyweight',safety:'safe',notes:'Lower back – build up slowly',subs:[],murl:''},
  {id:'e32',name:'Ab Crunch Machine',cat:'Core',icon:'💪',sets:3,reps:15,eq:'Machine',safety:'safe',notes:'Stomach – avoid if inflamed',subs:['e31'],murl:''},
  {id:'e33',name:'Hanging Knee Raise',cat:'Core',icon:'🏋️',sets:3,reps:12,eq:'Bar',safety:'safe',notes:'',subs:['e32'],murl:''},
  // CARDIO
  {id:'e34',name:'Treadmill',cat:'Cardio',icon:'🏃',sets:1,reps:1,eq:'Machine',safety:'safe',notes:'Low intensity – stomach friendly',subs:[],murl:''},
  {id:'e35',name:'Stationary Bike',cat:'Cardio',icon:'🚴',sets:1,reps:1,eq:'Machine',safety:'safe',notes:'',subs:['e34'],murl:''},
];

const DEF_PROG=[
  {id:'d1',name:'Push Day',icon:'🏋️',rest:false,exercises:['e1','e2','e5','e8','e10']},
  {id:'d2',name:'Pull Day',icon:'💪',rest:false,exercises:['e12','e13','e18','e19']},
  {id:'d3',name:'Legs Day',icon:'🦵',rest:false,exercises:['e22','e23','e24','e26']},
  {id:'d4',name:'Upper Day',icon:'⬆️',rest:false,exercises:['e14','e29','e5','e8','e19']},
  {id:'d5',name:'Lower Day',icon:'⬇️',rest:false,exercises:['e22','e24','e26','e27']},
  {id:'d6',name:'Rest Day',icon:'😴',rest:true,exercises:[]},
];

if(exercises.length===0){exercises=DEF_EX;save('ex',exercises);}
if(program.length===0){program=DEF_PROG;save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}}

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
const PAGES={home:'الرئيسية',program:'البرنامج',progress:'التقدم',exercises:'التمارين',settings:'الإعدادات'};
let curPage='home';

function navTo(btn){
  const pg=btn.dataset.page;
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===pg));
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+pg));
  document.getElementById('topbar-title').textContent=PAGES[pg]||pg;
  curPage=pg;
  closeSB();
  if(pg==='home'){renderHome();renderStreak();}
  if(pg==='program')renderProg();
  if(pg==='exercises')renderEx();
  if(pg==='progress'){renderProg2();setTimeout(()=>{renderStreak();progTabInit();},80);}
  if(pg==='settings'){initSettings();setTimeout(renderChart,150);}
}
function navById(pg){
  const btn=document.querySelector('.nav-btn[data-page="'+pg+'"]');
  if(btn)navTo(btn);
}

// ════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════
function openSB(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sb-bd').classList.add('open');
  renderSB();
}
function closeSB(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sb-bd').classList.remove('open');
}
function renderSB(){
  const total=sessions.length;
  const week=sessions.filter(s=>{const d=new Date(s.date);return(Date.now()-d)<7*864e5;}).length;
  document.getElementById('sb-streak').textContent='📅 '+week+' this week · '+total+' total';
  const icons=['🏠','📅','📊','🏋️','⚙️'];
  document.getElementById('sb-nav').innerHTML=Object.entries(PAGES).map(([id,lbl],i)=>{
    const isLast=lastDay&&program.find(d=>d.id===lastDay)&&id==='program';
    return '<div class="sb-item'+(curPage===id?' active':'')+'" onclick="navById(\''+id+'\');closeSB()">'+
      '<span>'+icons[i]+'</span><span>'+lbl+'</span>'+
      (isLast?'<div class="sb-dot"></div>':'')+'</div>';
  }).join('');
}

// ════════════════════════════════════════
// THEME
// ════════════════════════════════════════
function applyTh(){
  const dk=document.getElementById('s-dark').checked;
  cfg.dark=dk;
  document.documentElement.setAttribute('data-theme',dk?'dark':'light');
  updateThemeIcon(dk);
  save('cfg',cfg);
}
function toggleTheme(){
  const dk=document.documentElement.getAttribute('data-theme')!=='dark';
  cfg.dark=dk;
  document.documentElement.setAttribute('data-theme',dk?'dark':'light');
  const s=document.getElementById('s-dark');
  if(s)s.checked=dk;
  updateThemeIcon(dk);
  save('cfg',cfg);
}
function updateThemeIcon(dk){
  const ico=document.getElementById('theme-ico');
  if(!ico)return;
  if(dk){ico.innerHTML='<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';}
  else{ico.innerHTML='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';}
}
function applyFS(v){
  document.body.style.fontSize=v+'px';
  cfg.fs=+v;
  const lbl=document.getElementById('s-fsv');
  if(lbl)lbl.textContent=v+'px';
  save('cfg',cfg);
}
function saveSets(){
  const ar=document.getElementById('s-arest');
  const rs=document.getElementById('s-rsecs');
  if(ar!==null)cfg.restAuto=ar.checked;
  if(rs!==null&&rs.value)cfg.restSecs=Math.max(15,Math.min(300,+rs.value));
  cfg.unit=document.getElementById('s-unit')?.value??cfg.unit;
  cfg.sound=document.getElementById('s-snd')?.checked??cfg.sound;
  cfg.vib=document.getElementById('s-vib')?.checked??cfg.vib;
  cfg.wakelock=document.getElementById('s-wl')?.checked??cfg.wakelock;
  save('cfg',cfg);

  // v6 extended saves
  const g3=id=>document.getElementById(id);
  if(g3('s-superset'))cfg.superset=g3('s-superset').checked||false;
  if(g3('s-trackpr'))cfg.trackpr=g3('s-trackpr').checked!==false;
  if(g3('s-injwarn'))cfg.injwarn=g3('s-injwarn').checked!==false;
  if(g3('s-fibro'))cfg.fibro=g3('s-fibro').checked||false;
  if(g3('s-painlog'))cfg.painlog=g3('s-painlog').checked||false;
  if(g3('s-remind'))cfg.remind=g3('s-remind').checked||false;
  if(g3('s-remind-time'))cfg.remindTime=g3('s-remind-time').value||'08:00';
  if(g3('s-fatigue'))cfg.fatigue=+g3('s-fatigue').value||3;
  save('cfg',cfg);
}
function initSettings(){
  initProfile();
  const s=id=>document.getElementById(id);
  if(s('s-dark'))s('s-dark').checked=cfg.dark;
  if(s('s-arest'))s('s-arest').checked=cfg.restAuto;
  if(s('s-rsecs'))s('s-rsecs').value=cfg.restSecs;
  if(s('s-unit'))s('s-unit').value=cfg.unit;
  if(s('s-snd'))s('s-snd').checked=cfg.sound;
  if(s('s-vib'))s('s-vib').checked=cfg.vib;
  if(s('s-wl'))s('s-wl').checked=cfg.wakelock;
  if(s('s-fs'))s('s-fs').value=cfg.fs;
  if(s('s-fsv'))s('s-fsv').textContent=cfg.fs+'px';
  if(s('sf-wt-lbl'))s('sf-wt-lbl').textContent='الوزن ('+cfg.unit+')';
  document.body.style.fontSize=cfg.fs+'px';

  // v6 extended settings
  const g2=id=>document.getElementById(id);
  if(g2('s-superset'))g2('s-superset').checked=cfg.superset||false;
  if(g2('s-trackpr'))g2('s-trackpr').checked=cfg.trackpr!==false;
  if(g2('s-injwarn'))g2('s-injwarn').checked=cfg.injwarn!==false;
  if(g2('s-fibro'))g2('s-fibro').checked=cfg.fibro||false;
  if(g2('s-painlog'))g2('s-painlog').checked=cfg.painlog||false;
  if(g2('s-remind'))g2('s-remind').checked=cfg.remind||false;
  if(g2('s-remind-time'))g2('s-remind-time').value=cfg.remindTime||'08:00';
  const fsl=document.getElementById('s-fatigue');
  if(fsl){fsl.value=cfg.fatigue||3;const fv=document.getElementById('s-fatigue-v');if(fv)fv.textContent=cfg.fatigue||3;}
  const rtr=document.getElementById('remind-time-row');if(rtr)rtr.style.display=cfg.remind?'':'none';
}

// ════════════════════════════════════════
// MODALS
// ════════════════════════════════════════
function openM(id){document.getElementById(id).classList.add('active');}
function closeM(id){document.getElementById(id).classList.remove('active');}
function confirm2(title,msg,ok){
  document.getElementById('conf-t').textContent=title;
  document.getElementById('conf-m').textContent=msg;
  document.getElementById('conf-ok').onclick=()=>{closeM('m-conf');ok();};
  openM('m-conf');
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){document.querySelectorAll('.modal-bd.active').forEach(m=>m.classList.remove('active'));}
});
// Close modal on backdrop click
document.querySelectorAll('.modal-bd').forEach(m=>{
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('active');});
});

// ════════════════════════════════════════
// TOAST
// ════════════════════════════════════════
function toast(msg,type='',dur=2500){
  const c=document.getElementById('toasts');
  const el=document.createElement('div');
  el.className='toast'+(type?' '+type:'');
  el.textContent=msg;
  c.appendChild(el);
  setTimeout(()=>el.remove(),dur);
}
function vibr(ms=40){if(cfg.vib&&navigator.vibrate)navigator.vibrate(ms);}

// ════════════════════════════════════════
// HOME
// ════════════════════════════════════════
function renderHome(){
  const h=new Date().getHours();
  document.getElementById('h-greet').textContent=h<12?'Good Morning ☀️':h<17?'Good Afternoon ⛅':'Good Evening 🌙';
  // Day grid
  document.getElementById('day-grid').innerHTML=program.map(d=>{
    const isLast=lastDay===d.id;
    const sub=d.rest?'Rest Day':d.exercises.length+' exercises';
    const onclick=d.rest?"toast('Rest Day 😴')":"startGym('"+d.id+"')";
    return '<div class="day-card'+(isLast?' last':'')+'" onclick="'+onclick+'" role="button" tabindex="0">'+
      (isLast?'<div class="day-card-lbl">Last ⭐</div>':'')+
      '<div class="day-card-icon">'+(d.icon||'💪')+'</div>'+
      '<div class="day-card-name">'+esc(d.name)+'</div>'+
      '<div class="day-card-sub">'+sub+'</div>'+
      '</div>';
  }).join('');
  // Last banner
  const banner=document.getElementById('last-banner');
  if(lastDay){
    const ld=program.find(d=>d.id===lastDay);
    if(ld){
      banner.innerHTML='<span style="font-size:1.6em">'+(ld.icon||'💪')+'</span>'+
        '<div style="flex:1"><div style="font-size:var(--txs);color:var(--mu)">آخر تدريب</div>'+
        '<div style="font-weight:900;font-family:var(--fe);color:var(--gld)">'+esc(ld.name)+'</div></div>'+
        '<div style="font-size:var(--txs);color:var(--gld);font-weight:700">▶ استمر</div>';
      banner.style.display='flex';
      banner.onclick=()=>startGym(ld.id);
    }else{banner.style.display='none';}
  }else{banner.style.display='none';}
  // Stats
  const week=sessions.filter(s=>new Date(s.date)>new Date(Date.now()-7*864e5)).length;
  const sets=sessions.reduce((a,s)=>a+(+s.sets||0),0);
  const prs=sessions.filter(s=>s.pr).length;
  document.getElementById('h-week').textContent=week;
  document.getElementById('h-sets').textContent=sets;
  document.getElementById('h-prs').textContent=prs;

  renderStreak();
}

// ════════════════════════════════════════
// EXERCISE LIBRARY
// ════════════════════════════════════════
let exFilter='All';
function renderEx(){
  const cats=['All',...new Set(exercises.map(e=>e.cat))];
  document.getElementById('ex-fbar').innerHTML=cats.map(c=>
    '<button class="fbtn'+(exFilter===c?' active':'')+'" onclick="exFilter=\''+c+'\';renderEx()">'+c+'</button>'
  ).join('');
  const filtered=exFilter==='All'?exercises:exercises.filter(e=>e.cat===exFilter);
  document.getElementById('ex-grid').innerHTML=filtered.length?filtered.map(e=>exCard(e)).join(''):
    '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><h3>No exercises</h3><p>Add your first exercise</p></div>';
}
function exCard(e){
  const sc={safe:'bs',caution:'bw',avoid:'be'}[e.safety||'safe'];
  const sl=e.subs&&e.subs.length?e.subs.map(id=>{const x=exercises.find(a=>a.id===id);return x?x.name:null;}).filter(Boolean).slice(0,2).join(', '):'–';
  return '<div class="ex-card" id="exc-'+e.id+'">'+
    '<div class="ex-hdr">'+
    '<div class="ex-ico">'+(e.icon||'💪')+'</div>'+
    '<div style="flex:1">'+
    '<div class="ex-name">'+esc(e.name)+'</div>'+
    '<div class="ex-cat">'+e.cat+' · '+e.sets+'×'+e.reps+'</div>'+
    '<div style="margin-top:4px"><span class="badge '+sc+'">'+((e.safety||'safe'))+'</span></div>'+
    '</div></div>'+
    (e.murl&&/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(e.murl)?'<img class="ex-thumb" src="'+esc(e.murl)+'" alt="'+esc(e.name)+'" loading="lazy" onerror="this.style.display=\'none\'">':'')+
    (e.notes?'<div style="font-size:var(--txs);color:var(--war);margin-bottom:var(--sp2)">⚠️ '+esc(e.notes)+'</div>':'')+
    '<div style="font-size:var(--txs);color:var(--mu);margin-bottom:var(--sp3)">🔄 Subs: '+sl+'</div>'+
    '<div class="ex-acts">'+
    '<button class="btn btn-sec btn-sm" onclick="openExForm(\''+e.id+'\')">✏️ Edit</button>'+
    '<button class="btn btn-d btn-sm" onclick="delEx(\''+e.id+'\')">🗑️</button>'+
    '</div></div>';
}
let curExId=null;
function openExForm(id){
  curExId=id;
  const e=id?exercises.find(x=>x.id===id):null;
  document.getElementById('m-ex-title').textContent=id?'Edit Exercise':'Add Exercise';
  document.getElementById('ef-name').value=e?.name||'';
  document.getElementById('ef-cat').value=e?.cat||'Chest';
  document.getElementById('ef-icon').value=e?.icon||'💪';
  document.getElementById('ef-sets').value=e?.sets||3;
  document.getElementById('ef-reps').value=e?.reps||10;
  document.getElementById('ef-eq').value=e?.eq||'';
  document.getElementById('ef-safety').value=e?.safety||'safe';
  document.getElementById('ef-notes').value=e?.notes||'';
  document.getElementById('ef-murl').value=e?.murl||'';
  prevMedia();
  // Subs checkboxes
  const sb=document.getElementById('ef-subs');
  const curSubs=e?.subs||[];
  const others=exercises.filter(x=>x.id!==id);
  if(!others.length){
    sb.innerHTML='<div style="padding:var(--sp4);color:var(--mu);font-size:var(--txsm);text-align:center">Add more exercises first</div>';
  }else{
    sb.innerHTML=others.map(x=>
      '<label class="chk-item">'+
      '<input type="checkbox" value="'+x.id+'"'+(curSubs.includes(x.id)?' checked':'')+'>'+
      '<div><div class="chk-nm">'+esc(x.name)+'</div><div class="chk-mt">'+x.cat+'</div></div>'+
      '</label>'
    ).join('');
  }
  openM('m-ex');
  setTimeout(()=>document.getElementById('ef-name').focus(),100);
}
function saveEx(){
  const name=document.getElementById('ef-name').value.trim();
  if(!name){toast('Enter exercise name','e');return;}
  const subs=[...document.querySelectorAll('#ef-subs input[type=checkbox]:checked')].map(c=>c.value);
  const obj={
    id:curExId||('e'+Date.now()),
    name,cat:document.getElementById('ef-cat').value,
    icon:document.getElementById('ef-icon').value||'💪',
    sets:+document.getElementById('ef-sets').value||3,
    reps:+document.getElementById('ef-reps').value||10,
    eq:document.getElementById('ef-eq').value,
    safety:document.getElementById('ef-safety').value,
    notes:document.getElementById('ef-notes').value,
    murl:document.getElementById('ef-murl').value,
    subs
  };
  if(curExId){const i=exercises.findIndex(x=>x.id===curExId);if(i!==-1)exercises[i]=obj;}
  else exercises.push(obj);
  save('ex',exercises);
  closeM('m-ex');
  renderEx();
  toast(curExId?'Exercise updated ✓':'Exercise added ✓','s');
}
function delEx(id){
  confirm2('Delete Exercise','This will remove it from the library and all programs.',()=>{
    exercises=exercises.filter(e=>e.id!==id);
    program.forEach(d=>{d.exercises=d.exercises.filter(x=>x!==id);});
    save('ex',exercises);save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}
    renderEx();toast('Deleted','s');
  });
}
function prevMedia(){
  const url=document.getElementById('ef-murl').value.trim();
  const prev=document.getElementById('ef-mprev');
  const img=document.getElementById('ef-mimg');
  const lnk=document.getElementById('ef-mlink');
  const a=document.getElementById('ef-ma');
  if(!url){prev.style.display='none';return;}
  const isImg=/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(url)||url.startsWith('data:image');
  if(isImg){img.src=url;img.style.display='block';lnk.style.display='none';}
  else{img.style.display='none';a.href=url;a.textContent='▶ '+url.slice(0,50);lnk.style.display='block';}
  prev.style.display='block';
}
function clearMedia(){document.getElementById('ef-murl').value='';prevMedia();}
function uploadMedia(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{document.getElementById('ef-murl').value=ev.target.result;prevMedia();};
  r.readAsDataURL(f);
}

// ════════════════════════════════════════
// PROGRAM
// ════════════════════════════════════════
function renderProg(){
  syncProgram();
  // Render programs switcher
  const progListEl=document.getElementById('programs-list');
  if(progListEl){
    progListEl.innerHTML=programs.length?programs.map(function(p){
      var isActive=p.id===activeProgramId;
      var pid=p.id;
      return '<div style="display:flex;align-items:center;gap:var(--sp3);padding:var(--sp3) var(--sp4);background:var(--sf2);border-radius:var(--r12);margin-bottom:var(--sp2);border:2px solid '+(isActive?'var(--pri)':'var(--br)')+'">'+
        '<div style="flex:1;font-weight:700;font-family:var(--fe)">'+(isActive?'✅ ':'')+p.name+'</div>'+
        (!isActive?'<button class="btn btn-p btn-sm" onclick="activateProgram(this.dataset.id)" data-id="'+pid+'">تفعيل</button>':'')+
        '<button class="btn btn-sec btn-sm" onclick="renameProgram(this.dataset.id)" data-id="'+pid+'">✏️</button>'+
        (programs.length>1?'<button class="btn btn-d btn-sm" onclick="deleteProgram(this.dataset.id)" data-id="'+pid+'">🗑️</button>':'')+
      '</div>';
    }).join(''):'<div class="empty" style="padding:var(--sp4);text-align:center;color:var(--mu)">لا يوجد برنامج — أضف برنامجاً جديداً</div>';
  }
  // Show active program name
  const ap=getActiveProgram();
  const apn=document.getElementById('active-prog-name');
  if(apn)apn.textContent=ap?'📋 '+ap.name:'';
  const lastD=program.find(d=>d.id===lastDay);
  const pl=document.getElementById('prog-last');
  const pd=document.getElementById('prog-dot');
  if(lastD){if(pl){pl.textContent=lastD.name;pl.style.display='inline';}if(pd)pd.style.display='inline-block';}
  else{if(pl)pl.style.display='none';if(pd)pd.style.display='none';}
  document.getElementById('prog-list').innerHTML=program.map(d=>dayRow(d)).join('');
}
function dayRow(d){
  const items=dayExercisesResolved(d);
  const isLast=lastDay===d.id;
  const exHtml=items.map((x,i)=>{
    const badge=x.ssGroup?' <span style="color:var(--pri)">SS</span>':'';
    const label=x.ssGroup?'UnSS':'SS';
    return `<div class="chip" style="display:flex;align-items:center;gap:6px">${esc(x.ex.name)}${badge} <button class="btn btn-gh btn-sm" style="padding:4px 8px" onclick="toggleSupersetForDay('${d.id}',${i})">${label}</button></div>`;
  }).join('');
  return `<div class="day-row${isLast?' last':''}">`
    +`<div class="day-hdr">`
    +`<span style="font-size:1.4em">${d.icon||'💪'}</span>`
    +`<div style="flex:1"><div style="font-weight:800;font-family:var(--fe)">${esc(d.name)}</div><div style="font-size:var(--txs);color:var(--mu)">${d.rest?'Rest Day':items.length+' exercises'}${isLast?' · <span style="color:var(--pri)">Today</span>':''}</div></div>`
    +`<button class="btn btn-sec btn-sm" onclick="openEditDay('${d.id}')">✏️</button>`
    +`<button class="btn btn-d btn-sm" onclick="delDay('${d.id}')">🗑️</button>`
    +`</div>`
    +(d.rest?'':`<div class="chips">${exHtml}</div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn btn-sec btn-sm" onclick="openAddEx('${d.id}')">+ Exercise</button><button class="btn btn-p btn-sm" onclick="startGym('${d.id}')">ابدأ</button></div>`)
    +`</div>`;
}
function openAddDay(){
  curDayId=null;
  document.getElementById('m-day-title').textContent='Add Day';
  document.getElementById('df-name').value='';
  document.getElementById('df-icon').value='💪';
  document.getElementById('df-rest').checked=false;
  openM('m-day');
  setTimeout(()=>document.getElementById('df-name').focus(),100);
}
function openEditDay(id){
  curDayId=id;
  const d=program.find(x=>x.id===id);
  if(!d)return;
  document.getElementById('m-day-title').textContent='Edit Day';
  document.getElementById('df-name').value=d.name;
  document.getElementById('df-icon').value=d.icon||'💪';
  document.getElementById('df-rest').checked=d.rest;
  openM('m-day');
}
function saveDay(){
  const name=document.getElementById('df-name').value.trim();
  if(!name){toast('Enter day name','e');return;}
  const obj={
    id:curDayId||('d'+Date.now()),
    name,icon:document.getElementById('df-icon').value||'💪',
    rest:document.getElementById('df-rest').checked,
    exercises:curDayId?program.find(d=>d.id===curDayId)?.exercises||[]:[]
  };
  if(curDayId){const i=program.findIndex(d=>d.id===curDayId);if(i!==-1)program[i]=obj;}
  else program.push(obj);
  save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}
  closeM('m-day');
  renderProg();
  toast(curDayId?'Day updated ✓':'Day added ✓','s');
}
function delDay(id){
  confirm2('Delete Day','Remove this training day?',()=>{
    program=program.filter(d=>d.id!==id);
    save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}
    renderProg();
    toast('Deleted');
  });
}
let addExDayId=null;
function openAddEx(dayId){
  addExDayId=dayId;
  document.getElementById('addex-srch').value='';
  renderAddExList();
  openM('m-addex');
}
function renderAddExList(){
  const q=document.getElementById('addex-srch').value.toLowerCase();
  const d=program.find(x=>x.id===addExDayId);
  const cur=d?.exercises||[];
  const list=exercises.filter(e=>!q||e.name.toLowerCase().includes(q)||e.cat.toLowerCase().includes(q));
  document.getElementById('addex-list').innerHTML=list.map(e=>{
    const inDay=cur.includes(e.id);
    return '<div class="sub-item'+(inDay?' sel':'')+'" onclick="toggleExInDay(\''+e.id+'\',this)">'+
      '<div class="sub-ico">'+(e.icon||'💪')+'</div>'+
      '<div style="flex:1"><div class="sub-nm">'+esc(e.name)+'</div><div class="sub-mt">'+e.cat+' · '+e.sets+'×'+e.reps+'</div></div>'+
      (inDay?'<span style="color:var(--suc);font-weight:900;font-size:1.1em">✓</span>':'')+
      '</div>';
  }).join('');
}
function toggleExInDay(exId,el){
  const d=program.find(x=>x.id===addExDayId);if(!d)return;
  if(d.exercises.includes(exId)){d.exercises=d.exercises.filter(x=>x!==exId);}
  else{d.exercises.push(exId);}
  save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}
  renderAddExList();
  renderProg();
}
function rmExFromDay(dayId,exId){
  const d=program.find(x=>x.id===dayId);if(!d)return;
  d.exercises=d.exercises.filter(x=>x!==exId);
  save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}renderProg();toast('Removed');
}

// ════════════════════════════════════════
// GYM SESSION
// ════════════════════════════════════════
let gymDay=null,gymExs=[],gymIdx=0,gymSetIdx=0,gymSetsData=[],gymSetLog={};
let wl=null,restTimer=null;

async function startGym(dayId){
  const d=program.find(x=>x.id===dayId);
  if(!d||d.rest)return;
  const exList=d.exercises.map(id=>exercises.find(e=>e.id===id)).filter(Boolean);
  if(!exList.length){toast('No exercises in this day','e');return;}
  gymDay=d;gymExs=JSON.parse(JSON.stringify(exList));
  gymIdx=0;gymSetIdx=0;gymSetLog={};
  gymSetsData=gymExs.map(e=>Array.from({length:e.sets},()=>({w:'',r:e.reps,done:false})));
  document.getElementById('gym-day').textContent=d.name;
  document.getElementById('gym').classList.add('active');
  renderGym();
  if(cfg.wakelock&&'wakeLock' in navigator){
    try{wl=await navigator.wakeLock.request('screen');}catch(e){}
  }
}
function endNow(){
  const hasData=Object.keys(gymSetLog).length>0;
  if(hasData){
    confirm2('End Session','Save progress and end session?',()=>finishGym(true));
  }else{
    document.getElementById('gym').classList.remove('active');
    if(wl){wl.release();wl=null;}
    stopRest();
  }
}
function cancelGym(){
  confirm2('إلغاء الجلسة','الخروج بدون حفظ أي بيانات؟',()=>{
    gymSetLog={};
    document.getElementById('gym').classList.remove('active');
    if(wl){wl.release();wl=null;}
    stopRest();
    toast('تم إلغاء الجلسة','e');
  });
}
function finishGym(save2=true){
  if(save2&&gymDay){
    Object.entries(gymSetLog).forEach(([exId,sets])=>{
      if(sets&&sets.length){
        const ex=exercises.find(e=>e.id===exId);
        const maxW=Math.max(...sets.map(s=>+s.w||0));
        const prevMaxW=sessions.filter(s=>s.exId===exId).reduce((a,s)=>Math.max(a,+s.weight||0),0);
        sessions.push({
          id:'s'+Date.now()+Math.random().toString(36).slice(2),
          exId,exName:ex?.name||exId,
          date:new Date().toISOString(),
          sets:sets.length,reps:sets[0]?.r||0,
          weight:sets[0]?.w||0,pain:0,notes:'',
          pr:maxW>prevMaxW&&maxW>0
        });
      }
    });
    lastDay=gymDay.id;
    save('sess',sessions);save('lastday',lastDay);
  }
  document.getElementById('gym').classList.remove('active');
  if(wl){wl.release();wl=null;}
  stopRest();
  if(save2){
    const totalSets=Object.values(gymSetLog).flat().length;
    document.getElementById('cel-sub').textContent=gymExs.length+' exercises · '+totalSets+' sets total';
    document.getElementById('cel').classList.add('active');
  }
  renderHome();
}
function renderGym(){
  if(gymIdx>=gymExs.length){finishGym(true);return;}
  const ex=gymExs[gymIdx];
  const sets=gymSetsData[gymIdx];
  const total=gymExs.length;
  document.getElementById('gym-ctr').textContent=(gymIdx+1)+'/'+total;
  document.getElementById('gym-fill').style.width=(gymIdx/total*100)+'%';

  // Build swap panel content
  const pref=ex.subs||[];
  const subExs=[...exercises.filter(e=>pref.includes(e.id)&&e.id!==ex.id),
                ...exercises.filter(e=>!pref.includes(e.id)&&e.id!==ex.id)];
  const subsHtml=subExs.length?
    subExs.map(x=>'<div class="isub-item" onclick="swapGymEx(\''+x.id+'\')" style="position:relative">'+
      (pref.includes(x.id)?'<span class="sel-star">★</span>':'<span style="width:14px;display:inline-block"></span>')+
      '<div class="sub-ico">'+(x.icon||'💪')+'</div>'+
      '<div><div class="sn">'+esc(x.name)+'</div><div class="sm">'+x.cat+'</div></div>'+
      '</div>').join(''):
    '<div style="padding:var(--sp4);color:var(--mu);font-size:var(--txsm);text-align:center">No substitutes</div>';

  const body=document.getElementById('gym-body');
  body.innerHTML=
    '<div id="rest-ov" style="'+(restTimer?'':'display:none')+'" class="'+(restTimer?'active':'')+'">'+
      '<div id="rest-n">'+cfg.restSecs+'</div><div id="rest-msg">Rest 🔥</div>'+
      '<button class="btn btn-sec" onclick="skipRest()">⏩ Skip Rest</button>'+
    '</div>'+
    '<div class="gex-card">'+
      '<div class="gex-hdr">'+
        '<div class="gex-ico">'+(ex.icon||'💪')+'</div>'+
        '<div style="flex:1">'+
          '<div class="gex-name">'+esc(ex.name)+'</div>'+
          '<div class="gex-info">'+ex.cat+(ex.eq?' · '+ex.eq:'')+(ex.safety!=='safe'?' ⚠️':'')+'</div>'+
          (ex.notes?'<div style="font-size:var(--txs);color:var(--war);margin-top:3px">⚠️ '+esc(ex.notes)+'</div>':'')+
        '</div>'+
        '<div style="position:relative">'+
          '<button class="btn btn-sec btn-sm" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle(\'open\')" style="font-size:var(--txs)">🔄 Swap</button>'+
          '<div class="isub-panel" id="swap-panel-'+gymIdx+'"></div>'+
        '</div>'+
      '</div>'+
      (ex.murl?(function(){
    var u=ex.murl;
    var yt=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([-\w]{11})/);
    if(yt)return '<div class="gym-media"><iframe src="https://www.youtube.com/embed/'+yt[1]+'?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>';
    if(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(u))
      return '<div class="gym-media"><img src="'+esc(u)+'" loading="lazy" onclick="openLightbox(this.src)" onerror="this.parentElement.remove()"><div class="gym-media-tap">🔍 اضغط للتكبير</div></div>';
    return '<a href="'+esc(u)+'" target="_blank" rel="noopener" class="vid-link-btn" style="margin:var(--sp3) 0">▶ شاهد الفيديو</a>';
  })():'')+
      '<div class="sets-track" id="sets-dots"></div>'+
      '<div class="sets-ctrl">'+
        '<button class="s-ctrl-btn" onclick="adjSets(-1)">−</button>'+
        '<span style="font-size:var(--txsm);font-weight:800;padding:0 var(--sp3)" id="sct-lbl">'+sets.length+' sets</span>'+
        '<button class="s-ctrl-btn" onclick="adjSets(1)">+</button>'+
      '</div>'+
      '<div class="gym-inputs">'+
        '<div class="gin-grp">'+
          '<div class="gin-lbl">Weight ('+cfg.unit+')</div>'+
          '<input class="numinp" id="gin-w" type="number" inputmode="decimal" min="0" step="0.5" placeholder="0" value="'+(sets[gymSetIdx]?.w||'')+'" onfocus="this.select()" onkeydown="ginKd(event,\'w\')">'+
        '</div>'+
        '<div class="gin-grp">'+
          '<div class="gin-lbl">Reps</div>'+
          '<input class="numinp" id="gin-r" type="number" inputmode="numeric" min="1" placeholder="'+ex.reps+'" value="'+(sets[gymSetIdx]?.r||ex.reps)+'" onfocus="this.select()" onkeydown="ginKd(event,\'r\')">'+
        '</div>'+
      '</div>'+
      '<div class="gym-acts">'+
        '<button class="btn btn-sec" onclick="skipSet()">⏩ Skip</button>'+
        '<button class="btn btn-suc btn-full" onclick="logSet()" id="gym-next-btn">Set '+(gymSetIdx+1)+'/'+sets.length+' ✓</button>'+
      '</div>'+
    '</div>'+
    '<div class="next-list">'+
      (gymExs.length>1?'<div class="next-title">Up Next</div>':'')+
      gymExs.slice(gymIdx+1).map((e,i)=>
        '<div class="next-row" onclick="jumpTo('+(gymIdx+1+i)+')">'+
          '<div class="next-num">'+(i+2)+'</div>'+
          '<span>'+(e.icon||'💪')+'</span>'+
          '<span style="font-family:var(--fe);font-weight:700;font-size:var(--txsm);flex:1">'+esc(e.name)+'</span>'+
          '<span style="color:var(--mu);font-size:var(--txs)">'+e.sets+'×'+e.reps+'</span>'+
        '</div>'
      ).join('')+
      '<button class="btn btn-d btn-sm btn-full" style="margin-top:var(--sp4)" onclick="finishGym(true)">🏁 End Session</button>'+
    '</div>';

  // Inject swap panel HTML
  const panel=document.getElementById('swap-panel-'+gymIdx);
  if(panel)panel.innerHTML=subsHtml;

  renderSetDots();
  setTimeout(()=>{
    const inp=document.getElementById('gin-w');
    if(inp){inp.focus();inp.select();}
  },80);
}
function renderSetDots(){
  const sets=gymSetsData[gymIdx];
  const d=document.getElementById('sets-dots');
  const lbl=document.getElementById('sct-lbl');
  if(!d)return;
  d.innerHTML=sets.map((s,i)=>'<div class="set-dot'+(s.done?' done':i===gymSetIdx?' cur':'')+'" onclick="jumpToSet('+i+')">'+(s.done?'✓':(i+1))+'</div>').join('');
  if(lbl)lbl.textContent=sets.length+' sets';
  const nb=document.getElementById('gym-next-btn');
  if(nb)nb.textContent='Set '+(gymSetIdx+1)+'/'+sets.length+' ✓';
}
function jumpToSet(i){
  if(gymSetsData[gymIdx][i]?.done)return;
  gymSetIdx=i;
  renderSetDots();
  const nb=document.getElementById('gym-next-btn');
  if(nb)nb.textContent='Set '+(gymSetIdx+1)+'/'+gymSetsData[gymIdx].length+' ✓';
}
function ginKd(e,field){
  if(e.key==='Enter'){
    e.preventDefault();
    if(field==='w'){
      const r=document.getElementById('gin-r');
      if(r){r.focus();r.select();}
    }else{
      logSet();
    }
  }
}
function logSet(){
  const w=document.getElementById('gin-w')?.value||'0';
  const r=document.getElementById('gin-r')?.value;
  const ex=gymExs[gymIdx];
  const sets=gymSetsData[gymIdx];
  sets[gymSetIdx]={w,r:+r||ex.reps,done:true};
  if(!gymSetLog[ex.id])gymSetLog[ex.id]=[];
  gymSetLog[ex.id].push({w,r:+r||ex.reps});
  vibr(30);
  if(cfg.sound)playBeep();
  const allDone=gymSetIdx>=sets.length-1;
  if(allDone){
    sets.forEach(s=>s.done=true);
    if(cfg.restAuto){startRest(cfg.restSecs,()=>nextExercise());}
    else{setTimeout(()=>nextExercise(),200);}
  }else{
    gymSetIdx++;
    renderSetDots();
    const nb=document.getElementById('gym-next-btn');
    if(nb)nb.textContent='Set '+(gymSetIdx+1)+'/'+sets.length+' ✓';
    if(cfg.restAuto){
      startRest(cfg.restSecs,()=>{
        const w2=document.getElementById('gin-w');
        const r2=document.getElementById('gin-r');
        if(w2){w2.focus();w2.select();}
      });
    }else{
      const w2=document.getElementById('gin-w');
      if(w2){w2.focus();w2.select();}
    }
  }
}
function skipSet(){
  const sets=gymSetsData[gymIdx];
  gymSetIdx=Math.min(gymSetIdx+1,sets.length-1);
  renderGym();
}
function nextExercise(){gymIdx++;gymSetIdx=0;
  // Celebrate exercise completion
  const btn=event&&event.target;
  if(btn){const r=btn.getBoundingClientRect();Anima.confetti(r.left+r.width/2,r.top+r.height/2,22);}
  Anima.toast('Exercise done! 💪','🏋️',1800);
  renderGym();}
function jumpTo(i){
  var tmpEx=gymExs[gymIdx];gymExs[gymIdx]=gymExs[i];gymExs[i]=tmpEx;
  var tmpSd=gymSetsData[gymIdx];gymSetsData[gymIdx]=gymSetsData[i];gymSetsData[i]=tmpSd;
  gymSetIdx=0;renderGym();
  toast('تم تبديل التمرين 🔄','s',1500);
}
function adjSets(d){
  const sets=gymSetsData[gymIdx];
  const ex=gymExs[gymIdx];
  const ns=Math.max(1,Math.min(10,sets.length+d));
  if(ns>sets.length){for(let i=sets.length;i<ns;i++)sets.push({w:sets[sets.length-1]?.w||'',r:ex.reps,done:false});}
  else{gymSetsData[gymIdx]=sets.slice(0,ns);}
  if(gymSetIdx>=gymSetsData[gymIdx].length)gymSetIdx=gymSetsData[gymIdx].length-1;
  renderSetDots();
}
function swapGymEx(newId){
  const newEx=exercises.find(e=>e.id===newId);
  if(!newEx)return;
  gymExs[gymIdx]=JSON.parse(JSON.stringify(newEx));
  gymSetsData[gymIdx]=Array.from({length:newEx.sets},()=>({w:'',r:newEx.reps,done:false}));
  gymSetIdx=0;
  document.querySelectorAll('.isub-panel').forEach(p=>p.classList.remove('open'));
  renderGym();
  toast('Swapped to '+newEx.name,'s');
}

// Rest timer
function startRest(secs,cb){
  stopRest();
  let n=secs;
  const ov=document.getElementById('rest-ov');
  if(!ov)return;
  const num=document.getElementById('rest-n');
  const msg=document.getElementById('rest-msg');
  ov.classList.add('active');
  ov.style.display='flex';
  if(num)num.textContent=n;
  if(msg)msg.textContent=n>60?'Rest – '+n+'s':'Rest 🔥';
  restTimer=setInterval(()=>{
    n--;
    if(num)num.textContent=n;
    if(n<=0){stopRest();if(cb)cb();}
  },1000);
  window._restCb=cb;
}
function stopRest(){
  if(restTimer){clearInterval(restTimer);restTimer=null;}
  const ov=document.getElementById('rest-ov');
  if(ov){ov.classList.remove('active');ov.style.display='';}
}
function skipRest(){
  stopRest();
  if(window._restCb){const cb=window._restCb;window._restCb=null;cb();}
}

// Beep
function playBeep(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator();const g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.type='sine';o.frequency.value=880;
    g.gain.setValueAtTime(0.3,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.15);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+0.15);
  }catch(e){}
}

// Reorder — touch + mouse friendly
let roData=[],roTouchEl=null,roTouchI=-1,roTouchClone=null,roTouchStartY=0;
function openRO(){
  roData=gymExs.map((e,i)=>({...e,_done:i<gymIdx}));
  renderROList();openM('m-ro');
  setTimeout(attachROTouch,50);
}
function renderROList(){
  document.getElementById('ro-list').innerHTML=roData.map((e,i)=>
    '<div class="ro-item'+(e._done?' done':'')+'" data-i="'+i+'" style="user-select:none;-webkit-user-select:none;touch-action:none;">'+
    '<span style="color:var(--mu);font-size:1.3em;padding:0 4px;cursor:grab">⠿</span>'+
    '<span>'+(e.icon||'💪')+'</span>'+
    '<span style="font-family:var(--fe);font-weight:700;font-size:var(--txsm);flex:1">'+esc(e.name)+'</span>'+
    (e._done?'<span style="color:var(--suc);font-size:var(--txs)">Done ✓</span>':
      '<span class="btn btn-sec btn-sm" style="pointer-events:none">'+e.sets+'×'+e.reps+'</span>')+
    '</div>'
  ).join('');
  attachROTouch();
}
function attachROTouch(){
  const list=document.getElementById('ro-list');
  if(!list)return;
  list.querySelectorAll('.ro-item:not(.done)').forEach(function(el){
    el.addEventListener('touchstart',roTStart,{passive:false});
    el.addEventListener('mousedown',roMStart);
  });
}
function roTStart(e){
  e.preventDefault();
  const t=e.touches[0];
  roTouchI=+this.dataset.i;
  roTouchEl=this;
  roTouchStartY=t.clientY;
  roTouchEl.style.opacity='0.5';
  document.addEventListener('touchmove',roTMove,{passive:false});
  document.addEventListener('touchend',roTEnd);
}
function roTMove(e){
  e.preventDefault();
  if(!roTouchEl)return;
  const t=e.touches[0];
  const list=document.getElementById('ro-list');
  const items=[...list.querySelectorAll('.ro-item')];
  const y=t.clientY;
  let targetI=roTouchI;
  items.forEach(function(item,i){
    const r=item.getBoundingClientRect();
    if(y>r.top&&y<r.bottom)targetI=+item.dataset.i;
  });
  if(targetI!==roTouchI&&targetI>=0&&!roData[targetI]?._done){
    const a=roData[roTouchI];
    roData.splice(roTouchI,1);
    roData.splice(targetI,0,a);
    roTouchI=targetI;
    renderROList();
    // restore opacity on moved el
    const newEl=list.querySelector('[data-i="'+targetI+'"]');
    if(newEl){newEl.style.opacity='0.5';roTouchEl=newEl;}
  }
}
function roTEnd(){
  if(roTouchEl)roTouchEl.style.opacity='1';
  roTouchEl=null;roTouchI=-1;
  document.removeEventListener('touchmove',roTMove);
  document.removeEventListener('touchend',roTEnd);
}
let roMouseI=-1;
function roMStart(e){
  roMouseI=+this.dataset.i;
  const el=this;
  el.style.opacity='0.5';
  function roMMove(ev){
    const list=document.getElementById('ro-list');
    if(!list)return;
    const items=[...list.querySelectorAll('.ro-item')];
    let targetI=roMouseI;
    items.forEach(function(item,i){
      const r=item.getBoundingClientRect();
      if(ev.clientY>r.top&&ev.clientY<r.bottom)targetI=+item.dataset.i;
    });
    if(targetI!==roMouseI&&targetI>=0&&!roData[targetI]?._done){
      const a=roData[roMouseI];
      roData.splice(roMouseI,1);
      roData.splice(targetI,0,a);
      roMouseI=targetI;
      renderROList();
      const newEl=list.querySelector('[data-i="'+targetI+'"]');
      if(newEl){newEl.style.opacity='0.5';}
    }
  }
  function roMEnd(){
    el.style.opacity='1';
    document.removeEventListener('mousemove',roMMove);
    document.removeEventListener('mouseup',roMEnd);
    roMouseI=-1;
  }
  document.addEventListener('mousemove',roMMove);
  document.addEventListener('mouseup',roMEnd);
}
function applyRO(){
  const done=roData.filter(e=>e._done);
  const pending=roData.filter(e=>!e._done);
  gymExs=[...done,...pending];
  gymSetsData=gymExs.map((e,i)=>{
    if(i<done.length)return gymSetsData[i]||[];
    return Array.from({length:e.sets},()=>({w:'',r:e.reps,done:false}));
  });
  gymIdx=done.length;gymSetIdx=0;
  closeM('m-ro');renderGym();
}

// ════════════════════════════════════════
// PROGRESS
// ════════════════════════════════════════
let pgFilter='All';
function renderProg2(){
  const names=['All',...exercises.map(e=>e.name)];
  document.getElementById('pg-fbar').innerHTML=names.slice(0,15).map(n=>
    '<button class="fbtn'+(pgFilter===n?' active':'')+'" onclick="pgFilter=\''+n+'\';renderProg2()">'+n+'</button>'
  ).join('');
  const filtered=pgFilter==='All'?sessions:sessions.filter(s=>s.exName===pgFilter);
  const sorted=[...filtered].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const kpi=document.getElementById('sess-log');
  if(!sorted.length){
    kpi.innerHTML='<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40"><path d="M18 20V10M12 20V4M6 20v-6"/></svg><h3>No sessions yet</h3><p>Start your first gym session</p></div>';
    return;
  }
  const week=sessions.filter(s=>new Date(s.date)>new Date(Date.now()-7*864e5)).length;
  const maxW=sessions.reduce((a,s)=>Math.max(a,+s.weight||0),0);
  const totalSets=sessions.reduce((a,s)=>a+(+s.sets||0),0);
  kpi.innerHTML=
    '<div class="kpi-grid">'+
      '<div class="kpi-card"><div class="kpi-lbl">هذا الأسبوع</div><div class="kpi-val">'+week+'</div><div class="kpi-unit">sessions</div></div>'+
      '<div class="kpi-card"><div class="kpi-lbl">الإجمالي</div><div class="kpi-val">'+sessions.length+'</div><div class="kpi-unit">sessions</div></div>'+
      '<div class="kpi-card"><div class="kpi-lbl">أعلى وزن</div><div class="kpi-val">'+maxW+'</div><div class="kpi-unit">'+cfg.unit+'</div></div>'+
      '<div class="kpi-card"><div class="kpi-lbl">إجمالي Sets</div><div class="kpi-val">'+totalSets+'</div><div class="kpi-unit">sets</div></div>'+
    '</div>'+
    sorted.map(s=>
      '<div class="sess-card">'+
        '<div style="display:flex;align-items:center;gap:var(--sp2);margin-bottom:var(--sp3)">'+
          '<span class="sess-date">'+new Date(s.date).toLocaleDateString('en')+'</span>'+
          (s.pr?'<span class="pr-badge">PR 🏆</span>':'')+
          '<div style="flex:1"></div>'+
          '<button class="btn btn-sec btn-sm" style="padding:4px 8px" onclick="editSess(\''+s.id+'\')" title="تعديل">✏️</button>'+'<button class="btn btn-d btn-sm" onclick="delSess(\''+s.id+'\')">🗑️</button>'+
        '</div>'+
        '<div style="font-weight:800;font-family:var(--fe);font-size:var(--txsm)">'+esc(s.exName||s.exId||'')+'</div>'+
        '<div style="display:flex;gap:var(--sp5);margin-top:var(--sp3)">'+
          '<div><div style="font-size:var(--txs);color:var(--mu)">Sets</div><div style="font-weight:900;font-family:var(--fe)">'+s.sets+'</div></div>'+
          '<div><div style="font-size:var(--txs);color:var(--mu)">Reps</div><div style="font-weight:900;font-family:var(--fe)">'+s.reps+'</div></div>'+
          '<div><div style="font-size:var(--txs);color:var(--mu)">Weight</div><div style="font-weight:900;font-family:var(--fe)">'+s.weight+' '+cfg.unit+'</div></div>'+
          (s.pain>0?'<div><div style="font-size:var(--txs);color:var(--mu)">Pain</div><div style="font-weight:900;font-family:var(--fe);color:var(--err)">'+s.pain+'/5</div></div>':'')+
        '</div>'+
        (s.notes?'<div style="margin-top:var(--sp2);font-size:var(--txs);color:var(--mu)">'+esc(s.notes)+'</div>':'')+
      '</div>'
    ).join('');

  setTimeout(renderStreak,80);
}
function openAddSess(){
  document.getElementById('sf-ex').innerHTML=exercises.map(e=>'<option value="'+e.id+'">'+e.name+'</option>').join('');
  document.getElementById('sf-date').value=new Date().toISOString().slice(0,10);
  document.getElementById('sf-sets').value=3;
  document.getElementById('sf-reps').value=10;
  document.getElementById('sf-wt').value='';
  document.getElementById('sf-pain').value=0;
  document.getElementById('sf-notes').value='';
  const lbl=document.getElementById('sf-wt-lbl');
  if(lbl)lbl.textContent='الوزن ('+cfg.unit+')';
  openM('m-sess');
}
function saveSessM(){
  const exId=document.getElementById('sf-ex').value;
  const ex=exercises.find(e=>e.id===exId);
  const wt=+document.getElementById('sf-wt').value||0;
  const prevMax=sessions.filter(s=>s.exId===exId).reduce((a,s)=>Math.max(a,+s.weight||0),0);
  sessions.push({
    id:'s'+Date.now(),exId,exName:ex?.name||exId,
    date:document.getElementById('sf-date').value,
    sets:+document.getElementById('sf-sets').value||1,
    reps:+document.getElementById('sf-reps').value||1,
    weight:wt,pain:+document.getElementById('sf-pain').value||0,
    notes:document.getElementById('sf-notes').value,
    pr:wt>prevMax&&wt>0
  });
  save('sess',sessions);
  closeM('m-sess');
  renderProg2();
  toast('Session saved ✓','s');
}
function delSess(id){
  confirm2('Delete','Remove this session record?',()=>{
    sessions=sessions.filter(s=>s.id!==id);
    save('sess',sessions);
    renderProg2();
  });
}

// ════════════════════════════════════════
// SUBSTITUTE MODAL
// ════════════════════════════════════════
let subGymIdx=-1,subSelId=null;
function openSubModal(gymI){
  subGymIdx=gymI;subSelId=null;
  const ex=gymExs[gymI];
  document.getElementById('sub-cur').textContent=ex.name;
  document.getElementById('sub-srch').value='';
  document.getElementById('sub-apply').disabled=true;
  renderSubList();openM('m-sub');
}
function renderSubList(){
  const q=document.getElementById('sub-srch').value.toLowerCase();
  const ex=gymExs[subGymIdx];
  const pref=ex.subs||[];
  const all=exercises.filter(e=>e.id!==ex.id&&(!q||e.name.toLowerCase().includes(q)||e.cat.toLowerCase().includes(q)));
  const sorted=[...all.filter(e=>pref.includes(e.id)),...all.filter(e=>!pref.includes(e.id))];
  document.getElementById('sub-list').innerHTML=sorted.map(e=>
    '<div class="sub-item'+(subSelId===e.id?' sel':'')+'" onclick="selSub(\''+e.id+'\')">'+
      (pref.includes(e.id)?'<span class="sel-star">★</span>':'<span style="width:14px;display:inline-block"></span>')+
      '<div class="sub-ico">'+(e.icon||'💪')+'</div>'+
      '<div style="flex:1"><div class="sub-nm">'+esc(e.name)+'</div><div class="sub-mt">'+e.cat+' · '+e.sets+'×'+e.reps+'</div></div>'+
    '</div>'
  ).join('');
}
function selSub(id){
  subSelId=id;
  document.getElementById('sub-apply').disabled=false;
  renderSubList();
}
function applySub(){if(subSelId&&subGymIdx>=0)swapGymEx(subSelId);closeM('m-sub');}

// ════════════════════════════════════════
// BLUETOOTH
// ════════════════════════════════════════
let btDev=null,btChar=null;
async function btConnect(){
  if(!navigator.bluetooth){toast('Bluetooth not supported','e');return;}
  try{
    toast('Looking for devices…','i');
    btDev=await navigator.bluetooth.requestDevice({filters:[{services:['heart_rate']}],optionalServices:['heart_rate']});
    const server=await btDev.gatt.connect();
    const service=await server.getPrimaryService('heart_rate');
    btChar=await service.getCharacteristic('heart_rate_measurement');
    btChar.addEventListener('characteristicvaluechanged',e=>{
      const hr=e.target.value.getUint8(1);
      const hw=document.getElementById('gym-hr-w');
      if(hw){hw.classList.add('show');hw.innerHTML='❤️ '+hr+' bpm';}
      document.getElementById('topbar-bt')?.classList.add('conn');
      document.getElementById('bt-hr').innerHTML='❤️ '+hr+' bpm';
      document.getElementById('bt-hr').style.display='flex';
    });
    await btChar.startNotifications();
    document.getElementById('bt-status').innerHTML='🟢 Connected: '+btDev.name;
    toast('Connected: '+btDev.name,'s');
  }catch(e){toast('Connection failed: '+e.message,'e');}
}

// ════════════════════════════════════════
// DATA EXPORT/IMPORT
// ════════════════════════════════════════
function exportD(fmt){
  if(fmt==='json'){
    const d={exercises,program,sessions,cfg,lastDay};
    const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gym-data.json';a.click();
  }else{
    const rows=[['Date','Exercise','Sets','Reps','Weight','Pain','Notes','PR'],
      ...sessions.map(s=>[s.date,s.exName||s.exId,s.sets,s.reps,s.weight,s.pain,s.notes,s.pr?'Yes':''])];
    const csv=rows.map(r=>r.map(v=>'"'+(v||'').toString().replace(/"/g,'""')+'"').join(',')).join('\n');
    const b=new Blob([csv],{type:'text/csv'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gym-sessions.csv';a.click();
  }
  toast('Exported ✓','s');
}
function importD(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    try{
      const d=JSON.parse(ev.target.result);
      if(d.exercises)exercises=[...exercises,...d.exercises.filter(ne=>!exercises.find(oe=>oe.id===ne.id))];
      if(d.program)program=[...program,...d.program.filter(nd=>!program.find(od=>od.id===nd.id))];
      if(d.sessions)sessions=[...sessions,...d.sessions.filter(ns=>!sessions.find(os=>os.id===ns.id))];
      if(d.lastDay)lastDay=d.lastDay;
      save('ex',exercises);save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}save('sess',sessions);save('lastday',lastDay);
      renderHome();toast('Imported ✓','s');
    }catch(err){toast('Invalid file format','e');}
  };
  r.readAsText(f);
}
function delProg(){
  confirm2('Delete Progress','Remove all session logs? This cannot be undone.',()=>{
    sessions=[];save('sess',sessions);renderProg2();toast('Sessions deleted');
  });
}
function resetAll(){
  confirm2('Full Reset','Delete ALL data including exercises and program?',()=>{
    exercises=[];program=[];sessions=[];lastDay='';
    ['ex','prog','sess','lastday','cfg'].forEach(k=>{try{localStorage.removeItem(LS+k);}catch(e){}});
    location.reload();
  });
}

// ════════════════════════════════════════
// UTILS
// ════════════════════════════════════════
function esc(s){
  return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


// Close swap panels when clicking outside
document.addEventListener('click', function(e){
  if(!e.target.closest('.isub-panel') && !e.target.closest('[onclick*="stopPropagation"]')){
    document.querySelectorAll('.isub-panel.open').forEach(function(p){p.classList.remove('open');});
  }
});
// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
(function init(){
  document.documentElement.setAttribute('data-theme',cfg.dark?'dark':'light');
  updateThemeIcon(cfg.dark);
  document.body.style.fontSize=cfg.fs+'px';
  initSettings();
  renderHome();
  renderEx();
  renderProg();
  renderProg2();

  initRipple();
})();


/* ═══════════════════════════════════════════
   ANIMA.JS — Smooth interaction engine
   ═══════════════════════════════════════════ */
const Anima = (function(){

  /* ── Ripple ── */
  function addRipple(el){
    el.classList.add('ripple-host');
    el.addEventListener('pointerdown',function(e){
      const r=el.getBoundingClientRect();
      const size=Math.max(r.width,r.height)*2;
      const rip=document.createElement('span');
      rip.className='ripple';
      rip.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      el.appendChild(rip);
      rip.addEventListener('animationend',()=>rip.remove());
    },{passive:true});
  }

  /* ── Page transition ── */
  function switchPage(from, to){
    if(!from||!to||from===to) return;
    from.classList.add('page-exit');
    to.style.display='block';
    to.classList.add('page-enter');
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        to.classList.add('page-enter-active');
        to.classList.remove('page-enter');
      });
    });
    setTimeout(()=>{
      from.classList.remove('active','page-exit');
      from.style.display='';
      to.classList.add('active');
      to.classList.remove('page-enter-active');
    },220);
  }

  /* ── Toast ── */
  let toastTimer;
  

  /* ── Counter animate ── */
  function animateNum(el, from, to, duration=400){
    const start=performance.now();
    const diff=to-from;
    function step(now){
      const p=Math.min((now-start)/duration,1);
      const ease=1-Math.pow(1-p,3);
      el.textContent=Math.round(from+diff*ease);
      el.classList.add('num-pop');
      if(p<1)requestAnimationFrame(step);
      else el.textContent=to;
    }
    requestAnimationFrame(step);
  }

  /* ── Set done flash ── */
  function flashSetRow(row){
    if(!row)return;
    row.classList.remove('just-done');
    void row.offsetWidth;
    row.classList.add('just-done');
  }

  /* ── Confetti burst ── */
  function confetti(x, y, count=18){
    const colors=['#4fa3af','#6daa45','#e8af34','#bb653b','#c94060','#a86fdf','#fff'];
    for(let i=0;i<count;i++){
      const p=document.createElement('div');
      p.className='confetti-p';
      const angle=Math.random()*360;
      const dist=60+Math.random()*120;
      const dur=0.8+Math.random()*0.7;
      p.style.cssText=`
        left:${x}px;top:${y}px;
        background:${colors[i%colors.length]};
        animation-duration:${dur}s;
        transform-origin:center center;
        transform:rotate(${angle}deg);
        margin-left:${(Math.random()-0.5)*dist}px;
      `;
      document.body.appendChild(p);
      p.addEventListener('animationend',()=>p.remove());
    }
  }

  /* ── Stagger list items ── */
  function staggerIn(parent, selector='.card,.gex-card,.sess-card,.ex-card,.day-card,.chk-item'){
    const items=parent.querySelectorAll(selector);
    items.forEach((el,i)=>{
      el.style.opacity='0';
      el.style.transform='translateY(14px)';
      el.style.transition='none';
      setTimeout(()=>{
        el.style.transition='opacity 0.22s ease, transform 0.25s var(--ease-out-expo)';
        el.style.opacity='1';
        el.style.transform='translateY(0)';
      },i*40+20);
    });
  }

  /* ── Init: add ripples to all primary/secondary buttons ── */
  function initRipple(){
    document.querySelectorAll('.btn-primary,.btn-sec,.btn-ghost,.nav-btn,.tb-ico').forEach(addRipple);
    // MutationObserver: ripple new buttons as they're added
    new MutationObserver(muts=>{
      muts.forEach(m=>{
        m.addedNodes.forEach(n=>{
          if(n.nodeType!==1)return;
          n.querySelectorAll&&n.querySelectorAll('.btn-primary,.btn-sec,.btn-ghost').forEach(addRipple);
          if(n.matches&&n.matches('.btn-primary,.btn-sec,.btn-ghost'))addRipple(n);
        });
      });
    }).observe(document.body,{childList:true,subtree:true});
  }

  return {addRipple,switchPage,toast,animateNum,flashSetRow,confetti,staggerIn,init};
})();

// Init on DOM ready
document.addEventListener('DOMContentLoaded', Anima.init);

// Override showPage to use animated transitions
const _origShowPage = typeof showPage === 'function' ? showPage : null;
function showPage(id){
  const pages = document.querySelectorAll('.page');
  const current = [...pages].find(p=>p.classList.contains('active'));
  const next = document.getElementById('p-'+id) || document.getElementById(id);
  if(next && current && next !== current){
    pages.forEach(p=>{ if(p!==next&&p!==current){ p.classList.remove('active'); p.style.display=''; } });
    Anima.switchPage(current, next);
  } else if(next && !current){
    next.classList.add('active');
  }
  // Update nav
  document.querySelectorAll('.nav-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.page===id || b.getAttribute('onclick')?.includes("'"+id+"'") || b.getAttribute('onclick')?.includes('"'+id+'"'));
  });
  document.getElementById('topbar-title').textContent =
    {home:'🏠 الرئيسية',prog:'📋 التمارين',progress:'📊 التقدم',settings:'⚙️ الإعدادات'}[id]||'';
}

// Override toast calls in app to use Anima.toast
const _showToast = typeof showToast === 'function' ? showToast : null;
function showToast(msg,icon,dur){Anima.toast(msg,icon||'✓',dur||2200);}

// Animate stagger when pages become visible
const _pagesObs = new MutationObserver(muts=>{
  muts.forEach(m=>{
    if(m.target.classList.contains('active')){
      setTimeout(()=>Anima.staggerIn(m.target),30);
    }
  });
});
document.querySelectorAll('.page').forEach(p=>{
  _pagesObs.observe(p,{attributes:true,attributeFilter:['class']});
});


// ════════════════════════════════════════
// SERVICE WORKER (PWA offline support)
// ════════════════════════════════════════
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(r=>console.log('SW:',r.scope))
    .catch(e=>console.warn('SW err:',e));
}

let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredPrompt=e;
  // Show install banner
  const banner=document.createElement('div');
  banner.id='install-banner';
  banner.innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--pr);color:#fff;position:fixed;bottom:72px;left:12px;right:12px;border-radius:14px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.4);font-size:14px;">
      <span style="font-size:24px">🏋️</span>
      <span style="flex:1;font-weight:600">ثبّت التطبيق على شاشتك الرئيسية!</span>
      <button onclick="installPWA()" style="background:#fff;color:var(--pr);border:none;border-radius:8px;padding:6px 12px;font-weight:700;cursor:pointer">تثبيت</button>
      <button onclick="this.closest('#install-banner').remove()" style="background:transparent;color:#fff;border:none;font-size:18px;cursor:pointer">×</button>
    </div>`;
  document.body.appendChild(banner);
});
function installPWA(){
  if(!deferredPrompt)return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(()=>{deferredPrompt=null;const b=document.getElementById('install-banner');if(b)b.remove();});
}
window.addEventListener('appinstalled',()=>{const b=document.getElementById('install-banner');if(b)b.remove();});


(function(){
  history.pushState({app:true},'','');
  window.addEventListener('popstate',function(){
    const openModal=document.querySelector('.modal-bd.active');
    if(openModal){closeM(openModal.id);history.pushState({app:true},'','');return;}
    const sb=document.getElementById('sidebar');
    if(sb&&sb.classList.contains('open')){closeSB();history.pushState({app:true},'','');return;}
    const gym=document.getElementById('gym');
    if(gym&&gym.classList.contains('active')){endNow();history.pushState({app:true},'','');return;}
    history.pushState({app:true},'','');
  });
})();

function editSess(id){
  const s=sessions.find(x=>x.id===id);
  if(!s)return;
  document.getElementById('ess-id').value=id;
  document.getElementById('ess-ex').innerHTML=exercises.map(e=>'<option value="'+e.id+'"'+(e.id===s.exId?' selected':'')+'>'+e.name+'</option>').join('');
  document.getElementById('ess-date').value=s.date?s.date.slice(0,10):'';
  document.getElementById('ess-sets').value=s.sets||'';
  document.getElementById('ess-reps').value=s.reps||'';
  document.getElementById('ess-wt').value=s.weight||'';
  document.getElementById('ess-pain').value=s.pain||0;
  document.getElementById('ess-notes').value=s.notes||'';
  openM('m-edit-sess');
}
function saveEditSess(){
  const id=document.getElementById('ess-id').value;
  const idx=sessions.findIndex(x=>x.id===id);
  if(idx===-1)return;
  const exId=document.getElementById('ess-ex').value;
  const ex=exercises.find(e=>e.id===exId);
  sessions[idx]={
    ...sessions[idx],
    exId, exName:ex?.name||exId,
    date:document.getElementById('ess-date').value,
    sets:+document.getElementById('ess-sets').value||1,
    reps:+document.getElementById('ess-reps').value||0,
    weight:+document.getElementById('ess-wt').value||0,
    pain:+document.getElementById('ess-pain').value||0,
    notes:document.getElementById('ess-notes').value.trim()
  };
  save('sess',sessions);
  closeM('m-edit-sess');
  renderProg2();
  toast('تم التحديث ✓','s');
}

function openNewProgram(id){
  document.getElementById('nprog-id').value=id||'';
  document.getElementById('m-new-prog-title').textContent=id?'تعديل البرنامج':'برنامج جديد';
  const prog=id?programs.find(p=>p.id===id):null;
  document.getElementById('nprog-name').value=prog?prog.name:'';
  openM('m-new-prog');
}
function saveNewProgram(){
  const name=document.getElementById('nprog-name').value.trim();
  if(!name){toast('أدخل اسم البرنامج','e');return;}
  const id=document.getElementById('nprog-id').value;
  if(id){
    const p=programs.find(x=>x.id===id);
    if(p){p.name=name;save('programs',programs);}
  } else {
    const pid='p'+Date.now();
    programs.push({id:pid,name,days:[]});
    activeProgramId=pid;
    save('programs',programs);save('activeProg',activeProgramId);
    syncProgram();
  }
  closeM('m-new-prog');
  renderProg();
  toast('تم الحفظ ✓','s');
}
function activateProgram(id){
  activeProgramId=id;
  save('activeProg',activeProgramId);
  syncProgram();
  renderProg();
  toast('تم تفعيل البرنامج ✓','s');
}
function renameProgram(id){openNewProgram(id);}
function deleteProgram(id){
  confirm2('حذف البرنامج','سيتم حذف هذا البرنامج وأيامه؟',()=>{
    programs=programs.filter(p=>p.id!==id);
    if(activeProgramId===id)activeProgramId=programs[0]?.id||'';
    save('programs',programs);save('activeProg',activeProgramId);
    syncProgram();renderProg();
    toast('تم الحذف','e');
  });
}

// Patch: keep programs in sync with program changes
const _origSaveProgDays=()=>{
  const ap=getActiveProgram();
  if(ap){ap.days=program;save('programs',programs);}
  save('prog',program);{const _ap=getActiveProgram();if(_ap){_ap.days=program;save('programs',programs);}}
};



// ══════════════════════════════════════════════════
// PROFILE & WEIGHT TRACKING
// ══════════════════════════════════════════════════
let chartSeries={weight:true,sessions:true,volume:true};
const CC={weight:'#4fa3af',sessions:'#6daa45',volume:'#e8af34'};
const CN={weight:'الوزن',sessions:'الجلسات',volume:'الحجم'};

// ── Collapsible sections
function csToggle(id){
  const body=document.getElementById('csb-'+id.replace('cs-',''));
  const arr=document.getElementById('csa-'+id.replace('cs-',''));
  if(!body)return;
  const open=body.style.display==='none'||body.style.display==='';
  body.style.display=open?'block':'none';
  if(arr)arr.classList.toggle('open',open);
  if(open&&id==='cs-chart')setTimeout(renderChart,60);
}

// ── Lightbox
function openLightbox(src){
  const lb=document.getElementById('lightbox');
  const img=document.getElementById('lb-img');
  if(!lb||!img)return;
  img.src=src;
  lb.classList.add('lb-open');
}
function closeLightbox(){
  const lb=document.getElementById('lightbox');
  if(lb)lb.classList.remove('lb-open');
}

// ── Profile Card
function updateProfileCard(){
  const p=profile;
  const g=id=>document.getElementById(id);
  const av=g('pf-av'),dn=g('pf-dn'),ds=g('pf-ds'),bmiEl=g('pf-bmi'),bmiLbl=g('pf-bmi-lbl');
  const bar=g('pf-prog-bar'),barLbl=g('pf-prog-lbl'),sLbl=g('pf-start-lbl'),eLbl=g('pf-end-lbl');
  const sub=g('pf-hdr-sub');
  if(!av)return;
  const nm=p.name||'';
  av.textContent=nm?nm.trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase():'?';
  if(dn)dn.textContent=nm||'الملف الشخصي';
  const parts=[];
  if(p.age)parts.push(p.age+' سنة');
  if(p.height)parts.push(p.height+' cm');
  if(p.weight)parts.push(p.weight+' kg');
  if(ds)ds.textContent=parts.join(' · ')||'أضف بياناتك';
  if(sub)sub.textContent=nm?(nm+' · '+p.weight+' kg'):'اضغط لعرض / تعديل';
  if(p.weight&&p.height){
    const bmi=p.weight/((p.height/100)**2);
    if(bmiEl)bmiEl.textContent=bmi.toFixed(1);
    let cat,col;
    if(bmi<18.5){cat='نقص الوزن';col='#4fa3af';}
    else if(bmi<25){cat='مثالي ✓';col='#6daa45';}
    else if(bmi<30){cat='زيادة وزن';col='#e8af34';}
    else{cat='سمنة';col='#c94060';}
    if(bmiLbl){bmiLbl.textContent=cat;bmiLbl.style.color=col;}
  }
  const goal=p.goal||0,curr=p.weight||0;
  const startW=weightLog.length?weightLog[0].w:curr;
  if(goal&&curr&&startW){
    let pct;
    if(goal<startW)pct=startW===curr?0:Math.max(0,Math.min(100,((startW-curr)/(startW-goal))*100));
    else if(goal>startW)pct=startW===curr?0:Math.max(0,Math.min(100,((curr-startW)/(goal-startW))*100));
    else pct=100;
    if(bar)bar.style.width=pct.toFixed(0)+'%';
    const diff=(curr-goal).toFixed(1);
    if(barLbl)barLbl.textContent=+diff>0?'متبقي '+Math.abs(diff)+' kg':+diff===0?'وصلت للهدف 🎉':'تجاوزت الهدف 💪';
    if(sLbl)sLbl.textContent=startW+' kg';
    if(eLbl)eLbl.textContent=goal+' kg';
  }
}

function initProfile(){
  const p=profile,g=id=>document.getElementById(id);
  if(g('pf-name'))g('pf-name').value=p.name||'';
  if(g('pf-age'))g('pf-age').value=p.age||'';
  if(g('pf-height'))g('pf-height').value=p.height||'';
  if(g('pf-weight'))g('pf-weight').value=p.weight||'';
  if(g('pf-goal'))g('pf-goal').value=p.goal||'';
  updateProfileCard();
  renderWeightLog();
}
function saveProfile(){
  const g=id=>document.getElementById(id);
  profile.name=(g('pf-name')?.value||'').trim();
  profile.age=+(g('pf-age')?.value)||0;
  profile.height=+(g('pf-height')?.value)||0;
  profile.weight=+(g('pf-weight')?.value)||0;
  profile.goal=+(g('pf-goal')?.value)||0;
  save('profile',profile);
}
function saveProfileFull(){
  saveProfile();updateProfileCard();toast('تم حفظ البروفايل ✓','s');
}
function logTodayWeight(){
  const wv=+(document.getElementById('pf-weight')?.value||profile.weight||0);
  if(!wv){toast('أدخل الوزن أولاً','e');return;}
  const today=new Date().toISOString().slice(0,10);
  const ei=weightLog.findIndex(x=>x.date===today);
  if(ei>=0)weightLog[ei].w=wv; else weightLog.push({date:today,w:wv});
  weightLog.sort((a,b)=>a.date.localeCompare(b.date));
  save('weightLog',weightLog);
  profile.weight=wv;save('profile',profile);
  updateProfileCard();renderWeightLog();renderChart();
  toast('تم تسجيل الوزن ✓','s');
}
function delWeightEntry(date){
  weightLog=weightLog.filter(x=>x.date!==date);
  save('weightLog',weightLog);renderWeightLog();renderChart();
}
function renderWeightLog(){
  const el=document.getElementById('weight-log-list');if(!el)return;
  const last=[...weightLog].reverse().slice(0,8);
  if(!last.length){el.innerHTML='<div style="text-align:center;padding:var(--sp4);color:var(--mu);font-size:var(--txs)">لا يوجد سجل وزن بعد<br>اضغط «سجّل الوزن» لإضافة أول قراءة</div>';return;}
  el.innerHTML='<div style="font-weight:700;font-size:var(--txs);color:var(--mu);margin-bottom:var(--sp3);padding-bottom:var(--sp2);border-bottom:1px solid var(--dv)">آخر '+last.length+' قراءات</div>'+
    last.map((e,i)=>{
      const prev=last[i+1];const diff=prev?+(e.w-prev.w).toFixed(1):0;
      const col=diff>0?'var(--war)':diff<0?'var(--suc)':'var(--mu)';
      return '<div class="wlog-row">'+
        '<div style="font-size:var(--txs);color:var(--mu);flex:1">'+e.date+'</div>'+
        '<div style="font-weight:900;font-family:var(--fe);font-size:var(--txsm)">'+e.w+' <span style="font-size:var(--txs);font-weight:400;color:var(--mu)">kg</span></div>'+
        (prev?'<div style="font-size:var(--txs);color:'+col+';font-weight:700;min-width:38px;text-align:left">'+(diff!==0?(diff>0?'+':'')+diff:'—')+'</div>':'')+
        '<button onclick="delWeightEntry(\''+e.date+'\')" style="background:none;border:none;color:var(--mu);padding:4px 8px;cursor:pointer;opacity:.5;font-size:var(--txs)">✕</button>'+
      '</div>';
    }).join('');
}

// ── Progress Chart
function renderChart(){
  const svg=document.getElementById('progress-chart');if(!svg)return;
  const rangeEl=document.getElementById('chart-range');
  const days=rangeEl?+rangeEl.value:30;
  const W=Math.max(280,svg.parentElement?.offsetWidth||window.innerWidth-40);
  const H=200,PAD={t:20,r:12,b:32,l:34};
  const cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b;
  const now=Date.now(),cutoff=now-days*864e5;
  // Build buckets
  const step=days>90?7:1;
  const bkts=[];let d=new Date(cutoff);d.setHours(0,0,0,0);
  const nd=new Date();nd.setHours(23,59,59,999);
  while(d<=nd){bkts.push(new Date(d));d=new Date(+d+step*864e5);}
  if(!bkts.length){svg.innerHTML='';return;}
  function bktDate(i){return bkts[i].toISOString().slice(0,10);}
  function nextDate(i){return i+1<bkts.length?bkts[i+1].toISOString().slice(0,10):'9999';}
  function inBkt(ds,i){return ds>=bktDate(i)&&ds<nextDate(i);}
  const wArr=bkts.map((_,i)=>{const m=weightLog.filter(x=>inBkt(x.date,i));return m.length?m.reduce((a,x)=>a+x.w,0)/m.length:null;});
  const sArr=bkts.map((_,i)=>sessions.filter(s=>inBkt((s.date||'').slice(0,10),i)).length);
  const vArr=bkts.map((_,i)=>sessions.filter(s=>inBkt((s.date||'').slice(0,10),i)).reduce((a,s)=>a+(+s.weight||0)*(+s.reps||0)*(+s.sets||0),0)/1000);
  // KPI
  const kpiEl=document.getElementById('chart-kpi');
  if(kpiEl){
    const since=new Date(cutoff).toISOString().slice(0,10);
    const ts=sessions.filter(s=>(s.date||'')>=since).length;
    const mw=sessions.reduce((a,s)=>Math.max(a,+s.weight||0),0);
    const lw=weightLog.length?weightLog[weightLog.length-1].w:null;
    const fw=weightLog.length?weightLog[0].w:null;
    const wd=lw&&fw?(lw-fw).toFixed(1):null;
    kpiEl.innerHTML=[
      {l:'جلسات',v:ts,c:'var(--suc)'},
      {l:'أعلى وزن',v:mw?mw+' kg':'—',c:'var(--war)'},
      {l:'تغيّر الوزن',v:wd?(+wd>0?'+':'')+wd+' kg':'—',c:wd&&+wd<0?'var(--suc)':'var(--err)'}
    ].map(k=>'<div class="chart-kpi-card"><div class="kv" style="color:'+k.c+'">'+k.v+'</div><div class="kl">'+k.l+'</div></div>').join('');
  }
  // Toggles
  const tEl=document.getElementById('chart-toggles');
  if(tEl)tEl.innerHTML=Object.keys(chartSeries).map(k=>
    '<button class="chart-toggle-btn'+(chartSeries[k]?'':' ct-off')+'" style="color:'+CC[k]+';border-color:'+CC[k]+'" onclick="toggleChartSer(\''+k+'\')" id="ctb-'+k+'">'+
    '<span style="width:10px;height:10px;border-radius:50%;background:'+CC[k]+';display:inline-block"></span>'+CN[k]+'</button>'
  ).join('');
  function norm(arr){const v=arr.filter(x=>x!==null&&x!==0);if(!v.length)return arr.map(()=>null);const mn=Math.min(...v),mx=Math.max(...v);return arr.map(x=>x===null||x===0?null:mn===mx?.5:(x-mn)/(mx-mn));}
  const wN=norm(wArr),sN=norm(sArr),vN=norm(vArr),n=bkts.length;
  const xp=i=>PAD.l+i/Math.max(n-1,1)*cW;
  const yp=v=>PAD.t+cH*(1-v);
  function buildPath(nArr,col){
    const pts=nArr.map((v,i)=>v===null?null:{x:xp(i),y:yp(v)});
    let line='',area='',prev=null;
    pts.forEach((p,i)=>{
      if(!p){prev=null;return;}
      if(!prev){line+='M'+p.x.toFixed(1)+' '+p.y.toFixed(1);area+='M'+p.x.toFixed(1)+' '+(PAD.t+cH)+' L'+p.x.toFixed(1)+' '+p.y.toFixed(1);}
      else{const cx=(prev.x+p.x)/2;line+=' C'+cx.toFixed(1)+' '+prev.y.toFixed(1)+' '+cx.toFixed(1)+' '+p.y.toFixed(1)+' '+p.x.toFixed(1)+' '+p.y.toFixed(1);area+=' L'+p.x.toFixed(1)+' '+p.y.toFixed(1);}
      prev=p;
    });
    if(!line)return'';
    const lv=pts.slice().reverse().find(p=>p);
    if(lv)area+=' L'+lv.x.toFixed(1)+' '+(PAD.t+cH)+' Z';
    const dots=pts.filter(p=>p).map(p=>'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="3.5" fill="'+col+'" stroke="var(--sf2)" stroke-width="1.5"/>').join('');
    return'<path d="'+area+'" fill="'+col+'" opacity=".12"/>'+
           '<path d="'+line+'" fill="none" stroke="'+col+'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'+dots;
  }
  const grids=[0,.25,.5,.75,1].map(v=>'<line x1="'+PAD.l+'" y1="'+yp(v).toFixed(1)+'" x2="'+(PAD.l+cW)+'" y2="'+yp(v).toFixed(1)+'" stroke="var(--br)" stroke-width="1" stroke-dasharray="4,4"/>').join('');
  const lStep=Math.max(1,Math.floor(n/5));
  const xlbls=bkts.map((b,i)=>i%lStep===0||i===n-1?'<text x="'+xp(i).toFixed(1)+'" y="'+(H-5)+'" text-anchor="middle" style="font-size:9px;fill:var(--mu);font-family:var(--fe)">'+b.toISOString().slice(5,10)+'</text>':'').join('');
  svg.setAttribute('viewBox','0 0 '+W+' '+H);
  svg.innerHTML='<rect width="'+W+'" height="'+H+'" fill="none"/>'+grids+xlbls+
    (chartSeries.volume?buildPath(vN,CC.volume):'')+
    (chartSeries.sessions?buildPath(sN,CC.sessions):'')+
    (chartSeries.weight?buildPath(wN,CC.weight):'');
}
function toggleChartSer(k){chartSeries[k]=!chartSeries[k];renderChart();}
const renderProgressChart=renderChart;

// ══════════════════════════════════════════════════
// ADVANCED EXPORT / IMPORT
// ══════════════════════════════════════════════════
let _impData=null;

function expTabSwitch(tab){
  document.getElementById('ep-export').style.display=tab==='export'?'':'none';
  document.getElementById('ep-import').style.display=tab==='import'?'':'none';
  document.getElementById('etab-export').classList.toggle('active',tab==='export');
  document.getElementById('etab-import').classList.toggle('active',tab==='import');
}
function _ck(id){return document.getElementById(id)?.checked!==false;}
function advExport(fmt){
  const d={};
  if(_ck('ec-prog')){d.programs=programs;d.activeProgramId=activeProgramId;}
  if(_ck('ec-ex'))d.exercises=exercises;
  if(_ck('ec-sess'))d.sessions=sessions;
  if(_ck('ec-prof'))d.profile=profile;
  if(_ck('ec-wlog'))d.weightLog=weightLog;
  if(_ck('ec-cfg'))d.cfg=cfg;
  d._exported=new Date().toISOString();d._version=2;
  if(fmt==='csv'){
    const rows=[['Date','Exercise','Sets','Reps','Weight(kg)','Volume','Pain','Notes','PR','Program']];
    (d.sessions||[]).forEach(s=>rows.push([s.date,s.exName||s.exId,s.sets,s.reps,s.weight,(+s.sets||0)*(+s.reps||0)*(+s.weight||0),s.pain||'',s.notes||'',s.pr?'Yes':'',s.progId||'']));
    const csv=rows.map(r=>r.map(v=>'"'+(v||'').toString().replace(/"/g,'""')+'"').join(',')).join('\n');
    const b=new Blob([csv],{type:'text/csv'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gym-export-'+new Date().toISOString().slice(0,10)+'.csv';a.click();
  }else{
    const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gym-export-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  }
  toast('تم التصدير ✓','s');
}
function exportPrograms(){
  const d={programs,activeProgramId,_exported:new Date().toISOString(),_type:'programs-only'};
  const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gym-programs-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  toast('تم تصدير البرامج ✓','s');
}
function dzDrop(e){
  e.preventDefault();
  document.getElementById('drop-zone')?.classList.remove('dz-over');
  const f=e.dataTransfer?.files[0];
  if(f)_readImpFile(f);
}
function impPreview(e){
  const f=e.target.files[0];if(f)_readImpFile(f);
}
function _readImpFile(file){
  const r=new FileReader();
  r.onload=ev=>{
    try{
      _impData=JSON.parse(ev.target.result);
      const lines=[];
      if(_impData.programs)lines.push('📋 برامج: '+_impData.programs.length+' برنامج');
      if(_impData.exercises)lines.push('🏋️ تمارين: '+_impData.exercises.length+' تمرين');
      if(_impData.sessions)lines.push('📊 جلسات: '+_impData.sessions.length+' جلسة');
      if(_impData.weightLog)lines.push('⚖️ سجل الوزن: '+_impData.weightLog.length+' قراءة');
      if(_impData.profile&&_impData.profile.name)lines.push('👤 بروفايل: '+_impData.profile.name);
      if(_impData._exported)lines.push('📅 تاريخ التصدير: '+_impData._exported.slice(0,10));
      const prev=document.getElementById('imp-preview');
      const body=document.getElementById('imp-preview-body');
      if(body)body.innerHTML=lines.map(l=>'<div style="padding:3px 0;border-bottom:1px solid var(--dv)">'+l+'</div>').join('');
      if(prev)prev.style.display='';
      document.getElementById('drop-zone').style.display='none';
    }catch(err){toast('ملف غير صالح — تأكد أنه JSON صحيح','e');_impData=null;}
  };
  r.readAsText(file);
}
function impCancel(){
  _impData=null;
  const prev=document.getElementById('imp-preview');const dz=document.getElementById('drop-zone');
  if(prev)prev.style.display='none';if(dz)dz.style.display='';
  const fi=document.getElementById('imp-file');if(fi)fi.value='';
}
function impConfirm(){
  if(!_impData){toast('لا يوجد ملف محدد','e');return;}
  const mode=document.getElementById('imp-mode')?.value||'merge';
  if(mode==='replace'){
    if(_impData.programs){programs=_impData.programs;activeProgramId=_impData.activeProgramId||'';save('programs',programs);save('activeProg',activeProgramId);syncProgram();}
    if(_impData.exercises){exercises=_impData.exercises;save('ex',exercises);}
    if(_impData.sessions){sessions=_impData.sessions;save('sess',sessions);}
    if(_impData.profile){profile=_impData.profile;save('profile',profile);}
    if(_impData.weightLog){weightLog=_impData.weightLog;save('weightLog',weightLog);}
    if(_impData.cfg){cfg=Object.assign(cfg,_impData.cfg);save('cfg',cfg);}
  }else if(mode==='prog-only'){
    if(_impData.programs){
      _impData.programs.forEach(np=>{if(!programs.find(p=>p.id===np.id))programs.push(np);});
      save('programs',programs);
    }
  }else{// merge
    if(_impData.programs)_impData.programs.forEach(np=>{if(!programs.find(p=>p.id===np.id))programs.push(np);});
    if(_impData.exercises)_impData.exercises.forEach(ne=>{if(!exercises.find(e=>e.id===ne.id))exercises.push(ne);});
    if(_impData.sessions)_impData.sessions.forEach(ns=>{if(!sessions.find(s=>s.id===ns.id))sessions.push(ns);});
    if(_impData.weightLog)_impData.weightLog.forEach(nw=>{if(!weightLog.find(w=>w.date===nw.date))weightLog.push(nw);});
    save('programs',programs);save('ex',exercises);save('sess',sessions);save('weightLog',weightLog);
    if(_impData.profile&&!profile.name){profile=_impData.profile;save('profile',profile);}
    syncProgram();
  }
  impCancel();renderEx();renderProg();initSettings();
  toast('تم الاستيراد بنجاح ✓','s');
}


// ══════════════════════════════════════════════════════════
// v6 NEW FEATURES — Streak, PR, Charts, Settings
// ══════════════════════════════════════════════════════════

// ── Progress Tabs
function progTab(tab){
  ['log','pr','ana'].forEach(t=>{
    const p=document.getElementById('ptp-'+t);
    const b=document.getElementById('ptab-'+t);
    if(p)p.style.display=t===tab?'block':'none';
    if(b)b.classList.toggle('active',t===tab);
  });
  if(tab==='pr')renderPRs();
  if(tab==='ana'){renderStreak();renderMuscleChart();renderMonthCompare();renderVolWeekChart();}
}
function progTabInit(){
  const log=document.getElementById('ptp-log');
  if(log&&log.style.display==='none')progTab('log');
}
function navToTab(page,tab){
  const btn=document.querySelector('[data-page="'+page+'"]');
  if(btn)navTo(btn);
  setTimeout(()=>progTab(tab),160);
}

// ── Streak
function calcStreak(){
  const dates=[...new Set(sessions.map(s=>(s.date||'').slice(0,10)).filter(Boolean))].sort();
  if(!dates.length)return{cur:0,best:0,lastSeven:[]};
  const today=new Date();today.setHours(0,0,0,0);
  const toTs=dt=>new Date(dt).setHours(0,0,0,0);
  let cur=0,check=new Date(today);
  for(let i=0;i<400;i++){
    const ds=check.toISOString().slice(0,10);
    if(dates.includes(ds)){cur++;check=new Date(+check-864e5);}
    else if(i===0){check=new Date(+check-864e5);}
    else break;
  }
  let best=0,chain=0;
  dates.forEach((dt,i)=>{
    chain=(i>0&&toTs(dt)-toTs(dates[i-1])===864e5)?chain+1:1;
    best=Math.max(best,chain);
  });
  best=Math.max(best,cur);
  const lastSeven=[];
  for(let i=6;i>=0;i--){
    const day=new Date(today);day.setDate(day.getDate()-i);
    lastSeven.push({date:day.toISOString().slice(0,10),done:dates.includes(day.toISOString().slice(0,10))});
  }
  return{cur,best,lastSeven};
}
function renderStreak(){
  const{cur,best,lastSeven}=calcStreak();
  const g=id=>document.getElementById(id);
  if(g('streak-num'))g('streak-num').textContent=cur;
  if(g('streak-best'))g('streak-best').textContent=best;
  if(g('streak-sub'))g('streak-sub').textContent=cur>0?'استمر، أنت رائع! 💪':'سجّل تمريناً لتبدأ 🔥';
  if(g('streak-dots'))g('streak-dots').innerHTML=lastSeven.map(d=>'<div class="streak-dot'+(d.done?' done':'')+'" title="'+d.date+'"></div>').join('');
  if(g('h-streak-txt'))g('h-streak-txt').textContent=(cur||0)+' يوم 🔥';
  if(g('h-streak-sub'))g('h-streak-sub').textContent=best>cur?'أفضل سلسلة: '+best+' يوم':'اضغط لعرض التحليلات';
  if(g('h-streak-dots')){
    g('h-streak-dots').innerHTML=lastSeven.map(d=>{
      const bg=d.done?'var(--gld)':'rgba(255,255,255,.2)';
      return '<div style="width:10px;height:10px;border-radius:50%;background:'+bg+'"></div>';
    }).join('');
  }
}

// ── PR Board
function calcPRs(){
  const map={};
  sessions.forEach(s=>{
    const key=s.exId||s.exName||'?';
    const ex=exercises.find(e=>e.id===s.exId)||{};
    const nm=s.exName||ex.name||s.exId||'تمرين';
    const w=+s.weight||0,r=+s.reps||0,st=+s.sets||0;
    if(!map[key]||w>map[key].w||(w===map[key].w&&r>map[key].r)){
      map[key]={key,nm,w,r,st,vol:w*r*st,date:s.date,cat:ex.cat||'—'};
    }
  });
  return Object.values(map).sort((a,b)=>b.w-a.w);
}
function renderPRs(){
  const el=document.getElementById('pr-board');if(!el)return;
  const prs=calcPRs();
  const prEl=document.getElementById('h-prs');if(prEl)prEl.textContent=prs.length;
  if(!prs.length){el.innerHTML='<div style="text-align:center;padding:var(--sp6);color:var(--mu)">لا توجد جلسات مسجّلة بعد 🏋️</div>';return;}
  const medals=['🥇','🥈','🥉'];
  el.innerHTML=prs.map((p,i)=>
    '<div class="pr-card'+(i<3?' is-pr':'')+'">'
    +'<div class="pr-rank" style="background:'+(i===0?'rgba(232,175,52,.25)':i===1?'rgba(200,200,200,.2)':i===2?'rgba(180,120,60,.2)':'var(--sf3)')+'">'+(medals[i]||'<span style="font-size:10px;color:var(--mu)">'+(i+1)+'</span>')+'</div>'
    +'<div style="flex:1;min-width:0"><div class="pr-nm">'+esc(p.nm)+'</div>'
    +'<div style="font-size:var(--txs);color:var(--mu)">'+p.date+' · '+p.r+' reps × '+p.st+' sets</div></div>'
    +'<div style="text-align:left;flex-shrink:0"><div class="pr-val">'+p.w+'<span style="font-size:var(--txs);font-weight:400;color:var(--mu)"> kg</span></div></div>'
    +'</div>'
  ).join('');
}

// ── Muscle Volume Chart
function renderMuscleChart(){
  const el=document.getElementById('muscle-chart');if(!el)return;
  const now=new Date();
  const m1=new Date(now.getFullYear(),now.getMonth(),1).toISOString().slice(0,10);
  const sess=sessions.filter(s=>(s.date||'')>=m1);
  const vol={};
  sess.forEach(s=>{
    const ex=exercises.find(e=>e.id===s.exId)||{};
    const cat=ex.cat||s.exName||'أخرى';
    vol[cat]=(vol[cat]||0)+(+s.weight||0)*(+s.reps||0)*(+s.sets||0);
  });
  const items=Object.entries(vol).sort((a,b)=>b[1]-a[1]);
  if(!items.length){el.innerHTML='<div style="text-align:center;padding:var(--sp4);color:var(--mu);font-size:var(--txs)">لا توجد جلسات هذا الشهر</div>';return;}
  const max=Math.max(...items.map(([,v])=>v))||1;
  const COLORS=['#4fa3af','#6daa45','#e8af34','#c94060','#9b59b6','#e67e22','#1abc9c'];
  el.innerHTML=items.map(([cat,v],i)=>{
    const pct=(v/max*100).toFixed(0);
    return '<div class="mchart-row">'
      +'<div class="mchart-lbl">'+esc(cat)+'</div>'
      +'<div class="mchart-bar-wrap"><div class="mchart-bar" style="width:'+pct+'%;background:'+COLORS[i%7]+'"></div></div>'
      +'<div class="mchart-val">'+(v/1000).toFixed(1)+'t</div>'
      +'</div>';
  }).join('');
}

// ── Weekly Volume Chart
function renderVolWeekChart(){
  const svg=document.getElementById('vol-week-chart');if(!svg)return;
  const W=Math.max(280,svg.parentElement?.offsetWidth||300),H=160;
  const PAD={t:16,r:12,b:28,l:36};
  const cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b;
  const now=new Date();now.setHours(23,59,59,999);
  const weeks=[];
  for(let i=7;i>=0;i--){
    const end=new Date(now);end.setDate(end.getDate()-i*7);
    const start=new Date(end);start.setDate(start.getDate()-6);start.setHours(0,0,0,0);
    const s0=start.toISOString().slice(0,10),e0=end.toISOString().slice(0,10);
    const vol=sessions.filter(s=>{const d=(s.date||'').slice(0,10);return d>=s0&&d<=e0;})
      .reduce((a,s)=>a+(+s.weight||0)*(+s.reps||0)*(+s.sets||0),0);
    weeks.push({label:end.toISOString().slice(5,10),vol:vol/1000});
  }
  const maxV=Math.max(...weeks.map(w=>w.vol),0.1);
  const xp=i=>PAD.l+i/(weeks.length-1)*cW;
  const yp=v=>PAD.t+cH*(1-(v/maxV));
  let line='',dots='';
  weeks.forEach((w,i)=>{
    const x=xp(i).toFixed(1),y=yp(w.vol).toFixed(1);
    line+=(i===0?'M':'L')+x+' '+y;
    dots+='<circle cx="'+x+'" cy="'+y+'" r="4" fill="var(--pri)" stroke="var(--sf2)" stroke-width="2"/>';
    dots+='<text x="'+x+'" y="'+(H-4)+'" text-anchor="middle" style="font-size:8px;fill:var(--mu)">'+w.label+'</text>';
  });
  const area=line+' L'+xp(7).toFixed(1)+' '+(PAD.t+cH)+' L'+xp(0).toFixed(1)+' '+(PAD.t+cH)+' Z';
  svg.setAttribute('viewBox','0 0 '+W+' '+H);
  svg.innerHTML='<rect width="'+W+'" height="'+H+'" fill="none"/>'
    +'<path d="'+area+'" fill="var(--pri)" opacity=".12"/>'
    +'<path d="'+line+'" fill="none" stroke="var(--pri)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'+dots;
}

// ── Month Comparison
function renderMonthCompare(){
  const el=document.getElementById('month-compare');if(!el)return;
  const now=new Date();
  function md(yr,mo){
    const s=new Date(yr,mo,1).toISOString().slice(0,10);
    const e=new Date(yr,mo+1,0).toISOString().slice(0,10);
    const ss=sessions.filter(s2=>{const d=(s2.date||'').slice(0,10);return d>=s&&d<=e;});
    return{sess:ss.length,vol:ss.reduce((a,s2)=>a+(+s2.weight||0)*(+s2.reps||0)*(+s2.sets||0),0)/1000};
  }
  const cm=md(now.getFullYear(),now.getMonth());
  const lm=md(now.getMonth()===0?now.getFullYear()-1:now.getFullYear(),now.getMonth()===0?11:now.getMonth()-1);
  const months=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const diff=cm.sess-lm.sess;
  function card(data,label,showDiff){
    const cls=showDiff?(diff>0?' better':diff<0?' worse':''):'';
    return '<div class="mc-card'+cls+'">'
      +'<div style="font-size:var(--txs);color:var(--mu);font-weight:700;margin-bottom:var(--sp2)">'+label+'</div>'
      +'<div style="font-size:2rem;font-weight:900;font-family:var(--fe)">'+data.sess+'</div>'
      +'<div style="font-size:var(--txs);color:var(--mu)">جلسة · '+data.vol.toFixed(1)+' طن</div>'
      +(showDiff&&diff!==0?'<div style="font-size:var(--txs);font-weight:700;color:'+(diff>0?'var(--suc)':'var(--err)')+';margin-top:4px">'+(diff>0?'▲+':'▼')+diff+' جلسة</div>':'')
      +'</div>';
  }
  el.innerHTML=card(lm,months[now.getMonth()===0?11:now.getMonth()-1],false)+card(cm,months[now.getMonth()],true);
}

// ── Reminder toggle
function toggleReminder(){
  const on=document.getElementById('s-remind')?.checked;
  const row=document.getElementById('remind-time-row');
  if(row)row.style.display=on?'':'none';
  if(on&&'Notification' in window)Notification.requestPermission();
  saveSets();
}
