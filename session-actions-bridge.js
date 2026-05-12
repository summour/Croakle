(() => {
  function injectStyles() {
    if (document.querySelector("#CroakleSessionActionStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSessionActionStyles";
    style.textContent = `
      .CroakleSessionActionRow {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 10px;
        align-items: center;
      }

      .CroakleSessionActionRow .CroakleSessionDeleteButton,
      .CroakleSessionActionRow .CroakleConfirmHabitButton {
        width: 100% !important;
        min-height: 50px !important;
        margin: 0 !important;
        padding: 0 12px !important;
        border-radius: 999px !important;
        font-size: 17px !important;
        font-weight: 950 !important;
      }

      .CroakleSessionActionRow .CroakleSessionDeleteButton[hidden] {
        display: none !important;
      }

      .CroakleSessionActionRow .CroakleSessionDeleteButton[hidden] + .CroakleConfirmHabitButton {
        grid-column: 1 / -1;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureSessionActionRow() {
    const form = document.querySelector("#CroakleSessionForm");
    const deleteButton = form?.querySelector("[data-session-delete]");
    const saveButton = form?.querySelector(".CroakleConfirmHabitButton[type='submit']");

    if (!form || !deleteButton || !saveButton) return;
    if (deleteButton.closest(".CroakleSessionActionRow")) return;

    const row = document.createElement("div");
    row.className = "CroakleSessionActionRow";
    deleteButton.insertAdjacentElement("beforebegin", row);
    row.appendChild(deleteButton);
    row.appendChild(saveButton);
  }

  function observeSessionDialog() {
    if (window.CroakleSessionActionObserverReady) return;

    const shell = document.querySelector(".CroakleHabitMoodShell") || document.body;
    if (!shell) return;

    window.CroakleSessionActionObserverReady = true;
    new MutationObserver(ensureSessionActionRow).observe(shell, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    injectStyles();
    ensureSessionActionRow();
    observeSessionDialog();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
    window.requestAnimationFrame(ensureSessionActionRow);
  }
})();
