import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import backendUrl from '../../backendUrl';

const jnv = [
  { id: 1, ref: 'Sr. No. : 1', name: 'Shanti Gautam', school: 'Jawahar Navodaya Vidyalaya, Lucknow' },
];
const shrestha = [
  { id: 1, ref: "A.I.R. : 287", name: "Shivanshu Gautam", school: "Little Flower School, Varanasi" },
  { id: 2, ref: "A.I.R. : 400", name: "Abhilasha Bharti", school: "Little Flower School, Varanasi" },
  { id: 3, ref: "A.I.R. : 1290", name: "Swati Gautam", school: "Little Flower School, Varanasi" },
  { id: 4, ref: "A.I.R. : 1311", name: "Harsh Gautam", school: "Little Flower School, Varanasi" },
  { id: 5, ref: "A.I.R. : 1393", name: "Jeetika Bharti", school: "Little Flower School, Varanasi" },
  { id: 6, ref: "A.I.R. : 1573", name: "Sujeet Gautam", school: "Little Flower School, Varanasi" },
  { id: 7, ref: "A.I.R. : 2045", name: "Priyanka Bharti", school: "Little Flower School, Varanasi" },
  { id: 8, ref: "A.I.R. : 2398", name: "Gaurav Gautam", school: "Little Flower School, Varanasi" },
  { id: 9, ref: "A.I.R. : 2544", name: "Sonam Kannoujia", school: "Little Flower School, Varanasi" },
  { id: 10, ref: "A.I.R. : 2825", name: "Pooja Bharti", school: "Little Flower School, Varanasi" },
  { id: 11, ref: "A.I.R. : 3360", name: "Nisha Gautam", school: "Little Flower School, Varanasi" },
];

const AdvisoryTable = ({ members }) => (
  <View style={styles.section}>
    <View style={styles.studentListContainer}>
      {members.map((item, index) => (
        <View key={item.ref} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <FontAwesome5 name="user-graduate" size={16} color="#002855" />
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.nameHighlight}>{item.name}</Text>
              <Text style={styles.referenceNumber}>{item.ref}</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <FontAwesome5 name="school" size={14} color="#6c757d" />
              <Text style={styles.cardText}>{item.school}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.statusBadge}>
              <FontAwesome5 name="check-circle" size={12} color="#28a745" />
              <Text style={styles.statusText}>Admitted</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const AdmissionScreen = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getRteData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${backendUrl}/getRteData`);
        const data = await response.json();
        setAcademicYears([...new Set(data.map((item) => item.academicYear))]);
      } catch (err) {
        alert('Error fetching RTE data');
      } finally {
        setIsLoading(false);
      }
    };
    getRteData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('RTEYearDetails', { academicYear: item })}
      style={styles.yearCard}
    >
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.yearCardGradient}
      >
        <FontAwesome5 name="calendar-alt" size={24} color="#fff" />
        <Text style={styles.yearText}>{item} - Student Admitted</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="school" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Admissions Overview</Text>
        <Text style={styles.headerSubtitle}>Academic Year 2024-25</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="graduation-cap" size={24} color="#002855" />
            <Text style={styles.sectionTitle}>JNV Admission Data</Text>
          </View>
          <AdvisoryTable members={jnv} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="award" size={24} color="#002855" />
            <Text style={styles.sectionTitle}>SHRESTHA Admission Data</Text>
          </View>
          <AdvisoryTable members={shrestha} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="book-reader" size={24} color="#002855" />
            <Text style={styles.sectionTitle}>RTE Admission Data</Text>
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#002855" />
              <Text style={styles.loadingText}>Loading RTE data...</Text>
            </View>
          ) : academicYears.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="user-slash" size={40} color="#6c757d" />
              <Text style={styles.emptyText}>No RTE data available</Text>
            </View>
          ) : (
            <FlatList
              data={academicYears}
              keyExtractor={(item) => item.toString()}
              renderItem={renderItem}
              scrollEnabled={false}
              contentContainerStyle={styles.yearList}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    padding: 15,
    paddingTop: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002855',
  },
  studentListContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  studentInfo: {
    flex: 1,
  },
  nameHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 4,
  },
  referenceNumber: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  cardContent: {
    marginLeft: 52,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6c757d',
    flex: 1,
  },
  cardFooter: {
    marginLeft: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  yearCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  yearCardGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  yearText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  yearList: {
    paddingBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#002855',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default AdmissionScreen;
