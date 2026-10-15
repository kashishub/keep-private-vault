
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  onContinue: () => void;
};

export default function WelcomeScreen({ onContinue }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>K</Text>
        </View>

        <Text style={styles.title}>KEEP</Text>
        <Text style={styles.subtitle}>
          KEEP EVERYTHING ENCRYPTED & PRIVATE
        </Text>

        <View style={styles.divider} />

        <Text style={styles.description}>
          Your memories.{'\n'}Your privacy.{'\n'}Your control.
        </Text>

        <Text style={styles.detail}>
          A private space for the photos that matter.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          LOCAL-FIRST  ·  PRIVATE BY DESIGN
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    width: 82,
    height: 82,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#C9A96E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1C18',
    marginBottom: 22,
  },
  logoLetter: {
    color: '#D7B779',
    fontSize: 42,
    fontWeight: '300',
  },
  title: {
    color: '#F3E9D5',
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 9,
    marginLeft: 9,
  },
  subtitle: {
    color: '#C9A96E',
    fontSize: 9,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 12,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: '#C9A96E',
    marginVertical: 30,
  },
  description: {
    color: '#F3E9D5',
    fontSize: 26,
    lineHeight: 39,
    textAlign: 'center',
    fontWeight: '400',
  },
  detail: {
    color: '#A9A397',
    fontSize: 12,
    marginTop: 18,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#C9A96E',
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#17150F',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    color: '#77746C',
    fontSize: 9,
    letterSpacing: 1.5,
    position: 'absolute',
    bottom: 28,
  },
});
