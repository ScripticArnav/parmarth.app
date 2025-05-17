
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator.js';
import { AuthContextProvider } from './src/store/AuthContext';
import Toast from 'react-native-toast-message';
import DrawerNavigator from './src/navigation/DrawerNavigator.js';
import FooterComponent from './src/components/FooterComponent';


export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <DrawerNavigator />
        
      </NavigationContainer>
      <Toast />

    </AuthContextProvider>
    
  );
}




