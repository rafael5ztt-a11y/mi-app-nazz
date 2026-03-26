// =============================================
// NAZZ — STABLE CORE (NO ASYNC BOOT)
// =============================================

const SUPABASE_URL = 'https://vkopvqzgpcrcpnisoddx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrb3B2cXpncGNyY3BuaXNvZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTA1NTAsImV4cCI6MjA4OTg4NjU1MH0.RkWOMIdBInFgrHkHSjirzpyBbmwXvP3Mk356hdQJ9qU';

const SVG = {
  tasks: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>`,
  sched: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  notes: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  star:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  user:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  plus:  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  del:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
};

const MOOD_PHRASES = {
  genial:    ['🚀 ¡Estás imparable hoy!', '✨ Tu energía hoy es contagiosa.', '🌟 Todo lo que toques brillará.', '🔥 Nada puede detenerte.', '💡 Los grandes días comienzan así.'],
  normal:    ['⌛ El avance constante construye el futuro.', '🏁 Sin prisa pero sin pausa, vas bien.', '🎯 La disciplina lleva donde la motivación no.', '📒 Cada página te acerca a tu meta.', '🏗️ Hoy también cuenta. Mucho.'],
  cansado:   ['🌙 Descansar es parte del éxito.', '🔋 Los mejores también recargan pilas.', '🛌 Escucha a tu cuerpo hoy.', '🕯️ Mañana brillarás con más fuerza.', '💆 Un respiro no es derrota.'],
  estresado: ['🧘 Respira. La calma es tu superpoder.', '🌊 Una ola a la vez, no todas juntas.', '⚖️ Enfócate en tu próximo pequeño paso.', '🐜 Atácalo por partes, eres más grande.', '🧩 Todo encajará a su tiempo.'],
  triste:    ['⏳ Este momento también pasará.', '🛡️ Está bien no brillar todos los días.', '🫂 El mundo te necesita. Cuídate.', '🌈 Después de la lluvia siempre hay sol.', '🗝️ La adversidad abre puertas de sabiduría.']
};

const PALETTES = [
  { id:'cosmic',  name:'Teal Mix',  c1:'#1a5e63', c2:'#34d399' },
  { id:'aurora',  name:'Aurora',    c1:'#4238e8', c2:'#9333ea' },
  { id:'sunset',  name:'Sunset',    c1:'#ea580c', c2:'#f43f5e' },
  { id:'emerald', name:'Emerald',   c1:'#059669', c2:'#06b6d4' },
  { id:'ocean',   name:'Ocean',     c1:'#1d4ed8', c2:'#38bdf8' },
  { id:'night',   name:'Night',     c1:'#6d28d9', c2:'#c4b5fd' }
];

let SB = null, USER = null;
let tasks = [], sched = [], notes = [], evals = [];

// ── HELPERS ──
const el    = id  => document.getElementById(id);
const vc    = ()  => el('view-container');
const nav   = ()  => el('bottom-nav');
const esc   = s   => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// ── BOOT: Mostrar Login INMEDIATAMENTE sin esperar Supabase ──
window.addEventListener('load', function() {
  // Mostrar login de inmediato para que el usuario vea algo
  showLogin();

  // Conectar Supabase en background
  try {
    SB = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    SB.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        USER = session.user;
        navigate('tasks');
      }
    });

    SB.auth.onAuthStateChange((event, session) => {
      if (session) {
        USER = session.user;
        if (!el('b-login') || event === 'SIGNED_IN') navigate('tasks');
      } else {
        USER = null;
        showLogin();
      }
    });
  } catch(e) {
    console.error('Supabase error:', e);
  }
});

// ── LOGIN ──
function showLogin() {
  nav().classList.add('hidden');
  vc().innerHTML = `
    <div class="login-wrap">
      <div class="login-logo">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <h1 class="login-title">Nazz</h1>
      <p class="login-sub">Tu oficina académica premium</p>
      <div class="login-form">
        <input id="l-email" type="email" placeholder="Tu correo" class="inp" autocomplete="email">
        <input id="l-pass" type="password" placeholder="Tu contraseña" class="inp" autocomplete="current-password">
        <button class="btn btn-grad" id="b-login" onclick="doLogin()">Entrar a mi Oficina</button>
        <button class="btn" style="background:transparent;color:white;margin-top:12px;border:1px solid rgba(255,255,255,0.2);" id="b-register" onclick="doRegister()">Crear cuenta nueva</button>
      </div>
    </div>`;
}

async function doLogin() {
  const email = el('l-email').value.trim();
  const pass  = el('l-pass').value;
  if (!email || !pass) { alert('Completa correo y contraseña.'); return; }
  if (!SB) { alert('Conexión no lista. Recarga la página.'); return; }
  el('b-login').textContent = 'Entrando...';
  const { error } = await SB.auth.signInWithPassword({ email, password: pass });
  if (error) { alert('Error: ' + error.message); el('b-login').textContent = 'Entrar a mi Oficina'; }
}

async function doRegister() {
  const email = el('l-email').value.trim();
  const pass  = el('l-pass').value;
  if (!email || !pass) { alert('Ingresa correo y contraseña para registrarte.'); return; }
  if (pass.length < 6) { alert('La contraseña debe tener al menos 6 caracteres.'); return; }
  el('b-register').textContent = 'Creando...';
  const { error } = await SB.auth.signUp({ email, password: pass });
  if (error) { 
    alert('Error al crear cuenta: ' + error.message); 
    el('b-register').textContent = 'Crear cuenta nueva'; 
  } else { 
    alert('¡Cuenta creada exitosamente! Ahora dale al botón de Entrar.'); 
    el('b-register').textContent = 'Crear cuenta nueva'; 
  }
}

// ── NAVIGATION ──
function navigate(view) {
  nav().classList.remove('hidden');
  nav().innerHTML = `
    <button class="nav-btn ${view==='tasks'?'active':''}" onclick="navigate('tasks')">${SVG.tasks}<span>TAREAS</span></button>
    <button class="nav-btn ${view==='sched'?'active':''}" onclick="navigate('sched')">${SVG.sched}<span>HORARIO</span></button>
    <button class="nav-btn ${view==='notes'?'active':''}" onclick="navigate('notes')">${SVG.notes}<span>NOTAS</span></button>
    <button class="nav-btn ${view==='evals'?'active':''}" onclick="navigate('evals')">${SVG.star}<span>LOGROS</span></button>
    <button class="nav-btn ${view==='config'?'active':''}" onclick="navigate('config')">${SVG.user}<span>YO</span></button>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  vc().innerHTML = `<div class="spinner-wrap"><div class="spinner"></div></div>`;

  if (view === 'tasks')  loadAndRenderTasks();
  if (view === 'sched')  loadAndRenderSched();
  if (view === 'notes')  loadAndRenderNotes();
  if (view === 'evals')  loadAndRenderEvals();
  if (view === 'config') renderConfig();
}

