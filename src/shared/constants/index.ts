export const COLORS = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  info: '#2196F3',
  light: '#F5F5F5',
  dark: '#212121',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  spending: '#FF5722',
  savings: '#4CAF50',
};

export const WALLET_COLORS = {
  spending: COLORS.spending,
  savings: COLORS.savings,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const TRANSACTION_TYPES = {
  INCOME: 'income' as const,
  EXPENSE: 'expense' as const,
  TRANSFER: 'transfer' as const,
};

export const WALLET_TYPES = {
  SPENDING: 'spending' as const,
  SAVINGS: 'savings' as const,
};

export const CURRENCY_SYMBOL = '$';

export const MAX_AMOUNT = 999999.99;
export const MIN_AMOUNT = 0.01;


