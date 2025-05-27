import React, { useState } from "react";
import backendUrl from "../../backendUrl";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const MentorScreen = () => {
  const [mentors, setMentors] = useState([
    { mentorName: "", rollNo: "", branch: "" },
  ]);

  const branches = [
    "CSE",
    "CSE SF",
    "CSE AI",
    "ECE",
    "EE",
    "ME",
    "CHE",
    "CE",
    "MBA",
    "MCA",
    "MTech",
  ];

  const handleAddMentor = () => {
    setMentors([...mentors, { mentorName: "", rollNo: "", branch: "" }]);
  };

  const handleRemoveMentor = (index) => {
    if (mentors.length > 1) {
      const updated = mentors.filter((_, i) => i !== index);
      setMentors(updated);
    }
  };

  const handleSubmit = async () => {
    for (let mentor of mentors) {
      if (!mentor.mentorName.trim() || !mentor.rollNo.trim() || !mentor.branch) {
        Alert.alert("Error", "Please fill all mentor details.");
        return;
      }

      const rollRegex = /^\d{13}$/;
      if (!rollRegex.test(mentor.rollNo)) {
        Alert.alert("Invalid", "Each Roll Number must be 13 digits.");
        return;
      }
    }

    try {
      const response = await fetch(`${backendUrl}/attendance/mentor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mentors }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed");

      Alert.alert("Success", data.message || "Attendance marked!");
      setMentors([{ mentorName: "", rollNo: "", branch: "" }]);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="chalkboard-teacher" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Mark Mentor Attendance</Text>
        <Text style={styles.headerSubtitle}>Record mentor attendance details</Text>
      </LinearGradient>

      <View style={styles.content}>
        {mentors.map((mentor, index) => (
          <View key={index} style={styles.mentorCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <FontAwesome5 name="user-graduate" size={20} color="#002855" />
              </View>
              <Text style={styles.cardTitle}>Mentor {index + 1}</Text>
              {index > 0 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveMentor(index)}
                >
                  <FontAwesome5 name="times" size={16} color="#dc3545" />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              placeholder="Enter Mentor Name"
              value={mentor.mentorName}
              onChangeText={(text) => {
                const updated = [...mentors];
                updated[index].mentorName = text;
                setMentors(updated);
              }}
              style={styles.input}
              placeholderTextColor="#6c757d"
            />
            <TextInput
              placeholder="Enter Roll Number"
              value={mentor.rollNo}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "").slice(0, 13);
                const updated = [...mentors];
                updated[index].rollNo = numericText;
                setMentors(updated);
              }}
              style={styles.input}
              placeholderTextColor="#6c757d"
              keyboardType="numeric"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={mentor.branch}
                onValueChange={(value) => {
                  const updated = [...mentors];
                  updated[index].branch = value;
                  setMentors(updated);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="Select Branch"
                  value=""
                  enabled={false}
                />
                {branches.map((b) => (
                  <Picker.Item key={b} label={b} value={b} />
                ))}
              </Picker>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddMentor}>
          <LinearGradient
            colors={['#002855', '#003f88']}
            style={styles.buttonGradient}
          >
            <FontAwesome5 name="plus" size={16} color="#fff" />
            <Text style={styles.buttonText}>Add Mentor</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#002855', '#003f88']}
            style={styles.buttonGradient}
          >
            <FontAwesome5 name="check" size={16} color="#fff" />
            <Text style={styles.buttonText}>Submit Attendance</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
  mentorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
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
  removeButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
});

export default MentorScreen; 