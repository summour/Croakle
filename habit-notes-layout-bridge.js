(() => {
  function CroakleInjectHabitNoteLayoutStyles() {
    if (document.querySelector("#CroakleHabitNoteLayoutStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleHabitNoteLayoutStyles";
    style.textContent = `
      .CroakleHabitTop {
        grid-template-columns: 12px minmax(0, 1fr) auto auto;
        align-items: center;
      }

      .CroakleHabitTop .CroakleHabitNoteButton {
        min-height: 28px;
        min-width: 54px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 999px;
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleText, #111111);
        padding: 0 9px;
        font-size: 12px;
        font-weight: 900;
        line-height: 1;
        justify-self: end;
      }

      .CroakleHabitTop .CroakleHabitNoteButton[data-has-note="true"] {
        background: var(--CroakleLine, #111111);
        color: var(--CroakleSurface, #ffffff);
      }

      .CroakleHabitTop .CroakleGoal {
        justify-self: end;
      }

      @media (max-width: 380px) {
        .CroakleHabitTop {
          grid-template-columns: 12px minmax(0, 1fr) auto auto;
          gap: 5px;
        }

        .CroakleHabitTop .CroakleHabitNoteButton {
          min-width: 46px;
          padding: 0 7px;
          font-size: 11px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function CroakleMoveNoteButtonsNextToGoal() {
    document.querySelectorAll(".CroakleHabitTop").forEach((top) => {
      const noteButton = top.querySelector(".CroakleHabitNoteButton");
      const goal = top.querySelector(".CroakleGoal");

      if (!noteButton || !goal || noteButton.nextElementSibling === goal) {
        return;
      }

      top.insertBefore(noteButton, goal);
    });
  }

  function CroakleInitHabitNoteLayout() {
    CroakleInjectHabitNoteLayoutStyles();
    CroakleMoveNoteButtonsNextToGoal();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(CroakleMoveNoteButtonsNextToGoal);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.requestAnimationFrame(CroakleInitHabitNoteLayout);
})();
