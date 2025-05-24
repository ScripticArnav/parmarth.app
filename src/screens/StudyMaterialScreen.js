import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function StudyMaterialScreen({ navigation }) {
  const classes = ['GE', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const exams = ['JEE', 'NEET'];

  const renderButton = (title, type) => (
    <TouchableOpacity
      key={title}
      style={styles.buttonContainer}
      onPress={() => navigation.navigate('MaterialDetails', { class: title })}
    >
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.buttonContent}>
          <FontAwesome5 
            name={type === 'exam' ? 'graduation-cap' : 'book'} 
            size={24} 
            color="#fff" 
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="book-reader" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Study Material</Text>
        <Text style={styles.headerSubtitle}>Access learning resources for all classes</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classes GE to 12th</Text>
          <View style={styles.grid}>
            {classes.map((cls) => renderButton(`Class ${cls}`))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competitive Exams</Text>
          <View style={styles.grid}>
            {exams.map((exam) => renderButton(exam, 'exam'))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const buttonWidth = (width - 60) / 2;

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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: buttonWidth,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});