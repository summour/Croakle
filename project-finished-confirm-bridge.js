(() => {
  const CroakleFinishedProjectButtonSelector = "#CroakleCompleteProjectButton";
  const CroakleFinishedProjectMessage = [
    "Mark this project as finished?",
    "",
    "It will move from Active Projects to Finished Projects.",
    "You can reopen it later from the Finished button."
  ].join("\n");

  function CroakleSyncFinishedProjectButton() {
    const button = document.querySelector(CroakleFinishedProjectButtonSelector);

    if (!button) {
      return;
    }

    button.textContent = "Finished";
    button.setAttribute("aria-label", "Move project to Finished Projects");
  }

  function CroakleHandleFinishedProjectClick(event) {
    const button = event.target.closest(CroakleFinishedProjectButtonSelector);

    if (!button) {
      return;
    }

    CroakleSyncFinishedProjectButton();

    if (window.confirm(CroakleFinishedProjectMessage)) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function CroakleInitFinishedProjectConfirm() {
    CroakleSyncFinishedProjectButton();
    document.addEventListener("click", CroakleHandleFinishedProjectClick, true);

    const observer = new MutationObserver(CroakleSyncFinishedProjectButton);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  CroakleInitFinishedProjectConfirm();
})();
