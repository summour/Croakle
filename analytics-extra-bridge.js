(() => {
  const CroakleExtraProjectStoreKey = "CroakleProjectDataV1";
  const CroakleExtraChartOrder = [
    "Productivity of the day",
    "Weekly Trend",
    "Habit Completion",
    "Weekday Consistency",
    "Project Weekly Trend",
    "Project Completion",
    "Project Priority",
    "Finished Projects Timeline",
    "Mood by Date",
    "Mood Distribution",
  ];

  function CroakleExtraEscape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleExtraShiftDate(date, amount) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function CroakleExtraFormatDate(date) {
    return typeof CroakleFormatDate === "function"
      ? CroakleFormatDate(date)
      : [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function CroakleExtraMonthKey(year, month) {
    return typeof CroakleGetMonthKey === "function" ? CroakleGetMonthKey(year, month) : `${year}-${String(month + 1).padStart(2, "0")}`;
  }

  function CroakleExtraDaysInMonth(year, month) {
    return typeof CroakleGetDaysInMonth === "function" ? CroakleGetDaysInMonth(year, month) : new Date(year, month + 1, 0).getDate();
  }

  function CroakleExtraGetWeekStarts(year, month) {
    const seen = new Set();
    const weekStarts = [];

    for (let day = 1; day <= CroakleExtraDaysInMonth(year, month); day += 1) {
      const date = new Date(year, month, day);
      const weekStart = CroakleExtraShiftDate(date, -((date.getDay() + 6) % 7));
      const weekKey = CroakleExtraFormatDate(weekStart);

      if (!seen.has(weekKey)) {
        seen.add(weekKey);
        weekStarts.push(weekStart);
      }
    }

    return weekStarts;
  }

  function CroakleExtraLoadProjects() {
    try {
      const state = JSON.parse(localStorage.getItem(CroakleExtraProjectStoreKey) || "{}");
      return Array.isArray(state.projects) ? state.projects : [];
    } catch {
      return [];
    }
  }

  function CroakleExtraClampGoal(goal) {
    const cleanGoal = Number(goal);
    return Number.isFinite(cleanGoal) ? Math.min(7, Math.max(1, Math.round(cleanGoal))) : 1;
  }

  function CroakleExtraCountProjectWeek(project, weekStart, year, month) {
    const weekKey = CroakleExtraFormatDate(weekStart);
    const days = Array.isArray(project.weeklyDays?.[weekKey]) ? project.weeklyDays[weekKey] : [];

    return days.reduce((total, done, index) => {
      const date = CroakleExtraShiftDate(weekStart, index);
      const isTargetMonth = date.getFullYear() === year && date.getMonth() === month;
      return total + (done && isTargetMonth ? 1 : 0);
    }, 0);
  }

  function CroakleExtraCountProjectMonth(project, year, month) {
    return CroakleExtraGetWeekStarts(year, month).reduce((total, weekStart) => {
      return total + CroakleExtraCountProjectWeek(project, weekStart, year, month);
    }, 0);
  }

  function CroakleExtraSmoothPath(points) {
    if (!points.length) {
      return "";
    }

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let index = 0; index < points.length - 1; index += 1) {
      const previous = points[index - 1] || points[index];
      const current = points[index];
      const next = points[index + 1];
      const afterNext = points[index + 2] || next;
      path += ` C ${current.x + (next.x - previous.x) / 6} ${current.y + (next.y - previous.y) / 6}, ${next.x - (afterNext.x - current.x) / 6} ${next.y - (afterNext.y - current.y) / 6}, ${next.x} ${next.y}`;
    }

    return path;
  }

  function CroakleExtraShortLabel(label, maxLength = 8) {
    const text = String(label ?? "").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  }

  function CroakleExtraCreateLineChart(rows, options = {}) {
    if (!rows.length) {
      return `<p class="CroakleAnalyticsEmptyText">No data yet.</p>`;
    }

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
    const linePath = CroakleExtraSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
    const gridValues = options.gridValues || Array.from({ length: 5 }, (_, index) => Math.round((maxValue / 4) * index));
    const labelStep = options.labelStep || Math.max(1, Math.ceil(rows.length / 7));

    const gridLines = gridValues.map((value) => {
      const y = paddingTop + chartHeight - (value / maxValue) * chartHeight;
      const label = options.ySuffix ? `${value}${options.ySuffix}` : value;
      return `<line class="CroakleAnalyticsGridLine" x1="${paddingLeft}" y1="${y}" x2="${rightX}" y2="${y}"></line><text class="CroakleAnalyticsAxisLabel" x="${paddingLeft - 6}" y="${y + 3}" text-anchor="end">${label}</text>`;
    }).join("");

    const pointMarkup = points.map((point, index) => {
      const showLabel = index === 0 || index === points.length - 1 || index % labelStep === 0;
      const label = showLabel ? `<text class="CroakleAnalyticsAxisLabel" x="${point.x}" y="${height - 8}" text-anchor="middle">${CroakleExtraEscape(CroakleExtraShortLabel(point.label, options.labelLength || 8))}</text>` : "";
      return `<circle class="CroakleAnalyticsPoint" cx="${point.x}" cy="${point.y}" r="3.8"></circle>${label}`;
    }).join("");

    return `<div class="CroakleAnalyticsLineWrap"><svg class="CroakleAnalyticsLineSvg" viewBox="0 0 ${width} ${height}" aria-hidden="true">${gridLines}<line class="CroakleAnalyticsAxisLine" x1="${paddingLeft}" y1="${bottomY}" x2="${rightX}" y2="${bottomY}"></line><line class="CroakleAnalyticsAxisLine" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${bottomY}"></line><path class="CroakleAnalyticsLineArea" d="${areaPath}"></path>${points.length > 1 ? `<path class="CroakleAnalyticsLinePath" d="${linePath}"></path>` : ""}${pointMarkup}</svg></div>`;
  }

  function CroakleExtraCreateLegend(rows) {
    return `<div class="CroakleAnalyticsLegend">${rows.map((row) => `<div class="CroakleAnalyticsLegendRow"><span class="CroakleAnalyticsLegendLabel">${CroakleExtraEscape(row.label)}</span><span class="CroakleAnalyticsLegendValue">${CroakleExtraEscape(row.valueLabel)}</span><span class="CroakleAnalyticsLegendMeta">${CroakleExtraEscape(row.meta || "")}</span></div>`).join("")}</div>`;
  }

  function CroakleExtraCreatePanel(title, subtitle, rows, options = {}) {
    return `<article class="CroakleAnalyticsPanel CroakleExtraAnalyticsPanel" data-extra-analytics="true"><header class="CroakleAnalyticsPanelHeader"><h3>${CroakleExtraEscape(title)}</h3><p>${CroakleExtraEscape(subtitle)}</p></header>${CroakleExtraCreateLineChart(rows, options)}${CroakleExtraCreateLegend(rows)}</article>`;
  }

  function CroakleExtraMoodByDateRows(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const moodNames = { 0: "No mood", 1: "Terrible", 2: "Annoyed", 3: "Okay", 4: "Good", 5: "Excellent" };

    return Array.from({ length: CroakleExtraDaysInMonth(year, month) }, (_, index) => {
      const moodLevel = Number(monthData.moods[index] || 0);
      return { label: String(index + 1), value: moodLevel, valueLabel: moodLevel ? String(moodLevel) : "—", meta: moodNames[moodLevel] || "No mood" };
    });
  }

  function CroakleExtraProjectWeeklyRows(projects, year, month) {
    return CroakleExtraGetWeekStarts(year, month).map((weekStart, index) => {
      const total = projects.reduce((sum, project) => sum + CroakleExtraCountProjectWeek(project, weekStart, year, month), 0);
      const firstDay = new Date(Math.max(weekStart.getTime(), new Date(year, month, 1).getTime())).getDate();
      const lastDay = new Date(Math.min(CroakleExtraShiftDate(weekStart, 6).getTime(), new Date(year, month + 1, 0).getTime())).getDate();
      return { label: `Week ${index + 1}`, value: total, valueLabel: String(total), meta: `Day ${firstDay}-${lastDay}` };
    });
  }

  function CroakleExtraProjectCompletionRows(projects, year, month) {
    const weeksCount = CroakleExtraGetWeekStarts(year, month).length;

    return projects
      .filter((project) => !project.completed || CroakleExtraCountProjectMonth(project, year, month) > 0)
      .map((project) => {
        const done = CroakleExtraCountProjectMonth(project, year, month);
        const goal = CroakleExtraClampGoal(project.goal) * weeksCount;
        const percent = goal ? Math.min(100, Math.round((done / goal) * 100)) : 0;
        return { label: project.name || "Project", value: percent, valueLabel: `${percent}%`, meta: `${done}/${goal} check-ins` };
      });
  }

  function CroakleExtraProjectPriorityRows(projects) {
    const counts = { High: 0, Medium: 0, Low: 0 };
    projects.filter((project) => !project.completed).forEach((project) => {
      const priority = String(project.priority || "medium").toLowerCase();
      counts[priority === "high" ? "High" : priority === "low" ? "Low" : "Medium"] += 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value, valueLabel: String(value), meta: "active projects" }));
  }

  function CroakleExtraFinishedProjectRows(projects, year, month) {
    return Array.from({ length: 6 }, (_, offset) => {
      const date = new Date(year, month - 5 + offset, 1);
      const monthKey = CroakleExtraMonthKey(date.getFullYear(), date.getMonth());
      const value = projects.filter((project) => String(project.completedWeekKey || "").startsWith(monthKey)).length;
      return { label: date.toLocaleDateString("en-US", { month: "short" }), value, valueLabel: String(value), meta: `${date.getFullYear()} finished` };
    });
  }

  function CroakleExtraPanelTitle(panel) {
    return panel.querySelector(".CroakleAnalyticsPanelHeader h3")?.textContent?.trim() || "";
  }

  function CroakleExtraOrderPanels() {
    const panels = document.querySelector("#CroakleAnalyticsPanels");

    if (!panels) {
      return;
    }

    Array.from(panels.querySelectorAll(":scope > .CroakleAnalyticsPanel"))
      .sort((firstPanel, secondPanel) => {
        const firstIndex = CroakleExtraChartOrder.indexOf(CroakleExtraPanelTitle(firstPanel));
        const secondIndex = CroakleExtraChartOrder.indexOf(CroakleExtraPanelTitle(secondPanel));
        return (firstIndex === -1 ? CroakleExtraChartOrder.length : firstIndex) - (secondIndex === -1 ? CroakleExtraChartOrder.length : secondIndex);
      })
      .forEach((panel) => panels.appendChild(panel));
  }

  function CroakleExtraRenderPanels() {
    const panels = document.querySelector("#CroakleAnalyticsPanels");

    if (!panels || !Number.isInteger(CroakleState.analyticsYear) || !Number.isInteger(CroakleState.analyticsMonth)) {
      return;
    }

    panels.querySelectorAll('[data-extra-analytics="true"]').forEach((panel) => panel.remove());

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;
    const projects = CroakleExtraLoadProjects();

    panels.insertAdjacentHTML("beforeend", [
      CroakleExtraCreatePanel("Project Weekly Trend", "X = week, Y = project check-ins", CroakleExtraProjectWeeklyRows(projects, year, month)),
      CroakleExtraCreatePanel("Project Completion", "X = project, Y = monthly completion percent", CroakleExtraProjectCompletionRows(projects, year, month), { maxValue: 100, gridValues: [0, 20, 40, 60, 80, 100], ySuffix: "%" }),
      CroakleExtraCreatePanel("Project Priority", "X = priority, Y = active project count", CroakleExtraProjectPriorityRows(projects)),
      CroakleExtraCreatePanel("Finished Projects Timeline", "X = month, Y = finished projects", CroakleExtraFinishedProjectRows(projects, year, month)),
      CroakleExtraCreatePanel("Mood by Date", "X = date, Y = mood level", CroakleExtraMoodByDateRows(year, month), { maxValue: 5, gridValues: [0, 1, 2, 3, 4, 5], labelStep: 5, labelLength: 2 }),
    ].join(""));

    CroakleExtraOrderPanels();
  }

  function CroakleExtraScheduleRender() {
    window.requestAnimationFrame(CroakleExtraRenderPanels);
  }

  function CroakleExtraPatchNavigation() {
    if (window.CroakleExtraAnalyticsPatched || typeof CroakleSetPage !== "function") {
      return;
    }

    window.CroakleExtraAnalyticsPatched = true;
    const originalSetPage = CroakleSetPage;

    CroakleSetPage = function CroakleSetPageWithStableExtras(pageName) {
      originalSetPage(pageName);

      if (pageName === "analysis") {
        CroakleExtraScheduleRender();
      }
    };
  }

  function CroakleExtraBindEvents() {
    if (window.CroakleExtraAnalyticsEventsBound) {
      return;
    }

    window.CroakleExtraAnalyticsEventsBound = true;

    document.addEventListener("click", (event) => {
      if (event.target.closest("#CroakleAnalyticsPreviousMonth, #CroakleAnalyticsNextMonth, [data-page-target='analysis']")) {
        CroakleExtraScheduleRender();
      }
    });
  }

  CroakleExtraPatchNavigation();
  CroakleExtraBindEvents();
  CroakleExtraScheduleRender();
})();
