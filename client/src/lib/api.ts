import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

// ---------------------------------------------------------------------------
// Session API
// ---------------------------------------------------------------------------
export interface CreateSessionRequest {
  title: string;
  participants: { name: string }[];
  language?: string;
}

export interface Participant {
  id: string;
  name: string;
  speakerLabel?: string;
}

export interface Session {
  id: string;
  title: string;
  status: "preparing" | "active" | "ended";
  shareUrl?: string;
  participants: Participant[];
  language: string;
  createdAt: string;
  endedAt: string | null;
}

export interface Transcript {
  id: string;
  sessionId: string;
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: string;
  offsetMs: number;
  isFinal: boolean;
}

export interface ActionItem {
  assignee: string;
  task: string;
  dueDate?: string;
}

export interface Summary {
  id: string;
  sessionId: string;
  title: string;
  meetingDate: string;
  participants: string[];
  agenda: string[];
  decisions: string[];
  actionItems: ActionItem[];
  discussionSummary: string;
  generatedAt: string;
  model: string;
}

export const sessionApi = {
  create: (data: CreateSessionRequest) =>
    api.post<Session>("/sessions", data).then((r) => r.data),
  getAll: () => api.get<Session[]>("/sessions").then((r) => r.data),
  getById: (id: string) =>
    api.get<Session>(`/sessions/${id}`).then((r) => r.data),
  update: (id: string, data: Partial<Session>) =>
    api.patch<Session>(`/sessions/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};

export const transcriptApi = {
  create: (sessionId: string, data: Omit<Transcript, "id" | "sessionId" | "timestamp">) =>
    api.post<Transcript>(`/sessions/${sessionId}/transcripts`, data).then((r) => r.data),
  getAll: (sessionId: string) =>
    api.get<Transcript[]>(`/sessions/${sessionId}/transcripts`).then((r) => r.data),
};

export const summaryApi = {
  generate: (sessionId: string) =>
    api.post<Summary>(`/sessions/${sessionId}/summary`).then((r) => r.data),
  get: (sessionId: string) =>
    api.get<Summary>(`/sessions/${sessionId}/summary`).then((r) => r.data),
  update: (sessionId: string, data: Partial<Summary>) =>
    api.put<Summary>(`/sessions/${sessionId}/summary`, data).then((r) => r.data),
};

export const tokenApi = {
  getSpeechToken: () =>
    api.get<{ token: string; region: string; expiresAt: string }>("/speech/token").then((r) => r.data),
  negotiatePubSub: (sessionId: string, userId: string) =>
    api.post<{ url: string }>("/pubsub/negotiate", { sessionId, userId }).then((r) => r.data),
};

export default api;
