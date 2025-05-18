import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function StudyMaterialScreen({ navigation }) {
  const classes = ['GE', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const exams = ['JEE', 'NEET'];
  

  const renderButton = (title, type) => (
    <TouchableOpacity
      key={title}
      style={[styles.button, type === 'exam' && styles.examButton]}
      onPress={() => navigation.navigate('MaterialDetails', { class: title })}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} >
      <Text style={styles.header}>Study Material</Text>

      <Text style={styles.subHeader}>Classes GE to 12th:</Text>
      <View style={styles.grid}>
        {classes.map((cls) => renderButton(`Class ${cls}`))}
      </View>

      <Text style={styles.subHeader} >Competitive Exams:</Text>
      <View style={styles.grid}>
        {exams.map((exam) => renderButton(exam, 'exam'))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subHeader: {
    fontSize: 20,
    marginVertical: 10,
    color: '#555',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    margin: 6,
    borderRadius: 12,
    elevation: 4,
    minWidth: '40%',
    alignItems: 'center',
  },
  examButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
