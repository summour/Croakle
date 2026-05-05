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
        if (savedHabit.subHabitNotes && typeof savedHabit.subHabitNotes === "object" && !Array.isArray(savedHabit.subHabitNotes)) {
          habit.subHabitNotes = savedHabit.subHabitNotes;
        }
      });
    } catch {
      // Keep app usable if old storage is malformed.
    }
  }

  function CroakleSubNormalizeList(habit) {
    if (!Array.isArray(habit.subHabits)) habit.subHabits = [];
    if (!habit.subHabitWins || typeof habit.subHabitWins !== "object" || Array.isArray(habit.subHabitWins)) habit.subHabitWins = {};
    if (!habit.subHabitNotes || typeof habit.subHabitNotes !== "object" || Array.isArray(habit.subHabitNotes)) habit.subHabitNotes = {};
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

  function CroakleSubGetDateIso() {
    return CroakleState?.trackDate || (typeof CroakleFormatDate === "function" ? CroakleFormatDate(new Date()) : new Date().toISOString().slice(0, 10));
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

  function CroakleSubGetNotes(habit, dateIso) {
    CroakleSubNormalizeList(habit);
    const savedNotes = Array.isArray(habit.subHabitNotes[dateIso]) ? habit.subHabitNotes[dateIso] : [];
    return habit.subHabits.map((_, index) => String(savedNotes[index] || ""));
  }

  function CroakleSubSetNote(habit, dateIso, subIndex, note) {
    CroakleSubNormalizeList(habit);
    const notes = CroakleSubGetNotes(habit, dateIso);
    notes[subIndex] = String(note || "").trim();

    if (notes.some(Boolean)) habit.subHabitNotes[dateIso] = notes;
    else delete habit.subHabitNotes[dateIso];
  }

  function CroakleSubGetSummary(habit, dateIso) {
    CroakleSubNormalizeList(habit);
    if (!habit.subHabits.length) return null;

    const wins = CroakleSubGetWins(habit, dateIso);
    return {
      done: wins.filter(Boolean).length,
      total: habit.subHabits.length,
    };
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
      .CroakleHabitTop {
        grid-template-columns: 12px minmax(0, 1fr) auto auto;
      }

      .CroakleSubWinsBadge {
        min-height: 26px;
        min-width: 72px;
        border: 2px solid #111111;
        border-radius: 10px;
        padding: 2px 7px;
        background: #f5f5f5;
        color: #111111;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 14px;
        font-weight: 850;
        line-height: 1;
        white-space: nowrap;
      }

      .CroakleSubEditor {
        display: grid;
        gap: 10px;
        border: 2px solid #111111;
        border-radius: 20px;
        padding: 12px;
        background: #fafafa;
      }

      .CroakleSubEditorHeader,
      .CroakleSubNoteHeader,
      .CroakleSubInlineNoteHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .CroakleSubEditorHeader strong,
      .CroakleSubNoteHeader strong,
      .CroakleSubInlineNoteHeader strong {
        color: #111111;
        font-size: 15px;
        font-weight: 950;
      }

      .CroakleSubEditorHeader span,
      .CroakleSubNoteHeader span,
      .CroakleSubInlineNoteHeader span {
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
      .CroakleSubEditorAdd,
      .CroakleSubRowNoteButton,
      .CroakleSubInlineNoteSave {
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

      .CroakleSubEditorAdd,
      .CroakleSubInlineNoteSave {
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
        grid-template-columns: 34px minmax(0, 1fr) minmax(64px, auto);
        align-items: center;
        gap: 10px;
        min-height: 40px;
        padding: 2px 0;
      }

      .CroakleSubNoteRow > button[data-sub-note-toggle] {
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

      .CroakleSubNoteRow[data-done="true"] > button[data-sub-note-toggle] {
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

      .CroakleSubRowNoteButton {
        min-height: 34px;
        border-radius: 12px;
        padding: 0 12px;
        font-size: 14px;
        line-height: 1;
        white-space: nowrap;
      }

      .CroakleSubRowNoteButton[data-has-note="true"] {
        background: #111111;
        color: #ffffff;
      }

      .CroakleSubInlineNoteEditor {
        display: grid;
        gap: 8px;
        margin-top: 4px;
        border: 2px solid #111111;
        border-radius: 18px;
        padding: 10px;
        background: #ffffff;
      }

      .CroakleSubInlineNoteTextarea {
        width: 100%;
        min-height: 92px;
        resize: vertical;
        border: 2px solid #111111;
        border-radius: 14px;
        background: #ffffff;
        color: #111111;
        padding: 10px;
        font: inherit;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.35;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleSubEditorMarkup(idPrefix, title = "Sub-habits") {
    return `
      <section class="CroakleSubEditor" id="${idPrefix}Editor" aria-label="${title}">
        <div class="CroakleSubEditorHeader">
          <strong>${title}</strong>
          <span>Small wins · max ${CroakleSubHabitSoftLimit}</span>
        </div>
        <div class="CroakleSubEditorList" id="${idPrefix}EditorList"></div>
        <button class="CroakleSubEditorAdd" type="button" id="${idPrefix}AddButton">+ Add sub-habit</button>
      </section>
    `;
  }

  function CroakleSubAddEditorToForm(formId, idPrefix) {
    const form = document.querySelector(formId);
    const priorityField = form?.querySelector(".CroaklePriorityField");
    if (!form || !priorityField || form.querySelector(`#${idPrefix}Editor`)) return;
    priorityField.insertAdjacentHTML("beforebegin", CroakleSubEditorMarkup(idPrefix));
  }

  function CroakleSubRenderEditor(idPrefix, rows) {
    const list = document.querySelector(`#${idPrefix}EditorList`);
    const addButton = document.querySelector(`#${idPrefix}AddButton`);
    if (!list || !addButton) return;

    const safeRows = Array.isArray(rows) ? rows.slice(0, CroakleSubHabitSoftLimit) : [];
    list.innerHTML = safeRows.map((text, index) => `
      <div class="CroakleSubEditorRow">
        <span class="CroakleSubEditorHandle">≡</span>
        <input class="CroakleSubEditorInput" type="text" value="${CroakleSubEscape(text)}" data-sub-editor="${idPrefix}" data-sub-index="${index}" placeholder="Small win" />
        <button class="CroakleSubEditorRemove" type="button" data-sub-editor="${idPrefix}" data-sub-remove="${index}" aria-label="Remove sub-habit">×</button>
      </div>
    `).join("");

    addButton.disabled = safeRows.length >= CroakleSubHabitSoftLimit;
  }

  function CroakleSubReadEditorValues(idPrefix, keepBlank = false) {
    const values = [...document.querySelectorAll(`[data-sub-editor="${idPrefix}"].CroakleSubEditorInput`)]
      .map((input) => String(input.value || "").trim());
    return (keepBlank ? values : values.filter(Boolean)).slice(0, CroakleSubHabitSoftLimit);
  }

  function CroakleSubResetAddEditor() {
    CroakleSubAddEditorToForm("#CroakleAddHabitForm", "CroakleSubAdd");
    CroakleSubRenderEditor("CroakleSubAdd", []);
  }

  function CroakleSubOpenHabitDetailFromButton(button) {
    window.requestAnimationFrame(() => {
      const habitIndex = Number(button?.dataset.detailIndex ?? document.querySelector("#CroakleHabitDetailIndex")?.value);
      const habit = CroakleSubGetHabitByIndex(habitIndex);
      CroakleSubAddEditorToForm("#CroakleHabitDetailForm", "CroakleSubHabit");
      CroakleSubRenderEditor("CroakleSubHabit", habit?.subHabits || []);
    });
  }

  function CroakleSubApplyAddEditorToNewHabit(subHabits) {
    window.setTimeout(() => {
      const habits = CroakleState?.habitTemplates;
      if (!Array.isArray(habits) || !habits.length) return;

      const cleanSubHabits = subHabits.map((item) => String(item || "").trim()).filter(Boolean).slice(0, CroakleSubHabitSoftLimit);
      const habit = habits[habits.length - 1];
      habit.subHabits = cleanSubHabits;
      habit.subHabitWins = {};
      habit.subHabitNotes = {};
      CroakleSubSaveState();
      if (typeof CroakleRenderTrackList === "function") CroakleRenderTrackList();
      CroakleSubResetAddEditor();
    }, 0);
  }

  function CroakleSubPatchForms() {
    if (window.CroakleSubHabitFormsPatched) return;
    window.CroakleSubHabitFormsPatched = true;

    document.addEventListener("click", (event) => {
      const detailButton = event.target.closest(".CroakleHabitNameButton[data-detail-index]");
      if (detailButton) {
        CroakleSubOpenHabitDetailFromButton(detailButton);
        return;
      }

      if (event.target.closest("#CroakleOpenAddHabit")) {
        window.requestAnimationFrame(CroakleSubResetAddEditor);
      }
    });

    const addForm = document.querySelector("#CroakleAddHabitForm");
    if (addForm) {
      addForm.addEventListener("submit", () => {
        CroakleSubApplyAddEditorToNewHabit(CroakleSubReadEditorValues("CroakleSubAdd", false));
      }, true);

      addForm.addEventListener("click", (event) => CroakleSubHandleEditorClick(event, "CroakleSubAdd"));
    }

    const detailForm = document.querySelector("#CroakleHabitDetailForm");
    if (!detailForm) return;

    detailForm.addEventListener("submit", () => {
      const habitIndex = Number(detailForm.elements.habitIndex?.value);
      const habit = CroakleSubGetHabitByIndex(habitIndex);
      if (!habit) return;

      const previousWins = habit.subHabitWins || {};
      const previousNotes = habit.subHabitNotes || {};
      habit.subHabits = CroakleSubReadEditorValues("CroakleSubHabit", false);
      habit.subHabitWins = previousWins;
      habit.subHabitNotes = previousNotes;
    }, true);

    detailForm.addEventListener("click", (event) => CroakleSubHandleEditorClick(event, "CroakleSubHabit"));
  }

  function CroakleSubHandleEditorClick(event, idPrefix) {
    const removeButton = event.target.closest(`[data-sub-editor="${idPrefix}"][data-sub-remove]`);
    const addButton = event.target.closest(`#${idPrefix}AddButton`);

    if (removeButton) {
      event.preventDefault();
      const draft = CroakleSubReadEditorValues(idPrefix, true);
      draft.splice(Number(removeButton.dataset.subRemove), 1);
      CroakleSubRenderEditor(idPrefix, draft);
      return;
    }

    if (addButton) {
      event.preventDefault();
      const draft = CroakleSubReadEditorValues(idPrefix, true);
      if (draft.length < CroakleSubHabitSoftLimit) draft.push("");
      CroakleSubRenderEditor(idPrefix, draft);
    }
  }

  function CroakleSubGetNoteContextFromSection() {
    const section = document.querySelector("#CroakleSubNoteSection");
    if (!section) return null;

    const habitIndex = Number(section.dataset.subHabitIndex);
    const dateIso = section.dataset.subDate;
    const habit = CroakleSubGetHabitByIndex(habitIndex);
    if (!habit || !dateIso) return null;

    return { section, habit, habitIndex, dateIso };
  }

  function CroakleSubRenderInlineNoteEditor(subIndex) {
    const context = CroakleSubGetNoteContextFromSection();
    if (!context) return;

    const { section, habit, dateIso } = context;
    const notes = CroakleSubGetNotes(habit, dateIso);
    const title = habit.subHabits[subIndex] || "Small win";
    const list = section.querySelector(".CroakleSubNoteList");
    if (!list) return;

    section.querySelector("#CroakleSubNoteInlineEditor")?.remove();
    list.insertAdjacentHTML("afterend", `
      <section class="CroakleSubInlineNoteEditor" id="CroakleSubNoteInlineEditor" data-sub-note-edit-index="${subIndex}">
        <div class="CroakleSubInlineNoteHeader">
          <strong>Note</strong>
          <span>${CroakleSubEscape(title)}</span>
        </div>
        <textarea class="CroakleSubInlineNoteTextarea" rows="4" data-sub-note-textarea placeholder="Write a note for this small win...">${CroakleSubEscape(notes[subIndex])}</textarea>
        <button class="CroakleSubInlineNoteSave" type="button" data-sub-note-save>Save note</button>
      </section>
    `);

    section.querySelector("[data-sub-note-textarea]")?.focus();
  }

  function CroakleSubSaveOpenInlineNote() {
    const context = CroakleSubGetNoteContextFromSection();
    const editor = document.querySelector("#CroakleSubNoteInlineEditor");
    if (!context || !editor) return;

    const subIndex = Number(editor.dataset.subNoteEditIndex);
    const textarea = editor.querySelector("[data-sub-note-textarea]");
    CroakleSubSetNote(context.habit, context.dateIso, subIndex, textarea?.value || "");
    CroakleSubSaveState();

    const notes = CroakleSubGetNotes(context.habit, context.dateIso);
    const rowButton = context.section.querySelector(`[data-sub-note-open="${subIndex}"]`);
    if (rowButton) rowButton.dataset.hasNote = String(Boolean(notes[subIndex]));
  }

  function CroakleSubRenderNoteSection(type, itemId, dateIso) {
    const form = document.querySelector("#CroakleNotesLiteForm");
    if (!form) return;

    form.querySelector("#CroakleSubNoteSection")?.remove();
    if (type !== "habit") return;

    const match = CroakleSubGetHabitById(itemId);
    if (!match || !match.habit.subHabits.length) return;

    const wins = CroakleSubGetWins(match.habit, dateIso);
    const notes = CroakleSubGetNotes(match.habit, dateIso);
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
              <button type="button" data-sub-note-toggle="${index}" aria-label="Toggle small win">${wins[index] ? "✓" : ""}</button>
              <span>${CroakleSubEscape(text)}</span>
              <button class="CroakleSubRowNoteButton" type="button" data-sub-note-open="${index}" data-has-note="${Boolean(notes[index])}">Note</button>
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

    CroakleSubSaveOpenInlineNote();
    const wins = [...section.querySelectorAll("[data-sub-note-row]")].map((row) => row.dataset.done === "true");
    CroakleSubSetWins(habit, dateIso, wins);
    CroakleSubSaveState();
    if (typeof CroakleRenderTrackList === "function") CroakleRenderTrackList();
  }

  function CroakleSubRenderSmallWinsBadges() {
    const dateIso = CroakleSubGetDateIso();

    document.querySelectorAll(".CroakleHabitTop").forEach((top) => {
      top.querySelector(".CroakleSubWinsBadge")?.remove();

      const nameButton = top.querySelector(".CroakleHabitNameButton[data-detail-index]");
      const goalBadge = top.querySelector(".CroakleGoal");
      const habitIndex = Number(nameButton?.dataset.detailIndex);
      const habit = CroakleSubGetHabitByIndex(habitIndex);
      const summary = habit ? CroakleSubGetSummary(habit, dateIso) : null;

      if (!goalBadge || !summary) return;

      goalBadge.insertAdjacentHTML("beforebegin", `<span class="CroakleSubWinsBadge">${summary.done}/${summary.total} wins</span>`);
    });
  }

  function CroakleSubPatchTrackRender() {
    if (typeof window.CroakleRenderTrackList !== "function" || window.CroakleRenderTrackList.CroakleSubWinsWrapped) return;

    const originalRenderTrackList = window.CroakleRenderTrackList;
    window.CroakleRenderTrackList = function CroakleRenderTrackListWithSubWins(...args) {
      const result = originalRenderTrackList.apply(this, args);
      CroakleSubRenderSmallWinsBadges();
      return result;
    };
    window.CroakleRenderTrackList.CroakleSubWinsWrapped = true;
  }

  function CroakleSubBindNoteEvents() {
    if (window.CroakleSubHabitNoteEventsBound) return;
    window.CroakleSubHabitNoteEventsBound = true;

    document.addEventListener("click", (event) => {
      const noteButton = event.target.closest("[data-croakle-note-type]");
      if (noteButton) {
        CroakleSubOpenNoteSection(noteButton);
        return;
      }

      const rowNoteButton = event.target.closest("[data-sub-note-open]");
      if (rowNoteButton) {
        event.preventDefault();
        CroakleSubSaveOpenInlineNote();
        CroakleSubRenderInlineNoteEditor(Number(rowNoteButton.dataset.subNoteOpen));
        return;
      }

      if (event.target.closest("[data-sub-note-save]")) {
        event.preventDefault();
        CroakleSubSaveOpenInlineNote();
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
    CroakleSubAddEditorToForm("#CroakleAddHabitForm", "CroakleSubAdd");
    CroakleSubAddEditorToForm("#CroakleHabitDetailForm", "CroakleSubHabit");
    CroakleSubRenderEditor("CroakleSubAdd", []);
    CroakleSubPatchForms();
    CroakleSubPatchTrackRender();
    CroakleSubBindNoteEvents();
    CroakleSubRenderSmallWinsBadges();
  }

  window.requestAnimationFrame(CroakleSubInit);
})();
