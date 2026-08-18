import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface UpgradePromptSheetProps {
  visible: boolean;
  onClose: () => void;
}

/** Bottom sheet nudging a non-subscriber toward Premium plans. */
export function UpgradePromptSheet({ visible, onClose }: UpgradePromptSheetProps) {
  const t = useT();
  const { colors } = useTheme();

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
          <View style={[styles.scrim, { backgroundColor: colors.ink }]} />
        </Pressable>
        <View style={[styles.sheet, { backgroundColor: colors.paper }]}>
          <View style={[styles.grabber, { backgroundColor: colors.hairline }]} />
          <Text style={[styles.title, { color: colors.ink }]}>{t('market_upgradeTitle')}</Text>
          <Text style={[styles.sub, { color: colors.secondary }]}>{t('market_upgradeSub')}</Text>
          <View style={styles.footerRow}>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('action_close')}
              style={[styles.closeButton, { borderColor: colors.hairline }]}
            >
              <Text style={[styles.closeLabel, { color: colors.ink }]}>{t('action_close')}</Text>
            </Pressable>
            <Pressable
              onPress={onSeePlans}
              accessibilityRole="button"
              accessibilityLabel={t('market_upgradeCta')}
              style={[styles.ctaButton, { backgroundColor: colors.marigold }]}
            >
              <Text style={[styles.ctaLabel, { color: colors.pine }]}>{t('market_upgradeCta')}</Text>
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
  scrim: { flex: 1, opacity: 0.4 },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.lg,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: space.sm,
  },
  title: { ...text.h2 },
  sub: { ...text.body, marginTop: space.xs },
  footerRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  closeButton: {
    flex: 1,
    minHeight: hit.min,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: { ...text.bodySemi },
  ctaButton: {
    flex: 1,
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: { ...text.bodySemi },
});
