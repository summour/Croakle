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
        display: flex;
        align-items: center;
        gap: 18px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 6px 0 8px;
        margin: 0 0 18px;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .CroakleDashboardTabList::-webkit-scrollbar {
        display: none;
      }

      .CroakleDashboardTabList .CroakleDashboardQuickTab {
        flex: 0 0 auto;
        min-width: 132px;
        min-height: 72px;
        border: 0;
        border-radius: 999px;
        background: #f2f2f2;
        color: #111111;
        padding: 0 26px;
        font-size: 18px;
        font-weight: 900;
        letter-spacing: -0.03em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
      }

      .CroakleDashboardTabList .CroakleDashboardQuickTabActive {
        background: #111111;
        color: #ffffff;
      }

      @media (max-width: 640px) {
        .CroakleDashboardTabList {
          gap: 14px;
        }

        .CroakleDashboardTabList .CroakleDashboardQuickTab {
          min-width: 120px;
          min-height: 68px;
          padding: 0 22px;
          font-size: 17px;
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
