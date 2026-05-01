(() => {
  const CroakleNotesStoreKey = "CroakleDailyNotesLiteV1";
  const CroakleNotesFilterKey = "CroakleNotesLiteFilterV1";
  const CroakleNotesMonthKey = "CroakleNotesLiteMonthV1";
  const CroakleNoteTypes = ["habit", "project", "mood"];

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
    return CroakleNoteTypes.includes(saved) ? saved : "habit";
  }

  function CroakleNotesSetFilter(filter) {
    localStorage.setItem(CroakleNotesFilterKey, CroakleNoteTypes.includes(filter) ? filter : "habit");
  }

  function CroakleNotesGetMonthDate() {
    const saved = localStorage.getItem(CroakleNotesMonthKey);
    if (saved && /^\d{4}-\d{2}$/.test(saved)) {
      const [year, month] = saved.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }

    const baseDate = CroakleState?.trackDate && typeof CroakleParseDate === "function"
      ? CroakleParseDate(CroakleState.trackDate)
      : new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  }

  function CroakleNotesSaveMonth(date) {
    localStorage.setItem(CroakleNotesMonthKey, `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }

  function CroakleNotesShiftMonth(direction) {
    const date = CroakleNotesGetMonthDate();
    date.setMonth(date.getMonth() + direction);
    CroakleNotesSaveMonth(date);
    CroakleNotesRenderBoard();
  }

  function CroakleNotesGetMonthLabel() {
    const date = CroakleNotesGetMonthDate();
    if (typeof CroakleGetMonthLabel === "function") return CroakleGetMonthLabel(date.getFullYear(), date.getMonth());
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function CroakleNotesFormatDate(dateIso) {
    const date = typeof CroakleParseDate === "function" ? CroakleParseDate(dateIso) : new Date(dateIso);
    return {
      day: String(date.getDate()),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
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

    if (cleanNote) store[key] = { type, itemId, itemName, dateIso, note: cleanNote, updatedAt: Date.now() };
    else delete store[key];

    CroakleNotesSaveStore(store);
  }

  function CroakleNotesGetSelectedDate() {
    return CroakleState?.trackDate || (typeof CroakleFormatDate === "function" ? CroakleFormatDate(new Date()) : new Date().toISOString().slice(0, 10));
  }

  function CroakleNotesGetMonthDateSet() {
    const monthDate = CroakleNotesGetMonthDate();
    const daysInMonth = typeof CroakleGetDaysInMonth === "function"
      ? CroakleGetDaysInMonth(monthDate.getFullYear(), monthDate.getMonth())
      : new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    return new Set(Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), index + 1);
      return typeof CroakleFormatDate === "function" ? CroakleFormatDate(date) : date.toISOString().slice(0, 10);
    }));
  }

  function CroakleNotesGetRows() {
    const monthDates = CroakleNotesGetMonthDateSet();
    const filter = CroakleNotesGetFilter();

    return Object.values(CroakleNotesReadStore())
      .filter((row) => row?.dateIso && row?.note)
      .filter((row) => monthDates.has(row.dateIso))
      .filter((row) => row.type === filter)
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

      .CroakleNoteButton[data-has-note="true"] { background: #111111; color: #ffffff; }
      .CroakleHabitTop .CroakleNoteButton, .CroakleProjectTop .CroakleNoteButton { margin-left: auto; }
      .CroakleMoodNoteBar { display: flex; justify-content: flex-end; margin: 8px 0 0; }

      .CroakleNotesLitePage.CroaklePageActive {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
      }

      .CroakleNotesLitePage.CroaklePageActive::-webkit-scrollbar { display: none; }

      .CroakleNotesLitePage .CroakleCard {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: calc(100dvh - 148px);
        overflow: hidden;
      }

      .CroakleNotesLiteHeader {
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr);
        align-items: center;
        gap: 10px;
      }

      .CroakleNotesLiteBack,
      .CroakleNotesLiteMonthArrow {
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 999px;
        background: #f2f2f2;
        color: #111111;
        display: grid;
        place-items: center;
        font-size: 28px;
        font-weight: 950;
        line-height: 1;
        touch-action: manipulation;
      }

      .CroakleNotesLiteTitleBlock { min-width: 0; }
      .CroakleNotesLiteTitleBlock .CroakleEyebrow {
        margin: 0 0 3px;
        color: #666666;
        font-size: clamp(12px, 3.4vw, 15px);
        font-weight: 950;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .CroakleNotesLiteTitleBlock h2 {
        margin: 0;
        color: #111111;
        font-size: clamp(38px, 10vw, 54px);
        font-weight: 950;
        line-height: 0.9;
        letter-spacing: -0.08em;
      }

      .CroakleNotesLiteTabs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      .CroakleNotesLiteTabs button {
        min-height: 40px;
        border: 2px solid #111111;
        border-radius: 999px;
        background: #ffffff;
        color: #111111;
        font-size: clamp(13px, 3.7vw, 16px);
        font-weight: 950;
        touch-action: manipulation;
      }

      .CroakleNotesLiteTabs button[data-active="true"] { background: #111111; color: #ffffff; }

      .CroakleNotesLiteMonthRow {
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) 44px;
        align-items: center;
        gap: 8px;
      }

      .CroakleNotesLiteMonthPill {
        min-height: 44px;
        border: 2px solid #111111;
        border-radius: 18px;
        background: #ffffff;
        display: grid;
        place-items: center;
        color: #111111;
        font-size: clamp(17px, 5vw, 24px);
        font-weight: 950;
        letter-spacing: -0.045em;
        text-align: center;
      }

      .CroakleNotesLiteActionRow {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 8px;
        align-items: center;
      }

      .CroakleNotesLiteSummary {
        border-radius: 18px;
        background: #f5f5f5;
        padding: 10px 12px;
        color: #111111;
        font-size: clamp(13px, 3.8vw, 17px);
        font-weight: 900;
        line-height: 1.15;
        white-space: pre-line;
      }

      .CroakleNotesLiteCopy {
        min-height: 44px;
        border: 2px solid #111111;
        border-radius: 16px;
        background: #111111;
        color: #ffffff;
        padding: 0 14px;
        font-size: clamp(13px, 3.8vw, 17px);
        font-weight: 950;
        touch-action: manipulation;
        white-space: nowrap;
      }

      .CroakleNotesLiteDayChips {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        padding: 1px 2px 3px;
      }

      .CroakleNotesLiteDayChips::-webkit-scrollbar { display: none; }

      .CroakleNotesLiteDayChip {
        flex: 0 0 60px;
        min-height: 64px;
        border: 2px solid #111111;
        border-radius: 18px;
        background: #ffffff;
        color: #111111;
        display: grid;
        place-items: center;
        padding: 6px 0;
      }

      .CroakleNotesLiteDayChip:first-child { background: #111111; color: #ffffff; }
      .CroakleNotesLiteDayChip strong { font-size: 22px; font-weight: 950; line-height: 0.95; }
      .CroakleNotesLiteDayChip span { font-size: 11px; font-weight: 950; letter-spacing: 0.1em; }
      .CroakleNotesLiteDayChip i { width: 7px; height: 7px; border-radius: 999px; background: currentColor; opacity: 0.65; }

      .CroakleNotesLiteList {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(260px, 78%);
        gap: 12px;
        overflow-x: auto;
        overflow-y: hidden;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        padding: 0 32px 10px 2px;
      }

      .CroakleNotesLiteList::-webkit-scrollbar { display: none; }

      .CroakleNotesLiteCard {
        min-height: 285px;
        max-height: 43dvh;
        border: 2px solid #111111;
        border-radius: 26px;
        background: #ffffff;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scroll-snap-align: start;
      }

      .CroakleNotesLiteCardTop {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
        gap: 10px;
      }

      .CroakleNotesLiteDateBlock span {
        display: block;
        color: #666666;
        font-size: 14px;
        font-weight: 950;
        letter-spacing: 0.1em;
      }

      .CroakleNotesLiteDateBlock strong {
        display: block;
        margin-top: 4px;
        color: #111111;
        font-size: clamp(32px, 8.4vw, 46px);
        font-weight: 950;
        line-height: 0.9;
        letter-spacing: -0.075em;
      }

      .CroakleNotesLiteCountPill {
        min-width: 48px;
        min-height: 36px;
        border: 2px solid #111111;
        border-radius: 999px;
        display: grid;
        place-items: center;
        color: #111111;
        font-size: 17px;
        font-weight: 950;
      }

      .CroakleNotesLiteBubble {
        border-radius: 20px;
        background: #f5f5f5;
        padding: 12px;
        overflow-y: auto;
        scrollbar-width: none;
      }

      .CroakleNotesLiteBubble::-webkit-scrollbar { display: none; }
      .CroakleNotesLiteBubbleHeader { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
      .CroakleNotesLiteBubbleHeader strong { min-width: 0; color: #111111; font-size: clamp(16px, 4.3vw, 21px); font-weight: 950; line-height: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .CroakleNotesLiteTag { border: 2px solid #111111; border-radius: 999px; background: #ffffff; color: #111111; padding: 4px 8px; font-size: 11px; font-weight: 950; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; }
      .CroakleNotesLiteBubble p { margin: 0; color: #111111; font-size: clamp(15px, 4.1vw, 18px); font-weight: 750; line-height: 1.32; white-space: pre-wrap; }

      .CroakleNotesLiteEmpty {
        grid-column: span 1;
        min-height: 260px;
        border: 2px dashed #d9d9d9;
        border-radius: 26px;
        background: #fafafa;
        padding: 20px;
        display: grid;
        place-items: center;
        text-align: center;
      }

      .CroakleNotesLiteEmpty strong { display: block; margin-bottom: 6px; font-size: 23px; font-weight: 950; letter-spacing: -0.04em; }
      .CroakleNotesLiteEmpty span { color: #666666; font-size: 14px; font-weight: 850; line-height: 1.35; }

      @media (max-width: 390px) {
        .CroakleNotesLitePage .CroakleCard { gap: 8px; }
        .CroakleNotesLiteHeader { grid-template-columns: 40px minmax(0, 1fr); gap: 8px; }
        .CroakleNotesLiteBack, .CroakleNotesLiteMonthArrow { width: 40px; height: 40px; }
        .CroakleNotesLiteTabs { gap: 6px; }
        .CroakleNotesLiteTabs button { min-height: 38px; }
        .CroakleNotesLiteMonthRow { grid-template-columns: 40px minmax(0, 1fr) 40px; gap: 6px; }
        .CroakleNotesLiteMonthPill { min-height: 40px; }
        .CroakleNotesLiteDayChip { flex-basis: 54px; min-height: 58px; border-radius: 16px; }
        .CroakleNotesLiteActionRow { grid-template-columns: 1fr; }
        .CroakleNotesLiteCopy { width: 100%; }
        .CroakleNotesLiteList { grid-auto-columns: minmax(248px, 82%); }
        .CroakleNotesLiteCard { min-height: 250px; max-height: 39dvh; }
      }
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

  function CroakleNotesUpgradeBoardMarkup() {
    const page = document.querySelector('[data-page="notes"] .CroakleCard');
    if (!page || page.dataset.croakleNotesDesign === "minimal-monthly") return;

    page.dataset.croakleNotesDesign = "minimal-monthly";
    page.innerHTML = `
      <header class="CroakleNotesLiteHeader">
        <button class="CroakleNotesLiteBack" type="button" data-page-target="track" aria-label="Back to habits">‹</button>
        <div class="CroakleNotesLiteTitleBlock">
          <p class="CroakleEyebrow">Monthly Notes</p>
          <h2>NotesBoard</h2>
        </div>
      </header>
      <div class="CroakleNotesLiteTabs" aria-label="Notes type">
        <button type="button" data-croakle-notes-filter="habit">Habit</button>
        <button type="button" data-croakle-notes-filter="project">Project</button>
        <button type="button" data-croakle-notes-filter="mood">Mood</button>
      </div>
      <div class="CroakleNotesLiteMonthRow">
        <button class="CroakleNotesLiteMonthArrow" type="button" data-croakle-notes-month="previous" aria-label="Previous month">‹</button>
        <div class="CroakleNotesLiteMonthPill" id="CroakleNotesLiteMonthLabel">Month</div>
        <button class="CroakleNotesLiteMonthArrow" type="button" data-croakle-notes-month="next" aria-label="Next month">›</button>
      </div>
      <div class="CroakleNotesLiteActionRow">
        <div class="CroakleNotesLiteSummary" id="CroakleNotesLiteSummary">No notes yet.</div>
        <button class="CroakleNotesLiteCopy" type="button" data-croakle-notes-copy>Copy</button>
      </div>
      <div class="CroakleNotesLiteDayChips" id="CroakleNotesLiteDayChips"></div>
      <div class="CroakleNotesLiteList" id="CroakleNotesLiteList"></div>
    `;
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
    meta.textContent = `${type.toUpperCase()} • ${itemName || "Day"} • ${CroakleNotesFormatDate(dateIso).label}`;
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

  function CroakleNotesRenderDayChips(rows) {
    const chipList = document.querySelector("#CroakleNotesLiteDayChips");
    if (!chipList) return;

    const uniqueDates = [...new Set(rows.map((row) => row.dateIso))];
    chipList.innerHTML = uniqueDates.map((dateIso) => {
      const chip = CroakleNotesFormatDate(dateIso);
      return `<div class="CroakleNotesLiteDayChip"><span>${chip.weekday}</span><strong>${chip.day}</strong><i></i></div>`;
    }).join("");
  }

  function CroakleNotesRenderBoard() {
    CroakleNotesUpgradeBoardMarkup();

    const list = document.querySelector("#CroakleNotesLiteList");
    const summary = document.querySelector("#CroakleNotesLiteSummary");
    const monthLabel = document.querySelector("#CroakleNotesLiteMonthLabel");
    if (!list || !summary) return;

    const rows = CroakleNotesGetRows();
    const filter = CroakleNotesGetFilter();
    document.querySelectorAll("[data-croakle-notes-filter]").forEach((button) => {
      button.dataset.active = String(button.dataset.croakleNotesFilter === filter);
    });

    if (monthLabel) monthLabel.textContent = CroakleNotesGetMonthLabel();
    const dayCount = new Set(rows.map((row) => row.dateIso)).size;
    summary.textContent = rows.length
      ? `${rows.length} notes across ${dayCount} days.\n${filter.charAt(0).toUpperCase()}${filter.slice(1)}.`
      : `No ${filter} notes yet.`;

    CroakleNotesRenderDayChips(rows);

    if (!rows.length) {
      list.innerHTML = `<div class="CroakleNotesLiteEmpty"><div><strong>No notes yet</strong><span>Use the Note button on Habit, Project, or Mood pages.</span></div></div>`;
      return;
    }

    list.innerHTML = rows.map((row) => {
      const date = CroakleNotesFormatDate(row.dateIso);
      return `
        <article class="CroakleNotesLiteCard">
          <div class="CroakleNotesLiteCardTop">
            <div class="CroakleNotesLiteDateBlock"><span>${date.weekday}</span><strong>${CroakleNotesEscape(date.label.replace(", ", ",\n"))}</strong></div>
            <div class="CroakleNotesLiteCountPill">1</div>
          </div>
          <div class="CroakleNotesLiteBubble">
            <div class="CroakleNotesLiteBubbleHeader"><strong>${CroakleNotesEscape(row.itemName)}</strong><span class="CroakleNotesLiteTag">${CroakleNotesEscape(row.type)}</span></div>
            <p>${CroakleNotesEscape(row.note)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function CroakleNotesCopyBoard() {
    const rows = CroakleNotesGetRows();
    const text = rows.length ? rows.map((row) => `${CroakleNotesFormatDate(row.dateIso).label}\n${row.type}: ${row.itemName}\n${row.note}`).join("\n\n---\n\n") : "No notes yet.";
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

      const monthButton = event.target.closest("[data-croakle-notes-month]");
      if (monthButton) {
        event.preventDefault();
        CroakleNotesShiftMonth(monthButton.dataset.croakleNotesMonth === "next" ? 1 : -1);
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
    CroakleNotesUpgradeBoardMarkup();
    CroakleNotesBind();
    CroakleNotesDecorate();
    CroakleNotesRenderBoard();
  }

  window.CroakleRenderNotesBoard = CroakleNotesRenderBoard;
  window.setTimeout(CroakleNotesInit, 0);
})();
