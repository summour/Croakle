(() => {
  const CroaklePolishBarChartClass = "CroaklePolishBarChart";

  function CroakleInjectPolishStyles() {
    if (document.querySelector("#CroaklePolishStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroaklePolishStyles";
    style.textContent = `
      .CroakleBottomNav {
        display: grid;
      }

      .CroakleBottomNav[hidden] {
        display: grid;
      }

      .CroaklePolishBarChart {
        display: flex;
        align-items: end;
        gap: 8px;
        min-height: 180px;
        padding: 14px;
        border: var(--CroakleStroke, 2px) solid var(--CroakleLine);
        border-radius: var(--CroakleRadiusMd, 16px);
        background: var(--CroakleSoftSurface);
      }

      .CroaklePolishBarItem {
        flex: 1 1 0;
        min-width: 0;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        gap: 7px;
        height: 152px;
      }

      .CroaklePolishBarFill {
        align-self: end;
        min-height: 8px;
        width: 100%;
        border: var(--CroakleStroke, 2px) solid var(--CroakleLine);
        border-radius: var(--CroakleRadiusSm, 12px) var(--CroakleRadiusSm, 12px) 0 0;
        background: var(--CroakleLine);
      }

      .CroaklePolishBarLabel {
        color: var(--CroakleMuted);
        font-size: 10px;
        font-weight: 500;
        line-height: 1.05;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleParseChartValue(text) {
    const cleanText = String(text || "").replace(/,/g, "");
    const numberMatch = cleanText.match(/-?\d+(?:\.\d+)?/);
    return numberMatch ? Number(numberMatch[0]) : 0;
  }

  function CroakleCreateBarsFromPanel(panel) {
    const chartWrap = panel.querySelector(".CroakleAnalyticsLineWrap");
    const rows = [...panel.querySelectorAll(".CroakleAnalyticsLegendRow")].map((row) => ({
      label: row.querySelector(".CroakleAnalyticsLegendLabel")?.textContent?.trim() || "",
      value: CroakleParseChartValue(row.querySelector(".CroakleAnalyticsLegendValue")?.textContent),
    }));

    if (!chartWrap || !rows.length || chartWrap.classList.contains(CroaklePolishBarChartClass)) {
      return;
    }

    const maxValue = Math.max(...rows.map((row) => row.value), 1);
    chartWrap.className = CroaklePolishBarChartClass;
    chartWrap.innerHTML = rows.map((row) => {
      const height = Math.max(6, Math.round((row.value / maxValue) * 100));
      const label = row.label.length > 8 ? `${row.label.slice(0, 8)}…` : row.label;

      return `
        <div class="CroaklePolishBarItem" title="${row.label}: ${row.value}">
          <div class="CroaklePolishBarFill" style="height: ${height}%"></div>
          <div class="CroaklePolishBarLabel">${label}</div>
        </div>
      `;
    }).join("");
  }

  function CroaklePolishAnalyticsCharts() {
    document.querySelectorAll(".CroakleAnalyticsPanel").forEach(CroakleCreateBarsFromPanel);
  }

  function CroakleKeepNavVisible() {
    const bottomNav = document.querySelector(".CroakleBottomNav");

    if (bottomNav) {
      bottomNav.hidden = false;
    }
  }

  function CroaklePatchPageNavigation() {
    if (typeof window.CroakleSetPage !== "function" || window.CroaklePolishNavigationPatched) {
      return;
    }

    const originalSetPage = window.CroakleSetPage;
    window.CroakleSetPage = function CroaklePolishedSetPage(pageName) {
      originalSetPage(pageName);
      CroakleKeepNavVisible();
      window.requestAnimationFrame(CroaklePolishAnalyticsCharts);
    };
    window.CroaklePolishNavigationPatched = true;
  }

  function CroakleInitPolishBridge() {
    CroakleInjectPolishStyles();
    CroaklePatchPageNavigation();
    CroakleKeepNavVisible();
    CroaklePolishAnalyticsCharts();

    const observer = new MutationObserver(() => {
      CroakleKeepNavVisible();
      CroaklePolishAnalyticsCharts();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "class"],
    });
  }

  window.requestAnimationFrame(CroakleInitPolishBridge);
})();
