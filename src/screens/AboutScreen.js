import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function AboutScreen() {
  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <FontAwesome5 name="heart" size={40} color="#fff" />
          <Text style={styles.title}>About Parmarth</Text>
          <Text style={styles.subtitle}>Transforming Lives Through Education</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="history" size={24} color="#002855" />
            <Text style={styles.cardTitle}>Our Journey</Text>
          </View>
          <Text style={styles.section}>
            Parmarth began its journey in 2015 with a mission to transform the lives of underprivileged children through education. 
            It started when a few kind-hearted IETians noticed young beggars near the college and decided to offer something more meaningful — hope through learning.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="lightbulb" size={24} color="#002855" />
            <Text style={styles.cardTitle}>The Beginning</Text>
          </View>
          <Text style={styles.section}>
            The first event, the "Beggar's Event", blended food with learning to spark curiosity. As interest grew, volunteers started teaching in slums, 
            and eventually the college itself opened its doors to support this noble mission.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="handshake" size={24} color="#002855" />
            <Text style={styles.cardTitle}>What We Do</Text>
          </View>
          <Text style={styles.section}>
            Today, Parmarth has 200+ volunteers and 150+ children attending daily learning sessions (LT Teaching). The club operates via four wings:
          </Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <FontAwesome5 name="school" size={20} color="#002855" />
              <Text style={styles.listText}>Girls Education Wing – Educating teenage girls and women in slums.</Text>
            </View>
            <View style={styles.listItem}>
              <FontAwesome5 name="book-open" size={20} color="#002855" />
              <Text style={styles.listText}>Schooling Wing – Admitting slum children in schools via the RTE Act.</Text>
            </View>
            <View style={styles.listItem}>
              <FontAwesome5 name="hands-helping" size={20} color="#002855" />
              <Text style={styles.listText}>Social Service Wing – Cleanliness drives, blood donation, medical camps.</Text>
            </View>
            <View style={styles.listItem}>
              <FontAwesome5 name="chalkboard-teacher" size={20} color="#002855" />
              <Text style={styles.listText}>LT Teaching Wing – Daily education at college campus.</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="eye" size={24} color="#002855" />
            <Text style={styles.cardTitle}>Vision</Text>
          </View>
          <Text style={styles.section}>
            To build an inclusive society where every child can grow, learn and lead regardless of their background.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="bullseye" size={24} color="#002855" />
            <Text style={styles.cardTitle}>Mission</Text>
          </View>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <FontAwesome5 name="graduation-cap" size={20} color="#002855" />
              <Text style={styles.listText}>Provide quality education and skills.</Text>
            </View>
            <View style={styles.listItem}>
              <FontAwesome5 name="leaf" size={20} color="#002855" />
              <Text style={styles.listText}>Promote social and environmental responsibility.</Text>
            </View>
            <View style={styles.listItem}>
              <FontAwesome5 name="users" size={20} color="#002855" />
              <Text style={styles.listText}>Empower through mentorship.</Text>
            </View>
            <View style={styles.listItem}>
              <FontAwesome5 name="paint-brush" size={20} color="#002855" />
              <Text style={styles.listText}>Foster creativity in a nurturing environment.</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.footer]}>
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.footerGradient}
          >
            <View style={styles.footerContent}>
              <View style={styles.heartContainer}>
                <LinearGradient
                  colors={['#ff6b6b', '#e74c3c']}
                  style={styles.heartGradient}
                >
                  <FontAwesome5 name="heart" size={24} color="#ffffff" style={styles.heartIcon} />
                </LinearGradient>
              </View>
              <Text style={styles.credit}>Crafted with love by</Text>
              <View style={styles.namesContainer}>
                <Text style={styles.names}>Vivek Dixit</Text>
                <Text style={styles.andText}>&</Text>
                <Text style={styles.names}>Arnav Saxena</Text>
              </View>
              <View style={styles.batchContainer}>
                <FontAwesome5 name="graduation-cap" size={12} color="#6c757d" style={styles.batchIcon} />
                <Text style={styles.batch}>Batch of 2025</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: width * 0.075,
    paddingTop: Platform.OS === 'ios' ? height * 0.08 : height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: width * 0.075,
    borderBottomRightRadius: width * 0.075,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: Math.min(width * 0.09, 36),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: height * 0.015,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: Math.min(width * 0.045, 18),
    color: '#ffffff',
    marginTop: height * 0.008,
    opacity: 0.9,
  },
  content: {
    padding: width * 0.0375,
    paddingTop: height * 0.03,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: width * 0.04,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  cardTitle: {
    fontSize: Math.min(width * 0.055, 22),
    fontWeight: '600',
    color: '#002855',
    marginLeft: width * 0.025,
  },
  section: {
    fontSize: Math.min(width * 0.04, 16),
    lineHeight: Math.min(width * 0.06, 24),
    color: '#2c3e50',
  },
  listContainer: {
    marginTop: height * 0.015,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  listText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#2c3e50',
    marginLeft: width * 0.025,
    flex: 1,
  },
  footer: {
    marginBottom: height * 0.05,
  },
  footerGradient: {
    borderRadius: width * 0.04,
    overflow: 'hidden',
  },
  footerContent: {
    padding: width * 0.05,
    alignItems: 'center',
  },
  heartContainer: {
    marginBottom: height * 0.015,
  },
  heartGradient: {
    width: Math.min(width * 0.15, 60),
    height: Math.min(width * 0.15, 60),
    borderRadius: Math.min(width * 0.075, 30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    marginLeft: width * 0.005,
  },
  credit: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#6c757d',
    marginBottom: height * 0.005,
  },
  namesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  names: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: '#002855',
  },
  andText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#6c757d',
    marginHorizontal: width * 0.01,
  },
  batchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchIcon: {
    marginRight: width * 0.01,
  },
  batch: {
    fontSize: Math.min(width * 0.03, 12),
    color: '#6c757d',
  },
});
