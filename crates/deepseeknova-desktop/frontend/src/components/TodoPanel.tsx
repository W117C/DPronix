/**
 * TodoPanel.tsx — 任务进度追踪
 */

import { useState } from "react";
import { useStore } from "../store";

export default function TodoPanel() {
  const todos = useStore((s) => s.todos);
  const toggleTodo = useStore((s) => s.toggleTodo);
  const addTodo = useStore((s) => s.addTodo);
  const [input, setInput] = useState("");

  const pending = todos.filter((t) => !t.done).length;
  const completed = todos.filter((t) => t.done).length;

  return (
    <div style={{ height: "100%", overflow: "auto", padding: "8px" }}>
      <div className="sidebar-header">
        <h3>任务追踪</h3>
        <span className="tag">{pending} 待办</span>
      </div>

      {/* 进度条 */}
      {todos.length > 0 && (
        <div style={{ padding: "4px 0 8px" }}>
          <div style={{
            height: "4px",
            background: "var(--bg-3)",
            borderRadius: "2px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${(completed / todos.length) * 100}%`,
              background: "var(--green)",
              borderRadius: "2px",
              transition: "width 0.3s",
            }} />
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "4px" }}>
            {completed}/{todos.length} 已完成
          </div>
        </div>
      )}

      {/* 新增 TODO */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
        <input
          className="input"
          placeholder="新增任务…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              addTodo(input.trim());
              setInput("");
            }
          }}
        />
        <button
          className="btn"
          onClick={() => {
            if (input.trim()) {
              addTodo(input.trim());
              setInput("");
            }
          }}
        >+</button>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">暂无任务<br/>Agent 执行时自动追踪</div>
        </div>
      ) : (
        todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <div
              className={`todo-checkbox ${todo.done ? "done" : ""}`}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.done && "✓"}
            </div>
            <span className={`todo-text ${todo.done ? "done" : ""}`}>
              {todo.text}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
