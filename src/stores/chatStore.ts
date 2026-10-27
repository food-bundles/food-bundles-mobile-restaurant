import { create } from 'zustand';
import type { ChatMessage, Conversation, MessageKind } from '@/api/chat.api';
import {
  getConversationsApi,
  getMessagesApi,
  startConversationApi,
  markConversationReadApi,
} from '@/api/chat.api';
import { getToken } from '@/api/client';

export const YOU_ID = 'me';
export const SUPPORT_CONVERSATION_KIND = 'support';

export type AsyncStatus = 'idle' | 'loading' | 'ready' | 'error';

// ─── WebSocket singleton ──────────────────────────────────────────────────────
// Derive WS URL: strip any trailing /api suffix, switch protocol, append /api/ws
const _apiBase = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';
const WS_URL = _apiBase.replace(/\/api\/?$/, '').replace(/^http/, 'ws') + '/api/ws';

let _ws: WebSocket | null = null;
let _wsUserId: string | null = null;
let _subscribedConversations = new Set<string>();
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function connectWs(userId: string) {
  if (_ws && (_ws.readyState === WebSocket.OPEN || _ws.readyState === WebSocket.CONNECTING)) return;
  _wsUserId = userId;
  _ws = new WebSocket(WS_URL);

  _ws.onopen = async () => {
    const token = await getToken();
    _ws?.send(JSON.stringify({ type: 'AUTHENTICATE', userId, token }));
    for (const id of _subscribedConversations) {
      _ws?.send(JSON.stringify({ type: 'SUBSCRIBE_CHAT', conversationId: id }));
    }
  };

  _ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data as string);
      const store = useChatStore.getState();
      if (msg.type === 'CHAT_MESSAGE') {
        const d = msg.data;
        const incoming: ChatMessage = {
          id: d.messageId,
          senderId: d.senderId,
          kind: d.kind,
          body: d.body,
          attachment: d.attachment,
          durationMs: d.durationMs,
          sentAt: d.sentAt,
          deliveredAt: d.deliveredAt,
        };
        const existing = store.messagesByConversation[d.conversationId] ?? [];
        if (!existing.find((m) => m.id === incoming.id)) {
          store.receiveMessage(d.conversationId, incoming);
        }
      } else if (msg.type === 'CHAT_TYPING') {
        const { conversationId, senderId, isTyping } = msg.data;
        if (senderId !== store.myId) {
          store.setTyping(isTyping ? conversationId : null);
        }
      } else if (msg.type === 'CHAT_READ') {
        const { conversationId, readAt } = msg.data;
        useChatStore.setState((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: (state.messagesByConversation[conversationId] ?? []).map((m) =>
              !m.readAt ? { ...m, readAt } : m,
            ),
          },
        }));
      }
    } catch {
      // malformed frame — ignore
    }
  };

  _ws.onclose = () => {
    _ws = null;
    if (_reconnectTimer) clearTimeout(_reconnectTimer);
    _reconnectTimer = setTimeout(() => { if (_wsUserId) connectWs(_wsUserId); }, 3000);
  };

  _ws.onerror = () => { _ws?.close(); };
}

export function subscribeConversationWs(conversationId: string) {
  _subscribedConversations.add(conversationId);
  if (_ws?.readyState === WebSocket.OPEN) {
    _ws.send(JSON.stringify({ type: 'SUBSCRIBE_CHAT', conversationId }));
  }
}

export function disconnectWs() {
  if (_reconnectTimer) clearTimeout(_reconnectTimer);
  _ws?.close();
  _ws = null;
  _wsUserId = null;
  _subscribedConversations.clear();
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface ChatState {
  status: AsyncStatus;
  conversations: Conversation[];
  messagesByConversation: Record<string, ChatMessage[]>;
  typingConversationId: string | null;
  myId: string | null;
  setMyId: (id: string) => void;
  fetch: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  setTyping: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, message: ChatMessage) => void;
  receiveMessage: (conversationId: string, message: ChatMessage) => void;
  markRead: (conversationId: string) => void;
  startConversation: (conversationId: string, peerId: string) => Promise<string>;
  simulateDeliveryThenRead: (conversationId: string, messageId: string) => Promise<void>;
}

