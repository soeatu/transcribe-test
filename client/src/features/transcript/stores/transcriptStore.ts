import { create } from "zustand";
import type { Transcript } from "../../../lib/api";

interface TranscriptState {
  transcripts: Transcript[];
  interimText: string;
  isRecording: boolean;
  addTranscript: (transcript: Transcript) => void;
  setTranscripts: (transcripts: Transcript[]) => void;
  setInterimText: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  clearTranscripts: () => void;
}

export const useTranscriptStore = create<TranscriptState>((set) => ({
  transcripts: [],
  interimText: "",
  isRecording: false,

  addTranscript: (transcript) =>
    set((state) => ({
      transcripts: [...state.transcripts, transcript],
    })),

  setTranscripts: (transcripts) => set({ transcripts }),

  setInterimText: (text) => set({ interimText: text }),

  setIsRecording: (isRecording) => set({ isRecording }),

  clearTranscripts: () => set({ transcripts: [], interimText: "" }),
}));
