import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Image, Alert
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const mockEvents = [
  { id: '1', title: 'उद्यम' },
  { id: '2', title: 'उम्मीद' },
  { id: '3', title: 'उत्रायण' },
  { id: '4', title: 'अभियान' },
  { id: '5', title: 'प्रेरणा' },
];

export default function EventsScreen() {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [photos, setPhotos] = useState([]);

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    setPhotos([]);
  };

  const handleUpload = () => {
    if (!selectedEventId) return Alert.alert('Select Event');
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 }, async (res) => {
      if (res.didCancel || !res.assets) return;
      const selected = res.assets.slice(0, 10);
      const formData = new FormData();
      formData.append('eventId', selectedEventId);
      selected.forEach((img, index) => {
        formData.append('photos', {
          uri: img.uri,
          type: img.type,
          name: img.fileName || `photo_${index}.jpg`,
        });
      });

      try {
        const response = await fetch('http://<YOUR-IP>:5000/api/events/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = await response.json();
        Alert.alert('Success', `Uploaded ${data.saved} photos`);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Upload failed');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Event</Text>
      <FlatList
        data={mockEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectEvent(item.id)}
            style={[
              styles.eventItem,
              selectedEventId === item.id && styles.selected,
            ]}
          >
            <Text style={styles.eventText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        horizontal
      />
      <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload Photos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  eventItem: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  selected: { backgroundColor: '#4CAF50' },
  eventText: { color: '#000' },
  uploadButton: {
    marginTop: 30,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadText: { color: '#fff', fontWeight: 'bold' },
});
