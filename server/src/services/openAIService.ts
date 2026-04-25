import { env } from "../config/env";
import { logger } from "../utils/logger";
import { Summary } from "../models/summary";
import { Transcript } from "../models/transcript";
import { buildSummaryPrompt } from "../utils/promptBuilder";
import { chunkText } from "../utils/chunkText";

export class OpenAIService {
  private async callOpenAI(prompt: string, userContent: string): Promise<string> {
    if (!env.azureOpenAIEndpoint || !env.azureOpenAIKey) {
      throw new Error("Azure OpenAI Service の接続情報が未設定です");
    }

    const url = `${env.azureOpenAIEndpoint}/openai/deployments/${env.azureOpenAIDeployment}/chat/completions?api-version=2024-10-21`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.azureOpenAIKey,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API エラー: ${response.status} ${errorBody}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  async generateSummary(
    transcripts: Transcript[],
    sessionTitle: string,
    participants: string[]
  ): Promise<Omit<Summary, "id" | "partitionKey" | "type">> {
    const fullText = transcripts
      .filter((t) => t.isFinal)
      .map((t) => `[${t.speakerName}]: ${t.text}`)
      .join("\n");

    const prompt = buildSummaryPrompt();
    let summaryJson: string;

    // チャンク分割が必要かチェック (概算: 1文字 ≈ 1.5トークン)
    const estimatedTokens = fullText.length * 1.5;
    if (estimatedTokens > 100000) {
      logger.info(
        `テキストが大量のため、チャンク分割で要約します (推定 ${Math.round(estimatedTokens)} tokens)`
      );
      const chunks = chunkText(fullText, 60000);
      const chunkSummaries: string[] = [];

      for (const chunk of chunks) {
        const partial = await this.callOpenAI(prompt, chunk);
        chunkSummaries.push(partial);
      }

      // チャンク要約を統合
      const mergePrompt =
        "以下の複数の部分要約を統合して、1つの完全な議事録をJSON形式で生成してください。" +
        prompt;
      summaryJson = await this.callOpenAI(
        mergePrompt,
        chunkSummaries.join("\n---\n")
      );
    } else {
      summaryJson = await this.callOpenAI(prompt, fullText);
    }

    const parsed = JSON.parse(summaryJson);
    const now = new Date().toISOString();

    return {
      sessionId: transcripts[0]?.sessionId || "",
      title: parsed.title || sessionTitle,
      meetingDate: new Date().toISOString().split("T")[0],
      participants: parsed.participants || participants,
      agenda: parsed.agenda || [],
      decisions: parsed.decisions || [],
      actionItems: parsed.actionItems || [],
      discussionSummary: parsed.discussionSummary || "",
      generatedAt: now,
      model: env.azureOpenAIDeployment,
    };
  }
}

export const openAIService = new OpenAIService();
