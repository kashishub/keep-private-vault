
import React, { useCallback, useEffect, useState } from 'react';
import { testEncryptionRoundTrip } from '../security/crypto';
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import {
  initializeDatabase,
  getPhotos,
  savePhoto,
  deletePhoto,
  type VaultPhoto,
} from '../database/database';

type Photo = {
  id: string;
  uri: string;
  name: string;
};

type Props = {
  folderId: string;
  folderName: string;
  onBack: () => void;
};

export default function FolderScreen({ folderId, folderName, onBack }: Props) {
  const [photos, setPhotos] = useState<VaultPhoto[]>([]); 
  const [selectedPhoto, setSelectedPhoto] = useState<VaultPhoto | null>(null);
  
const [loadingPhotos, setLoadingPhotos] = useState(true);

useEffect(() => {
  let active = true;

  const loadPhotos = async () => {
    try {
      await initializeDatabase();
      const savedPhotos = await getPhotos(folderId);

      if (active) {
        setPhotos(savedPhotos);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
      if (active) {
        Alert.alert('Error', 'Could not load saved photos.');
      }
    } finally {
      if (active) {
        setLoadingPhotos(false);
      }
    }
  };

  setLoadingPhotos(true);
  loadPhotos();

  return () => {
    active = false;
  };
}, [folderId]);
 
  const [securePreview, setSecurePreview] = useState(true);

const runEncryptionTest = async () => {
  try {
    const passed = await testEncryptionRoundTrip();

    Alert.alert(
      'Encryption Test',
      passed
        ? 'SUCCESS: Encryption and decryption work correctly.'
        : 'Test failed.'
    );
  } catch (error) {
    Alert.alert(
      'Encryption Test Failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};


  const pickPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 20,
        quality: 1,
      });

      if (result.canceled) return;

      
for (const [index, asset] of result.assets.entries()) {
  if (!FileSystem.documentDirectory) {
    throw new Error('App storage is unavailable.');
  }

  const photoId = `${Date.now()}-${index}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const fileName = asset.fileName || `photo-${photoId}.jpg`;
  const destination =
    `${FileSystem.documentDirectory}keep-${photoId}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  await FileSystem.copyAsync({
    from: asset.uri,
    to: destination,
  });

  await savePhoto(folderId, fileName, destination);
}

const savedPhotos = await getPhotos(folderId);
setPhotos(savedPhotos);

    } catch (error) {
      console.error('Photo selection failed:', error);
      Alert.alert('Could not select photos', 'Please try again.');
    }
  };

  const takePhoto = () => {
    Alert.alert(
      'Camera coming next',
      'We will add direct camera capture after gallery importing is connected.',
    );
  };

  
const removePhoto = (photoId: string) => {
  Alert.alert(
    'Delete photo?',
    'This removes the copy stored in KEEP. Your original gallery photo will not be deleted.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const photo = photos.find((item) => item.id === photoId);

            if (photo) {
              await deletePhoto(photoId);

              if (
                FileSystem.documentDirectory &&
                photo.fileUri.startsWith(FileSystem.documentDirectory)
              ) {
                await FileSystem.deleteAsync(photo.fileUri, {
                  idempotent: true,
                });
              }

              setPhotos((current) =>
                current.filter((item) => item.id !== photoId)
              );
            }
          } catch (error) {
            console.error('Failed to delete photo:', error);
            Alert.alert('Error', 'Could not delete the stored photo.');
          }
        },
      },
    ]
  );
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#11110F" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.brand}>KEEP</Text>
          <Text style={styles.folderName} numberOfLines={1}>
            {folderName}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.previewToggle}
          onPress={() => setSecurePreview((current) => !current)}
        >
          <Text style={styles.previewToggleText}>
            {securePreview ? 'Preview ON' : 'Preview OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.heading}>Your memories</Text>
        <Text style={styles.subtitle}>
          {photos.length} selected {photos.length === 1 ? 'photo' : 'photos'}
        </Text>
        {securePreview && photos.length > 0 && (
          <Text style={styles.previewNotice}>
            Secure Preview is ON. Thumbnails are obscured in this prototype.
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={runEncryptionTest}
        style={{
          backgroundColor: '#D8B66A',
          padding: 12,
          borderRadius: 10,
          alignItems: 'center',
          marginHorizontal: 20,
          marginVertical: 8,
        }}
      >
        <Text style={{ color: '#171714', fontWeight: 'bold' }}>
          Test Encryption
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.grid}>
        {photos.map((photo) => (
          <TouchableOpacity
            key={photo.id}
            style={styles.photoCard}
            onPress={() => setSelectedPhoto(photo)}
            onLongPress={() => removePhoto(photo.id)}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: photo.fileUri }}  
              style={[
                styles.photo,
                securePreview && styles.obscuredPhoto,
              ]}
              blurRadius={securePreview ? 18 : 0}
            />
            <Text style={styles.photoName} numberOfLines={1}>
              {photo.name}
            </Text>
          </TouchableOpacity>
        ))}

        {photos.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>▧</Text>
            </View>
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptyText}>
              Add photos from your gallery to start filling this folder.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
          <Text style={styles.secondaryButtonText}>Take photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={pickPhotos}>
          <Text style={styles.primaryButtonText}>＋  Add photos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        PREVIEW ONLY · ENCRYPTED STORAGE NOT IMPLEMENTED
      </Text>