function header(title) {
  return `<header class="app-header">
    <h1>${title}</h1>
    <button class="avatar-btn" onclick="navigate('config')">${USER.email[0].toUpperCase()}</button>
  </header>`;
}

// ═══════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════
async function loadAndRenderTasks() {
  const { data } = await SB.from('tasks').select('*').eq('user_id', USER.id).order('created_at',{ascending:false});
  tasks = data || [];
  const pending = tasks.filter(t=>!t.is_completed).length;
  const done    = tasks.filter(t=>t.is_completed).length;
  const pct     = tasks.length ? Math.round(done/tasks.length*100) : 0;
  const groups  = {};
  tasks.forEach(t => { const k=t.subject||'General'; if(!groups[k])groups[k]=[]; groups[k].push(t); });

  const list = tasks.length===0 ? `<div class="empty">¡No tienes tareas pendientes!</div>` :
    Object.entries(groups).map(([sub,ts]) =>
      `<div class="sec-head">${esc(sub)}</div>
       ${ts.map(t => {
         const p = (t.priority || '').toUpperCase();
         const pc = p==='ALTA'?'prio-high':p==='MEDIA'?'prio-mid':'prio-low';
         const dt = t.due_date ? `<span class="card-badge">📅 ${new Date(t.due_date).toLocaleDateString('es-ES',{day:'numeric',month:'short'})}</span>` : '';
         return `<div class="task-card ${t.is_completed?'done':''} ${pc}">
           <button class="chk ${t.is_completed?'on':''}" onclick="toggleTask('${t.id}',${t.is_completed})"></button>
           <div class="card-body">
             <div class="card-title" style="${t.is_completed?'text-decoration:line-through':''}">${esc(t.title)}</div>
             ${t.description?`<div class="card-sub">${esc(t.description)}</div>`:''}
             ${dt}
           </div>
           <button class="btn-del" onclick="deleteTask('${t.id}')">${SVG.del}</button>
         </div>`;
       }).join('')}`
    ).join('');

  vc().innerHTML = `${header('Estudios')}
    <div class="stats-row">
      <div class="stat-card"><span class="stat-n">${pending}</span><span class="stat-l">Hacer</span></div>
      <div class="stat-card"><span class="stat-n">${done}</span><span class="stat-l">Hechas</span></div>
      <div class="stat-card"><span class="stat-n">${pct}%</span><span class="stat-l">Progreso</span></div>
    </div>${list}
    <button class="fab" onclick="openModal('Nueva Tarea', taskForm())">${SVG.plus}</button>`;
}

