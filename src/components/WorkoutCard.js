import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WorkoutTheme from '../theme/workoutTheme';

const WorkoutCard = ({ 
  workout, 
  onPress,
  showStats = true,
  showBadge = false,
  badgeText = '',
  gradientColors = ['#1E1E1E', '#2D2D2D'],
  style,
  ...props 
}) => {
  // Use centralized theme
  const theme = WorkoutTheme;
  
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}dk`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}sa ${mins}dk`;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  const getWorkoutIcon = (type) => {
    const iconMap = {
      'push': 'weight-lifter',
      'pull': 'arm-flex',
      'legs': 'run',
      'upper': 'human-handsup',
      'lower': 'human-male-height',
      'cardio': 'heart-pulse',
      'full': 'account-outline',
    };
    
    const workoutType = type?.toLowerCase() || 'full';
    return iconMap[workoutType] || 'dumbbell';
  };

  return (
    <TouchableOpacity 
      style={[cardStyles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={gradientColors}
        style={cardStyles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Badge */}
        {showBadge && badgeText && (
          <View style={[cardStyles.badge, { backgroundColor: theme?.primary || theme?.colors?.primary || '#FBC02D' }]}>
            <Text style={[cardStyles.badgeText, { color: theme.text }]}>
              {badgeText}
            </Text>
          </View>
        )}

        {/* Content */}
        <View style={cardStyles.content}>
          {/* Header */}
          <View style={cardStyles.header}>
            <View style={cardStyles.iconContainer}>
              <MaterialCommunityIcons 
                name={getWorkoutIcon(workout?.type)} 
                size={24} 
                color={theme.primary} 
              />
            </View>
            <View style={cardStyles.headerText}>
              <Text style={[cardStyles.title, { color: theme.text }]} numberOfLines={1}>
                {workout?.name || 'Antrenman'}
              </Text>
              <Text style={[cardStyles.subtitle, { color: theme.textSecondary }]}>
                {formatDate(workout?.date || new Date())}
              </Text>
            </View>
          </View>

          {/* Stats */}
          {showStats && (
            <View style={cardStyles.stats}>
              <View style={cardStyles.statItem}>
                <Text style={[cardStyles.statValue, { color: theme.text }]}>
                  {formatDuration(workout?.duration || 0)}
                </Text>
                <Text style={[cardStyles.statLabel, { color: theme.textSecondary }]}>
                  Süre
                </Text>
              </View>
              <View style={cardStyles.statItem}>
                <Text style={[cardStyles.statValue, { color: theme.text }]}>
                  {workout?.exercises?.length || 0}
                </Text>
                <Text style={[cardStyles.statLabel, { color: theme.textSecondary }]}>
                  Egzersiz
                </Text>
              </View>
              <View style={cardStyles.statItem}>
                <Text style={[cardStyles.statValue, { color: theme.text }]}>
                  {workout?.totalSets || 0}
                </Text>
                <Text style={[cardStyles.statLabel, { color: theme.textSecondary }]}>
                  Set
                </Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const cardStyles = {
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
};

export default WorkoutCard; 