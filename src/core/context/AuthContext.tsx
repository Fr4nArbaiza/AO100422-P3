import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthUser, LoginCredentials, OTPVerification } from '../../shared/types';
import { authService } from '../../features/auth/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  pendingOTP: boolean;
  pendingEmail: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  sendEmailOTP: (email: string) => Promise<void>;
  verifyEmailOTP: (email: string, code: string) => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<string>;
  verifyOTP: (otpData: OTPVerification) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingOTP, setPendingOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged - user:', !!user, 'pendingOTP:', pendingOTP);
      if (user && !pendingOTP) {
        // Solo establecer usuario si no hay OTP pendiente
        console.log('Setting user from onAuthStateChanged');
        setUser({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        });
      } else if (!user) {
        console.log('No user, clearing state');
        setUser(null);
        // Solo limpiar OTP si no está en proceso de login
        if (!pendingOTP) {
          setPendingOTP(false);
          setPendingEmail(null);
        }
      } else if (user && pendingOTP) {
        console.log('User exists but OTP pending, not setting user yet');
        // Asegurar que el usuario no esté establecido si hay OTP pendiente
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [pendingOTP]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      console.log('Starting login for:', credentials.email);
      
      // Primero verificar credenciales
      await authService.login(credentials);
      console.log('Login successful, setting OTP state...');
      
      // Solo después de login exitoso, establecer estado OTP
      setPendingOTP(true);
      setPendingEmail(credentials.email);
      console.log('Pending OTP state set to true AFTER login');
      
      // Enviar OTP por email
      await authService.sendEmailOTP(credentials.email);
      console.log('OTP sent');
    } catch (err) {
      console.error('Login error:', err);
      // Si hay error, limpiar estado OTP
      setPendingOTP(false);
      setPendingEmail(null);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      setError(null);
      await authService.register(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      throw err;
    }
  };

  const sendEmailOTP = async (email: string) => {
    try {
      setError(null);
      await authService.sendEmailOTP(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar OTP');
      throw err;
    }
  };

  const verifyEmailOTP = async (email: string, code: string) => {
    try {
      setError(null);
      await authService.verifyEmailOTP(email, code);
      // OTP verificado correctamente, establecer usuario como autenticado
      setPendingOTP(false);
      setPendingEmail(null);
      // El usuario ya está autenticado en Firebase, se establecerá automáticamente
      // Forzar la actualización del estado del usuario
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar OTP');
      throw err;
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<string> => {
    try {
      setError(null);
      return await authService.sendOTP(phoneNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código OTP');
      throw err;
    }
  };

  const verifyOTP = async (otpData: OTPVerification) => {
    try {
      setError(null);
      await authService.verifyOTP(otpData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar código OTP');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setPendingOTP(false);
      setPendingEmail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    pendingOTP,
    pendingEmail,
    login,
    register,
    sendEmailOTP,
    verifyEmailOTP,
    sendOTP,
    verifyOTP,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};


