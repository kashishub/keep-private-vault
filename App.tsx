
import React, { useEffect, useRef } from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppState } from 'react-native';

import FolderPinScreen from './src/screens/FolderPinScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import PinSetupScreen from './src/screens/PinSetupScreen';
import RecoveryKeyScreen from './src/screens/RecoveryKeyScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import FolderScreen from './src/screens/FolderScreen';
import ChangeFolderPinScreen from './src/screens/ChangeFolderPinScreen';
import AppPinScreen from './src/screens/AppPinScreen';
import ChangeAppPinScreen from './src/screens/ChangeAppPinScreen';

import type { VaultFolder } from './src/database/database';

export type RootStackParamList = {
  Welcome: undefined;
  PinSetup: undefined;
  RecoveryKey: undefined;
  Dashboard: undefined;
  Settings: undefined;
  ChangeFolderPin: undefined;
  AppPin: undefined;
  ChangeAppPin: undefined;
  Folder: {
    folderId: string;
    folderName: string;
  };
  FolderPin: {
    folderId: string;
    folderName: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

export default function App() {
  const previousAppState = useRef(AppState.currentState);
  const shouldLock = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        const previousState = previousAppState.current;

        if (
          previousState === 'active' &&
          (nextAppState === 'inactive' ||
            nextAppState === 'background')
        ) {
          shouldLock.current = true;
        }

        if (
          nextAppState === 'active' &&
          shouldLock.current
        ) {
          shouldLock.current = false;

          if (navigationRef.isReady()) {
            navigationRef.resetRoot({
              index: 0,
              routes: [{ name: 'AppPin' }],
            });
          }
        }

        previousAppState.current = nextAppState;
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="AppPin"
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
              onComplete={() => navigation.navigate('RecoveryKey')}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RecoveryKey">
          {({ navigation }) => (
            <RecoveryKeyScreen
              onComplete={() => navigation.replace('Dashboard')}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="AppPin"
          options={{ headerShown: false, gestureEnabled: false }}
        >
          {({ navigation }) => (
            <AppPinScreen
              onSuccess={() => navigation.replace('Dashboard')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Dashboard">
          {({ navigation }) => (
            <DashboardScreen
              onOpenFolder={(folder: VaultFolder) =>
                navigation.navigate('FolderPin', {
                  folderId: folder.id,
                  folderName: folder.name,
                })
              }
              onOpenSettings={() => navigation.navigate('Settings')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Settings">
          {({ navigation }) => (
            <SettingsScreen
              onBack={() => navigation.goBack()}
              onChangeAppPin={() => navigation.navigate('ChangeAppPin')}
              onChangeFolderPin={() =>
                navigation.navigate('ChangeFolderPin')
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ChangeFolderPin">
          {({ navigation }) => (
            <ChangeFolderPinScreen
              onBack={() => navigation.goBack()}
              onComplete={() => navigation.popTo('Dashboard')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ChangeAppPin">
          {({ navigation }) => (
            <ChangeAppPinScreen
              onBack={() => navigation.goBack()}
              onComplete={() => navigation.popTo('Dashboard')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="FolderPin">
          {({ navigation, route }) => (
            <FolderPinScreen
              folderName={route.params.folderName}
              onBack={() => navigation.goBack()}
              onSuccess={() =>
                navigation.replace('Folder', {
                  folderId: route.params.folderId,
                  folderName: route.params.folderName,
                })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Folder">
          {({ navigation, route }) => (
            <FolderScreen
              folderId={route.params.folderId}
              folderName={route.params.folderName}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
