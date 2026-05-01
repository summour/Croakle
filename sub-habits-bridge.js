(() => {
  const CroakleSubHabitSoftLimit = 5;
  const CroakleHabitStoreKey = "CroakleHabitMoodDataCleanV1";

  function CroakleSubMergeStoredData() {
    try {
      const saved = JSON.parse(localStorage.getItem(CroakleHabitStoreKey) || "{}");
      const savedHabits = Array.isArray(saved.habitTemplates) ? saved.habitTemplates : [];
      if (!Array.isArray(CroakleState?.habitTemplates)) return;

      CroakleState.habitTemplates.forEach((habit, index) => {
        const savedHabit = savedHabits[index];
        if (!savedHabit) return;
        if (Array.isArray(savedHabit.subHabits)) habit.subHabits = savedHabit.subHabits;
        if (savedHabit.subHabitWins && typeof savedHabit.subHabitWins === "object" && !Array.isArray(savedHabit.subHabitWins)) {
          habit.subHabitWins = savedHabit.subHabitWins;
        }
      });
    } catch {
      // Keep app usable if old storage is malformed.
    }
  }

  function CroakleSubNormalizeList(habit) {
    if (!Array.isArray(habit.subHabits)) habit.subHabits = [];
    if (!habit.subHabitWins || typeof habit.subHabitWins !== "object" || Array.isArray(habit.subHabitWins)) habit.subHabitWins = {};
    habit.subHabits = habit.subHabits.map((item) => String(item || "").trim()).filter(Boolean).slice(0, CroakleSubHabitSoftLimit);
    return habit;
  }

  function CroakleSubGetHabitByIndex(habitIndex) {
    const habit = CroakleState?.habitTemplates?.[habitIndex];
    return habit ? CroakleSubNormalizeList(habit) : null;
  }

  function CroakleSubGetHabitById(itemId) {
    const habits = CroakleState?.habitTemplates || [];
    const habitIndex = habits.findIndex((habit, index) => (habit.id || `habit-${index}`) === itemId);
    return habitIndex >= 0 ? { habit: CroakleSubNormalizeList(habits[habitIndex]), habitIndex } : null;
  }

  function CroakleSubGetWins(habit, dateIso) {
    CroakleSubNormalizeList(habit);
    const savedWins = Array.isArray(habit.subHabitWins[dateIso]) ? habit.subHabitWins[dateIso] : [];
    return habit.subHabits.map((_, index) => Boolean(savedWins[index]));
  }

  function CroakleSubSetWins(habit, dateIso, wins) {
    CroakleSubNormalizeList(habit);
    habit.subHabitWins[dateIso] = habit.subHabits.map((_, index) => Boolean(wins[index]));
  }

  function CroakleSubSaveState() {
    if (typeof CroakleSaveState === "function") CroakleSaveState();
  }

  function CroakleSubEscape(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function CroakleSubInjectStyles() {
    if (document.querySelector("#CroakleSubHabitStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSubHabitStyles";
    style.textContent = `
      .CroakleSubEditor {
        display: grid;
        gap: 10px;
        border: 2px solid #111111;
        border-radius: 20px;
        padding: 12px;
        background: #fafafa;
      }

      .CroakleSubEditorHeader,
      .CroakleSubNoteHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .CroakleSubEditorHeader strong,
      .CroakleSubNoteHeader strong {
        color: #111111;
        font-size: 15px;
        font-weight: 950;
      }

      .CroakleSubEditorHeader span,
      .CroakleSubNoteHeader span {
        color: #666666;
        font-size: 12px;
        font-weight: 850;
      }

      .CroakleSubEditorList {
        display: grid;
        gap: 8px;
        max-height: 210px;
        overflow-y: auto;
        scrollbar-width: none;
      }

      .CroakleSubEditorList::-webkit-scrollbar { display: none; }

      .CroakleSubEditorRow {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr) 34px;
        align-items: center;
        gap: 8px;
      }

      .CroakleSubEditorHandle {
        color: #888888;
        font-size: 17px;
        font-weight: 950;
        text-align: center;
      }

      .CroakleSubEditorInput {
        width: 100%;
        min-height: 40px;
        border: 2px solid #111111;
        border-radius: 14px;
        background: #ffffff;
        color: #111111;
        padding: 0 10px;
        font: inherit;
        font-size: 14px;
        font-weight: 850;
      }

      .CroakleSubEditorRemove,
      .CroakleSubEditorAdd {
        border: 2px solid #111111;
        background: #ffffff;
        color: #111111;
        font-weight: 950;
        touch-action: manipulation;
      }

      .CroakleSubEditorRemove {
        width: 34px;
        height: 34px;
        border-radius: 12px;
        font-size: 17px;
      }

      .CroakleSubEditorAdd {
        min-height: 40px;
        border-radius: 14px;
        font-size: 14px;
      }

      .CroakleSubNoteSection {
        display: grid;
        gap: 8px;
        padding: 2px 0 12px;
        border-bottom: 2px solid #111111;
      }

      .CroakleSubNoteList {
        display: grid;
        gap: 4px;
        max-height: 170px;
        overflow-y: auto;
        scrollbar-width: none;
      }

      .CroakleSubNoteList::-webkit-scrollbar { display: none; }

      .CroakleSubNoteRow {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr);
        align-items: center;
        gap: 10px;
        min-height: 40px;
        padding: 2px 0;
      }

      .CroakleSubNoteRow button {
        width: 30px;
        height: 30px;
        border: 2px solid #111111;
        border-radius: 999px;
        background: #ffffff;
        color: #111111;
        font-size: 17px;
        font-weight: 950;
        line-height: 1;
        touch-action: manipulation;
      }

      .CroakleSubNoteRow[data-done="true"] button {
        background: #111111;
        color: #ffffff;
      }

      .CroakleSubNoteRow span {
        min-width: 0;
        color: #111111;
        font-size: 15px;
        font-weight: 850;
        line-height: 1.25;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleSubAddEditorToHabitDetail() {
    const form = document.querySelector("#CroakleHabitDetailForm");
    const priorityField = form?.querySelector(".CroaklePriorityField");
    if (!form || !priorityField || form.querySelector("#CroakleSubHabitEditor")) return;

    priorityField.insertAdjacentHTML("beforebegin", `
      <section class="CroakleSubEditor" id="CroakleSubHabitEditor" aria-label="Sub-habits">
        <div class="CroakleSubEditorHeader">
          <strong>Sub-habits</strong>
          <span>Small wins · max ${CroakleSubHabitSoftLimit}</span>
        </div>
        <div class="CroakleSubEditorList" id="CroakleSubHabitEditorList"></div>
        <button class="CroakleSubEditorAdd" type="button" id="CroakleSubHabitAddButton">+ Add sub-habit</button>
      </section>
    `);
  }

  function CroakleSubRenderEditor(habitIndex, draftList = null) {
    const list = document.querySelector("#CroakleSubHabitEditorList");
    const addButton = document.querySelector("#CroakleSubHabitAddButton");
    const habit = CroakleSubGetHabitByIndex(habitIndex);
    if (!list || !addButton || !habit) return;

    const rows = Array.isArray(draftList) ? draftList.slice(0, CroakleSubHabitSoftLimit) : habit.subHabits;
    list.innerHTML = rows.map((text, index) => `
      <div class="CroakleSubEditorRow">
        <span class="CroakleSubEditorHandle">≡</span>
        <input class="CroakleSubEditorInput" type="text" value="${CroakleSubEscape(text)}" data-sub-index="${index}" placeholder="Small win" />
        <button class="CroakleSubEditorRemove" type="button" data-sub-remove="${index}" aria-label="Remove sub-habit">×</button>
      </div>
    `).join("");

    addButton.disabled = rows.length >= CroakleSubHabitSoftLimit;
  }

  function CroakleSubReadEditorValues(keepBlank = false) {
    const values = [...document.querySelectorAll(".CroakleSubEditorInput")].map((input) => String(input.value || "").trim());
    return (keepBlank ? values : values.filter(Boolean)).slice(0, CroakleSubHabitSoftLimit);
  }

  function CroakleSubOpenHabitDetailFromButton(button) {
    window.requestAnimationFrame(() => {
      const habitIndex = Number(button?.dataset.detailIndex ?? document.querySelector("#CroakleHabitDetailIndex")?.value);
      CroakleSubAddEditorToHabitDetail();
      CroakleSubRenderEditor(habitIndex);
    });
  }

  function CroakleSubPatchHabitDetail() {
    if (window.CroakleSubHabitDetailPatched) return;
    window.CroakleSubHabitDetailPatched = true;

    document.addEventListener("click", (event) => {
      const button = event.target.closest(".CroakleHabitNameButton[data-detail-index]");
      if (button) CroakleSubOpenHabitDetailFromButton(button);
    });

    const form = document.querySelector("#CroakleHabitDetailForm");
    if (!form) return;

    form.addEventListener("submit", () => {
      const habitIndex = Number(form.elements.habitIndex?.value);
      const habit = CroakleSubGetHabitByIndex(habitIndex);
      if (!habit) return;

      const previousWins = habit.subHabitWins || {};
      habit.subHabits = CroakleSubReadEditorValues(false);
      habit.subHabitWins = previousWins;
    }, true);

    form.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-sub-remove]");
      const addButton = event.target.closest("#CroakleSubHabitAddButton");
      const habitIndex = Number(form.elements.habitIndex?.value);
      const habit = CroakleSubGetHabitByIndex(habitIndex);
      if (!habit) return;

      if (removeButton) {
        event.preventDefault();
        const draft = CroakleSubReadEditorValues(true);
        draft.splice(Number(removeButton.dataset.subRemove), 1);
        CroakleSubRenderEditor(habitIndex, draft);
        return;
      }

      if (addButton) {
        event.preventDefault();
        const draft = CroakleSubReadEditorValues(true);
        if (draft.length < CroakleSubHabitSoftLimit) draft.push("");
        CroakleSubRenderEditor(habitIndex, draft);
      }
    });
  }

  function CroakleSubRenderNoteSection(type, itemId, dateIso) {
    const form = document.querySelector("#CroakleNotesLiteForm");
    if (!form) return;

    form.querySelector("#CroakleSubNoteSection")?.remove();
    if (type !== "habit") return;

    const match = CroakleSubGetHabitById(itemId);
    if (!match || !match.habit.subHabits.length) return;

    const wins = CroakleSubGetWins(match.habit, dateIso);
    const noteLabel = form.querySelector(".CroakleField");
    if (!noteLabel) return;

    noteLabel.insertAdjacentHTML("beforebegin", `
      <section class="CroakleSubNoteSection" id="CroakleSubNoteSection" data-sub-habit-index="${match.habitIndex}" data-sub-date="${dateIso}">
        <div class="CroakleSubNoteHeader">
          <strong>Small Wins</strong>
          <span>${wins.filter(Boolean).length}/${match.habit.subHabits.length}</span>
        </div>
        <div class="CroakleSubNoteList">
          ${match.habit.subHabits.map((text, index) => `
            <div class="CroakleSubNoteRow" data-sub-note-row="${index}" data-done="${wins[index]}">
              <button type="button" data-sub-note-toggle="${index}">${wins[index] ? "✓" : ""}</button>
              <span>${CroakleSubEscape(text)}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `);
  }

  function CroakleSubOpenNoteSection(noteButton) {
    window.requestAnimationFrame(() => {
      CroakleSubRenderNoteSection(
        noteButton.dataset.croakleNoteType,
        noteButton.dataset.croakleNoteItemId,
        noteButton.dataset.croakleNoteDate
      );
    });
  }

  function CroakleSubSaveNoteSection() {
    const section = document.querySelector("#CroakleSubNoteSection");
    if (!section) return;

    const habitIndex = Number(section.dataset.subHabitIndex);
    const dateIso = section.dataset.subDate;
    const habit = CroakleSubGetHabitByIndex(habitIndex);
    if (!habit || !dateIso) return;

    const wins = [...section.querySelectorAll("[data-sub-note-row]")].map((row) => row.dataset.done === "true");
    CroakleSubSetWins(habit, dateIso, wins);
    CroakleSubSaveState();
  }

  function CroakleSubBindEvents() {
    if (window.CroakleSubHabitEventsBound) return;
    window.CroakleSubHabitEventsBound = true;

    document.addEventListener("click", (event) => {
      const noteButton = event.target.closest("[data-croakle-note-type]");
      if (noteButton) {
        CroakleSubOpenNoteSection(noteButton);
        return;
      }

      const toggleButton = event.target.closest("[data-sub-note-toggle]");
      if (toggleButton) {
        event.preventDefault();
        const row = toggleButton.closest("[data-sub-note-row]");
        const nextDone = row.dataset.done !== "true";
        row.dataset.done = String(nextDone);
        toggleButton.textContent = nextDone ? "✓" : "";
        const headerCount = document.querySelector(".CroakleSubNoteHeader span");
        const rows = [...document.querySelectorAll("[data-sub-note-row]")];
        if (headerCount) headerCount.textContent = `${rows.filter((item) => item.dataset.done === "true").length}/${rows.length}`;
      }
    });

    document.addEventListener("submit", (event) => {
      if (event.target.id !== "CroakleNotesLiteForm") return;
      CroakleSubSaveNoteSection();
    }, true);
  }

  function CroakleSubInit() {
    CroakleSubMergeStoredData();
    CroakleSubInjectStyles();
    CroakleSubAddEditorToHabitDetail();
    CroakleSubPatchHabitDetail();
    CroakleSubBindEvents();
  }

  window.requestAnimationFrame(CroakleSubInit);
})();
