(() => {
  if (typeof CroakleState === "undefined") {
    return;
  }

  const CroakleAnalyticsChartOrder = [
    "Productivity of the day",
    "Weekly Trend",
    "Habit Completion",
    "Weekday Consistency",
    "Mood by Date",
    "Mood Distribution",
  ];

  function CroakleEscapeMoodDateHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleCreateMoodDateSmoothPath(points) {
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

  function CroakleGetMoodDateRows(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const daysInMonth = CroakleGetDaysInMonth(year, month);
    const moodNames = {
      0: "No mood",
      1: "Terrible",
      2: "Annoyed",
      3: "Okay",
      4: "Good",
      5: "Excellent",
    };

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const moodLevel = Number(monthData.moods[index] || 0);

      return {
        label: String(day),
        value: moodLevel,
        valueLabel: moodLevel ? String(moodLevel) : "—",
        meta: moodNames[moodLevel] || "No mood",
      };
    });
  }

  function CroakleCreateMoodDateLineChart(rows) {
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
    const maxValue = 5;
    const bottomY = height - paddingBottom;
    const rightX = width - paddingRight;

    const points = rows.map((row, index) => {
      const x = rows.length === 1 ? paddingLeft + chartWidth / 2 : paddingLeft + (chartWidth * index) / (rows.length - 1);
      const y = paddingTop + chartHeight - (row.value / maxValue) * chartHeight;

      return { ...row, x, y };
    });

    const linePath = CroakleCreateMoodDateSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
    const gridLines = [0, 1, 2, 3, 4, 5].map((value) => {
      const y = paddingTop + chartHeight - (value / maxValue) * chartHeight;

      return `
        <line class="CroakleAnalyticsGridLine" x1="${paddingLeft}" y1="${y}" x2="${rightX}" y2="${y}"></line>
        <text class="CroakleAnalyticsAxisLabel" x="${paddingLeft - 6}" y="${y + 3}" text-anchor="end">${value}</text>
      `;
    }).join("");

    const pointMarkup = points.map((point, index) => {
      const showLabel = index === 0 || index === points.length - 1 || index % 5 === 0;
      const label = showLabel ? `<text class="CroakleAnalyticsAxisLabel" x="${point.x}" y="${height - 8}" text-anchor="middle">${CroakleEscapeMoodDateHtml(point.label)}</text>` : "";

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
          <path class="CroakleAnalyticsLinePath" d="${linePath}"></path>
          ${pointMarkup}
        </svg>
      </div>
    `;
  }

  function CroakleCreateMoodDateLegend(rows) {
    return `
      <div class="CroakleAnalyticsLegend">
        ${rows.map((row) => `
          <div class="CroakleAnalyticsLegendRow">
            <span class="CroakleAnalyticsLegendLabel">${CroakleEscapeMoodDateHtml(row.label)}</span>
            <span class="CroakleAnalyticsLegendValue">${CroakleEscapeMoodDateHtml(row.valueLabel)}</span>
            <span class="CroakleAnalyticsLegendMeta">${CroakleEscapeMoodDateHtml(row.meta)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function CroakleCreateMoodDatePanel(year, month) {
    const rows = CroakleGetMoodDateRows(year, month);

    return `
      <article class="CroakleAnalyticsPanel" id="CroakleMoodDateAnalyticsPanel">
        <header class="CroakleAnalyticsPanelHeader">
          <h3>Mood by Date</h3>
          <p>X = date, Y = mood level</p>
        </header>
        ${CroakleCreateMoodDateLineChart(rows)}
        ${CroakleCreateMoodDateLegend(rows)}
      </article>
    `;
  }

  function CroakleGetPanelTitle(panel) {
    return panel.querySelector(".CroakleAnalyticsPanelHeader h3")?.textContent?.trim() || "";
  }

  function CroakleOrderAnalyticsPanels() {
    const panels = document.querySelector("#CroakleAnalyticsPanels");

    if (!panels) {
      return;
    }

    const sortedPanels = Array.from(panels.querySelectorAll(":scope > .CroakleAnalyticsPanel"))
      .sort((firstPanel, secondPanel) => {
        const firstIndex = CroakleAnalyticsChartOrder.indexOf(CroakleGetPanelTitle(firstPanel));
        const secondIndex = CroakleAnalyticsChartOrder.indexOf(CroakleGetPanelTitle(secondPanel));
        const safeFirstIndex = firstIndex === -1 ? CroakleAnalyticsChartOrder.length : firstIndex;
        const safeSecondIndex = secondIndex === -1 ? CroakleAnalyticsChartOrder.length : secondIndex;

        return safeFirstIndex - safeSecondIndex;
      });

    sortedPanels.forEach((panel) => panels.appendChild(panel));
  }

  function CroakleRenderMoodDatePanel() {
    const panels = document.querySelector("#CroakleAnalyticsPanels");

    if (!panels) {
      return;
    }

    if (!document.querySelector("#CroakleMoodDateAnalyticsPanel")) {
      const year = CroakleState.analyticsYear;
      const month = CroakleState.analyticsMonth;

      if (!Number.isInteger(year) || !Number.isInteger(month)) {
        return;
      }

      panels.insertAdjacentHTML("beforeend", CroakleCreateMoodDatePanel(year, month));
    }

    CroakleOrderAnalyticsPanels();
  }

  function CroakleBindMoodDatePanel() {
    if (window.CroakleMoodDatePanelBound) {
      return;
    }

    window.CroakleMoodDatePanelBound = true;

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(CroakleRenderMoodDatePanel);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function CroaklePatchMoodDateSetPage() {
    if (window.CroakleMoodDateSetPagePatched || typeof CroakleSetPage !== "function") {
      return;
    }

    window.CroakleMoodDateSetPagePatched = true;
    const originalSetPage = CroakleSetPage;

    CroakleSetPage = function CroakleSetPageWithMoodDate(pageName) {
      originalSetPage(pageName);

      if (pageName === "analysis") {
        window.requestAnimationFrame(CroakleRenderMoodDatePanel);
      }
    };
  }

  function CroakleInitMoodDatePanel() {
    CroaklePatchMoodDateSetPage();
    CroakleBindMoodDatePanel();
    window.requestAnimationFrame(CroakleRenderMoodDatePanel);
  }

  CroakleInitMoodDatePanel();
})();
