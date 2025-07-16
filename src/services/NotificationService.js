import React, { createContext, useContext, useState, useCallback } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Notification colors
const NOTIFICATION_COLORS = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    background: '#4CAF50',
    icon: 'check-circle',
    iconColor: '#FFFFFF'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    background: '#F44336',
    icon: 'alert-circle',
    iconColor: '#FFFFFF'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    background: '#FF9800',
    icon: 'alert',
    iconColor: '#FFFFFF'
  },
  [NOTIFICATION_TYPES.INFO]: {
    background: '#2196F3',
    icon: 'information',
    iconColor: '#FFFFFF'
  }
};

// Notification Context
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Component
const NotificationItem = ({ notification, onDismiss }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

  const colors = NOTIFICATION_COLORS[notification.type];

  React.useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      handleDismiss();
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      onDismiss(notification.id);
    });
  }, [notification.id, slideAnim, opacityAnim, onDismiss]);

  return (
    <Animated.View 
      style={[
        styles.notificationContainer,
        {
          backgroundColor: colors.background,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.notificationContent}
        onPress={handleDismiss}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={colors.icon} 
            size={24} 
            color={colors.iconColor} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          {notification.message && (
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons 
            name="close" 
            size={20} 
            color={colors.iconColor} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: notification.type || NOTIFICATION_TYPES.INFO,
      title: notification.title || 'Bildirim',
      message: notification.message,
      duration: notification.duration || 4000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Data operation notification helpers
  const notifyDataOperation = useCallback((operation, dataType, success = true, customMessage = null) => {
    const operations = {
      create: {
        success: 'eklendi',
        error: 'eklenirken hata oluştu'
      },
      update: {
        success: 'güncellendi',
        error: 'güncellenirken hata oluştu'
      },
      delete: {
        success: 'silindi',
        error: 'silinirken hata oluştu'
      }
    };

    const dataTypes = {
      diet: 'Beslenme verisi',
      workout: 'Antrenman',
      progress: 'İlerleme verisi',
      recipe: 'Tarif',
      reminder: 'Hatırlatıcı',
      supplement: 'Supplement',
      water: 'Su takibi',
      weight: 'Kilo verisi',
      measurement: 'Ölçüm verisi',
      user: 'Kullanıcı profili',
      settings: 'Ayarlar'
    };

    const operationText = operations[operation];
    const dataTypeText = dataTypes[dataType] || dataType;

    const title = success ? 'Başarılı' : 'Hata';
    const message = customMessage || `${dataTypeText} ${operationText[success ? 'success' : 'error']}`;

    showNotification({
      type: success ? NOTIFICATION_TYPES.SUCCESS : NOTIFICATION_TYPES.ERROR,
      title,
      message,
      duration: 3000
    });
  }, [showNotification]);

  const contextValue = {
    notifications,
    showNotification,
    dismissNotification,
    clearAllNotifications,
    notifyDataOperation,
    // Helper functions for common operations
    notifySuccess: (title, message) => showNotification({ type: NOTIFICATION_TYPES.SUCCESS, title, message }),
    notifyError: (title, message) => showNotification({ type: NOTIFICATION_TYPES.ERROR, title, message }),
    notifyWarning: (title, message) => showNotification({ type: NOTIFICATION_TYPES.WARNING, title, message }),
    notifyInfo: (title, message) => showNotification({ type: NOTIFICATION_TYPES.INFO, title, message })
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onDismiss={dismissNotification}
      />
    </NotificationContext.Provider>
  );
};

// Notification Container
const NotificationContainer = ({ notifications, onDismiss }) => {
  return (
    <View style={styles.container}>
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onDismiss={onDismiss}
        />
      ))}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: StatusBar.currentHeight || 44,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  notificationContainer: {
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 60,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

// Hook for data operations with notifications
export const useDataOperations = () => {
  const { notifyDataOperation } = useNotification();

  const withNotification = useCallback((operation, dataType) => {
    return async (asyncOperation) => {
      try {
        const result = await asyncOperation();
        
        if (result && result.success !== false) {
          notifyDataOperation(operation, dataType, true);
        } else {
          notifyDataOperation(operation, dataType, false, result?.error);
        }
        
        return result;
      } catch (error) {
        notifyDataOperation(operation, dataType, false, error.message);
        throw error;
      }
    };
  }, [notifyDataOperation]);

  return {
    withNotification,
    notifyCreate: (dataType) => withNotification('create', dataType),
    notifyUpdate: (dataType) => withNotification('update', dataType),
    notifyDelete: (dataType) => withNotification('delete', dataType),
  };
}; 