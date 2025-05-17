// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
// import { Video } from 'expo-av';
// import { Feather } from '@expo/vector-icons';

// const screenWidth = Dimensions.get('window').width;

// const Counter = ({ end, duration = 2000 }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const increment = end / (duration / 16);
//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= end) {
//         setCount(end);
//         clearInterval(timer);
//       } else {
//         setCount(Math.ceil(start));
//       }
//     }, 16);

//     return () => clearInterval(timer);
//   }, [end, duration]);

//   return <Text style={styles.statNumber}>{count}+</Text>;
// };

// const HomeScreen = () => {
//   const videoRef = useRef(null);
//   const [muted, setMuted] = useState(true);

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.setIsMutedAsync(!muted);
//       setMuted(!muted);
//       videoRef.current.playAsync();
//     }
//   };

//   const impactData = [
//     { title: 'SLUM AREAS', count: 6, description: 'Contribute through financial\nsupport and volunteer engagement.' },
//     { title: 'STUDENTS', count: 200, description: 'Hundreds of students\nare studying in our club.' },
//     { title: 'Families', count: 300, description: 'Providing warm clothes to\nunderprivileged families annually' },
//     { title: 'RTE ADMISSION', count: 400, description: 'Students of parmarth have got\nadmission in various private schools' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.parmarth}>परमार्थ<Text style={{ color: '#277bc0' }}>.</Text></Text>
//         <Text style={styles.subTitle}>The Social Club of IET Lucknow</Text>
//       </View>

//       <View style={styles.aboutSection}>
//         <Text style={styles.title}>Parmarth</Text>
//         <Text style={styles.subText}>Since 2015</Text>
//         <Text style={styles.highlight}>
//           Kind words can be short and easy to speak, but their echoes are truly endless.
//         </Text>
//         <Text style={styles.aboutText}>
//           Small group of thoughtful people can change the world... (trimmed for brevity)
//         </Text>
//         <View style={styles.videoContainer}>
//           <Video
//             ref={videoRef}
//             source={require('../../assets/intro.mp4')}
//             rate={1.0}
//             volume={1.0}
//             isMuted={muted}
//             resizeMode="cover"
//             shouldPlay
//             isLooping
//             style={styles.video}
//           />
//           <TouchableOpacity style={styles.unmuteButton} onPress={toggleMute}>
//             {muted ? (
//               <Feather name="volume-x" size={24} color="#fff" />
//             ) : (
//               <Feather name="volume-2" size={24} color="#fff" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.statsSection}>
//         <Text style={styles.statsTitle}>Our Impact</Text>
//         <FlatList
//           data={impactData}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(item) => item.title}
//           contentContainerStyle={styles.statsContainer}
//           renderItem={({ item }) => (
//             <View style={styles.statCard}>
//               <Counter end={item.count} />
//               <Text style={styles.statTitle}>{item.title}</Text>
//               <Text style={styles.statDescription}>{item.description}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     alignItems: 'center',
//     paddingTop: 80,
//     paddingBottom: 40,
//     backgroundColor: '#277bc0',
//   },
//   parmarth: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   subTitle: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   aboutSection: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '600',
//   },
//   subText: {
//     fontSize: 14,
//     color: '#888',
//   },
//   highlight: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#277bc0',
//     fontWeight: '500',
//   },
//   aboutText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#444',
//   },
//   videoContainer: {
//     marginTop: 20,
//     position: 'relative',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   video: {
//     width: '100%',
//     height: 200,
//   },
//   unmuteButton: {
//     position: 'absolute',
//     right: 10,
//     bottom: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   statsSection: {
//     padding: 20,
//     backgroundColor: '#f7f7f7',
//   },
//   statsTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//   },
//   statCard: {
//     width: screenWidth * 0.7,
//     padding: 16,
//     marginRight: 12,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   statNumber: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#277bc0',
//   },
//   statTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 8,
//   },
//   statDescription: {
//     marginTop: 4,
//     color: '#555',
//     fontSize: 13,
//   },
// });

// export default HomeScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { Image } from 'react-native';
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

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

