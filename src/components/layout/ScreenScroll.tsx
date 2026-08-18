import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useTheme } from '@/theme';

export interface ScreenScrollProps {
  contentInsetBottom?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Set to false when a header above already consumes the top safe-area inset */
  applyTopInset?: boolean;
  children: React.ReactNode;
}

export function ScreenScroll({
  contentInsetBottom = 0,
  contentContainerStyle,
  applyTopInset = true,
  children,
}: ScreenScrollProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.oat }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: applyTopInset ? insets.top : 0,
          paddingBottom: contentInsetBottom + space.lg,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: space.lg },
});
