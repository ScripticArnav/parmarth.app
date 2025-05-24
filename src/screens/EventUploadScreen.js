import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import backendUrl from "../../backendUrl";

const events = [
  "उद्यम",
  "उम्मीद",
  "उन्नयन",
  "उत्साह",
  "उत्सर्ग",
  "मुस्कान",
  "शैक्षणिक भ्रमण",
  "रक्तदान महादान",
  "उत्सव आयोजन",
];

export default function EventPhotoUploadScreen() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    if (photos.length >= 7) {
      Alert.alert("Limit Reached", "You can upload up to 7 photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 7 - photos.length,
    });

    if (!result.canceled) {
      setPhotos([...photos, ...result.assets]);
    }
  };

  const handleUpload = async () => {
    if (!selectedEvent || photos.length === 0) {
      Alert.alert("Missing Info", "Please select event and add at least one photo.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("event", selectedEvent);
      photos.forEach((photo, index) => {
        formData.append("photos", {
          uri: photo.uri,
          name: `photo${index + 1}.jpg`,
          type: "image/jpeg",
        });
      });

      const res = await fetch(`${backendUrl}/event/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Photos uploaded successfully!");
        setSelectedEvent("");
        setPhotos([]);
      } else {
        Alert.alert("Upload Failed", data?.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="camera" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Upload Event Photos</Text>
        <Text style={styles.headerSubtitle}>Share your event memories</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome5 name="calendar-alt" size={20} color="#002855" />
            </View>
            <Text style={styles.sectionTitle}>Select Event</Text>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedEvent}
              onValueChange={setSelectedEvent}
              style={styles.picker}
            >
              <Picker.Item label="Select Event" value="" />
              {events.map((evt) => (
                <Picker.Item label={evt} value={evt} key={evt} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome5 name="images" size={20} color="#002855" />
            </View>
            <Text style={styles.sectionTitle}>Event Photos</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={pickImages}
            disabled={photos.length >= 7}
          >
            <LinearGradient
              colors={photos.length >= 7 ? ['#6c757d', '#6c757d'] : ['#002855', '#003f88']}
              style={styles.buttonGradient}
            >
              <FontAwesome5 name="plus" size={16} color="#fff" />
              <Text style={styles.buttonText}>
                {photos.length >= 7
                  ? "Max 7 Photos Added"
                  : `Pick Photos (${photos.length}/7)`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.photoScroll} showsHorizontalScrollIndicator={false}>
            {photos.map((img, idx) => (
              <View key={idx} style={styles.photoContainer}>
                <Image source={{ uri: img.uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => {
                    setPhotos(photos.filter((_, i) => i !== idx));
                  }}
                >
                  <FontAwesome5 name="times" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpload}
          disabled={loading}
        >
          <LinearGradient
            colors={['#002855', '#003f88']}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesome5 name="cloud-upload-alt" size={16} color="#fff" />
                <Text style={styles.buttonText}>Upload Photos</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    padding: 15,
    paddingTop: 25,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2c3e50',
  },
  addButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buttonGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  photoScroll: {
    marginTop: 16,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginBottom: 50,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});
