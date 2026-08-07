import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function ActionSheet({ visible, onClose, title, message }: ActionSheetProps) {
  const t = useT();

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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('action_close')}
            style={styles.closeButton}
          >
            <Text style={styles.closeLabel}>{t('action_close')}</Text>
          </Pressable>
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
  title: { ...text.h2, color: color.ink },
  message: { ...text.body, color: color.secondary, marginTop: space.sm },
  closeButton: {
    minHeight: hit.min,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  closeLabel: { ...text.bodySemi, color: color.paper },
});
