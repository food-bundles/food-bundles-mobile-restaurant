import { useNotificationsStore } from '@/stores';
import { useMarketStore } from '@/stores/marketStore';
import { scheduleLocalNotification } from '@/services/notificationService';
import { formatRwf, COMMODITY_PRODUCT_ID } from '@/lib';
import { translate } from '@/i18n';

const POLL_INTERVAL_MS = 60_000;

function findCrossedProductIds(): { productId: string; price: number }[] {
  const alerts = useNotificationsStore.getState().priceAlerts;
  const dashboard = useMarketStore.getState().dashboard;
  if (!dashboard) return [];

  const crossed: { productId: string; price: number }[] = [];

  for (const alert of alerts) {
    const commodityId = (Object.entries(COMMODITY_PRODUCT_ID) as [string, string][]).find(
      ([, productId]) => productId === alert.productId,
    )?.[0];
    if (!commodityId) continue;

    const commodity = dashboard.commodities.find((c) => c.id === commodityId);
    if (!commodity) continue;

    const price = commodity.latestPrice;
    const crossedBelow = alert.direction === 'below' && price <= alert.thresholdRwf;
    const crossedAbove = alert.direction === 'above' && price >= alert.thresholdRwf;
    if (crossedBelow || crossedAbove) crossed.push({ productId: alert.productId, price });
  }

  return crossed;
}

/** Starts the price-alert poller; returns a stop function. Checks every 60s. */
export function startPriceAlertPolling(): () => void {
  const interval = setInterval(async () => {
    const crossed = findCrossedProductIds();
    for (const { productId, price } of crossed) {
      await scheduleLocalNotification({
        channel: 'priceAlert',
        title: translate('notif_priceAlertTitle', { product: productId, price: formatRwf(price) }),
        body: translate('notif_priceAlertBody'),
        deepLink: '/(app)/market/price-comparison',
        actionLabel: translate('notif_viewPriceAction'),
      });
    }
  }, POLL_INTERVAL_MS);

  return () => clearInterval(interval);
}
