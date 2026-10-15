
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
  hasFolderPin,
  setFolderPin,
  verifyFolderPin,
} from '../security/pinStore';

type Props = {
  folderName: string;
  onSuccess: () => void;
  onBack: () => void;
};

export default function FolderPinScreen({
  folderName,
  onSuccess,
  onBack,
}: Props) {
  const [pin, setPin] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [setupMode, setSetupMode] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    hasFolderPin()
      .then((exists) => {
        if (active) {
          setSetupMode(!exists);
        }
      })
      .catch(() => {
        if (active) {
          Alert.alert(
            'Error',
            'Could not check Folder PIN setup. Please try again.'
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleContinue = async () => {
    if (setupMode === null || busy) {
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      Alert.alert('Invalid PIN', 'Enter your 6-digit Folder PIN.');
      return;
    }

    if (setupMode && !/^\d{6}$/.test(confirmation)) {
      Alert.alert('Confirm PIN', 'Enter the 6-digit PIN again.');
      return;
    }

    setBusy(true);

    try {
      if (setupMode) {
        if (pin !== confirmation) {
          Alert.alert('PIN mismatch', 'The two PINs do not match.');
          setConfirmation('');
          return;
        }

        await setFolderPin(pin);

        Alert.alert(
          'Folder PIN created',
          'Your shared Folder PIN has been created.',
          [{ text: 'Continue', onPress: onSuccess }]
        );

        return;
      }

      const valid = await verifyFolderPin(pin);

      if (valid) {
        onSuccess();
      } else {
        setPin('');
        Alert.alert('Incorrect PIN', 'Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Could not process the Folder PIN.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.brand}>KEEP</Text>

        <Text style={styles.title}>
          {setupMode === null
            ? 'Please wait'
            : setupMode
              ? 'Create Folder PIN'
              : 'Unlock folder'}
        </Text>

        <Text style={styles.subtitle}>
          {setupMode === null
            ? 'Checking your PIN settings...'
            : setupMode
              ? 'Create one 6-digit PIN to protect every folder.'
              : `Enter your shared Folder PIN to open ${folderName}.`}
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
              accessibilityLabel="Folder PIN"
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
                accessibilityLabel="Confirm Folder PIN"
                editable={!busy}
              />
            )}

            <TouchableOpacity
              style={[
                styles.button,
                busy && styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={busy}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {busy
                  ? 'Please wait...'
                  : setupMode
                    ? 'Create PIN'
                    : 'Unlock folder'}
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
  backButton: {
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  backText: {
    color: '#D8B66A',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 60,
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
    marginTop: 6,
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
