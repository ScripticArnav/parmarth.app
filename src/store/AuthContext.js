import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  userType: "",
  fillUserType: (userType) => {},
  nullUserType: () => {},
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("token");
    const storedExpirationTime = await AsyncStorage.getItem("expirationTime");

    if (!storedToken || !storedExpirationTime) return null;

    const remainingTime = calculateRemainingTime(storedExpirationTime);

    if (remainingTime <= 43200) {
      await AsyncStorage.multiRemove(["token", "expirationTime", "userId"]);
      return null;
    }

    return {
      token: storedToken,
      expirationTime: storedExpirationTime,
      duration: remainingTime,
    };
  } catch (err) {
    return null;
  }
};

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState("");
  const userIsLoggedIn = !!token;

  const fillUserType = (userType) => setUserType(userType);
  const nullUserType = () => setUserType("");

  const logoutHandler = useCallback(async () => {
    setToken(null);
    await AsyncStorage.multiRemove(["token", "expirationTime", "userId"]);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = async (token, expirationTime, userId) => {
    setToken(token);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("expirationTime", expirationTime);
    await AsyncStorage.setItem("userId", userId);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await retrieveStoredToken();

      if (tokenData) {
        setToken(tokenData.token);
        logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
    };

    fetchToken();
  }, [logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    userType: userType,
    fillUserType,
    nullUserType,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
