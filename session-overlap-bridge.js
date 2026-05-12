(() => {
  const StoreKey = "CroakleSessionBlocksV1";
  const StartHour = 6;
  const MinuteHeight = 0.82;

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

  function getBlockStart(block) {
    return Number(block?.startMinute || StartHour * 60);
  }

  function getBlockDuration(block) {
    return Math.max(15, Number(block?.duration || 60));
  }

  function getBlockEnd(block) {
    return getBlockStart(block) + getBlockDuration(block);
  }

  function hasOverlap(firstBlock, secondBlock) {
    return getBlockStart(firstBlock) < getBlockEnd(secondBlock)
      && getBlockStart(secondBlock) < getBlockEnd(firstBlock);
  }

  function createOverlapGroups(blocks) {
    const sortedBlocks = [...blocks].sort((firstBlock, secondBlock) => {
      return getBlockStart(firstBlock) - getBlockStart(secondBlock);
    });
    const groups = [];
    let currentGroup = [];
    let currentGroupEnd = -Infinity;

    sortedBlocks.forEach((block) => {
      if (!currentGroup.length || getBlockStart(block) < currentGroupEnd) {
        currentGroup.push(block);
        currentGroupEnd = Math.max(currentGroupEnd, getBlockEnd(block));
        return;
      }

      groups.push(currentGroup);
      currentGroup = [block];
      currentGroupEnd = getBlockEnd(block);
    });

    if (currentGroup.length) {
      groups.push(currentGroup);
    }

    return groups;
  }

  function layoutGroup(group) {
    const lanes = [];
    const layoutBlocks = group.map((block) => {
      const start = getBlockStart(block);
      let laneIndex = lanes.findIndex((laneEnd) => laneEnd <= start);

      if (laneIndex < 0) {
        laneIndex = lanes.length;
        lanes.push(0);
      }

      lanes[laneIndex] = getBlockEnd(block);
      return { ...block, laneIndex };
    });
    const laneCount = Math.max(1, lanes.length);

    return layoutBlocks.map((block) => ({ ...block, laneCount }));
  }

  function getLayoutBlocks(blocks) {
    return createOverlapGroups(blocks).flatMap(layoutGroup);
  }

  function getColumnBlocks(dateIso) {
    return getState().blocks.filter((block) => block.date === dateIso);
  }

  function getDisplayName(block) {
    const subject = String(block?.subject || "Session").trim();
    const compact = subject
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 3);

    return compact || subject.slice(0, 3) || "S";
  }

  function applyBlockLayout(blockNode, block) {
    const laneCount = Math.max(1, Number(block.laneCount || 1));
    const laneIndex = Math.max(0, Number(block.laneIndex || 0));
    const gap = laneCount > 1 ? 3 : 0;
    const width = laneCount > 1
      ? `calc(${100 / laneCount}% - ${gap}px)`
      : "calc(100% - 10px)";
    const left = laneCount > 1
      ? `calc(${(100 / laneCount) * laneIndex}% + ${gap / 2}px)`
      : "5px";
    const top = (getBlockStart(block) - StartHour * 60) * MinuteHeight;
    const height = Math.max(30, getBlockDuration(block) * MinuteHeight);

    blockNode.style.setProperty("left", left, "important");
    blockNode.style.setProperty("right", "auto", "important");
    blockNode.style.setProperty("width", width, "important");
    blockNode.style.setProperty("top", `${top}px`, "important");
    blockNode.style.setProperty("height", `${height}px`, "important");
    blockNode.classList.toggle("CroakleSessionBlockCompact", laneCount > 1);

    const title = blockNode.querySelector("strong");
    if (title && laneCount > 1) {
      title.textContent = getDisplayName(block);
    }
  }

  function applyColumnLayout(column) {
    const dateIso = column?.dataset.sessionDate;
    if (!dateIso) return;

    const layoutBlocks = getLayoutBlocks(getColumnBlocks(dateIso));
    const layoutById = new Map(layoutBlocks.map((block) => [block.id, block]));

    column.querySelectorAll("[data-session-edit]").forEach((blockNode) => {
      const block = layoutById.get(blockNode.dataset.sessionEdit);
      if (!block) return;
      applyBlockLayout(blockNode, block);
    });
  }

  function applyOverlapLayout() {
    document.querySelectorAll(".CroakleSessionColumn").forEach(applyColumnLayout);
  }

  function injectStyles() {
    if (document.querySelector("#CroakleSessionOverlapStyles")) return;

    const style = document.createElement("style");
    style.id = "CroakleSessionOverlapStyles";
    style.textContent = `
      .CroakleSessionBlockCompact {
        padding: 7px 5px !important;
        justify-items: center;
        text-align: center !important;
      }

      .CroakleSessionBlockCompact strong {
        max-width: 100%;
        font-size: 12px !important;
      }

      .CroakleSessionBlockCompact span {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function observeGrid() {
    const grid = document.querySelector("#CroakleSessionGrid");
    if (!grid || grid.CroakleSessionOverlapObserved) return;

    grid.CroakleSessionOverlapObserved = true;
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(applyOverlapLayout);
    });

    observer.observe(grid, { childList: true, subtree: true });
  }

  function patchStorageUpdates() {
    window.addEventListener("storage", () => {
      window.requestAnimationFrame(applyOverlapLayout);
    });
  }

  function init() {
    injectStyles();
    observeGrid();
    applyOverlapLayout();
  }

  window.addEventListener("click", () => {
    window.requestAnimationFrame(() => {
      observeGrid();
      applyOverlapLayout();
    });
  });
  patchStorageUpdates();
  window.requestAnimationFrame(init);
})();
