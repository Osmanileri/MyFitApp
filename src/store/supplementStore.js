import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqliteService from '../services/SQLiteService';
import { useDataOperations } from '../services/NotificationService';

export const useSupplementStore = create((set, get) => ({
  // Supplements state
  supplements: [],
  
  // Statistics
  totalSupplements: 0,
  takenToday: 0,
  completionRate: 0,
  
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
      
      // Load user's supplements
      await get().loadSupplements();
      
      // Create default supplements if none exist
      const supplements = get().supplements;
      if (supplements.length === 0) {
        await get().createDefaultSupplements();
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error initializing supplement store:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Load supplements from database
  loadSupplements: async () => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) {
        set({ supplements: [] });
        return;
      }
      
      const supplements = await sqliteService.getSupplements(user.uid);
      
      // Calculate statistics
      const totalSupplements = supplements.length;
      const takenToday = supplements.filter(s => s.taken).length;
      const completionRate = totalSupplements > 0 ? (takenToday / totalSupplements) * 100 : 0;
      
      set({ 
        supplements,
        totalSupplements,
        takenToday,
        completionRate
      });
      
    } catch (error) {
      console.error('Error loading supplements:', error);
      set({ error: error.message });
    }
  },
  
  // Create default supplements
  createDefaultSupplements: async () => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return;
      
      const defaultSupplements = [
        {
          name: 'Vitamin D3',
          dose: '2000 IU',
          time: '08:00',
          taken: false,
          color: '#ff9800'
        },
        {
          name: 'Omega-3',
          dose: '1000mg',
          time: '12:00',
          taken: false,
          color: '#4caf50'
        },
        {
          name: 'Protein',
          dose: '30g',
          time: '20:00',
          taken: false,
          color: '#9c27b0'
        }
      ];
      
      for (const supplement of defaultSupplements) {
        await sqliteService.saveSupplement(user.uid, supplement);
      }
      
      await get().loadSupplements();
    } catch (error) {
      console.error('Error creating default supplements:', error);
    }
  },
  
  // Add supplement with notification
  addSupplement: async (supplementData) => {
    const { performDataOperation } = useDataOperations();
    
    return performDataOperation(
      async () => {
        const userStore = await import('./authStore');
        const user = userStore.default.getState().user;
        
        if (!user) {
          throw new Error('Kullanıcı oturum açmamış');
        }
        
        await sqliteService.saveSupplement(user.uid, supplementData);
        await get().loadSupplements();
        
        return { success: true };
      },
      'supplement',
      'create',
      `${supplementData.name} eklendi`
    );
  },
  
  // Update supplement with notification
  updateSupplement: async (supplementId, updateData) => {
    const { performDataOperation } = useDataOperations();
    
    return performDataOperation(
      async () => {
        await sqliteService.updateSupplement(supplementId, updateData);
        await get().loadSupplements();
        
        return { success: true };
      },
      'supplement',
      'update',
      'Supplement güncellendi'
    );
  },
  
  // Delete supplement with notification
  deleteSupplement: async (supplementId) => {
    const { performDataOperation } = useDataOperations();
    
    return performDataOperation(
      async () => {
        await sqliteService.deleteSupplement(supplementId);
        await get().loadSupplements();
        
        return { success: true };
      },
      'supplement',
      'delete',
      'Supplement silindi'
    );
  },
  
  // Toggle supplement taken status
  toggleSupplementTaken: async (supplementId) => {
    const { performDataOperation } = useDataOperations();
    
    return performDataOperation(
      async () => {
        const supplements = get().supplements;
        const supplement = supplements.find(s => s.supplementId === supplementId);
        
        if (!supplement) {
          throw new Error('Supplement bulunamadı');
        }
        
        const newTakenStatus = !supplement.taken;
        await sqliteService.updateSupplement(supplementId, { taken: newTakenStatus });
        await get().loadSupplements();
        
        return { success: true };
      },
      'supplement',
      'update',
      'Supplement durumu güncellendi'
    );
  },
  
  // Get supplement by ID
  getSupplementById: (supplementId) => {
    const supplements = get().supplements;
    return supplements.find(s => s.supplementId === supplementId);
  },
  
  // Get supplements by time
  getSupplementsByTime: (time) => {
    const supplements = get().supplements;
    return supplements.filter(s => s.time === time);
  },
  
  // Get taken supplements
  getTakenSupplements: () => {
    const supplements = get().supplements;
    return supplements.filter(s => s.taken);
  },
  
  // Get remaining supplements
  getRemainingSupplements: () => {
    const supplements = get().supplements;
    return supplements.filter(s => !s.taken);
  },
  
  // Reset all supplements for new day
  resetDailySupplements: async () => {
    const { performDataOperation } = useDataOperations();
    
    return performDataOperation(
      async () => {
        const supplements = get().supplements;
        
        for (const supplement of supplements) {
          await sqliteService.updateSupplement(supplement.supplementId, { taken: false });
        }
        
        await get().loadSupplements();
        
        return { success: true };
      },
      'supplement',
      'update',
      'Günlük supplementler sıfırlandı'
    );
  },
  
  // Get completion statistics
  getCompletionStats: () => {
    const { totalSupplements, takenToday, completionRate } = get();
    
    return {
      totalSupplements,
      takenToday,
      remaining: totalSupplements - takenToday,
      completionRate: Math.round(completionRate)
    };
  }
}));

export default useSupplementStore; 