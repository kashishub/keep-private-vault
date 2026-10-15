
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

const DEMO_RECOVERY_KEY = 'KEEP-DEMO-7K2M-9Q4R-X8WP-3L6N';

export default function App() {
  const [saved, setSaved] = useState(false);

  const copyKey = async () => {
    Alert.alert(
      'Demo key only',
      'This is a placeholder key for the screen prototype, not a real recovery key.',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => Alert.alert('Setup', 'Previous setup screen will be connected later.')}
        >
          <Text style={styles.backText}>‹  Back</Text>
        </TouchableOpacity>

        <View style={styles.iconBox}>
          <Text style={styles.icon}>✦</Text>
        </View>

        <Text style={styles.brand}>KEEP</Text>
        <Text style={styles.title}>Your recovery key</Text>
        <Text style={styles.subtitle}>
          Your last line of access if you forget your PIN.
        </Text>

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>IMPORTANT</Text>
          <Text style={styles.warningText}>
            Anyone with your recovery key may be able to restore access.
            Keep it private and separate from your phone.
          </Text>
        </View>

        <View style={styles.keyCard}>
          <Text style={styles.keyLabel}>DEMO KEY — NOT FOR REAL DATA</Text>
          <Text selectable style={styles.keyText}>
            {DEMO_RECOVERY_KEY}
          </Text>

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
            I understand this is a demo key and will save my real recovery key when secure setup is implemented.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!saved}
          style={[styles.continueButton, !saved && styles.disabledButton]}
          onPress={() =>
            Alert.alert('Demo complete', 'Real recovery-key generation will be implemented before vault storage.')
          }
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>KEEP YOUR KEY PRIVATE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11110F' },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { alignSelf: 'flex-start', marginBottom: 15, padding: 4 },
  backText: { color: '#C9A96E', fontSize: 14 },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#C9A96E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1C18',
    marginBottom: 12,
  },
  icon: { color: '#D7B779', fontSize: 29 },
  brand: {
    color: '#C9A96E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 5,
    marginLeft: 5,
  },
  title: {
    color: '#F3E9D5',
    fontSize: 25,
    fontWeight: '600',
    marginTop: 18,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A9A397',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  warning: {
    width: '100%',
    backgroundColor: '#292219',
    borderColor: '#57452B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    marginTop: 20,
  },
  warningTitle: {
    color: '#D7B779',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  warningText: { color: '#D0C5B1', fontSize: 12, lineHeight: 18 },
  keyCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#494237',
    borderRadius: 14,
    backgroundColor: '#1B1A17',
    padding: 15,
    marginTop: 15,
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
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 13,
  },
  copyButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#C9A96E',
    borderRadius: 9,
    marginTop: 13,
  },
  copyText: { color: '#C9A96E', fontSize: 12, fontWeight: '600' },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 17,
    gap: 10,
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
  checkboxText: { color: '#B3ADA0', fontSize: 11, lineHeight: 17, flex: 1 },
  continueButton: {
    width: '100%',
    backgroundColor: '#C9A96E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 17,
  },
  disabledButton: { opacity: 0.35 },
  continueText: { color: '#17150F', fontSize: 14, fontWeight: '700' },
  footer: {
    color: '#77746C',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 13,
  },
});
