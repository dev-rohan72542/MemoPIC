import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MemoPic</Text>
        <Text style={styles.subtitle}>Turn Images Into Quizzes</Text>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg' }}
          style={styles.heroImage}
        />
        <Text style={styles.description}>
          Capture your study materials and let AI create personalized quizzes to help you learn faster.
        </Text>
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
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'center',
  },
});