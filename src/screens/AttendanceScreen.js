import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AuthContext from "../store/AuthContext";

const AttendanceScreen = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");

  const handleSubmit = () => {
    if (!rollNo.trim() || !branch.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    Alert.alert("Success", "Attendance marked successfully!");
    setRollNo("");
    setBranch("");
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loginText}>Please login to mark attendance.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mark Volunteer Attendance</Text>

      <TextInput
        placeholder="Enter Volunteer Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Enter Roll Number"
        value={rollNo}
        onChangeText={setRollNo}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Enter Branch"
        value={branch}
        onChangeText={setBranch}
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#002855",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#003f88",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    fontSize: 16,
    color: "#002855",
    textAlign: "center",
  },
});

export default AttendanceScreen;
