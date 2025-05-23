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
      <Text style={styles.title}>Attendance</Text>
      
      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'volunteer' && styles.activeCategoryButton]}
          onPress={() => setActiveCategory('volunteer')}
        >
          <Text style={[styles.categoryText, activeCategory === 'volunteer' && styles.activeCategoryText]}>
            Volunteers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'mentor' && styles.activeCategoryButton]}
          onPress={() => setActiveCategory('mentor')}
        >
          <Text style={[styles.categoryText, activeCategory === 'mentor' && styles.activeCategoryText]}>
            Mentors
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'total' && styles.activeTab]}
          onPress={() => setActiveTab('total')}
        >
          <Text style={[styles.tabText, activeTab === 'total' && styles.activeTabText]}>
            Total
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => setActiveTab('monthly')}
        >
          <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Month selector for monthly tab */}
      {activeTab === 'monthly' && (
        <TouchableOpacity 
          style={styles.monthSelector}
          onPress={() => setMonthPickerVisible(true)}
        >
          <Text style={styles.monthSelectorText}>
            {months[selectedMonth]} {selectedYear} ▼
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.headerCell]}>Name</Text>
        <Text style={[styles.cell, styles.headerCell]}>Roll No</Text>
        <Text style={[styles.cell, styles.headerCell]}>Branch</Text>
        <Text style={[styles.cell, styles.headerCell]}>
          {activeTab === 'total' ? 'Total' : 'Days'}
        </Text>
      </View>

      {renderContent()}

      <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
        <Text style={styles.exportButtonText}>
          Export {activeCategory === 'volunteer' ? 'Volunteers' : 'Mentors'} {activeTab === 'total' ? 'Total' : 'Monthly'} as CSV
        </Text>
      </TouchableOpacity>
      
      {renderMonthPicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  activeCategoryButton: {
    backgroundColor: "#3B82F6",
  },
  categoryText: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  activeCategoryText: {
    color: "white",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  activeTab: {
    backgroundColor: "#009688",
  },
  tabText: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  activeTabText: {
    color: "white",
  },
  monthSelector: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  monthSelectorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B5563",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#D1D5DB",
    paddingVertical: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 12,
  },
  exportButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#009688",
    borderRadius: 10,
    alignItems: "center",
  },
  exportButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#6B7280",
    textAlign: "center",
  },
  errorContainer: {
    padding: 32,
    alignItems: "center",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#1F2937",
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
    color: "#4B5563",
  },
  pickerScrollView: {
    height: 160,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
  pickerItem: {
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pickerItemSelected: {
    backgroundColor: "#E6F7F5",
  },
  pickerItemText: {
    color: "#4B5563",
  },
  pickerItemTextSelected: {
    fontWeight: "bold",
    color: "#009688",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#4B5563",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#009688",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  }
});

export default TotalAttendanceScreen;
