import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { firestore } from '../config/firebase.config';
import { User, Wallet, Transaction } from '../../shared/types';
import { walletService } from '../../features/wallets/services/walletService';
import { transactionService } from '../../features/transactions/services/transactionService';
import { useAuth } from './AuthContext';

interface WalletContextType {
  user: User | null;
  wallet: Wallet;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refreshWallet: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet>({ spending: 0, savings: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      loadUserData();
    } else {
      setUser(null);
      setWallet({ spending: 0, savings: 0 });
      setTransactions([]);
    }
  }, [authUser]);

  const loadUserData = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      setError(null);

      const userData = await walletService.getUser(authUser.uid);
      setUser(userData);
      setWallet({
        spending: userData.spendingWallet,
        savings: userData.savingsWallet,
      });

      const userTransactions = await transactionService.getUserTransactions(authUser.uid);
      setTransactions(userTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const refreshWallet = async () => {
    if (!authUser) return;

    try {
      setError(null);
      const userData = await walletService.getUser(authUser.uid);
      setUser(userData);
      setWallet({
        spending: userData.spendingWallet,
        savings: userData.savingsWallet,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cartera');
    }
  };

  const refreshTransactions = async () => {
    if (!authUser) return;

    try {
      setError(null);
      const userTransactions = await transactionService.getUserTransactions(authUser.uid);
      setTransactions(userTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar transacciones');
    }
  };

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!authUser) throw new Error('Usuario no autenticado');

    try {
      setError(null);
      console.log('Creating transaction with data:', transactionData);
      await transactionService.createTransaction({
        ...transactionData,
        userId: authUser.uid,
        id: '', // Se generará automáticamente en Firestore
        createdAt: new Date(), // Se sobrescribirá con serverTimestamp en el servicio
      });

      await refreshWallet();
      await refreshTransactions();
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err instanceof Error ? err.message : 'Error al crear transacción');
      throw err;
    }
  };

  const value: WalletContextType = {
    user,
    wallet,
    transactions,
    loading,
    error,
    refreshWallet,
    refreshTransactions,
    createTransaction,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet debe ser usado dentro de un WalletProvider');
  }
  return context;
};


