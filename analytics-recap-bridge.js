(() => {
  const CroakleRecapStoreKey = "CroakleMonthlyRecapsV1";
  const CroakleAiSettingsStoreKey = "CroakleAiSettingsV1";

  function CroakleRecapEscape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function CroakleRecapGetMonthKey(year, month) {
    return typeof CroakleGetMonthKey === "function"
      ? CroakleGetMonthKey(year, month)
      : `${year}-${String(month + 1).padStart(2, "0")}`;
  }

  function CroakleRecapCanSummarizeMonth(year, month) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return year < currentYear || (year === currentYear && month < currentMonth);
  }

  function CroakleRecapIsFutureMonth(year, month) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return year > currentYear || (year === currentYear && month > currentMonth);
  }

  function CroakleRecapLoadSaved() {
    try {
      return JSON.parse(localStorage.getItem(CroakleRecapStoreKey) || "{}");
    } catch {
      return {};
    }
  }

  function CroakleRecapSave(monthKey, recapText) {
    const saved = CroakleRecapLoadSaved();
    saved[monthKey] = {
      text: recapText,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CroakleRecapStoreKey, JSON.stringify(saved));
  }

  function CroakleRecapLoadAiSettings() {
    try {
      return {
        provider: "gemini",
        model: "gemini-2.5-flash",
        apiKey: "",
        ...JSON.parse(localStorage.getItem(CroakleAiSettingsStoreKey) || "{}"),
      };
    } catch {
      return { provider: "gemini", model: "gemini-2.5-flash", apiKey: "" };
    }
  }

  function CroakleRecapShiftDate(date, amount) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function CroakleRecapFormatDate(date) {
    return typeof CroakleFormatDate === "function"
      ? CroakleFormatDate(date)
      : [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function CroakleRecapGetWeekStarts(year, month) {
    const daysInMonth = typeof CroakleGetDaysInMonth === "function" ? CroakleGetDaysInMonth(year, month) : new Date(year, month + 1, 0).getDate();
    const seen = new Set();
    const weekStarts = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const weekStart = CroakleRecapShiftDate(date, -((date.getDay() + 6) % 7));
      const weekKey = CroakleRecapFormatDate(weekStart);

      if (!seen.has(weekKey)) {
        seen.add(weekKey);
        weekStarts.push(weekStart);
      }
    }

    return weekStarts;
  }

  function CroakleRecapCountProjectWeek(project, weekStart, year, month) {
    const weekKey = CroakleRecapFormatDate(weekStart);
    const days = Array.isArray(project.weeklyDays?.[weekKey]) ? project.weeklyDays[weekKey] : [];

    return days.reduce((total, done, dayIndex) => {
      const date = CroakleRecapShiftDate(weekStart, dayIndex);
      const isTargetMonth = date.getFullYear() === year && date.getMonth() === month;
      return total + (done && isTargetMonth ? 1 : 0);
    }, 0);
  }

  function CroakleRecapGetProjectMonthlyRows(year, month) {
    try {
      const saved = JSON.parse(localStorage.getItem("CroakleProjectDataV1") || "{}");
      const projects = Array.isArray(saved.projects) ? saved.projects : [];
      const weekStarts = CroakleRecapGetWeekStarts(year, month);
      const monthKey = CroakleRecapGetMonthKey(year, month);

      return projects.map((project) => {
        const checkIns = weekStarts.reduce((total, weekStart) => total + CroakleRecapCountProjectWeek(project, weekStart, year, month), 0);
        const finishedThisMonth = String(project.completedWeekKey || "").startsWith(monthKey);

        return {
          name: project.name || "Project",
          priority: project.priority || "medium",
          status: project.completed ? "finished" : "active",
          checkIns,
          finishedThisMonth,
        };
      }).filter((project) => project.checkIns > 0 || project.status === "active" || project.finishedThisMonth);
    } catch {
      return [];
    }
  }

  function CroakleRecapCreateMonthlyData(year, month) {
    const monthData = CroakleGetMonthData(year, month);
    const monthLabel = CroakleGetMonthLabel(year, month);
    const habitRows = Array.isArray(monthData.habits) ? monthData.habits.map((habit) => ({
      name: habit.name || "Habit",
      checkIns: Array.isArray(habit.days) ? habit.days.filter(Boolean).length : 0,
    })) : [];
    const dailyProductivity = Array.from({ length: monthData.moods.length }, (_, dayIndex) => {
      const doneCount = habitRows.length
        ? monthData.habits.reduce((total, habit) => total + (habit.days?.[dayIndex] ? 1 : 0), 0)
        : 0;

      return habitRows.length ? Math.round((doneCount / habitRows.length) * 100) : 0;
    });
    const moodDistribution = [1, 2, 3, 4, 5].reduce((summary, moodValue) => ({
      ...summary,
      [moodValue]: monthData.moods.filter((mood) => mood === moodValue).length,
    }), {});
    const moodValues = monthData.moods.filter(Boolean);
    const projects = CroakleRecapGetProjectMonthlyRows(year, month);

    return {
      app: "Croakle",
      month: monthLabel,
      rule: "This is a completed-month recap only.",
      habit: {
        totalCheckIns: habitRows.reduce((total, habit) => total + habit.checkIns, 0),
        habitCount: habitRows.length,
        habits: habitRows,
        dailyProductivity,
      },
      project: {
        activeProjects: projects.filter((project) => project.status === "active").length,
        finishedProjects: projects.filter((project) => project.finishedThisMonth).length,
        projects,
      },
      mood: {
        entries: moodValues.length,
        average: moodValues.length ? Number((moodValues.reduce((total, mood) => total + mood, 0) / moodValues.length).toFixed(1)) : null,
        distribution: moodDistribution,
      },
    };
  }

  function CroakleRecapCreatePrompt(monthlyData) {
    return [
      "You are Croakle Recap, a calm life dashboard assistant.",
      "Write in Thai with simple, supportive, non-judgmental wording.",
      "Summarize the completed monthly data only.",
      "Do not invent facts. Use only the JSON data.",
      "Return exactly these sections:",
      "1. ภาพรวมเดือนนี้",
      "2. Habit",
      "3. Project",
      "4. Mood",
      "5. โฟกัสเดือนถัดไป",
      "Keep it concise but useful.",
      "",
      JSON.stringify(monthlyData),
    ].join("\n");
  }

  async function CroakleRecapGenerateWithGemini(monthlyData) {
    const settings = CroakleRecapLoadAiSettings();
    const apiKey = String(settings.apiKey || "").trim();

    if (!apiKey) {
      return CroakleRecapCreateLocalSummaryFromData(monthlyData, "ยังไม่ได้ใส่ Gemini API key ใน Settings จึงใช้ local recap ก่อน");
    }

    const model = settings.model || "gemini-2.5-flash";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: CroakleRecapCreatePrompt(monthlyData) }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          maxOutputTokens: 900,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Gemini recap failed. Please check API key or model.");
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim() || CroakleRecapCreateLocalSummaryFromData(monthlyData, "Gemini did not return text, so Croakle used local recap.");
  }

  function CroakleRecapCreateLocalSummaryFromData(monthlyData, note = "") {
    const bestHabit = [...monthlyData.habit.habits].sort((first, second) => second.checkIns - first.checkIns)[0];

    return [
      `${monthlyData.month} Recap`,
      note ? `หมายเหตุ: ${note}` : "",
      "",
      `ภาพรวมเดือนนี้มี habit check-ins รวม ${monthlyData.habit.totalCheckIns} ครั้ง และ mood average อยู่ที่ ${monthlyData.mood.average ?? "—"}`,
      bestHabit ? `Habit ที่เด่นที่สุดคือ ${bestHabit.name} (${bestHabit.checkIns} check-ins)` : "ยังไม่มี habit ที่เด่นชัดในเดือนนี้",
      `Project มี ${monthlyData.project.finishedProjects} finished project และยังมี ${monthlyData.project.activeProjects} active projects`,
      "",
      "Focus ถัดไป: เลือก habit หรือ project ที่สำคัญที่สุด 1 อย่าง แล้วทำให้ต่อเนื่องแบบเล็ก ๆ ก่อน",
    ].filter(Boolean).join("\n");
  }

  function CroakleRecapCreateLocalSummary(year, month) {
    if (typeof CroakleGetMonthData !== "function" || typeof CroakleGetMonthLabel !== "function") {
      return "Croakle Recap is not ready yet.";
    }

    return CroakleRecapCreateLocalSummaryFromData(CroakleRecapCreateMonthlyData(year, month));
  }

  function CroakleRecapInjectStyles() {
    if (document.querySelector("#CroakleRecapStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleRecapStyles";
    style.textContent = `
      .CroakleRecapCard {
        display: grid;
        gap: 14px;
        border: 2px solid var(--CroakleLine);
        border-radius: 20px;
        background: var(--CroakleSurface);
        padding: 14px;
      }

      .CroakleRecapHeader {
        display: grid;
        gap: 4px;
      }

      .CroakleRecapHeader h3 {
        margin: 0;
        font-size: 25px;
        font-weight: 950;
        line-height: 1;
        letter-spacing: -0.055em;
      }

      .CroakleRecapHeader p,
      .CroakleRecapBody,
      .CroakleRecapStatus {
        margin: 0;
        color: var(--CroakleMuted);
        font-size: 13px;
        font-weight: 800;
        line-height: 1.35;
      }

      .CroakleRecapBody {
        color: var(--CroakleText);
        white-space: pre-line;
      }

      .CroakleRecapButton {
        appearance: none;
        min-height: 46px;
        border: 2px solid var(--CroakleLine);
        border-radius: 999px;
        background: var(--CroakleLine);
        color: var(--CroakleSurface);
        font: inherit;
        font-size: 15px;
        font-weight: 900;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .CroakleRecapButton:disabled {
        background: var(--CroakleSoftSurface);
        color: var(--CroakleMuted);
        cursor: default;
      }

      .CroakleRecapButton:not(:disabled):active {
        transform: scale(0.96);
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleRecapGetButtonState(year, month) {
    if (CroakleRecapCanSummarizeMonth(year, month)) {
      return {
        disabled: false,
        label: "Generate Recap",
        status: CroakleRecapLoadAiSettings().apiKey
          ? "Gemini will summarize this completed month from habit, project, and mood data."
          : "Add Gemini API key in Settings for AI recap. Without it, Croakle uses local recap.",
      };
    }

    if (CroakleRecapIsFutureMonth(year, month)) {
      return {
        disabled: true,
        label: "Not available",
        status: "Recap is available only after a month has completed.",
      };
    }

    return {
      disabled: true,
      label: "Available after month ends",
      status: "This month is still in progress. Croakle Recap unlocks after the month ends.",
    };
  }

  function CroakleRecapRender() {
    const scroll = document.querySelector(".CroakleAnalyticsScroll");
    const summary = document.querySelector("#CroakleAnalyticsSummary");

    if (!scroll || !summary || !Number.isInteger(CroakleState?.analyticsYear) || !Number.isInteger(CroakleState?.analyticsMonth)) {
      return;
    }

    CroakleRecapInjectStyles();

    let card = document.querySelector("#CroakleRecapCard");
    if (!card) {
      summary.insertAdjacentHTML("beforebegin", `<section class="CroakleRecapCard" id="CroakleRecapCard"></section>`);
      card = document.querySelector("#CroakleRecapCard");
    }

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;
    const monthKey = CroakleRecapGetMonthKey(year, month);
    const savedRecap = CroakleRecapLoadSaved()[monthKey]?.text || "";
    const buttonState = CroakleRecapGetButtonState(year, month);

    card.innerHTML = `
      <header class="CroakleRecapHeader">
        <h3>Croakle Recap</h3>
        <p>Monthly recap from completed data only.</p>
      </header>
      <p class="CroakleRecapStatus">${CroakleRecapEscape(buttonState.status)}</p>
      ${savedRecap ? `<p class="CroakleRecapBody">${CroakleRecapEscape(savedRecap)}</p>` : ""}
      <button class="CroakleRecapButton" type="button" data-croakle-generate-recap ${buttonState.disabled ? "disabled" : ""}>${CroakleRecapEscape(savedRecap ? "Regenerate Recap" : buttonState.label)}</button>
    `;
  }

  async function CroakleRecapHandleClick(event) {
    const button = event.target.closest("[data-croakle-generate-recap]");

    if (!button || button.disabled) {
      return;
    }

    const year = CroakleState.analyticsYear;
    const month = CroakleState.analyticsMonth;

    if (!CroakleRecapCanSummarizeMonth(year, month)) {
      CroakleRecapRender();
      return;
    }

    button.disabled = true;
    button.textContent = "Generating...";

    try {
      const monthlyData = CroakleRecapCreateMonthlyData(year, month);
      const recap = await CroakleRecapGenerateWithGemini(monthlyData);
      CroakleRecapSave(CroakleRecapGetMonthKey(year, month), recap);
    } catch (error) {
      const localRecap = CroakleRecapCreateLocalSummary(year, month);
      CroakleRecapSave(CroakleRecapGetMonthKey(year, month), `${localRecap}\n\nหมายเหตุ: ${error.message || "Gemini ไม่พร้อมใช้งาน จึงใช้ local recap แทน"}`);
    }

    CroakleRecapRender();
  }

  function CroakleRecapPatchRender() {
    if (window.CroakleRecapRenderPatched || typeof CroakleRenderAnalyticsPage !== "function") {
      return;
    }

    window.CroakleRecapRenderPatched = true;
    const originalRender = CroakleRenderAnalyticsPage;

    CroakleRenderAnalyticsPage = function CroakleRenderAnalyticsPageWithRecap() {
      originalRender();
      CroakleRecapRender();
    };
  }

  function CroakleRecapInit() {
    CroakleRecapPatchRender();
    document.addEventListener("click", CroakleRecapHandleClick);
    window.requestAnimationFrame(CroakleRecapRender);
  }

  CroakleRecapInit();
})();
