(() => {
  if (typeof CroakleState === "undefined" || typeof CroakleSetPage !== "function") return;

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

    if (changed) CroakleSaveState();
  }

  function CroakleInjectAnalyticsStyles() {
    if (document.querySelector("#CroakleAnalyticsStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleAnalyticsStyles";
    style.textContent = `
      .CroakleAnalyticsNav { grid-template-columns: repeat(6, minmax(0, 1fr)); }
      .CroakleAnalyticsNav button { font-size: clamp(12px, 3vw, 14px); }
      .CroakleAnalyticsPage .CroakleCard { --CroakleAnalyticsGap: 16px; gap: var(--CroakleAnalyticsGap); }
      .CroakleAnalyticsScroll { display: grid; gap: var(--CroakleAnalyticsGap); min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none; -webkit-overflow-scrolling: touch; padding-bottom: var(--CroakleAnalyticsGap); }
      .CroakleAnalyticsScroll::-webkit-scrollbar { display: none; }
      .CroakleAnalyticsSummary, .CroakleAnalyticsPanels { display: grid; gap: var(--CroakleAnalyticsGap); }
      .CroakleAnalyticsSummary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .CroakleAnalyticsStatCard, .CroakleAnalyticsPanel { border: 2px solid var(--CroakleLine); border-radius: 20px; background: var(--CroakleSurface); }
      .CroakleAnalyticsStatCard { display: grid; gap: 4px; min-width: 0; padding: 12px; }
      .CroakleAnalyticsStatCard strong { min-width: 0; color: var(--CroakleText); font-size: clamp(22px, 7vw, 30px); font-weight: 900; line-height: 0.96; letter-spacing: -0.06em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .CroakleAnalyticsStatCard span, .CroakleAnalyticsStatCard small, .CroakleAnalyticsPanelHeader p, .CroakleAnalyticsLegendMeta, .CroakleAnalyticsEmptyText, .CroakleAnalyticsAxisLabel { color: var(--CroakleMuted); font-size: 12px; font-weight: 800; line-height: 1.25; }
      .CroakleAnalyticsStatCard span { color: var(--CroakleText); font-size: 13px; }
      .CroakleAnalyticsPanel { display: grid; gap: 12px; padding: 14px; }
      .CroakleAnalyticsPanelHeader { display: grid; gap: 4px; }
      .CroakleAnalyticsPanelHeader h3 { margin: 0; font-size: 23px; font-weight: 900; line-height: 1; letter-spacing: -0.05em; }
      .CroakleAnalyticsPanelHeader p, .CroakleAnalyticsEmptyText { margin: 0; }
      .CroakleAnalyticsLineWrap { border-radius: 16px; background: rgba(0, 0, 0, 0.02); padding: 10px 8px 6px; }
      .CroakleAnalyticsLineSvg { display: block; width: 100%; height: auto; }
      .CroakleAnalyticsGridLine { stroke: var(--CroakleSoftLine); stroke-width: 1; }
      .CroakleAnalyticsAxisLine { stroke: var(--CroakleLine); stroke-width: 1.5; }
      .CroakleAnalyticsAxisLabel { fill: var(--CroakleMuted); font-size: 10px; font-weight: 800; }
      .CroakleAnalyticsLineArea { fill: rgba(0, 0, 0, 0.08); }
      .CroakleAnalyticsLinePath { fill: none; stroke: var(--CroakleLine); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .CroakleAnalyticsPoint { fill: var(--CroakleSurface); stroke: var(--CroakleLine); stroke-width: 2; }
      .CroakleAnalyticsPointValue { fill: var(--CroakleText); font-size: 10px; font-weight: 900; }
      .CroakleAnalyticsLegend { display: grid; gap: 8px; }
      .CroakleAnalyticsLegendRow { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; align-items: start; }
      .CroakleAnalyticsLegendLabel { min-width: 0; color: var(--CroakleText); font-size: 14px; font-weight: 900; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .CroakleAnalyticsLegendValue { color: var(--CroakleText); font-size: 13px; font-weight: 900; white-space: nowrap; }
      .CroakleAnalyticsLegendMeta { grid-column: 1 / -1; }
      .CroakleAnalyticsEmptyText { text-align: center; }
      .CroakleAnalysisBestHeader, .CroakleAnalysisBestRow { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(100px, 1fr) 44px 44px; align-items: center; gap: 8px; }
      .CroakleAnalysisBestHeader { border-bottom: 2px solid var(--CroakleLine); padding-bottom: 8px; color: var(--CroakleText); font-size: 13px; font-weight: 900; }
      .CroakleAnalysisBestList { display: grid; gap: 10px; }
      .CroakleAnalysisBestRow strong { min-width: 0; color: var(--CroakleText); font-size: 15px; font-weight: 900; line-height: 1.05; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .CroakleAnalysisBestRow > span { color: var(--CroakleText); font-size: 15px; font-weight: 900; text-align: center; }
      .CroakleAnalysisBestBar { position: relative; height: 24px; border: 2px solid var(--CroakleLine); border-radius: 999px; overflow: hidden; background: var(--CroakleSurface); }
      .CroakleAnalysisBestBar span { position: absolute; inset: 0 auto 0 0; min-width: 8px; max-width: 100%; border-radius: inherit; background: var(--CroakleLine); }
      .CroakleAnalysisBestBar em { position: absolute; inset: 0; display: grid; place-items: center; color: var(--CroakleText); mix-blend-mode: difference; font-size: 13px; font-style: normal; font-weight: 900; }
      @media (max-width: 380px) {
        .CroakleAnalyticsPage .CroakleCard { --CroakleAnalyticsGap: 16px; }
        .CroakleAnalyticsNav button { font-size: 12px; }
        .CroakleAnalyticsStatCard, .CroakleAnalyticsPanel { border-radius: 18px; padding: 11px; }
        .CroakleAnalysisBestHeader, .CroakleAnalysisBestRow { grid-template-columns: minmax(0, 1fr) minmax(84px, 0.9fr) 34px 34px; gap: 6px; }
        .CroakleAnalysisBestHeader, .CroakleAnalysisBestRow strong, .CroakleAnalysisBestRow > span { font-size: 12px; }
        .CroakleAnalysisBestBar { height: 20px; }
        .CroakleAnalysisBestBar em { font-size: 11px; }
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleInjectAnalyticsPage() {
    if (document.querySelector('[data-page="analysis"]')) return;
    const projectPage = document.querySelector('[data-page="project"]');
    if (!projectPage) return;

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

  function CroakleRemoveBestEntryPoints() {
    document.querySelectorAll('[data-page-target="best"]').forEach((button) => button.remove());
  }

  function CroakleRemoveBestPage() {
    document.querySelector('[data-page="best"]')?.remove();
  }

  function CroaklePatchMainRenderWithoutBest() {
    if (window.CroakleBestRetiredFromRender) return;
    window.CroakleBestRetiredFromRender = true;

    window.CroakleRenderBestList = function CroakleRetiredBestList() {};

    if (typeof window.CroakleRenderAll === "function") {
      window.CroakleRenderAll = function CroakleRenderAllWithoutBest() {
        CroakleRenderTrackHeader?.();
        CroakleRenderTrackList?.();
        CroakleRenderMoodCalendar?.();
        CroakleScrollCurrentDateIntoView?.();

        if (document.querySelector('[data-page="analysis"]')?.classList.contains("CroaklePageActive")) {
          CroakleRenderAnalyticsPage();
        }
      };
    }
  }

  function CroakleInjectAnalyticsButtons() {
    const menuList = document.querySelector(".CroakleMenuList");
    const bottomNav = document.querySelector(".CroakleBottomNav");

    CroakleRemoveBestEntryPoints();

    if (menuList && !document.querySelector("#CroakleOpenAnalyticsFromMenu")) {
      menuList.insertAdjacentHTML("beforeend", `<button id="CroakleOpenAnalyticsFromMenu" type="button" data-page-target="analysis"><span>Stats</span><span>›</span></button>`);
    }

    if (bottomNav && !document.querySelector("#CroakleOpenAnalyticsFromNav")) {
      bottomNav.classList.add("CroakleAnalyticsNav");
      bottomNav.insertAdjacentHTML("beforeend", `<button id="CroakleOpenAnalyticsFromNav" type="button" data-page-target="analysis">Stats</button>`);
    }
  }

  function CroaklePatchAnalyticsNavigation() {
    if (window.CroakleAnalyticsNavigationPatched) return;
    window.CroakleAnalyticsNavigationPatched = true;

    CroakleSetPage = function CroakleSetPageWithAnalytics(pageName) {
      const safePageName = pageName === "best" ? "analysis" : pageName;

      document.querySelectorAll("[data-page]").forEach((page) => {
        page.classList.toggle("CroaklePageActive", page.dataset.page === safePageName);
      });

      document.querySelectorAll("[data-page-target]").forEach((button) => {
        button.classList.toggle("CroakleActiveNav", button.dataset.pageTarget === safePageName);
      });

      const bottomNav = document.querySelector(".CroakleBottomNav");
      if (bottomNav) bottomNav.hidden = safePageName === "menu";

      if (safePageName === "analysis") {
        CroakleRenderAnalyticsPage();
        return;
      }

      CroakleScrollCurrentDateIntoView?.();
    };
  }

  function CroakleBindAnalyticsEvents() {
    if (window.CroakleAnalyticsEventsBound) return;
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
    if (typeof CroakleGetHabitGoalForMonth === "function") return CroakleGetHabitGoalForMonth(template, monthKey);
    return CroakleClampGoal(template.goal || habit.goal);
  }

  function CroakleCreateShortLabel(label, maxLength = 8) {
    const cleanLabel = String(label ?? "").trim();
    return cleanLabel.length > maxLength ? `${cleanLabel.slice(0, maxLength)}…` : cleanLabel;
  }

  function CroakleCreateSmoothPath(points) {
    if (!points.length) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const previous = points[index - 1] || points[index];
      const current = points[index];
      const next = points[index + 1];
      const afterNext = points[index + 2] || next;
      const controlOneX = current.x + (next.x - previous.x) / 6;
      const controlOneY = current.y + (next.y - previous.y) / 6;
      const controlTwoX = next.x - (afterNext.x - current.x) / 6;
      const controlTwoY = next.y - (afterNext.y - current.y) / 6;
      path += ` C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${next.x} ${next.y}`;
    }
    return path;
  }

  function CroakleCreateLineChart(rows, options = {}) {
    if (!rows.length) return `<p class="CroakleAnalyticsEmptyText">No data yet.</p>`;
    const width = 340;
    const height = 180;
    const paddingTop = 16;
    const paddingRight = 12;
    const paddingBottom = 28;
    const paddingLeft = 36;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxValue = options.maxValue || Math.max(...rows.map((row) => row.value), 1);
    const bottomY = height - paddingBottom;
    const rightX = width - paddingRight;
    const points = rows.map((row, index) => {
      const x = rows.length === 1 ? paddingLeft + chartWidth / 2 : paddingLeft + (chartWidth * index) / (rows.length - 1);
      const y = paddingTop + chartHeight - (row.value / maxValue) * chartHeight;
      return { ...row, x, y };
    });
    const linePath = CroakleCreateSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
    const gridValues = options.gridValues || Array.from({ length: 5 }, (_, index) => Math.round((maxValue / 4) * index));
    const gridLines = gridValues.map((value) => {
      const y = paddingTop + chartHeight - (value / maxValue) * chartHeight;
      const label = options.ySuffix ? `${value}${options.ySuffix}` : value;
      return `<line class="CroakleAnalyticsGridLine" x1="${paddingLeft}" y1="${y}" x2="${rightX}" y2="${y}"></line><text class="CroakleAnalyticsAxisLabel" x="${paddingLeft - 6}" y="${y + 3}" text-anchor="end">${label}</text>`;
    }).join("");
    const labelStep = options.labelStep || Math.max(1, Math.ceil(rows.length / 7));
    const pointMarkup = points.map((point, index) => {
      const showLabel = index === 0 || index === points.length - 1 || index % labelStep === 0;
      const label = showLabel ? `<text class="CroakleAnalyticsAxisLabel" x="${point.x}" y="${height - 8}" text-anchor="middle">${CroakleEscapeHtml(CroakleCreateShortLabel(point.label, options.labelLength || 8))}</text>` : "";
      const valueLabel = options.showPointValues ? `<text class="CroakleAnalyticsPointValue" x="${point.x}" y="${point.y - 9}" text-anchor="middle">${CroakleEscapeHtml(point.valueLabel)}</text>` : "";
      return `<circle class="CroakleAnalyticsPoint" cx="${point.x}" cy="${point.y}" r="3.8"></circle>${valueLabel}${label}`;
    }).join("");
    return `<div class="CroakleAnalyticsLineWrap"><svg class="CroakleAnalyticsLineSvg" viewBox="0 0 ${width} ${height}" aria-hidden="true">${gridLines}<line class="CroakleAnalyticsAxisLine" x1="${paddingLeft}" y1="${bottomY}" x2="${rightX}" y2="${bottomY}"></line><line class="CroakleAnalyticsAxisLine" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${bottomY}"></line><path class="CroakleAnalyticsLineArea" d="${areaPath}"></path>${points.length > 1 ? `<path class="CroakleAnalyticsLinePath" d="${linePath}"></path>` : ""}${pointMarkup}</svg></div>`;
  }

  function CroakleCreateLegend(rows) {
    return `<div class="CroakleAnalyticsLegend">${rows.map((row) => `<div class="CroakleAnalyticsLegendRow"><span class="CroakleAnalyticsLegendLabel">${CroakleEscapeHtml(row.label)}</span><span class="CroakleAnalyticsLegendValue">${CroakleEscapeHtml(row.valueLabel)}</span><span class="CroakleAnalyticsLegendMeta">${CroakleEscapeHtml(row.meta || "")}</span></div>`).join("")}</div>`;
  }

  function CroakleCreatePanel(title, subtitle, rows, chartOptions = {}) {
    return `<article class="CroakleAnalyticsPanel"><header class="CroakleAnalyticsPanelHeader"><h3>${CroakleEscapeHtml(title)}</h3><p>${CroakleEscapeHtml(subtitle)}</p></header>${CroakleCreateLineChart(rows, chartOptions)}${CroakleCreateLegend(rows)}</article>`;
  }

  function CroakleGetBestHabitRows(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    return monthData.habits.map((habit) => {
      const doneCount = CroakleCountDone(habit.days);
      const percent = Math.round((doneCount / Math.max(habit.days.length, 1)) * 100);
      return { name: habit.name.replace(" with Study Bunny", ""), percent, month: doneCount, lifetime: Number(habit.lifetime || 0) + doneCount };
    }).sort((first, second) => second.percent - first.percent);
  }

  function CroakleCreateBestHabitsPanel(year, month) {
    const rows = CroakleGetBestHabitRows(year, month);
    return `<article class="CroakleAnalyticsPanel"><header class="CroakleAnalyticsPanelHeader"><h3>Best Habits</h3><p>Moved from the old Best tab. Sorted by completion for ${CroakleEscapeHtml(CroakleGetMonthLabel(year, month))}.</p></header><div class="CroakleAnalysisBestHeader" aria-hidden="true"><span>Habit</span><span>Goal %</span><span>Month</span><span>Life</span></div><div class="CroakleAnalysisBestList">${rows.length ? rows.map((row) => `<section class="CroakleAnalysisBestRow"><strong>${CroakleEscapeHtml(row.name)}</strong><div class="CroakleAnalysisBestBar" aria-label="${row.percent} percent"><span style="width:${row.percent}%"></span><em>${row.percent}%</em></div><span>${row.month}</span><span>${row.lifetime}</span></section>`).join("") : `<p class="CroakleAnalyticsEmptyText">No habit data yet.</p>`}</div></article>`;
  }

  function CroakleGetDailyProductivityRows(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const daysInMonth = CroakleGetDaysInMonth(year, month);
    const totalHabits = Math.max(monthData.habits.length, 1);
    return Array.from({ length: daysInMonth }, (_, index) => {
      const doneCount = monthData.habits.reduce((total, habit) => total + (habit.days[index] ? 1 : 0), 0);
      const percent = Math.round((doneCount / totalHabits) * 100);
      return { label: String(index + 1), value: percent, valueLabel: `${percent}%`, meta: `${doneCount}/${totalHabits} habits done` };
    });
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
      return { label: habit.name, value: percent, valueLabel: `${percent}%`, meta: `${doneCount}/${monthGoal} check-ins` };
    });
  }

  function CroakleGetWeeklyTrendRows(year, month) {
    const daysInMonth = CroakleGetDaysInMonth(year, month);
    const monthData = CroakleGetMonthData(year, month);
    const weekMap = new Map();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const weekStart = CroakleShiftDate(date, -((date.getDay() + 6) % 7));
      const weekKey = CroakleFormatDate(weekStart);
      const dayTotal = monthData.habits.reduce((total, habit) => total + (habit.days[day - 1] ? 1 : 0), 0);
      if (!weekMap.has(weekKey)) weekMap.set(weekKey, { days: [], total: 0 });
      weekMap.get(weekKey).days.push(day);
      weekMap.get(weekKey).total += dayTotal;
    }
    return Array.from(weekMap.values()).map((week, index) => ({ label: `Week ${index + 1}`, value: week.total, valueLabel: `${week.total}`, meta: `Day ${week.days[0]}-${week.days.at(-1)}` }));
  }

  function CroakleGetMoodRows(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const moodNames = { 1: "Terrible", 2: "Annoyed", 3: "Okay", 4: "Good", 5: "Excellent" };
    return [1, 2, 3, 4, 5].map((moodValue) => {
      const count = monthData.moods.filter((mood) => mood === moodValue).length;
      return { label: moodNames[moodValue], value: count, valueLabel: `${count}`, meta: `Mood level ${moodValue}` };
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
    return weekdayNames.map((weekday, index) => ({ label: weekday, value: counts[index], valueLabel: `${counts[index]}`, meta: "habit check-ins" }));
  }

  function CroakleGetProjectSummary() {
    try {
      const saved = localStorage.getItem(CroakleAnalyticsProjectStoreKey);
      const projects = JSON.parse(saved || "{}")?.projects || [];
      const active = projects.filter((project) => !project.completed).length;
      const done = projects.filter((project) => project.completed).length;
      const tracked = projects.reduce((total, project) => total + Object.values(project.weeklyDays || {}).flat().filter(Boolean).length, 0);
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
    return cards.map((card) => `<article class="CroakleAnalyticsStatCard"><strong>${CroakleEscapeHtml(card.value)}</strong><span>${CroakleEscapeHtml(card.label)}</span><small>${CroakleEscapeHtml(card.meta)}</small></article>`).join("");
  }

  function CroakleRenderAnalyticsPage() {
    CroakleEnsureAnalyticsMonth();
    CroakleRemoveBestEntryPoints();
    CroakleRemoveBestPage();

    const summary = document.querySelector("#CroakleAnalyticsSummary");
    const panels = document.querySelector("#CroakleAnalyticsPanels");
    const monthLabel = document.querySelector("#CroakleAnalyticsMonthLabel");
    if (!summary || !panels || !monthLabel) return;

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;
    monthLabel.textContent = CroakleGetMonthLabel(year, month);
    summary.innerHTML = CroakleCreateSummaryCards(CroakleGetSummaryCards(year, month));
    panels.innerHTML = [
      CroakleCreateBestHabitsPanel(year, month),
      CroakleCreatePanel("Productivity of the day", "X = day of month, Y = daily completion rate", CroakleGetDailyProductivityRows(year, month), { maxValue: 100, gridValues: [0, 20, 40, 60, 80, 100], ySuffix: "%", labelStep: 5, labelLength: 2 }),
      CroakleCreatePanel("Habit Completion", "X = habit, Y = monthly completion percent", CroakleGetHabitCompletionRows(year, month), { maxValue: 100, gridValues: [0, 20, 40, 60, 80, 100], ySuffix: "%" }),
      CroakleCreatePanel("Weekly Trend", "X = week, Y = total habit check-ins", CroakleGetWeeklyTrendRows(year, month)),
      CroakleCreatePanel("Mood Distribution", "X = mood level, Y = recorded days", CroakleGetMoodRows(year, month)),
      CroakleCreatePanel("Weekday Consistency", "X = weekday, Y = habit check-ins", CroakleGetWeekdayRows(year, month)),
    ].join("");
  }

  function CroakleInitAnalytics() {
    CroakleEnsureAnalyticsMonth();
    CroakleInjectAnalyticsStyles();
    CroakleInjectAnalyticsPage();
    CroaklePatchMainRenderWithoutBest();
    CroakleInjectAnalyticsButtons();
    CroaklePatchAnalyticsNavigation();
    CroakleBindAnalyticsEvents();
    CroakleRemoveBestPage();
    CroakleRenderAnalyticsPage();
  }

  CroakleInitAnalytics();
})();
