import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreen } from '../../features/wallets/screens/HomeScreen';
import { TransactionHistoryScreen } from '../../features/transactions/screens/TransactionHistoryScreen';
import { NewTransactionScreen } from '../../features/transactions/screens/NewTransactionScreen';
import { AIAssistantScreen } from '../../features/ai-assistant/screens/AIAssistantScreen';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES } from '../../shared/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TransactionStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
    <Stack.Screen name="NewTransaction" component={NewTransactionScreen} />
  </Stack.Navigator>
);


const LogoutButton = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Text style={styles.logoutText}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
};

// Componente wrapper para HomeScreen con botón flotante
const HomeScreenWithFAB = () => {
  const navigation = useNavigation<any>();
  
  return (
    <View style={styles.container}>
      <HomeScreen />
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('NewTransaction')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => <LogoutButton />,
        headerTitle: 'Balance Dual',
        headerTitleStyle: {
          fontSize: FONT_SIZES.lg,
          fontWeight: '600',
          color: COLORS.dark,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.light,
        },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenWithFAB}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionStack}
        options={{
          tabBarLabel: 'Transacciones',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIAssistantScreen}
        options={{
          tabBarLabel: 'Asistente',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🤖</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="NewTransaction" component={NewTransactionScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.sm,
    height: 60,
  },
  tabLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  tabIcon: {
    fontSize: FONT_SIZES.lg,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  logoutText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    fontWeight: '500',
  },
});


