
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

type Props = {
  onComplete: () => void;
  onBack: () => void;
};

export default function PinSetupScreen({ onComplete, onBack }: Props) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'create' | 'confirm'>('create');

  const activeValue = stage === 'create' ? pin : confirmPin;

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    if (stage === 'create') {
      setPin(digits);
    } else {
      setConfirmPin(digits);
    }
  };

  const handleContinue = () => {
    if (activeValue.length !== 6) {
      Alert.alert('PIN required', 'Enter all 6 digits.');
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

    // Prototype only: secure PIN storage will be implemented separately.
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹  Back</Text>
        </TouchableOpacity>

        <View style={styles.logo}>
          <Text style={styles.logoLetter}>K</Text>
        </View>
        <Text style={styles.brand}>KEEP</Text>

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
            onChangeText={handleChange}
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
              style={styles.restart}
              onPress={() => {
                setPin('');
                setConfirmPin('');
                setStage('create');
              }}
            >
              <Text style={styles.backText}>Start again</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>PRIVATE BY DESIGN</Text>
          <Text style={styles.footerText}>
            PIN storage and encryption will be implemented before real use.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11110F' },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 22,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: { alignSelf: 'flex-start', padding: 5 },
  backText: { color: '#C9A96E', fontSize: 14 },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C9A96E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1C18',
    marginTop: 12,
  },
  logoLetter: { color: '#D7B779', fontSize: 29 },
  brand: {
    color: '#F3E9D5',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 6,
    marginLeft: 6,
    marginTop: -12,
  },
  form: { alignItems: 'center', width: '100%' },
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
  dots: { flexDirection: 'row', gap: 15, marginTop: 35, marginBottom: 18 },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#6D6658',
  },
  dotFilled: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  hiddenInput: { width: 1, height: 1, opacity: 0 },
  button: {
    width: '100%',
    backgroundColor: '#C9A96E',
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#17150F', fontSize: 15, fontWeight: '700' },
  restart: { padding: 14, marginTop: 5 },
  footer: { alignItems: 'center' },
  footerTitle: {
    color: '#C9A96E',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '700',
  },
  footerText: {
    color: '#77746C',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
});

