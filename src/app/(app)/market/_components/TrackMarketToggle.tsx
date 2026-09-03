import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { duration, hit, radius, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';
import { UpgradePromptSheet } from './UpgradePromptSheet';

export interface TrackMarketToggleProps {
  subscribed: boolean;
  commodity: string;
  alertPrice: number;
}

const KNOB_SIZE = 22;
const TRACK_WIDTH = 44;

/** Premium-gated price-drop alert toggle for the selected commodity. */
export function TrackMarketToggle({ subscribed, commodity, alertPrice }: TrackMarketToggleProps) {
  const t = useT();
  const { colors } = useTheme();
  const [tracking, setTracking] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(tracking ? TRACK_WIDTH - KNOB_SIZE - 3 : 3, { duration: duration.tint }) }],
  }));

  const onPress = () => {
    if (!subscribed) {
      setShowUpgrade(true);
      return;
    }
    setTracking((prev) => !prev);
  };

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('market_trackToggleTitle')}</Text>
        {tracking ? (
          <Text style={[styles.sub, { color: colors.secondary }]}>
            {t('market_trackToggleSub', { commodity, price: formatRwf(alertPrice) })}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={onPress}
        accessibilityRole="switch"
        accessibilityState={{ checked: tracking, disabled: !subscribed }}
        accessibilityLabel={t('a11y_trackMarketToggle')}
        style={styles.hitArea}
      >
        <View
          style={[
            styles.track,
            { backgroundColor: tracking ? colors.leaf : colors.disabledLine },
            !subscribed && styles.trackDisabled,
          ]}
        >
          <Animated.View style={[styles.knob, { backgroundColor: colors.paper }, knobStyle]} />
        </View>
      </Pressable>
      <UpgradePromptSheet visible={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  textCol: { flex: 1 },
  title: { ...text.bodySemi },
  sub: { ...text.caption, marginTop: 2 },
  hitArea: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  track: {
    width: TRACK_WIDTH,
    height: 26,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  trackDisabled: { opacity: 0.5 },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
  },
});
