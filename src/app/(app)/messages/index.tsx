import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader, SectionHeader } from '@/components/layout';
import { EmptyState, ErrorState, Skeleton } from '@/components/primitives';
import { ConversationListRow } from '@/components/chat';
import { SendIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { useChatStore } from '@/stores';
import { affiliators, RESTAURANT_DIRECTORY, SUPPORT_ID, YOU_ID } from '@/mocks';
import { DirectorySection } from './_components/DirectorySection';

function resolveTitle(conversation: { participantIds: string[] }, t: (key: 'chat_title' | 'msg_you') => string): string {
  const peerId = conversation.participantIds.find((id) => id !== YOU_ID);
  if (peerId === SUPPORT_ID) return t('chat_title');
  const affiliator = affiliators.find((a) => a.id === peerId);
  if (affiliator) return affiliator.name;
  const restaurant = RESTAURANT_DIRECTORY.find((r) => r.id === peerId);
  return restaurant?.name ?? t('msg_you');
}

export default function MessagesList() {
  const t = useT();
  const { colors } = useTheme();
  const status = useChatStore((state) => state.status);
  const conversations = useChatStore((state) => state.conversations);
  const fetchConversations = useChatStore((state) => state.fetch);
  const markRead = useChatStore((state) => state.markRead);
  const startConversation = useChatStore((state) => state.startConversation);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  const openConversation = (conversationId: string) => {
    markRead(conversationId);
    router.push({ pathname: '/(app)/messages/[id]', params: { id: conversationId } });
  };

  const startWithPeer = (peerId: string) => {
    const conversationId = startConversation(`conv-peer-${peerId}`, peerId);
    router.push({ pathname: '/(app)/messages/[id]', params: { id: conversationId } });
  };

  const supportConversations = conversations.filter((c) => c.kind === 'support');
  const peerConversations = conversations.filter((c) => c.kind === 'peer');
  const existingPeerIds = new Set(
    peerConversations.map((c) => c.participantIds.find((id) => id !== YOU_ID)).filter((id): id is string => Boolean(id)),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('msg_title')} />
      <ScreenScroll contentInsetBottom={space.xl}>
        {status === 'loading' ? (
          <View style={styles.skeletonGroup}>
            <Skeleton width="100%" height={64} radius={radius.md} />
            <Skeleton width="100%" height={64} radius={radius.md} />
            <Skeleton width="100%" height={64} radius={radius.md} />
          </View>
        ) : status === 'error' ? (
          <ErrorState
            title={t('msg_errorTitle')}
            message={t('msg_errorMessage')}
            onRetry={() => void fetchConversations()}
          />
        ) : conversations.length === 0 ? (
          <EmptyState
            icon={<SendIcon size={22} color={colors.leaf} />}
            title={t('msg_emptyTitle')}
            message={t('msg_emptyMessage')}
          />
        ) : (
          <>
            {supportConversations.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader title={t('msg_supportSection')} />
                {supportConversations.map((conversation) => (
                  <ConversationListRow
                    key={conversation.id}
                    conversation={conversation}
                    title={resolveTitle(conversation, t)}
                    onPress={() => openConversation(conversation.id)}
                  />
                ))}
              </View>
            ) : null}
            <View style={styles.section}>
              <SectionHeader title={t('msg_peersSection')} />
              {peerConversations.map((conversation) => (
                <ConversationListRow
                  key={conversation.id}
                  conversation={conversation}
                  title={resolveTitle(conversation, t)}
                  onPress={() => openConversation(conversation.id)}
                />
              ))}
            </View>
            <DirectorySection existingPeerIds={existingPeerIds} onStart={startWithPeer} />
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: space.sm },
  skeletonGroup: { gap: space.sm, marginTop: space.md },
});
