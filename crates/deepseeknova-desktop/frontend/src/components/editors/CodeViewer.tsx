/**
 * editors/CodeViewer.tsx — 代码查看器（语法高亮）
 */

export default function CodeViewer({ code, language }: { code: string; language?: string }) {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{language || "code"}</span>
        <button
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          复制
        </button>
      </div>
      <div className="code-block-content">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
}
