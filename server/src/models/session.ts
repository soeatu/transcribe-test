import { z } from "zod";

// ---------------------------------------------------------------------------
// Participant
// ---------------------------------------------------------------------------
export const ParticipantSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  speakerLabel: z.string().optional(),
});

export type Participant = z.infer<typeof ParticipantSchema>;

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------
export const SessionStatusSchema = z.enum(["preparing", "active", "ended"]);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  partitionKey: z.string(),
  type: z.literal("session"),
  title: z.string().min(1),
  status: SessionStatusSchema,
  participants: z.array(ParticipantSchema),
  language: z.string().default("ja-JP"),
  shareUrl: z.string().optional(),
  createdAt: z.string(),
  endedAt: z.string().nullable().default(null),
});

export type Session = z.infer<typeof SessionSchema>;

// ---------------------------------------------------------------------------
// API リクエスト / レスポンス
// ---------------------------------------------------------------------------
export const CreateSessionRequestSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  participants: z
    .array(z.object({ name: z.string().min(1) }))
    .min(1, "参加者は1名以上必要です"),
  language: z.string().optional().default("ja-JP"),
});

export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;

export const UpdateSessionRequestSchema = z.object({
  title: z.string().min(1).optional(),
  status: SessionStatusSchema.optional(),
  participants: z.array(z.object({ name: z.string().min(1) })).optional(),
});

export type UpdateSessionRequest = z.infer<typeof UpdateSessionRequestSchema>;
