import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../../../core/context/WalletContext';
import { WalletCard } from '../components/WalletCard';
import { BalanceSummary } from '../components/BalanceSummary';
import { Loading } from '../../../shared/components/Loading';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

export const HomeScreen: React.FC = () => {
  const { wallet, loading, error, refreshWallet, refreshTransactions } = useWallet();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refrescar tanto carteras como transacciones
      await Promise.all([
        refreshWallet(),
        refreshTransactions()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <Loading text="Cargando carteras..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Balance Dual</Text>
          <Text style={styles.subtitle}>Controla tus finanzas</Text>
        </View>

        <BalanceSummary
          spending={wallet.spending}
          savings={wallet.savings}
          total={wallet.spending + wallet.savings}
        />

        <View style={styles.walletsContainer}>
          <WalletCard
            type="spending"
            amount={wallet.spending}
            title="Cartera de Gastos"
            subtitle="Dinero disponible para gastar"
            color={COLORS.spending}
          />

          <WalletCard
            type="savings"
            amount={wallet.savings}
            title="Cartera de Ahorros"
            subtitle="Dinero destinado a ahorrar"
            color={COLORS.savings}
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollView: {
    flex: 1,
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
  walletsContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
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
});


