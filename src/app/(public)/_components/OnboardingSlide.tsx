import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { color, radius, space, text } from '@/theme';

export interface OnboardingSlideProps {
  image?: ImageSourcePropType;
  imageLabel?: string;
  icon?: ReactNode;
  title: string;
  subtitle: string;
}

/** One full-width slide in the onboarding pager: an image or icon, a title and a subtitle. */
export function OnboardingSlide({ image, imageLabel, icon, title, subtitle }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      {image ? (
        <Image source={image} accessible accessibilityLabel={imageLabel} style={styles.image} />
      ) : (
        <View style={styles.iconWrap}>{icon}</View>
      )}
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: space.xl },
  image: {
    width: '100%',
    height: 260,
    borderRadius: radius.lg,
    marginTop: space.xxl,
    backgroundColor: color.neutral,
  },
  iconWrap: {
    width: 200,
    height: 200,
    borderRadius: radius.pill,
    marginTop: space.xxl,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { marginTop: space.xxl, alignItems: 'center' },
  title: { ...text.h1, color: color.ink, textAlign: 'center' },
  subtitle: { ...text.body, color: color.secondary, textAlign: 'center', marginTop: space.sm },
});
