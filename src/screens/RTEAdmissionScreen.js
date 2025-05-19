import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import backendUrl from '../../backendUrl';

const jnv = [
  { id: 1, ref: '1', name: 'Shanti Gautam', school: 'Jawahar Navodaya Vidyalaya, Lucknow' },
];
const shrestha = [
  { id: 1, ref: "287", name: "Shivanshu Gautam", school: "Little Flower School, Varanasi" },
  { id: 2, ref: "400", name: "Abhilasha Bharti", school: "Little Flower School, Varanasi" },
  { id: 3, ref: "1290", name: "Swati Gautam", school: "Little Flower School, Varanasi" },
  { id: 4, ref: "1311", name: "Harsh Gautam", school: "Little Flower School, Varanasi" },
  { id: 5, ref: "1393", name: "Jeetika Bharti", school: "Little Flower School, Varanasi" },
  { id: 6, ref: "1573", name: "Sujeet Gautam", school: "Little Flower School, Varanasi" },
  { id: 7, ref: "2045", name: "Priyanka Bharti", school: "Little Flower School, Varanasi" },
  { id: 8, ref: "2398", name: "Gaurav Gautam", school: "Little Flower School, Varanasi" },
  { id: 9, ref: "2544", name: "Sonam Kannoujia", school: "Little Flower School, Varanasi" },
  { id: 10, ref: "2825", name: "Pooja Bharti", school: "Little Flower School, Varanasi" },
  { id: 11, ref: "3360", name: "Nisha Gautam", school: "Little Flower School, Varanasi" },
];

const AdvisoryTable = ({ title, members }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {members.map((item) => (
      <Card key={item.ref} style={styles.card}>
        <Text style={styles.cardText}>
          <Text style={styles.nameHighlight}>{item.name}</Text> - {item.school}
        </Text>
      </Card>
    ))}
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
    <TouchableOpacity onPress={() => navigation.navigate('RTEYearDetails', { academicYear: item })}>
      <Card style={styles.yearCard} elevation={4}>
        <Text style={styles.yearText}>{item} - Student Admitted</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={academicYears}
      keyExtractor={(item) => item.toString()}
      renderItem={renderItem}
      ListHeaderComponent={
        <View>
          <Text style={styles.mainTitle}>Admissions Overview</Text>

          <Text style={styles.title}>JNV Admission Data</Text>
          <AdvisoryTable title="" members={jnv} />

          <Text style={styles.title}>SHRESTHA Admission Data</Text>
          <AdvisoryTable title="" members={shrestha} />

          <Text style={styles.title}>RTE Admission Data</Text>
          {isLoading && <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 10 }} />}
          {!isLoading && academicYears.length === 0 && (
            <Text style={styles.noData}>No RTE data available.</Text>
          )}
        </View>
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e9f0ff',
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f3c88',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#34495e',
    borderBottomWidth: 2,
    borderBottomColor: '#4a90e2',
    paddingBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#34495e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  nameHighlight: {
    fontWeight: '700',
    color: '#1f3c88',
  },
  yearCard: {
    backgroundColor: '#4a90e2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 6,
    elevation: 6,
    shadowColor: '#1f3c88',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  yearText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  noData: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AdmissionScreen;
