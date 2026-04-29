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

  document.addEventListener("click", (event) => {
    if (event.target.matches("#CroakleAppPopup") || event.target.closest("[data-croakle-popup-close]")) {
      CroakleCloseAppPopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") CroakleCloseAppPopup();
  });

  CroakleNotifyLockedInput = function () {
    CroakleShowAppPopup(
      "Locked",
      "เลือกไว้ให้แก้ได้เฉพาะวันนี้ ปิด Lock ใน Settings หากต้องการแก้วันอื่น"
    );
  };
})();
