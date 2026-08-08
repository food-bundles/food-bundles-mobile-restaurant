import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import type { Affiliator } from '@/mocks/types';

export interface AffiliatorRowProps {
  affiliator: Affiliator;
}

export function AffiliatorRow({ affiliator }: AffiliatorRowProps) {
  const t = useT();
  const active = affiliator.status === 'ACTIVE';
  const initials = affiliator.name
    .split(' ')
    .map((part) => part[0])
    .join('');

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, !active && styles.avatarInactive]}>
        <Text style={[styles.avatarLabel, !active && styles.avatarLabelInactive]}>{initials}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.name}>{affiliator.name}</Text>
        <Text style={styles.role}>{affiliator.role}</Text>
      </View>
      <View style={[styles.badge, !active && styles.badgeInactive]}>
        <Text style={[styles.badgeLabel, !active && styles.badgeLabelInactive]}>
          {active ? t('aff_statusActive') : t('aff_statusInvited')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInactive: { backgroundColor: color.neutral },
  avatarLabel: { ...text.bodySemi, color: color.pine },
  avatarLabelInactive: { color: color.secondary },
  textCol: { flex: 1 },
  name: { ...text.bodySemi, color: color.ink },
  role: { ...text.caption, color: color.secondary, marginTop: 2 },
  badge: { backgroundColor: color.tintRipe, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  badgeInactive: { backgroundColor: color.neutral },
  badgeLabel: { ...text.micro, color: color.tintedGreenText },
  badgeLabelInactive: { color: color.secondary },
});
