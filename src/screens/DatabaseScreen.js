import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../store/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';

const DatabaseScreen = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const navigation = useNavigation();

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const CustomButton = ({ title, screenName, bgColor }) => (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => handleNavigation(screenName)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[bgColor, `${bgColor}CC`]}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a237e', '#283593']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Database Management</Text>
        <Text style={styles.headerSubtitle}>Manage your Parmarth data efficiently</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Database Options</Text>
          <Text style={styles.subtitle}>Select a category to manage your data</Text>

          <View style={styles.buttonsWrapper}>
            <CustomButton
              title="View Attendance"
              screenName="ViewAttendanceScreen"
              bgColor="#4CAF50"
            />
            <CustomButton
              title="Students in Parmarth"
              screenName="StudentsScreen"
              bgColor="#2196F3"
            />
            <CustomButton
              title="Admission Data"
              screenName="AdmissionScreen"
              bgColor="#FF5722"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1a237e",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonsWrapper: {
    width: "100%",
  },
  buttonContainer: {
    marginVertical: 8,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default DatabaseScreen;
