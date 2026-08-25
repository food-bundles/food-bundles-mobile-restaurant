import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { Card } from '@/components/primitives';
import { ChevronRightIcon } from '@/components/icons';

export interface MarketFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/** A pressable entry card linking to a marketplace feature screen (menu generator, buying advice, etc.). */
export function MarketFeatureCard({ icon, title, subtitle, onPress }: MarketFeatureCardProps) {
  const { colors } = useTheme();

  return (
    <Card onPress={onPress} accessibilityLabel={title} style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>{icon}</View>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>{subtitle}</Text>
      </View>
      <ChevronRightIcon color={colors.secondary} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  title: { ...text.bodySemi },
  subtitle: { ...text.caption, marginTop: 2 },
});
