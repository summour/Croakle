const CROAKLE_STORAGE_KEY = "croakle-data";

const croakleMoodOptions = [
  { key: "terrible", icon: "☹", label: "Terrible", score: 1 },
  { key: "sad", icon: "⌄", label: "Sad", score: 2 },
  { key: "okay", icon: "–", label: "Okay", score: 3 },
  { key: "good", icon: "◡", label: "Good", score: 4 },
  { key: "excellent", icon: "●", label: "Excellent", score: 5 }
];

const croakleSampleState = {
  habits: [
    { id: "sample-habit-1", name: "Morning reset 10 นาที", frequency: "daily", logs: [] },
    { id: "sample-habit-2", name: "ดื่มน้ำหลังตื่นนอน", frequency: "daily", logs: [] },
    { id: "sample-habit-3", name: "อ่านหนังสือ 20 นาที", frequency: "daily", logs: [] },
    { id: "sample-habit-4", name: "เดินหรือยืดตัว 15 นาที", frequency: "daily", logs: [] },
    { id: "sample-habit-5", name: "Review dashboard ก่อนนอน", frequency: "daily", logs: [] }
  ],
  moods: [],
  projects: [
    { id: "sample-project-1", name: "Croakle MVP", description: "Habit, mood, project, course และ export data", status: "active", progress: 45 },
    { id: "sample-project-2", name: "Monthly Review Template", description: "ทำ template สำหรับสรุปเดือน", status: "waiting", progress: 10 }
  ],
  courses: [
    { id: "sample-course-1", name: "Frontend Polish", platform: "Self Study", progress: 60 },
    { id: "sample-course-2", name: "UX/UI Dashboard Design", platform: "Design Practice", progress: 42 }
  ]
};

const croakleEmptyState = { habits: [], moods: [], projects: [], courses: [] };
let croakleState = croakleLoadState();
let croakleSelectedMoodKey = "good";
let croakleMonthKey = croakleGetCurrentMonthKey();

function croakleLoadState() {
  try {
    const raw = localStorage.getItem(CROAKLE_STORAGE_KEY);
    if (!raw) return structuredClone(croakleSampleState);
    return croakleNormalizeState(JSON.parse(raw));
  } catch {
    return structuredClone(croakleSampleState);
  }
}

function croakleNormalizeState(savedState) {
  const mergedState = { ...structuredClone(croakleEmptyState), ...savedState };
  return {
    habits: croakleMergeMissingSamples(mergedState.habits, croakleSampleState.habits),
    moods: Array.isArray(mergedState.moods) ? mergedState.moods : [],
    projects: croakleMergeMissingSamples(mergedState.projects, croakleSampleState.projects),
    courses: croakleMergeMissingSamples(mergedState.courses, croakleSampleState.courses)
  };
}

function croakleMergeMissingSamples(currentItems = [], sampleItems = []) {
  const currentIds = new Set(currentItems.map(item => item.id));
  return [...currentItems, ...structuredClone(sampleItems.filter(item => !currentIds.has(item.id)))];
}

function croakleSaveState() {
  localStorage.setItem(CROAKLE_STORAGE_KEY, JSON.stringify(croakleState));
}

function croakleTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function croakleGetCurrentMonthKey() {
  return croakleTodayKey().slice(0, 7);
}

function croakleGetDaysInMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function croakleGetDateKey(monthKey, day) {
  return `${monthKey}-${String(day).padStart(2, "0")}`;
}

