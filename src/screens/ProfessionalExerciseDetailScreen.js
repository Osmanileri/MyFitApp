// 🏆 PROFESSIONAL EXERCISE DETAIL SCREEN - App Store Quality
// Premium design with video player, instructions, and workout tracking

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  SafeAreaView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const ProfessionalExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const videoAnim = useRef(new Animated.Value(0)).current;
  
  // State
  const [activeTab, setActiveTab] = useState('instructions'); // 'instructions', 'tips', 'stats'
  const [sets, setSets] = useState([]);
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '' });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});

  // Muscle group colors
  const muscleGroupConfig = {
    'Göğüs': { color: ['#FF6B6B', '#FF8E8E'], emoji: '💪' },
    'Sırt': { color: ['#4ECDC4', '#45B7D1'], emoji: '🔙' },
    'Omuz': { color: ['#45B7D1', '#96CEB4'], emoji: '🤲' },
    'Kol': { color: ['#FFEAA7', '#FDCB6E'], emoji: '💪' },
    'Bacak': { color: ['#DDA0DD', '#BA68C8'], emoji: '🦵' },
    'Karın': { color: ['#96CEB4', '#81C784'], emoji: '🏃' }
  };

  const config = muscleGroupConfig[exercise.category] || muscleGroupConfig['Göğüs'];

  useEffect(() => {
    // Smooth entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Video animation
    setTimeout(() => {
      Animated.timing(videoAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 300);
  }, []);

  const handleAddSet = () => {
    if (currentSet.reps && currentSet.weight) {
      const newSet = {
        id: Date.now(),
        reps: parseInt(currentSet.reps),
        weight: parseFloat(currentSet.weight),
        timestamp: new Date().toLocaleTimeString(),
      };
      setSets([...sets, newSet]);
      setCurrentSet({ reps: '', weight: '' });
      
      // Success feedback
      Alert.alert('✅ Set Eklendi!', `${newSet.reps} tekrar × ${newSet.weight}kg kaydedildi`);
    } else {
      Alert.alert('⚠️ Eksik Bilgi', 'Lütfen tekrar sayısı ve ağırlığı girin');
    }
  };

  const handleRemoveSet = (setId) => {
    setSets(sets.filter(set => set.id !== setId));
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.headerContainer,
        {
          transform: [{ translateY: headerAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <LinearGradient
        colors={config.color}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={2}>
              {exercise.name}
            </Text>
            <Text style={styles.headerSubtitle}>
              {exercise.category} • {exercise.equipment || 'Equipment'}
            </Text>
          </View>

          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );

  const renderVideoPlayer = () => (
    <Animated.View 
      style={[
        styles.videoContainer,
        {
          opacity: videoAnim,
          transform: [
            {
              scale: videoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        }
      ]}
    >
      <View style={styles.videoPlayer}>
        {exercise.gifUrl || exercise.isLocal ? (
          <View style={styles.videoPlaceholder}>
            <LinearGradient
              colors={config.color}
              style={styles.videoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.videoEmoji}>{config.emoji}</Text>
              <Text style={styles.videoText}>Egzersiz Animasyonu</Text>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => setIsVideoPlaying(!isVideoPlaying)}
              >
                <Ionicons 
                  name={isVideoPlaying ? "pause" : "play"} 
                  size={24} 
                  color="#FFF" 
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.noVideoContainer}>
            <Ionicons name="videocam-off-outline" size={48} color="#999" />
            <Text style={styles.noVideoText}>Video mevcut değil</Text>
          </View>
        )}
        
        {/* WGER kaldırıldı */}
      </View>
    </Animated.View>
  );

  const renderTabs = () => (
    <Animated.View 
      style={[
        styles.tabContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      {[
        { key: 'instructions', title: 'Talimatlar', icon: 'list-outline' },
        { key: 'tips', title: 'İpuçları', icon: 'bulb-outline' },
        { key: 'stats', title: 'Set Takibi', icon: 'stats-chart-outline' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
          ]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Ionicons 
            name={tab.icon} 
            size={20} 
            color={activeTab === tab.key ? config.color[0] : '#999'} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === tab.key && { color: config.color[0] }
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderInstructions = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Nasıl Yapılır</Text>
      {exercise.instructions && exercise.instructions.length > 0 ? (
        exercise.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Talimat bilgisi mevcut değil</Text>
      )}
    </View>
  );

  const renderTips = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>İpuçları</Text>
      {exercise.tips && exercise.tips.length > 0 ? (
        exercise.tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="bulb" size={16} color={config.color[0]} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))
      ) : (
        <View style={styles.defaultTips}>
          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={16} color={config.color[0]} />
            <Text style={styles.tipText}>Hareket boyunca nefes kontrolünüze dikkat edin</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={16} color={config.color[0]} />
            <Text style={styles.tipText}>Doğru form teknikten daha önemlidir</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={16} color={config.color[0]} />
            <Text style={styles.tipText}>Kas grubunu hissetmeye odaklanın</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderStats = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Set Takibi</Text>
      
      {/* Add Set Form */}
      <View style={styles.addSetContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tekrar</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={styles.inputText}>
                {currentSet.reps || 'Tekrar sayısı'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ağırlık (kg)</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={styles.inputText}>
                {currentSet.weight || 'Ağırlık'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.addSetButton}
          onPress={handleAddSet}
        >
          <LinearGradient
            colors={config.color}
            style={styles.addSetGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addSetText}>Set Ekle</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Sets List */}
      {sets.length > 0 && (
        <View style={styles.setsContainer}>
          <Text style={styles.setsTitle}>Kaydedilen Setler ({sets.length})</Text>
          {sets.map((set, index) => (
            <View key={set.id} style={styles.setItem}>
              <View style={styles.setInfo}>
                <Text style={styles.setNumber}>Set {index + 1}</Text>
                <Text style={styles.setDetails}>
                  {set.reps} tekrar × {set.weight}kg
                </Text>
                <Text style={styles.setTime}>{set.timestamp}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeSetButton}
                onPress={() => handleRemoveSet(set.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'instructions':
        return renderInstructions();
      case 'tips':
        return renderTips();
      case 'stats':
        return renderStats();
      default:
        return renderInstructions();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={config.color[0]} />
      
      {/* Header */}
      {renderHeader()}

      {/* Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player */}
        {renderVideoPlayer()}

        {/* Exercise Info */}
        <Animated.View 
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseTitle}>{exercise.name}</Text>
            <View style={styles.exerciseMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="fitness-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{exercise.category}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="barbell-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{exercise.equipment || 'Equipment'}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="trending-up-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{exercise.difficulty || 'Medium'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Tabs */}
        {renderTabs()}

        {/* Tab Content */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {renderContent()}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 100 : 120,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  videoContainer: {
    margin: 20,
    marginBottom: 10,
  },
  videoPlayer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
  },
  videoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  videoText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 15,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVideoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  noVideoText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  apiBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  apiBadgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  exerciseHeader: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  exerciseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  metaText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#FFF',
    shadowOpacity: 0.15,
    elevation: 5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginLeft: 5,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  contentSection: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 10,
    lineHeight: 22,
  },
  defaultTips: {
    // Container for default tips
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addSetContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  addSetButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addSetGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  addSetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  setsContainer: {
    marginTop: 20,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  setInfo: {
    flex: 1,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  setDetails: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  setTime: {
    fontSize: 12,
    color: '#999',
  },
  removeSetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ProfessionalExerciseDetailScreen;