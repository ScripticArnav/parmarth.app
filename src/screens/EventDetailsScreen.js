import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import backendUrl from '../../backendUrl';

export default function EventDetailsScreen({ route }) {
  const { eventName } = route.params;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchEventPhotos();
  }, []);

  const fetchEventPhotos = async () => {
    try {
      const res = await fetch(`${backendUrl}/event/photos/${encodeURIComponent(eventName)}`);
      const data = await res.json();

      if (res.ok) {
        setPhotos(data.photos || []);
      } else {
        console.error('Error:', data.message);
        setPhotos([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = (index) => {
    setSelectedIndex(index);
    setIsVisible(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="images" size={40} color="#fff" />
        <Text style={styles.title}>{eventName}</Text>
        <Text style={styles.subtitle}>Event Gallery</Text>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#002855" />
          </View>
        ) : !photos.length ? (
          <View style={styles.noPhotosContainer}>
            <FontAwesome5 name="image" size={40} color="#002855" style={styles.noPhotosIcon} />
            <Text style={styles.noPhotos}>No photos uploaded yet.</Text>
          </View>
        ) : (
          <View style={styles.photoGrid}>
            {photos.map((uri, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handleImagePress(index)}
                style={styles.photoContainer}
              >
                <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ImageViewing
        images={photos.map((uri) => ({ uri }))}
        imageIndex={selectedIndex}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        swipeToCloseEnabled={true}
        presentationStyle="overFullScreen"
        animationType="fade"
        backgroundColor="#000"
      />
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    padding: 15,
    paddingTop: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPhotosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noPhotosIcon: {
    marginBottom: 15,
    opacity: 0.5,
  },
  noPhotos: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: (screenWidth - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photo: {
    width: '100%',
    height: 160,
    backgroundColor: '#eee',
  },
});