function croakleFormatDate(value) {
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function croakleGetMoodOption(key) {
  return croakleMoodOptions.find(option => option.key === key) || croakleMoodOptions[3];
}

function croakleGetMoodByScore(score) {
  return croakleMoodOptions.find(option => option.score === Number(score)) || croakleMoodOptions[2];
}

function croakleFindMoodByDate(date) {
  return croakleState.moods.find(item => item.date === date);
}

function croakleIsHabitDoneOnDate(habit, date) {
  return Array.isArray(habit.logs) && habit.logs.includes(date);
}

function croakleIsHabitDoneToday(habit) {
  return croakleIsHabitDoneOnDate(habit, croakleTodayKey());
}

function croakleGetTodayScore() {
  if (!croakleState.habits.length) return 0;
  const done = croakleState.habits.filter(croakleIsHabitDoneToday).length;
  return Math.round((done / croakleState.habits.length) * 100);
}

function croakleRenderOverview() {
  const score = croakleGetTodayScore();
  const doneToday = croakleState.habits.filter(croakleIsHabitDoneToday).length;
  const orb = document.querySelector(".wordjar-progress-orb");

  croakleSetText("habitCount", croakleState.habits.length);
  croakleSetText("moodCount", croakleState.moods.length);
  croakleSetText("projectCount", croakleState.projects.length);
  croakleSetText("doneTodayCount", doneToday);
  croakleSetText("todayScore", `${score}%`);
  if (orb) orb.style.setProperty("--wordjar-score", score);

  croakleRenderList("todayHabitList", croakleState.habits.slice(0, 4), croakleRenderHabitCard);
  croakleRenderList("recentMoodList", croakleGetSortedMoods().slice(0, 4), croakleRenderMoodCard);
  croakleRenderList("habitList", croakleState.habits, croakleRenderHabitCard);
  croakleRenderList("projectList", croakleState.projects, croakleRenderProjectCard);
  croakleRenderList("courseList", croakleState.courses, croakleRenderCourseCard);
  croakleRenderMoodTracker();
  croakleRenderMonthlyTracker();
}

function croakleRenderMoodTracker() {
  croakleRenderMoodChoices();
  croakleRenderList("moodHistoryList", croakleGetSortedMoods(), croakleRenderMoodCard);
  croakleSetText("moodAverage", croakleGetMoodAverageText());
  croakleSetText("moodStreak", `${croakleGetMoodStreak()}d`);
  croakleSetText("topMood", croakleGetTopMoodText());
  croakleSetText("todayMood", croakleGetTodayMoodText());
}

function croakleRenderMoodChoices() {
  const list = document.getElementById("moodChoiceList");
  if (!list) return;
  list.innerHTML = croakleMoodOptions.map(option => `
    <button class="wordjar-mood-choice ${option.key === croakleSelectedMoodKey ? "is-selected" : ""}" type="button" data-action="select-mood" data-mood="${option.key}" role="radio" aria-checked="${option.key === croakleSelectedMoodKey}">
      <span>${option.icon}</span>${option.score} · ${option.label}
    </button>
  `).join("");
}

function croakleRenderList(id, items, renderItem) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.length ? items.map(renderItem).join("") : `<p class="wordjar-empty-text">ยังไม่มีข้อมูล</p>`;
}

function croakleRenderHabitCard(habit) {
  const done = croakleIsHabitDoneToday(habit);
  return `
    <button class="wordjar-list-card ${done ? "is-done" : ""}" data-action="toggle-habit" data-id="${habit.id}" type="button">
      <span>${done ? "✓" : "◦"}</span>
      <div><h4>${croakleEscapeHtml(habit.name)}</h4><p>${croakleEscapeHtml(habit.frequency || "daily")}</p></div>
    </button>
  `;
}

function croakleRenderProjectCard(project) {
  return `
    <div class="wordjar-project-card">
      <div><h4>${croakleEscapeHtml(project.name)}</h4><p>${croakleEscapeHtml(project.description || project.status || "active")}</p></div>
      <strong>${croakleClampPercent(project.progress)}%</strong>
    </div>
  `;
}

function croakleRenderCourseCard(course) {
  const progress = croakleClampPercent(course.progress);
  return `
    <div class="wordjar-course-row">
      <span>${croakleEscapeHtml(course.name)}</span>
      <div class="wordjar-progress-track"><i class="wordjar-progress-fill wordjar-progress-${progress}"></i></div>
      <b>${progress}%</b>
    </div>
  `;
}

