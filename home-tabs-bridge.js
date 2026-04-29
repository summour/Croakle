(() => {
  const CroakleHomeTabs = [
    { label: "Home", target: "menu", active: true },
    { label: "Habit", target: "track" },
    { label: "Project", target: "project" },
    { label: "Best", target: "best" },
    { label: "Mood", target: "mood" },
    { label: "Analysis", target: "best" },
  ];

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
