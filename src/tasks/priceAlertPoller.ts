import { useNotificationsStore } from '@/stores';
import { scheduleLocalNotification } from '@/services/notificationService';
import { formatRwf, COMMODITY_PRODUCT_ID } from '@/lib';
import { translate } from '@/i18n';
import { PRICE_HISTORY } from '@/mocks/marketPrices';
import type { CommodityId } from '@/mocks/marketPrices';

const POLL_INTERVAL_MS = 60_000;

function findCrossedProductIds(): { productId: string; price: number }[] {
  const alerts = useNotificationsStore.getState().priceAlerts;
  const crossed: { productId: string; price: number }[] = [];

  for (const alert of alerts) {
    const commodityId = (Object.entries(COMMODITY_PRODUCT_ID) as [CommodityId, string][]).find(
      ([, productId]) => productId === alert.productId,
    )?.[0];
    if (!commodityId) continue;

    const history = PRICE_HISTORY[commodityId];
    const price = history[history.length - 1];
    const crossedBelow = alert.direction === 'below' && price <= alert.thresholdRwf;
    const crossedAbove = alert.direction === 'above' && price >= alert.thresholdRwf;
    if (crossedBelow || crossedAbove) crossed.push({ productId: alert.productId, price });
  }

  return crossed;
}

/** Starts the DEV-only mock price-alert poller; returns a stop function. Checks every 60s. */
export function startPriceAlertPolling(): () => void {
  if (!__DEV__) return () => undefined;

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
