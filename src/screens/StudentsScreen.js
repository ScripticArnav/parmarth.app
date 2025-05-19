import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { useDrawerStatus } from '@react-navigation/drawer';

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
    </TouchableOpacity>
  );

  const renderStudentCard = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.cardText}>{item['Name'].toUpperCase()}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardSubText}>Father's Name - {item["Father's Name"]}</Text>
        <Text style={styles.cardSubText}>{item["Place"]}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Students in Group: <Text style={styles.highlight}>{selectedGroup}</Text>
      </Text>

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
        <Text style={styles.noStudentsText}>No students in this group.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item, index) => item['Name'] + index}
          renderItem={renderStudentCard}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
  },
  highlight: {
    color: '#4CAF50',
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
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 40,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  groupButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  groupText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
  groupTextSelected: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#f5fff5',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 14,
    color: '#555',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noStudentsText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
});

export default StudentsScreen;
