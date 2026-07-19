/**
 * KnowledgeBaseModal.tsx — 知识库管理弹窗
 * Calls backend getWikiPages() / getKnowledgeCards() via bridge.
 */

import { useState, useEffect } from "react";
import { getWikiPages, getKnowledgeCards } from "../bridge";

export default function KnowledgeBaseModal({ onClose }: { onClose: () => void }) {
  const [wikiPages, setWikiPages] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"wiki" | "cards">("wiki");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([getWikiPages(), getKnowledgeCards()])
      .then(([wiki, cards]: any) => {
        if (wiki?.mock || cards?.mock) setIsMock(true);
        setWikiPages(wiki?.pages || []);
        setCards(cards?.cards || []);
      })
      .catch(() => {
        setWikiPages([]);
        setCards([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredWiki = wikiPages.filter((w) =>
    !searchQuery || w.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCards = cards.filter((c) =>
    !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="icon-only">📚</span>
            <span className="text-only">知识库</span>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {isMock && (
            <div style={{ fontSize: 11, color: "var(--amber)", marginBottom: 12, padding: "6px 10px", background: "var(--bg-3)", borderRadius: 4 }}>
              ⚠ 演示模式 — 知识库生成器尚未接入，当前无内容
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            <button className={`tag ${tab === "wiki" ? "tag-active" : ""}`} onClick={() => setTab("wiki")} style={{ cursor: "pointer" }}>
              Wiki 页面 ({wikiPages.length})
            </button>
            <button className={`tag ${tab === "cards" ? "tag-active" : ""}`} onClick={() => setTab("cards")} style={{ cursor: "pointer" }}>
              知识卡片 ({cards.length})
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "var(--bg-1)",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-1)",
              fontSize: 13,
              marginBottom: 12,
            }}
          />

          {loading && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)", fontSize: 12 }}>加载中…</div>
          )}

          {!loading && tab === "wiki" && filteredWiki.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-3)" }}>
              <div style={{ fontSize: 48, marginBottom: 8, opacity: 0.3 }}>📖</div>
              <div>{isMock ? "知识库生成器尚未接入" : "暂无 Wiki 页面"}</div>
            </div>
          )}

          {!loading && tab === "wiki" && filteredWiki.map((w, i) => (
            <div key={i} className="card" style={{ padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{w.icon || "📄"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>{w.desc}</div>
                </div>
                {w.sections && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{w.sections} 节</span>}
              </div>
            </div>
          ))}

          {!loading && tab === "cards" && filteredCards.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-3)" }}>
              <div style={{ fontSize: 48, marginBottom: 8, opacity: 0.3 }}>🃏</div>
              <div>{isMock ? "知识卡片系统尚未接入" : "暂无知识卡片"}</div>
            </div>
          )}

          {!loading && tab === "cards" && filteredCards.map((c, i) => (
            <div key={i} className="card" style={{ padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>{c.desc}</div>
                </div>
                {c.confidence && (
                  <span className="tag tag-cyan" style={{ fontSize: 9 }}>{c.confidence}%</span>
                )}
              </div>
              {c.tag && <span className="tag" style={{ fontSize: 9 }}>{c.tag}</span>}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}
