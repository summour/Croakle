(() => {
  const CroakleCustomAnalyticsMetrics = [
    { value: "daily", label: "Daily done", yLabel: "done 0/1" },
    { value: "cumulative", label: "Cumulative", yLabel: "running total" },
    { value: "streak", label: "Streak", yLabel: "current streak" },
    { value: "pace", label: "Goal pace %", yLabel: "goal progress percent" },
  ];

  let CroakleCustomAnalyticsBusy = false;

  function CroakleCustomEscape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleCustomCanRender() {
    return typeof CroakleState !== "undefined"
      && typeof CroakleGetMonthData === "function"
      && typeof CroakleGetMonthLabel === "function"
      && typeof CroakleGetDaysInMonth === "function";
  }

  function CroakleCustomGetAnalyticsDate() {
    if (!CroakleCustomCanRender()) {
      return new Date();
    }

    const year = Number.isInteger(CroakleState.analyticsYear)
      ? CroakleState.analyticsYear
      : CroakleState.trackYear;
    const month = Number.isInteger(CroakleState.analyticsMonth)
      ? CroakleState.analyticsMonth
      : CroakleState.trackMonth;

    return new Date(year, month, 1);
  }

  function CroakleCustomGetHabitName(habit, index) {
    return String(habit?.name || `Habit ${index + 1}`);
  }

  function CroakleCustomGetHabitId(habit, index) {
    return String(habit?.id || habit?.name || `habit-${index}`);
  }

  function CroakleCustomGetSelectedHabitIndex(select, habits) {
    const selectedId = select.value;
    const foundIndex = habits.findIndex((habit, index) => CroakleCustomGetHabitId(habit, index) === selectedId);
    return foundIndex >= 0 ? foundIndex : 0;
  }

  function CroakleCustomGetMetric(metricValue) {
    return CroakleCustomAnalyticsMetrics.find((metric) => metric.value === metricValue) || CroakleCustomAnalyticsMetrics[0];
  }

  function CroakleCustomBuildDailySeries(habit, daysInMonth) {
    const days = Array.isArray(habit?.days) ? habit.days : [];
    return Array.from({ length: daysInMonth }, (_, index) => (days[index] ? 1 : 0));
  }

  function CroakleCustomBuildMetricSeries(dailySeries, metricValue, habitGoal) {
    if (metricValue === "daily") {
      return dailySeries;
    }

    if (metricValue === "cumulative") {
      let total = 0;
      return dailySeries.map((value) => {
        total += value;
        return total;
      });
    }

    if (metricValue === "streak") {
      let streak = 0;
      return dailySeries.map((value) => {
        streak = value ? streak + 1 : 0;
        return streak;
      });
    }

    if (metricValue === "pace") {
      const monthGoal = Math.max(1, Number(habitGoal || 1) * 4);
      let total = 0;
      return dailySeries.map((value) => {
        total += value;
        return Math.min(100, Math.round((total / monthGoal) * 100));
      });
    }

    return dailySeries;
  }

  function CroakleCustomBuildYTicks(maxValue) {
    if (maxValue <= 1) {
      return [0, 1];
    }

    const cleanMax = Math.max(1, Math.ceil(maxValue));
    const ticks = [0];

    for (let index = 1; index <= 4; index += 1) {
      ticks.push(Math.round((cleanMax / 4) * index));
    }

    return [...new Set(ticks)];
  }

  function CroakleCustomCreateLineChart(values, metricValue) {
    const width = 340;
    const height = 180;
    const left = 36;
    const right = 12;
    const top = 16;
    const bottom = 28;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const maxValue = metricValue === "pace" ? 100 : Math.max(1, ...values);
    const xStep = values.length > 1 ? plotWidth / (values.length - 1) : plotWidth;
    const yScale = plotHeight / maxValue;

    const points = values.map((value, index) => ({
      day: index + 1,
      value,
      x: left + index * xStep,
      y: top + plotHeight - value * yScale,
    }));

    const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
    const grid = CroakleCustomBuildYTicks(maxValue).map((tick) => {
      const y = top + plotHeight - tick * yScale;
      const label = metricValue === "pace" ? `${tick}%` : tick;
      return `
        <line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="CroakleAnalyticsGridLine"></line>
        <text x="${left - 6}" y="${y + 3}" text-anchor="end" class="CroakleAnalyticsAxisLabel">${label}</text>
      `;
    }).join("");

    const labelDays = [1, 6, 11, 16, 21, 26, values.length].filter((day, index, list) => day <= values.length && list.indexOf(day) === index);
    const xLabels = labelDays.map((day) => {
      const x = left + (day - 1) * xStep;
      return `<text x="${x}" y="${height - 8}" text-anchor="middle" class="CroakleAnalyticsAxisLabel">${day}</text>`;
    }).join("");

    const circles = points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.7" class="CroakleAnalyticsPoint"></circle>`).join("");

    return `
      <svg class="CroakleAnalyticsCustomChart" viewBox="0 0 ${width} ${height}" aria-hidden="true">
        ${grid}
        <line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}" class="CroakleAnalyticsAxisLine"></line>
        <line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" class="CroakleAnalyticsAxisLine"></line>
        <polyline points="${polyline}" class="CroakleAnalyticsLinePath"></polyline>
        ${circles}
        ${xLabels}
      </svg>
    `;
  }

  function CroakleCustomCreateCard() {
    return `
      <article class="CroakleAnalyticsCustomCard" data-croakle-custom-habit-card="true">
        <header class="CroakleAnalyticsCustomHead">
          <h3 class="CroakleAnalyticsCustomTitle">Custom Habit Trend</h3>
          <p class="CroakleAnalyticsCustomSub" data-role="custom-subtitle">X = day of month, Y = selected metric</p>
        </header>

        <div class="CroakleAnalyticsCustomControls">
          <label class="CroakleAnalyticsCustomField">
            <span class="CroakleAnalyticsCustomLabel">Habit</span>
            <select class="CroakleAnalyticsCustomSelect" data-role="custom-habit-select"></select>
          </label>

          <label class="CroakleAnalyticsCustomField">
            <span class="CroakleAnalyticsCustomLabel">Y axis</span>
            <select class="CroakleAnalyticsCustomSelect" data-role="custom-y-select"></select>
          </label>
        </div>

        <div class="CroakleAnalyticsCustomChartShell" data-role="custom-chart"></div>
      </article>
    `;
  }

  function CroakleCustomGetPanelHost() {
    return document.querySelector("#CroakleAnalyticsPanels");
  }

  function CroakleCustomEnsureCard() {
    const host = CroakleCustomGetPanelHost();

    if (!host) {
      return null;
    }

    let card = host.querySelector('[data-croakle-custom-habit-card="true"]');

    if (!card) {
      host.insertAdjacentHTML("beforeend", CroakleCustomCreateCard());
      card = host.querySelector('[data-croakle-custom-habit-card="true"]');
    }

    return card;
  }

  function CroakleCustomFillHabitSelect(select, habits) {
    const previousValue = select.value;

    select.innerHTML = habits.map((habit, index) => {
      const id = CroakleCustomGetHabitId(habit, index);
      const name = CroakleCustomGetHabitName(habit, index);
      return `<option value="${CroakleCustomEscape(id)}">${CroakleCustomEscape(name)}</option>`;
    }).join("");

    if (habits.some((habit, index) => CroakleCustomGetHabitId(habit, index) === previousValue)) {
      select.value = previousValue;
    }
  }

  function CroakleCustomFillMetricSelect(select) {
    const previousValue = select.value;

    select.innerHTML = CroakleCustomAnalyticsMetrics.map((metric) => {
      return `<option value="${CroakleCustomEscape(metric.value)}">${CroakleCustomEscape(metric.label)}</option>`;
    }).join("");

    if (CroakleCustomAnalyticsMetrics.some((metric) => metric.value === previousValue)) {
      select.value = previousValue;
    } else {
      select.value = "daily";
    }
  }

  function CroakleCustomRender() {
    if (CroakleCustomAnalyticsBusy || !CroakleCustomCanRender()) {
      return;
    }

    const card = CroakleCustomEnsureCard();

    if (!card) {
      return;
    }

    CroakleCustomAnalyticsBusy = true;

    const habitSelect = card.querySelector('[data-role="custom-habit-select"]');
    const metricSelect = card.querySelector('[data-role="custom-y-select"]');
    const chart = card.querySelector('[data-role="custom-chart"]');
    const subtitle = card.querySelector('[data-role="custom-subtitle"]');
    const analyticsDate = CroakleCustomGetAnalyticsDate();
    const monthData = CroakleGetMonthData(analyticsDate.getFullYear(), analyticsDate.getMonth());
    const habits = monthData.habits || [];

    CroakleCustomFillHabitSelect(habitSelect, habits);
    CroakleCustomFillMetricSelect(metricSelect);

    if (!habits.length) {
      chart.innerHTML = `<div class="CroakleAnalyticsCustomEmpty">No habit data yet.</div>`;
      CroakleCustomAnalyticsBusy = false;
      return;
    }

    const habitIndex = CroakleCustomGetSelectedHabitIndex(habitSelect, habits);
    const habit = habits[habitIndex];
    const metric = CroakleCustomGetMetric(metricSelect.value);
    const daysInMonth = CroakleGetDaysInMonth(analyticsDate.getFullYear(), analyticsDate.getMonth());
    const dailySeries = CroakleCustomBuildDailySeries(habit, daysInMonth);
    const metricSeries = CroakleCustomBuildMetricSeries(dailySeries, metric.value, habit.goal);

    subtitle.textContent = `X = day of month, Y = ${metric.yLabel}`;
    chart.innerHTML = CroakleCustomCreateLineChart(metricSeries, metric.value);
    CroakleCustomAnalyticsBusy = false;
  }

  function CroakleCustomBindEvents() {
    document.addEventListener("change", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.matches('[data-role="custom-habit-select"], [data-role="custom-y-select"]')) {
        CroakleCustomRender();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest("#CroakleAnalyticsPreviousMonth, #CroakleAnalyticsNextMonth, [data-page-target='analysis']")) {
        window.requestAnimationFrame(CroakleCustomRender);
      }
    });

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(CroakleCustomRender);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function CroakleCustomInit() {
    CroakleCustomRender();
    CroakleCustomBindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", CroakleCustomInit);
  } else {
    CroakleCustomInit();
  }
})();
