(() => {
  const CroakleNotesStoreKey = "CroakleHabitDailyNotesV1";
  let CroakleNotesMonthCursor = null;
  let CroakleNotesBoardRendering = false;

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

      .CroakleNotesMonthNav {
        display: grid;
        grid-template-columns: 48px 1fr 48px;
        align-items: center;
        gap: 10px;
      }

      .CroakleNotesMonthButton {
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 999px;
        background: #f2f2f2;
        color: #111111;
        font-size: 28px;
        font-weight: 950;
        line-height: 1;
      }

      .CroakleNotesMonthLabel {
        min-height: 48px;
        border: 2px solid #111111;
        border-radius: 18px;
        background: #ffffff;
        display: grid;
        place-items: center;
        padding: 0 12px;
        color: #111111;
        font-size: 18px;
        font-weight: 950;
        letter-spacing: -0.04em;
        text-align: center;
      }

      .CroakleJournalTimeline {
        display: grid;
        gap: 14px;
      }

      .CroakleJournalStoryRail {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(72px, 78px);
        gap: 10px;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        padding: 2px 2px 6px;
        -webkit-overflow-scrolling: touch;
      }

      .CroakleJournalStoryRail::-webkit-scrollbar {
        display: none;
      }

      .CroakleJournalStoryChip {
        min-height: 86px;
        border: 2px solid #111111;
        border-radius: 24px;
        background: #ffffff;
        color: #111111;
        display: grid;
        place-items: center;
        gap: 3px;
        padding: 8px 6px;
        scroll-snap-align: start;
        transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), background 180ms ease, color 180ms ease;
      }

      .CroakleJournalStoryChip[data-active="true"] {
        background: #111111;
        color: #ffffff;
        transform: scale(1.03);
      }

      .CroakleJournalStoryChip strong {
        font-size: 24px;
        font-weight: 950;
        line-height: 1;
        letter-spacing: -0.05em;
      }

      .CroakleJournalStoryChip span {
        font-size: 11px;
        font-weight: 950;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .CroakleJournalStoryChip small {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: currentColor;
        opacity: 0.85;
      }

      .CroakleJournalDeck {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(86%, 1fr);
        gap: 14px;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        padding: 2px 2px 12px;
        -webkit-overflow-scrolling: touch;
      }

      .CroakleJournalDeck::-webkit-scrollbar {
        display: none;
      }

      .CroakleJournalCard {
        min-height: 360px;
        border: 2px solid #111111;
        border-radius: 30px;
        background: #ffffff;
        color: #111111;
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        scroll-snap-align: center;
        scroll-snap-stop: always;
        transform: translateZ(0);
      }

      .CroakleJournalCardHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .CroakleJournalDate {
        display: grid;
        gap: 2px;
      }

      .CroakleJournalDate span {
        color: #666666;
        font-size: 13px;
        font-weight: 950;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .CroakleJournalDate strong {
        color: #111111;
        font-size: clamp(34px, 10vw, 52px);
        font-weight: 950;
        line-height: 0.9;
        letter-spacing: -0.085em;
      }

      .CroakleJournalCount {
        min-width: 52px;
        min-height: 42px;
        border: 2px solid #111111;
        border-radius: 999px;
        display: grid;
        place-items: center;
        padding: 0 10px;
        font-size: 15px;
        font-weight: 950;
      }

      .CroakleJournalEntries {
        display: grid;
        gap: 12px;
        overflow-y: auto;
        scrollbar-width: none;
        padding-right: 2px;
      }

      .CroakleJournalEntries::-webkit-scrollbar {
        display: none;
      }

      .CroakleJournalEntry {
        border-radius: 24px;
        background: #f5f5f5;
        padding: 14px;
        display: grid;
        gap: 8px;
      }

      .CroakleJournalEntryHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .CroakleJournalEntryHeader strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 18px;
        font-weight: 950;
        letter-spacing: -0.04em;
      }

      .CroakleJournalEntryHeader span {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: #111111;
        flex: 0 0 auto;
      }

      .CroakleJournalEntry p {
        margin: 0;
        color: #111111;
        font-size: 18px;
        font-weight: 750;
        line-height: 1.36;
        white-space: pre-wrap;
      }

      .CroakleJournalDots {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-height: 14px;
      }

      .CroakleJournalDot {
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: #d9d9d9;
        transition: width 180ms ease, background 180ms ease;
      }

      .CroakleJournalDot[data-active="true"] {
        width: 22px;
        background: #111111;
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

        .CroakleNotesMonthLabel {
          font-size: 16px;
        }

        .CroakleJournalDeck {
          grid-auto-columns: 88%;
        }

        .CroakleJournalCard {
          min-height: 330px;
          padding: 16px;
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

  function CroakleEscapeNotesText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function CroakleLoadNotesStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(CroakleNotesStoreKey) || "{}");
      return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    } catch {
      return {};
    }
  }

  function CroakleParseNotesDate(dateIso) {
    const [year, month, day] = String(dateIso || "").split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function CroakleFormatNotesDate(dateIso) {
    const date = CroakleParseNotesDate(dateIso);
    return date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : dateIso;
  }

  function CroakleGetNotesMonthLabel(cursor) {
    const date = new Date(cursor.year, cursor.month, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function CroakleGetInitialNotesMonth() {
    if (typeof CroakleState !== "undefined" && Number.isFinite(CroakleState.trackYear) && Number.isFinite(CroakleState.trackMonth)) {
      return { year: CroakleState.trackYear, month: CroakleState.trackMonth };
    }

    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  }

  function CroakleSetNotesMonthCursor(nextCursor) {
    const date = new Date(nextCursor.year, nextCursor.month, 1);
    CroakleNotesMonthCursor = { year: date.getFullYear(), month: date.getMonth() };
  }

  function CroakleShiftNotesMonth(direction) {
    CroakleSetNotesMonthCursor({
      year: CroakleNotesMonthCursor.year,
      month: CroakleNotesMonthCursor.month + direction,
    });
    CroakleRenderNotesBoardByMonth();
  }

  function CroakleGetHabitNameFromNoteKey(habitId) {
    const templates = typeof CroakleState !== "undefined" && Array.isArray(CroakleState.habitTemplates)
      ? CroakleState.habitTemplates
      : [];
    const foundHabit = templates.find((habit, index) => habit?.id === habitId || `CroakleHabitIndex${index}` === habitId);
    return foundHabit?.name || "Habit";
  }

  function CroakleGetNotesForSelectedMonth() {
    const store = CroakleLoadNotesStore();

    return Object.entries(store)
      .map(([key, note]) => {
        const [habitId, dateIso] = key.split("::");
        const date = CroakleParseNotesDate(dateIso);

        return {
          habitId,
          habitName: CroakleGetHabitNameFromNoteKey(habitId),
          date,
          dateIso,
          dateLabel: CroakleFormatNotesDate(dateIso),
          note: String(note || "").trim(),
        };
      })
      .filter((item) => item.note && item.date && item.date.getFullYear() === CroakleNotesMonthCursor.year && item.date.getMonth() === CroakleNotesMonthCursor.month)
      .sort((a, b) => b.date - a.date || a.habitName.localeCompare(b.habitName));
  }

  function CroakleGroupNotesByDate(notes) {
    return [...new Set(notes.map((item) => item.dateIso))]
      .map((dateIso) => {
        const rows = notes.filter((item) => item.dateIso === dateIso);
        return {
          dateIso,
          date: rows[0]?.date,
          dateLabel: rows[0]?.dateLabel || dateIso,
          rows,
        };
      })
      .sort((a, b) => b.date - a.date);
  }

  function CroakleFormatNotesForCopy(notes) {
    if (!notes.length) {
      return `No notes yet for ${CroakleGetNotesMonthLabel(CroakleNotesMonthCursor)}.`;
    }

    return notes.map((item) => [
      "┌──────────────────────────────",
      `│ ${item.dateLabel}`,
      `│ ${item.habitName}`,
      "├──────────────────────────────",
      ...String(item.note).split("\n").map((line) => `│ ${line}`),
      "└──────────────────────────────",
    ].join("\n")).join("\n\n");
  }

  function CroakleEnsureNotesMonthNav() {
    const toolbar = document.querySelector(".CroakleNotesBoardToolbar");

    if (!toolbar || document.querySelector(".CroakleNotesMonthNav")) {
      return;
    }

    toolbar.insertAdjacentHTML("beforebegin", `
      <div class="CroakleNotesMonthNav" aria-label="Notes month navigation">
        <button class="CroakleNotesMonthButton" type="button" data-notes-month="previous" aria-label="Previous notes month">‹</button>
        <div class="CroakleNotesMonthLabel" id="CroakleNotesMonthLabel">Month</div>
        <button class="CroakleNotesMonthButton" type="button" data-notes-month="next" aria-label="Next notes month">›</button>
      </div>
    `);
  }

  function CroakleGetDayLabel(date) {
    return date ? date.toLocaleDateString("en-US", { weekday: "short" }) : "Day";
  }

  function CroakleRenderTimeline(groups) {
    return `
      <div class="CroakleJournalTimeline">
        <div class="CroakleJournalStoryRail" aria-label="Journal days">
          ${groups.map((group, index) => `
            <button class="CroakleJournalStoryChip" type="button" data-journal-card-target="${index}" data-active="${index === 0}">
              <span>${CroakleEscapeNotesText(CroakleGetDayLabel(group.date))}</span>
              <strong>${group.date?.getDate() || ""}</strong>
              <small aria-hidden="true"></small>
            </button>
          `).join("")}
        </div>

        <div class="CroakleJournalDeck" id="CroakleJournalDeck" aria-label="Journal timeline cards">
          ${groups.map((group, index) => `
            <article class="CroakleJournalCard" data-journal-card-index="${index}">
              <header class="CroakleJournalCardHeader">
                <div class="CroakleJournalDate">
                  <span>${CroakleEscapeNotesText(CroakleGetDayLabel(group.date))}</span>
                  <strong>${CroakleEscapeNotesText(group.dateLabel)}</strong>
                </div>
                <div class="CroakleJournalCount">${group.rows.length}</div>
              </header>

              <div class="CroakleJournalEntries">
                ${group.rows.map((item) => `
                  <section class="CroakleJournalEntry">
                    <div class="CroakleJournalEntryHeader">
                      <strong>${CroakleEscapeNotesText(item.habitName)}</strong>
                      <span aria-hidden="true"></span>
                    </div>
                    <p>${CroakleEscapeNotesText(item.note)}</p>
                  </section>
                `).join("")}
              </div>
            </article>
          `).join("")}
        </div>

        <div class="CroakleJournalDots" aria-hidden="true">
          ${groups.map((_, index) => `<span class="CroakleJournalDot" data-journal-dot="${index}" data-active="${index === 0}"></span>`).join("")}
        </div>
      </div>
    `;
  }

  function CroakleSyncJournalActiveIndex(index) {
    document.querySelectorAll("[data-journal-card-target]").forEach((chip) => {
      chip.dataset.active = String(Number(chip.dataset.journalCardTarget) === index);
    });

    document.querySelectorAll("[data-journal-dot]").forEach((dot) => {
      dot.dataset.active = String(Number(dot.dataset.journalDot) === index);
    });
  }

  function CroakleRenderNotesBoardByMonth() {
    const list = document.querySelector("#CroakleNotesBoardList");
    const summary = document.querySelector("#CroakleNotesBoardSummary");
    const monthLabel = document.querySelector("#CroakleNotesMonthLabel");

    if (!list || !summary || !monthLabel || !CroakleNotesMonthCursor) {
      return;
    }

    CroakleNotesBoardRendering = true;
    const notes = CroakleGetNotesForSelectedMonth();
    const groups = CroakleGroupNotesByDate(notes);

    monthLabel.textContent = CroakleGetNotesMonthLabel(CroakleNotesMonthCursor);
    summary.textContent = notes.length
      ? `${notes.length} note${notes.length > 1 ? "s" : ""} across ${groups.length} day${groups.length > 1 ? "s" : ""}. Swipe the cards.`
      : `No notes in ${CroakleGetNotesMonthLabel(CroakleNotesMonthCursor)}.`;

    if (!groups.length) {
      list.innerHTML = `
        <div class="CroakleNotesEmpty">
          <div>
            <strong>No notes yet</strong>
            <span>Use ‹ or › to view another month, or long press any habit check circle to write a daily note.</span>
          </div>
        </div>
      `;
      CroakleNotesBoardRendering = false;
      return;
    }

    list.innerHTML = CroakleRenderTimeline(groups);
    CroakleNotesBoardRendering = false;
    window.requestAnimationFrame(CroakleBindJournalDeckSync);
  }

  function CroakleBindJournalDeckSync() {
    const deck = document.querySelector("#CroakleJournalDeck");

    if (!deck || deck.dataset.croakleJournalSyncBound === "true") {
      return;
    }

    deck.dataset.croakleJournalSyncBound = "true";
    deck.addEventListener("scroll", () => {
      const cards = [...deck.querySelectorAll("[data-journal-card-index]")];
      const deckCenter = deck.scrollLeft + deck.clientWidth / 2;
      const activeCard = cards.reduce((closest, card) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - deckCenter);
        return distance < closest.distance ? { card, distance } : closest;
      }, { card: cards[0], distance: Infinity }).card;

      CroakleSyncJournalActiveIndex(Number(activeCard?.dataset.journalCardIndex || 0));
    }, { passive: true });
  }

  function CroakleOpenJournalCard(index) {
    const deck = document.querySelector("#CroakleJournalDeck");
    const card = deck?.querySelector(`[data-journal-card-index="${index}"]`);

    if (!deck || !card) {
      return;
    }

    deck.scrollTo({ left: card.offsetLeft - (deck.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
    CroakleSyncJournalActiveIndex(index);
  }

  async function CroakleCopySelectedMonthNotes() {
    const notes = CroakleGetNotesForSelectedMonth();
    const notesText = CroakleFormatNotesForCopy(notes);
    const button = document.querySelector("[data-copy-notes]");

    try {
      await navigator.clipboard.writeText(notesText);
      if (button) {
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = "Copy Notes";
        }, 1200);
      }
    } catch {
      window.prompt("Copy your notes:", notesText);
    }
  }

  function CroakleInitNotesBoardMonthView() {
    if (!CroakleNotesMonthCursor) {
      CroakleSetNotesMonthCursor(CroakleGetInitialNotesMonth());
    }

    CroakleEnsureNotesMonthNav();
    CroakleRenderNotesBoardByMonth();
  }

  function CroakleBindNotesMonthControls() {
    if (window.CroakleNotesMonthControlsBound) {
      return;
    }

    window.CroakleNotesMonthControlsBound = true;
    document.addEventListener("click", (event) => {
      const monthButton = event.target.closest("[data-notes-month]");
      const storyChip = event.target.closest("[data-journal-card-target]");

      if (monthButton) {
        event.preventDefault();
        CroakleShiftNotesMonth(monthButton.dataset.notesMonth === "next" ? 1 : -1);
        return;
      }

      if (storyChip) {
        event.preventDefault();
        CroakleOpenJournalCard(Number(storyChip.dataset.journalCardTarget));
        return;
      }

      if (event.target.closest("[data-copy-notes]")) {
        event.preventDefault();
        CroakleCopySelectedMonthNotes();
      }
    }, true);
  }

  function CroakleWatchNotesBoardList() {
    const list = document.querySelector("#CroakleNotesBoardList");

    if (!list || list.dataset.croakleNotesMonthObserved === "true") {
      return;
    }

    list.dataset.croakleNotesMonthObserved = "true";
    new MutationObserver(() => {
      if (CroakleNotesBoardRendering || !document.querySelector('[data-page="notes"].CroaklePageActive')) {
        return;
      }

      window.requestAnimationFrame(CroakleInitNotesBoardMonthView);
    }).observe(list, { childList: true });
  }

  function CroakleInitHabitNoteLayout() {
    CroakleInjectHabitNoteLayoutStyles();
    CroakleMoveNoteButtonsNextToGoal();
    CroakleBindNotesMonthControls();
    CroakleInitNotesBoardMonthView();
    CroakleWatchNotesBoardList();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => {
        CroakleMoveNoteButtonsNextToGoal();
        CroakleInitNotesBoardMonthView();
        CroakleWatchNotesBoardList();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.requestAnimationFrame(CroakleInitHabitNoteLayout);
})();
