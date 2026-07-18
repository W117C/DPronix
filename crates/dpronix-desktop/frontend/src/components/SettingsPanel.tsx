/**
 * SettingsPanel — floating overlay for thinking toggle, effort, new session.
 *
 * Extracted from the old App.tsx inline settings div that was wedged into
 * the message stream. Now a proper overlay with dp-* classes.
 */
interface SettingsPanelProps {
  thinkingEnabled: boolean;
  onToggleThinking: () => void;
  effort: string;
  onEffortChange: (v: string) => void;
  effortLevels: string[];
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
  onNewSession: () => void;
  onClose: () => void;
}

export default function SettingsPanel({
  thinkingEnabled,
  onToggleThinking,
  effort,
  onEffortChange,
  effortLevels,
  theme,
  onThemeChange,
  onNewSession,
  onClose,
}: SettingsPanelProps) {
  return (
    <>
      {/* click-away backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
        }}
        aria-hidden="true"
      />
      <div className="dp-settings" role="dialog" aria-label="Settings">
        <p className="title">Settings</p>

        <div className="field">
          <span className="lbl">Thinking mode</span>
          <button
            className="toggle"
            data-on={thinkingEnabled}
            onClick={onToggleThinking}
            aria-label="Toggle thinking mode"
          />
        </div>

        <div className="field">
          <span className="lbl">Effort</span>
          <select value={effort} onChange={(e) => onEffortChange(e.target.value)}>
            {effortLevels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <span className="lbl">Theme</span>
          <div style={{ display: "flex", gap: 4 }}>
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                className={`dp-btn${theme === t ? " primary" : ""}`}
                style={{ padding: "4px 10px", fontSize: 12 }}
                onClick={() => onThemeChange(t)}
              >
                {t === "dark" ? "Dark" : "Light"}
              </button>
            ))}
          </div>
        </div>

        <div className="footer">
          <button className="dp-btn" onClick={onNewSession}>
            New Session
          </button>
          <button className="dp-btn primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}
