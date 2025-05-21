import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import backendUrl from "../../backendUrl";
import AuthContext from "../store/AuthContext";

const TotalAttendanceScreen = () => {

  const authCtx = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data from backend API
  useEffect(() => {
    fetchData();
    console.log(data);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${backendUrl}/attendance/total`, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      }); // 👈 replace <your-ip>
      const json = await res.json();
      console.log(json);
      setData(json.volunteers || []); // backend se array milta hai
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CSV Export
  const exportToCSV = async () => {
    const header = "Name,Roll No,Branch,Total Attendance\n";
    const rows = data.map(
      (item) => `${item.volName},${item.rollNo},${item.branch},${item.count}`
    );
    const csv = header + rows.join("\n");

    const fileUri = FileSystem.documentDirectory + "total_attendance.csv";
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.volName}</Text>
      <Text style={styles.cell}>{item.rollNo}</Text>
      <Text style={styles.cell}>{item.branch}</Text>
      <Text style={styles.cell}>{item.count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteer Attendance Count</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.headerCell]}>Name</Text>
        <Text style={[styles.cell, styles.headerCell]}>Roll No</Text>
        <Text style={[styles.cell, styles.headerCell]}>Branch</Text>
        <Text style={[styles.cell, styles.headerCell]}>Count</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#009688" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
        <Text style={styles.exportButtonText}>Export as Excel (CSV)</Text>
      </TouchableOpacity>
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#D1D5DB",
    paddingVertical: 10,
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
});

export default TotalAttendanceScreen;
