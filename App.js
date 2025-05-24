import 'react-native-gesture-handler';
import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator.js';
import { AuthContextProvider, setNavigationRef } from './src/store/AuthContext';
import Toast from 'react-native-toast-message';
import DrawerNavigator from './src/navigation/DrawerNavigator.js';
import { View, Text } from 'react-native';

const toastConfig = {
  error: (props) => (
    <View style={{
      backgroundColor: '#8A2BE2',
      padding: 15,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 10,
    }}>
      <Text style={{
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
      }}>
        {props.text1}
      </Text>
    </View>
  ),
  success: (props) => (
    <View style={{
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 10,
    }}>
      <Text style={{
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
      }}>
        {props.text1}
      </Text>
    </View>
  )
};

export default function App() {
  const navigationRef = useRef(null);

  return (
    <AuthContextProvider>
      <NavigationContainer ref={(ref) => {
        navigationRef.current = ref;
        setNavigationRef(ref);
      }}>
        <DrawerNavigator />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </AuthContextProvider>
  );
}




