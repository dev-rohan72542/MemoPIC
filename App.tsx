import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const App = () => {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const takePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      setImageSource(`file://${photo.path}`);
    }
  };

  const uploadPhoto = async () => {
    if (!imageSource) return;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageSource,
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

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {imageSource ? (
        <View style={styles.preview}>
          <Image source={{uri: imageSource}} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setImageSource(null)}>
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
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
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
});

export default App;