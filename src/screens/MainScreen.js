import React from 'react';
import { View, Platform, StatusBar, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DietScreen from './DietScreen';
import WorkoutDashboardScreen from './WorkoutDashboardScreen';
import ProgressScreen from './ProgressScreen';
import ProfileScreen from './ProfileScreen';
import { Colors } from '../theme/appTheme';
import { appTheme } from '../theme/simpleTheme';

const Tab = createBottomTabNavigator();

// Custom Tab Bar Component with Gradient Background
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
    }}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
        style={{
          flexDirection: 'row',
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 0.5,
          borderTopColor: appTheme.colors.border,
          ...appTheme.shadows.medium,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Icon mapping
          let iconName;
          switch (route.name) {
            case 'Diet':
              iconName = 'nutrition';
              break;
            case 'Workout':
              iconName = 'dumbbell';
              break;
            case 'Progress':
              iconName = 'chart-timeline-variant';
              break;
            case 'Profile':
              iconName = 'account-circle';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <View
              key={route.key}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 8,
              }}
            >
              {isFocused && (
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: 3,
                    borderRadius: 3,
                  }}
                />
              )}
              
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: isFocused ? Colors.primary + '10' : 'transparent',
                  minWidth: 60,
                }}
              >
                <View style={{
                  padding: 8,
                  borderRadius: 12,
                  backgroundColor: isFocused ? Colors.primary : 'transparent',
                }}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={24}
                    color={isFocused ? Colors.white : Colors.tab.inactive}
                  />
                </View>
                
                <Text style={{
                  fontSize: 12,
                  fontWeight: isFocused ? '600' : 'normal',
                  color: isFocused ? Colors.tab.active : Colors.tab.inactive,
                  marginTop: 4,
                  textAlign: 'center',
                }}>
                  {label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </LinearGradient>
    </View>
  );
};

export default function MainScreen() {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={appTheme?.colors?.background || '#F8FAFC'}
        translucent={false}
      />
      
      <Tab.Navigator
        initialRouteName="Diet"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tab.Screen 
          name="Diet" 
          component={DietScreen} 
          options={{ 
            title: 'Diyet',
            tabBarLabel: 'Diyet',
          }} 
        />
        <Tab.Screen 
          name="Workout" 
          component={WorkoutDashboardScreen} 
          options={{ 
            title: 'Antrenman',
            tabBarLabel: 'Antrenman',
          }} 
        />
        <Tab.Screen 
          name="Progress" 
          component={ProgressScreen} 
          options={{ 
            title: 'İlerleme',
            tabBarLabel: 'İlerleme',
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: 'Profil',
            tabBarLabel: 'Profil',
          }} 
        />
      </Tab.Navigator>
    </>
  );
} 