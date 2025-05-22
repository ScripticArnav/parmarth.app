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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📸 Upload Event Photos</Text>

      <Text style={styles.label}>Select Event</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={selectedEvent} onValueChange={setSelectedEvent}>
          <Picker.Item label="Select Event" value="" />
          {events.map((evt) => (
            <Picker.Item label={evt} value={evt} key={evt} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.pickBtn}
        onPress={pickImages}
        disabled={photos.length >= 7}
      >
        <Text style={styles.pickBtnText}>
          {photos.length >= 7
            ? "📷 Max 7 Photos Added"
            : `📷 Pick Photos (${photos.length}/7)`}
        </Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.previewScroll}>
        {photos.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img.uri }}
            style={styles.previewImage}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.uploadBtn, loading && { opacity: 0.6 }]}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadBtnText}>⬆️ Upload Photos</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#FAFAFA",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#880E4F",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#F06292",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  pickBtn: {
    backgroundColor: "#D81B60",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  pickBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  previewScroll: {
    marginTop: 15,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  uploadBtn: {
    backgroundColor: "#880E4F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  uploadBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
