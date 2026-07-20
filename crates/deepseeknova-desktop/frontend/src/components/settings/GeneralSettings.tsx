import { useState } from "react";
import { SettingRow } from "./Shared";
import { useI18n, LOCALES, type Locale } from "../../i18n";

export default function GeneralSettings() {
  const { locale, setLocale, t } = useI18n();
  const [apiKey, setApiKey] = useState("sk-••••••••••••••••");
  const [baseUrl, setBaseUrl] = useState("https://api.deepseek.com");
  const [defaultModel, setDefaultModel] = useState("deepseek-v4-flash");
  const [fontSize, setFontSize] = useState(13);
  const [fontFamily, setFontFamily] = useState("system");
  const [autoSave, setAutoSave] = useState(true);
  const [tabRestore, setTabRestore] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <SettingRow label={t("general.language")} desc={t("general.languageDesc")}>
        <div style={{ display: "flex", gap: 6 }}>
          {LOCALES.map((l) => (
            <button
              key={l.id}
              className={`btn ${locale === l.id ? "btn-primary" : ""}`}
              onClick={() => setLocale(l.id as Locale)}
              style={{ padding: "4px 12px", fontSize: 11 }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </SettingRow>
      <SettingRow label={t("general.apiKey")} desc={t("general.apiKeyDesc")}>
        <input className="input" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={{ width: 260 }} />
      </SettingRow>
      <SettingRow label={t("general.baseUrl")} desc={t("general.baseUrlDesc")}>
        <input className="input" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} style={{ width: 260 }} />
      </SettingRow>
      <SettingRow label={t("general.model")} desc={t("general.modelDesc")}>
        <select className="input" value={defaultModel} onChange={(e) => setDefaultModel(e.target.value)} style={{ width: 200 }}>
          <option value="deepseek-v4-flash">DeepSeek v4 Flash</option>
          <option value="deepseek-v4-pro">DeepSeek v4 Pro</option>
          <option value="deepseek-coder">DeepSeek Coder</option>
          <option value="deepseek-reasoner">DeepSeek Reasoner R1</option>
        </select>
      </SettingRow>
      <SettingRow label={t("general.fontSize")} desc={`${fontSize}px`}>
        <input type="range" min="11" max="18" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ width: 200 }} />
      </SettingRow>
      <SettingRow label={t("general.fontFamily")} desc="">
        <select className="input" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ width: 200 }}>
          <option value="system">System</option>
          <option value="sans">Sans-serif</option>
          <option value="mono">Monospace</option>
        </select>
      </SettingRow>
      <SettingRow label={t("general.autoSave")} desc={t("general.autoSaveDesc")}>
        <label className="toggle-switch"><input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} /><span className="toggle-slider"></span></label>
      </SettingRow>
      <SettingRow label={t("general.tabRestore")} desc={t("general.tabRestoreDesc")}>
        <label className="toggle-switch"><input type="checkbox" checked={tabRestore} onChange={(e) => setTabRestore(e.target.checked)} /><span className="toggle-slider"></span></label>
      </SettingRow>
    </div>
  );
}

