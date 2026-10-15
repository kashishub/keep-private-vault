
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  onComplete: () => void;
  onBack: () => void;
};

const DEMO_KEY = 'KEEP-DEMO-7K2M-9Q4R-X8WP-3L6N';

export default function RecoveryKeyScreen({ onComplete, onBack }: Props) {
  const [saved, setSaved] = useState(false);

  const copyKey = () => {
    Alert.alert(
      'Demo key only',
      'This placeholder is not a real recovery key and must not be used to protect real data.',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.content}>
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Text style={styles.backText}>‹  Back</Text>
        </TouchableOpacity>

        <View style={styles.iconBox}>
          <Text style={styles.icon}>✦</Text>
        </View>

        <Text style={styles.brand}>KEEP</Text>
        <Text style={styles.title}>Your recovery key</Text>
        <Text style={styles.subtitle}>
          A recovery method for when you forget your PIN.
        </Text>

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>IMPORTANT</Text>
          <Text style={styles.warningText}>
            Keep your recovery key private and separate from your phone.
            A real recovery key will be generated during secure setup.
          </Text>
        </View>

        <View style={styles.keyCard}>
          <Text style={styles.keyLabel}>DEMO KEY — NOT FOR REAL DATA</Text>
          <Text selectable style={styles.keyText}>{DEMO_KEY}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyKey}>
            <Text style={styles.copyText}>Copy key</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setSaved(!saved)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, saved && styles.checkboxChecked]}>
            {saved && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxText}>
            I understand this is a demonstration and a real recovery system is not implemented yet.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!saved}
          style={[styles.button, !saved && styles.disabledButton]}
          onPress={onComplete}
        >
          <Text style={styles.buttonText}>Continue to KEEP</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>PRIVATE BY DESIGN</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11110F' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { alignSelf: 'flex-start', padding: 4, marginBottom: 10 },
  backText: { color: '#C9A96E', fontSize: 14 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#C9A96E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1C18',
  },
  icon: { color: '#D7B779', fontSize: 26 },
  brand: {
    color: '#C9A96E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 5,
    marginLeft: 5,
    marginTop: 8,
  },
  title: {
    color: '#F3E9D5',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 13,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A9A397',
    fontSize: 12,
    marginTop: 7,
    textAlign: 'center',
  },
  warning: {
    width: '100%',
    backgroundColor: '#292219',
    borderColor: '#57452B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  },
  warningTitle: {
    color: '#D7B779',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  warningText: { color: '#D0C5B1', fontSize: 11, lineHeight: 16 },
  keyCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#494237',
    borderRadius: 14,
    backgroundColor: '#1B1A17',
    padding: 13,
    marginTop: 12,
    alignItems: 'center',
  },
  keyLabel: {
    color: '#918775',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  keyText: {
    color: '#F3E9D5',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.7,
    textAlign: 'center',
    marginTop: 11,
  },
  copyButton: {
    paddingVertical: 7,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: '#C9A96E',
    borderRadius: 9,
    marginTop: 10,
  },
  copyText: { color: '#C9A96E', fontSize: 12, fontWeight: '600' },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 13,
    gap: 9,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#82765E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  checkmark: { color: '#17150F', fontWeight: '800' },
  checkboxText: { color: '#B3ADA0', fontSize: 10, lineHeight: 15, flex: 1 },
  button: {
    width: '100%',
    backgroundColor: '#C9A96E',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 14,
  },
  disabledButton: { opacity: 0.35 },
  buttonText: { color: '#17150F', fontSize: 13, fontWeight: '700' },
  footer: {
    color: '#77746C',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 10,
  },
});
