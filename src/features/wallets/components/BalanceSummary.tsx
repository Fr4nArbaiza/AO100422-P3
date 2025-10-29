import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { COLORS, SPACING, FONT_SIZES, CURRENCY_SYMBOL } from '../../../shared/constants';

interface BalanceSummaryProps {
  spending: number;
  savings: number;
  total: number;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  spending,
  savings,
  total,
}) => {
  const formatAmount = (value: number) => {
    return `${CURRENCY_SYMBOL}${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTotalColor = () => {
    if (total > 10000) return COLORS.success;
    if (total > 5000) return COLORS.primary;
    if (total > 1000) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumen Total</Text>
        <Text style={styles.subtitle}>Saldo combinado</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.totalAmount, { color: getTotalColor() }]}>
          {formatAmount(total)}
        </Text>
      </View>

      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <View style={[styles.colorIndicator, { backgroundColor: COLORS.spending }]} />
          <Text style={styles.breakdownLabel}>Gastos</Text>
          <Text style={styles.breakdownAmount}>{formatAmount(spending)}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={[styles.colorIndicator, { backgroundColor: COLORS.savings }]} />
          <Text style={styles.breakdownLabel}>Ahorros</Text>
          <Text style={styles.breakdownAmount}>{formatAmount(savings)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {total > 0 ? '¡Excelente control financiero!' : 'Comienza a gestionar tus finanzas'}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.lg,
    marginBottom: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  totalAmount: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
  },
  breakdown: {
    marginBottom: SPACING.md,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
  },
  breakdownAmount: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.dark,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});


