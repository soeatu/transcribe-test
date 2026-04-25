import { useCallback, useEffect, useRef, useState } from "react";
import { tokenApi } from "../../../lib/api";
import type { Transcript } from "../../../lib/api";
import { useTranscriptStore } from "../stores/transcriptStore";

interface PubSubMessage {
  type: "transcript" | "sessionUpdate" | "summaryReady";
  payload: Transcript;
  timestamp: string;
}

export function usePubSub(sessionId: string, userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { addTranscript } = useTranscriptStore();

  const connect = useCallback(async () => {
    try {
      const { url } = await tokenApi.negotiatePubSub(sessionId, userId);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const msg: PubSubMessage = JSON.parse(event.data);
          if (msg.type === "transcript") {
            addTranscript(msg.payload);
          }
        } catch {
          // メッセージのパースに失敗した場合はスキップ
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // 自動再接続 (3秒後)
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        setError("WebSocket 接続エラー");
      };

      wsRef.current = ws;
    } catch (err: any) {
      setError(err.message || "PubSub 接続に失敗しました");
    }
  }, [sessionId, userId, addTranscript]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, isConnected, error };
}
