import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { AttachIcon, CloseIcon, SendIcon } from '@/components/icons';
import { SuggestionChips, type Suggestion } from './SuggestionChips';
import { useT } from '@/i18n';

const MAX_MESSAGE_LENGTH = 500;

export interface ChatComposerProps {
  bottomInset: number;
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: Suggestion) => void;
  draft: string;
  onDraftChange: (draft: string) => void;
  pendingImageUri: string | null;
  onAttach: () => void;
  onRemoveImage: () => void;
  onSend: () => void;
}

export function ChatComposer({
  bottomInset,
  suggestions,
  onSelectSuggestion,
  draft,
  onDraftChange,
  pendingImageUri,
  onAttach,
  onRemoveImage,
  onSend,
}: ChatComposerProps) {
  const t = useT();
  const { colors } = useTheme();
  const canSend = draft.trim().length > 0 || pendingImageUri !== null;

  return (
    <View
      style={[
        styles.composer,
        { paddingBottom: bottomInset + space.md, borderTopColor: colors.hairline, backgroundColor: colors.paper },
      ]}
    >
      <SuggestionChips suggestions={suggestions} onSelect={onSelectSuggestion} />
      {pendingImageUri ? (
        <View style={styles.previewRow}>
          <Image source={{ uri: pendingImageUri }} style={[styles.previewImage, { borderColor: colors.hairline }]} />
          <Pressable
            onPress={onRemoveImage}
            accessibilityRole="button"
            accessibilityLabel={t('chat_removeImage')}
            style={[styles.previewRemove, { backgroundColor: colors.ink }]}
          >
            <CloseIcon size={12} color={colors.paper} />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.inputRow}>
        <Pressable
          onPress={onAttach}
          accessibilityRole="button"
          accessibilityLabel={t('chat_attach')}
          style={styles.attachButton}
        >
          <AttachIcon />
        </Pressable>
        <TextInput
          value={draft}
          onChangeText={onDraftChange}
          placeholder={t('chat_typeMessage')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('chat_typeMessage')}
          multiline
          maxLength={MAX_MESSAGE_LENGTH}
          style={[styles.input, { color: colors.ink, backgroundColor: colors.oat, borderColor: colors.hairline }]}
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel={t('chat_send')}
          accessibilityState={{ disabled: !canSend }}
          style={[styles.sendButton, { backgroundColor: colors.leaf }, !canSend && { backgroundColor: colors.disabledLine }]}
        >
          <SendIcon color={canSend ? colors.paper : colors.disabledText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: { borderTopWidth: 1, paddingHorizontal: space.md, paddingTop: space.sm },
  previewRow: { marginTop: space.sm, alignSelf: 'flex-start' },
  previewImage: { width: 72, height: 72, borderRadius: radius.md, borderWidth: 1 },
  previewRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, marginTop: space.sm },
  attachButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    ...text.body,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    minHeight: hit.min,
    maxHeight: 120,
  },
  sendButton: { width: hit.min, height: hit.min, borderRadius: hit.min / 2, alignItems: 'center', justifyContent: 'center' },
});
