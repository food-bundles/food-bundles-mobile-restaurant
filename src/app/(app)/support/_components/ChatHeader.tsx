import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, space, text, useTheme } from '@/theme';
import { ChevronLeftIcon, PhoneIcon, VideoIcon } from '@/components/icons';
import { AvatarFace } from '@/components/navigation';
import { useT } from '@/i18n';

export interface ChatHeaderProps {
  topInset: number;
  onStartCall: (kind: 'audio' | 'video') => void;
}

export function ChatHeader({ topInset, onStartCall }: ChatHeaderProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { paddingTop: topInset + space.sm, borderBottomColor: colors.hairline }]}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t('action_back')}
        style={styles.iconHit}
      >
        <ChevronLeftIcon />
      </Pressable>
      <View style={[styles.avatar, { backgroundColor: colors.pine }]}>
        <AvatarFace size={26} />
      </View>
      <View style={styles.titleCol}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('chat_title')}</Text>
        <Text style={[styles.status, { color: colors.ripe }]}>● {t('chat_onlineNow')}</Text>
      </View>
      <Pressable
        onPress={() => onStartCall('audio')}
        accessibilityRole="button"
        accessibilityLabel={t('chat_startCall')}
        style={styles.iconHit}
      >
        <PhoneIcon color={colors.leaf} />
      </Pressable>
      <Pressable
        onPress={() => onStartCall('video')}
        accessibilityRole="button"
        accessibilityLabel={t('chat_startVideoCall')}
        style={styles.iconHit}
      >
        <VideoIcon color={colors.leaf} />
      </Pressable>
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
  iconHit: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  titleCol: { flex: 1 },
  title: { ...text.h2 },
  status: { ...text.caption, marginTop: 2 },
});
