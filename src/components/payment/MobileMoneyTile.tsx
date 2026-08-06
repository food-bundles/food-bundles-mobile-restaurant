import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, space, text } from '@/theme';
import { detectTelecom } from '@/lib';
import { PaymentTileBase } from './PaymentTileBase';

export interface MobileMoneyTileProps {
  selected: boolean;
  onPress: () => void;
  phone: string;
  onChangeNumber: () => void;
}

function TelecomLogo({ label, active, tint }: { label: string; active: boolean; tint: string }) {
  return (
    <View style={[styles.logo, { backgroundColor: tint, opacity: active ? 1 : 0.32 }]}>
      <Text style={styles.logoLabel}>{label}</Text>
    </View>
  );
}

export function MobileMoneyTile({ selected, onPress, phone, onChangeNumber }: MobileMoneyTileProps) {
  const telecom = detectTelecom(phone);

  return (
    <PaymentTileBase
      selected={selected}
      onPress={onPress}
      accessibilityLabel="Pay with Mobile Money"
      title="Mobile Money"
      subtitle="MTN MoMo or Airtel Money"
      logos={
        <View style={styles.logos}>
          <TelecomLogo label="MTN" active={telecom === 'MTN'} tint={color.mtn} />
          <TelecomLogo label="Airtel" active={telecom === 'AIRTEL'} tint={color.airtel} />
        </View>
      }
      expandedContent={
        <View style={styles.phoneRow}>
          <Text style={styles.phoneText}>{phone}</Text>
          <Pressable
            onPress={onChangeNumber}
            accessibilityRole="button"
            accessibilityLabel="Change mobile money number"
            style={styles.changeButton}
          >
            <Text style={styles.changeLabel}>Change</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  logos: { flexDirection: 'row', gap: space.xs },
  logo: { width: 32, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  logoLabel: { ...text.micro, color: color.ink },
  phoneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phoneText: { ...text.bodySemi, color: color.ink },
  changeButton: { minHeight: hit.min, paddingHorizontal: space.sm, alignItems: 'center', justifyContent: 'center' },
  changeLabel: { ...text.label, color: color.leaf },
});
