(() => {
  const CroakleNotesStoreKey = "CroakleDailyNotesLiteV1";

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

  function CroakleNotesInitLayout() {
    CroakleNotesWrapRender("CroakleRenderTrackList", CroakleNotesAddHabitButtons);
    CroakleNotesWrapRender("CroakleRenderProjectList", CroakleNotesAddProjectButtons);
    CroakleNotesWrapRender("CroakleRenderMoodCalendar", () => {
      document.querySelector('[data-page="mood"] .CroakleMoodNoteBar')?.remove();
      CroakleNotesAddMoodButton();
    });
    CroakleNotesAttachButtons();
  }

  window.CroakleNotesAttachButtons = CroakleNotesAttachButtons;
  window.requestAnimationFrame(CroakleNotesInitLayout);
})();
