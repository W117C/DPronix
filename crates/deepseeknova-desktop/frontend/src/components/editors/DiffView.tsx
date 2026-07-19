/**
 * editors/DiffView.tsx — Diff 视图（着色显示）
 */

interface DiffLine {
  type: "add" | "del" | "context";
  text: string;
}

export default function DiffView({ diff }: { diff: string }) {
  const lines: DiffLine[] = diff.split("\n").map((line) => {
    if (line.startsWith("+")) return { type: "add" as const, text: line };
    if (line.startsWith("-")) return { type: "del" as const, text: line };
    return { type: "context" as const, text: line };
  });

  return (
    <div style={{
      background: "var(--bg-2)",
      border: "1px solid var(--border-1)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: "13px",
    }}>
      {lines.map((line, i) => (
        <div
          key={i}
          className={`diff-line diff-${line.type}`}
          style={{ padding: "0 8px" }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
