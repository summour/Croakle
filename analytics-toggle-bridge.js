(() => {
  const CroakleAnalyticsRawDataHiddenStoreKey = "CroakleAnalyticsNumbersHiddenV1";

  function CroakleGetRawDataHidden() {
    return localStorage.getItem(CroakleAnalyticsRawDataHiddenStoreKey) === "true";
  }

  function CroakleSaveRawDataHidden(hidden) {
    localStorage.setItem(CroakleAnalyticsRawDataHiddenStoreKey, String(hidden));
  }

  function CroakleInjectAnalyticsRawDataStyles() {
    if (document.querySelector("#CroakleAnalyticsRawDataStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleAnalyticsRawDataStyles";
    style.textContent = `
      .CroakleAnalyticsNumbersHidden .CroakleAnalyticsLegend,
      .CroakleAnalyticsNumbersHidden .CroakleAnalyticsPointValue {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleGetAnalyticsCard() {
    return document.querySelector('[data-page="analysis"] .CroakleCard');
  }

  function CroakleRemoveOldAnalyticsPageToggle() {
    document.querySelector("#CroakleAnalyticsToggleNumbers")?.remove();
  }

  function CroakleApplyRawDataVisibility() {
    const hidden = CroakleGetRawDataHidden();
    CroakleGetAnalyticsCard()?.classList.toggle("CroakleAnalyticsNumbersHidden", hidden);

    document.querySelectorAll("[data-settings-raw-data]").forEach((input) => {
      input.checked = !hidden;
    });
  }

  function CroakleCreateRawDataSettingsGroup() {
    return `
      <section class="CroakleSettingsGroup" aria-label="Stats display settings" data-raw-data-settings-group>
        <p class="CroakleSettingsGroupTitle">Stats</p>
        <label class="CroakleSettingsToggleRow">
          <span class="CroakleSettingsText">
            <strong>Raw Data</strong>
            <span>เปิด = แสดงข้อมูลดิบใน Stats, ปิด = ซ่อนรายการข้อมูลดิบ</span>
          </span>
          <input class="CroakleSettingsSwitch" type="checkbox" data-settings-raw-data ${CroakleGetRawDataHidden() ? "" : "checked"} />
        </label>
      </section>
    `;
  }

  function CroakleInjectRawDataSettings() {
    const settingsBody = document.querySelector(".CroakleSettingsBody");

    if (!settingsBody || settingsBody.querySelector("[data-raw-data-settings-group]")) {
      return;
    }

    const exportGroup = settingsBody.querySelector('[aria-label="Export and backup settings"]');

    if (exportGroup) {
      exportGroup.insertAdjacentHTML("beforebegin", CroakleCreateRawDataSettingsGroup());
    } else {
      settingsBody.insertAdjacentHTML("beforeend", CroakleCreateRawDataSettingsGroup());
    }

    CroakleApplyRawDataVisibility();
  }

  function CroakleHandleRawDataSettingChange(event) {
    const input = event.target.closest("[data-settings-raw-data]");

    if (!input) {
      return;
    }

    CroakleSaveRawDataHidden(!input.checked);
    CroakleApplyRawDataVisibility();
  }

  function CroaklePatchSettingsRenderer() {
    if (window.CroakleRawDataSettingsRendererPatched || typeof window.CroakleRenderSettingsPanel !== "function") {
      return;
    }

    window.CroakleRawDataSettingsRendererPatched = true;
    const originalRenderSettingsPanel = window.CroakleRenderSettingsPanel;

    window.CroakleRenderSettingsPanel = function CroakleRenderSettingsPanelWithRawData(...args) {
      const result = originalRenderSettingsPanel.apply(this, args);
      CroakleInjectRawDataSettings();
      return result;
    };
  }

  function CroaklePatchPageNavigation() {
    if (window.CroakleRawDataNavigationPatched || typeof window.CroakleSetPage !== "function") {
      return;
    }

    window.CroakleRawDataNavigationPatched = true;
    const originalSetPage = window.CroakleSetPage;

    window.CroakleSetPage = function CroakleSetPageWithRawDataSettings(pageName) {
      const result = originalSetPage.apply(this, arguments);

      if (pageName === "analysis") {
        CroakleRemoveOldAnalyticsPageToggle();
        CroakleApplyRawDataVisibility();
      }

      if (pageName === "settings") {
        CroakleInjectRawDataSettings();
      }

      return result;
    };
  }

  function CroakleBindRawDataSetting() {
    if (window.CroakleRawDataSettingBound) {
      return;
    }

    window.CroakleRawDataSettingBound = true;
    document.addEventListener("change", CroakleHandleRawDataSettingChange);
  }

  function CroakleInitRawDataSetting() {
    CroakleInjectAnalyticsRawDataStyles();
    CroakleRemoveOldAnalyticsPageToggle();
    CroaklePatchSettingsRenderer();
    CroaklePatchPageNavigation();
    CroakleInjectRawDataSettings();
    CroakleApplyRawDataVisibility();
    CroakleBindRawDataSetting();
  }

  window.CroakleApplyRawDataVisibility = CroakleApplyRawDataVisibility;
  window.requestAnimationFrame(CroakleInitRawDataSetting);
})();

(() => {
  const StoreKey = "CroakleSessionBlocksV1";
  const PageName = "sessions";
  const WeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const ColorOptions = [
    "#f8d6f0", "#f07fd1", "#ff0a68", "#9578f4", "#4a0088",
    "#4151ff", "#60a3ff", "#19d8dc", "#78f28a", "#b8d2b4",
    "#007019", "#e9ffc4", "#ffc978", "#ca6a00", "#ff6262",
  ];
  const StartHour = 0;
  const EndHour = 24;
  const MinuteHeight = 0.48;

  function parseJson(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function getState() {
    const saved = parseJson(localStorage.getItem(StoreKey), {});
    return {
      weekOffset: Number(saved.weekOffset || 0),
      blocks: Array.isArray(saved.blocks) ? saved.blocks : [],
    };
  }

  function saveState(state) {
    localStorage.setItem(StoreKey, JSON.stringify(state));
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

  function parseDate(value) {
    if (typeof window.CroakleParseDate === "function") return window.CroakleParseDate(value);
    const [year, month, day] = String(value).split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function shiftDate(date, amount) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function getWeekDates() {
    const state = getState();
    const today = getToday();
    const monday = shiftDate(today, -((today.getDay() + 6) % 7) + state.weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
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

  function parseTime(value) {
    const [hour, minute] = String(value || "09:00").split(":").map(Number);
    return Math.max(StartHour * 60, Math.min(EndHour * 60 - 15, hour * 60 + minute));
  }

  function getWeekTitle(weekDates) {
    const first = weekDates[0];
    const last = weekDates[6];
    return `${first.toLocaleString("en", { month: "short" })} ${first.getDate()} - ${last.toLocaleString("en", { month: "short" })} ${last.getDate()}`;
  }

  function createStyles() {
    if (document.querySelector("#CroakleSessionBlocksStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSessionBlocksStyles";
    style.textContent = `
      body.CroakleSessionsActive,
      body.CroakleSessionsActive .CroakleHabitMoodShell {
        background: #ffffff !important;
      }

      body.CroakleSessionsActive .CroakleBottomNav {
        background: #ffffff !important;
      }

      .CroakleBottomNav {
        display: grid !important;
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        grid-auto-flow: row !important;
        grid-auto-columns: auto !important;
        gap: 6px !important;
        overflow: hidden !important;
      }

      .CroakleBottomNav button {
        min-width: 0 !important;
        min-height: 32px !important;
        padding: 0 4px !important;
        font-size: 12px !important;
        white-space: nowrap;
      }

      .CroakleSessionCard {
        gap: 10px;
        padding: 12px;
        background: #ffffff;
      }

      .CroakleSessionSubhead {
        margin: -4px 0 0;
        color: var(--CroakleMuted, #666666);
        font-size: 13px;
        font-weight: 750;
      }

      .CroakleSessionWeekHead {
        display: grid;
        grid-template-columns: 48px repeat(7, minmax(54px, 1fr));
        gap: 6px;
        min-width: 470px;
      }

      .CroakleSessionDayHead {
        min-height: 50px;
        border: 0;
        border-radius: 16px;
        background: var(--CroakleSoftSurface, #f5f5f5);
        color: var(--CroakleInk, #111111);
        display: grid;
        place-items: center;
        font: inherit;
        font-weight: 900;
        line-height: 1.05;
      }

      .CroakleSessionDayHead strong {
        display: block;
        font-size: 16px;
      }

      .CroakleSessionDayHead span {
        display: block;
        color: var(--CroakleMuted, #666666);
        font-size: 10px;
      }

      .CroakleSessionGridScroll {
        min-height: 0;
        flex: 1 1 auto;
        overflow: auto;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 20px;
        background: #8ec5f0;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .CroakleSessionGridScroll::-webkit-scrollbar {
        display: none;
      }

      .CroakleSessionGrid {
        position: relative;
        display: grid;
        grid-template-columns: 48px repeat(7, minmax(54px, 1fr));
        min-width: 470px;
        min-height: ${((EndHour - StartHour) * 60 * MinuteHeight) + 2}px;
      }

      .CroakleSessionTimeCell {
        height: ${60 * MinuteHeight}px;
        border-top: 1px solid rgba(17, 17, 17, 0.16);
        padding: 3px 4px 0 8px;
        color: #111111;
        font-size: 11px;
        font-weight: 900;
        line-height: 1;
      }

      .CroakleSessionColumn {
        position: relative;
        border-left: 2px dotted rgba(17, 17, 17, 0.14);
      }

      .CroakleSessionColumn::before {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          to bottom,
          transparent 0,
          transparent ${60 * MinuteHeight - 1}px,
          rgba(17, 17, 17, 0.16) ${60 * MinuteHeight - 1}px,
          rgba(17, 17, 17, 0.16) ${60 * MinuteHeight}px
        );
        pointer-events: none;
      }

      .CroakleSessionBlock {
        position: absolute;
        left: 5px;
        right: 5px;
        border: 2px solid #111111;
        border-radius: 18px;
        padding: 8px;
        color: #111111;
        display: grid;
        align-content: start;
        gap: 3px;
        overflow: hidden;
        box-shadow: none;
        font: inherit;
        text-align: left;
      }

      .CroakleSessionBlock strong {
        min-width: 0;
        font-size: 13px;
        font-weight: 950;
        line-height: 1.05;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .CroakleSessionBlock span {
        font-size: 11px;
        font-weight: 800;
        opacity: 0.74;
      }

      .CroakleSessionFab {
        min-height: 42px;
        padding: 0 16px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 999px;
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleInk, #111111);
        font-size: 15px;
        font-weight: 850;
      }

      .CroakleSessionFormGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .CroakleSessionColorGrid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 16px;
        overflow: hidden;
      }

      .CroakleSessionColorOption {
        min-height: 42px;
        border: 0;
        border-radius: 0;
      }

      .CroakleSessionColorOptionActive {
        outline: 3px solid var(--CroakleLine, #111111);
        outline-offset: -5px;
      }

      .CroakleSessionDeleteButton {
        min-height: 48px;
        border: 2px solid #ff3b30;
        border-radius: 999px;
        background: #ffffff;
        color: #ff3b30;
        font-size: 15px;
        font-weight: 900;
      }

      @media (max-width: 380px) {
        .CroakleSessionWeekHead,
        .CroakleSessionGrid {
          min-width: 440px;
          grid-template-columns: 44px repeat(7, minmax(50px, 1fr));
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createPage() {
    if (document.querySelector(`[data-page="${PageName}"]`)) return;

    const shell = document.querySelector(".CroakleHabitMoodShell");
    const footer = document.querySelector(".CroakleBottomNav");
    if (!shell || !footer) return;

    footer.insertAdjacentHTML("beforeend", `<button type="button" data-session-nav>Time</button>`);
    footer.querySelector("[data-page-target='notes']")?.setAttribute("title", "Notes");

    footer.insertAdjacentHTML("beforebegin", `
      <section class="CroaklePage" data-page="${PageName}">
        <article class="CroakleCard CroakleSessionCard" aria-label="Weekly session blocks">
          <div class="CroakleMonthHeader">
            <button type="button" data-session-week="previous" aria-label="Previous week">‹</button>
            <strong id="CroakleSessionWeekTitle">This week</strong>
            <button type="button" data-session-week="next" aria-label="Next week">›</button>
          </div>
          <p class="CroakleSessionSubhead">customize your session blocks in the weekly view.</p>
          <button class="CroakleSessionFab" type="button" data-session-add>+ Add session</button>
          <div class="CroakleSessionGridScroll">
            <div class="CroakleSessionWeekHead" id="CroakleSessionWeekHead"></div>
            <div class="CroakleSessionGrid" id="CroakleSessionGrid"></div>
          </div>
        </article>
      </section>
      <dialog class="CroakleAddHabitDialog" id="CroakleSessionDialog" aria-labelledby="CroakleSessionDialogTitle">
        <form class="CroakleAddHabitForm" id="CroakleSessionForm" method="dialog">
          <header class="CroakleAddHabitHeader">
            <h2 id="CroakleSessionDialogTitle">Session block</h2>
            <button type="button" data-session-close aria-label="Close">×</button>
          </header>
          <input type="hidden" name="id" />
          <input type="hidden" name="color" value="${ColorOptions[6]}" />
          <label class="CroakleField">
            <span>Subject</span>
            <input name="subject" type="text" placeholder="e.g., English shadowing" autocomplete="off" required />
          </label>
          <div class="CroakleSessionFormGrid">
            <label class="CroakleField">
              <span>Date</span>
              <input name="date" type="date" required />
            </label>
            <label class="CroakleField">
              <span>Start</span>
              <input name="start" type="time" min="00:00" max="23:45" step="900" required />
            </label>
            <label class="CroakleField">
              <span>Minutes</span>
              <input name="duration" type="number" min="15" max="240" step="15" inputmode="numeric" required />
            </label>
            <label class="CroakleField">
              <span>Type</span>
              <select name="type">
                <option value="focus">Focus</option>
                <option value="study">Study</option>
                <option value="workout">Workout</option>
                <option value="rest">Rest</option>
              </select>
            </label>
          </div>
          <div class="CroakleField">
            <span>Color tag</span>
            <div class="CroakleSessionColorGrid" data-session-colors>
              ${ColorOptions.map((color) => `<button class="CroakleSessionColorOption" type="button" data-session-color="${color}" style="background:${color}"></button>`).join("")}
            </div>
          </div>
          <button class="CroakleSessionDeleteButton" type="button" data-session-delete hidden>Delete</button>
          <button class="CroakleConfirmHabitButton" type="submit">Save</button>
        </form>
      </dialog>
    `);
  }

  function renderWeekHead(weekDates) {
    const head = document.querySelector("#CroakleSessionWeekHead");
    if (!head) return;

    head.innerHTML = `<span></span>` + weekDates.map((date, index) => `
      <button class="CroakleSessionDayHead" type="button" data-session-add-date="${formatDate(date)}">
        <strong>+</strong><span>${WeekDays[index]} ${date.getDate()}</span>
      </button>
    `).join("");
  }

  function createTimeCells() {
    return Array.from({ length: EndHour - StartHour }, (_, index) => {
      const hour = StartHour + index;
      return `<div class="CroakleSessionTimeCell" style="grid-column:1;grid-row:${index + 1};">${formatHourLabel(hour)}</div>`;
    }).join("");
  }

  function createColumns(weekDates) {
    return weekDates.map((date, index) => `
      <div class="CroakleSessionColumn" data-session-date="${formatDate(date)}" style="grid-column:${index + 2};grid-row:1/${EndHour - StartHour + 1};"></div>
    `).join("");
  }

  function getBlockStyle(block) {
    const start = Math.max(StartHour * 60, Number(block.startMinute || StartHour * 60));
    const duration = Math.max(15, Number(block.duration || 60));
    const top = (start - StartHour * 60) * MinuteHeight;
    const height = Math.max(30, duration * MinuteHeight);
    return `top:${top}px;height:${height}px;background:${block.color || ColorOptions[6]};`;
  }

  function renderBlocks(weekDates) {
    const state = getState();
    const grid = document.querySelector("#CroakleSessionGrid");
    if (!grid) return;

    grid.innerHTML = createTimeCells() + createColumns(weekDates);

    weekDates.forEach((date) => {
      const dateIso = formatDate(date);
      const column = grid.querySelector(`[data-session-date="${dateIso}"]`);
      const blocks = state.blocks
        .filter((block) => block.date === dateIso)
        .sort((a, b) => Number(a.startMinute) - Number(b.startMinute));

      column?.insertAdjacentHTML("beforeend", blocks.map((block) => `
        <button class="CroakleSessionBlock" type="button" data-session-edit="${block.id}" style="${getBlockStyle(block)}">
          <strong>${escapeText(block.subject || "Session")}</strong>
          <span>${formatTime(block.startMinute)} · ${Number(block.duration || 60)}m</span>
        </button>
      `).join(""));
    });
  }

  function renderSessions() {
    const weekDates = getWeekDates();
    const title = document.querySelector("#CroakleSessionWeekTitle");
    if (title) title.textContent = getWeekTitle(weekDates);
    renderWeekHead(weekDates);
    renderBlocks(weekDates);
  }

  function setSessionsActive(active) {
    document.body.classList.toggle("CroakleSessionsActive", active);
  }

  function setPage(pageName) {
    document.querySelectorAll("[data-page]").forEach((page) => {
      page.classList.toggle("CroaklePageActive", page.dataset.page === pageName);
    });

    document.querySelectorAll("[data-page-target], [data-session-nav]").forEach((button) => {
      const target = button.dataset.pageTarget || (button.dataset.sessionNav !== undefined ? PageName : "");
      button.classList.toggle("CroakleActiveNav", target === pageName);
    });

    const bottomNav = document.querySelector(".CroakleBottomNav");
    if (bottomNav) bottomNav.hidden = pageName === "menu";

    setSessionsActive(pageName === PageName);
    if (pageName === PageName) renderSessions();
  }

  function patchNavigation() {
    if (window.CroakleSessionNavigationPatched || typeof window.CroakleSetPage !== "function") return;

    window.CroakleSessionNavigationPatched = true;
    const originalSetPage = window.CroakleSetPage;

    window.CroakleSetPage = function CroakleSetPageWithSessions(pageName) {
      if (pageName === PageName) {
        setPage(PageName);
        return undefined;
      }

      document.querySelector(`[data-page="${PageName}"]`)?.classList.remove("CroaklePageActive");
      setSessionsActive(false);
      const result = originalSetPage.apply(this, arguments);
      document.querySelector("[data-session-nav]")?.classList.remove("CroakleActiveNav");
      return result;
    };
  }

  function openDialog(block = null, dateIso = "") {
    const dialog = document.querySelector("#CroakleSessionDialog");
    const form = document.querySelector("#CroakleSessionForm");
    if (!dialog || !form) return;

    const weekDates = getWeekDates();
    const fallbackDate = dateIso || formatDate(weekDates[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
    const nextColor = block?.color || ColorOptions[6];

    form.reset();
    form.elements.id.value = block?.id || "";
    form.elements.subject.value = block?.subject || "";
    form.elements.date.value = block?.date || fallbackDate;
    form.elements.start.value = formatTime(block?.startMinute || 9 * 60);
    form.elements.duration.value = String(block?.duration || 60);
    form.elements.type.value = block?.type || "focus";
    form.elements.color.value = nextColor;
    form.querySelector("[data-session-delete]").hidden = !block;
    syncColorOptions(form);
    dialog.showModal();
    form.elements.subject.focus();
  }

  function syncColorOptions(form) {
    const selectedColor = form.elements.color.value;
    form.querySelectorAll("[data-session-color]").forEach((button) => {
      button.classList.toggle("CroakleSessionColorOptionActive", button.dataset.sessionColor === selectedColor);
    });
  }

  function saveFromForm(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const state = getState();
    const id = form.elements.id.value || `CroakleSession${Date.now()}`;
    const nextBlock = {
      id,
      subject: String(form.elements.subject.value || "Session").trim(),
      date: form.elements.date.value,
      startMinute: parseTime(form.elements.start.value),
      duration: Math.max(15, Math.min(240, Number(form.elements.duration.value || 60))),
      type: form.elements.type.value || "focus",
      color: form.elements.color.value || ColorOptions[6],
    };

    if (!nextBlock.subject || !nextBlock.date) return;

    state.blocks = state.blocks.filter((block) => block.id !== id).concat(nextBlock);
    saveState(state);
    document.querySelector("#CroakleSessionDialog")?.close();
    renderSessions();
  }

  function deleteCurrentBlock() {
    const form = document.querySelector("#CroakleSessionForm");
    const id = form?.elements.id.value;
    if (!id) return;

    const state = getState();
    state.blocks = state.blocks.filter((block) => block.id !== id);
    saveState(state);
    document.querySelector("#CroakleSessionDialog")?.close();
    renderSessions();
  }

  function shiftWeek(direction) {
    const state = getState();
    state.weekOffset += direction;
    saveState(state);
    renderSessions();
  }

  function bindSessions() {
    if (window.CroakleSessionBlocksBound) return;
    window.CroakleSessionBlocksBound = true;

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-session-nav]")) {
        event.preventDefault();
        if (typeof window.CroakleSetPage === "function") window.CroakleSetPage(PageName);
        return;
      }

      const weekButton = event.target.closest("[data-session-week]");
      if (weekButton) {
        event.preventDefault();
        shiftWeek(weekButton.dataset.sessionWeek === "next" ? 1 : -1);
        return;
      }

      const addDateButton = event.target.closest("[data-session-add-date]");
      if (addDateButton) {
        event.preventDefault();
        openDialog(null, addDateButton.dataset.sessionAddDate);
        return;
      }

      if (event.target.closest("[data-session-add]")) {
        event.preventDefault();
        openDialog();
        return;
      }

      const editButton = event.target.closest("[data-session-edit]");
      if (editButton) {
        event.preventDefault();
        const block = getState().blocks.find((item) => item.id === editButton.dataset.sessionEdit);
        openDialog(block || null);
        return;
      }

      const colorButton = event.target.closest("[data-session-color]");
      if (colorButton) {
        event.preventDefault();
        const form = document.querySelector("#CroakleSessionForm");
        if (!form) return;
        form.elements.color.value = colorButton.dataset.sessionColor;
        syncColorOptions(form);
        return;
      }

      if (event.target.closest("[data-session-delete]")) {
        event.preventDefault();
        deleteCurrentBlock();
        return;
      }

      if (event.target.closest("[data-session-close]")) {
        event.preventDefault();
        document.querySelector("#CroakleSessionDialog")?.close();
      }
    });

    document.addEventListener("submit", (event) => {
      if (event.target.matches("#CroakleSessionForm")) saveFromForm(event);
    });
  }

  function init() {
    createStyles();
    createPage();
    patchNavigation();
    bindSessions();
    renderSessions();
  }

  window.requestAnimationFrame(init);
})();
