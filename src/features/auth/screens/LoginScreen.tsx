import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../core/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Card } from '../../../shared/components/Card';
import { Loading } from '../../../shared/components/Loading';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen: React.FC = () => {
  const { login, sendEmailOTP, loading, error } = useAuth();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email: email.trim(), password });
      
      // Después del login exitoso, enviar OTP por email
      await sendEmailOTP(email.trim());
      Alert.alert('Código enviado', 'Se ha enviado un código de verificación a tu email');
      
      // El AppNavigator se encargará de navegar a OTP automáticamente
    } catch (err) {
      Alert.alert('Error de inicio de sesión', error || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate('Register');
  };

  if (loading) {
    return <Loading text="Cargando..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Balance Dual</Text>
            <Text style={styles.subtitle}>Controla tus finanzas de manera inteligente</Text>
          </View>

          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>Iniciar Sesión</Text>
            
            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Tu contraseña"
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.linkText} onPress={handleGoToRegister} accessibilityRole="button">
                Regístrate aquí
              </Text>
            </Text>
          </View>
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
  },
  formCard: {
    marginBottom: SPACING.xl,
  },
  formTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});


