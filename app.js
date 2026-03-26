// YojanaFind — app.js
// Matches index.html v3 selectors exactly

let SCHEMES = [];
let lang = 'en';
let activeCat = 'all';
let filtered = [];

// ── TRANSLATIONS ────────────────────────────────────────
const TX = {
  en:{
    h1:'Find Schemes You Qualify For',
    h2:'Fill in your profile — instantly see every eligible scheme with step-by-step guides.',
    findBtn:'🔍 Find My Schemes',
    resetBtn:'↺ Reset',
    lState:'📍 State / UT', lAge:'🎂 Age', lGender:'👤 Gender',
    lCat:'🏷️ Category', lInc:'💰 Annual Family Income', lEmp:'💼 Employment Status',
    lSit:'🌟 Life Situation',
    sitHint:' — select all that apply',
    count: n=>`${n} scheme${n!==1?'s':''} found for you`,
    applyBtn:'Apply Online →', guideBtn:'How to Apply',
    noH:'No schemes match your profile',
    noP:'Try removing some filters, or leave state blank for central schemes.',
    sugTitle:'💡 Know a scheme we missed?',
    sugSub:'Help us improve YojanaFind for all Indians',
    sugPh:'Describe the scheme or paste the official link...',
    sugBtn:'Submit',
    sugOk:"✅ Thank you! We'll review and add it soon.",
    stepsLbl:'📋 Step-by-Step Process',
    docsLbl:'📎 Documents Required',
    officialLbl:'🌐 Visit Official Website →',
    benefitLbl:'💰 Benefit',
  },
  hi:{
    h1:'अपनी पात्र योजनाएं खोजें',
    h2:'अपनी प्रोफाइल भरें और तुरंत सभी पात्र सरकारी योजनाएं देखें।',
    findBtn:'🔍 मेरी योजनाएं खोजें',
    resetBtn:'↺ रीसेट',
    lState:'📍 राज्य / केंद्र शासित', lAge:'🎂 आयु', lGender:'👤 लिंग',
    lCat:'🏷️ श्रेणी', lInc:'💰 वार्षिक पारिवारिक आय', lEmp:'💼 रोजगार',
    lSit:'🌟 जीवन स्थिति',
    sitHint:' — सभी लागू चुनें',
    count: n=>`आपके लिए ${n} योजनाएं मिलीं`,
    applyBtn:'ऑनलाइन आवेदन →', guideBtn:'आवेदन कैसे करें',
    noH:'आपकी प्रोफाइल के लिए कोई योजना नहीं मिली',
    noP:'अलग राज्य चुनें या फिल्टर हटाएं।',
    sugTitle:'💡 कोई योजना छूट गई?',
    sugSub:'सभी भारतीयों के लिए बेहतर बनाने में मदद करें',
    sugPh:'योजना का विवरण दें या आधिकारिक लिंक पेस्ट करें...',
    sugBtn:'सबमिट करें',
    sugOk:'✅ धन्यवाद! हम जल्द समीक्षा करेंगे।',
    stepsLbl:'📋 आवेदन प्रक्रिया',
    docsLbl:'📎 आवश्यक दस्तावेज',
    officialLbl:'🌐 आधिकारिक वेबसाइट →',
    benefitLbl:'💰 लाभ',
  }
};
const t = () => TX[lang];

// ── SUPABASE LOAD WITH FALLBACK ──────────────────────────
async function loadSchemes() {
  try {
    if (typeof supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
      const { data, error } = await supabase
        .from('schemes')
        .select('*, scheme_steps(*), scheme_documents(*)')
        .eq('is_active', true);
      if (!error && data?.length) {
        return data.map(s => ({
          ...s,
          minAge: s.min_age, maxAge: s.max_age, maxIncome: s.max_income,
          steps: (s.scheme_steps||[]).sort((a,b)=>a.step_order-b.step_order),
          documents: (s.scheme_documents||[]).map(d => d.document_name)
        }));
      }
    }
  } catch(e) { /* fall through to local */ }
  return LOCAL_SCHEMES;
}

// ── FILTER LOGIC ─────────────────────────────────────────
function filterSchemes(p) {
  return SCHEMES.filter(s => {
    if (p.age && (p.age < s.minAge || p.age > s.maxAge)) return false;
    if (p.income !== '' && p.income > s.maxIncome) return false;
    if (p.category && !s.categories.includes(p.category)) return false;
    if (p.gender && !s.genders.includes(p.gender)) return false;
    if (s.situations.length > 0) {
      const combo = [...p.situations, p.employment];
      if (!s.situations.some(x => combo.includes(x))) return false;
    }
    return true;
  });
}

