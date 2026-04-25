# TranscribeApp — フロントエンド

リアルタイム文字起こし＆議事録要約 Web アプリケーションのフロントエンドです。

## 技術スタック

| 技術 | 用途 |
|:---|:---|
| React 19 | UI フレームワーク |
| TypeScript | 型安全な開発 |
| Vite 8 | ビルドツール / 開発サーバー |
| React Router 7 | クライアントサイドルーティング |
| Zustand 5 | 状態管理 |
| Axios | HTTP クライアント |
| Azure Speech SDK | 音声認識・文字起こし |

## ディレクトリ構成

```
src/
├── lib/                         # ユーティリティ
│   └── api.ts                   # REST API クライアント（型付き）
├── features/                    # 機能別モジュール
│   ├── session/
│   │   └── stores/              # Zustand ストア
│   │       └── sessionStore.ts
│   ├── transcript/
│   │   ├── stores/
│   │   │   └── transcriptStore.ts
│   │   └── hooks/
│   │       ├── useSpeechTranscriber.ts  # Azure Speech SDK 管理
│   │       └── usePubSub.ts             # WebSocket 接続管理
│   └── summary/
│       └── stores/
│           └── summaryStore.ts
├── pages/                       # ページコンポーネント
│   ├── DashboardPage.tsx        # セッション一覧
│   ├── SessionCreatePage.tsx    # セッション作成フォーム
│   ├── SessionPage.tsx          # リアルタイム文字起こし画面
│   └── SummaryPage.tsx          # 議事録表示・エクスポート
├── router.tsx                   # ルーティング定義
├── App.tsx                      # ルートコンポーネント
├── main.tsx                     # エントリポイント
└── index.css                    # グローバルスタイル（デザインシステム）
```

## 画面一覧

| パス | 画面 | 概要 |
|:---|:---|:---|
| `/` | ダッシュボード | セッション一覧、新規作成ボタン |
| `/sessions/new` | セッション作成 | タイトル・参加者を設定して作成 |
| `/sessions/:id` | セッション | リアルタイム文字起こし表示、録音操作、参加者一覧 |
| `/sessions/:id/summary` | 議事録 | AI 生成議事録の表示・Markdown エクスポート |

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動 (http://localhost:5173)
npm run dev

# 本番ビルド
npm run build

# ビルドプレビュー
npm run preview

# Lint
npm run lint
```

## 環境変数

`client/.env` を作成して設定します（任意）：

```env
# バックエンド API のベース URL（デフォルト: http://localhost:3001/api）
VITE_API_BASE_URL=http://localhost:3001/api
```

## バックエンド API との接続

フロントエンドは `src/lib/api.ts` を通じてバックエンド API と通信します。  
デフォルトでは `http://localhost:3001/api` に接続するため、バックエンドが起動していることを確認してください。

```bash
# バックエンド起動（別ターミナル）
cd ../server
npm run dev
```

## 主要なカスタムフック

| フック | ファイル | 責務 |
|:---|:---|:---|
| `useSpeechTranscriber` | `features/transcript/hooks/` | Azure Speech SDK の初期化・音声キャプチャ・文字起こし結果受信 |
| `usePubSub` | `features/transcript/hooks/` | Web PubSub への WebSocket 接続・メッセージ受信・自動再接続 |
