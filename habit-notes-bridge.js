(() => {
  const CroakleNotesStoreKey = "CroakleDailyNotesLiteV1";
  const CroakleNotesFilterKey = "CroakleNotesLiteFilterV1";
  const CroakleNoteTypes = ["all", "habit", "project", "mood"];

  function CroakleNotesReadStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(CroakleNotesStoreKey) || "{}");
      return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    } catch {
      return {};
    }
  }

  function CroakleNotesSaveStore(store) {
    localStorage.setItem(CroakleNotesStoreKey, JSON.stringify(store));
  }

  function CroakleNotesEscape(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function CroakleNotesGetFilter() {
    const saved = localStorage.getItem(CroakleNotesFilterKey);
    return CroakleNoteTypes.includes(saved) ? saved : "all";
  }

  function CroakleNotesSetFilter(filter) {
    localStorage.setItem(CroakleNotesFilterKey, CroakleNoteTypes.includes(filter) ? filter : "all");
  }

  function CroakleNotesGetDateLabel(dateIso) {
    const date = typeof CroakleParseDate === "function" ? CroakleParseDate(dateIso) : new Date(dateIso);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function CroakleNotesMakeKey(type, itemId, dateIso) {
    return `${type}::${itemId || "day"}::${dateIso}`;
  }

  function CroakleNotesRead(type, itemId, dateIso) {
    return CroakleNotesReadStore()[CroakleNotesMakeKey(type, itemId, dateIso)]?.note || "";
  }

  function CroakleNotesWrite(type, itemId, itemName, dateIso, note) {
    const store = CroakleNotesReadStore();
    const key = CroakleNotesMakeKey(type, itemId, dateIso);
    const cleanNote = String(note || "").trim();

    if (cleanNote) {
      store[key] = { type, itemId, itemName, dateIso, note: cleanNote, updatedAt: Date.now() };
    } else {
      delete store[key];
    }

    CroakleNotesSaveStore(store);
  }

  function CroakleNotesGetSelectedDate() {
    return CroakleState?.trackDate || (typeof CroakleFormatDate === "function" ? CroakleFormatDate(new Date()) : new Date().toISOString().slice(0, 10));
  }

  function CroakleNotesGetProjectWeekDate(dayIndex) {
    if (typeof CroakleProjectGetWeekDates !== "function" || typeof CroakleFormatDate !== "function") return CroakleNotesGetSelectedDate();
    return CroakleFormatDate(CroakleProjectGetWeekDates()[Number(dayIndex)] || new Date());
  }

  function CroakleNotesGetMonthDateSet() {
    if (!CroakleState || typeof CroakleGetDaysInMonth !== "function" || typeof CroakleFormatDate !== "function") return null;
    return new Set(Array.from({ length: CroakleGetDaysInMonth(CroakleState.trackYear, CroakleState.trackMonth) }, (_, index) => {
      return CroakleFormatDate(new Date(CroakleState.trackYear, CroakleState.trackMonth, index + 1));
    }));
  }

  function CroakleNotesGetRows() {
    const monthDates = CroakleNotesGetMonthDateSet();
    const filter = CroakleNotesGetFilter();

    return Object.values(CroakleNotesReadStore())
      .filter((row) => row?.dateIso && row?.note)
      .filter((row) => !monthDates || monthDates.has(row.dateIso))
      .filter((row) => filter === "all" || row.type === filter)
      .sort((first, second) => second.dateIso.localeCompare(first.dateIso) || second.updatedAt - first.updatedAt);
  }

  function CroakleNotesEnsureStyles() {
    if (document.querySelector("#CroakleNotesLiteStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleNotesLiteStyles";
    style.textContent = `
      .CroakleNoteButton {
        min-height: 28px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 999px;
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleText, #111111);
        padding: 0 10px;
        font-size: 12px;
        font-weight: 950;
        line-height: 1;
        touch-action: manipulation;
      }

      .CroakleNoteButton[data-has-note="true"] {
        background: #111111;
        color: #ffffff;
      }

      .CroakleHabitTop .CroakleNoteButton,
      .CroakleProjectTop .CroakleNoteButton {
        margin-left: auto;
      }

      .CroakleMoodNoteBar {
        display: flex;
        justify-content: flex-end;
        margin: 10px 0 0;
      }

      .CroakleNotesLitePage.CroaklePageActive { overflow-y: auto; scrollbar-width: none; }
      .CroakleNotesLitePage.CroaklePageActive::-webkit-scrollbar { display: none; }
      .CroakleNotesLitePage .CroakleCard { display: grid; gap: 14px; min-height: calc(100dvh - 148px); }
      .CroakleNotesLiteHeader { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
      .CroakleNotesLiteHeader h2 { margin: 0; font-size: clamp(42px, 12vw, 62px); font-weight: 950; line-height: 0.9; letter-spacing: -0.085em; }
      .CroakleNotesLiteCopy { min-height: 42px; border: 2px solid #111111; border-radius: 16px; background: #111111; color: #ffffff; padding: 0 14px; font-size: 14px; font-weight: 950; touch-action: manipulation; }
      .CroakleNotesLiteTabs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
      .CroakleNotesLiteTabs button { min-height: 38px; border: 2px solid #111111; border-radius: 14px; background: #ffffff; color: #111111; font-size: 13px; font-weight: 950; touch-action: manipulation; }
      .CroakleNotesLiteTabs button[data-active="true"] { background: #111111; color: #ffffff; }
      .CroakleNotesLiteSummary { border-radius: 20px; background: #f5f5f5; padding: 12px 14px; font-size: 14px; font-weight: 900; line-height: 1.25; }
      .CroakleNotesLiteList { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(270px, 82%); gap: 14px; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch; padding: 0 36px 12px 2px; }
      .CroakleNotesLiteList::-webkit-scrollbar { display: none; }
      .CroakleNotesLiteCard { min-height: 300px; max-height: 52dvh; border: 2px solid #111111; border-radius: 28px; background: #ffffff; padding: 16px; display: flex; flex-direction: column; gap: 12px; scroll-snap-align: start; }
      .CroakleNotesLiteMeta { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .CroakleNotesLiteMeta strong, .CroakleNotesLiteMeta span { border-radius: 999px; background: #f2f2f2; padding: 7px 10px; font-size: 13px; font-weight: 950; line-height: 1; white-space: nowrap; }
      .CroakleNotesLiteMeta span { max-width: 55%; overflow: hidden; text-overflow: ellipsis; }
      .CroakleNotesLiteBubble { flex: 1 1 auto; min-height: 0; border-radius: 18px; background: #f5f5f5; padding: 14px; overflow-y: auto; scrollbar-width: none; }
      .CroakleNotesLiteBubble::-webkit-scrollbar { display: none; }
      .CroakleNotesLiteBubble p { margin: 0; color: #111111; font-size: 17px; font-weight: 750; line-height: 1.36; white-space: pre-wrap; }
      .CroakleNotesLiteEmpty { min-height: 260px; border: 2px dashed #d9d9d9; border-radius: 28px; background: #fafafa; padding: 22px; display: grid; place-items: center; text-align: center; }
      .CroakleNotesLiteEmpty strong { display: block; margin-bottom: 6px; font-size: 24px; font-weight: 950; letter-spacing: -0.04em; }
      .CroakleNotesLiteEmpty span { color: #666666; font-size: 16px; font-weight: 800; line-height: 1.35; }
    `;
    document.head.appendChild(style);
  }

  function CroakleNotesEnsureModal() {
    if (document.querySelector("#CroakleNotesLiteDialog")) return;

    document.body.insertAdjacentHTML("beforeend", `
      <dialog class="CroakleAddHabitDialog" id="CroakleNotesLiteDialog" aria-labelledby="CroakleNotesLiteTitle">
        <form class="CroakleAddHabitForm" id="CroakleNotesLiteForm" method="dialog">
          <header class="CroakleAddHabitHeader">
            <h2 id="CroakleNotesLiteTitle">Daily Note</h2>
            <button type="button" data-croakle-note-close aria-label="Close">×</button>
          </header>
          <input name="type" type="hidden" />
          <input name="itemId" type="hidden" />
          <input name="itemName" type="hidden" />
          <input name="dateIso" type="hidden" />
          <label class="CroakleField">
            <span id="CroakleNotesLiteMeta">Note</span>
            <textarea name="note" rows="5" placeholder="Write a note for this day..."></textarea>
          </label>
          <button class="CroakleConfirmHabitButton" type="submit">Save</button>
        </form>
      </dialog>
    `);
  }

  function CroakleNotesOpenEditor(type, itemId, itemName, dateIso) {
    CroakleNotesEnsureModal();
    const dialog = document.querySelector("#CroakleNotesLiteDialog");
    const form = document.querySelector("#CroakleNotesLiteForm");
    const meta = document.querySelector("#CroakleNotesLiteMeta");
    if (!dialog || !form) return;

    form.elements.type.value = type;
    form.elements.itemId.value = itemId || "day";
    form.elements.itemName.value = itemName || "Day";
    form.elements.dateIso.value = dateIso;
    form.elements.note.value = CroakleNotesRead(type, itemId || "day", dateIso);
    meta.textContent = `${type.toUpperCase()} • ${itemName || "Day"} • ${CroakleNotesGetDateLabel(dateIso)}`;
    dialog.showModal();
    form.elements.note.focus();
  }

  function CroakleNotesDecorateHabitRows() {
    document.querySelectorAll(".CroakleHabitTop").forEach((top) => {
      if (top.querySelector(".CroakleNoteButton")) return;
      const nameButton = top.querySelector(".CroakleHabitNameButton[data-detail-index]");
      const habitIndex = Number(nameButton?.dataset.detailIndex);
      const habit = CroakleState?.habitTemplates?.[habitIndex];
      if (!habit) return;

      const itemId = habit.id || `habit-${habitIndex}`;
      const dateIso = CroakleNotesGetSelectedDate();
      const hasNote = Boolean(CroakleNotesRead("habit", itemId, dateIso));
      top.insertAdjacentHTML("beforeend", `<button class="CroakleNoteButton" type="button" data-croakle-note-type="habit" data-croakle-note-item-id="${CroakleNotesEscape(itemId)}" data-croakle-note-item-name="${CroakleNotesEscape(habit.name)}" data-croakle-note-date="${dateIso}" data-has-note="${hasNote}">Note</button>`);
    });
  }

  function CroakleNotesDecorateProjectRows() {
    document.querySelectorAll(".CroakleProjectTop").forEach((top) => {
      if (top.querySelector(".CroakleNoteButton")) return;
      const nameButton = top.querySelector(".CroakleProjectNameButton[data-project-detail-index]");
      const projectIndex = Number(nameButton?.dataset.projectDetailIndex);
      const project = window.CroakleProjectState?.projects?.[projectIndex];
      if (!project) return;

      const itemId = project.id || `project-${projectIndex}`;
      const dateIso = CroakleNotesGetSelectedDate();
      const hasNote = Boolean(CroakleNotesRead("project", itemId, dateIso));
      top.insertAdjacentHTML("beforeend", `<button class="CroakleNoteButton" type="button" data-croakle-note-type="project" data-croakle-note-item-id="${CroakleNotesEscape(itemId)}" data-croakle-note-item-name="${CroakleNotesEscape(project.name)}" data-croakle-note-date="${dateIso}" data-has-note="${hasNote}">Note</button>`);
    });
  }

  function CroakleNotesDecorateMoodPage() {
    const moodCard = document.querySelector('[data-page="mood"] .CroakleCard');
    if (!moodCard || moodCard.querySelector(".CroakleMoodNoteBar")) return;
    const dateIso = CroakleNotesGetSelectedDate();
    const hasNote = Boolean(CroakleNotesRead("mood", "day", dateIso));
    moodCard.insertAdjacentHTML("beforeend", `<div class="CroakleMoodNoteBar"><button class="CroakleNoteButton" type="button" data-croakle-note-type="mood" data-croakle-note-item-id="day" data-croakle-note-item-name="Mood" data-croakle-note-date="${dateIso}" data-has-note="${hasNote}">Mood Note</button></div>`);
  }

  function CroakleNotesDecorate() {
    CroakleNotesDecorateHabitRows();
    CroakleNotesDecorateProjectRows();
    CroakleNotesDecorateMoodPage();
  }

  function CroakleNotesRenderBoard() {
    const list = document.querySelector("#CroakleNotesLiteList");
    const summary = document.querySelector("#CroakleNotesLiteSummary");
    if (!list || !summary) return;

    const rows = CroakleNotesGetRows();
    const filter = CroakleNotesGetFilter();
    document.querySelectorAll("[data-croakle-notes-filter]").forEach((button) => {
      button.dataset.active = String(button.dataset.croakleNotesFilter === filter);
    });

    summary.textContent = rows.length ? `${rows.length} note${rows.length > 1 ? "s" : ""} in this month.` : "No notes yet. Add notes from Habit, Project, or Mood pages.";

    if (!rows.length) {
      list.innerHTML = `<div class="CroakleNotesLiteEmpty"><div><strong>No notes yet</strong><span>Use the Note button on Habit, Project, or Mood pages.</span></div></div>`;
      return;
    }

    list.innerHTML = rows.map((row) => `
      <article class="CroakleNotesLiteCard">
        <div class="CroakleNotesLiteMeta"><strong>${CroakleNotesEscape(CroakleNotesGetDateLabel(row.dateIso))}</strong><span>${CroakleNotesEscape(row.type)} · ${CroakleNotesEscape(row.itemName)}</span></div>
        <div class="CroakleNotesLiteBubble"><p>${CroakleNotesEscape(row.note)}</p></div>
      </article>
    `).join("");
  }

  function CroakleNotesCopyBoard() {
    const rows = CroakleNotesGetRows();
    const text = rows.length ? rows.map((row) => `${CroakleNotesGetDateLabel(row.dateIso)}\n${row.type}: ${row.itemName}\n${row.note}`).join("\n\n---\n\n") : "No notes yet.";
    navigator.clipboard?.writeText(text).catch(() => window.prompt("Copy notes:", text));
  }

  function CroakleNotesBind() {
    if (window.CroakleNotesLiteBound) return;
    window.CroakleNotesLiteBound = true;

    document.addEventListener("click", (event) => {
      const noteButton = event.target.closest("[data-croakle-note-type]");
      if (noteButton) {
        event.preventDefault();
        CroakleNotesOpenEditor(noteButton.dataset.croakleNoteType, noteButton.dataset.croakleNoteItemId, noteButton.dataset.croakleNoteItemName, noteButton.dataset.croakleNoteDate);
        return;
      }

      const filterButton = event.target.closest("[data-croakle-notes-filter]");
      if (filterButton) {
        event.preventDefault();
        CroakleNotesSetFilter(filterButton.dataset.croakleNotesFilter);
        CroakleNotesRenderBoard();
        return;
      }

      if (event.target.closest("[data-croakle-notes-copy]")) {
        event.preventDefault();
        CroakleNotesCopyBoard();
      }
    });

    document.addEventListener("submit", (event) => {
      if (event.target.id !== "CroakleNotesLiteForm") return;
      event.preventDefault();
      const form = event.target;
      CroakleNotesWrite(form.elements.type.value, form.elements.itemId.value, form.elements.itemName.value, form.elements.dateIso.value, form.elements.note.value);
      document.querySelector("#CroakleNotesLiteDialog")?.close();
      CroakleNotesDecorate();
      CroakleNotesRenderBoard();
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-croakle-note-close]")) {
        event.preventDefault();
        document.querySelector("#CroakleNotesLiteDialog")?.close();
      }
    });
  }

  function CroakleNotesInit() {
    CroakleNotesEnsureStyles();
    CroakleNotesEnsureModal();
    CroakleNotesBind();
    CroakleNotesDecorate();
    CroakleNotesRenderBoard();
  }

  window.CroakleRenderNotesBoard = CroakleNotesRenderBoard;
  window.setTimeout(CroakleNotesInit, 0);
  window.setInterval(CroakleNotesDecorate, 1200);
})();
