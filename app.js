// ============================================================
// app.js — StudySphere Main Application
// ============================================================

// ---- STATE ----
const App = {
  currentPage: 'feed',
  activeFilter: 'all',
  activeSubject: null,
  lbMode: 'xp',
  pomodoroInterval: null,
  pomodoroSeconds: 25 * 60,
  pomodoroRunning: false,
  pomodoroMode: 25,
  flashcardIndex: 0,
  quizIndex: 0,
  quizScore: 0,
  quizStarted: false,
  activeGroupId: null,
  modalMode: null,
};

// ---- LOCAL STORAGE ----
function ls(key, val) {
  if (val !== undefined) { try { localStorage.setItem('ss_' + key, JSON.stringify(val)); } catch(e){} return val; }
  try { return JSON.parse(localStorage.getItem('ss_' + key)); } catch(e) { return null; }
}

// ---- PROFILE ----
function getProfile() {
  return ls('profile') || { name: 'Guest Student', university: '', subject: '', country: '', xp: 0, level: 1, streak: 0, lastVisit: null, postsCount: 0, likesGiven: 0, answersCount: 0 };
}
function saveProfile(p) { ls('profile', p); }
function addXP(amount) {
  const p = getProfile();
  p.xp += amount;
  p.level = Math.floor(p.xp / 500) + 1;
  saveProfile(p);
  renderProfile(); updateSidebarUser();
  showToast(`+${amount} XP earned! 🎉`);
}

// ---- POSTS ----
function getPosts() { return ls('posts') || JSON.parse(JSON.stringify(SAMPLE_POSTS)); }
function savePosts(posts) { ls('posts', posts); }
function getLikes() { return ls('likes') || {}; }
function saveLikes(l) { ls('likes', l); }

// ---- TASKS ----
function getTasks() { return ls('tasks') || []; }
function saveTasks(t) { ls('tasks', t); }
function getGoals() { return ls('goals') || [{ text: 'Study for 2 hours', done: false }, { text: 'Review lecture notes', done: false }]; }
function saveGoals(g) { ls('goals', g); }
function getPlanner() { return ls('planner') || []; }
function savePlanner(p) { ls('planner', p); }

// ---- GROUPS ----
function getJoinedGroups() { return ls('joinedGroups') || []; }
function saveJoinedGroups(g) { ls('joinedGroups', g); }
function getChatMessages(groupId) { return ls('chat_' + groupId) || []; }
function saveChatMessages(groupId, msgs) { ls('chat_' + groupId, msgs); }

// ---- NOTES ----
function getNotes() { return ls('notes') || JSON.parse(JSON.stringify(SAMPLE_NOTES)); }
function saveNotes(n) { ls('notes', n); }

// ---- QA ----
function getQA() { return ls('qa') || JSON.parse(JSON.stringify(SAMPLE_QA)); }
function saveQA(q) { ls('qa', q); }

// ---- FLASHCARDS ----
function getFlashcards() { return ls('flashcards') || JSON.parse(JSON.stringify(SAMPLE_FLASHCARDS)); }
function saveFlashcards(f) { ls('flashcards', f); }

