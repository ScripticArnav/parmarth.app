import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

export default function StudyMaterialScreen({ navigation }) {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Study Material
      </Text>

      <Text style={{ fontSize: 18, marginVertical: 8 }}>Classes KG to 12th:</Text>
      {['KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((cls) => (
        <Button
          key={cls}
          title={`Class ${cls}`}
          onPress={() => navigation.navigate('MaterialDetails', { class: cls })}
        />
      ))}

      <Text style={{ fontSize: 18, marginVertical: 8 }}>Competitive Exams:</Text>
      {['JEE', 'NEET'].map((exam) => (
        <Button
          key={exam}
          title={exam}
          onPress={() => navigation.navigate('MaterialDetails', { class: exam })}
        />
      ))}
    </ScrollView>
  );
}
