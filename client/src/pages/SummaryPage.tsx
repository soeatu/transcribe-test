import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSummaryStore } from "../features/summary/stores/summaryStore";

export function SummaryPage() {
  const { id } = useParams<{ id: string }>();
  const { summary, isGenerating, error, fetchSummary } = useSummaryStore();

  useEffect(() => {
    if (id) fetchSummary(id);
  }, [id, fetchSummary]);

  const handleExportMarkdown = () => {
    if (!summary) return;
    const md = [
      `# ${summary.title}`,
      `\n**日付**: ${summary.meetingDate}`,
      `**参加者**: ${summary.participants.join("、")}`,
      `\n## 議題`,
      ...summary.agenda.map((a) => `- ${a}`),
      `\n## 決定事項`,
      ...summary.decisions.map((d) => `- ${d}`),
      `\n## アクションアイテム`,
      ...summary.actionItems.map(
        (ai) => `- **${ai.assignee}**: ${ai.task}${ai.dueDate ? ` (期限: ${ai.dueDate})` : ""}`
      ),
      `\n## 議論の要旨`,
      summary.discussionSummary,
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summary.title || "議事録"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <div className="page" style={{ textAlign: "center" }}>
        <div className="loading">
          <div className="loading__spinner" />
        </div>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-md)" }}>
          AI が議事録を生成しています...
        </p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="page">
        <Link to={`/sessions/${id}`} style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          ← セッションに戻る
        </Link>
        <div className="empty-state" style={{ marginTop: "var(--space-xl)" }}>
          <div className="empty-state__icon">📄</div>
          <p className="empty-state__text">
            {error || "議事録がまだ生成されていません"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <Link to={`/sessions/${id}`} style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          ← セッションに戻る
        </Link>
        <button className="btn btn--secondary" onClick={handleExportMarkdown}>
          📥 Markdown エクスポート
        </button>
      </div>

      <div className="summary">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "var(--space-sm)" }}>
          {summary.title}
        </h1>
        <div className="card__meta" style={{ marginBottom: "var(--space-xl)" }}>
          <span>📅 {summary.meetingDate}</span>
          <span>👥 {summary.participants.join("、")}</span>
          <span>🤖 {summary.model}</span>
        </div>

        <div className="summary__section">
          <h3 className="summary__section-title">📌 議題</h3>
          <ul className="summary__list">
            {summary.agenda.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="summary__section">
          <h3 className="summary__section-title">✅ 決定事項</h3>
          <ul className="summary__list">
            {summary.decisions.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="summary__section">
          <h3 className="summary__section-title">📋 アクションアイテム</h3>
          {summary.actionItems.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th style={{ textAlign: "left", padding: "var(--space-sm)" }}>担当者</th>
                  <th style={{ textAlign: "left", padding: "var(--space-sm)" }}>タスク</th>
                  <th style={{ textAlign: "left", padding: "var(--space-sm)" }}>期限</th>
                </tr>
              </thead>
              <tbody>
                {summary.actionItems.map((ai, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(42,42,58,0.5)" }}>
                    <td style={{ padding: "var(--space-sm)", fontWeight: 500 }}>{ai.assignee}</td>
                    <td style={{ padding: "var(--space-sm)" }}>{ai.task}</td>
                    <td style={{ padding: "var(--space-sm)", color: "var(--color-text-secondary)" }}>
                      {ai.dueDate || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "var(--color-text-secondary)" }}>なし</p>
          )}
        </div>

        <div className="summary__section">
          <h3 className="summary__section-title">💬 議論の要旨</h3>
          <p style={{ lineHeight: 1.8 }}>{summary.discussionSummary}</p>
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: "var(--space-xl)" }}>
          生成日時: {new Date(summary.generatedAt).toLocaleString("ja-JP")}
        </div>
      </div>
    </div>
  );
}