// ---- STREAK ----
function updateStreak() {
  const p = getProfile();
  const today = new Date().toDateString();
  if (p.lastVisit === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (p.lastVisit === yesterday) { p.streak = (p.streak || 0) + 1; }
  else if (p.lastVisit !== today) { p.streak = 1; }
  p.lastVisit = today;
  saveProfile(p);
  if (p.streak === 7) unlockBadge('streak_7');
  if (p.streak === 30) unlockBadge('streak_30');
}

// ---- BADGES ----
function getUnlockedBadges() { return ls('badges') || []; }
function unlockBadge(id) {
  const b = getUnlockedBadges();
  if (!b.includes(id)) { b.push(id); ls('badges', b); showToast('🏅 Badge unlocked: ' + (BADGES.find(x => x.id === id)?.name || id)); renderProfile(); }
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

function renderSidebar() {
  const tags = document.getElementById('subjectTags');
  if (!tags) return;
  tags.innerHTML = SUBJECTS.map(s =>
    `<span class="subject-tag${App.activeSubject === s.id ? ' active' : ''}" data-subject="${s.id}">${s.emoji} ${s.name}</span>`
  ).join('');
  tags.querySelectorAll('.subject-tag').forEach(t => t.addEventListener('click', () => {
    App.activeSubject = App.activeSubject === t.dataset.subject ? null : t.dataset.subject;
    renderSidebar(); renderFeed(); renderNotes();
  }));
}

function updateSidebarUser() {
  const p = getProfile();
  setEl('sidebarName', p.name);
  setEl('sidebarLevel', p.level);
  setEl('sidebarXP', p.xp);
  setEl('streakCount', p.streak || 0);
  const initials = (p.name || 'G').charAt(0).toUpperCase();
  ['sidebarAvatar', 'topAvatar', 'profileAvatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = initials;
  });
}

function renderFeed() {
  const list = document.getElementById('postList');
  if (!list) return;
  let posts = getPosts();
  if (App.activeFilter !== 'all') posts = posts.filter(p => p.type === App.activeFilter);
  if (App.activeSubject) posts = posts.filter(p => p.subject === SUBJECTS.find(s => s.id === App.activeSubject)?.name);
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  if (search) posts = posts.filter(p => (p.title + p.body + p.author).toLowerCase().includes(search));
  if (!posts.length) { list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">No posts found. Be the first to share! 🎉</div>'; return; }
  const likes = getLikes();
  list.innerHTML = posts.slice().reverse().map(p => renderPostHTML(p, likes)).join('');
  bindPostEvents(list);
}

function renderPostHTML(p, likes) {
  const liked = likes[p.id];
  const comments = (p.comments || []).map(c =>
    `<div class="comment"><div class="avatar sm">${c.author.charAt(0)}</div><div class="comment-content"><div class="comment-author">${esc(c.author)}</div><div class="comment-text">${esc(c.text)}</div></div></div>`
  ).join('');
  return `
    <div class="post-card" data-id="${p.id}">
      <div class="post-header">
        <div class="avatar">${esc(p.avatar || p.author.charAt(0))}</div>
        <div class="post-meta">
          <div class="post-author">${esc(p.author)} ${p.country || ''}</div>
          <div class="post-date">${esc(p.date)}</div>
        </div>
        <span class="post-type ${p.type}">${p.type}</span>
      </div>
      <div class="post-subject">${esc(p.subject)}</div>
      <div class="post-title">${esc(p.title)}</div>
      <div class="post-body">${esc(p.body)}</div>
      <div class="post-actions">
        <button class="post-action like-btn${liked ? ' liked' : ''}" data-id="${p.id}">
          <i class="fa${liked ? 's' : 'r'} fa-heart"></i> ${p.likes + (liked ? 1 : 0)}
        </button>
        <button class="post-action toggle-comments" data-id="${p.id}">
          <i class="far fa-comment"></i> ${(p.comments || []).length}
        </button>
        <button class="post-action share-btn" data-title="${esc(p.title)}">
          <i class="far fa-share-square"></i> Share
        </button>
      </div>
      <div class="post-comments" id="comments-${p.id}" style="display:none">
        <div class="comment-list">${comments}</div>
        <div class="comment-input-row">
          <input type="text" placeholder="Add a comment..." id="cInput-${p.id}" />
          <button class="btn btn-primary submit-comment" data-id="${p.id}">Reply</button>
        </div>
      </div>
    </div>`;
}

function bindPostEvents(list) {
  list.querySelectorAll('.like-btn').forEach(btn => btn.addEventListener('click', () => {
    const id = parseInt(btn.dataset.id);
    const likes = getLikes();
    if (likes[id]) return;
    likes[id] = true; saveLikes(likes);
    const posts = getPosts(); const post = posts.find(p => p.id === id);
    if (post) { post.likes++; savePosts(posts); }
    const p = getProfile(); p.likesGiven = (p.likesGiven || 0) + 1; saveProfile(p);
    if (p.likesGiven >= 50) unlockBadge('popular');
    addXP(2); renderFeed();
  }));
  list.querySelectorAll('.toggle-comments').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const el = document.getElementById('comments-' + id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }));
  list.querySelectorAll('.submit-comment').forEach(btn => btn.addEventListener('click', () => {
    const id = parseInt(btn.dataset.id);
    const input = document.getElementById('cInput-' + id);
    if (!input?.value.trim()) return;
    const posts = getPosts(); const post = posts.find(p => p.id === id);
    if (post) {
      post.comments = post.comments || [];
      const prf = getProfile();
      post.comments.push({ author: prf.name, text: input.value.trim() });
      savePosts(posts);
    }
    addXP(5); renderFeed();
  }));
  list.querySelectorAll('.share-btn').forEach(btn => btn.addEventListener('click', () => {
    if (navigator.share) { navigator.share({ title: btn.dataset.title, url: location.href }); }
    else { navigator.clipboard?.writeText(location.href); showToast('Link copied! 🔗'); }
  }));
}

