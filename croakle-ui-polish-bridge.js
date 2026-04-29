(() => {
  const CroaklePolishBarChartClass = "CroaklePolishBarChart";

  function CroakleInjectPolishStyles() {
    if (document.querySelector("#CroaklePolishStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroaklePolishStyles";
    style.textContent = `
      .CroakleBottomNav,
      .CroakleBottomNav[hidden] {
        display: grid;
      }

      .CroaklePolishBarChart {
        min-height: 180px;
        padding: 14px;
        border: var(--CroakleStroke, 2px) solid var(--CroakleLine);
        border-radius: var(--CroakleRadiusMd, 16px);
        background: var(--CroakleSoftSurface);
      }

      .CroaklePolishBarSvg {
        display: block;
        width: 100%;
        height: auto;
      }

      .CroaklePolishBarFill {
        fill: var(--CroakleLine);
        stroke: var(--CroakleLine);
        stroke-width: 2;
      }

      .CroaklePolishBarAxis {
        stroke: var(--CroakleLine);
        stroke-width: 2;
      }

      .CroaklePolishBarLabel {
        fill: var(--CroakleMuted);
        font-size: 10px;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleEscapePolishText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleParseChartValue(text) {
    const cleanText = String(text || "").replace(/,/g, "");
    const numberMatch = cleanText.match(/-?\d+(?:\.\d+)?/);
    return numberMatch ? Number(numberMatch[0]) : 0;
  }

  function CroakleShortBarLabel(label) {
    const cleanLabel = String(label || "").trim();
    return cleanLabel.length > 8 ? `${cleanLabel.slice(0, 8)}…` : cleanLabel;
  }

  function CroakleCreateBarSvg(rows) {
    const width = 340;
    const height = 180;
    const paddingTop = 14;
    const paddingRight = 10;
    const paddingBottom = 28;
    const paddingLeft = 10;
    const gap = 6;
    const chartHeight = height - paddingTop - paddingBottom;
    const chartWidth = width - paddingLeft - paddingRight;
    const maxValue = Math.max(...rows.map((row) => row.value), 1);
    const barWidth = Math.max(6, (chartWidth - gap * (rows.length - 1)) / rows.length);
    const bottomY = height - paddingBottom;

    const bars = rows.map((row, index) => {
      const safeHeight = Math.max(6, (row.value / maxValue) * chartHeight);
      const x = paddingLeft + index * (barWidth + gap);
      const y = bottomY - safeHeight;
      const labelX = x + barWidth / 2;
      const label = CroakleEscapePolishText(CroakleShortBarLabel(row.label));
      const title = CroakleEscapePolishText(`${row.label}: ${row.value}`);

      return `
        <g>
          <title>${title}</title>
          <rect class="CroaklePolishBarFill" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${safeHeight.toFixed(2)}" rx="5"></rect>
          <text class="CroaklePolishBarLabel" x="${labelX.toFixed(2)}" y="${height - 8}" text-anchor="middle">${label}</text>
        </g>
      `;
    }).join("");

    return `
      <svg class="CroaklePolishBarSvg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
        <line class="CroaklePolishBarAxis" x1="${paddingLeft}" y1="${bottomY}" x2="${width - paddingRight}" y2="${bottomY}"></line>
        ${bars}
      </svg>
    `;
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

    chartWrap.className = CroaklePolishBarChartClass;
    chartWrap.innerHTML = CroakleCreateBarSvg(rows);
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
