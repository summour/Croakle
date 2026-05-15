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
    const type = String(row.type || "focus").trim() || "focus";
    const title = type;

    if (!date || startMinute === null || !title) return null;

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
})();