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
  const [showCalendar, setShowCalendar] = useState(false); // calendar toggle

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
      <View style={styles.subHeading}>
        <Text style={styles.normalText}>Attendance on </Text>
        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
          <Text style={styles.dateText}>{selectedDate}</Text>
        </TouchableOpacity>
        <Text style={styles.normalText}> :</Text>
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
        <Text>Loading...</Text>
      ) : attendanceList.length === 0 ? (
        <View style={styles.centerMessageWrapper}>
          <Text>It was a Holiday...</Text>
        </View>
      ) : (
        <FlatList
          data={attendanceList}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.volName}</Text>
              <Text>Roll No: {item.rollNo}</Text>
              <Text>Branch: {item.branch}</Text>
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
  subHeading: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center", // THIS LINE MAKES ALIGNMENT PERFECT
    flexWrap: "wrap",
  },
  normalText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dateText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  calendarWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 4,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    maxHeight: 280,   // Height limit for the calendar container
    width: 320,       // Width limit (adjust as needed)
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
});
