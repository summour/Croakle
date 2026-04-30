(() => {
  const CroakleNativeUxStyleId = "CroakleNativeUxStyles";
  const CroaklePressSelector = "button, [role='button'], .CroakleHabitNameButton, .CroakleProjectNameButton, .CroakleMoodBadge";

  function CroakleNativeHaptic(pattern = 4) {
    if (typeof window.CroakleHaptic === "function") {
      window.CroakleHaptic(pattern);
    }
  }

  function CroakleInjectNativeUxStyles() {
    if (document.querySelector(`#${CroakleNativeUxStyleId}`)) return;

    const style = document.createElement("style");
    style.id = CroakleNativeUxStyleId;
    style.textContent = `
      :root {
        --CroakleNativeEase: cubic-bezier(0.16, 1, 0.3, 1);
        --CroakleNativeFastEase: cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      .CroakleHabitMoodShell {
        overscroll-behavior: none;
        -webkit-user-select: none;
        user-select: none;
      }

      .CroaklePage {
        transform: translateX(12px) scale(0.985);
        opacity: 0;
        transition: transform 260ms var(--CroakleNativeEase), opacity 220ms ease;
        will-change: transform, opacity;
      }

      .CroaklePageActive {
        transform: translateX(0) scale(1);
        opacity: 1;
      }

      .CroakleNativePressable {
        transition: transform 160ms var(--CroakleNativeFastEase), filter 160ms ease, background 160ms ease;
        -webkit-tap-highlight-color: transparent;
      }

      .CroakleNativePressed {
        transform: scale(0.955);
        filter: brightness(0.98);
      }

      .CroakleCheckButton,
      .CroakleProjectCheckButton,
      .CroakleMoodBadge {
        transition: transform 180ms var(--CroakleNativeEase), background 180ms ease, color 180ms ease, box-shadow 180ms ease;
        will-change: transform;
      }

      .CroakleCheckDone,
      .CroakleProjectCheckDone {
        animation: CroakleNativePop 260ms var(--CroakleNativeEase) both;
      }

      .CroakleHabitRow,
      .CroakleProjectRow,
      .CroakleBestRow {
        animation: CroakleNativeRowIn 240ms var(--CroakleNativeEase) both;
      }

      .CroakleNativeSwipeHint {
        position: fixed;
        left: 50%;
        bottom: max(86px, calc(env(safe-area-inset-bottom) + 70px));
        z-index: 210;
        transform: translateX(-50%);
        border: 2px solid #111111;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.92);
        color: #111111;
        padding: 10px 14px;
        font-size: 13px;
        font-weight: 900;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        animation: CroakleNativeHintIn 260ms var(--CroakleNativeEase) both;
        pointer-events: none;
      }

      @keyframes CroakleNativePop {
        0% { transform: scale(0.76); }
        72% { transform: scale(1.08); }
        100% { transform: scale(1); }
      }

      @keyframes CroakleNativeRowIn {
        from { transform: translateY(8px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      @keyframes CroakleNativeHintIn {
        from { transform: translate(-50%, 12px) scale(0.96); opacity: 0; }
        to { transform: translate(-50%, 0) scale(1); opacity: 1; }
      }

      @media (prefers-reduced-motion: reduce) {
        .CroaklePage,
        .CroakleNativePressable,
        .CroakleCheckButton,
        .CroakleProjectCheckButton,
        .CroakleMoodBadge,
        .CroakleHabitRow,
        .CroakleProjectRow,
        .CroakleBestRow,
        .CroakleNativeSwipeHint {
          animation: none;
          transition: none;
          transform: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleEnhancePressables() {
    document.querySelectorAll(CroaklePressSelector).forEach((element) => {
      element.classList.add("CroakleNativePressable");
    });
  }

  function CroakleShowNativeHint(text) {
    if (typeof window.CroakleToast === "function") {
      window.CroakleToast(text, { duration: 900, haptic: 4 });
      return;
    }

    document.querySelector(".CroakleNativeSwipeHint")?.remove();
    const hint = document.createElement("div");
    hint.className = "CroakleNativeSwipeHint";
    hint.textContent = text;
    document.body.appendChild(hint);
    window.setTimeout(() => hint.remove(), 900);
  }

  function CroakleGetActivePageName() {
    return document.querySelector(".CroaklePageActive")?.dataset.page || "menu";
  }

  function CroakleGoBackLikeNative() {
    const isModalOpen = Boolean(document.querySelector('.CroakleModalSystemDialog[data-croakle-modal-open="true"], .CroakleHabitNoteModal:not([hidden]), .CroakleAlertOverlay:not([hidden])'));
    if (isModalOpen || CroakleGetActivePageName() === "menu" || typeof window.CroakleSetPage !== "function") return;

    CroakleNativeHaptic(6);
    window.CroakleSetPage("menu");
    CroakleShowNativeHint("Back to Home");
  }

  function CroakleBindNativeUx() {
    if (window.CroakleNativeUxBound) return;
    window.CroakleNativeUxBound = true;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    document.addEventListener("pointerdown", (event) => {
      const pressable = event.target.closest(CroaklePressSelector);
      if (pressable && !pressable.disabled) pressable.classList.add("CroakleNativePressed");
      startX = event.clientX;
      startY = event.clientY;
      startTime = Date.now();
    }, true);

    document.addEventListener("pointerup", (event) => {
      document.querySelectorAll(".CroakleNativePressed").forEach((element) => element.classList.remove("CroakleNativePressed"));

      const deltaX = event.clientX - startX;
      const deltaY = Math.abs(event.clientY - startY);
      const isBackSwipe = startX < 28 && deltaX > 84 && deltaY < 72 && Date.now() - startTime < 700;
      if (isBackSwipe) CroakleGoBackLikeNative();
    }, true);

    document.addEventListener("pointercancel", () => {
      document.querySelectorAll(".CroakleNativePressed").forEach((element) => element.classList.remove("CroakleNativePressed"));
    }, true);

    document.addEventListener("click", (event) => {
      const pressable = event.target.closest(CroaklePressSelector);
      if (pressable && !pressable.disabled) CroakleNativeHaptic(4);
    }, true);
  }

  function CroakleInitNativeUx() {
    CroakleInjectNativeUxStyles();
    CroakleEnhancePressables();
    CroakleBindNativeUx();
  }

  CroakleInitNativeUx();
  new MutationObserver(CroakleInitNativeUx).observe(document.body, { childList: true, subtree: true });
})();
