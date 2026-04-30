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
        --CroakleModalEase: cubic-bezier(0.16, 1, 0.3, 1);
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
        opacity: 0;
        transition: opacity 220ms var(--CroakleModalEase);
      }

      .CroakleModalSystemDialog:not([data-croakle-modal-open="true"]) { display: none; }
      .CroakleModalSystemDialog[data-croakle-modal-open="true"] { display: grid; opacity: 1; }
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
        transform: translateY(16px) scale(0.96);
        opacity: 0;
        transition: transform 320ms var(--CroakleModalEase), opacity 220ms ease;
      }

      .CroakleModalSystemDialog[data-croakle-modal-open="true"] > .CroakleAddHabitForm {
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      .CroakleModalSystemDialog > .CroakleAddHabitForm::-webkit-scrollbar { display: none; }

      .CroakleHabitNoteModal {
        position: fixed;
        inset: 0;
        z-index: 140;
        display: grid;
        place-items: center;
        padding: calc(var(--CroakleModalViewportGap) / 2);
        opacity: 1;
        transition: opacity 220ms var(--CroakleModalEase);
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

      .CroakleHabitNotePanel,
      .CroakleAlertPanel {
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
        animation: CroakleModalSpringIn 320ms var(--CroakleModalEase) both;
      }

      .CroakleHabitNotePanel::-webkit-scrollbar,
      .CroakleAlertPanel::-webkit-scrollbar { display: none; }

      .CroakleAlertOverlay {
        position: fixed;
        inset: 0;
        z-index: 220;
        display: grid;
        place-items: center;
        padding: calc(var(--CroakleModalViewportGap) / 2);
      }

      .CroakleAlertOverlay[hidden] { display: none; }

      .CroakleAlertBackdrop {
        position: absolute;
        inset: 0;
        border: 0;
        background: var(--CroakleModalBackdrop);
        backdrop-filter: blur(var(--CroakleModalBlur));
        -webkit-backdrop-filter: blur(var(--CroakleModalBlur));
      }

      .CroakleAlertTitle {
        margin: 0;
        font-size: clamp(30px, 8vw, 42px);
        font-weight: 950;
        line-height: 0.96;
        letter-spacing: -0.065em;
      }

      .CroakleAlertMessage {
        margin: 0;
        color: #666666;
        font-size: 17px;
        font-weight: 750;
        line-height: 1.35;
        white-space: pre-wrap;
      }

      .CroakleAlertActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .CroakleAlertActions[data-single-action="true"] { grid-template-columns: 1fr; }

      .CroakleAlertButton {
        min-height: 52px;
        border: 2px solid #111111;
        border-radius: 18px;
        font-size: 17px;
        font-weight: 900;
        background: #ffffff;
        color: #111111;
      }

      .CroakleAlertButton[data-primary="true"] {
        background: #111111;
        color: #ffffff;
      }

      @keyframes CroakleModalSpringIn {
        from { transform: translateY(16px) scale(0.96); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }

      @media (prefers-reduced-motion: reduce) {
        .CroakleModalSystemDialog,
        .CroakleModalSystemDialog > .CroakleAddHabitForm,
        .CroakleHabitNoteModal,
        .CroakleHabitNotePanel,
        .CroakleAlertPanel {
          animation: none;
          transition: none;
          transform: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleSyncBodyLock() {
    const hasOpen = Boolean(document.querySelector('.CroakleModalSystemDialog[data-croakle-modal-open="true"], .CroakleHabitNoteModal:not([hidden]), .CroakleAlertOverlay:not([hidden])'));
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

  function CroakleEnsureAlertOverlay() {
    if (document.querySelector("#CroakleAlertOverlay")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="CroakleAlertOverlay" id="CroakleAlertOverlay" hidden>
        <button class="CroakleAlertBackdrop" type="button" data-croakle-alert-cancel aria-label="Close alert"></button>
        <section class="CroakleAlertPanel" role="alertdialog" aria-modal="true" aria-labelledby="CroakleAlertTitle" aria-describedby="CroakleAlertMessage">
          <h2 class="CroakleAlertTitle" id="CroakleAlertTitle"></h2>
          <p class="CroakleAlertMessage" id="CroakleAlertMessage"></p>
          <div class="CroakleAlertActions" data-croakle-alert-actions></div>
        </section>
      </div>
    `);
  }

  function CroakleCloseAlert(value) {
    const overlay = document.querySelector("#CroakleAlertOverlay");
    const resolver = window.CroakleAlertResolver;
    if (!overlay) return;
    overlay.hidden = true;
    window.CroakleAlertResolver = null;
    CroakleSyncBodyLock();
    if (typeof resolver === "function") resolver(value);
  }

  function CroakleOpenAlert(options = {}) {
    CroakleEnsureAlertOverlay();
    const overlay = document.querySelector("#CroakleAlertOverlay");
    const title = overlay.querySelector("#CroakleAlertTitle");
    const message = overlay.querySelector("#CroakleAlertMessage");
    const actions = overlay.querySelector("[data-croakle-alert-actions]");
    const isConfirm = options.type === "confirm";

    title.textContent = options.title || (isConfirm ? "Confirm" : "Alert");
    message.textContent = options.message || "";
    actions.dataset.singleAction = String(!isConfirm);
    actions.innerHTML = isConfirm
      ? `<button class="CroakleAlertButton" type="button" data-croakle-alert-cancel>${options.cancelText || "Cancel"}</button><button class="CroakleAlertButton" type="button" data-primary="true" data-croakle-alert-confirm>${options.confirmText || "OK"}</button>`
      : `<button class="CroakleAlertButton" type="button" data-primary="true" data-croakle-alert-confirm>${options.confirmText || "OK"}</button>`;

    overlay.hidden = false;
    CroakleSyncBodyLock();

    return new Promise((resolve) => {
      window.CroakleAlertResolver = resolve;
      window.requestAnimationFrame(() => overlay.querySelector("[data-croakle-alert-confirm]")?.focus());
    });
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

      if (event.target.closest("[data-croakle-alert-confirm]")) CroakleCloseAlert(true);
      if (event.target.closest("[data-croakle-alert-cancel]")) CroakleCloseAlert(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const alertOverlay = document.querySelector("#CroakleAlertOverlay:not([hidden])");
      if (alertOverlay) {
        event.preventDefault();
        CroakleCloseAlert(false);
        return;
      }

      const openDialogs = [...document.querySelectorAll('.CroakleModalSystemDialog[data-croakle-modal-open="true"]')];
      const topDialog = openDialogs.at(-1);
      if (!topDialog) return;
      event.preventDefault();
      topDialog.close();
    });
  }

  function CroakleInitModalSystem() {
    CroakleInjectModalSystemStyles();
    CroakleEnsureAlertOverlay();
    CroakleMarkModalSystemTargets();
    CroakleBindModalSystemEvents();
    CroakleSyncBodyLock();
  }

  window.CroakleAlert = (message, title = "Alert") => CroakleOpenAlert({ type: "alert", title, message });
  window.CroakleConfirm = (message, title = "Confirm") => CroakleOpenAlert({ type: "confirm", title, message, confirmText: "Confirm", cancelText: "Cancel" });

  CroakleInitModalSystem();
  new MutationObserver(CroakleInitModalSystem).observe(document.body, { childList: true, subtree: true });
})();
