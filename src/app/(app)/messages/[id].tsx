import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useTheme } from '@/theme';
import { ScreenHeader } from '@/components/layout';
import { MessageBubble, TypingIndicator, ChatComposer, CallScreen, type ComposerAttachment } from '@/components/chat';
import { PhoneIcon, VideoIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { useChatStore, useSessionStore } from '@/stores';
import { useMarketStore } from '@/stores/marketStore';
import { sendMessageApi } from '@/api/chat.api';
import type { CallKind } from '@/api/chat.api';

function newMessageId(): string {
  return `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export default function ConversationThread() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollRef = useRef<ScrollView>(null);

  const profile = useSessionStore((state) => state.profile);
  const myId = profile?.id ?? 'me';

  const conversation = useChatStore((state) => state.conversations.find((c) => c.id === id));
  const messages = useChatStore((state) => state.messagesByConversation[id ?? ''] ?? []);
  const typingConversationId = useChatStore((state) => state.typingConversationId);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const fetchMessages = useChatStore((state) => state.fetchMessages);
  const markRead = useChatStore((state) => state.markRead);

  const directory = useMarketStore((state) => state.directory);
  const [draft, setDraft] = useState('');
  const [activeCall, setActiveCall] = useState<CallKind | null>(null);

  useEffect(() => {
    if (id) {
      void fetchMessages(id);
      markRead(id);
    }
  }, [id, fetchMessages, markRead]);

  if (!conversation || !id) return null;

  const peerId = conversation.participantIds.find((pid) => pid !== myId) ?? '';
  const peerName = directory.find((r) => r.id === peerId)?.name ?? peerId;

  const scrollToBottom = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const pushAndSend = async (kind: ComposerAttachment['kind'], body: string, attachment?: string, durationMs?: number) => {
    const tempId = newMessageId();
    const optimistic = {
      id: tempId,
      senderId: myId,
      kind,
      body,
      attachment,
      durationMs,
      sentAt: new Date().toISOString(),
    };
    sendMessage(id, optimistic);
    scrollToBottom();

    try {
      await sendMessageApi(id, { kind, body, attachment, durationMs });
    } catch {
      // message already shown optimistically; silent fail
    }
  };

  const sendDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    void pushAndSend('text', trimmed);
    setDraft('');
  };

  const sendAttachment = (attachment: ComposerAttachment) => {
    void pushAndSend(attachment.kind, '', attachment.uri, attachment.durationMs);
  };

  if (activeCall) {
    return <CallScreen peerName={peerName} kind={activeCall} onEnd={() => setActiveCall(null)} />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.oat }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ScreenHeader
        title={peerName}
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
          <MessageBubble key={message.id} message={message} fromMe={message.senderId === myId} />
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
