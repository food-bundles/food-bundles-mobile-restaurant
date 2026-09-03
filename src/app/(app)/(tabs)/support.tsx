import { Redirect } from 'expo-router';

/**
 * Backing file for the tab bar's center AI-avatar slot. The slot's `tabBarButton`
 * always intercepts the press and pushes to `support/chat` directly, so this screen
 * is never actually shown — it only exists because expo-router's file-based tabs
 * require every `Tabs.Screen` to resolve to a real route.
 */
export default function SupportTabPlaceholder() {
  return <Redirect href="/(app)/support/chat" />;
}
