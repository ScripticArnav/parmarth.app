import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import backendUrl from "../../backendUrl"; // make sure path is correct
import { ScrollView } from "react-native-gesture-handler";

export default function ViewAttendanceScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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

      setAttendanceList(data.attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error.message);
      setAttendanceList([]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
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

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : attendanceList.length === 0 ? (
        <View style={styles.centerMessageWrapper}>
          <Text style={styles.noDataText}>It was a Holiday...</Text>
        </View>
      ) : (
        <FlatList
          data={attendanceList}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.volName}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>Roll No: {item.rollNo}</Text>
                <Text style={styles.detailText}>Branch: {item.branch}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

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
   card: {
    backgroundColor: "#e6f0ff",  // Light pastel blue
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 15,
    color: "#555",
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
  centerMessageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#34495e",
  },
});
