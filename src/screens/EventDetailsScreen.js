import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

export default function EventDetailsScreen({ route }) {
  const { title, photos } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {!Array.isArray(photos) || photos.length === 0 ? (
        <Text style={styles.noPhotos}>No photos uploaded.</Text>
      ) : (
        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.photo}
              resizeMode="cover"
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00695c',
    marginBottom: 20,
  },
  noPhotos: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: {
    width: (screenWidth - 48) / 2, // 16 padding * 2 + 16 gap
    height: 160,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#ccc',
  },
});
