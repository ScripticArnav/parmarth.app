import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { Image } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import backendUrl from '../../backendUrl';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get("window");

// Add date formatting function
const formatUpdateTime = (dateString) => {
  try {
    // If no date is provided, return a default message
    if (!dateString) {
      return 'Recently added';
    }

    // First try parsing the date string
    let updateDate;
    if (typeof dateString === 'string') {
      updateDate = new Date(dateString);
    } else if (dateString && dateString.$date) {
      // Handle MongoDB date format
      updateDate = new Date(dateString.$date);
    } else {
      return 'Recently added';
    }

    // Check if date is valid
    if (isNaN(updateDate.getTime())) {
      return 'Recently added';
    }

    // Format the date in Indian format
    const day = updateDate.getDate();
    const month = updateDate.toLocaleString('en-IN', { month: 'short' });
    const year = updateDate.getFullYear();
    const hours = updateDate.getHours();
    const minutes = updateDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Recently added';
  }
};

// Counter Component with animation
const Counter = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: end,
      duration: duration,
      useNativeDriver: false,
    }).start();

    animatedValue.addListener(({ value }) => {
      setCount(Math.ceil(value));
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [end, duration]);

  return (
    <Animated.Text style={styles.statNumber}>
      {count}+
    </Animated.Text>
  );
};

// Data for impact stats
const impactData = [
  {
    title: "SLUM AREAS",
    count: 6,
    description: "Contribute through financial support and volunteer engagement.",
    icon: "home",
  },
  {
    title: "STUDENTS",
    count: 200,
    description: "Hundreds of students are studying in our club.",
    icon: "graduation-cap",
  },
  {
    title: "Families",
    count: 300,
    description: "Providing warm clothes to underprivileged families annually",
    icon: "users",
  },
  {
    title: "RTE ADMISSION",
    count: 400,
    description: "Students of parmarth have got admission in various private schools",
    icon: "school",
  },
];

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <FontAwesome5 name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveUpdates = async () => {
    try {
      const response = await fetch(`${backendUrl}/live-updates/`);
      const data = await response.json();
      if (response.ok) {
        setLiveUpdates(data.updates);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      // Silently handle error and set default update
      setLiveUpdates([{
        _id: 'default',
        text: 'Welcome to Parmarth! Stay tuned for updates.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add focus effect to refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchLiveUpdates();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Initial load
  useEffect(() => {
    fetchLiveUpdates();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Modern Header */}
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        {/* <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.title}>PARMARTH</Text>
        <Text style={styles.subtitle}>The Social Club of IET Lucknow</Text>
      </LinearGradient>

      {/* Blood Donation Box */}
      {/* <View style={styles.bannerBox}>
        <LinearGradient
          colors={['#ff4b4b', '#ff6b6b']}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>Blood Donation Drive</Text>
              <Text style={styles.bannerDate}>21 MAY</Text>
            </View>
            <FontAwesome5 name="heartbeat" size={32} color="#fff" />
          </View>
        </LinearGradient>
      </View> */}

      {/* Menu Options */}
      {/* <View style={styles.menuContainer}>
        <MenuItem icon="calendar" label="Events" />
        <MenuItem icon="handshake" label="Volunteer" />
        <MenuItem icon="images" label="Gallery" />
        <MenuItem icon="info-circle" label="About" />
      </View> */}

      {/* Live Updates */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <FontAwesome5 name="bell" size={20} color="#002855" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>LIVE UPDATES</Text>
          </View>
          <View style={styles.updateCount}>
            <Text style={styles.updateCountText}>{liveUpdates.length} Updates</Text>
          </View>
        </View>
        {!isLoading && liveUpdates.length > 0 ? (
          liveUpdates.map((update, index) => (
            <View key={update._id || index} style={styles.liveUpdateBox}>
              <View style={styles.updateContent}>
                <View style={styles.dot} />
                <Text style={styles.liveText}>{update.text}</Text>
              </View>
              <View style={styles.updateTime}>
                <FontAwesome5 name="clock" size={12} color="#666" />
                <Text style={styles.timeText}>{formatUpdateTime(update.createdAt)}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.liveUpdateBox}>
            <View style={styles.updateContent}>
              <View style={styles.dot} />
              <Text style={styles.liveText}>Welcome to Parmarth! Stay tuned for updates.</Text>
            </View>
          </View>
        )}
      </View>

      {/* Join Us Button */}
      <TouchableOpacity style={styles.joinButton}>
        <LinearGradient
          colors={['#002855', '#003f88']}
          style={styles.joinButtonGradient}
        >
          <Text style={styles.joinText}>Contact Us</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Featured Stories */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>FEATURED STORIES</Text>
        <View style={styles.featureRow}>
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <FontAwesome5 name="hand-holding-heart" size={32} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>500+</Text>
            <Text style={styles.featureDesc}>lives impacted</Text>
          </View>
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <FontAwesome5 name="seedling" size={32} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>1000+</Text>
            <Text style={styles.featureDesc}>trees planted</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Our Impact</Text>
        <View style={styles.statsContainer}>
          {impactData.map((item, index) => (
            <View key={item.title} style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name={item.icon} size={24} color="#002855" />
              </View>
              <Counter end={item.count} />
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={styles.statDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    opacity: 1.9,
    marginBottom: 20,
  },
  bannerBox: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerGradient: {
    padding: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  bannerDate: {
    fontSize: 18,
    color: "#fff",
    marginTop: 4,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  menuItem: {
    alignItems: "center",
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#002855",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#002855",
    letterSpacing: 0.5,
  },
  updateCount: {
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  updateCountText: {
    fontSize: 13,
    color: '#002855',
    fontWeight: '600',
  },
  liveUpdateBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  updateContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  liveText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  updateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  joinButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  joinButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  joinText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  featureBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#002855",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002855",
  },
  featureDesc: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#002855",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#002855",
  },
  statTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002855",
    marginTop: 8,
  },
  statDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    lineHeight: 18,
  },
});

export default HomeScreen;