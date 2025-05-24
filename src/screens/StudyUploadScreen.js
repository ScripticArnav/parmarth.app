import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import backendUrl from "../../backendUrl";

export default function StudyUploadScreen() {
  const classOptions = [
    "GE",
    "KG",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ];
  const examOptions = ["JEE", "NEET"];
  const subjects = [
    "HomeWork",
    "Hindi",
    "English",
    "Math",
    "Science",
    "Social Science",
    "GK",
    "Computer",
  ];

  const [classOrExam, setClassOrExam] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("pdf");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);

  const pickDocument = async () => {
    try {
      setPicking(true);
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result.canceled) {
        const fileInfo = result.assets[0];
        setFile(fileInfo);
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick file");
      console.error(error);
    } finally {
      setPicking(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert("Error", "Please pick a file to upload.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      });
      formData.append("classOrExam", classOrExam);
      formData.append("subject", subject);
      formData.append("title", title);
      formData.append("type", type);

      const response = await fetch(`${backendUrl}/study/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Unexpected response from server");
      }

      if (response.ok) {
        Alert.alert("Success", "Material uploaded successfully!");
        setClassOrExam("");
        setSubject("");
        setTitle("");
        setType("pdf");
        setFile(null);
      } else {
        Alert.alert("Upload Failed", data?.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Upload failed.");
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
        <FontAwesome5 name="book" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Upload Study Material</Text>
        <Text style={styles.headerSubtitle}>Share educational resources</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome5 name="graduation-cap" size={20} color="#002855" />
            </View>
            <Text style={styles.sectionTitle}>Material Details</Text>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={classOrExam}
              onValueChange={setClassOrExam}
              style={styles.picker}
            >
              <Picker.Item label="Select Class or Exam" value="" />
              {classOptions.map((cls) => (
                <Picker.Item label={`Class ${cls}`} value={`Class ${cls}`} key={cls} />
              ))}
              {examOptions.map((exam) => (
                <Picker.Item label={exam} value={exam} key={exam} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={subject}
              onValueChange={setSubject}
              style={styles.picker}
            >
              <Picker.Item label="Select Subject" value="" />
              {subjects.map((sbj) => (
                <Picker.Item label={sbj} value={sbj} key={sbj} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="e.g. Light Chapter Notes"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#6c757d"
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={setType}
              style={styles.picker}
            >
              <Picker.Item label="PDF" value="pdf" />
            </Picker>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome5 name="file-alt" size={20} color="#002855" />
            </View>
            <Text style={styles.sectionTitle}>Upload File</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={pickDocument}
            disabled={picking}
          >
            <LinearGradient
              colors={['#002855', '#003f88']}
              style={styles.buttonGradient}
            >
              <FontAwesome5 name="file-upload" size={16} color="#fff" />
              <Text style={styles.buttonText}>
                {file ? file.name : "Pick File"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {file && (
            <View style={styles.filePreview}>
              <View style={styles.fileInfo}>
                <FontAwesome5 name="file-pdf" size={24} color="#002855" />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileMeta}>
                    {file.mimeType || "Unknown"} • {(file.size / 1024).toFixed(2)} KB
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeFileButton}
                onPress={() => setFile(null)}
              >
                <FontAwesome5 name="times" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
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
                <Text style={styles.buttonText}>Upload Material</Text>
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
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#2c3e50',
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
  filePreview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
    color: '#6c757d',
  },
  removeFileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc3545',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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
