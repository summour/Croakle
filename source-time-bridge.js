(() => {
  const SessionKey = "CroakleSessionBlocksV1";
  const SourceDraftKey = "CroaklePendingSessionSourceV1";
  const HabitKey = "CroakleHabitMoodDataCleanV1";
  const ProjectKey = "CroakleProjectDataV1";

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

  function getCurrentTrackDate() {
    const state = parseJson(localStorage.getItem(HabitKey), {});
    return state.trackDate || getTodayIso();
  }

  function getProjectDate() {
    return document.querySelector("#CroakleProjectDates [data-current-date='true']")?.dataset.dateIso || getTodayIso();
  }

  function getHabitSource() {
    const form = document.querySelector("#CroakleHabitDetailForm");
    if (!form) return null;

    const index = Number(form.elements.habitIndex?.value);
    const saved = parseJson(localStorage.getItem(HabitKey), {});
    const template = saved.habitTemplates?.[index];
    const name = String(form.elements.habitName?.value || template?.name || "Habit").trim();
    if (!name) return null;

    return {
      sourceType: "habit",
      sourceId: template?.id || `habit:${index}`,
      sourceName: name,
      subject: name,
      type: "habit",
      date: saved.trackDate || getCurrentTrackDate(),
    };
  }

  function getProjectSource() {
    const form = document.querySelector("#CroakleProjectDetailForm");
    if (!form) return null;

    const index = Number(form.elements.projectIndex?.value);
    const saved = parseJson(localStorage.getItem(ProjectKey), {});
    const project = saved.projects?.[index];
    const name = String(form.elements.projectName?.value || project?.name || "Project").trim();
    if (!name) return null;

    return {
      sourceType: "project",
      sourceId: project?.id || `project:${index}`,
      sourceName: name,
      subject: name,
      type: "focus",
      date: getProjectDate(),
    };
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

  function openSessionDialogWithSource(source) {
    const dialog = document.querySelector("#CroakleSessionDialog");
    const form = document.querySelector("#CroakleSessionForm");
    if (!dialog || !form || !source) return false;

    const sessionId = `CroakleSession${Date.now()}`;
    const payload = { ...source, id: sessionId };
    ensureSourceFields(form);
    savePendingSource(payload);

    form.reset();
    form.elements.id.value = sessionId;
    form.elements.subject.value = source.subject || source.sourceName || "Session";
    form.elements.date.value = source.date || getTodayIso();
    form.elements.start.value = "09:00";
    form.elements.duration.value = "60";
    form.elements.type.value = source.type || source.sourceType || "focus";
    form.elements.color.value = source.sourceType === "project" ? "#ffc978" : "#78f28a";
    form.elements.sourceType.value = source.sourceType || "manual";
    form.elements.sourceId.value = source.sourceId || sessionId;
    form.elements.sourceName.value = source.sourceName || form.elements.subject.value;

    form.querySelector("[data-session-delete]")?.setAttribute("hidden", "");
    form.querySelectorAll("[data-session-color]").forEach((button) => {
      button.classList.toggle(
        "CroakleSessionColorOptionActive",
        button.dataset.sessionColor === form.elements.color.value
      );
    });

    dialog.showModal();
    window.requestAnimationFrame(() => form.elements.start?.focus());
    return true;
  }

  function installSessionSourcePatch() {
    if (window.CroakleSourceTimeStoragePatched) return;
    window.CroakleSourceTimeStoragePatched = true;

    const nativeSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function setItemWithSessionSource(key, value) {
      if (key !== SessionKey) {
        nativeSetItem(key, value);
        return;
      }

      const pending = getPendingSource();
      if (!pending) {
        nativeSetItem(key, value);
        return;
      }

      const state = parseJson(value, {});
      if (!Array.isArray(state.blocks)) {
        nativeSetItem(key, value);
        return;
      }

      state.blocks = state.blocks.map((block) => {
        if (block.id !== pending.id) return block;
        return {
          ...block,
          sourceType: pending.sourceType,
          sourceId: pending.sourceId,
          sourceName: pending.sourceName,
        };
      });

      nativeSetItem(key, JSON.stringify(state));
      clearPendingSource();
    };
  }

  function injectStyles() {
    if (document.querySelector("#CroakleSourceTimeStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSourceTimeStyles";
    style.textContent = `
      .CroakleSourceTimeButton {
        min-height: 44px;
        border: 2px solid var(--CroakleLine, #111111);
        border-radius: 999px;
        background: var(--CroakleSurface, #ffffff);
        color: var(--CroakleInk, #111111);
        font: inherit;
        font-size: 15px;
        font-weight: 900;
      }

      .CroakleSourceTimeButton:active {
        background: var(--CroakleSoftSurface, #f2f2f2);
      }
    `;
    document.head.appendChild(style);
  }

  function ensureButton(formSelector, buttonId, label, beforeSelector) {
    const form = document.querySelector(formSelector);
    if (!form || form.querySelector(`#${buttonId}`)) return;

    const button = document.createElement("button");
    button.className = "CroakleSourceTimeButton";
    button.id = buttonId;
    button.type = "button";
    button.textContent = label;

    const anchor = form.querySelector(beforeSelector);
    if (anchor) {
      anchor.insertAdjacentElement("beforebegin", button);
      return;
    }

    form.appendChild(button);
  }

  function ensureButtons() {
    ensureButton("#CroakleHabitDetailForm", "CroakleHabitAddTimeButton", "Add time", ".CroakleConfirmHabitButton");
    ensureButton("#CroakleProjectDetailForm", "CroakleProjectAddTimeButton", "Add time", ".CroakleProjectDetailActions");
  }

  function handleAddTimeClick(event) {
    const habitButton = event.target.closest?.("#CroakleHabitAddTimeButton");
    const projectButton = event.target.closest?.("#CroakleProjectAddTimeButton");
    if (!habitButton && !projectButton) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const source = habitButton ? getHabitSource() : getProjectSource();
    if (!source) return;

    document.querySelector("#CroakleHabitDetailDialog")?.close();
    document.querySelector("#CroakleProjectDetailDialog")?.close();
    openSessionDialogWithSource(source);
  }

  function patchSessionDialogOpen() {
    if (window.CroakleSourceTimeDialogPatched) return;
    window.CroakleSourceTimeDialogPatched = true;

    window.CroakleOpenSessionDialogWithSource = openSessionDialogWithSource;
  }

  function init() {
    installSessionSourcePatch();
    injectStyles();
    ensureButtons();
    patchSessionDialogOpen();
    document.addEventListener("click", handleAddTimeClick, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    window.requestAnimationFrame(init);
  }
})();
