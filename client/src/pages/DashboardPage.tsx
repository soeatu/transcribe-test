import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSessionStore } from "../features/session/stores/sessionStore";

const statusLabel: Record<string, string> = {
  preparing: "準備中",
  active: "進行中",
  ended: "終了",
};

export function DashboardPage() {
  const { sessions, isLoading, error, fetchSessions } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="page">
      <div className="page__actions">
        <h1 className="page__title">セッション一覧</h1>
        <Link to="/sessions/new" className="btn btn--primary">
          ＋ 新規セッション作成
        </Link>
      </div>

      {error && <p style={{ color: "var(--color-danger)" }}>{error}</p>}

      {isLoading ? (
        <div className="loading">
          <div className="loading__spinner" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🎙️</div>
          <p className="empty-state__text">
            セッションがまだありません。
            <br />
            新規作成して会議を始めましょう。
          </p>
        </div>
      ) : (
        <div className="grid grid--sessions">
          {sessions.map((session) => (
            <Link
              to={`/sessions/${session.id}`}
              key={session.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  <h3 className="card__title">{session.title}</h3>
                  <span className={`badge badge--${session.status}`}>
                    <span className="badge__dot" />
                    {statusLabel[session.status]}
                  </span>
                </div>
                <div className="card__meta">
                  <span>👥 {session.participants.length}名</span>
                  <span>🌐 {session.language}</span>
                  <span>
                    📅{" "}
                    {new Date(session.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
