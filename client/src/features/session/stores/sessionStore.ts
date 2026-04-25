import { create } from "zustand";
import { sessionApi } from "../../../lib/api";
import type { Session, CreateSessionRequest } from "../../../lib/api";

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  fetchSession: (id: string) => Promise<void>;
  createSession: (data: CreateSessionRequest) => Promise<Session>;
  updateSession: (id: string, data: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  setCurrentSession: (session: Session | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await sessionApi.getAll();
      set({ sessions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchSession: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionApi.getById(id);
      set({ currentSession: session, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createSession: async (data: CreateSessionRequest) => {
    const session = await sessionApi.create(data);
    set((state) => ({ sessions: [session, ...state.sessions] }));
    return session;
  },

  updateSession: async (id: string, data: Partial<Session>) => {
    const updated = await sessionApi.update(id, data);
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? updated : s)),
      currentSession:
        state.currentSession?.id === id ? updated : state.currentSession,
    }));
  },

  deleteSession: async (id: string) => {
    await sessionApi.delete(id);
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    }));
  },

  setCurrentSession: (session) => set({ currentSession: session }),
}));
