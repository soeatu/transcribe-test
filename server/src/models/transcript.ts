import { z } from "zod";

// ---------------------------------------------------------------------------
// Transcript
// ---------------------------------------------------------------------------
export const TranscriptSchema = z.object({
  id: z.string(),
  partitionKey: z.string(),
  type: z.literal("transcript"),
  sessionId: z.string(),
  speakerId: z.string(),
  speakerName: z.string(),
  text: z.string(),
  timestamp: z.string(),
  offsetMs: z.number(),
  isFinal: z.boolean(),
});

export type Transcript = z.infer<typeof TranscriptSchema>;

// ---------------------------------------------------------------------------
// API リクエスト
// ---------------------------------------------------------------------------
export const CreateTranscriptRequestSchema = z.object({
  speakerId: z.string().min(1),
  speakerName: z.string().min(1),
  text: z.string().min(1),
  offsetMs: z.number().int().nonnegative(),
  isFinal: z.boolean(),
});

export type CreateTranscriptRequest = z.infer<
  typeof CreateTranscriptRequestSchema
>;
