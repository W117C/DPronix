/**
 * Welcome.tsx — 欢迎屏（空状态）
 */

import { useStore } from "../store";

export default function Welcome() {
  const mode = useStore((s) => s.mode);
  const model = useStore((s) => s.model);

  const features = [
    { icon: "🧠", title: "自动记忆", desc: "跨会话保持上下文，自动提取技能" },
    { icon: "⚡", title: "6 个内置技能", desc: "前端开发、代码审查、第一性原理等" },
    { icon: "🔒", title: "沙箱执行", desc: "安全隔离，审批模式可控" },
    { icon: "📊", title: "Token 追踪", desc: "缓存命中率、成本实时显示" },
  ];

  return (
    <div style={{ padding: "40px 20px", maxWidth: "640px", margin: "0 auto" }}>
      <h1 style={{
        fontSize: "28px",
        fontWeight: 700,
        background: "linear-gradient(135deg, var(--accent), var(--cyan))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "8px",
      }}>
        DeepseekNova
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: "14px", marginBottom: "24px" }}>
        DeepSeek 原生 AI 编程 Agent · 模型: {model} · 模式: {mode}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
      }}>
        {features.map((f) => (
          <div key={f.title} className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{f.icon}</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)", marginBottom: "2px" }}>
              {f.title}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "24px",
        padding: "12px 16px",
        background: "var(--bg-2)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius-md)",
      }}>
        <div style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "4px" }}>快速开始</div>
        <div style={{ fontSize: "13px", color: "var(--text-2)" }}>
          输入消息开始对话，或使用 <code style={{ color: "var(--cyan)" }}>/</code> 触发 Slash 命令
        </div>
      </div>
    </div>
  );
}
