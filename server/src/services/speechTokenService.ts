import { env } from "../config/env";
import { logger } from "../utils/logger";

interface SpeechToken {
  token: string;
  region: string;
  expiresAt: string;
}

export class SpeechTokenService {
  async getToken(): Promise<SpeechToken> {
    if (!env.azureSpeechKey || !env.azureSpeechRegion) {
      throw new Error("Azure Speech Service の接続情報が未設定です");
    }

    const tokenUrl = `https://${env.azureSpeechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": env.azureSpeechKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Speech token 取得失敗: ${response.status} ${response.statusText}`
      );
    }

    const token = await response.text();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    logger.debug("Speech token issued");
    return { token, region: env.azureSpeechRegion, expiresAt };
  }
}

export const speechTokenService = new SpeechTokenService();
