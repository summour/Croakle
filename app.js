const STORAGE_KEY = "croakle-data";

const sampleState = {
  habits: [
    { id: "sample-habit-1", name: "Morning reset 10 นาที", frequency: "daily", logs: [] },
    { id: "sample-habit-2", name: "Review dashboard ก่อนนอน", frequency: "daily", logs: [] }
  ],
  projects: [
    {
      id: "sample-project-1",
      name: "Croakle MVP",
      description: "สร้าง life dashboard สำหรับจัดการ habit, project, course และ export data",
      status: "active",
      progress: 45
    },
    {
      id: "sample-project-2",
      name: "Personal System Cleanup",
      description: "จัดระบบงาน ชีวิต และคอร์สที่กำลังเรียนให้อยู่ในที่เดียว",
      status: "active",
      progress: 25
    },
    {
      id: "sample-project-3",
      name: "Monthly Review Template",
      description: "ทำ template สำหรับสรุปเดือน เป้าหมาย และสิ่งที่ต้องปรับปรุง",
      status: "waiting",
      progress: 10
    }
  ],
  courses: [
    { id: "sample-course-1", name: "Frontend Polish", platform: "Self Study", progress: 60 },
    { id: "sample-course-2", name: "Productivity System", platform: "Croakle Lab", progress: 35 }
  ]
};

const defaultState = {
  habits: [],
  projects: [],
  courses: []
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(sampleState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(sampleState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isHabitDoneToday(habit) {
  const today = new Date().toISOString().slice(0, 10);
  return Array.isArray(habit.logs) && habit.logs.includes(today);
}

function getTodayScore() {
  if (!state.habits.length) return 0;
  const done = state.habits.filter(isHabitDoneToday).length;
  return Math.round((done / state.habits.length) * 100);
}

function renderOverview() {
  const doneToday = state.habits.filter(isHabitDoneToday).length;
  const score = getTodayScore();

  document.getElementById("habitCount").textContent = state.habits.length;
  document.getElementById("projectCount").textContent = state.projects.length;
  document.getElementById("courseCount").textContent = state.courses.length;
  document.getElementById("doneTodayCount").textContent = doneToday;
  document.getElementById("todayScore").textContent = `${score}%`;
  document.getElementById("todayOrb").style.background = `conic-gradient(var(--wordjar-green) ${score}%, #dce9df 0)`;

  renderList("todayHabitList", state.habits.slice(0, 4), renderHabitCard);
  renderList("activeProjectList", state.projects.filter(p => p.status !== "done").slice(0, 4), renderProjectCard);
  renderList("habitList", state.habits, renderHabitCard);
  renderList("projectList", state.projects, renderProjectCard);
  renderList("courseList", state.courses, renderCourseCard);
}

function renderList(id, items, renderItem) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.length ? items.map(renderItem).join("") : `<p class="wordjar-empty-text">ยังไม่มีข้อมูล</p>`;
}

function renderHabitCard(habit) {
  const done = isHabitDoneToday(habit);
  return `
    <button class="wordjar-list-card ${done ? "is-done" : ""}" data-action="toggle-habit" data-id="${habit.id}">
      <span>${done ? "✓" : "◦"}</span>
      <div><h4>${escapeHtml(habit.name)}</h4><p>${habit.frequency || "daily"}</p></div>
    </button>
  `;
}

function renderProjectCard(project) {
  return `
    <div class="wordjar-project-card">
      <div><h4>${escapeHtml(project.name)}</h4><p>${escapeHtml(project.description || project.status || "active")}</p></div>
      <strong>${Number(project.progress || 0)}%</strong>
    </div>
  `;
}

function renderCourseCard(course) {
  const progress = Number(course.progress || 0);
  return `
    <div class="wordjar-course-row">
      <span>${escapeHtml(course.name)}</span>
      <div><i style="width: ${Math.max(0, Math.min(100, progress))}%"></i></div>
      <b>${progress}%</b>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function switchView(viewId) {
  document.querySelectorAll(".wordjar-view").forEach(v => v.classList.remove("is-active"));
  document.getElementById(viewId)?.classList.add("is-active");

  document.querySelectorAll(".wordjar-nav-item").forEach(btn => btn.classList.remove("is-active"));
  document.querySelector(`[data-view="${viewId}"]`)?.classList.add("is-active");
}

function initNav() {
  document.querySelectorAll(".wordjar-nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      if (view) switchView(view);
    });
  });
}

function initForms() {
  bindForm("habitForm", data => {
    state.habits.push({ id: crypto.randomUUID(), name: data.get("name"), frequency: data.get("frequency"), logs: [] });
  });

  bindForm("projectForm", data => {
    state.projects.push({ id: crypto.randomUUID(), name: data.get("name"), description: data.get("description"), status: "active", progress: Number(data.get("progress") || 0) });
  });

  bindForm("courseForm", data => {
    state.courses.push({ id: crypto.randomUUID(), name: data.get("name"), platform: data.get("platform"), progress: Number(data.get("progress") || 0) });
  });
}

function bindForm(id, onSubmit) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    onSubmit(new FormData(form));
    saveState();
    renderOverview();
    form.reset();
  });
}

function initActions() {
  document.addEventListener("click", e => {
    const target = e.target.closest("[data-action='toggle-habit']");
    if (!target) return;
    const habit = state.habits.find(item => item.id === target.dataset.id);
    if (!habit) return;
    const today = new Date().toISOString().slice(0, 10);
    habit.logs = Array.isArray(habit.logs) ? habit.logs : [];
    habit.logs = habit.logs.includes(today) ? habit.logs.filter(date => date !== today) : [...habit.logs, today];
    saveState();
    renderOverview();
  });
}

function initQuickAdd() {
  const dialog = document.getElementById("quickAddDialog");
  const btn = document.getElementById("quickAddButton");
  const form = document.getElementById("quickAddForm");
  if (!dialog || !btn || !form) return;

  btn.addEventListener("click", () => dialog.showModal());
  form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const type = fd.get("type");
    const name = fd.get("name");
    if (!name) return;

    if (type === "habit") state.habits.push({ id: crypto.randomUUID(), name, frequency: "daily", logs: [] });
    if (type === "project") state.projects.push({ id: crypto.randomUUID(), name, description: "Quick add", status: "active", progress: 0 });
    if (type === "course") state.courses.push({ id: crypto.randomUUID(), name, platform: "Quick add", progress: 0 });

    saveState();
    renderOverview();
    dialog.close();
    form.reset();
  });
}

function initExport() {
  const exportBtn = document.getElementById("exportJsonButton");
  const importInput = document.getElementById("importJsonInput");
  const preview = document.getElementById("dataPreview");
  const resetBtn = document.getElementById("resetButton");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const data = JSON.stringify(state, null, 2);
      preview.value = data;
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "croakle-data.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importInput) {
    importInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          state = { ...structuredClone(defaultState), ...JSON.parse(reader.result) };
          saveState();
          renderOverview();
        } catch {
          alert("Invalid JSON");
        }
      };
      reader.readAsText(file);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Reset all data?")) return;
      state = structuredClone(sampleState);
      saveState();
      renderOverview();
    });
  }
}

function initDateLabel() {
  const label = document.getElementById("todayLabel");
  if (!label) return;
  label.textContent = new Intl.DateTimeFormat("th-TH", { weekday: "long", day: "numeric", month: "short" }).format(new Date());
}

function init() {
  saveState();
  initDateLabel();
  renderOverview();
  initNav();
  initForms();
  initActions();
  initQuickAdd();
  initExport();
}

init();
