import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSessionStore } from "../features/session/stores/sessionStore";
import { useTranscriptStore } from "../features/transcript/stores/transcriptStore";
import { useSpeechTranscriber } from "../features/transcript/hooks/useSpeechTranscriber";
import { useSummaryStore } from "../features/summary/stores/summaryStore";
import { transcriptApi } from "../lib/api";

const SPEAKER_COLORS = [
  "var(--speaker-1)", "var(--speaker-2)", "var(--speaker-3)",
  "var(--speaker-4)", "var(--speaker-5)", "var(--speaker-6)",
];

function getSpeakerColor(speakerId: string): string {
  let hash = 0;
  for (const ch of speakerId) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return SPEAKER_COLORS[Math.abs(hash) % SPEAKER_COLORS.length];
}

function formatTime(offsetMs: number): string {
  const totalSec = Math.floor(offsetMs / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const statusLabel: Record<string, string> = {
  preparing: "準備中",
  active: "進行中",
  ended: "終了",
};

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession, updateSession } = useSessionStore();
  const { transcripts, interimText, isRecording, clearTranscripts, setTranscripts } = useTranscriptStore();
  const { isGenerating, generateSummary } = useSummaryStore();
  const { start, stop, error: speechError } = useSpeechTranscriber(id || "");
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // セッション変更時: ストアクリア → 既存データ読み込み
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    clearTranscripts();
    fetchSession(id);

    transcriptApi.getAll(id).then((data) => {
      if (!cancelled) {
        setTranscripts(data);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto scroll
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts, interimText]);

  const handleToggleRecord = async () => {
    if (!id) return;
    if (isRecording) {
      await stop();
    } else {
      if (currentSession?.status === "preparing") {
        await updateSession(id, { status: "active" });
      }
      await start();
    }
  };

  const handleGenerateSummary = async () => {
    if (!id) return;
    await updateSession(id, { status: "ended" });
    await generateSummary(id);
    navigate(`/sessions/${id}/summary`);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("共有URLをクリップボードにコピーしました");
  };

  if (!currentSession) {
    return (
      <div className="loading">
        <div className="loading__spinner" />
      </div>
    );
  }

  return (
    <div className="session-layout">
      {/* Header */}
      <div className="session-layout__header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link to="/" style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
              ← ダッシュボード
            </Link>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "var(--space-xs)" }}>
              {currentSession.title}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <span className={`badge badge--${currentSession.status}`}>
              <span className="badge__dot" />
              {statusLabel[currentSession.status]}
            </span>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "0.8125rem" }}>
              👥 {currentSession.participants.length}名
            </span>
          </div>
        </div>
      </div>

      {/* Transcript Panel */}
      <div className="session-layout__transcript">
        {speechError && (
          <p style={{ color: "var(--color-danger)", padding: "var(--space-sm)" }}>
            {speechError}
          </p>
        )}

        {transcripts.length === 0 && !interimText ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎤</div>
            <p className="empty-state__text">
              録音を開始すると、ここに文字起こし結果が表示されます
            </p>
          </div>
        ) : (
          <>
            {transcripts.map((t) => (
              <div className="transcript-item" key={t.id}>
                <span
                  className="transcript-item__speaker"
                  style={{ color: getSpeakerColor(t.speakerId) }}
                >
                  {t.speakerName}
                </span>
                <span className="transcript-item__text">{t.text}</span>
                <span className="transcript-item__time">
                  {formatTime(t.offsetMs)}
                </span>
              </div>
            ))}
            {interimText && (
              <div className="transcript-item transcript-item--interim">
                <span className="transcript-item__speaker">...</span>
                <span className="transcript-item__text">{interimText}</span>
              </div>
            )}
          </>
        )}
        <div ref={transcriptEndRef} />
      </div>

      {/* Sidebar: Participants */}
      <div className="session-layout__sidebar">
        <p className="participant-list__title">参加者</p>
        {currentSession.participants.map((p, i) => (
          <div className="participant-item" key={p.id}>
            <div
              className="participant-item__avatar"
              style={{ background: SPEAKER_COLORS[i % SPEAKER_COLORS.length] }}
            >
              {p.name.charAt(0)}
            </div>
            <span className="participant-item__name">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="session-layout__controls">
        <div className="control-bar">
          <button
            className={`btn btn--record ${isRecording ? "active" : ""}`}
            onClick={handleToggleRecord}
            disabled={currentSession.status === "ended"}
          >
            {isRecording ? "⏹ 録音停止" : "🎙 録音開始"}
          </button>

          <button
            className="btn btn--primary"
            onClick={handleGenerateSummary}
            disabled={transcripts.length === 0 || isGenerating}
          >
            {isGenerating ? "生成中..." : "📋 要約生成"}
          </button>

          <button className="btn btn--secondary" onClick={handleShare}>
            ↗ 共有
          </button>
        </div>
      </div>
    </div>
  );
}
