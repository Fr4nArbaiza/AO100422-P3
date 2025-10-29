import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { Transaction, TransactionType } from '../../../shared/types';
import { COLORS, SPACING, FONT_SIZES, CURRENCY_SYMBOL } from '../../../shared/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const formatAmount = (value: number) => {
    return `${CURRENCY_SYMBOL}${value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return '💰';
      case 'expense':
        return '💸';
      case 'transfer':
        return '🔄';
      default:
        return '💵';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return COLORS.success;
      case 'expense':
        return COLORS.error;
      case 'transfer':
        return COLORS.primary;
      default:
        return COLORS.gray;
    }
  };

  const getTransactionTitle = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'Ingreso';
      case 'expense':
        return 'Gasto';
      case 'transfer':
        return 'Transferencia';
      default:
        return 'Transacción';
    }
  };

  const getTransferDescription = () => {
    if (transaction.type === 'transfer' && transaction.fromWallet && transaction.toWallet) {
      const fromLabel = transaction.fromWallet === 'spending' ? 'Gastos' : 'Ahorros';
      const toLabel = transaction.toWallet === 'spending' ? 'Gastos' : 'Ahorros';
      return `${fromLabel} → ${toLabel}`;
    }
    return '';
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getTransactionIcon(transaction.type)}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{getTransactionTitle(transaction.type)}</Text>
          <Text style={styles.description}>{transaction.description}</Text>
          {transaction.type === 'transfer' && (
            <Text style={styles.transferInfo}>{getTransferDescription()}</Text>
          )}
        </View>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amount,
            { color: getTransactionColor(transaction.type) }
          ]}>
            {transaction.type === 'expense' ? '-' : '+'}{formatAmount(transaction.amount)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
        <View style={[
          styles.typeBadge,
          { backgroundColor: getTransactionColor(transaction.type) }
        ]}>
          <Text style={styles.typeBadgeText}>
            {getTransactionTitle(transaction.type)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  icon: {
    fontSize: FONT_SIZES.xl,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  transferInfo: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '500',
  },
});


