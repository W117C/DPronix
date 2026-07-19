/**
 * StatusBar.tsx — 底部状态栏
 * 模型 | 模式 | token 上下/下行 | 缓存命中率 | Agent 状态
 */

import { useStore } from "../store";

export default function StatusBar() {
  const model = useStore((s) => s.model);
  const mode = useStore((s) => s.mode);
  const status = useStore((s) => s.status);
  const lastUsage = useStore((s) => s.lastUsage);
  const sessionCache = useStore((s) => s.sessionCache);
  const totalTokens = useStore((s) => s.totalTokens);

  const totalCache = sessionCache.hit + sessionCache.miss;
  const cacheRate = totalCache > 0 ? Math.round((sessionCache.hit / totalCache) * 100) : 0;

  return (
    <footer className="status-bar">
      <span className="status-dot" style={{ display: "none" }} />
      <span className={`status-dot ${status}`} />

      <span className="status-item" style={{ color: "var(--accent)" }}>
        {model}
      </span>

      <span className="status-item">
        模式: <span style={{
          color: mode === "plan" ? "var(--blue)" : mode === "act" ? "var(--amber)" : "var(--red)"
        }}>
          {mode}
        </span>
      </span>

      {lastUsage && (
        <>
          <span className="status-item" title="上一轮 Token">
            {lastUsage.prompt_tokens.toLocaleString()}↑ {lastUsage.completion_tokens.toLocaleString()}↓
          </span>
          <span className="status-item" title="推理 Token">
            🧠 {lastUsage.reasoning_tokens.toLocaleString()}
          </span>
        </>
      )}

      {totalCache > 0 && (
        <span className="status-item" title="缓存命中率">
          💡 {cacheRate}%
          <span style={{ color: "var(--text-muted)" }}>
            ({sessionCache.hit.toLocaleString()}/{totalCache.toLocaleString()})
          </span>
        </span>
      )}

      {totalTokens > 0 && (
        <span className="status-item" title="会话总 Token">
          Σ {totalTokens.toLocaleString()}
        </span>
      )}

      <span className="status-spacer" />

      <span className="status-item" style={{ color: "var(--text-3)" }}>
        DeepseekNova · DeepSeek 原生
      </span>
    </footer>
  );
}
