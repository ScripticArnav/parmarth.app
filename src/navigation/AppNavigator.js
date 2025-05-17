import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, Image } from 'react-native';


import HomeScreen from '../screens/HomeScreen.js';
import EventScreen from '../screens/EventScreen.js';
import DatabaseScreen from '../screens/DatabaseScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import AuthContext from '../store/AuthContext.js';
import LoginScreen from '../screens/LoginScreen.js';

const Tab = createBottomTabNavigator();

const AppNavigator = ({ navigation }) => {
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
              source={require('../../assets/icon.png')}
              style={{
                width: 50, 
                height: 50, 
                marginRight: 10, 
                borderColor: 'black',
                borderRadius: 106
              }}
              resizeMode="contain"
            />
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>           PARMARTH</Text>
              <Text style={{ fontSize: 14, color: '#555' }}>The Social Club of IET Lucknow</Text>
            </View>
          </View>
        ),


        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Event') iconName = 'calendar-outline';
          else if (route.name === 'Database') iconName = 'folder-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Event" component={EventScreen} />
      <Tab.Screen name="Database" component={DatabaseScreen} />
      <Tab.Screen
        key={isAuth ? 'auth' : 'guest'}
        name="Profile"
        component={isAuth ? ProfileScreen : LoginScreen}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
