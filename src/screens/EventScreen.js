import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const events = [
  {
    name: 'उद्गम',
    description: 'The foundation day of Parmarth Club — a celebration of our vision, values, and the journey of creating positive change through social service and community empowerment.'
  },
  {
    name: 'उम्मीद',
    description: 'An initiative dedicated to educating underprivileged children, especially those who beg at traffic signals, by engaging them in regular study sessions and guiding them toward a better future.'
  },
  {
    name: 'उन्नयन',
    description: 'A book and stationery distribution drive aimed at empowering children from disadvantaged backgrounds with the tools they need to pursue their education.'
  },
  {
    name: 'उत्साह',
    description: 'An inter-NGO competition that brings together children from Parmarth and other NGOs, promoting talent, confidence, and healthy interaction through cultural and academic events.'
  },
  {
    name: 'उत्सर्ग',
    description: 'A heartfelt farewell event for final-year volunteers of Parmarth, acknowledging their invaluable contributions and inspiring younger members to carry the legacy forward.'
  },
  {
    name: 'मुस्कान',
    description: 'A clothing distribution campaign aimed at spreading joy and dignity among children and families in need — because every smile counts.'
  },
  {
    name: 'शैक्षणिक भ्रमण',
    description: 'Educational tours for Parmarth students to historical and cultural sites, designed to provide experiential learning beyond the classroom.'
  },
  {
    name: 'रक्तदान महादान',
    description: 'A voluntary blood donation drive organized by Parmarth, fostering awareness and encouraging youth participation in life-saving acts of kindness.'
  },
  {
    name: 'उत्सव आयोजन',
    description: 'A series of celebrations marking important national and thematic days like Diwali, Independence Day, Children’s Day, Science Day, Yoga Day, and more — instilling cultural pride and community spirit among students.'
  }
];

export default function EventScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🌟 Events in Parmarth 🌟</Text>
      {events.map((event, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() =>
            navigation.navigate('EventDetails', {
              eventName: event.name,
              eventDescription: event.description,
            })
          }
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
    backgroundColor: '#f2f9f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#004d40',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 10,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#00695c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00695c',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
});
