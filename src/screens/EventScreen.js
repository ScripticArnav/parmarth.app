import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const events = [
  { name: 'उद्यम', description: 'रोज़गार सृजन की पहल' },
  { name: 'उम्मीद', description: 'अनाथ बच्चों की सहायता' },
  { name: 'उत्तरायण', description: 'कंबल वितरण अभियान' },
  { name: 'उत्साह', description: 'विद्यालयी प्रतियोगिता' },
  { name: 'उत्सर्ग', description: 'सेवा भाव का परिचय' },
  { name: 'मुस्कान', description: 'बच्चों के चेहरे पर मुस्कान लाना' },
  { name: 'शैक्षिक भ्रमण', description: 'शैक्षिक संस्थानों का दौरा' },
  { name: 'रक्तदान महादान', description: 'स्वैच्छिक रक्तदान शिविर' },
  { name: 'उत्सव आयोजन', description: 'वार्षिक सांस्कृतिक कार्यक्रम' },
];

export default function EventScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Events</Text>
      {events.map((event, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate('EventDetails', { eventName: event.name, eventDescription: event.description })}
        >
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.description}>{event.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefefe',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#e0f7fa',
    padding: 14,
    marginVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#00796b',
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00796b',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
});
