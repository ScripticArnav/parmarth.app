import React, { memo, useContext } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import AppNavigator from "./AppNavigator";
import AttendanceScreen from "../screens/AttendanceScreen";
import StudyUploadScreen from "../screens/StudyUploadScreen";
import AboutScreen from "../screens/AboutScreen";
import AuthContext from "../store/AuthContext"; // Path check kar lena

const MemoizedTabs = memo(AppNavigator);
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const authCtx = useContext(AuthContext);

  const handleAuthPress = () => {
    if (authCtx.isLoggedIn) {
      authCtx.logout();
    } else {
      // Drawer ke nested Tab me "Profile" tab open karna hai
      props.navigation.navigate("Main", { screen: "Profile" });
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <BlurView intensity={60} style={styles.blurBackground}>
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/logo.jpg")}
            style={styles.profilePic}
          />
          <Text style={styles.username}>PARMARTH IET Lucknow</Text>
        </View>

        <DrawerItemList {...props} />

        <View style={styles.authButtonContainer}>
          <TouchableOpacity onPress={handleAuthPress} style={styles.authButton}>
            <Ionicons
              name={authCtx.isLoggedIn ? "log-out-outline" : "log-in-outline"}
              size={20}
              color="#000"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.authButtonText}>
              {authCtx.isLoggedIn ? "Logout" : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </DrawerContentScrollView>
  );
};

export default function DrawerNavigator() {
  const progress = useSharedValue(0);

  const animatedScreenStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 0.88]) },
      { translateX: interpolate(progress.value, [0, 1], [0, 50]) },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, 20]),
    overflow: "hidden",
    flex: 1,
  }));

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        overlayColor: "transparent",
        drawerStyle: styles.drawerStyle,
        sceneContainerStyle: { backgroundColor: "transparent" },
        headerShown: false,
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <Image
              source={require("../../assets/icon.png")}
              style={{
                width: 50,
                height: 50,
                marginRight: 10,
                borderColor: "black",
                borderWidth: 0.8,
                borderRadius: 18,
              }}
              resizeMode="contain"
            />
            {/* <View>
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>           PARMARTH</Text>
                      <Text style={{ fontSize: 12, color: '#555' }}>The Social Club of IET Lucknow</Text>
                    </View> */}
          </View>
        ),
      }}
    >
      <Drawer.Screen name="Main">
        {(props) => (
          <Animated.View style={animatedScreenStyle}>
            <MemoizedTabs {...props} />
          </Animated.View>
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Mark Attendance"
        component={AttendanceScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Upload Study Materials"
        component={StudyUploadScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: true }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  blurBackground: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 260,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 8,
    elevation: 5,
  },
  authButtonContainer: {
    marginTop: "auto",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
