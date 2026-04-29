(() => {
  const CroaklePopupId = "CroakleAppPopup";

  function CroakleInjectPopupStyles() {
    if (document.querySelector("#CroakleAppPopupStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleAppPopupStyles";
    style.textContent = `
      .CroakleAppPopupOverlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(255, 255, 255, 0.68);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        pointer-events: auto;
      }

      .CroakleAppPopupCard {
        width: min(100%, 360px);
        border: 2px solid var(--CroakleLine);
        border-radius: 28px;
        background: var(--CroakleSurface);
        color: var(--CroakleText);
        box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);
        padding: 20px;
        display: grid;
        gap: 16px;
      }

      .CroakleAppPopupHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .CroakleAppPopupTitle {
        margin: 0;
        font-size: 30px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.06em;
      }

      .CroakleAppPopupText {
        margin: 0;
        color: var(--CroakleMuted);
        font-size: 18px;
        font-weight: 750;
        line-height: 1.35;
      }

      .CroakleAppPopupIconButton,
      .CroakleAppPopupButton {
        appearance: none;
        border: 0;
        color: inherit;
        font: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .CroakleAppPopupIconButton {
        width: 44px;
        height: 44px;
        border-radius: 999px;
        background: var(--CroakleSoftSurface);
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
      }

      .CroakleAppPopupButton {
        min-height: 56px;
        border: 2px solid var(--CroakleLine);
        border-radius: 22px;
        background: var(--CroakleLine);
        color: var(--CroakleSurface);
        font-size: 22px;
        font-weight: 900;
      }

      .CroakleAppPopupActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .CroakleAppPopupSecondaryButton {
        background: var(--CroakleSurface);
        color: var(--CroakleText);
      }

      .CroakleAppPopupIconButton:active,
      .CroakleAppPopupButton:active {
        transform: scale(0.96);
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleCloseAppPopup() {
    document.querySelector(`#${CroaklePopupId}`)?.remove();
  }

  function CroakleShowAppPopup(title, message) {
    CroakleInjectPopupStyles();
    CroakleCloseAppPopup();

    const overlay = document.createElement("div");
    overlay.id = CroaklePopupId;
    overlay.className = "CroakleAppPopupOverlay";
    overlay.innerHTML = `
      <section class="CroakleAppPopupCard" role="dialog" aria-modal="true">
        <header class="CroakleAppPopupHeader">
          <h2 class="CroakleAppPopupTitle">${title}</h2>
          <button class="CroakleAppPopupIconButton" type="button" data-croakle-popup-close aria-label="Close">×</button>
        </header>
        <p class="CroakleAppPopupText">${message}</p>
        <button class="CroakleAppPopupButton" type="button" data-croakle-popup-close>Close</button>
      </section>
    `;
    document.body.appendChild(overlay);
  }

  function CroakleShowAppConfirmPopup({ title, message, confirmLabel, cancelLabel, onConfirm }) {
    CroakleInjectPopupStyles();
    CroakleCloseAppPopup();

    const overlay = document.createElement("div");
    overlay.id = CroaklePopupId;
    overlay.className = "CroakleAppPopupOverlay";
    overlay.innerHTML = `
      <section class="CroakleAppPopupCard" role="dialog" aria-modal="true">
        <header class="CroakleAppPopupHeader">
          <h2 class="CroakleAppPopupTitle">${title}</h2>
          <button class="CroakleAppPopupIconButton" type="button" data-croakle-popup-close aria-label="Close">×</button>
        </header>
        <p class="CroakleAppPopupText">${message}</p>
        <div class="CroakleAppPopupActions">
          <button class="CroakleAppPopupButton CroakleAppPopupSecondaryButton" type="button" data-croakle-popup-close>${cancelLabel}</button>
          <button class="CroakleAppPopupButton" type="button" data-croakle-popup-confirm>${confirmLabel}</button>
        </div>
      </section>
    `;

    overlay.querySelector("[data-croakle-popup-confirm]")?.addEventListener("click", () => {
      CroakleCloseAppPopup();
      onConfirm?.();
    });

    document.body.appendChild(overlay);
  }

  function CroakleSyncFinishedProjectButton() {
    const button = document.querySelector("#CroakleCompleteProjectButton");

    if (!button) {
      return;
    }

    button.textContent = "Finished";
    button.setAttribute("aria-label", "Move project to Finished Projects");
  }

  function CroakleShowFinishedProjectConfirm() {
    CroakleShowAppConfirmPopup({
      title: "Finished?",
      message: "This project will move from Active Projects to Finished Projects. You can reopen it later from the Finished button.",
      confirmLabel: "Finished",
      cancelLabel: "Cancel",
      onConfirm: () => {
        if (typeof CroakleHandleProjectComplete === "function") {
          CroakleHandleProjectComplete();
        }
      },
    });
  }

  function CroakleHandleFinishedProjectClick(event) {
    const button = event.target.closest("#CroakleCompleteProjectButton");

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    CroakleSyncFinishedProjectButton();
    CroakleShowFinishedProjectConfirm();
  }

  document.addEventListener("click", (event) => {
    if (event.target.matches("#CroakleAppPopup") || event.target.closest("[data-croakle-popup-close]")) {
      CroakleCloseAppPopup();
    }
  });

  document.addEventListener("click", CroakleHandleFinishedProjectClick, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") CroakleCloseAppPopup();
  });

  const CroakleFinishedProjectObserver = new MutationObserver(CroakleSyncFinishedProjectButton);
  CroakleFinishedProjectObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  CroakleSyncFinishedProjectButton();

  CroakleNotifyLockedInput = function () {
    CroakleShowAppPopup(
      "Locked",
      "เลือกไว้ให้แก้ได้เฉพาะวันนี้ ปิด Lock ใน Settings หากต้องการแก้วันอื่น"
    );
  };
})();
