
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  hasAppPin,
  setAppPin,
  verifyAppPin,
} from '../security/appPinStore';

type Props = {
  onSuccess: () => void;
};

export default function AppPinScreen({ onSuccess }: Props) {
  const [pin, setPin] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [setupMode, setSetupMode] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    hasAppPin()
      .then((exists) => {
        if (active) setSetupMode(!exists);
      })
      .catch(() => {
        if (active) {
          Alert.alert('Error', 'Could not check App PIN settings.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleContinue = async () => {
    if (setupMode === null || busy) return;

    if (!/^\d{6}$/.test(pin)) {
      Alert.alert('Invalid PIN', 'Enter a 6-digit App PIN.');
      return;
    }

    if (setupMode && !/^\d{6}$/.test(confirmation)) {
      Alert.alert('Confirm PIN', 'Enter your App PIN again.');
      return;
    }

    setBusy(true);

    try {
      if (setupMode) {
        if (pin !== confirmation) {
          setConfirmation('');
          Alert.alert('PIN mismatch', 'The PINs do not match.');
          return;
        }

        await setAppPin(pin);

        Alert.alert(
          'App PIN created',
          'Your App PIN is ready.',
          [{ text: 'Continue', onPress: onSuccess }]
        );

        return;
      }

      const valid = await verifyAppPin(pin);

      if (valid) {
        onSuccess();
      } else {
        setPin('');
        Alert.alert('Incorrect PIN', 'Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Could not process App PIN.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.content}>
        <Text style={styles.brand}>KEEP</Text>

        <Text style={styles.title}>
          {setupMode === null
            ? 'Please wait'
            : setupMode
              ? 'Create App PIN'
              : 'Welcome back'}
        </Text>

        <Text style={styles.subtitle}>
          {setupMode === null
            ? 'Checking your PIN settings...'
            : setupMode
              ? 'Create a 6-digit PIN to unlock KEEP.'
              : 'Enter your App PIN to continue.'}
        </Text>

        {setupMode !== null && (
          <>
            <TextInput
              value={pin}
              onChangeText={(value) =>
                setPin(value.replace(/[^0-9]/g, '').slice(0, 6))
              }
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              placeholder="Enter 6-digit PIN"
              placeholderTextColor="#77776F"
              style={styles.pinInput}
              accessibilityLabel="App PIN"
              editable={!busy}
            />

            {setupMode && (
              <TextInput
                value={confirmation}
                onChangeText={(value) =>
                  setConfirmation(
                    value.replace(/[^0-9]/g, '').slice(0, 6)
                  )
                }
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                placeholder="Confirm 6-digit PIN"
                placeholderTextColor="#77776F"
                style={styles.pinInput}
                accessibilityLabel="Confirm App PIN"
                editable={!busy}
              />
            )}

            <TouchableOpacity
              style={[styles.button, busy && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={busy}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {busy
                  ? 'Please wait...'
                  : setupMode
                    ? 'Create PIN'
                    : 'Unlock KEEP'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11110F',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 50,
  },
  brand: {
    color: '#D8B66A',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#F5F1E8',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#AAA99F',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 28,
  },
  pinInput: {
    backgroundColor: '#20201D',
    color: '#F5F1E8',
    borderWidth: 1,
    borderColor: '#45443C',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#D8B66A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#171714',
    fontSize: 16,
    fontWeight: '700',
  },
});
