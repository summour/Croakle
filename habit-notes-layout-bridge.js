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

  function CroakleNotesEscape(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function CroakleNotesFormatIso(date) {
    return typeof CroakleFormatDate === "function" ? CroakleFormatDate(date) : date.toISOString().slice(0, 10);
  }

  function CroakleNotesSelectedDate() {
    return CroakleState?.trackDate || CroakleNotesFormatIso(new Date());
  }

  function CroakleNotesProjectDate() {
    if (typeof CroakleProjectGetWeekDates !== "function") return CroakleNotesSelectedDate();

    const weekDates = CroakleProjectGetWeekDates();
    const todayIso = CroakleNotesFormatIso(new Date());
    const todayInWeek = weekDates.some((date) => CroakleNotesFormatIso(date) === todayIso);
    return todayInWeek ? todayIso : CroakleNotesFormatIso(weekDates[0]);
  }

  function CroakleNotesProjectDateByDay(dayIndex) {
    if (typeof CroakleProjectGetWeekDates !== "function") return CroakleNotesProjectDate();
    const date = CroakleProjectGetWeekDates()[Number(dayIndex)];
    return date ? CroakleNotesFormatIso(date) : CroakleNotesProjectDate();
  }

  function CroakleNotesHasNote(type, itemId, dateIso) {
    return Boolean(CroakleNotesReadStore()[`${type}::${itemId || "day"}::${dateIso}`]?.note);
  }

  function CroakleNotesButton(type, itemId, itemName, dateIso, label = "Note") {
    const hasNote = CroakleNotesHasNote(type, itemId, dateIso);
    return `
      <button
        class="CroakleNoteButton"
        type="button"
        data-croakle-note-type="${type}"
        data-croakle-note-item-id="${CroakleNotesEscape(itemId)}"
        data-croakle-note-item-name="${CroakleNotesEscape(itemName)}"
        data-croakle-note-date="${dateIso}"
        data-has-note="${hasNote}"
      >${label}</button>
    `;
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

  function CroakleNotesAddHabitButtons() {
    const dateIso = CroakleNotesSelectedDate();

    document.querySelectorAll(".CroakleHabitTop").forEach((top) => {
      if (top.querySelector(".CroakleNoteButton")) return;

      const nameButton = top.querySelector(".CroakleHabitNameButton[data-detail-index]");
      const habitIndex = Number(nameButton?.dataset.detailIndex);
      const habit = CroakleState?.habitTemplates?.[habitIndex];
      const goal = top.querySelector(".CroakleGoal");

      if (!habit || !goal) return;

      top.insertBefore(
        document.createRange().createContextualFragment(CroakleNotesButton("habit", habit.id || `habit-${habitIndex}`, habit.name, dateIso)),
        goal
      );
    });
  }

  function CroakleNotesAddProjectButtons() {
    const dateIso = CroakleNotesProjectDate();
    let projects = [];

    try {
      projects = JSON.parse(localStorage.getItem("CroakleProjectDataV1") || "{}").projects || [];
    } catch {
      projects = [];
    }

    document.querySelectorAll(".CroakleProjectTop").forEach((top) => {
      if (top.querySelector(".CroakleNoteButton")) return;

      const nameButton = top.querySelector(".CroakleProjectNameButton[data-project-detail-index]");
      const projectIndex = Number(nameButton?.dataset.projectDetailIndex);
      const project = projects[projectIndex];
      const goal = top.querySelector(".CroakleProjectGoal");

      if (!project || !goal) return;

      top.insertBefore(
        document.createRange().createContextualFragment(CroakleNotesButton("project", project.id || `project-${projectIndex}`, project.name, dateIso)),
        goal
      );
    });
  }

  function CroakleNotesAddMoodButton() {
    const moodCard = document.querySelector('[data-page="mood"] .CroakleCard');
    if (!moodCard || moodCard.querySelector(".CroakleMoodNoteBar")) return;

    const dateIso = CroakleNotesSelectedDate();
    moodCard.insertAdjacentHTML("beforeend", `
      <div class="CroakleMoodNoteBar">
        ${CroakleNotesButton("mood", "day", "Mood", dateIso, "Mood Note")}
      </div>
    `);
  }

  function CroakleNotesAttachButtons() {
    CroakleNotesAddHabitButtons();
    CroakleNotesAddProjectButtons();
    CroakleNotesAddMoodButton();
    CroakleNotesUpdateCheckIndicators();
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
    if (moodElement) {
      return CroakleNotesGetMoodTarget(moodElement);
    }

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

  function CroakleNotesInitLayout() {
    CroakleNotesWrapRender("CroakleRenderTrackList", CroakleNotesAddHabitButtons);
    CroakleNotesWrapRender("CroakleRenderProjectList", CroakleNotesAddProjectButtons);
    CroakleNotesWrapRender("CroakleRenderMoodCalendar", () => {
      document.querySelector('[data-page="mood"] .CroakleMoodNoteBar')?.remove();
      CroakleNotesAddMoodButton();
      CroakleNotesUpdateCheckIndicators();
    });
    CroakleNotesAttachButtons();
    CroakleNotesBindLongPress();
  }

  window.CroakleNotesAttachButtons = CroakleNotesAttachButtons;
  window.requestAnimationFrame(CroakleNotesInitLayout);
})();
