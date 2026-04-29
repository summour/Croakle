(() => {
  const CroakleHomeTabs = [
    { label: "Home", target: "menu", active: true },
    { label: "Habit", target: "track" },
    { label: "Project", target: "project" },
    { label: "Best", target: "best" },
    { label: "Mood", target: "mood" },
    { label: "Analysis", target: "best" },
  ];

  function CroakleInjectHomeTabStyles() {
    if (document.querySelector("#CroakleHomeTabStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleHomeTabStyles";
    style.textContent = `
      .CroakleDashboardTabList {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        overflow: visible;
        padding: 4px 0 2px;
        margin: 0 0 16px;
        scrollbar-width: none;
      }

      .CroakleDashboardTabList::-webkit-scrollbar {
        display: none;
      }

      .CroakleDashboardTabList .CroakleDashboardQuickTab {
        min-width: 0;
        min-height: 54px;
        border: 0;
        border-radius: 999px;
        background: #f2f2f2;
        color: #111111;
        padding: 0 10px;
        font-size: clamp(13px, 3.5vw, 16px);
        font-weight: 900;
        letter-spacing: -0.035em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
      }

      .CroakleDashboardTabList .CroakleDashboardQuickTabActive {
        background: #111111;
        color: #ffffff;
      }

      @media (max-width: 420px) {
        .CroakleDashboardTabList {
          gap: 8px;
        }

        .CroakleDashboardTabList .CroakleDashboardQuickTab {
          min-height: 48px;
          padding: 0 8px;
          font-size: clamp(12px, 3.4vw, 14px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleCreateHomeTabs() {
    return CroakleHomeTabs.map((tab) => `
      <button
        class="CroakleDashboardQuickTab${tab.active ? " CroakleDashboardQuickTabActive" : ""}"
        type="button"
        data-page-target="${tab.target}"
        ${tab.active ? 'aria-current="page"' : ""}
      >${tab.label}</button>
    `).join("");
  }

  function CroakleApplyHomeTabs() {
    const menu = document.querySelector('[data-page="menu"] .CroakleMenuList');

    if (!menu || menu.querySelector(".CroakleDashboardQuickTab")) {
      return;
    }

    menu.classList.add("CroakleDashboardMenuList", "CroakleDashboardTabList");
    menu.innerHTML = CroakleCreateHomeTabs();
  }

  function CroakleInitHomeTabs() {
    CroakleInjectHomeTabStyles();
    CroakleApplyHomeTabs();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(CroakleApplyHomeTabs);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.requestAnimationFrame(CroakleInitHomeTabs);
})();
