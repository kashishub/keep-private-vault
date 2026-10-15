
import React, { useState } from 'react';
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
  verifyAppPin,
  setAppPin,
} from '../security/appPinStore';

type Props = {
  onBack: () => void;
  onComplete: () => void;
};

export default function ChangeAppPinScreen({
  onBack,
  onComplete,
}: Props) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChangePin = async () => {
    if (
      !/^\d{6}$/.test(currentPin) ||
      !/^\d{6}$/.test(newPin) ||
      !/^\d{6}$/.test(confirmPin)
    ) {
      Alert.alert('Invalid PIN', 'All PINs must contain 6 digits.');
      return;
    }

    if (newPin !== confirmPin) {
      setConfirmPin('');
      Alert.alert('PIN mismatch', 'The new PINs do not match.');
      return;
    }

    if (currentPin === newPin) {
      Alert.alert(
        'Choose a different PIN',
        'Your new PIN must differ from your current PIN.'
      );
      return;
    }

    setBusy(true);

    try {
      const valid = await verifyAppPin(currentPin);

      if (!valid) {
        setCurrentPin('');
        Alert.alert('Incorrect PIN', 'Your current App PIN is incorrect.');
        return;
      }

      await setAppPin(newPin);

      Alert.alert(
        'App PIN changed',
        'Your new App PIN will be required the next time KEEP asks you to unlock.',
        [{ text: 'Done', onPress: onComplete }]
      );
    } catch (error) {
      Alert.alert(
        'Unable to change PIN',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const renderPinInput = (
    label: string,
    value: string,
    onChangeText: (value: string) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(text) =>
          onChangeText(text.replace(/[^0-9]/g, '').slice(0, 6))
        }
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        placeholder="••••••"
        placeholderTextColor="#77776F"
        style={styles.input}
        editable={!busy}
      />
    </View>
  );

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
        <Text style={styles.title}>Change App PIN</Text>
        <Text style={styles.subtitle}>
          Update the PIN you use to unlock KEEP.
        </Text>

        {renderPinInput('Current App PIN', currentPin, setCurrentPin)}
        {renderPinInput('New App PIN', newPin, setNewPin)}
        {renderPinInput('Confirm New PIN', confirmPin, setConfirmPin)}

        <TouchableOpacity
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={handleChangePin}
          disabled={busy}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {busy ? 'Updating...' : 'Update App PIN'}
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 30,
  },
  brand: {
    color: '#D8B66A',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#F5F1E8',
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#AAA99F',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: '#D8D5CC',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#20201D',
    color: '#F5F1E8',
    borderWidth: 1,
    borderColor: '#45443C',
    borderRadius: 12,
    padding: 15,
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#D8B66A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
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
