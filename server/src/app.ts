import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

const app = express();

// ---------------------------------------------------------------------------
// グローバルミドルウェア
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ---------------------------------------------------------------------------
// ルーティング
// ---------------------------------------------------------------------------
app.use("/api", routes);

// ヘルスチェック
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// エラーハンドリング (最後に登録)
// ---------------------------------------------------------------------------
app.use(errorHandler);

export { app };
