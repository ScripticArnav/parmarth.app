import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AuthContext from "../store/AuthContext.js";
import Toast from "react-native-toast-message";
import backendUrl from "../../backendUrl.js";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
//   console.log("Navigation Object:", navigation);

  const isEmailValid = (email) => {
    console.log("Validating Email:", email);
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  };

  const isPasswordValid = (password) => {
    console.log("Validating Password Length:", password.length);
    return password.length >= 8;
  };

  const loginHandler = async () => {
    console.log("Login button pressed");
    setIsLoading(true);

    console.log("Email entered:", email);
    console.log("Password entered:", password);

    if (!isEmailValid(email)) {
      console.log("Invalid Email");
      Toast.show({ type: "error", text1: "Enter a valid email" });
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      console.log("Invalid Password");
      Toast.show({
        type: "error",
        text1: "Password should be at least 8 characters",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending login request to:", `${backendUrl}/login`);
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Received response status:", response.status);
      const resData = await response.json();
      console.log("Response Data:", resData);

      if (resData.error) {
        console.log("Server returned error:", resData.error);
        Toast.show({ type: "error", text1: resData.error });
      } else if (resData.token) {
        console.log("Login Successful, token received");
        const expirationTime = new Date(
          new Date().getTime() + resData.expiresIn * 1000
        );
        console.log("Token Expiration Time:", expirationTime.toISOString());
        authCtx.login(
          resData.token,
          expirationTime.toISOString(),
          resData.userId
        );
        Toast.show({ type: "success", text1: "Successfully logged in" });
        // onLogin();

      } else if (
        resData.message === "Successfully sent 2FA code to email" &&
        resData.userId
      ) {
        console.log("2FA required, userId:", resData.userId);
        Toast.show({ type: "success", text1: resData.message });
        authCtx.setPending2FAUser(resData.userId);
        // navigation.replace("VerifyCode");
      }
    } catch (err) {
      console.error("Network Error:", err);
      Toast.show({ type: "error", text1: err.message });
    }

    console.log("Login process finished");
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
          console.log("Email Input Changed:", text);
          setEmail(text);
        }}
      />
      <TextInput
        placeholder="Enter your password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => {
          console.log("Password Input Changed:", text);
          setPassword(text);
        }}
      />

      <Text style={styles.tip}>Please use correct credentials</Text>

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

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 30,
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  tip: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
