import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { BasketIcon, OrdersIcon, WalletIcon, MoreIcon, type IconProps } from '@/components/icons';
import { AvatarTabButton } from '@/components/navigation';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  const { colors } = useTheme();
  return <Text style={[styles.label, { color: focused ? colors.leaf : colors.muted }]}>{label}</Text>;
}

function TabIconPill({
  Icon,
  focused,
}: {
  Icon: (props: IconProps) => React.JSX.Element;
  focused: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.pill, focused && { backgroundColor: colors.tintLeaf }]}>
      <Icon size={20} color={focused ? colors.leaf : colors.muted} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.leaf,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { height: hit.min + space.lg + insets.bottom, paddingBottom: insets.bottom },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_shop'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_shop')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill Icon={BasketIcon} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tab_orders'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_orders')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill Icon={OrdersIcon} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: t('nav_aiSupport'),
          tabBarButton: () => <AvatarTabButton />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t('tab_wallet'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_wallet')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill Icon={WalletIcon} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tab_more'),
          tabBarLabel: ({ focused }) => <TabLabel label={t('tab_more')} focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIconPill Icon={MoreIcon} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: { ...text.micro },
  pill: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
});
