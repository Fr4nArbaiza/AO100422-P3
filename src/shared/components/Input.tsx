import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp, TextInputProps } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.focused,
    error && styles.error,
    props.editable === false && styles.disabled,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={inputContainerStyle}>
        <TextInput
          style={[styles.input, inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={COLORS.gray}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
  },
  focused: {
    borderColor: COLORS.primary,
  },
  error: {
    borderColor: COLORS.error,
  },
  disabled: {
    backgroundColor: COLORS.light,
    opacity: 0.6,
  },
  input: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
    minHeight: 48,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});


