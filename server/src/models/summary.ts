import { z } from "zod";

// ---------------------------------------------------------------------------
// ActionItem
// ---------------------------------------------------------------------------
export const ActionItemSchema = z.object({
  assignee: z.string(),
  task: z.string(),
  dueDate: z.string().optional(),
});

export type ActionItem = z.infer<typeof ActionItemSchema>;

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
export const SummarySchema = z.object({
  id: z.string(),
  partitionKey: z.string(),
  type: z.literal("summary"),
  sessionId: z.string(),
  title: z.string(),
  meetingDate: z.string(),
  participants: z.array(z.string()),
  agenda: z.array(z.string()),
  decisions: z.array(z.string()),
  actionItems: z.array(ActionItemSchema),
  discussionSummary: z.string(),
  generatedAt: z.string(),
  model: z.string(),
});

export type Summary = z.infer<typeof SummarySchema>;

// ---------------------------------------------------------------------------
// API リクエスト
// ---------------------------------------------------------------------------
export const UpdateSummaryRequestSchema = z.object({
  title: z.string().optional(),
  agenda: z.array(z.string()).optional(),
  decisions: z.array(z.string()).optional(),
  actionItems: z.array(ActionItemSchema).optional(),
  discussionSummary: z.string().optional(),
});

export type UpdateSummaryRequest = z.infer<typeof UpdateSummaryRequestSchema>;
