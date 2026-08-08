import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';

export interface ChatBubbleProps {
  text: string;
  fromUser: boolean;
}

export function ChatBubble({ text: message, fromUser }: ChatBubbleProps) {
  return (
    <View style={[styles.row, fromUser && styles.rowUser]}>
      <View style={[styles.bubble, fromUser ? styles.bubbleUser : styles.bubbleAgent]}>
        <Text style={[styles.text, fromUser && styles.textUser]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: space.sm },
  rowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.lg, padding: space.md },
  bubbleAgent: { backgroundColor: color.paper, borderWidth: 1, borderColor: color.hairline },
  bubbleUser: { backgroundColor: color.leaf },
  text: { ...text.body, color: color.ink },
  textUser: { color: color.paper },
});
