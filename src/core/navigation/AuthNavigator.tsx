import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { OTPScreen } from '../../features/auth/screens/OTPScreen';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
    </Stack.Navigator>
  );
};


