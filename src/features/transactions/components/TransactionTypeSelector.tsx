import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { TransactionType } from '../../../shared/types';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

interface TransactionTypeSelectorProps {
  selectedType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const transactionTypes = [
    {
      type: 'income' as TransactionType,
      title: 'Ingreso',
      subtitle: 'Suma a Gastos',
      icon: '💰',
      color: COLORS.success,
    },
    {
      type: 'expense' as TransactionType,
      title: 'Gasto',
      subtitle: 'Resta de Gastos',
      icon: '💸',
      color: COLORS.error,
    },
    {
      type: 'transfer' as TransactionType,
      title: 'Transferir',
      subtitle: 'Entre carteras',
      icon: '🔄',
      color: COLORS.primary,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de Transacción</Text>
      <View style={styles.typesContainer}>
        {transactionTypes.map((transaction) => (
          <Button
            key={transaction.type}
            title={`${transaction.icon} ${transaction.title}`}
            onPress={() => onTypeChange(transaction.type)}
            variant={selectedType === transaction.type ? 'primary' : 'outline'}
            size="small"
            style={[
              styles.typeButton,
              selectedType === transaction.type && {
                backgroundColor: transaction.color,
                borderColor: transaction.color,
              },
            ]}
            textStyle={[
              styles.buttonText,
              selectedType === transaction.type && { color: COLORS.white },
            ]}
          />
        ))}
      </View>
      <View style={styles.selectedInfo}>
        <Text style={styles.selectedIcon}>
          {transactionTypes.find(t => t.type === selectedType)?.icon}
        </Text>
        <Text style={styles.selectedSubtitle}>
          {transactionTypes.find(t => t.type === selectedType)?.subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  typeButton: {
    flex: 1,
    minHeight: 40,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  buttonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.light,
    borderRadius: 8,
  },
  selectedIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.sm,
  },
  selectedSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});


