import { create } from "zustand";
import { summaryApi } from "../../../lib/api";
import type { Summary } from "../../../lib/api";

interface SummaryState {
  summary: Summary | null;
  isGenerating: boolean;
  isEditing: boolean;
  error: string | null;
  generateSummary: (sessionId: string) => Promise<void>;
  fetchSummary: (sessionId: string) => Promise<void>;
  updateSummary: (sessionId: string, data: Partial<Summary>) => Promise<void>;
  setIsEditing: (editing: boolean) => void;
  clearSummary: () => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  summary: null,
  isGenerating: false,
  isEditing: false,
  error: null,

  generateSummary: async (sessionId: string) => {
    set({ isGenerating: true, error: null });
    try {
      const summary = await summaryApi.generate(sessionId);
      set({ summary, isGenerating: false });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
    }
  },

  fetchSummary: async (sessionId: string) => {
    try {
      const summary = await summaryApi.get(sessionId);
      set({ summary });
    } catch {
      set({ summary: null });
    }
  },

  updateSummary: async (sessionId: string, data: Partial<Summary>) => {
    const updated = await summaryApi.update(sessionId, data);
    set({ summary: updated, isEditing: false });
  },

  setIsEditing: (editing) => set({ isEditing: editing }),
  clearSummary: () => set({ summary: null, isEditing: false, error: null }),
}));
