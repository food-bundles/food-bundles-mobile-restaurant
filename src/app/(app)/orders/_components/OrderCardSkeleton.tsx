import { StyleSheet, View } from 'react-native';
import { radius, space, useTheme } from '@/theme';
import { Skeleton } from '@/components/primitives';

export interface OrderCardSkeletonProps {
  faded?: boolean;
}

export function OrderCardSkeleton({ faded }: OrderCardSkeletonProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.paper, borderColor: colors.hairline },
        faded && styles.faded,
      ]}
    >
      <View style={styles.topRow}>
        <Skeleton width="34%" height={14} />
        <Skeleton width="24%" height={18} radius={radius.pill} />
      </View>
      <View style={styles.middleGap}>
        <Skeleton width="50%" height={11} />
      </View>
      <Skeleton width="100%" height={5} radius={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  faded: { opacity: 0.6 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  middleGap: { marginVertical: space.sm },
});
