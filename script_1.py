
# ─────────────────────────────────────────
# 2. ANIMATION JS ENGINE — inject before </script> closing
# ─────────────────────────────────────────
anim_js = """
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
  function toast(msg, icon='✓', duration=2000){
    let el=document.getElementById('toast');
    if(!el){el=document.createElement('div');el.id='toast';document.body.appendChild(el);}
    el.innerHTML=`<span>${icon}</span> ${msg}`;
    el.className='in';
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>{
      el.className='out';
    },duration);
  }

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
  function init(){
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
"""

# Insert before service worker code (which is before </script>)
marker = '// ════════════════════════════════════════\n// SERVICE WORKER (PWA offline support)'
if marker in content:
    content = content.replace(marker, anim_js + '\n\n' + marker)
    print("✅ Animation JS injected before SW code")
else:
    # fallback: before </script>
    content = content.replace('</script>\n</body>', anim_js + '\n</script>\n</body>')
    print("✅ Animation JS injected via fallback")

print(f"Total lines: {len(content.splitlines())}")
