import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export function LandingFarmerBand() {
  const t = useT();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('landing_farmerTitle')}</Text>
      <Text style={styles.subtitle}>{t('landing_farmerSubtitle')}</Text>
      <Pressable
        onPress={() => router.push('/(public)/farmer-join')}
        accessibilityRole="button"
        accessibilityLabel={t('landing_joinNow')}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>{t('landing_joinNow')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.pine,
    borderRadius: radius.lg,
    padding: space.lg,
    marginHorizontal: space.lg,
    marginTop: space.xl,
  },
  title: { ...text.h2, color: color.paper },
  subtitle: { ...text.caption, color: color.onPine, marginTop: space.sm },
  button: {
    minHeight: 48,
    backgroundColor: color.marigold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  buttonLabel: { ...text.bodySemi, color: color.pine },
});
