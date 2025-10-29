import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../../../core/context/WalletContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Card } from '../../../shared/components/Card';
import { TransactionTypeSelector } from '../components/TransactionTypeSelector';
import { TransactionType, WalletType } from '../../../shared/types';
import { COLORS, SPACING, FONT_SIZES, MIN_AMOUNT, MAX_AMOUNT } from '../../../shared/constants';

export const NewTransactionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { createTransaction, wallet } = useWallet();
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fromWallet, setFromWallet] = useState<WalletType>('spending');
  const [toWallet, setToWallet] = useState<WalletType>('savings');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount.trim() || !description.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < MIN_AMOUNT || amountValue > MAX_AMOUNT) {
      Alert.alert('Error', `El monto debe estar entre ${MIN_AMOUNT} y ${MAX_AMOUNT}`);
      return;
    }

    if (type === 'expense' && wallet.spending < amountValue) {
      Alert.alert('Error', 'Saldo insuficiente en la cartera de gastos');
      return;
    }

    if (type === 'transfer') {
      if (fromWallet === 'spending' && wallet.spending < amountValue) {
        Alert.alert('Error', 'Saldo insuficiente en la cartera de gastos');
        return;
      }
      if (fromWallet === 'savings' && wallet.savings < amountValue) {
        Alert.alert('Error', 'Saldo insuficiente en la cartera de ahorros');
        return;
      }
    }

    try {
      setIsLoading(true);
      await createTransaction({
        type,
        amount: amountValue,
        description: description.trim(),
        fromWallet: type === 'transfer' ? fromWallet : undefined,
        toWallet: type === 'transfer' ? toWallet : undefined,
      });

      Alert.alert('Éxito', 'Transacción creada correctamente', [
        { text: 'OK', onPress: () => {
          setAmount('');
          setDescription('');
          navigation.goBack();
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setFromWallet('spending');
      setToWallet('savings');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Transacción</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Registra un movimiento financiero</Text>
          <Text style={styles.subtitle}>Mantén tus finanzas organizadas</Text>
        </View>

        <Card style={styles.formCard}>
          <TransactionTypeSelector
            selectedType={type}
            onTypeChange={handleTypeChange}
          />

          <Input
            label="Monto"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
          />

          <Input
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe la transacción"
            multiline
            numberOfLines={3}
          />

          {type === 'transfer' && (
            <View style={styles.transferContainer}>
              <Text style={styles.transferLabel}>Transferir desde:</Text>
              <View style={styles.walletSelector}>
                <Button
                  title="Gastos"
                  variant={fromWallet === 'spending' ? 'primary' : 'outline'}
                  onPress={() => setFromWallet('spending')}
                  size="small"
                  style={styles.walletButton}
                />
                <Button
                  title="Ahorros"
                  variant={fromWallet === 'savings' ? 'primary' : 'outline'}
                  onPress={() => setFromWallet('savings')}
                  size="small"
                  style={styles.walletButton}
                />
              </View>

              <Text style={styles.transferLabel}>Transferir hacia:</Text>
              <View style={styles.walletSelector}>
                <Button
                  title="Gastos"
                  variant={toWallet === 'spending' ? 'primary' : 'outline'}
                  onPress={() => setToWallet('spending')}
                  size="small"
                  style={styles.walletButton}
                />
                <Button
                  title="Ahorros"
                  variant={toWallet === 'savings' ? 'primary' : 'outline'}
                  onPress={() => setToWallet('savings')}
                  size="small"
                  style={styles.walletButton}
                />
              </View>
            </View>
          )}

          <Button
            title="Crear Transacción"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  backButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.dark,
  },
  placeholder: {
    width: 60, // Para balancear el header
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  formCard: {
    margin: SPACING.lg,
  },
  transferContainer: {
    marginTop: SPACING.md,
  },
  transferLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
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


