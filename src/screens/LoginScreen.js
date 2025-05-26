import React, { useState, useEffect } from "react";
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
    padding: width * 0.05,
    paddingTop: width * 0.1,
    alignItems: "center",
    borderBottomLeftRadius: width * 0.075,
    borderBottomRightRadius: width * 0.075,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: width * 0.03,
  },
  title: {
    fontSize: width * 0.175,
    fontWeight: "bold",
    color: "#fff",
    marginTop: width * 0.02,
  },
  subtitle: {
    fontSize: width * 0.05,
    color: "#fff",
    opacity: 1.9,
    marginBottom: width * 0.05,
  },
  bannerBox: {
    margin: width * 0.04,
    borderRadius: width * 0.04,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerGradient: {
    padding: width * 0.05,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: width * 0.055,
    color: "#fff",
    fontWeight: "bold",
  },
  bannerDate: {
    fontSize: width * 0.045,
    color: "#fff",
    marginTop: width * 0.01,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: width * 0.05,
    backgroundColor: "#fff",
    marginHorizontal: width * 0.04,
    borderRadius: width * 0.04,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  menuItem: {
    alignItems: "center",
    width: width * 0.2,
  },
  menuIconContainer: {
    width: width * 0.125,
    height: width * 0.125,
    borderRadius: width * 0.0625,
    backgroundColor: "#002855",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: width * 0.02,
  },
  menuLabel: {
    fontSize: width * 0.03,
    color: "#333",
    fontWeight: "500",
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: width * 0.06,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: width * 0.05,
    marginHorizontal: width * 0.04,
    paddingVertical: width * 0.05,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: width * 0.04,
  },
  liveUpdateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: width * 0.03,
  },
  dot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: '#002855',
    marginRight: width * 0.02,
  },
  liveText: {
    fontSize: width * 0.035,
    color: '#333',
    flex: 1,
  },
  joinButton: {
    marginHorizontal: width * 0.04,
    marginTop: width * 0.06,
    borderRadius: width * 0.05,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  joinButtonGradient: {
    paddingVertical: width * 0.04,
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: width * 0.04,
  },
  featureBox: {
    width: width * 0.4,
    backgroundColor: '#f8f9fa',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: '#002855',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: width * 0.02,
  },
  featureTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#002855',
  },
  featureDesc: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: width * 0.01,
  },
  statsSection: {
    marginTop: width * 0.06,
    paddingHorizontal: width * 0.04,
    paddingBottom: width * 0.06,
  },
  statsTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: width * 0.04,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: width * 0.43,
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: width * 0.04,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statIconContainer: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: width * 0.02,
  },
  statNumber: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: width * 0.01,
  },
  statTitle: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#333',
    marginBottom: width * 0.01,
  },
  statDescription: {
    fontSize: width * 0.03,
    color: '#666',
    lineHeight: width * 0.04,
  },
});

export default HomeScreen;
