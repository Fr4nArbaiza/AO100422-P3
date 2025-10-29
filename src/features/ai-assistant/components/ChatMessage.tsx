import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatMessageProps {
  message: {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    suggestions?: string[];
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isAssistant = message.type === 'assistant';

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: es });
  };

  const handleSuggestionPress = (suggestion: string) => {
    // This would be handled by the parent component
    console.log('Suggestion pressed:', suggestion);
  };

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <Card style={[
        styles.messageCard,
        isUser && styles.userMessage,
        isAssistant && styles.assistantMessage,
      ]}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageIcon}>
            {isUser ? '👤' : '🤖'}
          </Text>
          <Text style={styles.messageTime}>
            {formatTime(message.timestamp)}
          </Text>
        </View>

        <Text style={[
          styles.messageContent,
          isUser && styles.userMessageContent,
          isAssistant && styles.assistantMessageContent,
        ]}>
          {message.content}
        </Text>

        {message.suggestions && message.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Sugerencias:</Text>
            {message.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                title={suggestion}
                onPress={() => handleSuggestionPress(suggestion)}
                variant="outline"
                size="small"
                style={styles.suggestionButton}
              />
            ))}
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  messageCard: {
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: COLORS.primary,
  },
  assistantMessage: {
    backgroundColor: COLORS.white,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  messageIcon: {
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.sm,
  },
  messageTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
  messageContent: {
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
  },
  userMessageContent: {
    color: COLORS.white,
  },
  assistantMessageContent: {
    color: COLORS.dark,
  },
  suggestionsContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  suggestionsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  suggestionButton: {
    marginBottom: SPACING.xs,
  },
});


