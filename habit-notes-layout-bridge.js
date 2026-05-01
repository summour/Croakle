(() => {
  const CroakleNotesStoreKey = "CroakleDailyNotesLiteV1";
  const CroakleLongPressMs = 560;
  let CroakleLongPressTimer = null;
  let CroakleLongPressHandled = false;
  let CroakleLongPressTarget = null;

  function CroakleNotesReadStore() {
    try {
      const store = JSON.parse(localStorage.getItem(CroakleNotesStoreKey) || "{}");
      return store && typeof store === "object" && !Array.isArray(store) ? store : {};
    } catch {
      return {};
    }
  }

  function CroakleNotesFormatIso(date) {
    return typeof CroakleFormatDate === "function" ? CroakleFormatDate(date) : date.toISOString().slice(0, 10);
  }

  function CroakleNotesProjectDateByDay(dayIndex) {
    if (typeof CroakleProjectGetWeekDates !== "function") return CroakleState?.trackDate || CroakleNotesFormatIso(new Date());
    const date = CroakleProjectGetWeekDates()[Number(dayIndex)];
    return date ? CroakleNotesFormatIso(date) : CroakleNotesFormatIso(new Date());
  }

  function CroakleNotesHasNote(type, itemId, dateIso) {
    return Boolean(CroakleNotesReadStore()[`${type}::${itemId || "day"}::${dateIso}`]?.note);
  }

  function CroakleNotesClickVirtualButton(type, itemId, itemName, dateIso) {
    const button = document.createElement("button");
    button.type = "button";
    button.hidden = true;
    button.dataset.croakleNoteType = type;
    button.dataset.croakleNoteItemId = itemId || "day";
    button.dataset.croakleNoteItemName = itemName || "Day";
    button.dataset.croakleNoteDate = dateIso;
    document.body.appendChild(button);
    button.click();
    button.remove();
  }

  function CroakleNotesGetHabitTarget(checkButton) {
    const habitIndex = Number(checkButton.dataset.habitIndex);
    const habit = CroakleState?.habitTemplates?.[habitIndex];
    const dateIso = checkButton.dataset.dateIso;

    if (!habit || !dateIso) return null;

    return {
      type: "habit",
      itemId: habit.id || `habit-${habitIndex}`,
      itemName: habit.name,
      dateIso,
    };
  }

  function CroakleNotesGetProjectTarget(checkButton) {
    const projectIndex = Number(checkButton.dataset.projectIndex);
    const projectDay = Number(checkButton.dataset.projectDay);
    const dateIso = checkButton.dataset.dateIso || CroakleNotesProjectDateByDay(projectDay);
    let projects = [];

    try {
      projects = JSON.parse(localStorage.getItem("CroakleProjectDataV1") || "{}").projects || [];
    } catch {
      projects = [];
    }

    const project = projects[projectIndex];
    if (!project || !dateIso) return null;

    return {
      type: "project",
      itemId: project.id || `project-${projectIndex}`,
      itemName: project.name,
      dateIso,
    };
  }

  function CroakleNotesGetMoodTarget(moodElement) {
    const dateIso = moodElement.dataset.dateIso;
    if (!dateIso) return null;

    return {
      type: "mood",
      itemId: "day",
      itemName: "Mood",
      dateIso,
    };
  }

  function CroakleNotesUpdateCheckIndicators() {
    document.querySelectorAll(".CroakleCheckButton").forEach((button) => {
      const target = CroakleNotesGetHabitTarget(button);
      if (target) button.dataset.hasNote = String(CroakleNotesHasNote(target.type, target.itemId, target.dateIso));
    });

    document.querySelectorAll(".CroakleProjectCheckButton").forEach((button) => {
      const target = CroakleNotesGetProjectTarget(button);
      if (target) button.dataset.hasNote = String(CroakleNotesHasNote(target.type, target.itemId, target.dateIso));
    });

    document.querySelectorAll('[data-page="mood"] [data-date-iso]').forEach((moodElement) => {
      const target = CroakleNotesGetMoodTarget(moodElement);
      if (target) moodElement.dataset.hasNote = String(CroakleNotesHasNote(target.type, target.itemId, target.dateIso));
    });
  }

  function CroakleNotesInjectStyles() {
    if (document.querySelector("#CroakleNotesLayoutStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleNotesLayoutStyles";
    style.textContent = `
      .CroakleNotesLiteDayChip[data-has-note="false"] {
        display: none;
      }

      .CroakleNotesLiteDayChip[data-has-note="true"] {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleNotesRemoveVisibleButtons() {
    document.querySelectorAll(".CroakleNoteButton, .CroakleMoodNoteBar").forEach((element) => element.remove());
  }

  function CroakleNotesWrapRender(name, afterRender) {
    if (typeof window[name] !== "function") return;

    const original = window[name];
    if (original.CroakleNotesWrapped) return;

    window[name] = function CroakleNotesWrappedRender(...args) {
      const result = original.apply(this, args);
      afterRender();
      return result;
    };
    window[name].CroakleNotesWrapped = true;
  }

  function CroakleNotesClearLongPress() {
    if (CroakleLongPressTimer) {
      window.clearTimeout(CroakleLongPressTimer);
      CroakleLongPressTimer = null;
    }
  }

  function CroakleNotesFindLongPressTarget(event) {
    const checkButton = event.target.closest(".CroakleCheckButton, .CroakleProjectCheckButton");
    if (checkButton && !checkButton.disabled) {
      return checkButton.classList.contains("CroakleProjectCheckButton")
        ? CroakleNotesGetProjectTarget(checkButton)
        : CroakleNotesGetHabitTarget(checkButton);
    }

    const moodElement = event.target.closest('[data-page="mood"] [data-date-iso]');
    if (moodElement) return CroakleNotesGetMoodTarget(moodElement);

    return null;
  }

  function CroakleNotesBindLongPress() {
    if (window.CroakleNotesLongPressBound) return;
    window.CroakleNotesLongPressBound = true;

    document.addEventListener("pointerdown", (event) => {
      const target = CroakleNotesFindLongPressTarget(event);
      if (!target) return;

      CroakleNotesClearLongPress();
      CroakleLongPressHandled = false;
      CroakleLongPressTarget = target;
      CroakleLongPressTimer = window.setTimeout(() => {
        CroakleLongPressHandled = true;
        CroakleNotesClickVirtualButton(
          CroakleLongPressTarget.type,
          CroakleLongPressTarget.itemId,
          CroakleLongPressTarget.itemName,
          CroakleLongPressTarget.dateIso
        );
      }, CroakleLongPressMs);
    }, { passive: true });

    document.addEventListener("pointerup", CroakleNotesClearLongPress, { passive: true });
    document.addEventListener("pointercancel", CroakleNotesClearLongPress, { passive: true });
    document.addEventListener("scroll", CroakleNotesClearLongPress, { passive: true });

    document.addEventListener("click", (event) => {
      if (!CroakleLongPressHandled) return;
      const interactiveElement = event.target.closest(".CroakleCheckButton, .CroakleProjectCheckButton, [data-page='mood'] [data-date-iso]");
      if (!interactiveElement) return;
      event.preventDefault();
      event.stopPropagation();
      CroakleLongPressHandled = false;
    });
  }

  function CroakleNotesRefreshLayout() {
    CroakleNotesRemoveVisibleButtons();
    CroakleNotesUpdateCheckIndicators();
  }

  function CroakleNotesInitLayout() {
    CroakleNotesInjectStyles();
    CroakleNotesWrapRender("CroakleRenderTrackList", CroakleNotesRefreshLayout);
    CroakleNotesWrapRender("CroakleRenderProjectList", CroakleNotesRefreshLayout);
    CroakleNotesWrapRender("CroakleRenderMoodCalendar", CroakleNotesRefreshLayout);
    CroakleNotesRefreshLayout();
    CroakleNotesBindLongPress();
  }

  window.CroakleNotesAttachButtons = CroakleNotesRefreshLayout;
  window.requestAnimationFrame(CroakleNotesInitLayout);
})();
