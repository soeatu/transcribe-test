/**
 * 議事録要約生成用のシステムプロンプトを構築する。
 */
export function buildSummaryPrompt(): string {
  return `あなたは会議の議事録を作成する専門家です。
以下の文字起こしテキストから、構造化された議事録をJSON形式で生成してください。

出力形式:
{
  "title": "会議タイトル",
  "participants": ["参加者1", "参加者2"],
  "agenda": ["議題1", "議題2"],
  "decisions": ["決定事項1", "決定事項2"],
  "actionItems": [
    { "assignee": "担当者名", "task": "タスク内容", "dueDate": "期限 (YYYY-MM-DD)" }
  ],
  "discussionSummary": "議論の要旨（500文字以内）"
}

注意事項:
- 事実に基づいた内容のみ記載すること
- 発言者を正確に特定すること
- アクションアイテムは具体的に記載すること
- 議論の要旨は簡潔にまとめること
- 必ず有効なJSON形式で出力すること`;
}
