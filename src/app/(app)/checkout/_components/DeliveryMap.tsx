import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export function DeliveryMap() {
  const t = useT();

  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 344 174" width="100%" height={174}>
        <Rect width={344} height={174} fill={color.mapLand} />
        <Path d="M-10 22 L92 6 L124 72 L40 98 L-10 82 Z" fill={color.mapParks} />
        <Path d="M252 174 L344 122 L344 174 Z" fill={color.mapWater} />
        <Rect x={74} y={72} width={36} height={26} rx={3} fill={color.mapBuildings} opacity={0.55} />
        <Rect x={162} y={54} width={34} height={22} rx={3} fill={color.mapBuildings} opacity={0.55} />
      </Svg>
      <View style={styles.radius} />
      <View style={styles.pinWrap}>
        <Svg viewBox="0 0 24 30" width={30} height={38}>
          <Path
            d="M12 0a12 12 0 0 0-12 12c0 8 12 18 12 18s12-10 12-18A12 12 0 0 0 12 0z"
            fill={color.marigold}
            stroke={color.paper}
            strokeWidth={2}
          />
          <Circle cx={12} cy={12} r={4.4} fill={color.pine} />
        </Svg>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('checkout_useLocation')}
        style={styles.locationButton}
      >
        <Text style={styles.locationLabel}>{t('checkout_useLocation')}</Text>
      </Pressable>
      <View style={styles.hint}>
        <Text style={styles.hintLabel}>{t('checkout_dragPin')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 174, position: 'relative', overflow: 'hidden' },
  radius: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 96,
    height: 96,
    marginTop: -48,
    marginLeft: -48,
    borderRadius: 48,
    backgroundColor: color.tintMarigold,
    borderWidth: 1,
    borderColor: color.marigoldLine,
  },
  pinWrap: { position: 'absolute', top: '50%', left: '50%', marginTop: -38, marginLeft: -15 },
  locationButton: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    minHeight: 44,
    backgroundColor: color.paper,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationLabel: { ...text.label, color: color.leaf },
  hint: {
    position: 'absolute',
    bottom: space.sm,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: color.ink,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  hintLabel: { ...text.micro, color: color.paper },
});
