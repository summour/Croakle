(() => {
  function CroakleGetActivePageName() {
    return document.querySelector(".CroaklePageActive")?.dataset.page || "menu";
  }

  function CroakleShouldHideBottomNav() {
    return CroakleGetActivePageName() === "menu";
  }

  function CroakleInjectPolishStyles() {
    if (document.querySelector("#CroaklePolishStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroaklePolishStyles";
    style.textContent = `
      .CroakleMenuPage.CroaklePageActive ~ .CroakleBottomNav,
      .CroakleMenuPage.CroaklePageActive ~ .CroakleBottomNav[hidden] {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleSyncBottomNavVisibility() {
    const bottomNav = document.querySelector(".CroakleBottomNav");

    if (!bottomNav) {
      return;
    }

    bottomNav.hidden = CroakleShouldHideBottomNav();
  }

  function CroaklePatchPageNavigation() {
    if (typeof window.CroakleSetPage !== "function" || window.CroaklePolishNavigationPatched) {
      return;
    }

    const originalSetPage = window.CroakleSetPage;
    window.CroakleSetPage = function CroaklePolishedSetPage(pageName) {
      const result = originalSetPage.apply(this, arguments);
      CroakleSyncBottomNavVisibility();
      return result;
    };
    window.CroaklePolishNavigationPatched = true;
  }

  function CroakleInitPolishBridge() {
    CroakleInjectPolishStyles();
    CroaklePatchPageNavigation();
    CroakleSyncBottomNavVisibility();

    const observer = new MutationObserver(CroakleSyncBottomNavVisibility);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden"],
    });
  }

  window.requestAnimationFrame(CroakleInitPolishBridge);
})();
