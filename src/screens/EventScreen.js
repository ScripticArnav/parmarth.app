import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const classes = [
  'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', 
  '9th', '10th', '11th', '12th', 'JEE', 'NEET'
];

export default function StudyMaterialScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Study Material</Text>
      {classes.map((item) => (
        <TouchableOpacity 
          key={item}
          style={styles.button} 
          onPress={() => navigation.navigate('Class' + item)}
        >
          <Text style={styles.buttonText}>{item} Class</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
