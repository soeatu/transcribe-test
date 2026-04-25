import { Request, Response, NextFunction } from "express";

/**
 * 簡易認証ミドルウェア（MVP）
 * 将来的には Azure AD / OAuth 等に置き換え予定
 * 現時点ではすべてのリクエストを許可する
 */
export function auth(_req: Request, _res: Response, next: NextFunction): void {
  // MVP: 認証をバイパス
  next();
}
