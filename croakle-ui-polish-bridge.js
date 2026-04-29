(() => {
  function CroakleInjectPolishStyles() {
    if (document.querySelector("#CroaklePolishStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroaklePolishStyles";
    style.textContent = `
      .CroakleBottomNav,
      .CroakleBottomNav[hidden] {
        display: grid;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleKeepNavVisible() {
    const bottomNav = document.querySelector(".CroakleBottomNav");

    if (bottomNav) {
      bottomNav.hidden = false;
    }
  }

  function CroaklePatchPageNavigation() {
    if (typeof window.CroakleSetPage !== "function" || window.CroaklePolishNavigationPatched) {
      return;
    }

    const originalSetPage = window.CroakleSetPage;
    window.CroakleSetPage = function CroaklePolishedSetPage(pageName) {
      originalSetPage(pageName);
      CroakleKeepNavVisible();
    };
    window.CroaklePolishNavigationPatched = true;
  }

  function CroakleInitPolishBridge() {
    CroakleInjectPolishStyles();
    CroaklePatchPageNavigation();
    CroakleKeepNavVisible();

    const observer = new MutationObserver(CroakleKeepNavVisible);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden"],
    });
  }

  window.requestAnimationFrame(CroakleInitPolishBridge);
})();
