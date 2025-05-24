import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

// Counter Component
const Counter = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <Text style={styles.statNumber}>{count}+</Text>;
};

// Dummy navigation actions
const navigateTo = (screenName) => {
  Alert.alert(`Navigation`, `Navigating to ${screenName} screen...`);
};

// Dummy live updates
const liveUpdates = [
  "New Cleanliness Drive on 25th May",
  "Blood Donation Drive on 21st May",
  "Workshop on Child Education held on 19th May",
];

// Impact Stats
const impactData = [
  {
    title: "SLUM AREAS",
    count: 6,
    description:
      "Contribute through financial\nsupport and volunteer engagement.",
  },
  {
    title: "STUDENTS",
    count: 200,
    description: "Hundreds of students\nare studying in our club.",
  },
  {
    title: "Families",
    count: 300,
    description: "Providing warm clothes to\nunderprivileged families annually",
  },
  {
    title: "RTE ADMISSION",
    count: 400,
    description:
      "Students of parmarth have got\nadmission in various private schools",
  },
];

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>PARMARTH</Text>
        <Text style={styles.subtitle}>The Social Club of IET Lucknow</Text>
      </LinearGradient>

      {/* Blood Donation Box */}
      <View style={styles.bannerBox}>
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
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigateTo("Events")}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Feather name="calendar" size={24} color="#fff" />
            </View>
            <Text style={styles.menuLabel}>Events</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Volunteer")}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <FontAwesome5 name="handshake" size={24} color="#fff" />
            </View>
            <Text style={styles.menuLabel}>Volunteer</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Gallery")}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Feather name="image" size={24} color="#fff" />
            </View>
            <Text style={styles.menuLabel}>Gallery</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("About")}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Feather name="info" size={24} color="#fff" />
            </View>
            <Text style={styles.menuLabel}>About</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Live Updates */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>LIVE UPDATES</Text>
        {liveUpdates.map((update, index) => (
          <View key={index} style={styles.liveUpdateBox}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>{update}</Text>
          </View>
        ))}
      </View>

      {/* Join Us Button */}
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => navigateTo("Join Us")}
      >
        <LinearGradient
          colors={['#002855', '#003f88']}
          style={styles.joinButtonGradient}
        >
          <Text style={styles.joinText}>Join Us</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#002855",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 12,
    color: "#2c3e50",
    textAlign: "center",
  },
  sectionContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002855",
    marginBottom: 16,
  },
  liveUpdateBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    marginRight: 12,
  },
  liveText: {
    fontSize: 14,
    color: "#2c3e50",
    flex: 1,
  },
  joinButton: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#002855",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002855",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: "#6c757d",
  },
  statsSection: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 18,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002855",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#002855",
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 12,
    color: "#6c757d",
    lineHeight: 16,
  },
});

export default HomeScreen;
