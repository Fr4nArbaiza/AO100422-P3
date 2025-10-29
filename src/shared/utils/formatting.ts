import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CURRENCY_SYMBOL } from '../constants';

/**
 * Formatting utilities for displaying data
 */
export const formatting = {
  /**
   * Format currency amount
   * @param amount - Amount to format
   * @param currency - Currency symbol (default: $)
   * @returns Formatted currency string
   */
  currency: (amount: number, currency: string = CURRENCY_SYMBOL): string => {
    return `${currency}${amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  /**
   * Format number with thousand separators
   * @param number - Number to format
   * @param decimals - Number of decimal places
   * @returns Formatted number string
   */
  number: (number: number, decimals: number = 0): string => {
    return number.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  /**
   * Format percentage
   * @param value - Value to format as percentage
   * @param decimals - Number of decimal places
   * @returns Formatted percentage string
   */
  percentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Format date
   * @param date - Date to format
   * @param formatString - Format string
   * @returns Formatted date string
   */
  date: (date: Date, formatString: string = 'dd MMM yyyy'): string => {
    return format(date, formatString, { locale: es });
  },

  /**
   * Format date and time
   * @param date - Date to format
   * @returns Formatted date and time string
   */
  dateTime: (date: Date): string => {
    return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
  },

  /**
   * Format time only
   * @param date - Date to format
   * @returns Formatted time string
   */
  time: (date: Date): string => {
    return format(date, 'HH:mm', { locale: es });
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   * @param date - Date to format
   * @returns Relative time string
   */
  relativeTime: (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime())) / 1000;

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    if (diffInSeconds < 31536000) return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
    return `Hace ${Math.floor(diffInSeconds / 31536000)} años`;
  },

  /**
   * Format phone number
   * @param phone - Phone number to format
   * @returns Formatted phone string
   */
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  /**
   * Format initials from name
   * @param name - Name to get initials from
   * @returns Initials string
   */
  initials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  },

  /**
   * Format file size
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Format transaction type for display
   * @param type - Transaction type
   * @returns Formatted type string
   */
  transactionType: (type: string): string => {
    const types: { [key: string]: string } = {
      income: 'Ingreso',
      expense: 'Gasto',
      transfer: 'Transferencia',
    };
    return types[type] || type;
  },

  /**
   * Format wallet type for display
   * @param type - Wallet type
   * @returns Formatted type string
   */
  walletType: (type: string): string => {
    const types: { [key: string]: string } = {
      spending: 'Gastos',
      savings: 'Ahorros',
    };
    return types[type] || type;
  },
};


