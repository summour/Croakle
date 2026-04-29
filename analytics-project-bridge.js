(() => {
  const CroakleProjectAnalyticsStoreKey = "CroakleProjectDataV1";
  const CroakleProjectAnalyticsChartOrder = [
    "Productivity of the day",
    "Weekly Trend",
    "Habit Completion",
    "Weekday Consistency",
    "Project Weekly Trend",
    "Project Focus Rate",
    "Project Duration",
    "Project Priority",
    "Finished Projects Timeline",
    "Mood by Date",
    "Mood Distribution",
  ];

  function CroakleEscapeProjectAnalyticsHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleLoadProjectAnalyticsState() {
    try {
      const saved = localStorage.getItem(CroakleProjectAnalyticsStoreKey);
      const state = saved ? JSON.parse(saved) : {};
      return Array.isArray(state.projects) ? state.projects : [];
    } catch {
      return [];
    }
  }

  function CroakleProjectAnalyticsShiftDate(date, amount) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function CroakleProjectAnalyticsParseDate(dateKey) {
    const [year, month, day] = String(dateKey || "").split("-").map(Number);

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return null;
    }

    return new Date(year, month - 1, day);
  }

  function CroakleProjectAnalyticsFormatDate(date) {
    if (typeof CroakleFormatDate === "function") {
      return CroakleFormatDate(date);
    }

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function CroakleProjectAnalyticsGetMonthKey(year, month) {
    if (typeof CroakleGetMonthKey === "function") {
      return CroakleGetMonthKey(year, month);
    }

    return `${year}-${String(month + 1).padStart(2, "0")}`;
  }

  function CroakleProjectAnalyticsGetDaysInMonth(year, month) {
    if (typeof CroakleGetDaysInMonth === "function") {
      return CroakleGetDaysInMonth(year, month);
    }

    return new Date(year, month + 1, 0).getDate();
  }

  function CroakleProjectAnalyticsGetWeekStart(date) {
    return CroakleProjectAnalyticsShiftDate(date, -((date.getDay() + 6) % 7));
  }

  function CroakleProjectAnalyticsGetWeekStarts(year, month) {
    const daysInMonth = CroakleProjectAnalyticsGetDaysInMonth(year, month);
    const seen = new Set();
    const weekStarts = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const weekStart = CroakleProjectAnalyticsGetWeekStart(date);
      const weekKey = CroakleProjectAnalyticsFormatDate(weekStart);

      if (!seen.has(weekKey)) {
        seen.add(weekKey);
        weekStarts.push(weekStart);
      }
    }

    return weekStarts;
  }

  function CroakleProjectAnalyticsIsTargetMonth(date, year, month) {
    return date.getFullYear() === year && date.getMonth() === month;
  }

  function CroakleProjectAnalyticsCountWeekDone(project, weekStart, targetYear, targetMonth) {
    const weekKey = CroakleProjectAnalyticsFormatDate(weekStart);
    const days = Array.isArray(project.weeklyDays?.[weekKey]) ? project.weeklyDays[weekKey] : [];

    return days.reduce((total, done, dayIndex) => {
      const date = CroakleProjectAnalyticsShiftDate(weekStart, dayIndex);
      const isTargetMonth = CroakleProjectAnalyticsIsTargetMonth(date, targetYear, targetMonth);
      return total + (done && isTargetMonth ? 1 : 0);
    }, 0);
  }

  function CroakleProjectAnalyticsCountMonthDone(project, year, month) {
    return CroakleProjectAnalyticsGetWeekStarts(year, month).reduce((total, weekStart) => {
      return total + CroakleProjectAnalyticsCountWeekDone(project, weekStart, year, month);
    }, 0);
  }

  function CroakleCreateProjectSmoothPath(points) {
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
      const controlOneX = current.x + (next.x - previous.x) / 6;
      const controlOneY = current.y + (next.y - previous.y) / 6;
      const controlTwoX = next.x - (afterNext.x - current.x) / 6;
      const controlTwoY = next.y - (afterNext.y - current.y) / 6;

      path += ` C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${next.x} ${next.y}`;
    }

    return path;
  }

  function CroakleCreateProjectShortLabel(label, maxLength = 8) {
    const cleanLabel = String(label ?? "").trim();
    return cleanLabel.length > maxLength ? `${cleanLabel.slice(0, maxLength)}…` : cleanLabel;
  }

  function CroakleCreateProjectLineChart(rows, options = {}) {
    if (!rows.length) {
      return `<p class="CroakleAnalyticsEmptyText">No project data yet.</p>`;
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

    const linePath = CroakleCreateProjectSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
    const gridValues = options.gridValues || Array.from({ length: 5 }, (_, index) => Math.round((maxValue / 4) * index));
    const gridLines = gridValues.map((value) => {
      const y = paddingTop + chartHeight - (value / maxValue) * chartHeight;
      const label = options.ySuffix ? `${value}${options.ySuffix}` : value;

      return `
        <line class="CroakleAnalyticsGridLine" x1="${paddingLeft}" y1="${y}" x2="${rightX}" y2="${y}"></line>
        <text class="CroakleAnalyticsAxisLabel" x="${paddingLeft - 6}" y="${y + 3}" text-anchor="end">${label}</text>
      `;
    }).join("");

    const labelStep = options.labelStep || Math.max(1, Math.ceil(rows.length / 7));
    const pointMarkup = points.map((point, index) => {
      const showLabel = index === 0 || index === points.length - 1 || index % labelStep === 0;
      const label = showLabel ? `<text class="CroakleAnalyticsAxisLabel" x="${point.x}" y="${height - 8}" text-anchor="middle">${CroakleEscapeProjectAnalyticsHtml(CroakleCreateProjectShortLabel(point.label, options.labelLength || 8))}</text>` : "";

      return `
        <circle class="CroakleAnalyticsPoint" cx="${point.x}" cy="${point.y}" r="3.8"></circle>
        ${label}
      `;
    }).join("");

    return `
      <div class="CroakleAnalyticsLineWrap">
        <svg class="CroakleAnalyticsLineSvg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
          ${gridLines}
          <line class="CroakleAnalyticsAxisLine" x1="${paddingLeft}" y1="${bottomY}" x2="${rightX}" y2="${bottomY}"></line>
          <line class="CroakleAnalyticsAxisLine" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${bottomY}"></line>
          <path class="CroakleAnalyticsLineArea" d="${areaPath}"></path>
          ${points.length > 1 ? `<path class="CroakleAnalyticsLinePath" d="${linePath}"></path>` : ""}
          ${pointMarkup}
        </svg>
      </div>
    `;
  }

  function CroakleCreateProjectLegend(rows) {
    if (!rows.length) {
      return "";
    }

    return `
      <div class="CroakleAnalyticsLegend">
        ${rows.map((row) => `
          <div class="CroakleAnalyticsLegendRow">
            <span class="CroakleAnalyticsLegendLabel">${CroakleEscapeProjectAnalyticsHtml(row.label)}</span>
            <span class="CroakleAnalyticsLegendValue">${CroakleEscapeProjectAnalyticsHtml(row.valueLabel)}</span>
            <span class="CroakleAnalyticsLegendMeta">${CroakleEscapeProjectAnalyticsHtml(row.meta || "")}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function CroakleCreateProjectPanel(title, subtitle, rows, chartOptions = {}) {
    return `
      <article class="CroakleAnalyticsPanel CroakleProjectAnalyticsPanel" data-project-analytics="true">
        <header class="CroakleAnalyticsPanelHeader">
          <h3>${CroakleEscapeProjectAnalyticsHtml(title)}</h3>
          <p>${CroakleEscapeProjectAnalyticsHtml(subtitle)}</p>
        </header>
        ${CroakleCreateProjectLineChart(rows, chartOptions)}
        ${CroakleCreateProjectLegend(rows)}
      </article>
    `;
  }

  function CroakleGetProjectTrackedDates(project, options = {}) {
    return Object.entries(project.weeklyDays || {})
      .flatMap(([weekKey, days]) => {
        const weekStart = CroakleProjectAnalyticsParseDate(weekKey);

        if (!weekStart || !Array.isArray(days)) {
          return [];
        }

        return days
          .map((done, dayIndex) => done ? CroakleProjectAnalyticsShiftDate(weekStart, dayIndex) : null)
          .filter(Boolean);
      })
      .filter((date) => {
        if (!Number.isInteger(options.year) || !Number.isInteger(options.month)) {
          return true;
        }

        return CroakleProjectAnalyticsIsTargetMonth(date, options.year, options.month);
      })
      .sort((firstDate, secondDate) => firstDate.getTime() - secondDate.getTime());
  }

  function CroakleGetProjectTrackedRangeDays(project, year, month) {
    const trackedDates = CroakleGetProjectTrackedDates(project, { year, month });

    if (!trackedDates.length) {
      return 0;
    }

    const firstDate = trackedDates[0];
    const lastDate = trackedDates[trackedDates.length - 1];
    return Math.max(1, Math.round((lastDate.getTime() - firstDate.getTime()) / 86400000) + 1);
  }

  function CroakleShouldShowProjectAnalyticsRow(project, year, month) {
    const monthKey = CroakleProjectAnalyticsGetMonthKey(year, month);
    const hasMonthTracking = CroakleProjectAnalyticsCountMonthDone(project, year, month) > 0;
    const finishedThisMonth = String(project.completedWeekKey || "").startsWith(monthKey);

    return !project.completed || hasMonthTracking || finishedThisMonth;
  }

  function CroakleGetProjectWeeklyRows(projects, year, month) {
    return CroakleProjectAnalyticsGetWeekStarts(year, month).map((weekStart, index) => {
      const total = projects.reduce((sum, project) => {
        return sum + CroakleProjectAnalyticsCountWeekDone(project, weekStart, year, month);
      }, 0);
      const firstDay = new Date(Math.max(weekStart.getTime(), new Date(year, month, 1).getTime())).getDate();
      const lastWeekDay = CroakleProjectAnalyticsShiftDate(weekStart, 6);
      const lastDay = new Date(Math.min(lastWeekDay.getTime(), new Date(year, month + 1, 0).getTime())).getDate();

      return {
        label: `Week ${index + 1}`,
        value: total,
        valueLabel: String(total),
        meta: `Day ${firstDay}-${lastDay}`,
      };
    });
  }

  function CroakleGetProjectFocusRows(projects, year, month) {
    return projects
      .filter((project) => CroakleShouldShowProjectAnalyticsRow(project, year, month))
      .map((project) => {
        const trackedDays = CroakleProjectAnalyticsCountMonthDone(project, year, month);
        const activeDays = CroakleGetProjectTrackedRangeDays(project, year, month);
        const percent = activeDays ? Math.min(100, Math.round((trackedDays / activeDays) * 100)) : 0;

        return {
          label: project.name || "Project",
          value: percent,
          valueLabel: `${percent}%`,
          meta: `${trackedDays}/${activeDays || 0} active days`,
        };
      });
  }

  function CroakleGetProjectDurationRows(projects, year, month) {
    return projects
      .filter((project) => CroakleShouldShowProjectAnalyticsRow(project, year, month))
      .map((project) => {
        const trackedDays = CroakleProjectAnalyticsCountMonthDone(project, year, month);
        const activeDays = CroakleGetProjectTrackedRangeDays(project, year, month);

        return {
          label: project.name || "Project",
          value: activeDays,
          valueLabel: `${activeDays}d`,
          meta: `${trackedDays} check-ins`,
        };
      });
  }

  function CroakleGetProjectPriorityRows(projects) {
    const priorityCounts = { High: 0, Medium: 0, Low: 0 };

    projects
      .filter((project) => !project.completed)
      .forEach((project) => {
        const priority = String(project.priority || "medium").toLowerCase();

        if (priority === "high") {
          priorityCounts.High += 1;
          return;
        }

        if (priority === "low") {
          priorityCounts.Low += 1;
          return;
        }

        priorityCounts.Medium += 1;
      });

    return Object.entries(priorityCounts).map(([label, value]) => ({
      label,
      value,
      valueLabel: String(value),
      meta: "active projects",
    }));
  }

  function CroakleGetFinishedProjectRows(projects, year, month) {
    return Array.from({ length: 6 }, (_, offset) => {
      const date = new Date(year, month - 5 + offset, 1);
      const monthKey = CroakleProjectAnalyticsGetMonthKey(date.getFullYear(), date.getMonth());
      const value = projects.filter((project) => String(project.completedWeekKey || "").startsWith(monthKey)).length;

      return {
        label: date.toLocaleDateString("en-US", { month: "short" }),
        value,
        valueLabel: String(value),
        meta: `${date.getFullYear()} finished`,
      };
    });
  }

  function CroakleCreateProjectAnalyticsMarkup(year, month) {
    const projects = CroakleLoadProjectAnalyticsState();

    return [
      CroakleCreateProjectPanel(
        "Project Weekly Trend",
        "X = week, Y = project check-ins",
        CroakleGetProjectWeeklyRows(projects, year, month)
      ),
      CroakleCreateProjectPanel(
        "Project Focus Rate",
        "X = project, Y = check-ins during active days",
        CroakleGetProjectFocusRows(projects, year, month),
        {
          maxValue: 100,
          gridValues: [0, 20, 40, 60, 80, 100],
          ySuffix: "%",
        }
      ),
      CroakleCreateProjectPanel(
        "Project Duration",
        "X = project, Y = active range days",
        CroakleGetProjectDurationRows(projects, year, month),
        {
          labelLength: 9,
        }
      ),
      CroakleCreateProjectPanel(
        "Project Priority",
        "X = priority, Y = active project count",
        CroakleGetProjectPriorityRows(projects)
      ),
      CroakleCreateProjectPanel(
        "Finished Projects Timeline",
        "X = month, Y = finished projects",
        CroakleGetFinishedProjectRows(projects, year, month)
      ),
    ].join("");
  }

  function CroakleGetProjectPanelTitle(panel) {
    return panel.querySelector(".CroakleAnalyticsPanelHeader h3")?.textContent?.trim() || "";
  }

  function CroakleOrderProjectAnalyticsPanels() {
    const panels = document.querySelector("#CroakleAnalyticsPanels");

    if (!panels) {
      return;
    }

    Array.from(panels.querySelectorAll(":scope > .CroakleAnalyticsPanel"))
      .sort((firstPanel, secondPanel) => {
        const firstIndex = CroakleProjectAnalyticsChartOrder.indexOf(CroakleGetProjectPanelTitle(firstPanel));
        const secondIndex = CroakleProjectAnalyticsChartOrder.indexOf(CroakleGetProjectPanelTitle(secondPanel));
        const safeFirstIndex = firstIndex === -1 ? CroakleProjectAnalyticsChartOrder.length : firstIndex;
        const safeSecondIndex = secondIndex === -1 ? CroakleProjectAnalyticsChartOrder.length : secondIndex;

        return safeFirstIndex - safeSecondIndex;
      })
      .forEach((panel) => panels.appendChild(panel));
  }

  function CroakleRenderProjectAnalyticsPanels() {
    const panels = document.querySelector("#CroakleAnalyticsPanels");

    if (!panels) {
      return;
    }

    panels.querySelectorAll('[data-project-analytics="true"]').forEach((panel) => panel.remove());

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;

    if (!Number.isInteger(year) || !Number.isInteger(month)) {
      return;
    }

    panels.insertAdjacentHTML("beforeend", CroakleCreateProjectAnalyticsMarkup(year, month));
    CroakleOrderProjectAnalyticsPanels();
  }

  function CroakleBindProjectAnalytics() {
    if (window.CroakleProjectAnalyticsBound) {
      return;
    }

    window.CroakleProjectAnalyticsBound = true;

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(CroakleRenderProjectAnalyticsPanels);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function CroaklePatchProjectAnalyticsSetPage() {
    if (window.CroakleProjectAnalyticsSetPagePatched || typeof CroakleSetPage !== "function") {
      return;
    }

    window.CroakleProjectAnalyticsSetPagePatched = true;
    const originalSetPage = CroakleSetPage;

    CroakleSetPage = function CroakleSetPageWithProjectAnalytics(pageName) {
      originalSetPage(pageName);

      if (pageName === "analysis") {
        window.requestAnimationFrame(CroakleRenderProjectAnalyticsPanels);
      }
    };
  }

  function CroakleInitProjectAnalytics() {
    CroaklePatchProjectAnalyticsSetPage();
    CroakleBindProjectAnalytics();
    window.requestAnimationFrame(CroakleRenderProjectAnalyticsPanels);
  }

  CroakleInitProjectAnalytics();
})();
