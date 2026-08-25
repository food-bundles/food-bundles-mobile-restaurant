import { Redirect, Stack } from 'expo-router';
import { useSessionStore } from '@/stores/sessionStore';

export default function AppLayout() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return <Redirect href="/(public)/onboarding" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="checkout"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="wallet/top-up"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="subscription/terms"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="subscription/underwriting"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="vouchers/consent"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="vouchers/score-result"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="support/chat"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="affiliators/session"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
    </Stack>
  );
}