// ── ICON HELPERS ─────────────────────────────────────────
function icoClass(bg) {
  return bg==='green'?'si-g': bg==='orange'?'si-s': bg==='purple'?'si-p':'si-b';
}
function barClass(bg) {
  return bg==='green'?'sbar-g': bg==='orange'?'sbar-s':'sbar-b';
}

// ── RENDER CARDS ─────────────────────────────────────────
function renderCards(schemes) {
  const grid = document.getElementById('sgrid');
  grid.innerHTML = '';
  if (!schemes.length) {
    grid.innerHTML = `<div class="no-res">
      <div style="font-size:2.5rem;margin-bottom:.8rem">🔍</div>
      <h3>${t().noH}</h3><p>${t().noP}</p>
    </div>`;
    return;
  }
  schemes.forEach((s, i) => {
    const name    = lang==='hi' && s.name_hi    ? s.name_hi    : s.name;
    const desc    = lang==='hi' && s.description_hi ? s.description_hi : s.description;
    const benefit = lang==='hi' && s.benefit_hi ? s.benefit_hi : s.benefit;
    const tags    = (s.tags||[]).slice(0,4).map(t=>`<span class="schip">${t}</span>`).join('');
    const badge   = s.badge ? `<span class="sbadge ${s.badge==='Popular'?'sb-pop':'sb-new'}">${s.badge}</span>` : '';
    const card = document.createElement('div');
    card.className = 'scard';
    card.style.animationDelay = (i*0.042)+'s';
    card.style.position = 'relative';
    card.innerHTML = `
      <div class="scard-bar ${barClass(s.icon_bg)}"></div>
      ${badge}
      <div class="scard-head">
        <div class="scard-ico ${icoClass(s.icon_bg)}">${s.icon||'📋'}</div>
        <div>
          <div class="scard-nm">${name}</div>
          <div class="scard-min">${s.ministry||''}</div>
        </div>
      </div>
      <div class="scard-body">
        <p class="scard-desc">${desc}</p>
        <div class="scard-chips">${tags}</div>
        <div class="scard-amt">💰 ${benefit}</div>
      </div>
      <div class="scard-foot">
        <a class="sbtn-main" href="${s.apply_url||'#'}" target="_blank" rel="noopener">${t().applyBtn}</a>
        <button class="sbtn-ghost" onclick="openModal(${s.id})">${t().guideBtn}</button>
      </div>`;
    grid.appendChild(card);
  });
}

// ── CATEGORY FILTER ───────────────────────────────────────
function fCat(cat) {
  activeCat = cat;
  document.querySelectorAll('.ctab').forEach(b => b.classList.toggle('on', b.dataset.c===cat));
  renderCards(cat==='all' ? filtered : filtered.filter(s=>s.category===cat));
}

