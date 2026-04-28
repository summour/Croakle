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

function CroakleClampGoal(value) {
  return Math.max(1, Math.min(31, Math.round(Number(value || 30))));
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
      goal: CroakleClampGoal(data.get("goal")),
      mood: Number(data.get("mood") || 3),
      note: String(data.get("note") || "").trim(),
      createdAt: new Date().toISOString()
    });

    CroakleSaveEntries();
    form.reset();
    form.date.value = CroakleTodayKey();
    form.goal.value = 30;
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

function CroakleGetHabitSummary() {
  return Object.values(CroakleEntries.reduce((summary, entry) => {
    const habitName = entry.habit || "Untitled";

    if (!summary[habitName]) {
      summary[habitName] = {
        habit: habitName,
        sum: 0,
        goal: CroakleClampGoal(entry.goal),
        entries: 0
      };
    }

    summary[habitName].entries += 1;
    summary[habitName].goal = CroakleClampGoal(entry.goal || summary[habitName].goal);

    if (entry.status === "done") {
      summary[habitName].sum += 1;
    }

    return summary;
  }, {})).sort((a, b) => b.sum - a.sum || a.habit.localeCompare(b.habit));
}

function CroakleRenderVisuals() {
  const habitSummary = CroakleGetHabitSummary();
  const totalDone = habitSummary.reduce((sum, habit) => sum + habit.sum, 0);
  const totalGoal = habitSummary.reduce((sum, habit) => sum + habit.goal, 0);
  const doneRate = totalGoal ? Math.round((totalDone / totalGoal) * 100) : 0;
  const moodAverage = CroakleEntries.length
    ? (CroakleEntries.reduce((sum, entry) => sum + Number(entry.mood || 0), 0) / CroakleEntries.length).toFixed(1)
    : "-";

  CroakleSetText("CroakleTotalHabits", habitSummary.length);
  CroakleSetText("CroakleTotalDone", totalDone);
  CroakleSetText("CroakleDoneRate", `${doneRate}%`);
  CroakleSetText("CroakleMoodAverage", moodAverage);

  CroakleRenderHabitProgress(habitSummary);
  CroakleRenderMoodChart();
  CroakleRenderEntryList();
}

function CroakleRenderHabitProgress(habits) {
  const list = document.getElementById("CroakleHabitProgressList");
  if (!list) return;

  if (!habits.length) {
    list.innerHTML = `<p class="CroakleEmptyText">ยังไม่มีข้อมูล</p>`;
    return;
  }

  list.innerHTML = habits.map(habit => {
    const progress = Math.round((habit.sum / habit.goal) * 100);
    const width = Math.min(progress, 100);

    return `
      <article class="CroakleProgressRow">
        <div class="CroakleProgressHabit">${CroakleEscape(habit.habit)}</div>
        <div class="CroakleProgressSum">${habit.sum}</div>
        <div class="CroakleProgressGoal">${habit.goal}</div>
        <div class="CroakleProgressTrack" aria-label="${CroakleEscape(habit.habit)} progress ${progress}%">
          <i style="width:${width}%"></i>
        </div>
        <strong class="CroakleProgressPercent">${progress}%</strong>
      </article>
    `;
  }).join("");
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

  list.innerHTML = CroakleEntries.slice(0, 8).map(entry => `
    <article class="CroakleEntryCard">
      <div>
        <h3>${CroakleEscape(entry.habit)}</h3>
        <p>${CroakleEscape(entry.date)} · ${entry.status === "done" ? "Done" : "Missed"} · Goal ${entry.goal || 30} · Mood ${entry.mood} - ${CroakleMoodLabels[entry.mood]}</p>
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
