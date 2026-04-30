(() => {
  if (window.CroakleRelationshipBridgeLoaded) {
    return;
  }

  window.CroakleRelationshipBridgeLoaded = true;

  const CroakleRelationshipStoreKey = "CroakleRelationshipSettingsV1";

  function CroakleRelationshipEscape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleRelationshipReadSettings() {
    try {
      return {
        habitIndex: "0",
        compareBy: "mood",
        ...JSON.parse(localStorage.getItem(CroakleRelationshipStoreKey) || "{}"),
      };
    } catch {
      return { habitIndex: "0", compareBy: "mood" };
    }
  }

  function CroakleRelationshipSaveSettings(settings) {
    localStorage.setItem(CroakleRelationshipStoreKey, JSON.stringify(settings));
  }

  function CroakleRelationshipGetMonth() {
    const today = typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
    return {
      year: Number.isInteger(CroakleState?.analyticsYear) ? CroakleState.analyticsYear : today.getFullYear(),
      month: Number.isInteger(CroakleState?.analyticsMonth) ? CroakleState.analyticsMonth : today.getMonth(),
    };
  }

  function CroakleRelationshipGetCompletion(monthData, dayIndex) {
    const totalHabits = monthData.habits.length;

    if (!totalHabits) {
      return 0;
    }

    const doneCount = monthData.habits.reduce((total, habit) => total + (habit.days[dayIndex] ? 1 : 0), 0);
    return Math.round((doneCount / totalHabits) * 100);
  }

  function CroakleRelationshipGetRows(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const daysInMonth = CroakleGetDaysInMonth(year, month);

    return Array.from({ length: daysInMonth }, (_, dayIndex) => ({
      day: dayIndex + 1,
      mood: Number(monthData.moods[dayIndex] || 0),
      productivity: CroakleRelationshipGetCompletion(monthData, dayIndex),
      habits: monthData.habits.map((habit) => Boolean(habit.days[dayIndex])),
    })).filter((row) => row.mood > 0);
  }

  function CroakleRelationshipAverage(values) {
    const cleanValues = values.filter((value) => Number.isFinite(value));
    return cleanValues.length ? cleanValues.reduce((total, value) => total + value, 0) / cleanValues.length : 0;
  }

  function CroakleRelationshipCorrelation(rows) {
    if (rows.length < 2) {
      return 0;
    }

    const avgMood = CroakleRelationshipAverage(rows.map((row) => row.mood));
    const avgProductivity = CroakleRelationshipAverage(rows.map((row) => row.productivity));
    const top = rows.reduce((total, row) => total + ((row.mood - avgMood) * (row.productivity - avgProductivity)), 0);
    const moodSpread = rows.reduce((total, row) => total + ((row.mood - avgMood) ** 2), 0);
    const productivitySpread = rows.reduce((total, row) => total + ((row.productivity - avgProductivity) ** 2), 0);
    const bottom = Math.sqrt(moodSpread * productivitySpread);

    return bottom ? top / bottom : 0;
  }

  function CroakleRelationshipGetCorrelationLabel(value) {
    const absoluteValue = Math.abs(value);

    if (absoluteValue >= 0.6) {
      return value > 0 ? "strong positive" : "strong negative";
    }

    if (absoluteValue >= 0.3) {
      return value > 0 ? "moderate positive" : "moderate negative";
    }

    return "weak / mixed";
  }

  function CroakleRelationshipGetHabitInsight(rows, habitIndex, compareBy) {
    const doneRows = rows.filter((row) => row.habits[habitIndex]);
    const skippedRows = rows.filter((row) => !row.habits[habitIndex]);
    const doneAverage = CroakleRelationshipAverage(doneRows.map((row) => row[compareBy]));
    const skippedAverage = CroakleRelationshipAverage(skippedRows.map((row) => row[compareBy]));
    const diff = doneAverage - skippedAverage;
    const unit = compareBy === "productivity" ? "%" : "";
    const roundedDone = compareBy === "productivity" ? Math.round(doneAverage) : doneAverage.toFixed(1);
    const roundedSkipped = compareBy === "productivity" ? Math.round(skippedAverage) : skippedAverage.toFixed(1);
    const roundedDiff = compareBy === "productivity" ? Math.round(diff) : diff.toFixed(1);

    return {
      done: `${roundedDone}${unit}`,
      skipped: `${roundedSkipped}${unit}`,
      diff: `${diff >= 0 ? "+" : ""}${roundedDiff}${unit}`,
      label: diff > 0 ? "higher on done days" : diff < 0 ? "lower on done days" : "same level",
    };
  }

  function CroakleRelationshipCreateScatter(rows) {
    if (!rows.length) {
      return `<p class="CroakleRelationshipEmpty">Add mood and habit check-ins to see this graph.</p>`;
    }

    const width = 340;
    const height = 220;
    const paddingLeft = 38;
    const paddingRight = 14;
    const paddingTop = 16;
    const paddingBottom = 34;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const bottomY = height - paddingBottom;
    const rightX = width - paddingRight;
    const getX = (mood) => paddingLeft + ((mood - 1) / 4) * chartWidth;
    const getY = (productivity) => bottomY - (productivity / 100) * chartHeight;
    const gridValues = [0, 25, 50, 75, 100];

    const grid = gridValues.map((value) => {
      const y = getY(value);
      return `
        <line class="CroakleRelationshipGrid" x1="${paddingLeft}" y1="${y}" x2="${rightX}" y2="${y}"></line>
        <text class="CroakleRelationshipAxisLabel" x="${paddingLeft - 7}" y="${y + 4}" text-anchor="end">${value}%</text>
      `;
    }).join("");

    const xLabels = [1, 2, 3, 4, 5].map((value) => {
      const x = getX(value);
      return `
        <line class="CroakleRelationshipGrid" x1="${x}" y1="${paddingTop}" x2="${x}" y2="${bottomY}"></line>
        <text class="CroakleRelationshipAxisLabel" x="${x}" y="${height - 10}" text-anchor="middle">${value}</text>
      `;
    }).join("");

    const points = rows.map((row) => `
      <circle class="CroakleRelationshipPoint" cx="${getX(row.mood)}" cy="${getY(row.productivity)}" r="5.5"></circle>
      <title>Day ${row.day}: mood ${row.mood}, productivity ${row.productivity}%</title>
    `).join("");

    return `
      <div class="CroakleRelationshipChartWrap">
        <svg class="CroakleRelationshipSvg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
          ${grid}
          ${xLabels}
          <line class="CroakleRelationshipAxis" x1="${paddingLeft}" y1="${bottomY}" x2="${rightX}" y2="${bottomY}"></line>
          <line class="CroakleRelationshipAxis" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${bottomY}"></line>
          ${points}
          <text class="CroakleRelationshipAxisTitle" x="${width / 2}" y="${height - 1}" text-anchor="middle">Mood</text>
          <text class="CroakleRelationshipAxisTitle" x="11" y="${height / 2}" text-anchor="middle" transform="rotate(-90 11 ${height / 2})">Productivity</text>
        </svg>
      </div>
    `;
  }

  function CroakleRelationshipCreateHabitScatter(rows, habitIndex, compareBy) {
    if (!rows.length) {
      return `<p class="CroakleRelationshipEmpty">Add mood and habit check-ins to see this graph.</p>`;
    }

    const width = 340;
    const height = 180;
    const paddingLeft = 38;
    const paddingRight = 14;
    const paddingTop = 18;
    const paddingBottom = 34;
    const chartWidth = width - paddingLeft - paddingRight;
    const topY = paddingTop + 18;
    const bottomY = height - paddingBottom;
    const maxX = compareBy === "productivity" ? 100 : 5;
    const minX = compareBy === "productivity" ? 0 : 1;
    const getX = (value) => paddingLeft + ((value - minX) / (maxX - minX)) * chartWidth;
    const xTicks = compareBy === "productivity" ? [0, 25, 50, 75, 100] : [1, 2, 3, 4, 5];

    const ticks = xTicks.map((value) => {
      const x = getX(value);
      const label = compareBy === "productivity" ? `${value}%` : value;
      return `
        <line class="CroakleRelationshipGrid" x1="${x}" y1="${topY - 16}" x2="${x}" y2="${bottomY + 6}"></line>
        <text class="CroakleRelationshipAxisLabel" x="${x}" y="${height - 10}" text-anchor="middle">${label}</text>
      `;
    }).join("");

    const points = rows.map((row) => {
      const isDone = row.habits[habitIndex];
      const y = isDone ? topY : bottomY;
      return `
        <circle class="CroakleRelationshipPoint ${isDone ? "CroakleRelationshipPointDone" : "CroakleRelationshipPointSkip"}" cx="${getX(row[compareBy])}" cy="${y}" r="5.5"></circle>
        <title>Day ${row.day}: ${compareBy} ${row[compareBy]}${compareBy === "productivity" ? "%" : ""}, ${isDone ? "done" : "skipped"}</title>
      `;
    }).join("");

    return `
      <div class="CroakleRelationshipChartWrap">
        <svg class="CroakleRelationshipSvg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
          ${ticks}
          <line class="CroakleRelationshipAxis" x1="${paddingLeft}" y1="${topY}" x2="${width - paddingRight}" y2="${topY}"></line>
          <line class="CroakleRelationshipAxis" x1="${paddingLeft}" y1="${bottomY}" x2="${width - paddingRight}" y2="${bottomY}"></line>
          <text class="CroakleRelationshipAxisLabel" x="${paddingLeft - 7}" y="${topY + 4}" text-anchor="end">Done</text>
          <text class="CroakleRelationshipAxisLabel" x="${paddingLeft - 7}" y="${bottomY + 4}" text-anchor="end">Skip</text>
          ${points}
          <text class="CroakleRelationshipAxisTitle" x="${width / 2}" y="${height - 1}" text-anchor="middle">${compareBy === "productivity" ? "Productivity" : "Mood"}</text>
        </svg>
      </div>
    `;
  }

  function CroakleRelationshipCreateHabitOptions(selectedHabitIndex) {
    return (CroakleState.habitTemplates || []).map((habit, index) => `
      <option value="${index}" ${String(index) === String(selectedHabitIndex) ? "selected" : ""}>${CroakleRelationshipEscape(habit.name)}</option>
    `).join("");
  }

  function CroakleRelationshipRender() {
    if (typeof CroakleState === "undefined" || typeof CroakleGetMonthData !== "function") {
      return;
    }

    const panels = document.querySelector("#CroakleAnalyticsPanels");

    if (!panels) {
      return;
    }

    const existingPanel = document.querySelector("#CroakleRelationshipPanel");
    existingPanel?.remove();

    const { year, month } = CroakleRelationshipGetMonth();
    const settings = CroakleRelationshipReadSettings();
    const rows = CroakleRelationshipGetRows(year, month);
    const habitIndex = Math.min(Number(settings.habitIndex || 0), Math.max((CroakleState.habitTemplates || []).length - 1, 0));
    const compareBy = settings.compareBy === "productivity" ? "productivity" : "mood";
    const correlation = CroakleRelationshipCorrelation(rows);
    const habitInsight = CroakleRelationshipGetHabitInsight(rows, habitIndex, compareBy);
    const habitName = CroakleState.habitTemplates?.[habitIndex]?.name || "Habit";

    panels.insertAdjacentHTML("beforeend", `
      <article class="CroakleAnalyticsPanel CroakleRelationshipPanel" id="CroakleRelationshipPanel">
        <header class="CroakleAnalyticsPanelHeader">
          <h3>Mood x Productivity</h3>
          <p>Combined overview + custom habit relationship for this month.</p>
        </header>

        <section class="CroakleRelationshipInsightGrid" aria-label="Relationship summary">
          <div><strong>${correlation.toFixed(2)}</strong><span>Correlation</span><small>${CroakleRelationshipEscape(CroakleRelationshipGetCorrelationLabel(correlation))}</small></div>
          <div><strong>${rows.length}</strong><span>Data days</span><small>days with mood</small></div>
        </section>

        ${CroakleRelationshipCreateScatter(rows)}

        <div class="CroakleRelationshipControls">
          <label>
            <span>Custom habit</span>
            <select id="CroakleRelationshipHabitSelect">${CroakleRelationshipCreateHabitOptions(habitIndex)}</select>
          </label>
          <label>
            <span>Compare with</span>
            <select id="CroakleRelationshipCompareSelect">
              <option value="mood" ${compareBy === "mood" ? "selected" : ""}>Mood</option>
              <option value="productivity" ${compareBy === "productivity" ? "selected" : ""}>Productivity</option>
            </select>
          </label>
        </div>

        <section class="CroakleRelationshipCustomHeader">
          <strong>${CroakleRelationshipEscape(habitName)}</strong>
          <span>${CroakleRelationshipEscape(habitInsight.diff)} · ${CroakleRelationshipEscape(habitInsight.label)}</span>
        </section>

        ${CroakleRelationshipCreateHabitScatter(rows, habitIndex, compareBy)}

        <div class="CroakleRelationshipLegend">
          <span>Done avg: ${CroakleRelationshipEscape(habitInsight.done)}</span>
          <span>Skip avg: ${CroakleRelationshipEscape(habitInsight.skipped)}</span>
        </div>
      </article>
    `);
  }

  function CroakleRelationshipBindEvents() {
    document.addEventListener("change", (event) => {
      const habitSelect = event.target.closest("#CroakleRelationshipHabitSelect");
      const compareSelect = event.target.closest("#CroakleRelationshipCompareSelect");

      if (!habitSelect && !compareSelect) {
        return;
      }

      const settings = CroakleRelationshipReadSettings();

      if (habitSelect) {
        settings.habitIndex = habitSelect.value;
      }

      if (compareSelect) {
        settings.compareBy = compareSelect.value;
      }

      CroakleRelationshipSaveSettings(settings);
      CroakleRelationshipRender();
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest('[data-page-target="analysis"], #CroakleAnalyticsPreviousMonth, #CroakleAnalyticsNextMonth')) {
        window.setTimeout(CroakleRelationshipRender, 0);
      }
    });
  }

  function CroakleRelationshipPatchNavigation() {
    if (typeof CroakleSetPage !== "function" || window.CroakleRelationshipNavigationPatched) {
      return;
    }

    window.CroakleRelationshipNavigationPatched = true;
    const originalSetPage = CroakleSetPage;

    CroakleSetPage = function CroakleSetPageWithRelationship(pageName) {
      originalSetPage(pageName);

      if (pageName === "analysis") {
        window.setTimeout(CroakleRelationshipRender, 0);
      }
    };
  }

  function CroakleRelationshipInjectStyles() {
    if (document.querySelector("#CroakleRelationshipStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleRelationshipStyles";
    style.textContent = `
      .CroakleRelationshipPanel {
        scroll-margin-bottom: 20px;
      }

      .CroakleRelationshipInsightGrid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .CroakleRelationshipInsightGrid div {
        display: grid;
        gap: 3px;
        min-width: 0;
        border: 2px solid var(--CroakleLine);
        border-radius: 16px;
        padding: 10px;
        background: var(--CroakleSurface);
      }

      .CroakleRelationshipInsightGrid strong {
        color: var(--CroakleText);
        font-size: 24px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.05em;
      }

      .CroakleRelationshipInsightGrid span,
      .CroakleRelationshipCustomHeader strong,
      .CroakleRelationshipControls span,
      .CroakleRelationshipLegend span {
        color: var(--CroakleText);
        font-size: 13px;
        font-weight: 900;
        line-height: 1.2;
      }

      .CroakleRelationshipInsightGrid small,
      .CroakleRelationshipCustomHeader span,
      .CroakleRelationshipEmpty {
        color: var(--CroakleMuted);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.25;
      }

      .CroakleRelationshipChartWrap {
        overflow: hidden;
        border-radius: 16px;
        background: rgba(0, 0, 0, 0.02);
        padding: 8px 6px 4px;
      }

      .CroakleRelationshipSvg {
        display: block;
        width: 100%;
        height: auto;
      }

      .CroakleRelationshipGrid {
        stroke: var(--CroakleSoftLine);
        stroke-width: 1;
      }

      .CroakleRelationshipAxis {
        stroke: var(--CroakleLine);
        stroke-width: 1.5;
        stroke-linecap: round;
      }

      .CroakleRelationshipAxisLabel,
      .CroakleRelationshipAxisTitle {
        fill: var(--CroakleMuted);
        font-size: 10px;
        font-weight: 900;
      }

      .CroakleRelationshipPoint {
        fill: var(--CroakleSurface);
        stroke: var(--CroakleLine);
        stroke-width: 2.4;
      }

      .CroakleRelationshipPointSkip {
        opacity: 0.5;
      }

      .CroakleRelationshipControls {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .CroakleRelationshipControls label {
        display: grid;
        gap: 6px;
        min-width: 0;
      }

      .CroakleRelationshipControls select {
        width: 100%;
        min-width: 0;
        border: 2px solid var(--CroakleLine);
        border-radius: 14px;
        background: var(--CroakleSurface);
        color: var(--CroakleText);
        font: inherit;
        font-size: 13px;
        font-weight: 900;
        padding: 10px;
      }

      .CroakleRelationshipCustomHeader,
      .CroakleRelationshipLegend {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
      }

      .CroakleRelationshipCustomHeader span,
      .CroakleRelationshipLegend span {
        text-align: right;
      }

      .CroakleRelationshipEmpty {
        margin: 0;
        text-align: center;
      }

      @media (max-width: 380px) {
        .CroakleRelationshipControls,
        .CroakleRelationshipInsightGrid {
          grid-template-columns: 1fr;
        }

        .CroakleRelationshipCustomHeader,
        .CroakleRelationshipLegend {
          align-items: start;
          flex-direction: column;
        }

        .CroakleRelationshipCustomHeader span,
        .CroakleRelationshipLegend span {
          text-align: left;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function CroakleRelationshipInit() {
    CroakleRelationshipInjectStyles();
    CroakleRelationshipPatchNavigation();
    CroakleRelationshipBindEvents();
    window.setTimeout(CroakleRelationshipRender, 0);
  }

  CroakleRelationshipInit();
})();
