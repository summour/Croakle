(() => {
  if (typeof CroakleState === "undefined" || typeof CroakleSetPage !== "function") {
    return;
  }

  const CroakleAnalyticsProjectStoreKey = "CroakleProjectDataV1";

  function CroakleEscapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleEnsureAnalyticsMonth() {
    const today = CroakleGetToday();
    let changed = false;

    if (!Number.isInteger(CroakleState.analyticsMonth)) {
      CroakleState.analyticsMonth = CroakleState.trackMonth ?? today.getMonth();
      changed = true;
    }

    if (!Number.isInteger(CroakleState.analyticsYear)) {
      CroakleState.analyticsYear = CroakleState.trackYear ?? today.getFullYear();
      changed = true;
    }

    if (changed) {
      CroakleSaveState();
    }
  }

  function CroakleInjectAnalyticsStyles() {
    if (document.querySelector("#CroakleAnalyticsStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleAnalyticsStyles";
    style.textContent = `
      .CroakleAnalyticsNav {
        grid-template-columns: repeat(6, minmax(0, 1fr));
      }

      .CroakleAnalyticsNav button {
        font-size: 12px;
      }

      .CroakleAnalyticsPage .CroakleCard {
        gap: 12px;
      }

      .CroakleAnalyticsScroll {
        display: grid;
        gap: 12px;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 12px;
      }

      .CroakleAnalyticsScroll::-webkit-scrollbar {
        display: none;
      }

      .CroakleAnalyticsSummary {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .CroakleAnalyticsStatCard,
      .CroakleAnalyticsPanel {
        border: 2px solid var(--CroakleLine);
        border-radius: 20px;
        background: var(--CroakleSurface);
      }

      .CroakleAnalyticsStatCard {
        display: grid;
        gap: 4px;
        min-width: 0;
        padding: 12px;
      }

      .CroakleAnalyticsStatCard strong {
        min-width: 0;
        color: var(--CroakleText);
        font-size: clamp(22px, 7vw, 30px);
        font-weight: 900;
        line-height: 0.96;
        letter-spacing: -0.06em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .CroakleAnalyticsStatCard span,
      .CroakleAnalyticsStatCard small,
      .CroakleAnalyticsPanelHeader p,
      .CroakleAnalyticsRowMeta,
      .CroakleAnalyticsEmptyText {
        color: var(--CroakleMuted);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.25;
      }

      .CroakleAnalyticsStatCard span {
        color: var(--CroakleText);
        font-size: 13px;
      }

      .CroakleAnalyticsPanel {
        display: grid;
        gap: 12px;
        padding: 14px;
      }

      .CroakleAnalyticsPanelHeader {
        display: grid;
        gap: 4px;
      }

      .CroakleAnalyticsPanelHeader h3 {
        margin: 0;
        font-size: 23px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.05em;
      }

      .CroakleAnalyticsPanelHeader p {
        margin: 0;
      }

      .CroakleAnalyticsRows {
        display: grid;
        gap: 11px;
      }

      .CroakleAnalyticsRow {
        display: grid;
        gap: 7px;
      }

      .CroakleAnalyticsRowTop {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: baseline;
        gap: 10px;
      }

      .CroakleAnalyticsRowTop strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 15px;
        font-weight: 900;
        line-height: 1.15;
      }

      .CroakleAnalyticsRowValue {
        font-size: 13px;
        font-weight: 900;
        white-space: nowrap;
      }

      .CroakleAnalyticsBarSvg {
        width: 100%;
        height: 12px;
        display: block;
      }

      .CroakleAnalyticsBarTrack {
        fill: var(--CroakleSoftLine);
      }

      .CroakleAnalyticsBarFill {
        fill: var(--CroakleLine);
      }

      .CroakleAnalyticsEmptyText {
        margin: 0;
        text-align: center;
      }

      @media (max-width: 380px) {
        .CroakleAnalyticsNav button {
          font-size: 11px;
        }

        .CroakleAnalyticsSummary {
          gap: 7px;
        }

        .CroakleAnalyticsStatCard,
        .CroakleAnalyticsPanel {
          border-radius: 18px;
          padding: 11px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleInjectAnalyticsPage() {
    if (document.querySelector('[data-page="analysis"]')) {
      return;
    }

    const projectPage = document.querySelector('[data-page="project"]');

    if (!projectPage) {
      return;
    }

    projectPage.insertAdjacentHTML("afterend", `
      <section class="CroaklePage CroakleAnalyticsPage" data-page="analysis">
        <article class="CroakleCard" aria-label="Data analysis">
          <div class="CroakleMonthHeader">
            <button type="button" id="CroakleAnalyticsPreviousMonth" aria-label="เดือนก่อนหน้า">‹</button>
            <strong id="CroakleAnalyticsMonthLabel">Data Analysis</strong>
            <button type="button" id="CroakleAnalyticsNextMonth" aria-label="เดือนถัดไป">›</button>
          </div>

          <div class="CroakleAnalyticsScroll">
            <section class="CroakleAnalyticsSummary" id="CroakleAnalyticsSummary"></section>
            <section class="CroakleAnalyticsPanels" id="CroakleAnalyticsPanels"></section>
          </div>
        </article>
      </section>
    `);
  }

  function CroakleInjectAnalyticsButtons() {
    const menuList = document.querySelector(".CroakleMenuList");
    const bottomNav = document.querySelector(".CroakleBottomNav");

    if (menuList && !document.querySelector("#CroakleOpenAnalyticsFromMenu")) {
      menuList.insertAdjacentHTML("beforeend", `
        <button id="CroakleOpenAnalyticsFromMenu" type="button" data-page-target="analysis">
          <span>Data Analysis</span><span>›</span>
        </button>
      `);
    }

    if (bottomNav && !document.querySelector("#CroakleOpenAnalyticsFromNav")) {
      bottomNav.classList.add("CroakleAnalyticsNav");
      bottomNav.insertAdjacentHTML("beforeend", `
        <button id="CroakleOpenAnalyticsFromNav" type="button" data-page-target="analysis">Analysis</button>
      `);
    }
  }

  function CroaklePatchAnalyticsNavigation() {
    if (window.CroakleAnalyticsNavigationPatched) {
      return;
    }

    window.CroakleAnalyticsNavigationPatched = true;

    CroakleSetPage = function CroakleSetPageWithAnalytics(pageName) {
      document.querySelectorAll("[data-page]").forEach((page) => {
        page.classList.toggle("CroaklePageActive", page.dataset.page === pageName);
      });

      document.querySelectorAll("[data-page-target]").forEach((button) => {
        button.classList.toggle("CroakleActiveNav", button.dataset.pageTarget === pageName);
      });

      const bottomNav = document.querySelector(".CroakleBottomNav");

      if (bottomNav) {
        bottomNav.hidden = pageName === "menu";
      }

      if (pageName === "analysis") {
        CroakleRenderAnalyticsPage();
        return;
      }

      CroakleScrollCurrentDateIntoView?.();
    };
  }

  function CroakleBindAnalyticsEvents() {
    if (window.CroakleAnalyticsEventsBound) {
      return;
    }

    window.CroakleAnalyticsEventsBound = true;

    document.addEventListener("click", (event) => {
      const pageButton = event.target.closest('[data-page-target="analysis"]');

      if (pageButton) {
        event.preventDefault();
        CroakleSetPage("analysis");
        return;
      }

      if (event.target.closest("#CroakleAnalyticsPreviousMonth")) {
        event.preventDefault();
        CroakleShiftAnalyticsMonth(-1);
        return;
      }

      if (event.target.closest("#CroakleAnalyticsNextMonth")) {
        event.preventDefault();
        CroakleShiftAnalyticsMonth(1);
      }
    });
  }

  function CroakleShiftAnalyticsMonth(direction) {
    CroakleEnsureAnalyticsMonth();

    const nextDate = new Date(CroakleState.analyticsYear, CroakleState.analyticsMonth + direction, 1);
    CroakleState.analyticsMonth = nextDate.getMonth();
    CroakleState.analyticsYear = nextDate.getFullYear();
    CroakleSaveState();
    CroakleRenderAnalyticsPage();
  }

  function CroakleGetWeeksInMonthForAnalytics(year, month) {
    const daysInMonth = CroakleGetDaysInMonth(year, month);
    const weekStarts = new Set();

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const weekStart = CroakleShiftDate(date, -((date.getDay() + 6) % 7));
      weekStarts.add(CroakleFormatDate(weekStart));
    }

    return weekStarts.size;
  }

  function CroakleGetMonthlyGoalForAnalytics(habit, habitIndex, monthKey) {
    const template = CroakleState.habitTemplates?.[habitIndex] || habit;

    if (typeof CroakleGetHabitGoalForMonth === "function") {
      return CroakleGetHabitGoalForMonth(template, monthKey);
    }

    return CroakleClampGoal(template.goal || habit.goal);
  }

  function CroakleCreateBarRows(rows) {
    if (!rows.length) {
      return `<p class="CroakleAnalyticsEmptyText">No data yet.</p>`;
    }

    const maxValue = Math.max(...rows.map((row) => row.value), 1);

    return `<div class="CroakleAnalyticsRows">${rows.map((row) => {
      const width = Math.max(1, Math.min(100, Math.round((row.value / maxValue) * 100)));

      return `
        <div class="CroakleAnalyticsRow">
          <div class="CroakleAnalyticsRowTop">
            <strong>${CroakleEscapeHtml(row.label)}</strong>
            <span class="CroakleAnalyticsRowValue">${CroakleEscapeHtml(row.valueLabel)}</span>
          </div>
          <svg class="CroakleAnalyticsBarSvg" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
            <rect class="CroakleAnalyticsBarTrack" x="0" y="0" width="100" height="10" rx="5" ry="5"></rect>
            <rect class="CroakleAnalyticsBarFill" x="0" y="0" width="${width}" height="10" rx="5" ry="5"></rect>
          </svg>
          <span class="CroakleAnalyticsRowMeta">${CroakleEscapeHtml(row.meta || "")}</span>
        </div>
      `;
    }).join("")}</div>`;
  }

  function CroakleCreatePanel(title, subtitle, rows) {
    return `
      <article class="CroakleAnalyticsPanel">
        <header class="CroakleAnalyticsPanelHeader">
          <h3>${CroakleEscapeHtml(title)}</h3>
          <p>${CroakleEscapeHtml(subtitle)}</p>
        </header>
        ${CroakleCreateBarRows(rows)}
      </article>
    `;
  }

  function CroakleGetHabitCompletionRows(year, month) {
    const monthKey = CroakleGetMonthKey(year, month);
    const monthData = CroakleGetMonthData(year, month);
    const weeksInMonth = CroakleGetWeeksInMonthForAnalytics(year, month);

    return monthData.habits.map((habit, habitIndex) => {
      const doneCount = CroakleCountDone(habit.days);
      const weeklyGoal = CroakleGetMonthlyGoalForAnalytics(habit, habitIndex, monthKey);
      const monthGoal = weeklyGoal * weeksInMonth;
      const percent = monthGoal ? Math.min(100, Math.round((doneCount / monthGoal) * 100)) : 0;

      return {
        label: habit.name,
        value: percent,
        valueLabel: `${percent}%`,
        meta: `${doneCount}/${monthGoal} check-ins`,
      };
    });
  }

  function CroakleGetWeeklyTrendRows(year, month) {
    const daysInMonth = CroakleGetDaysInMonth(year, month);
    const weekMap = new Map();

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const weekStart = CroakleShiftDate(date, -((date.getDay() + 6) % 7));
      const weekKey = CroakleFormatDate(weekStart);
      const dayTotal = CroakleGetMonthData(year, month).habits.reduce((total, habit) => {
        return total + (habit.days[day - 1] ? 1 : 0);
      }, 0);

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { days: [], total: 0 });
      }

      weekMap.get(weekKey).days.push(day);
      weekMap.get(weekKey).total += dayTotal;
    }

    return Array.from(weekMap.values()).map((week, index) => ({
      label: `Week ${index + 1}`,
      value: week.total,
      valueLabel: `${week.total}`,
      meta: `Day ${week.days[0]}-${week.days.at(-1)}`,
    }));
  }

  function CroakleGetMoodRows(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const moodNames = {
      1: "Terrible",
      2: "Annoyed",
      3: "Okay",
      4: "Good",
      5: "Excellent",
    };

    return [1, 2, 3, 4, 5].map((moodValue) => {
      const count = monthData.moods.filter((mood) => mood === moodValue).length;

      return {
        label: moodNames[moodValue],
        value: count,
        valueLabel: `${count}`,
        meta: `Mood level ${moodValue}`,
      };
    });
  }

  function CroakleGetWeekdayRows(year, month) {
    const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Array.from({ length: 7 }, () => 0);
    const monthData = CroakleGetMonthData(year, month);
    const daysInMonth = CroakleGetDaysInMonth(year, month);

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const weekdayIndex = (date.getDay() + 6) % 7;
      counts[weekdayIndex] += monthData.habits.reduce((total, habit) => total + (habit.days[day - 1] ? 1 : 0), 0);
    }

    return weekdayNames.map((weekday, index) => ({
      label: weekday,
      value: counts[index],
      valueLabel: `${counts[index]}`,
      meta: "habit check-ins",
    }));
  }

  function CroakleGetProjectSummary() {
    try {
      const saved = localStorage.getItem(CroakleAnalyticsProjectStoreKey);
      const projects = JSON.parse(saved || "{}")?.projects || [];
      const active = projects.filter((project) => !project.completed).length;
      const done = projects.filter((project) => project.completed).length;
      const tracked = projects.reduce((total, project) => {
        return total + Object.values(project.weeklyDays || {}).flat().filter(Boolean).length;
      }, 0);

      return { active, done, tracked };
    } catch {
      return { active: 0, done: 0, tracked: 0 };
    }
  }

  function CroakleGetSummaryCards(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const completionRows = CroakleGetHabitCompletionRows(year, month);
    const projectSummary = CroakleGetProjectSummary();
    const totalCheckins = monthData.habits.reduce((total, habit) => total + CroakleCountDone(habit.days), 0);
    const moodValues = monthData.moods.filter(Boolean);
    const averageMood = moodValues.length ? (moodValues.reduce((total, mood) => total + mood, 0) / moodValues.length).toFixed(1) : "—";
    const bestHabit = [...completionRows].sort((first, second) => second.value - first.value)[0];

    return [
      { value: totalCheckins, label: "Check-ins", meta: `${monthData.habits.length} habits` },
      { value: averageMood, label: "Avg mood", meta: `${moodValues.length} entries` },
      { value: bestHabit?.label || "—", label: "Best habit", meta: bestHabit ? bestHabit.valueLabel : "No data" },
      { value: `${projectSummary.active}/${projectSummary.done}`, label: "Projects", meta: `${projectSummary.tracked} check-ins` },
    ];
  }

  function CroakleCreateSummaryCards(cards) {
    return cards.map((card) => `
      <article class="CroakleAnalyticsStatCard">
        <strong>${CroakleEscapeHtml(card.value)}</strong>
        <span>${CroakleEscapeHtml(card.label)}</span>
        <small>${CroakleEscapeHtml(card.meta)}</small>
      </article>
    `).join("");
  }

  function CroakleRenderAnalyticsPage() {
    CroakleEnsureAnalyticsMonth();

    const summary = document.querySelector("#CroakleAnalyticsSummary");
    const panels = document.querySelector("#CroakleAnalyticsPanels");
    const monthLabel = document.querySelector("#CroakleAnalyticsMonthLabel");

    if (!summary || !panels || !monthLabel) {
      return;
    }

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;

    monthLabel.textContent = CroakleGetMonthLabel(year, month);
    summary.innerHTML = CroakleCreateSummaryCards(CroakleGetSummaryCards(year, month));
    panels.innerHTML = [
      CroakleCreatePanel("Habit Completion", "Done compared with this month target", CroakleGetHabitCompletionRows(year, month)),
      CroakleCreatePanel("Weekly Trend", "Total habit check-ins by week", CroakleGetWeeklyTrendRows(year, month)),
      CroakleCreatePanel("Mood Distribution", "Mood levels recorded this month", CroakleGetMoodRows(year, month)),
      CroakleCreatePanel("Weekday Consistency", "Which weekdays work best", CroakleGetWeekdayRows(year, month)),
    ].join("");
  }

  function CroakleInitAnalytics() {
    CroakleEnsureAnalyticsMonth();
    CroakleInjectAnalyticsStyles();
    CroakleInjectAnalyticsPage();
    CroakleInjectAnalyticsButtons();
    CroaklePatchAnalyticsNavigation();
    CroakleBindAnalyticsEvents();
    CroakleRenderAnalyticsPage();
  }

  CroakleInitAnalytics();
})();