function renderNotes() {
  const grid = document.getElementById('notesGrid');
  if (!grid) return;
  let notes = getNotes();
  if (App.activeSubject) notes = notes.filter(n => n.subject === SUBJECTS.find(s => s.id === App.activeSubject)?.name);
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  if (search) notes = notes.filter(n => (n.title + n.preview + n.author + n.subject).toLowerCase().includes(search));
  if (!notes.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3)">No notes found. Upload the first one!</div>'; return; }
  grid.innerHTML = notes.map(n => `
    <div class="note-card">
      ${n.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
      <div class="note-subject">${esc(n.subject)}</div>
      <div class="note-title">${esc(n.title)}</div>
      <div class="note-preview">${esc(n.preview)}</div>
      <div class="note-footer">
        <span>${esc(n.author)}</span>
        <span><i class="far fa-heart"></i> ${n.likes}</span>
      </div>
    </div>`).join('');
}

function renderGroups() {
  const grid = document.getElementById('groupsGrid');
  if (!grid) return;
  const joined = getJoinedGroups();
  grid.innerHTML = SAMPLE_GROUPS.map(g => `
    <div class="group-card" data-id="${g.id}">
      <div class="group-icon">${g.emoji}</div>
      <div class="group-name">${esc(g.name)}</div>
      <div class="group-subject">${esc(g.subject)}</div>
      <div class="group-members"><i class="fa fa-users"></i> ${g.members + (joined.includes(g.id) ? 1 : 0)} members</div>
      <p style="font-size:12px;color:var(--text2);margin-top:6px">${esc(g.desc)}</p>
      <button class="group-join${joined.includes(g.id) ? ' joined' : ''}" data-id="${g.id}">
        ${joined.includes(g.id) ? '✅ Joined · Open Chat' : 'Join Group'}
      </button>
    </div>`).join('');
  grid.querySelectorAll('.group-join').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.dataset.id);
    const joined = getJoinedGroups();
    if (!joined.includes(id)) { joined.push(id); saveJoinedGroups(joined); addXP(10); }
    openGroupChat(id);
  }));
}

function openGroupChat(groupId) {
  App.activeGroupId = groupId;
  const group = SAMPLE_GROUPS.find(g => g.id === groupId);
  const grid = document.getElementById('groupsGrid');
  const chat = document.getElementById('chatPanel');
  if (grid) grid.style.display = 'none';
  if (chat) chat.style.display = 'block';
  setEl('chatGroupName', group?.name || 'Group Chat');
  renderChatMessages(groupId);
}

function renderChatMessages(groupId) {
  const msgs = getChatMessages(groupId);
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const prf = getProfile();
  if (!msgs.length) {
    container.innerHTML = `<div style="text-align:center;color:var(--text3);padding:20px">Be the first to say hello! 👋</div>`;
    return;
  }
  container.innerHTML = msgs.map(m => `
    <div class="chat-msg${m.author === prf.name ? ' own' : ''}">
      ${m.author !== prf.name ? `<div class="avatar sm">${m.author.charAt(0)}</div>` : ''}
      <div>
        ${m.author !== prf.name ? `<div style="font-size:11px;color:var(--text3);margin-bottom:3px">${esc(m.author)}</div>` : ''}
        <div class="chat-bubble">${esc(m.text)}</div>
      </div>
    </div>`).join('');
  container.scrollTop = container.scrollHeight;
}

