import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export function ConvertPrompt() {
  const t = useT();

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{t('guest_createAccountPrompt')}</Text>
      <Pressable
        onPress={() => router.push('/(auth)/signup')}
        accessibilityRole="button"
        accessibilityLabel={t('guest_createAccount')}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>{t('guest_createAccount')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.tintLeaf,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  text: { ...text.caption, color: color.pine },
  button: { minHeight: 44, alignItems: 'flex-start', justifyContent: 'center' },
  buttonLabel: { ...text.bodySemi, color: color.leaf },
});
