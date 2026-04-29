(() => {
  const CroakleDashboardHabitStoreKey = "CroakleHabitMoodDataCleanV1";
  const CroakleDashboardProjectStoreKey = "CroakleProjectDataV1";

  const CroakleDashboardDefaultProjects = [
    { completed: false },
    { completed: false },
    { completed: false },
  ];

  const CroakleDashboardRoutes = [
    {
      page: "track",
      title: "Track Progress",
      subtitle: "Daily habit check-ins",
    },
    {
      page: "project",
      title: "Projects",
      subtitle: "Short project workflow",
    },
    {
      page: "best",
      title: "Best Habits",
      subtitle: "Monthly habit ranking",
    },
    {
      page: "mood",
      title: "Mood",
      subtitle: "Mood calendar and patterns",
    },
    {
      page: "analysis",
      title: "Data Analysis",
      subtitle: "Monthly insight charts",
    },
  ];

  function CroakleDashboardSafeParse(value, fallback) {
    if (!value) {
      return fallback;
    }

    try {
      return JSON.parse(value) || fallback;
    } catch {
      return fallback;
    }
  }

  function CroakleDashboardGetToday() {
    return typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
  }

  function CroakleDashboardGetMonthKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0")].join("-");
  }

  function CroakleDashboardGetSavedHabitState() {
    return CroakleDashboardSafeParse(localStorage.getItem(CroakleDashboardHabitStoreKey), null);
  }

  function CroakleDashboardGetSavedProjectState() {
    return CroakleDashboardSafeParse(localStorage.getItem(CroakleDashboardProjectStoreKey), null);
  }

  function CroakleDashboardGetMonthData() {
    const today = CroakleDashboardGetToday();

    if (typeof CroakleGetMonthData === "function") {
      return CroakleGetMonthData(today.getFullYear(), today.getMonth());
    }

    const savedState = CroakleDashboardGetSavedHabitState();
    const monthKey = CroakleDashboardGetMonthKey(today);
    const savedMonth = savedState?.months?.[monthKey];

    return {
      habits: Array.isArray(savedMonth?.habits) ? savedMonth.habits : [],
      moods: Array.isArray(savedMonth?.moods) ? savedMonth.moods : [],
    };
  }

  function CroakleDashboardGetHabitSummary() {
    const monthData = CroakleDashboardGetMonthData();
    const today = CroakleDashboardGetToday();
    const dayIndex = today.getDate() - 1;
    const habits = Array.isArray(monthData.habits) ? monthData.habits : [];
    const done = habits.filter((habit) => Boolean(habit.days?.[dayIndex])).length;

    return `${done}/${habits.length}`;
  }

  function CroakleDashboardGetProjectList() {
    const savedState = CroakleDashboardGetSavedProjectState();

    if (Array.isArray(savedState?.projects)) {
      return savedState.projects;
    }

    if (typeof CroakleProjectState !== "undefined" && Array.isArray(CroakleProjectState.projects)) {
      return CroakleProjectState.projects;
    }

    return CroakleDashboardDefaultProjects;
  }

  function CroakleDashboardGetProjectSummary() {
    const projects = CroakleDashboardGetProjectList();
    const active = projects.filter((project) => !project.completed).length;

    return `${active} active`;
  }

  function CroakleDashboardGetMoodSummary() {
    const monthData = CroakleDashboardGetMonthData();
    const today = CroakleDashboardGetToday();
    const mood = monthData.moods?.[today.getDate() - 1];
    const label = typeof CroakleGetMoodLabel === "function" ? CroakleGetMoodLabel(mood) : "Okay";

    return mood ? `${mood} ${label}` : "No mood";
  }

  function CroakleDashboardCreateCard() {
    return `
      <section class="CroakleDashboardCard" aria-label="Daily system summary">
        <p class="CroakleDashboardLabel">Today</p>
        <h2 class="CroakleDashboardTitle">Daily System</h2>
        <div class="CroakleDashboardStats">
          <div class="CroakleDashboardStat">
            <span>Habit</span>
            <strong id="CroakleDashboardHabitStat">0/0</strong>
          </div>
          <div class="CroakleDashboardStat">
            <span>Project</span>
            <strong id="CroakleDashboardProjectStat">0 active</strong>
          </div>
          <div class="CroakleDashboardStat">
            <span>Mood</span>
            <strong id="CroakleDashboardMoodStat">No mood</strong>
          </div>
        </div>
      </section>
    `;
  }

  function CroakleDashboardCreateMenu() {
    return CroakleDashboardRoutes.map((route) => `
      <button type="button" data-page-target="${route.page}">
        <span class="CroakleMenuCopy">
          <span class="CroakleMenuTitle">${route.title}</span>
          ${route.subtitle ? `<span class="CroakleMenuSubtitle">${route.subtitle}</span>` : ""}
        </span>
        <span class="CroakleMenuChevron" aria-hidden="true">›</span>
      </button>
    `).join("");
  }

  function CroakleDashboardSetText(selector, text) {
    const node = document.querySelector(selector);

    if (node) {
      node.textContent = text;
    }
  }

  function CroakleDashboardRenderStats() {
    CroakleDashboardSetText("#CroakleDashboardHabitStat", CroakleDashboardGetHabitSummary());
    CroakleDashboardSetText("#CroakleDashboardProjectStat", CroakleDashboardGetProjectSummary());
    CroakleDashboardSetText("#CroakleDashboardMoodStat", CroakleDashboardGetMoodSummary());
  }

  function CroakleDashboardPatchFunction(functionName) {
    const originalFunction = window[functionName];

    if (typeof originalFunction !== "function" || originalFunction.CroakleDashboardPatched) {
      return;
    }

    window[functionName] = function CroakleDashboardPatchedFunction(...args) {
      const result = originalFunction.apply(this, args);
      CroakleDashboardRenderStats();
      return result;
    };

    window[functionName].CroakleDashboardPatched = true;
  }

  function CroakleDashboardPatchRender() {
    CroakleDashboardPatchFunction("CroakleRenderAll");
    CroakleDashboardPatchFunction("CroakleSaveState");
    CroakleDashboardPatchFunction("CroakleSaveProjectState");
  }

  function CroakleDashboardBindMenu() {
    if (window.CroakleDashboardMenuBound) {
      return;
    }

    window.CroakleDashboardMenuBound = true;
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".CroakleDashboardMenuList [data-page-target]");

      if (!button || typeof CroakleSetPage !== "function") {
        return;
      }

      CroakleSetPage(button.dataset.pageTarget);
      CroakleDashboardRenderStats();
    });
  }

  function CroakleDashboardLoadPolishBridge() {
    if (document.querySelector('script[src="croakle-ui-polish-bridge.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "croakle-ui-polish-bridge.js";
    script.defer = true;
    document.body.appendChild(script);
  }

  function CroakleDashboardInit() {
    const menuPage = document.querySelector('[data-page="menu"]');
    const menuList = document.querySelector(".CroakleMenuList");

    if (!menuPage || !menuList) {
      return;
    }

    if (!document.querySelector(".CroakleDashboardCard")) {
      menuPage.querySelector(".CroakleEmptyPanel")?.remove();
      menuList.classList.add("CroakleDashboardMenuList");
      menuList.innerHTML = CroakleDashboardCreateMenu();
      menuPage.querySelector(".CroakleHeroHeader")?.insertAdjacentHTML("afterend", CroakleDashboardCreateCard());
      menuPage.querySelector(".CroakleHeroHeader h1").textContent = "Life Dashboard";
    }

    CroakleDashboardPatchRender();
    CroakleDashboardBindMenu();
    CroakleDashboardRenderStats();
    CroakleDashboardLoadPolishBridge();
  }

  window.addEventListener("storage", CroakleDashboardRenderStats);
  window.requestAnimationFrame(CroakleDashboardInit);
})();
