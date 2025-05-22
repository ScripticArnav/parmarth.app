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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{eventName}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00695c" />
      ) : !photos.length ? (
        <Text style={styles.noPhotos}>No photos uploaded yet.</Text>
      ) : (
        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
              <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      )}

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
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A1B9A',
    marginBottom: 25,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noPhotos: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 30,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: {
    width: (screenWidth - 48) / 2,
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