async function toggleTask(id, cur) {
  await SB.from('tasks').update({is_completed:!cur}).eq('id',id);
  navigate('tasks');
}
async function deleteTask(id) {
  if (!confirm('¿Borrar?')) return;
  await SB.from('tasks').delete().eq('id',id);
  navigate('tasks');
}
function taskForm(){ return `
  <label class="inp-label">TÍTULO *</label>
  <input id="t-title" class="inp" placeholder="Ej: Estudiar para parcial">
  <label class="inp-label">MATERIA</label>
  <input id="t-sub" class="inp" placeholder="Ej: Cálculo">
  <label class="inp-label">DESCRIPCIÓN</label>
  <textarea id="t-desc" class="inp" rows="3" placeholder="Detalles adicionales..."></textarea>
  <label class="inp-label">IMPORTANCIA</label>
  <select id="t-prio" class="inp"><option value="BAJA">🟢 Baja</option><option value="MEDIA" selected>🟡 Media</option><option value="ALTA">🔴 Alta</option></select>
  <label class="inp-label">FECHA LÍMITE</label>
  <input id="t-date" type="date" class="inp">
  <button class="btn btn-grad" onclick="saveTask()">Guardar Tarea</button>`; }
async function saveTask() {
  const t = el('t-title').value.trim();
  if (!t) { alert('El título es obligatorio.'); return; }
  const baseRow = {user_id:USER.id, title:t, subject:el('t-sub').value.trim(), description:el('t-desc').value.trim(), due_date:el('t-date').value||null};
  const pd = el('t-prio').value;
  
  let {error} = await SB.from('tasks').insert([{...baseRow, priority: pd}]);
  
  if (error && error.message.includes('tasks_priority_check')) {
    const cap = pd.charAt(0) + pd.slice(1).toLowerCase();
    let resCap = await SB.from('tasks').insert([{...baseRow, priority: cap}]);
    if (resCap.error && resCap.error.message.includes('tasks_priority_check')) {
       let resLow = await SB.from('tasks').insert([{...baseRow, priority: pd.toLowerCase()}]);
       if (resLow.error && resLow.error.message.includes('tasks_priority_check')) {
           let resOmit = await SB.from('tasks').insert([baseRow]);
           error = resOmit.error;
       } else {
           error = resLow.error;
       }
    } else {
       error = resCap.error;
    }
  }

  if (error) { alert('Error: '+error.message); return; }
  closeModal(); navigate('tasks');
}

