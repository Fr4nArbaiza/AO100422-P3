import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: 'small' | 'medium' | 'large';
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'medium',
  shadow = true,
}) => {
  const cardStyle = [
    styles.card,
    styles[padding],
    shadow && styles.shadow,
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  small: {
    padding: SPACING.sm,
  },
  medium: {
    padding: SPACING.md,
  },
  large: {
    padding: SPACING.lg,
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});


