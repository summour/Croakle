(() => {
  const SessionKey = "CroakleSessionBlocksV1";
  const SourceDraftKey = "CroaklePendingSessionSourceV1";
  const HabitKey = "CroakleHabitMoodDataCleanV1";
  const ProjectKey = "CroakleProjectDataV1";

  let CroaklePendingNoteTimeSource = null;

  function parseJson(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function formatDate(date) {
    if (typeof window.CroakleFormatDate === "function") return window.CroakleFormatDate(date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function getTodayIso() {
    if (typeof window.CroakleGetToday === "function") return formatDate(window.CroakleGetToday());
    const today = new Date();
    return formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  }

  function getProjectDateFromUi() {
    return document.querySelector("#CroakleProjectDates [data-current-date='true']")?.dataset.dateIso || getTodayIso();
  }

  function getHabitNameById(itemId) {
    const state = parseJson(localStorage.getItem(HabitKey), {});
    const habits = Array.isArray(state.habitTemplates) ? state.habitTemplates : [];
    const match = habits.find((habit, index) => (habit.id || `habit-${index}`) === itemId);
    return String(match?.name || "").trim();
  }

  function getProjectNameById(itemId) {
    const state = parseJson(localStorage.getItem(ProjectKey), {});
    const projects = Array.isArray(state.projects) ? state.projects : [];
    const match = projects.find((project, index) => (project.id || `project-${index}`) === itemId);
    return String(match?.name || "").trim();
  }

  function getSourceNameFromNoteButton(button, sourceType, sourceId) {
    const datasetName = button.dataset.croakleNoteItemLabel
      || button.dataset.croakleNoteTitle
      || button.dataset.croakleNoteName;

    if (datasetName) return String(datasetName).trim();
    if (sourceType === "habit") return getHabitNameById(sourceId) || "Habit";
    if (sourceType === "project") return getProjectNameById(sourceId) || "Project";
    return "Session";
  }

  function getSourceDateFromNoteButton(button, sourceType) {
    if (button.dataset.croakleNoteDate) return button.dataset.croakleNoteDate;
    if (sourceType === "project") return getProjectDateFromUi();
    const habitState = parseJson(localStorage.getItem(HabitKey), {});
    return habitState.trackDate || getTodayIso();
  }

  function buildSourceFromNoteButton(button) {
    const sourceType = String(button.dataset.croakleNoteType || "").toLowerCase();
    if (sourceType !== "habit" && sourceType !== "project") return null;

    const sourceId = button.dataset.croakleNoteItemId || `${sourceType}:${Date.now()}`;
    const sourceName = getSourceNameFromNoteButton(button, sourceType, sourceId);

    return {
      sourceType,
      sourceId,
      sourceName,
      subject: sourceName,
      type: sourceType === "project" ? "focus" : "study",
      date: getSourceDateFromNoteButton(button, sourceType),
    };
  }

  function isLockedSessionSource(sourceType) {
    return sourceType === "habit" || sourceType === "project";
  }

  function applySessionSubjectLock(form, sourceType, sourceName) {
    const subjectInput = form?.elements?.subject;
    if (!subjectInput) return;

    const isLocked = isLockedSessionSource(sourceType);
    subjectInput.readOnly = isLocked;
    subjectInput.classList.toggle("CroakleLockedField", isLocked);
    subjectInput.setAttribute("aria-readonly", isLocked ? "true" : "false");

    if (isLocked && sourceName) {
      subjectInput.value = sourceName;
    }
  }

  function ensureSourceFields(form) {
    ["sourceType", "sourceId", "sourceName"].forEach((name) => {
      if (form.elements[name]) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    });
  }

  function savePendingSource(source) {
    localStorage.setItem(SourceDraftKey, JSON.stringify(source));
  }

  function getPendingSource() {
    return parseJson(localStorage.getItem(SourceDraftKey), null);
  }

  function clearPendingSource() {
    localStorage.removeItem(SourceDraftKey);
  }

  function setFormValue(form, name, value) {
    if (!form.elements[name]) return;
    form.elements[name].value = value;
  }

  function openSessionDialogWithSource(source) {
    const dialog = document.querySelector("#CroakleSessionDialog");
    const form = document.querySelector("#CroakleSessionForm");
    if (!dialog || !form || !source) return false;

    const sessionId = `CroakleSession${Date.now()}`;
    const payload = { ...source, id: sessionId };
    const color = source.sourceType === "project" ? "#ffc978" : "#78f28a";

    ensureSourceFields(form);
    savePendingSource(payload);
    form.reset();

    setFormValue(form, "id", sessionId);
    setFormValue(form, "subject", source.subject || source.sourceName || "Session");
    setFormValue(form, "date", source.date || getTodayIso());
    setFormValue(form, "start", "09:00");
    setFormValue(form, "duration", "60");
    setFormValue(form, "type", source.type || "focus");
    setFormValue(form, "color", color);
    setFormValue(form, "sourceType", source.sourceType || "manual");
    setFormValue(form, "sourceId", source.sourceId || sessionId);
    setFormValue(form, "sourceName", source.sourceName || source.subject || "Session");
    applySessionSubjectLock(form, source.sourceType, source.sourceName || source.subject);

    form.querySelector("[data-session-delete]")?.setAttribute("hidden", "");
    form.querySelectorAll("[data-session-color]").forEach((button) => {
      button.classList.toggle("CroakleSessionColorOptionActive", button.dataset.sessionColor === color);
    });

    dialog.showModal();
    window.requestAnimationFrame(() => form.elements.start?.focus());
    return true;
  }

  function patchSessionBlock(state, pending) {
    if (!Array.isArray(state.blocks)) return state;

    state.blocks = state.blocks.map((block) => {
      if (block.id !== pending.id) return normalizeLinkedSubject(block);
      return normalizeLinkedSubject({
        ...block,
        sourceType: pending.sourceType,
        sourceId: pending.sourceId,
        sourceName: pending.sourceName,
      });
    });

    return state;
  }

  function normalizeLinkedSubject(block) {
    if (!isLockedSessionSource(block?.sourceType)) return block;
    return {
      ...block,
      subject: block.sourceName || block.subject || "Session",
    };
  }

  function normalizeLinkedSubjectsInState(state) {
    if (!Array.isArray(state.blocks)) return state;
    state.blocks = state.blocks.map(normalizeLinkedSubject);
    return state;
  }

  function installSessionSourcePatch() {
    if (window.CroakleSourceTimeStoragePatched) return;
    window.CroakleSourceTimeStoragePatched = true;

    const nativeSetItem = localStorage.setItem.bind(localStorage);
    try {
      localStorage.setItem = function setItemWithSessionSource(key, value) {
        if (key !== SessionKey) {
          nativeSetItem(key, value);
          return;
        }

        const pending = getPendingSource();
        const state = pending
          ? patchSessionBlock(parseJson(value, {}), pending)
          : normalizeLinkedSubjectsInState(parseJson(value, {}));

        nativeSetItem(key, JSON.stringify(state));
        if (pending) clearPendingSource();
      };
    } catch {
      window.CroakleSourceTimeStoragePatched = false;
    }
  }

  function injectStyles() {
    if (document.querySelector("#CroakleSourceTimeStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSourceTimeStyles";
    style.textContent = `
      #CroakleHabitAddTimeButton,
      #CroakleProjectAddTimeButton {
        display: none !important;
      }

      .CroakleLockedField {
        background: #f3f3f3 !important;
        color: #666666 !important;
        cursor: not-allowed !important;
      }

      .CroakleNoteTimeSection {
        display: grid;
        gap: 10px;
        padding: 0 0 12px;
        margin-bottom: 12px;
        border-bottom: 2px solid #111111;
      }

      .CroakleNoteTimeHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .CroakleNoteTimeHeader strong {
        color: #111111;
        font-size: 15px;
        font-weight: 950;
      }

      .CroakleNoteTimeHeader span {
        color: #666666;
        font-size: 12px;
        font-weight: 850;
      }

      .CroakleNoteTimeButton {
        width: 100%;
        min-height: 44px;
        border: 2px solid #111111;
        border-radius: 999px;
        background: #ffffff;
        color: #111111;
        font: inherit;
        font-size: 15px;
        font-weight: 900;
      }

      .CroakleNoteTimeButton:active {
        background: #f2f2f2;
      }
    `;
    document.head.appendChild(style);
  }

  function getNotesForm() {
    return document.querySelector("#CroakleNotesLiteForm");
  }

  function removeLegacyDetailButtons() {
    document.querySelector("#CroakleHabitAddTimeButton")?.remove();
    document.querySelector("#CroakleProjectAddTimeButton")?.remove();
  }

  function removeNoteTimeSection() {
    getNotesForm()?.querySelector("#CroakleNoteTimeSection")?.remove();
  }

  function ensureNoteTimeSection() {
    const form = getNotesForm();
    if (!form) return;

    removeNoteTimeSection();

    if (!CroaklePendingNoteTimeSource || !["habit", "project"].includes(CroaklePendingNoteTimeSource.sourceType)) {
      return;
    }

    const anchor = form.querySelector(".CroakleField");
    if (!anchor) return;

    anchor.insertAdjacentHTML("beforebegin", `
      <section class="CroakleNoteTimeSection" id="CroakleNoteTimeSection" aria-label="Time link">
        <div class="CroakleNoteTimeHeader">
          <strong>Time</strong>
          <span>ผูกเวลาของโน้ตวันนี้</span>
        </div>
        <button class="CroakleNoteTimeButton" id="CroakleNoteAddTimeButton" type="button">Add time</button>
      </section>
    `);
  }

  function handleNoteOpen(event) {
    const noteButton = event.target.closest?.("[data-croakle-note-type]");
    if (!noteButton) return;

    CroaklePendingNoteTimeSource = buildSourceFromNoteButton(noteButton);
    window.requestAnimationFrame(ensureNoteTimeSection);
    window.setTimeout(ensureNoteTimeSection, 80);
  }

  function handleNoteAddTime(event) {
    const button = event.target.closest?.("#CroakleNoteAddTimeButton");
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!CroaklePendingNoteTimeSource) return;

    document.querySelector("#CroakleNotesLiteDialog")?.close();
    openSessionDialogWithSource(CroaklePendingNoteTimeSource);
  }

  function lockCurrentSessionForm() {
    const form = document.querySelector("#CroakleSessionForm");
    if (!form) return;

    ensureSourceFields(form);
    const sourceType = form.elements.sourceType?.value || "";
    const sourceName = form.elements.sourceName?.value || form.elements.subject?.value || "";
    applySessionSubjectLock(form, sourceType, sourceName);
  }

  function mergePendingSourceAfterSubmit(event) {
    if (!event.target.matches?.("#CroakleSessionForm")) return;

    const form = event.target;
    const sourceType = form.elements.sourceType?.value || "";
    const sourceName = form.elements.sourceName?.value || "";

    if (isLockedSessionSource(sourceType) && sourceName) {
      form.elements.subject.value = sourceName;
    }

    const pending = getPendingSource();
    if (!pending) return;

    window.setTimeout(() => {
      const state = parseJson(localStorage.getItem(SessionKey), {});
      localStorage.setItem(SessionKey, JSON.stringify(patchSessionBlock(state, pending)));
      clearPendingSource();
      window.CroakleRenderSessionRange?.();
    }, 0);
  }

  function observeNotesDialog() {
    if (window.CroakleSourceTimeObserverReady) return;

    const shell = document.querySelector(".CroakleHabitMoodShell");
    if (!shell) return;

    window.CroakleSourceTimeObserverReady = true;
    new MutationObserver(() => {
      removeLegacyDetailButtons();
      ensureNoteTimeSection();
      lockCurrentSessionForm();
    }).observe(shell, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    injectStyles();
    installSessionSourcePatch();
    removeLegacyDetailButtons();
    observeNotesDialog();
    window.CroakleOpenSessionDialogWithSource = openSessionDialogWithSource;
    window.CroakleApplySessionSubjectLock = applySessionSubjectLock;
    window.CroakleEnsureSessionSourceFields = ensureSourceFields;
    window.CroakleIsLockedSessionSource = isLockedSessionSource;
  }

  if (!window.CroakleSourceTimeEventsBound) {
    window.CroakleSourceTimeEventsBound = true;
    document.addEventListener("click", handleNoteOpen, true);
    document.addEventListener("click", handleNoteAddTime, true);
    document.addEventListener("submit", mergePendingSourceAfterSubmit, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
