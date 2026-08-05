import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';
import { Button } from './Button';

export interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.action}>
        <Button variant="secondary" size="sm" onPress={onRetry}>
          Retry
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: space.xl },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: color.tintChili,
  },
  title: { ...text.h2, color: color.ink, marginTop: space.md, textAlign: 'center' },
  message: { ...text.caption, color: color.muted, marginTop: space.xs, textAlign: 'center' },
  action: { marginTop: space.lg },
});
