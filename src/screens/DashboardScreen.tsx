
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  initializeDatabase,
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  type VaultFolder,
} from '../database/database';

export default function DashboardScreen() {
  const [folders, setFolders] = useState<VaultFolder[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [renameTarget, setRenameTarget] = useState<VaultFolder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadFolders = useCallback(async () => {
    try {
      await initializeDatabase();
      const savedFolders = await getFolders();
      setFolders(savedFolders);
    } catch (error) {
      console.error('Failed to load folders:', error);
      Alert.alert('Database error', 'Could not load your folders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFolders();
  }, [loadFolders]);

  useFocusEffect(
    useCallback(() => {
      void loadFolders();
    }, [loadFolders]),
  );

  const handleCreateFolder = async () => {
    const name = folderName.trim();

    if (!name) {
      Alert.alert('Folder name required', 'Enter a name for your folder.');
      return;
    }

    if (saving) return;

    setSaving(true);
    Keyboard.dismiss();

    try {
      await createFolder(name);
      setFolderName('');
      setShowCreate(false);
      await loadFolders();
    } catch (error) {
      console.error('Failed to create folder:', error);
      Alert.alert('Could not create folder', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  
const handleRenameFolder = (folder: VaultFolder) => {
  setFolderName(folder.name);
  setRenameTarget(folder);
};


const handleSaveRename = async () => {
  const name = folderName.trim();

  if (!name || !renameTarget) {
    Alert.alert('Name required', 'Enter a new folder name.');
    return;
  }

  try {
    await renameFolder(renameTarget.id, name);
    setRenameTarget(null);
    setFolderName('');
    await loadFolders();
  } catch (error) {
    console.error('Failed to rename folder:', error);
    Alert.alert('Error', 'Could not rename this folder.');
  }
};



  const handleDeleteFolder = (folder: VaultFolder) => {
    Alert.alert(
      'Delete folder?',
      `Delete "${folder.name}"? This removes its folder record from this prototype.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFolder(folder.id);
              await loadFolders();
            } catch {
              Alert.alert('Error', 'Could not delete this folder.');
            }
          },
        },
      ],
    );
  };

  const openFolderMenu = (folder: VaultFolder) => {
    Alert.alert(folder.name, 'Folder actions', [
      { text: 'Rename', onPress: () => handleRenameFolder(folder) },
      {
        text: 'Delete folder',
        style: 'destructive',
        onPress: () => handleDeleteFolder(folder),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openFolder = (folder: VaultFolder) => {
    Alert.alert(
      folder.name,
      'Folder PIN protection and photo management will be added in later milestones.',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>KEEP</Text>
          <Text style={styles.tagline}>Your private space</Text>
        </View>

        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>LOCAL VAULT</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.sectionLabel}>YOUR COLLECTION</Text>
        <Text style={styles.heading}>Private folders</Text>
        <Text style={styles.subheading}>
          Organize the memories that matter.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{folders.length}</Text>
            <Text style={styles.statLabel}>FOLDERS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>PHOTOS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0 MB</Text>
            <Text style={styles.statLabel}>STORAGE</Text>
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Your folders</Text>
        <Text style={styles.folderCount}>{folders.length} total</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.folderList}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color="#C9A96E" size="large" />
        ) : folders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>＋</Text>
            </View>
            <Text style={styles.emptyTitle}>Your vault starts here</Text>
            <Text style={styles.emptyText}>
              Create your first private folder to get organized.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowCreate(true)}
            >
              <Text style={styles.emptyButtonText}>Create first folder</Text>
            </TouchableOpacity>
          </View>
        ) : (
          folders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              style={styles.folderCard}
              onPress={() => openFolder(folder)}
              activeOpacity={0.8}
            >
              <View style={styles.folderIcon}>
                <Text style={styles.folderEmoji}>▰</Text>
              </View>

              <View style={styles.folderInfo}>
                <Text style={styles.folderName}>{folder.name}</Text>
                <Text style={styles.folderDate}>
                  Created {new Date(folder.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.folderMeta}>0 photos · PIN planned</Text>
              </View>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => openFolderMenu(folder)}
                accessibilityLabel={`Actions for ${folder.name}`}
              >
                <Text style={styles.menuDots}>•••</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {showCreate && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New private folder</Text>
            <Text style={styles.modalSubtitle}>
              Choose a name for your collection.
            </Text>

            <TextInput
              value={folderName}
              onChangeText={setFolderName}
              placeholder="e.g. Personal"
              placeholderTextColor="#77746C"
              style={styles.nameInput}
              maxLength={40}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreateFolder}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowCreate(false);
                  setFolderName('');
                  Keyboard.dismiss();
                }}
                disabled={saving}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.createButton, saving && { opacity: 0.6 }]}
                onPress={handleCreateFolder}
                disabled={saving}
              >
                <Text style={styles.createText}>
                  {saving ? 'Saving…' : 'Create folder'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}


{renameTarget && (
  <View style={styles.modalOverlay}>
    <View style={styles.modal}>
      <Text style={styles.modalTitle}>Rename folder</Text>
      <Text style={styles.modalSubtitle}>
        Choose a new name for this folder.
      </Text>

      <TextInput
        value={folderName}
        onChangeText={setFolderName}
        placeholder="Folder name"
        placeholderTextColor="#77746C"
        style={styles.nameInput}
        maxLength={40}
        autoFocus
        selectTextOnFocus
        returnKeyType="done"
        onSubmitEditing={handleSaveRename}
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setRenameTarget(null);
            setFolderName('');
            Keyboard.dismiss();
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSaveRename}
        >
          <Text style={styles.createText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}


      <View style={styles.bottomBar}>
        <Text style={styles.bottomLabel}>KEEP  ·  PRIVATE BY DESIGN</Text>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreate(true)}
        activeOpacity={0.85}
        accessibilityLabel="Create folder"
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11110F' },
  header: {
    paddingHorizontal: 23,
    paddingTop: 15,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#292720',
  },
  brand: {
    color: '#F3E9D5',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 5,
  },
  tagline: { color: '#8E887B', fontSize: 11, marginTop: 4 },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#39352C',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C9A96E',
  },
  statusText: {
    color: '#C9A96E',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  summary: { paddingHorizontal: 23, paddingTop: 26 },
  sectionLabel: {
    color: '#C9A96E',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '700',
  },
  heading: {
    color: '#F3E9D5',
    fontSize: 27,
    fontWeight: '600',
    marginTop: 8,
  },
  subheading: { color: '#A9A397', fontSize: 12, marginTop: 7 },
  statsRow: { flexDirection: 'row', gap: 9, marginTop: 23 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#1D1C18',
    borderWidth: 1,
    borderColor: '#302D25',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  statNumber: { color: '#F3E9D5', fontSize: 20, fontWeight: '600' },
  statLabel: {
    color: '#8E887B',
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 7,
  },
  listHeader: {
    paddingHorizontal: 23,
    marginTop: 27,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: { color: '#F3E9D5', fontSize: 16, fontWeight: '600' },
  folderCount: { color: '#8E887B', fontSize: 11 },
  scroll: { flex: 1 },
  folderList: { paddingHorizontal: 23, paddingBottom: 100, flexGrow: 1 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#211F19',
    borderWidth: 1,
    borderColor: '#4A402D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconText: { color: '#C9A96E', fontSize: 33 },
  emptyTitle: {
    color: '#F3E9D5',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 20,
  },
  emptyText: {
    color: '#8E887B',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 9,
  },
  emptyButton: {
    borderWidth: 1,
    borderColor: '#C9A96E',
    borderRadius: 10,
    paddingHorizontal: 19,
    paddingVertical: 12,
    marginTop: 20,
  },
  emptyButtonText: { color: '#C9A96E', fontSize: 12, fontWeight: '600' },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1C18',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#302D25',
    padding: 13,
    marginBottom: 10,
  },
  folderIcon: {
    width: 47,
    height: 47,
    borderRadius: 13,
    backgroundColor: '#2B271F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#47402F',
  },
  folderEmoji: { color: '#C9A96E', fontSize: 24 },
  folderInfo: { flex: 1, marginLeft: 12 },
  folderName: { color: '#F3E9D5', fontSize: 14, fontWeight: '600' },
  folderDate: { color: '#8E887B', fontSize: 10, marginTop: 5 },
  folderMeta: { color: '#C9A96E', fontSize: 10, marginTop: 5 },
  menuButton: { paddingHorizontal: 6, paddingVertical: 10 },
  menuDots: { color: '#A9A397', fontSize: 15, letterSpacing: 1 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#11110F',
    borderTopWidth: 1,
    borderTopColor: '#292720',
  },
  bottomLabel: { color: '#77746C', fontSize: 9, letterSpacing: 1.5 },
  fab: {
    position: 'absolute',
    bottom: 52,
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#C9A96E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: { color: '#17150F', fontSize: 34, lineHeight: 38 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: '#201F1A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#494237',
    padding: 22,
  },
  modalTitle: { color: '#F3E9D5', fontSize: 20, fontWeight: '600' },
  modalSubtitle: { color: '#A9A397', fontSize: 12, marginTop: 7 },
  nameInput: {
    borderWidth: 1,
    borderColor: '#5B5140',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: '#F3E9D5',
    marginTop: 19,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#4A453A',
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  cancelText: { color: '#A9A397', fontSize: 12 },
  createButton: {
    backgroundColor: '#C9A96E',
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  createText: { color: '#17150F', fontSize: 12, fontWeight: '700' },
});
