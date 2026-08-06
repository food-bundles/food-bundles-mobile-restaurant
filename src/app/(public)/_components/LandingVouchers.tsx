import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import { plans } from '@/mocks';
import { PriceText } from '@/components/product';

export function LandingVouchers() {
  const t = useT();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('landing_voucherTitle')}</Text>
      <Text style={styles.subtitle}>{t('landing_voucherSubtitle')}</Text>
      <View style={styles.cards}>
        {plans.map((plan) => {
          const premium = plan.id === 'PREMIUM';
          return (
            <View key={plan.id} style={[styles.card, premium && styles.cardPremium]}>
              {premium ? (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularLabel}>{t('landing_mostPopular')}</Text>
                </View>
              ) : null}
              <View style={styles.cardHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <PriceText amount={plan.monthly} size="lg" />
              </View>
              {plan.features.map((feature) => (
                <Text key={feature} style={styles.feature}>
                  {'✓ '}
                  {feature}
                </Text>
              ))}
              <Pressable
                onPress={() => router.push('/(auth)/signup')}
                accessibilityRole="button"
                accessibilityLabel={t('landing_choosePlan', { plan: plan.name })}
                style={[styles.choose, premium ? styles.choosePremium : styles.chooseBasic]}
              >
                <Text style={[styles.chooseLabel, premium ? styles.choosePremiumLabel : styles.chooseBasicLabel]}>
                  {t('landing_choosePlan', { plan: plan.name })}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: space.lg, marginTop: space.xl },
  title: { ...text.h1, color: color.ink },
  subtitle: { ...text.caption, color: color.secondary, marginTop: space.xs },
  cards: { gap: space.md, marginTop: space.md },
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  cardPremium: { borderWidth: 2, borderColor: color.leaf },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: space.md,
    backgroundColor: color.marigold,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
  },
  popularLabel: { ...text.micro, color: color.pine },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  planName: { ...text.h2, color: color.ink },
  feature: { ...text.body, color: color.body, marginTop: space.xs },
  choose: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  chooseBasic: { backgroundColor: color.leaf },
  choosePremium: { backgroundColor: color.marigold },
  chooseLabel: { ...text.bodySemi },
  chooseBasicLabel: { color: color.paper },
  choosePremiumLabel: { color: color.pine },
});
