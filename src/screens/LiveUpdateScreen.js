import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backendUrl from '../../backendUrl';
import { LinearGradient } from 'expo-linear-gradient';

const LiveUpdateScreen = () => {
  const [updateText, setUpdateText] = useState('');
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/live-updates/`);
      if (!response.ok) {
        throw new Error('Server error');
      }
      const data = await response.json();
      setUpdates(data.updates || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
      setError('Unable to load updates. Please try again later.');
      setUpdates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!updateText.trim()) {
      Alert.alert('Error', 'Please enter an update');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/live-updates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          update: updateText,
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Failed to add update: ${response.status}`);
      }

      const data = await response.json();
      setUpdateText('');
      await fetchUpdates();
      Alert.alert('Success', 'Update added successfully');
    } catch (error) {
      console.error('Error adding update:', error);
      setError('Unable to add update. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUpdate = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/live-updates/${id}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete update');
      }

      await fetchUpdates();
      Alert.alert('Success', 'Update deleted successfully');
    } catch (error) {
      console.error('Error deleting update:', error);
      setError('Unable to delete update. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && updates.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#002855" />
        <Text style={styles.loadingText}>Loading updates...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="bell" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Live Updates</Text>
        <Text style={styles.headerSubtitle}>Stay updated with Parmarth's activities</Text>
      </LinearGradient>

      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUpdates}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new update..."
              value={updateText}
              onChangeText={setUpdateText}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
              onPress={handleAddUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <FontAwesome5 name="plus" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.updatesContainer}>
            {updates.length > 0 ? (
              updates.map((update, index) => (
                <View key={update._id || index} style={styles.updateItem}>
                  <View style={styles.updateContent}>
                    <View style={styles.dot} />
                    <Text style={styles.updateText}>{update.text}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteUpdate(update._id)}
                    disabled={isLoading}
                  >
                    <FontAwesome5 name="trash" size={16} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No updates available</Text>
              </View>
            )}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#002855',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#002855',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  addButtonDisabled: {
    backgroundColor: '#666',
  },
  updatesContainer: {
    marginTop: 10,
  },
  updateItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  updateContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    marginRight: 12,
  },
  updateText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default LiveUpdateScreen; 