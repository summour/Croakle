(() => {
  const CroakleSubHabitSoftLimit = 5;

  function CroakleSubNormalizeList(habit) {
    if (!Array.isArray(habit.subHabits)) habit.subHabits = [];
    if (!habit.subHabitWins || typeof habit.subHabitWins !== "object" || Array.isArray(habit.subHabitWins)) habit.subHabitWins = {};
    habit.subHabits = habit.subHabits.map((item) => String(item || "").trim()).filter(Boolean).slice(0, CroakleSubHabitSoftLimit);
    return habit;
  }

  function CroakleSubGetHabit(habitIndex) {
    const habit = CroakleState?.habitTemplates?.[habitIndex];
    return habit ? CroakleSubNormalizeList(habit) : null;
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
      .CroakleSubWinsButton {
        min-height: 28px;
        border: 2px solid #111111;
        border-radius: 999px;
        background: #ffffff;
        color: #111111;
        padding: 0 10px;
        font-size: 12px;
        font-weight: 950;
        line-height: 1;
        touch-action: manipulation;
        white-space: nowrap;
      }

      .CroakleSubWinsButton[data-has-wins="true"] {
        background: #111111;
        color: #ffffff;
      }

      .CroakleHabitTop .CroakleSubWinsButton {
        margin-left: 6px;
      }

      .CroakleSubEditor {
        display: grid;
        gap: 10px;
        border: 2px solid #111111;
        border-radius: 20px;
        padding: 12px;
        background: #fafafa;
      }

      .CroakleSubEditorHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .CroakleSubEditorHeader strong {
        font-size: 15px;
        font-weight: 950;
        color: #111111;
      }

      .CroakleSubEditorHeader span {
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

      .CroakleSubDialogBody {
        display: grid;
        gap: 10px;
      }

      .CroakleSubCheckRow {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr);
        align-items: center;
        gap: 10px;
        border: 2px solid #111111;
        border-radius: 18px;
        background: #ffffff;
        padding: 8px 10px;
      }

      .CroakleSubCheckRow button {
        width: 38px;
        height: 38px;
        border: 2px solid #111111;
        border-radius: 999px;
        background: #ffffff;
        color: #111111;
        font-size: 20px;
        font-weight: 950;
        touch-action: manipulation;
      }

      .CroakleSubCheckRow[data-done="true"] button {
        background: #111111;
        color: #ffffff;
      }

      .CroakleSubCheckRow span {
        color: #111111;
        font-size: 16px;
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

  function CroakleSubRenderEditor(habitIndex) {
    const list = document.querySelector("#CroakleSubHabitEditorList");
    const addButton = document.querySelector("#CroakleSubHabitAddButton");
    const habit = CroakleSubGetHabit(habitIndex);
    if (!list || !addButton || !habit) return;

    list.innerHTML = habit.subHabits.map((text, index) => `
      <div class="CroakleSubEditorRow">
        <span class="CroakleSubEditorHandle">≡</span>
        <input class="CroakleSubEditorInput" type="text" value="${CroakleSubEscape(text)}" data-sub-index="${index}" placeholder="Small win" />
        <button class="CroakleSubEditorRemove" type="button" data-sub-remove="${index}" aria-label="Remove sub-habit">×</button>
      </div>
    `).join("");

    addButton.disabled = habit.subHabits.length >= CroakleSubHabitSoftLimit;
  }

  function CroakleSubReadEditorValues() {
    return [...document.querySelectorAll(".CroakleSubEditorInput")]
      .map((input) => String(input.value || "").trim())
      .filter(Boolean)
      .slice(0, CroakleSubHabitSoftLimit);
  }

  function CroakleSubOpenHabitDetail(event) {
    window.requestAnimationFrame(() => {
      const habitIndex = Number(event.currentTarget?.dataset.detailIndex ?? document.querySelector("#CroakleHabitDetailIndex")?.value);
      CroakleSubAddEditorToHabitDetail();
      CroakleSubRenderEditor(habitIndex);
    });
  }

  function CroakleSubPatchHabitDetail() {
    if (window.CroakleSubHabitDetailPatched) return;
    window.CroakleSubHabitDetailPatched = true;

    if (typeof window.CroakleOpenHabitDetailDialog === "function") {
      const originalOpen = window.CroakleOpenHabitDetailDialog;
      window.CroakleOpenHabitDetailDialog = function CroakleOpenHabitDetailDialogWithSubHabits(event) {
        const result = originalOpen.apply(this, arguments);
        CroakleSubOpenHabitDetail(event);
        return result;
      };
    }

    const form = document.querySelector("#CroakleHabitDetailForm");
    if (!form) return;

    form.addEventListener("submit", () => {
      const habitIndex = Number(form.elements.habitIndex?.value);
      const habit = CroakleSubGetHabit(habitIndex);
      if (!habit) return;

      const previousWins = habit.subHabitWins || {};
      habit.subHabits = CroakleSubReadEditorValues();
      habit.subHabitWins = previousWins;
    }, true);

    form.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-sub-remove]");
      const addButton = event.target.closest("#CroakleSubHabitAddButton");
      const habitIndex = Number(form.elements.habitIndex?.value);
      const habit = CroakleSubGetHabit(habitIndex);
      if (!habit) return;

      if (removeButton) {
        event.preventDefault();
        habit.subHabits = CroakleSubReadEditorValues();
        habit.subHabits.splice(Number(removeButton.dataset.subRemove), 1);
        CroakleSubRenderEditor(habitIndex);
        return;
      }

      if (addButton) {
        event.preventDefault();
        habit.subHabits = CroakleSubReadEditorValues();
        if (habit.subHabits.length < CroakleSubHabitSoftLimit) habit.subHabits.push("");
        CroakleSubRenderEditor(habitIndex);
      }
    });
  }

  function CroakleSubGetSummary(habit, dateIso) {
    CroakleSubNormalizeList(habit);
    if (!habit.subHabits.length) return null;

    const wins = CroakleSubGetWins(habit, dateIso);
    const doneCount = wins.filter(Boolean).length;
    return { doneCount, total: habit.subHabits.length };
  }

  function CroakleSubAddSummaryButtons() {
    const dateIso = CroakleSubGetDateIso();

    document.querySelectorAll(".CroakleHabitTop").forEach((top) => {
      if (top.querySelector(".CroakleSubWinsButton")) return;

      const nameButton = top.querySelector(".CroakleHabitNameButton[data-detail-index]");
      const goal = top.querySelector(".CroakleGoal");
      const habitIndex = Number(nameButton?.dataset.detailIndex);
      const habit = CroakleSubGetHabit(habitIndex);
      const summary = habit ? CroakleSubGetSummary(habit, dateIso) : null;

      if (!goal || !summary) return;

      goal.insertAdjacentHTML("beforebegin", `
        <button class="CroakleSubWinsButton" type="button" data-sub-habit-index="${habitIndex}" data-sub-date="${dateIso}" data-has-wins="${summary.doneCount > 0}">
          ${summary.doneCount}/${summary.total} wins
        </button>
      `);
    });
  }

  function CroakleSubEnsureDialog() {
    if (document.querySelector("#CroakleSubHabitDialog")) return;

    document.body.insertAdjacentHTML("beforeend", `
      <dialog class="CroakleAddHabitDialog" id="CroakleSubHabitDialog" aria-labelledby="CroakleSubHabitTitle">
        <div class="CroakleAddHabitForm">
          <header class="CroakleAddHabitHeader">
            <h2 id="CroakleSubHabitTitle">Small Wins</h2>
            <button type="button" data-sub-close aria-label="Close">×</button>
          </header>
          <input type="hidden" id="CroakleSubHabitIndex" />
          <input type="hidden" id="CroakleSubHabitDate" />
          <div class="CroakleSubDialogBody" id="CroakleSubHabitChecklist"></div>
          <button class="CroakleConfirmHabitButton" type="button" data-sub-save>Save</button>
        </div>
      </dialog>
    `);
  }

  function CroakleSubOpenChecklist(habitIndex, dateIso) {
    const habit = CroakleSubGetHabit(habitIndex);
    if (!habit || !habit.subHabits.length) return;

    CroakleSubEnsureDialog();
    const dialog = document.querySelector("#CroakleSubHabitDialog");
    const list = document.querySelector("#CroakleSubHabitChecklist");
    const wins = CroakleSubGetWins(habit, dateIso);

    document.querySelector("#CroakleSubHabitIndex").value = String(habitIndex);
    document.querySelector("#CroakleSubHabitDate").value = dateIso;
    list.innerHTML = habit.subHabits.map((text, index) => `
      <div class="CroakleSubCheckRow" data-done="${wins[index]}" data-sub-check-row="${index}">
        <button type="button" data-sub-toggle="${index}">${wins[index] ? "✓" : ""}</button>
        <span>${CroakleSubEscape(text)}</span>
      </div>
    `).join("");

    dialog.showModal();
  }

  function CroakleSubSaveChecklist() {
    const habitIndex = Number(document.querySelector("#CroakleSubHabitIndex")?.value);
    const dateIso = document.querySelector("#CroakleSubHabitDate")?.value;
    const habit = CroakleSubGetHabit(habitIndex);
    if (!habit || !dateIso) return;

    const wins = [...document.querySelectorAll("[data-sub-check-row]")].map((row) => row.dataset.done === "true");
    CroakleSubSetWins(habit, dateIso, wins);
    CroakleSubSaveState();
    document.querySelector("#CroakleSubHabitDialog")?.close();
    if (typeof CroakleRenderTrackList === "function") CroakleRenderTrackList();
  }

  function CroakleSubBindEvents() {
    if (window.CroakleSubHabitEventsBound) return;
    window.CroakleSubHabitEventsBound = true;

    document.addEventListener("click", (event) => {
      const summaryButton = event.target.closest("[data-sub-habit-index]");
      if (summaryButton) {
        event.preventDefault();
        event.stopPropagation();
        CroakleSubOpenChecklist(Number(summaryButton.dataset.subHabitIndex), summaryButton.dataset.subDate);
        return;
      }

      const toggleButton = event.target.closest("[data-sub-toggle]");
      if (toggleButton) {
        event.preventDefault();
        const row = toggleButton.closest("[data-sub-check-row]");
        const nextDone = row.dataset.done !== "true";
        row.dataset.done = String(nextDone);
        toggleButton.textContent = nextDone ? "✓" : "";
        return;
      }

      if (event.target.closest("[data-sub-save]")) {
        event.preventDefault();
        CroakleSubSaveChecklist();
        return;
      }

      if (event.target.closest("[data-sub-close]")) {
        event.preventDefault();
        document.querySelector("#CroakleSubHabitDialog")?.close();
      }
    });
  }

  function CroakleSubPatchRenderTrackList() {
    if (typeof window.CroakleRenderTrackList !== "function" || window.CroakleRenderTrackList.CroakleSubWrapped) return;

    const originalRender = window.CroakleRenderTrackList;
    window.CroakleRenderTrackList = function CroakleRenderTrackListWithSubHabits() {
      const result = originalRender.apply(this, arguments);
      CroakleSubAddSummaryButtons();
      return result;
    };
    window.CroakleRenderTrackList.CroakleSubWrapped = true;
  }

  function CroakleSubInit() {
    CroakleSubInjectStyles();
    CroakleSubEnsureDialog();
    CroakleSubAddEditorToHabitDetail();
    CroakleSubPatchHabitDetail();
    CroakleSubPatchRenderTrackList();
    CroakleSubBindEvents();
    CroakleSubAddSummaryButtons();
  }

  window.requestAnimationFrame(CroakleSubInit);
})();
