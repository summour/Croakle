(() => {
  const ICONS = {
    menu: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"></path>
      </svg>
    `,
    track: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8"></circle>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `,
    project: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 7.5h6l1.7 2H20.5v8.8a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2z"></path>
      </svg>
    `,
    mood: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5"></circle>
        <path d="M8.6 10h.1"></path>
        <path d="M15.3 10h.1"></path>
        <path d="M8.8 14.2c1.7 1.7 4.7 1.7 6.4 0"></path>
      </svg>
    `,
    notes: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3.8h7.5L19 8.3V20a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 20V5A1.2 1.2 0 0 1 7 3.8z"></path>
        <path d="M14.5 3.8v4.5H19"></path>
        <path d="M9 12h6"></path>
        <path d="M9 15.5h4.4"></path>
      </svg>
    `,
    sessions: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.4"></circle>
        <path d="M12 7.5V12l3.1 2"></path>
      </svg>
    `,
  };

  const LABELS = {
    menu: "Home",
    track: "Habit",
    project: "Project",
    mood: "Mood",
    notes: "Notes",
    sessions: "Time",
  };

  function injectDockStyles() {
    if (document.querySelector("#CroakleIconDockStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleIconDockStyles";
    style.textContent = `
      .CroakleHabitMoodShell {
        padding-bottom: calc(88px + env(safe-area-inset-bottom)) !important;
      }

      .CroakleBottomNav {
        position: fixed !important;
        left: 50% !important;
        right: auto !important;
        bottom: max(12px, env(safe-area-inset-bottom)) !important;
        transform: translateX(-50%) !important;
        z-index: 1000 !important;
        display: grid !important;
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        grid-auto-flow: column !important;
        grid-auto-columns: minmax(0, 1fr) !important;
        align-items: center !important;
        width: min(88vw, 344px) !important;
        min-height: 54px !important;
        gap: 2px !important;
        padding: 4px !important;
        border: 2px solid var(--CroakleLine, #111111) !important;
        border-radius: 22px !important;
        background: var(--CroakleSurface, #ffffff) !important;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08) !important;
        overflow: hidden !important;
      }

      .CroakleBottomNav button {
        position: relative !important;
        min-width: 0 !important;
        min-height: 46px !important;
        width: 100% !important;
        height: 46px !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 18px !important;
        background: transparent !important;
        color: var(--CroakleInk, #111111) !important;
        display: grid !important;
        place-items: center !important;
        font-size: 0 !important;
        line-height: 0 !important;
        white-space: nowrap !important;
      }

      .CroakleBottomNav button:first-child,
      .CroakleBottomNav button:last-child {
        border-radius: 18px !important;
      }

      .CroakleBottomNav svg {
        width: 28px !important;
        height: 28px !important;
        fill: none !important;
        stroke: currentColor !important;
        stroke-width: 2.2 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
      }

      .CroakleBottomNav .CroakleActiveNav {
        background: var(--CroakleInk, #111111) !important;
        color: var(--CroakleSurface, #ffffff) !important;
      }

      .CroakleBottomNav button:active {
        background: #eeeeee !important;
      }

      .CroakleBottomNav .CroakleActiveNav:active {
        background: var(--CroakleInk, #111111) !important;
      }

      @media (max-width: 380px) {
        .CroakleBottomNav {
          width: calc(100vw - 28px) !important;
          min-height: 50px !important;
          border-radius: 20px !important;
          gap: 1px !important;
          padding: 3px !important;
        }

        .CroakleBottomNav button {
          min-height: 44px !important;
          height: 44px !important;
          border-radius: 16px !important;
        }

        .CroakleBottomNav svg {
          width: 25px !important;
          height: 25px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function removeStatsFromDock(nav) {
    nav.querySelectorAll('[data-page-target="analysis"]').forEach((button) => {
      button.remove();
    });
  }

  function getNavKey(button) {
    if (button.dataset.sessionNav !== undefined) {
      return "sessions";
    }

    return button.dataset.pageTarget || "menu";
  }

  function decorateDock() {
    const nav = document.querySelector(".CroakleBottomNav");
    if (!nav) {
      return;
    }

    nav.classList.add("CroakleIconDock");
    removeStatsFromDock(nav);

    nav.querySelectorAll("button").forEach((button) => {
      const key = getNavKey(button);
      button.innerHTML = ICONS[key] || ICONS.menu;
      button.setAttribute("aria-label", LABELS[key] || "Navigate");
      button.setAttribute("title", LABELS[key] || "Navigate");
    });
  }

  function observeDock() {
    const nav = document.querySelector(".CroakleBottomNav");
    if (!nav || window.CroakleIconDockObserverReady) {
      return;
    }

    window.CroakleIconDockObserverReady = true;
    new MutationObserver(decorateDock).observe(nav, {
      childList: true,
      subtree: true,
    });
  }

  function initIconDock() {
    injectDockStyles();
    decorateDock();
    observeDock();
  }

  window.CroakleDecorateIconDock = decorateDock;
  window.requestAnimationFrame(initIconDock);
})();
