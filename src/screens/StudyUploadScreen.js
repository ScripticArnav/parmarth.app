import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📚 Upload Study Material</Text>

      <Text style={styles.label}>Class / Exam</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={classOrExam} onValueChange={setClassOrExam}>
          <Picker.Item label="Select Class or Exam" value="" />
          {classOptions.map((cls) => (
            <Picker.Item label={`Class ${cls}`} value={`Class ${cls}`} key={cls} />
          ))}
          {examOptions.map((exam) => (
            <Picker.Item label={exam} value={exam} key={exam} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Subject</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={subject} onValueChange={setSubject}>
          <Picker.Item label="Select Subject" value="" />
          {subjects.map((sbj) => (
            <Picker.Item label={sbj} value={sbj} key={sbj} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Light Chapter Notes"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={type} onValueChange={setType}>
          <Picker.Item label="PDF" value="pdf" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.fileBtn}
        onPress={pickDocument}
        disabled={picking}
      >
        <Text style={styles.fileBtnText}>
          {file ? `📄 ${file.name}` : "📁 Pick File"}
        </Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>✅ File Selected</Text>
          <Text>Name: {file.name}</Text>
          <Text>Type: {file.mimeType || "Unknown"}</Text>
          <Text>Size: {(file.size / 1024).toFixed(2)} KB</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.uploadBtn, loading && { opacity: 0.6 }]}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadBtnText}>⬆️ Upload Material</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A148C",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B39DDB",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#B39DDB",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  fileBtn: {
    backgroundColor: "#7E57C2",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  fileBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  uploadBtn: {
    backgroundColor: "#4A148C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  uploadBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  previewBox: {
    backgroundColor: "#EDE7F6",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  previewText: {
    fontWeight: "700",
    marginBottom: 6,
  },
});
