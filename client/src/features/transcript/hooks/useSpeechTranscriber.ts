import { useCallback, useRef, useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { tokenApi, transcriptApi } from "../../../lib/api";
import { useTranscriptStore } from "../stores/transcriptStore";

export function useSpeechTranscriber(sessionId: string) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognizerRef = useRef<SpeechSDK.ConversationTranscriber | null>(null);
  const { addTranscript, setInterimText, setIsRecording } =
    useTranscriptStore();

  const start = useCallback(async () => {
    try {
      setError(null);

      // Speech Service トークン取得
      const { token, region } = await tokenApi.getSpeechToken();

      // Speech SDK 設定
      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
        token,
        region
      );
      speechConfig.speechRecognitionLanguage = "ja-JP";

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const transcriber = new SpeechSDK.ConversationTranscriber(
        speechConfig,
        audioConfig
      );

      // 中間結果
      transcriber.transcribing = (_s, e) => {
        if (e.result.text) {
          setInterimText(e.result.text);
        }
      };

      // 確定結果
      transcriber.transcribed = async (_s, e) => {
        if (
          e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech &&
          e.result.text
        ) {
          setInterimText("");
          const transcript = await transcriptApi.create(sessionId, {
            speakerId: e.result.speakerId || "Unknown",
            speakerName: e.result.speakerId || "Unknown",
            text: e.result.text,
            offsetMs: Math.round(e.result.offset / 10000),
            isFinal: true,
          });
          addTranscript(transcript);
        }
      };

      transcriber.canceled = (_s, e) => {
        if (e.reason === SpeechSDK.CancellationReason.Error) {
          setError(`Speech 認識エラー: ${e.errorDetails}`);
        }
      };

      await transcriber.startTranscribingAsync();
      recognizerRef.current = transcriber;
      setIsInitialized(true);
      setIsRecording(true);
    } catch (err: any) {
      setError(err.message || "音声認識の開始に失敗しました");
    }
  }, [sessionId, addTranscript, setInterimText, setIsRecording]);

  const stop = useCallback(async () => {
    if (recognizerRef.current) {
      await recognizerRef.current.stopTranscribingAsync();
      recognizerRef.current.close();
      recognizerRef.current = null;
    }
    setIsRecording(false);
    setIsInitialized(false);
    setInterimText("");
  }, [setIsRecording, setInterimText]);

  return { start, stop, isInitialized, error };
}