// Data for impact stats
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  <Image
    source={require('../../assets/icon.png')}  // Correct path depending on your file structure
    style={styles.logo}
    resizeMode="contain"
  />
  <Text style={styles.title}>PARMARTH</Text>
  <Text style={styles.subtitle}>The Social Club of IET Lucknow</Text>
</View>

      {/* Blood Donation Box */}
      <View style={styles.bannerBox}>
        <Text style={styles.bannerTitle}>Blood Donation Drive</Text>
        <Text style={styles.bannerDate}>21 MAY</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuRow}>
        <View style={styles.menuItem}>
          <Feather name="calendar" size={24} color="#002855" />
          <Text>Events</Text>
        </View>
        <View style={styles.menuItem}>
  <FontAwesome5 name="handshake" size={24} color="#002855" />
  <Text>Volunteer Now</Text>
</View>

        <View style={styles.menuItem}>
          <Feather name="image" size={24} color="#002855" />
          <Text>Gallery</Text>
        </View>
        <View style={styles.menuItem}>
          <Feather name="info" size={24} color="#002855" />
          <Text>About Parmarth</Text>
        </View>
      </View>

      {/* Live Updates */}
      <Text style={styles.sectionTitle}>LIVE UPDATES</Text>
      <View style={styles.liveUpdateBox}>
        <View style={styles.dot} />
        <Text style={styles.liveText}>New Cleanliness Drive on 25th May</Text>
      </View>

      {/* Join Us Button */}
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinText}>Join Us</Text>
      </TouchableOpacity>

      {/* Featured Stories */}
      <Text style={styles.sectionTitle}>FEATURED STORIES</Text>
      <View style={styles.featureRow}>
        <View style={styles.featureBox}>
          <FontAwesome5 name="hand-holding-heart" size={32} color="#002855" />
          <Text style={styles.featureTitle}>500+</Text>
          <Text style={styles.featureDesc}>lives impacted</Text>
        </View>
        <View style={styles.featureBox}>
          <FontAwesome5 name="seedling" size={32} color="#002855" />
          <Text style={styles.featureTitle}>1000+</Text>
          <Text style={styles.featureDesc}>trees planted</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Our Impact</Text>
        <View style={styles.statsContainer}>
          {impactData
            .reduce((rows, item, index) => {
              if (index % 2 === 0) {
                rows.push([item]);
              } else {
                rows[rows.length - 1].push(item);
              }
              return rows;
            }, [])
            .map((row, rowIndex) => (
              <View key={rowIndex} style={styles.statsRow}>
                {row.map((item) => (
                  <View key={item.title} style={styles.statCard}>
                    <Counter end={item.count} />
                    <Text style={styles.statTitle}>{item.title}</Text>
                    <Text style={styles.statDescription}>
                      {item.description}
                    </Text>
                  </View>
                ))}
                {row.length === 1 && <View style={[styles.statCard, { backgroundColor: 'transparent' }]} />}

                {/* Empty space filler if odd number */}
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#002855", marginTop: 4 },
  subtitle: { fontSize: 14, color: "#444" },
  bannerBox: {
    backgroundColor: "#002855",
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  bannerTitle: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  bannerDate: { fontSize: 16, color: "#fff", marginTop: 4 },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  menuItem: { alignItems: "center", width: width / 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 16,
  },
  liveUpdateBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    margin: 16,
    padding: 12,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "green",
    borderRadius: 4,
    marginRight: 8,
  },
  liveText: { fontSize: 14 },
  joinButton: {
    backgroundColor: "#003f88",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  joinText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 32,
  },
  featureBox: { alignItems: "center" },
  featureTitle: { fontSize: 20, fontWeight: "bold", marginTop: 8 },
  featureDesc: { fontSize: 14, color: "#444" },
  statsSection: { marginBottom: 32 },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    minHeight: 120,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#002855" },

  statTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#002855",
  },

  statDescription: {
    fontSize: 13,
    color: "#333",
    marginTop: 4,
  },
  logo: {
  width: 50,
  height: 50,
  marginBottom: 8,
},

});

export default HomeScreen;
