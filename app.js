const STORAGE_KEY = "croakle-data";

const moodOptions = [
  { key: "great", icon: "😄", label: "Great", score: 5 },
  { key: "good", icon: "🙂", label: "Good", score: 4 },
  { key: "okay", icon: "😐", label: "Okay", score: 3 },
  { key: "low", icon: "😔", label: "Low", score: 2 },
  { key: "tired", icon: "😴", label: "Tired", score: 2 },
  { key: "stressed", icon: "😣", label: "Stressed", score: 1 }
];

const sampleState = {
  habits: [
    { id: "sample-habit-1", name: "Morning reset 10 นาที", frequency: "daily", logs: [] },
    { id: "sample-habit-2", name: "ดื่มน้ำหลังตื่นนอน", frequency: "daily", logs: [] },
    { id: "sample-habit-3", name: "อ่านหนังสือ 20 นาที", frequency: "daily", logs: [] },
    { id: "sample-habit-4", name: "เดินหรือยืดตัว 15 นาที", frequency: "daily", logs: [] },
    { id: "sample-habit-5", name: "Review dashboard ก่อนนอน", frequency: "daily", logs: [] },
    { id: "sample-habit-6", name: "Weekly planning", frequency: "weekly", logs: [] }
  ],
  moods: [],
  projects: [
    { id: "sample-project-1", name: "Croakle MVP", description: "สร้าง life dashboard สำหรับจัดการ habit, mood, project, course และ export data", status: "active", progress: 45 },
    { id: "sample-project-2", name: "Personal System Cleanup", description: "จัดระบบงาน ชีวิต และคอร์สที่กำลังเรียนให้อยู่ในที่เดียว", status: "active", progress: 25 },
    { id: "sample-project-3", name: "Monthly Review Template", description: "ทำ template สำหรับสรุปเดือน เป้าหมาย และสิ่งที่ต้องปรับปรุง", status: "waiting", progress: 10 }
  ],
  courses: [
    { id: "sample-course-1", name: "Frontend Polish", platform: "Self Study", progress: 60 },
    { id: "sample-course-2", name: "Productivity System", platform: "Croakle Lab", progress: 35 },
    { id: "sample-course-3", name: "UX/UI Dashboard Design", platform: "Design Practice", progress: 42 }
  ]
};

const defaultState = {
  habits: [],
  moods: [],
  projects: [],
  courses: []
};

let state = loadState();
let selectedMoodKey = "good";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(sampleState);
    return normalizeState(JSON.parse(raw));
  } catch {
    return structuredClone(sampleState);
  }
}

function normalizeState(savedState) {
  const mergedState = { ...structuredClone(defaultState), ...savedState };
  return {
    habits: mergeMissingSamples(mergedState.habits, sampleState.habits),
    moods: Array.isArray(mergedState.moods) ? mergedState.moods : [],
    projects: mergeMissingSamples(mergedState.projects, sampleState.projects),
    courses: mergeMissingSamples(mergedState.courses, sampleState.courses)
  };
}

