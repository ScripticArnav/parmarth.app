import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
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
      <Text style={styles.header}>Upload Study Material</Text>

      <Text style={styles.label}>Class / Exam:</Text>
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

      <Text style={styles.label}>Subject:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={subject} onValueChange={setSubject}>
          <Picker.Item label="Select Subject" value="" />
          {subjects.map((sbj) => (
            <Picker.Item label={sbj} value={sbj} key={sbj} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Title (e.g., Light Chapter Notes)"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Type:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={type} onValueChange={setType}>
          <Picker.Item label="PDF" value="pdf" />
          <Picker.Item label="Video" value="video" />
          <Picker.Item label="Note" value="note" />
        </Picker>
      </View>

      <Button
        title={file ? `Change File (${file.name})` : "Pick File"}
        onPress={pickDocument}
        disabled={picking}
      />

      {file && (
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>📄 File Selected:</Text>
          <Text>Name: {file.name}</Text>
          <Text>Type: {file.mimeType || "Unknown type"}</Text>
          <Text>Size: {(file.size / 1024).toFixed(2)} KB</Text>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={loading ? "Uploading..." : "Upload Material"}
          onPress={handleUpload}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4A148C",
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  previewBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
});
