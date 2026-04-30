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
    if (document.querySelector(`#${CroakleModalStyleId}`)) {
      return;
    }

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

      .CroakleAddHabitDialog,
      #CroakleAddProjectDialog,
      #CroakleProjectArchiveDialog,
      #CroakleProjectReorderDialog,
      #CroakleProjectDetailDialog,
      #CroakleHabitDetailDialog,
      #CroakleReorderHabitDialog {
        width: min(calc(100vw - var(--CroakleModalViewportGap)), var(--CroakleModalWidth));
        max-width: var(--CroakleModalWidth);
        max-height: min(var(--CroakleModalMaxHeight), 680px);
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: var(--CroakleModalRadius);
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleText, #111111);
        padding: 0;
        overflow: auto;
        scrollbar-width: none;
        box-shadow: none;
      }

      .CroakleAddHabitDialog::-webkit-scrollbar,
      #CroakleAddProjectDialog::-webkit-scrollbar,
      #CroakleProjectArchiveDialog::-webkit-scrollbar,
      #CroakleProjectReorderDialog::-webkit-scrollbar,
      #CroakleProjectDetailDialog::-webkit-scrollbar,
      #CroakleHabitDetailDialog::-webkit-scrollbar,
      #CroakleReorderHabitDialog::-webkit-scrollbar {
        display: none;
      }

      .CroakleAddHabitDialog::backdrop,
      #CroakleAddProjectDialog::backdrop,
      #CroakleProjectArchiveDialog::backdrop,
      #CroakleProjectReorderDialog::backdrop,
      #CroakleProjectDetailDialog::backdrop,
      #CroakleHabitDetailDialog::backdrop,
      #CroakleReorderHabitDialog::backdrop {
        background: var(--CroakleModalBackdrop);
        backdrop-filter: blur(var(--CroakleModalBlur));
        -webkit-backdrop-filter: blur(var(--CroakleModalBlur));
      }

      .CroakleAddHabitDialog > .CroakleAddHabitForm,
      #CroakleAddProjectDialog > .CroakleAddHabitForm,
      #CroakleProjectArchiveDialog > .CroakleAddHabitForm,
      #CroakleProjectReorderDialog > .CroakleAddHabitForm,
      #CroakleProjectDetailDialog > .CroakleAddHabitForm,
      #CroakleHabitDetailDialog > .CroakleAddHabitForm,
      #CroakleReorderHabitDialog > .CroakleAddHabitForm {
        padding: var(--CroakleModalPadding);
      }

      .CroakleHabitNoteModal {
        position: fixed;
        inset: 0;
        z-index: 140;
        display: grid;
        place-items: center;
        padding: calc(var(--CroakleModalViewportGap) / 2);
      }

      .CroakleHabitNoteModal[hidden] {
        display: none;
      }

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

      .CroakleHabitNotePanel::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleMarkModalSystemTargets() {
    document.querySelectorAll(CroakleModalDialogSelector).forEach((dialog) => {
      dialog.classList.add("CroakleModalSystemDialog");
    });

    document.querySelector("#CroakleHabitNoteModal")?.classList.add("CroakleModalSystemOverlay");
    document.querySelector(".CroakleHabitNotePanel")?.classList.add("CroakleModalSystemPanel");
  }

  function CroakleInitModalSystem() {
    CroakleInjectModalSystemStyles();
    CroakleMarkModalSystemTargets();
  }

  CroakleInitModalSystem();

  const observer = new MutationObserver(CroakleMarkModalSystemTargets);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
