import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, text } from '@/theme';
import { useSessionStore } from '@/stores/sessionStore';
import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';

export default function Login() {
  const login = useSessionStore((s) => s.login);

  const onLogin = () => {
    login();
    router.replace('/(app)/(tabs)');
  };

  return (
    <PlaceholderScreen title="Log in">
      <Pressable
        onPress={onLogin}
        accessibilityRole="button"
        accessibilityLabel="Log in"
        style={styles.primaryButton}
      >
        <Text style={styles.primaryLabel}>Log in</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(auth)/signup')}
        accessibilityRole="button"
        accessibilityLabel="Create a business account"
        style={styles.linkButton}
      >
        <Text style={styles.linkLabel}>Create a business account</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(auth)/forgot-password')}
        accessibilityRole="button"
        accessibilityLabel="Forgot password"
        style={styles.linkButton}
      >
        <Text style={styles.linkLabel}>Forgot password</Text>
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
  linkButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { ...text.bodySemi, color: color.leaf },
});
