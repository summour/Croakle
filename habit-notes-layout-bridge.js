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

  function CroakleRenderNotesBoardByMonth() {
    const list = document.querySelector("#CroakleNotesBoardList");
    const summary = document.querySelector("#CroakleNotesBoardSummary");
    const monthLabel = document.querySelector("#CroakleNotesMonthLabel");

    if (!list || !summary || !monthLabel || !CroakleNotesMonthCursor) {
      return;
    }

    CroakleNotesBoardRendering = true;
    const notes = CroakleGetNotesForSelectedMonth();
    const groups = [...new Set(notes.map((item) => item.habitName))].map((habitName) => ({
      name: habitName,
      rows: notes.filter((item) => item.habitName === habitName),
    }));

    monthLabel.textContent = CroakleGetNotesMonthLabel(CroakleNotesMonthCursor);
    summary.textContent = notes.length
      ? `${notes.length} note${notes.length > 1 ? "s" : ""} saved in ${CroakleGetNotesMonthLabel(CroakleNotesMonthCursor)}.`
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

    list.innerHTML = groups.map((group) => `
      <section class="CroakleNotesBoardGroup">
        <h3>${CroakleEscapeNotesText(group.name)}</h3>
        ${group.rows.map((item) => `
          <article class="CroakleNotesBoardItem">
            <div class="CroakleNotesBoardMeta">
              <strong>${CroakleEscapeNotesText(item.dateLabel)}</strong>
              <span>${CroakleEscapeNotesText(item.habitName)}</span>
            </div>
            <div class="CroakleNotesBoardBubble">
              <p>${CroakleEscapeNotesText(item.note)}</p>
            </div>
          </article>
        `).join("")}
      </section>
    `).join("");

    CroakleNotesBoardRendering = false;
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

      if (monthButton) {
        event.preventDefault();
        CroakleShiftNotesMonth(monthButton.dataset.notesMonth === "next" ? 1 : -1);
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
