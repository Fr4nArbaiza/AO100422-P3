import { db } from '../../../core/config/firebase.config';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from '../../../shared/types';

/**
 * Service for handling wallet operations
 */
export const walletService = {
  /**
   * Get user data from Firestore
   * @param userId - User ID
   * @returns User data
   */
  async getUser(userId: string): Promise<User> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      return {
        id: userDoc.id,
        email: userData?.email || '',
        createdAt: userData?.createdAt?.toDate() || new Date(),
        spendingWallet: userData?.spendingWallet || 0,
        savingsWallet: userData?.savingsWallet || 0,
      };
    } catch (error) {
      throw new Error('Error al obtener datos del usuario');
    }
  },

  /**
   * Create new user document in Firestore
   * @param userData - User data to create
   */
  async createUser(userData: Omit<User, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error('Error al crear usuario');
    }
  },

  /**
   * Update user wallet balances
   * @param userId - User ID
   * @param spendingWallet - New spending wallet balance
   * @param savingsWallet - New savings wallet balance
   */
  async updateWalletBalances(
    userId: string,
    spendingWallet: number,
    savingsWallet: number
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        spendingWallet,
        savingsWallet,
      });
    } catch (error) {
      throw new Error('Error al actualizar saldos de cartera');
    }
  },

  /**
   * Initialize user wallets with zero balance
   * @param userId - User ID
   * @param email - User email
   */
  async initializeUserWallets(userId: string, email: string): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), {
        email,
        spendingWallet: 0,
        savingsWallet: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error('Error al inicializar carteras del usuario');
    }
  },
};


