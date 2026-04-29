(() => {
  const CroaklePopupId = "CroakleAppPopup";
  const CroakleProjectDashboardStoreKey = "CroakleProjectDataV1";

  function CroakleInjectPopupStyles() {
    if (document.querySelector("#CroakleAppPopupStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleAppPopupStyles";
    style.textContent = `
      .CroakleAppPopupOverlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(255, 255, 255, 0.68);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        pointer-events: auto;
      }

      .CroakleAppPopupCard {
        width: min(100%, 360px);
        border: 2px solid var(--CroakleLine);
        border-radius: 28px;
        background: var(--CroakleSurface);
        color: var(--CroakleText);
        box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);
        padding: 20px;
        display: grid;
        gap: 16px;
      }

      .CroakleAppPopupHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .CroakleAppPopupTitle {
        margin: 0;
        font-size: 30px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.06em;
      }

      .CroakleAppPopupText {
        margin: 0;
        color: var(--CroakleMuted);
        font-size: 18px;
        font-weight: 750;
        line-height: 1.35;
      }

      .CroakleAppPopupIconButton,
      .CroakleAppPopupButton {
        appearance: none;
        border: 0;
        color: inherit;
        font: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .CroakleAppPopupIconButton {
        width: 44px;
        height: 44px;
        border-radius: 999px;
        background: var(--CroakleSoftSurface);
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
      }

      .CroakleAppPopupButton {
        min-height: 56px;
        border: 2px solid var(--CroakleLine);
        border-radius: 22px;
        background: var(--CroakleLine);
        color: var(--CroakleSurface);
        font-size: 22px;
        font-weight: 900;
      }

      .CroakleAppPopupActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .CroakleAppPopupSecondaryButton {
        background: var(--CroakleSurface);
        color: var(--CroakleText);
      }

      .CroakleAppPopupIconButton:active,
      .CroakleAppPopupButton:active {
        transform: scale(0.96);
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleInjectMenuDashboardStyles() {
    if (document.querySelector("#CroakleMenuDashboardStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleMenuDashboardStyles";
    style.textContent = `
      .CroakleMenuPage .CroakleHeroHeader h1 {
        font-size: clamp(34px, 10vw, 48px);
      }

      .CroakleMenuDashboardPanel {
        flex: 1 1 auto;
        min-height: 260px;
        place-content: stretch;
        align-content: center;
        border: 2px solid var(--CroakleLine);
        background: var(--CroakleSurface);
        text-align: left;
        gap: 18px;
      }

      .CroakleMenuDashboardHeader {
        display: grid;
        gap: 5px;
      }

      .CroakleMenuDashboardEyebrow {
        margin: 0;
        color: var(--CroakleMuted);
        font-size: 15px;
        font-weight: 850;
      }

      .CroakleMenuDashboardTitle {
        margin: 0;
        color: var(--CroakleText);
        font-size: clamp(34px, 10vw, 46px);
        font-weight: 950;
        line-height: 0.95;
        letter-spacing: -0.06em;
      }

      .CroakleMenuDashboardGrid {
        display: grid;
        gap: 10px;
      }

      .CroakleMenuDashboardRow {
        min-height: 54px;
        border: 2px solid var(--CroakleLine);
        border-radius: 18px;
        padding: 8px 12px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
      }

      .CroakleMenuDashboardLabel {
        color: var(--CroakleMuted);
        font-size: 14px;
        font-weight: 850;
      }

      .CroakleMenuDashboardValue {
        font-size: 22px;
        font-weight: 950;
        letter-spacing: -0.045em;
      }

      .CroakleMenuList button {
        min-height: 62px;
        align-items: center;
        gap: 12px;
        padding: 10px 18px;
      }

      .CroakleMenuItemText {
        display: grid;
        gap: 2px;
        min-width: 0;
        text-align: left;
      }

      .CroakleMenuItemTitle {
        font-size: 19px;
        font-weight: 900;
        letter-spacing: -0.04em;
      }

      .CroakleMenuItemSubtitle {
        color: var(--CroakleMuted);
        font-size: 13px;
        font-weight: 760;
        line-height: 1.2;
      }

      .CroakleMenuItemChevron {
        font-size: 24px;
        font-weight: 950;
      }

      @media (max-height: 760px) {
        .CroakleMenuDashboardPanel {
          min-height: 220px;
          gap: 12px;
        }

        .CroakleMenuDashboardRow {
          min-height: 46px;
        }

        .CroakleMenuList button {
          min-height: 54px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleCloseAppPopup() {
    document.querySelector(`#${CroaklePopupId}`)?.remove();
  }

  function CroakleShowAppPopup(title, message) {
    CroakleInjectPopupStyles();
    CroakleCloseAppPopup();

    const overlay = document.createElement("div");
    overlay.id = CroaklePopupId;
    overlay.className = "CroakleAppPopupOverlay";
    overlay.innerHTML = `
      <section class="CroakleAppPopupCard" role="dialog" aria-modal="true">
        <header class="CroakleAppPopupHeader">
          <h2 class="CroakleAppPopupTitle">${title}</h2>
          <button class="CroakleAppPopupIconButton" type="button" data-croakle-popup-close aria-label="Close">×</button>
        </header>
        <p class="CroakleAppPopupText">${message}</p>
        <button class="CroakleAppPopupButton" type="button" data-croakle-popup-close>Close</button>
      </section>
    `;
    document.body.appendChild(overlay);
  }

  function CroakleShowAppConfirmPopup({ title, message, confirmLabel, cancelLabel, onConfirm }) {
    CroakleInjectPopupStyles();
    CroakleCloseAppPopup();

    const overlay = document.createElement("div");
    overlay.id = CroaklePopupId;
    overlay.className = "CroakleAppPopupOverlay";
    overlay.innerHTML = `
      <section class="CroakleAppPopupCard" role="dialog" aria-modal="true">
        <header class="CroakleAppPopupHeader">
          <h2 class="CroakleAppPopupTitle">${title}</h2>
          <button class="CroakleAppPopupIconButton" type="button" data-croakle-popup-close aria-label="Close">×</button>
        </header>
        <p class="CroakleAppPopupText">${message}</p>
        <div class="CroakleAppPopupActions">
          <button class="CroakleAppPopupButton CroakleAppPopupSecondaryButton" type="button" data-croakle-popup-close>${cancelLabel}</button>
          <button class="CroakleAppPopupButton" type="button" data-croakle-popup-confirm>${confirmLabel}</button>
        </div>
      </section>
    `;

    overlay.querySelector("[data-croakle-popup-confirm]")?.addEventListener("click", () => {
      CroakleCloseAppPopup();
      onConfirm?.();
    });

    document.body.appendChild(overlay);
  }

  function CroakleEscapeMenuDashboardHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleLoadMenuDashboardProjects() {
    try {
      const saved = localStorage.getItem(CroakleProjectDashboardStoreKey);
      const state = saved ? JSON.parse(saved) : {};
      return Array.isArray(state.projects) ? state.projects : [];
    } catch {
      return [];
    }
  }

  function CroakleGetMenuDashboardWeekKey(date) {
    const monday = new Date(date);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

    if (typeof CroakleProjectFormatWeekKey === "function") {
      return CroakleProjectFormatWeekKey(monday);
    }

    return [
      monday.getFullYear(),
      String(monday.getMonth() + 1).padStart(2, "0"),
      String(monday.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function CroakleGetMenuDashboardTodayData() {
    const today = typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
    const dayIndex = today.getDate() - 1;
    const weekdayIndex = (today.getDay() + 6) % 7;
    const monthData = typeof CroakleGetMonthDataFromDate === "function" ? CroakleGetMonthDataFromDate(today) : null;
    const habits = Array.isArray(monthData?.habits) ? monthData.habits : [];
    const habitDone = habits.filter((habit) => Boolean(habit.days?.[dayIndex])).length;
    const moodValue = monthData?.moods?.[dayIndex];
    const moodLabel = typeof CroakleGetMoodLabel === "function" ? CroakleGetMoodLabel(moodValue) : (moodValue || "No mood");
    const projects = CroakleLoadMenuDashboardProjects();
    const weekKey = CroakleGetMenuDashboardWeekKey(today);
    const projectUpdates = projects.filter((project) => Boolean(project.weeklyDays?.[weekKey]?.[weekdayIndex])).length;
    const activeProjects = projects.filter((project) => !project.completed).length;

    return {
      habit: `${habitDone}/${habits.length || 0}`,
      project: `${projectUpdates} update${projectUpdates === 1 ? "" : "s"}`,
      activeProject: `${activeProjects} active`,
      mood: moodValue ? `${moodValue} ${moodLabel}` : "No mood",
    };
  }

  function CroakleCreateMenuDashboardMarkup() {
    const todayData = CroakleGetMenuDashboardTodayData();

    return `
      <div class="CroakleMenuDashboardHeader">
        <p class="CroakleMenuDashboardEyebrow">Today</p>
        <h2 class="CroakleMenuDashboardTitle">Daily System</h2>
      </div>
      <div class="CroakleMenuDashboardGrid" aria-label="Today summary">
        <div class="CroakleMenuDashboardRow">
          <span class="CroakleMenuDashboardLabel">Habit</span>
          <strong class="CroakleMenuDashboardValue">${CroakleEscapeMenuDashboardHtml(todayData.habit)}</strong>
        </div>
        <div class="CroakleMenuDashboardRow">
          <span class="CroakleMenuDashboardLabel">Project</span>
          <strong class="CroakleMenuDashboardValue">${CroakleEscapeMenuDashboardHtml(todayData.project)}</strong>
        </div>
        <div class="CroakleMenuDashboardRow">
          <span class="CroakleMenuDashboardLabel">Mood</span>
          <strong class="CroakleMenuDashboardValue">${CroakleEscapeMenuDashboardHtml(todayData.mood)}</strong>
        </div>
      </div>
    `;
  }

  function CroakleGetMenuItemCopy(button) {
    const target = button.dataset.pageTarget;
    const title = button.querySelector("span")?.textContent?.trim() || button.textContent.replace("›", "").trim();
    const items = {
      track: ["Track Progress", "Daily habit check-ins"],
      project: ["Projects", "Short project workflow"],
      best: ["Best Habits", "Monthly habit ranking"],
      mood: ["Mood", "Mood calendar and patterns"],
      analysis: ["Analysis", "Charts and monthly summary"],
    };

    return items[target] || items[title.toLowerCase().replaceAll(" ", "")] || [title, "Open view"];
  }

  function CroakleSyncMenuDashboard() {
    const menuPage = document.querySelector('[data-page="menu"]');
    const menuTitle = menuPage?.querySelector(".CroakleHeroHeader h1");
    const panel = menuPage?.querySelector(".CroakleEmptyPanel");

    if (!menuPage || !menuTitle || !panel) {
      return;
    }

    CroakleInjectMenuDashboardStyles();
    menuTitle.textContent = "Life Dashboard";
    panel.classList.add("CroakleMenuDashboardPanel");

    const nextPanelMarkup = CroakleCreateMenuDashboardMarkup();
    if (panel.dataset.croakleDashboardMarkup !== nextPanelMarkup) {
      panel.dataset.croakleDashboardMarkup = nextPanelMarkup;
      panel.innerHTML = nextPanelMarkup;
    }

    menuPage.querySelectorAll(".CroakleMenuList button").forEach((button) => {
      const [title, subtitle] = CroakleGetMenuItemCopy(button);
      const nextButtonMarkup = `
        <span class="CroakleMenuItemText">
          <span class="CroakleMenuItemTitle">${CroakleEscapeMenuDashboardHtml(title)}</span>
          <span class="CroakleMenuItemSubtitle">${CroakleEscapeMenuDashboardHtml(subtitle)}</span>
        </span>
        <span class="CroakleMenuItemChevron" aria-hidden="true">›</span>
      `;

      if (button.dataset.croakleMenuMarkup !== nextButtonMarkup) {
        button.dataset.croakleMenuMarkup = nextButtonMarkup;
        button.innerHTML = nextButtonMarkup;
      }
    });
  }

  function CroakleBindMenuDashboardRefresh() {
    if (window.CroakleMenuDashboardBound) {
      return;
    }

    window.CroakleMenuDashboardBound = true;

    document.addEventListener("click", (event) => {
      if (event.target.closest(".CroakleCheckButton, .CroakleProjectCheckButton, .CroakleMoodButton, [data-page-target='menu']")) {
        window.requestAnimationFrame(CroakleSyncMenuDashboard);
      }
    });

    window.addEventListener("storage", CroakleSyncMenuDashboard);

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(CroakleSyncMenuDashboard);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function CroakleSyncFinishedProjectButton() {
    const button = document.querySelector("#CroakleCompleteProjectButton");

    if (!button) {
      return;
    }

    button.textContent = "Finished";
    button.setAttribute("aria-label", "Move project to Finished Projects");
  }

  function CroakleShowFinishedProjectConfirm() {
    CroakleShowAppConfirmPopup({
      title: "Finished?",
      message: "This project will move from Active Projects to Finished Projects. You can reopen it later from the Finished button.",
      confirmLabel: "Finished",
      cancelLabel: "Cancel",
      onConfirm: () => {
        if (typeof CroakleHandleProjectComplete === "function") {
          CroakleHandleProjectComplete();
        }
      },
    });
  }

  function CroakleHandleFinishedProjectClick(event) {
    const button = event.target.closest("#CroakleCompleteProjectButton");

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    CroakleSyncFinishedProjectButton();
    CroakleShowFinishedProjectConfirm();
  }

  document.addEventListener("click", (event) => {
    if (event.target.matches("#CroakleAppPopup") || event.target.closest("[data-croakle-popup-close]")) {
      CroakleCloseAppPopup();
    }
  });

  document.addEventListener("click", CroakleHandleFinishedProjectClick, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") CroakleCloseAppPopup();
  });

  const CroakleFinishedProjectObserver = new MutationObserver(CroakleSyncFinishedProjectButton);
  CroakleFinishedProjectObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  CroakleSyncFinishedProjectButton();
  CroakleBindMenuDashboardRefresh();
  CroakleSyncMenuDashboard();

  CroakleNotifyLockedInput = function () {
    CroakleShowAppPopup(
      "Locked",
      "เลือกไว้ให้แก้ได้เฉพาะวันนี้ ปิด Lock ใน Settings หากต้องการแก้วันอื่น"
    );
  };
})();