// ═══════════════════════════════════════════
// SCHEDULE
// ═══════════════════════════════════════════
async function loadAndRenderSched() {
  const {data} = await SB.from('schedule').select('*').eq('user_id',USER.id).order('start_time');
  sched = data || [];
  const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const list = sched.length===0 ? `<div class="empty">Aún no tienes horario guardado.</div>` :
    DAYS.map(d => {
      const cs = sched.filter(s=>s.day_of_week===d);
      if (!cs.length) return '';
      return `<div class="sec-head" style="margin-top:20px">${d}</div>
        ${cs.map(c=>`<div class="sched-card">
          <div style="display:flex;justify-content:space-between;align-items:center;width:100%">
            <div><div class="card-title">${esc(c.subject)}</div>
              <div class="card-sub">${c.teacher?esc(c.teacher):'Profesor'} ${c.room?'· '+esc(c.room):''}</div></div>
            <div style="text-align:right">
              <div style="font-weight:900;font-size:1.2rem;color:var(--p1)">${c.start_time.slice(0,5)}</div>
              <div style="font-size:0.65rem;opacity:0.6">hasta ${c.end_time.slice(0,5)}</div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;width:100%;margin-top:8px">
            <button class="btn-del" onclick="deleteSched('${c.id}')">${SVG.del}</button>
          </div>
        </div>`).join('')}`;
    }).join('');
  vc().innerHTML = `${header('Horario')}${list}
    <button class="fab" onclick="openModal('Nueva Clase', schedForm())">${SVG.plus}</button>`;
}
async function deleteSched(id) {
  if (!confirm('¿Borrar?')) return;
  await SB.from('schedule').delete().eq('id',id);
  navigate('sched');
}
function schedForm(){ return `
  <label class="inp-label">MATERIA *</label>
  <input id="s-sub" class="inp" placeholder="Ej: Matemáticas">
  <label class="inp-label">PROFESOR</label>
  <input id="s-teacher" class="inp" placeholder="Nombre del profesor">
  <label class="inp-label">AULA</label>
  <input id="s-room" class="inp" placeholder="Ej: Sala 204">
  <label class="inp-label">DÍA</label>
  <select id="s-day" class="inp"><option>Lunes</option><option>Martes</option><option>Miércoles</option><option>Jueves</option><option>Viernes</option><option>Sábado</option></select>
  <div class="inp-row">
    <div><label class="inp-label">INICIO *</label><input id="s-start" type="time" class="inp"></div>
    <div><label class="inp-label">FIN</label><input id="s-end" type="time" class="inp"></div>
  </div>
  <button class="btn btn-grad" onclick="saveSched()">Guardar Clase</button>`; }
async function saveSched() {
  const sub=el('s-sub').value.trim(), st=el('s-start').value;
  if (!sub||!st) { alert('Materia e Inicio son obligatorios.'); return; }
  const {error} = await SB.from('schedule').insert([{user_id:USER.id, subject:sub, teacher:el('s-teacher').value.trim(), room:el('s-room').value.trim(), day_of_week:el('s-day').value, start_time:st, end_time:el('s-end').value||st}]);
  if (error) { alert('Error: '+error.message); return; }
  closeModal(); navigate('sched');
}

// ═══════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════
async function loadAndRenderNotes() {
  const {data} = await SB.from('notes').select('*').eq('user_id',USER.id).order('created_at',{ascending:false});
  notes = data || [];
  const list = notes.length===0 ? `<div class="empty">Escribe tus ideas y apuntes aquí.</div>` :
    notes.map(n=>`<div class="note-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;width:100%">
        <div class="card-title">${esc(n.title)}</div>
        <button class="btn-del" onclick="deleteNote('${n.id}')">${SVG.del}</button>
      </div>
      ${n.content?`<div class="card-sub" style="font-size:0.9rem;line-height:1.7;margin-top:8px">${esc(n.content)}</div>`:''}
      <span class="card-badge">${esc(n.subject||'GENERAL')}</span>
    </div>`).join('');
  vc().innerHTML = `${header('Notas')}${list}
    <button class="fab" onclick="openModal('Nueva Nota', noteForm())">${SVG.plus}</button>`;
}
async function deleteNote(id) {
  if (!confirm('¿Borrar?')) return;
  await SB.from('notes').delete().eq('id',id);
  navigate('notes');
}
function noteForm(){ return `
  <label class="inp-label">TÍTULO *</label>
  <input id="n-title" class="inp" placeholder="Nombre de la nota">
  <label class="inp-label">MATERIA</label>
  <input id="n-sub" class="inp" placeholder="Ej: Historia">
  <label class="inp-label">CONTENIDO</label>
  <textarea id="n-content" class="inp" rows="8" placeholder="Escribe tus apuntes..."></textarea>
  <button class="btn btn-grad" onclick="saveNote()">Guardar Nota</button>`; }
