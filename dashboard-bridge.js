(() => {
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
      subtitle: "",
    },
  ];

  function CroakleDashboardGetMonthData() {
    const today = typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();

    if (typeof CroakleGetMonthData === "function") {
      return CroakleGetMonthData(today.getFullYear(), today.getMonth());
    }

    return { habits: [], moods: [] };
  }

  function CroakleDashboardGetHabitSummary() {
    const monthData = CroakleDashboardGetMonthData();
    const today = typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
    const dayIndex = today.getDate() - 1;
    const habits = Array.isArray(monthData.habits) ? monthData.habits : [];
    const done = habits.filter((habit) => Boolean(habit.days?.[dayIndex])).length;

    return `${done}/${habits.length}`;
  }

  function CroakleDashboardGetProjectSummary() {
    const projects = Array.isArray(window.CroakleProjectState?.projects)
      ? window.CroakleProjectState.projects
      : Array.isArray(CroakleProjectState?.projects)
        ? CroakleProjectState.projects
        : [];
    const active = projects.filter((project) => !project.completed).length;

    return `${active} active`;
  }

  function CroakleDashboardGetMoodSummary() {
    const monthData = CroakleDashboardGetMonthData();
    const today = typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
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

  function CroakleDashboardPatchRender() {
    if (window.CroakleDashboardRenderPatched || typeof CroakleRenderAll !== "function") {
      return;
    }

    window.CroakleDashboardRenderPatched = true;
    const originalRenderAll = CroakleRenderAll;

    CroakleRenderAll = function CroakleRenderAllWithDashboard() {
      originalRenderAll();
      CroakleDashboardRenderStats();
    };
  }

  function CroakleDashboardBindMenu() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".CroakleDashboardMenuList [data-page-target]");

      if (!button || typeof CroakleSetPage !== "function") {
        return;
      }

      CroakleSetPage(button.dataset.pageTarget);
    });
  }

  function CroakleDashboardInit() {
    const menuPage = document.querySelector('[data-page="menu"]');
    const menuList = document.querySelector(".CroakleMenuList");

    if (!menuPage || !menuList || document.querySelector(".CroakleDashboardCard")) {
      return;
    }

    menuPage.querySelector(".CroakleEmptyPanel")?.remove();
    menuList.classList.add("CroakleDashboardMenuList");
    menuList.innerHTML = CroakleDashboardCreateMenu();
    menuPage.querySelector(".CroakleHeroHeader")?.insertAdjacentHTML("afterend", CroakleDashboardCreateCard());
    menuPage.querySelector(".CroakleHeroHeader h1").textContent = "Life Dashboard";

    CroakleDashboardPatchRender();
    CroakleDashboardBindMenu();
    CroakleDashboardRenderStats();
  }

  window.requestAnimationFrame(CroakleDashboardInit);
})();
