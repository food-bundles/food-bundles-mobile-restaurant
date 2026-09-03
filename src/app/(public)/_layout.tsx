import { Stack } from 'expo-router';

export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="guest/shop" />
      <Stack.Screen name="guest/cart" />
      <Stack.Screen name="guest/delivery" />
      <Stack.Screen name="guest/payment" />
      <Stack.Screen name="guest/confirmation" />
    </Stack>
  );
}
