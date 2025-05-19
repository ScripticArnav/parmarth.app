import { useState, useContext } from "react";
import backendUrl from "../../backendUrl";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AuthContext from "../store/AuthContext";
// import jwtDecode from "jwt-decode";
import * as jwtDecode from "jwt-decode";


 // npm install jwt-decode

const AttendanceScreen = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [volName, setVolName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const branches = [
    "CSE",
    "CSE-SF",
    "CSE-AI",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
    "MBA",
    "MCA",
    "MTech",
  ];

  const handleSendOtp = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      console.log("Response: ", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      Alert.alert("Success", "OTP sent to your email.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/login/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      authCtx.login(data.token); // 1-hour token set by backend
      Alert.alert("Success", "Logged in successfully!");

      console.log(jwtDecode);
      
      const decoded = jwtDecode.jwtDecode(data.token);
      const expTime = decoded.exp * 1000; // exp is in seconds, convert to ms
      const currentTime = Date.now();
      const timeout = expTime - currentTime;

      // Set logout timer
      setTimeout(() => {
        Alert.alert("Session expired", "Please login again.");
        authCtx.logout();
      }, timeout);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSubmit = async () => {
    if (!volName.trim() || !rollNo.trim() || !branch.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const rollRegex = /^\d{13}$/;
    if (!rollRegex.test(rollNo)) {
      Alert.alert(
        "Invalid Roll Number",
        "Roll Number must be exactly 13 digits."
      );
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify({ volName, rollNo, branch }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      Alert.alert("Success", data.message || "Attendance marked successfully!");
      setVolName("");
      setRollNo("");
      setBranch("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Volunteer Attendance</Text>
        <TextInput
          placeholder="Enter Your Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#666"
        />

        {otpSent ? (
          <>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mark Volunteer Attendance</Text>

      <TextInput
        placeholder="Enter Volunteer Name"
        value={volName}
        onChangeText={setVolName}
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Enter Roll Number"
        value={rollNo}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, "");
          if (numericText.length <= 13) setRollNo(numericText);
        }}
        style={styles.input}
        placeholderTextColor="#666"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={branch}
          onValueChange={(itemValue) => setBranch(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Branch --" value="" enabled={false} />
          {branches.map((b) => (
            <Picker.Item key={b} label={b} value={b} />
          ))}
        </Picker>
      </View>

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
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
});

export default AttendanceScreen;
