import React, { useState, useEffect } from 'react';
import WorkoutTheme from '../theme/workoutTheme';
import { Colors } from '../theme/appTheme';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  ContributionGraph, 
  StackedBarChart 
} from 'react-native-chart-kit';
import { CircularProgress } from 'react-native-circular-progress';
import { useDietStore } from '../store/dietStore';
import { useWorkoutStore } from '../store/workoutStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ProgressScreen({ navigation }) {
  // Use centralized theme
  const theme = WorkoutTheme;

  const [activeView, setActiveView] = useState('general'); // 'general', 'diet', 'workout'
  const [fadeAnim] = useState(new Animated.Value(1));
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedExercise, setSelectedExercise] = useState('bench-press');
  const [tooltip, setTooltip] = useState(null);
  
  const dietStore = useDietStore();
  const workoutStore = useWorkoutStore();

  // Interaktif özellikler
  const showTooltip = (data) => {
    setTooltip(data);
    setTimeout(() => setTooltip(null), 3000);
  };

  const handleChartPress = (data) => {
    if (data && data.value) {
      showTooltip({
        label: data.label || 'Veri',
        value: data.value,
        x: data.x || 0,
        y: data.y || 0
      });
    }
  };

  const handlePRCardPress = (prData) => {
    Alert.alert(
      prData.exercise,
      `En İyi Performans: ${prData.weight}\nGelişim: ${prData.progress}`,
      [
        { text: 'Detayları Gör', onPress: () => console.log('Show details') },
        { text: 'Tamam', style: 'cancel' }
      ]
    );
  };

  const handleGoalPress = (goalType) => {
    const goalData = goalType === 'weight' ? 
      'Kilo kaybı hedefi: 10 kg\nMevcut: 5 kg\nKalan: 5 kg' :
      'Kas kazanımı hedefi: 5 kg\nMevcut: 2 kg\nKalan: 3 kg';
    
    Alert.alert(
      goalType === 'weight' ? 'Kilo Kaybı Hedefi' : 'Kas Kazanımı Hedefi',
      goalData,
      [{ text: 'Tamam', style: 'cancel' }]
    );
  };

  // Animasyonlu içerik geçişi
  const switchView = (newView) => {
    if (newView === activeView) {
      setActiveView('general');
      return;
    }
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      setActiveView(newView);
    }, 150);
  };

  // Toggle butonu bileşeni
  const ToggleButton = () => {
    return (
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.toggleButtonLeft,
            activeView === 'diet' && styles.toggleButtonActive
          ]}
          onPress={() => switchView('diet')}
        >
          <Text style={[
            styles.toggleButtonText,
            activeView === 'diet' && styles.toggleButtonTextActive
          ]}>
            Diyet
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.toggleButtonRight,
            activeView === 'workout' && styles.toggleButtonActive
          ]}
          onPress={() => switchView('workout')}
        >
          <Text style={[
            styles.toggleButtonText,
            activeView === 'workout' && styles.toggleButtonTextActive
          ]}>
            Antrenman
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Gerçek verilerle hesaplama fonksiyonları
  const calculateWeeklyStats = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Haftalık antrenman sayısı
    const weeklyWorkouts = workoutStore.workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo && workoutDate <= today;
    }).length;
    
    // Ortalama kalori (örnek hesaplama)
    const averageCalories = dietStore.getDailyCalories() || 1850;
    
    // Su tüketimi
    const waterIntake = dietStore.waterIntake || 0;
    
    return {
      weeklyWorkouts,
      averageCalories,
      waterIntake
    };
  };

  const calculateGoalProgress = () => {
    // Kilo kaybı hedefi (örnek)
    const weightLossGoal = 10; // kg
    const currentWeightLoss = 5; // kg (gerçek veriden alınabilir)
    const weightLossProgress = (currentWeightLoss / weightLossGoal) * 100;
    
    // Kas kazanımı hedefi (örnek)
    const muscleGainGoal = 5; // kg
    const currentMuscleGain = 2; // kg (gerçek veriden alınabilir)
    const muscleGainProgress = (currentMuscleGain / muscleGainGoal) * 100;
    
    return {
      weightLoss: { current: currentWeightLoss, progress: weightLossProgress },
      muscleGain: { current: currentMuscleGain, progress: muscleGainProgress }
    };
  };

  // Genel hedef gelişimi görünümü - Basit test versiyonu
  const GeneralGoalProgressView = () => {
    try {
      const weeklyStats = calculateWeeklyStats();
      const goalProgress = calculateGoalProgress();
      
      return (
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Genel Hedef Gelişimi</Text>
            
            {/* Basit İlerleme Kartları */}
            <View style={styles.progressCirclesContainer}>
              <TouchableOpacity 
                style={styles.progressCard}
                onPress={() => handleGoalPress('weight')}
                activeOpacity={0.8}
              >
                <Text style={styles.progressValue}>-{goalProgress.weightLoss.current} kg</Text>
                <Text style={styles.progressLabel}>Kilo Kaybı</Text>
                <Text style={styles.progressPercent}>{goalProgress.weightLoss.progress.toFixed(0)}%</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.progressCard}
                onPress={() => handleGoalPress('muscle')}
                activeOpacity={0.8}
              >
                <Text style={styles.progressValue}>+{goalProgress.muscleGain.current} kg</Text>
                <Text style={styles.progressLabel}>Kas Kazanımı</Text>
                <Text style={styles.progressPercent}>{goalProgress.muscleGain.progress.toFixed(0)}%</Text>
              </TouchableOpacity>
            </View>
            
            {/* Haftalık Özet */}
            <View style={styles.summaryCard}>
              <Text style={styles.cardTitle}>Bu Hafta</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{weeklyStats.weeklyWorkouts}</Text>
                  <Text style={styles.summaryLabel}>Antrenman</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{weeklyStats.averageCalories}</Text>
                  <Text style={styles.summaryLabel}>Ort. Kalori</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{weeklyStats.waterIntake.toFixed(1)}L</Text>
                  <Text style={styles.summaryLabel}>Günlük Su</Text>
                </View>
              </View>
            </View>
            
            {/* Motivasyon Mesajı */}
            <View style={styles.motivationCard}>
              <Text style={styles.motivationText}>
                Harika gidiyorsun! 🎯 Hedeflerine %{Math.round((goalProgress.weightLoss.progress + goalProgress.muscleGain.progress) / 2)} yaklaştın.
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      );
    } catch (error) {
      console.error('GeneralGoalProgressView error:', error);
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.errorText}>Hata: {error.message}</Text>
        </View>
      );
    }
  };

  // Diyet verilerini hesaplama fonksiyonları
  const calculateDietData = () => {
    // Geçmiş 7 günlük kalori verisi (örnek)
    const weeklyCalories = [
      dietStore.getDailyCalories() || 1850,
      2100, 1950, 2200, 1800, 2050, 1900
    ];
    
    // Makro besin dağılımı
    const macros = dietStore.getDailyMacros();
    const totalMacros = macros.protein + macros.carbs + macros.fat;
    
    const macroPercentages = totalMacros > 0 ? {
      protein: Math.round((macros.protein * 4 / (totalMacros * 4)) * 100) || 30,
      carbs: Math.round((macros.carbs * 4 / (totalMacros * 4)) * 100) || 45,
      fat: Math.round((macros.fat * 9 / (totalMacros * 9)) * 100) || 25,
    } : { protein: 30, carbs: 45, fat: 25 };
    
    // Su tüketimi
    const waterProgress = dietStore.waterIntake / (dietStore.nutritionGoals.water || 2.5);
    
    return {
      weeklyCalories,
      macroPercentages,
      waterProgress: Math.min(waterProgress * 100, 100),
      currentWater: dietStore.waterIntake,
      targetWater: dietStore.nutritionGoals.water || 2.5
    };
  };

  // Diyet analizi görünümü
  const DietAnalysisView = () => {
    const dietData = calculateDietData();
    
    const chartConfig = {
      backgroundGradientFrom: WorkoutTheme.cardBackground,
      backgroundGradientTo: WorkoutTheme.cardBackground,
      color: (opacity = 1) => `rgba(167, 255, 235, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.7,
      useShadowColorFromDataset: false,
      decimalPlaces: 0,
    };

    const calorieData = {
      labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      datasets: [
        {
          data: dietData.weeklyCalories,
          color: (opacity = 1) => `rgba(167, 255, 235, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    const macroData = [
      {
        name: 'Protein',
        population: dietData.macroPercentages.protein,
        color: Colors.nutrition.protein,
        legendFontColor: '#FFFFFF',
        legendFontSize: 14,
      },
      {
        name: 'Karbonhidrat',
        population: dietData.macroPercentages.carbs,
        color: Colors.nutrition.carbs,
        legendFontColor: '#FFFFFF',
        legendFontSize: 14,
      },
      {
        name: 'Yağ',
        population: dietData.macroPercentages.fat,
        color: Colors.nutrition.fat,
        legendFontColor: '#FFFFFF',
        legendFontSize: 14,
      },
    ];

    return (
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Diyet Analizi</Text>
          
          {/* Tarih Aralığı Seçici */}
          <View style={styles.periodSelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['7days', '30days', '90days', '1year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period === '7days' ? 'Son 7 Gün' : 
                     period === '30days' ? 'Bu Ay' : 
                     period === '90days' ? 'Son 3 Ay' : 'Yıl'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Kalori Trendi */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Günlük Kalori Alımı</Text>
            <LineChart
              data={calorieData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          
          {/* Makro Besin Dağılımı */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Makro Besin Dağılımı</Text>
            <PieChart
              data={macroData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          </View>
          
                     {/* Su Tüketimi */}
           <View style={styles.chartCard}>
             <Text style={styles.chartTitle}>Su Tüketimi</Text>
             <View style={styles.waterProgress}>
               <CircularProgress
                 size={150}
                 width={12}
                 fill={dietData.waterProgress}
                 tintColor={Colors.nutrition.carbs}
                 backgroundColor={WorkoutTheme?.cardBackground || '#1E1E1E'}
               />
               <View style={styles.waterProgressCenter}>
                 <Text style={styles.waterValue}>{dietData.currentWater.toFixed(1)}L</Text>
                 <Text style={styles.waterLabel}>/ {dietData.targetWater}L</Text>
               </View>
             </View>
           </View>
        </ScrollView>
      </Animated.View>
    );
  };

  // Antrenman verilerini hesaplama fonksiyonları
  const calculateWorkoutData = () => {
    // Haftalık antrenman hacmi (örnek hesaplama)
    const weeklyVolumes = [15000, 18000, 16500, 19000, 17200, 20000];
    
    // Kişisel rekorlar (workoutStore'dan çekilebilir)
    const personalRecords = [
      { exercise: 'Bench Press', weight: '120 kg', progress: '+5 kg' },
      { exercise: 'Squat', weight: '150 kg', progress: '+10 kg' },
      { exercise: 'Deadlift', weight: '180 kg', progress: '+15 kg' },
    ];
    
    // Egzersiz gelişimi (örnek)
    const exerciseProgress = [100, 105, 110, 115, 118, 120];
    
    // Toplam istatistikler
    const totalWorkouts = workoutStore.workouts.length;
    const totalDuration = workoutStore.totalDuration;
    const averageDuration = workoutStore.averageWorkoutDuration;
    
    return {
      weeklyVolumes,
      personalRecords,
      exerciseProgress,
      totalWorkouts,
      totalDuration,
      averageDuration
    };
  };

  // Antrenman analizi görünümü
  const WorkoutAnalysisView = () => {
    const workoutData = calculateWorkoutData();
    
    const chartConfig = {
      backgroundGradientFrom: WorkoutTheme.cardBackground,
      backgroundGradientTo: WorkoutTheme.cardBackground,
      color: (opacity = 1) => `rgba(251, 192, 45, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.7,
      useShadowColorFromDataset: false,
      decimalPlaces: 0,
    };

    const workoutVolumeData = {
      labels: ['Hf1', 'Hf2', 'Hf3', 'Hf4', 'Hf5', 'Hf6'],
      datasets: [
        {
          data: workoutData.weeklyVolumes,
          color: (opacity = 1) => `rgba(251, 192, 45, ${opacity})`,
        },
      ],
    };

    const prData = workoutData.personalRecords;

    return (
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Antrenman Analizi</Text>
          
          {/* Tarih Aralığı Seçici */}
          <View style={styles.periodSelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['7days', '30days', '90days', '1year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period === '7days' ? 'Son 7 Gün' : 
                     period === '30days' ? 'Bu Ay' : 
                     period === '90days' ? 'Son 3 Ay' : 'Yıl'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Antrenman Hacmi */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Haftalık Antrenman Hacmi</Text>
            <BarChart
              data={workoutVolumeData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </View>
          
          {/* Kişisel Rekorlar */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Kişisel Rekorlar (PR)</Text>
                         <View style={styles.prContainer}>
               {prData.map((pr, index) => (
                 <TouchableOpacity 
                   key={index} 
                   style={styles.prCard}
                   onPress={() => handlePRCardPress(pr)}
                   activeOpacity={0.8}
                 >
                   <Text style={styles.prExercise}>{pr.exercise}</Text>
                   <Text style={styles.prWeight}>{pr.weight}</Text>
                   <Text style={styles.prProgress}>{pr.progress}</Text>
                 </TouchableOpacity>
               ))}
             </View>
          </View>
          
                     {/* Egzersiz Gelişim Grafiği */}
           <View style={styles.chartCard}>
             <Text style={styles.chartTitle}>Egzersiz Gelişimi</Text>
             
             {/* Egzersiz Seçici */}
             <View style={styles.exerciseSelector}>
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                 {['bench-press', 'squat', 'deadlift', 'shoulder-press'].map((exercise) => (
                   <TouchableOpacity
                     key={exercise}
                     style={[
                       styles.exerciseSelectorButton,
                       selectedExercise === exercise && styles.exerciseSelectorButtonActive
                     ]}
                     onPress={() => setSelectedExercise(exercise)}
                   >
                     <Text style={[
                       styles.exerciseSelectorText,
                       selectedExercise === exercise && styles.exerciseSelectorTextActive
                     ]}>
                       {exercise === 'bench-press' ? 'Bench Press' : 
                        exercise === 'squat' ? 'Squat' : 
                        exercise === 'deadlift' ? 'Deadlift' : 'Shoulder Press'}
                     </Text>
                   </TouchableOpacity>
                 ))}
               </ScrollView>
             </View>
             
             <LineChart
               data={{
                 labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                 datasets: [
                   {
                     data: workoutData.exerciseProgress,
                     color: (opacity = 1) => `rgba(251, 192, 45, ${opacity})`,
                     strokeWidth: 2,
                   },
                 ],
               }}
               width={screenWidth - 60}
               height={220}
               chartConfig={chartConfig}
               bezier
               style={styles.chart}
             />
           </View>
           
           {/* Antrenman İstatistikleri */}
           <View style={styles.chartCard}>
             <Text style={styles.chartTitle}>Antrenman İstatistikleri</Text>
             <View style={styles.statsContainer}>
               <View style={styles.statItem}>
                 <Text style={styles.statValue}>{workoutData.totalWorkouts}</Text>
                 <Text style={styles.statLabel}>Toplam Antrenman</Text>
               </View>
               <View style={styles.statItem}>
                 <Text style={styles.statValue}>{workoutData.totalDuration}</Text>
                 <Text style={styles.statLabel}>Toplam Dakika</Text>
               </View>
               <View style={styles.statItem}>
                 <Text style={styles.statValue}>{workoutData.averageDuration}</Text>
                 <Text style={styles.statLabel}>Ortalama Süre</Text>
               </View>
             </View>
           </View>
        </ScrollView>
      </Animated.View>
    );
  };

  // Ana render fonksiyonu
  const renderContent = () => {
    switch (activeView) {
      case 'diet':
        return <DietAnalysisView />;
      case 'workout':
        return <WorkoutAnalysisView />;
      default:
        return <GeneralGoalProgressView />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || '#121212'} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>İlerleme</Text>
        
        <ToggleButton />
      </View>
      
      {/* Dynamic Content */}
      {renderContent()}
      
      {/* Tooltip */}
      {tooltip && (
        <View style={[styles.tooltip, { left: tooltip.x, top: tooltip.y }]}>
          <Text style={styles.tooltipText}>{tooltip.label}: {tooltip.value}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d2d',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 2,
    width: 140,
    height: 36,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  toggleButtonLeft: {
    marginRight: 1,
  },
  toggleButtonRight: {
    marginLeft: 1,
  },
  toggleButtonActive: {
    backgroundColor: '#FBC02D',
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#B3B3B3',
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#121212',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
     progressCard: {
     backgroundColor: '#1e1e1e',
     borderRadius: 16,
     padding: 20,
     alignItems: 'center',
     justifyContent: 'center',
     width: 140,
     height: 120,
     marginHorizontal: 10,
   },
   progressValue: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#FFFFFF',
   },
   progressLabel: {
     fontSize: 12,
     color: '#B3B3B3',
     marginTop: 4,
   },
   progressPercent: {
     fontSize: 14,
     fontWeight: 'bold',
     color: '#FBC02D',
     marginTop: 8,
   },
   errorText: {
     color: '#CF6679',
     fontSize: 16,
     textAlign: 'center',
     marginTop: 50,
   },
      summaryCard: {
     backgroundColor: '#1e1e1e',
     borderRadius: 20,
     padding: 20,
     marginBottom: 20,
   },
   cardTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#FFFFFF',
     marginBottom: 16,
   },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
     summaryValue: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#FBC02D',
   },
   summaryLabel: {
     fontSize: 12,
     color: '#B3B3B3',
     marginTop: 4,
   },
   motivationCard: {
     backgroundColor: '#1e1e1e',
     borderRadius: 20,
     padding: 20,
     marginBottom: 20,
     borderWidth: 1,
     borderColor: '#FBC02D',
   },
   motivationText: {
     fontSize: 16,
     color: '#FFFFFF',
     textAlign: 'center',
     lineHeight: 24,
   },
  periodSelector: {
    marginBottom: 20,
  },
     periodButton: {
     paddingHorizontal: 16,
     paddingVertical: 8,
     borderRadius: 16,
     marginRight: 8,
     backgroundColor: '#2d2d2d',
   },
   periodButtonActive: {
     backgroundColor: '#FBC02D',
   },
   periodButtonText: {
     fontSize: 14,
     color: '#B3B3B3',
     fontWeight: '600',
   },
   periodButtonTextActive: {
     color: '#121212',
   },
     chartCard: {
     backgroundColor: '#1e1e1e',
     borderRadius: 20,
     padding: 20,
     marginBottom: 20,
   },
   chartTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#FFFFFF',
     marginBottom: 16,
   },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  waterProgress: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  waterProgressCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
     waterValue: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#FFFFFF',
   },
   waterLabel: {
     fontSize: 14,
     color: '#B3B3B3',
     marginTop: 4,
   },
   prContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
   },
   prCard: {
     backgroundColor: '#2d2d2d',
     borderRadius: 16,
     padding: 16,
     marginBottom: 12,
     width: '48%',
     alignItems: 'center',
   },
   prExercise: {
     fontSize: 14,
     color: '#B3B3B3',
     textAlign: 'center',
   },
   prWeight: {
     fontSize: 20,
     fontWeight: 'bold',
     color: '#FFFFFF',
     marginVertical: 4,
   },
   prProgress: {
     fontSize: 12,
     color: '#4CAF50',
     fontWeight: '600',
   },
   statsContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     marginTop: 16,
   },
   statItem: {
     alignItems: 'center',
     flex: 1,
   },
   statValue: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#FBC02D',
   },
   statLabel: {
     fontSize: 12,
     color: '#B3B3B3',
     marginTop: 4,
     textAlign: 'center',
   },
   exerciseSelector: {
     marginBottom: 16,
   },
   exerciseSelectorButton: {
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 12,
     marginRight: 8,
     backgroundColor: '#2d2d2d',
     borderWidth: 1,
     borderColor: '#2d2d2d',
   },
   exerciseSelectorButtonActive: {
     backgroundColor: '#FBC02D',
     borderColor: '#FBC02D',
   },
   exerciseSelectorText: {
     fontSize: 12,
     color: '#B3B3B3',
     fontWeight: '500',
   },
   exerciseSelectorTextActive: {
     color: '#121212',
     fontWeight: '600',
   },
   tooltip: {
     position: 'absolute',
     backgroundColor: '#2d2d2d',
     borderRadius: 8,
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderWidth: 1,
     borderColor: '#FBC02D',
     zIndex: 1000,
   },
   tooltipText: {
     fontSize: 12,
     color: '#FFFFFF',
     fontWeight: '500',
   },
 }); 