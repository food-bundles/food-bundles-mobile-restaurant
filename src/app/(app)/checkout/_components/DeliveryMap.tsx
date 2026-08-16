import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile, type Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import { useCheckoutStore } from '@/stores';

/**
 * Renders Google Maps tiles on Android when EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is configured
 * in app config; otherwise falls back to an OpenStreetMap raster tile overlay so the map
 * stays usable in this fully-mocked build with no real key provisioned.
 */
const HAS_GOOGLE_MAPS_KEY = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

const KIMIHURURA_REGION: Region = {
  latitude: -1.9441,
  longitude: 30.0619,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export function DeliveryMap() {
  const t = useT();
  const setAddress = useCheckoutStore((state) => state.setAddress);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(KIMIHURURA_REGION);

  const onDragEnd = (latitude: number, longitude: number) => {
    setRegion((prev) => ({ ...prev, latitude, longitude }));
    setAddress(`Pinned location · ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
  };

  const onUseCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const position = await Location.getCurrentPositionAsync({});
    const next: Region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(next);
    mapRef.current?.animateToRegion(next, 500);
    setAddress(`Current location · ${next.latitude.toFixed(4)}, ${next.longitude.toFixed(4)}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={KIMIHURURA_REGION}
        region={region}
      >
        {!HAS_GOOGLE_MAPS_KEY ? (
          <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        ) : null}
        <Marker
          coordinate={region}
          draggable
          onDragEnd={(e) => onDragEnd(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
          pinColor={color.marigold}
        />
      </MapView>
      <Pressable
        onPress={onUseCurrentLocation}
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
  container: { height: 200, position: 'relative' },
  map: { width: '100%', height: '100%' },
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
