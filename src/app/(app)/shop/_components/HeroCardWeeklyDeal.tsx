import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, signatureDuration, space, text } from '@/theme';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';
import { LANDING_IMAGES } from '@/mocks/landingImages';

export interface HeroCardWeeklyDealProps {
  phase: 1 | 2;
  overline: string;
  title: string;
  subtitle: string;
  closesInLabel: string;
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardWeeklyDeal({
  phase,
  overline,
  title,
  subtitle,
  closesInLabel,
  linkLabel,
  onPress,
}: HeroCardWeeklyDealProps) {
  const zoom = useSharedValue(1);
  const subtitleFade = useSharedValue(1);

  useEffect(() => {
    zoom.value = 1;
    zoom.value = withTiming(1.13, { duration: signatureDuration.carouselKenBurns });
  }, [zoom]);

  useEffect(() => {
    subtitleFade.value = withTiming(0, { duration: signatureDuration.carouselPhaseFade / 2 }, () => {
      subtitleFade.value = withTiming(1, { duration: signatureDuration.carouselPhaseFade / 2 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const photoStyle = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleFade.value }));

  return (
    <HeroCardShell
      onPress={onPress}
      accessibilityLabel={`${overline}, ${title}`}
      tone="photo"
      overline={overline}
      background={
        <>
          <Animated.Image source={LANDING_IMAGES.weeklyDealCrate} style={[styles.photo, photoStyle]} />
          <View style={styles.scrim} />
        </>
      }
    >
      <View />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          {phase === 1 ? subtitle : closesInLabel}
        </Animated.Text>
        <View style={styles.linkGap}>
          <HeroCardLink label={linkLabel} />
        </View>
      </View>
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  photo: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.pine,
    opacity: 0.55,
  },
  title: { ...text.h2, color: color.paper },
  subtitle: { ...text.caption, color: color.onPineSoft, marginTop: 2 },
  linkGap: { marginTop: space.xs },
});
