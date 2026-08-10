import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, hit, radius, space, text } from '@/theme';
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
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');

  const ask = (question: string) => {
    const answer = ANSWERS[question] ?? 'Thanks — a FoodBundles specialist will follow up shortly.';
    setMessages((prev) => [...prev, { fromUser: true, text: question }, { fromUser: false, text: answer }]);
    setDraft('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + space.sm }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.title}>{t('chat_title')}</Text>
          <Text style={styles.status}>● {t('chat_onlineNow')}</Text>
        </View>
      </View>
      <ScreenScroll contentInsetBottom={0}>
        {messages.map((message, index) => (
          <ChatBubble key={index} text={message.text} fromUser={message.fromUser} />
        ))}
      </ScreenScroll>
      <View style={styles.composer}>
        <SuggestionChips
          suggestions={[t('chat_suggestion1'), t('chat_suggestion2'), t('chat_suggestion3')]}
          onSelect={ask}
        />
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('chat_typeMessage')}
            placeholderTextColor={color.muted}
            accessibilityLabel={t('chat_typeMessage')}
            style={styles.input}
          />
          <Pressable
            onPress={() => draft.trim() && ask(draft.trim())}
            accessibilityRole="button"
            accessibilityLabel={t('chat_send')}
            style={styles.sendButton}
          >
            <SendIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: color.tintLeaf },
  title: { ...text.h2, color: color.ink },
  status: { ...text.caption, color: color.ripe, marginTop: 2 },
  composer: {
    borderTopWidth: 1,
    borderTopColor: color.hairline,
    backgroundColor: color.paper,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.sm },
  input: {
    flex: 1,
    ...text.body,
    color: color.ink,
    backgroundColor: color.oat,
    borderWidth: 1.5,
    borderColor: color.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    minHeight: hit.min,
  },
  sendButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: hit.min / 2,
    backgroundColor: color.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
