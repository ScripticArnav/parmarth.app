import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  content: {
    padding: 16,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialLink: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002855',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002855',
    marginLeft: 12,
  },
  infoContent: {
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#002855',
    lineHeight: 22,
  },
});

export default ContactScreen; 