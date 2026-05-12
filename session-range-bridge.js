(() => {
  const SessionKey = "CroakleSessionBlocksV1";
  const ActivityKey = "CroakleActivityLogsV1";
  const MinuteHeight = 0.48;
  const WeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let isRendering = false;

  function parseJson(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readSessionState() {
    const saved = parseJson(localStorage.getItem(SessionKey), {});
    return {
      weekOffset: Number(saved.weekOffset || 0),
      blocks: Array.isArray(saved.blocks) ? saved.blocks : [],
      startHour: Number.isFinite(Number(saved.startHour)) ? Number(saved.startHour) : 0,
      endHour: Number.isFinite(Number(saved.endHour)) ? Number(saved.endHour) : 24,
    };
  }

  function normalizeRange(state) {
    const startHour = clamp(Math.floor(Number(state.startHour)), 0, 23);
    const endHour = clamp(Math.ceil(Number(state.endHour)), startHour + 1, 24);
    return { startHour, endHour };
  }

  function saveSessionState(nextState) {
    const previous = readSessionState();
    const range = normalizeRange({
      startHour: Number.isFinite(Number(nextState.startHour)) ? nextState.startHour : previous.startHour,
      endHour: Number.isFinite(Number(nextState.endHour)) ? nextState.endHour : previous.endHour,
    });
    const state = {
      ...previous,
      ...nextState,
      startHour: range.startHour,
      endHour: range.endHour,
      blocks: Array.isArray(nextState.blocks) ? nextState.blocks : previous.blocks,
    };
    localStorage.setItem(SessionKey, JSON.stringify(state));
    syncSessionBlocksToActivityLogs(state.blocks);
  }

  function getActivityLogs() {
    const logs = parseJson(localStorage.getItem(ActivityKey), []);
    return Array.isArray(logs) ? logs : [];
  }

  function saveActivityLogs(logs) {
    localStorage.setItem(ActivityKey, JSON.stringify(logs));
  }

  function blockToLog(block) {
    const now = Date.now();
    return {
      id: `session:${block.id}`,
      sessionId: block.id,
      date: block.date,
      sourceType: block.sourceType || block.type || "manual",
      sourceId: block.sourceId || block.id,
      sourceName: block.sourceName || block.subject || "Session",
      status: "done",
      startMinute: Number(block.startMinute || 0),
      duration: Number(block.duration || 0),
      note: block.note || "",
      color: block.color || "#60a3ff",
      createdAt: Number(block.createdAt || now),
      updatedAt: now,
    };
  }

  function syncSessionBlocksToActivityLogs(blocks) {
    const logs = getActivityLogs();
    const sessionIds = new Set(blocks.map((block) => block.id));
    const nonSessionLogs = logs.filter((log) => {
      return !String(log.id || "").startsWith("session:") || sessionIds.has(log.sessionId);
    });
    const sessionLogsById = new Map(
      nonSessionLogs
        .filter((log) => String(log.id || "").startsWith("session:"))
        .map((log) => [log.sessionId, log])
    );

    blocks.forEach((block) => {
      const oldLog = sessionLogsById.get(block.id) || {};
      const nextLog = { ...oldLog, ...blockToLog(block) };
      const index = nonSessionLogs.findIndex((log) => log.id === nextLog.id);
      if (index >= 0) {
        nonSessionLogs[index] = nextLog;
        return;
      }
      nonSessionLogs.push(nextLog);
    });

    saveActivityLogs(nonSessionLogs);
  }

  function installSessionStoragePatch() {
    if (window.CroakleActivityLogStoragePatched) return;
    window.CroakleActivityLogStoragePatched = true;

    const nativeSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function setItemWithActivityLogs(key, value) {
      if (key !== SessionKey) {
        nativeSetItem(key, value);
        return;
      }

      const previous = readSessionState();
      const incoming = parseJson(value, {});
      const range = normalizeRange({
        startHour: Number.isFinite(Number(incoming.startHour)) ? incoming.startHour : previous.startHour,
        endHour: Number.isFinite(Number(incoming.endHour)) ? incoming.endHour : previous.endHour,
      });
      const nextState = {
        ...previous,
        ...incoming,
        startHour: range.startHour,
        endHour: range.endHour,
        blocks: Array.isArray(incoming.blocks) ? incoming.blocks : previous.blocks,
      };

      nativeSetItem(key, JSON.stringify(nextState));
      syncSessionBlocksToActivityLogs(nextState.blocks);
    };
  }

  function parseHour(value, fallback, isEnd = false) {
    const rawValue = String(value || "").trim().toLowerCase();
    if (!rawValue) return fallback;
    if (isEnd && (rawValue === "24" || rawValue === "24:00")) return 24;
    const match = rawValue.match(/^(\d{1,2})(?::\d{1,2})?$/);
    if (!match) return fallback;
    return clamp(Number(match[1]), 0, isEnd ? 24 : 23);
  }

  function formatHourInput(hour) {
    return hour === 24 ? "24:00" : `${String(hour).padStart(2, "0")}:00`;
  }

  function formatTime(minutes) {
    const safeMinutes = Number(minutes || 0);
    const hour = Math.floor(safeMinutes / 60);
    const minute = String(safeMinutes % 60).padStart(2, "0");
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  function formatHourLabel(hour) {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  }

  function getToday() {
    if (typeof window.CroakleGetToday === "function") return window.CroakleGetToday();
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function formatDate(date) {
    if (typeof window.CroakleFormatDate === "function") return window.CroakleFormatDate(date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function shiftDate(date, amount) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function getWeekDates(state) {
    const today = getToday();
    const monday = shiftDate(today, -((today.getDay() + 6) % 7) + Number(state.weekOffset || 0) * 7);
    return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function injectStyles() {
    if (document.querySelector("#CroakleSessionRangeStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSessionRangeStyles";
    style.textContent = `
      .CroakleSessionToolbar {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: center;
      }

      .CroakleSessionToolbar .CroakleSessionFab {
        width: 100%;
      }

      .CroakleSessionRangeButton {
        min-height: 42px;
        padding: 0 12px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 999px;
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleInk, #111111);
        font: inherit;
        font-size: 13px;
        font-weight: 850;
        white-space: nowrap;
      }

      .CroakleSessionRangeHint {
        color: var(--CroakleMuted, #666666);
        font-size: 12px;
        font-weight: 750;
        line-height: 1.3;
      }

      .CroakleSessionBlock {
        cursor: pointer;
        pointer-events: auto !important;
        touch-action: manipulation;
        z-index: 30 !important;
      }

      .CroakleSessionBlock span {
        display: none !important;
      }

      .CroakleSessionColumn::before {
        pointer-events: none !important;
        z-index: 0 !important;
      }

      @media (max-width: 380px) {
        .CroakleSessionToolbar {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureToolbar() {
    const addButton = document.querySelector("[data-session-add]");
    if (!addButton || addButton.closest(".CroakleSessionToolbar")) return;

    addButton.insertAdjacentHTML("beforebegin", `<div class="CroakleSessionToolbar" data-session-toolbar></div>`);
    const toolbar = document.querySelector("[data-session-toolbar]");
    toolbar?.appendChild(addButton);
    toolbar?.insertAdjacentHTML("beforeend", `
      <button class="CroakleSessionRangeButton" type="button" data-session-range>Time 00:00-24:00</button>
    `);
  }

  function ensureDialog() {
    if (document.querySelector("#CroakleSessionRangeDialog")) return;

    document.querySelector(".CroakleHabitMoodShell")?.insertAdjacentHTML("beforeend", `
      <dialog class="CroakleAddHabitDialog" id="CroakleSessionRangeDialog" aria-labelledby="CroakleSessionRangeTitle">
        <form class="CroakleAddHabitForm" id="CroakleSessionRangeForm" method="dialog">
          <header class="CroakleAddHabitHeader">
            <h2 id="CroakleSessionRangeTitle">Time range</h2>
            <button type="button" data-session-range-close aria-label="Close">×</button>
          </header>
          <p class="CroakleSessionRangeHint">ใส่เวลาได้อิสระ เช่น 8, 08:00, 18:00, 24:00</p>
          <div class="CroakleSessionFormGrid">
            <label class="CroakleField">
              <span>Show from</span>
              <input name="startHour" type="text" inputmode="numeric" placeholder="08:00" required />
            </label>
            <label class="CroakleField">
              <span>Show until</span>
              <input name="endHour" type="text" inputmode="numeric" placeholder="24:00" required />
            </label>
          </div>
          <button class="CroakleConfirmHabitButton" type="submit">Save range</button>
        </form>
      </dialog>
    `);
  }

  function updateRangeButton() {
    const range = normalizeRange(readSessionState());
    const button = document.querySelector("[data-session-range]");
    if (!button) return;
    button.textContent = `${formatHourInput(range.startHour)}-${formatHourInput(range.endHour)}`;
  }

  function createTimeCells(range) {
    return Array.from({ length: range.endHour - range.startHour }, (_, index) => {
      const hour = range.startHour + index;
      return `<div class="CroakleSessionTimeCell" style="grid-column:1;grid-row:${index + 1};">${formatHourLabel(hour)}</div>`;
    }).join("");
  }

  function createColumns(weekDates, range) {
    const rowEnd = range.endHour - range.startHour + 1;
    return weekDates.map((date, index) => `
      <div class="CroakleSessionColumn" data-session-date="${formatDate(date)}" style="grid-column:${index + 2};grid-row:1/${rowEnd};"></div>
    `).join("");
  }

  function getBlockStyle(block, range) {
    const rangeStart = range.startHour * 60;
    const start = Math.max(rangeStart, Number(block.startMinute || rangeStart));
    const duration = Math.max(15, Number(block.duration || 60));
    const top = (start - rangeStart) * MinuteHeight;
    const height = Math.max(30, duration * MinuteHeight);
    const color = block.color || "#60a3ff";
    return `top:${top}px;height:${height}px;background:${color};`;
  }

  function renderRange() {
    const grid = document.querySelector("#CroakleSessionGrid");
    if (!grid || isRendering) return;

    isRendering = true;
    const state = readSessionState();
    const range = normalizeRange(state);
    const weekDates = getWeekDates(state);
    const visibleStart = range.startHour * 60;
    const visibleEnd = range.endHour * 60;

    grid.innerHTML = createTimeCells(range) + createColumns(weekDates, range);
    grid.style.minHeight = `${((range.endHour - range.startHour) * 60 * MinuteHeight) + 2}px`;

    weekDates.forEach((date) => {
      const dateIso = formatDate(date);
      const column = grid.querySelector(`[data-session-date="${dateIso}"]`);
      const blocks = state.blocks
        .filter((block) => block.date === dateIso)
        .filter((block) => Number(block.startMinute) >= visibleStart && Number(block.startMinute) < visibleEnd)
        .sort((a, b) => Number(a.startMinute) - Number(b.startMinute));

      column?.insertAdjacentHTML("beforeend", blocks.map((block) => `
        <button class="CroakleSessionBlock" type="button" data-session-edit="${block.id}" style="${getBlockStyle(block, range)}" aria-label="${escapeText(block.subject || "Session")}">
          <strong>${escapeText(block.subject || "Session")}</strong>
        </button>
      `).join(""));
    });

    updateRangeButton();
    isRendering = false;
  }

  function renderRangeSoon() {
    window.requestAnimationFrame(renderRange);
    window.setTimeout(renderRange, 80);
  }

  function syncColorOptions(form) {
    const selectedColor = form.elements.color?.value;
    form.querySelectorAll("[data-session-color]").forEach((button) => {
      button.classList.toggle("CroakleSessionColorOptionActive", button.dataset.sessionColor === selectedColor);
    });
  }

  function openSessionDialog(block) {
    const dialog = document.querySelector("#CroakleSessionDialog");
    const form = document.querySelector("#CroakleSessionForm");
    if (!dialog || !form || !block) return;

    form.reset();
    form.elements.id.value = block.id || "";
    form.elements.subject.value = block.subject || "";
    form.elements.date.value = block.date || "";
    form.elements.start.value = formatTime(block.startMinute || 9 * 60);
    form.elements.duration.value = String(Number(block.duration || 60));
    form.elements.type.value = block.type || "focus";
    form.elements.color.value = block.color || "#60a3ff";
    form.querySelector("[data-session-delete]").hidden = false;
    syncColorOptions(form);
    dialog.showModal();
    form.elements.subject.focus();
  }

  function openRangeDialog() {
    const dialog = document.querySelector("#CroakleSessionRangeDialog");
    const form = document.querySelector("#CroakleSessionRangeForm");
    if (!dialog || !form) return;

    const range = normalizeRange(readSessionState());
    form.elements.startHour.value = formatHourInput(range.startHour);
    form.elements.endHour.value = formatHourInput(range.endHour);
    dialog.showModal();
    form.elements.startHour.focus();
  }

  function saveRangeFromForm(form) {
    const state = readSessionState();
    const startHour = parseHour(form.elements.startHour.value, state.startHour, false);
    const endHour = parseHour(form.elements.endHour.value, state.endHour, true);
    saveSessionState({ ...state, startHour, endHour: Math.max(startHour + 1, endHour) });
    document.querySelector("#CroakleSessionRangeDialog")?.close();
    renderRangeSoon();
  }

  function getEditButton(event) {
    return event.composedPath?.().find((node) => node?.nodeType === 1 && node.matches?.("[data-session-edit]"))
      || event.target.closest?.("[data-session-edit]");
  }

  function handleSessionEdit(event) {
    const button = getEditButton(event);
    if (!button) return;
    const block = readSessionState().blocks.find((item) => item.id === button.dataset.sessionEdit);
    if (!block) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openSessionDialog(block);
  }

  function bindEvents() {
    if (window.CroakleSessionRangeEventsBound) return;
    window.CroakleSessionRangeEventsBound = true;

    document.addEventListener("pointerup", handleSessionEdit, true);
    document.addEventListener("click", handleSessionEdit, true);
    document.addEventListener("touchend", handleSessionEdit, true);

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-session-range]")) {
        event.preventDefault();
        openRangeDialog();
        return;
      }
      if (event.target.closest("[data-session-range-close]")) {
        event.preventDefault();
        document.querySelector("#CroakleSessionRangeDialog")?.close();
      }
    }, true);

    document.addEventListener("click", (event) => {
      const button = event.target.closest?.("#CroakleSessionRangeForm .CroakleConfirmHabitButton");
      if (!button) return;
      const form = button.closest("#CroakleSessionRangeForm");
      if (!form) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      saveRangeFromForm(form);
    }, true);

    document.addEventListener("submit", (event) => {
      if (event.target.matches("#CroakleSessionRangeForm")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        saveRangeFromForm(event.target);
        return;
      }
      if (event.target.matches("#CroakleSessionForm")) renderRangeSoon();
    }, true);
  }

  function patchPageNavigation() {
    if (window.CroakleSessionRangePagePatched || typeof window.CroakleSetPage !== "function") return;
    window.CroakleSessionRangePagePatched = true;
    const originalSetPage = window.CroakleSetPage;
    window.CroakleSetPage = function CroakleSetPageWithSessionRange(pageName) {
      const result = originalSetPage.apply(this, arguments);
      if (pageName === "sessions") renderRangeSoon();
      return result;
    };
  }

  function init() {
    installSessionStoragePatch();
    injectStyles();
    ensureToolbar();
    ensureDialog();
    bindEvents();
    patchPageNavigation();
    syncSessionBlocksToActivityLogs(readSessionState().blocks);
    updateRangeButton();
    renderRangeSoon();
  }

  window.CroakleActivityLogStore = {
    getLogs: getActivityLogs,
    saveLog(log) {
      const logs = getActivityLogs().filter((item) => item.id !== log.id);
      logs.push({ ...log, updatedAt: Date.now() });
      saveActivityLogs(logs);
    },
    deleteLog(id) {
      saveActivityLogs(getActivityLogs().filter((log) => log.id !== id));
    },
    getLogsBySource(sourceType, sourceId) {
      return getActivityLogs().filter((log) => log.sourceType === sourceType && log.sourceId === sourceId);
    },
    getLogsByDate(date) {
      return getActivityLogs().filter((log) => log.date === date);
    },
  };
  window.CroakleRenderSessionRange = renderRange;
  window.requestAnimationFrame(init);
})();
