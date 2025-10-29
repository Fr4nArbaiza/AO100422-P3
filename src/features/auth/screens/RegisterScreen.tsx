import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../core/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Card } from '../../../shared/components/Card';
import { Loading } from '../../../shared/components/Loading';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

export const RegisterScreen: React.FC = () => {
	const { register, loading, error } = useAuth();
	const navigation = useNavigation<any>();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleRegister = async () => {
		if (!name.trim() || !email.trim() || !password.trim()) {
			Alert.alert('Error', 'Por favor completa todos los campos');
			return;
		}

		try {
			setIsLoading(true);
			await register({ name: name.trim(), email: email.trim(), password });
			// Tras registro, navegar a OTP para email
			navigation.navigate('OTP', { email: email.trim() });
		} catch (err) {
			Alert.alert('Error de registro', error || 'Error desconocido');
		} finally {
			setIsLoading(false);
		}
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
						<Text style={styles.title}>Crear cuenta</Text>
						<Text style={styles.subtitle}>Regístrate para comenzar</Text>
					</View>

					<Card style={styles.formCard}>
						<Input
							label="Nombre"
							value={name}
							onChangeText={setName}
							placeholder="Tu nombre"
						/>

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
							placeholder="Mínimo 6 caracteres"
							secureTextEntry
							autoCapitalize="none"
						/>

						<Button
							title="Registrarme"
							onPress={handleRegister}
							loading={isLoading}
							disabled={isLoading}
							style={styles.registerButton}
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
	},
	formCard: {
		marginBottom: SPACING.xl,
	},
	registerButton: {
		marginTop: SPACING.md,
	},
});


