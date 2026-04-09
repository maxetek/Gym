
# ─────────────────────────────────────────
# 3. Wire set-completion flash + confetti to gym session
# ─────────────────────────────────────────

# Flash the set row on completion
old_next_set = "gymSetIdx++;renderGym();"
new_next_set = """gymSetIdx++;
  // Flash completed set row
  setTimeout(()=>{
    const rows=document.querySelectorAll('.set-row');
    const prevRow=rows[gymSetIdx>0?gymSetIdx-1:0];
    if(prevRow)Anima.flashSetRow(prevRow);
  },30);
  renderGym();"""
if old_next_set in content:
    content = content.replace(old_next_set, new_next_set)
    print("✅ Set flash wired")
else:
    print("⚠ Set flash pattern not found")

# Confetti on exercise complete
old_ex_done = "gymIdx++;gymSetIdx=0;renderGym();"
new_ex_done = """gymIdx++;gymSetIdx=0;
  // Celebrate exercise completion
  const btn=event&&event.target;
  if(btn){const r=btn.getBoundingClientRect();Anima.confetti(r.left+r.width/2,r.top+r.height/2,22);}
  Anima.toast('Exercise done! 💪','🏋️',1800);
  renderGym();"""
if old_ex_done in content:
    content = content.replace(old_ex_done, new_ex_done)
    print("✅ Exercise confetti wired")
else:
    print("⚠ Exercise done pattern not found")

# ─────────────────────────────────────────
# 4. Better scroll-to-top on page switch
# ─────────────────────────────────────────
old_nav_click = "function navTo(id){"
new_nav_click = """function navTo(id){
  const pg=document.getElementById('p-'+id);
  if(pg)pg.scrollTo({top:0,behavior:'smooth'});"""
if old_nav_click in content:
    content = content.replace(old_nav_click, new_nav_click)
    print("✅ Scroll-to-top on nav")

with open('/home/user/output/gym-trainer.html', 'w') as f:
    f.write(content)
print(f"✅ Saved: {len(content.splitlines())} lines")

# Final check
checks = [
    ("Easing tokens CSS", "--ease-out-expo" in content),
    ("Page transitions CSS", "page-exit" in content),
    ("Ripple CSS", ".ripple{" in content),
    ("Confetti CSS", "confettiFall" in content),
    ("Anima JS object", "const Anima" in content),
    ("Toast override", "function showToast" in content),
    ("Stagger observer", "_pagesObs" in content),
]
for name, ok in checks:
    print(f"{'✅' if ok else '❌'} {name}")
