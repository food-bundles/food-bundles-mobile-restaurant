import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useTheme } from '@/theme';
import { MessageBubble, TypingIndicator, ChatComposer, CallScreen, type ComposerAttachment } from '@/components/chat';
import { ChatHeader } from './_components/ChatHeader';
import { SuggestionChips, type Suggestion } from './_components/SuggestionChips';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { useChatStore } from '@/stores';
import { SUPPORT_ID, YOU_ID } from '@/mocks';
import { simulateReply } from '@/lib';
import type { CallKind } from '@/mocks';

const CONVERSATION_ID = 'conv-support';

const ANSWER_KEY: Record<string, TranslationKey> = {
  orderStatus: 'chat_answerOrderStatus',
  vouchers: 'chat_answerVouchers',
  topUp: 'chat_answerTopUp',
};

function newMessageId(): string {
  return `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export default function Chat() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const messages = useChatStore((state) => state.messagesByConversation[CONVERSATION_ID] ?? []);
  const typingConversationId = useChatStore((state) => state.typingConversationId);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const receiveMessage = useChatStore((state) => state.receiveMessage);
  const setTyping = useChatStore((state) => state.setTyping);
  const simulateDeliveryThenRead = useChatStore((state) => state.simulateDeliveryThenRead);
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

  const respondWithAnswer = async (answerBody: string) => {
    const replyBody = await simulateReply(answerBody, {
      onTypingStart: () => setTyping(CONVERSATION_ID),
      onTypingEnd: () => setTyping(null),
    });
    receiveMessage(CONVERSATION_ID, {
      id: newMessageId(),
      senderId: SUPPORT_ID,
      kind: 'text',
      body: replyBody,
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
    });
    scrollToBottom();
  };

  const pushUserMessage = (
    kind: ComposerAttachment['kind'],
    body: string,
    attachment?: string,
    durationMs?: number,
  ) => {
    const id = newMessageId();
    sendMessage(CONVERSATION_ID, {
      id,
      senderId: YOU_ID,
      kind,
      body,
      attachment,
      durationMs,
      sentAt: new Date().toISOString(),
    });
    scrollToBottom();
    void simulateDeliveryThenRead(CONVERSATION_ID, id);
    return id;
  };

  const askSuggestion = (suggestion: Suggestion) => {
    pushUserMessage('text', suggestion.label);
    const answerKey = ANSWER_KEY[suggestion.key];
    void respondWithAnswer(answerKey ? t(answerKey) : t('chat_fallbackAnswer'));
  };

  const sendDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    pushUserMessage('text', trimmed);
    setDraft('');
    void respondWithAnswer(t('chat_fallbackAnswer'));
  };

  const sendAttachment = (attachment: ComposerAttachment) => {
    pushUserMessage(attachment.kind, '', attachment.uri, attachment.durationMs);
    void respondWithAnswer(t('chat_fallbackAnswer'));
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
          <MessageBubble key={message.id} message={message} fromMe={message.senderId === YOU_ID} />
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
