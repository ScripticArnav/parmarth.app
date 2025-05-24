import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <FontAwesome5 name="user-graduate" size={20} color="#002855" />
        </View>
        <Text style={styles.serialNumber}>{item.studentName}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <FontAwesome5 name="graduation-cap" size={14} color="#6c757d" />
          <Text style={styles.info}>
            <Text style={styles.label}>Class:</Text> {item.classStudying}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5 name="school" size={14} color="#6c757d" />
          <Text style={styles.info}>
            <Text style={styles.label}>School:</Text> {item.school}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="school" size={40} color="#fff" />
        <Text style={styles.headerTitle}>RTE Admissions {academicYear}</Text>
        <Text style={styles.headerSubtitle}>Total Entries: {students.length}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#002855" />
            <Text style={styles.loadingText}>Loading students...</Text>
          </View>
        ) : students.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="user-slash" size={40} color="#6c757d" />
            <Text style={styles.emptyText}>No students found for this year</Text>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item._id}
            renderItem={renderStudent}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serialNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
  },
  cardContent: {
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  info: {
    fontSize: 14,
    color: '#6c757d',
  },
  label: {
    fontWeight: '600',
    color: '#2c3e50',
  },
});

export default RTEYearScreen;