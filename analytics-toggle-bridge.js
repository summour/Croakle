(() => {
  const CroakleAnalyticsRawDataHiddenStoreKey = "CroakleAnalyticsNumbersHiddenV1";

  function CroakleGetRawDataHidden() {
    return localStorage.getItem(CroakleAnalyticsRawDataHiddenStoreKey) === "true";
  }

  function CroakleSaveRawDataHidden(hidden) {
    localStorage.setItem(CroakleAnalyticsRawDataHiddenStoreKey, String(hidden));
  }

  function CroakleInjectAnalyticsRawDataStyles() {
    if (document.querySelector("#CroakleAnalyticsRawDataStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleAnalyticsRawDataStyles";
    style.textContent = `
      .CroakleAnalyticsNumbersHidden .CroakleAnalyticsLegend,
      .CroakleAnalyticsNumbersHidden .CroakleAnalyticsPointValue {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleGetAnalyticsCard() {
    return document.querySelector('[data-page="analysis"] .CroakleCard');
  }

  function CroakleRemoveOldAnalyticsPageToggle() {
    document.querySelector("#CroakleAnalyticsToggleNumbers")?.remove();
  }

  function CroakleApplyRawDataVisibility() {
    const hidden = CroakleGetRawDataHidden();
    CroakleGetAnalyticsCard()?.classList.toggle("CroakleAnalyticsNumbersHidden", hidden);

    document.querySelectorAll("[data-settings-raw-data]").forEach((input) => {
      input.checked = !hidden;
    });
  }

  function CroakleCreateRawDataSettingsGroup() {
    return `
      <section class="CroakleSettingsGroup" aria-label="Stats display settings" data-raw-data-settings-group>
        <p class="CroakleSettingsGroupTitle">Stats</p>
        <label class="CroakleSettingsToggleRow">
          <span class="CroakleSettingsText">
            <strong>Raw Data</strong>
            <span>เปิด = แสดงข้อมูลดิบใน Stats, ปิด = ซ่อนรายการข้อมูลดิบ</span>
          </span>
          <input class="CroakleSettingsSwitch" type="checkbox" data-settings-raw-data ${CroakleGetRawDataHidden() ? "" : "checked"} />
        </label>
      </section>
    `;
  }

  function CroakleInjectRawDataSettings() {
    const settingsBody = document.querySelector(".CroakleSettingsBody");

    if (!settingsBody || settingsBody.querySelector("[data-raw-data-settings-group]")) {
      return;
    }

    const exportGroup = settingsBody.querySelector('[aria-label="Export and backup settings"]');

    if (exportGroup) {
      exportGroup.insertAdjacentHTML("beforebegin", CroakleCreateRawDataSettingsGroup());
    } else {
      settingsBody.insertAdjacentHTML("beforeend", CroakleCreateRawDataSettingsGroup());
    }

    CroakleApplyRawDataVisibility();
  }

  function CroakleHandleRawDataSettingChange(event) {
    const input = event.target.closest("[data-settings-raw-data]");

    if (!input) {
      return;
    }

    CroakleSaveRawDataHidden(!input.checked);
    CroakleApplyRawDataVisibility();
  }

  function CroaklePatchSettingsRenderer() {
    if (window.CroakleRawDataSettingsRendererPatched || typeof window.CroakleRenderSettingsPanel !== "function") {
      return;
    }

    window.CroakleRawDataSettingsRendererPatched = true;
    const originalRenderSettingsPanel = window.CroakleRenderSettingsPanel;

    window.CroakleRenderSettingsPanel = function CroakleRenderSettingsPanelWithRawData(...args) {
      const result = originalRenderSettingsPanel.apply(this, args);
      CroakleInjectRawDataSettings();
      return result;
    };
  }

  function CroaklePatchPageNavigation() {
    if (window.CroakleRawDataNavigationPatched || typeof window.CroakleSetPage !== "function") {
      return;
    }

    window.CroakleRawDataNavigationPatched = true;
    const originalSetPage = window.CroakleSetPage;

    window.CroakleSetPage = function CroakleSetPageWithRawDataSettings(pageName) {
      const result = originalSetPage.apply(this, arguments);

      if (pageName === "analysis") {
        CroakleRemoveOldAnalyticsPageToggle();
        CroakleApplyRawDataVisibility();
      }

      if (pageName === "settings") {
        CroakleInjectRawDataSettings();
      }

      return result;
    };
  }

  function CroakleBindRawDataSetting() {
    if (window.CroakleRawDataSettingBound) {
      return;
    }

    window.CroakleRawDataSettingBound = true;
    document.addEventListener("change", CroakleHandleRawDataSettingChange);
  }

  function CroakleInitRawDataSetting() {
    CroakleInjectAnalyticsRawDataStyles();
    CroakleRemoveOldAnalyticsPageToggle();
    CroaklePatchSettingsRenderer();
    CroaklePatchPageNavigation();
    CroakleInjectRawDataSettings();
    CroakleApplyRawDataVisibility();
    CroakleBindRawDataSetting();
  }

  window.CroakleApplyRawDataVisibility = CroakleApplyRawDataVisibility;
  window.requestAnimationFrame(CroakleInitRawDataSetting);
})();
