import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';

export interface ChatBubbleProps {
  text: string;
  fromUser: boolean;
}

export function ChatBubble({ text: message, fromUser }: ChatBubbleProps) {
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
        <Text style={[styles.text, { color: fromUser ? colors.paper : colors.ink }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: space.sm },
  rowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.lg, padding: space.md },
  text: { ...text.body },
});
