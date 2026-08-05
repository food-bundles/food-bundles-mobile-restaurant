import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>;
}

function TabIconPill({ glyph, focused }: { glyph: string; focused: boolean }) {
  return (
    <Text style={[styles.pill, focused && styles.pillActive, focused && styles.glyphActive]}>
      {glyph}
    </Text>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const t = useT();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.leaf,
        tabBarInactiveTintColor: color.muted,
        tabBarStyle: { height: hit.min + space.lg + insets.bottom, paddingBottom: insets.bottom },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_shop'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_shop')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill glyph="S" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tab_orders'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_orders')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill glyph="O" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t('tab_wallet'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_wallet')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill glyph="W" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="vouchers"
        options={{
          title: t('tab_vouchers'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_vouchers')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill glyph="V" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tab_more'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_more')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill glyph="M" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: { ...text.micro, color: color.muted },
  labelActive: { color: color.leaf },
  pill: {
    ...text.label,
    color: color.muted,
    width: 32,
    height: 24,
    textAlign: 'center',
    borderRadius: radius.sm,
  },
  pillActive: { backgroundColor: color.tintLeaf },
  glyphActive: { color: color.leaf },
});