function croakleRenderMoodCard(entry) {
  const mood = croakleGetMoodOption(entry.mood);
  const tags = entry.tags ? `<p class="wordjar-mood-tags">${croakleEscapeHtml(entry.tags)}</p>` : "";
  const note = entry.note ? `<p>${croakleEscapeHtml(entry.note)}</p>` : "";
  return `
    <article class="wordjar-mood-card">
      <div class="wordjar-mood-card-main">
        <span class="wordjar-mood-icon">${mood.icon}</span>
        <div>
          <h4>${croakleFormatDate(entry.date)} · ${mood.label}</h4>
          <p>Energy ${entry.energy}/10 · Stress ${entry.stress}/10 · Sleep ${entry.sleep}/10</p>
          ${tags}${note}
        </div>
      </div>
      <strong class="wordjar-mood-score">${mood.score}/5</strong>
    </article>
  `;
}

function croakleRenderMonthlyTracker() {
  const monthInput = document.getElementById("monthPicker");
  if (monthInput && monthInput.value !== croakleMonthKey) monthInput.value = croakleMonthKey;
  croakleRenderMonthlyHabitTable();
  croakleRenderMonthlyMoodTable();
  croakleRenderMonthlySummary();
  croakleRenderMoodChart();
}

function croakleRenderMonthlyHabitTable() {
  const table = document.getElementById("monthlyHabitTable");
  if (!table) return;
  const days = croakleBuildDays();
  const header = `<tr><th>Habit</th>${days.map(day => `<th>${day}</th>`).join("")}<th>Sum</th></tr>`;
  const rows = croakleState.habits.map(habit => {
    const cells = days.map(day => {
      const date = croakleGetDateKey(croakleMonthKey, day);
      const active = croakleIsHabitDoneOnDate(habit, date);
      return `<td><button class="CroakleTrackerButton" data-action="toggle-habit-date" data-id="${habit.id}" data-date="${date}" data-active="${active}" type="button">${active ? "✓" : ""}</button></td>`;
    }).join("");
    const done = days.filter(day => croakleIsHabitDoneOnDate(habit, croakleGetDateKey(croakleMonthKey, day))).length;
    return `<tr><td><strong>${croakleEscapeHtml(habit.name)}</strong></td>${cells}<td>${done}/${days.length}</td></tr>`;
  }).join("");
  table.innerHTML = `<thead>${header}</thead><tbody>${rows}</tbody>`;
}

function croakleRenderMonthlyMoodTable() {
  const table = document.getElementById("monthlyMoodTable");
  if (!table) return;
  const days = croakleBuildDays();
  const cells = days.map(day => {
    const date = croakleGetDateKey(croakleMonthKey, day);
    const entry = croakleFindMoodByDate(date);
    const mood = entry ? croakleGetMoodOption(entry.mood) : null;
    return `<td><button class="CroakleTrackerButton CroakleMoodButton" data-action="cycle-mood-date" data-date="${date}" data-active="${Boolean(entry)}" type="button">${mood ? mood.score : "–"}</button></td>`;
  }).join("");
  table.innerHTML = `<thead><tr><th>Mood</th>${days.map(day => `<th>${day}</th>`).join("")}</tr></thead><tbody><tr><td><strong>Score</strong></td>${cells}</tr></tbody>`;
}

function croakleRenderMonthlySummary() {
  const days = croakleBuildDays();
  const totalHabitCells = croakleState.habits.length * days.length;
  const completedHabitCells = croakleState.habits.reduce((sum, habit) => sum + days.filter(day => croakleIsHabitDoneOnDate(habit, croakleGetDateKey(croakleMonthKey, day))).length, 0);
  const moodEntries = days.map(day => croakleFindMoodByDate(croakleGetDateKey(croakleMonthKey, day))).filter(Boolean);
  const moodAverage = moodEntries.length ? (moodEntries.reduce((sum, entry) => sum + croakleGetMoodOption(entry.mood).score, 0) / moodEntries.length).toFixed(1) : "-";
  const productivity = totalHabitCells ? Math.round((completedHabitCells / totalHabitCells) * 100) : 0;

  croakleSetText("monthlyHabitDone", `${completedHabitCells}/${totalHabitCells}`);
  croakleSetText("monthlyProductivity", `${productivity}%`);
  croakleSetText("monthlyMoodAverage", moodAverage);
}

