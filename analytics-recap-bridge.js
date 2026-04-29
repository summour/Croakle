(() => {
  const CroakleRecapStoreKey = "CroakleMonthlyRecapsV1";

  function CroakleRecapEscape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleRecapGetMonthKey(year, month) {
    return typeof CroakleGetMonthKey === "function"
      ? CroakleGetMonthKey(year, month)
      : `${year}-${String(month + 1).padStart(2, "0")}`;
  }

  function CroakleRecapCanSummarizeMonth(year, month) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return year < currentYear || (year === currentYear && month < currentMonth);
  }

  function CroakleRecapIsFutureMonth(year, month) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return year > currentYear || (year === currentYear && month > currentMonth);
  }

  function CroakleRecapLoadSaved() {
    try {
      return JSON.parse(localStorage.getItem(CroakleRecapStoreKey) || "{}");
    } catch {
      return {};
    }
  }

  function CroakleRecapSave(monthKey, recapText) {
    const saved = CroakleRecapLoadSaved();
    saved[monthKey] = {
      text: recapText,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CroakleRecapStoreKey, JSON.stringify(saved));
  }

  function CroakleRecapGetProjectStats(year, month) {
    try {
      const saved = JSON.parse(localStorage.getItem("CroakleProjectDataV1") || "{}");
      const projects = Array.isArray(saved.projects) ? saved.projects : [];
      const activeCount = projects.filter((project) => !project.completed).length;
      const finishedKey = CroakleRecapGetMonthKey(year, month);
      const finishedCount = projects.filter((project) => String(project.completedWeekKey || "").startsWith(finishedKey)).length;
      const trackedCount = projects.reduce((total, project) => {
        return total + Object.entries(project.weeklyDays || {}).reduce((projectTotal, [, days]) => {
          return projectTotal + (Array.isArray(days) ? days.filter(Boolean).length : 0);
        }, 0);
      }, 0);

      return { activeCount, finishedCount, trackedCount };
    } catch {
      return { activeCount: 0, finishedCount: 0, trackedCount: 0 };
    }
  }

  function CroakleRecapCreateLocalSummary(year, month) {
    if (typeof CroakleGetMonthData !== "function" || typeof CroakleGetMonthLabel !== "function") {
      return "Croakle Recap is not ready yet.";
    }

    const monthData = CroakleGetMonthData(year, month);
    const monthLabel = CroakleGetMonthLabel(year, month);
    const habitRows = Array.isArray(monthData.habits) ? monthData.habits.map((habit) => ({
      name: habit.name || "Habit",
      count: Array.isArray(habit.days) ? habit.days.filter(Boolean).length : 0,
    })) : [];
    const totalCheckIns = habitRows.reduce((total, habit) => total + habit.count, 0);
    const bestHabit = [...habitRows].sort((first, second) => second.count - first.count)[0];
    const moodValues = Array.isArray(monthData.moods) ? monthData.moods.filter(Boolean) : [];
    const moodAverage = moodValues.length
      ? (moodValues.reduce((total, mood) => total + Number(mood), 0) / moodValues.length).toFixed(1)
      : "—";
    const projectStats = CroakleRecapGetProjectStats(year, month);

    return [
      `${monthLabel} Recap`,
      "",
      `ภาพรวมเดือนนี้มี habit check-ins รวม ${totalCheckIns} ครั้ง และ mood average อยู่ที่ ${moodAverage}`,
      bestHabit ? `Habit ที่เด่นที่สุดคือ ${bestHabit.name} (${bestHabit.count} check-ins)` : "ยังไม่มี habit ที่เด่นชัดในเดือนนี้",
      `Project มี ${projectStats.finishedCount} finished project และยังมี ${projectStats.activeCount} active projects`,
      "",
      "Focus ถัดไป: เลือก habit หรือ project ที่สำคัญที่สุด 1 อย่าง แล้วทำให้ต่อเนื่องแบบเล็ก ๆ ก่อน",
    ].join("\n");
  }

  function CroakleRecapInjectStyles() {
    if (document.querySelector("#CroakleRecapStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleRecapStyles";
    style.textContent = `
      .CroakleRecapCard {
        display: grid;
        gap: 14px;
        border: 2px solid var(--CroakleLine);
        border-radius: 20px;
        background: var(--CroakleSurface);
        padding: 14px;
      }

      .CroakleRecapHeader {
        display: grid;
        gap: 4px;
      }

      .CroakleRecapHeader h3 {
        margin: 0;
        font-size: 25px;
        font-weight: 950;
        line-height: 1;
        letter-spacing: -0.055em;
      }

      .CroakleRecapHeader p,
      .CroakleRecapBody,
      .CroakleRecapStatus {
        margin: 0;
        color: var(--CroakleMuted);
        font-size: 13px;
        font-weight: 800;
        line-height: 1.35;
      }

      .CroakleRecapBody {
        color: var(--CroakleText);
        white-space: pre-line;
      }

      .CroakleRecapButton {
        appearance: none;
        min-height: 46px;
        border: 2px solid var(--CroakleLine);
        border-radius: 999px;
        background: var(--CroakleLine);
        color: var(--CroakleSurface);
        font: inherit;
        font-size: 15px;
        font-weight: 900;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .CroakleRecapButton:disabled {
        background: var(--CroakleSoftSurface);
        color: var(--CroakleMuted);
        cursor: default;
      }

      .CroakleRecapButton:not(:disabled):active {
        transform: scale(0.96);
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleRecapGetButtonState(year, month) {
    if (CroakleRecapCanSummarizeMonth(year, month)) {
      return {
        disabled: false,
        label: "Generate Recap",
        status: "Summarize this completed month with habit, project, and mood patterns.",
      };
    }

    if (CroakleRecapIsFutureMonth(year, month)) {
      return {
        disabled: true,
        label: "Not available",
        status: "Recap is available only after a month has completed.",
      };
    }

    return {
      disabled: true,
      label: "Available after month ends",
      status: "This month is still in progress. Croakle Recap unlocks after the month ends.",
    };
  }

  function CroakleRecapRender() {
    const scroll = document.querySelector(".CroakleAnalyticsScroll");
    const summary = document.querySelector("#CroakleAnalyticsSummary");

    if (!scroll || !summary || !Number.isInteger(CroakleState?.analyticsYear) || !Number.isInteger(CroakleState?.analyticsMonth)) {
      return;
    }

    CroakleRecapInjectStyles();

    let card = document.querySelector("#CroakleRecapCard");
    if (!card) {
      summary.insertAdjacentHTML("beforebegin", `<section class="CroakleRecapCard" id="CroakleRecapCard"></section>`);
      card = document.querySelector("#CroakleRecapCard");
    }

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;
    const monthKey = CroakleRecapGetMonthKey(year, month);
    const savedRecap = CroakleRecapLoadSaved()[monthKey]?.text || "";
    const buttonState = CroakleRecapGetButtonState(year, month);

    card.innerHTML = `
      <header class="CroakleRecapHeader">
        <h3>Croakle Recap</h3>
        <p>Monthly recap from completed data only.</p>
      </header>
      <p class="CroakleRecapStatus">${CroakleRecapEscape(buttonState.status)}</p>
      ${savedRecap ? `<p class="CroakleRecapBody">${CroakleRecapEscape(savedRecap)}</p>` : ""}
      <button class="CroakleRecapButton" type="button" data-croakle-generate-recap ${buttonState.disabled ? "disabled" : ""}>${CroakleRecapEscape(savedRecap ? "Regenerate Recap" : buttonState.label)}</button>
    `;
  }

  function CroakleRecapHandleClick(event) {
    const button = event.target.closest("[data-croakle-generate-recap]");

    if (!button || button.disabled) {
      return;
    }

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;

    if (!CroakleRecapCanSummarizeMonth(year, month)) {
      CroakleRecapRender();
      return;
    }

    CroakleRecapSave(CroakleRecapGetMonthKey(year, month), CroakleRecapCreateLocalSummary(year, month));
    CroakleRecapRender();
  }

  function CroakleRecapPatchRender() {
    if (window.CroakleRecapRenderPatched || typeof CroakleRenderAnalyticsPage !== "function") {
      return;
    }

    window.CroakleRecapRenderPatched = true;
    const originalRender = CroakleRenderAnalyticsPage;

    CroakleRenderAnalyticsPage = function CroakleRenderAnalyticsPageWithRecap() {
      originalRender();
      CroakleRecapRender();
    };
  }

  function CroakleRecapInit() {
    CroakleRecapPatchRender();
    document.addEventListener("click", CroakleRecapHandleClick);
    window.requestAnimationFrame(CroakleRecapRender);
  }

  CroakleRecapInit();
})();
