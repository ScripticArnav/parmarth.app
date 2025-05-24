import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { useDrawerStatus } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const groups = ['GE', '0-', '0', '0+', '1', 'JNV', '2'];

const groupToFileMap = {
  '0-': require('../../data/0-.json'),
  '0': require('../../data/0.json'),
  '0+': require('../../data/0+.json'),
  '1': require('../../data/1.json'),
  '2': require('../../data/2.json'),
  'GE': require('../../data/ge.json'),
  'JNV': require('../../data/jnv.json'),
};

const StudentsScreen = ({ navigation }) => {
  const [selectedGroup, setSelectedGroup] = useState('GE');
  const [students, setStudents] = useState([]);
  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    const data = groupToFileMap[selectedGroup] || [];
    setStudents(data);

    // Disable drawer gesture when drawer is open
    navigation.setOptions({
      gestureEnabled: !isDrawerOpen,
    });
  }, [selectedGroup, isDrawerOpen]);

  const GroupButton = ({ group }) => (
    <TouchableOpacity
      style={[
        styles.groupButton,
        selectedGroup === group && styles.groupButtonSelected,
      ]}
      onPress={() => setSelectedGroup(group)}
    >
      <LinearGradient
        colors={selectedGroup === group ? ['#002855', '#003f88'] : ['#f8f9fa', '#f8f9fa']}
        style={styles.buttonGradient}
      >
        <Text
          style={[
            styles.groupText,
            selectedGroup === group && styles.groupTextSelected,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {group}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderStudentCard = ({ item }) => (
    <View style={styles.card}>
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <FontAwesome5 name="user-graduate" size={24} color="#002855" />
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.cardTitle}>{item['Name'].toUpperCase()}</Text>
            {/* <View style={styles.groupTagContainer}>
              <Text style={styles.groupTag}>{selectedGroup}</Text>
            </View> */}
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="user" size={16} color="#002855" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.label}>Father's Name</Text>
              <Text style={styles.cardSubText}>{item["Father's Name"]}</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="map-marker-alt" size={16} color="#002855" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.label}>Place</Text>
              <Text style={styles.cardSubText}>{item["Place"]}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="users" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Students Directory</Text>
        <Text style={styles.headerSubtitle}>View students by group</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonContainer}
          >
            {groups.map((group) => (
              <GroupButton key={group} group={group} />
            ))}
          </ScrollView>
        </View>

        {students.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="user-slash" size={40} color="#6c757d" />
            <Text style={styles.emptyText}>No students in this group</Text>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item, index) => item['Name'] + index}
            renderItem={renderStudentCard}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
          />
        )}
      </View>
    </View>
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
    flex: 1,
    padding: 15,
    paddingTop: 25,
  },
  scrollContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  groupButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buttonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 18,
  },
  groupTextSelected: {
    color: '#fff',
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e8f0fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#002855',
  },
  studentInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  groupTagContainer: {
    backgroundColor: '#002855',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  groupTag: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardContent: {
    gap: 14,
    marginLeft: 66,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f0fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#002855',
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cardSubText: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
    letterSpacing: 0.2,
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
  flatList: {
    flex: 1,
  },
});

export default StudentsScreen;
