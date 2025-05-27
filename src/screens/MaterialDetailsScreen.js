import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Linking,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import backendUrl from '../../backendUrl';

export default function MaterialDetailsScreen({ route }) {
  const { class: className } = route.params;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const subjects = [
    'HomeWork',
    'Hindi',
    'English',
    'Math',
    'Science',
    'Social Science',
    'GK',
    'Computer',
  ];

  const subjectIcons = {
    HomeWork: 'book',
    Hindi: 'pen',
    English: 'book-open',
    Math: 'calculator',
    Science: 'flask',
    'Social Science': 'globe-asia',
    GK: 'lightbulb',
    Computer: 'laptop-code',
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const url = `${backendUrl}/study/by-class/${encodeURIComponent(className)}`;
        const response = await fetch(url);
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('Failed to fetch study materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [className]);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (webViewVisible) {
        setWebViewVisible(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [webViewVisible]);

  const getMaterialsForSubject = (subject) => {
    return materials.filter(
      (m) => m.subject?.toLowerCase() === subject.toLowerCase()
    );
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#002855', '#003f88']}
          style={styles.header}
        >
          <FontAwesome5 name="graduation-cap" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Study Material for {className}</Text>
          <Text style={styles.headerSubtitle}>Access all study resources for {className}</Text>
        </LinearGradient>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#002855" />
              <Text style={styles.loadingText}>Loading materials...</Text>
            </View>
          ) : materials.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="folder-open" size={40} color="#6c757d" />
              <Text style={styles.emptyText}>No study materials available for this class</Text>
            </View>
          ) : (
            subjects.map((subject) => {
              const subjectMaterials = getMaterialsForSubject(subject);
              if (subjectMaterials.length === 0) return null;

              return (
                <View key={subject} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <FontAwesome5 name={subjectIcons[subject]} size={20} color="#002855" />
                    </View>
                    <Text style={styles.sectionTitle}>{subject}</Text>
                  </View>

                  {subjectMaterials.map((material, idx) => (
                    <View key={idx} style={styles.materialCard}>
                      <View style={styles.materialInfo}>
                        <Text style={styles.materialTitle}>
                          {material.title || 'Untitled'}
                        </Text>
                        <Text style={styles.materialType}>
                          {material.type?.toUpperCase() || 'UNKNOWN'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          if (material.fileUrl) {
                            setCurrentUrl(material.fileUrl);
                            setWebViewVisible(true);
                          }
                        }}
                        style={styles.openButton}
                      >
                        <LinearGradient
                          colors={['#002855', '#003f88']}
                          style={styles.buttonGradient}
                        >
                          <FontAwesome5 name="file-pdf" size={16} color="#fff" />
                          <Text style={styles.buttonText}>Open</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* WebView Modal */}
      <Modal 
        visible={webViewVisible} 
        animationType="slide"
        onRequestClose={() => setWebViewVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#002855', '#003f88']}
            style={styles.modalHeader}
          >
            <TouchableOpacity
              onPress={() => setWebViewVisible(false)}
              style={styles.backButton}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>PDF Viewer</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(currentUrl)}
              style={styles.browserButton}
            >
              <FontAwesome5 name="external-link-alt" size={16} color="#fff" />
              <Text style={styles.browserButtonText}>Open in Browser</Text>
            </TouchableOpacity>
          </LinearGradient>

          <WebView
            ref={webViewRef}
            source={{
              uri: `https://docs.google.com/viewer?url=${encodeURIComponent(currentUrl)}&embedded=true`,
            }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            bounces={false}
            scrollEnabled={true}
            zoomable={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
            injectedJavaScript={`
              // Set document properties
              document.body.style.overflow = 'scroll';
              document.body.style.position = 'relative';
              document.body.style.margin = '0';
              document.body.style.padding = '0';
              
              // Force content to expand
              var content = document.querySelector('.drive-viewer-paginated-scrollable');
              if (content) {
                content.style.width = '100%';
                content.style.maxWidth = 'none';
              }
              
              // Adjust iframe properties
              var iframes = document.getElementsByTagName('iframe');
              if (iframes && iframes.length > 0) {
                iframes[0].style.width = '100%';
                iframes[0].style.height = '100vh';
                iframes[0].style.border = 'none';
                iframes[0].style.overflow = 'scroll';
                iframes[0].style.transform = 'scale(1.2)';
                iframes[0].style.transformOrigin = 'top left';
              }
              
              // Adjust scale of PDF content
              setTimeout(function() {
                var pdfContent = document.querySelector('.drive-viewer-paginated-scrollable');
                if (pdfContent) {
                  pdfContent.style.transform = 'scale(1.2)';
                  pdfContent.style.transformOrigin = 'top left';
                }
                
                // Force all pages to be wider
                var pages = document.querySelectorAll('.drive-viewer-paginated-page');
                if (pages && pages.length > 0) {
                  for (var i = 0; i < pages.length; i++) {
                    pages[i].style.width = '100%';
                    pages[i].style.maxWidth = 'none';
                  }
                }
              }, 1500);
              
              // Enable pinch-to-zoom
              document.documentElement.style.touchAction = 'manipulation';
              true;
            `}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#002855" />
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#002855',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
  },
  materialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  materialType: {
    fontSize: 12,
    color: '#6c757d',
  },
  openButton: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  browserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  browserButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
});
