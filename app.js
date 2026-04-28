const CroakleStorageKey = "CroakleVisualEntries";

const CroakleMoodLabels = {
  1: "Terrible",
  2: "Sad",
  3: "Okay",
  4: "Good",
  5: "Excellent"
};

let CroakleEntries = CroakleLoadEntries();

function CroakleLoadEntries() {
  try {
    const saved = localStorage.getItem(CroakleStorageKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function CroakleSaveEntries() {
  localStorage.setItem(CroakleStorageKey, JSON.stringify(CroakleEntries));
}

function CroakleTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function CroakleClampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value || 0))));
}

function CroakleEscape(value) {
  return String(value || "").replace(/[&<>"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));
}

function CroakleSetText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function CroakleInitTabs() {
  document.querySelectorAll(".CroakleTab").forEach(button => {
    button.addEventListener("click", () => CroakleSwitchTab(button.dataset.tab));
  });
}

function CroakleSwitchTab(tab) {
  document.querySelectorAll(".CroakleTab").forEach(button => {
    button.classList.toggle("is-active", button.dataset.tab === tab);
  });

  document.getElementById("inputPage")?.classList.toggle("is-active", tab === "input");
  document.getElementById("visualPage")?.classList.toggle("is-active", tab === "visual");

  if (tab === "visual") CroakleRenderVisuals();
}

function CroakleInitForm() {
  const form = document.getElementById("CroakleEntryForm");
  if (!form) return;

  form.date.value = CroakleTodayKey();

  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);

    CroakleEntries.unshift({
      id: crypto.randomUUID(),
      date: data.get("date") || CroakleTodayKey(),
      habit: String(data.get("habit") || "").trim(),
      status: data.get("status") || "done",
      mood: Number(data.get("mood") || 3),
      project: String(data.get("project") || "").trim(),
      progress: CroakleClampPercent(data.get("progress")),
      note: String(data.get("note") || "").trim(),
      createdAt: new Date().toISOString()
    });

    CroakleSaveEntries();
    form.reset();
    form.date.value = CroakleTodayKey();
    CroakleRenderVisuals();
    CroakleSwitchTab("visual");
  });
}

function CroakleInitReset() {
  const button = document.getElementById("CroakleResetButton");
  if (!button) return;

  button.addEventListener("click", () => {
    if (!confirm("Reset all Croakle data?")) return;
    CroakleEntries = [];
    CroakleSaveEntries();
    CroakleRenderVisuals();
  });
}

function CroakleRenderVisuals() {
  const total = CroakleEntries.length;
  const done = CroakleEntries.filter(entry => entry.status === "done").length;
  const doneRate = total ? Math.round((done / total) * 100) : 0;
  const moodAverage = total ? (CroakleEntries.reduce((sum, entry) => sum + Number(entry.mood || 0), 0) / total).toFixed(1) : "-";
  const projectEntries = CroakleEntries.filter(entry => entry.project);
  const projectAverage = projectEntries.length
    ? Math.round(projectEntries.reduce((sum, entry) => sum + Number(entry.progress || 0), 0) / projectEntries.length)
    : 0;

  CroakleSetText("CroakleTotalEntries", total);
  CroakleSetText("CroakleDoneRate", `${doneRate}%`);
  CroakleSetText("CroakleMoodAverage", moodAverage);
  CroakleSetText("CroakleProjectAverage", `${projectAverage}%`);

  CroakleRenderHabitChart(done, total - done);
  CroakleRenderMoodChart();
  CroakleRenderEntryList();
}

function CroakleRenderHabitChart(done, missed) {
  const chart = document.getElementById("CroakleHabitChart");
  if (!chart) return;

  const total = done + missed;
  const doneWidth = total ? Math.round((done / total) * 100) : 0;
  const missedWidth = total ? 100 - doneWidth : 0;

  chart.innerHTML = `
    <div class="CroakleBarRow">
      <div class="CroakleBarLabel"><span>Done</span><strong>${done}</strong></div>
      <div class="CroakleBarTrack"><i style="width:${doneWidth}%"></i></div>
    </div>
    <div class="CroakleBarRow">
      <div class="CroakleBarLabel"><span>Missed</span><strong>${missed}</strong></div>
      <div class="CroakleBarTrack"><i style="width:${missedWidth}%"></i></div>
    </div>
  `;
}

function CroakleRenderMoodChart() {
  const chart = document.getElementById("CroakleMoodChart");
  if (!chart) return;

  const points = [...CroakleEntries]
    .reverse()
    .slice(-14)
    .map((entry, index) => ({ index, mood: Number(entry.mood || 3), date: entry.date }));

  if (points.length < 2) {
    chart.innerHTML = `<p class="CroakleEmptyText">กรอกข้อมูลอย่างน้อย 2 รายการเพื่อแสดงกราฟ</p>`;
    return;
  }

  const width = 640;
  const height = 220;
  const padding = 30;
  const maxIndex = Math.max(points.length - 1, 1);
  const path = points.map((point, index) => {
    const x = padding + (point.index / maxIndex) * (width - padding * 2);
    const y = padding + ((5 - point.mood) / 4) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Mood chart">
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" />
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" />
      <path d="${path}" />
      ${points.map(point => {
        const x = padding + (point.index / maxIndex) * (width - padding * 2);
        const y = padding + ((5 - point.mood) / 4) * (height - padding * 2);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"><title>${point.date}: ${point.mood}</title></circle>`;
      }).join("")}
    </svg>
  `;
}

function CroakleRenderEntryList() {
  const list = document.getElementById("CroakleEntryList");
  if (!list) return;

  if (!CroakleEntries.length) {
    list.innerHTML = `<p class="CroakleEmptyText">ยังไม่มีข้อมูล</p>`;
    return;
  }

  list.innerHTML = CroakleEntries.map(entry => `
    <article class="CroakleEntryCard">
      <div>
        <h3>${CroakleEscape(entry.habit)}</h3>
        <p>${CroakleEscape(entry.date)} · ${entry.status === "done" ? "Done" : "Missed"} · Mood ${entry.mood} - ${CroakleMoodLabels[entry.mood]}</p>
        ${entry.project ? `<p>Project: ${CroakleEscape(entry.project)} · ${entry.progress}%</p>` : ""}
        ${entry.note ? `<p>${CroakleEscape(entry.note)}</p>` : ""}
      </div>
      <strong>${entry.status === "done" ? "✓" : "–"}</strong>
    </article>
  `).join("");
}

function CroakleInit() {
  CroakleInitTabs();
  CroakleInitForm();
  CroakleInitReset();
  CroakleRenderVisuals();
}

CroakleInit();