function mergeMissingSamples(currentItems = [], sampleItems = []) {
  const currentIds = new Set(currentItems.map(item => item.id));
  const missingSamples = sampleItems.filter(item => !currentIds.has(item.id));
  return [...currentItems, ...structuredClone(missingSamples)];
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function getMoodOption(key) {
  return moodOptions.find(option => option.key === key) || moodOptions[1];
}

function isHabitDoneToday(habit) {
  return Array.isArray(habit.logs) && habit.logs.includes(todayKey());
}

function getTodayScore() {
  if (!state.habits.length) return 0;
  const done = state.habits.filter(isHabitDoneToday).length;
  return Math.round((done / state.habits.length) * 100);
}

function renderOverview() {
  const score = getTodayScore();
  const doneToday = state.habits.filter(isHabitDoneToday).length;
  const orb = document.querySelector(".wordjar-progress-orb");

  setText("habitCount", state.habits.length);
  setText("moodCount", state.moods.length);
  setText("projectCount", state.projects.length);
  setText("doneTodayCount", doneToday);
  setText("todayScore", `${score}%`);
  if (orb) orb.style.setProperty("--wordjar-score", score);

  renderList("todayHabitList", state.habits.slice(0, 4), renderHabitCard);
  renderList("recentMoodList", getSortedMoods().slice(0, 4), renderMoodCard);
  renderList("habitList", state.habits, renderHabitCard);
  renderList("projectList", state.projects, renderProjectCard);
  renderList("courseList", state.courses, renderCourseCard);
  renderMoodTracker();
}

function renderMoodTracker() {
  renderMoodChoices();
  renderList("moodHistoryList", getSortedMoods(), renderMoodCard);
  setText("moodAverage", getMoodAverageText());
  setText("moodStreak", `${getMoodStreak()}d`);
  setText("topMood", getTopMoodText());
  setText("todayMood", getTodayMoodText());
}

function renderMoodChoices() {
  const list = document.getElementById("moodChoiceList");
  if (!list) return;
  list.innerHTML = moodOptions.map(option => `
    <button class="wordjar-mood-choice ${option.key === selectedMoodKey ? "is-selected" : ""}" type="button" data-action="select-mood" data-mood="${option.key}" role="radio" aria-checked="${option.key === selectedMoodKey}">
      <span>${option.icon}</span>${option.label}
    </button>
  `).join("");
}

function renderList(id, items, renderItem) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.length ? items.map(renderItem).join("") : `<p class="wordjar-empty-text">ยังไม่มีข้อมูล</p>`;
}

function renderHabitCard(habit) {
  const done = isHabitDoneToday(habit);
  return `
    <button class="wordjar-list-card ${done ? "is-done" : ""}" data-action="toggle-habit" data-id="${habit.id}" type="button">
      <span>${done ? "✓" : "◦"}</span>
      <div><h4>${escapeHtml(habit.name)}</h4><p>${escapeHtml(habit.frequency || "daily")}</p></div>
    </button>
  `;
}

function renderProjectCard(project) {
  return `
    <div class="wordjar-project-card">
      <div><h4>${escapeHtml(project.name)}</h4><p>${escapeHtml(project.description || project.status || "active")}</p></div>
      <strong>${clampPercent(project.progress)}%</strong>
    </div>
  `;
}

function renderCourseCard(course) {
  const progress = clampPercent(course.progress);
  return `
    <div class="wordjar-course-row">
      <span>${escapeHtml(course.name)}</span>
      <div class="wordjar-progress-track"><i class="wordjar-progress-fill wordjar-progress-${progress}"></i></div>
      <b>${progress}%</b>
    </div>
  `;
}

function renderMoodCard(entry) {
  const mood = getMoodOption(entry.mood);
  const tags = entry.tags ? `<p class="wordjar-mood-tags">${escapeHtml(entry.tags)}</p>` : "";
  const note = entry.note ? `<p>${escapeHtml(entry.note)}</p>` : "";
  return `
    <article class="wordjar-mood-card">
      <div class="wordjar-mood-card-main">
        <span class="wordjar-mood-icon">${mood.icon}</span>
        <div>
          <h4>${formatDate(entry.date)} · ${mood.label}</h4>
          <p>Energy ${entry.energy}/10 · Stress ${entry.stress}/10 · Sleep ${entry.sleep}/10</p>
          ${tags}${note}
        </div>
      </div>
      <strong class="wordjar-mood-score">${mood.score}/5</strong>
    </article>
  `;
}

function getSortedMoods() {
  return [...state.moods].sort((a, b) => b.date.localeCompare(a.date));
}

function getMoodAverageText() {
  const lastSeven = getSortedMoods().slice(0, 7);
  if (!lastSeven.length) return "-";
  const average = lastSeven.reduce((sum, item) => sum + getMoodOption(item.mood).score, 0) / lastSeven.length;
  return average.toFixed(1);
}

