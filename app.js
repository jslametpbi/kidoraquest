(() => {
  'use strict';
  const APP_VERSION = '5.0.0-complete-working';
  const LS_KEY = 'kidoraQuestV5Data';
  const SESSION_KEY = 'kidoraQuestV5Session';
  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');

  const THEMES = [
    {id:'colours',title:'Rainbow Colours',emoji:'🌈',phonics:'r / b / g / y',words:[['red','🔴'],['blue','🔵'],['yellow','🟡'],['green','🟢'],['purple','🟣'],['orange','🟠']],sentences:['I see red.','The ball is blue.','I like yellow.','The tree is green.'],story:'The Rainbow Bridge is sleeping. KIDORA needs red, blue, yellow, and green lights to wake it up.',frame:'I see ____.',home:'Find three colours at home and say: I see red / blue / yellow.'},
    {id:'animals',title:'Animal Island',emoji:'🐾',phonics:'c / d / b / f',words:[['cat','🐱'],['dog','🐶'],['bird','🐦'],['fish','🐟'],['rabbit','🐰'],['lion','🦁']],sentences:['I see a cat.','The dog can run.','The bird can sing.','The fish can swim.'],story:'Animal Island has lost its sounds. Help each animal find its voice again.',frame:'I see a ____.',home:'Ask your child to name animals and make one animal sound.'},
    {id:'food',title:'Yummy Market',emoji:'🍎',phonics:'a / m / c / b',words:[['apple','🍎'],['milk','🥛'],['cake','🍰'],['banana','🍌'],['rice','🍚'],['water','💧']],sentences:['I like apples.','I drink milk.','The cake is sweet.','I eat rice.'],story:'The Yummy Market needs words to open its food baskets.',frame:'I like ____.',home:'During snack time, ask: Do you like apples? Yes, I do.'},
    {id:'family',title:'Family Tree House',emoji:'🏡',phonics:'m / f / s / b',words:[['mother','👩'],['father','👨'],['sister','👧'],['brother','👦'],['grandma','👵'],['grandpa','👴']],sentences:['This is my mother.','This is my father.','I love my family.','My sister is kind.'],story:'The Family Tree House is growing. Add family words to make new branches.',frame:'This is my ____.',home:'Look at a family photo and say: This is my mother/father.'},
    {id:'body',title:'Body Beat Garden',emoji:'🕺',phonics:'h / e / n / m',words:[['head','🙂'],['eyes','👀'],['nose','👃'],['mouth','👄'],['hands','👐'],['feet','🦶']],sentences:['Touch your head.','I have two eyes.','This is my nose.','Clap your hands.'],story:'The Body Beat Garden moves when children listen, say, read, and write body words.',frame:'This is my ____.',home:'Play Simon Says: touch your head, eyes, nose, and hands.'},
    {id:'weather',title:'Weather Sky Lab',emoji:'☀️',phonics:'s / r / w / c',words:[['sunny','☀️'],['rainy','🌧️'],['windy','🌬️'],['cloudy','☁️'],['hot','🔥'],['cold','❄️']],sentences:['It is sunny.','It is rainy.','The wind is strong.','It is cold today.'],story:'The Sky Lab needs young weather reporters to describe today’s sky.',frame:'It is ____.',home:'Ask every morning: How is the weather today?'},
    {id:'classroom',title:'Classroom Castle',emoji:'🏫',phonics:'p / b / d / t',words:[['book','📘'],['pencil','✏️'],['desk','🪑'],['bag','🎒'],['ruler','📏'],['teacher','👩‍🏫']],sentences:['This is my book.','I have a pencil.','Put it on the desk.','My bag is red.'],story:'Classroom Castle opens when learners find school objects and say their names.',frame:'This is my ____.',home:'Point to classroom objects and say: This is my book/pencil.'},
    {id:'actions',title:'Action Volcano',emoji:'🏃',phonics:'r / j / s / w',words:[['run','🏃'],['jump','🤸'],['sing','🎤'],['walk','🚶'],['read','📖'],['write','✍️']],sentences:['I can run.','I can jump.','I can sing.','I can read.'],story:'Action Volcano glows when children move, listen, and say action words.',frame:'I can ____.',home:'Act and say: I can run, jump, sing, walk.'},
    {id:'shapes',title:'Shape Space Port',emoji:'🟦',phonics:'c / s / t',words:[['circle','⚪'],['square','🟦'],['triangle','🔺'],['star','⭐'],['heart','❤️'],['rectangle','▭']],sentences:['This is a circle.','I see a square.','The star is yellow.','Draw a triangle.'],story:'Shape rockets need correct words to fly through the space port.',frame:'This is a ____.',home:'Find shapes in the room and name them.'},
    {id:'places',title:'Little Places Map',emoji:'🗺️',phonics:'h / s / p',words:[['home','🏠'],['school','🏫'],['park','🌳'],['shop','🏪'],['beach','🏖️'],['zoo','🦓']],sentences:['I go to school.','I play at the park.','This is my home.','I see animals at the zoo.'],story:'The Little Places Map appears when children read and write place words.',frame:'I go to the ____.',home:'Ask: Where do you go? I go to school/home.'},
    {id:'toys',title:'Toy Galaxy',emoji:'🧸',phonics:'b / k / d',words:[['ball','⚽'],['doll','🪆'],['kite','🪁'],['car','🚗'],['blocks','🧱'],['teddy','🧸']],sentences:['I have a ball.','The kite is high.','I play with blocks.','This is my teddy.'],story:'Toy Galaxy needs names, colours, and sentences to light up its planets.',frame:'I have a ____.',home:'Ask your child to choose one toy and describe it.'},
    {id:'emotions',title:'Feeling Lanterns',emoji:'😊',phonics:'h / s / a',words:[['happy','😊'],['sad','😢'],['angry','😠'],['sleepy','😴'],['scared','😨'],['excited','🤩']],sentences:['I am happy.','I feel sleepy.','The boy is sad.','I am excited.'],story:'Feeling Lanterns glow when children name feelings kindly and safely.',frame:'I am ____.',home:'Ask: How do you feel today? I am happy/sleepy/excited.'}
  ];

  const DEFAULT_DATA = () => ({
    version: APP_VERSION,
    settings: { adminPin:'2026', recordingEnabled:true, copyright:'© 2026 KIDORA Quest. Copyright Dr. Joko Slamet. All rights reserved.', schoolName:'KIDORA Quest Learning Studio', aiSafety:'teacher_review' },
    users: [
      {id:'u-student',name:'Alya Kidora',email:'student@kidora.local',password:'student2026',role:'student',approved:true,avatar:'🧒',className:'Rainbow Class',parentId:'u-parent',xp:210,stars:18,level:'Story Explorer'},
      {id:'u-teacher',name:'Ms. Mira Teacher',email:'teacher@kidora.local',password:'teacher2026',role:'teacher',approved:true,avatar:'👩‍🏫',className:'Rainbow Class'},
      {id:'u-parent',name:'Parent of Alya',email:'parent@kidora.local',password:'parent2026',role:'parent',approved:true,avatar:'👨‍👩‍👧',childId:'u-student'},
      {id:'u-student2',name:'Bima Kidora',email:'bima@kidora.local',password:'bima2026',role:'student',approved:true,avatar:'🧒',className:'Rainbow Class',parentId:'u-parent',xp:150,stars:12,level:'Word Builder'},
      {id:'u-student3',name:'Nara Kidora',email:'nara@kidora.local',password:'nara2026',role:'student',approved:false,avatar:'👧',className:'Sun Class',xp:70,stars:7,level:'Little Listener'}
    ],
    contents: THEMES,
    quests: THEMES.slice(0,8).map((t,idx) => ({id:'q-'+t.id,title:`${t.title} Quest`,themeId:t.id,approved:idx<6,status:idx<6?'Published':'Safety Review',createdBy:'System AI',mission:`Complete Hear → Say → Read → Create using ${t.title}.`,xp:30+idx*5})),
    evidence: [
      {id:'e1',studentId:'u-student',type:'listening',themeId:'colours',title:'Rainbow Colours listening',score:90,date:new Date(Date.now()-86400000*4).toISOString(),note:'Identified colour words with strong attention.'},
      {id:'e2',studentId:'u-student',type:'speaking',themeId:'animals',title:'Animal sentence voice',score:82,date:new Date(Date.now()-86400000*3).toISOString(),note:'Recorded “I see a cat.” with clear effort.'},
      {id:'e3',studentId:'u-student',type:'reading',themeId:'food',title:'Yummy Market reading',score:88,date:new Date(Date.now()-86400000*2).toISOString(),note:'Matched food words and read two sentences.'},
      {id:'e4',studentId:'u-student',type:'writing',themeId:'family',title:'Family writing page',score:86,date:new Date(Date.now()-86400000).toISOString(),note:'Built and saved a sentence page.'}
    ],
    storybook: [],
    safetyQueue: [
      {id:'s1',kind:'AI Quest',title:'The Gentle Dragon Word Path',status:'Pending',text:'Child-safe quest about colours and friendly dragon collecting stars.'},
      {id:'s2',kind:'AI Story',title:'The Lost Pencil',status:'Pending',text:'Short classroom story using book, pencil, desk, bag.'}
    ],
    analytics: [],
    currentThemeId:'colours'
  });

  let data = loadData();
  let session = loadSession();
  let currentView = 'home';
  let currentThemeId = data.currentThemeId || 'colours';
  let currentSkill = 'home';
  let selectedWords = [];
  let currentAudio = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let recordedUrl = '';
  let canvasState = { drawing:false, ctx:null, canvas:null };
  let memoryState = { cards:[], opened:[], matched:[] };

  function loadData(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw){ const d = DEFAULT_DATA(); localStorage.setItem(LS_KEY, JSON.stringify(d)); return d; }
      const parsed = JSON.parse(raw);
      if(!parsed.version || parsed.version !== APP_VERSION){
        const fresh = DEFAULT_DATA();
        const merged = {...fresh, users: parsed.users?.length ? parsed.users : fresh.users, settings:{...fresh.settings,...(parsed.settings||{})}};
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }catch(e){ const d = DEFAULT_DATA(); localStorage.setItem(LS_KEY, JSON.stringify(d)); return d; }
  }
  function saveData(){ localStorage.setItem(LS_KEY, JSON.stringify(data)); }
  function loadSession(){ try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch(e){return null} }
  function saveSession(s){ session = s; if(s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); else sessionStorage.removeItem(SESSION_KEY); }
  function uid(prefix='id'){ return prefix+'-'+Math.random().toString(36).slice(2,9)+'-'+Date.now().toString(36); }
  function esc(str=''){ return String(str).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
  function theme(id=currentThemeId){ return data.contents.find(t=>t.id===id) || data.contents[0]; }
  function user(){ return data.users.find(u=>u.id===session?.userId); }
  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),2600); }
  function log(action, detail=''){ data.analytics.push({id:uid('a'), action, detail, userId:session?.userId || 'guest', date:new Date().toISOString()}); saveData(); }
  function showConfetti(){
    const wrap = document.createElement('div'); wrap.className='confetti';
    const colors=['#6c35ff','#ff5aa5','#08b6d5','#ffd166','#39c986'];
    for(let i=0;i<42;i++){ const s=document.createElement('span'); s.style.left=Math.random()*100+'%'; s.style.top='-30px'; s.style.background=colors[i%colors.length]; s.style.animationDelay=Math.random()*.4+'s'; wrap.appendChild(s); }
    document.body.appendChild(wrap); setTimeout(()=>wrap.remove(),1500);
  }

  function speak(text, opts={}){
    stopAudio();
    if(!('speechSynthesis' in window)){ toast('Audio is not supported in this browser.'); return; }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US'; utter.rate = opts.rate || .82; utter.pitch = opts.pitch || 1.08; utter.volume = 1;
    currentAudio = utter;
    utter.onend = () => currentAudio = null;
    window.speechSynthesis.speak(utter);
    log('audio_play', text.slice(0,70));
  }
  function stopAudio(){ if('speechSynthesis' in window) window.speechSynthesis.cancel(); currentAudio = null; }

  function evidenceFor(studentId){ return data.evidence.filter(e=>e.studentId===studentId).sort((a,b)=>new Date(b.date)-new Date(a.date)); }
  function addEvidence(type, title, score, note, extra={}){
    const u = user(); if(!u) return;
    const e = {id:uid('e'), studentId:u.id, type, themeId:currentThemeId, title, score, note, date:new Date().toISOString(), ...extra};
    data.evidence.unshift(e);
    if(u.role==='student'){ u.xp = (u.xp||0) + Math.round(score/4); u.stars = (u.stars||0) + 1; u.level = levelFromXp(u.xp); }
    saveData(); log('evidence_saved', `${type}: ${title}`); toast('Saved to learning evidence.'); showConfetti();
  }
  function levelFromXp(xp){ if(xp>420) return 'Quest Master'; if(xp>280) return 'Story Explorer'; if(xp>160) return 'Word Builder'; if(xp>80) return 'Brave Speaker'; return 'Little Listener'; }

  function render(){
    if(!session) return renderLanding();
    const u = user();
    if(!u){ saveSession(null); return renderLanding(); }
    if(u.role==='student') return renderDashboard(studentNav(), renderStudent());
    if(u.role==='teacher') return renderDashboard(teacherNav(), renderTeacher());
    if(u.role==='parent') return renderDashboard(parentNav(), renderParent());
    if(u.role==='admin') return renderDashboard(adminNav(), renderAdmin());
    renderLanding();
  }

  function renderLanding(){
    app.innerHTML = `<div class="bg-orbs"></div>
      <main class="landing">
        <header class="topbar">
          <div class="brand"><div class="logo">K</div><div><div style="font-size:24px">KIDORA Quest</div><small>AI-integrated English storyworld for young learners</small></div></div>
          <div class="top-actions">
            <button class="btn ghost" data-action="openLogin" data-role="student">Learner Entry</button>
            <button class="btn ghost" data-action="openLogin" data-role="teacher">Teacher Entry</button>
            <button class="btn ghost" data-action="openLogin" data-role="parent">Family Entry</button>
            <button class="btn primary" data-action="openAdminPin">Admin PIN</button>
          </div>
        </header>
        <section class="hero">
          <div class="hero-copy">
            <div class="eyebrow">✨ Hear • Move • Say • Read • Create • Share</div>
            <h1>Build a living English world through <span>quests, voices, stories, and play.</span></h1>
            <p>KIDORA Quest transforms young learners into storytellers and language explorers through playable listening, speaking, reading, writing, drawing, AI-assisted quest creation, safe feedback, and portfolio evidence.</p>
            <div class="hero-buttons">
              <button class="btn primary" data-action="openLogin" data-role="student">Start Learning World</button>
              <button class="btn pink" data-action="openLogin" data-role="teacher">Open Teacher Cockpit</button>
              <button class="btn cyan" data-action="openLogin" data-role="parent">Open Family Window</button>
            </div>
            <div class="pill-row" style="margin-top:18px">
              <span class="pill">🎧 Playable audio</span><span class="pill">🎙️ Voice recording</span><span class="pill">✍️ Canvas writing</span><span class="pill">🧩 Interactive games</span><span class="pill">📊 Research analytics</span>
            </div>
          </div>
          <div class="hero-visual" aria-label="KIDORA Quest storyworld areas">
            <div class="world-orbit">
              <div class="path"></div><div class="world-title">Quest Map</div>
              ${landingIsland('i1','🎧','SoundQuest AI','listen, tap, match')}
              ${landingIsland('i2','🎙️','EchoMirror AI','record, play, speak')}
              ${landingIsland('i3','🌱','GlyphPath AI','letters, words, stories')}
              ${landingIsland('i4','✍️','StoryForge AI','draw, trace, write')}
              ${landingIsland('i5','🧩','Puzzle Bridge','four-skill missions')}
              ${landingIsland('i6','🏆','Treasure Room','badges and passport')}
            </div>
          </div>
        </section>
        <footer class="footerline"><span>${esc(data.settings.copyright)}</span><span>Version ${APP_VERSION}</span></footer>
      </main>`;
  }
  function landingIsland(cls,emoji,title,sub){ return `<button class="island ${cls}" data-action="openLogin" data-role="student"><span class="emoji">${emoji}</span><strong>${title}</strong><small>${sub}</small></button>`; }

  function openLogin(role='student'){
    const titles = {student:'Learner Entry', teacher:'Teacher Entry', parent:'Family Entry'};
    modal(`<div class="modal-head"><div><h2>${titles[role]||'Login'}</h2><p class="hint">Enter a registered account. New young learner accounts can be created from the registration panel and approved by Admin.</p></div><button class="close" data-action="closeModal">×</button></div>
      <div class="grid-2">
        <div class="card">
          <h3>${titles[role]||'Login'}</h3>
          <div class="form">
            <label>Email</label><input class="input" id="loginEmail" type="email" placeholder="name@example.com" />
            <label>Password</label><input class="input" id="loginPassword" type="password" placeholder="Password" />
            <input type="hidden" id="loginRole" value="${role}" />
            <button class="btn primary block" data-action="doLogin">Enter KIDORA Quest</button>
          </div>
        </div>
        <div class="card">
          <h3>Create Young Learner Account</h3>
          <div class="form">
            <label>Child Name</label><input class="input" id="regName" placeholder="Child name" />
            <label>Parent Email</label><input class="input" id="regEmail" type="email" placeholder="parent@email.com" />
            <label>Password</label><input class="input" id="regPassword" type="password" placeholder="Create password" />
            <label>Class</label><input class="input" id="regClass" placeholder="e.g., Rainbow Class" />
            <button class="btn cyan block" data-action="registerStudent">Register for Approval</button>
            <p class="hint">Registration does not expose demo credentials and requires Admin approval.</p>
          </div>
        </div>
      </div>`);
  }
  function openAdminPin(){
    modal(`<div class="modal-head"><div><h2>Admin Control Center</h2><p class="hint">Admin access is protected by PIN.</p></div><button class="close" data-action="closeModal">×</button></div>
      <div class="card form" style="max-width:520px;margin:auto">
        <label>Admin PIN</label><input class="input" id="adminPin" type="password" inputmode="numeric" placeholder="Enter PIN" />
        <button class="btn primary block" data-action="doAdminPin">Open Admin Dashboard</button>
      </div>`);
  }
  function modal(html){ const div=document.createElement('div'); div.className='modal'; div.id='modal'; div.innerHTML=`<div class="modal-card">${html}</div>`; document.body.appendChild(div); }
  function closeModal(){ document.getElementById('modal')?.remove(); }
  function doLogin(){
    const email = val('loginEmail').toLowerCase().trim(); const pw = val('loginPassword'); const role = val('loginRole');
    const u = data.users.find(x=>x.email.toLowerCase()===email && x.password===pw && x.role===role);
    if(!u) return toast('Account not found for this role.');
    if(!u.approved) return toast('This account is waiting for Admin approval.');
    saveSession({userId:u.id, role:u.role}); closeModal(); currentView='home'; log('login', u.role); render();
  }
  function doAdminPin(){
    if(val('adminPin') !== data.settings.adminPin) return toast('Incorrect Admin PIN.');
    let adm = data.users.find(u=>u.role==='admin');
    if(!adm){ adm = {id:'u-admin',name:'KIDORA Admin',email:'admin@kidora.local',password:'',role:'admin',approved:true,avatar:'🛡️'}; data.users.push(adm); saveData(); }
    saveSession({userId:adm.id, role:'admin'}); closeModal(); currentView='adminOverview'; log('admin_login','PIN'); render();
  }
  function registerStudent(){
    const name=val('regName'), email=val('regEmail').toLowerCase().trim(), password=val('regPassword'), className=val('regClass')||'New Class';
    if(!name || !email || !password) return toast('Please complete child name, email, and password.');
    if(data.users.some(u=>u.email.toLowerCase()===email)) return toast('This email is already registered.');
    data.users.push({id:uid('u'),name,email,password,role:'student',approved:false,avatar:'🧒',className,xp:0,stars:0,level:'Little Listener'});
    saveData(); closeModal(); toast('Registration saved. Admin approval is required.');
  }
  function val(id){ return document.getElementById(id)?.value || ''; }

  function renderDashboard(navHtml, contentHtml){
    const u = user();
    app.innerHTML = `<div class="dash">
      <aside class="side">
        <div class="brand"><div class="logo">K</div><div><div style="font-size:20px">KIDORA Quest</div><small>${esc(data.settings.schoolName)}</small></div></div>
        <div class="profile-card">
          <div class="profile-row"><div class="avatar">${u.avatar||'⭐'}</div><div><h3>${esc(u.name)}</h3><p>${esc(u.role)}${u.className?' • '+esc(u.className):''}</p></div></div>
          <div class="statline"><div class="mini-stat"><span>${u.xp||0}</span>XP</div><div class="mini-stat"><span>${u.stars||0}</span>Stars</div></div>
        </div>
        <nav class="nav">${navHtml}</nav>
        <button class="btn danger block" data-action="logout">Logout</button>
      </aside>
      <main class="main">${contentHtml}</main>
    </div>`;
    afterRender();
  }
  function navButton(view, icon, label){ return `<button class="${currentView===view?'active':''}" data-action="setView" data-view="${view}">${icon} ${label}</button>`; }
  function studentNav(){ return [
    navButton('home','🗺️','Quest Map'), navButton('sound','🎧','SoundQuest AI'), navButton('echo','🎙️','EchoMirror AI'), navButton('glyph','🌱','GlyphPath AI'), navButton('forge','✍️','StoryForge AI'), navButton('bridge','🧩','Puzzle Bridge'), navButton('wordspark','💥','WordSpark Lab'), navButton('storybook','📚','Living Storybook'), navButton('treasure','🏆','Treasure Room')
  ].join(''); }
  function teacherNav(){ return [navButton('teacherHome','📊','Teacher Cockpit'),navButton('questWeaver','🪄','QuestWeaver AI'),navButton('contentStudio','🧰','Content Studio'),navButton('evidenceReview','🎧','Evidence Review'),navButton('reports','📝','Reports'),navButton('teacherAnalytics','📈','Research Analytics')].join(''); }
  function parentNav(){ return [navButton('parentHome','🏠','Family Window'),navButton('parentStory','📚','Child Storybook'),navButton('homePractice','✨','Home Practice AI'),navButton('parentReport','📄','Growth Report')].join(''); }
  function adminNav(){ return [navButton('adminOverview','🛡️','Control Center'),navButton('adminUsers','👥','Users'),navButton('adminContent','🧰','Content Bank'),navButton('adminQuests','🗺️','Quest Library'),navButton('adminSafety','✅','AI Safety'),navButton('adminAnalytics','📈','Analytics'),navButton('adminSettings','⚙️','Settings')].join(''); }
  function logout(){ stopAudio(); saveSession(null); currentView='home'; renderLanding(); toast('Logged out.'); }
  function setView(view){ currentView = view; selectedWords=[]; stopAudio(); render(); }

  function header(title, subtitle, actions=''){
    return `<div class="dash-head"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="toolbar">${actions}</div></div>`;
  }
  function themeSelector(){ return `<select id="themeSelect" data-action="changeTheme">${data.contents.map(t=>`<option value="${t.id}" ${t.id===currentThemeId?'selected':''}>${t.emoji} ${esc(t.title)}</option>`).join('')}</select>`; }

  function renderStudent(){
    if(!['home','sound','echo','glyph','forge','bridge','wordspark','storybook','treasure'].includes(currentView)) currentView='home';
    if(currentView==='home') return studentHome();
    if(currentView==='sound') return soundQuest();
    if(currentView==='echo') return echoMirror();
    if(currentView==='glyph') return glyphPath();
    if(currentView==='forge') return storyForge();
    if(currentView==='bridge') return puzzleBridge();
    if(currentView==='wordspark') return wordSpark();
    if(currentView==='storybook') return livingStorybook();
    if(currentView==='treasure') return treasureRoom();
  }
  function studentHome(){
    const u=user(); const ev=evidenceFor(u.id); const p=Math.min(100,Math.round((ev.length/12)*100));
    return `${header('Quest Map','Choose a world and complete playful English missions.', `<button class="btn primary" data-action="playWelcome">Play Welcome</button>${themeSelector()}`)}
      <div class="card" style="margin-bottom:16px"><h2>Hello, ${esc(u.name)} ${u.avatar||''}</h2><p>Your level: <b>${esc(u.level||levelFromXp(u.xp||0))}</b>. Complete Hear → Move → Say → Read → Create → Share missions to grow your English world.</p><div class="progress"><div class="bar" style="width:${p}%"></div></div></div>
      <div class="area-grid">
        ${area('sound','sound','🎧','SoundQuest AI','Play clues, listen to stories, tap correct pictures, and save listening evidence.')}
        ${area('echo','echo','🎙️','EchoMirror AI','Record your voice, play it back, use dialogue mode, and save speaking evidence.')}
        ${area('glyph','glyph','🌱','GlyphPath AI','Explore letters, phonics, word garden, sentences, and mini stories.')}
        ${area('forge','forge','✍️','StoryForge AI','Draw, trace, build sentences, read aloud, and create storybook pages.')}
        ${area('bridge','bridge','🧩','Puzzle Bridge','Solve integrated four-skill quests in one story mission.')}
        ${area('treasure','treasure','🏆','Treasure Room','Open badges, print passport, and review your growth.')}
      </div>
      <div class="activity-board"><div class="card"><h2>Today’s Theme</h2>${themeCard(theme())}</div><div class="card"><h2>Recent Evidence</h2>${evidenceList(ev.slice(0,4))}</div></div>`;
  }
  function area(view,cls,emoji,title,desc){ return `<button class="area-card ${cls}" data-action="setView" data-view="${view}"><div><h3>${emoji} ${title}</h3><p>${desc}</p></div><span class="big">${emoji}</span><span class="btn small ghost">Explore Now</span></button>`; }
  function themeCard(t){ return `<div class="profile-row"><div class="avatar">${t.emoji}</div><div><h3>${esc(t.title)}</h3><p>${esc(t.story)}</p></div></div><div class="word-bank" style="margin-top:12px">${t.words.map(w=>`<button class="word-card" data-action="playWord" data-word="${w[0]}"><span class="emoji">${w[1]}</span>${esc(w[0])}</button>`).join('')}</div>`; }

  function soundQuest(){
    const t=theme(); const target=t.words[0];
    return `${header('SoundQuest AI','Listen to clues, play words, stop audio, choose answers, and save listening evidence.', `${themeSelector()}<button class="btn" data-action="stopAudio">Stop Audio</button>`)}
      <div class="quest-strip">${data.contents.slice(0,12).map(x=>`<button class="quest-chip ${x.id===currentThemeId?'active':''}" data-action="selectTheme" data-theme="${x.id}"><b>${x.emoji} ${esc(x.title)}</b><p>${esc(x.words.slice(0,3).map(w=>w[0]).join(', '))}</p></button>`).join('')}</div>
      <div class="activity-board">
        <section class="card"><h2>Listen and Explore</h2><p>${esc(t.story)}</p>
          <div class="toolbar">
            <button class="btn primary" data-action="playStory">▶ Play Story</button><button class="btn cyan" data-action="playClue">🎧 Play Clue</button><button class="btn sun" data-action="playChant">🎵 Play Chant</button><button class="btn danger" data-action="stopAudio">■ Stop</button>
          </div>
          <h3>Tap the word you hear</h3>
          <div class="choice-grid" id="listenChoices">${t.words.slice(0,6).map((w,i)=>`<button class="choice" data-action="listenChoice" data-word="${w[0]}" data-correct="${i===0?'yes':'no'}"><span style="font-size:42px">${w[1]}</span><br>${esc(w[0])}</button>`).join('')}</div>
          <div class="toolbar"><button class="btn primary" data-action="newListeningRound">New Listening Round</button><button class="btn cyan" data-action="saveListening">Save Listening Evidence</button></div>
        </section>
        <section class="card"><h2>Sound Board</h2><p>Every word has a playable model sound. The Stop button cancels any speech immediately.</p><div class="word-bank">${t.words.map(w=>`<button class="word-card" data-action="playWord" data-word="${w[0]}"><span class="emoji">${w[1]}</span>▶ ${esc(w[0])}</button>`).join('')}</div><hr><h3>Listen and Move</h3><p>Play a command, then move the character in your imagination or classroom.</p><div class="toolbar"><button class="btn" data-action="playCommand">Play Action Command</button><button class="btn" data-action="playSlow">Play Slowly</button></div><div class="empty" id="soundFeedback">Choose a listening activity to begin.</div></section>
      </div>`;
  }
  function echoMirror(){
    const t=theme(); const phrase=t.sentences[0];
    return `${header('EchoMirror AI','Speak, record, stop, play your voice, practise dialogue, and save voice evidence.', `${themeSelector()}`)}
      <div class="activity-board">
        <section class="card"><h2>Voice Mirror Studio</h2><p>Target phrase: <b id="targetPhrase">${esc(phrase)}</b></p>
          <div class="toolbar"><button class="btn primary" data-action="playTargetPhrase">▶ Play Model</button><button class="btn danger" data-action="stopAudio">■ Stop Model</button><button class="btn cyan" data-action="startRecord">🎙️ Start Record</button><button class="btn sun" data-action="stopRecord">■ Stop Record</button><button class="btn" data-action="playRecording">▶ Play My Voice</button><button class="btn" data-action="clearRecording">Clear Voice</button></div>
          <div class="empty" id="recordStatus">Microphone is ready after browser permission. Use HTTPS GitHub Pages for recording.</div>
          <div class="toolbar"><button class="btn primary" data-action="voiceFeedback">AI Gentle Feedback</button><button class="btn cyan" data-action="saveSpeaking">Save Speaking Evidence</button></div>
        </section>
        <section class="card"><h2>Dialogue Quest</h2><p>Practise short child-friendly turns. Click each line and answer with your voice.</p><div class="evidence-list">${dialogueLines(t).map((line,i)=>`<button class="evidence" data-action="playDialogue" data-line="${esc(line)}"><b>${i%2===0?'KIDORA':'Learner'}:</b> ${esc(line)} <span>▶</span></button>`).join('')}</div><h3 style="margin-top:16px">Change Target Sentence</h3><div class="word-bank">${t.sentences.map(s=>`<button class="word-card" data-action="setPhrase" data-phrase="${esc(s)}">${esc(s)}</button>`).join('')}</div></section>
      </div>`;
  }
  function dialogueLines(t){ return [`Hello, young explorer.`, `Hello, KIDORA.`, `What can you see?`, t.sentences[0], `Wonderful voice. Try one more time.`]; }
  function glyphPath(){
    const t=theme();
    return `${header('GlyphPath AI','Read letters, play word sounds, match pictures, and grow your word garden.', `${themeSelector()}<button class="btn" data-action="stopAudio">Stop Audio</button>`)}
      <div class="activity-board">
        <section class="card"><h2>Word Garden</h2><p>Phonics focus: <b>${esc(t.phonics)}</b></p><div class="word-bank">${t.words.map(w=>`<button class="word-card" data-action="readWordCard" data-word="${w[0]}" data-emoji="${w[1]}"><span class="emoji">${w[1]}</span>${esc(w[0])}<br><small>Read + grow</small></button>`).join('')}</div><div class="toolbar"><button class="btn primary" data-action="playMiniStory">Read Mini Story</button><button class="btn cyan" data-action="saveReading">Save Reading Evidence</button></div><div class="empty" id="readingFeedback">Click a word card to hear, read, and grow it.</div></section>
        <section class="card"><h2>Sentence Path</h2><p>Click a sentence to hear it, then read aloud.</p><div class="evidence-list">${t.sentences.map(s=>`<button class="evidence" data-action="readSentence" data-sentence="${esc(s)}"><b>📖</b> ${esc(s)} <span>▶</span></button>`).join('')}</div><h3 style="margin-top:16px">Picture-Word Match</h3><div class="choice-grid">${t.words.slice(0,4).map((w,i)=>`<button class="choice" data-action="matchWord" data-word="${w[0]}"><span style="font-size:42px">${w[1]}</span><br>Match: ${esc(w[0])}</button>`).join('')}</div></section>
      </div>`;
  }
  function storyForge(){
    const t=theme();
    return `${header('StoryForge AI','Draw, trace, build sentences, read your writing, and save storybook evidence.', `${themeSelector()}<button class="btn" data-action="stopAudio">Stop Audio</button>`)}
      <div class="activity-board">
        <section class="card"><h2>Drawing and Tracing Canvas</h2><p>Draw the theme, trace letters, or write a word with your finger/mouse.</p><div class="canvas-wrap"><canvas id="drawCanvas" class="draw" width="900" height="420"></canvas></div><div class="toolbar"><button class="btn" data-action="drawGuide">Show Writing Guide</button><button class="btn danger" data-action="clearCanvas">Clear Canvas</button><button class="btn cyan" data-action="saveDrawing">Save Drawing Evidence</button></div></section>
        <section class="card"><h2>Sentence Train Builder</h2><p>Frame: <b>${esc(t.frame)}</b></p><div class="word-bank">${sentenceTiles(t).map(x=>`<button class="tile" data-action="addSentenceTile" data-tile="${esc(x)}">${esc(x)}</button>`).join('')}</div><h3>Your sentence</h3><div class="sentence-builder" id="sentenceBuilder">${selectedWords.map(w=>`<span class="tile selected">${esc(w)}</span>`).join('')}</div><div class="toolbar"><button class="btn primary" data-action="readBuiltSentence">Read Sentence</button><button class="btn" data-action="clearSentence">Clear Sentence</button><button class="btn cyan" data-action="saveWriting">Save Writing Evidence</button><button class="btn sun" data-action="saveStoryPage">Save Storybook Page</button></div><div class="empty">AI sentence support: choose tiles, hear the sentence, then draw a matching picture.</div></section>
      </div>`;
  }
  function sentenceTiles(t){ const first = t.sentences[0].replace(/[.?!]/g,'').split(' '); const extras = t.words.slice(0,4).map(w=>w[0]); return [...new Set([...first, ...extras])]; }
  function puzzleBridge(){
    const t=theme();
    return `${header('Puzzle Bridge','One integrated quest: listen, speak, read, write, and create to unlock the bridge.', `${themeSelector()}`)}
      <div class="card"><h2>${t.emoji} Mission: ${esc(t.title)}</h2><p>${esc(t.story)}</p><div class="grid-4">
        <div class="metric"><span>1</span><b>Hear</b><p>Play the story clue.</p><button class="btn small primary" data-action="playStory">Play</button></div>
        <div class="metric"><span>2</span><b>Say</b><p>Record the target sentence.</p><button class="btn small cyan" data-action="setView" data-view="echo">Open Speaking</button></div>
        <div class="metric"><span>3</span><b>Read</b><p>Read the word path.</p><button class="btn small primary" data-action="setView" data-view="glyph">Open Reading</button></div>
        <div class="metric"><span>4</span><b>Create</b><p>Build one story page.</p><button class="btn small sun" data-action="setView" data-view="forge">Open Writing</button></div>
      </div><hr><div class="toolbar"><button class="btn primary" data-action="completeBridge">Complete Integrated Mission</button><button class="btn" data-action="printCertificate">Print Quest Passport</button></div></div>
      <div class="area-grid" style="margin-top:16px">${data.quests.filter(q=>q.approved).slice(0,6).map(q=>{const th=theme(q.themeId);return `<button class="area-card bridge" data-action="selectTheme" data-theme="${q.themeId}"><h3>${th.emoji} ${esc(q.title)}</h3><p>${esc(q.mission)}</p><span class="big">${th.emoji}</span></button>`}).join('')}</div>`;
  }
  function wordSpark(){
    const t=theme(); if(!memoryState.cards.length || memoryState.theme!==t.id) setupMemory(t);
    return `${header('WordSpark Lab','Memory cards, word play, fast audio, and theme games.', `${themeSelector()}<button class="btn" data-action="resetMemory">Reset Game</button>`)}
      <div class="activity-board"><section class="card"><h2>Memory Match Game</h2><p>Open cards and match picture with word.</p><div class="memory-grid">${memoryState.cards.map((c,i)=>`<button class="memory ${memoryState.opened.includes(i)||memoryState.matched.includes(c.key)?'open':''}" data-action="openMemory" data-index="${i}">${memoryState.opened.includes(i)||memoryState.matched.includes(c.key)?(c.kind==='emoji'?c.value:esc(c.value)):'❔'}</button>`).join('')}</div></section><section class="card"><h2>Fast Word Player</h2><p>Click each word as fast as possible and say it aloud.</p><div class="word-bank">${t.words.map(w=>`<button class="word-card" data-action="playWord" data-word="${w[0]}"><span class="emoji">${w[1]}</span>${esc(w[0])}</button>`).join('')}</div><div class="toolbar"><button class="btn primary" data-action="saveGameEvidence">Save Game Evidence</button></div><div class="empty">Matched pairs: ${memoryState.matched.length}/${t.words.slice(0,4).length}</div></section></div>`;
  }
  function setupMemory(t){ const pairs=t.words.slice(0,4); let cards=[]; pairs.forEach(w=>{cards.push({key:w[0],kind:'emoji',value:w[1]});cards.push({key:w[0],kind:'word',value:w[0]});}); memoryState={theme:t.id,cards:cards.sort(()=>Math.random()-.5),opened:[],matched:[]}; }
  function livingStorybook(){
    const u=user(); const pages = [...data.storybook.filter(p=>p.studentId===u.id), ...evidenceFor(u.id).filter(e=>['speaking','writing','drawing','reading'].includes(e.type)).map(e=>({...e,pageTitle:e.title}))];
    return `${header('Living Storybook','Your saved voice, reading, writing, drawing, and quest evidence.', `<button class="btn" data-action="exportMyPortfolio">Export Portfolio CSV</button>`)}<div class="grid-3">${pages.length?pages.map(p=>`<div class="card"><span class="badge">${esc(p.type||'page')}</span><h3>${esc(p.pageTitle||p.title)}</h3><p>${esc(p.note||'Saved story evidence.')}</p><small>${new Date(p.date).toLocaleString()}</small>${p.image?`<img src="${p.image}" style="width:100%;border-radius:18px;margin-top:10px;border:1px solid var(--line)" alt="Drawing evidence"/>`:''}${p.audio?`<audio controls src="${p.audio}" style="width:100%;margin-top:10px"></audio>`:''}</div>`).join(''):'<div class="empty">No storybook pages yet. Open StoryForge or EchoMirror and save evidence.</div>'}</div>`;
  }
  function treasureRoom(){
    const u=user(); const ev=evidenceFor(u.id); const badges=['Listening Star','Speaking Hero','Reading Ranger','Writing Wizard','Story Explorer','Kind Tryer','WordSpark Player','Quest Builder'];
    return `${header('Treasure Room','Badges, XP, passport, and mastery celebration.', `<button class="btn primary" data-action="printCertificate">Print Passport</button>`)}<div class="cards-row"><div class="metric"><span>${u.xp||0}</span>XP</div><div class="metric"><span>${u.stars||0}</span>Stars</div><div class="metric"><span>${ev.length}</span>Evidence</div><div class="metric"><span>${Math.min(badges.length,Math.max(1,Math.floor(ev.length/1)))}</span>Badges</div></div><div class="grid-4" style="margin-top:16px">${badges.map((b,i)=>`<div class="card" style="text-align:center;opacity:${i<=ev.length?1:.45}"><div style="font-size:48px">${i<=ev.length?'🏅':'🔒'}</div><h3>${b}</h3><p>${i<=ev.length?'Unlocked through learning evidence.':'Keep exploring to unlock.'}</p></div>`).join('')}</div><div class="card cert" style="margin-top:16px"><h2>KIDORA Quest Passport</h2><p>This certifies that <b>${esc(u.name)}</b> is growing as a ${esc(u.level||levelFromXp(u.xp||0))}.</p><div class="qr"></div><p>${esc(data.settings.copyright)}</p></div>`;
  }

  function renderTeacher(){ if(!['teacherHome','questWeaver','contentStudio','evidenceReview','reports','teacherAnalytics'].includes(currentView)) currentView='teacherHome'; return ({teacherHome,questWeaver,contentStudio,evidenceReview,reports,teacherAnalytics})[currentView](); }
  function teacherHome(){ const students=data.users.filter(u=>u.role==='student'); return `${header('Teacher Quest Cockpit','Control classes, evidence, AI quests, skill growth, and learner portfolios.', `<button class="btn primary" data-action="setView" data-view="questWeaver">Create AI Quest</button><button class="btn" data-action="exportAllData">Export CSV</button>`)}<div class="cards-row"><div class="metric"><span>${students.length}</span>Learners</div><div class="metric"><span>${data.quests.length}</span>Quests</div><div class="metric"><span>${data.evidence.length}</span>Evidence</div><div class="metric"><span>${data.contents.length}</span>Themes</div></div><div class="activity-board"><div class="card"><h2>Class Progress</h2>${studentTable(students)}</div><div class="card"><h2>Active Quest Areas</h2><div class="area-grid" style="grid-template-columns:1fr 1fr">${['sound','echo','glyph','forge'].map(v=>area(v,v==='sound'?'sound':v==='echo'?'echo':v==='glyph'?'glyph':'forge',v==='sound'?'🎧':v==='echo'?'🎙️':v==='glyph'?'🌱':'✍️',v==='sound'?'SoundQuest':v==='echo'?'EchoMirror':v==='glyph'?'GlyphPath':'StoryForge','Teacher can monitor and assign evidence.')).join('')}</div></div></div>`; }
  function studentTable(students){ return `<table class="table"><thead><tr><th>Learner</th><th>Class</th><th>Status</th><th>XP</th><th>Evidence</th></tr></thead><tbody>${students.map(s=>`<tr><td>${s.avatar||'🧒'} ${esc(s.name)}</td><td>${esc(s.className||'-')}</td><td>${s.approved?'Approved':'Pending'}</td><td>${s.xp||0}</td><td>${evidenceFor(s.id).length}</td></tr>`).join('')}</tbody></table>`; }
  function questWeaver(){ return `${header('QuestWeaver AI','Generate a teacher-controlled, child-safe integrated quest.', '')}<div class="grid-2"><div class="card form"><label>Theme</label>${themeSelector()}<label>Quest title</label><input class="input" id="qwTitle" placeholder="e.g., The Lost Rainbow Bridge"/><label>Target sentence</label><input class="input" id="qwSentence" value="${esc(theme().sentences[0])}"/><label>Skill balance</label><select id="qwBalance"><option>Balanced four skills</option><option>Speaking priority</option><option>Reading-writing priority</option><option>Listening and movement priority</option></select><label>AI Safety Note</label><textarea id="qwNote">Child-safe, short, visual, encouraging, no open chat.</textarea><button class="btn primary" data-action="generateQuestAI">Generate Integrated Quest</button><button class="btn cyan" data-action="publishGeneratedQuest">Publish Generated Quest</button></div><div class="card"><h2>Generated Quest Preview</h2><div id="questPreview" class="empty">Generate a quest to see complete Hear → Move → Say → Read → Create → Share activities.</div></div></div>`; }
  function contentStudio(){ return `${header('Content Studio','Manage vocabulary, stories, phonics, sentences, and home practice.', `<button class="btn" data-action="exportContents">Export Contents</button>`)}<div class="grid-2"><div class="card form"><h2>Add New Theme</h2><label>Theme ID</label><input class="input" id="ctId" placeholder="transport"/><label>Title</label><input class="input" id="ctTitle" placeholder="Transport Town"/><label>Emoji</label><input class="input" id="ctEmoji" placeholder="🚗"/><label>Words, comma separated</label><input class="input" id="ctWords" placeholder="car,bus,bike,train"/><label>Sentences, separated by |</label><textarea id="ctSentences" placeholder="I see a car.|The bus is big."></textarea><label>Story</label><textarea id="ctStory" placeholder="A short child-safe story..."></textarea><button class="btn primary" data-action="addTheme">Add Theme</button></div><div class="card"><h2>Existing Themes</h2>${contentsTable()}</div></div>`; }
  function contentsTable(){ return `<table class="table"><thead><tr><th>Theme</th><th>Words</th><th>Actions</th></tr></thead><tbody>${data.contents.map(c=>`<tr><td>${c.emoji} ${esc(c.title)}</td><td>${c.words.length}</td><td><button class="btn small" data-action="selectTheme" data-theme="${c.id}">Open</button> <button class="btn small danger" data-action="deleteTheme" data-theme="${c.id}">Delete</button></td></tr>`).join('')}</tbody></table>`; }
  function evidenceReview(){ return `${header('Evidence Review','Review listening, speaking, reading, writing, drawing, and game evidence.', `<button class="btn" data-action="exportEvidence">Export Evidence</button>`)}<div class="card">${evidenceList(data.evidence, true)}</div>`; }
  function reports(){ const students=data.users.filter(u=>u.role==='student'); return `${header('AI Reports','Generate editable professional progress notes for young learners.', '')}<div class="grid-2"><div class="card form"><label>Select Learner</label><select id="reportStudent">${students.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select><label>Report type</label><select id="reportType"><option>Parent weekly report</option><option>Teacher observation note</option><option>Research summary</option></select><button class="btn primary" data-action="generateReport">Generate Report</button></div><div class="card"><h2>Report Output</h2><textarea id="reportOut" style="min-height:270px" placeholder="Generated report will appear here."></textarea><div class="toolbar"><button class="btn" data-action="copyReport">Copy Report</button><button class="btn" data-action="downloadReport">Download TXT</button></div></div></div>`; }
  function teacherAnalytics(){ return `${header('Research Analytics','Research-ready process, performance, portfolio, and engagement data.', `<button class="btn primary" data-action="exportAllData">Download Full CSV</button>`)}${analyticsCards()}<div class="card" style="margin-top:16px"><h2>Recent System Logs</h2>${analyticsTable()}</div>`; }

  function renderParent(){ if(!['parentHome','parentStory','homePractice','parentReport'].includes(currentView)) currentView='parentHome'; return ({parentHome,parentStory,homePractice,parentReport})[currentView](); }
  function childOfParent(){ const p=user(); return data.users.find(u=>u.id===p.childId) || data.users.find(u=>u.role==='student'); }
  function parentHome(){ const c=childOfParent(); const ev=evidenceFor(c.id); return `${header('Family Growth Window','Follow your child’s English growth positively and safely.', '')}<div class="card"><div class="profile-row"><div class="avatar">${c.avatar}</div><div><h2>${esc(c.name)}</h2><p>${esc(c.level||levelFromXp(c.xp||0))} • ${ev.length} learning evidence items • ${c.stars||0} stars</p></div></div></div><div class="activity-board"><div class="card"><h2>Latest Learning</h2>${evidenceList(ev.slice(0,5))}</div><div class="card"><h2>Skill Growth</h2>${analyticsCards(c.id)}</div></div>`; }
  function parentStory(){ const c=childOfParent(); const pages=data.storybook.filter(p=>p.studentId===c.id); return `${header('Child Storybook','Voice, drawing, sentence, and story evidence saved by your child.', '')}<div class="grid-3">${pages.length?pages.map(p=>`<div class="card"><h3>${esc(p.pageTitle)}</h3><p>${esc(p.note||'Story page')}</p>${p.image?`<img src="${p.image}" style="width:100%;border-radius:16px"/>`:''}${p.audio?`<audio controls src="${p.audio}" style="width:100%"></audio>`:''}</div>`).join(''):'<div class="empty">No storybook pages yet.</div>'}</div>`; }
  function homePractice(){ const t=theme(); return `${header('Home Practice AI','Five-minute parent-child practice generated from the current theme.', `${themeSelector()}<button class="btn primary" data-action="generateHomePractice">Generate New Card</button>`)}<div class="card"><h2>${t.emoji} ${esc(t.title)} Home Card</h2><div id="homePracticeOut"><p><b>1 minute:</b> Listen and repeat three words: ${t.words.slice(0,3).map(w=>w[0]).join(', ')}.</p><p><b>2 minutes:</b> Find one object or picture and say: ${esc(t.frame)}</p><p><b>2 minutes:</b> Draw one small picture and label it with one word.</p><p><b>Positive sentence:</b> Your English voice is growing every day.</p></div></div>`; }
  function parentReport(){ const c=childOfParent(); const ev=evidenceFor(c.id); return `${header('Weekly Growth Report','A simple positive report for parents.', `<button class="btn" data-action="printPage">Print</button>`)}<div class="card"><h2>${esc(c.name)}’s KIDORA Growth</h2><p>${growthReport(c, ev)}</p><h3>Recommended support at home</h3><p>Practise short words through play, songs, drawing, and simple sentence frames. Keep practice short, warm, and encouraging.</p></div>`; }

  function renderAdmin(){ if(!['adminOverview','adminUsers','adminContent','adminQuests','adminSafety','adminAnalytics','adminSettings'].includes(currentView)) currentView='adminOverview'; return ({adminOverview,adminUsers,adminContent,adminQuests,adminSafety,adminAnalytics,adminSettings})[currentView](); }
  function adminOverview(){ return `${header('Admin Control Center','Control users, content, quests, AI safety, analytics, settings, and public identity.', `<button class="btn primary" data-action="exportAllData">Export Full Data</button>`)}${analyticsCards()}<div class="area-grid" style="margin-top:16px">${area('adminUsers','sound','👥','Users','Approve, add, delete, and control role-based access.')}${area('adminContent','glyph','🧰','Content Bank','Manage skill themes, vocabulary, stories, and sentences.')}${area('adminQuests','bridge','🗺️','Quest Library','Publish, unpublish, and control all quest missions.')}${area('adminSafety','treasure','✅','AI Safety','Approve AI-generated quests and stories before children see them.')}${area('adminAnalytics','echo','📈','Analytics','Export learning process and evidence data.')}${area('adminSettings','forge','⚙️','Settings','Edit PIN, copyright, school name, recording, and reset data.')}</div>`; }
  function adminUsers(){ return `${header('User Management','Admin can approve, add, delete, and control all users.', '')}<div class="grid-2"><div class="card form"><h2>Add User</h2><label>Name</label><input class="input" id="adName"/><label>Email</label><input class="input" id="adEmail"/><label>Password</label><input class="input" id="adPass"/><label>Role</label><select id="adRole"><option>student</option><option>teacher</option><option>parent</option></select><label>Class / Link</label><input class="input" id="adClass" placeholder="Class name or child ID"/><button class="btn primary" data-action="adminAddUser">Add User</button></div><div class="card"><h2>All Users</h2>${usersTable()}</div></div>`; }
  function usersTable(){ return `<table class="table"><thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>${data.users.filter(u=>u.role!=='admin').map(u=>`<tr><td>${u.avatar||''} ${esc(u.name)}<br><small>${esc(u.email)}</small></td><td>${u.role}</td><td>${u.approved?'Approved':'Pending'}</td><td><button class="btn small" data-action="toggleApprove" data-user="${u.id}">${u.approved?'Suspend':'Approve'}</button> <button class="btn small danger" data-action="deleteUser" data-user="${u.id}">Delete</button></td></tr>`).join('')}</tbody></table>`; }
  function adminContent(){ return contentStudio(); }
  function adminQuests(){ return `${header('Quest Library','Publish, unpublish, delete, and open every quest.', `<button class="btn primary" data-action="setView" data-view="questWeaver">Create Quest</button>`)}<div class="card"><table class="table"><thead><tr><th>Quest</th><th>Theme</th><th>Status</th><th>Actions</th></tr></thead><tbody>${data.quests.map(q=>{const th=theme(q.themeId);return `<tr><td>${esc(q.title)}<br><small>${esc(q.mission)}</small></td><td>${th.emoji} ${esc(th.title)}</td><td>${q.approved?'Published':'Review'}</td><td><button class="btn small" data-action="toggleQuest" data-quest="${q.id}">${q.approved?'Unpublish':'Publish'}</button> <button class="btn small" data-action="openQuestTheme" data-theme="${q.themeId}">Open</button> <button class="btn small danger" data-action="deleteQuest" data-quest="${q.id}">Delete</button></td></tr>`}).join('')}</tbody></table></div>`; }
  function adminSafety(){ return `${header('AI Safety Review','Approve or reject AI-generated content before children access it.', '')}<div class="grid-2">${data.safetyQueue.length?data.safetyQueue.map(s=>`<div class="card"><span class="badge">${esc(s.kind)} • ${esc(s.status)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><div class="toolbar"><button class="btn primary" data-action="approveSafety" data-safety="${s.id}">Approve</button><button class="btn danger" data-action="rejectSafety" data-safety="${s.id}">Reject</button></div></div>`).join(''):'<div class="empty">No pending AI safety items.</div>'}</div>`; }
  function adminAnalytics(){ return `${header('Analytics and Export','Admin-level control of research data and system logs.', `<button class="btn primary" data-action="exportAllData">Export Full CSV</button><button class="btn" data-action="exportJSON">Export JSON</button>`)}${analyticsCards()}<div class="card" style="margin-top:16px">${analyticsTable()}</div>`; }
  function adminSettings(){ return `${header('Settings','Edit app identity, copyright, Admin PIN, recording, and reset data.', '')}<div class="grid-2"><div class="card form"><label>School / Studio Name</label><input class="input" id="setSchool" value="${esc(data.settings.schoolName)}"/><label>Copyright Text</label><input class="input" id="setCopyright" value="${esc(data.settings.copyright)}"/><label>Admin PIN</label><input class="input" id="setPin" value="${esc(data.settings.adminPin)}"/><label>Recording Enabled</label><select id="setRecording"><option value="true" ${data.settings.recordingEnabled?'selected':''}>Enabled</option><option value="false" ${!data.settings.recordingEnabled?'selected':''}>Disabled</option></select><button class="btn primary" data-action="saveSettings">Save Settings</button></div><div class="card"><h2>Maintenance</h2><p>Use reset only when preparing a clean field-testing version.</p><div class="toolbar"><button class="btn danger" data-action="resetData">Reset Demo Data</button><button class="btn" data-action="clearServiceWorker">Clear App Cache</button></div><p class="hint">After publishing an updated ZIP on GitHub Pages, open the app in a private window if the browser still shows an older cached version.</p></div></div>`; }

  function evidenceList(list, all=false){ if(!list.length) return '<div class="empty">No evidence yet.</div>'; return `<div class="evidence-list">${list.map(e=>{const st=data.users.find(u=>u.id===e.studentId);const th=theme(e.themeId);return `<div class="evidence"><div><b>${esc(e.title)}</b><br><small>${all?esc(st?.name||'Learner')+' • ':''}${th.emoji} ${esc(th.title)} • ${e.type} • ${new Date(e.date).toLocaleString()}</small><p style="margin:4px 0 0">${esc(e.note||'')}</p></div><span class="badge">${e.score||'-'}%</span></div>`}).join('')}</div>`; }
  function analyticsCards(studentId=null){ const ev=studentId?evidenceFor(studentId):data.evidence; const avg=ev.length?Math.round(ev.reduce((s,e)=>s+(e.score||0),0)/ev.length):0; const speak=ev.filter(e=>e.type==='speaking').length; const write=ev.filter(e=>e.type==='writing'||e.type==='drawing').length; const listen=ev.filter(e=>e.type==='listening').length; return `<div class="cards-row"><div class="metric"><span>${ev.length}</span>Evidence</div><div class="metric"><span>${avg}%</span>Avg Score</div><div class="metric"><span>${listen}</span>Listening</div><div class="metric"><span>${speak+write}</span>Productive</div></div>`; }
  function analyticsTable(){ const logs=data.analytics.slice(-20).reverse(); if(!logs.length) return '<div class="empty">No logs yet.</div>'; return `<table class="table"><thead><tr><th>Date</th><th>User</th><th>Action</th><th>Detail</th></tr></thead><tbody>${logs.map(l=>`<tr><td>${new Date(l.date).toLocaleString()}</td><td>${esc(data.users.find(u=>u.id===l.userId)?.name||l.userId)}</td><td>${esc(l.action)}</td><td>${esc(l.detail)}</td></tr>`).join('')}</tbody></table>`; }
  function growthReport(c, ev){ const avg=ev.length?Math.round(ev.reduce((s,e)=>s+(e.score||0),0)/ev.length):0; return `${c.name} is growing as a ${c.level||levelFromXp(c.xp||0)} in KIDORA Quest. The portfolio currently contains ${ev.length} evidence items with an average performance indicator of ${avg}%. The strongest recent learning pattern is active participation through listening, speaking, reading, and writing tasks. Continue using short, playful home practice with pictures, songs, voice repetition, and simple sentence frames.`; }

  function afterRender(){ if(currentView==='forge') initCanvas(); }
  function initCanvas(){
    const canvas=document.getElementById('drawCanvas'); if(!canvas) return; const ctx=canvas.getContext('2d'); canvasState={canvas,ctx,drawing:false};
    ctx.lineWidth=7; ctx.lineCap='round'; ctx.strokeStyle='#6c35ff'; ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    const pos=e=>{ const r=canvas.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; return {x:(p.clientX-r.left)*(canvas.width/r.width), y:(p.clientY-r.top)*(canvas.height/r.height)}; };
    const down=e=>{e.preventDefault(); canvasState.drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y);};
    const move=e=>{ if(!canvasState.drawing) return; e.preventDefault(); const p=pos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); };
    const up=()=>{ canvasState.drawing=false; };
    canvas.addEventListener('mousedown',down); canvas.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
    canvas.addEventListener('touchstart',down,{passive:false}); canvas.addEventListener('touchmove',move,{passive:false}); canvas.addEventListener('touchend',up);
  }

  async function startRecord(){
    if(!data.settings.recordingEnabled) return toast('Recording is disabled by Admin.');
    if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return toast('Voice recording is not supported in this browser.');
    try{
      recordedChunks=[]; const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      mediaRecorder = new MediaRecorder(stream); mediaRecorder.ondataavailable=e=>{ if(e.data.size) recordedChunks.push(e.data); };
      mediaRecorder.onstop=()=>{ const blob=new Blob(recordedChunks,{type:'audio/webm'}); const reader=new FileReader(); reader.onload=()=>{ recordedUrl=reader.result; const st=document.getElementById('recordStatus'); if(st) st.textContent='Voice saved. Click Play My Voice or Save Speaking Evidence.'; }; reader.readAsDataURL(blob); stream.getTracks().forEach(t=>t.stop()); };
      mediaRecorder.start(); const st=document.getElementById('recordStatus'); if(st) st.textContent='Recording now... speak clearly and happily.'; toast('Recording started.'); log('record_start','voice');
    }catch(e){ toast('Microphone permission was not granted.'); }
  }
  function stopRecord(){ if(mediaRecorder && mediaRecorder.state==='recording'){ mediaRecorder.stop(); toast('Recording stopped.'); } else toast('No active recording.'); }
  function playRecording(){ if(!recordedUrl) return toast('No voice recording yet.'); new Audio(recordedUrl).play(); log('record_playback','voice'); }
  function clearRecording(){ if(recordedUrl) URL.revokeObjectURL(recordedUrl); recordedUrl=''; recordedChunks=[]; const st=document.getElementById('recordStatus'); if(st) st.textContent='Voice cleared. Start recording again.'; }

  function exportCSV(name, rows){
    if(!rows.length){ toast('No data to export.'); return; }
    const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];
    const csv=[keys.join(','),...rows.map(r=>keys.map(k=>`"${String(r[k]??'').replace(/"/g,'""')}"`).join(','))].join('\n');
    downloadFile(name, csv, 'text/csv');
  }
  function downloadFile(name, content, type='text/plain'){
    const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),300);
  }

  document.addEventListener('click', async e => {
    const btn = e.target.closest('[data-action]'); if(!btn) return;
    const action = btn.dataset.action;
    if(action==='openLogin') return openLogin(btn.dataset.role);
    if(action==='openAdminPin') return openAdminPin();
    if(action==='closeModal') return closeModal();
    if(action==='doLogin') return doLogin();
    if(action==='doAdminPin') return doAdminPin();
    if(action==='registerStudent') return registerStudent();
    if(action==='logout') return logout();
    if(action==='setView') return setView(btn.dataset.view);
    if(action==='selectTheme' || action==='openQuestTheme'){ currentThemeId=btn.dataset.theme; data.currentThemeId=currentThemeId; saveData(); toast('Theme selected.'); return render(); }
    if(action==='changeTheme'){ return; }
    if(action==='stopAudio') return stopAudio();
    if(action==='playWelcome') return speak('Welcome to KIDORA Quest. Choose a world. Listen, speak, read, write, create, and share your story.');
    if(action==='playWord') return speak(btn.dataset.word);
    if(action==='playStory') return speak(theme().story);
    if(action==='playClue') return speak(`Find the word ${theme().words[0][0]}. Tap ${theme().words[0][0]}.`);
    if(action==='playChant') return speak(theme().words.slice(0,4).map(w=>w[0]).join(', ') + `. ${theme().sentences[0]}. Great listening.`);
    if(action==='playCommand') return speak(`Listen and move. Touch ${theme().words[0][0]}. Say ${theme().words[0][0]}. Now clap one time.`);
    if(action==='playSlow') return speak(theme().sentences[0], {rate:.55});
    if(action==='listenChoice') return listenChoice(btn);
    if(action==='newListeningRound') return newListeningRound();
    if(action==='saveListening') return addEvidence('listening', `${theme().title} listening quest`, 92, 'Completed listening clue, word player, and choice activity.');
    if(action==='playTargetPhrase') return speak(document.getElementById('targetPhrase')?.textContent || theme().sentences[0]);
    if(action==='startRecord') return startRecord();
    if(action==='stopRecord') return stopRecord();
    if(action==='playRecording') return playRecording();
    if(action==='clearRecording') return clearRecording();
    if(action==='voiceFeedback') return voiceFeedback();
    if(action==='saveSpeaking') return saveSpeaking();
    if(action==='playDialogue') return speak(btn.dataset.line);
    if(action==='setPhrase'){ const el=document.getElementById('targetPhrase'); if(el) el.textContent=btn.dataset.phrase; speak(btn.dataset.phrase); return; }
    if(action==='readWordCard') return readWordCard(btn.dataset.word, btn.dataset.emoji);
    if(action==='playMiniStory') return speak(`${theme().story} ${theme().sentences.join(' ')}`);
    if(action==='saveReading') return addEvidence('reading', `${theme().title} reading path`, 90, 'Read word cards, sentence path, and mini story.');
    if(action==='readSentence') return speak(btn.dataset.sentence);
    if(action==='matchWord') return matchWord(btn);
    if(action==='drawGuide') return drawGuide();
    if(action==='clearCanvas') return clearCanvas();
    if(action==='saveDrawing') return saveDrawing();
    if(action==='addSentenceTile'){ selectedWords.push(btn.dataset.tile); return render(); }
    if(action==='readBuiltSentence') return speak(selectedWords.join(' ') || theme().sentences[0]);
    if(action==='clearSentence'){ selectedWords=[]; return render(); }
    if(action==='saveWriting') return addEvidence('writing', `${theme().title} sentence writing`, 88, `Built sentence: ${selectedWords.join(' ') || theme().sentences[0]}`);
    if(action==='saveStoryPage') return saveStoryPage();
    if(action==='completeBridge') return addEvidence('integrated', `${theme().title} Puzzle Bridge`, 94, 'Completed integrated Hear, Say, Read, Create mission.');
    if(action==='resetMemory'){ setupMemory(theme()); return render(); }
    if(action==='openMemory') return openMemory(Number(btn.dataset.index));
    if(action==='saveGameEvidence') return addEvidence('game', `${theme().title} WordSpark game`, 87, 'Completed memory and fast word game.');
    if(action==='printCertificate' || action==='printPage') return window.print();
    if(action==='exportMyPortfolio') return exportCSV('kidora-my-portfolio.csv', evidenceFor(user().id));
    if(action==='generateQuestAI') return generateQuestAI();
    if(action==='publishGeneratedQuest') return publishGeneratedQuest();
    if(action==='addTheme') return addTheme();
    if(action==='deleteTheme') return deleteTheme(btn.dataset.theme);
    if(action==='exportContents') return exportCSV('kidora-contents.csv', data.contents.map(c=>({...c,words:c.words.map(w=>w[0]).join('|'),sentences:c.sentences.join('|')})));
    if(action==='exportEvidence') return exportCSV('kidora-evidence.csv', data.evidence);
    if(action==='generateReport') return generateReport();
    if(action==='copyReport') return navigator.clipboard?.writeText(val('reportOut')).then(()=>toast('Report copied.'));
    if(action==='downloadReport') return downloadFile('kidora-report.txt', val('reportOut'));
    if(action==='exportAllData') return exportAllData();
    if(action==='generateHomePractice') return generateHomePractice();
    if(action==='adminAddUser') return adminAddUser();
    if(action==='toggleApprove') return toggleApprove(btn.dataset.user);
    if(action==='deleteUser') return deleteUser(btn.dataset.user);
    if(action==='toggleQuest') return toggleQuest(btn.dataset.quest);
    if(action==='deleteQuest') return deleteQuest(btn.dataset.quest);
    if(action==='approveSafety') return safety(btn.dataset.safety,'Approved');
    if(action==='rejectSafety') return safety(btn.dataset.safety,'Rejected');
    if(action==='exportJSON') return downloadFile('kidora-data.json', JSON.stringify(data,null,2), 'application/json');
    if(action==='saveSettings') return saveSettings();
    if(action==='resetData') return resetData();
    if(action==='clearServiceWorker') return clearServiceWorker();
  });
  document.addEventListener('change', e=>{
    if(e.target?.dataset?.action==='changeTheme'){ currentThemeId=e.target.value; data.currentThemeId=currentThemeId; saveData(); render(); }
  });

  function listenChoice(btn){ document.querySelectorAll('#listenChoices .choice').forEach(x=>x.classList.remove('correct','wrong')); if(btn.dataset.correct==='yes'){ btn.classList.add('correct'); document.getElementById('soundFeedback').textContent='Wonderful listening. You found the target word.'; speak('Wonderful listening.'); } else { btn.classList.add('wrong'); document.getElementById('soundFeedback').textContent='Good try. Listen again and look for the first word.'; speak('Good try. Listen again.'); } }
  function newListeningRound(){ const t=theme(); t.words.push(t.words.shift()); saveData(); render(); setTimeout(()=>speak(`Find ${theme().words[0][0]}`),200); }
  function voiceFeedback(){ const msg=recordedUrl?'Great effort. Your voice is saved. Try to speak slowly, clearly, and happily.':'Please record your voice first, then ask for feedback.'; const st=document.getElementById('recordStatus'); if(st) st.textContent=msg; speak(msg); }
  function saveSpeaking(){ if(!recordedUrl) return toast('Record your voice before saving.'); const phrase=document.getElementById('targetPhrase')?.textContent||theme().sentences[0]; addEvidence('speaking', `${theme().title} speaking voice`, 89, `Recorded target phrase: ${phrase}`, {audio:recordedUrl}); data.storybook.unshift({id:uid('p'),studentId:user().id,type:'speaking',pageTitle:`Voice page: ${phrase}`,note:`Speaking evidence for ${theme().title}.`,audio:recordedUrl,date:new Date().toISOString()}); saveData(); }
  function readWordCard(word, emoji){ const fb=document.getElementById('readingFeedback'); if(fb) fb.innerHTML=`<div style="font-size:54px">${emoji}</div><b>${esc(word)}</b> grew in Glyph Garden. Read it aloud now.`; speak(word); }
  function matchWord(btn){ btn.classList.add('correct'); speak(`Matched ${btn.dataset.word}. Great reading.`); }
  function drawGuide(){ const {ctx,canvas}=canvasState; if(!ctx) return; ctx.save(); ctx.strokeStyle='rgba(108,53,255,.18)'; ctx.lineWidth=2; ctx.font='70px system-ui'; ctx.fillStyle='rgba(108,53,255,.16)'; ctx.fillText(theme().words[0][0],80,180); ctx.fillText(theme().frame.replace('____', theme().words[0][0]),80,290); ctx.restore(); }
  function clearCanvas(){ const {ctx,canvas}=canvasState; if(!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
  function saveDrawing(){ const img=canvasState.canvas?.toDataURL('image/png'); if(!img) return toast('Canvas is not ready.'); addEvidence('drawing', `${theme().title} drawing canvas`, 86, 'Saved drawing or tracing canvas evidence.', {image:img}); }
  function saveStoryPage(){ const img=canvasState.canvas?.toDataURL('image/png') || ''; const sentence=selectedWords.join(' ') || theme().sentences[0]; data.storybook.unshift({id:uid('p'),studentId:user().id,type:'story',pageTitle:`${theme().title} story page`,note:`Sentence: ${sentence}`,image:img,date:new Date().toISOString()}); addEvidence('writing', `${theme().title} storybook page`, 91, `Created a storybook page: ${sentence}`, {image:img}); saveData(); }
  function openMemory(i){ if(memoryState.opened.includes(i) || memoryState.matched.includes(memoryState.cards[i].key)) return; memoryState.opened.push(i); if(memoryState.opened.length===2){ const [a,b]=memoryState.opened; if(memoryState.cards[a].key===memoryState.cards[b].key && a!==b){ memoryState.matched.push(memoryState.cards[a].key); speak(`Match! ${memoryState.cards[a].key}`); memoryState.opened=[]; if(memoryState.matched.length===theme().words.slice(0,4).length){ toast('All pairs matched.'); showConfetti(); } } else { setTimeout(()=>{memoryState.opened=[]; render();},800); } } render(); }

  let generatedQuest=null;
  function generateQuestAI(){ const t=theme(); const title=val('qwTitle') || `The ${t.title} Story Bridge`; generatedQuest={id:uid('q'),title,themeId:t.id,approved:false,status:'Safety Review',createdBy:user()?.name||'Teacher',mission:`AI-generated integrated quest using ${t.words.slice(0,4).map(w=>w[0]).join(', ')} and sentence ${val('qwSentence')||t.sentences[0]}.`,xp:45}; const preview=document.getElementById('questPreview'); if(preview) preview.innerHTML=`<h3>${esc(title)}</h3><p><b>Story:</b> ${esc(t.story)}</p><p><b>Hear:</b> Listen and identify ${esc(t.words[0][0])}.</p><p><b>Move:</b> Drag or tap the correct picture.</p><p><b>Say:</b> Record “${esc(val('qwSentence')||t.sentences[0])}”.</p><p><b>Read:</b> Match word cards and read sentence path.</p><p><b>Create:</b> Draw, label, and save a storybook page.</p><p><b>Safety:</b> Teacher review required before publishing.</p>`; toast('AI quest generated. Review before publishing.'); }
  function publishGeneratedQuest(){ if(!generatedQuest) return toast('Generate a quest first.'); data.quests.unshift(generatedQuest); data.safetyQueue.unshift({id:uid('s'),kind:'AI Quest',title:generatedQuest.title,status:'Pending',text:generatedQuest.mission}); saveData(); toast('Quest saved and sent to AI safety review.'); }
  function addTheme(){ const id=val('ctId').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-'); if(!id || !val('ctTitle')) return toast('Theme ID and title are required.'); const words=val('ctWords').split(',').map(w=>w.trim()).filter(Boolean).map(w=>[w,'⭐']); const sentences=val('ctSentences').split('|').map(s=>s.trim()).filter(Boolean); data.contents.push({id,title:val('ctTitle'),emoji:val('ctEmoji')||'⭐',phonics:'teacher-defined',words:words.length?words:[['word','⭐']],sentences:sentences.length?sentences:['I see a word.'],story:val('ctStory')||'A teacher-created KIDORA story.',frame:'I see ____.',home:'Practise the words at home.'}); saveData(); toast('Theme added.'); render(); }
  function deleteTheme(id){ if(data.contents.length<=1) return toast('At least one theme is required.'); data.contents=data.contents.filter(c=>c.id!==id); data.quests=data.quests.filter(q=>q.themeId!==id); if(currentThemeId===id) currentThemeId=data.contents[0].id; saveData(); toast('Theme deleted.'); render(); }
  function generateReport(){ const s=data.users.find(u=>u.id===val('reportStudent')); const ev=evidenceFor(s.id); document.getElementById('reportOut').value=growthReport(s,ev); }
  function generateHomePractice(){ const t=theme(); const out=document.getElementById('homePracticeOut'); if(out) out.innerHTML=`<p><b>Warm-up:</b> Play “find and say” with ${t.words.slice(0,3).map(w=>w[0]).join(', ')}.</p><p><b>Voice practice:</b> Child says: ${esc(t.sentences[0])}</p><p><b>Reading:</b> Parent points to word cards and child reads one word at a time.</p><p><b>Writing:</b> Child draws one picture and labels it with one word.</p><p><b>Encouragement:</b> Good try. Your English story is growing.</p>`; }
  function adminAddUser(){ const role=val('adRole'); const u={id:uid('u'),name:val('adName'),email:val('adEmail'),password:val('adPass'),role,approved:true,avatar:role==='teacher'?'👩‍🏫':role==='parent'?'👨‍👩‍👧':'🧒',className:val('adClass'),xp:0,stars:0,level:'Little Listener'}; if(!u.name||!u.email||!u.password) return toast('Name, email, and password are required.'); data.users.push(u); saveData(); toast('User added.'); render(); }
  function toggleApprove(id){ const u=data.users.find(x=>x.id===id); if(u){u.approved=!u.approved; saveData(); render();} }
  function deleteUser(id){ data.users=data.users.filter(u=>u.id!==id); data.evidence=data.evidence.filter(e=>e.studentId!==id); data.storybook=data.storybook.filter(p=>p.studentId!==id); saveData(); toast('User deleted.'); render(); }
  function toggleQuest(id){ const q=data.quests.find(x=>x.id===id); if(q){q.approved=!q.approved;q.status=q.approved?'Published':'Safety Review';saveData();render();} }
  function deleteQuest(id){ data.quests=data.quests.filter(q=>q.id!==id); saveData(); toast('Quest deleted.'); render(); }
  function safety(id,status){ const item=data.safetyQueue.find(s=>s.id===id); if(item){item.status=status;if(status==='Approved'){const q=data.quests.find(q=>q.title===item.title); if(q){q.approved=true;q.status='Published';}} else {data.safetyQueue=data.safetyQueue.filter(s=>s.id!==id);} saveData(); toast(`AI item ${status.toLowerCase()}.`); render();} }
  function saveSettings(){ data.settings.schoolName=val('setSchool'); data.settings.copyright=val('setCopyright'); data.settings.adminPin=val('setPin')||'2026'; data.settings.recordingEnabled=val('setRecording')==='true'; saveData(); toast('Settings saved.'); render(); }
  function resetData(){ if(!confirm('Reset all KIDORA Quest data to clean demo seed?')) return; data=DEFAULT_DATA(); saveData(); toast('Data reset.'); render(); }
  async function clearServiceWorker(){ if('serviceWorker' in navigator){ const regs=await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r=>r.unregister())); } if(window.caches){ const keys=await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); } toast('App cache cleared. Refresh the page.'); }
  function exportAllData(){ const rows=[...data.evidence.map(e=>({dataset:'evidence',...e})),...data.analytics.map(a=>({dataset:'analytics',...a})),...data.users.map(u=>({dataset:'users',id:u.id,name:u.name,email:u.email,role:u.role,approved:u.approved,className:u.className,xp:u.xp,stars:u.stars}))]; exportCSV('kidora-quest-full-data.csv', rows); }

  render();
})();
