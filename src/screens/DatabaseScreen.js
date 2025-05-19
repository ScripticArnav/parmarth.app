import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DatabaseScreen = () => {
  const navigation = useNavigation();

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const CustomButton = ({ title, screenName, bgColor }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={() => handleNavigation(screenName)}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Options</Text>
      <Text style={styles.subtitle}>Select a category to manage your data</Text>

      <View style={styles.buttonsWrapper}>
        <CustomButton title="View Attendance" screenName="ViewAttendanceScreen" bgColor="#4CAF50" />
        <CustomButton title="Students in Parmarth" screenName="StudentsScreen" bgColor="#2196F3" />
        <CustomButton title="Admission Data" screenName="AdmissionScreen" bgColor="#FF5722" />
        <CustomButton title="Events in Parmarth" screenName="EventsScreen" bgColor="#673AB7" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonsWrapper: {
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    marginVertical: 10,
    borderRadius: 14,
    elevation: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default DatabaseScreen;
