import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';
import { useSessionStore } from '@/stores/sessionStore';

export default function Vouchers() {
  const tier = useSessionStore((s) => s.tier);
  const title = tier === 'NONE' ? 'Vouchers — Locked' : 'Vouchers — Active';
  return <PlaceholderScreen title={title} canGoBack={false} />;
}
