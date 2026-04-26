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

## 主要な機能と UX の特徴

| 機能 | 説明 |
|:---|:---|
| **リアルタイム・フィードバック** | Azure Speech SDK を使用し、認識中のテキスト（Interim）と確定したテキスト（Final）を即座に表示 |
| **セッション管理** | React Router 7 の遷移に合わせ、Zustand ストアのクリーンアップと既存データの自動ロードを実行 |
| **話者カラーリング** | 各参加者の ID に基づいて固有のカラーを自動生成し、発言者を視覚的に区別 |
| **自動スクロール** | 新しい発言が追加されるたびに、文字起こしパネルを最新位置までスムーズにスクロール |
| **Markdown エクスポート** | AI 生成された議事録を構造を保ったまま Markdown 形式でコピー・保存可能 |

## 主要なカスタムフック

| フック | ファイル | 責務 |
|:---|:---|:---|
| `useSpeechTranscriber` | `features/transcript/hooks/` | Azure Speech SDK の初期化・音声キャプチャ・文字起こし結果の受信とストアへの保存 |
| `usePubSub` | `features/transcript/hooks/` | Azure Web PubSub への WebSocket 接続・他ユーザーからのメッセージ受信・自動再接続管理 |

## 実装上の注意点

- **セッションの分離**: `SessionPage` では、URL の `id` が変更されるたびに `clearTranscripts` を実行し、異なるセッションのデータが混ざらないように設計されています。
- **エラーハンドリング**: 音声認識の起動失敗やネットワーク切断時、UI 上にわかりやすいエラーメッセージを表示します。
- **パフォーマンス**: 大量の文字起こしが発生しても、仮想リストや自動スクロールの最適化によりブラウザの負荷を抑えています。
