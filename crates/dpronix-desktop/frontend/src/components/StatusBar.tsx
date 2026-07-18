/**
 * StatusBar — bottom bar: token counts, cache rate, agent state.
 */
import type { AgentStatus } from "../types";

interface StatusBarProps {
  tokensUp: number;
  tokensDown: number;
  cachePercent: number;
  status: AgentStatus;
}

export default function StatusBar({
  tokensUp,
  tokensDown,
  cachePercent,
  status,
}: StatusBarProps) {
  return (
    <footer className="dp-statusbar">
      <span className="stat">
        <span className="arrow">↑</span> {tokensUp.toLocaleString()}
      </span>
      <span className="sep" />
      <span className="stat">
        <span className="arrow">↓</span> {tokensDown.toLocaleString()}
      </span>
      <span className="sep" />
      <span className="stat">Cache {cachePercent}%</span>

      <span className="grow" />

      <span className={`state ${status}`}>
        <span className="dot" aria-hidden="true" />
        {status === "ready" ? "Ready" : "Running"}
      </span>
    </footer>
  );
}
