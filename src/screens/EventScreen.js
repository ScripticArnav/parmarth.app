import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const events = [
  {
    name: 'उद्गम',
    description: 'The foundation day of Parmarth Club — a celebration of our vision, values, and the journey of creating positive change through social service and community empowerment.',
    icon: 'calendar-day'
  },
  {
    name: 'उम्मीद',
    description: 'An initiative dedicated to educating underprivileged children, especially those who beg at traffic signals, by engaging them in regular study sessions and guiding them toward a better future.',
    icon: 'graduation-cap'
  },
  {
    name: 'उन्नयन',
    description: 'A book and stationery distribution drive aimed at empowering children from disadvantaged backgrounds with the tools they need to pursue their education.',
    icon: 'book'
  },
  {
    name: 'उत्साह',
    description: 'An inter-NGO competition that brings together children from Parmarth and other NGOs, promoting talent, confidence, and healthy interaction through cultural and academic events.',
    icon: 'trophy'
  },
  {
    name: 'उत्सर्ग',
    description: 'A heartfelt farewell event for final-year volunteers of Parmarth, acknowledging their invaluable contributions and inspiring younger members to carry the legacy forward.',
    icon: 'handshake'
  },
  {
    name: 'मुस्कान',
    description: 'A clothing distribution campaign aimed at spreading joy and dignity among children and families in need — because every smile counts.',
    icon: 'smile'
  },
  {
    name: 'शैक्षणिक भ्रमण',
    description: 'Educational tours for Parmarth students to historical and cultural sites, designed to provide experiential learning beyond the classroom.',
    icon: 'map-marked-alt'
  },
  {
    name: 'रक्तदान महादान',
    description: 'A voluntary blood donation drive organized by Parmarth, fostering awareness and encouraging youth participation in life-saving acts of kindness.',
    icon: 'heartbeat'
  },
  {
    name: 'उत्सव आयोजन',
    description: 'A series of celebrations marking important national and thematic days like Diwali, Independence Day, Children\'s Day, Science Day, Yoga Day, and more — instilling cultural pride and community spirit among students.',
    icon: 'star'
  }
];

export default function EventScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="calendar-alt" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Events in Parmarth</Text>
        <Text style={styles.headerSubtitle}>Discover our impactful initiatives</Text>
      </LinearGradient>

      <View style={styles.content}>
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
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name={event.icon} size={24} color="#002855" />
              </View>
              <Text style={styles.eventName}>{event.name}</Text>
            </View>
            <Text style={styles.description}>{event.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    padding: 15,
    paddingTop: 25,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#002855',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
  },
});
