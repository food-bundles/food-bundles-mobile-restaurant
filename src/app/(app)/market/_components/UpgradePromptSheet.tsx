import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export interface UpgradePromptSheetProps {
  visible: boolean;
  onClose: () => void;
}

/** Bottom sheet nudging a non-subscriber toward Premium plans. */
export function UpgradePromptSheet({ visible, onClose }: UpgradePromptSheetProps) {
  const t = useT();

  const onSeePlans = () => {
    onClose();
    router.push('/(app)/subscription/plans');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('action_close')}
          style={styles.scrimTouchable}
        >
          <View style={styles.scrim} />
        </Pressable>
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>{t('market_upgradeTitle')}</Text>
          <Text style={styles.sub}>{t('market_upgradeSub')}</Text>
          <View style={styles.footerRow}>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('action_close')}
              style={styles.closeButton}
            >
              <Text style={styles.closeLabel}>{t('action_close')}</Text>
            </Pressable>
            <Pressable
              onPress={onSeePlans}
              accessibilityRole="button"
              accessibilityLabel={t('market_upgradeCta')}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaLabel}>{t('market_upgradeCta')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  scrimTouchable: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: { flex: 1, backgroundColor: color.ink, opacity: 0.4 },
  sheet: {
    backgroundColor: color.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.lg,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.hairline,
    alignSelf: 'center',
    marginBottom: space.sm,
  },
  title: { ...text.h2, color: color.ink },
  sub: { ...text.body, color: color.secondary, marginTop: space.xs },
  footerRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  closeButton: {
    flex: 1,
    minHeight: hit.min,
    borderWidth: 1.5,
    borderColor: color.hairline,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: { ...text.bodySemi, color: color.ink },
  ctaButton: {
    flex: 1,
    minHeight: hit.min,
    backgroundColor: color.marigold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: { ...text.bodySemi, color: color.pine },
});
