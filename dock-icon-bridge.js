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

  const ITEMS = [
    { key: "menu", attr: 'data-page-target="menu"' },
    { key: "track", attr: 'data-page-target="track"' },
    { key: "project", attr: 'data-page-target="project"' },
    { key: "mood", attr: 'data-page-target="mood"' },
    { key: "notes", attr: 'data-page-target="notes"' },
    { key: "sessions", attr: "data-session-nav" },
  ];

  const LABELS = {
    menu: "Home",
    track: "Habit",
    project: "Project",
    mood: "Mood",
    notes: "Notes",
    sessions: "Time",
  };

  function injectDockStyles() {
    document.querySelector("#CroakleIconDockStyles")?.remove();

    const style = document.createElement("style");
    style.id = "CroakleIconDockStyles";
    style.textContent = `
      .CroakleHabitMoodShell {
        padding-bottom: calc(78px + env(safe-area-inset-bottom)) !important;
        grid-template-rows: minmax(0, 1fr) auto !important;
      }

      .CroakleBottomNav,
      .CroakleBottomNav.CroakleIconDock,
      footer.CroakleBottomNav {
        position: fixed !important;
        left: 50% !important;
        right: auto !important;
        bottom: max(18px, calc(env(safe-area-inset-bottom) + 6px)) !important;
        transform: translateX(-50%) !important;
        z-index: 1000 !important;
        display: grid !important;
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        grid-auto-flow: column !important;
        grid-auto-columns: minmax(0, 1fr) !important;
        align-items: center !important;
        justify-items: stretch !important;
        width: min(calc(100vw - 24px), calc(var(--CroakleShellWidth, 430px) - 24px)) !important;
        min-height: 52px !important;
        gap: 2px !important;
        padding: 4px !important;
        border: 2px solid var(--CroakleLine, #111111) !important;
        border-radius: 22px !important;
        background: var(--CroakleSurface, #ffffff) !important;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08) !important;
        overflow: hidden !important;
      }

      .CroakleBottomNav[hidden] {
        display: grid !important;
      }

      .CroakleBottomNav > button,
      .CroakleBottomNav.CroakleIconDock > button,
      footer.CroakleBottomNav > button {
        position: relative !important;
        min-width: 0 !important;
        min-height: 42px !important;
        width: 100% !important;
        height: 42px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        border-radius: 18px !important;
        background: transparent !important;
        color: var(--CroakleInk, #111111) !important;
        display: grid !important;
        place-items: center !important;
        font-size: 0 !important;
        line-height: 0 !important;
        white-space: nowrap !important;
        text-indent: -9999px !important;
        overflow: hidden !important;
      }

      .CroakleBottomNav > button svg {
        width: 28px !important;
        height: 28px !important;
        fill: none !important;
        stroke: currentColor !important;
        stroke-width: 2.2 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
        text-indent: 0 !important;
      }

      .CroakleBottomNav > button.CroakleActiveNav {
        background: var(--CroakleInk, #111111) !important;
        color: var(--CroakleSurface, #ffffff) !important;
      }

      .CroakleBottomNav > button:active {
        background: #eeeeee !important;
      }

      .CroakleBottomNav > button.CroakleActiveNav:active {
        background: var(--CroakleInk, #111111) !important;
      }

      @media (max-width: 380px) {
        .CroakleBottomNav,
        .CroakleBottomNav.CroakleIconDock,
        footer.CroakleBottomNav {
          width: calc(100vw - 24px) !important;
          min-height: 48px !important;
          border-radius: 20px !important;
          gap: 1px !important;
          padding: 3px !important;
        }

        .CroakleBottomNav > button,
        .CroakleBottomNav.CroakleIconDock > button,
        footer.CroakleBottomNav > button {
          min-height: 40px !important;
          height: 40px !important;
          border-radius: 16px !important;
        }

        .CroakleBottomNav > button svg {
          width: 25px !important;
          height: 25px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getShell() {
    return document.querySelector(".CroakleHabitMoodShell");
  }

  function removeExtraDocks() {
    const docks = Array.from(document.querySelectorAll(".CroakleBottomNav"));
    docks.slice(1).forEach((dock) => dock.remove());
    return docks[0] || null;
  }

  function createDock() {
    const shell = getShell();
    if (!shell) return null;

    shell.insertAdjacentHTML("beforeend", `
      <footer class="CroakleBottomNav CroakleIconDock" aria-label="Quick navigation" data-current-dock>
        ${ITEMS.map((item) => `<button type="button" ${item.attr} aria-label="${LABELS[item.key]}"></button>`).join("")}
      </footer>
    `);

    return shell.querySelector(".CroakleBottomNav");
  }

  function ensureDock() {
    return removeExtraDocks() || createDock();
  }

  function getNavKey(button) {
    if (button.dataset.sessionNav !== undefined) return "sessions";
    return button.dataset.pageTarget || "menu";
  }

  function forceDockVisible(nav) {
    nav.hidden = false;
    nav.removeAttribute("hidden");
  }

  function normalizeDockItems(nav) {
    const orderedButtons = ITEMS.map((item) => {
      const selector = item.key === "sessions" ? "[data-session-nav]" : `[data-page-target="${item.key}"]`;
      const existing = nav.querySelector(selector);

      if (existing) return existing;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = `<button type="button" ${item.attr} aria-label="${LABELS[item.key]}"></button>`;
      return wrapper.firstElementChild;
    });

    nav.replaceChildren(...orderedButtons);
  }

  function decorateDock() {
    const nav = ensureDock();
    if (!nav) return;

    nav.className = "CroakleBottomNav CroakleIconDock";
    nav.setAttribute("data-current-dock", "");
    forceDockVisible(nav);
    normalizeDockItems(nav);

    nav.querySelectorAll("button").forEach((button) => {
      const key = getNavKey(button);
      const label = LABELS[key] || "Navigate";
      const icon = ICONS[key] || ICONS.menu;

      if (button.dataset.iconDockKey !== key) {
        button.innerHTML = icon;
        button.dataset.iconDockKey = key;
      }

      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  }

  function navigateDock(event) {
    const button = event.target.closest(".CroakleBottomNav button");
    if (!button) return;

    if (button.dataset.sessionNav !== undefined) return;

    const pageName = button.dataset.pageTarget;
    if (!pageName || typeof window.CroakleSetPage !== "function") return;

    event.preventDefault();
    window.CroakleSetPage(pageName);
    requestAnimationFrame(decorateDock);
  }

  function bindDockNavigation() {
    if (window.CroakleIconDockNavigationBound) return;

    window.CroakleIconDockNavigationBound = true;
    document.addEventListener("click", navigateDock);
  }

  function initIconDock() {
    injectDockStyles();
    decorateDock();
    bindDockNavigation();
  }

  window.CroakleDecorateIconDock = decorateDock;
  window.requestAnimationFrame(initIconDock);
})();
