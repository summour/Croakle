(() => {
  const habitKey = "CroakleHabitMoodDataCleanV1";
  const projectKey = "CroakleProjectDataV1";
  const colors = ["CroakleHomeCardYellow", "CroakleHomeCardGreen", "CroakleHomeCardBlue", "CroakleHomeCardPink"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function parse(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function safe(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function today() {
    if (typeof CroakleGetToday === "function") {
      return CroakleGetToday();
    }

    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

  function weekDates() {
    const now = today();
    const monday = shiftDate(now, -((now.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
  }

  function monthData() {
    const now = today();

    if (typeof CroakleGetMonthDataFromDate === "function") {
      return CroakleGetMonthDataFromDate(now);
    }

    const saved = parse(localStorage.getItem(habitKey), null);
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return saved?.months?.[monthKey] || { habits: [], moods: [] };
  }

  function projects() {
    const saved = parse(localStorage.getItem(projectKey), null);
    return Array.isArray(saved?.projects) ? saved.projects : [];
  }

  function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  }

  function habitIcon(name) {
    const text = String(name || "").toLowerCase();
    if (text.includes("read") || text.includes("study")) return "▰";
    if (text.includes("exercise") || text.includes("walk") || text.includes("gym")) return "●";
    if (text.includes("sleep") || text.includes("bed")) return "◐";
    if (text.includes("clean")) return "◆";
    return "✦";
  }

  function datePills() {
    const activeDate = formatDate(today());
    return weekDates().map((date) => {
      const active = formatDate(date) === activeDate ? " CroakleHomeDatePillActive" : "";
      return `<button class="CroakleHomeDatePill${active}" type="button" data-home-target="track"><strong>${date.getDate()}</strong><span>${dayNames[date.getDay()]}</span></button>`;
    }).join("");
  }

  function habitRows() {
    const data = monthData();
    const dayIndex = today().getDate() - 1;
    const habits = Array.isArray(data.habits) ? data.habits : [];
    return habits.map((habit, index) => ({ habit, index, done: Boolean(habit.days?.[dayIndex]) }));
  }

  function summaryCards() {
    const habits = habitRows();
    const done = habits.filter((row) => row.done).length;
    const activeProjects = projects().filter((project) => !project.completed).length;
    const data = monthData();
    const mood = data.moods?.[today().getDate() - 1];
    const moodLabel = mood && typeof CroakleGetMoodLabel === "function" ? `${mood} ${CroakleGetMoodLabel(mood)}` : "No mood";

    return `
      <article class="CroakleHomeSummaryCard" data-home-target="track"><span>Habit</span><strong>${done}/${habits.length}</strong></article>
      <article class="CroakleHomeSummaryCard" data-home-target="project"><span>Project</span><strong>${activeProjects} active</strong></article>
      <article class="CroakleHomeSummaryCard" data-home-target="mood"><span>Mood</span><strong>${safe(moodLabel)}</strong></article>
    `;
  }

  function habitCards() {
    const rows = habitRows().slice(0, 6);

    if (!rows.length) {
      return `<article class="CroakleHomeEmptyCard"><strong>No habits yet</strong><span>Add your first daily habit.</span></article>`;
    }

    return rows.map(({ habit, index, done }, colorIndex) => {
      const color = done ? "CroakleHomeCardMuted" : colors[colorIndex % colors.length];
      const doneClass = done ? " CroakleHomeHabitDone" : "";
      const meta = habit.description || `Goal ${habit.goal || 1} days/week`;

      return `
        <article class="CroakleHomeHabitCard ${color}${doneClass}">
          <div class="CroakleHomeHabitTop">
            <span class="CroakleHomeHabitIcon">${habitIcon(habit.name)}</span>
            <button class="CroakleHomeHabitStatus" type="button" data-home-habit-toggle="${index}" aria-pressed="${done}">${done ? "✓" : ""}</button>
          </div>
          <button class="CroakleHomeHabitText" type="button" data-home-target="track"><strong>${safe(habit.name || "New Habit")}</strong><span>${safe(meta)}</span></button>
        </article>
      `;
    }).join("");
  }

  function projectCards() {
    const active = projects().filter((project) => !project.completed).slice(0, 2);

    if (!active.length) {
      return `<article class="CroakleHomeProjectCard"><div><strong>No active projects</strong><span>Create a project to track short workflows.</span></div><button class="CroakleHomeProjectButton" type="button" data-home-target="project">Open</button></article>`;
    }

    return active.map((project) => `
      <article class="CroakleHomeProjectCard">
        <div><strong>${safe(project.name || "New Project")}</strong><span>${safe(project.description || `Goal ${project.goal || 1} days/week`)}</span></div>
        <div class="CroakleHomeProjectActions">
          <button class="CroakleHomeProjectButton CroakleHomeProjectButtonPrimary" type="button" data-home-target="project">Update</button>
          <button class="CroakleHomeProjectButton" type="button" data-home-project-archive="true">Finished</button>
        </div>
      </article>
    `).join("");
  }

  function homeNav() {
    return `
      <nav class="CroakleHomeNav" aria-label="Home quick navigation">
        <button class="CroakleHomeNavButton CroakleHomeNavActive" type="button" data-home-target="menu"><span>⌂</span><small>Home</small></button>
        <button class="CroakleHomeNavButton" type="button" data-home-target="track">☑</button>
        <button class="CroakleHomeNavButton CroakleHomeNavAdd" type="button" data-home-add="habit">+</button>
        <button class="CroakleHomeNavButton" type="button" data-home-target="project">◇</button>
        <button class="CroakleHomeNavButton" type="button" data-home-target="settings">⚙</button>
      </nav>
    `;
  }

  function renderHome() {
    const page = document.querySelector('[data-page="menu"]');
    if (!page) return;

    page.innerHTML = `
      <div class="CroakleHomeScreen">
        <header class="CroakleHomeHeader">
          <div><p class="CroakleHomeGreeting">${greeting()}</p><h1>Today</h1></div>
          <div class="CroakleHomeHeaderActions">
            <button class="CroakleHomeIconButton" type="button" data-home-target="best">▥</button>
            <button class="CroakleHomeIconButton CroakleHomeNotifyButton" type="button" data-home-target="settings">◔</button>
          </div>
        </header>
        <main class="CroakleHomeMain">
          <div class="CroakleHomeDateScroller">${datePills()}</div>
          <section class="CroakleHomeSummaryGrid">${summaryCards()}</section>
          <section class="CroakleHomeSection"><div class="CroakleHomeSectionHeader"><h2>Today's Habits</h2><button type="button" data-home-target="track">View all</button></div><div class="CroakleHomeHabitGrid">${habitCards()}</div></section>
          <section class="CroakleHomeSection"><div class="CroakleHomeSectionHeader"><h2>Active Projects</h2><button type="button" data-home-target="project">Open</button></div><div class="CroakleHomeProjectSlot">${projectCards()}</div></section>
        </main>
        ${homeNav()}
      </div>
    `;

    document.querySelector(".CroakleBottomNav")?.setAttribute("hidden", "");
  }

  function go(page) {
    if (page !== "menu" && typeof CroakleSetPage === "function") {
      CroakleSetPage(page);
    }
  }

  function openAddHabit() {
    if (typeof CroakleOpenAddHabitDialog === "function") {
      CroakleOpenAddHabitDialog();
      return;
    }

    document.querySelector("#CroakleOpenAddHabit")?.click();
  }

  function toggleHabit(index) {
    if (typeof CroakleGetMonthDataFromDate !== "function") return;
    const data = CroakleGetMonthDataFromDate(today());
    const habit = data.habits?.[index];
    if (!habit) return;
    const dayIndex = today().getDate() - 1;
    habit.days[dayIndex] = !habit.days[dayIndex];
    if (typeof CroakleSaveState === "function") CroakleSaveState();
    if (typeof CroakleRenderAll === "function") CroakleRenderAll();
    renderHome();
  }

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-home-habit-toggle]");
    if (toggle) {
      event.preventDefault();
      toggleHabit(Number(toggle.dataset.homeHabitToggle));
      return;
    }

    if (event.target.closest("[data-home-add]")) {
      event.preventDefault();
      openAddHabit();
      return;
    }

    if (event.target.closest("[data-home-project-archive]")) {
      event.preventDefault();
      go("project");
      requestAnimationFrame(() => document.querySelector("#CroakleOpenProjectArchive")?.click());
      return;
    }

    const target = event.target.closest("[data-home-target]");
    if (target) {
      event.preventDefault();
      go(target.dataset.homeTarget);
    }
  });

  window.addEventListener("storage", renderHome);
  requestAnimationFrame(renderHome);
})();
