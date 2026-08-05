import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, space } from '@/theme';

export interface ScreenScrollProps {
  contentInsetBottom?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function ScreenScroll({ contentInsetBottom = 0, contentContainerStyle, children }: ScreenScrollProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top, paddingBottom: contentInsetBottom + space.lg },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  content: { paddingHorizontal: space.lg },
});