function renderQA() {
  const list = document.getElementById('qaList');
  if (!list) return;
  const qas = getQA();
  if (!qas.length) { list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">No questions yet. Ask the first one!</div>'; return; }
  list.innerHTML = qas.slice().reverse().map(q => `
    <div class="qa-card">
      <span class="qa-status ${q.status}">${q.status === 'answered' ? '✅ Answered' : '⏳ Open'}</span>
      <div class="post-header" style="margin-bottom:8px">
        <div class="avatar sm">${esc(q.avatar || 'S')}</div>
        <div class="post-meta">
          <div class="post-author">${esc(q.author)}</div>
          <div class="post-date">${esc(q.date)} · ${esc(q.subject)}</div>
        </div>
      </div>
      <div class="qa-title">${esc(q.title)}</div>
      <div class="qa-body">${esc(q.body)}</div>
      ${(q.answers || []).length ? `
        <div class="qa-answers">
          <div style="font-size:12px;font-weight:700;color:var(--text3);margin-bottom:8px">ANSWERS</div>
          ${q.answers.map(a => `<div class="answer-item"><div class="answer-author">${esc(a.author)}</div>${esc(a.text)}</div>`).join('')}
        </div>` : ''}
      <div class="comment-input-row" style="margin-top:12px">
        <input type="text" placeholder="Write an answer..." id="aInput-${q.id}" />
        <button class="btn btn-primary submit-answer" data-id="${q.id}">Answer</button>
      </div>
    </div>`).join('');
  list.querySelectorAll('.submit-answer').forEach(btn => btn.addEventListener('click', () => {
    const id = parseInt(btn.dataset.id);
    const input = document.getElementById('aInput-' + id);
    if (!input?.value.trim()) return;
    const qas = getQA(); const q = qas.find(x => x.id === id);
    if (q) {
      q.answers = q.answers || [];
      q.answers.push({ author: getProfile().name, text: input.value.trim() });
      q.status = 'answered';
      saveQA(qas);
      const p = getProfile(); p.answersCount = (p.answersCount || 0) + 1; saveProfile(p);
      if (p.answersCount >= 5) unlockBadge('helper');
    }
    addXP(15); renderQA();
  }));
}

function renderLeaderboard(mode) {
  const list = document.getElementById('leaderboardList');
  if (!list) return;
  const data = [...SAMPLE_LEADERBOARD];
  const prf = getProfile();
  if (prf.name !== 'Guest Student') {
    const exists = data.find(d => d.name === prf.name);
    if (!exists) data.push({ name: prf.name, country: '', xp: prf.xp, streak: prf.streak || 0, posts: prf.postsCount || 0, badge: '🆕', subject: prf.subject || 'All' });
  }
  const sorted = data.sort((a, b) => {
    if (mode === 'xp') return b.xp - a.xp;
    if (mode === 'streak') return b.streak - a.streak;
    return b.posts - a.posts;
  });
  const rankClass = ['gold', 'silver', 'bronze'];
  list.innerHTML = sorted.map((s, i) => `
    <div class="lb-item">
      <div class="lb-rank ${rankClass[i] || ''}">${i + 1}</div>
      <div class="avatar sm">${s.name.charAt(0)}</div>
      <div class="lb-info">
        <div class="lb-name">${esc(s.name)} ${s.country}</div>
        <div class="lb-meta">${esc(s.subject)} · ${mode === 'xp' ? s.xp + ' XP' : mode === 'streak' ? s.streak + ' days' : s.posts + ' posts'}</div>
      </div>
      <div class="lb-badge">${s.badge}</div>
    </div>`).join('');
}

function renderProfile() {
  const p = getProfile();
  setEl('profileName', p.name);
  setEl('profileMeta', [p.university, p.subject, p.country].filter(Boolean).join(' · ') || 'Set up your profile');
  const xpInLevel = p.xp % 500;
  const pct = (xpInLevel / 500) * 100;
  const xpBar = document.getElementById('xpBar');
  if (xpBar) xpBar.style.width = pct + '%';
  setEl('xpLabel', `${p.xp} XP · Level ${p.level}`);
  const badges = getUnlockedBadges();
  const badgesRow = document.getElementById('badgesRow');
  if (badgesRow) {
    badgesRow.innerHTML = badges.length ? badges.map(id => {
      const b = BADGES.find(x => x.id === id);
      return b ? `<div class="badge-chip" title="${esc(b.desc)}">${b.icon} ${esc(b.name)}</div>` : '';
    }).join('') : '<div style="color:var(--text3);font-size:13px">No badges yet. Start learning to earn them!</div>';
  }
  const statsEl = document.getElementById('profileStats');
  if (statsEl) {
    statsEl.innerHTML = [
      { v: p.xp, l: 'Total XP' },
      { v: p.level, l: 'Level' },
      { v: p.streak || 0, l: 'Day Streak 🔥' },
      { v: p.postsCount || 0, l: 'Posts' },
      { v: p.answersCount || 0, l: 'Answers' },
      { v: badges.length, l: 'Badges' }
    ].map(s => `<div class="stat-card"><div class="stat-value">${s.v}</div><div class="stat-label">${s.l}</div></div>`).join('');
  }
  // fill form
  const editName = document.getElementById('editName');
  const editUni = document.getElementById('editUniversity');
  const editCountry = document.getElementById('editCountry');
  if (editName) editName.value = p.name !== 'Guest Student' ? p.name : '';
  if (editUni) editUni.value = p.university || '';
  if (editCountry) editCountry.value = p.country || '';
  const editSubject = document.getElementById('editSubject');
  if (editSubject) {
    editSubject.innerHTML = '<option value="">Favourite Subject</option>' + SUBJECTS.map(s => `<option value="${s.name}"${p.subject === s.name ? ' selected' : ''}>${s.name}</option>`).join('');
  }
}

// ============================================================
// TOOLS
// ============================================================

// POMODORO
function initPomodoro() {
  const display = document.getElementById('pomodoroDisplay');
  const startBtn = document.getElementById('pomodoroStart');
  const resetBtn = document.getElementById('pomodoroReset');
  if (!startBtn) return;
  startBtn.addEventListener('click', () => {
    if (App.pomodoroRunning) {
      clearInterval(App.pomodoroInterval);
      App.pomodoroRunning = false;
      startBtn.textContent = 'Start';
    } else {
      App.pomodoroRunning = true;
      startBtn.textContent = 'Pause';
      App.pomodoroInterval = setInterval(() => {
        App.pomodoroSeconds--;
        updatePomodoroDisplay();
        if (App.pomodoroSeconds <= 0) {
          clearInterval(App.pomodoroInterval);
          App.pomodoroRunning = false;
          startBtn.textContent = 'Start';
          showToast('⏰ Session complete! Take a break.');
          addXP(20);
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('StudySphere ⏰', { body: 'Pomodoro session complete!' });
          }
        }
      }, 1000);
    }
  });
  resetBtn.addEventListener('click', () => {
    clearInterval(App.pomodoroInterval);
    App.pomodoroRunning = false;
    App.pomodoroSeconds = App.pomodoroMode * 60;
    if (startBtn) startBtn.textContent = 'Start';
    updatePomodoroDisplay();
  });
  document.querySelectorAll('.mode-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    App.pomodoroMode = parseInt(btn.dataset.mins);
    App.pomodoroSeconds = App.pomodoroMode * 60;
    clearInterval(App.pomodoroInterval);
    App.pomodoroRunning = false;
    if (startBtn) startBtn.textContent = 'Start';
    updatePomodoroDisplay();
  }));
  updatePomodoroDisplay();
}
function updatePomodoroDisplay() {
  const m = Math.floor(App.pomodoroSeconds / 60).toString().padStart(2, '0');
  const s = (App.pomodoroSeconds % 60).toString().padStart(2, '0');
  setEl('pomodoroDisplay', `${m}:${s}`);
}

