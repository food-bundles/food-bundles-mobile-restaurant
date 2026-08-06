import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ChevronLeftIcon } from '@/components/icons';
import { useT } from '@/i18n';

export interface CheckoutStepHeaderProps {
  title: string;
  step: 1 | 2;
}

export function CheckoutStepHeader({ title, step }: CheckoutStepHeaderProps) {
  const t = useT();

  return (
    <View>
      <View style={styles.row}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.progressRow}>
        <View style={[styles.segment, styles.segmentDone]} />
        <View style={[styles.segment, step === 2 && styles.segmentDone]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
  progressRow: { flexDirection: 'row', gap: space.xs, paddingHorizontal: space.md, marginTop: space.sm },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: color.hairline },
  segmentDone: { backgroundColor: color.leaf },
});
