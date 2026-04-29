(() => {
  const HabitStoreKey = "CroakleHabitMoodDataCleanV1";
  const ProjectStoreKey = "CroakleProjectDataV1";
  const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const CardColors = ["CroakleDashboardBoxYellow", "CroakleDashboardBoxGreen", "CroakleDashboardBoxBlue", "CroakleDashboardBoxPink"];

  function parseJson(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getToday() {
    return typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
  }

  function formatDate(date) {
    if (typeof CroakleFormatDate === "function") {
      return CroakleFormatDate(date);
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function shiftDate(date, amount) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function getWeekDates() {
    const today = getToday();
    const monday = shiftDate(today, -((today.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
  }

  function getMonthData() {
    const today = getToday();

    if (typeof CroakleGetMonthDataFromDate === "function") {
      return CroakleGetMonthDataFromDate(today);
    }

    const saved = parseJson(localStorage.getItem(HabitStoreKey), null);
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    return saved?.months?.[key] || { habits: [], moods: [] };
  }

  function getProjects() {
    const saved = parseJson(localStorage.getItem(ProjectStoreKey), null);
    return Array.isArray(saved?.projects) ? saved.projects : [];
  }

  function getMoodLabel(mood) {
    if (!mood) {
      return "No mood";
    }

    return typeof CroakleGetMoodLabel === "function" ? `${mood} ${CroakleGetMoodLabel(mood)}` : `Mood ${mood}`;
  }

  function getHabitRows() {
    const todayIndex = getToday().getDate() - 1;
    const habits = Array.isArray(getMonthData().habits) ? getMonthData().habits : [];

    return habits.map((habit, index) => ({
      habit,
      index,
      done: Boolean(habit.days?.[todayIndex]),
    }));
  }

  function getHabitIcon(name) {
    const text = String(name || "").toLowerCase();

    if (text.includes("read") || text.includes("study")) return "▰";
    if (text.includes("exercise") || text.includes("walk") || text.includes("gym")) return "●";
    if (text.includes("sleep") || text.includes("bed")) return "◐";
    if (text.includes("clean") || text.includes("room")) return "◆";
    return "✦";
  }

  function createDateBoxes() {
    const todayKey = formatDate(getToday());

    return getWeekDates().map((date) => {
      const activeClass = formatDate(date) === todayKey ? " CroakleDashboardDateActive" : "";
      return `
        <button class="CroakleDashboardDateBox${activeClass}" type="button" data-page-target="track">
          <strong>${date.getDate()}</strong>
          <span>${WeekDays[date.getDay()]}</span>
        </button>
      `;
    }).join("");
  }

  function createSummaryBoxes() {
    const habits = getHabitRows();
    const done = habits.filter((row) => row.done).length;
    const projects = getProjects().filter((project) => !project.completed).length;
    const mood = getMonthData().moods?.[getToday().getDate() - 1];

    return `
      <button class="CroakleDashboardStatBox" type="button" data-page-target="track"><span>Habit</span><strong>${done}/${habits.length}</strong></button>
      <button class="CroakleDashboardStatBox" type="button" data-page-target="project"><span>Project</span><strong>${projects} active</strong></button>
      <button class="CroakleDashboardStatBox" type="button" data-page-target="mood"><span>Mood</span><strong>${escapeText(getMoodLabel(mood))}</strong></button>
    `;
  }

  function createHabitBoxes() {
    const rows = getHabitRows().slice(0, 4);

    if (!rows.length) {
      return `<div class="CroakleDashboardEmptyBox"><strong>No habits yet</strong><span>Add your first habit from Track.</span></div>`;
    }

    return rows.map(({ habit, index, done }, colorIndex) => {
      const colorClass = done ? "CroakleDashboardBoxDone" : CardColors[colorIndex % CardColors.length];
      const meta = habit.description || `Goal ${habit.goal || 1} days/week`;

      return `
        <article class="CroakleDashboardHabitBox ${colorClass}">
          <div class="CroakleDashboardHabitBoxTop">
            <span>${getHabitIcon(habit.name)}</span>
            <button type="button" data-dashboard-habit-toggle="${index}" aria-pressed="${done}">${done ? "✓" : ""}</button>
          </div>
          <button class="CroakleDashboardHabitBoxText" type="button" data-page-target="track">
            <strong>${escapeText(habit.name || "New Habit")}</strong>
            <small>${escapeText(meta)}</small>
          </button>
        </article>
      `;
    }).join("");
  }

  function createProjectBoxes() {
    const activeProjects = getProjects().filter((project) => !project.completed).slice(0, 2);

    if (!activeProjects.length) {
      return `<div class="CroakleDashboardProjectBox"><div><strong>No active projects</strong><span>Add a project to track work.</span></div><button type="button" data-page-target="project">Open</button></div>`;
    }

    return activeProjects.map((project) => `
      <div class="CroakleDashboardProjectBox">
        <div><strong>${escapeText(project.name || "New Project")}</strong><span>${escapeText(project.description || `Goal ${project.goal || 1} days/week`)}</span></div>
        <div class="CroakleDashboardProjectActions">
          <button type="button" data-page-target="project">Update</button>
          <button type="button" data-page-target="project">Finished</button>
        </div>
      </div>
    `).join("");
  }

  function createPreview() {
    return `
      <section class="CroakleDashboardPreview" aria-label="Home overview">
        <div class="CroakleDashboardDateScroller">${createDateBoxes()}</div>
        <div class="CroakleDashboardStatGrid">${createSummaryBoxes()}</div>
        <div class="CroakleDashboardSectionHeader"><h2>Today's Habits</h2><button type="button" data-page-target="track">View all</button></div>
        <div class="CroakleDashboardHabitGrid">${createHabitBoxes()}</div>
        <div class="CroakleDashboardSectionHeader"><h2>Active Projects</h2><button type="button" data-page-target="project">Open</button></div>
        <div class="CroakleDashboardProjectList">${createProjectBoxes()}</div>
      </section>
    `;
  }

  function createMenu() {
    return `
      <button type="button" data-page-target="track"><span>Track progress</span><span>›</span></button>
      <button type="button" data-page-target="project"><span>Projects</span><span>›</span></button>
      <button type="button" data-page-target="best"><span>Best habits</span><span>›</span></button>
      <button type="button" data-page-target="mood"><span>Top moods</span><span>›</span></button>
    `;
  }

  function renderHome() {
    const page = document.querySelector('[data-page="menu"]');
    const menu = page?.querySelector(".CroakleMenuList");

    if (!page || !menu) {
      return;
    }

    page.querySelector(".CroakleEmptyPanel")?.remove();
    page.querySelector(".CroakleDashboardPreview")?.remove();
    page.querySelector(".CroakleHeroHeader h1").textContent = "Home";
    menu.classList.add("CroakleDashboardMenuList");
    menu.innerHTML = createMenu();
    page.querySelector(".CroakleHeroHeader")?.insertAdjacentHTML("afterend", createPreview());
  }

  function toggleHabit(index) {
    if (typeof CroakleGetMonthDataFromDate !== "function") {
      return;
    }

    const data = CroakleGetMonthDataFromDate(getToday());
    const habit = data.habits?.[index];

    if (!habit) {
      return;
    }

    const dayIndex = getToday().getDate() - 1;
    habit.days[dayIndex] = !habit.days[dayIndex];

    if (typeof CroakleSaveState === "function") CroakleSaveState();
    if (typeof CroakleRenderAll === "function") CroakleRenderAll();
    renderHome();
  }

  function bindHome() {
    if (window.CroakleDashboardHomeBound) {
      return;
    }

    window.CroakleDashboardHomeBound = true;
    document.addEventListener("click", (event) => {
      const habitToggle = event.target.closest("[data-dashboard-habit-toggle]");

      if (habitToggle) {
        event.preventDefault();
        toggleHabit(Number(habitToggle.dataset.dashboardHabitToggle));
        return;
      }

      const pageButton = event.target.closest('[data-page="menu"] [data-page-target]');

      if (pageButton && typeof CroakleSetPage === "function") {
        event.preventDefault();
        CroakleSetPage(pageButton.dataset.pageTarget);
      }
    });
  }

  function patchRender(name) {
    const original = window[name];

    if (typeof original !== "function" || original.CroakleDashboardPatched) {
      return;
    }

    window[name] = function patchedCroakleDashboardFunction(...args) {
      const result = original.apply(this, args);
      renderHome();
      return result;
    };

    window[name].CroakleDashboardPatched = true;
  }

  function init() {
    renderHome();
    bindHome();
    patchRender("CroakleRenderAll");
    patchRender("CroakleSaveState");
    patchRender("CroakleSaveProjectState");
  }

  window.addEventListener("storage", renderHome);
  window.requestAnimationFrame(init);
})();
