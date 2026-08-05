import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, space } from '@/theme';

export interface StickyFooterProps {
  children: React.ReactNode;
}

export function StickyFooter({ children }: StickyFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + space.md }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: color.hairline,
    backgroundColor: color.oat,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
  },
});
