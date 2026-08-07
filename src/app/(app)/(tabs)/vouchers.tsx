import { VouchersLocked } from './_components/VouchersLocked';
import { VouchersActive } from './_components/VouchersActive';
import { useSessionStore, isVouchersUnlocked } from '@/stores';

export default function Vouchers() {
  const tier = useSessionStore((state) => state.tier);
  const unlocked = isVouchersUnlocked(tier);

  return unlocked ? <VouchersActive /> : <VouchersLocked />;
}
