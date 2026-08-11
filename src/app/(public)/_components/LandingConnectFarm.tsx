import { useState } from 'react';
import { Image, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import { LANDING_IMAGES } from '@/mocks';

const STATS = [
  { key: 'delivery', value: '24/7', label: 'Delivery' },
  { key: 'fulfilled', value: '99%', label: 'Fulfilled' },
  { key: 'restaurants', value: '50+', label: 'Restaurants' },
] as const;

function StatCard({ value, label }: { value: string; label: string }) {
  const [visible, setVisible] = useState(false);
  const opacity = useSharedValue(0);

  const onLayout = (_event: LayoutChangeEvent) => {
    if (visible) return;
    setVisible(true);
    opacity.value = withTiming(1, { duration: 700 });
  };

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View onLayout={onLayout} style={[styles.statCard, animatedStyle]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export function LandingConnectFarm() {
  const t = useT();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('landing_connectTitle')}</Text>
      <Text style={styles.subtitle}>{t('landing_connectSubtitle')}</Text>
      <Image
        source={LANDING_IMAGES.farmWorkersHarvesting}
        accessible
        accessibilityLabel={t('a11y_farmImage')}
        style={styles.image}
      />
      <View style={styles.statsRow}>
        {STATS.map((stat) => (
          <StatCard key={stat.key} value={stat.value} label={stat.label} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: space.lg, marginTop: space.xl },
  title: { ...text.h1, color: color.ink },
  subtitle: { ...text.caption, color: color.secondary, marginTop: space.xs },
  image: { width: '100%', height: 150, borderRadius: radius.lg, marginTop: space.md },
  statsRow: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  statCard: {
    flex: 1,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.md,
    padding: space.md,
    alignItems: 'center',
  },
  statValue: { ...text.h1, color: color.leaf },
  statLabel: { ...text.caption, color: color.secondary, marginTop: 2 },
});