// FLASHCARDS
function renderFlashcard() {
  const cards = getFlashcards();
  const idx = App.flashcardIndex;
  const fc = cards[idx];
  setEl('flashcardFront', fc?.front || 'No cards');
  setEl('flashcardBack', fc?.back || '');
  setEl('fcCounter', `${idx + 1} / ${cards.length}`);
  const el = document.getElementById('flashcard');
  if (el) el.classList.remove('flipped');
}
function initFlashcards() {
  const fc = document.getElementById('flashcard');
  if (fc) fc.addEventListener('click', () => fc.classList.toggle('flipped'));
  const prev = document.getElementById('fcPrev');
  const next = document.getElementById('fcNext');
  if (prev) prev.addEventListener('click', () => { App.flashcardIndex = Math.max(0, App.flashcardIndex - 1); renderFlashcard(); });
  if (next) next.addEventListener('click', () => { const c = getFlashcards(); App.flashcardIndex = Math.min(c.length - 1, App.flashcardIndex + 1); renderFlashcard(); });
  const addBtn = document.getElementById('addFlashcardBtn');
  if (addBtn) addBtn.addEventListener('click', () => openModal('flashcard'));
  renderFlashcard();
}

// TASKS
function renderTasks() {
  const tasks = getTasks();
  const list = document.getElementById('taskList');
  if (!list) return;
  list.innerHTML = tasks.map((t, i) => `
    <li class="task-item${t.done ? ' done' : ''}">
      <input type="checkbox" id="tc${i}" ${t.done ? 'checked' : ''} onchange="toggleTask(${i})" />
      <label for="tc${i}">${esc(t.text)}</label>
      <button class="task-del" onclick="deleteTask(${i})"><i class="fa fa-trash"></i></button>
    </li>`).join('');
  const done = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const pb = document.getElementById('taskProgress');
  if (pb) pb.style.width = pct + '%';
  setEl('taskProgressLabel', `${pct}% complete (${done}/${tasks.length})`);
}
window.toggleTask = function(i) {
  const tasks = getTasks(); tasks[i].done = !tasks[i].done; saveTasks(tasks);
  if (tasks[i].done) addXP(5); renderTasks();
};
window.deleteTask = function(i) {
  const tasks = getTasks(); tasks.splice(i, 1); saveTasks(tasks); renderTasks();
};

// GOALS
function renderGoals() {
  const goals = getGoals();
  const list = document.getElementById('goalsList');
  if (!list) return;
  list.innerHTML = goals.map((g, i) => `
    <div class="goal-item">
      <span class="goal-done" onclick="toggleGoal(${i})">${g.done ? '✅' : '⭕'}</span>
      <span style="${g.done ? 'text-decoration:line-through;color:var(--text3)' : ''}">${esc(g.text)}</span>
    </div>`).join('') || '<div style="color:var(--text3);font-size:13px">No goals yet. Add one!</div>';
}
window.toggleGoal = function(i) {
  const goals = getGoals(); goals[i].done = !goals[i].done; saveGoals(goals);
  if (goals[i].done) addXP(10); renderGoals();
};

