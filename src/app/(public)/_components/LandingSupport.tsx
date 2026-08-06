import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

interface SupportChannel {
  key: string;
  label: string;
  value: string;
  danger?: boolean;
}

const CHANNELS: SupportChannel[] = [
  { key: 'email', label: 'Email', value: 'sales@food.rw · info@food.rw' },
  { key: 'phone', label: 'Phone', value: '+250 796 897 823' },
  { key: 'location', label: 'Location', value: 'KG 5 Ave, Kigali' },
  { key: 'callCentre', label: 'Call centre', value: '6054' },
  { key: 'emergency', label: 'Emergency line', value: '+250 788 300 911', danger: true },
];

export function LandingSupport() {
  const t = useT();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('landing_supportTitle')}</Text>
      <Text style={styles.subtitle}>{t('landing_supportSubtitle')}</Text>
      <View style={styles.card}>
        {CHANNELS.map((channel) => (
          <View key={channel.key} style={styles.row}>
            <View style={[styles.iconWrap, channel.danger && styles.iconWrapDanger]} />
            <View style={styles.textCol}>
              <Text style={styles.label}>{channel.label}</Text>
              <Text style={styles.value}>{channel.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <Pressable
        onPress={() => router.push('/(app)/support/chat')}
        accessibilityRole="button"
        accessibilityLabel={t('landing_chatWithAgent')}
        style={styles.chatButton}
      >
        <Text style={styles.chatLabel}>{t('landing_chatWithAgent')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: space.lg, marginTop: space.xl },
  title: { ...text.h1, color: color.ink },
  subtitle: { ...text.caption, color: color.secondary, marginTop: space.xs },
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.neutralLine,
  },
  iconWrap: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: color.tintLeaf },
  iconWrapDanger: { backgroundColor: color.tintChili },
  textCol: { flex: 1 },
  label: { ...text.overline, color: color.secondary },
  value: { ...text.bodySemi, color: color.ink, marginTop: 2 },
  chatButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  chatLabel: { ...text.bodySemi, color: color.leaf },
});
