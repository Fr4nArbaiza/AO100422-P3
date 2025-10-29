import { auth } from '../../../core/config/firebase.config';
import {
  signInWithEmailAndPassword,
  signOut,
  PhoneAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db } from '../../../core/config/firebase.config';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import Constants from 'expo-constants';
import { LoginCredentials, OTPVerification } from '../../../shared/types';

/**
 * Service for handling authentication operations
 */
export const authService = {
  /**
   * Authenticate user with email and password
   * @param credentials - User login credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  /**
   * Register user with name, email and password
   */
  async register(data: { name: string; email: string; password: string }): Promise<void> {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (userCred.user) {
        await updateProfile(userCred.user, { displayName: data.name });
        await setDoc(doc(db, 'users', userCred.user.uid), {
          name: data.name,
          email: data.email,
          createdAt: serverTimestamp(),
          spendingWallet: 0,
          savingsWallet: 0,
        });

        // Enviar OTP por email tras el registro
        await this.sendEmailOTP(data.email);
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  /**
   * Genera OTP de 6 dígitos, lo guarda con expiración e intentos, y lo envía por email
   */
  async sendEmailOTP(email: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos
    const otpDocRef = doc(db, 'emailOtps', email);
    await setDoc(otpDocRef, {
      otp,
      attempts: 0,
      expiresAt,
      createdAt: serverTimestamp(),
    });

    const webhookUrl = (Constants.expoConfig?.extra as any)?.EMAIL_OTP_WEBHOOK_URL;
    console.log('Webhook URL:', webhookUrl);
    console.log('Sending OTP to:', email, 'Code:', otp);
    
    if (!webhookUrl) {
      console.warn('EMAIL_OTP_WEBHOOK_URL not configured');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, otpCode: otp, type: 'login' }),
      });
      const result = await response.text();
      console.log('Email sent response status:', response.status);
      console.log('Email sent response:', result);
      
      if (!response.ok) {
        console.error(`Webhook error ${response.status}:`, result);
        // No lanzar error, solo loggear para que el flujo continúe
        console.warn('Email sending failed, but continuing with OTP flow');
        return;
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // No lanzar error, solo loggear para que el flujo continúe
      console.warn('Email sending failed, but continuing with OTP flow');
    }
  },

  /**
   * Verifica OTP por email con máximo 3 intentos y expiración
   */
  async verifyEmailOTP(email: string, code: string): Promise<void> {
    const otpDocRef = doc(db, 'emailOtps', email);
    const snapshot = await getDoc(otpDocRef);
    if (!snapshot.exists()) throw new Error('Código inválido');
    const data = snapshot.data() as any;

    if (Date.now() > data.expiresAt) {
      throw new Error('El código ha expirado');
    }
    if (data.attempts >= 3) {
      throw new Error('Se superó el número de intentos');
    }
    if (data.otp !== code) {
      await updateDoc(otpDocRef, { attempts: (data.attempts || 0) + 1 });
      throw new Error('Código incorrecto');
    }
    // Código correcto: marcar como usado
    await updateDoc(otpDocRef, { attempts: (data.attempts || 0) + 1, usedAt: serverTimestamp() });
  },

  /**
   * Send OTP verification code to phone number
   * @param phoneNumber - Phone number to send OTP to
   * @returns Verification ID for OTP verification
   */
  async sendOTP(phoneNumber: string): Promise<string> {
    try {
      // Deshabilitado en Expo Go: requerimos expo-firebase-recaptcha o build nativa
      throw new Error('OTP por teléfono no está habilitado en Expo Go. Implementa expo-firebase-recaptcha o usa email/password.');
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  /**
   * Verify OTP code
   * @param otpData - OTP verification data
   */
  async verifyOTP(_otpData: OTPVerification): Promise<void> {
    throw new Error('OTP por teléfono no está habilitado en Expo Go. Implementa expo-firebase-recaptcha o usa email/password.');
  },

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Error al cerrar sesión');
    }
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Convert Firebase error codes to user-friendly messages
   * @param errorCode - Firebase error code
   * @returns User-friendly error message
   */
  getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No se encontró una cuenta con este correo electrónico',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/invalid-phone-number': 'Número de teléfono inválido',
      'auth/invalid-verification-code': 'Código de verificación inválido',
      'auth/invalid-verification-id': 'ID de verificación inválido',
      'auth/code-expired': 'El código ha expirado. Solicita uno nuevo',
    };

    return errorMessages[errorCode] || 'Error de autenticación';
  },
};