// PLANNER
function renderPlanner() {
  const items = getPlanner();
  const list = document.getElementById('plannerList');
  if (!list) return;
  list.innerHTML = items.sort((a, b) => a.time.localeCompare(b.time)).map((item, i) => `
    <div class="planner-item">
      <span class="planner-time">${esc(item.time)}</span>
      <span style="flex:1">${esc(item.subject)}</span>
      <button onclick="deletePlannerItem(${i})" style="background:none;border:none;color:var(--text3);cursor:pointer"><i class="fa fa-times"></i></button>
    </div>`).join('') || '<div style="color:var(--text3);font-size:13px">No schedule yet.</div>';
}
window.deletePlannerItem = function(i) { const p = getPlanner(); p.splice(i, 1); savePlanner(p); renderPlanner(); };

// QUIZ
function renderQuiz() {
  const area = document.getElementById('quizArea');
  const startBtn = document.getElementById('startQuizBtn');
  if (!area) return;
  if (!App.quizStarted) { area.innerHTML = '<div style="color:var(--text3);font-size:13px;text-align:center;padding:12px">Press Start Quiz to test yourself!</div>'; return; }
  if (App.quizIndex >= SAMPLE_QUIZ.length) {
    area.innerHTML = `<div class="quiz-score">🎉 ${App.quizScore} / ${SAMPLE_QUIZ.length} correct!</div><div style="text-align:center;font-size:13px;color:var(--text2)">Great job studying!</div>`;
    addXP(App.quizScore * 10);
    if (startBtn) startBtn.textContent = 'Restart';
    App.quizStarted = false;
    return;
  }
  const q = SAMPLE_QUIZ[App.quizIndex];
  area.innerHTML = `
    <div class="quiz-question">Q${App.quizIndex + 1}. ${esc(q.q)}</div>
    <div class="quiz-options">
      ${q.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${esc(o)}</button>`).join('')}
    </div>`;
  area.querySelectorAll('.quiz-opt').forEach(btn => btn.addEventListener('click', () => {
    const ans = parseInt(btn.dataset.i);
    area.querySelectorAll('.quiz-opt').forEach((b, j) => {
      b.disabled = true;
      if (j === q.answer) b.classList.add('correct');
      else if (j === ans) b.classList.add('wrong');
    });
    if (ans === q.answer) App.quizScore++;
    setTimeout(() => { App.quizIndex++; renderQuiz(); }, 900);
  }));
}

// ============================================================
// MODAL
// ============================================================
function openModal(mode, data) {
  App.modalMode = mode;
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  const title = document.getElementById('modalTitle');
  if (!overlay || !body) return;
  const subjectOptions = SUBJECTS.map(s => `<option value="${s.name}">${s.emoji} ${s.name}</option>`).join('');
  if (mode === 'post') {
    title.textContent = 'Share a Post';
    body.innerHTML = `
      <label>Title</label><input type="text" id="mTitle" placeholder="What's your topic?" />
      <label>Content</label><textarea id="mBody" placeholder="Share your knowledge..."></textarea>
      <label>Type</label>
      <select id="mType"><option value="note">📝 Note</option><option value="question">❓ Question</option><option value="tip">💡 Exam Tip</option><option value="advice">🎓 Advice</option></select>
      <label>Subject</label><select id="mSubject">${subjectOptions}</select>`;
  } else if (mode === 'question') {
    title.textContent = 'Ask a Question';
    body.innerHTML = `
      <label>Your Question</label><input type="text" id="mTitle" placeholder="What do you want to know?" />
      <label>Details</label><textarea id="mBody" placeholder="Describe your question..."></textarea>
      <label>Subject</label><select id="mSubject">${subjectOptions}</select>`;
  } else if (mode === 'note') {
    title.textContent = 'Upload Study Note';
    body.innerHTML = `
      <label>Note Title</label><input type="text" id="mTitle" placeholder="e.g. Calculus Summary" />
      <label>Preview / Description</label><textarea id="mBody" placeholder="Brief description of the note..."></textarea>
      <label>Subject</label><select id="mSubject">${subjectOptions}</select>`;
  } else if (mode === 'group') {
    title.textContent = 'Create Study Group';
    body.innerHTML = `
      <label>Group Name</label><input type="text" id="mTitle" placeholder="e.g. Physics Warriors" />
      <label>Description</label><textarea id="mBody" placeholder="What will you study together?"></textarea>
      <label>Subject</label><select id="mSubject">${subjectOptions}</select>`;
  } else if (mode === 'flashcard') {
    title.textContent = 'Add Flashcard';
    body.innerHTML = `
      <label>Front (Question)</label><input type="text" id="mFront" placeholder="Enter question or concept..." />
      <label>Back (Answer)</label><textarea id="mBack" placeholder="Enter the answer..."></textarea>`;
  }
  overlay.classList.add('visible');
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('visible');
  App.modalMode = null;
}

function submitModal() {
  const mode = App.modalMode;
  const prf = getProfile();
  if (mode === 'post') {
    const title = document.getElementById('mTitle')?.value.trim();
    const body = document.getElementById('mBody')?.value.trim();
    const type = document.getElementById('mType')?.value;
    const subject = document.getElementById('mSubject')?.value;
    if (!title || !body) { showToast('Please fill in all fields.'); return; }
    const posts = getPosts();
    posts.push({ id: Date.now(), type, subject, author: prf.name, avatar: prf.name.charAt(0), country: '', title, body, likes: 0, comments: [], date: 'just now' });
    savePosts(posts);
    const p = getProfile(); p.postsCount = (p.postsCount || 0) + 1; saveProfile(p);
    if (p.postsCount === 1) unlockBadge('first_post');
    if (prf.name === 'Guest Student') showToast('Set up your profile to show your name!');
    addXP(20); closeModal(); renderFeed();
  } else if (mode === 'question') {
    const title = document.getElementById('mTitle')?.value.trim();
    const body = document.getElementById('mBody')?.value.trim();
    const subject = document.getElementById('mSubject')?.value;
    if (!title || !body) { showToast('Please fill in all fields.'); return; }
    const qas = getQA();
    qas.push({ id: Date.now(), status: 'open', subject, author: prf.name, avatar: prf.name.charAt(0), title, body, date: 'just now', answers: [] });
    saveQA(qas); addXP(15); closeModal(); renderQA();
  } else if (mode === 'note') {
    const title = document.getElementById('mTitle')?.value.trim();
    const preview = document.getElementById('mBody')?.value.trim();
    const subject = document.getElementById('mSubject')?.value;
    if (!title || !preview) { showToast('Please fill in all fields.'); return; }
    const notes = getNotes();
    notes.push({ id: Date.now(), subject, title, preview, author: prf.name, likes: 0, featured: false, date: 'just now' });
    saveNotes(notes); addXP(25); closeModal(); renderNotes();
  } else if (mode === 'group') {
    showToast('Group created! (Demo mode — using sample groups)'); closeModal();
  } else if (mode === 'flashcard') {
    const front = document.getElementById('mFront')?.value.trim();
    const back = document.getElementById('mBack')?.value.trim();
    if (!front || !back) { showToast('Please fill both sides.'); return; }
    const cards = getFlashcards(); cards.push({ front, back }); saveFlashcards(cards);
    App.flashcardIndex = cards.length - 1; renderFlashcard(); closeModal();
    showToast('Flashcard added! 🃏');
  }
}

// ============================================================
// NAVIGATION
// ============================================================
function navigate(page) {
  App.currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');
  // Render on navigate
  if (page === 'feed') renderFeed();
  if (page === 'qa') renderQA();
  if (page === 'notes') renderNotes();
  if (page === 'groups') { renderGroups(); const chat = document.getElementById('chatPanel'); const grid = document.getElementById('groupsGrid'); if (chat) chat.style.display = 'none'; if (grid) grid.style.display = 'grid'; }
  if (page === 'leaderboard') renderLeaderboard(App.lbMode);
  if (page === 'profile') renderProfile();
  // close sidebar on mobile
  if (window.innerWidth <= 768) { document.getElementById('sidebar')?.classList.remove('open'); document.getElementById('overlay')?.classList.remove('visible'); }
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2500);
}

// ============================================================
// UTILITIES
// ============================================================
function setEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function esc(str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateStreak();
  renderSidebar();
  updateSidebarUser();
  renderFeed();
  initPomodoro();
  initFlashcards();
  renderTasks();
  renderGoals();
  renderPlanner();
  renderQuiz();

  // Quote
  const q = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  const banner = document.getElementById('quoteBanner');
  if (banner) banner.innerHTML = `"${q.text}" <strong>— ${q.author}</strong>`;

  // NAV
  document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(item.dataset.page);
  }));

  // TOP AVATAR → profile
  document.getElementById('topAvatar')?.addEventListener('click', () => navigate('profile'));
  document.getElementById('userCard')?.addEventListener('click', () => navigate('profile'));

  // MENU
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  menuBtn?.addEventListener('click', () => { sidebar?.classList.add('open'); overlay?.classList.add('visible'); });
  overlay?.addEventListener('click', () => { sidebar?.classList.remove('open'); overlay?.classList.remove('visible'); });
  document.getElementById('sidebarClose')?.addEventListener('click', () => { sidebar?.classList.remove('open'); overlay?.classList.remove('visible'); });

  // THEME
  const savedTheme = ls('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeBtn();
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    ls('theme', next);
    updateThemeBtn();
  });

  // FOCUS MODE
  document.getElementById('focusBtn')?.addEventListener('click', () => {
    document.body.classList.toggle('focus-mode');
    showToast(document.body.classList.contains('focus-mode') ? '🎯 Focus mode ON' : '👋 Focus mode OFF');
  });

  // SEARCH
  document.getElementById('searchInput')?.addEventListener('input', () => {
    if (App.currentPage === 'feed') renderFeed();
    if (App.currentPage === 'notes') renderNotes();
  });

  // FILTER BUTTONS (feed)
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    App.activeFilter = btn.dataset.filter;
    renderFeed();
  }));

  // LEADERBOARD TABS
  document.querySelectorAll('.filter-btn[data-lb]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-lb]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    App.lbMode = btn.dataset.lb;
    renderLeaderboard(App.lbMode);
  }));

  // NEW POST
  document.getElementById('newPostBtn')?.addEventListener('click', () => openModal('post'));
  document.getElementById('newQuestionBtn')?.addEventListener('click', () => openModal('question'));
  document.getElementById('uploadNoteBtn')?.addEventListener('click', () => openModal('note'));
  document.getElementById('createGroupBtn')?.addEventListener('click', () => openModal('group'));

  // MODAL CLOSE
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalCancel')?.addEventListener('click', closeModal);
  document.getElementById('modalSubmit')?.addEventListener('click', submitModal);
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => { if (e.target === document.getElementById('modalOverlay')) closeModal(); });

  // TASKS
  document.getElementById('addTaskBtn')?.addEventListener('click', () => {
    const input = document.getElementById('taskInput');
    if (!input?.value.trim()) return;
    const tasks = getTasks(); tasks.push({ text: input.value.trim(), done: false }); saveTasks(tasks);
    input.value = ''; renderTasks();
  });
  document.getElementById('taskInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') document.getElementById('addTaskBtn')?.click(); });

  // GOALS
  document.getElementById('addGoalBtn')?.addEventListener('click', () => {
    const input = document.getElementById('goalInput');
    if (!input?.value.trim()) return;
    const goals = getGoals(); goals.push({ text: input.value.trim(), done: false }); saveGoals(goals);
    input.value = ''; renderGoals();
  });
  document.getElementById('goalInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') document.getElementById('addGoalBtn')?.click(); });

  // PLANNER
  document.getElementById('addPlannerBtn')?.addEventListener('click', () => {
    const sub = document.getElementById('plannerSubject')?.value.trim();
    const time = document.getElementById('plannerTime')?.value;
    if (!sub || !time) { showToast('Enter subject and time.'); return; }
    const planner = getPlanner(); planner.push({ subject: sub, time }); savePlanner(planner);
    document.getElementById('plannerSubject').value = ''; renderPlanner();
  });

  // QUIZ
  document.getElementById('startQuizBtn')?.addEventListener('click', () => {
    App.quizStarted = true; App.quizIndex = 0; App.quizScore = 0;
    document.getElementById('startQuizBtn').textContent = 'In progress...';
    renderQuiz();
  });

  // CHAT
  document.getElementById('chatBack')?.addEventListener('click', () => {
    document.getElementById('chatPanel').style.display = 'none';
    document.getElementById('groupsGrid').style.display = 'grid';
  });
  document.getElementById('chatSend')?.addEventListener('click', sendChatMessage);
  document.getElementById('chatInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

  // PROFILE SAVE
  document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
    const p = getProfile();
    p.name = document.getElementById('editName')?.value.trim() || p.name;
    p.university = document.getElementById('editUniversity')?.value.trim() || '';
    p.subject = document.getElementById('editSubject')?.value || '';
    p.country = document.getElementById('editCountry')?.value.trim() || '';
    saveProfile(p);
    renderProfile(); updateSidebarUser();
    showToast('Profile saved! ✅');
  });

  // Notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  if (!input?.value.trim()) return;
  const msgs = getChatMessages(App.activeGroupId);
  msgs.push({ author: getProfile().name, text: input.value.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  saveChatMessages(App.activeGroupId, msgs);
  input.value = '';
  renderChatMessages(App.activeGroupId);
}

function updateThemeBtn() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark ? '<i class="fa fa-sun"></i> Light Mode' : '<i class="fa fa-moon"></i> Dark Mode';
}
