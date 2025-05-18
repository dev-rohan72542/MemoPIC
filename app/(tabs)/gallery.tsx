import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GalleryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gallery</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>Your captured images will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1f2937',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});