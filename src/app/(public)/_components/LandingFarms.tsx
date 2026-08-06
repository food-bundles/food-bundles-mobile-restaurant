import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import { farms, PLACEHOLDER_IMAGE } from '@/mocks';

export function LandingFarms() {
  const t = useT();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setActiveIndex((index) => (index + 1) % farms.length), 3800);
    return () => clearInterval(interval);
  }, [paused]);

  const activeFarm = farms[activeIndex];

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('landing_farmsTitle')}</Text>
      <Text style={styles.subtitle}>{t('landing_farmsSubtitle')}</Text>
      <View style={styles.card}>
        <Image
          source={PLACEHOLDER_IMAGE}
          accessible
          accessibilityLabel={`${activeFarm.name} farm`}
          style={styles.image}
        />
        <Text style={styles.farmName}>{activeFarm.name}</Text>
      </View>
      <View style={styles.dots}>
        {farms.map((farm, index) => (
          <Pressable
            key={farm.id}
            onPress={() => {
              setActiveIndex(index);
              setPaused(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Show ${farm.name} farm`}
            hitSlop={8}
            style={styles.dotHit}
          >
            <View style={[styles.dot, index === activeIndex && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: space.lg, marginTop: space.xl },
  title: { ...text.h1, color: color.ink },
  subtitle: { ...text.caption, color: color.secondary, marginTop: space.xs },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: space.md,
  },
  image: { width: '100%', height: 160, backgroundColor: color.neutral },
  farmName: {
    ...text.h2,
    color: color.paper,
    position: 'absolute',
    left: space.md,
    bottom: space.md,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.xs, marginTop: space.md },
  dotHit: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.disabledLine },
  dotActive: { backgroundColor: color.leaf, width: 18 },
});