function getMoodStreak() {
  const dateSet = new Set(state.moods.map(item => item.date));
  let count = 0;
  const cursor = new Date(todayKey());

  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
}

function getTopMoodText() {
  if (!state.moods.length) return "-";
  const countMap = state.moods.reduce((map, item) => {
    map[item.mood] = (map[item.mood] || 0) + 1;
    return map;
  }, {});
  const topKey = Object.entries(countMap).sort((a, b) => b[1] - a[1])[0][0];
  const top = getMoodOption(topKey);
  return `${top.icon} ${top.label}`;
}

function getTodayMoodText() {
  const entry = state.moods.find(item => item.date === todayKey());
  if (!entry) return "-";
  const mood = getMoodOption(entry.mood);
  return `${mood.icon} ${mood.label}`;
}

function clampPercent(value) {
  const number = Number(value || 0);
  return Math.max(0, Math.min(100, Math.round(number)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function switchView(viewId) {
  document.querySelectorAll(".wordjar-view").forEach(view => view.classList.remove("is-active"));
  document.getElementById(viewId)?.classList.add("is-active");
  document.querySelectorAll(".wordjar-nav-item").forEach(btn => btn.classList.remove("is-active"));
  document.querySelector(`[data-view="${viewId}"]`)?.classList.add("is-active");
}

function initNav() {
  document.querySelectorAll(".wordjar-nav-item").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
}

function initForms() {
  bindForm("habitForm", data => {
    state.habits.push({ id: crypto.randomUUID(), name: data.get("name"), frequency: data.get("frequency"), logs: [] });
  });

  bindForm("projectForm", data => {
    state.projects.push({ id: crypto.randomUUID(), name: data.get("name"), description: data.get("description"), status: "active", progress: clampPercent(data.get("progress")) });
  });

  bindForm("courseForm", data => {
    state.courses.push({ id: crypto.randomUUID(), name: data.get("name"), platform: data.get("platform"), progress: clampPercent(data.get("progress")) });
  });

  bindForm("moodForm", saveMoodFromForm, false);
}

function bindForm(id, onSubmit, shouldReset = true) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    onSubmit(new FormData(form), form);
    saveState();
    renderOverview();
    if (shouldReset) form.reset();
  });
}

function saveMoodFromForm(data, form) {
  const date = data.get("date") || todayKey();
  const entry = {
    id: `mood-${date}`,
    date,
    mood: selectedMoodKey,
    energy: Number(data.get("energy") || 5),
    stress: Number(data.get("stress") || 5),
    sleep: Number(data.get("sleep") || 5),
    tags: String(data.get("tags") || "").trim(),
    note: String(data.get("note") || "").trim(),
    updatedAt: new Date().toISOString()
  };
  state.moods = state.moods.filter(item => item.date !== date).concat(entry);
  if (form) form.note.value = "";
}

function initActions() {
  document.addEventListener("click", event => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;

    if (actionTarget.dataset.action === "toggle-habit") toggleHabit(actionTarget.dataset.id);
    if (actionTarget.dataset.action === "select-mood") selectMood(actionTarget.dataset.mood);
    if (actionTarget.dataset.action === "close-dialog") document.getElementById("quickAddDialog")?.close();
  });
}

function toggleHabit(id) {
  const habit = state.habits.find(item => item.id === id);
  if (!habit) return;
  const today = todayKey();
  habit.logs = Array.isArray(habit.logs) ? habit.logs : [];
  habit.logs = habit.logs.includes(today) ? habit.logs.filter(date => date !== today) : [...habit.logs, today];
  saveState();
  renderOverview();
}

function selectMood(key) {
  selectedMoodKey = key;
  renderMoodChoices();
}