async function saveNote() {
  const t=el('n-title').value.trim();
  if (!t) { alert('El título es obligatorio.'); return; }
  const {error} = await SB.from('notes').insert([{user_id:USER.id, title:t, subject:el('n-sub').value.trim(), content:el('n-content').value}]);
  if (error) { alert('Error: '+error.message); return; }
  closeModal(); navigate('notes');
}

// ═══════════════════════════════════════════
// EVALUATIONS
// ═══════════════════════════════════════════
async function loadAndRenderEvals() {
  const [{data:ev},{data:sc}] = await Promise.all([
    SB.from('evaluations').select('*').eq('user_id',USER.id).order('eval_date',{ascending:false}),
    SB.from('schedule').select('subject').eq('user_id',USER.id)
  ]);
  evals = ev||[];
  const subjects = Array.from(new Set([...evals.map(e=>e.subject), ...(sc||[]).map(s=>s.subject)])).filter(Boolean).sort();
  const list = subjects.length===0 ? `<div class="empty">Registra tus calificaciones aquí.</div>` :
    subjects.map(s => {
      const se = evals.filter(e=>e.subject===s);
      const gr = se.filter(e=>e.grade!==null);
      const avg = gr.length ? (gr.reduce((a,e)=>a+(e.grade/e.max_grade*10),0)/gr.length).toFixed(1) : null;
      return `<div class="cfg-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
          <div style="font-weight:900;font-size:1.3rem">${esc(s)}</div>
          ${avg?`<div style="font-size:2rem;font-weight:900;color:var(--p1)">${avg}</div>`:''}
        </div>
        ${se.map(e=>{
          const pct=e.grade!==null?e.grade/e.max_grade:null;
          const col=pct>=0.7?'#10b981':pct>=0.5?'#f59e0b':'#ef4444';
          return `<div style="padding:14px 0;border-top:1px solid var(--sl);display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-weight:800">${esc(e.title)}</div>
              <div style="font-size:0.6rem;color:var(--muted);text-transform:uppercase;font-weight:800">Peso ${e.weight}% · ${e.eval_date||'--'}</div></div>
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-size:1.4rem;font-weight:900;color:${col}">${e.grade!==null?e.grade:'—'}<span style="font-size:0.7rem;opacity:0.5">/${e.max_grade}</span></span>
              <button class="btn-del" onclick="deleteEval('${e.id}')">${SVG.del}</button>
            </div>
          </div>`;
        }).join('')}
        <button class="btn btn-nm" style="margin-top:14px;height:50px;border-radius:16px" onclick="openModal('Calificación', evalForm('${esc(s)}'))">${SVG.plus} Agregar nota</button>
      </div>`;
    }).join('');
  vc().innerHTML = `${header('Calificaciones')}${list}
    <button class="fab" onclick="openModal('Calificación', evalForm(''))">${SVG.plus}</button>`;
}
async function deleteEval(id) {
  if (!confirm('¿Borrar?')) return;
  await SB.from('evaluations').delete().eq('id',id);
  navigate('evals');
}
function evalForm(sub){ return `
  <label class="inp-label">MATERIA *</label>
  <input id="e-sub" class="inp" placeholder="Ej: Física" value="${sub}">
  <label class="inp-label">EVALUACIÓN *</label>
  <input id="e-title" class="inp" placeholder="Ej: Primer Parcial">
  <div class="inp-row">
    <div><label class="inp-label">TU NOTA (0-10)</label><input id="e-grade" type="number" step="0.1" min="0" max="10" class="inp" placeholder="Ej: 8.5"></div>
    <div><label class="inp-label">PESO %</label><input id="e-weight" type="number" class="inp" placeholder="Ej: 30"></div>
  </div>
  <label class="inp-label">FECHA</label>
  <input id="e-date" type="date" class="inp">
  <button class="btn btn-grad" onclick="saveEval()">Guardar Calificación</button>`; }
