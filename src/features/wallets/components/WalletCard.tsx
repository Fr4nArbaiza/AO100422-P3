import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { WalletType } from '../../../shared/types';
import { COLORS, SPACING, FONT_SIZES, CURRENCY_SYMBOL } from '../../../shared/constants';

interface WalletCardProps {
  type: WalletType;
  amount: number;
  title: string;
  subtitle: string;
  color: string;
  onPress?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  type,
  amount,
  title,
  subtitle,
  color,
  onPress,
}) => {
  const formatAmount = (value: number) => {
    return `${CURRENCY_SYMBOL}${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'spending':
        return '💳';
      case 'savings':
        return '💰';
      default:
        return '💵';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={[styles.card, { borderLeftColor: color }]}>
        <View style={styles.header}>
          <Text style={styles.icon}>{getIcon()}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color }]}>
            {formatAmount(amount)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {type === 'spending' ? 'Gastos' : 'Ahorros'}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: FONT_SIZES.xxl,
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
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
    marginBottom: SPACING.md,
  },
  amount: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});


