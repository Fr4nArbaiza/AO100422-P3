import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = COLORS.primary,
  text,
  overlay = false,
}) => {
  const containerStyle = overlay ? styles.overlay : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
    textAlign: 'center',
  },
});


