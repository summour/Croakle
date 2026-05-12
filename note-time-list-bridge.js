(() => {
  const SessionKey = "CroakleSessionBlocksV1";
  const DraftKey = "CroakleNoteTimeReturnDraftV1";

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

  function getForm() {
    return document.querySelector("#CroakleNotesLiteForm");
  }

  function getDialog() {
    return document.querySelector("#CroakleNotesLiteDialog");
  }

  function getSessionState() {
    const state = parseJson(localStorage.getItem(SessionKey), {});
    return Array.isArray(state.blocks) ? state.blocks : [];
  }

  function formatMinute(value) {
    const minutes = Math.max(0, Math.min(24 * 60, Number(value || 0)));
    const hour = Math.floor(minutes / 60);
    const minute = String(minutes % 60).padStart(2, "0");
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  function readDraftFromForm() {
    const form = getForm();
    if (!form) return null;

    return {
      type: form.elements.type?.value || "",
      itemId: form.elements.itemId?.value || "",
      itemName: form.elements.itemName?.value || "",
      dateIso: form.elements.dateIso?.value || "",
      note: form.elements.note?.value || "",
    };
  }

  function isUsableDraft(draft) {
    return Boolean(draft?.type && draft?.itemId && draft?.dateIso);
  }

  function saveDraft() {
    const draft = readDraftFromForm();
    if (!isUsableDraft(draft)) return;
    localStorage.setItem(DraftKey, JSON.stringify(draft));
  }

  function getDraft() {
    return parseJson(localStorage.getItem(DraftKey), null);
  }

  function clearDraft() {
    localStorage.removeItem(DraftKey);
  }

  function getLinkedBlocks(draft) {
    if (!isUsableDraft(draft)) return [];

    return getSessionState()
      .filter((block) => block.sourceType === draft.type)
      .filter((block) => block.sourceId === draft.itemId)
      .filter((block) => block.date === draft.dateIso)
      .sort((first, second) => Number(first.startMinute || 0) - Number(second.startMinute || 0));
  }

  function createListMarkup(draft) {
    const blocks = getLinkedBlocks(draft);

    if (!blocks.length) {
      return `<div class="CroakleNoteTimeEmpty">ยังไม่มีเวลาที่แอดไว้</div>`;
    }

    return `
      <div class="CroakleNoteTimeList" aria-label="Added times">
        ${blocks.map((block) => {
          const start = Number(block.startMinute || 0);
          const duration = Math.max(15, Number(block.duration || 60));
          const end = Math.min(24 * 60, start + duration);
          return `
            <span class="CroakleNoteTimePill">
              <strong>${formatMinute(start)}-${formatMinute(end)}</strong>
              <em>${duration}m</em>
            </span>
          `;
        }).join("")}
      </div>
    `;
  }

  function injectStyles() {
    if (document.querySelector("#CroakleNoteTimeListStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleNoteTimeListStyles";
    style.textContent = `
      .CroakleNoteTimeEmpty {
        color: #777777;
        font-size: 13px;
        font-weight: 850;
      }

      .CroakleNoteTimeList {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .CroakleNoteTimePill {
        min-height: 34px;
        border: 2px solid #111111;
        border-radius: 999px;
        background: #f5f5f5;
        color: #111111;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        font-size: 13px;
        font-weight: 950;
      }

      .CroakleNoteTimePill em {
        color: #666666;
        font-size: 12px;
        font-style: normal;
        font-weight: 900;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureSection(draft = readDraftFromForm()) {
    const form = getForm();
    if (!form || !isUsableDraft(draft)) return;

    let section = form.querySelector("#CroakleNoteTimeSection");
    const anchor = form.querySelector(".CroakleField");

    if (!section && anchor) {
      anchor.insertAdjacentHTML("beforebegin", `
        <section class="CroakleNoteTimeSection" id="CroakleNoteTimeSection" aria-label="Time link">
          <div class="CroakleNoteTimeHeader">
            <strong>Time</strong>
            <span>ผู้กดเวลาของโน้ตวันนี้</span>
          </div>
          <button class="CroakleNoteTimeButton" id="CroakleNoteAddTimeButton" type="button">Add time</button>
          <div data-note-time-list></div>
        </section>
      `);
      section = form.querySelector("#CroakleNoteTimeSection");
    }

    if (!section) return;

    const blocks = getLinkedBlocks(draft);
    const headerText = section.querySelector(".CroakleNoteTimeHeader span");
    const listHost = section.querySelector("[data-note-time-list]") || section;

    if (headerText) {
      headerText.textContent = blocks.length ? `${blocks.length} time block${blocks.length > 1 ? "s" : ""}` : "ผู้กดเวลาของโน้ตวันนี้";
    }

    listHost.innerHTML = createListMarkup(draft);
  }

  function reopenNoteAfterSessionSave() {
    const draft = getDraft();
    const form = getForm();
    const dialog = getDialog();
    if (!isUsableDraft(draft) || !form || !dialog) return;

    form.elements.type.value = draft.type;
    form.elements.itemId.value = draft.itemId;
    form.elements.itemName.value = draft.itemName;
    form.elements.dateIso.value = draft.dateIso;
    form.elements.note.value = draft.note || form.elements.note.value || "";

    if (!dialog.open) dialog.showModal();

    ensureSection(draft);
    clearDraft();
  }

  function patchStorage() {
    if (window.CroakleNoteTimeListStoragePatched) return;
    window.CroakleNoteTimeListStoragePatched = true;

    const previousSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function setItemWithNoteTimeList(key, value) {
      previousSetItem(key, value);
      if (key !== SessionKey) return;
      window.requestAnimationFrame(() => {
        reopenNoteAfterSessionSave();
        ensureSection();
      });
    };
  }

  function bind() {
    if (window.CroakleNoteTimeListBound) return;
    window.CroakleNoteTimeListBound = true;

    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest?.("#CroakleNoteAddTimeButton")) return;
      saveDraft();
    }, true);

    document.addEventListener("click", (event) => {
      if (event.target.closest?.("[data-croakle-note-type]")) {
        window.requestAnimationFrame(() => ensureSection());
        window.setTimeout(() => ensureSection(), 120);
        return;
      }

      if (event.target.closest?.("#CroakleNoteAddTimeButton")) {
        saveDraft();
      }
    }, true);
  }

  function init() {
    injectStyles();
    patchStorage();
    bind();
    ensureSection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