function croakleRenderMoodChart() {
  const chart = document.getElementById("moodLineChart");
  if (!chart) return;
  const days = croakleBuildDays();
  const points = days.map(day => {
    const entry = croakleFindMoodByDate(croakleGetDateKey(croakleMonthKey, day));
    return { day, score: entry ? croakleGetMoodOption(entry.mood).score : null };
  }).filter(point => point.score !== null);

  if (points.length < 2) {
    chart.innerHTML = `<p class="wordjar-empty-text">ใส่ mood อย่างน้อย 2 วันเพื่อแสดงกราฟ</p>`;
    return;
  }

  const width = 640;
  const height = 180;
  const padding = 26;
  const maxDay = days.length;
  const path = points.map((point, index) => {
    const x = padding + ((point.day - 1) / (maxDay - 1)) * (width - padding * 2);
    const y = padding + ((5 - point.score) / 4) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly mood line chart">
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="var(--CroakleChartGrid)" />
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--CroakleChartGrid)" />
      <path d="${path}" fill="none" stroke="var(--CroakleChartLine)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      ${points.map(point => {
        const x = padding + ((point.day - 1) / (maxDay - 1)) * (width - padding * 2);
        const y = padding + ((5 - point.score) / 4) * (height - padding * 2);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="var(--CroakleChartLine)" />`;
      }).join("")}
    </svg>
  `;
}

function croakleBuildDays() {
  return Array.from({ length: croakleGetDaysInMonth(croakleMonthKey) }, (_, index) => index + 1);
}

function croakleCycleMoodDate(date) {
  const current = croakleFindMoodByDate(date);
  const currentScore = current ? croakleGetMoodOption(current.mood).score : 0;
  const nextMood = croakleGetMoodByScore((currentScore % 5) + 1);
  const nextEntry = {
    id: `mood-${date}`,
    date,
    mood: nextMood.key,
    energy: current?.energy || 5,
    stress: current?.stress || 5,
    sleep: current?.sleep || 5,
    tags: current?.tags || "sheet-style",
    note: current?.note || "",
    updatedAt: new Date().toISOString()
  };
  croakleState.moods = croakleState.moods.filter(item => item.date !== date).concat(nextEntry);
  croakleSaveState();
  croakleRenderOverview();
}

function croakleGetSortedMoods() {
  return [...croakleState.moods].sort((a, b) => b.date.localeCompare(a.date));
}

function croakleGetMoodAverageText() {
  const lastSeven = croakleGetSortedMoods().slice(0, 7);
  if (!lastSeven.length) return "-";
  const average = lastSeven.reduce((sum, item) => sum + croakleGetMoodOption(item.mood).score, 0) / lastSeven.length;
  return average.toFixed(1);
}

function croakleGetMoodStreak() {
  const dateSet = new Set(croakleState.moods.map(item => item.date));
  let count = 0;
  const cursor = new Date(croakleTodayKey());
  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function croakleGetTopMoodText() {
  if (!croakleState.moods.length) return "-";
  const countMap = croakleState.moods.reduce((map, item) => {
    map[item.mood] = (map[item.mood] || 0) + 1;
    return map;
  }, {});
  const topKey = Object.entries(countMap).sort((a, b) => b[1] - a[1])[0][0];
  const top = croakleGetMoodOption(topKey);
  return `${top.icon} ${top.label}`;
}

function croakleGetTodayMoodText() {
  const entry = croakleFindMoodByDate(croakleTodayKey());
  if (!entry) return "-";
  const mood = croakleGetMoodOption(entry.mood);
  return `${mood.icon} ${mood.label}`;
}

function croakleClampPercent(value) {
  const number = Number(value || 0);
  return Math.max(0, Math.min(100, Math.round(number)));
}

function croakleEscapeHtml(value) {
  return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function croakleSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function croakleSwitchView(viewId) {
  document.querySelectorAll(".wordjar-view").forEach(view => view.classList.remove("is-active"));
  document.getElementById(viewId)?.classList.add("is-active");
  document.querySelectorAll(".wordjar-nav-item").forEach(btn => btn.classList.remove("is-active"));
  document.querySelector(`[data-view="${viewId}"]`)?.classList.add("is-active");
}

function croakleInitNav() {
  document.querySelectorAll(".wordjar-nav-item").forEach(btn => {
    btn.addEventListener("click", () => croakleSwitchView(btn.dataset.view));
  });
}

function croakleInitForms() {
  croakleBindForm("habitForm", data => {
    croakleState.habits.push({ id: crypto.randomUUID(), name: data.get("name"), frequency: data.get("frequency"), logs: [] });
  });
  croakleBindForm("projectForm", data => {
    croakleState.projects.push({ id: crypto.randomUUID(), name: data.get("name"), description: data.get("description"), status: "active", progress: croakleClampPercent(data.get("progress")) });
  });
  croakleBindForm("courseForm", data => {
    croakleState.courses.push({ id: crypto.randomUUID(), name: data.get("name"), platform: data.get("platform"), progress: croakleClampPercent(data.get("progress")) });
  });
  croakleBindForm("moodForm", croakleSaveMoodFromForm, false);
}

function croakleBindForm(id, onSubmit, shouldReset = true) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    onSubmit(new FormData(form), form);
    croakleSaveState();
    croakleRenderOverview();
    if (shouldReset) form.reset();
  });
}

