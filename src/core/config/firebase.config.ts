import { getApps, initializeApp, getApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
// Requerimos dinámicamente para evitar problemas de tipado en RN
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getReactNativePersistence } = require('firebase/auth');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra || Constants.manifest?.extra || {}) as any;

const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  storageBucket: extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Configurar persistencia basada en AsyncStorage para React Native / Expo
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export default app;

// Advertir en desarrollo si falta alguna clave de Firebase
if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
	console.warn('[Firebase] Config incompleta. Revisa variables en .env y app.config.ts');
}


