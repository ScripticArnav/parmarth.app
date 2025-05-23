import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AuthContext from "../store/AuthContext.js";
import Toast from "react-native-toast-message";
import backendUrl from "../../backendUrl.js";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);

  const isEmailValid = (email) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const loginHandler = async () => {
    setIsLoading(true);

    if (!isEmailValid(email)) {
      Toast.show({ type: "error", text1: "Enter a valid email" });
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      Toast.show({
        type: "error",
        text1: "Password should be at least 8 characters",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType }),
      });

      const resData = await response.json();

      if (resData.error) {
        Toast.show({ type: "error", text1: resData.error });
      } else if (resData.token) {
        const expirationTime = new Date(
          new Date().getTime() + resData.expiresIn * 1000
        );
        authCtx.login(
          resData.token,
          expirationTime.toISOString(),
          resData.userId,
          userType
        );
        Toast.show({ type: "success", text1: "Successfully logged in" });
      } else if (
        resData.message === "Successfully sent 2FA code to email" &&
        resData.userId
      ) {
        Toast.show({ type: "success", text1: resData.message });
        authCtx.setPending2FAUser(resData.userId);
      }
    } catch (err) {
      Toast.show({ type: "error", text1: err.message });
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <TextInput
        placeholder="Enter your password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
        }}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userType}
          onValueChange={(value) => setUserType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Faculty" value="faculty" />
          <Picker.Item label="Media" value="media" />
          <Picker.Item label="Master" value="master" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={loginHandler}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
});

export default LoginScreen;
