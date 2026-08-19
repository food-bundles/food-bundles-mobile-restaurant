import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useTheme } from '@/theme';
import { ChatBubble } from './_components/ChatBubble';
import { ChatHeader } from './_components/ChatHeader';
import { ChatComposer } from './_components/ChatComposer';
import { type Suggestion } from './_components/SuggestionChips';
import { useT } from '@/i18n';

interface ChatMessage {
  fromUser: boolean;
  text: string;
  imageUri?: string;
}

const ANSWERS: Record<string, string> = {
  orderStatus:
    'Order FB-24815 is In transit, arriving around 10:30. You can track every step on the order screen.',
  vouchers:
    'Basic and Premium both grant a batch of vouchers every month — each one pays for one order. Every voucher payment is confirmed with a one-time code.',
  topUp:
    'Open Wallet → Top up and choose MTN MoMo, Airtel Money, or card. You can also share a top-up link with your accountant.',
};

const FALLBACK_ANSWER = 'Thanks — a FoodBundles specialist will follow up shortly.';

export default function Chat() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

  const suggestions: Suggestion[] = [
    { key: 'orderStatus', label: t('chat_suggestion1') },
    { key: 'vouchers', label: t('chat_suggestion2') },
    { key: 'topUp', label: t('chat_suggestion3') },
  ];

  const scrollToBottom = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const appendReply = (userMessage: ChatMessage, answer: string) => {
    setMessages((prev) => [...prev, userMessage, { fromUser: false, text: answer }]);
    scrollToBottom();
  };

  const askSuggestion = (suggestion: Suggestion) => {
    appendReply({ fromUser: true, text: suggestion.label }, ANSWERS[suggestion.key] ?? FALLBACK_ANSWER);
  };

  const sendDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed && !pendingImageUri) return;
    appendReply({ fromUser: true, text: trimmed, imageUri: pendingImageUri ?? undefined }, FALLBACK_ANSWER);
    setDraft('');
    setPendingImageUri(null);
  };

  const onAttach = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (!result.canceled && result.assets[0]) setPendingImageUri(result.assets[0].uri);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.oat }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ChatHeader topInset={insets.top} />
      <ScrollView
        ref={scrollRef}
        style={[styles.scrollArea, { backgroundColor: colors.oat }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message, index) => (
          <ChatBubble key={index} text={message.text} fromUser={message.fromUser} imageUri={message.imageUri} />
        ))}
      </ScrollView>
      <ChatComposer
        bottomInset={insets.bottom}
        suggestions={suggestions}
        onSelectSuggestion={askSuggestion}
        draft={draft}
        onDraftChange={setDraft}
        pendingImageUri={pendingImageUri}
        onAttach={onAttach}
        onRemoveImage={() => setPendingImageUri(null)}
        onSend={sendDraft}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: space.lg, paddingTop: space.lg },
});
