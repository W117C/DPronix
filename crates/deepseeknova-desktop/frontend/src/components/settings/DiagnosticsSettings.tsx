import { useState } from "react";
import { runDiagnostics } from "../../bridge";

export default function DiagnosticsSettings({}: any) {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      const data = await runDiagnostics();
      setIsMock(data?.mock === true);
      setResults(data?.results || []);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  };

  const statusIcon = (s: string) =>
    s === "pass" ? "✓ 正常" : s === "warn" ? "⚠ 警告" : s === "pending" ? "○ 待检" : "✕ 错误";
  const statusClass = (s: string) =>
    s === "pass" ? "ready" : s === "warn" ? "running" : s === "pending" ? "idle" : "error";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: "var(--text-3)" }}>系统体检 — 检查所有组件状态</span>
        <button className="btn btn-primary" onClick={handleRun} disabled={running} style={{ fontSize: 11 }}>
          {running ? "检测中…" : "开始体检"}
        </button>
      </div>

      {isMock && results.length > 0 && (
        <div style={{ fontSize: 10, color: "var(--amber)", marginBottom: 8, padding: "4px 8px", background: "var(--bg-3)", borderRadius: 4 }}>
          ⚠ 演示数据 — 部分检查项尚未接入真实后端
        </div>
      )}

      {error && (
        <div style={{ fontSize: 10, color: "var(--red)", marginBottom: 8 }}>检测失败: {error}</div>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {results.map((r, i) => (
            <div key={i} className="card" style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <span className={`status-dot ${statusClass(r.status)}`} />
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-1)", flex: 1 }}>{r.name}</span>
              <span style={{ fontSize: 10, color: r.status === "pass" ? "var(--green)" : r.status === "warn" ? "var(--amber)" : r.status === "pending" ? "var(--text-3)" : "var(--red)" }}>
                {statusIcon(r.status)}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{r.detail}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11 }}>
            <span style={{ color: "var(--green)" }}>✓ {results.filter(r => r.status === "pass").length} 正常</span>
            <span style={{ color: "var(--amber)" }}>⚠ {results.filter(r => r.status === "warn").length} 警告</span>
            <span style={{ color: "var(--text-3)" }}>○ {results.filter(r => r.status === "pending").length} 待检</span>
            <span style={{ color: "var(--red)" }}>✕ {results.filter(r => r.status === "error").length} 错误</span>
          </div>
        </div>
      )}

      {results.length === 0 && !running && !error && (
        <div className="empty-state" style={{ padding: 20 }}>
          <div className="empty-state-icon">🔬</div>
          <div className="empty-state-text">点击"开始体检"检查系统状态</div>
        </div>
      )}
    </div>
  );
}
