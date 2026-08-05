import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ChevronLeftIcon } from '@/components/icons';

export interface PlaceholderScreenProps {
  title: string;
  canGoBack?: boolean;
  children?: React.ReactNode;
}

export function PlaceholderScreen({ title, canGoBack = true, children }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      {canGoBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
      ) : null}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat, padding: space.lg, gap: space.md },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h1, color: color.ink },
});
