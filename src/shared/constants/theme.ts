import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from './index';

export const theme = {
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    error: COLORS.error,
    warning: COLORS.warning,
    success: COLORS.success,
    info: COLORS.info,
    light: COLORS.light,
    dark: COLORS.dark,
    white: COLORS.white,
    black: COLORS.black,
    gray: COLORS.gray,
    spending: COLORS.spending,
    savings: COLORS.savings,
  },
  spacing: {
    xs: SPACING.xs,
    sm: SPACING.sm,
    md: SPACING.md,
    lg: SPACING.lg,
    xl: SPACING.xl,
    xxl: SPACING.xxl,
  },
  typography: {
    xs: FONT_SIZES.xs,
    sm: FONT_SIZES.sm,
    md: FONT_SIZES.md,
    lg: FONT_SIZES.lg,
    xl: FONT_SIZES.xl,
    xxl: FONT_SIZES.xxl,
    xxxl: FONT_SIZES.xxxl,
  },
  borderRadius: {
    sm: BORDER_RADIUS.sm,
    md: BORDER_RADIUS.md,
    lg: BORDER_RADIUS.lg,
    xl: BORDER_RADIUS.xl,
    round: BORDER_RADIUS.round,
  },
  shadows: {
    small: {
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1.41,
      elevation: 2,
    },
    medium: {
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.27,
      elevation: 10,
    },
  },
};


