import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';

export default function App() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPhoto(manipResult.uri);
      await MediaLibrary.saveToLibraryAsync(manipResult.uri);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('Upload success:', data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {photo ? (
          <View style={styles.preview}>
            <Image source={{ uri: photo }} style={styles.previewImage} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={uploadPhoto}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={CameraType.back}
              ratio="16:9"
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  preview: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 35,
    padding: 5,
  },
  captureButtonInner: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
});