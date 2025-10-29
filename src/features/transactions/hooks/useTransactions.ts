import { useContext } from 'react';
import { WalletContext } from '../../../core/context/WalletContext';

/**
 * Custom hook to access transaction context
 * @returns Transaction context value
 */
export const useTransactions = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useTransactions debe ser usado dentro de un WalletProvider');
  }
  return context;
};


