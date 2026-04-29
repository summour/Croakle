(() => {
  const HabitStoreKey = "CroakleHabitMoodDataCleanV1";
  const ProjectStoreKey = "CroakleProjectDataV1";
  const HomeCardStoreKey = "CroakleHomeCardsV1";
  const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const CardColors = [
    { key: "yellow", label: "Yellow", className: "CroakleDashboardBoxYellow" },
    { key: "green", label: "Green", className: "CroakleDashboardBoxGreen" },
    { key: "blue", label: "Blue", className: "CroakleDashboardBoxBlue" },
    { key: "pink", label: "Pink", className: "CroakleDashboardBoxPink" },
  ];
  const CardIcons = ["✦", "◐", "●", "◆", "▰", "▲"];

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
      .replace(/"/g, "&quot;");
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getToday() {
    return typeof CroakleGetToday === "function" ? CroakleGetToday() : new Date();
  }

  function formatDate(date) {
    if (typeof CroakleFormatDate === "function") {
      return CroakleFormatDate(date);
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function parseDate(value) {
    if (typeof CroakleParseDate === "function") {
      return CroakleParseDate(value);
    }

    const [year, month, day] = String(value).split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function shiftDate(date, amount) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function getWeekDates() {
    const today = getToday();
    const monday = shiftDate(today, -((today.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
  }

  function getMonthData() {
    const today = getToday();

    if (typeof CroakleGetMonthDataFromDate === "function") {
      return CroakleGetMonthDataFromDate(today);
    }

    const saved = parseJson(localStorage.getItem(HabitStoreKey), null);
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    return saved?.months?.[key] || { habits: [], moods: [] };
  }

  function getProjects() {
    const saved = parseJson(localStorage.getItem(ProjectStoreKey), null);
    return Array.isArray(saved?.projects) ? saved.projects : [];
  }

  function getMoodLabel(mood) {
    if (!mood) return "No mood";
    return typeof CroakleGetMoodLabel === "function" ? `${mood} ${CroakleGetMoodLabel(mood)}` : `Mood ${mood}`;
  }

  function getHabitRows() {
    const todayIndex = getToday().getDate() - 1;
    const habits = Array.isArray(getMonthData().habits) ? getMonthData().habits : [];

    return habits.map((habit, index) => ({
      habit,
      index,
      done: Boolean(habit.days?.[todayIndex]),
    }));
  }

  function getHabitIcon(name) {
    const text = String(name || "").toLowerCase();

    if (text.includes("read") || text.includes("study")) return "▰";
    if (text.includes("exercise") || text.includes("walk") || text.includes("gym")) return "●";
    if (text.includes("sleep") || text.includes("bed")) return "◐";
    if (text.includes("clean") || text.includes("room")) return "◆";
    return "✦";
  }

  function getColorClass(color) {
    return CardColors.find((item) => item.key === color)?.className || CardColors[0].className;
  }

  function getSavedHomeCards() {
    const saved = parseJson(localStorage.getItem(HomeCardStoreKey), null);
    return {
      hasSaved: Boolean(saved && Array.isArray(saved.cards)),
      cards: Array.isArray(saved?.cards) ? saved.cards : [],
    };
  }

  function saveHomeCards(cards) {
    localStorage.setItem(HomeCardStoreKey, JSON.stringify({ cards }));
  }

  function findHabitRow(habitName) {
    const nameKey = normalizeText(habitName);
    return getHabitRows().find(({ habit }) => normalizeText(habit.name) === nameKey) || null;
  }

  function getDefaultHomeCards() {
    return getHabitRows().slice(0, 4).map(({ habit }, index) => ({
      habitName: habit.name || "New Habit",
      color: CardColors[index % CardColors.length].key,
      icon: getHabitIcon(habit.name),
    }));
  }

  function getHomeCards() {
    const saved = getSavedHomeCards();
    const source = saved.hasSaved ? saved.cards : getDefaultHomeCards();

    return source
      .map((card) => {
        const row = findHabitRow(card.habitName);
        if (!row) return null;

        return {
          habit: row.habit,
          index: row.index,
          done: row.done,
          color: CardColors.some((item) => item.key === card.color) ? card.color : "yellow",
          icon: card.icon || getHabitIcon(row.habit.name),
        };
      })
      .filter(Boolean);
  }

  function upsertHomeCard(nextCard, previousName = "") {
    const saved = getSavedHomeCards();
    const baseCards = saved.hasSaved ? saved.cards : getDefaultHomeCards();
    const removeName = normalizeText(previousName || nextCard.habitName);
    const nextCards = baseCards.filter((card) => normalizeText(card.habitName) !== removeName);
    const duplicateIndex = nextCards.findIndex((card) => normalizeText(card.habitName) === normalizeText(nextCard.habitName));

    if (duplicateIndex >= 0) {
      nextCards[duplicateIndex] = nextCard;
    } else {
      nextCards.push(nextCard);
    }

    saveHomeCards(nextCards.slice(-8));
  }

  function removeHomeCard(habitName) {
    const saved = getSavedHomeCards();
    const baseCards = saved.hasSaved ? saved.cards : getDefaultHomeCards();
    saveHomeCards(baseCards.filter((card) => normalizeText(card.habitName) !== normalizeText(habitName)));
  }

  function createDateBoxes() {
    const todayKey = formatDate(getToday());

    return getWeekDates().map((date) => {
      const dateIso = formatDate(date);
      const activeClass = dateIso === todayKey ? " CroakleDashboardDateActive" : "";
      return `
        <button class="CroakleDashboardDateBox${activeClass}" type="button" data-dashboard-date="${dateIso}" aria-label="Open ${WeekDays[date.getDay()]} ${date.getDate()}">
          <strong>${date.getDate()}</strong>
          <span>${WeekDays[date.getDay()]}</span>
        </button>
      `;
    }).join("");
  }

  function createSummaryBoxes() {
    const habits = getHabitRows();
    const done = habits.filter((row) => row.done).length;
    const projects = getProjects().filter((project) => !project.completed).length;
    const mood = getMonthData().moods?.[getToday().getDate() - 1];

    return `
      <button class="CroakleDashboardStatBox" type="button" data-page-target="track"><span>Habit</span><strong>${done}/${habits.length}</strong></button>
      <button class="CroakleDashboardStatBox" type="button" data-page-target="project"><span>Project</span><strong>${projects} active</strong></button>
      <button class="CroakleDashboardStatBox" type="button" data-page-target="mood"><span>Mood</span><strong>${escapeText(getMoodLabel(mood))}</strong></button>
    `;
  }

  function createHabitBoxes() {
    const rows = getHomeCards();

    if (!rows.length) {
      return `
        <div class="CroakleDashboardEmptyBox">
          <strong>No cards yet</strong>
          <span>Create a home card from your habits.</span>
          <button class="CroakleDashboardEmptyAction" type="button" data-home-card-open>Add card</button>
        </div>
      `;
    }

    return rows.map(({ habit, index, done, color, icon }) => {
      const colorClass = done ? "CroakleDashboardBoxDone" : getColorClass(color);
      const meta = habit.description || `Goal ${habit.goal || 1} days/week`;
      const safeName = escapeText(habit.name || "New Habit");

      return `
        <article class="CroakleDashboardHabitBox ${colorClass}">
          <div class="CroakleDashboardHabitBoxTop">
            <span>${escapeText(icon)}</span>
            <div class="CroakleDashboardHabitActions">
              <button class="CroakleDashboardCardMiniButton" type="button" data-home-card-edit="${safeName}" aria-label="Edit ${safeName}">✎</button>
              <button class="CroakleDashboardCardMiniButton" type="button" data-home-card-remove="${safeName}" aria-label="Remove ${safeName}">×</button>
              <button class="CroakleDashboardCardCheckButton" type="button" data-dashboard-habit-toggle="${index}" aria-pressed="${done}" aria-label="Toggle ${safeName}">${done ? "✓" : ""}</button>
            </div>
          </div>
          <button class="CroakleDashboardHabitBoxText" type="button" data-page-target="track">
            <strong title="${safeName}">${safeName}</strong>
            <small title="${escapeText(meta)}">${escapeText(meta)}</small>
          </button>
        </article>
      `;
    }).join("");
  }

  function createProjectBoxes() {
    const activeProjects = getProjects().filter((project) => !project.completed).slice(0, 2);

    if (!activeProjects.length) {
      return `<div class="CroakleDashboardProjectBox"><div><strong>No active projects</strong><span>Add a project to track work.</span></div><button type="button" data-page-target="project">Open</button></div>`;
    }

    return activeProjects.map((project) => `
      <div class="CroakleDashboardProjectBox">
        <div><strong>${escapeText(project.name || "New Project")}</strong><span>${escapeText(project.description || `Goal ${project.goal || 1} days/week`)}</span></div>
        <div class="CroakleDashboardProjectActions">
          <button type="button" data-page-target="project">Update</button>
          <button type="button" data-page-target="project">Finished</button>
        </div>
      </div>
    `).join("");
  }

  function createHomeCardModal() {
    return `
      <div class="CroakleHomeCardModal" hidden data-home-card-modal>
        <button class="CroakleHomeCardBackdrop" type="button" data-home-card-close aria-label="Close add card"></button>
        <section class="CroakleHomeCardPanel" data-home-card-panel data-selected-color="yellow" data-selected-icon="✦" data-edit-name="" aria-label="Add home card">
          <div class="CroakleHomeCardHeader">
            <div>
              <p data-home-card-mode>ADD CARD</p>
              <h3>Home card</h3>
            </div>
            <button class="CroakleHomeCardClose" type="button" data-home-card-close aria-label="Close">×</button>
          </div>

          <label class="CroakleHomeCardField">
            <span>Habit</span>
            <select class="CroakleHomeCardSelect" data-home-card-habit></select>
          </label>

          <div class="CroakleHomeCardField">
            <span>Card color</span>
            <div class="CroakleHomeCardPicker">
              ${CardColors.map((color) => `<button class="CroakleHomeCardOption ${color.className}" type="button" data-home-card-color="${color.key}">${color.label}</button>`).join("")}
            </div>
          </div>

          <div class="CroakleHomeCardField">
            <span>Icon</span>
            <div class="CroakleHomeCardPicker CroakleHomeCardIconPicker">
              ${CardIcons.map((icon) => `<button class="CroakleHomeCardOption CroakleHomeCardIconOption" type="button" data-home-card-icon="${escapeText(icon)}">${escapeText(icon)}</button>`).join("")}
            </div>
          </div>

          <div class="CroakleHomeCardPreviewWrap">
            <span>Preview</span>
            <article class="CroakleHomeCardPreview CroakleDashboardBoxYellow" data-home-card-preview>
              <div class="CroakleHomeCardPreviewTop"><span data-home-card-preview-icon>✦</span><i></i></div>
              <div class="CroakleHomeCardPreviewText"><strong data-home-card-preview-name>Habit name</strong><small data-home-card-preview-meta>Goal 1 days/week</small></div>
            </article>
          </div>

          <div class="CroakleHomeCardFooter">
            <button class="CroakleHomeCardDangerButton" type="button" data-home-card-delete hidden>Delete</button>
            <button class="CroakleHomeCardGhostButton" type="button" data-home-card-close>Cancel</button>
            <button class="CroakleHomeCardPrimaryButton" type="button" data-home-card-save>Create card</button>
          </div>
        </section>
      </div>
    `;
  }

  function createPreview() {
    return `
      <section class="CroakleDashboardPreview" aria-label="Home overview">
        <div class="CroakleDashboardDateScroller">${createDateBoxes()}</div>
        <div class="CroakleDashboardStatGrid">${createSummaryBoxes()}</div>
        <div class="CroakleDashboardSectionHeader"><h2>Today's Habits</h2><button class="CroakleDashboardAddCardButton" type="button" data-home-card-open>Add card</button></div>
        <div class="CroakleDashboardHabitGrid">${createHabitBoxes()}</div>
        <div class="CroakleDashboardSectionHeader"><h2>Active Projects</h2><button type="button" data-page-target="project">Open</button></div>
        <div class="CroakleDashboardProjectList">${createProjectBoxes()}</div>
      </section>
    `;
  }

  function createMenu() {
    return `
      <button type="button" data-page-target="track"><span>Track progress</span><span>›</span></button>
      <button type="button" data-page-target="project"><span>Projects</span><span>›</span></button>
      <button type="button" data-page-target="best"><span>Best habits</span><span>›</span></button>
      <button type="button" data-page-target="mood"><span>Top moods</span><span>›</span></button>
    `;
  }

  function fillHabitSelect(page) {
    const select = page?.querySelector("[data-home-card-habit]");
    if (!select) return;

    const rows = getHabitRows();
    select.innerHTML = rows.length
      ? rows.map(({ habit }) => `<option value="${escapeText(habit.name || "")}">${escapeText(habit.name || "New Habit")}</option>`).join("")
      : `<option value="">No habits available</option>`;
  }

  function getSelectedHabitMeta(page) {
    const select = page?.querySelector("[data-home-card-habit]");
    const row = findHabitRow(select?.value || "");
    const habit = row?.habit || {};
    return habit.description || `Goal ${habit.goal || 1} days/week`;
  }

  function syncModal(page) {
    const panel = page?.querySelector("[data-home-card-panel]");
    const select = page?.querySelector("[data-home-card-habit]");
    const preview = page?.querySelector("[data-home-card-preview]");
    const previewIcon = page?.querySelector("[data-home-card-preview-icon]");
    const previewName = page?.querySelector("[data-home-card-preview-name]");
    const previewMeta = page?.querySelector("[data-home-card-preview-meta]");

    if (!panel || !select || !preview || !previewIcon || !previewName || !previewMeta) return;

    page.querySelectorAll("[data-home-card-color]").forEach((button) => {
      button.classList.toggle("CroakleHomeCardOptionActive", button.dataset.homeCardColor === panel.dataset.selectedColor);
    });

    page.querySelectorAll("[data-home-card-icon]").forEach((button) => {
      button.classList.toggle("CroakleHomeCardOptionActive", button.dataset.homeCardIcon === panel.dataset.selectedIcon);
    });

    preview.className = `CroakleHomeCardPreview ${getColorClass(panel.dataset.selectedColor)}`;
    previewIcon.textContent = panel.dataset.selectedIcon || "✦";
    previewName.textContent = select.value || "Habit name";
    previewMeta.textContent = getSelectedHabitMeta(page);
  }

  function ensureModal(page) {
    if (!page || page.querySelector("[data-home-card-modal]")) return;
    page.insertAdjacentHTML("beforeend", createHomeCardModal());
  }

  function openHomeCardModal(editName = "") {
    const page = document.querySelector('[data-page="menu"]');
    const modal = page?.querySelector("[data-home-card-modal]");
    const panel = page?.querySelector("[data-home-card-panel]");
    const select = page?.querySelector("[data-home-card-habit]");
    const saveButton = page?.querySelector("[data-home-card-save]");
    const deleteButton = page?.querySelector("[data-home-card-delete]");
    const mode = page?.querySelector("[data-home-card-mode]");

    if (!page || !modal || !panel || !select || !saveButton || !deleteButton || !mode) return;

    fillHabitSelect(page);

    const saved = getSavedHomeCards();
    const editingCard = (saved.hasSaved ? saved.cards : getDefaultHomeCards()).find((card) => normalizeText(card.habitName) === normalizeText(editName));

    panel.dataset.editName = editingCard?.habitName || "";
    panel.dataset.selectedColor = editingCard?.color || "yellow";
    panel.dataset.selectedIcon = editingCard?.icon || getHabitIcon(select.value);
    select.value = editingCard?.habitName || select.options[0]?.value || "";
    saveButton.textContent = editingCard ? "Update card" : "Create card";
    deleteButton.hidden = !editingCard;
    mode.textContent = editingCard ? "EDIT CARD" : "ADD CARD";
    syncModal(page);
    modal.hidden = false;
  }

  function closeHomeCardModal() {
    document.querySelector('[data-page="menu"] [data-home-card-modal]')?.setAttribute("hidden", "");
  }

  function saveHomeCardFromModal() {
    const page = document.querySelector('[data-page="menu"]');
    const panel = page?.querySelector("[data-home-card-panel]");
    const select = page?.querySelector("[data-home-card-habit]");

    if (!page || !panel || !select || !select.value) return;

    upsertHomeCard({
      habitName: select.value,
      color: panel.dataset.selectedColor || "yellow",
      icon: panel.dataset.selectedIcon || getHabitIcon(select.value),
    }, panel.dataset.editName || "");

    closeHomeCardModal();
    renderHome();
  }

  function deleteHomeCardFromModal() {
    const panel = document.querySelector('[data-page="menu"] [data-home-card-panel]');
    if (!panel?.dataset.editName) return;

    removeHomeCard(panel.dataset.editName);
    closeHomeCardModal();
    renderHome();
  }

  function renderHome() {
    const page = document.querySelector('[data-page="menu"]');
    const menu = page?.querySelector(".CroakleMenuList");

    if (!page || !menu) return;

    page.querySelector(".CroakleEmptyPanel")?.remove();
    page.querySelector(".CroakleDashboardPreview")?.remove();
    page.querySelector("[data-home-card-modal]")?.remove();
    page.querySelector(".CroakleHeroHeader h1").textContent = "Home";
    menu.classList.add("CroakleDashboardMenuList");
    menu.innerHTML = createMenu();
    page.querySelector(".CroakleHeroHeader")?.insertAdjacentHTML("afterend", createPreview());
    ensureModal(page);
    fillHabitSelect(page);
  }

  function setTrackDate(dateIso) {
    if (typeof CroakleState === "undefined") return;

    const date = parseDate(dateIso);
    CroakleState.trackDate = dateIso;
    CroakleState.trackMonth = date.getMonth();
    CroakleState.trackYear = date.getFullYear();

    if (typeof CroakleSaveState === "function") CroakleSaveState();
    if (typeof CroakleRenderAll === "function") CroakleRenderAll();
  }

  function highlightSelectedDate() {
    if (typeof CroakleState === "undefined" || !CroakleState.trackDate) return;

    document.querySelectorAll(".CroakleSelectedDate").forEach((node) => node.classList.remove("CroakleSelectedDate"));
    document.querySelector('[data-page="track"]')?.querySelectorAll(`[data-date-iso="${CroakleState.trackDate}"]`).forEach((node) => {
      node.classList.add("CroakleSelectedDate");
    });
  }

  function openTrackDate(dateIso) {
    setTrackDate(dateIso);

    if (typeof CroakleSetPage === "function") {
      CroakleSetPage("track");
    }

    window.requestAnimationFrame(() => {
      highlightSelectedDate();
      document.querySelector(`[data-page="track"] [data-date-iso="${dateIso}"]`)?.scrollIntoView({ block: "center", inline: "center" });
    });
  }

  function toggleHabit(index) {
    if (typeof CroakleGetMonthDataFromDate !== "function") return;

    const data = CroakleGetMonthDataFromDate(getToday());
    const habit = data.habits?.[index];
    if (!habit) return;

    const dayIndex = getToday().getDate() - 1;
    habit.days[dayIndex] = !habit.days[dayIndex];

    if (typeof CroakleSaveState === "function") CroakleSaveState();
    if (typeof CroakleRenderAll === "function") CroakleRenderAll();
    renderHome();
  }

  function bindHome() {
    if (window.CroakleDashboardHomeBound) return;
    window.CroakleDashboardHomeBound = true;

    document.addEventListener("click", (event) => {
      const dateButton = event.target.closest("[data-dashboard-date]");
      if (dateButton) {
        event.preventDefault();
        openTrackDate(dateButton.dataset.dashboardDate);
        return;
      }

      const habitToggle = event.target.closest("[data-dashboard-habit-toggle]");
      if (habitToggle) {
        event.preventDefault();
        toggleHabit(Number(habitToggle.dataset.dashboardHabitToggle));
        return;
      }

      const addCardButton = event.target.closest("[data-home-card-open]");
      if (addCardButton) {
        event.preventDefault();
        openHomeCardModal();
        return;
      }

      const editButton = event.target.closest("[data-home-card-edit]");
      if (editButton) {
        event.preventDefault();
        openHomeCardModal(editButton.dataset.homeCardEdit);
        return;
      }

      const removeButton = event.target.closest("[data-home-card-remove]");
      if (removeButton) {
        event.preventDefault();
        removeHomeCard(removeButton.dataset.homeCardRemove);
        renderHome();
        return;
      }

      if (event.target.closest("[data-home-card-close]")) {
        event.preventDefault();
        closeHomeCardModal();
        return;
      }

      const colorButton = event.target.closest("[data-home-card-color]");
      if (colorButton) {
        event.preventDefault();
        const page = document.querySelector('[data-page="menu"]');
        const panel = page?.querySelector("[data-home-card-panel]");
        if (!panel) return;
        panel.dataset.selectedColor = colorButton.dataset.homeCardColor || "yellow";
        syncModal(page);
        return;
      }

      const iconButton = event.target.closest("[data-home-card-icon]");
      if (iconButton) {
        event.preventDefault();
        const page = document.querySelector('[data-page="menu"]');
        const panel = page?.querySelector("[data-home-card-panel]");
        if (!panel) return;
        panel.dataset.selectedIcon = iconButton.dataset.homeCardIcon || "✦";
        syncModal(page);
        return;
      }

      if (event.target.closest("[data-home-card-save]")) {
        event.preventDefault();
        saveHomeCardFromModal();
        return;
      }

      if (event.target.closest("[data-home-card-delete]")) {
        event.preventDefault();
        deleteHomeCardFromModal();
        return;
      }

      const pageButton = event.target.closest('[data-page="menu"] [data-page-target]');
      if (pageButton && typeof CroakleSetPage === "function") {
        event.preventDefault();
        CroakleSetPage(pageButton.dataset.pageTarget);
      }
    });

    document.addEventListener("change", (event) => {
      if (!event.target.closest("[data-home-card-habit]")) return;
      const page = document.querySelector('[data-page="menu"]');
      const panel = page?.querySelector("[data-home-card-panel]");
      const select = page?.querySelector("[data-home-card-habit]");
      if (!panel || !select) return;
      panel.dataset.selectedIcon = getHabitIcon(select.value);
      syncModal(page);
    });
  }

  function patchRender(name) {
    const original = window[name];

    if (typeof original !== "function" || original.CroakleDashboardPatched) return;

    window[name] = function patchedCroakleDashboardFunction(...args) {
      const result = original.apply(this, args);
      renderHome();
      window.requestAnimationFrame(highlightSelectedDate);
      return result;
    };

    window[name].CroakleDashboardPatched = true;
  }

  function init() {
    renderHome();
    bindHome();
    highlightSelectedDate();
    patchRender("CroakleRenderAll");
    patchRender("CroakleSaveState");
    patchRender("CroakleSaveProjectState");
  }

  window.addEventListener("storage", renderHome);
  window.requestAnimationFrame(init);
})();
