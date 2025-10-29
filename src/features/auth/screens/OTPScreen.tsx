import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../core/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Card } from '../../../shared/components/Card';
import { Loading } from '../../../shared/components/Loading';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

export const OTPScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { verifyEmailOTP, logout, error, pendingEmail, sendEmailOTP } = useAuth();
  const email = pendingEmail;
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 segundos
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOTP = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Error', 'El código debe tener 6 dígitos');
      return;
    }

    try {
      setIsLoading(true);
      if (!email) throw new Error('Falta email');
      await verifyEmailOTP(email, code.trim());
      Alert.alert('Verificado', 'Código correcto. Bienvenido.');
      // No necesitamos navegar manualmente, el AuthContext manejará el estado
    } catch (err) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        Alert.alert('Intentos agotados', 'Regresando a inicio de sesión.');
        // Resetear estado de OTP pendiente
        await logout();
        return;
      }
      Alert.alert('Error de verificación', error || 'Código inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (!email) return;
      
      // Deshabilitar botón inmediatamente y reiniciar temporizador
      setIsResending(true);
      setTimeLeft(30);
      setAttempts(0);
      
      await sendEmailOTP(email);
      Alert.alert('Código reenviado', 'Se ha enviado un nuevo código de verificación');
    } catch (err) {
      Alert.alert('Error', 'No se pudo reenviar el código');
      // Si hay error, permitir reenvío inmediato
      setTimeLeft(0);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      await logout(); // Limpiar estado de autenticación y OTP pendiente
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Verificación OTP (Email)</Text>
            <Text style={styles.subtitle}>
              Ingresa el código de 6 dígitos enviado a{'\n'}
              <Text style={styles.phoneNumber}>{email}</Text>
            </Text>
          </View>

          <Card style={styles.formCard}>
            <Input
              label="Código de verificación"
              value={code}
              onChangeText={setCode}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.codeInput}
            />

            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {timeLeft > 0 ? `Reenviar en ${timeLeft} segundos` : 'Puedes reenviar el código'}
              </Text>
            </View>

            <Button
              title="Verificar Código"
              onPress={handleVerifyOTP}
              loading={isLoading}
              disabled={isLoading || code.length !== 6}
              style={styles.verifyButton}
            />

            <Button
              title={isResending ? "Enviando..." : "Reenviar Código"}
              onPress={handleResendCode}
              variant="outline"
              disabled={timeLeft > 0 || isResending}
              loading={isResending}
              style={styles.resendButton}
            />

            <Button
              title="Volver a Login"
              onPress={handleBackToLogin}
              variant="outline"
              style={styles.backButton}
            />
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: '600',
    color: COLORS.dark,
  },
  formCard: {
    marginBottom: SPACING.xl,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: FONT_SIZES.xl,
    letterSpacing: 8,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  timerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  verifyButton: {
    marginTop: SPACING.md,
  },
  resendButton: {
    marginTop: SPACING.sm,
  },
  backButton: {
    marginTop: SPACING.sm,
  },
});


