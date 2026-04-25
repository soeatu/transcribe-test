import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../features/session/stores/sessionStore";

export function SessionCreatePage() {
  const navigate = useNavigate();
  const { createSession } = useSessionStore();

  const [title, setTitle] = useState("");
  const [participantNames, setParticipantNames] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addParticipant = () => setParticipantNames([...participantNames, ""]);
  const removeParticipant = (index: number) =>
    setParticipantNames(participantNames.filter((_, i) => i !== index));
  const updateParticipant = (index: number, name: string) =>
    setParticipantNames(participantNames.map((n, i) => (i === index ? name : n)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validNames = participantNames.filter((n) => n.trim());
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    if (validNames.length === 0) {
      setError("参加者を1名以上入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await createSession({
        title: title.trim(),
        participants: validNames.map((name) => ({ name: name.trim() })),
      });
      navigate(`/sessions/${session.id}`);
    } catch (err: any) {
      setError(err.message || "セッションの作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1 className="page__title">新規セッション作成</h1>

      <form onSubmit={handleSubmit} className="card" style={{ padding: "var(--space-xl)" }}>
        {error && (
          <p style={{ color: "var(--color-danger)", marginBottom: "var(--space-md)" }}>
            {error}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="title">会議タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 週次定例会議"
          />
        </div>

        <div className="form-group">
          <label>参加者</label>
          {participantNames.map((name, i) => (
            <div key={i} style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
              <input
                type="text"
                value={name}
                onChange={(e) => updateParticipant(i, e.target.value)}
                placeholder={`参加者 ${i + 1}`}
              />
              {participantNames.length > 1 && (
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => removeParticipant(i)}
                  style={{ padding: "var(--space-sm)" }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn--secondary" onClick={addParticipant}>
            ＋ 参加者を追加
          </button>
        </div>

        <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn--secondary" onClick={() => navigate("/")}>
            キャンセル
          </button>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "作成中..." : "セッションを作成"}
          </button>
        </div>
      </form>
    </div>
  );
}
