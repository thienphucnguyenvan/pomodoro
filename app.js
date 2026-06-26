/* ============================================================
   Pomodoro PWA — full featured focus timer (upgraded)
   ============================================================ */
(() => {
  'use strict';

  // ---------- i18n ----------
  const DICT = {
    vi: {
      'mode.pomodoro': 'Pomodoro', 'mode.short': 'Nghỉ ngắn', 'mode.long': 'Nghỉ dài',
      'mode.auto': 'Tự động', 'mode.light': 'Sáng', 'mode.dark': 'Tối',
      'label.focusTime': 'Giờ tập trung', 'label.relax': 'Thư giãn một chút!',
      'hint.focus': 'Đến lúc tập trung!', 'hint.break': 'Nghỉ ngơi nào!',
      'btn.start': 'BẮT ĐẦU', 'btn.pause': 'TẠM DỪNG',
      'goal.today': 'Mục tiêu hôm nay',
      'tasks.title': 'Công việc', 'tasks.clearDone': 'Xoá đã xong',
      'tasks.placeholder': 'Thêm công việc...', 'tasks.empty': 'Chưa có công việc nào. Thêm việc để bắt đầu!',
      'tasks.done': 'Đã xong',
      'summary.remaining': 'Còn {n} pomodoro · ~{time} · xong lúc {finish}',
      'summary.allDone': 'Tất cả công việc đã hoàn thành! 🎉',
      'settings.title': 'Cài đặt', 'settings.durations': '⏱ Thời lượng (phút)',
      'settings.auto': '🔁 Tự động & mục tiêu', 'settings.longInterval': 'Số pomodoro trước nghỉ dài',
      'settings.dailyGoal': 'Mục tiêu pomodoro/ngày', 'settings.autoBreaks': 'Tự động bắt đầu nghỉ',
      'settings.autoPomodoros': 'Tự động bắt đầu Pomodoro', 'settings.sound': '🔔 Âm thanh',
      'settings.alarmOn': 'Chuông báo', 'settings.alarmSound': 'Kiểu chuông',
      'settings.volume': 'Âm lượng chuông', 'settings.ticking': 'Tiếng tích tắc khi tập trung',
      'settings.ambient': 'Âm thanh nền', 'settings.ambientVol': 'Âm lượng nền',
      'settings.notify': '📢 Thông báo & màn hình', 'settings.systemNotify': 'Thông báo hệ thống',
      'settings.wakeLock': 'Giữ màn hình sáng khi chạy', 'settings.appearance': '🎨 Giao diện',
      'settings.theme': 'Bảng màu', 'settings.mode': 'Chế độ', 'settings.data': '💾 Dữ liệu',
      'settings.export': 'Xuất sao lưu', 'settings.import': 'Nhập sao lưu', 'settings.reset': 'Khôi phục mặc định',
      'alarm.beep': 'Bíp', 'alarm.chime': 'Chuông gió', 'alarm.bell': 'Chuông', 'alarm.digital': 'Kỹ thuật số',
      'ambient.none': 'Tắt', 'ambient.white': 'Ồn trắng', 'ambient.brown': 'Ồn nâu', 'ambient.pink': 'Ồn hồng', 'ambient.rain': 'Tiếng mưa',
      'stats.title': 'Thống kê', 'stats.today': 'Pomodoro hôm nay', 'stats.focus': 'Tập trung hôm nay',
      'stats.streak': 'Chuỗi ngày', 'stats.best': 'Chuỗi dài nhất', 'stats.week': 'Pomodoro tuần này',
      'stats.total': 'Tổng pomodoro', 'stats.last7': '7 ngày gần đây', 'stats.reset': 'Xoá thống kê',
      'edit.title': 'Sửa công việc', 'edit.name': 'Tên công việc', 'edit.est': 'Ước lượng (pomodoro)',
      'edit.moveUp': '↑ Lên trên', 'edit.moveDown': '↓ Xuống dưới', 'edit.save': 'Lưu', 'edit.delete': 'Xoá công việc',
      'toast.longBreak': 'Tuyệt vời! Nghỉ dài thôi 🎉', 'toast.shortBreak': 'Làm tốt lắm! Nghỉ ngắn 👏',
      'toast.breakOver': 'Hết giờ nghỉ — tập trung tiếp 💪', 'toast.clearedDone': 'Đã xoá công việc hoàn thành',
      'toast.settingsReset': 'Đã khôi phục cài đặt mặc định', 'toast.statsCleared': 'Đã xoá thống kê',
      'toast.exported': 'Đã xuất dữ liệu sao lưu', 'toast.imported': 'Đã nhập dữ liệu thành công',
      'toast.importError': 'Tệp sao lưu không hợp lệ', 'toast.notifyDenied': 'Bạn cần cho phép thông báo',
      'toast.notifySupport': 'Trình duyệt không hỗ trợ thông báo', 'toast.goalReached': 'Đạt mục tiêu hôm nay! 🏆',
      'notify.donePomodoroTitle': 'Hoàn thành Pomodoro! 🍅', 'notify.toLong': 'Đến giờ nghỉ dài.',
      'notify.toShort': 'Đến giờ nghỉ ngắn.', 'notify.breakOverTitle': 'Hết giờ nghỉ ⏰', 'notify.breakOverBody': 'Quay lại tập trung nào!',
      'confirm.switch': 'Đang chạy đồng hồ. Chuyển chế độ sẽ đặt lại thời gian?',
      'confirm.resetStats': 'Xoá toàn bộ thống kê?', 'confirm.import': 'Nhập sao lưu sẽ ghi đè dữ liệu hiện tại. Tiếp tục?',
      'stats.activity': 'Hoạt động 12 tuần', 'stats.history': 'Lịch sử gần đây', 'stats.less': 'Ít', 'stats.more': 'Nhiều',
      'stats.historyEmpty': 'Chưa có phiên nào hoàn thành.', 'stats.noTask': 'Không có công việc',
      'edit.note': 'Ghi chú', 'toast.installed': 'Đã cài đặt ứng dụng! 🎉', 'time.today': 'Hôm nay', 'time.yesterday': 'Hôm qua',
      'stats.month': 'Theo tháng', 'stats.achievements': 'Thành tựu', 'toast.achievement': 'Mở khoá thành tựu: {name} 🏆',
      'unit.min': 'p',
    },
    en: {
      'mode.pomodoro': 'Pomodoro', 'mode.short': 'Short Break', 'mode.long': 'Long Break',
      'mode.auto': 'Auto', 'mode.light': 'Light', 'mode.dark': 'Dark',
      'label.focusTime': 'Time to focus', 'label.relax': 'Time for a break!',
      'hint.focus': "Let's focus!", 'hint.break': 'Take a breather!',
      'btn.start': 'START', 'btn.pause': 'PAUSE',
      'goal.today': "Today's goal",
      'tasks.title': 'Tasks', 'tasks.clearDone': 'Clear done',
      'tasks.placeholder': 'Add a task...', 'tasks.empty': 'No tasks yet. Add one to get started!',
      'tasks.done': 'Done',
      'summary.remaining': '{n} pomodoros left · ~{time} · finish at {finish}',
      'summary.allDone': 'All tasks completed! 🎉',
      'settings.title': 'Settings', 'settings.durations': '⏱ Duration (minutes)',
      'settings.auto': '🔁 Automation & goal', 'settings.longInterval': 'Pomodoros before long break',
      'settings.dailyGoal': 'Daily pomodoro goal', 'settings.autoBreaks': 'Auto start breaks',
      'settings.autoPomodoros': 'Auto start pomodoros', 'settings.sound': '🔔 Sound',
      'settings.alarmOn': 'Alarm sound', 'settings.alarmSound': 'Alarm type',
      'settings.volume': 'Alarm volume', 'settings.ticking': 'Ticking while focusing',
      'settings.ambient': 'Ambient sound', 'settings.ambientVol': 'Ambient volume',
      'settings.notify': '📢 Notifications & screen', 'settings.systemNotify': 'System notifications',
      'settings.wakeLock': 'Keep screen on while running', 'settings.appearance': '🎨 Appearance',
      'settings.theme': 'Color theme', 'settings.mode': 'Mode', 'settings.data': '💾 Data',
      'settings.export': 'Export backup', 'settings.import': 'Import backup', 'settings.reset': 'Reset to defaults',
      'alarm.beep': 'Beep', 'alarm.chime': 'Chime', 'alarm.bell': 'Bell', 'alarm.digital': 'Digital',
      'ambient.none': 'Off', 'ambient.white': 'White noise', 'ambient.brown': 'Brown noise', 'ambient.pink': 'Pink noise', 'ambient.rain': 'Rain',
      'stats.title': 'Statistics', 'stats.today': 'Pomodoros today', 'stats.focus': 'Focus today',
      'stats.streak': 'Day streak', 'stats.best': 'Best streak', 'stats.week': 'Pomodoros this week',
      'stats.total': 'Total pomodoros', 'stats.last7': 'Last 7 days', 'stats.reset': 'Clear statistics',
      'edit.title': 'Edit task', 'edit.name': 'Task name', 'edit.est': 'Estimate (pomodoros)',
      'edit.moveUp': '↑ Move up', 'edit.moveDown': '↓ Move down', 'edit.save': 'Save', 'edit.delete': 'Delete task',
      'toast.longBreak': 'Great work! Long break time 🎉', 'toast.shortBreak': 'Nice! Short break 👏',
      'toast.breakOver': 'Break over — back to focus 💪', 'toast.clearedDone': 'Cleared completed tasks',
      'toast.settingsReset': 'Settings reset to defaults', 'toast.statsCleared': 'Statistics cleared',
      'toast.exported': 'Backup exported', 'toast.imported': 'Data imported successfully',
      'toast.importError': 'Invalid backup file', 'toast.notifyDenied': 'You need to allow notifications',
      'toast.notifySupport': 'Notifications not supported', 'toast.goalReached': "Daily goal reached! 🏆",
      'notify.donePomodoroTitle': 'Pomodoro complete! 🍅', 'notify.toLong': 'Time for a long break.',
      'notify.toShort': 'Time for a short break.', 'notify.breakOverTitle': 'Break over ⏰', 'notify.breakOverBody': "Let's get back to it!",
      'confirm.switch': 'Timer is running. Switching mode will reset it?',
      'confirm.resetStats': 'Clear all statistics?', 'confirm.import': 'Importing will overwrite current data. Continue?',
      'stats.activity': '12-week activity', 'stats.history': 'Recent history', 'stats.less': 'Less', 'stats.more': 'More',
      'stats.historyEmpty': 'No completed sessions yet.', 'stats.noTask': 'No task',
      'edit.note': 'Note', 'toast.installed': 'App installed! 🎉', 'time.today': 'Today', 'time.yesterday': 'Yesterday',
      'stats.month': 'Monthly', 'stats.achievements': 'Achievements', 'toast.achievement': 'Achievement unlocked: {name} 🏆',
      'unit.min': 'm',
    },
  };
  let lang = 'vi';
  function t(key, params) {
    let s = (DICT[lang] && DICT[lang][key]) || (DICT.vi[key]) || key;
    if (params) for (const k in params) s = s.replace(`{${k}}`, params[k]);
    return s;
  }

  // ---------- Constants ----------
  const RING_CIRCUMFERENCE = 2 * Math.PI * 130;
  const THEMES = ['tomato', 'indigo', 'forest', 'sunset', 'ocean', 'rose', 'slate'];
  const THEME_COLORS = {
    tomato: { pomodoro: '#ba4949', short: '#38858a', long: '#397097' },
    indigo: { pomodoro: '#5b5bd6', short: '#2f9e7e', long: '#6741a8' },
    forest: { pomodoro: '#2e7d52', short: '#3a8fb0', long: '#7a6a3a' },
    sunset: { pomodoro: '#d2691e', short: '#3a8a8f', long: '#9c4f8c' },
    ocean: { pomodoro: '#1f6f8b', short: '#2a9d8f', long: '#3d5a80' },
    rose: { pomodoro: '#c2185b', short: '#5a8f7b', long: '#7b5ea7' },
    slate: { pomodoro: '#4a5568', short: '#3d7a6e', long: '#5a6b8c' },
  };
  const DEFAULT_SETTINGS = {
    pomodoro: 25, short: 5, long: 15, longInterval: 4, dailyGoal: 8,
    autoBreaks: false, autoPomodoros: false,
    soundOn: true, alarmSound: 'beep', volume: 70, tickingOn: false,
    ambient: 'none', ambientVol: 40,
    notifyOn: false, wakeLockOn: true,
    theme: 'tomato', appearance: 'auto', lang: 'vi', customColor: '#ba4949',
  };
  const MODE_META = {
    pomodoro: { label: 'label.focusTime', hint: 'hint.focus', body: 'mode-pomodoro' },
    short: { label: 'label.relax', hint: 'hint.break', body: 'mode-short' },
    long: { label: 'label.relax', hint: 'hint.break', body: 'mode-long' },
  };
  const QUOTES = [
    { vi: '“Tập trung là nói không với hàng trăm ý tưởng hay.” — Steve Jobs', en: '“Focus is saying no to a hundred good ideas.” — Steve Jobs' },
    { vi: '“Cách để bắt đầu là ngừng nói và bắt tay vào làm.” — Walt Disney', en: '“The way to get started is to quit talking and begin doing.” — Walt Disney' },
    { vi: '“Đừng đếm thời gian, hãy làm cho thời gian có giá trị.”', en: "“Don't watch the clock; do what it does. Keep going.”" },
    { vi: '“Việc khó nhất là quyết định bắt tay vào làm.” — Amelia Earhart', en: '“The hardest part is the decision to act.” — Amelia Earhart' },
    { vi: '“Kỷ luật là cầu nối giữa mục tiêu và thành tựu.” — Jim Rohn', en: '“Discipline is the bridge between goals and accomplishment.” — Jim Rohn' },
    { vi: '“Một giờ tập trung hơn cả ngày phân tâm.”', en: '“One focused hour beats a distracted day.”' },
    { vi: '“Hành trình ngàn dặm bắt đầu từ một bước chân.” — Lão Tử', en: '“A journey of a thousand miles begins with a single step.” — Lao Tzu' },
    { vi: '“Hoàn thành tốt hơn hoàn hảo.”', en: '“Done is better than perfect.”' },
  ];

  const ACHIEVEMENTS = [
    { id: 'first', icon: '🌱', vi: 'Khởi đầu', en: 'First step', check: (f) => f.total >= 1 },
    { id: 'ten', icon: '🔟', vi: '10 pomodoro', en: '10 pomodoros', check: (f) => f.total >= 10 },
    { id: 'fifty', icon: '⭐', vi: '50 pomodoro', en: '50 pomodoros', check: (f) => f.total >= 50 },
    { id: 'hundred', icon: '💯', vi: '100 pomodoro', en: '100 pomodoros', check: (f) => f.total >= 100 },
    { id: 'fivehundred', icon: '👑', vi: '500 pomodoro', en: '500 pomodoros', check: (f) => f.total >= 500 },
    { id: 'streak3', icon: '🔥', vi: 'Chuỗi 3 ngày', en: '3-day streak', check: (f) => f.bestStreak >= 3 },
    { id: 'streak7', icon: '🚀', vi: 'Chuỗi 7 ngày', en: '7-day streak', check: (f) => f.bestStreak >= 7 },
    { id: 'streak30', icon: '🏆', vi: 'Chuỗi 30 ngày', en: '30-day streak', check: (f) => f.bestStreak >= 30 },
    { id: 'goal', icon: '🎯', vi: 'Đạt mục tiêu', en: 'Goal hit', check: (f) => f.goalHit },
    { id: 'marathon', icon: '🏃', vi: '10 việc/ngày', en: '10 in a day', check: (f) => f.maxDay >= 10 },
    { id: 'earlyBird', icon: '🌅', vi: 'Dậy sớm', en: 'Early bird', check: (f) => f.earlyBird },
    { id: 'nightOwl', icon: '🦉', vi: 'Cú đêm', en: 'Night owl', check: (f) => f.nightOwl },
  ];

  // ---------- Storage ----------
  const store = {
    get(key, fb) { try { const v = localStorage.getItem(key); return v == null ? fb : JSON.parse(v); } catch { return fb; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  };

  // ---------- State ----------
  let settings = Object.assign({}, DEFAULT_SETTINGS, store.get('settings', {}));
  lang = settings.lang || 'vi';
  let tasks = store.get('tasks', []);
  let stats = store.get('stats', { history: {}, total: 0, bestStreak: 0, sessions: [] });
  if (!Array.isArray(stats.sessions)) stats.sessions = [];
  if (!Array.isArray(stats.achievements)) stats.achievements = [];
  let activeTaskId = store.get('activeTaskId', null);
  let viewMonth = new Date();

  let mode = 'pomodoro';
  let remaining = settings.pomodoro * 60;
  let totalSeconds = remaining;
  let running = false;
  let ticker = null;
  let endTimestamp = null;
  let completedPomodoros = 0;
  let roundNumber = 1;
  let estNew = 1;
  let lastTickSecond = -1;
  let editingId = null;
  let editEst = 1;

  // ---------- DOM ----------
  const $ = (s) => document.querySelector(s);
  const timeEl = $('#time'), modeLabelEl = $('#modeLabel'), startBtn = $('#startBtn');
  const ringProgress = $('.ring-progress'), modeTabs = document.querySelectorAll('.mode-tab');
  const roundCountEl = $('#roundCount'), roundHintEl = $('#roundHint');
  const taskListEl = $('#taskList'), taskForm = $('#taskForm'), taskInput = $('#taskInput');
  const estValEl = $('#estVal'), taskSummaryEl = $('#taskSummary'), toastEl = $('#toast');
  const goalTextEl = $('#goalText'), goalBarEl = $('#goalBar'), quoteEl = $('#quote');
  ringProgress.style.strokeDasharray = RING_CIRCUMFERENCE;

  // ---------- Audio ----------
  let audioCtx = null;
  function ensureAudio() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch {}
    return audioCtx;
  }

  function playAlarm() {
    if (!settings.soundOn) return;
    const ctx = ensureAudio(); if (!ctx) return;
    const vol = settings.volume / 100;
    const now = ctx.currentTime;
    const beepAt = (freq, start, dur, type = 'sine', gainMul = 0.6) => {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(vol * gainMul, now + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + start); osc.stop(now + start + dur + 0.02);
    };
    switch (settings.alarmSound) {
      case 'chime':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => beepAt(f, i * 0.18, 0.5, 'sine', 0.5));
        break;
      case 'bell':
        [440, 880, 1320].forEach((f, i) => beepAt(f, 0, 1.6, 'sine', 0.5 / (i + 1)));
        beepAt(660, 0.5, 1.4, 'sine', 0.3);
        break;
      case 'digital':
        for (let r = 0; r < 3; r++) { beepAt(988, r * 0.3, 0.1, 'square', 0.4); beepAt(988, r * 0.3 + 0.13, 0.1, 'square', 0.4); }
        break;
      default: // beep
        [0, 0.25, 0.5].forEach((off, i) => beepAt(660 + i * 220, off, 0.22, 'sine', 0.6));
    }
  }

  function playTick() {
    if (!settings.tickingOn) return;
    const ctx = ensureAudio(); if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'square'; osc.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime((settings.volume / 100) * 0.07, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(g).connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.04);
  }

  // ---------- Ambient noise ----------
  let ambientNode = null, ambientGain = null;
  function makeNoiseBuffer(ctx, type) {
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    if (type === 'brown') {
      let last = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; d[i] = (last + 0.02 * w) / 1.02; last = d[i]; d[i] *= 3.5; }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      }
    } else {
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; // white / rain base
    }
    return buf;
  }

  function startAmbient() {
    stopAmbient();
    if (settings.ambient === 'none') return;
    const ctx = ensureAudio(); if (!ctx) return;
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, settings.ambient === 'rain' ? 'white' : settings.ambient);
    src.loop = true;
    ambientGain = ctx.createGain();
    ambientGain.gain.value = (settings.ambientVol / 100) * 0.5;
    let last = src;
    if (settings.ambient === 'rain') {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 350;
      src.connect(hp); hp.connect(lp); last = lp;
    }
    last.connect(ambientGain).connect(ctx.destination);
    src.start();
    ambientNode = src;
  }
  function stopAmbient() {
    try { if (ambientNode) ambientNode.stop(); } catch {}
    ambientNode = null; ambientGain = null;
  }
  function refreshAmbient() {
    if (running) startAmbient();
    else stopAmbient();
  }

  // ---------- Wake Lock ----------
  let wakeLock = null;
  async function requestWakeLock() {
    if (!settings.wakeLockOn || !('wakeLock' in navigator)) return;
    try { wakeLock = await navigator.wakeLock.request('screen'); } catch {}
  }
  async function releaseWakeLock() { try { if (wakeLock) await wakeLock.release(); } catch {} wakeLock = null; }

  // ---------- Confetti ----------
  const confettiCanvas = $('#confetti');
  const cctx = confettiCanvas.getContext('2d');
  let parts = [], confettiRAF = null;
  function sizeConfetti() {
    const dpr = window.devicePixelRatio || 1;
    confettiCanvas.width = window.innerWidth * dpr;
    confettiCanvas.height = window.innerHeight * dpr;
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function launchConfetti() {
    sizeConfetti();
    const colors = ['#ff5e5b', '#ffd93d', '#6bcB77', '#4d96ff', '#c780ff', '#ff9f1c'];
    const W = window.innerWidth;
    for (let i = 0; i < 130; i++) {
      parts.push({
        x: Math.random() * W, y: -20 - Math.random() * window.innerHeight * 0.3,
        vx: (Math.random() - 0.5) * 6, vy: 2 + Math.random() * 4,
        size: 6 + Math.random() * 8, color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI, vrot: (Math.random() - 0.5) * 0.3, life: 1,
      });
    }
    if (!confettiRAF) confettiRAF = requestAnimationFrame(stepConfetti);
  }
  function stepConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    const H = window.innerHeight;
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.rot += p.vrot;
      if (p.y > H * 0.7) p.life -= 0.02;
      cctx.save(); cctx.globalAlpha = Math.max(0, p.life); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
      cctx.fillStyle = p.color; cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); cctx.restore();
    });
    parts = parts.filter((p) => p.life > 0 && p.y < H + 40);
    if (parts.length) confettiRAF = requestAnimationFrame(stepConfetti);
    else { cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); confettiRAF = null; }
  }

  // ---------- Helpers ----------
  function todayKey(d = new Date()) {
    const o = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return o.toISOString().slice(0, 10);
  }
  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  function durationFor(m) { return settings[m] * 60; }
  function formatMinutes(min) {
    if (min < 60) return `${min}${t('unit.min')}`;
    const h = Math.floor(min / 60), m = min % 60;
    return m ? `${h}h${m}` : `${h}h`;
  }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toastEl.classList.remove('show'); setTimeout(() => { toastEl.hidden = true; }, 300); }, 2200);
  }

  // ---------- Rendering ----------
  function renderTime() {
    timeEl.textContent = fmt(Math.max(0, Math.round(remaining)));
    const frac = totalSeconds > 0 ? Math.max(0, remaining) / totalSeconds : 0;
    ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - frac);
    document.title = running ? `${fmt(Math.max(0, Math.round(remaining)))} — ${t('mode.' + mode)}` : 'Pomodoro — Focus Timer';
  }
  function effectiveDark() {
    if (settings.appearance === 'dark') return true;
    if (settings.appearance === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  // HSL helpers for custom color
  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s * 100, l * 100];
  }
  function hslToHex(h, s, l) {
    s /= 100; l /= 100; h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0]; else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c]; else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
    const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return '#' + to(r) + to(g) + to(b);
  }
  function customColors() {
    const [h, s, l] = hexToHsl(settings.customColor || '#ba4949');
    return {
      pomodoro: settings.customColor || '#ba4949',
      short: hslToHex(h + 160, Math.min(70, s), Math.min(45, Math.max(30, l))),
      long: hslToHex(h + 205, Math.min(65, s), Math.min(48, Math.max(32, l))),
    };
  }
  function applyTheme() {
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    if (settings.theme === 'custom') {
      const cc = customColors();
      root.style.setProperty('--accent-pomodoro', cc.pomodoro);
      root.style.setProperty('--accent-short', cc.short);
      root.style.setProperty('--accent-long', cc.long);
    } else {
      root.style.removeProperty('--accent-pomodoro');
      root.style.removeProperty('--accent-short');
      root.style.removeProperty('--accent-long');
    }
    document.body.classList.toggle('dark', effectiveDark());
    const meta = document.querySelector('meta[name="theme-color"]');
    const accent = settings.theme === 'custom' ? customColors()[mode] : (THEME_COLORS[settings.theme]?.[mode] || '#ba4949');
    if (meta) meta.content = effectiveDark() ? '#1f1f25' : accent;
  }
  function renderMode() {
    document.body.classList.remove('mode-pomodoro', 'mode-short', 'mode-long');
    document.body.classList.add(MODE_META[mode].body);
    modeLabelEl.textContent = t(MODE_META[mode].label);
    roundHintEl.textContent = t(MODE_META[mode].hint);
    modeTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.mode === mode));
    roundCountEl.textContent = `#${roundNumber}`;
    applyTheme();
  }
  function renderControls() {
    startBtn.textContent = running ? t('btn.pause') : t('btn.start');
    startBtn.classList.toggle('running', running);
    document.querySelector('.timer-wrap').classList.toggle('pulsing', running);
  }

  // ---------- Dynamic favicon ----------
  let favCanvas = null, favLastSec = -1;
  function updateFavicon() {
    try {
      const link = document.getElementById('favicon'); if (!link) return;
      if (!favCanvas) { favCanvas = document.createElement('canvas'); favCanvas.width = 64; favCanvas.height = 64; }
      const c = favCanvas.getContext('2d');
      const color = THEME_COLORS[settings.theme] ? THEME_COLORS[settings.theme][mode] : '#ba4949';
      const accent = settings.theme === 'custom' ? (customColors()[mode]) : color;
      c.clearRect(0, 0, 64, 64);
      c.fillStyle = accent; c.beginPath(); c.arc(32, 32, 32, 0, Math.PI * 2); c.fill();
      // progress ring
      const frac = totalSeconds > 0 ? Math.max(0, remaining) / totalSeconds : 1;
      c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 6;
      c.beginPath(); c.arc(32, 32, 26, 0, Math.PI * 2); c.stroke();
      c.strokeStyle = '#fff'; c.lineWidth = 6; c.lineCap = 'round';
      c.beginPath(); c.arc(32, 32, 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.stroke();
      // minutes text
      c.fillStyle = '#fff'; c.font = 'bold 26px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(String(Math.ceil(Math.max(0, remaining) / 60)), 32, 34);
      link.type = 'image/png'; link.href = favCanvas.toDataURL('image/png');
    } catch {}
  }
  function resetFavicon() {
    const link = document.getElementById('favicon'); if (link) { link.type = 'image/svg+xml'; link.href = 'icons/icon.svg'; }
    favLastSec = -1;
  }
  function renderGoal() {
    const today = stats.history[todayKey()] || { count: 0 };
    const goal = settings.dailyGoal || 8;
    goalTextEl.textContent = `${today.count}/${goal} 🍅`;
    goalBarEl.style.width = Math.min(100, (today.count / goal) * 100) + '%';
  }
  function renderQuote() {
    const q = QUOTES[(Math.random() * QUOTES.length) | 0];
    quoteEl.textContent = q[lang] || q.vi;
  }

  // ---------- Timer engine ----------
  function startTimer() {
    if (running) return;
    running = true; ensureAudio();
    endTimestamp = Date.now() + remaining * 1000;
    lastTickSecond = Math.ceil(remaining);
    ticker = setInterval(onTick, 250);
    renderControls(); requestWakeLock(); startAmbient(); favLastSec = -1; updateFavicon();
  }
  function pauseTimer() {
    if (!running) return;
    running = false; clearInterval(ticker); ticker = null;
    remaining = Math.max(0, (endTimestamp - Date.now()) / 1000);
    endTimestamp = null;
    renderControls(); renderTime(); releaseWakeLock(); stopAmbient(); resetFavicon();
  }
  function toggleTimer() { running ? pauseTimer() : startTimer(); }
  function onTick() {
    remaining = (endTimestamp - Date.now()) / 1000;
    if (remaining <= 0) { remaining = 0; renderTime(); completeSession(); return; }
    const sec = Math.ceil(remaining);
    if (mode === 'pomodoro' && settings.tickingOn && sec !== lastTickSecond) playTick();
    if (sec !== favLastSec) { favLastSec = sec; updateFavicon(); }
    lastTickSecond = sec;
    renderTime();
  }
  function setMode(newMode, { reset = true } = {}) {
    mode = newMode;
    if (reset) { remaining = durationFor(mode); totalSeconds = remaining; }
    renderMode(); renderTime();
  }
  function stopAndReset(newMode) {
    running = false; clearInterval(ticker); ticker = null; endTimestamp = null;
    releaseWakeLock(); stopAmbient(); resetFavicon();
    setMode(newMode, { reset: true }); renderControls();
  }

  // ---------- Session completion ----------
  function completeSession() {
    clearInterval(ticker); ticker = null; running = false; endTimestamp = null;
    releaseWakeLock(); stopAmbient();
    playAlarm();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    if (mode === 'pomodoro') {
      recordPomodoro(); completedPomodoros += 1; incrementActiveTask();
      checkAchievements();
      launchConfetti(); renderGoal();
      const today = stats.history[todayKey()];
      if (today && today.count === settings.dailyGoal) toast(t('toast.goalReached'));
      const goLong = completedPomodoros % settings.longInterval === 0;
      const next = goLong ? 'long' : 'short';
      notify(t('notify.donePomodoroTitle'), goLong ? t('notify.toLong') : t('notify.toShort'));
      if (!(today && today.count === settings.dailyGoal)) toast(goLong ? t('toast.longBreak') : t('toast.shortBreak'));
      stopAndReset(next);
      if (settings.autoBreaks) startTimer();
    } else {
      roundNumber += 1;
      notify(t('notify.breakOverTitle'), t('notify.breakOverBody'));
      toast(t('toast.breakOver'));
      stopAndReset('pomodoro');
      if (settings.autoPomodoros) startTimer();
    }
    renderControls(); persistRuntime(); renderQuote();
  }
  function skipSession() {
    if (mode === 'pomodoro') stopAndReset('short');
    else { roundNumber += 1; stopAndReset('pomodoro'); }
    renderControls(); persistRuntime();
  }
  function resetCurrent() {
    running = false; clearInterval(ticker); ticker = null; endTimestamp = null;
    releaseWakeLock(); stopAmbient(); resetFavicon();
    remaining = durationFor(mode); totalSeconds = remaining;
    renderControls(); renderTime(); persistRuntime();
  }

  // ---------- Notifications ----------
  function notify(title, body) {
    if (!settings.notifyOn || !('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', vibrate: [200, 100, 200] }))
          .catch(() => new Notification(title, { body }));
      } else new Notification(title, { body });
    } catch {}
  }
  async function requestNotifyPermission() {
    if (!('Notification' in window)) { toast(t('toast.notifySupport')); return false; }
    if (Notification.permission === 'granted') return true;
    return (await Notification.requestPermission()) === 'granted';
  }

  // ---------- Stats ----------
  function recordPomodoro() {
    const key = todayKey();
    if (!stats.history[key]) stats.history[key] = { count: 0, minutes: 0 };
    stats.history[key].count += 1;
    stats.history[key].minutes += settings.pomodoro;
    stats.total = (stats.total || 0) + 1;
    const active = tasks.find((x) => x.id === activeTaskId);
    stats.sessions.unshift({ ts: Date.now(), task: active ? active.name : null, minutes: settings.pomodoro });
    if (stats.sessions.length > 200) stats.sessions.length = 200;
    const cur = computeStreak();
    stats.bestStreak = Math.max(stats.bestStreak || 0, cur);
    store.set('stats', stats);
  }
  function computeStreak() {
    let streak = 0; const d = new Date();
    if (!stats.history[todayKey(d)]) d.setDate(d.getDate() - 1);
    while (stats.history[todayKey(d)] && stats.history[todayKey(d)].count > 0) { streak++; d.setDate(d.getDate() - 1); }
    return streak;
  }
  function weekTotal() {
    let sum = 0; const d = new Date();
    for (let i = 0; i < 7; i++) { sum += (stats.history[todayKey(d)]?.count) || 0; d.setDate(d.getDate() - 1); }
    return sum;
  }
  function renderStats() {
    const today = stats.history[todayKey()] || { count: 0, minutes: 0 };
    $('#statToday').textContent = today.count;
    $('#statFocus').textContent = formatMinutes(today.minutes);
    $('#statStreak').textContent = computeStreak();
    $('#statBest').textContent = stats.bestStreak || 0;
    $('#statWeek').textContent = weekTotal();
    $('#statTotal').textContent = stats.total || 0;

    const chart = $('#weekChart'); chart.innerHTML = '';
    const days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
    const counts = days.map((d) => (stats.history[todayKey(d)]?.count) || 0);
    const max = Math.max(1, ...counts);
    const dayNames = lang === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const todayStr = todayKey();
    days.forEach((d, i) => {
      const col = document.createElement('div'); col.className = 'bar-col';
      const c = counts[i], h = Math.round((c / max) * 100);
      const isToday = todayKey(d) === todayStr;
      col.innerHTML = `<span class="bar-val">${c || ''}</span><div class="bar${isToday ? ' today' : ''}" style="height:${Math.max(c ? 6 : 2, h)}%"></div><span class="bar-label">${dayNames[d.getDay()]}</span>`;
      chart.appendChild(col);
    });

    renderHeatmap();
    renderMonth();
    renderAchievements();
    renderHistory();
  }

  function renderHeatmap() {
    const heat = $('#heatmap'); if (!heat) return;
    heat.innerHTML = '';
    const weeks = 12, totalDays = weeks * 7;
    const today = new Date();
    // align so the last column ends today; start from the Sunday (weeks-1)*7 back
    const start = new Date(today); start.setDate(start.getDate() - (totalDays - 1));
    // shift start back to its weekday position so rows line up by weekday
    start.setDate(start.getDate() - start.getDay());
    const level = (c) => c === 0 ? '' : c < 2 ? 'l1' : c < 4 ? 'l2' : c < 6 ? 'l3' : 'l4';
    const cur = new Date(start);
    const todayStr = todayKey();
    while (cur <= today || cur.getDay() !== 0) {
      const k = todayKey(cur);
      const c = (stats.history[k]?.count) || 0;
      const cell = document.createElement('div');
      cell.className = 'heat-cell ' + level(c);
      cell.title = `${k}: ${c} 🍅`;
      if (k === todayStr) cell.style.outline = '2px solid var(--bg)';
      heat.appendChild(cell);
      cur.setDate(cur.getDate() + 1);
      if (cur > today && cur.getDay() === 0) break;
    }
  }

  function relTime(ts) {
    const d = new Date(ts), k = todayKey(d);
    const time = d.toLocaleTimeString(lang === 'en' ? 'en-US' : 'vi-VN', { hour: '2-digit', minute: '2-digit' });
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (k === todayKey()) return `${t('time.today')} ${time}`;
    if (k === todayKey(y)) return `${t('time.yesterday')} ${time}`;
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', { day: '2-digit', month: '2-digit' }) + ' ' + time;
  }

  function renderHistory() {
    const list = $('#historyList'); if (!list) return;
    list.innerHTML = '';
    const items = (stats.sessions || []).slice(0, 12);
    if (items.length === 0) {
      const li = document.createElement('li'); li.className = 'history-empty'; li.textContent = t('stats.historyEmpty');
      list.appendChild(li); return;
    }
    items.forEach((s) => {
      const li = document.createElement('li'); li.className = 'history-item';
      const name = document.createElement('span'); name.className = 'history-task';
      name.textContent = '🍅 ' + (s.task || t('stats.noTask'));
      const tm = document.createElement('span'); tm.className = 'history-time'; tm.textContent = relTime(s.ts);
      li.appendChild(name); li.appendChild(tm); list.appendChild(li);
    });
  }

  // ---------- Achievements ----------
  function computeFacts() {
    let maxDay = 0, goalHit = false;
    for (const k in stats.history) {
      const c = stats.history[k].count || 0;
      if (c > maxDay) maxDay = c;
      if (c >= settings.dailyGoal) goalHit = true;
    }
    let earlyBird = false, nightOwl = false;
    (stats.sessions || []).forEach((s) => { const h = new Date(s.ts).getHours(); if (h < 7) earlyBird = true; if (h >= 22) nightOwl = true; });
    return { total: stats.total || 0, bestStreak: stats.bestStreak || 0, maxDay, goalHit, earlyBird, nightOwl };
  }
  function syncAchievements() {
    const f = computeFacts();
    const earned = ACHIEVEMENTS.filter((a) => a.check(f)).map((a) => a.id);
    stats.achievements = earned; store.set('stats', stats);
  }
  function checkAchievements() {
    const f = computeFacts();
    ACHIEVEMENTS.forEach((a) => {
      if (a.check(f) && !stats.achievements.includes(a.id)) {
        stats.achievements.push(a.id);
        store.set('stats', stats);
        toast(t('toast.achievement', { name: a[lang] || a.vi }));
      }
    });
  }
  function renderAchievements() {
    const wrap = $('#achievements'); if (!wrap) return;
    wrap.innerHTML = '';
    const f = computeFacts();
    ACHIEVEMENTS.forEach((a) => {
      const earned = a.check(f);
      const el = document.createElement('div'); el.className = 'ach' + (earned ? ' earned' : '');
      el.innerHTML = `<div class="ach-icon">${a.icon}</div><div class="ach-name"></div>`;
      el.querySelector('.ach-name').textContent = a[lang] || a.vi;
      el.title = a[lang] || a.vi;
      wrap.appendChild(el);
    });
  }

  // ---------- Monthly calendar ----------
  function renderMonth() {
    const grid = $('#monthGrid'); if (!grid) return;
    grid.innerHTML = '';
    const y = viewMonth.getFullYear(), m = viewMonth.getMonth();
    $('#monthLabel').textContent = viewMonth.toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', { month: 'long', year: 'numeric' });
    const dows = lang === 'en' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    dows.forEach((d) => { const h = document.createElement('div'); h.className = 'month-dow'; h.textContent = d; grid.appendChild(h); });
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) { const e = document.createElement('div'); e.className = 'month-cell empty'; grid.appendChild(e); }
    const todayStr = todayKey();
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d); const k = todayKey(dt);
      const c = (stats.history[k]?.count) || 0;
      const cell = document.createElement('div');
      cell.className = 'month-cell' + (c > 0 ? ' has' : '') + (k === todayStr ? ' today' : '');
      cell.innerHTML = `<span class="mc-day">${d}</span>${c ? `<span class="mc-count">${c}🍅</span>` : ''}`;
      grid.appendChild(cell);
    }
  }

  // ---------- Tasks ----------
  function saveTasks() { store.set('tasks', tasks); }
  function renderTasks() {
    taskListEl.innerHTML = '';
    if (tasks.length === 0) {
      const li = document.createElement('li'); li.className = 'task-empty'; li.textContent = t('tasks.empty');
      taskListEl.appendChild(li);
    }
    tasks.forEach((task) => {
      const li = document.createElement('li'); li.className = 'task-item';
      if (task.done) li.classList.add('done');
      if (task.id === activeTaskId && !task.done) li.classList.add('active');
      li.innerHTML = `
        <button class="task-check" aria-label="${t('tasks.done')}"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></button>
        <div class="task-body"><div class="task-name"></div><div class="task-meta">${task.done ? '✓ ' + t('tasks.done') + ' · ' : ''}${task.completed}/${task.est} 🍅</div>${task.note ? '<div class="task-note"></div>' : ''}</div>
        <button class="task-edit" aria-label="edit"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>`;
      li.querySelector('.task-name').textContent = task.name;
      if (task.note) li.querySelector('.task-note').textContent = task.note;
      li.querySelector('.task-check').addEventListener('click', (e) => { e.stopPropagation(); toggleTaskDone(task.id); });
      li.querySelector('.task-edit').addEventListener('click', (e) => { e.stopPropagation(); openEdit(task.id); });
      li.querySelector('.task-body').addEventListener('click', () => setActiveTask(task.id));
      taskListEl.appendChild(li);
    });
    renderTaskSummary();
  }
  function renderTaskSummary() {
    const pending = tasks.filter((x) => !x.done);
    const estLeft = pending.reduce((s, x) => s + Math.max(0, x.est - x.completed), 0);
    if (tasks.length === 0) { taskSummaryEl.textContent = ''; return; }
    if (estLeft <= 0) { taskSummaryEl.textContent = t('summary.allDone'); return; }
    const mins = estLeft * settings.pomodoro;
    const finish = new Date(Date.now() + mins * 60000).toLocaleTimeString(lang === 'en' ? 'en-US' : 'vi-VN', { hour: '2-digit', minute: '2-digit' });
    taskSummaryEl.textContent = t('summary.remaining', { n: estLeft, time: formatMinutes(mins), finish });
  }
  function addTask(name, est) {
    tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, est, completed: 0, done: false });
    saveTasks();
    if (!activeTaskId) { const f = tasks.find((x) => !x.done); if (f) activeTaskId = f.id; store.set('activeTaskId', activeTaskId); }
    renderTasks();
  }
  function toggleTaskDone(id) {
    const tk = tasks.find((x) => x.id === id); if (!tk) return;
    tk.done = !tk.done;
    if (tk.done && id === activeTaskId) { const n = tasks.find((x) => !x.done); activeTaskId = n ? n.id : null; store.set('activeTaskId', activeTaskId); }
    saveTasks(); renderTasks();
  }
  function deleteTask(id) {
    tasks = tasks.filter((x) => x.id !== id);
    if (id === activeTaskId) { const n = tasks.find((x) => !x.done); activeTaskId = n ? n.id : null; store.set('activeTaskId', activeTaskId); }
    saveTasks(); renderTasks();
  }
  function setActiveTask(id) {
    const tk = tasks.find((x) => x.id === id); if (!tk || tk.done) return;
    activeTaskId = id; store.set('activeTaskId', activeTaskId); renderTasks();
  }
  function incrementActiveTask() {
    if (!activeTaskId) return;
    const tk = tasks.find((x) => x.id === activeTaskId); if (!tk) return;
    tk.completed += 1;
    if (tk.completed >= tk.est) { tk.done = true; const n = tasks.find((x) => !x.done); activeTaskId = n ? n.id : null; store.set('activeTaskId', activeTaskId); }
    saveTasks(); renderTasks();
  }
  function clearDoneTasks() { tasks = tasks.filter((x) => !x.done); saveTasks(); renderTasks(); toast(t('toast.clearedDone')); }

  // Edit modal
  function openEdit(id) {
    const tk = tasks.find((x) => x.id === id); if (!tk) return;
    editingId = id; editEst = tk.est;
    $('#editName').value = tk.name; $('#editEstVal').textContent = editEst;
    $('#editNote').value = tk.note || '';
    $('#editModal').hidden = false;
  }
  function saveEdit() {
    const tk = tasks.find((x) => x.id === editingId); if (!tk) return;
    const name = $('#editName').value.trim(); if (name) tk.name = name;
    tk.est = editEst; tk.note = $('#editNote').value.trim();
    if (tk.completed >= tk.est) { tk.done = true; }
    saveTasks(); renderTasks(); $('#editModal').hidden = true;
  }
  function moveTask(dir) {
    const i = tasks.findIndex((x) => x.id === editingId); if (i < 0) return;
    const j = i + dir; if (j < 0 || j >= tasks.length) return;
    [tasks[i], tasks[j]] = [tasks[j], tasks[i]]; saveTasks(); renderTasks();
  }

  // ---------- Settings UI ----------
  function loadSettingsIntoForm() {
    $('#durPomodoro').value = settings.pomodoro; $('#durShort').value = settings.short; $('#durLong').value = settings.long;
    $('#longInterval').value = settings.longInterval; $('#dailyGoal').value = settings.dailyGoal;
    $('#autoBreaks').checked = settings.autoBreaks; $('#autoPomodoros').checked = settings.autoPomodoros;
    $('#soundOn').checked = settings.soundOn; $('#alarmSound').value = settings.alarmSound;
    $('#volume').value = settings.volume; $('#tickingOn').checked = settings.tickingOn;
    $('#ambient').value = settings.ambient; $('#ambientVol').value = settings.ambientVol;
    $('#notifyOn').checked = settings.notifyOn; $('#wakeLockOn').checked = settings.wakeLockOn;
    $('#appearance').value = settings.appearance;
    renderSwatches();
  }
  function renderSwatches() {
    const wrap = $('#themeSwatches'); wrap.innerHTML = '';
    THEMES.forEach((th) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'swatch' + (th === settings.theme ? ' selected' : '');
      b.style.background = THEME_COLORS[th].pomodoro; b.setAttribute('aria-label', th);
      b.addEventListener('click', () => { settings.theme = th; store.set('settings', settings); applyTheme(); renderSwatches(); updateFaviconIfRunning(); });
      wrap.appendChild(b);
    });
    // custom color swatch
    const cb = document.createElement('button'); cb.type = 'button';
    cb.className = 'swatch custom' + (settings.theme === 'custom' ? ' selected' : '');
    cb.setAttribute('aria-label', 'custom');
    if (settings.theme === 'custom') { cb.style.background = settings.customColor; cb.classList.add('picked'); }
    const picker = document.createElement('input'); picker.type = 'color'; picker.value = settings.customColor || '#ba4949';
    picker.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none;';
    picker.addEventListener('input', () => {
      settings.customColor = picker.value; settings.theme = 'custom'; store.set('settings', settings);
      applyTheme(); renderSwatches(); updateFaviconIfRunning();
    });
    cb.addEventListener('click', () => picker.click());
    wrap.appendChild(cb); wrap.appendChild(picker);
  }
  function updateFaviconIfRunning() { if (running) { favLastSec = -1; updateFavicon(); } }
  function clampInt(v, min, max, def) { const n = parseInt(v, 10); return isNaN(n) ? def : Math.min(max, Math.max(min, n)); }
  function readSettingsFromForm() {
    settings.pomodoro = clampInt($('#durPomodoro').value, 1, 180, 25);
    settings.short = clampInt($('#durShort').value, 1, 60, 5);
    settings.long = clampInt($('#durLong').value, 1, 60, 15);
    settings.longInterval = clampInt($('#longInterval').value, 1, 12, 4);
    settings.dailyGoal = clampInt($('#dailyGoal').value, 1, 50, 8);
    settings.autoBreaks = $('#autoBreaks').checked; settings.autoPomodoros = $('#autoPomodoros').checked;
    settings.soundOn = $('#soundOn').checked; settings.alarmSound = $('#alarmSound').value;
    settings.volume = clampInt($('#volume').value, 0, 100, 70); settings.tickingOn = $('#tickingOn').checked;
    settings.ambient = $('#ambient').value; settings.ambientVol = clampInt($('#ambientVol').value, 0, 100, 40);
    settings.wakeLockOn = $('#wakeLockOn').checked; settings.appearance = $('#appearance').value;
    store.set('settings', settings);
    if (!running) { remaining = durationFor(mode); totalSeconds = remaining; renderTime(); }
    applyTheme(); renderTaskSummary(); renderGoal(); refreshAmbient();
    if (running) requestWakeLock();
  }
  async function handleNotifyToggle() {
    if ($('#notifyOn').checked) {
      const ok = await requestNotifyPermission();
      $('#notifyOn').checked = ok; settings.notifyOn = ok; if (!ok) toast(t('toast.notifyDenied'));
    } else settings.notifyOn = false;
    store.set('settings', settings);
  }

  // ---------- Language ----------
  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { const v = t(el.dataset.i18nPh); if (v) el.placeholder = v; });
    $('#langCode').textContent = lang.toUpperCase();
    renderMode(); renderControls(); renderTasks(); renderGoal(); renderQuote(); renderTime();
  }
  function toggleLang() {
    lang = lang === 'vi' ? 'en' : 'vi';
    settings.lang = lang; store.set('settings', settings);
    applyI18n();
  }

  // ---------- Import / Export ----------
  function exportData() {
    const data = { settings, tasks, stats, activeTaskId, exportedAt: new Date().toISOString(), version: 2 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `pomodoro-backup-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    toast(t('toast.exported'));
  }
  function importData(file) {
    if (!confirm(t('confirm.import'))) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (!d || typeof d !== 'object') throw new Error('bad');
        if (d.settings) { settings = Object.assign({}, DEFAULT_SETTINGS, d.settings); store.set('settings', settings); }
        if (Array.isArray(d.tasks)) { tasks = d.tasks; saveTasks(); }
        if (d.stats) { stats = d.stats; if (!Array.isArray(stats.sessions)) stats.sessions = []; if (!Array.isArray(stats.achievements)) stats.achievements = []; store.set('stats', stats); syncAchievements(); }
        activeTaskId = d.activeTaskId || null; store.set('activeTaskId', activeTaskId);
        lang = settings.lang || 'vi';
        if (!running) { remaining = durationFor(mode); totalSeconds = remaining; }
        applyTheme(); applyI18n(); renderStats();
        toast(t('toast.imported'));
      } catch { toast(t('toast.importError')); }
    };
    reader.readAsText(file);
  }

  // ---------- Runtime persistence ----------
  function persistRuntime() {
    store.set('runtime', {
      mode, completedPomodoros, roundNumber, totalSeconds,
      remaining: running ? (endTimestamp - Date.now()) / 1000 : remaining,
      running, endTimestamp,
    });
  }
  function restoreRuntime() {
    const rt = store.get('runtime', null); if (!rt) return;
    mode = rt.mode || 'pomodoro'; completedPomodoros = rt.completedPomodoros || 0;
    roundNumber = rt.roundNumber || 1; totalSeconds = rt.totalSeconds || durationFor(mode);
    if (rt.running && rt.endTimestamp) {
      const left = (rt.endTimestamp - Date.now()) / 1000;
      if (left > 0) { remaining = left; endTimestamp = rt.endTimestamp; running = true; lastTickSecond = Math.ceil(remaining); ticker = setInterval(onTick, 250); requestWakeLock(); }
      else { remaining = 0; completeSession(); return; }
    } else remaining = rt.remaining != null ? rt.remaining : durationFor(mode);
  }

  // ---------- Zen mode ----------
  function toggleZen() {
    const on = !document.body.classList.contains('zen');
    document.body.classList.toggle('zen', on);
    $('#zenExit').hidden = !on;
    try {
      if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
      else if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    } catch {}
  }
  function exitZen() {
    document.body.classList.remove('zen'); $('#zenExit').hidden = true;
    try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch {}
  }

  // ---------- Install prompt ----------
  let deferredPrompt = null;
  async function doInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch {}
    deferredPrompt = null; $('#installBtn').hidden = true;
  }

  // ---------- Events ----------
  function wireEvents() {
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; $('#installBtn').hidden = false; });
    window.addEventListener('appinstalled', () => { deferredPrompt = null; $('#installBtn').hidden = true; toast(t('toast.installed')); });
    $('#installBtn').addEventListener('click', doInstall);
    $('#zenBtn').addEventListener('click', toggleZen);
    $('#zenExit').addEventListener('click', exitZen);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('zen')) exitZen(); });

    startBtn.addEventListener('click', () => { ensureAudio(); toggleTimer(); persistRuntime(); });
    $('#skipBtn').addEventListener('click', skipSession);
    $('#resetBtn').addEventListener('click', resetCurrent);
    $('#langBtn').addEventListener('click', toggleLang);

    modeTabs.forEach((tab) => tab.addEventListener('click', () => {
      const m = tab.dataset.mode;
      if (m === mode && !running) return;
      if (running && !confirm(t('confirm.switch'))) return;
      stopAndReset(m); persistRuntime();
    }));

    taskForm.addEventListener('submit', (e) => {
      e.preventDefault(); const name = taskInput.value.trim(); if (!name) return;
      addTask(name, estNew); taskInput.value = ''; estNew = 1; estValEl.textContent = estNew;
    });
    $('#estMinus').addEventListener('click', () => { estNew = Math.max(1, estNew - 1); estValEl.textContent = estNew; });
    $('#estPlus').addEventListener('click', () => { estNew = Math.min(20, estNew + 1); estValEl.textContent = estNew; });
    $('#clearDoneBtn').addEventListener('click', clearDoneTasks);

    // Edit modal
    $('#editEstMinus').addEventListener('click', () => { editEst = Math.max(1, editEst - 1); $('#editEstVal').textContent = editEst; });
    $('#editEstPlus').addEventListener('click', () => { editEst = Math.min(20, editEst + 1); $('#editEstVal').textContent = editEst; });
    $('#editSave').addEventListener('click', saveEdit);
    $('#editDelete').addEventListener('click', () => { deleteTask(editingId); $('#editModal').hidden = true; });
    $('#moveUp').addEventListener('click', () => moveTask(-1));
    $('#moveDown').addEventListener('click', () => moveTask(1));

    $('#settingsBtn').addEventListener('click', () => { loadSettingsIntoForm(); $('#settingsModal').hidden = false; });
    $('#statsBtn').addEventListener('click', () => { renderStats(); $('#statsModal').hidden = false; });
    document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', (e) => { e.target.closest('.modal').hidden = true; }));
    document.querySelectorAll('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) m.hidden = true; }));

    ['durPomodoro', 'durShort', 'durLong', 'longInterval', 'dailyGoal', 'autoBreaks', 'autoPomodoros', 'soundOn', 'alarmSound', 'volume', 'tickingOn', 'ambient', 'ambientVol', 'wakeLockOn', 'appearance']
      .forEach((id) => { const el = $('#' + id); el.addEventListener('change', readSettingsFromForm); if (el.type === 'range') el.addEventListener('input', readSettingsFromForm); });
    $('#notifyOn').addEventListener('change', handleNotifyToggle);

    $('#resetSettings').addEventListener('click', () => {
      const keepLang = lang; settings = Object.assign({}, DEFAULT_SETTINGS, { lang: keepLang });
      store.set('settings', settings); loadSettingsIntoForm(); applyTheme();
      if (!running) { remaining = durationFor(mode); totalSeconds = remaining; renderTime(); }
      refreshAmbient(); renderGoal(); toast(t('toast.settingsReset'));
    });
    $('#resetStats').addEventListener('click', () => {
      if (!confirm(t('confirm.resetStats'))) return;
      stats = { history: {}, total: 0, bestStreak: 0, sessions: [], achievements: [] }; store.set('stats', stats); renderStats(); renderGoal(); toast(t('toast.statsCleared'));
    });
    $('#monthPrev').addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() - 1); renderMonth(); });
    $('#monthNext').addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() + 1); renderMonth(); });
    $('#exportBtn').addEventListener('click', exportData);
    $('#importBtn').addEventListener('click', () => $('#importFile').click());
    $('#importFile').addEventListener('change', (e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ''; });

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); toggleTimer(); persistRuntime(); }
      if (e.key.toLowerCase() === 's') skipSession();
      if (e.key.toLowerCase() === 'r') resetCurrent();
      if (e.key.toLowerCase() === 'z') toggleZen();
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        if (running && endTimestamp) {
          remaining = (endTimestamp - Date.now()) / 1000;
          if (remaining <= 0) { remaining = 0; renderTime(); completeSession(); } else renderTime();
          requestWakeLock();
        }
      }
    });
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', () => { if (settings.appearance === 'auto') applyTheme(); });
    }
    window.addEventListener('resize', () => { if (parts.length) sizeConfetti(); });
    window.addEventListener('beforeunload', persistRuntime);
    setInterval(persistRuntime, 5000);
  }

  // ---------- Init ----------
  function init() {
    estValEl.textContent = estNew;
    syncAchievements();
    restoreRuntime();
    applyTheme();
    setMode(mode, { reset: false });
    applyI18n();
    renderControls();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    wireEvents();

    // Handle PWA shortcuts (?action=focus|stats)
    try {
      const action = new URLSearchParams(location.search).get('action');
      if (action === 'focus' && !running) { ensureAudio(); startTimer(); persistRuntime(); }
      else if (action === 'stats') { renderStats(); $('#statsModal').hidden = false; }
    } catch {}
  }
  document.addEventListener('DOMContentLoaded', init);
})();
