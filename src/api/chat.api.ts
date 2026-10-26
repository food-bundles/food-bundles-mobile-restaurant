import { request } from './client';

export type MessageKind = 'text' | 'voice' | 'file' | 'image';

export interface ChatMessage {
  id: string;
  senderId: string;
  kind: MessageKind;
  body: string;
  attachment?: string;
  durationMs?: number;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export type ConversationKind = 'support' | 'peer';

export interface Conversation {
  id: string;
  kind: ConversationKind;
  participantIds: string[];
  lastMessage: ChatMessage;
  unreadCount: number;
}

export type CallKind = 'audio' | 'video';
export type CallState = 'ringing' | 'connecting' | 'active' | 'ended';

interface ApiMessage {
  id: string;
  senderId: string;
  kind: string;
  body: string;
  attachment?: string;
  durationMs?: number;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

interface ApiConversation {
  id: string;
  kind: string;
  participantIds: string[];
  participants: { id: string; name: string }[];
  lastMessage: ApiMessage | null;
  unreadCount: number;
}

function toMessage(m: ApiMessage): ChatMessage {
  return {
    id: m.id,
    senderId: m.senderId,
    kind: m.kind as ChatMessage['kind'],
    body: m.body,
    attachment: m.attachment,
    durationMs: m.durationMs,
    sentAt: m.sentAt,
    deliveredAt: m.deliveredAt,
    readAt: m.readAt,
  };
}

export async function getConversationsApi(): Promise<ApiConversation[]> {
  const res = await request<{ data: ApiConversation[] }>('/chat/conversations');
  return res.data;
}

export async function getMessagesApi(conversationId: string): Promise<ChatMessage[]> {
  const res = await request<{ data: ApiMessage[] }>(`/chat/conversations/${conversationId}/messages`);
  return res.data.map(toMessage);
}

export async function sendMessageApi(
  conversationId: string,
  payload: { kind: string; body: string; attachment?: string; durationMs?: number },
): Promise<ChatMessage> {
  const res = await request<{ data: ApiMessage }>(`/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: payload,
  });
  return toMessage(res.data);
}

export async function startConversationApi(peerId: string, kind = 'peer'): Promise<string> {
  const res = await request<{ data: { id: string } }>('/chat/conversations', {
    method: 'POST',
    body: { peerId, kind },
  });
  return res.data.id;
}

export async function markConversationReadApi(conversationId: string): Promise<void> {
  await request(`/chat/conversations/${conversationId}/read`, { method: 'PATCH' });
}

export async function sendTypingApi(conversationId: string, isTyping: boolean): Promise<void> {
  await request(`/chat/conversations/${conversationId}/typing`, {
    method: 'POST',
    body: { isTyping },
  });
}