const updateLastMessage = (
  conversations: Conversation[],
  conversationId: string,
  message: ChatMessage,
): Conversation[] =>
  conversations.map((c) => (c.id === conversationId ? { ...c, lastMessage: message } : c));

export const useChatStore = create<ChatState>((set, get) => ({
  status: 'idle',
  conversations: [],
  messagesByConversation: {},
  typingConversationId: null,
  myId: null,

  setMyId: (id) => {
    set({ myId: id });
    connectWs(id);
  },

  fetch: async () => {
    set({ status: 'loading' });
    try {
      const apiConversations = await getConversationsApi();
      const conversations: Conversation[] = apiConversations.map((c) => ({
        id: c.id,
        kind: c.kind as Conversation['kind'],
        participantIds: c.participantIds,
        lastMessage: c.lastMessage
          ? { ...c.lastMessage, kind: c.lastMessage.kind as MessageKind }
          : { id: `${c.id}-placeholder`, senderId: '', kind: 'text' as MessageKind, body: '', sentAt: new Date().toISOString() },
        unreadCount: c.unreadCount,
      }));
      for (const c of conversations) subscribeConversationWs(c.id);
      set({ conversations, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
  },

  fetchMessages: async (conversationId) => {
    subscribeConversationWs(conversationId);
    try {
      const messages = await getMessagesApi(conversationId);
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: messages,
        },
      }));
    } catch {
      // non-fatal
    }
  },

  setTyping: (conversationId) => set({ typingConversationId: conversationId }),

  sendMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [...(state.messagesByConversation[conversationId] ?? []), message],
      },
      conversations: updateLastMessage(state.conversations, conversationId, message),
    })),

  receiveMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [...(state.messagesByConversation[conversationId] ?? []), message],
      },
      conversations: updateLastMessage(state.conversations, conversationId, message).map((c) =>
        c.id === conversationId ? { ...c, unreadCount: c.unreadCount + 1 } : c,
      ),
    })),

  markRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    }));
    markConversationReadApi(conversationId).catch(() => {});
  },

  startConversation: async (conversationId, peerId) => {
    const existing = get().conversations.find((c) => c.id === conversationId);
    if (existing) return existing.id;

    try {
      const realId = await startConversationApi(peerId);
      subscribeConversationWs(realId);
      const placeholder: ChatMessage = {
        id: `${realId}-placeholder`,
        senderId: '',
        kind: 'text',
        body: '',
        sentAt: new Date().toISOString(),
      };
      set((state) => ({
        conversations: [
          ...state.conversations,
          {
            id: realId,
            kind: 'peer',
            participantIds: [get().myId ?? 'me', peerId],
            lastMessage: placeholder,
            unreadCount: 0,
          },
        ],
        messagesByConversation: { ...state.messagesByConversation, [realId]: [] },
      }));
      return realId;
    } catch {
      subscribeConversationWs(conversationId);
      const placeholder: ChatMessage = {
        id: `${conversationId}-placeholder`,
        senderId: '',
        kind: 'text',
        body: '',
        sentAt: new Date().toISOString(),
      };
      set((state) => ({
        conversations: [
          ...state.conversations,
          {
            id: conversationId,
            kind: 'peer',
            participantIds: [get().myId ?? 'me', peerId],
            lastMessage: placeholder,
            unreadCount: 0,
          },
        ],
        messagesByConversation: { ...state.messagesByConversation, [conversationId]: [] },
      }));
      return conversationId;
    }
  },

  simulateDeliveryThenRead: async (_conversationId, _messageId) => {
    // No-op: delivery/read handled server-side via WebSocket
  },
}));
