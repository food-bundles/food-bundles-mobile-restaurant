import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon, SendIcon } from '@/components/icons';
import { ChatBubble } from './_components/ChatBubble';
import { SuggestionChips } from './_components/SuggestionChips';
import { useT } from '@/i18n';

interface ChatMessage {
  fromUser: boolean;
  text: string;
}

const ANSWERS: Record<string, string> = {
  'Where is my order?':
    'Order FB-24815 is In transit, arriving around 10:30. You can track every step on the order screen.',
  'How do vouchers work?':
    'On Premium you get a credit line — order now and settle by the due date. Each voucher payment is confirmed with a one-time code.',
  'Top up my wallet':
    'Open Wallet → Top up and choose MTN MoMo, Airtel Money, or card. You can also share a top-up link with your accountant.',
};

export default function Chat() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');

  const ask = (question: string) => {
    const answer = ANSWERS[question] ?? 'Thanks — a FoodBundles specialist will follow up shortly.';
    setMessages((prev) => [...prev, { fromUser: true, text: question }, { fromUser: false, text: answer }]);
    setDraft('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <View style={[styles.header, { paddingTop: insets.top + space.sm, borderBottomColor: colors.hairline }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <View style={[styles.avatar, { backgroundColor: colors.tintLeaf }]} />
        <View>
          <Text style={[styles.title, { color: colors.ink }]}>{t('chat_title')}</Text>
          <Text style={[styles.status, { color: colors.ripe }]}>● {t('chat_onlineNow')}</Text>
        </View>
      </View>
      <ScreenScroll contentInsetBottom={0}>
        {messages.map((message, index) => (
          <ChatBubble key={index} text={message.text} fromUser={message.fromUser} />
        ))}
      </ScreenScroll>
      <View style={[styles.composer, { borderTopColor: colors.hairline, backgroundColor: colors.paper }]}>
        <SuggestionChips
          suggestions={[t('chat_suggestion1'), t('chat_suggestion2'), t('chat_suggestion3')]}
          onSelect={ask}
        />
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('chat_typeMessage')}
            placeholderTextColor={colors.muted}
            accessibilityLabel={t('chat_typeMessage')}
            style={[
              styles.input,
              { color: colors.ink, backgroundColor: colors.oat, borderColor: colors.hairline },
            ]}
          />
          <Pressable
            onPress={() => draft.trim() && ask(draft.trim())}
            accessibilityRole="button"
            accessibilityLabel={t('chat_send')}
            style={[styles.sendButton, { backgroundColor: colors.leaf }]}
          >
            <SendIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    borderBottomWidth: 1,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  title: { ...text.h2 },
  status: { ...text.caption, marginTop: 2 },
  composer: {
    borderTopWidth: 1,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.sm },
  input: {
    flex: 1,
    ...text.body,
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    minHeight: hit.min,
  },
  sendButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: hit.min / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
