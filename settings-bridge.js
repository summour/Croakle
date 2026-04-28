function CroakleApplySettingsNavigation() {
  const originalSetPage = CroakleSetPage;
  const settingsButton = document.querySelector(".CroakleRoundButton");
  const bottomNav = document.querySelector(".CroakleBottomNav");

  CroakleSetPage = function CroakleSetPageWithSettings(pageName) {
    originalSetPage(pageName);

    if (bottomNav) {
      bottomNav.hidden = pageName === "menu" || pageName === "settings";
    }
  };

  if (settingsButton) {
    settingsButton.setAttribute("aria-label", "เปิด Settings");
    settingsButton.addEventListener("click", () => CroakleSetPage("settings"));
  }
}

CroakleApplySettingsNavigation();
