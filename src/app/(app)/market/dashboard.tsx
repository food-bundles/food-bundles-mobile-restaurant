import { useCallback } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenHeader } from '@/components/layout';
import { useOrdersStore } from '@/stores';
import { useT } from '@/i18n';
import { useFocusEffect } from 'expo-router';

const fmt = (n: number) =>
  'RWF ' + Math.round(n).toLocaleString('en-RW');

export default function Dashboard() {
  const t = useT();
  const { colors } = useTheme();
  const stats = useOrdersStore((s) => s.stats);
  const statsStatus = useOrdersStore((s) => s.statsStatus);
  const fetchStats = useOrdersStore((s) => s.fetchStats);
  const orders = useOrdersStore((s) => s.orders);
  const fetch = useOrdersStore((s) => s.fetch);
  const ordersStatus = useOrdersStore((s) => s.status);

  useFocusEffect(
    useCallback(() => {
      void fetchStats();
      if (ordersStatus === 'idle') void fetch();
    }, [fetchStats, fetch, ordersStatus]),
  );

  const onRefresh = useCallback(() => {
    void fetchStats();
    void fetch();
  }, [fetchStats, fetch]);

  const recentOrders = orders.slice(0, 5);

  const isLoading = statsStatus === 'loading' && !stats;

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('dash_title')} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={statsStatus === 'loading'}
            onRefresh={onRefresh}
            tintColor={colors.leaf}
          />
        }
      >
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.leaf} size="large" />
          </View>
        ) : (
          <>
            {/* ── Metric cards ─────────────────────────────────── */}
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
              {t('dash_overview')}
            </Text>

            <View style={styles.metricsGrid}>
              <MetricCard
                label={t('dash_totalOrders')}
                value={String(stats?.totalOrders ?? 0)}
                accent={colors.leaf}
                bg={colors.tintLeaf}
                textColor={colors.pine}
              />
              <MetricCard
                label={t('dash_totalSpent')}
                value={fmt(stats?.totalSpent ?? 0)}
                accent={colors.leaf}
                bg={colors.tintLeaf}
                textColor={colors.pine}
              />
              <MetricCard
                label={t('dash_completed')}
                value={String(stats?.completedOrders ?? 0)}
                accent={colors.ripe}
                bg={colors.tintLeaf}
                textColor={colors.ripe}
              />
              <MetricCard
                label={t('dash_cancelled')}
                value={String(stats?.cancelledOrders ?? 0)}
                accent={colors.chili}
                bg={colors.tintChili}
                textColor={colors.chili}
              />
            </View>

            {/* ── Average order value ───────────────────────────── */}
            {stats && stats.averageOrderValue > 0 ? (
              <View style={[styles.avgCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                <Text style={[styles.avgLabel, { color: colors.secondary }]}>
                  {t('dash_avgOrderValue')}
                </Text>
                <Text style={[styles.avgValue, { color: colors.ink }]}>
                  {fmt(stats.averageOrderValue)}
                </Text>
              </View>
            ) : null}

            {/* ── Recent orders ─────────────────────────────────── */}
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
                {t('dash_recentOrders')}
              </Text>
              <Pressable
                onPress={() => router.push('/(app)/(tabs)/orders')}
                accessibilityRole="button"
                hitSlop={8}
              >
                <Text style={[styles.seeAll, { color: colors.leaf }]}>{t('dash_seeAll')}</Text>
              </Pressable>
            </View>

            {recentOrders.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                <Text style={[styles.emptyText, { color: colors.secondary }]}>{t('dash_noOrders')}</Text>
              </View>
            ) : (
              <View style={[styles.ordersCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                {recentOrders.map((order, idx) => (
                  <Pressable
                    key={order.id}
                    onPress={() => router.push(`/(app)/orders/${order.id}` as any)}
                    accessibilityRole="button"
                    style={[
                      styles.orderRow,
                      idx < recentOrders.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline },
                    ]}
                  >
                    <View style={styles.orderRowLeft}>
                      <Text style={[styles.orderNum, { color: colors.ink }]}>#{order.id}</Text>
                      <Text style={[styles.orderDate, { color: colors.secondary }]}>
                        {new Date(order.placedAt).toLocaleDateString('en-RW', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <View style={styles.orderRowRight}>
                      <Text style={[styles.orderTotal, { color: colors.ink }]}>{fmt(order.total)}</Text>
                      <StatusChip status={order.status} colors={colors} t={t} />
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  accent,
  bg,
  textColor,
}: {
  label: string;
  value: string;
  accent: string;
  bg: string;
  textColor: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.metricCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={[styles.metricAccentBar, { backgroundColor: accent }]} />
      <Text style={[styles.metricLabel, { color: colors.secondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const STATUS_COLOR: Record<string, 'leaf' | 'chili' | 'marigold' | 'secondary'> = {
  DELIVERED: 'leaf',
  CANCELLED: 'chili',
  REFUNDED: 'chili',
  PENDING: 'marigold',
  CONFIRMED: 'marigold',
  PREPARING: 'marigold',
  READY: 'marigold',
  IN_TRANSIT: 'marigold',
};

function StatusChip({
  status,
  colors,
  t,
}: {
  status: string;
  colors: ReturnType<typeof useTheme>['colors'];
  t: ReturnType<typeof useT>;
}) {
  const colorKey = STATUS_COLOR[status] ?? 'secondary';
  const color = colors[colorKey];
  const labelMap: Record<string, string> = {
    DELIVERED: t('dash_statusDelivered'),
    CANCELLED: t('dash_statusCancelled'),
    REFUNDED: t('dash_statusRefunded'),
    PENDING: t('dash_statusPending'),
    CONFIRMED: t('dash_statusConfirmed'),
    PREPARING: t('dash_statusPreparing'),
    READY: t('dash_statusReady'),
    IN_TRANSIT: t('dash_statusInTransit'),
  };
  return (
    <Text style={[styles.statusChip, { color }]}>{labelMap[status] ?? status}</Text>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: space.md, paddingBottom: space.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: space.xxl },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.lg,
    marginBottom: space.sm,
  },
  seeAll: { ...text.label },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  metricCard: {
    width: '47.5%',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    overflow: 'hidden',
  },
  metricAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  metricLabel: { ...text.caption, marginTop: space.xs },
  metricValue: { ...text.h1, marginTop: space.xs },
  avgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.sm,
  },
  avgLabel: { ...text.label },
  avgValue: { ...text.h2 },
  ordersCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  orderRowLeft: { flex: 1, gap: 2 },
  orderRowRight: { alignItems: 'flex-end', gap: 2 },
  orderNum: { ...text.label },
  orderDate: { ...text.caption },
  orderTotal: { ...text.bodySemi },
  statusChip: { ...text.caption },
  emptyCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.xl,
    alignItems: 'center',
  },
  emptyText: { ...text.body },
});
