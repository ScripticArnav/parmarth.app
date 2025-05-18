import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExecutiveCouncilScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Executive Council</Text>
      <Text style={styles.description}>
        Welcome to the Governing Council page. Details about the members and their roles will be displayed here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default ExecutiveCouncilScreen;
