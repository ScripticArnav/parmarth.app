import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import backendUrl from "../../backendUrl";
import AuthContext from "../store/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const TotalAttendanceScreen = () => {
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('total'); // 'total' or 'monthly'
  const [activeCategory, setActiveCategory] = useState('volunteer'); // 'volunteer' or 'mentor'
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [error, setError] = useState(null);
  
  // Current date for default month selection
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const years = Array.from(
    { length: 5 }, 
    (_, i) => currentDate.getFullYear() - 2 + i
  );

  // ✅ Fetch data from backend API
  useEffect(() => {
    fetchData();
  }, [activeCategory]);
  
  // Fetch monthly data when month/year changes
  useEffect(() => {
    if (activeTab === 'monthly') {
      fetchMonthlyData();
    }
  }, [selectedMonth, selectedYear, activeTab, activeCategory]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeCategory === 'volunteer' ? 'volunteer' : 'mentor';
      const res = await fetch(`${backendUrl}/attendance/${endpoint}/total`, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const json = await res.json();
      setData(json.volunteers || json.mentors || []);
    } catch (err) {
      setError('Unable to load attendance data. Please try again later.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMonthlyData = async () => {
    setMonthlyLoading(true);
    setError(null);
    try {
      const endpoint = activeCategory === 'volunteer' ? 'volunteer' : 'mentor';
      // API endpoint for monthly data (adjust as needed)
      const res = await fetch(
        `${backendUrl}/attendance/${endpoint}/monthly?month=${selectedMonth + 1}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      );
      
      if (!res.ok) {
        throw new Error('Failed to fetch monthly data');
      }
      
      const json = await res.json();
      setMonthlyData(json.volunteers || json.mentors || []);
    } catch (err) {
      setError('Unable to load monthly attendance data. Please try again later.');
      setMonthlyData([]);
    } finally {
      setMonthlyLoading(false);
    }
  };

  // ✅ CSV Export
  const exportToCSV = async () => {
    try {
      const exportData = activeTab === 'total' ? data : monthlyData;
      const categoryText = activeCategory === 'volunteer' ? 'volunteers' : 'mentors';
      const fileName = activeTab === 'total' 
        ? `total_${categoryText}_attendance.csv` 
        : `${categoryText}_attendance_${months[selectedMonth]}_${selectedYear}.csv`;
      
      const header = "Name,Roll No,Branch,Total Attendance\n";
      const rows = exportData.map(
        (item) => `${item.volName || item.name},${item.rollNo || ''},${item.branch || ''},${item.count}`
      );
      const csv = header + rows.join("\n");

      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri);
    } catch (err) {
      setError('Failed to export data. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{activeCategory === 'volunteer' ? item.volName : item.name}</Text>
      <Text style={styles.cell}>{item.rollNo || ''}</Text>
      <Text style={styles.cell}>{item.branch || ''}</Text>
      <Text style={styles.cell}>{item.count}</Text>
    </View>
  );
  
  const renderMonthPicker = () => (
    <Modal
      visible={monthPickerVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setMonthPickerVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Month & Year</Text>
          
          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView style={styles.pickerScrollView}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerItem,
                      selectedMonth === index && styles.pickerItemSelected
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedMonth === index && styles.pickerItemTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Year</Text>
              <ScrollView style={styles.pickerScrollView}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      selectedYear === year && styles.pickerItemSelected
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedYear === year && styles.pickerItemTextSelected
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setMonthPickerVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                setMonthPickerVisible(false);
                fetchMonthlyData();
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => activeTab === 'total' ? fetchData() : fetchMonthlyData()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 'total') {
      if (loading) {
        return <ActivityIndicator size="large" color="#009688" />;
      }
      
      if (data.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No attendance records found
            </Text>
          </View>
        );
      }
      
      return (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      );
    } else {
      if (monthlyLoading) {
        return <ActivityIndicator size="large" color="#009688" />;
      }
      
      if (monthlyData.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No attendance records for {months[selectedMonth]} {selectedYear}
            </Text>
          </View>
        );
      }
      
      return (
        <FlatList
          data={monthlyData}
          keyExtractor={(item, index) => `monthly-${index}`}
          renderItem={renderItem}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="chart-bar" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Total Attendance</Text>
        <Text style={styles.headerSubtitle}>View attendance statistics</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'total' && styles.activeTab]}
            onPress={() => setActiveTab('total')}
          >
            <LinearGradient
              colors={activeTab === 'total' ? ['#002855', '#003f88'] : ['#f8f9fa', '#f8f9fa']}
              style={styles.tabGradient}
            >
              <Text style={[styles.tabText, activeTab === 'total' && styles.activeTabText]}>
                Total Attendance
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
            onPress={() => setActiveTab('monthly')}
          >
            <LinearGradient
              colors={activeTab === 'monthly' ? ['#002855', '#003f88'] : ['#f8f9fa', '#f8f9fa']}
              style={styles.tabGradient}
            >
              <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
                Monthly Attendance
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Category Toggle */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryButton, activeCategory === 'volunteer' && styles.activeCategoryButton]}
            onPress={() => setActiveCategory('volunteer')}
          >
            <LinearGradient
              colors={activeCategory === 'volunteer' ? ['#002855', '#003f88'] : ['#f8f9fa', '#f8f9fa']}
              style={styles.categoryGradient}
            >
              <FontAwesome5 name="users" size={16} color={activeCategory === 'volunteer' ? '#fff' : '#002855'} />
              <Text style={[styles.categoryText, activeCategory === 'volunteer' && styles.activeCategoryText]}>
                Volunteers
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.categoryButton, activeCategory === 'mentor' && styles.activeCategoryButton]}
            onPress={() => setActiveCategory('mentor')}
          >
            <LinearGradient
              colors={activeCategory === 'mentor' ? ['#002855', '#003f88'] : ['#f8f9fa', '#f8f9fa']}
              style={styles.categoryGradient}
            >
              <FontAwesome5 name="chalkboard-teacher" size={16} color={activeCategory === 'mentor' ? '#fff' : '#002855'} />
              <Text style={[styles.categoryText, activeCategory === 'mentor' && styles.activeCategoryText]}>
                Mentors
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Month Picker for Monthly View */}
        {activeTab === 'monthly' && (
          <TouchableOpacity
            style={styles.monthPickerButton}
            onPress={() => setMonthPickerVisible(true)}
          >
            <LinearGradient
              colors={['#002855', '#003f88']}
              style={styles.monthPickerGradient}
            >
              <FontAwesome5 name="calendar-alt" size={16} color="#fff" />
              <Text style={styles.monthPickerText}>
                {months[selectedMonth]} {selectedYear}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Export Button */}
        <TouchableOpacity
          style={styles.exportButton}
          onPress={exportToCSV}
        >
          <LinearGradient
            colors={['#002855', '#003f88']}
            style={styles.exportGradient}
          >
            <FontAwesome5 name="file-export" size={16} color="#fff" />
            <Text style={styles.exportText}>Export to CSV</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.listContainer}>
          {renderContent()}
        </View>
      </View>

      {/* Month Picker Modal */}
      {renderMonthPicker()}
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
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activeTab: {
    backgroundColor: '#002855',
  },
  tabGradient: {
    padding: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002855',
  },
  activeTabText: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activeCategoryButton: {
    backgroundColor: '#002855',
  },
  categoryGradient: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002855',
  },
  activeCategoryText: {
    color: '#fff',
  },
  monthPickerButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  monthPickerGradient: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  monthPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  exportButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  exportGradient: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 10,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002855',
    marginBottom: 10,
  },
  pickerScrollView: {
    maxHeight: 200,
  },
  pickerItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  pickerItemSelected: {
    backgroundColor: '#002855',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  pickerItemTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  confirmButton: {
    backgroundColor: '#002855',
  },
  cancelButtonText: {
    color: '#002855',
    textAlign: 'center',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#002855',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default TotalAttendanceScreen;
