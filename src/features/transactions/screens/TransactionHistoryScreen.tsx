import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../../../core/context/WalletContext';
import { TransactionItem } from '../components/TransactionItem';
import { Loading } from '../../../shared/components/Loading';
import { Transaction, TransactionType } from '../../../shared/types';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../../../core/context/AuthContext';

export const TransactionHistoryScreen: React.FC = () => {
  const { transactions, loading, error, refreshTransactions } = useWallet();
  const { user: authUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  const handleFilterChange = (newFilter: TransactionType | 'all') => {
    setFilter(newFilter);
  };

  const handleDebugTransactions = async () => {
    if (!authUser) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    try {
      console.log('Debug: Testing transaction query for user:', authUser.uid);
      const debugTransactions = await transactionService.getUserTransactions(authUser.uid);
      console.log('Debug: Retrieved transactions:', debugTransactions);
      
      Alert.alert(
        'Debug Info', 
        `Transacciones encontradas: ${debugTransactions.length}\n\n` +
        `Datos: ${JSON.stringify(debugTransactions.slice(0, 2), null, 2)}`
      );
    } catch (error) {
      console.error('Debug: Error getting transactions:', error);
      Alert.alert('Debug Error', `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  const getFilterButtonStyle = (type: TransactionType | 'all') => ({
    ...styles.filterButton,
    backgroundColor: filter === type ? COLORS.primary : COLORS.white,
  });

  const getFilterTextStyle = (type: TransactionType | 'all') => ({
    ...styles.filterText,
    color: filter === type ? COLORS.white : COLORS.primary,
  });

  if (loading) {
    return <Loading text="Cargando transacciones..." />;
  }

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📊</Text>
      <Text style={styles.emptyTitle}>No hay transacciones</Text>
      <Text style={styles.emptySubtitle}>
        Comienza registrando tu primera transacción
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Transacciones</Text>
        <Text style={styles.subtitle}>
          {filteredTransactions.length} de {transactions.length} transacciones
          {filter !== 'all' && ` (${filter === 'income' ? 'Ingresos' : filter === 'expense' ? 'Gastos' : 'Transferencias'})`}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filtersLabel}>Filtrar por tipo:</Text>
        <View style={styles.filtersRow}>
          {['all', 'income', 'expense', 'transfer'].map((type) => (
            <TouchableOpacity
              key={type}
              style={getFilterButtonStyle(type as TransactionType | 'all')}
              onPress={() => handleFilterChange(type as TransactionType | 'all')}
              activeOpacity={0.7}
            >
              <Text style={getFilterTextStyle(type as TransactionType | 'all')}>
                {type === 'all' ? 'Todas' : 
                 type === 'income' ? 'Ingresos' :
                 type === 'expense' ? 'Gastos' : 'Transferencias'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
 
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  filtersContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  filtersLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  listContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
  errorContainer: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.error,
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: FONT_SIZES.sm,
  },
  debugButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.warning,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
});


