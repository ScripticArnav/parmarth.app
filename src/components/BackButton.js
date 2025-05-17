// src/components/BackButton.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ navigation, color = "black" }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
      <Ionicons name="arrow-back" size={24} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;
