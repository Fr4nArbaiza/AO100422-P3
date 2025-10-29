import { MIN_AMOUNT, MAX_AMOUNT } from '../constants';

/**
 * Validation utilities for forms and data
 */
export const validation = {
  /**
   * Validate email format
   * @param email - Email to validate
   * @returns Validation result
   */
  email: (email: string): { isValid: boolean; message?: string } => {
    if (!email.trim()) {
      return { isValid: false, message: 'El correo electrónico es obligatorio' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Formato de correo electrónico inválido' };
    }
    
    return { isValid: true };
  },

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns Validation result
   */
  password: (password: string): { isValid: boolean; message?: string } => {
    if (!password) {
      return { isValid: false, message: 'La contraseña es obligatoria' };
    }
    
    if (password.length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    
    return { isValid: true };
  },

  /**
   * Validate phone number
   * @param phone - Phone number to validate
   * @returns Validation result
   */
  phone: (phone: string): { isValid: boolean; message?: string } => {
    if (!phone.trim()) {
      return { isValid: false, message: 'El número de teléfono es obligatorio' };
    }
    
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, message: 'Formato de número de teléfono inválido' };
    }
    
    return { isValid: true };
  },

  /**
   * Validate amount
   * @param amount - Amount to validate
   * @returns Validation result
   */
  amount: (amount: string | number): { isValid: boolean; message?: string } => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
      return { isValid: false, message: 'El monto debe ser un número válido' };
    }
    
    if (numAmount < MIN_AMOUNT) {
      return { isValid: false, message: `El monto mínimo es ${MIN_AMOUNT}` };
    }
    
    if (numAmount > MAX_AMOUNT) {
      return { isValid: false, message: `El monto máximo es ${MAX_AMOUNT}` };
    }
    
    return { isValid: true };
  },

  /**
   * Validate description
   * @param description - Description to validate
   * @returns Validation result
   */
  description: (description: string): { isValid: boolean; message?: string } => {
    if (!description.trim()) {
      return { isValid: false, message: 'La descripción es obligatoria' };
    }
    
    if (description.trim().length < 3) {
      return { isValid: false, message: 'La descripción debe tener al menos 3 caracteres' };
    }
    
    if (description.length > 200) {
      return { isValid: false, message: 'La descripción no puede exceder 200 caracteres' };
    }
    
    return { isValid: true };
  },

  /**
   * Validate OTP code
   * @param code - OTP code to validate
   * @returns Validation result
   */
  otpCode: (code: string): { isValid: boolean; message?: string } => {
    if (!code.trim()) {
      return { isValid: false, message: 'El código de verificación es obligatorio' };
    }
    
    if (!/^\d{6}$/.test(code.trim())) {
      return { isValid: false, message: 'El código debe tener 6 dígitos' };
    }
    
    return { isValid: true };
  },

  /**
   * Validate required field
   * @param value - Value to validate
   * @param fieldName - Name of the field for error message
   * @returns Validation result
   */
  required: (value: any, fieldName: string): { isValid: boolean; message?: string } => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return { isValid: false, message: `${fieldName} es obligatorio` };
    }
    
    return { isValid: true };
  },

  /**
   * Validate string length
   * @param value - Value to validate
   * @param minLength - Minimum length
   * @param maxLength - Maximum length
   * @param fieldName - Name of the field for error message
   * @returns Validation result
   */
  stringLength: (
    value: string,
    minLength: number,
    maxLength: number,
    fieldName: string
  ): { isValid: boolean; message?: string } => {
    if (value.length < minLength) {
      return { isValid: false, message: `${fieldName} debe tener al menos ${minLength} caracteres` };
    }
    
    if (value.length > maxLength) {
      return { isValid: false, message: `${fieldName} no puede exceder ${maxLength} caracteres` };
    }
    
    return { isValid: true };
  },
};


