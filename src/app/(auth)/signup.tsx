import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, radius, text } from '@/theme';
import { useSessionStore } from '@/stores/sessionStore';
import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';

export default function Signup() {
  const login = useSessionStore((s) => s.login);

  const onSignup = () => {
    login();
    router.replace('/(app)/(tabs)');
  };

  return (
    <PlaceholderScreen title="Create a business account">
      <Pressable
        onPress={onSignup}
        accessibilityRole="button"
        accessibilityLabel="Create account"
        style={styles.primaryButton}
      >
        <Text style={styles.primaryLabel}>Create account</Text>
      </Pressable>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { ...text.bodySemi, color: color.paper },
});
