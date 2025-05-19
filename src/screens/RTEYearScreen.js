import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import backendUrl from '../../backendUrl';

const RTEYearScreen = () => {
  const route = useRoute();
  const { academicYear } = route.params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/getRteData/${academicYear}`);
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        alert('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [academicYear]);

  const renderStudent = ({ item, index }) => (
    <Card style={styles.card} elevation={5}>
      <View style={styles.cardContent}>
        <Text style={styles.serialNumber}>{index + 1}</Text>
        <View style={styles.details}>
          <Text style={styles.name}>{item.studentName}</Text>
          <Text style={styles.info}><Text style={styles.label}>Class:</Text> {item.classStudying}</Text>
          <Text style={styles.info}><Text style={styles.label}>School:</Text> {item.school}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RTE Admissions in {academicYear}</Text>
      <Text style={styles.total}>Total Entries: {students.length}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : students.length === 0 ? (
        <Text style={styles.noData}>No students found for this year</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          renderItem={renderStudent}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#2c3e50',
    textAlign: 'center',
  },
  total: {
    fontSize: 16,
    marginBottom: 14,
    color: '#34495e',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#34495e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serialNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2',
    width: 40,
    textAlign: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  info: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  label: {
    fontWeight: '600',
    color: '#34495e',
  },
  noData: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 40,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default RTEYearScreen;
