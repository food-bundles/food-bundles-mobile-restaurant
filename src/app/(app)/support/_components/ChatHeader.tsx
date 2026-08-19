import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, space, text, useTheme } from '@/theme';
import { ChevronLeftIcon } from '@/components/icons';
import { useT } from '@/i18n';

export interface ChatHeaderProps {
  topInset: number;
}

export function ChatHeader({ topInset }: ChatHeaderProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { paddingTop: topInset + space.sm, borderBottomColor: colors.hairline }]}>
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
  );
}

const styles = StyleSheet.create({
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
});