// ── MODAL ─────────────────────────────────────────────────
function openModal(id) {
  const s = SCHEMES.find(x=>x.id===id);
  if(!s) return;
  const name    = lang==='hi' && s.name_hi    ? s.name_hi    : s.name;
  const desc    = lang==='hi' && s.description_hi ? s.description_hi : s.description;
  const benefit = lang==='hi' && s.benefit_hi ? s.benefit_hi : s.benefit;
  const steps = (s.steps||[]).map((st,i)=>`
    <li>
      <span class="sn">${i+1}</span>
      <div><strong>${st.title}</strong><br>${st.detail}</div>
    </li>`).join('');
  const docs = (s.documents||[]).map(d=>`<span class="doc-chip">📄 ${d}</span>`).join('');
  document.getElementById('modal-inner').innerHTML = `
    <div class="modal-bar ${barClass(s.icon_bg)}"></div>
    <div class="modal-head">
      <div class="modal-ico ${icoClass(s.icon_bg)}">${s.icon||'📋'}</div>
      <div><div class="modal-nm">${name}</div><div class="modal-min">${s.ministry||''}</div></div>
    </div>
    <div class="modal-body">
      <p class="modal-desc">${desc}</p>
      <div class="modal-benefit">${t().benefitLbl}: ${benefit}</div>
      <div class="modal-sec">${t().stepsLbl}</div>
      <ul class="steps-list">${steps}</ul>
      <div class="modal-sec">${t().docsLbl}</div>
      <div class="docs-chips">${docs}</div>
      <a class="modal-apply-btn" href="${s.official_url||s.apply_url||'#'}" target="_blank" rel="noopener">${t().officialLbl}</a>
    </div>`;
  document.getElementById('overlay').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('overlay').classList.remove('on');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

// ── MAIN FIND ─────────────────────────────────────────────
function doFind() {
  const age = parseInt(document.getElementById('f-age').value)||null;
  if(age&&(age<0||age>120)){alert(lang==='hi'?'सही आयु दर्ज करें।':'Please enter a valid age.');return;}
  const profile = {
    age,
    gender:     document.getElementById('f-gender').value,
    category:   document.getElementById('f-cat').value,
    income:     document.getElementById('f-inc').value!=='' ? parseInt(document.getElementById('f-inc').value) : '',
    employment: document.getElementById('f-emp').value,
    situations: [...document.querySelectorAll('#pills input:checked')].map(c=>c.value)
  };
  const btn=document.getElementById('find-btn');
  const txt=document.getElementById('find-txt');
  const dots=document.getElementById('dots');
  btn.disabled=true; txt.style.display='none'; dots.style.display='flex';
  setTimeout(()=>{
    filtered = filterSchemes(profile);
    activeCat='all';
    document.getElementById('res-section').style.display='block';
    document.getElementById('ad2').style.display='block';
    document.getElementById('ad3').style.display='block';
    document.getElementById('sug-wrap').style.display='block';
    document.querySelectorAll('.ctab').forEach(b=>b.classList.toggle('on',b.dataset.c==='all'));
    document.getElementById('res-count').textContent = t().count(filtered.length);
    renderCards(filtered);
    btn.disabled=false; txt.style.display=''; dots.style.display='none';
    document.getElementById('res-section').scrollIntoView({behavior:'smooth',block:'start'});
  },500);
}

// ── RESET ─────────────────────────────────────────────────
function doReset(){
  ['f-state','f-age','f-gender','f-cat','f-inc','f-emp'].forEach(id=>{document.getElementById(id).value=''});
  document.querySelectorAll('#pills input').forEach(c=>c.checked=false);
  ['res-section','ad2','ad3','sug-wrap'].forEach(id=>{document.getElementById(id).style.display='none'});
}

// ── LANGUAGE TOGGLE ───────────────────────────────────────
function setLang(l){
  lang=l;
  document.body.classList.toggle('hindi',l==='hi');
  document.getElementById('btn-en').classList.toggle('on',l==='en');
  document.getElementById('btn-hi').classList.toggle('on',l==='hi');
  const tx=t();
  const map = {
    'fh1':tx.h1,'fh2':tx.h2,'find-txt':tx.findBtn,'reset-btn':tx.resetBtn,
    'l-state':tx.lState,'l-age':tx.lAge,'l-gender':tx.lGender,
    'l-cat':tx.lCat,'l-inc':tx.lInc,'l-emp':tx.lEmp,
    'sug-title':tx.sugTitle,'sug-sub':tx.sugSub,'sug-btn':tx.sugBtn
  };
  Object.entries(map).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v;});
  const lsit=document.getElementById('l-sit');
  if(lsit) lsit.innerHTML=tx.lSit+`<span style="font-weight:400;text-transform:none;letter-spacing:0;color:rgba(255,255,255,.25)">${tx.sitHint}</span>`;
  const sp=document.getElementById('sug-in'); if(sp) sp.placeholder=tx.sugPh;
  if(filtered.length){
    document.getElementById('res-count').textContent=tx.count(filtered.length);
    fCat(activeCat);
  }
}

// ── SUGGEST ───────────────────────────────────────────────
async function doSuggest(){
  const val=document.getElementById('sug-in').value.trim();
  if(!val) return;
  try{
    if(typeof supabase!=='undefined'&&SUPABASE_URL!=='YOUR_SUPABASE_URL')
      await supabase.from('suggestions').insert([{suggestion:val}]);
  }catch(e){}
  document.getElementById('sug-in').value='';
  const ok=document.getElementById('sug-ok');
  ok.textContent=t().sugOk; ok.style.display='block';
  setTimeout(()=>ok.style.display='none',4000);
}

// ── SHARE ─────────────────────────────────────────────────
function doShare(){
  const text=`Found ${filtered.length} government schemes I qualify for on YojanaFind! ${location.href}`;
  if(navigator.share) navigator.share({title:'YojanaFind',text,url:location.href}).catch(()=>{});
  else navigator.clipboard?.writeText(text).then(()=>alert('Link copied!')).catch(()=>alert(text));
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',async()=>{
  SCHEMES = await loadSchemes();
});
