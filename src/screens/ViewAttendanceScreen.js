import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import backendUrl from "../../backendUrl";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

export default function ViewAttendanceScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState({
    volunteers: [],
    photos: [],
    summary: {},
  });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVolunteers, setShowVolunteers] = useState(false);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/attendance/${date}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch attendance");
      }

      setAttendanceData({
        volunteers: data.attendance?.volunteers || [],
        photos: data.attendance?.photos || [],
        summary: {
          totalVolunteers: data.attendance?.volunteers?.length || 0,
          totalStudents: data.attendance?.totalStudents || 0,
          classWise: data.attendance?.classWise || {},
        },
      });
    } catch (error) {
      console.error("Error fetching attendance:", error.message);
      setAttendanceData({ volunteers: [], photos: [], summary: {} });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderText}>
          Attendance on <Text style={styles.highlight}>{selectedDate}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowCalendar(!showCalendar)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {showCalendar ? "Close Calendar" : "Change Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Picker */}
      {showCalendar && (
        <View style={styles.calendarWrapper}>
          <ScrollView
            style={styles.calendarScroll}
            contentContainerStyle={{ flexGrow: 1 }}
            nestedScrollEnabled={true}
          >
            <Calendar
              style={styles.calendarStyle}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#00adf5" },
              }}
              theme={{
                todayTextColor: "#00adf5",
                selectedDayBackgroundColor: "#00adf5",
                arrowColor: "#00adf5",
              }}
            />
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          {/* Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Summary</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Volunteers</Text>
                <Text style={styles.summaryValue}>
                  {attendanceData.summary.totalVolunteers}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Students</Text>
                <Text style={styles.summaryValue}>
                  {attendanceData.summary.totalStudents}
                </Text>
              </View>
            </View>

            {/* Class Wise */}
            {attendanceData.summary.classWise && (
              <View style={styles.classWiseContainer}>
                {Object.entries(attendanceData.summary.classWise).map(
                  ([className, count]) => (
                    <View key={className} style={styles.classCard}>
                      <Text style={styles.className}>{className}</Text>
                      <Text style={styles.classCount}>{count} students</Text>
                    </View>
                  )
                )}
              </View>
            )}
          </View>

          {/* Volunteer Toggle */}
          <TouchableOpacity
            onPress={() => setShowVolunteers(!showVolunteers)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {showVolunteers ? "Hide Volunteers Info" : "Show Volunteers Info"}
            </Text>
          </TouchableOpacity>

          {/* Volunteers List */}
          {showVolunteers && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🙋 Volunteers</Text>
              {attendanceData.volunteers.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.name}>{item.volName}</Text>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailText}>
                      Roll No: {item.rollNo}
                    </Text>
                    <Text style={styles.detailText}>Branch: {item.branch}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Class Photos</Text>
            {attendanceData.photos.length === 0 ? (
              <Text style={styles.noDataText}>No photos uploaded.</Text>
            ) : (
              attendanceData.photos.map((photoUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: photoUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  dateHeader: {
    marginTop: 20,
    marginBottom: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
  },
  highlight: {
    color: "#4a90e2",
    fontWeight: "700",
  },
  editButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 12,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#34495e",
  },
  calendarWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 4,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    maxHeight: 280,
    width: 320,
    alignSelf: "center",
  },
  calendarScroll: {
    flexGrow: 0,
  },
  calendarStyle: {
    borderRadius: 10,
  },
  section: {
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2c3e50",
  },
  toggleButton: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#eaf2ff",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 15,
    color: "#555",
  },

  image: {
    width: width - 32,
    height: height * 0.6,
    resizeMode: "contain",
    borderRadius: 16,
    marginVertical: 12,
    alignSelf: "center",
  },

  noDataText: {
    fontSize: 16,
    color: "#7f8c8d",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 12,
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  summaryItem: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    width: "45%",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#2c3e50",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34495e",
  },
  classWiseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  classCard: {
    width: "48%",
    backgroundColor: "#ecf5ff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  classCount: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
