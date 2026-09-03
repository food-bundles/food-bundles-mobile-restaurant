import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { duration, hit, radius, space, text, useTheme } from '@/theme';
import { BasketIcon, OrdersIcon, WalletIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { LANDING_IMAGES } from '@/mocks';
import { OnboardingSlide } from './_components/OnboardingSlide';
import { OnboardingPager } from './_components/OnboardingPager';

const SLIDE_COUNT = 3;

export default function Onboarding() {
  const t = useT();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const goToSignup = () => router.push('/(auth)/signup');
  const goToLogin = () => router.push('/(auth)/login');
  const goToGuestShop = () => router.push('/(public)/guest/shop');

  const onPrimaryPress = () => {
    if (activeIndex < SLIDE_COUNT - 1) {
      scrollRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
      return;
    }
    goToSignup();
  };

  const isLastSlide = activeIndex === SLIDE_COUNT - 1;
  const primaryLabelOpacity = useSharedValue(1);

  useEffect(() => {
    primaryLabelOpacity.value = 0;
    primaryLabelOpacity.value = withTiming(1, { duration: duration.tint });
  }, [isLastSlide, primaryLabelOpacity]);

  const primaryLabelStyle = useAnimatedStyle(() => ({ opacity: primaryLabelOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + space.sm }]}>
        <Pressable
          onPress={goToLogin}
          accessibilityRole="button"
          accessibilityLabel={t('onboarding_skip')}
          style={styles.skipButton}
        >
          <Text style={[styles.skipLabel, { color: colors.secondary }]}>{t('onboarding_skip')}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.pager}
      >
        <OnboardingSlide
          image={LANDING_IMAGES.chefPreparing}
          imageLabel={t('a11y_chefImage')}
          title={t('onboarding_slide1Title')}
          subtitle={t('onboarding_slide1Subtitle')}
        />
        <OnboardingSlide
          icon={<OrdersIcon size={72} color={colors.leaf} />}
          title={t('onboarding_slide2Title')}
          subtitle={t('onboarding_slide2Subtitle')}
        />
        <OnboardingSlide
          icon={<WalletIcon size={72} color={colors.leaf} />}
          title={t('onboarding_slide3Title')}
          subtitle={t('onboarding_slide3Subtitle')}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        <OnboardingPager count={SLIDE_COUNT} activeIndex={activeIndex} />
        <Pressable
          onPress={onPrimaryPress}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? t('onboarding_getStarted') : t('onboarding_next')}
          style={[styles.primaryButton, { backgroundColor: colors.leaf }]}
        >
          <Animated.Text style={[styles.primaryLabel, { color: colors.paper }, primaryLabelStyle]}>
            {isLastSlide ? t('onboarding_getStarted') : t('onboarding_next')}
          </Animated.Text>
        </Pressable>
        {isLastSlide && (
          <>
            <Pressable
              onPress={goToLogin}
              accessibilityRole="button"
              accessibilityLabel={t('onboarding_alreadyHaveAccount')}
              style={styles.loginLinkButton}
            >
              <Text style={[styles.loginLinkLabel, { color: colors.leaf }]}>
                {t('onboarding_alreadyHaveAccount')}
              </Text>
            </Pressable>
            <Pressable
              onPress={goToGuestShop}
              accessibilityRole="button"
              accessibilityLabel={t('onboarding_shopAsGuest')}
              style={styles.guestButton}
            >
              <BasketIcon size={16} color={colors.secondary} />
              <Text style={[styles.guestLabel, { color: colors.secondary }]}>{t('onboarding_shopAsGuest')}</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: space.lg },
  skipButton: { minHeight: hit.min, paddingHorizontal: space.sm, alignItems: 'center', justifyContent: 'center' },
  skipLabel: { ...text.label },
  pager: { flex: 1 },
  footer: { paddingHorizontal: space.lg, gap: space.md },
  primaryButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  primaryLabel: { ...text.bodySemi },
  loginLinkButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center' },
  loginLinkLabel: { ...text.label },
  guestButton: {
    minHeight: hit.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  guestLabel: { ...text.label },
});