function croakleSaveMoodFromForm(data, form) {
  const date = data.get("date") || croakleTodayKey();
  const entry = {
    id: `mood-${date}`,
    date,
    mood: croakleSelectedMoodKey,
    energy: Number(data.get("energy") || 5),
    stress: Number(data.get("stress") || 5),
    sleep: Number(data.get("sleep") || 5),
    tags: String(data.get("tags") || "").trim(),
    note: String(data.get("note") || "").trim(),
    updatedAt: new Date().toISOString()
  };
  croakleState.moods = croakleState.moods.filter(item => item.date !== date).concat(entry);
  if (form) form.note.value = "";
}

function croakleInitActions() {
  document.addEventListener("click", event => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;
    const action = actionTarget.dataset.action;
    if (action === "toggle-habit") croakleToggleHabit(actionTarget.dataset.id, croakleTodayKey());
    if (action === "toggle-habit-date") croakleToggleHabit(actionTarget.dataset.id, actionTarget.dataset.date);
    if (action === "cycle-mood-date") croakleCycleMoodDate(actionTarget.dataset.date);
    if (action === "select-mood") croakleSelectMood(actionTarget.dataset.mood);
    if (action === "close-dialog") document.getElementById("quickAddDialog")?.close();
  });
}

function croakleToggleHabit(id, date) {
  const habit = croakleState.habits.find(item => item.id === id);
  if (!habit) return;
  habit.logs = Array.isArray(habit.logs) ? habit.logs : [];
  habit.logs = habit.logs.includes(date) ? habit.logs.filter(item => item !== date) : [...habit.logs, date];
  croakleSaveState();
  croakleRenderOverview();
}

function croakleSelectMood(key) {
  croakleSelectedMoodKey = key;
  croakleRenderMoodChoices();
}

function croakleInitMoodForm() {
  const form = document.getElementById("moodForm");
  if (!form) return;
  form.date.value = croakleTodayKey();
  croakleBindRangeValue(form.energy, "energyValue");
  croakleBindRangeValue(form.stress, "stressValue");
  croakleBindRangeValue(form.sleep, "sleepValue");
}

function croakleBindRangeValue(input, labelId) {
  const label = document.getElementById(labelId);
  if (!input || !label) return;
  input.addEventListener("input", () => label.textContent = input.value);
}

