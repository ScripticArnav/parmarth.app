import { useState, useContext } from "react";
import backendUrl from "../../backendUrl";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AuthContext from "../store/AuthContext";
import * as jwtDecode from "jwt-decode";
import * as ImagePicker from "expo-image-picker";

const AttendanceScreen = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [volunteers, setVolunteers] = useState([
    { volName: "", rollNo: "", branch: "" },
  ]);

  const [classWise, setClassWise] = useState([{ className: "", count: "" }]);
  const [photos, setPhotos] = useState([]);

  const classGroups = [
    "group 0-",
    "group 0+",
    "group 0",
    "group 1",
    "group 2",
    "group JNV",
    "group GE",
  ];

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

  const getAvailableClasses = (excludeIndex) => {
    const selectedClasses = classWise
      .map((item, i) => (i !== excludeIndex ? item.className : null))
      .filter(Boolean);
    return classGroups.filter((cls) => !selectedClasses.includes(cls));
  };

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
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

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
      if (!response.ok) throw new Error(data.message || "Invalid OTP");

      authCtx.login(data.token);
      Alert.alert("Success", "Logged in successfully!");

      const decoded = jwtDecode.jwtDecode(data.token);
      const timeout = decoded.exp * 1000 - Date.now();

      setTimeout(() => {
        Alert.alert("Session expired", "Please login again.");
        authCtx.logout();
      }, timeout);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAddClass = () => {
    setClassWise([...classWise, { className: "", count: "" }]);
  };

  const handleAddVolunteer = () => {
    setVolunteers([...volunteers, { volName: "", rollNo: "", branch: "" }]);
  };

  const handleAddPhoto = async () => {
    if (photos.length >= 7) {
      alert("Maximum 7 photos allowed!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotos((prev) => {
        if (prev.length < 7) {
          return [...prev, { uri: result.assets[0].uri }];
        } else {
          alert("Maximum 7 photos allowed!");
          return prev;
        }
      });
    }
  };

  const handleSubmit = async () => {
    for (let vol of volunteers) {
      if (!vol.volName.trim() || !vol.rollNo.trim() || !vol.branch) {
        Alert.alert("Error", "Please fill all volunteer details.");
        return;
      }

      const rollRegex = /^\d{13}$/;
      if (!rollRegex.test(vol.rollNo)) {
        Alert.alert("Invalid", "Each Roll Number must be 13 digits.");
        return;
      }
    }

    const classWiseMap = {};
    for (let item of classWise) {
      if (!item.className || isNaN(Number(item.count))) {
        Alert.alert("Error", "Fill valid class and count.");
        return;
      }
      classWiseMap[item.className] = Number(item.count);
    }

    const formData = new FormData();
    formData.append("volunteers", JSON.stringify(volunteers));
    formData.append("classWise", JSON.stringify(classWiseMap));

    photos.forEach((photo, index) => {
      formData.append("photos", {
        uri: photo.uri,
        name: `photo${index}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      const response = await fetch(`${backendUrl}/attendance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed");

      Alert.alert("Success", data.message || "Attendance marked!");
      setVolunteers([{ volName: "", rollNo: "", branch: "" }]);
      setClassWise([{ className: "", count: "" }]);
      setPhotos([]);
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
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Mark Volunteer Attendance</Text>

      {volunteers.map((vol, index) => (
        <View key={index}>
          <Text style={styles.subHeading}>Volunteer {index + 1}</Text>
          <TextInput
            placeholder="Enter Volunteer Name"
            value={vol.volName}
            onChangeText={(text) => {
              const updated = [...volunteers];
              updated[index].volName = text;
              setVolunteers(updated);
            }}
            style={styles.input}
            placeholderTextColor="#666"
          />
          <TextInput
            placeholder="Enter Roll Number"
            value={vol.rollNo}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "").slice(0, 13);
              const updated = [...volunteers];
              updated[index].rollNo = numericText;
              setVolunteers(updated);
            }}
            style={styles.input}
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vol.branch}
              onValueChange={(value) => {
                const updated = [...volunteers];
                updated[index].branch = value;
                setVolunteers(updated);
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

      <TouchableOpacity style={styles.smallButton} onPress={handleAddVolunteer}>
        <Text style={styles.buttonText}>+ Add Volunteer</Text>
      </TouchableOpacity>

      <Text style={styles.subHeading}>Class-wise Attendance</Text>
      {classWise.map((item, index) => {
        const availableClasses = getAvailableClasses(index);
        if (item.className && !availableClasses.includes(item.className)) {
          availableClasses.push(item.className);
        }
        availableClasses.sort();

        return (
          <View key={index} style={styles.classRow}>
            <View style={[styles.pickerContainer, { flex: 1, marginRight: 8 }]}>
              <Picker
                selectedValue={item.className}
                onValueChange={(value) => {
                  const updated = [...classWise];
                  updated[index].className = value;
                  setClassWise(updated);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="Select Class Group"
                  value=""
                  enabled={false}
                />
                {availableClasses.map((group) => (
                  <Picker.Item key={group} label={group} value={group} />
                ))}
              </Picker>
            </View>
            <TextInput
              placeholder="Count"
              value={item.count}
              keyboardType="numeric"
              onChangeText={(text) => {
                const updated = [...classWise];
                updated[index].count = text;
                setClassWise(updated);
              }}
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor="#666"
            />
          </View>
        );
      })}

      <TouchableOpacity
        style={[
          styles.smallButton,
          getAvailableClasses().length == 0
            ? { backgroundColor: "#999" }
            : null,
        ]}
        onPress={handleAddClass}
        disabled={getAvailableClasses().length == 0}
      >
        <Text style={styles.buttonText}>Add Class Group</Text>
      </TouchableOpacity>

      <Text style={styles.subHeading}>Upload Photos</Text>
      <View style={styles.photoContainer}>
        {photos.map((photo, idx) => (
          <Image
            key={idx}
            source={{ uri: photo.uri }}
            style={styles.photoPreview}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddPhoto}>
        <Text style={styles.buttonText}>Add Photo</Text>
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
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 10,
  },
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
  classRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  photoContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default AttendanceScreen;
