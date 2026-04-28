const STORAGE_KEY = "croakle-data";

const defaultState = {
  habits: [],
  projects: [],
  courses: []
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderOverview() {
  document.getElementById("habitCount").textContent = state.habits.length;
  document.getElementById("projectCount").textContent = state.projects.length;
  document.getElementById("courseCount").textContent = state.courses.length;
}

function switchView(viewId) {
  document.querySelectorAll(".wordjar-view").forEach(v => v.classList.remove("is-active"));
  document.getElementById(viewId).classList.add("is-active");

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

    if (type === "habit") {
      state.habits.push({ id: crypto.randomUUID(), name });
    }
    if (type === "project") {
      state.projects.push({ id: crypto.randomUUID(), name, progress: 0 });
    }
    if (type === "course") {
      state.courses.push({ id: crypto.randomUUID(), name, progress: 0 });
    }

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
    });
  }

  if (importInput) {
    importInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          state = JSON.parse(reader.result);
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
      state = structuredClone(defaultState);
      saveState();
      renderOverview();
    });
  }
}

function init() {
  renderOverview();
  initNav();
  initQuickAdd();
  initExport();
}

init();
