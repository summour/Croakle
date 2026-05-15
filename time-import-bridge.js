(() => {
  const SessionKey = "CroakleSessionBlocksV1";
  const RequiredColumns = ["date", "start_time", "end_time", "title"];
  const TypeColors = {
    law: "#9578f4",
    ram: "#9578f4",
    gov: "#60a3ff",
    exam: "#60a3ff",
    english: "#78f28a",
    health: "#ff6262",
    workout: "#ff6262",
    rest: "#b8d2b4",
    focus: "#ffc978",
    study: "#78f28a",
  };

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

  function slug(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9ก-๙]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function readState() {
    const saved = parseJson(localStorage.getItem(SessionKey), {});
    return {
      ...saved,
      weekOffset: Number(saved.weekOffset || 0),
      blocks: Array.isArray(saved.blocks) ? saved.blocks : [],
      startHour: Number.isFinite(Number(saved.startHour)) ? Number(saved.startHour) : 0,
      endHour: Number.isFinite(Number(saved.endHour)) ? Number(saved.endHour) : 24,
    };
  }

  function saveState(state) {
    localStorage.setItem(SessionKey, JSON.stringify(state));
    window.CroakleRenderSessionRange?.();
  }

  function normalizeHeader(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/-/g, "_");
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const nextChar = text[index + 1];

      if (char === '"' && quoted && nextChar === '"') {
        cell += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        quoted = !quoted;
        continue;
      }

      if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
        continue;
      }

      if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && nextChar === "\n") index += 1;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
        continue;
      }

      cell += char;
    }

    row.push(cell);
    rows.push(row);
    return rows.filter((item) => item.some((value) => String(value).trim()));
  }

  function rowsToObjects(rows) {
    const headers = (rows[0] || []).map(normalizeHeader);
    return rows.slice(1).map((row) => {
      return headers.reduce((item, header, index) => {
        item[header] = String(row[index] || "").trim();
        return item;
      }, {});
    });
  }

  function parseTimeToMinute(value) {
    const match = String(value || "").trim().match(/^(\d{1,2})(?::(\d{1,2}))?$/);
    if (!match) return null;

    const hour = Number(match[1]);
    const minute = Number(match[2] || 0);
    if (hour < 0 || hour > 24 || minute < 0 || minute > 59) return null;
    if (hour === 24 && minute > 0) return null;
    return Math.min(1439, hour * 60 + minute);
  }

  function parseDurationMinutes(row, startMinute, endMinute) {
    const hours = Number(row.duration_hours || row.hours || "");
    if (Number.isFinite(hours) && hours > 0) {
      return Math.max(15, Math.round(hours * 60));
    }

    if (endMinute !== null && endMinute > startMinute) {
      return Math.max(15, endMinute - startMinute);
    }

    return 60;
  }

  function getColor(type) {
    const normalizedType = String(type || "").toLowerCase();
    const key = Object.keys(TypeColors).find((item) => normalizedType.includes(item));
    return key ? TypeColors[key] : "#60a3ff";
  }

  function createStableId(row) {
    const end = row.end_time || "";
    const title = row.title || row.subject || "Session";
    return `import:${slug(row.date)}:${slug(row.start_time)}:${slug(end)}:${slug(title)}`;
  }

  function normalizeBlock(row) {
    const date = String(row.date || "").trim();
    const startMinute = parseTimeToMinute(row.start_time || row.start || "");
    const endMinute = parseTimeToMinute(row.end_time || row.end || "");
    const title = String(row.title || row.subject || "").trim();

    if (!date || startMinute === null || !title) return null;

    const type = String(row.type || "focus").trim() || "focus";
    const note = String(row.note || "").trim();
    const status = String(row.status || "Planned").trim() || "Planned";

    return {
      id: createStableId({ ...row, title }),
      subject: title,
      date,
      startMinute,
      duration: parseDurationMinutes(row, startMinute, endMinute),
      type,
      color: getColor(type),
      note,
      status,
      sourceType: "import",
      sourceId: createStableId({ ...row, title }),
      sourceName: title,
      importedAt: Date.now(),
    };
  }

  function validateColumns(rows) {
    const headers = (rows[0] || []).map(normalizeHeader);
    return RequiredColumns.filter((column) => !headers.includes(column));
  }

  function summarizeImport(blocks) {
    const state = readState();
    const existingIds = new Set(state.blocks.map((block) => block.id));
    const duplicateCount = blocks.filter((block) => existingIds.has(block.id)).length;
    const newCount = blocks.length - duplicateCount;
    const firstDate = blocks[0]?.date || "-";
    const lastDate = blocks[blocks.length - 1]?.date || "-";
    return { duplicateCount, firstDate, lastDate, newCount, total: blocks.length };
  }

  function setStatus(message, tone = "") {
    const status = document.querySelector("[data-time-import-status]");
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  }

  function renderPreview(blocks) {
    const preview = document.querySelector("[data-time-import-preview]");
    const confirm = document.querySelector("[data-time-import-confirm]");
    if (!preview || !confirm) return;

    if (!blocks.length) {
      preview.innerHTML = "";
      confirm.disabled = true;
      setStatus("ไม่พบรายการเวลาที่นำเข้าได้", "error");
      return;
    }

    const summary = summarizeImport(blocks);
    preview.innerHTML = `
      <div class="CroakleTimeImportSummary">
        <strong>${summary.total} blocks</strong>
        <span>ใหม่ ${summary.newCount} · ซ้ำ ${summary.duplicateCount}</span>
        <span>${escapeText(summary.firstDate)} → ${escapeText(summary.lastDate)}</span>
      </div>
      <div class="CroakleTimeImportList">
        ${blocks.slice(0, 6).map((block) => `
          <div class="CroakleTimeImportItem">
            <strong>${escapeText(block.subject)}</strong>
            <span>${escapeText(block.date)} · ${Math.floor(block.startMinute / 60).toString().padStart(2, "0")}:${String(block.startMinute % 60).padStart(2, "0")} · ${block.duration}m</span>
          </div>
        `).join("")}
      </div>
    `;
    confirm.disabled = summary.newCount <= 0;
    setStatus("ตรวจไฟล์แล้ว กด Import เพื่อบันทึกลง Time", "ready");
  }

  function mergeBlocks(blocks) {
    const state = readState();
    const existingIds = new Set(state.blocks.map((block) => block.id));
    const incoming = blocks.filter((block) => !existingIds.has(block.id));

    saveState({
      ...state,
      blocks: state.blocks.concat(incoming),
    });

    return { imported: incoming.length, skipped: blocks.length - incoming.length };
  }

  function injectStyles() {
    if (document.querySelector("#CroakleTimeImportStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleTimeImportStyles";
    style.textContent = `
      .CroakleSessionToolbar {
        grid-template-columns: 1fr auto auto;
      }

      .CroakleTimeImportButton {
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

      .CroakleTimeImportButton:active {
        background: #f2f2f2;
      }

      .CroakleTimeImportHelp,
      .CroakleTimeImportStatus {
        color: var(--CroakleMuted, #666666);
        font-size: 12px;
        font-weight: 750;
        line-height: 1.35;
      }

      .CroakleTimeImportStatus[data-tone="error"] {
        color: #d70015;
      }

      .CroakleTimeImportStatus[data-tone="ready"] {
        color: #007019;
      }

      .CroakleTimeImportSummary,
      .CroakleTimeImportItem {
        display: grid;
        gap: 4px;
        padding: 10px 12px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 16px;
        background: #ffffff;
      }

      .CroakleTimeImportSummary span,
      .CroakleTimeImportItem span {
        color: var(--CroakleMuted, #666666);
        font-size: 12px;
        font-weight: 800;
      }

      .CroakleTimeImportList {
        display: grid;
        gap: 8px;
        max-height: 230px;
        overflow: auto;
      }

      .CroakleTimeImportActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .CroakleTimeImportGhostButton {
        min-height: 48px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 999px;
        background: #ffffff;
        color: var(--CroakleInk, #111111);
        font: inherit;
        font-size: 15px;
        font-weight: 900;
      }

      @media (max-width: 380px) {
        .CroakleSessionToolbar {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureButton() {
    const toolbar = document.querySelector("[data-session-toolbar]");
    if (!toolbar || toolbar.querySelector("[data-time-import-open]")) return;

    toolbar.insertAdjacentHTML("beforeend", `
      <button class="CroakleTimeImportButton" type="button" data-time-import-open>Import</button>
    `);
  }

  function ensureDialog() {
    if (document.querySelector("#CroakleTimeImportDialog")) return;

    document.querySelector(".CroakleHabitMoodShell")?.insertAdjacentHTML("beforeend", `
      <dialog class="CroakleAddHabitDialog" id="CroakleTimeImportDialog" aria-labelledby="CroakleTimeImportTitle">
        <div class="CroakleAddHabitForm">
          <header class="CroakleAddHabitHeader">
            <h2 id="CroakleTimeImportTitle">Import Time</h2>
            <button type="button" data-time-import-close aria-label="Close">×</button>
          </header>
          <p class="CroakleTimeImportHelp">รองรับ CSV จากชีท Croakle Time Blocks: date, start_time, end_time, duration_hours, type, title, note, status</p>
          <label class="CroakleField">
            <span>CSV file</span>
            <input type="file" accept=".csv,text/csv" data-time-import-file />
          </label>
          <div class="CroakleTimeImportStatus" data-time-import-status>เลือกไฟล์ CSV เพื่อ preview ก่อนบันทึก</div>
          <div data-time-import-preview></div>
          <div class="CroakleTimeImportActions">
            <button class="CroakleTimeImportGhostButton" type="button" data-time-import-close>Cancel</button>
            <button class="CroakleConfirmHabitButton" type="button" data-time-import-confirm disabled>Import</button>
          </div>
        </div>
      </dialog>
    `);
  }

  function getPendingBlocks() {
    return window.CroaklePendingTimeImportBlocks || [];
  }

  function setPendingBlocks(blocks) {
    window.CroaklePendingTimeImportBlocks = blocks;
  }

  async function handleFile(file) {
    if (!file) return;

    const text = await file.text();
    const rows = parseCsv(text.replace(/^\uFEFF/, ""));
    const missing = validateColumns(rows);

    if (missing.length) {
      setPendingBlocks([]);
      renderPreview([]);
      setStatus(`ไฟล์ขาดคอลัมน์: ${missing.join(", ")}`, "error");
      return;
    }

    const blocks = rowsToObjects(rows).map(normalizeBlock).filter(Boolean);
    setPendingBlocks(blocks);
    renderPreview(blocks);
  }

  function openDialog() {
    ensureDialog();
    setPendingBlocks([]);
    document.querySelector("[data-time-import-preview]").innerHTML = "";
    document.querySelector("[data-time-import-confirm]").disabled = true;
    setStatus("เลือกไฟล์ CSV เพื่อ preview ก่อนบันทึก");
    document.querySelector("#CroakleTimeImportDialog")?.showModal();
  }

  function confirmImport() {
    const blocks = getPendingBlocks();
    if (!blocks.length) return;

    const result = mergeBlocks(blocks);
    setPendingBlocks([]);
    setStatus(`Import แล้ว ${result.imported} รายการ · ข้ามซ้ำ ${result.skipped} รายการ`, "ready");
    document.querySelector("[data-time-import-confirm]").disabled = true;
  }

  function bindEvents() {
    if (window.CroakleTimeImportEventsBound) return;
    window.CroakleTimeImportEventsBound = true;

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-time-import-open]")) {
        event.preventDefault();
        openDialog();
        return;
      }

      if (event.target.closest("[data-time-import-close]")) {
        event.preventDefault();
        document.querySelector("#CroakleTimeImportDialog")?.close();
        return;
      }

      if (event.target.closest("[data-time-import-confirm]")) {
        event.preventDefault();
        confirmImport();
      }
    }, true);

    document.addEventListener("change", (event) => {
      const input = event.target.closest?.("[data-time-import-file]");
      if (!input) return;
      handleFile(input.files?.[0]);
    });
  }

  function patchNavigation() {
    if (window.CroakleTimeImportNavigationPatched || typeof window.CroakleSetPage !== "function") return;
    window.CroakleTimeImportNavigationPatched = true;

    const originalSetPage = window.CroakleSetPage;
    window.CroakleSetPage = function CroakleSetPageWithTimeImport(pageName) {
      const result = originalSetPage.apply(this, arguments);
      if (pageName === "sessions") {
        window.requestAnimationFrame(ensureButton);
        window.setTimeout(ensureButton, 80);
      }
      return result;
    };
  }

  function init() {
    injectStyles();
    ensureDialog();
    ensureButton();
    bindEvents();
    patchNavigation();
  }

  window.requestAnimationFrame(init);
  window.setTimeout(init, 120);
})();
