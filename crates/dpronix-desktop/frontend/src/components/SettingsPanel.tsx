import { useEffect, useState } from "react";
import { listProviders, getConfig } from "../bridge";
import type { Capabilities, ProviderSummary } from "../types";

interface SettingsPanelProps {
  capabilities: Capabilities | null;
  onClose: () => void;
}

/**
 * Settings & provider configuration panel.
 *
 * Surfaces the backend-resolved configuration that was previously only
 * reachable through the `list_providers` / `get_config` commands: the
 * configured LLM providers, the agent's DeepSeek-V4 capability flags, and
 * the raw effective config (read-only). This is the desktop counterpart of
 * `dpronix config show`.
 */
export default function SettingsPanel({ capabilities, onClose }: SettingsPanelProps) {
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [configJson, setConfigJson] = useState<string>("");
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    listProviders().then(setProviders).catch(console.error);
    getConfig().then(setConfigJson).catch(console.error);
  }, []);

  const caps: Array<[string, boolean | number | string]> = capabilities
    ? [
        ["thinking", capabilities.supports_thinking],
        ["reasoning_effort", capabilities.supports_reasoning_effort],
        ["tools", capabilities.supports_tools],
        ["mcp", capabilities.supports_mcp],
        ["images", capabilities.supports_images],
        ["max_steps", capabilities.max_steps_default],
      ]
    : [];

  return (
    <div className="skills-panel">
      <div className="skills-panel-header">
        <h3>Settings &amp; Providers</h3>
        <button className="btn-icon-small" onClick={onClose}>✕</button>
      </div>

      {/* Providers */}
      {providers.length === 0 && (
        <p className="muted">No providers configured. Edit dpronix.toml to add one.</p>
      )}
      {providers.map((p) => (
        <div key={p.name} className="skill-card">
          <strong>{p.name}</strong> <span className="tag">{p.kind}</span>
          <div className="skill-tags">
            {p.model && <span className="tag" title="model">{p.model}</span>}
            {p.base_url && <span className="tag" title="base_url">{p.base_url}</span>}
          </div>
        </div>
      ))}

      {/* Capabilities */}
      {caps.length > 0 && (
        <div className="skill-card">
          <strong>Capabilities</strong>
          <div className="skill-tags">
            {caps.map(([k, v]) => (
              <span key={k} className="tag" title={String(v)}>
                {k}: {typeof v === "boolean" ? (v ? "✓" : "✗") : v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Raw effective config (read-only) */}
      {configJson && (
        <div className="skill-card">
          <button className="btn-icon-small" onClick={() => setShowRaw(!showRaw)}>
            {showRaw ? "▼" : "▶"} raw config
          </button>
          {showRaw && (
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, marginTop: 6, maxHeight: 220, overflow: "auto" }}>
              {configJson}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
