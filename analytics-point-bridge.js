(() => {
  function CroakleInjectAnalyticsPointStyles() {
    if (document.querySelector("#CroakleAnalyticsPointStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleAnalyticsPointStyles";
    style.textContent = `
      .CroakleAnalyticsLineWrap {
        position: relative;
      }

      .CroakleAnalyticsPoint {
        cursor: pointer;
        pointer-events: auto;
        touch-action: manipulation;
      }

      .CroakleAnalyticsPoint.CroakleAnalyticsPointActive {
        fill: var(--CroakleLine);
        stroke: var(--CroakleLine);
      }

      .CroakleAnalyticsPointHitArea {
        fill: transparent;
        cursor: pointer;
        pointer-events: auto;
        touch-action: manipulation;
      }

      .CroakleAnalyticsPointTooltip {
        position: absolute;
        z-index: 3;
        left: var(--CroakleTooltipX, 50%);
        top: var(--CroakleTooltipY, 50%);
        transform: translate(-50%, calc(-100% - 10px));
        max-width: min(220px, calc(100% - 24px));
        border: 2px solid var(--CroakleLine);
        border-radius: 16px;
        background: var(--CroakleSurface);
        color: var(--CroakleText);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.10);
        padding: 10px 12px;
        pointer-events: none;
      }

      .CroakleAnalyticsPointTooltip strong,
      .CroakleAnalyticsPointTooltip span,
      .CroakleAnalyticsPointTooltip small {
        display: block;
      }

      .CroakleAnalyticsPointTooltip strong {
        font-size: 16px;
        font-weight: 900;
        line-height: 1.1;
      }

      .CroakleAnalyticsPointTooltip span {
        margin-top: 3px;
        font-size: 24px;
        font-weight: 950;
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .CroakleAnalyticsPointTooltip small {
        margin-top: 4px;
        color: var(--CroakleMuted);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.2;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleEscapeAnalyticsTooltip(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleGetPointFromEvent(event) {
    const point = event.target.closest?.(".CroakleAnalyticsPoint, .CroakleAnalyticsPointHitArea");

    if (!point) {
      return null;
    }

    if (point.classList.contains("CroakleAnalyticsPointHitArea")) {
      return point.previousElementSibling?.classList.contains("CroakleAnalyticsPoint")
        ? point.previousElementSibling
        : null;
    }

    return point;
  }

  function CroakleGetPointData(point) {
    const panel = point.closest(".CroakleAnalyticsPanel");
    const points = Array.from(panel?.querySelectorAll(".CroakleAnalyticsPoint") || []);
    const index = points.indexOf(point);
    const legendRow = panel?.querySelectorAll(".CroakleAnalyticsLegendRow")?.[index];

    return {
      label: legendRow?.querySelector(".CroakleAnalyticsLegendLabel")?.textContent || "Point",
      value: legendRow?.querySelector(".CroakleAnalyticsLegendValue")?.textContent || "",
      meta: legendRow?.querySelector(".CroakleAnalyticsLegendMeta")?.textContent || "",
    };
  }

  function CroaklePositionPointTooltip(point, tooltip) {
    const wrap = point.closest(".CroakleAnalyticsLineWrap");
    const wrapRect = wrap.getBoundingClientRect();
    const pointRect = point.getBoundingClientRect();
    const x = pointRect.left + pointRect.width / 2 - wrapRect.left;
    const y = pointRect.top + pointRect.height / 2 - wrapRect.top;

    tooltip.style.setProperty("--CroakleTooltipX", `${x}px`);
    tooltip.style.setProperty("--CroakleTooltipY", `${y}px`);
  }

  function CroakleShowAnalyticsPointValue(point) {
    const wrap = point.closest(".CroakleAnalyticsLineWrap");
    const panel = point.closest(".CroakleAnalyticsPanel");

    if (!wrap || !panel) {
      return;
    }

    const alreadyActive = point.classList.contains("CroakleAnalyticsPointActive");

    document.querySelectorAll(".CroakleAnalyticsPointActive").forEach((activePoint) => {
      activePoint.classList.remove("CroakleAnalyticsPointActive");
    });
    document.querySelectorAll(".CroakleAnalyticsPointTooltip").forEach((tooltip) => tooltip.remove());

    if (alreadyActive) {
      return;
    }

    const data = CroakleGetPointData(point);
    const tooltip = document.createElement("div");
    tooltip.className = "CroakleAnalyticsPointTooltip";
    tooltip.innerHTML = `
      <strong>${CroakleEscapeAnalyticsTooltip(data.label)}</strong>
      <span>${CroakleEscapeAnalyticsTooltip(data.value)}</span>
      <small>${CroakleEscapeAnalyticsTooltip(data.meta)}</small>
    `;

    point.classList.add("CroakleAnalyticsPointActive");
    wrap.appendChild(tooltip);
    CroaklePositionPointTooltip(point, tooltip);
  }

  function CroakleAddPointHitAreas() {
    document.querySelectorAll(".CroakleAnalyticsPoint").forEach((point) => {
      if (point.nextElementSibling?.classList.contains("CroakleAnalyticsPointHitArea")) {
        return;
      }

      const hitArea = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      hitArea.classList.add("CroakleAnalyticsPointHitArea");
      hitArea.setAttribute("cx", point.getAttribute("cx") || "0");
      hitArea.setAttribute("cy", point.getAttribute("cy") || "0");
      hitArea.setAttribute("r", "12");
      hitArea.setAttribute("tabindex", "0");
      hitArea.setAttribute("role", "button");
      hitArea.setAttribute("aria-label", "Show chart point value");
      point.insertAdjacentElement("afterend", hitArea);
    });
  }

  function CroakleBindAnalyticsPointEvents() {
    if (window.CroakleAnalyticsPointEventsBound) {
      return;
    }

    window.CroakleAnalyticsPointEventsBound = true;

    document.addEventListener("click", (event) => {
      const point = CroakleGetPointFromEvent(event);

      if (!point) {
        if (!event.target.closest?.(".CroakleAnalyticsPointTooltip")) {
          document.querySelectorAll(".CroakleAnalyticsPointActive").forEach((activePoint) => {
            activePoint.classList.remove("CroakleAnalyticsPointActive");
          });
          document.querySelectorAll(".CroakleAnalyticsPointTooltip").forEach((tooltip) => tooltip.remove());
        }

        return;
      }

      event.preventDefault();
      CroakleShowAnalyticsPointValue(point);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const point = CroakleGetPointFromEvent(event);

      if (!point) {
        return;
      }

      event.preventDefault();
      CroakleShowAnalyticsPointValue(point);
    });
  }

  function CroakleInitAnalyticsPointBridge() {
    CroakleInjectAnalyticsPointStyles();
    CroakleAddPointHitAreas();
    CroakleBindAnalyticsPointEvents();
  }

  const CroakleOriginalSetPageForPoints = window.CroakleSetPage || CroakleSetPage;

  if (typeof CroakleOriginalSetPageForPoints === "function" && !window.CroakleAnalyticsPointSetPagePatched) {
    window.CroakleAnalyticsPointSetPagePatched = true;

    CroakleSetPage = function CroakleSetPageWithPointBridge(pageName) {
      CroakleOriginalSetPageForPoints(pageName);

      if (pageName === "analysis") {
        window.requestAnimationFrame(CroakleInitAnalyticsPointBridge);
      }
    };
  }

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(CroakleAddPointHitAreas);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.requestAnimationFrame(CroakleInitAnalyticsPointBridge);
})();
