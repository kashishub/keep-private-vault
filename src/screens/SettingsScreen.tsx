
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
  onBack: () => void;
  onChangeAppPin: () => void;
  onChangeFolderPin: () => void;
};

export default function SettingsScreen({
  onBack,
  onChangeAppPin,
  onChangeFolderPin,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>KEEP</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage your PINs and privacy preferences.
        </Text>

        <Text style={styles.sectionTitle}>SECURITY</Text>

        <TouchableOpacity
          style={styles.settingCard}
          onPress={onChangeAppPin}
          activeOpacity={0.8}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>⌑</Text>
          </View>

          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>App PIN</Text>
            <Text style={styles.description}>
              Change the PIN used to unlock KEEP.
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingCard}
          onPress={onChangeFolderPin}
          activeOpacity={0.8}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>▣</Text>
          </View>

          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Folder PIN</Text>
            <Text style={styles.description}>
              Change the shared PIN used for every folder.
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>PRIVACY</Text>

        <View style={styles.settingCard}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>◉</Text>
          </View>

          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Secure Preview</Text>
            <Text style={styles.description}>
              Control thumbnail visibility inside folders.
            </Text>
          </View>

          <Text style={styles.comingSoon}>IN FOLDER</Text>
        </View>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Security status</Text>
          <Text style={styles.noteText}>
            KEEP is currently in its functional-vault phase.
            Photo encryption and recovery are not implemented yet.
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
  header: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    paddingVertical: 12,
    minWidth: 65,
  },
  backText: {
    color: '#D8B66A',
    fontSize: 16,
  },
  brand: {
    color: '#D8B66A',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 4,
  },
  headerSpacer: {
    width: 65,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  title: {
    color: '#F5F1E8',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#AAA99F',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#D8B66A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  settingCard: {
    backgroundColor: '#20201D',
    borderWidth: 1,
    borderColor: '#34342E',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 82,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: '#302D22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  icon: {
    color: '#D8B66A',
    fontSize: 24,
    fontWeight: '600',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: '#F5F1E8',
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    color: '#AAA99F',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  chevron: {
    color: '#D8B66A',
    fontSize: 27,
    marginLeft: 8,
  },
  comingSoon: {
    color: '#AAA99F',
    fontSize: 9,
    letterSpacing: 1,
    marginLeft: 6,
  },
  note: {
    backgroundColor: '#1B1B18',
    borderRadius: 12,
    padding: 15,
    marginTop: 22,
    borderLeftWidth: 3,
    borderLeftColor: '#D8B66A',
  },
  noteTitle: {
    color: '#F5F1E8',
    fontSize: 14,
    fontWeight: '600',
  },
  noteText: {
    color: '#AAA99F',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
});
