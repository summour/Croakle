(() => {
  const CroakleModalStyleId = "CroakleModalSystemStyles";
  const CroakleModalDialogSelector = [
    ".CroakleAddHabitDialog",
    "#CroakleAddProjectDialog",
    "#CroakleProjectArchiveDialog",
    "#CroakleProjectReorderDialog",
    "#CroakleProjectDetailDialog",
    "#CroakleHabitDetailDialog",
    "#CroakleReorderHabitDialog"
  ].join(",");

  function CroakleInjectModalSystemStyles() {
    if (document.querySelector(`#${CroakleModalStyleId}`)) return;
    const style = document.createElement("style");
    style.id = CroakleModalStyleId;
    style.textContent = `
      :root {
        --CroakleModalWidth: 390px;
        --CroakleModalViewportGap: 28px;
        --CroakleModalMaxHeight: 86dvh;
        --CroakleModalRadius: 28px;
        --CroakleModalPadding: 20px;
        --CroakleModalBackdrop: rgba(255, 255, 255, 0.72);
        --CroakleModalBlur: 10px;
      }
      body.CroakleModalSystemLocked { overflow: hidden; }
      .CroakleModalSystemDialog {
        position: fixed;
        inset: 0;
        z-index: 140;
        width: 100vw;
        max-width: none;
        height: 100dvh;
        max-height: none;
        margin: 0;
        border: 0;
        border-radius: 0;
        padding: calc(var(--CroakleModalViewportGap) / 2);
        background: transparent;
        color: var(--CroakleText, #111111);
        overflow: hidden;
        place-items: center;
      }
      .CroakleModalSystemDialog:not([data-croakle-modal-open="true"]) { display: none; }
      .CroakleModalSystemDialog[data-croakle-modal-open="true"] { display: grid; }
      .CroakleModalSystemDialog::backdrop { background: transparent; }
      .CroakleModalSystemDialog::before {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--CroakleModalBackdrop);
        backdrop-filter: blur(var(--CroakleModalBlur));
        -webkit-backdrop-filter: blur(var(--CroakleModalBlur));
        pointer-events: auto;
      }
      .CroakleModalSystemDialog > .CroakleAddHabitForm {
        position: relative;
        z-index: 1;
        width: min(calc(100vw - var(--CroakleModalViewportGap)), var(--CroakleModalWidth));
        max-width: var(--CroakleModalWidth);
        max-height: min(var(--CroakleModalMaxHeight), 680px);
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: var(--CroakleModalRadius);
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleText, #111111);
        padding: var(--CroakleModalPadding);
        overflow-y: auto;
        scrollbar-width: none;
        box-shadow: none;
      }
      .CroakleModalSystemDialog > .CroakleAddHabitForm::-webkit-scrollbar { display: none; }
      .CroakleHabitNoteModal {
        position: fixed;
        inset: 0;
        z-index: 140;
        display: grid;
        place-items: center;
        padding: calc(var(--CroakleModalViewportGap) / 2);
      }
      .CroakleHabitNoteModal[hidden] { display: none; }
      .CroakleHabitNoteBackdrop {
        position: absolute;
        inset: 0;
        border: 0;
        background: var(--CroakleModalBackdrop);
        backdrop-filter: blur(var(--CroakleModalBlur));
        -webkit-backdrop-filter: blur(var(--CroakleModalBlur));
      }
      .CroakleHabitNotePanel {
        position: relative;
        z-index: 1;
        width: min(calc(100vw - var(--CroakleModalViewportGap)), var(--CroakleModalWidth));
        max-width: var(--CroakleModalWidth);
        max-height: min(var(--CroakleModalMaxHeight), 680px);
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: var(--CroakleModalRadius);
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleText, #111111);
        padding: var(--CroakleModalPadding);
        display: grid;
        gap: 16px;
        overflow-y: auto;
        scrollbar-width: none;
        box-shadow: none;
      }
      .CroakleHabitNotePanel::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
  }

  function CroakleSyncBodyLock() {
    const hasOpen = Boolean(document.querySelector('.CroakleModalSystemDialog[data-croakle-modal-open="true"], .CroakleHabitNoteModal:not([hidden])'));
    document.body.classList.toggle("CroakleModalSystemLocked", hasOpen);
  }

  function CroakleOpenCustomModal(dialog) {
    dialog.setAttribute("open", "");
    dialog.dataset.croakleModalOpen = "true";
    CroakleSyncBodyLock();
  }

  function CroakleCloseCustomModal(dialog) {
    dialog.removeAttribute("open");
    delete dialog.dataset.croakleModalOpen;
    dialog.dispatchEvent(new Event("close"));
    CroakleSyncBodyLock();
  }

  function CroakleUpgradeDialog(dialog) {
    if (!dialog || dialog.dataset.croakleModalUpgraded === "true") return;
    dialog.dataset.croakleModalUpgraded = "true";
    dialog.classList.add("CroakleModalSystemDialog");
    dialog.showModal = () => CroakleOpenCustomModal(dialog);
    dialog.show = () => CroakleOpenCustomModal(dialog);
    dialog.close = () => CroakleCloseCustomModal(dialog);
  }

  function CroakleMarkModalSystemTargets() {
    document.querySelectorAll(CroakleModalDialogSelector).forEach(CroakleUpgradeDialog);
    document.querySelector("#CroakleHabitNoteModal")?.classList.add("CroakleModalSystemOverlay");
    document.querySelector(".CroakleHabitNotePanel")?.classList.add("CroakleModalSystemPanel");
  }

  function CroakleBindModalSystemEvents() {
    if (window.CroakleModalSystemBound) return;
    window.CroakleModalSystemBound = true;

    document.addEventListener("click", (event) => {
      const dialog = event.target.closest?.(".CroakleModalSystemDialog");
      if (dialog && event.target === dialog) dialog.close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const openDialogs = [...document.querySelectorAll('.CroakleModalSystemDialog[data-croakle-modal-open="true"]')];
      const topDialog = openDialogs.at(-1);
      if (!topDialog) return;
      event.preventDefault();
      topDialog.close();
    });
  }

  function CroakleInitModalSystem() {
    CroakleInjectModalSystemStyles();
    CroakleMarkModalSystemTargets();
    CroakleBindModalSystemEvents();
    CroakleSyncBodyLock();
  }

  CroakleInitModalSystem();
  new MutationObserver(CroakleInitModalSystem).observe(document.body, { childList: true, subtree: true });
})();
