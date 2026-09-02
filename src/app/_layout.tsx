import { useEffect } from 'react';
import { AppState } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { hydrateLanguage } from '@/i18n';
import { hydrateTheme, useTheme } from '@/theme';
import { refreshStaleCaches } from '@/lib';
import { registerOrderStatusTask } from '@/tasks/orderStatusTask';
import { bootstrapNotifications } from '@/tasks/bootstrapNotifications';
import { InAppBanner } from '@/components/notifications/InAppBanner';
import { startPriceAlertPolling } from '@/tasks/priceAlertPoller';
import { ThemeTransitionOverlay } from '@/components/layout';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const { isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
  });

  useEffect(() => {
    hydrateLanguage().catch(() => undefined);
    hydrateTheme().catch(() => undefined);
    registerOrderStatusTask().catch(() => undefined);
    bootstrapNotifications().catch(() => undefined);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshStaleCaches();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => startPriceAlertPolling(), []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <InAppBanner />
      <ThemeTransitionOverlay />
    </GestureHandlerRootView>
  );
}
