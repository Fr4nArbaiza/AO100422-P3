import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OTPScreen } from '../../features/auth/screens/OTPScreen';
import { Loading } from '../../shared/components/Loading';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { user, loading, pendingOTP } = useAuth();

  console.log('AppNavigator render - user:', !!user, 'loading:', loading, 'pendingOTP:', pendingOTP);

  if (loading) {
    return <Loading text="Cargando aplicación..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : pendingOTP ? (
          <Stack.Screen name="OTP" component={OTPScreen} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


