import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const SocialLink = ({ icon, title, url, color }) => (
  <TouchableOpacity 
    style={styles.socialLink}
    onPress={() => Linking.openURL(url)}
  >
    <LinearGradient
      colors={[color, color + 'CC']}
      style={styles.socialIconContainer}
    >
      <FontAwesome5 name={icon} size={24} color="#fff" />
    </LinearGradient>
    <Text style={styles.socialTitle}>{title}</Text>
  </TouchableOpacity>
);

const ContactScreen = () => {
  const socialLinks = [
    {
      icon: 'globe',
      title: 'Website',
      url: 'https://parmarth.ietlucknow.ac.in/',
      color: '#002855'
    },
    {
      icon: 'instagram',
      title: 'Instagram',
      url: 'https://instagram.com/parmarth.iet',
      color: '#E1306C'
    },
    {
      icon: 'facebook',
      title: 'Facebook',
      url: 'https://facebook.com/parmarth.iet',
      color: '#4267B2'
    },
    {
      icon: 'linkedin',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/company/parmarth-iet-lucknow',
      color: '#0077B5'
    },
    {
      icon: 'youtube',
      title: 'YouTube',
      url: 'https://youtube.com/@iet.parmarth',
      color: '#FF0000'
    },
    {
      icon: 'twitter',
      title: 'Twitter',
      url: 'https://twitter.com/ietparmarth',
      color: '#1DA1F2'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <View style={styles.headerIconContainer}>
          <FontAwesome5 name="handshake" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Connect With Us</Text>
        <Text style={styles.subtitle}>Join our community and stay updated</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.socialGrid}>
          {socialLinks.map((link, index) => (
            <SocialLink
              key={index}
              icon={link.icon}
              title={link.title}
              url={link.url}
              color={link.color}
            />
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <FontAwesome5 name="address-card" size={24} color="#002855" />
            <Text style={styles.infoTitle}>Contact Information</Text>
          </View>
          <View style={styles.infoContent}>
            <View style={styles.infoItem}>
              <LinearGradient
                colors={['#002855', '#003f88']}
                style={styles.infoIconContainer}
              >
                <FontAwesome5 name="map-marker-alt" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Working Place</Text>
                <Text style={styles.infoText}>Institute of Engineering and{'\n'}Technology, Lucknow, 226021</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <LinearGradient
                colors={['#002855', '#003f88']}
                style={styles.infoIconContainer}
              >
                <FontAwesome5 name="envelope" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoText}>parmarth@ietlucknow.ac.in</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: width * 0.05,
    paddingTop: Platform.OS === 'ios' ? height * 0.08 : height * 0.06,
    alignItems: 'center',
    borderBottomLeftRadius: width * 0.075,
    borderBottomRightRadius: width * 0.075,
  },
  headerIconContainer: {
    width: Math.min(width * 0.2, 80),
    height: Math.min(width * 0.2, 80),
    borderRadius: Math.min(width * 0.1, 40),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: height * 0.01,
  },
  subtitle: {
    fontSize: Math.min(width * 0.045, 18),
    color: '#fff',
    opacity: 0.9,
    marginBottom: height * 0.02,
  },
  content: {
    padding: width * 0.04,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  socialLink: {
    width: width * 0.43,
    backgroundColor: '#fff',
    borderRadius: width * 0.04,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  socialIconContainer: {
    width: Math.min(width * 0.12, 48),
    height: Math.min(width * 0.12, 48),
    borderRadius: Math.min(width * 0.06, 24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  socialTitle: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: '#002855',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: width * 0.04,
    padding: width * 0.05,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  infoTitle: {
    fontSize: Math.min(width * 0.05, 20),
    fontWeight: '600',
    color: '#002855',
    marginLeft: width * 0.03,
  },
  infoContent: {
    gap: height * 0.02,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: Math.min(width * 0.1, 40),
    height: Math.min(width * 0.1, 40),
    borderRadius: Math.min(width * 0.05, 20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '600',
    color: '#002855',
    marginBottom: height * 0.005,
  },
  infoText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#2c3e50',
    lineHeight: Math.min(width * 0.045, 18),
  },
});

export default ContactScreen; 