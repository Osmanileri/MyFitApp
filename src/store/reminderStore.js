import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useReminderStore = create((set, get) => ({
  // Reminders state
  reminders: [],
  activeReminders: [],
  
  // Loading states
  isLoading: false,
  error: null,
  
  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Add reminder
  addReminder: async (reminder) => {
    try {
      set({ isLoading: true });
      const { reminders } = get();
      
      const newReminder = {
        id: Date.now().toString(),
        ...reminder,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      
      const updatedReminders = [...reminders, newReminder];
      
      set({ 
        reminders: updatedReminders,
        isLoading: false 
      });
      
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      get().updateActiveReminders();
      
    } catch (error) {
      set({ error: 'Hatırlatıcı eklenemedi', isLoading: false });
    }
  },
  
  // Update reminder
  updateReminder: async (id, updates) => {
    try {
      set({ isLoading: true });
      const { reminders } = get();
      
      const updatedReminders = reminders.map(reminder => 
        reminder.id === id ? { ...reminder, ...updates } : reminder
      );
      
      set({ 
        reminders: updatedReminders,
        isLoading: false 
      });
      
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      get().updateActiveReminders();
      
    } catch (error) {
      set({ error: 'Hatırlatıcı güncellenemedi', isLoading: false });
    }
  },
  
  // Delete reminder
  deleteReminder: async (id) => {
    try {
      const { reminders } = get();
      const updatedReminders = reminders.filter(reminder => reminder.id !== id);
      
      set({ reminders: updatedReminders });
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      get().updateActiveReminders();
      
    } catch (error) {
      set({ error: 'Hatırlatıcı silinemedi' });
    }
  },
  
  // Toggle reminder active status
  toggleReminder: async (id) => {
    try {
      const { reminders } = get();
      const updatedReminders = reminders.map(reminder => 
        reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
      );
      
      set({ reminders: updatedReminders });
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      get().updateActiveReminders();
      
    } catch (error) {
      set({ error: 'Hatırlatıcı durumu değiştirilemedi' });
    }
  },
  
  // Mark reminder as completed for today
  markAsCompleted: async (id) => {
    try {
      const { reminders } = get();
      const today = new Date().toISOString().split('T')[0];
      
      const updatedReminders = reminders.map(reminder => {
        if (reminder.id === id) {
          const completedDates = reminder.completedDates || [];
          return {
            ...reminder,
            completedDates: [...completedDates, today],
            lastCompleted: today
          };
        }
        return reminder;
      });
      
      set({ reminders: updatedReminders });
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      get().updateActiveReminders();
      
    } catch (error) {
      set({ error: 'Hatırlatıcı işaretlenemedi' });
    }
  },
  
  // Update active reminders (for display)
  updateActiveReminders: () => {
    const { reminders } = get();
    const activeReminders = reminders.filter(reminder => reminder.isActive);
    set({ activeReminders });
  },
  
  // Get reminders for specific type
  getRemindersByType: (type) => {
    const { reminders } = get();
    return reminders.filter(reminder => reminder.type === type);
  },
  
  // Get today's reminders
  getTodaysReminders: () => {
    const { reminders } = get();
    const today = new Date().toISOString().split('T')[0];
    
    return reminders.filter(reminder => {
      if (!reminder.isActive) return false;
      
      const completedDates = reminder.completedDates || [];
      const isCompletedToday = completedDates.includes(today);
      
      // Return reminders that are not completed today
      return !isCompletedToday;
    });
  },
  
  // Get reminder statistics
  getReminderStats: () => {
    const { reminders } = get();
    const activeCount = reminders.filter(r => r.isActive).length;
    const completedToday = reminders.filter(r => {
      const today = new Date().toISOString().split('T')[0];
      return r.completedDates && r.completedDates.includes(today);
    }).length;
    
    return {
      total: reminders.length,
      active: activeCount,
      completedToday,
      pendingToday: activeCount - completedToday
    };
  },
  
  // Load reminders from storage
  loadReminders: async () => {
    try {
      set({ isLoading: true });
      
      const remindersStr = await AsyncStorage.getItem('reminders');
      const reminders = remindersStr ? JSON.parse(remindersStr) : [];
      
      set({ 
        reminders,
        isLoading: false 
      });
      
      get().updateActiveReminders();
      
    } catch (error) {
      set({ error: 'Hatırlatıcılar yüklenemedi', isLoading: false });
    }
  },
  
  // Create default reminders
  createDefaultReminders: async () => {
    const defaultReminders = [
      {
        id: 'water-reminder',
        title: 'Su İç',
        description: 'Günde 8 bardak su içmeyi unutma',
        type: 'water',
        frequency: 'daily',
        time: '09:00',
        isActive: true,
        icon: 'water',
        color: '#2196F3'
      },
      {
        id: 'workout-reminder',
        title: 'Antrenman Zamanı',
        description: 'Günlük antrenmanını yapmayı unutma',
        type: 'workout',
        frequency: 'daily',
        time: '18:00',
        isActive: true,
        icon: 'dumbbell',
        color: '#FF9800'
      },
      {
        id: 'meal-reminder',
        title: 'Öğün Kaydı',
        description: 'Öğünlerini kaydetmeyi unutma',
        type: 'meal',
        frequency: 'daily',
        time: '12:00',
        isActive: true,
        icon: 'food',
        color: '#4CAF50'
      },
      {
        id: 'weight-reminder',
        title: 'Kilo Ölçümü',
        description: 'Haftalık kilo ölçümünü yap',
        type: 'weight',
        frequency: 'weekly',
        time: '07:00',
        isActive: true,
        icon: 'scale',
        color: '#9C27B0'
      }
    ];
    
    try {
      const { reminders } = get();
      
      // Only add defaults if no reminders exist
      if (reminders.length === 0) {
        const remindersWithTimestamp = defaultReminders.map(reminder => ({
          ...reminder,
          createdAt: new Date().toISOString(),
          completedDates: []
        }));
        
        set({ reminders: remindersWithTimestamp });
        await AsyncStorage.setItem('reminders', JSON.stringify(remindersWithTimestamp));
        get().updateActiveReminders();
      }
    } catch (error) {
      set({ error: 'Varsayılan hatırlatıcılar oluşturulamadı' });
    }
  },
  
  // Reset all reminders
  resetReminders: async () => {
    try {
      set({ reminders: [], activeReminders: [] });
      await AsyncStorage.removeItem('reminders');
    } catch (error) {
      set({ error: 'Hatırlatıcılar sıfırlanamadı' });
    }
  }
})); 