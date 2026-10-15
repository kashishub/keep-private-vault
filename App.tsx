
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

export default function App() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'create' | 'confirm'>('create');

  const handleContinue = () => {
    if (pin.length !== 6) {
      Alert.alert('PIN required', 'Please enter all 6 digits.');
      return;
    }

    if (stage === 'create') {
      setStage('confirm');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('PINs do not match', 'Please enter your confirmation PIN again.');
      setConfirmPin('');
      return;
    }

    Alert.alert(
      'Prototype complete',
      'Your PIN setup screen works. Secure PIN storage is our next security milestone.',
    );
  };

  const activeValue = stage === 'create' ? pin : confirmPin;

  const handlePinChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    if (stage === 'create') {
      setPin(digits);
    } else {
      setConfirmPin(digits);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.content}>
        <View style={styles.top}>
          <View style={styles.logo}>
            <Text style={styles.logoLetter}>K</Text>
          </View>
          <Text style={styles.brand}>KEEP</Text>
          <Text style={styles.eyebrow}>YOUR PRIVATE SPACE</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>
            {stage === 'create' ? 'Create your PIN' : 'Confirm your PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {stage === 'create'
              ? 'Choose a 6-digit PIN to protect your vault.'
              : 'Enter the same PIN one more time.'}
          </Text>

          <View style={styles.dots}>
            {Array.from({ length: 6 }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index < activeValue.length && styles.dotFilled,
                ]}
              />
            ))}
          </View>

          <TextInput
            value={activeValue}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            autoFocus
            accessibilityLabel={stage === 'create' ? 'Create PIN' : 'Confirm PIN'}
            style={styles.hiddenInput}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {stage === 'create' ? 'Continue' : 'Confirm PIN'}
            </Text>
          </TouchableOpacity>

          {stage === 'confirm' && (
            <TouchableOpacity
              onPress={() => {
                setStage('create');
                setPin('');
                setConfirmPin('');
              }}
              style={styles.backButton}
            >
              <Text style={styles.backText}>Start again</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottom}>
          <Text style={styles.securityTitle}>PRIVATE BY DESIGN</Text>
          <Text style={styles.securityText}>
            PIN protection is being built. Secure storage comes next.
          </Text>
        </View>
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
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: 35,
    paddingBottom: 22,
  },
  top: {
    alignItems: 'center',
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C9A96E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1C18',
  },
  logoLetter: {
    color: '#D7B779',
    fontSize: 29,
  },
  brand: {
    color: '#F3E9D5',
    fontSize: 25,
    fontWeight: '700',
    letterSpacing: 7,
    marginLeft: 7,
    marginTop: 10,
  },
  eyebrow: {
    color: '#8C877B',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 7,
  },
  form: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#F3E9D5',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    color: '#A9A397',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 21,
  },
  dots: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 35,
    marginBottom: 18,
  },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#6D6658',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#C9A96E',
    borderColor: '#C9A96E',
  },
  hiddenInput: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  button: {
    width: '100%',
    backgroundColor: '#C9A96E',
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#17150F',
    fontSize: 15,
    fontWeight: '700',
  },
  backButton: {
    padding: 14,
    marginTop: 5,
  },
  backText: {
    color: '#C9A96E',
    fontSize: 13,
  },
  bottom: {
    alignItems: 'center',
  },
  securityTitle: {
    color: '#C9A96E',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '700',
  },
  securityText: {
    color: '#77746C',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});
