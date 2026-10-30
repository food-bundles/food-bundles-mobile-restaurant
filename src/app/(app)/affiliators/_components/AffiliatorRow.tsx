import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { Affiliator } from '@/types';

export interface AffiliatorRowProps {
  affiliator: Affiliator;
}

export function AffiliatorRow({ affiliator }: AffiliatorRowProps) {
  const t = useT();
  const { colors } = useTheme();
  const active = affiliator.status === 'ACTIVE';
  const initials = affiliator.name
    .split(' ')
    .map((part) => part[0])
    .join('');

  return (
    <Pressable
      onPress={() => router.push(`/(app)/affiliators/${affiliator.id}`)}
      accessibilityRole="button"
      accessibilityLabel={t('aff_viewDetails', { name: affiliator.name })}
      style={[styles.row, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
    >
      <View style={[styles.avatar, { backgroundColor: active ? colors.tintLeaf : colors.neutral }]}>
        <Text style={[styles.avatarLabel, { color: active ? colors.pine : colors.secondary }]}>{initials}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: colors.ink }]}>{affiliator.name}</Text>
        <Text style={[styles.role, { color: colors.secondary }]}>
          {affiliator.phone ?? affiliator.email ?? affiliator.role}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: active ? colors.tintRipe : colors.neutral }]}>
        <Text style={[styles.badgeLabel, { color: active ? colors.tintedGreenText : colors.secondary }]}>
          {active ? t('aff_statusActive') : t('aff_statusInvited')}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: { ...text.bodySemi },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  role: { ...text.caption, marginTop: 2 },
  badge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  badgeLabel: { ...text.micro },
});