function croakleInitMonthPicker() {
  const monthInput = document.getElementById("monthPicker");
  if (!monthInput) return;
  monthInput.value = croakleMonthKey;
  monthInput.addEventListener("change", () => {
    croakleMonthKey = monthInput.value || croakleGetCurrentMonthKey();
    croakleRenderMonthlyTracker();
  });
}

function croakleInitQuickAdd() {
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
    if (type === "habit") croakleState.habits.push({ id: crypto.randomUUID(), name, frequency: "daily", logs: [] });
    if (type === "mood") croakleState.moods = croakleState.moods.filter(item => item.date !== croakleTodayKey()).concat(croakleCreateQuickMood(name));
    if (type === "project") croakleState.projects.push({ id: crypto.randomUUID(), name, description: "Quick add", status: "active", progress: 0 });
    if (type === "course") croakleState.courses.push({ id: crypto.randomUUID(), name, platform: "Quick add", progress: 0 });
    croakleSaveState();
    croakleRenderOverview();
    dialog.close();
    form.reset();
  });
}

function croakleCreateQuickMood(note) {
  return { id: `mood-${croakleTodayKey()}`, date: croakleTodayKey(), mood: croakleSelectedMoodKey, energy: 5, stress: 5, sleep: 5, tags: "quick-add", note, updatedAt: new Date().toISOString() };
}

function croakleInitExport() {
  const exportJsonBtn = document.getElementById("exportJsonButton");
  const exportCsvBtn = document.getElementById("exportCsvButton");
  const importInput = document.getElementById("importJsonInput");
  const preview = document.getElementById("dataPreview");
  const resetBtn = document.getElementById("resetButton");
  if (exportJsonBtn) exportJsonBtn.addEventListener("click", () => croakleDownloadData("croakle-data.json", JSON.stringify(croakleState, null, 2), "application/json", preview));
  if (exportCsvBtn) exportCsvBtn.addEventListener("click", () => croakleDownloadData("croakle-mood.csv", croakleBuildMoodCsv(), "text/csv", preview));
  if (importInput) importInput.addEventListener("change", croakleImportJson);
  if (resetBtn) resetBtn.addEventListener("click", croakleResetData);
}

function croakleDownloadData(filename, content, type, preview) {
  if (preview) preview.value = content;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function croakleBuildMoodCsv() {
  const headers = ["date", "mood", "score", "energy", "stress", "sleep", "tags", "note"];
  const rows = croakleGetSortedMoods().map(entry => {
    const mood = croakleGetMoodOption(entry.mood);
    return [entry.date, mood.label, mood.score, entry.energy, entry.stress, entry.sleep, entry.tags, entry.note].map(croakleCsvCell).join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}

function croakleCsvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

function croakleImportJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      croakleState = croakleNormalizeState(JSON.parse(reader.result));
      croakleSaveState();
      croakleRenderOverview();
    } catch {
      alert("Invalid JSON");
    }
  };
  reader.readAsText(file);
}

function croakleResetData() {
  if (!confirm("Reset all data?")) return;
  croakleState = structuredClone(croakleSampleState);
  croakleSaveState();
  croakleRenderOverview();
}

function croakleInitDateLabel() {
  croakleSetText("todayLabel", new Intl.DateTimeFormat("th-TH", { weekday: "long", day: "numeric", month: "short" }).format(new Date()));
}

function croakleInitProgressStyles() {
  if (document.getElementById("wordjar-progress-style")) return;
  const style = document.createElement("style");
  style.id = "wordjar-progress-style";
  style.textContent = Array.from({ length: 101 }, (_, index) => `.wordjar-progress-${index}{--wordjar-progress:${index};}`).join("");
  document.head.appendChild(style);
}

function croakleInit() {
  croakleSaveState();
  croakleInitProgressStyles();
  croakleInitDateLabel();
  croakleInitMoodForm();
  croakleInitMonthPicker();
  croakleRenderOverview();
  croakleInitNav();
  croakleInitForms();
  croakleInitActions();
  croakleInitQuickAdd();
  croakleInitExport();
}

croakleInit();
