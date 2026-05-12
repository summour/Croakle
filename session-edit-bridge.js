(() => {
  const StoreKey = "CroakleSessionBlocksV1";
  let lastEditAt = 0;

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
      blocks: Array.isArray(saved.blocks) ? saved.blocks : [],
    };
  }

  function formatTime(minutes) {
    const hour = Math.floor(Number(minutes || 0) / 60);
    const minute = String(Number(minutes || 0) % 60).padStart(2, "0");
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  function syncColorOptions(form) {
    const color = form.elements.color?.value;
    form.querySelectorAll("[data-session-color]").forEach((button) => {
      button.classList.toggle("CroakleSessionColorOptionActive", button.dataset.sessionColor === color);
    });
  }

  function getEditButton(event) {
    const pathButton = event.composedPath?.().find((node) => {
      return node?.nodeType === 1 && node.matches?.("[data-session-edit]");
    });

    if (pathButton) return pathButton;

    return event.target.closest?.("[data-session-edit]") || null;
  }

  function openSessionEditor(block) {
    const dialog = document.querySelector("#CroakleSessionDialog");
    const form = document.querySelector("#CroakleSessionForm");
    if (!dialog || !form || !block) return false;

    form.reset();
    form.elements.id.value = block.id || "";
    form.elements.subject.value = block.subject || "";
    form.elements.date.value = block.date || "";
    form.elements.start.value = formatTime(block.startMinute || 9 * 60);
    form.elements.duration.value = String(Number(block.duration || 60));
    form.elements.type.value = block.type || "focus";
    form.elements.color.value = block.color || "#60a3ff";

    const deleteButton = form.querySelector("[data-session-delete]");
    if (deleteButton) deleteButton.hidden = false;

    syncColorOptions(form);

    if (!dialog.open) dialog.showModal();
    window.requestAnimationFrame(() => form.elements.subject?.focus());
    return true;
  }

  function handleSessionEdit(event) {
    const button = getEditButton(event);
    if (!button) return;

    const now = Date.now();
    if (now - lastEditAt < 250) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const block = getState().blocks.find((item) => item.id === button.dataset.sessionEdit);
    if (!block || !openSessionEditor(block)) return;

    lastEditAt = now;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function injectStyles() {
    if (document.querySelector("#CroakleSessionEditBridgeStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSessionEditBridgeStyles";
    style.textContent = `
      .CroakleSessionColumn::before {
        pointer-events: none !important;
      }

      .CroakleSessionBlock {
        pointer-events: auto !important;
        touch-action: manipulation !important;
        z-index: 30 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function bindEditEvents() {
    if (window.CroakleSessionEditBridgeBound) return;
    window.CroakleSessionEditBridgeBound = true;

    document.addEventListener("pointerup", handleSessionEdit, true);
    document.addEventListener("click", handleSessionEdit, true);
    document.addEventListener("touchend", handleSessionEdit, true);
  }

  function init() {
    injectStyles();
    bindEditEvents();
  }

  window.CroakleOpenSessionBlockEditor = openSessionEditor;
  window.requestAnimationFrame(init);
})();