function initMoodForm() {
  const form = document.getElementById("moodForm");
  if (!form) return;
  form.date.value = todayKey();
  bindRangeValue(form.energy, "energyValue");
  bindRangeValue(form.stress, "stressValue");
  bindRangeValue(form.sleep, "sleepValue");
}

function bindRangeValue(input, labelId) {
  const label = document.getElementById(labelId);
  if (!input || !label) return;
  input.addEventListener("input", () => label.textContent = input.value);
}

function initQuickAdd() {
  const dialog = document.getElementById("quickAddDialog");
  const btn = document.getElementById("quickAddButton");
  const form = document.getElementById("quickAddForm");
  if (!dialog || !btn || !form) return;

  btn.addEventListener("click", () => dialog.showModal());
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const type = data.get("type");
    const name = data.get("name");
    if (!name) return;

    if (type === "habit") state.habits.push({ id: crypto.randomUUID(), name, frequency: "daily", logs: [] });
    if (type === "mood") state.moods = state.moods.filter(item => item.date !== todayKey()).concat(createQuickMood(name));
    if (type === "project") state.projects.push({ id: crypto.randomUUID(), name, description: "Quick add", status: "active", progress: 0 });
    if (type === "course") state.courses.push({ id: crypto.randomUUID(), name, platform: "Quick add", progress: 0 });

    saveState();
    renderOverview();
    dialog.close();
    form.reset();
  });
}

function createQuickMood(note) {
  return {
    id: `mood-${todayKey()}`,
    date: todayKey(),
    mood: selectedMoodKey,
    energy: 5,
    stress: 5,
    sleep: 5,
    tags: "quick-add",
    note,
    updatedAt: new Date().toISOString()
  };
}

function initExport() {
  const exportJsonBtn = document.getElementById("exportJsonButton");
  const exportCsvBtn = document.getElementById("exportCsvButton");
  const importInput = document.getElementById("importJsonInput");
  const preview = document.getElementById("dataPreview");
  const resetBtn = document.getElementById("resetButton");

  if (exportJsonBtn) exportJsonBtn.addEventListener("click", () => downloadData("croakle-data.json", JSON.stringify(state, null, 2), "application/json", preview));
  if (exportCsvBtn) exportCsvBtn.addEventListener("click", () => downloadData("croakle-mood.csv", buildMoodCsv(), "text/csv", preview));
  if (importInput) importInput.addEventListener("change", importJson);
  if (resetBtn) resetBtn.addEventListener("click", resetData);
}

function downloadData(filename, content, type, preview) {
  if (preview) preview.value = content;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildMoodCsv() {
  const headers = ["date", "mood", "score", "energy", "stress", "sleep", "tags", "note"];
  const rows = getSortedMoods().map(entry => {
    const mood = getMoodOption(entry.mood);
    return [entry.date, mood.label, mood.score, entry.energy, entry.stress, entry.sleep, entry.tags, entry.note].map(csvCell).join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}

function csvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = normalizeState(JSON.parse(reader.result));
      saveState();
      renderOverview();
    } catch {
      alert("Invalid JSON");
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm("Reset all data?")) return;
  state = structuredClone(sampleState);
  saveState();
  renderOverview();
}

function initDateLabel() {
  setText("todayLabel", new Intl.DateTimeFormat("th-TH", { weekday: "long", day: "numeric", month: "short" }).format(new Date()));
}

function initProgressStyles() {
  if (document.getElementById("wordjar-progress-style")) return;
  const style = document.createElement("style");
  style.id = "wordjar-progress-style";
  style.textContent = Array.from({ length: 101 }, (_, index) => `.wordjar-progress-${index}{--wordjar-progress:${index};}`).join("");
  document.head.appendChild(style);
}

function init() {
  saveState();
  initProgressStyles();
  initDateLabel();
  initMoodForm();
  renderOverview();
  initNav();
  initForms();
  initActions();
  initQuickAdd();
  initExport();
}

init();
