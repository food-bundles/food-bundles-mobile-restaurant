import { request, getToken } from './client';

const _AI_BASE = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api') + '/mobile/restaurant';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  answer: string;
  platform_url: string;
}

async function aiPost(path: string, question: string, history: AiChatMessage[], extra?: object): Promise<AiChatResponse> {
  const res = await request<{ data: AiChatResponse }>(path, {
    method: 'POST',
    body: { question, history, ...extra },
  });
  return res.data;
}

export async function aiChatApi(question: string, history: AiChatMessage[] = []): Promise<AiChatResponse> {
  return aiPost('/ai/chat', question, history);
}

export async function aiMarketIntelligenceApi(question: string, history: AiChatMessage[] = []): Promise<AiChatResponse> {
  return aiPost('/ai/market-intelligence', question, history);
}

export async function aiSupportApi(question: string, history: AiChatMessage[] = []): Promise<AiChatResponse> {
  return aiPost('/ai/support', question, history);
}

export async function aiAssistanceApi(
  question: string,
  history: AiChatMessage[] = [],
  context?: Record<string, unknown>,
): Promise<AiChatResponse> {
  return aiPost('/ai/assistance', question, history, context ? { context } : {});
}

/**
 * SSE streaming variant — calls the /stream endpoint and yields tokens via onToken callback.
 * Returns a cleanup function to abort the stream.
 */
export function aiChatStream(
  question: string,
  history: AiChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError?: (err: string) => void,
): () => void {
  return _sseStream('/ai/chat/stream', { question, history }, onToken, onDone, onError);
}

export function aiMarketIntelligenceStream(
  question: string,
  history: AiChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError?: (err: string) => void,
): () => void {
  return _sseStream('/ai/market-intelligence/stream', { question, history }, onToken, onDone, onError);
}

export function aiSupportStream(
  question: string,
  history: AiChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError?: (err: string) => void,
): () => void {
  return _sseStream('/ai/support/stream', { question, history }, onToken, onDone, onError);
}

export function aiAssistanceStream(
  question: string,
  history: AiChatMessage[],
  context: Record<string, unknown> | undefined,
  onToken: (token: string) => void,
  onDone: () => void,
  onError?: (err: string) => void,
): () => void {
  return _sseStream('/ai/assistance/stream', { question, history, context }, onToken, onDone, onError);
}

function _sseStream(
  path: string,
  body: object,
  onToken: (token: string) => void,
  onDone: () => void,
  onError?: (err: string) => void,
): () => void {
  const controller = new AbortController();
  const url = `${_AI_BASE}${path}`;

  (async () => {
    try {
      const token = await getToken();
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        onError?.(`HTTP ${res.status}`);
        onDone();
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.token) onToken(parsed.token);
            if (parsed.done) { onDone(); return; }
            if (parsed.error) { onError?.(parsed.error); onDone(); return; }
          } catch {
            // malformed chunk — skip
          }
        }
      }
      onDone();
    } catch (err: any) {
      if (err?.name !== 'AbortError') onError?.(err?.message ?? 'Stream error');
      onDone();
    }
  })();

  return () => controller.abort();
}
