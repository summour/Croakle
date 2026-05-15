(() => {
  function applyTypeLabels() {
    document.querySelectorAll("[data-session-edit]").forEach((button) => {
      const id = button.dataset.sessionEdit;
      if (!String(id || "").startsWith("import:")) return;

      const state = JSON.parse(localStorage.getItem("CroakleSessionBlocksV1") || "{}");
      const blocks = Array.isArray(state.blocks) ? state.blocks : [];
      const block = blocks.find((item) => item.id === id);
      if (!block?.type) return;

      const title = button.querySelector("strong");
      if (!title) return;
      title.textContent = block.type;
    });
  }

  function patchRender() {
    if (window.CroakleTypeLabelPatched || typeof window.CroakleRenderSessionRange !== "function") {
      return;
    }

    window.CroakleTypeLabelPatched = true;
    const originalRender = window.CroakleRenderSessionRange;

    window.CroakleRenderSessionRange = function CroakleRenderSessionRangeWithTypeLabel() {
      const result = originalRender.apply(this, arguments);
      window.requestAnimationFrame(applyTypeLabels);
      return result;
    };
  }

  function init() {
    patchRender();
    applyTypeLabels();
    window.setInterval(applyTypeLabels, 1200);
  }

  window.requestAnimationFrame(init);
})();