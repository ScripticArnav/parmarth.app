import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

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
            <Image key={index} source={{ uri }} style={styles.photo} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  noPhotos: { textAlign: 'center', fontSize: 16, color: '#888' },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
});
