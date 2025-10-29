import type { ConfigContext, ExpoConfig } from 'expo/config';

// Cargar variables desde .env en tiempo de build de Expo
require('dotenv').config();

const config: ExpoConfig = {
	name: 'BalanceDualExpo',
	slug: 'BalanceDualExpo',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/icon.png',
	userInterfaceStyle: 'light',
	newArchEnabled: true,
	splash: {
		image: './assets/splash-icon.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	ios: {
		supportsTablet: true,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		edgeToEdgeEnabled: true,
		predictiveBackGestureEnabled: false,
	},
	web: {
		favicon: './assets/favicon.png',
	},
	extra: {
		// Firebase Web SDK
		FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
		FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
		FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
		FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
		FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
		FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
		// Gemini / otras claves
		GEMINI_API_KEY: process.env.GEMINI_API_KEY,
		// Webhook de Google Apps Script para enviar OTP por email
		EMAIL_OTP_WEBHOOK_URL: process.env.EMAIL_OTP_WEBHOOK_URL,
	},
};

export default config;


