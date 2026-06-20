/* KIDORA Quest - GitHub Pages ready, no external API required. */
const Kidora = (() => {
  const STORE = 'kidoraQuest.v1';
  const STEPS = ['Hear', 'Move', 'Say', 'Read', 'Create', 'Share'];
  const ROLE_LABELS = {
    child: 'Young Learner',
    teacher: 'Teacher',
    parent: 'Parent',
    admin: 'Administrator'
  };
  const ZONES = [
    { key: 'listening', name: 'SoundQuest AI', zone: 'Sound Forest', emoji: '🎧', desc: 'Listen to clues, songs, commands, and story sounds.', color: 'rgba(75,182,255,.35)' },
    { key: 'speaking', name: 'EchoMirror AI', zone: 'Echo Valley', emoji: '🗣️', desc: 'Record words, sentences, characters, and mini dialogues.', color: 'rgba(255,111,174,.34)' },
    { key: 'reading', name: 'GlyphPath AI', zone: 'Glyph Garden', emoji: '🌱', desc: 'Grow letters, words, phrases, and story sentences.', color: 'rgba(67,217,173,.35)' },
    { key: 'writing', name: 'StoryForge AI', zone: 'StoryForge Studio', emoji: '✍️', desc: 'Trace, build, draw, label, and write mini story pages.', color: 'rgba(255,209,102,.42)' },
    { key: 'integrated', name: 'Puzzle Bridge', zone: 'Quest Bridge', emoji: '🧩', desc: 'Solve missions by using all four English skills together.', color: 'rgba(107,76,255,.26)' },
    { key: 'portfolio', name: 'Living Storybook', zone: 'My Living Storybook', emoji: '📖', desc: 'Save voice, drawing, reading, writing, and progress evidence.', color: 'rgba(255,138,61,.30)' }
  ];
  const EMOJIS = {
    cat: '🐱', dog: '🐶', bird: '🐦', fish: '🐟', rabbit: '🐰', elephant: '🐘', lion: '🦁', monkey: '🐵',
    red: '🔴', blue: '🔵', yellow: '🟡', green: '🟢', purple: '🟣', orange: '🟠',
    circle: '⭕', square: '🟦', triangle: '🔺', star: '⭐', heart: '💛',
    mother: '👩', father: '👨', sister: '👧', brother: '👦', baby: '👶', family: '👨‍👩‍👧',
    apple: '🍎', banana: '🍌', milk: '🥛', rice: '🍚', bread: '🍞', water: '💧',
    sunny: '☀️', rainy: '🌧️', windy: '🌬️', cloudy: '☁️', hot: '🔥', cold: '❄️',
    ball: '⚽', book: '📘', pencil: '✏️', bag: '🎒', chair: '🪑', table: '🧸',
    run: '🏃', jump: '🤸', sing: '🎵', read: '📚', write: '📝', play: '🎲'
  };

  const state = {
    db: null,
    user: null,
    page: 'dashboard',
    authMode: 'login',
    selectedRole: 'child',
    activeQuest: null,
    questStep: 0,
    selectedAnswer: null,
    builtSentence: [],
    drawingData: '',
    audioData: '',
    lastReport: '',
    activeNav: '',
    mediaRecorder: null,
    audioChunks: []
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const esc = (value = '') => String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const now = () => new Date().toISOString();
  const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function toast(message) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = message;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  function save() {
    localStorage.setItem(STORE, JSON.stringify(state.db));
  }

  function load() {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      try {
        state.db = JSON.parse(raw);
        ensureShape();
        return;
      } catch (e) {
        console.warn('Storage reset because of invalid data', e);
      }
    }
    state.db = defaultDb();
    save();
  }

  function ensureShape() {
    const d = state.db;
    d.users ||= [];
    d.quests ||= [];
    d.analytics ||= [];
    d.safetyQueue ||= [];
    d.contentBank ||= { themes: [], vocabulary: [], sentenceFrames: [] };
    d.settings ||= { schoolName: 'KIDORA Quest Learning Studio', adminPin: '2026', requireTeacherApproval: true, allowVoiceRecording: true };
    d.certificates ||= [];
  }

  function defaultDb() {
    const baseQuest1 = makeQuest({
      id: 'quest-rainbow',
      title: 'The Lost Rainbow Bridge',
      theme: 'Colours',
      level: 'Early Beginner',
      words: ['red', 'blue', 'yellow', 'green'],
      frame: 'I see ___.',
      culturalContext: 'child-friendly daily objects',
      published: true
    });
    const baseQuest2 = makeQuest({
      id: 'quest-animal',
      title: 'The Missing Animal Sounds',
      theme: 'Animals',
      level: 'Early Beginner',
      words: ['cat', 'dog', 'bird', 'fish'],
      frame: 'I see a ___.',
      culturalContext: 'animal island',
      published: true
    });
    const baseQuest3 = makeQuest({
      id: 'quest-shapes',
      title: 'The Shape Star Rescue',
      theme: 'Shapes',
      level: 'Beginner',
      words: ['circle', 'square', 'triangle', 'star'],
      frame: 'This is a ___.',
      culturalContext: 'magic sky objects',
      published: true
    });
    const baseQuest4 = makeQuest({
      id: 'quest-family',
      title: 'The Friendly Family Tree',
      theme: 'Family',
      level: 'Beginner',
      words: ['mother', 'father', 'sister', 'brother'],
      frame: 'This is my ___.',
      culturalContext: 'home and family care',
      published: true
    });
    const childId = 'u-child-demo';
    const teacherId = 'u-teacher-demo';
    const parentId = 'u-parent-demo';
    return {
      users: [
        userRecord({ id: childId, name: 'Alya Kidora', email: 'student@kidora.local', password: 'student2026', role: 'child', approved: true, parentId, teacherId, avatar: '🦊' }),
        userRecord({ id: teacherId, name: 'Dr. KIDORA Teacher', email: 'teacher@kidora.local', password: 'teacher2026', role: 'teacher', approved: true, avatar: '🧑‍🏫' }),
        userRecord({ id: parentId, name: 'Parent Demo', email: 'parent@kidora.local', password: 'parent2026', role: 'parent', approved: true, childId, avatar: '👪' }),
        userRecord({ id: 'u-admin-demo', name: 'KIDORA Admin', email: 'admin@kidora.local', password: 'admin2026', role: 'admin', approved: true, avatar: '🛡️' })
      ],
      quests: [baseQuest1, baseQuest2, baseQuest3, baseQuest4],
      analytics: [],
      safetyQueue: [],
      certificates: [],
      contentBank: {
        themes: ['Colours', 'Animals', 'Shapes', 'Family', 'Food', 'Weather', 'Classroom', 'Actions'],
        vocabulary: Object.keys(EMOJIS),
        sentenceFrames: ['I see ___.', 'I see a ___.', 'This is a ___.', 'This is my ___.', 'I like ___.', 'The ___ is big.']
      },
      settings: {
        schoolName: 'KIDORA Quest Learning Studio',
        adminPin: '2026',
        requireTeacherApproval: true,
        allowVoiceRecording: true
      }
    };
  }

  function userRecord(data) {
    return {
      id: data.id || uid('u'),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      approved: data.approved ?? true,
      avatar: data.avatar || avatarFor(data.role),
      childId: data.childId || '',
      parentId: data.parentId || '',
      teacherId: data.teacherId || '',
      createdAt: now(),
      progress: data.role === 'child' ? {
        points: 0,
        badges: ['First Spark'],
        completedQuests: [],
        skill: { listening: 0, speaking: 0, reading: 0, writing: 0, integrated: 0 },
        portfolio: [],
        adaptiveNotes: [],
        streak: 1
      } : undefined
    };
  }

  function avatarFor(role) {
    return { child: '🦊', teacher: '🧑‍🏫', parent: '👪', admin: '🛡️' }[role] || '✨';
  }

  function vocabObjects(words) {
    return words.map(w => ({ word: String(w).trim().toLowerCase(), emoji: EMOJIS[String(w).trim().toLowerCase()] || '✨' })).filter(v => v.word);
  }

  function makeQuest({ id, title, theme, level, words, frame, culturalContext = '', published = false }) {
    const vocab = vocabObjects(words);
    const first = vocab[0]?.word || 'star';
    const nounArticle = /^[aeiou]/.test(first) ? 'an' : 'a';
    const sentence = (frame || 'I see ___.').replace('___', first).replace('a a ', 'a ').replace('a an ', 'an ');
    const story = `The ${theme} Gate is sleeping. Listen to the clue, speak the magic words, read the glyph path, and forge a story page to wake the world.`;
    return {
      id: id || uid('quest'),
      title: title || `The ${theme} Quest`,
      theme,
      level,
      frame: frame || `I see ${nounArticle} ___.`,
      culturalContext,
      vocab,
      story,
      mascot: chooseMascot(theme),
      published,
      aiGenerated: true,
      createdAt: now(),
      tasks: {
        hear: { prompt: `Listen carefully. Which word do you hear?`, target: first, instruction: `Tap ${first}.` },
        move: { prompt: `Move the word cards into the story basket.`, target: vocab.map(v => v.word) },
        say: { prompt: `Record your brave voice.`, target: sentence },
        read: { prompt: `Read the glyph and choose the matching picture.`, target: first },
        create: { prompt: `Draw, trace, or write a story page about ${first}.`, target: sentence },
        share: { prompt: `Save your learning evidence in the Living Storybook.`, target: sentence }
      }
    };
  }

  function chooseMascot(theme) {
    const t = String(theme).toLowerCase();
    if (t.includes('animal')) return '🦁';
    if (t.includes('colour') || t.includes('color')) return '🌈';
    if (t.includes('shape')) return '⭐';
    if (t.includes('family')) return '🏡';
    if (t.includes('food')) return '🍎';
    if (t.includes('weather')) return '☀️';
    return '🦊';
  }

  const AI = {
    quest({ theme, level, vocab, frame, context }) {
      const words = String(vocab || '').split(',').map(w => w.trim()).filter(Boolean).slice(0, 8);
      const titleBank = [
        `The Hidden ${theme} Gate`,
        `The ${theme} Spark Rescue`,
        `The Lost ${theme} Path`,
        `The Whispering ${theme} Island`
      ];
      const title = titleBank[Math.floor(Math.random() * titleBank.length)];
      return makeQuest({ title, theme, level, words: words.length ? words : ['cat', 'dog', 'bird'], frame, culturalContext: context, published: false });
    },
    feedback({ skill, correct, target }) {
      if (correct) {
        return {
          listening: `Wonderful listening. You found “${target}”.`,
          speaking: `Beautiful brave voice. Your sentence is growing.`,
          reading: `Great reading. The glyph path is shining.`,
          writing: `Excellent creating. Your story page is ready.`,
          integrated: `Quest solved. Your English world became brighter.`
        }[skill] || 'Excellent effort.';
      }
      return {
        listening: `Listen one more time. The first sound can help you find “${target}”.`,
        speaking: `Good try. Say it slowly and clearly.`,
        reading: `Look at the picture clue, then read the word again.`,
        writing: `Try building the sentence one small word at a time.`,
        integrated: `You are close. Try again with the clue.`
      }[skill] || 'Try one more time.';
    },
    adaptive(child) {
      const s = child.progress.skill;
      const lowSkill = Object.entries(s).sort((a, b) => a[1] - b[1])[0]?.[0] || 'listening';
      const highSkill = Object.entries(s).sort((a, b) => b[1] - a[1])[0]?.[0] || 'speaking';
      const map = {
        listening: 'Add slower audio, fewer answer options, and more sound-picture matching.',
        speaking: 'Use short repeat-after-me tasks, louder voice prompts, and character voice activation.',
        reading: 'Use picture-word matching before moving to phrase and sentence reading.',
        writing: 'Use tracing, letter tiles, and sentence frames before free writing.',
        integrated: 'Use shorter quests with one target sentence across all skills.'
      };
      return `GrowthPath AI suggests strengthening ${lowSkill}. ${map[lowSkill]} Strongest current area: ${highSkill}.`;
    },
    report(child) {
      const p = child.progress;
      const s = p.skill;
      const totalArtifacts = p.portfolio.length;
      const strongest = Object.entries(s).sort((a, b) => b[1] - a[1])[0]?.[0] || 'listening';
      const target = Object.entries(s).sort((a, b) => a[1] - b[1])[0]?.[0] || 'writing';
      return `${child.name} is developing through the KIDORA Quest integrated skills pathway. Current evidence shows ${p.completedQuests.length} completed quest(s), ${totalArtifacts} portfolio artifact(s), and ${p.points} learning points. The strongest current area is ${strongest}, shown through task completion, attempts, and saved evidence. The next growth target is ${target}. Recommended support: ${AI.adaptive(child)} Continue short, playful, repeated practice with sound, movement, voice, reading clues, and story creation.`;
    },
    homePractice(child) {
      const target = Object.entries(child.progress.skill).sort((a, b) => a[1] - b[1])[0]?.[0] || 'speaking';
      const cards = {
        listening: 'Play “Find the Sound”: say one English word from today and ask your child to point to the correct object or picture.',
        speaking: 'Play “Brave Voice”: ask your child to say three words clearly and one short sentence such as “I see a cat.”',
        reading: 'Play “Word Hunt”: show three word cards and ask your child to match each word with a picture.',
        writing: 'Play “Draw and Label”: ask your child to draw one object and copy or trace its English word.',
        integrated: 'Play “Mini Story”: listen to one word, say it, find it, and draw it together.'
      };
      return cards[target] || cards.speaking;
    },
    observation({ childName, notes }) {
      const clean = Array.from(notes || []).join(', ') || 'participated in the learning activity';
      return `${childName} ${clean}. The observation indicates active participation in a multimodal English learning cycle. Suggested next step: provide short repeated exposure, supportive voice practice, and one visible portfolio task.`;
    }
  };

  function init() {
    load();
    const savedUserId = sessionStorage.getItem('kidora.currentUser');
    if (savedUserId) {
      state.user = state.db.users.find(u => u.id === savedUserId) || null;
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    render();
  }

  function render() {
    if (!state.user) return renderAuth();
    renderApp();
  }

  function renderAuth() {
    $('#app').innerHTML = `
      <div class="hero-bg"><div class="float-shape one"></div><div class="float-shape two"></div><div class="float-shape three"></div><div class="float-shape four"></div></div>
      <main class="app-shell auth-page">
        <section class="brand-panel">
          <div class="logo-row">
            <div class="logo-mark">K</div>
            <div class="logo-text"><h1>KIDORA Quest</h1><p>AI-integrated storyworld for young learners</p></div>
          </div>
          <h2 class="hero-title">Hear. Move. <span>Speak.</span><br/>Read. Create. Share.</h2>
          <p class="hero-sub">A game-based English learning world where children complete integrated-skill quests, record brave voices, grow glyph paths, forge story pages, and build a living portfolio with teacher-controlled AI support.</p>
          <div class="pill-row">
            <span class="pill">QuestWeaver AI</span><span class="pill">EchoMirror AI</span><span class="pill">StoryForge AI</span><span class="pill">Living Storybook</span><span class="pill">Research Cockpit</span>
          </div>
          <div class="world-preview">
            ${ZONES.slice(0,6).map(z => `<div class="world-tile"><span class="emoji">${z.emoji}</span><h3>${z.zone}</h3><p>${z.desc}</p></div>`).join('')}
          </div>
        </section>
        <aside class="auth-panel">
          <div class="tabbar"><button class="${state.authMode === 'login' ? 'active' : ''}" onclick="Kidora.setAuthMode('login')">Login</button><button class="${state.authMode === 'register' ? 'active' : ''}" onclick="Kidora.setAuthMode('register')">Register</button></div>
          ${state.authMode === 'login' ? loginForm() : registerForm()}
          <div class="demo-box">
            <strong>Demo accounts</strong><br/>
            Student: student@kidora.local / student2026<br/>
            Teacher: teacher@kidora.local / teacher2026<br/>
            Parent: parent@kidora.local / parent2026<br/>
            Admin: admin@kidora.local / admin2026
          </div>
        </aside>
      </main>`;
  }

  function loginForm() {
    return `<form class="form-grid" onsubmit="Kidora.login(event)">
      <div class="field"><label>Email</label><input class="input" id="loginEmail" type="email" required placeholder="student@kidora.local" /></div>
      <div class="field"><label>Password</label><input class="input" id="loginPassword" type="password" required placeholder="Password" /></div>
      <button class="btn" type="submit">Enter KIDORA Quest</button>
      <button class="btn ghost" type="button" onclick="Kidora.quickDemo('child')">Open Student Demo</button>
    </form>`;
  }

  function registerForm() {
    return `<form class="form-grid" onsubmit="Kidora.register(event)">
      <div class="field"><label>Full Name</label><input class="input" id="regName" required placeholder="Child / Teacher / Parent name" /></div>
      <div class="field"><label>Email</label><input class="input" id="regEmail" type="email" required placeholder="name@example.com" /></div>
      <div class="field"><label>Password</label><input class="input" id="regPassword" type="password" required minlength="6" placeholder="Minimum 6 characters" /></div>
      <div class="field"><label>Role</label><select id="regRole"><option value="child">Young Learner</option><option value="teacher">Teacher</option><option value="parent">Parent</option></select></div>
      <button class="btn alt" type="submit">Create Account</button>
      <p class="mini-note">Teacher accounts can be reviewed in the Admin workspace when approval control is enabled.</p>
    </form>`;
  }

  function setAuthMode(mode) { state.authMode = mode; renderAuth(); }

  function login(event) {
    event.preventDefault();
    const email = $('#loginEmail').value.trim().toLowerCase();
    const password = $('#loginPassword').value;
    const user = state.db.users.find(u => u.email.toLowerCase() === email && u.password === password);
    if (!user) return toast('Login failed. Check email and password.');
    if (!user.approved) return toast('This account is waiting for admin approval.');
    state.user = user;
    state.page = 'dashboard';
    sessionStorage.setItem('kidora.currentUser', user.id);
    render();
  }

  function quickDemo(role) {
    const user = state.db.users.find(u => u.role === role && u.approved);
    if (!user) return toast('Demo account not found.');
    state.user = user;
    state.page = 'dashboard';
    sessionStorage.setItem('kidora.currentUser', user.id);
    render();
  }

  function register(event) {
    event.preventDefault();
    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim().toLowerCase();
    const password = $('#regPassword').value;
    const role = $('#regRole').value;
    if (state.db.users.some(u => u.email.toLowerCase() === email)) return toast('Email already exists.');
    const approved = !(role === 'teacher' && state.db.settings.requireTeacherApproval);
    const user = userRecord({ name, email, password, role, approved, avatar: avatarFor(role) });
    state.db.users.push(user);
    save();
    toast(approved ? 'Account created. You can login now.' : 'Teacher account created and waiting for admin approval.');
    state.authMode = 'login';
    renderAuth();
  }

  function renderApp() {
    const navItems = getNavItems(state.user.role);
    if (!navItems.find(n => n.key === state.page)) state.page = 'dashboard';
    const active = navItems.find(n => n.key === state.page) || navItems[0];
    $('#app').innerHTML = `
      <div class="hero-bg"><div class="float-shape one"></div><div class="float-shape two"></div><div class="float-shape three"></div><div class="float-shape four"></div></div>
      <main class="app-shell app-layout">
        <aside class="sidebar panel">
          <div class="logo-row"><div class="logo-mark">K</div><div class="logo-text"><h2>KIDORA</h2><p>Quest AI</p></div></div>
          <div class="user-card"><div class="avatar">${state.user.avatar}</div><h3>${esc(state.user.name)}</h3><p>${ROLE_LABELS[state.user.role]}</p></div>
          <nav class="nav">
            ${navItems.map(item => `<button class="${state.page === item.key ? 'active' : ''}" onclick="Kidora.go('${item.key}')"><span>${item.icon}</span>${item.label}</button>`).join('')}
            <button onclick="Kidora.logout()"><span>🚪</span>Logout</button>
          </nav>
        </aside>
        <section class="main">
          <header class="topbar panel"><div><h2>${active.icon} ${active.label}</h2><p>${esc(active.subtitle)}</p></div><button class="btn ghost no-print" onclick="Kidora.speak('Welcome to KIDORA Quest. Hear, move, speak, read, create, and share.')">🔊 Voice Guide</button></header>
          <div id="screen">${route()}</div>
        </section>
      </main>`;
    afterRender();
  }

  function getNavItems(role) {
    if (role === 'child') return [
      { key: 'dashboard', icon: '🗺️', label: 'Quest Map', subtitle: 'Choose a living English world and complete integrated-skill missions.' },
      { key: 'quest', icon: '🧩', label: 'Active Quest', subtitle: 'Hear, move, say, read, create, and share.' },
      { key: 'portfolio', icon: '📖', label: 'Living Storybook', subtitle: 'Your saved voice, drawing, reading, and writing evidence.' },
      { key: 'rewards', icon: '🏆', label: 'Treasure Room', subtitle: 'Badges, points, stars, and certificates.' }
    ];
    if (role === 'teacher') return [
      { key: 'dashboard', icon: '📊', label: 'Teacher Cockpit', subtitle: 'Monitor progress, evidence, and growth recommendations.' },
      { key: 'questweaver', icon: '✨', label: 'QuestWeaver AI', subtitle: 'Generate and publish integrated AI-assisted lesson quests.' },
      { key: 'evidence', icon: '🎙️', label: 'Evidence Review', subtitle: 'Review voice recordings, drawings, writing, and portfolio artifacts.' },
      { key: 'reports', icon: '📝', label: 'Reports', subtitle: 'Generate parent reports, observations, rubrics, and research summaries.' },
      { key: 'research', icon: '🔬', label: 'Research Cockpit', subtitle: 'Export analytics for field testing and publication evidence.' }
    ];
    if (role === 'parent') return [
      { key: 'dashboard', icon: '🌻', label: 'Family Window', subtitle: 'See today’s learning, voice moments, and growth.' },
      { key: 'storybook', icon: '📖', label: 'Storybook View', subtitle: 'View your child’s story artifacts.' },
      { key: 'practice', icon: '🏡', label: 'Home Practice AI', subtitle: 'Short family practice activities generated from progress.' }
    ];
    return [
      { key: 'dashboard', icon: '🛡️', label: 'Admin Console', subtitle: 'Manage users, settings, content, safety, and analytics.' },
      { key: 'users', icon: '👥', label: 'Users', subtitle: 'Approve accounts and manage role-based access.' },
      { key: 'content', icon: '📚', label: 'Content Bank', subtitle: 'Manage themes, vocabulary, sentence frames, and quest library.' },
      { key: 'safety', icon: '🧠', label: 'AI Safety Review', subtitle: 'Review generated quests before learners access them.' },
      { key: 'analytics', icon: '📈', label: 'Analytics Export', subtitle: 'Export anonymized evidence for classroom research.' },
      { key: 'settings', icon: '⚙️', label: 'Settings', subtitle: 'Institution identity, approval, and app controls.' }
    ];
  }

  function route() {
    const r = state.user.role;
    if (r === 'child') return childRoute();
    if (r === 'teacher') return teacherRoute();
    if (r === 'parent') return parentRoute();
    return adminRoute();
  }

  function childRoute() {
    if (state.page === 'quest') return renderActiveQuest();
    if (state.page === 'portfolio') return renderPortfolio(state.user);
    if (state.page === 'rewards') return renderRewards();
    return renderChildDashboard();
  }

  function teacherRoute() {
    if (state.page === 'questweaver') return renderQuestWeaver();
    if (state.page === 'evidence') return renderEvidenceReview();
    if (state.page === 'reports') return renderReports();
    if (state.page === 'research') return renderResearchCockpit();
    return renderTeacherDashboard();
  }

  function parentRoute() {
    if (state.page === 'storybook') return renderParentStorybook();
    if (state.page === 'practice') return renderParentPractice();
    return renderParentDashboard();
  }

  function adminRoute() {
    if (state.page === 'users') return renderAdminUsers();
    if (state.page === 'content') return renderAdminContent();
    if (state.page === 'safety') return renderSafety();
    if (state.page === 'analytics') return renderResearchCockpit(true);
    if (state.page === 'settings') return renderSettings();
    return renderAdminDashboard();
  }

  function afterRender() {
    if (state.page === 'quest' && state.user.role === 'child' && state.activeQuest && STEPS[state.questStep] === 'Create') initCanvas();
  }

  function go(page) {
    state.page = page;
    renderApp();
  }

  function logout() {
    state.user = null;
    state.activeQuest = null;
    sessionStorage.removeItem('kidora.currentUser');
    renderAuth();
  }

  function childStats(child = state.user) {
    const p = child.progress;
    const complete = state.db.quests.filter(q => q.published).length || 1;
    return {
      points: p.points,
      quests: p.completedQuests.length,
      questPct: Math.round((p.completedQuests.length / complete) * 100),
      portfolio: p.portfolio.length,
      badges: p.badges.length,
      skill: p.skill
    };
  }

  function renderChildDashboard() {
    const stats = childStats();
    const quests = state.db.quests.filter(q => q.published);
    return `<div class="grid">
      <section class="panel">
        <div class="section-title"><div><h3>Welcome, ${esc(state.user.name)} ${state.user.avatar}</h3><p>Your English world grows when you listen, speak, read, write, and create.</p></div><button class="btn alt" onclick="Kidora.startRecommendedQuest()">Start AI Recommended Quest</button></div>
        <div class="grid four">
          <div class="stat-card"><div class="label">Points</div><div class="value">${stats.points}</div></div>
          <div class="stat-card"><div class="label">Completed Quests</div><div class="value">${stats.quests}</div></div>
          <div class="stat-card"><div class="label">Portfolio</div><div class="value">${stats.portfolio}</div></div>
          <div class="stat-card"><div class="label">Badges</div><div class="value">${stats.badges}</div></div>
        </div>
      </section>
      <section class="panel">
        <div class="section-title"><div><h3>Living Quest Map</h3><p>Each zone is connected to integrated English skill evidence.</p></div></div>
        <div class="quest-map">
          ${ZONES.map(z => `<div class="zone-card" style="--zone:${z.color}"><span class="emoji">${z.emoji}</span><h3>${z.zone}</h3><p>${z.name}: ${z.desc}</p><div class="progress" style="--w:${zoneProgress(z.key, stats.skill)}%"><span></span></div></div>`).join('')}
        </div>
      </section>
      <section class="panel">
        <div class="section-title"><div><h3>Published AI Quests</h3><p>Teacher-approved storyworld missions for young learners.</p></div></div>
        <div class="grid two">
          ${quests.map(q => questCard(q)).join('') || '<div class="empty">No quests published yet.</div>'}
        </div>
      </section>
    </div>`;
  }

  function zoneProgress(key, skill) {
    if (key === 'portfolio') return clamp(state.user.progress.portfolio.length * 20, 0, 100);
    if (key === 'integrated') return clamp(skill.integrated || 0, 0, 100);
    return clamp(skill[key] || 0, 0, 100);
  }

  function questCard(q) {
    const done = state.user?.progress?.completedQuests?.includes(q.id);
    return `<article class="card">
      <div class="badge-row"><span class="badge">${esc(q.theme)}</span><span class="badge">${esc(q.level)}</span><span class="badge">${q.aiGenerated ? 'AI-assisted' : 'Teacher-made'}</span></div>
      <h3>${q.mascot} ${esc(q.title)}</h3>
      <p>${esc(q.story)}</p>
      <p><strong>Words:</strong> ${q.vocab.map(v => `${v.emoji} ${esc(v.word)}`).join(', ')}</p>
      <button class="btn ${done ? 'green' : ''}" onclick="Kidora.startQuest('${q.id}')">${done ? 'Replay Quest' : 'Start Quest'}</button>
    </article>`;
  }

  function startRecommendedQuest() {
    const quests = state.db.quests.filter(q => q.published);
    if (!quests.length) return toast('No published quests are available yet.');
    const done = new Set(state.user.progress.completedQuests);
    const next = quests.find(q => !done.has(q.id)) || quests[0];
    startQuest(next.id);
  }

  function startQuest(id) {
    const quest = state.db.quests.find(q => q.id === id);
    if (!quest) return toast('Quest not found.');
    state.activeQuest = structuredCloneSafe(quest);
    state.questStep = 0;
    state.selectedAnswer = null;
    state.builtSentence = [];
    state.drawingData = '';
    state.audioData = '';
    state.page = 'quest';
    renderApp();
    setTimeout(() => speak(`Quest started. ${quest.title}. ${quest.story}`), 300);
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function renderActiveQuest() {
    if (!state.activeQuest) return `<section class="panel"><div class="empty">No active quest. Choose a quest from the Quest Map.</div><button class="btn" onclick="Kidora.go('dashboard')">Open Quest Map</button></section>`;
    const q = state.activeQuest;
    const step = STEPS[state.questStep];
    return `<section class="activity-shell">
      <div class="story-scene">
        <div class="badge-row"><span class="badge">${esc(q.theme)}</span><span class="badge">${esc(q.level)}</span><span class="badge">${step} Step</span></div>
        <div class="character">${q.mascot}</div>
        <div class="speech"><strong>${esc(q.title)}</strong><br/>${esc(q.story)}<br/><br/><span id="aiFeedback">${esc(currentPrompt(q, step))}</span></div>
      </div>
      <div class="activity-card panel">
        <div class="section-title"><div><h3>${step} Mission</h3><p>${stepDescription(step)}</p></div></div>
        <div class="stepper">${STEPS.map((s, i) => `<span class="step ${i === state.questStep ? 'active' : ''}">${i + 1}. ${s}</span>`).join('')}</div>
        ${activityForStep(q, step)}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px" class="no-print">
          <button class="btn ghost" onclick="Kidora.previousStep()" ${state.questStep === 0 ? 'disabled' : ''}>Back</button>
          <button class="btn" onclick="Kidora.completeStep()">${state.questStep === STEPS.length - 1 ? 'Finish Quest' : 'Complete Step'}</button>
        </div>
      </div>
    </section>`;
  }

  function currentPrompt(q, step) {
    const key = step.toLowerCase();
    return q.tasks[key]?.prompt || 'Complete this mission.';
  }

  function stepDescription(step) {
    return {
      Hear: 'Listen to AI narration and choose the correct sound or word.',
      Move: 'Move word cards and build meaning through action.',
      Say: 'Record your voice and activate the story character.',
      Read: 'Read the glyph path and match word with picture.',
      Create: 'Draw, trace, or build a sentence in StoryForge Studio.',
      Share: 'Save your voice, writing, and drawing evidence.'
    }[step];
  }

  function activityForStep(q, step) {
    const target = q.tasks[step.toLowerCase()]?.target;
    if (step === 'Hear') {
      const options = shuffle(q.vocab).slice(0, 4);
      return `<div>
        <button class="btn alt" onclick="Kidora.speak('${esc(target)}')">🔊 Listen to Word</button>
        <button class="btn ghost" onclick="Kidora.speak('${esc(q.tasks.hear.instruction)}')">Hear Instruction</button>
        <div class="options">${options.map(v => `<button class="option-card" onclick="Kidora.chooseHear('${v.word}', '${target}')"><span class="emoji">${v.emoji}</span>${esc(v.word)}</button>`).join('')}</div>
      </div>`;
    }
    if (step === 'Move') {
      return `<div>
        <p class="mini-note">Tap word cards to move them into the story basket. This replaces complex drag-and-drop so it works on tablets and phones.</p>
        <div class="drag-board">
          <div class="word-bank"><strong>Word Bank</strong><br/>${q.vocab.map(v => `<button class="tile" onclick="Kidora.addSentenceWord('${v.word}')">${v.emoji} ${esc(v.word)}</button>`).join('')}</div>
          <div class="drop-zone"><strong>Story Basket</strong><div class="sentence-line" id="sentenceLine">${state.builtSentence.map(w => `<span class="tile">${esc(w)}</span>`).join('') || 'Tap words to fill the basket.'}</div><br/><button class="btn ghost small" onclick="Kidora.clearSentence()">Clear Basket</button></div>
        </div>
      </div>`;
    }
    if (step === 'Say') {
      return `<div>
        <div class="report-box"><strong>Voice Target</strong><br/>${esc(target)}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
          <button class="btn alt" onclick="Kidora.speak('${esc(target)}')">🔊 Hear Target</button>
          <button class="btn green" onclick="Kidora.startRecording()">🎙️ Start Recording</button>
          <button class="btn red" onclick="Kidora.stopRecording()">⏹ Stop</button>
          <button class="btn ghost" onclick="Kidora.simulateRecording('${esc(target)}')">Use Demo Voice Evidence</button>
        </div>
        <div id="recordingStatus" class="mini-note" style="margin-top:12px">Recording status will appear here. Browser microphone permission may be required.</div>
        ${state.audioData ? `<audio class="audio-preview" controls src="${state.audioData}"></audio>` : ''}
      </div>`;
    }
    if (step === 'Read') {
      const options = shuffle(q.vocab).slice(0, 4);
      return `<div>
        <div class="report-box"><strong>Glyph Path</strong><br/><span style="font-size:42px;letter-spacing:8px">${esc(target)}</span></div>
        <div class="options">${options.map(v => `<button class="option-card" onclick="Kidora.chooseRead('${v.word}', '${target}')"><span class="emoji">${v.emoji}</span>${esc(v.word)}</button>`).join('')}</div>
      </div>`;
    }
    if (step === 'Create') {
      return `<div>
        <div class="report-box"><strong>StoryForge Target</strong><br/>${esc(target)}</div>
        <div class="canvas-wrap" style="margin-top:12px"><canvas id="drawCanvas" width="860" height="360"></canvas></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
          <button class="btn ghost small" onclick="Kidora.clearCanvas()">Clear Drawing</button>
          <button class="btn small" onclick="Kidora.saveCanvas()">Save Drawing Evidence</button>
          <button class="btn alt small" onclick="Kidora.speak('${esc(target)}')">Read Sentence Aloud</button>
        </div>
        <div class="field" style="margin-top:12px"><label>Write or copy your sentence</label><input id="writingInput" class="input" value="${esc(target)}" /></div>
      </div>`;
    }
    return `<div>
      <div class="report-box"><strong>Quest Evidence Summary</strong><br/>
        Voice evidence: ${state.audioData ? 'Ready' : 'Not recorded yet'}<br/>
        Drawing evidence: ${state.drawingData ? 'Ready' : 'Use StoryForge to save drawing'}<br/>
        Sentence: ${esc(q.tasks.create.target)}
      </div>
      <button class="btn green" onclick="Kidora.savePortfolioArtifact()">Save to Living Storybook</button>
    </div>`;
  }

  function chooseHear(word, target) {
    const correct = word === target;
    $$('.option-card').forEach(btn => {
      const txt = btn.textContent.trim().toLowerCase();
      if (txt.includes(word)) btn.classList.add(correct ? 'correct' : 'wrong');
    });
    $('#aiFeedback').textContent = AI.feedback({ skill: 'listening', correct, target });
    if (correct) award('listening', 8);
    else recordAnalytics('listening_retry', { target, selected: word });
  }

  function chooseRead(word, target) {
    const correct = word === target;
    $$('.option-card').forEach(btn => {
      const txt = btn.textContent.trim().toLowerCase();
      if (txt.includes(word)) btn.classList.add(correct ? 'correct' : 'wrong');
    });
    $('#aiFeedback').textContent = AI.feedback({ skill: 'reading', correct, target });
    if (correct) award('reading', 8);
    else recordAnalytics('reading_retry', { target, selected: word });
  }

  function addSentenceWord(word) {
    state.builtSentence.push(word);
    recordAnalytics('move_word', { word });
    renderApp();
  }

  function clearSentence() {
    state.builtSentence = [];
    renderApp();
  }

  function completeStep() {
    const step = STEPS[state.questStep];
    const stepSkill = { Hear: 'listening', Move: 'integrated', Say: 'speaking', Read: 'reading', Create: 'writing', Share: 'integrated' }[step];
    award(stepSkill, step === 'Share' ? 10 : 5);
    recordAnalytics('complete_step', { questId: state.activeQuest.id, step, skill: stepSkill });
    if (state.questStep < STEPS.length - 1) {
      state.questStep += 1;
      renderApp();
      return;
    }
    finishQuest();
  }

  function previousStep() {
    state.questStep = clamp(state.questStep - 1, 0, STEPS.length - 1);
    renderApp();
  }

  function finishQuest() {
    const child = state.user;
    const q = state.activeQuest;
    if (!child.progress.completedQuests.includes(q.id)) child.progress.completedQuests.push(q.id);
    if (!child.progress.badges.includes(`${q.theme} Explorer`)) child.progress.badges.push(`${q.theme} Explorer`);
    child.progress.adaptiveNotes.unshift({ date: now(), note: AI.adaptive(child) });
    award('integrated', 12);
    recordAnalytics('finish_quest', { questId: q.id, title: q.title });
    save();
    toast('Quest completed. Your English world is brighter.');
    state.activeQuest = null;
    state.page = 'portfolio';
    renderApp();
  }

  function award(skill, points) {
    if (!state.user || state.user.role !== 'child') return;
    const p = state.user.progress;
    p.points += points;
    p.skill[skill] = clamp((p.skill[skill] || 0) + points, 0, 100);
    if (p.points >= 50 && !p.badges.includes('Voice Spark')) p.badges.push('Voice Spark');
    if (p.points >= 100 && !p.badges.includes('Story Builder')) p.badges.push('Story Builder');
    if (p.points >= 180 && !p.badges.includes('KIDORA Explorer')) p.badges.push('KIDORA Explorer');
    save();
  }

  function recordAnalytics(event, data = {}) {
    state.db.analytics.push({ id: uid('a'), userId: state.user?.id || '', role: state.user?.role || '', event, data, createdAt: now() });
    save();
  }

  function savePortfolioArtifact() {
    if (!state.activeQuest) return toast('No active quest to save.');
    const q = state.activeQuest;
    const writingInput = $('#writingInput');
    const sentence = writingInput?.value || q.tasks.create.target;
    const artifact = {
      id: uid('art'),
      questId: q.id,
      questTitle: q.title,
      theme: q.theme,
      sentence,
      drawingData: state.drawingData,
      audioData: state.audioData,
      words: q.vocab.map(v => v.word),
      date: now(),
      skills: ['listening', 'speaking', 'reading', 'writing']
    };
    state.user.progress.portfolio.unshift(artifact);
    recordAnalytics('portfolio_saved', { questId: q.id, artifactId: artifact.id });
    save();
    toast('Saved to Living Storybook.');
  }

  function renderPortfolio(child) {
    const artifacts = child.progress.portfolio;
    return `<section class="panel">
      <div class="section-title"><div><h3>Living Storybook</h3><p>Multimodal evidence: voice, drawing, words, sentences, and quest completion.</p></div></div>
      ${artifacts.length ? `<div class="portfolio-grid">${artifacts.map(artifactCard).join('')}</div>` : '<div class="empty">No portfolio evidence yet. Complete a quest and save your story page.</div>'}
    </section>`;
  }

  function artifactCard(a) {
    return `<article class="artifact">
      <div class="badge-row"><span class="badge">${esc(a.theme)}</span><span class="badge">${fmtDate(a.date)}</span></div>
      <h3>${esc(a.questTitle)}</h3>
      <p><strong>Sentence:</strong> ${esc(a.sentence)}</p>
      ${a.drawingData ? `<img src="${a.drawingData}" alt="Drawing evidence" />` : '<div class="empty">No drawing saved</div>'}
      ${a.audioData ? `<audio class="audio-preview" controls src="${a.audioData}"></audio>` : '<p class="mini-note">No voice evidence saved.</p>'}
    </article>`;
  }

  function renderRewards() {
    const p = state.user.progress;
    return `<div class="grid">
      <section class="panel">
        <div class="section-title"><div><h3>Treasure Room</h3><p>Effort-based rewards, not pressure-based ranking.</p></div><button class="btn alt" onclick="Kidora.generateCertificate()">Generate Certificate</button></div>
        <div class="grid four">
          <div class="stat-card"><div class="label">Points</div><div class="value">${p.points}</div></div>
          <div class="stat-card"><div class="label">Badges</div><div class="value">${p.badges.length}</div></div>
          <div class="stat-card"><div class="label">Quests</div><div class="value">${p.completedQuests.length}</div></div>
          <div class="stat-card"><div class="label">Story Pages</div><div class="value">${p.portfolio.length}</div></div>
        </div>
      </section>
      <section class="panel"><h3>My Badges</h3><div class="badge-row">${p.badges.map(b => `<span class="badge">🏅 ${esc(b)}</span>`).join('')}</div></section>
      <section id="certificateArea">${latestCertificateHtml(state.user.id)}</section>
    </div>`;
  }

  function generateCertificate() {
    const cert = { id: uid('KIDORA-CERT'), userId: state.user.id, name: state.user.name, points: state.user.progress.points, quests: state.user.progress.completedQuests.length, issuedAt: now(), code: `KIDORA-${Math.random().toString(36).slice(2, 8).toUpperCase()}` };
    state.db.certificates.unshift(cert);
    save();
    renderApp();
    toast('Certificate generated. Use browser Print to save as PDF.');
  }

  function latestCertificateHtml(userId) {
    const cert = state.db.certificates.find(c => c.userId === userId);
    if (!cert) return '<div class="empty">No certificate generated yet.</div>';
    return `<div class="certificate">
      <div class="seal">🏆</div>
      <p class="badge" style="display:inline-block">Quest Mastery Passport</p>
      <h1>Certificate of KIDORA Quest Growth</h1>
      <p>This certifies that</p>
      <h2>${esc(cert.name)}</h2>
      <p>has completed integrated English learning quests through listening, speaking, reading, writing, creativity, and portfolio evidence.</p>
      <div class="grid three" style="margin:18px 0"><div class="stat-card"><div class="label">Points</div><div class="value">${cert.points}</div></div><div class="stat-card"><div class="label">Quests</div><div class="value">${cert.quests}</div></div><div class="stat-card"><div class="label">Verification</div><div class="value" style="font-size:18px">${cert.code}</div></div></div>
      <p class="mini-note">Issued by ${esc(state.db.settings.schoolName)} on ${fmtDate(cert.issuedAt)}. Local verification code is stored in this browser database.</p>
      <button class="btn no-print" onclick="window.print()">Print / Save Certificate</button>
    </div>`;
  }

  function renderTeacherDashboard() {
    const children = state.db.users.filter(u => u.role === 'child');
    const totalArtifacts = children.reduce((sum, c) => sum + c.progress.portfolio.length, 0);
    const completed = children.reduce((sum, c) => sum + c.progress.completedQuests.length, 0);
    return `<div class="grid">
      <section class="panel"><div class="section-title"><div><h3>Teacher Quest Cockpit</h3><p>Class learning evidence across integrated English skills.</p></div><button class="btn alt" onclick="Kidora.go('questweaver')">Create AI Quest</button></div>
        <div class="grid four"><div class="stat-card"><div class="label">Learners</div><div class="value">${children.length}</div></div><div class="stat-card"><div class="label">Published Quests</div><div class="value">${state.db.quests.filter(q => q.published).length}</div></div><div class="stat-card"><div class="label">Completed</div><div class="value">${completed}</div></div><div class="stat-card"><div class="label">Artifacts</div><div class="value">${totalArtifacts}</div></div></div>
      </section>
      <section class="panel"><h3>Class Growth Map</h3>${children.map(childGrowthCard).join('') || '<div class="empty">No learners yet.</div>'}</section>
      <section class="panel"><h3>AI Recommendations</h3><div class="grid two">${children.map(c => `<div class="card"><h3>${c.avatar} ${esc(c.name)}</h3><p>${esc(AI.adaptive(c))}</p></div>`).join('') || '<div class="empty">No data yet.</div>'}</div></section>
    </div>`;
  }

  function childGrowthCard(c) {
    return `<div class="card" style="margin-bottom:12px"><div class="section-title"><div><h3>${c.avatar} ${esc(c.name)}</h3><p>${c.progress.points} points • ${c.progress.portfolio.length} portfolio artifacts</p></div></div>${skillBars(c.progress.skill)}</div>`;
  }

  function skillBars(skill) {
    return `<div class="kpi-bars">${Object.entries(skill).map(([k, v]) => `<div class="kpi"><span>${esc(k)}</span><div class="bar"><span style="width:${clamp(v, 0, 100)}%"></span></div><span>${v}%</span></div>`).join('')}</div>`;
  }

  function renderQuestWeaver() {
    const unpublished = state.db.quests.filter(q => !q.published);
    return `<div class="grid two">
      <section class="panel">
        <div class="section-title"><div><h3>QuestWeaver AI</h3><p>Generate a full integrated English quest from teacher-selected objectives.</p></div></div>
        <form class="form-grid" onsubmit="Kidora.generateQuest(event)">
          <div class="field"><label>Theme</label><input class="input" id="qTheme" required value="Food" /></div>
          <div class="field"><label>Age / Level</label><select id="qLevel"><option>Early Beginner</option><option>Beginner</option><option>Lower Primary</option></select></div>
          <div class="field"><label>Vocabulary, comma separated</label><input class="input" id="qVocab" required value="apple, banana, milk, bread" /></div>
          <div class="field"><label>Sentence Frame</label><select id="qFrame">${state.db.contentBank.sentenceFrames.map(f => `<option>${esc(f)}</option>`).join('')}</select></div>
          <div class="field"><label>Cultural / classroom context</label><textarea id="qContext" rows="3">healthy food and daily classroom conversation</textarea></div>
          <button class="btn alt" type="submit">Generate Integrated Quest</button>
        </form>
      </section>
      <section class="panel">
        <h3>Generated Quest Preview / Safety Queue</h3>
        ${unpublished.length ? unpublished.map(q => `<article class="card" style="margin-bottom:12px"><h3>${q.mascot} ${esc(q.title)}</h3><p>${esc(q.story)}</p><p><strong>Skills:</strong> listening, speaking, reading, writing, portfolio</p><p><strong>Words:</strong> ${q.vocab.map(v => `${v.emoji} ${esc(v.word)}`).join(', ')}</p><button class="btn green" onclick="Kidora.publishQuest('${q.id}')">Approve and Publish</button></article>`).join('') : '<div class="empty">No generated quest waiting for approval.</div>'}
      </section>
      <section class="panel" style="grid-column:1/-1"><h3>Published Quest Library</h3><div class="grid two">${state.db.quests.filter(q => q.published).map(q => `<article class="card"><h3>${q.mascot} ${esc(q.title)}</h3><p>${esc(q.theme)} • ${esc(q.level)}</p><p>${q.vocab.map(v => `${v.emoji} ${esc(v.word)}`).join(', ')}</p><button class="btn ghost" onclick="Kidora.cloneQuest('${q.id}')">Clone for Editing</button></article>`).join('')}</div></section>
    </div>`;
  }

  function generateQuest(event) {
    event.preventDefault();
    const quest = AI.quest({ theme: $('#qTheme').value.trim(), level: $('#qLevel').value, vocab: $('#qVocab').value, frame: $('#qFrame').value, context: $('#qContext').value.trim() });
    state.db.quests.unshift(quest);
    state.db.safetyQueue.unshift({ id: uid('safe'), questId: quest.id, type: 'AI-generated quest', status: 'Pending review', createdAt: now() });
    save();
    toast('Quest generated and placed in safety review.');
    renderApp();
  }

  function publishQuest(id) {
    const q = state.db.quests.find(x => x.id === id);
    if (!q) return;
    q.published = true;
    const item = state.db.safetyQueue.find(x => x.questId === id);
    if (item) item.status = 'Approved';
    save();
    toast('Quest approved and published for learners.');
    renderApp();
  }

  function cloneQuest(id) {
    const q = state.db.quests.find(x => x.id === id);
    if (!q) return;
    const copy = structuredCloneSafe(q);
    copy.id = uid('quest');
    copy.title = `${copy.title} Remix`;
    copy.published = false;
    copy.createdAt = now();
    state.db.quests.unshift(copy);
    save();
    toast('Quest cloned into draft queue.');
    renderApp();
  }

  function renderEvidenceReview() {
    const children = state.db.users.filter(u => u.role === 'child');
    const artifacts = children.flatMap(c => c.progress.portfolio.map(a => ({ ...a, childName: c.name, avatar: c.avatar })));
    return `<section class="panel"><div class="section-title"><div><h3>Voice and Portfolio Evidence Review</h3><p>Teacher review of multimodal learning evidence.</p></div></div>
      ${artifacts.length ? `<div class="portfolio-grid">${artifacts.map(a => `<article class="artifact"><h3>${a.avatar} ${esc(a.childName)}</h3><p><strong>${esc(a.questTitle)}</strong></p><p>${esc(a.sentence)}</p>${a.drawingData ? `<img src="${a.drawingData}" alt="drawing"/>` : ''}${a.audioData ? `<audio class="audio-preview" controls src="${a.audioData}"></audio>` : '<p class="mini-note">No audio saved.</p>'}<button class="btn ghost small" onclick="Kidora.addTeacherNote('${a.id}')">Add Observation Note</button></article>`).join('')}</div>` : '<div class="empty">No evidence has been saved by learners yet.</div>'}
    </section>`;
  }

  function addTeacherNote(artifactId) {
    const notes = prompt('Write a short teacher observation note for this artifact:');
    if (!notes) return;
    recordAnalytics('teacher_observation', { artifactId, notes });
    toast('Observation note saved to analytics.');
  }

  function renderReports() {
    const children = state.db.users.filter(u => u.role === 'child');
    return `<div class="grid two">
      <section class="panel"><h3>AI Progress Report Generator</h3><form class="form-grid" onsubmit="Kidora.generateReport(event)"><div class="field"><label>Select learner</label><select id="reportChild">${children.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div><button class="btn alt">Generate Professional Report</button></form><div class="report-box" style="margin-top:14px">${esc(state.lastReport || 'Generated report will appear here.')}</div></section>
      <section class="panel"><h3>AI Observation Note Builder</h3><form class="form-grid" onsubmit="Kidora.generateObservation(event)"><div class="field"><label>Child</label><select id="obsChild">${children.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div><div class="field"><label>Observed behaviors</label><select id="obsNotes" multiple size="7"><option>showed confident speaking</option><option>needed repeated listening support</option><option>matched words with pictures</option><option>enjoyed drawing and labelling</option><option>used sentence frames independently</option><option>needed fine-motor tracing support</option><option>completed the quest with enthusiasm</option></select></div><button class="btn">Generate Observation</button></form></section>
      <section class="panel" style="grid-column:1/-1"><h3>Simple Young Learner Rubric</h3>${rubricTable()}</section>
    </div>`;
  }

  function generateReport(event) {
    event.preventDefault();
    const child = state.db.users.find(u => u.id === $('#reportChild').value);
    state.lastReport = AI.report(child);
    recordAnalytics('ai_report_generated', { childId: child.id });
    renderApp();
  }

  function generateObservation(event) {
    event.preventDefault();
    const child = state.db.users.find(u => u.id === $('#obsChild').value);
    const notes = Array.from($('#obsNotes').selectedOptions).map(o => o.value);
    state.lastReport = AI.observation({ childName: child.name, notes });
    recordAnalytics('ai_observation_generated', { childId: child.id, notes });
    renderApp();
  }

  function rubricTable() {
    const rows = [
      ['Listening', 'Needs repeated support', 'Understands with pictures', 'Understands familiar words', 'Understands short instructions'],
      ['Speaking', 'Repeats with help', 'Says single words', 'Says short phrases', 'Says simple sentences'],
      ['Reading', 'Recognizes pictures', 'Matches picture-word cards', 'Reads simple words', 'Reads short sentences'],
      ['Writing', 'Traces with help', 'Copies words', 'Builds familiar sentences', 'Creates a labelled story page']
    ];
    return `<div class="table-wrap"><table><thead><tr><th>Skill</th><th>Beginning</th><th>Developing</th><th>Good</th><th>Excellent</th></tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function renderResearchCockpit(admin = false) {
    const events = state.db.analytics.slice().reverse();
    return `<section class="panel">
      <div class="section-title"><div><h3>${admin ? 'Admin Analytics Export' : 'Research Cockpit'}</h3><p>Anonymized learning-process and portfolio data for field testing.</p></div><button class="btn alt" onclick="Kidora.exportAnalytics()">Download CSV</button></div>
      <div class="grid four"><div class="stat-card"><div class="label">Events</div><div class="value">${state.db.analytics.length}</div></div><div class="stat-card"><div class="label">Users</div><div class="value">${state.db.users.length}</div></div><div class="stat-card"><div class="label">Quests</div><div class="value">${state.db.quests.length}</div></div><div class="stat-card"><div class="label">Artifacts</div><div class="value">${state.db.users.filter(u => u.role === 'child').reduce((s,u)=>s+u.progress.portfolio.length,0)}</div></div></div>
      <div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>Date</th><th>User</th><th>Role</th><th>Event</th><th>Data</th></tr></thead><tbody>${events.slice(0,80).map(e => `<tr><td>${fmtDate(e.createdAt)}</td><td>${esc(e.userId)}</td><td>${esc(e.role)}</td><td>${esc(e.event)}</td><td>${esc(JSON.stringify(e.data))}</td></tr>`).join('')}</tbody></table></div>
    </section>`;
  }

  function exportAnalytics() {
    const rows = [['id','createdAt','userId','role','event','data']].concat(state.db.analytics.map(e => [e.id, e.createdAt, e.userId, e.role, e.event, JSON.stringify(e.data).replace(/"/g, '""')]));
    const csv = rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadText(csv, `kidora-analytics-${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
  }

  function renderParentDashboard() {
    const child = getParentChild();
    if (!child) return `<section class="panel"><div class="empty">No child is linked to this parent account yet. Admin can link a child ID in user settings.</div></section>`;
    const stats = childStats(child);
    return `<div class="grid">
      <section class="panel"><div class="section-title"><div><h3>Family Growth Window</h3><p>Simple, positive learning overview for ${esc(child.name)}.</p></div></div><div class="grid four"><div class="stat-card"><div class="label">Points</div><div class="value">${stats.points}</div></div><div class="stat-card"><div class="label">Quests</div><div class="value">${stats.quests}</div></div><div class="stat-card"><div class="label">Story Pages</div><div class="value">${stats.portfolio}</div></div><div class="stat-card"><div class="label">Badges</div><div class="value">${stats.badges}</div></div></div></section>
      <section class="panel"><h3>GrowthPath AI Summary</h3><div class="report-box">${esc(AI.report(child))}</div></section>
      <section class="panel"><h3>Skill Growth</h3>${skillBars(child.progress.skill)}</section>
    </div>`;
  }

  function getParentChild() {
    return state.db.users.find(u => u.role === 'child' && (u.parentId === state.user.id || u.id === state.user.childId)) || state.db.users.find(u => u.role === 'child');
  }

  function renderParentStorybook() {
    const child = getParentChild();
    if (!child) return `<section class="panel"><div class="empty">No linked child.</div></section>`;
    return renderPortfolio(child);
  }

  function renderParentPractice() {
    const child = getParentChild();
    if (!child) return `<section class="panel"><div class="empty">No linked child.</div></section>`;
    return `<section class="panel"><div class="section-title"><div><h3>Home Practice AI</h3><p>Five-minute family practice generated from current growth data.</p></div><button class="btn alt" onclick="Kidora.speak('${esc(AI.homePractice(child))}')">🔊 Read Practice Card</button></div><div class="report-box">${esc(AI.homePractice(child))}</div></section>`;
  }

  function renderAdminDashboard() {
    return `<div class="grid">
      <section class="panel"><div class="section-title"><div><h3>Admin Console</h3><p>Manage KIDORA Quest as a deployable classroom and research platform.</p></div></div><div class="grid four"><div class="stat-card"><div class="label">Users</div><div class="value">${state.db.users.length}</div></div><div class="stat-card"><div class="label">Pending Safety</div><div class="value">${state.db.safetyQueue.filter(x => x.status !== 'Approved').length}</div></div><div class="stat-card"><div class="label">Quests</div><div class="value">${state.db.quests.length}</div></div><div class="stat-card"><div class="label">Analytics</div><div class="value">${state.db.analytics.length}</div></div></div></section>
      <section class="panel"><h3>Platform Modules</h3><div class="grid three">${['Role-based access','Teacher-controlled AI','Quest library','Voice evidence','Writing canvas','Portfolio','Parent reports','Research export','PWA offline cache'].map(x => `<div class="card"><h3>✅ ${esc(x)}</h3><p>Integrated and available in the current static deployment.</p></div>`).join('')}</div></section>
    </div>`;
  }

  function renderAdminUsers() {
    return `<section class="panel"><div class="section-title"><div><h3>User Management</h3><p>Approve users and review access.</p></div></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>${state.db.users.map(u => `<tr><td>${u.avatar} ${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.role)}</td><td>${u.approved ? 'Approved' : 'Pending'}</td><td><button class="btn small ${u.approved ? 'ghost' : 'green'}" onclick="Kidora.toggleApproval('${u.id}')">${u.approved ? 'Set Pending' : 'Approve'}</button></td></tr>`).join('')}</tbody></table></div></section>`;
  }

  function toggleApproval(id) {
    const u = state.db.users.find(x => x.id === id);
    if (!u) return;
    u.approved = !u.approved;
    save();
    renderApp();
  }

  function renderAdminContent() {
    return `<div class="grid two">
      <section class="panel"><h3>Content Bank</h3><form class="form-grid" onsubmit="Kidora.addContent(event)"><div class="field"><label>Theme</label><input class="input" id="newTheme" placeholder="e.g., Transportation" /></div><div class="field"><label>Vocabulary Words</label><input class="input" id="newWords" placeholder="car, bus, train" /></div><div class="field"><label>Sentence Frame</label><input class="input" id="newFrame" placeholder="I can see a ___." /></div><button class="btn alt">Add to Content Bank</button></form></section>
      <section class="panel"><h3>Current Bank</h3><p><strong>Themes:</strong> ${state.db.contentBank.themes.map(esc).join(', ')}</p><p><strong>Sentence Frames:</strong></p><div class="badge-row">${state.db.contentBank.sentenceFrames.map(f => `<span class="badge">${esc(f)}</span>`).join('')}</div><p><strong>Vocabulary:</strong> ${state.db.contentBank.vocabulary.slice(0, 60).map(esc).join(', ')}${state.db.contentBank.vocabulary.length > 60 ? '...' : ''}</p></section>
      <section class="panel" style="grid-column:1/-1"><h3>Quest Library</h3><div class="table-wrap"><table><thead><tr><th>Quest</th><th>Theme</th><th>Status</th><th>Actions</th></tr></thead><tbody>${state.db.quests.map(q => `<tr><td>${q.mascot} ${esc(q.title)}</td><td>${esc(q.theme)}</td><td>${q.published ? 'Published' : 'Draft'}</td><td><button class="btn small ghost" onclick="Kidora.deleteQuest('${q.id}')">Delete</button> <button class="btn small" onclick="Kidora.publishQuest('${q.id}')">Publish</button></td></tr>`).join('')}</tbody></table></div></section>
    </div>`;
  }

  function addContent(event) {
    event.preventDefault();
    const theme = $('#newTheme').value.trim();
    const words = $('#newWords').value.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
    const frame = $('#newFrame').value.trim();
    if (theme && !state.db.contentBank.themes.includes(theme)) state.db.contentBank.themes.push(theme);
    words.forEach(w => { if (!state.db.contentBank.vocabulary.includes(w)) state.db.contentBank.vocabulary.push(w); });
    if (frame && !state.db.contentBank.sentenceFrames.includes(frame)) state.db.contentBank.sentenceFrames.push(frame);
    save();
    toast('Content bank updated.');
    renderApp();
  }

  function deleteQuest(id) {
    if (!confirm('Delete this quest from the local library?')) return;
    state.db.quests = state.db.quests.filter(q => q.id !== id);
    save();
    renderApp();
  }

  function renderSafety() {
    return `<section class="panel"><div class="section-title"><div><h3>AI Safety Review</h3><p>Teacher/admin approval before AI-generated content reaches children.</p></div></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Quest</th><th>Status</th><th>Action</th></tr></thead><tbody>${state.db.safetyQueue.map(item => { const q = state.db.quests.find(x => x.id === item.questId); return `<tr><td>${fmtDate(item.createdAt)}</td><td>${esc(item.type)}</td><td>${q ? esc(q.title) : 'Deleted quest'}</td><td>${esc(item.status)}</td><td>${q ? `<button class="btn green small" onclick="Kidora.publishQuest('${q.id}')">Approve</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="5">No safety review items.</td></tr>'}</tbody></table></div></section>`;
  }

  function renderSettings() {
    return `<div class="grid two"><section class="panel"><h3>Application Settings</h3><form class="form-grid" onsubmit="Kidora.saveSettings(event)"><div class="field"><label>Institution / Studio Name</label><input class="input" id="setSchool" value="${esc(state.db.settings.schoolName)}" /></div><div class="field"><label>Admin PIN</label><input class="input" id="setPin" value="${esc(state.db.settings.adminPin)}" /></div><div class="field"><label>Teacher Approval</label><select id="setApproval"><option value="true" ${state.db.settings.requireTeacherApproval ? 'selected' : ''}>Required</option><option value="false" ${!state.db.settings.requireTeacherApproval ? 'selected' : ''}>Not required</option></select></div><div class="field"><label>Voice Recording</label><select id="setVoice"><option value="true" ${state.db.settings.allowVoiceRecording ? 'selected' : ''}>Enabled</option><option value="false" ${!state.db.settings.allowVoiceRecording ? 'selected' : ''}>Disabled</option></select></div><button class="btn alt">Save Settings</button></form></section><section class="panel danger-zone"><h3>Demo Database</h3><p class="mini-note">This is a static GitHub Pages app using browser localStorage. Reset only clears this browser data.</p><button class="btn red" onclick="Kidora.resetData()">Reset Demo Data</button></section></div>`;
  }

  function saveSettings(event) {
    event.preventDefault();
    state.db.settings.schoolName = $('#setSchool').value.trim() || 'KIDORA Quest Learning Studio';
    state.db.settings.adminPin = $('#setPin').value.trim() || '2026';
    state.db.settings.requireTeacherApproval = $('#setApproval').value === 'true';
    state.db.settings.allowVoiceRecording = $('#setVoice').value === 'true';
    save();
    toast('Settings saved.');
    renderApp();
  }

  function resetData() {
    if (!confirm('Reset all local demo data in this browser?')) return;
    localStorage.removeItem(STORE);
    sessionStorage.removeItem('kidora.currentUser');
    state.user = null;
    state.db = defaultDb();
    save();
    renderAuth();
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return toast('Speech synthesis is not supported in this browser.');
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(String(text).replace(/&#39;/g, "'"));
    utter.rate = 0.82;
    utter.pitch = 1.08;
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  }

  async function startRecording() {
    if (!state.db.settings.allowVoiceRecording) return toast('Voice recording is disabled by admin settings.');
    if (!navigator.mediaDevices?.getUserMedia) return simulateRecording('Voice evidence saved using fallback mode.');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.audioChunks = [];
      state.mediaRecorder = new MediaRecorder(stream);
      state.mediaRecorder.ondataavailable = e => state.audioChunks.push(e.data);
      state.mediaRecorder.onstop = () => {
        const blob = new Blob(state.audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          state.audioData = reader.result;
          stream.getTracks().forEach(track => track.stop());
          award('speaking', 10);
          recordAnalytics('voice_recorded', { questId: state.activeQuest?.id || '' });
          renderApp();
          toast('Voice evidence saved.');
        };
        reader.readAsDataURL(blob);
      };
      state.mediaRecorder.start();
      const box = $('#recordingStatus');
      if (box) box.textContent = 'Recording now. Speak your target sentence, then press Stop.';
    } catch (e) {
      simulateRecording('Voice evidence saved using fallback mode.');
    }
  }

  function stopRecording() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
      const box = $('#recordingStatus');
      if (box) box.textContent = 'Processing voice evidence...';
    } else {
      toast('No active recording.');
    }
  }

  function simulateRecording(text = 'Demo voice evidence') {
    const payload = `KIDORA voice note: ${text}. Saved at ${new Date().toLocaleString()}.`;
    state.audioData = createToneWavDataUrl();
    award('speaking', 6);
    recordAnalytics('voice_fallback_saved', { text });
    toast('Demo voice evidence saved.');
    renderApp();
  }


  function createToneWavDataUrl() {
    const sampleRate = 8000;
    const duration = 0.65;
    const samples = Math.floor(sampleRate * duration);
    const headerSize = 44;
    const buffer = new ArrayBuffer(headerSize + samples * 2);
    const view = new DataView(buffer);
    function writeString(offset, str) { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); }
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const amp = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-3 * t);
      view.setInt16(headerSize + i * 2, amp * 22000, true);
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return 'data:audio/wav;base64,' + btoa(binary);
  }

  function initCanvas() {
    const canvas = $('#drawCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4930c7';
    ctx.fillStyle = '#ffffff';
    let drawing = false;
    const pos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches?.[0];
      return { x: ((touch?.clientX ?? e.clientX) - rect.left) * (canvas.width / rect.width), y: ((touch?.clientY ?? e.clientY) - rect.top) * (canvas.height / rect.height) };
    };
    const start = (e) => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
    const draw = (e) => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); };
    const end = () => { drawing = false; state.drawingData = canvas.toDataURL('image/png'); };
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', end);
    if (state.drawingData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = state.drawingData;
    } else {
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(34,26,66,.18)';
      ctx.font = 'bold 44px Arial';
      ctx.fillText('Draw your story here', 40, 80);
    }
  }

  function saveCanvas() {
    const canvas = $('#drawCanvas');
    if (!canvas) return;
    state.drawingData = canvas.toDataURL('image/png');
    award('writing', 8);
    recordAnalytics('drawing_saved', { questId: state.activeQuest?.id || '' });
    toast('Drawing evidence saved.');
  }

  function clearCanvas() {
    const canvas = $('#drawCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.drawingData = '';
  }

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - .5);
  }

  function downloadText(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return {
    init, setAuthMode, login, register, quickDemo, go, logout,
    startRecommendedQuest, startQuest, chooseHear, chooseRead, addSentenceWord, clearSentence,
    completeStep, previousStep, savePortfolioArtifact, generateCertificate,
    generateQuest, publishQuest, cloneQuest, addTeacherNote, generateReport, generateObservation, exportAnalytics,
    toggleApproval, addContent, deleteQuest, saveSettings, resetData,
    speak, startRecording, stopRecording, simulateRecording, saveCanvas, clearCanvas
  };
})();

document.addEventListener('DOMContentLoaded', Kidora.init);
