// 🚀 PROFESSIONAL APP NAVIGATOR - App Store Quality
// Modern navigation structure with smooth transitions

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Screens
import ProfessionalBodyMap from '../components/BodyMap/ProfessionalBodyMap';
import ProfessionalExerciseListScreen from '../screens/ProfessionalExerciseListScreen';
import ProfessionalExerciseDetailScreen from '../screens/ProfessionalExerciseDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for Exercise Flow
const ExerciseStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 250,
            },
          },
        },
      }}
    >
      <Stack.Screen 
        name="BodyMap" 
        component={ProfessionalBodyMap}
        options={{
          title: 'Kas Grupları',
        }}
      />
      <Stack.Screen 
        name="ExerciseList" 
        component={ProfessionalExerciseListScreen}
        options={{
          title: 'Egzersizler',
        }}
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ProfessionalExerciseDetailScreen}
        options={{
          title: 'Egzersiz Detayı',
        }}
      />
    </Stack.Navigator>
  );
};

// Placeholder screens for other tabs
const WorkoutScreen = () => (
  <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <text>Antrenman Ekranı</text>
  </div>
);

const ProgressScreen = () => (
  <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <text>İlerleme Ekranı</text>
  </div>
);

const ProfileScreen = () => (
  <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <text>Profil Ekranı</text>
  </div>
);

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Exercises') {
            iconName = focused ? 'body' : 'body-outline';
          } else if (route.name === 'Workout') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Exercises" 
        component={ExerciseStackNavigator}
        options={{
          title: 'Egzersizler',
        }}
      />
      <Tab.Screen 
        name="Workout" 
        component={WorkoutScreen}
        options={{
          title: 'Antrenman',
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          title: 'İlerleme',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;