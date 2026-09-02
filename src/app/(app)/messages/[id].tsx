import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useTheme } from '@/theme';
import { ScreenHeader } from '@/components/layout';
import { MessageBubble, TypingIndicator, ChatComposer, CallScreen, type ComposerAttachment } from '@/components/chat';
import { PhoneIcon, VideoIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { useChatStore } from '@/stores';
import { affiliators, RESTAURANT_DIRECTORY, SUPPORT_ID, YOU_ID, type CallKind } from '@/mocks';
import { peerCannedReply, simulateReply } from '@/lib';

function newMessageId(): string {
  return `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function resolvePeer(participantIds: string[]): { id: string; name: string } {
  const peerId = participantIds.find((id) => id !== YOU_ID) ?? '';
  const affiliator = affiliators.find((a) => a.id === peerId);
  if (affiliator) return { id: peerId, name: affiliator.name };
  const restaurant = RESTAURANT_DIRECTORY.find((r) => r.id === peerId);
  return { id: peerId, name: restaurant?.name ?? peerId };
}

export default function ConversationThread() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const conversation = useChatStore((state) => state.conversations.find((c) => c.id === id));
  const messages = useChatStore((state) => state.messagesByConversation[id ?? ''] ?? []);
  const typingConversationId = useChatStore((state) => state.typingConversationId);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const receiveMessage = useChatStore((state) => state.receiveMessage);
  const setTyping = useChatStore((state) => state.setTyping);
  const simulateDeliveryThenRead = useChatStore((state) => state.simulateDeliveryThenRead);
  const [draft, setDraft] = useState('');
  const [activeCall, setActiveCall] = useState<CallKind | null>(null);

  if (!conversation || !id) return null;

  const isSupport = conversation.participantIds.includes(SUPPORT_ID);
  const peer = isSupport ? { id: SUPPORT_ID, name: t('chat_title') } : resolvePeer(conversation.participantIds);

  const scrollToBottom = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const pushUserMessage = (kind: ComposerAttachment['kind'], body: string, attachment?: string, durationMs?: number) => {
    const messageId = newMessageId();
    sendMessage(id, {
      id: messageId,
      senderId: YOU_ID,
      kind,
      body,
      attachment,
      durationMs,
      sentAt: new Date().toISOString(),
    });
    scrollToBottom();
    void simulateDeliveryThenRead(id, messageId);
  };

  const triggerPeerReply = async () => {
    const replyBody = await simulateReply(peerCannedReply(messages.length), {
      onTypingStart: () => setTyping(id),
      onTypingEnd: () => setTyping(null),
    });
    receiveMessage(id, {
      id: newMessageId(),
      senderId: peer.id,
      kind: 'text',
      body: replyBody,
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
    });
    scrollToBottom();
  };

  const sendDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    pushUserMessage('text', trimmed);
    setDraft('');
    void triggerPeerReply();
  };

  const sendAttachment = (attachment: ComposerAttachment) => {
    pushUserMessage(attachment.kind, '', attachment.uri, attachment.durationMs);
    void triggerPeerReply();
  };

  if (activeCall) {
    return <CallScreen peerName={peer.name} kind={activeCall} onEnd={() => setActiveCall(null)} />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.oat }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ScreenHeader
        title={peer.name}
        trailing={
          <View style={styles.callActions}>
            <Pressable
              onPress={() => setActiveCall('audio')}
              accessibilityRole="button"
              accessibilityLabel={t('chat_startCall')}
              style={styles.iconHit}
            >
              <PhoneIcon color={colors.leaf} />
            </Pressable>
            <Pressable
              onPress={() => setActiveCall('video')}
              accessibilityRole="button"
              accessibilityLabel={t('chat_startVideoCall')}
              style={styles.iconHit}
            >
              <VideoIcon color={colors.leaf} />
            </Pressable>
          </View>
        }
      />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} fromMe={message.senderId === YOU_ID} />
        ))}
        {typingConversationId === id ? <TypingIndicator /> : null}
      </ScrollView>
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
  callActions: { flexDirection: 'row', gap: space.sm },
  iconHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
