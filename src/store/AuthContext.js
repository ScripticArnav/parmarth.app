import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  loginMethod: "",
  login: (token, loginMethod) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = async () => {
  const storedToken = await AsyncStorage.getItem("token");
  const storedExpirationDate = await AsyncStorage.getItem("expirationTime");
  const storedLoginMethod = await AsyncStorage.getItem("loginMethod");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    await AsyncStorage.multiRemove(["token", "expirationTime", "loginMethod"]);
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    loginMethod: storedLoginMethod,
  };
};

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [loginMethod, setLoginMethod] = useState("");
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(async () => {
    setToken(null);
    setLoginMethod("");
    await AsyncStorage.multiRemove(["token", "expirationTime", "loginMethod"]);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = async (token, expirationTime, userId, loginMethod) => {
    if (!["password", "otp"].includes(loginMethod)) {
      throw new Error("Invalid login method");
    }
    
    setToken(token);
    setLoginMethod(loginMethod);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("expirationTime", expirationTime);
    await AsyncStorage.setItem("userId", userId);
    await AsyncStorage.setItem("loginMethod", loginMethod);

    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await retrieveStoredToken();

      if (tokenData) {
        setToken(tokenData.token);
        setLoginMethod(tokenData.loginMethod);
        logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
    };

    fetchToken();
  }, [logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    loginMethod: loginMethod,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
