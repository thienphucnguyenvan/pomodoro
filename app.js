/* ============================================================
   Pomodoro PWA — full featured focus timer
   ============================================================ */
(() => {
  'use strict';

  // ---------- Constants ----------
  const RING_CIRCUMFERENCE = 2 * Math.PI * 130; // r=130
  const DEFAULT_SETTINGS = {
    pomodoro: 25,
    short: 5,
    long: 15,
    longInterval: 4,
    autoBreaks: false,
    autoPomodoros: false,
    soundOn: true,
    volume: 70,
    notifyOn: false,
    darkMode: false,
  };
  const MODE_META = {
    pomodoro: { label: 'Giờ tập trung', tab: 'Pomodoro', body: 'mode-pomodoro' },
    short: { label: 'Nghỉ ngắn', tab: 'Nghỉ ngắn', body: 'mode-short' },
    long: { label: 'Nghỉ dài', tab: 'Nghỉ dài', body: 'mode-long' },
  };

  // ---------- Storage ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v == null ? fallback : JSON.parse(v);
      } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    },
  };

  // ---------- State ----------
  let settings = Object.assign({}, DEFAULT_SETTINGS, store.get('settings', {}));
  let tasks = store.get('tasks', []);
  let stats = store.get('stats', { history: {}, total: 0 }); // history: { 'YYYY-MM-DD': {count, minutes} }
  let activeTaskId = store.get('activeTaskId', null);

  let mode = 'pomodoro';
  let remaining = settings.pomodoro * 60; // seconds
  let totalSeconds = remaining;
  let running = false;
  let ticker = null;
  let endTimestamp = null; // absolute ms target — survives background throttling
  let completedPomodoros = 0; // since last long break
  let roundNumber = 1;
  let estNew = 1;

  // ---------- DOM ----------
  const $ = (sel) => document.querySelector(sel);
  const timeEl = $('#time');
  const modeLabelEl = $('#modeLabel');
  const startBtn = $('#startBtn');
  const skipBtn = $('#skipBtn');
  const ringProgress = $('.ring-progress');
  const modeTabs = document.querySelectorAll('.mode-tab');
  const roundCountEl = $('#roundCount');
  const roundHintEl = $('#roundHint');
  const taskListEl = $('#taskList');
  const taskForm = $('#taskForm');
  const taskInput = $('#taskInput');
  const estValEl = $('#estVal');
  const taskSummaryEl = $('#taskSummary');
  const toastEl = $('#toast');

  ringProgress.style.strokeDasharray = RING_CIRCUMFERENCE;

  // ---------- Audio (WebAudio beep, no asset needed) ----------
  let audioCtx = null;
  function playAlarm() {
    if (!settings.soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const vol = settings.volume / 100;
      const now = audioCtx.currentTime;
      // three rising beeps
      [0, 0.25, 0.5].forEach((offset, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 660 + i * 220;
        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(vol * 0.6, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.22);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.24);
      });
    } catch {}
  }
  function tickSound() {
    if (!settings.soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch {}
  }

  // ---------- Helpers ----------
  function todayKey(d = new Date()) {
    return d.toISOString().slice(0, 10);
  }
  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  function durationFor(m) {
    return settings[m] * 60;
  }
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => { toastEl.hidden = true; }, 300);
    }, 2200);
  }

  // ---------- Rendering ----------
  function renderTime() {
    timeEl.textContent = fmt(Math.max(0, Math.round(remaining)));
    const frac = totalSeconds > 0 ? Math.max(0, remaining) / totalSeconds : 0;
    ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - frac);
    const mm = fmt(Math.max(0, Math.round(remaining)));
    document.title = running ? `${mm} — ${MODE_META[mode].tab}` : 'Pomodoro — Focus Timer';
  }

  function renderMode() {
    document.body.classList.remove('mode-pomodoro', 'mode-short', 'mode-long');
    document.body.classList.add(MODE_META[mode].body);
    modeLabelEl.textContent = MODE_META[mode].label;
    modeTabs.forEach((t) => t.classList.toggle('active', t.dataset.mode === mode));
    const themeColors = { pomodoro: '#ba4949', short: '#38858a', long: '#397097' };
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = settings.darkMode ? '#1f1f25' : themeColors[mode];
    roundCountEl.textContent = `#${roundNumber}`;
    roundHintEl.textContent = mode === 'pomodoro' ? 'Đến lúc tập trung!' : 'Thư giãn một chút!';
  }

  function renderControls() {
    startBtn.textContent = running ? 'TẠM DỪNG' : 'BẮT ĐẦU';
    startBtn.classList.toggle('running', running);
  }

  // ---------- Timer engine (timestamp based) ----------
  function startTimer() {
    if (running) return;
    running = true;
    tickSound();
    endTimestamp = Date.now() + remaining * 1000;
    ticker = setInterval(onTick, 250);
    renderControls();
  }

  function pauseTimer() {
    if (!running) return;
    running = false;
    clearInterval(ticker);
    ticker = null;
    remaining = Math.max(0, (endTimestamp - Date.now()) / 1000);
    endTimestamp = null;
    renderControls();
    renderTime();
  }

  function toggleTimer() {
    running ? pauseTimer() : startTimer();
  }

  function onTick() {
    remaining = (endTimestamp - Date.now()) / 1000;
    if (remaining <= 0) {
      remaining = 0;
      renderTime();
      completeSession();
      return;
    }
    renderTime();
  }

  function setMode(newMode, { reset = true } = {}) {
    mode = newMode;
    if (reset) {
      remaining = durationFor(mode);
      totalSeconds = remaining;
    }
    renderMode();
    renderTime();
  }

  function stopAndReset(newMode) {
    running = false;
    clearInterval(ticker);
    ticker = null;
    endTimestamp = null;
    setMode(newMode, { reset: true });
    renderControls();
  }

  // ---------- Session completion ----------
  function completeSession() {
    clearInterval(ticker);
    ticker = null;
    running = false;
    endTimestamp = null;

    playAlarm();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    if (mode === 'pomodoro') {
      recordPomodoro();
      completedPomodoros += 1;
      incrementActiveTask();
      const goLong = completedPomodoros % settings.longInterval === 0;
      const next = goLong ? 'long' : 'short';
      notify('Hoàn thành Pomodoro! 🍅', goLong ? 'Đến giờ nghỉ dài.' : 'Đến giờ nghỉ ngắn.');
      toast(goLong ? 'Tuyệt vời! Nghỉ dài thôi 🎉' : 'Làm tốt lắm! Nghỉ ngắn 👏');
      stopAndReset(next);
      if (settings.autoBreaks) startTimer();
    } else {
      roundNumber += 1;
      notify('Hết giờ nghỉ ⏰', 'Quay lại tập trung nào!');
      toast('Hết giờ nghỉ — tập trung tiếp 💪');
      stopAndReset('pomodoro');
      if (settings.autoPomodoros) startTimer();
    }
    renderControls();
    persistRuntime();
  }

  function skipSession() {
    // Skipping never counts toward stats or task progress.
    if (mode === 'pomodoro') {
      stopAndReset('short');
    } else {
      roundNumber += 1;
      stopAndReset('pomodoro');
    }
    renderControls();
    persistRuntime();
  }

  // ---------- Notifications ----------
  function notify(title, body) {
    if (!settings.notifyOn) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', vibrate: [200, 100, 200] });
        }).catch(() => new Notification(title, { body }));
      } else {
        new Notification(title, { body });
      }
    } catch {}
  }

  async function requestNotifyPermission() {
    if (!('Notification' in window)) {
      toast('Trình duyệt không hỗ trợ thông báo');
      return false;
    }
    if (Notification.permission === 'granted') return true;
    const res = await Notification.requestPermission();
    return res === 'granted';
  }

  // ---------- Stats ----------
  function recordPomodoro() {
    const key = todayKey();
    if (!stats.history[key]) stats.history[key] = { count: 0, minutes: 0 };
    stats.history[key].count += 1;
    stats.history[key].minutes += settings.pomodoro;
    stats.total = (stats.total || 0) + 1;
    store.set('stats', stats);
  }

  function computeStreak() {
    let streak = 0;
    const d = new Date();
    // if today has none, start from yesterday so an in-progress day doesn't break it
    if (!stats.history[todayKey(d)]) d.setDate(d.getDate() - 1);
    while (true) {
      const k = todayKey(d);
      if (stats.history[k] && stats.history[k].count > 0) {
        streak += 1;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  }

  function renderStats() {
    const key = todayKey();
    const today = stats.history[key] || { count: 0, minutes: 0 };
    $('#statToday').textContent = today.count;
    $('#statFocus').textContent = formatMinutes(today.minutes);
    $('#statStreak').textContent = computeStreak();
    $('#statTotal').textContent = stats.total || 0;

    // 7-day chart
    const chart = $('#weekChart');
    chart.innerHTML = '';
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const counts = days.map((d) => (stats.history[todayKey(d)]?.count) || 0);
    const max = Math.max(1, ...counts);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    days.forEach((d, i) => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      const c = counts[i];
      const h = Math.round((c / max) * 100);
      col.innerHTML = `
        <span class="bar-val">${c || ''}</span>
        <div class="bar" style="height:${Math.max(c ? 6 : 2, h)}%"></div>
        <span class="bar-label">${dayNames[d.getDay()]}</span>`;
      chart.appendChild(col);
    });
  }

  function formatMinutes(min) {
    if (min < 60) return `${min}p`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h${m}` : `${h}h`;
  }

  // ---------- Tasks ----------
  function saveTasks() { store.set('tasks', tasks); }

  function renderTasks() {
    taskListEl.innerHTML = '';
    if (tasks.length === 0) {
      const li = document.createElement('li');
      li.className = 'task-empty';
      li.textContent = 'Chưa có công việc nào. Thêm việc để bắt đầu!';
      taskListEl.appendChild(li);
    }
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item';
      if (task.done) li.classList.add('done');
      if (task.id === activeTaskId && !task.done) li.classList.add('active');
      li.innerHTML = `
        <button class="task-check" aria-label="Hoàn thành">
          <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
        </button>
        <div class="task-body">
          <div class="task-name"></div>
          <div class="task-meta">${task.done ? '✓ Đã xong · ' : ''}${task.completed}/${task.est} 🍅</div>
        </div>
        <button class="task-del" aria-label="Xoá">
          <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
        </button>`;
      li.querySelector('.task-name').textContent = task.name;
      li.querySelector('.task-check').addEventListener('click', (e) => { e.stopPropagation(); toggleTaskDone(task.id); });
      li.querySelector('.task-del').addEventListener('click', (e) => { e.stopPropagation(); deleteTask(task.id); });
      li.querySelector('.task-body').addEventListener('click', () => setActiveTask(task.id));
      taskListEl.appendChild(li);
    });
    renderTaskSummary();
  }

  function renderTaskSummary() {
    const pending = tasks.filter((t) => !t.done);
    const estLeft = pending.reduce((sum, t) => sum + Math.max(0, t.est - t.completed), 0);
    if (tasks.length === 0) { taskSummaryEl.textContent = ''; return; }
    const mins = estLeft * settings.pomodoro;
    const finish = new Date(Date.now() + mins * 60000);
    const finishStr = finish.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    taskSummaryEl.textContent = estLeft > 0
      ? `Còn ${estLeft} pomodoro · ~${formatMinutes(mins)} · xong lúc ${finishStr}`
      : 'Tất cả công việc đã hoàn thành! 🎉';
  }

  function addTask(name, est) {
    tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, est, completed: 0, done: false });
    saveTasks();
    if (!activeTaskId) { const first = tasks.find((t) => !t.done); if (first) activeTaskId = first.id; }
    renderTasks();
  }

  function toggleTaskDone(id) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    t.done = !t.done;
    if (t.done && id === activeTaskId) {
      const next = tasks.find((x) => !x.done);
      activeTaskId = next ? next.id : null;
      store.set('activeTaskId', activeTaskId);
    }
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    if (id === activeTaskId) {
      const next = tasks.find((t) => !t.done);
      activeTaskId = next ? next.id : null;
      store.set('activeTaskId', activeTaskId);
    }
    saveTasks();
    renderTasks();
  }

  function setActiveTask(id) {
    const t = tasks.find((x) => x.id === id);
    if (!t || t.done) return;
    activeTaskId = id;
    store.set('activeTaskId', activeTaskId);
    renderTasks();
  }

  function incrementActiveTask() {
    if (!activeTaskId) return;
    const t = tasks.find((x) => x.id === activeTaskId);
    if (!t) return;
    t.completed += 1;
    if (t.completed >= t.est) {
      t.done = true;
      const next = tasks.find((x) => !x.done);
      activeTaskId = next ? next.id : null;
      store.set('activeTaskId', activeTaskId);
    }
    saveTasks();
    renderTasks();
  }

  function clearDoneTasks() {
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    renderTasks();
    toast('Đã xoá công việc hoàn thành');
  }

  // ---------- Settings UI ----------
  function applyTheme() {
    document.body.classList.toggle('dark', settings.darkMode);
    renderMode();
  }

  function loadSettingsIntoForm() {
    $('#durPomodoro').value = settings.pomodoro;
    $('#durShort').value = settings.short;
    $('#durLong').value = settings.long;
    $('#longInterval').value = settings.longInterval;
    $('#autoBreaks').checked = settings.autoBreaks;
    $('#autoPomodoros').checked = settings.autoPomodoros;
    $('#soundOn').checked = settings.soundOn;
    $('#volume').value = settings.volume;
    $('#notifyOn').checked = settings.notifyOn;
    $('#darkMode').checked = settings.darkMode;
  }

  function readSettingsFromForm() {
    const clampInt = (v, min, max, def) => {
      const n = parseInt(v, 10);
      if (isNaN(n)) return def;
      return Math.min(max, Math.max(min, n));
    };
    settings.pomodoro = clampInt($('#durPomodoro').value, 1, 180, 25);
    settings.short = clampInt($('#durShort').value, 1, 60, 5);
    settings.long = clampInt($('#durLong').value, 1, 60, 15);
    settings.longInterval = clampInt($('#longInterval').value, 1, 12, 4);
    settings.autoBreaks = $('#autoBreaks').checked;
    settings.autoPomodoros = $('#autoPomodoros').checked;
    settings.soundOn = $('#soundOn').checked;
    settings.volume = clampInt($('#volume').value, 0, 100, 70);
    settings.darkMode = $('#darkMode').checked;
    store.set('settings', settings);

    // if not running, refresh current timer to new duration
    if (!running) {
      remaining = durationFor(mode);
      totalSeconds = remaining;
      renderTime();
    }
    applyTheme();
    renderTaskSummary();
  }

  async function handleNotifyToggle() {
    if ($('#notifyOn').checked) {
      const ok = await requestNotifyPermission();
      $('#notifyOn').checked = ok;
      settings.notifyOn = ok;
      if (!ok) toast('Bạn cần cho phép thông báo');
    } else {
      settings.notifyOn = false;
    }
    store.set('settings', settings);
  }

  // ---------- Runtime persistence (restore after reload) ----------
  function persistRuntime() {
    store.set('runtime', {
      mode, completedPomodoros, roundNumber,
      remaining: running ? (endTimestamp - Date.now()) / 1000 : remaining,
      running, endTimestamp, totalSeconds,
    });
  }

  function restoreRuntime() {
    const rt = store.get('runtime', null);
    if (!rt) return;
    mode = rt.mode || 'pomodoro';
    completedPomodoros = rt.completedPomodoros || 0;
    roundNumber = rt.roundNumber || 1;
    totalSeconds = rt.totalSeconds || durationFor(mode);
    if (rt.running && rt.endTimestamp) {
      const left = (rt.endTimestamp - Date.now()) / 1000;
      if (left > 0) {
        remaining = left;
        endTimestamp = rt.endTimestamp;
        running = true;
        ticker = setInterval(onTick, 250);
      } else {
        // it finished while away
        remaining = 0;
        // resolve completion silently-ish
        completeSession();
        return;
      }
    } else {
      remaining = rt.remaining != null ? rt.remaining : durationFor(mode);
    }
  }

  // ---------- Modals ----------
  function openModal(id) { const m = $(id); m.hidden = false; }
  function closeModal(m) { m.hidden = true; }

  // ---------- Event wiring ----------
  function wireEvents() {
    startBtn.addEventListener('click', () => { tickSound(); toggleTimer(); persistRuntime(); });
    skipBtn.addEventListener('click', () => { skipSession(); });

    modeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const m = tab.dataset.mode;
        if (m === mode && !running) return;
        if (running) {
          if (!confirm('Đang chạy đồng hồ. Chuyển chế độ sẽ đặt lại thời gian?')) return;
        }
        stopAndReset(m);
        persistRuntime();
      });
    });

    // Tasks
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = taskInput.value.trim();
      if (!name) return;
      addTask(name, estNew);
      taskInput.value = '';
      estNew = 1;
      estValEl.textContent = estNew;
    });
    $('#estMinus').addEventListener('click', () => { estNew = Math.max(1, estNew - 1); estValEl.textContent = estNew; });
    $('#estPlus').addEventListener('click', () => { estNew = Math.min(20, estNew + 1); estValEl.textContent = estNew; });
    $('#clearDoneBtn').addEventListener('click', clearDoneTasks);

    // Settings modal
    $('#settingsBtn').addEventListener('click', () => { loadSettingsIntoForm(); openModal('#settingsModal'); });
    $('#statsBtn').addEventListener('click', () => { renderStats(); openModal('#statsModal'); });
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
    });
    document.querySelectorAll('.modal').forEach((m) => {
      m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
    });

    // Live settings inputs
    ['durPomodoro', 'durShort', 'durLong', 'longInterval', 'autoBreaks', 'autoPomodoros', 'soundOn', 'volume', 'darkMode']
      .forEach((id) => {
        const el = $('#' + id);
        el.addEventListener('change', readSettingsFromForm);
        if (el.type === 'range') el.addEventListener('input', readSettingsFromForm);
      });
    $('#notifyOn').addEventListener('change', handleNotifyToggle);

    $('#resetSettings').addEventListener('click', () => {
      settings = Object.assign({}, DEFAULT_SETTINGS);
      store.set('settings', settings);
      loadSettingsIntoForm();
      applyTheme();
      if (!running) { remaining = durationFor(mode); totalSeconds = remaining; renderTime(); }
      toast('Đã khôi phục cài đặt mặc định');
    });

    $('#resetStats').addEventListener('click', () => {
      if (!confirm('Xoá toàn bộ thống kê?')) return;
      stats = { history: {}, total: 0 };
      store.set('stats', stats);
      renderStats();
      toast('Đã xoá thống kê');
    });

    // Keyboard shortcuts (desktop)
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); toggleTimer(); persistRuntime(); }
      if (e.key.toLowerCase() === 's') { skipSession(); }
    });

    // Re-sync timer when tab becomes visible (mobile background throttling)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && running && endTimestamp) {
        remaining = (endTimestamp - Date.now()) / 1000;
        if (remaining <= 0) { remaining = 0; renderTime(); completeSession(); }
        else renderTime();
      }
    });

    window.addEventListener('beforeunload', persistRuntime);
    setInterval(persistRuntime, 5000);
  }

  // ---------- Init ----------
  function init() {
    estValEl.textContent = estNew;
    applyTheme();
    restoreRuntime();
    setMode(mode, { reset: false });
    renderTime();
    renderControls();
    renderTasks();
    wireEvents();

    // Service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
