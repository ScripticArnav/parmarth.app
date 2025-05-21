import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import backendUrl from '../../backendUrl';

export default function MaterialDetailsScreen({ route }) {
  const { class: className } = route.params;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const subjects = [
    'Hindi',
    'English',
    'Math',
    'Science',
    'Social Science',
    'GK',
    'Computer',
  ];

  const subjectIcons = {
    Hindi: '📝',
    English: '📘',
    Math: '➗',
    Science: '🧪',
    'Social Science': '🌍',
    GK: '🎯',
    Computer: '💻',
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const url = `${backendUrl}/study/by-class/${encodeURIComponent(className)}`;
        const response = await fetch(url);
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('❌ Failed to fetch study materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [className]);

  const getMaterialsForSubject = (subject) => {
    return materials.filter(
      (m) => m.subject?.toLowerCase() === subject.toLowerCase()
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Study Material for {className}</Text>
        <Text style={styles.subtitle}>
          Yaha {className} ke sabhi subject ke notes, videos, PDFs milenge.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#6a1b9a" />
        ) : materials.length === 0 ? (
          <Text style={styles.noDataText}>
            😕 Koi study material uplabdh nahi hai is class ke liye.
          </Text>
        ) : (
          subjects.map((subject) => {
            const subjectMaterials = getMaterialsForSubject(subject);
            if (subjectMaterials.length === 0) return null;

            return (
              <View key={subject} style={styles.subjectSection}>
                <Text style={styles.subjectHeading}>
                  {subjectIcons[subject] || ''} {subject}
                </Text>

                {subjectMaterials.map((material, idx) => (
                  <View key={idx} style={styles.materialCard}>
                    <View style={styles.cardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.materialTitle}>
                          {material.title || 'Untitled'}
                        </Text>
                        <Text style={styles.materialType}>
                          📄 {material.type?.toUpperCase() || 'UNKNOWN'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          if (material.fileUrl) {
                            setCurrentUrl(material.fileUrl);
                            setWebViewVisible(true);
                          } else {
                            console.warn('❌ No file URL found');
                          }
                        }}
                        style={styles.downloadButton}
                      >
                        <Text style={styles.downloadLink}>📥 Open</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* WebView Modal */}
      <Modal visible={webViewVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
          <View
            style={{
              backgroundColor: '#6a1b9a',
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => setWebViewVisible(false)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>❮ Back</Text>
            </TouchableOpacity>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>PDF Viewer</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(currentUrl)}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: '#4a148c',
                borderRadius: 6,
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Open in Browser</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{
              uri: `https://docs.google.com/viewer?url=${encodeURIComponent(currentUrl)}&embedded=true`,
            }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            bounces={false}
            scrollEnabled={true}
            zoomable={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
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
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
                <ActivityIndicator size="large" color="#6a1b9a" />
                <Text style={{ marginTop: 15, color: '#333', fontSize: 16 }}>Loading PDF...</Text>
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
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  subjectSection: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  subjectHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6a1b9a',
    marginBottom: 10,
    borderBottomWidth: 1.2,
    borderColor: '#e0e0e0',
    paddingBottom: 6,
  },
  materialCard: {
    backgroundColor: '#f3f0f9',
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#6a1b9a',
  },
  materialTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  materialType: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
  },
  downloadButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#8e44ad',
    borderRadius: 6,
  },
  downloadLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
