import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqliteService from '../services/SQLiteService';
import { useDataOperations } from '../services/NotificationService';

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
  
  // Initialize store
  initializeStore: async () => {
    try {
      set({ isLoading: true });
      
      // Initialize SQLite database
      await sqliteService.initializeDatabase();
      
      // Load user's reminders
      await get().loadReminders();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error initializing reminder store:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Add reminder
  addReminder: async (reminder) => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      set({ isLoading: true });
      
      const newReminder = {
        reminderId: `reminder_${Date.now()}`,
        title: reminder.title,
        description: reminder.description || '',
        type: reminder.type || 'general',
        frequency: reminder.frequency || 'daily',
        time: reminder.time || '09:00',
        isActive: reminder.isActive !== undefined ? reminder.isActive : true,
        color: reminder.color || '#2196F3',
        icon: reminder.icon || 'bell',
        completedDates: reminder.completedDates || [],
        lastCompleted: reminder.lastCompleted || null,
        createdAt: new Date().toISOString(),
      };
      
      await sqliteService.saveReminder(user.uid, newReminder);
      
      set(state => ({
        reminders: [...state.reminders, newReminder],
        isLoading: false
      }));
      
      get().updateActiveReminders();
      
      return { success: true };
    } catch (error) {
      console.error('Error adding reminder:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Update reminder
  updateReminder: async (id, updates) => {
    try {
      set({ isLoading: true });
      
      await sqliteService.updateReminder(id, updates);
      
      set(state => ({
        reminders: state.reminders.map(reminder => 
          reminder.reminderId === id ? { ...reminder, ...updates } : reminder
        ),
        isLoading: false
      }));
      
      get().updateActiveReminders();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating reminder:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Delete reminder
  deleteReminder: async (id) => {
    try {
      await sqliteService.deleteReminder(id);
      
      set(state => ({
        reminders: state.reminders.filter(reminder => reminder.reminderId !== id)
      }));
      
      get().updateActiveReminders();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting reminder:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },
  
  // Toggle reminder active status
  toggleReminder: async (id) => {
    try {
      const { reminders } = get();
      const reminder = reminders.find(r => r.reminderId === id);
      
      if (!reminder) return { success: false, error: 'Reminder not found' };
      
      const newActiveStatus = !reminder.isActive;
      
      await sqliteService.updateReminder(id, { isActive: newActiveStatus });
      
      set(state => ({
        reminders: state.reminders.map(reminder => 
          reminder.reminderId === id ? { ...reminder, isActive: newActiveStatus } : reminder
        )
      }));
      
      get().updateActiveReminders();
      
      return { success: true };
    } catch (error) {
      console.error('Error toggling reminder:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },
  
  // Mark reminder as completed for today
  markAsCompleted: async (id) => {
    try {
      const { reminders } = get();
      const reminder = reminders.find(r => r.reminderId === id);
      
      if (!reminder) return { success: false, error: 'Reminder not found' };
      
      const today = new Date().toISOString().split('T')[0];
      const completedDates = reminder.completedDates || [];
      
      if (!completedDates.includes(today)) {
        const updatedCompletedDates = [...completedDates, today];
        
        await sqliteService.updateReminder(id, {
          completedDates: updatedCompletedDates,
          lastCompleted: today
        });
        
        set(state => ({
          reminders: state.reminders.map(reminder => 
            reminder.reminderId === id ? {
              ...reminder,
              completedDates: updatedCompletedDates,
              lastCompleted: today
            } : reminder
          )
        }));
        
        get().updateActiveReminders();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error marking reminder as completed:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
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
    const today = new Date().toISOString().split('T')[0];
    const completedToday = reminders.filter(r => {
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
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      set({ isLoading: true });
      
      const reminders = await sqliteService.getReminders(user.uid);
      
      set({ 
        reminders,
        isLoading: false 
      });
      
      get().updateActiveReminders();
      
      return { success: true };
    } catch (error) {
      console.error('Error loading reminders:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Create default reminders
  createDefaultReminders: async () => {
    const defaultReminders = [
      {
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
        for (const reminder of defaultReminders) {
          await get().addReminder(reminder);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error creating default reminders:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Clear all reminders
  clearAllReminders: async () => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      // Clear from SQLite
      await sqliteService.clearUserData(user.uid);
      
      // Clear local state
      set({
        reminders: [],
        activeReminders: []
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing reminders:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  }
}));

// Create wrapper functions with notifications
export const useReminderStoreWithNotifications = () => {
  const store = useReminderStore();
  
  // Import the hook inside the component
  const { notifyCreate, notifyUpdate, notifyDelete } = useDataOperations();

  return {
    ...store,
    
    // Wrap reminder operations with notifications
    addReminder: notifyCreate('reminder')(store.addReminder),
    updateReminder: notifyUpdate('reminder')(store.updateReminder),
    deleteReminder: notifyDelete('reminder')(store.deleteReminder),
    toggleReminder: notifyUpdate('reminder')(store.toggleReminder),
    markAsCompleted: notifyUpdate('reminder')(store.markAsCompleted),
    
    // Wrap clear data with notifications
    clearAllReminders: notifyDelete('reminder')(store.clearAllReminders),
  };
};

export default useReminderStore; 