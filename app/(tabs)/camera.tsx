import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw } from 'lucide-react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef<Camera | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to use the camera</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 1080 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        await MediaLibrary.saveToLibraryAsync(manipResult.uri);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        ratio="16:9"
      >
        <View style={styles.controls}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
            <RefreshCw color="#ffffff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  controls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 16,
  },
  flipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 30,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 4,
    marginBottom: 20,
  },
  captureButtonInner: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
  },
});