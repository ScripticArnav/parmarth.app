import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import backendUrl from "../../backendUrl";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export default function ViewAttendanceScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState({
    volunteers: [],
    mentor: [],
    photos: [],
    summary: {},
  });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [showMentors, setShowMentors] = useState(false);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      const [volunteerResponse, mentorResponse] = await Promise.all([
        fetch(`${backendUrl}/attendance/volunteer/${date}`),
        fetch(`${backendUrl}/attendance/mentor/${date}`)
      ]);

      const volunteerData = await volunteerResponse.json();
      const mentorData = await mentorResponse.json();

      const mentorList = mentorData.attendance?.mentor || [];
      const volunteerList = volunteerData.attendance?.volunteers || [];
      const photos = volunteerData.attendance?.photos || [];
      const classWise = volunteerData.attendance?.classWise || {};

      setAttendanceData({
        volunteers: volunteerList,
        mentor: mentorList,
        photos: photos,
        summary: {
          totalVolunteers: volunteerList.length,
          totalMentors: mentorList.length,
          totalStudents: volunteerData.attendance?.totalStudents || 0,
          classWise: classWise,
        },
      });
    } catch (error) {
      console.error("Error fetching attendance:", error.message);
      setAttendanceData({ volunteers: [], mentor: [], photos: [], summary: {} });
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="clipboard-check" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Attendance Records</Text>
        <Text style={styles.headerSubtitle}>View daily attendance details</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Date Header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>
            Attendance on <Text style={styles.highlight}>{selectedDate}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowCalendar(!showCalendar)}
            style={styles.editButton}
          >
            <LinearGradient
              colors={['#002855', '#003f88']}
              style={styles.editButtonGradient}
            >
              <Text style={styles.editButtonText}>
                {showCalendar ? "Close Calendar" : "Change Date"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Calendar Picker */}
        {showCalendar && (
          <View style={styles.calendarWrapper}>
            <Calendar
              style={styles.calendarStyle}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#002855" },
              }}
              theme={{
                todayTextColor: "#002855",
                selectedDayBackgroundColor: "#002855",
                arrowColor: "#002855",
              }}
            />
          </View>
        )}

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            {/* Summary Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconContainer}>
                    <FontAwesome5 name="users" size={24} color="#002855" />
                  </View>
                  <Text style={styles.summaryLabel}>Total Volunteers</Text>
                  <Text style={styles.summaryValue}>
                    {attendanceData.summary.totalVolunteers}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconContainer}>
                    <FontAwesome5 name="user-graduate" size={24} color="#002855" />
                  </View>
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
                        <View style={styles.classIconContainer}>
                          <FontAwesome5 name="chalkboard" size={20} color="#002855" />
                        </View>
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
              <LinearGradient
                colors={['#002855', '#003f88']}
                style={styles.toggleButtonGradient}
              >
                <Text style={styles.toggleButtonText}>
                  {showVolunteers ? "Hide Volunteers Info" : "Show Volunteers Info"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Volunteers List */}
            {showVolunteers && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Volunteers</Text>
                {attendanceData.volunteers.map((item, index) => (
                  <View key={index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardIconContainer}>
                        <FontAwesome5 name="user" size={20} color="#002855" />
                      </View>
                      <Text style={styles.name}>{item.volName}</Text>
                    </View>
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

            {/* Mentor Toggle */}
            <TouchableOpacity
              onPress={() => setShowMentors(!showMentors)}
              style={styles.toggleButton}
            >
              <LinearGradient
                colors={['#002855', '#003f88']}
                style={styles.toggleButtonGradient}
              >
                <Text style={styles.toggleButtonText}>
                  {showMentors ? "Hide Mentors Info" : "Show Mentors Info"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Mentors List */}
            {showMentors && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mentors</Text>
                {attendanceData.mentor && attendanceData.mentor.length > 0 ? (
                  attendanceData.mentor.map((item, index) => (
                    <View key={item._id || index} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={styles.cardIconContainer}>
                          <FontAwesome5 name="chalkboard-teacher" size={20} color="#002855" />
                        </View>
                        <Text style={styles.name}>{item.name}</Text>
                      </View>
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>
                          Roll No: {item.rollNo}
                        </Text>
                        <Text style={styles.detailText}>Branch: {item.branch}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No mentors present on this date.</Text>
                )}
              </View>
            )}

            {/* Photos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Class Photos</Text>
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
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateHeaderText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  highlight: {
    color: '#002855',
    fontWeight: 'bold',
  },
  editButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  editButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  calendarStyle: {
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 16,
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002855',
  },
  classWiseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  classCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  classIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002855',
    marginBottom: 4,
  },
  classCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  toggleButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  toggleButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002855',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#6c757d',
  },
  noDataText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
  },
});
