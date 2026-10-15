
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import PinSetupScreen from './src/screens/PinSetupScreen';
import RecoveryKeyScreen from './src/screens/RecoveryKeyScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export type RootStackParamList = {
  Welcome: undefined;
  PinSetup: undefined;
  RecoveryKey: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#11110F' },
        }}
      >
        <Stack.Screen name="Welcome">
          {({ navigation }) => (
            <WelcomeScreen
              onContinue={() => navigation.navigate('PinSetup')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PinSetup">
          {({ navigation }) => (
            <PinSetupScreen
              onBack={() => navigation.goBack()}
              onComplete={() => navigation.navigate('RecoveryKey')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RecoveryKey">
          {({ navigation }) => (
            <RecoveryKeyScreen
              onBack={() => navigation.goBack()}
              onComplete={() => navigation.replace('Dashboard')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
