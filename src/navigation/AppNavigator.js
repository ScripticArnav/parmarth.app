import { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Image } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import StudyMaterialScreen from '../screens/StudyMaterialScreen';
import MaterialDetailsScreen from '../screens/MaterialDetailsScreen';
import DatabaseScreen from '../screens/DatabaseScreen';
import ViewAttendanceScreen from '../screens/ViewAttendanceScreen';
import AdmissionScreen from '../screens/RTEAdmissionScreen';
import RTEYearScreen from '../screens/RTEYearScreen';
import StudentsScreen from '../screens/StudentsScreen';
import EventScreen from '../screens/EventScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import TotalAttendanceScreen from '../screens/TotalAttendanceScreen.js';


import AuthContext from '../store/AuthContext';

const StudyStack = createStackNavigator();

function StudyMaterialStack() {
  return (
    <StudyStack.Navigator screenOptions={{
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
              borderWidth: 0.8,
              borderRadius: 18,
            }}
            resizeMode="contain"
          />
        </View>
      ),
    }}
    >
      <StudyStack.Screen
        name="Study Material"
        component={StudyMaterialScreen}
        options={{ headerShown: true }}  // Study Material screen pe header na dikhe
      />
      <StudyStack.Screen
        name="MaterialDetails"
        component={MaterialDetailsScreen}
        options={({ route }) => ({
          title: `${route.params.class} Material`,
          headerShown: true,  // Sirf yaha header dikhana hai
        })}
      />
    </StudyStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const DbStack = createStackNavigator();

function DatabaseStack() {
  return (
    <DbStack.Navigator screenOptions={{
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
              borderWidth: 0.8,
              borderRadius: 18,
            }}
            resizeMode="contain"
          />
        </View>
      ),
    }}
    >
      <DbStack.Screen
        name="Parmarth Database"
        component={DatabaseScreen}
        options={{ headerShown: true }}
      />
      <DbStack.Screen name="ViewAttendanceScreen" component={ViewAttendanceScreen} options={{ title: "Volunteers Attendence" }} />
      <DbStack.Screen name="AdmissionScreen" component={AdmissionScreen} options={{ title: "Admissions Overview" }} />
      <DbStack.Screen name="RTEYearDetails" component={RTEYearScreen} options={{ title: "RTE Admissions" }} />
      <DbStack.Screen name="StudentsScreen" component={StudentsScreen} options={{ title: "Students Details" }} />
      <DbStack.Screen name="EventsScreen" component={EventScreen} />
      <DbStack.Screen name="EventDetails" component={EventDetailsScreen} />
      <DbStack.Screen name="TotalAttendanceScreen" component={TotalAttendanceScreen} />
    </DbStack.Navigator>
  );
}

const AppNavigator = () => {
  const authCtx = useContext(AuthContext);
  const isAuth = authCtx.isLoggedIn;

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.openDrawer();
              }
            }}
            style={{ marginLeft: 16 }}
          >
            <Ionicons
              name={navigation.canGoBack() ? 'arrow-back' : 'menu'}
              size={28}
              color="black"
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Image
              source={require('../../assets/logo.jpg')}
              style={{
                width: 50,
                height: 50,
                marginRight: 10,
                borderWidth: 0.8,
                borderRadius: 18

              }}
              resizeMode="contain"
            />
          </View>
        ),
        tabBarIcon: ({ color, size }) => {

          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'StudyMaterial') iconName = 'book-outline';
          else if (route.name === 'Database') iconName = 'folder-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },

      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="StudyMaterial" component={StudyMaterialStack} options={{ headerShown: false }} />
      <Tab.Screen name="Database" component={DatabaseStack} options={{ headerShown: false }} />
      <Tab.Screen
        key={isAuth ? 'auth' : 'guest'}
        name="Profile"
        component={isAuth ? ProfileScreen : LoginScreen}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
