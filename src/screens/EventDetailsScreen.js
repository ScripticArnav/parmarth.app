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
  Platform,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import backendUrl from '../../backendUrl';

const { width, height } = Dimensions.get('window');

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: width * 0.075,
    paddingTop: Platform.OS === 'ios' ? height * 0.08 : height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: width * 0.075,
    borderBottomRightRadius: width * 0.075,
  },
  title: {
    fontSize: Math.min(width * 0.07, 28),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: height * 0.015,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#ffffff',
    marginTop: height * 0.008,
    opacity: 0.9,
  },
  content: {
    padding: width * 0.0375,
    paddingTop: height * 0.03,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    minHeight: height * 0.3,
  },
  noPhotosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.075,
    minHeight: height * 0.3,
  },
  noPhotosIcon: {
    marginBottom: height * 0.02,
    opacity: 0.5,
  },
  noPhotos: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#6c757d',
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: (width - width * 0.12) / 2,
    marginBottom: height * 0.02,
    borderRadius: width * 0.04,
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
    height: Math.min(width * 0.4, height * 0.25),
    backgroundColor: '#eee',
  },
});
