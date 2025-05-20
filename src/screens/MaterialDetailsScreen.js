import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import backendUrl from '../../backendUrl'; // ✅ Adjust as needed

export default function MaterialDetailsScreen({ route }) {
  const { class: className } = route.params;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjects = [
    'Hindi',
    'English',
    'Math',
    'Science',
    'Social Science',
    'GK',
    'Computer',
  ];

  const subjectIcons = {
    Hindi: '📝',
    English: '📘',
    Math: '➗',
    Science: '🧪',
    'Social Science': '🌍',
    GK: '🎯',
    Computer: '💻',
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/materials/by-class/${encodeURIComponent(className)}`
        );
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [className]);

  const getMaterialsForSubject = (subject) => {
    return materials.filter(
      (m) => m.subject.toLowerCase() === subject.toLowerCase()
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Study Material for {className}</Text>
      <Text style={styles.subtitle}>
        Yaha {className} ke sabhi subject ke notes, videos, PDFs milenge.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6a1b9a" />
      ) : (
        subjects.map((subject) => {
          const subjectMaterials = getMaterialsForSubject(subject);
          if (subjectMaterials.length === 0) return null;

          return (
            <View key={subject} style={styles.subjectSection}>
              <Text style={styles.subjectHeading}>
                {subjectIcons[subject] || ''} {subject}
              </Text>

              {subjectMaterials.map((material, idx) => (
                <View key={idx} style={styles.materialCard}>
                  <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.materialTitle}>{material.title}</Text>
                      <Text style={styles.materialType}>
                        Type: {material.type.toUpperCase()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(material.fileUrl)}
                      style={styles.downloadButton}
                    >
                      <Text style={styles.downloadLink}>📥 Open</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  subjectSection: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  subjectHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6a1b9a',
    marginBottom: 10,
    borderBottomWidth: 1.2,
    borderColor: '#e0e0e0',
    paddingBottom: 6,
  },
  // materialCard: {
  //   backgroundColor: '#f3f0f9',
  //   padding: 14,
  //   marginBottom: 10,
  //   borderRadius: 10,
  //   borderLeftWidth: 5,
  //   borderLeftColor: '#6a1b9a',
  // },
  materialCard: {
    backgroundColor: '#f3f0f9',
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#6a1b9a',
  },
  // materialTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   marginBottom: 4,
  //   color: '#333',
  // },
  materialTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  materialType: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#777',
  },
  downloadButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#8e44ad',
    borderRadius: 6,
  },

  downloadLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
