(() => {
  const CroakleAnalyticsToggleStoreKey = "CroakleAnalyticsNumbersHiddenV1";

  function CroakleGetNumbersHidden() {
    return localStorage.getItem(CroakleAnalyticsToggleStoreKey) === "true";
  }

  function CroakleSaveNumbersHidden(hidden) {
    localStorage.setItem(CroakleAnalyticsToggleStoreKey, String(hidden));
  }

  function CroakleInjectAnalyticsToggleStyles() {
    if (document.querySelector("#CroakleAnalyticsToggleStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleAnalyticsToggleStyles";
    style.textContent = `
      .CroakleAnalyticsToggleButton {
        appearance: none;
        width: 100%;
        min-height: 42px;
        border: 2px solid var(--CroakleLine);
        border-radius: 999px;
        background: var(--CroakleSurface);
        color: var(--CroakleText);
        font: inherit;
        font-size: 15px;
        font-weight: 850;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .CroakleAnalyticsToggleButton:active {
        transform: scale(0.96);
      }

      .CroakleAnalyticsNumbersHidden .CroakleAnalyticsLegend,
      .CroakleAnalyticsNumbersHidden .CroakleAnalyticsPointValue {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleGetAnalyticsCard() {
    return document.querySelector('[data-page="analysis"] .CroakleCard');
  }

  function CroakleGetAnalyticsToggleButton() {
    return document.querySelector("#CroakleAnalyticsToggleNumbers");
  }

  function CroakleUpdateAnalyticsToggleUi() {
    const card = CroakleGetAnalyticsCard();
    const button = CroakleGetAnalyticsToggleButton();
    const hidden = CroakleGetNumbersHidden();

    card?.classList.toggle("CroakleAnalyticsNumbersHidden", hidden);

    if (!button) {
      return;
    }

    button.textContent = hidden ? "Show Numbers" : "Hide Numbers";
    button.setAttribute("aria-pressed", String(hidden));
  }

  function CroakleInjectAnalyticsToggleButton() {
    const card = CroakleGetAnalyticsCard();
    const monthHeader = card?.querySelector(".CroakleMonthHeader");

    if (!card || !monthHeader || CroakleGetAnalyticsToggleButton()) {
      return;
    }

    monthHeader.insertAdjacentHTML("afterend", `
      <button
        class="CroakleAnalyticsToggleButton"
        id="CroakleAnalyticsToggleNumbers"
        type="button"
        aria-pressed="false"
      >Hide Numbers</button>
    `);
  }

  function CroakleToggleAnalyticsNumbers() {
    CroakleSaveNumbersHidden(!CroakleGetNumbersHidden());
    CroakleUpdateAnalyticsToggleUi();
  }

  function CroakleBindAnalyticsToggle() {
    if (window.CroakleAnalyticsToggleBound) {
      return;
    }

    window.CroakleAnalyticsToggleBound = true;

    document.addEventListener("click", (event) => {
      if (!event.target.closest("#CroakleAnalyticsToggleNumbers")) {
        return;
      }

      event.preventDefault();
      CroakleToggleAnalyticsNumbers();
    });
  }

  function CroakleInitAnalyticsToggle() {
    CroakleInjectAnalyticsToggleStyles();
    CroakleInjectAnalyticsToggleButton();
    CroakleUpdateAnalyticsToggleUi();
    CroakleBindAnalyticsToggle();
  }

  const CroakleOriginalSetPageForToggle = window.CroakleSetPage || CroakleSetPage;

  if (typeof CroakleOriginalSetPageForToggle === "function" && !window.CroakleAnalyticsToggleSetPagePatched) {
    window.CroakleAnalyticsToggleSetPagePatched = true;

    CroakleSetPage = function CroakleSetPageWithAnalyticsToggle(pageName) {
      CroakleOriginalSetPageForToggle(pageName);

      if (pageName === "analysis") {
        CroakleInitAnalyticsToggle();
      }
    };
  }

  window.requestAnimationFrame(CroakleInitAnalyticsToggle);
})();