<Modal
  visible={selectedPhoto !== null}
  transparent
  animationType="fade"
  onRequestClose={() => setSelectedPhoto(null)}
  statusBarTranslucent
>
  <View style={styles.viewerContainer}>
    <TouchableOpacity
      style={styles.viewerClose}
      onPress={() => setSelectedPhoto(null)}
      activeOpacity={0.8}
    >
      <Text style={styles.viewerCloseText}>✕</Text>
    </TouchableOpacity>

    {selectedPhoto && (
      <Image
        source={{ uri: selectedPhoto.fileUri }}
        style={styles.fullScreenImage}
        resizeMode="contain"
        blurRadius={securePreview ? 18 : 0}
      />
    )}
  </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11110F' },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#292720',
    gap: 10,
  },
  backButton: { paddingVertical: 9, paddingRight: 5 },
  backText: { color: '#C9A96E', fontSize: 13 },
  headerTitle: { flex: 1, alignItems: 'center' },
  brand: {
    color: '#F3E9D5',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 4,
  },
  folderName: { color: '#8E887B', fontSize: 10, marginTop: 3, maxWidth: 120 },
  previewToggle: {
    borderWidth: 1,
    borderColor: '#5A4C32',
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  previewToggleText: { color: '#C9A96E', fontSize: 9, fontWeight: '600' },
  summary: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 12 },
  heading: { color: '#F3E9D5', fontSize: 25, fontWeight: '600' },
  subtitle: { color: '#A9A397', fontSize: 12, marginTop: 7 },
  previewNotice: { color: '#C9A96E', fontSize: 10, marginTop: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 25,
    flexGrow: 1,
    alignContent: 'flex-start',
  },
  photoCard: {
    width: '47%',
    margin: '1.5%',
    borderRadius: 12,
    backgroundColor: '#1D1C18',
    borderWidth: 1,
    borderColor: '#302D25',
    padding: 6,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#292720',
  },
  obscuredPhoto: { opacity: 0.9 },
  photoName: { color: '#A9A397', fontSize: 10, padding: 6 },
  emptyState: {
    flex: 1,
    width: '100%',
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 21,
    backgroundColor: '#211F19',
    borderWidth: 1,
    borderColor: '#4A402D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconText: { color: '#C9A96E', fontSize: 28 },
  emptyTitle: {
    color: '#F3E9D5',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 18,
  },
  emptyText: {
    color: '#8E887B',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 13,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#292720',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5A4C32',
    borderRadius: 11,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#C9A96E', fontSize: 12, fontWeight: '600' },
  primaryButton: {
    flex: 1.3,
    backgroundColor: '#C9A96E',
    borderRadius: 11,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#17150F', fontSize: 12, fontWeight: '700' },
  footer: {
    color: '#77746C',
    fontSize: 8,
    letterSpacing: 1,
    textAlign: 'center',
    paddingVertical: 10,
  },


  viewerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 45,
    right: 22,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#252522',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerCloseText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  fullScreenImage: {
    width: '100%',
    height: '85%',
  },

});
