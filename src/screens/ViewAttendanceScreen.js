import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const sampleAttendance = {
  "2025-05-18": [
    { id: "1", name: "Arnav Saxena", rollNo: "EC202101", branch: "ECE" },
    { id: "2", name: "Anshika Verma", rollNo: "EC202102", branch: "ECE" },
  ],
  "2025-05-17": [
    { id: "1", name: "Arnav Saxena", rollNo: "EC202101", branch: "ECE" },
  ],
};

export default function ViewAttendanceScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const attendanceList = sampleAttendance[selectedDate] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.subHeading}>Attendance on {selectedDate}:</Text>
      <FlatList
        data={attendanceList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Roll No: {item.rollNo}</Text>
            <Text>Branch: {item.branch}</Text>
          </View>
        )}
      />

      <Text style={styles.title}>Select Date:</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#00adf5" },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subHeading: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
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
});
