(() => {
  const CroakleNotePageName = "notes";

  function CroakleEscapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function CroakleGetNoteDate() {
    if (typeof CroakleState !== "undefined" && CroakleState.trackDate) {
      return CroakleState.trackDate;
    }

    if (typeof CroakleFormatDate === "function" && typeof CroakleGetToday === "function") {
      return CroakleFormatDate(CroakleGetToday());
    }

    return new Date().toISOString().slice(0, 10);
  }

  function CroakleGetNoteDateLabel(dateIso) {
    const date = typeof CroakleParseDate === "function" ? CroakleParseDate(dateIso) : new Date(dateIso);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function CroakleGetNoteMonthKey() {
    if (typeof CroakleState === "undefined") {
      return "";
    }

    return `${CroakleState.trackYear}-${String(CroakleState.trackMonth + 1).padStart(2, "0")}`;
  }

  function CroakleGetNoteMonthData() {
    if (typeof CroakleState === "undefined" || typeof CroakleGetMonthData !== "function") {
      return null;
    }

    return CroakleGetMonthData(CroakleState.trackYear, CroakleState.trackMonth);
  }

  function CroakleEnsureHabitNotes(habit) {
    if (!habit.notes || typeof habit.notes !== "object" || Array.isArray(habit.notes)) {
      habit.notes = {};
    }

    return habit.notes;
  }

  function CroakleInjectNoteStyles() {
    if (document.querySelector("#CroakleHabitNoteStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleHabitNoteStyles";
    style.textContent = `
      .CroakleHabitNoteButton,
      .CroakleOpenNotesBoardButton {
        min-height: 34px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 999px;
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleInk, #111111);
        padding: 0 12px;
        font-size: 13px;
        font-weight: 900;
        white-space: nowrap;
      }

      .CroakleHabitNoteButton[data-has-note="true"] {
        background: var(--CroakleLine, #111111);
        color: var(--CroakleSurface, #ffffff);
      }

      .CroakleCheckButton[data-has-note="true"]::after {
        content: "";
        position: absolute;
        right: 3px;
        top: 3px;
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: currentColor;
      }

      .CroakleCheckButton {
        position: relative;
      }

      .CroakleHabitNoteModal {
        position: fixed;
        inset: 0;
        z-index: 140;
        display: grid;
        place-items: end center;
      }

      .CroakleHabitNoteModal[hidden] {
        display: none;
      }

      .CroakleHabitNoteBackdrop {
        position: absolute;
        inset: 0;
        border: 0;
        background: rgba(17, 17, 17, 0.2);
      }

      .CroakleHabitNotePanel {
        position: relative;
        z-index: 1;
        width: min(100%, 520px);
        max-height: min(88dvh, 720px);
        border: 2px solid var(--CroakleLine, #111111);
        border-bottom: 0;
        border-radius: 30px 30px 0 0;
        background: var(--CroakleSurface, #ffffff);
        padding: 18px 18px max(22px, env(safe-area-inset-bottom));
        display: grid;
        gap: 14px;
        overflow-y: auto;
        box-shadow: 0 -18px 44px rgba(0, 0, 0, 0.16);
      }

      .CroakleHabitNoteHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .CroakleHabitNoteHeader p {
        margin: 0 0 4px;
        color: #666666;
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 0.04em;
      }

      .CroakleHabitNoteHeader h3 {
        margin: 0;
        color: #111111;
        font-size: clamp(30px, 8vw, 42px);
        font-weight: 950;
        line-height: 0.96;
        letter-spacing: -0.065em;
      }

      .CroakleHabitNoteClose {
        width: 46px;
        height: 46px;
        border: 2px solid #111111;
        border-radius: 16px;
        background: #ffffff;
        color: #111111;
        font-size: 22px;
        font-weight: 950;
      }

      .CroakleHabitNoteDoneToggle {
        min-height: 52px;
        border: 2px solid #111111;
        border-radius: 18px;
        background: #f5f5f5;
        color: #111111;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        font-size: 17px;
        font-weight: 900;
      }

      .CroakleHabitNoteDoneToggle[data-done="true"] {
        background: #111111;
        color: #ffffff;
      }

      .CroakleHabitNoteField {
        display: grid;
        gap: 10px;
      }

      .CroakleHabitNoteField span {
        color: #111111;
        font-size: 15px;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .CroakleHabitNoteTextarea {
        width: 100%;
        min-height: 150px;
        border: 2px solid #111111;
        border-radius: 20px;
        background: #ffffff;
        color: #111111;
        padding: 14px;
        font: inherit;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.35;
        resize: vertical;
      }

      .CroakleHabitNoteFooter {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .CroakleHabitNoteGhost,
      .CroakleHabitNoteSave {
        min-height: 52px;
        border: 2px solid #111111;
        border-radius: 18px;
        font-size: 17px;
        font-weight: 900;
      }

      .CroakleHabitNoteGhost {
        background: #ffffff;
        color: #111111;
      }

      .CroakleHabitNoteSave {
        background: #111111;
        color: #ffffff;
      }

      .CroakleNotesBoardPage.CroaklePageActive {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .CroakleNotesBoardPage.CroaklePageActive::-webkit-scrollbar {
        display: none;
      }

      .CroakleNotesBoardHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .CroakleNotesBoardHeader h2 {
        margin: 0;
        font-size: clamp(42px, 13vw, 64px);
        font-weight: 950;
        line-height: 0.9;
        letter-spacing: -0.08em;
      }

      .CroakleNotesBoardBack {
        width: 54px;
        height: 54px;
        border: 0;
        border-radius: 999px;
        background: #f2f2f2;
        color: #111111;
        font-size: 28px;
        font-weight: 950;
      }

      .CroakleNotesBoardList {
        display: grid;
        gap: 12px;
        padding-bottom: 16px;
      }

      .CroakleNotesBoardGroup {
        border: 2px solid #111111;
        border-radius: 24px;
        background: #ffffff;
        padding: 16px;
        display: grid;
        gap: 12px;
      }

      .CroakleNotesBoardGroup h3 {
        margin: 0;
        font-size: 24px;
        font-weight: 950;
        letter-spacing: -0.05em;
      }

      .CroakleNotesBoardItem {
        border-radius: 18px;
        background: #f5f5f5;
        padding: 12px;
        display: grid;
        gap: 6px;
      }

      .CroakleNotesBoardItem strong {
        font-size: 15px;
        font-weight: 950;
      }

      .CroakleNotesBoardItem p {
        margin: 0;
        font-size: 16px;
        font-weight: 650;
        line-height: 1.35;
        white-space: pre-wrap;
      }

      .CroakleNotesEmpty {
        border-radius: 24px;
        background: #f5f5f5;
        padding: 18px;
        font-size: 18px;
        font-weight: 800;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleEnsureNoteModal() {
    if (document.querySelector("#CroakleHabitNoteModal")) {
      return;
    }

    document.body.insertAdjacentHTML("beforeend", `
      <div class="CroakleHabitNoteModal" id="CroakleHabitNoteModal" hidden>
        <button class="CroakleHabitNoteBackdrop" type="button" data-note-close aria-label="Close note"></button>
        <section class="CroakleHabitNotePanel" data-note-panel data-habit-index="" data-date-iso="" aria-label="Habit note">
          <header class="CroakleHabitNoteHeader">
            <div>
              <p data-note-date>DATE</p>
              <h3 data-note-title>Habit note</h3>
            </div>
            <button class="CroakleHabitNoteClose" type="button" data-note-close aria-label="Close">×</button>
          </header>

          <button class="CroakleHabitNoteDoneToggle" type="button" data-note-done data-done="false">
            <span>Done on this day</span>
            <strong>○</strong>
          </button>

          <label class="CroakleHabitNoteField">
            <span>Daily note</span>
            <textarea class="CroakleHabitNoteTextarea" data-note-textarea placeholder="Write what happened for this habit on this day..."></textarea>
          </label>

          <div class="CroakleHabitNoteFooter">
            <button class="CroakleHabitNoteGhost" type="button" data-note-close>Cancel</button>
            <button class="CroakleHabitNoteSave" type="button" data-note-save>Save note</button>
          </div>
        </section>
      </div>
    `);
  }

  function CroakleEnsureNotesBoardPage() {
    if (document.querySelector('[data-page="notes"]')) {
      return;
    }

    const shell = document.querySelector(".CroakleHabitMoodShell");
    const bottomNav = document.querySelector(".CroakleBottomNav");
    const pageHtml = `
      <section class="CroaklePage CroakleNotesBoardPage" data-page="notes">
        <article class="CroakleCard" aria-label="Monthly habit notes board">
          <header class="CroakleNotesBoardHeader">
            <button class="CroakleNotesBoardBack" type="button" data-page-target="track" aria-label="Back to habits">‹</button>
            <h2>Notes Board</h2>
          </header>
          <div class="CroakleNotesBoardList" id="CroakleNotesBoardList"></div>
        </article>
      </section>
    `;

    if (bottomNav) {
      bottomNav.insertAdjacentHTML("beforebegin", pageHtml);
      return;
    }

    shell?.insertAdjacentHTML("beforeend", pageHtml);
  }

  function CroakleGetHabitNote(habit, dateIso) {
    return CroakleEnsureHabitNotes(habit)[dateIso] || "";
  }

  function CroakleOpenHabitNote(habitIndex, dateIso) {
    const date = typeof CroakleParseDate === "function" ? CroakleParseDate(dateIso) : new Date(dateIso);
    const monthData = typeof CroakleGetMonthDataFromDate === "function" ? CroakleGetMonthDataFromDate(date) : null;
    const habit = monthData?.habits?.[habitIndex];
    const dayIndex = date.getDate() - 1;
    const modal = document.querySelector("#CroakleHabitNoteModal");
    const panel = modal?.querySelector("[data-note-panel]");

    if (!habit || !modal || !panel) {
      return;
    }

    panel.dataset.habitIndex = String(habitIndex);
    panel.dataset.dateIso = dateIso;
    modal.querySelector("[data-note-date]").textContent = CroakleGetNoteDateLabel(dateIso);
    modal.querySelector("[data-note-title]").textContent = habit.name || "Habit note";
    modal.querySelector("[data-note-textarea]").value = CroakleGetHabitNote(habit, dateIso);
    CroakleSetNoteDoneState(Boolean(habit.days?.[dayIndex]));
    modal.hidden = false;
    window.requestAnimationFrame(() => modal.querySelector("[data-note-textarea]")?.focus());
  }

  function CroakleSetNoteDoneState(done) {
    const doneButton = document.querySelector("[data-note-done]");
    if (!doneButton) {
      return;
    }

    doneButton.dataset.done = String(done);
    doneButton.querySelector("strong").textContent = done ? "✓" : "○";
  }

  function CroakleCloseHabitNote() {
    const modal = document.querySelector("#CroakleHabitNoteModal");
    if (modal) {
      modal.hidden = true;
    }
  }

  function CroakleSaveHabitNote() {
    const modal = document.querySelector("#CroakleHabitNoteModal");
    const panel = modal?.querySelector("[data-note-panel]");
    const habitIndex = Number(panel?.dataset.habitIndex);
    const dateIso = panel?.dataset.dateIso || "";
    const date = typeof CroakleParseDate === "function" ? CroakleParseDate(dateIso) : new Date(dateIso);
    const monthData = typeof CroakleGetMonthDataFromDate === "function" ? CroakleGetMonthDataFromDate(date) : null;
    const habit = monthData?.habits?.[habitIndex];

    if (!habit) {
      return;
    }

    const note = String(modal.querySelector("[data-note-textarea]")?.value || "").trim();
    const notes = CroakleEnsureHabitNotes(habit);

    if (note) {
      notes[dateIso] = note;
    } else {
      delete notes[dateIso];
    }

    habit.days[date.getDate() - 1] = modal.querySelector("[data-note-done]")?.dataset.done === "true";

    if (typeof CroakleSaveState === "function") {
      CroakleSaveState();
    }

    if (typeof CroakleRenderAll === "function") {
      CroakleRenderAll();
    }

    CroakleCloseHabitNote();
    CroakleRenderNotesBoard();
    window.requestAnimationFrame(CroakleDecorateTrackNotes);
  }

  function CroakleDecorateTrackNotes() {
    const weekDate = typeof CroakleParseDate === "function" && typeof CroakleState !== "undefined" ? CroakleParseDate(CroakleState.trackDate) : new Date();
    const weekDates = typeof CroakleGetWeekDates === "function" ? CroakleGetWeekDates(weekDate) : [];

    document.querySelectorAll(".CroakleHabitRow").forEach((row, habitIndex) => {
      const top = row.querySelector(".CroakleHabitTop");
      if (!top || top.querySelector(".CroakleHabitNoteButton")) {
        return;
      }

      const noteDate = CroakleGetNoteDate();
      const monthData = typeof CroakleGetMonthDataFromDate === "function" ? CroakleGetMonthDataFromDate(typeof CroakleParseDate === "function" ? CroakleParseDate(noteDate) : new Date(noteDate)) : null;
      const habit = monthData?.habits?.[habitIndex];
      const hasNote = Boolean(habit && CroakleGetHabitNote(habit, noteDate));

      top.insertAdjacentHTML("beforeend", `<button class="CroakleHabitNoteButton" type="button" data-note-open="${habitIndex}" data-note-date="${noteDate}" data-has-note="${hasNote}">${hasNote ? "Note ✓" : "Note"}</button>`);
    });

    document.querySelectorAll(".CroakleCheckButton").forEach((button) => {
      const habitIndex = Number(button.dataset.habitIndex);
      const dateIso = button.dataset.dateIso || "";
      const date = typeof CroakleParseDate === "function" ? CroakleParseDate(dateIso) : new Date(dateIso);
      const monthData = typeof CroakleGetMonthDataFromDate === "function" ? CroakleGetMonthDataFromDate(date) : null;
      const habit = monthData?.habits?.[habitIndex];
      button.dataset.hasNote = String(Boolean(habit && CroakleGetHabitNote(habit, dateIso)));
    });

    const trackActions = document.querySelector('[data-page="track"] .CroakleTrackActions');
    if (trackActions && !trackActions.querySelector(".CroakleOpenNotesBoardButton")) {
      trackActions.insertAdjacentHTML("beforeend", `<button class="CroakleOpenNotesBoardButton" type="button" data-open-notes-board>Notes Board</button>`);
    }
  }

  function CroakleRenderNotesBoard() {
    const list = document.querySelector("#CroakleNotesBoardList");
    const monthData = CroakleGetNoteMonthData();

    if (!list || !monthData) {
      return;
    }

    const groups = monthData.habits.map((habit) => {
      const notes = CroakleEnsureHabitNotes(habit);
      const rows = Object.entries(notes)
        .filter(([, note]) => String(note || "").trim())
        .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate));

      return {
        name: habit.name || "Habit",
        rows,
      };
    }).filter((group) => group.rows.length);

    if (!groups.length) {
      list.innerHTML = `<div class="CroakleNotesEmpty">No notes yet for this month.</div>`;
      return;
    }

    list.innerHTML = groups.map((group) => `
      <section class="CroakleNotesBoardGroup">
        <h3>${CroakleEscapeText(group.name)}</h3>
        ${group.rows.map(([dateIso, note]) => `
          <article class="CroakleNotesBoardItem">
            <strong>${CroakleEscapeText(CroakleGetNoteDateLabel(dateIso))}</strong>
            <p>${CroakleEscapeText(note)}</p>
          </article>
        `).join("")}
      </section>
    `).join("");
  }

  function CroakleOpenNotesBoard() {
    CroakleRenderNotesBoard();

    if (typeof CroakleSetPage === "function") {
      CroakleSetPage(CroakleNotePageName);
      return;
    }

    document.querySelectorAll("[data-page]").forEach((page) => {
      page.classList.toggle("CroaklePageActive", page.dataset.page === CroakleNotePageName);
    });
  }

  function CroaklePatchRenderAll() {
    if (typeof window.CroakleRenderAll !== "function" || window.CroakleHabitNotesRenderPatched) {
      return;
    }

    const originalRenderAll = window.CroakleRenderAll;
    window.CroakleRenderAll = function CroakleHabitNotesRenderAll(...args) {
      const result = originalRenderAll.apply(this, args);
      window.requestAnimationFrame(() => {
        CroakleDecorateTrackNotes();
        CroakleRenderNotesBoard();
      });
      return result;
    };

    window.CroakleHabitNotesRenderPatched = true;
  }

  function CroakleBindHabitNotes() {
    if (window.CroakleHabitNotesBound) {
      return;
    }

    window.CroakleHabitNotesBound = true;
    document.addEventListener("click", (event) => {
      const noteButton = event.target.closest("[data-note-open]");
      if (noteButton) {
        event.preventDefault();
        CroakleOpenHabitNote(Number(noteButton.dataset.noteOpen), noteButton.dataset.noteDate || CroakleGetNoteDate());
        return;
      }

      const checkButton = event.target.closest(".CroakleCheckButton");
      if (checkButton && event.shiftKey) {
        event.preventDefault();
        CroakleOpenHabitNote(Number(checkButton.dataset.habitIndex), checkButton.dataset.dateIso);
        return;
      }

      if (event.target.closest("[data-note-close]")) {
        event.preventDefault();
        CroakleCloseHabitNote();
        return;
      }

      const doneButton = event.target.closest("[data-note-done]");
      if (doneButton) {
        event.preventDefault();
        CroakleSetNoteDoneState(doneButton.dataset.done !== "true");
        return;
      }

      if (event.target.closest("[data-note-save]")) {
        event.preventDefault();
        CroakleSaveHabitNote();
        return;
      }

      if (event.target.closest("[data-open-notes-board]")) {
        event.preventDefault();
        CroakleOpenNotesBoard();
      }
    });
  }

  function CroakleInitHabitNotes() {
    CroakleInjectNoteStyles();
    CroakleEnsureNoteModal();
    CroakleEnsureNotesBoardPage();
    CroakleBindHabitNotes();
    CroaklePatchRenderAll();
    CroakleDecorateTrackNotes();
    CroakleRenderNotesBoard();
  }

  window.requestAnimationFrame(CroakleInitHabitNotes);
})();
