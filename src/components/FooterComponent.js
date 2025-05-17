// src/components/FooterComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FooterComponent() {
  return (
    <View style={styles.footer}>
      <Text>My Footer Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
