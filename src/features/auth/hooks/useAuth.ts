import { useContext } from 'react';
import { AuthContext } from '../../../core/context/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};


