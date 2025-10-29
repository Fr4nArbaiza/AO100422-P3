import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../../shared/constants';

interface QueryInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  value,
  onChangeText,
  onSend,
  disabled = false,
  placeholder = 'Pregunta a tu asistente financiero...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          multiline
          maxLength={500}
          editable={!disabled}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!value.trim() || disabled) && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
          disabled={!value.trim() || disabled}
        >
          <Text style={[
            styles.sendButtonText,
            (!value.trim() || disabled) && styles.sendButtonTextDisabled,
          ]}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
    maxHeight: 100,
    paddingRight: SPACING.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  sendButtonTextDisabled: {
    color: COLORS.white,
    opacity: 0.5,
  },
});


