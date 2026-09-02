import { create } from 'zustand';
import { CONVERSATIONS, CHAT_MESSAGES, type ChatMessage, type Conversation } from '@/mocks/chat';
import { waitForDelivery, waitForRead } from '@/lib/chatSimulator';

interface ChatState {
  conversations: Conversation[];
  messagesByConversation: Record<string, ChatMessage[]>;
  typingConversationId: string | null;
  setTyping: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, message: ChatMessage) => void;
  receiveMessage: (conversationId: string, message: ChatMessage) => void;
  markRead: (conversationId: string) => void;
  simulateDeliveryThenRead: (conversationId: string, messageId: string) => Promise<void>;
}

const updateLastMessage = (conversations: Conversation[], conversationId: string, message: ChatMessage): Conversation[] =>
  conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, lastMessage: message } : conversation,
  );

export const useChatStore = create<ChatState>((set) => ({
  conversations: CONVERSATIONS,
  messagesByConversation: CHAT_MESSAGES,
  typingConversationId: null,

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
      conversations: updateLastMessage(state.conversations, conversationId, message).map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: conversation.unreadCount + 1 }
          : conversation,
      ),
    })),

  markRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
      ),
    })),

  simulateDeliveryThenRead: async (conversationId, messageId) => {
    await waitForDelivery();
    const deliveredAt = new Date().toISOString();
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: (state.messagesByConversation[conversationId] ?? []).map((message) =>
          message.id === messageId ? { ...message, deliveredAt } : message,
        ),
      },
    }));

    await waitForRead();
    const readAt = new Date().toISOString();
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: (state.messagesByConversation[conversationId] ?? []).map((message) =>
          message.id === messageId ? { ...message, readAt } : message,
        ),
      },
    }));
  },
}));
