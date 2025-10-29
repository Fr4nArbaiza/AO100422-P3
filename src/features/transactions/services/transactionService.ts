import { db } from '../../../core/config/firebase.config';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  writeBatch,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { Transaction, TransactionType, WalletType } from '../../../shared/types';
import { walletService } from '../../wallets/services/walletService';

/**
 * Service for handling transaction operations
 */
export const transactionService = {
  /**
   * Create a new transaction and update wallet balances
   * @param transactionData - Transaction data
   */
  async createTransaction(transactionData: Transaction): Promise<void> {
    try {
      console.log('TransactionService: Creating transaction with data:', transactionData);
      
      const batch = writeBatch(db);
      const transactionRef = doc(collection(db, 'transactions'));
      
      // Filtrar campos undefined y vacíos para evitar errores de Firestore
      const transactionToSave = {
        userId: transactionData.userId,
        type: transactionData.type,
        amount: transactionData.amount,
        description: transactionData.description,
        createdAt: serverTimestamp(),
      };
      
      // Agregar campos opcionales solo si existen
      if (transactionData.fromWallet) {
        transactionToSave.fromWallet = transactionData.fromWallet;
      }
      if (transactionData.toWallet) {
        transactionToSave.toWallet = transactionData.toWallet;
      }
      
      console.log('TransactionService: Saving transaction:', transactionToSave);
      batch.set(transactionRef, transactionToSave);

      const userRef = doc(db, 'users', transactionData.userId);
      console.log('TransactionService: Getting user data for:', transactionData.userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists) {
        console.error('TransactionService: User not found:', transactionData.userId);
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      console.log('TransactionService: User data:', userData);
      
      let newSpendingWallet = userData?.spendingWallet || 0;
      let newSavingsWallet = userData?.savingsWallet || 0;

      switch (transactionData.type) {
        case 'income':
          newSpendingWallet += transactionData.amount;
          break;
        case 'expense':
          if (newSpendingWallet < transactionData.amount) {
            throw new Error('Saldo insuficiente en la cartera de gastos');
          }
          newSpendingWallet -= transactionData.amount;
          break;
        case 'transfer':
          if (transactionData.fromWallet === 'spending' && transactionData.toWallet === 'savings') {
            if (newSpendingWallet < transactionData.amount) {
              throw new Error('Saldo insuficiente en la cartera de gastos');
            }
            newSpendingWallet -= transactionData.amount;
            newSavingsWallet += transactionData.amount;
          } else if (transactionData.fromWallet === 'savings' && transactionData.toWallet === 'spending') {
            if (newSavingsWallet < transactionData.amount) {
              throw new Error('Saldo insuficiente en la cartera de ahorros');
            }
            newSavingsWallet -= transactionData.amount;
            newSpendingWallet += transactionData.amount;
          }
          break;
      }

      console.log('TransactionService: Updating wallet balances:', {
        newSpendingWallet,
        newSavingsWallet
      });
      
      batch.update(userRef, {
        spendingWallet: newSpendingWallet,
        savingsWallet: newSavingsWallet,
      });

      console.log('TransactionService: Committing batch...');
      await batch.commit();
      console.log('TransactionService: Transaction created successfully');
    } catch (error) {
      console.error('TransactionService: Error creating transaction:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al crear transacción');
    }
  },

  /**
   * Get all transactions for a user
   * @param userId - User ID
   * @returns Array of user transactions
   */
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      console.log('TransactionService: Getting transactions for user:', userId);
      
      // Primero obtener todas las transacciones del usuario sin orderBy
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      console.log('TransactionService: Found', snapshot.size, 'transactions');

      const transactions = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('TransactionService: Processing transaction:', doc.id, data);
        
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type as TransactionType,
          amount: data.amount,
          description: data.description,
          fromWallet: data.fromWallet as WalletType || undefined,
          toWallet: data.toWallet as WalletType || undefined,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      
      // Ordenar en memoria por fecha de creación (más reciente primero)
      transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log('TransactionService: Returning', transactions.length, 'transactions');
      return transactions;
    } catch (error) {
      console.error('TransactionService: Error getting user transactions:', error);
      throw new Error('Error al obtener transacciones');
    }
  },

  /**
   * Get transactions for a specific time period
   * @param userId - User ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of transactions in date range
   */
  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type as TransactionType,
          amount: data.amount,
          description: data.description,
          fromWallet: data.fromWallet as WalletType,
          toWallet: data.toWallet as WalletType,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      throw new Error('Error al obtener transacciones por rango de fecha');
    }
  },

  /**
   * Get transactions by type
   * @param userId - User ID
   * @param type - Transaction type
   * @returns Array of transactions of specific type
   */
  async getTransactionsByType(userId: string, type: TransactionType): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type as TransactionType,
          amount: data.amount,
          description: data.description,
          fromWallet: data.fromWallet as WalletType,
          toWallet: data.toWallet as WalletType,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      throw new Error('Error al obtener transacciones por tipo');
    }
  },
};


