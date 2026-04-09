
with open('/home/user/output/gym-trainer.html', 'r') as f:
    content = f.read()

# ─────────────────────────────────────────
# 1. ENHANCED ANIMATION CSS — inject before </style>
# ─────────────────────────────────────────
anim_css = """
/* ═══════════════════════════════════════════
   ANIMATION SYSTEM — Smooth & Native-feeling
   ═══════════════════════════════════════════ */

/* ── Easing tokens ── */
:root{
  --ease-out-expo: cubic-bezier(0.16,1,0.3,1);
  --ease-out-back: cubic-bezier(0.34,1.56,0.64,1);
  --ease-in-out:   cubic-bezier(0.4,0,0.2,1);
  --ease-spring:   cubic-bezier(0.175,0.885,0.32,1.275);
}

/* ── Page transitions ── */
.page{
  transition: opacity 0.22s var(--ease-out-expo),
              transform 0.22s var(--ease-out-expo);
  will-change: opacity, transform;
}
.page.page-exit{
  opacity:0;
  transform:translateX(20px) scale(0.98);
  pointer-events:none;
}
.page.page-enter{
  opacity:0;
  transform:translateX(-18px) scale(0.98);
}
.page.page-enter-active{
  opacity:1;
  transform:translateX(0) scale(1);
}

/* ── Modal enhanced ── */
.modal-box{
  animation: modalIn 0.3s var(--ease-out-expo) forwards;
}
.modal-bd.closing .modal-box{
  animation: modalOut 0.22s var(--ease-in-out) forwards;
}
@keyframes modalIn{
  from{transform:translateY(100%);opacity:0.6}
  to{transform:translateY(0);opacity:1}
}
@keyframes modalOut{
  from{transform:translateY(0);opacity:1}
  to{transform:translateY(100%);opacity:0}
}
.modal-bd{
  transition: background 0.25s ease;
}
.modal-bd.active{
  animation: backdropIn 0.25s ease forwards;
}
@keyframes backdropIn{
  from{background:rgba(0,0,0,0)}
  to{background:rgba(0,0,0,.65)}
}

/* ── Sidebar ── */
#sidebar{transition: transform 0.3s var(--ease-out-expo);}
#sb-bd{transition: opacity 0.28s ease;}

/* ── Nav bar active indicator ── */
.nav-btn{position:relative;transition:color 0.18s var(--ease-out-expo);}
.nav-btn::after{
  content:'';position:absolute;bottom:6px;left:50%;transform:translateX(-50%) scaleX(0);
  width:20px;height:3px;background:var(--pri);border-radius:var(--rfl);
  transition:transform 0.25s var(--ease-out-back);
}
.nav-btn.active::after{transform:translateX(-50%) scaleX(1);}

/* ── Buttons ── */
.btn{
  transition: background 0.15s ease, transform 0.12s var(--ease-out-back),
              box-shadow 0.15s ease, opacity 0.15s ease;
}
.btn:active{transform:scale(0.95);}
.btn-primary:active{box-shadow:0 0 0 4px var(--prhl);}

/* ── Cards & list items ── */
.card,.ex-card,.gex-card,.day-card,.sb-item,.chk-item,.ro-item,.sess-card{
  transition: background 0.15s ease, transform 0.15s var(--ease-out-expo),
              box-shadow 0.15s ease, opacity 0.18s ease;
}
.card:active,.ex-card:active,.day-card:active,.chk-item:active{
  transform:scale(0.985);
}

/* ── Input focus ring animation ── */
input:focus,select:focus,textarea:focus{
  transition: border-color 0.15s ease, box-shadow 0.2s var(--ease-out-expo);
}

/* ── Set row completion ── */
@keyframes setDone{
  0%  {transform:scale(1);background:transparent}
  30% {transform:scale(1.04);background:color-mix(in oklch,var(--suc) 18%,transparent)}
  100%{transform:scale(1);background:color-mix(in oklch,var(--suc) 6%,transparent)}
}
.set-row.just-done{animation:setDone 0.45s var(--ease-out-back) forwards;}

/* ── Ripple effect ── */
.ripple-host{position:relative;overflow:hidden;}
@keyframes ripple{
  to{transform:scale(4);opacity:0}
}
.ripple{
  position:absolute;border-radius:50%;transform:scale(0);
  background:rgba(255,255,255,.18);animation:ripple 0.5s linear;
  pointer-events:none;
}

/* ── Number counter animation ── */
@keyframes numPop{
  0%  {transform:translateY(6px);opacity:0}
  60% {transform:translateY(-2px)}
  100%{transform:translateY(0);opacity:1}
}
.num-pop{animation:numPop 0.22s var(--ease-out-back);}

/* ── Progress bar ── */
.gym-progress-fill{
  transition:width 0.4s var(--ease-out-expo);
}

/* ── Timer pulse ── */
@keyframes timerPulse{
  0%,100%{opacity:1;transform:scale(1)}
  50%{opacity:0.75;transform:scale(1.04)}
}
.timer-active{animation:timerPulse 1s ease-in-out infinite;}

/* ── Toast notification ── */
@keyframes toastIn{
  from{transform:translateY(20px) scale(0.95);opacity:0}
  to{transform:translateY(0) scale(1);opacity:1}
}
@keyframes toastOut{
  from{transform:translateY(0) scale(1);opacity:1}
  to{transform:translateY(20px) scale(0.95);opacity:0}
}
#toast{
  position:fixed;bottom:calc(var(--nav) + 12px);left:50%;
  transform:translateX(-50%);
  background:var(--sf2);color:var(--tx);
  border:1px solid var(--br);border-radius:var(--rfl);
  padding:10px 20px;font-size:var(--txsm);font-weight:700;
  box-shadow:var(--shl);z-index:999;white-space:nowrap;
  pointer-events:none;
}
#toast.in{animation:toastIn 0.28s var(--ease-out-back) forwards;}
#toast.out{animation:toastOut 0.22s ease forwards;}

/* ── Skeleton shimmer ── */
@keyframes shimmer{
  0%{background-position:-200% 0}
  100%{background-position:200% 0}
}
.skeleton{
  background:linear-gradient(90deg,var(--sf) 25%,var(--sf3) 50%,var(--sf) 75%);
  background-size:200% 100%;
  animation:shimmer 1.6s ease-in-out infinite;
  border-radius:var(--r8);
}

/* ── GYM session cards ── */
.gex-card{
  transition: transform 0.18s var(--ease-out-expo),
              box-shadow 0.18s ease, opacity 0.2s ease;
}
.gex-card.current-ex{
  border-color: var(--pri);
  box-shadow: 0 0 0 2px var(--prhl), var(--sh);
  animation: currentPulse 2.5s var(--ease-in-out) infinite;
}
@keyframes currentPulse{
  0%,100%{box-shadow:0 0 0 2px var(--prhl),var(--sh)}
  50%{box-shadow:0 0 0 4px var(--prhl),var(--shl)}
}

/* ── Swipe hint animation ── */
@keyframes swipeHint{
  0%,100%{transform:translateX(0);opacity:1}
  40%{transform:translateX(-12px);opacity:0.7}
  60%{transform:translateX(8px);opacity:0.8}
}

/* ── Confetti particles ── */
@keyframes confettiFall{
  0%  {transform:translateY(-20px) rotate(0deg);opacity:1}
  100%{transform:translateY(120vh) rotate(720deg);opacity:0}
}
.confetti-p{
  position:fixed;width:8px;height:8px;border-radius:2px;
  pointer-events:none;z-index:9999;
  animation:confettiFall linear forwards;
}

/* ── Scroll smooth ── */
.page,.modal-body,.chk-list,#sb-nav{
  scroll-behavior:smooth;
  -webkit-overflow-scrolling:touch;
}

/* ── Reduced motion ── */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:0.01ms!important;
    transition-duration:0.01ms!important;
  }
}
"""

# Inject before </style>
old_style_end = "</style>"
first_style_end = content.find(old_style_end)
content = content[:first_style_end] + anim_css + content[first_style_end:]
print(f"✅ Animation CSS injected ({len(anim_css)} chars)")
print(f"Total lines: {len(content.splitlines())}")
