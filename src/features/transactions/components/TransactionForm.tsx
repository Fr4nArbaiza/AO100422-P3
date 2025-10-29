import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { TransactionTypeSelector } from './TransactionTypeSelector';
import { TransactionType, WalletType } from '../../../shared/types';
import { COLORS, SPACING, MIN_AMOUNT, MAX_AMOUNT } from '../../../shared/constants';

interface TransactionFormData {
  type: TransactionType;
  amount: string;
  description: string;
  fromWallet?: WalletType;
  toWallet?: WalletType;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  loading?: boolean;
  initialValues?: Partial<TransactionFormData>;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  loading = false,
  initialValues,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: 'income',
      amount: '',
      description: '',
      fromWallet: 'spending',
      toWallet: 'savings',
      ...initialValues,
    },
  });

  const watchedType = watch('type');
  const watchedFromWallet = watch('fromWallet');
  const watchedToWallet = watch('toWallet');

  const handleTypeChange = (type: TransactionType) => {
    setValue('type', type);
    if (type === 'income') {
      setValue('fromWallet', 'spending');
      setValue('toWallet', 'savings');
    }
  };

  const handleWalletChange = (field: 'fromWallet' | 'toWallet', value: WalletType) => {
    setValue(field, value);
    if (field === 'fromWallet' && value === watchedToWallet) {
      setValue('toWallet', value === 'spending' ? 'savings' : 'spending');
    } else if (field === 'toWallet' && value === watchedFromWallet) {
      setValue('fromWallet', value === 'spending' ? 'savings' : 'spending');
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="type"
        render={({ field: { value } }) => (
          <TransactionTypeSelector
            selectedType={value}
            onTypeChange={handleTypeChange}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        rules={{
          required: 'El monto es obligatorio',
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Formato de monto inválido',
          },
          validate: (value) => {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < MIN_AMOUNT) {
              return `El monto mínimo es ${MIN_AMOUNT}`;
            }
            if (numValue > MAX_AMOUNT) {
              return `El monto máximo es ${MAX_AMOUNT}`;
            }
            return true;
          },
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Monto"
            value={value}
            onChangeText={onChange}
            placeholder="0.00"
            keyboardType="numeric"
            error={errors.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{
          required: 'La descripción es obligatoria',
          minLength: {
            value: 3,
            message: 'La descripción debe tener al menos 3 caracteres',
          },
          maxLength: {
            value: 200,
            message: 'La descripción no puede exceder 200 caracteres',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Descripción"
            value={value}
            onChangeText={onChange}
            placeholder="Describe la transacción"
            multiline
            numberOfLines={3}
            error={errors.description?.message}
          />
        )}
      />

      {watchedType === 'transfer' && (
        <View style={styles.transferContainer}>
          <View style={styles.walletSelector}>
            <Button
              title="Gastos"
              variant={watchedFromWallet === 'spending' ? 'primary' : 'outline'}
              onPress={() => handleWalletChange('fromWallet', 'spending')}
              size="small"
              style={styles.walletButton}
            />
            <Button
              title="Ahorros"
              variant={watchedFromWallet === 'savings' ? 'primary' : 'outline'}
              onPress={() => handleWalletChange('fromWallet', 'savings')}
              size="small"
              style={styles.walletButton}
            />
          </View>

          <View style={styles.walletSelector}>
            <Button
              title="Gastos"
              variant={watchedToWallet === 'spending' ? 'primary' : 'outline'}
              onPress={() => handleWalletChange('toWallet', 'spending')}
              size="small"
              style={styles.walletButton}
            />
            <Button
              title="Ahorros"
              variant={watchedToWallet === 'savings' ? 'primary' : 'outline'}
              onPress={() => handleWalletChange('toWallet', 'savings')}
              size="small"
              style={styles.walletButton}
            />
          </View>
        </View>
      )}

      <Button
        title="Crear Transacción"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transferContainer: {
    marginTop: SPACING.md,
  },
  walletSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  walletButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
});


