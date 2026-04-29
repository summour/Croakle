(() => {
  const CroaklePopupId = "CroakleAppPopup";
  const CroakleMenuProjectStoreKey = "CroakleProjectDataV1";

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
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        margin: 0;
        border: 0;
        padding: 24px;
        background: rgba(255, 255, 255, 0.68);
        color: var(--CroakleText);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        pointer-events: auto;
      }

      .CroakleAppPopupOverlay::backdrop {
        background: rgba(255, 255, 255, 0.68);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
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
    if (document.querySelector("#CroakleMenuDashboardStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleMenuDashboardStyles";
    style.textContent = `
      .CroakleMenuPage .CroakleHeroHeader h1 { font-size: clamp(34px, 10vw, 48px); }
      .CroakleMenuDashboardPanel { min-height: 250px; border: 2px solid var(--CroakleLine); background: var(--CroakleSurface); text-align: left; display: grid; place-content: stretch; align-content: center; gap: 16px; }
      .CroakleMenuDashboardHeader { display: grid; gap: 5px; }
      .CroakleMenuDashboardEyebrow { margin: 0; color: var(--CroakleMuted); font-size: 15px; font-weight: 850; }
      .CroakleMenuDashboardTitle { margin: 0; color: var(--CroakleText); font-size: clamp(34px, 10vw, 46px); font-weight: 950; line-height: 0.95; letter-spacing: -0.06em; }
      .CroakleMenuDashboardGrid { display: grid; gap: 10px; }
      .CroakleMenuDashboardRow { min-height: 50px; border: 2px solid var(--CroakleLine); border-radius: 18px; padding: 8px 12px; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; }
      .CroakleMenuDashboardLabel { color: var(--CroakleMuted); font-size: 14px; font-weight: 850; }
      .CroakleMenuDashboardValue { font-size: 22px; font-weight: 950; letter-spacing: -0.045em; }
      .CroakleMenuList button { min-height: 62px; align-items: center; gap: 12px; padding: 10px 18px; }
      .CroakleMenuItemText { display: grid; gap: 2px; min-width: 0; text-align: left; }
      .CroakleMenuItemTitle { font-size: 19px; font-weight: 900; letter-spacing: -0.04em; }
      .CroakleMenuItemSubtitle { color: var(--CroakleMuted); font-size: 13px; font-weight: 760; line-height: 1.2; }
      .CroakleMenuItemChevron { font-size: 24px; font-weight: 950; }
      @media (max-height: 760px) { .CroakleMenuDashboardPanel { min-height: 210px; gap: 12px; } .CroakleMenuDashboardRow { min-height: 44px; } .CroakleMenuList button { min-height: 54px; } }
    `;
    document.head.appendChild(style);
  }

  function CroakleCloseAppPopup() {
    const popup = document.querySelector(`#${CroaklePopupId}`);
    if (!popup) return;
    if (typeof popup.close === "function" && popup.open) popup.close();
    popup.remove();
  }

  function CroakleOpenAppPopup(overlay) {
    document.body.appendChild(overlay);
    if (typeof overlay.showModal === "function") overlay.showModal();
  }

  function CroakleCreatePopupShell(title, message, actionsMarkup) {
    const overlay = document.createElement("dialog");
    overlay.id = CroaklePopupId;
    overlay.className = "CroakleAppPopupOverlay";
    overlay.innerHTML = `
      <section class="CroakleAppPopupCard" role="document">
        <header class="CroakleAppPopupHeader">
          <h2 class="CroakleAppPopupTitle">${title}</h2>
          <button class="CroakleAppPopupIconButton" type="button" data-croakle-popup-close aria-label="Close">×</button>
        </header>
        <p class="CroakleAppPopupText">${message}</p>
        ${actionsMarkup}
      </section>
    `;
    return overlay;
  }

  function CroakleShowAppPopup(title, message) {
    CroakleInjectPopupStyles();
    CroakleCloseAppPopup();
    CroakleOpenAppPopup(CroakleCreatePopupShell(
      title,
      message,
      `<button class="CroakleAppPopupButton" type="button" data-croakle-popup-close>Close</button>`
    ));
  }

  function CroakleShowAppConfirmPopup({ title, message, confirmLabel, cancelLabel, onConfirm }) {
    CroakleInjectPopupStyles();
    CroakleCloseAppPopup();

    const overlay = CroakleCreatePopupShell(title, message, `
      <div class="CroakleAppPopupActions">
        <button class="CroakleAppPopupButton CroakleAppPopupSecondaryButton" type="button" data-croakle-popup-close>${cancelLabel}</button>
        <button class="CroakleAppPopupButton" type="button" data-croakle-popup-confirm>${confirmLabel}</button>
      </div>
    `);

    overlay.querySelector("[data-croakle-popup-confirm]")?.addEventListener("click", () => {
      CroakleCloseAppPopup();
      onConfirm?.();
    });

    CroakleOpenAppPopup(overlay);
  }

  function CroakleGetActiveProjectSummary() {
    try {
      const state = JSON.parse(localStorage.getItem(CroakleMenuProjectStoreKey) || "{}");
      const projects = Array.isArray(state.projects) ? state.projects : [];
      return `${projects.filter((project) => !project.completed).length} active`;
    } catch {
      return "0 active";
    }
  }

  function CroakleGetMenuDashboardTodayData() {
    try {
      const today = typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
      const dayIndex = today.getDate() - 1;
      const monthData = typeof CroakleGetMonthDataFromDate === "function" ? CroakleGetMonthDataFromDate(today) : null;
      const habits = Array.isArray(monthData?.habits) ? monthData.habits : [];
      const habitDone = habits.filter((habit) => Boolean(habit.days?.[dayIndex])).length;
      const moodValue = monthData?.moods?.[dayIndex];
      const moodLabel = typeof CroakleGetMoodLabel === "function" ? CroakleGetMoodLabel(moodValue) : "No mood";

      return {
        habit: `${habitDone}/${habits.length || 0}`,
        project: CroakleGetActiveProjectSummary(),
        mood: moodValue ? `${moodValue} ${moodLabel}` : "No mood",
      };
    } catch {
      return { habit: "0/0", project: CroakleGetActiveProjectSummary(), mood: "No mood" };
    }
  }

  function CroakleSyncMenuDashboard() {
    const menuPage = document.querySelector('[data-page="menu"]');
    const menuTitle = menuPage?.querySelector(".CroakleHeroHeader h1");
    const panel = menuPage?.querySelector(".CroakleEmptyPanel");

    if (!menuPage || !menuTitle || !panel || panel.dataset.croakleMenuReady === "true") return;

    CroakleInjectMenuDashboardStyles();
    menuTitle.textContent = "Life Dashboard";
    panel.classList.add("CroakleMenuDashboardPanel");

    const todayData = CroakleGetMenuDashboardTodayData();
    panel.innerHTML = `
      <div class="CroakleMenuDashboardHeader">
        <p class="CroakleMenuDashboardEyebrow">Today</p>
        <h2 class="CroakleMenuDashboardTitle">Daily System</h2>
      </div>
      <div class="CroakleMenuDashboardGrid" aria-label="Today summary">
        <div class="CroakleMenuDashboardRow"><span class="CroakleMenuDashboardLabel">Habit</span><strong class="CroakleMenuDashboardValue">${todayData.habit}</strong></div>
        <div class="CroakleMenuDashboardRow"><span class="CroakleMenuDashboardLabel">Project</span><strong class="CroakleMenuDashboardValue">${todayData.project}</strong></div>
        <div class="CroakleMenuDashboardRow"><span class="CroakleMenuDashboardLabel">Mood</span><strong class="CroakleMenuDashboardValue">${todayData.mood}</strong></div>
      </div>
    `;

    const itemCopy = {
      track: ["Track Progress", "Daily habit check-ins"],
      project: ["Projects", "Short project workflow"],
      best: ["Best Habits", "Monthly habit ranking"],
      mood: ["Mood", "Mood calendar and patterns"],
      analysis: ["Analysis", "Charts and monthly summary"],
    };

    menuPage.querySelectorAll(".CroakleMenuList button").forEach((button) => {
      const [title, subtitle] = itemCopy[button.dataset.pageTarget] || [button.textContent.replace("›", "").trim(), "Open view"];
      button.innerHTML = `
        <span class="CroakleMenuItemText">
          <span class="CroakleMenuItemTitle">${title}</span>
          <span class="CroakleMenuItemSubtitle">${subtitle}</span>
        </span>
        <span class="CroakleMenuItemChevron" aria-hidden="true">›</span>
      `;
    });

    panel.dataset.croakleMenuReady = "true";
  }

  function CroakleSyncFinishedProjectButton() {
    const button = document.querySelector("#CroakleCompleteProjectButton");
    if (!button) return;
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
        if (typeof CroakleHandleProjectComplete === "function") CroakleHandleProjectComplete();
      },
    });
  }

  function CroakleHandleFinishedProjectClick(event) {
    const button = event.target.closest("#CroakleCompleteProjectButton");
    if (!button) return;

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

  window.requestAnimationFrame(CroakleSyncMenuDashboard);
  window.requestAnimationFrame(CroakleSyncFinishedProjectButton);

  CroakleNotifyLockedInput = function () {
    CroakleShowAppPopup(
      "Locked",
      "เลือกไว้ให้แก้ได้เฉพาะวันนี้ ปิด Lock ใน Settings หากต้องการแก้วันอื่น"
    );
  };
})();
