import { useContext } from 'react';
import { WalletContext } from '../../../core/context/WalletContext';

/**
 * Custom hook to access wallet context
 * @returns Wallet context value
 */
export const useWallets = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallets debe ser usado dentro de un WalletProvider');
  }
  return context;
};


