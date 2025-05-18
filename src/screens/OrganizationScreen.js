import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrganizationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('GoverningCouncil')}
      >
        <Text style={styles.cardText}>Governing Council</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AdvisoryCouncil')}
      >
        <Text style={styles.cardText}>Advisory Council</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ExecutiveCouncil')}
      >
        <Text style={styles.cardText}>Executive Council</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('LegacyCouncil')}
      >
        <Text style={styles.cardText}>Legacy Executive Council</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' },
  card: {
    width: '80%',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    elevation: 5,
  },
  cardText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});

export default OrganizationScreen;
