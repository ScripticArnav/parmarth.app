import { useState } from "react";
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
      const response = await fetch(`${backendUrl}/mentors/attendanc`, {
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
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Mark Mentor Attendance</Text>

      {mentors.map((mentor, index) => (
        <View key={index}>
          <Text style={styles.subHeading}>Mentor {index + 1}</Text>
          <TextInput
            placeholder="Enter Mentor Name"
            value={mentor.mentorName}
            onChangeText={(text) => {
              const updated = [...mentors];
              updated[index].mentorName = text;
              setMentors(updated);
            }}
            style={styles.input}
            placeholderTextColor="#666"
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
            placeholderTextColor="#666"
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

      <TouchableOpacity style={styles.smallButton} onPress={handleAddMentor}>
        <Text style={styles.buttonText}>+ Add Mentor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Attendance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subHeading: { fontSize: 18, fontWeight: "600", marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    color: "#000",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  picker: { height: 50, color: "#000" },
  smallButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#006400",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default MentorScreen; 