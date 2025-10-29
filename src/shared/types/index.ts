export type TransactionType = 'income' | 'expense' | 'transfer';
export type WalletType = 'spending' | 'savings';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  spendingWallet: number;
  savingsWallet: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  fromWallet?: WalletType;
  toWallet?: WalletType;
  createdAt: Date;
}

export interface Wallet {
  spending: number;
  savings: number;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OTPVerification {
  code: string;
  verificationId: string;
}

export interface AIQuery {
  query: string;
  context: {
    spendingWallet: number;
    savingsWallet: number;
    recentTransactions: Transaction[];
  };
}

export interface AIResponse {
  response: string;
  suggestions?: string[];
}

export interface FormError {
  field: string;
  message: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}


