import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useTheme } from '@/theme';
import { MessageBubble, TypingIndicator, ChatComposer, CallScreen, type ComposerAttachment } from '@/components/chat';
import { ChatHeader } from './_components/ChatHeader';
import { SuggestionChips, type Suggestion } from './_components/SuggestionChips';
import { useT } from '@/i18n';
import { useChatStore } from '@/stores';
import { aiSupportStream, type AiChatMessage } from '@/api/ai.api';
import type { CallKind } from '@/api/chat.api';

const SUPPORT_ID = 'support-bot';
const CONVERSATION_ID = 'conv-support';

function newMessageId(): string {
  return `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export default function Chat() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const myId = useChatStore((state) => state.myId) ?? 'me';
  const messages = useChatStore((state) => state.messagesByConversation[CONVERSATION_ID] ?? []);
  const typingConversationId = useChatStore((state) => state.typingConversationId);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const receiveMessage = useChatStore((state) => state.receiveMessage);
  const setTyping = useChatStore((state) => state.setTyping);
  const [draft, setDraft] = useState('');
  const [activeCall, setActiveCall] = useState<CallKind | null>(null);

  const suggestions: Suggestion[] = [
    { key: 'orderStatus', label: t('chat_suggestion1') },
    { key: 'vouchers', label: t('chat_suggestion2') },
    { key: 'topUp', label: t('chat_suggestion3') },
  ];

  const scrollToBottom = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const buildHistory = (): AiChatMessage[] =>
    messages.map((m) => ({
      role: m.senderId === myId ? 'user' : 'assistant',
      content: m.body,
    }));

  const respondWithAi = async (question: string) => {
    setTyping(CONVERSATION_ID);
    const history = buildHistory();
    const botMsgId = newMessageId();
    let accumulated = '';

    // Optimistically add empty bot message that fills in via streaming tokens
    receiveMessage(CONVERSATION_ID, {
      id: botMsgId,
      senderId: SUPPORT_ID,
      kind: 'text',
      body: '',
      sentAt: new Date().toISOString(),
    });

    const stop = aiSupportStream(
      question,
      history,
      (token) => {
        accumulated += token;
        // Update the message body in-place via receiveMessage replacement
        useChatStore.setState((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [CONVERSATION_ID]: (state.messagesByConversation[CONVERSATION_ID] ?? []).map((m) =>
              m.id === botMsgId ? { ...m, body: accumulated } : m,
            ),
          },
        }));
      },
      () => {
        setTyping(null);
        scrollToBottom();
        if (!accumulated) {
          useChatStore.setState((state) => ({
            messagesByConversation: {
              ...state.messagesByConversation,
              [CONVERSATION_ID]: (state.messagesByConversation[CONVERSATION_ID] ?? []).map((m) =>
                m.id === botMsgId ? { ...m, body: t('chat_fallbackAnswer') } : m,
              ),
            },
          }));
        }
      },
      () => {
        setTyping(null);
        useChatStore.setState((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [CONVERSATION_ID]: (state.messagesByConversation[CONVERSATION_ID] ?? []).map((m) =>
              m.id === botMsgId ? { ...m, body: t('chat_fallbackAnswer') } : m,
            ),
          },
        }));
      },
    );

    scrollToBottom();
    return stop;
  };

  const pushUserMessage = (kind: ComposerAttachment['kind'], body: string, attachment?: string, durationMs?: number) => {
    const id = newMessageId();
    sendMessage(CONVERSATION_ID, {
      id,
      senderId: myId,
      kind,
      body,
      attachment,
      durationMs,
      sentAt: new Date().toISOString(),
    });
    scrollToBottom();
    return id;
  };

  const askSuggestion = (suggestion: Suggestion) => {
    pushUserMessage('text', suggestion.label);
    void respondWithAi(suggestion.label);
  };

  const sendDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    pushUserMessage('text', trimmed);
    setDraft('');
    void respondWithAi(trimmed);
  };

  const sendAttachment = (attachment: ComposerAttachment) => {
    pushUserMessage(attachment.kind, '', attachment.uri, attachment.durationMs);
    void respondWithAi('I sent an attachment.');
  };

  if (activeCall) {
    return <CallScreen peerName={t('chat_title')} kind={activeCall} onEnd={() => setActiveCall(null)} />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.oat }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ChatHeader topInset={insets.top} onStartCall={setActiveCall} />
      <ScrollView
        ref={scrollRef}
        style={[styles.scrollArea, { backgroundColor: colors.oat }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} fromMe={message.senderId === myId} />
        ))}
        {typingConversationId === CONVERSATION_ID ? <TypingIndicator /> : null}
      </ScrollView>
      <SuggestionChips suggestions={suggestions} onSelect={askSuggestion} />
      <ChatComposer
        bottomInset={insets.bottom}
        draft={draft}
        onDraftChange={setDraft}
        onSendText={sendDraft}
        onSendAttachment={sendAttachment}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: space.lg, paddingTop: space.lg },
});
