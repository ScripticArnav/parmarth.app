import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import backendUrl from '../../backendUrl';

export default function StudyUploadScreen() {
  const classOptions = [
    'GE', 'KG', '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th', '11th', '12th',
  ];
  const examOptions = ['JEE', 'NEET'];

  const subjects = ['Hindi', 'English', 'Math', 'Science', 'Social Science', 'GK', 'Computer'];

  const [classOrExam, setClassOrExam] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  const pickDocument = async () => {
    console.log('Starting document picker...');
    setPicking(true);
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*', // can change to allowedTypes later
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('Document Picker Result:', res);

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const pickedFile = res.assets[0];

        // Validate file type
        if (!allowedTypes.includes(pickedFile.mimeType)) {
          Alert.alert('Invalid File Type', 'Please select a valid document (PDF, DOC, PPT, etc).');
          return;
        }

        console.log('Picked file:', pickedFile);
        setFile(pickedFile);
      } else {
        Alert.alert('Cancelled', 'No document selected.');
      }
    } catch (err) {
      console.error('Document Picker Error:', err);
      Alert.alert('Error', 'Could not pick the document.');
    } finally {
      setPicking(false);
    }
  };

 const handleUpload = async () => {
  console.log('Upload triggered...');
  console.log('Field values:', { classOrExam, subject, title, type, file });

  if (!classOrExam || !subject.trim() || !title.trim() || !type || !file) {
    console.warn('Missing fields:', { classOrExam, subject, title, type, file });
    Alert.alert('Error', 'Please fill in all fields and select a valid file.');
    return;
  }

  const formData = new FormData();
  formData.append('className', classOrExam);
  formData.append('subject', subject.trim());
  formData.append('title', title.trim());
  formData.append('type', type);

  let fileUri = file.uri;
  if (!fileUri.startsWith('file://')) {
    fileUri = 'file://' + fileUri;
  }

  formData.append('file', {
    uri: fileUri,
    name: file.name,
    type: file.mimeType || 'application/octet-stream',
  });

  setLoading(true);
  try {
    const response = await fetch(`${backendUrl}/materials/upload`, {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    });

    const rawText = await response.text();
    console.log('Raw server response:', rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Invalid JSON received from server:', parseErr);
      throw new Error('Server did not return valid JSON.');
    }

    if (response.ok) {
      Alert.alert('Success', 'Material uploaded successfully.');
      console.log('Upload success:', data);
      setClassOrExam('');
      setSubject('');
      setTitle('');
      setType('pdf');
      setFile(null);
    } else {
      console.error('Upload failed:', data);
      Alert.alert('Error', data.message || 'Upload failed.');
    }
  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert('Error', 'Something went wrong during upload.');
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Upload Study Material</Text>

      <Text style={styles.label}>Class / Exam:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={classOrExam}
          onValueChange={(itemValue) => setClassOrExam(itemValue)}
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
      <Text style={styles.label}>Subjects</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={subject}
          onValueChange={(itemValue) => setSubject(itemValue)}
        >
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
        <Picker selectedValue={type} onValueChange={(val) => setType(val)}>
          <Picker.Item label="PDF" value="pdf" />
          <Picker.Item label="Video" value="video" />
          <Picker.Item label="Note" value="note" />
        </Picker>
      </View>

      <Button
        title={file ? `Change File (${file.name})` : 'Pick File'}
        onPress={pickDocument}
        disabled={picking}
      />

      {file && (
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>📄 File Selected:</Text>
          <Text>Name: {file.name}</Text>
          <Text>Type: {file.mimeType || 'Unknown type'}</Text>
          <Text>Size: {(file.size / 1024).toFixed(2)} KB</Text>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={loading ? 'Uploading...' : 'Upload Material'}
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A148C',
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  previewBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});
