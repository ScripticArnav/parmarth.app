import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Image } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import StudyMaterialScreen from '../screens/StudyMaterialScreen';
import MaterialDetailsScreen from '../screens/MaterialDetailsScreen';
import OrganizationScreen from '../screens/OrganizationScreen';
import DatabaseScreen from '../screens/DatabaseScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';


import GoverningCouncilScreen from '../screens/GoverningCouncilScreen';
import AdvisoryCouncilScreen from '../screens/AdvisoryCouncilScreen';
import ExecutiveCouncilScreen from '../screens/ExecutiveCouncilScreen';
import LegacyCouncilScreen from '../screens/LegacyCouncilScreen';

import AuthContext from '../store/AuthContext';

const StudyStack = createStackNavigator();

function StudyMaterialStack() {
  return (
    <StudyStack.Navigator>
      <StudyStack.Screen
        name="StudyMaterialMain"
        component={StudyMaterialScreen}
        options={{ headerShown: false }}
      />
      <StudyStack.Screen
        name="MaterialDetails"
        component={MaterialDetailsScreen}
        options={({ route }) => ({ title: `${route.params.class} Material` })}
      />
    </StudyStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const OrgStack = createStackNavigator();

function OrganizationStack() {
  return (
    <OrgStack.Navigator >
      <OrgStack.Screen
        name="OrganizationMain"
        component={OrganizationScreen}
        options={{ title: 'Organization' }}
      />
      <OrgStack.Screen
        name="GoverningCouncil"
        component={GoverningCouncilScreen}
        options={{ title: 'Governing Council' }}
      />
      <OrgStack.Screen
        name="AdvisoryCouncil"
        component={AdvisoryCouncilScreen}
        options={{ title: 'Advisory Council' }}
      />
      <OrgStack.Screen
        name="ExecutiveCouncil"
        component={ExecutiveCouncilScreen}
        options={{ title: 'Executive Council' }}
      />
      <OrgStack.Screen
        name="LegacyCouncil"
        component={LegacyCouncilScreen}
        options={{ title: 'Legacy Executive Council' }}
      />
    </OrgStack.Navigator>
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
              source={require('../../assets/icon.png')}
              style={{
                width: 50,
                height: 50,
                marginRight: 10,
                borderColor: 'black',
                borderRadius: 106,
              }}
              resizeMode="contain"
            />
          </View>
        ),

        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'StudyMaterial') iconName = 'book-outline';
          else if (route.name === 'Organization') iconName = 'people-outline';
          else if (route.name === 'Database') iconName = 'folder-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },


        headerShown: route.name !== 'Organization',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="StudyMaterial" component={StudyMaterialStack} />
      {/* Ab Organization ke andar stack navigator set kiya */}
      <Tab.Screen name="Organization" component={OrganizationStack} />
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
