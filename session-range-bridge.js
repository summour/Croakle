(() => {
  const StoreKey = "CroakleSessionBlocksV1";
  const WeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const MinuteHeight = 0.48;
  let isRenderingRange = false;

  function parseJson(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function getState() {
    const saved = parseJson(localStorage.getItem(StoreKey), {});
    return {
      weekOffset: Number(saved.weekOffset || 0),
      blocks: Array.isArray(saved.blocks) ? saved.blocks : [],
      startHour: Number.isFinite(Number(saved.startHour)) ? Number(saved.startHour) : 0,
      endHour: Number.isFinite(Number(saved.endHour)) ? Number(saved.endHour) : 24,
    };
  }

  function saveState(state) {
    localStorage.setItem(StoreKey, JSON.stringify(state));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeRange(state) {
    const startHour = clamp(Math.floor(Number(state.startHour)), 0, 23);
    const endHour = clamp(Math.ceil(Number(state.endHour)), startHour + 1, 24);

    return { startHour, endHour };
  }

  function parseHour(value, fallback, isEnd = false) {
    const rawValue = String(value || "").trim().toLowerCase();
    if (!rawValue) return fallback;
    if (isEnd && (rawValue === "24" || rawValue === "24:00")) return 24;

    const match = rawValue.match(/^(\d{1,2})(?::\d{1,2})?$/);
    if (!match) return fallback;

    const hour = Number(match[1]);
    const max = isEnd ? 24 : 23;
    return clamp(hour, 0, max);
  }

  function formatHourInput(hour) {
    return hour === 24 ? "24:00" : `${String(hour).padStart(2, "0")}:00`;
  }

  function formatTime(minutes) {
    const hour = Math.floor(minutes / 60);
    const minute = String(minutes % 60).padStart(2, "0");
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
          <p class="CroakleSessionRangeHint">
            ใส่เวลาได้อิสระ เช่น 8, 08:00, 18:00, 24:00
          </p>
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
    const state = getState();
    const range = normalizeRange(state);
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
    if (!grid || isRenderingRange) return;

    isRenderingRange = true;

    const state = getState();
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
        <button class="CroakleSessionBlock" type="button" data-session-edit="${block.id}" style="${getBlockStyle(block, range)}">
          <strong>${escapeText(block.subject || "Session")}</strong>
          <span>${formatTime(Number(block.startMinute || 0))} · ${Number(block.duration || 60)}m</span>
        </button>
      `).join(""));
    });

    updateRangeButton();
    isRenderingRange = false;
  }

  function openRangeDialog() {
    const dialog = document.querySelector("#CroakleSessionRangeDialog");
    const form = document.querySelector("#CroakleSessionRangeForm");
    if (!dialog || !form) return;

    const range = normalizeRange(getState());
    form.elements.startHour.value = formatHourInput(range.startHour);
    form.elements.endHour.value = formatHourInput(range.endHour);
    dialog.showModal();
    form.elements.startHour.focus();
  }

  function saveRange(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const state = getState();
    const startHour = parseHour(form.elements.startHour.value, state.startHour, false);
    const endHour = parseHour(form.elements.endHour.value, state.endHour, true);

    state.startHour = startHour;
    state.endHour = Math.max(startHour + 1, endHour);
    saveState(state);
    document.querySelector("#CroakleSessionRangeDialog")?.close();
    renderRange();
  }

  function bindEvents() {
    if (window.CroakleSessionRangeEventsBound) return;
    window.CroakleSessionRangeEventsBound = true;

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
    });

    document.addEventListener("submit", (event) => {
      if (event.target.matches("#CroakleSessionRangeForm")) saveRange(event);
    });
  }

  function observeGrid() {
    if (window.CroakleSessionRangeObserverReady) return;
    const grid = document.querySelector("#CroakleSessionGrid");
    if (!grid) return;

    window.CroakleSessionRangeObserverReady = true;
    new MutationObserver(() => {
      if (!isRenderingRange) window.requestAnimationFrame(renderRange);
    }).observe(grid, { childList: true });
  }

  function init() {
    injectStyles();
    ensureToolbar();
    ensureDialog();
    updateRangeButton();
    bindEvents();
    renderRange();
    observeGrid();
  }

  window.CroakleRenderSessionRange = renderRange;
  window.requestAnimationFrame(init);
})();
