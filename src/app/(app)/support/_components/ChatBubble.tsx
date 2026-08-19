import { Image, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';

export interface ChatBubbleProps {
  text: string;
  fromUser: boolean;
  imageUri?: string;
}

export function ChatBubble({ text: message, fromUser, imageUri }: ChatBubbleProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, fromUser && styles.rowUser]}>
      <View
        style={[
          styles.bubble,
          fromUser
            ? { backgroundColor: colors.leaf }
            : { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.hairline },
        ]}
      >
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
        {message ? <Text style={[styles.text, { color: fromUser ? colors.paper : colors.ink }]}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: space.sm },
  rowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.lg, padding: space.md },
  text: { ...text.body },
  image: { width: 200, height: 150, borderRadius: radius.md, marginBottom: space.xs },
});
