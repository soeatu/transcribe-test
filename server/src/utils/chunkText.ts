/**
 * テキストを指定された最大文字数でチャンクに分割する。
 * 話者の発言区切り（改行）を尊重して分割する。
 */
export function chunkText(text: string, maxCharsPerChunk: number): string[] {
  const lines = text.split("\n");
  const chunks: string[] = [];
  let current = "";

  for (const line of lines) {
    if (current.length + line.length + 1 > maxCharsPerChunk && current.length > 0) {
      chunks.push(current.trim());
      current = "";
    }
    current += line + "\n";
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}
