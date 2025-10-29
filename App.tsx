import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/core/context/AuthContext';
import { WalletProvider } from './src/core/context/WalletContext';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';
import { AppNavigator } from './src/core/navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AuthProvider>
          <WalletProvider>
            <AppNavigator />
          </WalletProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