async function saveEval() {
  const sub=el('e-sub').value.trim(), title=el('e-title').value.trim();
  if (!sub||!title) { alert('Materia y evaluación son obligatorios.'); return; }
  const {error} = await SB.from('evaluations').insert([{user_id:USER.id, subject:sub, title, grade:parseFloat(el('e-grade').value)||null, max_grade:10, weight:parseFloat(el('e-weight').value)||20, eval_date:el('e-date').value||null}]);
  if (error) { alert('Error: '+error.message); return; }
  closeModal(); navigate('evals');
}

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════
function renderConfig() {
  const today = new Date().toDateString();
  const mood  = localStorage.getItem('ag_mood_'+today);
  const pal   = localStorage.getItem('ag_palette')||'cosmic';
  const arr   = mood && MOOD_PHRASES[mood] ? MOOD_PHRASES[mood] : ['Tu mente es el mejor cuaderno. ¿Cómo estás hoy?'];
  const phrase = arr[Math.floor(Math.random()*arr.length)];
  vc().innerHTML = `${header('Mi Perfil')}
    <div class="cfg-card" style="background:linear-gradient(135deg,var(--p1),var(--p2));border:none;padding:40px 26px;text-align:center;margin-bottom:22px">
      <div style="font-size:0.65rem;font-weight:900;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;color:white;text-shadow:0 1px 4px rgba(0,0,0,0.3);opacity:0.9">Reflejo Diario</div>
      <p style="font-size:1.25rem;font-style:italic;font-weight:900;line-height:1.65;color:white;text-shadow:0 3px 14px rgba(0,0,0,0.4)">"${phrase}"</p>
      <div class="mood-row">
        ${[{v:'genial',e:'😊'},{v:'normal',e:'😐'},{v:'cansado',e:'😴'},{v:'estresado',e:'😤'},{v:'triste',e:'😔'}]
          .map(m=>`<button class="mood-btn ${mood===m.v?'on':''}" onclick="setMood('${m.v}')">${m.e}</button>`).join('')}
      </div>
    </div>
    <div style="font-size:0.6rem;font-weight:900;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:14px">Temas en Mezcla</div>
    <div class="pal-grid">
      ${PALETTES.map(p=>`<div class="pal-card ${pal===p.id?'on':''}" onclick="setPalette('${p.id}')">
        <div class="pal-dot" style="background:linear-gradient(135deg,${p.c1},${p.c2})"></div>
        <div class="pal-name">${p.name}</div>
      </div>`).join('')}
    </div>
    <button class="btn btn-grad" onclick="doLogout()">Cerrar Mi Oficina</button>
    <button class="btn" style="background:none;color:#ef4444;font-size:0.75rem;font-weight:900;opacity:0.65;margin-top:4px" onclick="doDeleteAccount()">BORRAR CUENTA PERMANENTEMENTE</button>
    <p style="text-align:center;font-size:0.6rem;opacity:0.2;padding:50px 0;letter-spacing:4px;font-weight:900">NAZZ · ACADEMIC SUITE</p>`;
}

function setMood(v) { localStorage.setItem('ag_mood_'+new Date().toDateString(), v); renderConfig(); }
function setPalette(id) { document.documentElement.setAttribute('data-palette',id); localStorage.setItem('ag_palette',id); renderConfig(); }
function doLogout() { if(confirm('¿Cerrar sesión?')) SB.auth.signOut(); }
async function doDeleteAccount() {
  if (!confirm('⚠️ ¿Borrar cuenta y TODOS tus datos permanentemente?')) return;
  if (!confirm('¿Confirmas? Esta acción NO se puede deshacer.')) return;
  const {error} = await SB.from('users').delete().eq('id',USER.id);
  if (!error) { alert('Cuenta eliminada.'); await SB.auth.signOut(); }
  else alert('Error: '+error.message);
}

// ═══════════════════════════════════════════
// MODAL SYSTEM
// ═══════════════════════════════════════════
function openModal(title, bodyHTML) {
  let o = el('modal-overlay');
  if (!o) { o = document.createElement('div'); o.id='modal-overlay'; el('app').appendChild(o); }
  o.innerHTML = `<div class="modal-box">
    <div class="modal-head"><h3>${title}</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>
    ${bodyHTML}
  </div>`;
  o.classList.remove('hidden');
  o.onclick = e => { if(e.target===o) closeModal(); };
}
function closeModal() { const o=el('modal-overlay'); if(o) o.classList.add('hidden'); }
