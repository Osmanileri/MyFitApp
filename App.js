import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { useDietStore } from './src/store/dietStore';
import { appTheme } from './src/theme/simpleTheme';
import { safeAsync } from './src/utils/asyncUtils';

// Auth & Setup Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import MainScreen from './src/screens/MainScreen';

// Diet Module Screens
import AddMealScreen from './src/screens/AddMealScreen';
import FoodSearchScreen from './src/screens/FoodSearchScreen';
import FoodDetailScreen from './src/screens/FoodDetailScreen';
import ManualFoodAddScreen from './src/screens/ManualFoodAddScreen';
import WaterTrackingScreen from './src/screens/WaterTrackingScreen';
import SupplementTrackingScreen from './src/screens/SupplementTrackingScreen';
import NutritionGoalsScreen from './src/screens/NutritionGoalsScreen';

// Workout Module Screens
import WorkoutDashboardScreen from './src/screens/WorkoutDashboardScreen';
import StartWorkoutScreen from './src/screens/StartWorkoutScreen';
import WorkoutEntryScreen from './src/screens/WorkoutEntryScreen';
import WorkoutCompletionScreen from './src/screens/WorkoutCompletionScreen';
import WorkoutHistoryScreen from './src/screens/WorkoutHistoryScreen';
import ExerciseLibraryScreen from './src/screens/ExerciseLibraryScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';

// Progress Module Screens
import ProgressDashboardScreen from './src/screens/ProgressDashboardScreen';
import AddWeightScreen from './src/screens/AddWeightScreen';
import AddMeasurementScreen from './src/screens/AddMeasurementScreen';
import ProgressHistoryScreen from './src/screens/ProgressHistoryScreen';
import PhotoProgressScreen from './src/screens/PhotoProgressScreen';

// Reminders Module Screens
import RemindersListScreen from './src/screens/RemindersListScreen';
import AddEditReminderScreen from './src/screens/AddEditReminderScreen';

// Store imports
import workoutStore from './src/store/workoutStore';

const Stack = createStackNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: 20,
          backgroundColor: '#f8f9fa'
        }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            marginBottom: 10,
            textAlign: 'center'
          }}>
            Bir hata oluştu
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#666', 
            textAlign: 'center',
            marginBottom: 20
          }}>
            Uygulamayı yeniden başlatın veya geliştiriciye bildirin.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Loading Screen Component
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: appTheme?.colors?.background || '#f8f9fa'
  }}>
    <ActivityIndicator size="large" color={appTheme?.colors?.primary || '#6C5CE7'} />
  </View>
);

// Main App Navigation Component
function AppNavigator() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  // Initialize app on startup
  useEffect(() => {
    let isMounted = true;
    
    const initApp = async () => {
      try {
        // Initialize other stores in a controlled way
        await safeAsync(() => {
          const { initializeMockData } = workoutStore.getState();
          if (initializeMockData) {
            initializeMockData();
          }
        });
        
        // Load cached diet data
        await safeAsync(async () => {
          const { loadDailyData, selectedDate } = useDietStore.getState();
          if (loadDailyData && selectedDate) {
            await loadDailyData(selectedDate);
          }
        });
        
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initApp();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading screen during initialization
  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  // Determine initial route based on auth status
  const getInitialRouteName = () => {
    if (!isAuthenticated) {
      return 'Splash';
    }
    
    return 'Main';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={getInitialRouteName()}
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        
        {/* Main App */}
        <Stack.Screen name="Main" component={MainScreen} />
        
        {/* Diet Screens */}
        <Stack.Screen name="AddMeal" component={AddMealScreen} />
        <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
        <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
        <Stack.Screen name="ManualFoodAdd" component={ManualFoodAddScreen} />
        <Stack.Screen name="WaterTracking" component={WaterTrackingScreen} />
        <Stack.Screen name="SupplementTracking" component={SupplementTrackingScreen} />
        <Stack.Screen name="NutritionGoals" component={NutritionGoalsScreen} />
        
        {/* Workout Screens */}
        <Stack.Screen name="WorkoutDashboard" component={WorkoutDashboardScreen} />
        <Stack.Screen name="StartWorkout" component={StartWorkoutScreen} />
        <Stack.Screen name="WorkoutEntry" component={WorkoutEntryScreen} />
        <Stack.Screen name="WorkoutCompletion" component={WorkoutCompletionScreen} />
        <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
        <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        
        {/* Progress Screens */}
        <Stack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
        <Stack.Screen name="AddWeight" component={AddWeightScreen} />
        <Stack.Screen name="AddMeasurement" component={AddMeasurementScreen} />
        <Stack.Screen name="ProgressHistory" component={ProgressHistoryScreen} />
        <Stack.Screen name="PhotoProgress" component={PhotoProgressScreen} />
        
        {/* Reminder Screens */}
        <Stack.Screen name="RemindersList" component={RemindersListScreen} />
        <Stack.Screen name="AddEditReminder" component={AddEditReminderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Component with Error Boundary
export default function App() {
  return (
    <PaperProvider theme={appTheme}>
      <ErrorBoundary>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ErrorBoundary>
    </PaperProvider>
  );
}
