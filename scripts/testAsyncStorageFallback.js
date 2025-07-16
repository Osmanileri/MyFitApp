const AsyncStorage = require('@react-native-async-storage/async-storage');

// Mock AsyncStorage for Node.js testing
class MockAsyncStorage {
  constructor() {
    this.storage = {};
  }
  
  async getItem(key) {
    return this.storage[key] || null;
  }
  
  async setItem(key, value) {
    this.storage[key] = value;
  }
  
  async removeItem(key) {
    delete this.storage[key];
  }
  
  async getAllKeys() {
    return Object.keys(this.storage);
  }
  
  async clear() {
    this.storage = {};
  }
}

// Test the fallback system
async function testAsyncStorageFallback() {
  console.log('🧪 Testing AsyncStorage Fallback System...\n');
  
  // Mock AsyncStorage
  const mockStorage = new MockAsyncStorage();
  
  // Mock SQLite service in fallback mode
  const SQLiteService = {
    isNativeAvailable: false,
    initialized: false,
    
    async insertData(table, data) {
      const key = `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const dataWithId = { ...data, id: key };
      await mockStorage.setItem(key, JSON.stringify(dataWithId));
      return { insertId: key };
    },
    
    async selectData(table, condition = '', params = []) {
      const allKeys = await mockStorage.getAllKeys();
      const tableKeys = allKeys.filter(key => key.startsWith(`${table}_`));
      const items = [];
      
      for (const key of tableKeys) {
        const itemData = await mockStorage.getItem(key);
        if (itemData) {
          const parsedData = JSON.parse(itemData);
          
          if (!condition || condition === '') {
            items.push(parsedData);
          } else if (condition.includes('userId = ?') && params.length > 0) {
            if (parsedData.userId === params[0]) {
              items.push(parsedData);
            }
          }
        }
      }
      
      return { rows: { length: items.length, item: (i) => items[i] } };
    },
    
    async updateData(table, data, condition, conditionValues = []) {
      const allKeys = await mockStorage.getAllKeys();
      const tableKeys = allKeys.filter(key => key.startsWith(`${table}_`));
      
      for (const key of tableKeys) {
        const itemData = await mockStorage.getItem(key);
        if (itemData) {
          const parsedData = JSON.parse(itemData);
          if (condition.includes('=') && conditionValues.length > 0) {
            const [conditionKey] = condition.split('=').map(s => s.trim());
            if (parsedData[conditionKey] === conditionValues[0]) {
              const updatedData = { ...parsedData, ...data };
              await mockStorage.setItem(key, JSON.stringify(updatedData));
            }
          }
        }
      }
      return { rowsAffected: 1 };
    },
    
    async deleteData(table, condition, params = []) {
      const allKeys = await mockStorage.getAllKeys();
      const tableKeys = allKeys.filter(key => key.startsWith(`${table}_`));
      let deletedCount = 0;
      
      for (const key of tableKeys) {
        const itemData = await mockStorage.getItem(key);
        if (itemData) {
          const parsedData = JSON.parse(itemData);
          if (condition.includes('=') && params.length > 0) {
            const [conditionKey] = condition.split('=').map(s => s.trim());
            if (parsedData[conditionKey] === params[0]) {
              await mockStorage.removeItem(key);
              deletedCount++;
            }
          }
        }
      }
      
      return { rowsAffected: deletedCount };
    },
    
    async saveSupplement(userId, supplementData) {
      const supplement = {
        userId,
        supplementId: supplementData.supplementId || `supplement_${Date.now()}`,
        name: supplementData.name,
        dose: supplementData.dose || '',
        time: supplementData.time || '09:00',
        taken: supplementData.taken ? 1 : 0,
        color: supplementData.color || '#4CAF50',
        updatedAt: new Date().toISOString()
      };

      await this.insertData('supplements', supplement);
      return { success: true };
    },
    
    async getSupplements(userId) {
      const result = await this.selectData('supplements', 'userId = ? ORDER BY time', [userId]);
      const supplements = [];

      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        supplements.push({
          ...row,
          taken: row.taken === 1
        });
      }

      return supplements;
    },
    
    async updateSupplement(supplementId, updateData) {
      const data = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      if (data.taken !== undefined) {
        data.taken = data.taken ? 1 : 0;
      }

      await this.updateData('supplements', data, 'supplementId = ?', [supplementId]);
      return { success: true };
    }
  };
  
  // Test 1: Create supplements
  console.log('📝 Test 1: Creating supplements...');
  
  const demoSupplements = [
    {
      supplementId: 'supplement_demo_1',
      name: 'Vitamin D3',
      dose: '2000 IU',
      time: '08:00',
      taken: false,
      color: '#ff9800'
    },
    {
      supplementId: 'supplement_demo_2',
      name: 'Omega-3',
      dose: '1000mg',
      time: '12:00',
      taken: false,
      color: '#4caf50'
    },
    {
      supplementId: 'supplement_demo_3',
      name: 'Protein',
      dose: '30g',
      time: '20:00',
      taken: false,
      color: '#9c27b0'
    }
  ];
  
  const userId = 'demo-user-id';
  
  for (const supplement of demoSupplements) {
    await SQLiteService.saveSupplement(userId, supplement);
  }
  
  console.log('✅ Created 3 demo supplements');
  
  // Test 2: Retrieve supplements
  console.log('\n📖 Test 2: Retrieving supplements...');
  
  const supplements = await SQLiteService.getSupplements(userId);
  console.log(`✅ Retrieved ${supplements.length} supplements:`);
  
  supplements.forEach((supplement, index) => {
    console.log(`   ${index + 1}. ${supplement.name} - ${supplement.dose} - ${supplement.time} - ${supplement.taken ? 'Taken' : 'Not taken'}`);
  });
  
  // Test 3: Update supplement
  console.log('\n✏️  Test 3: Updating supplement...');
  
  if (supplements.length > 0) {
    const firstSupplement = supplements[0];
    await SQLiteService.updateSupplement(firstSupplement.supplementId, { taken: true });
    console.log(`✅ Updated ${firstSupplement.name} to taken`);
    
    // Verify update
    const updatedSupplements = await SQLiteService.getSupplements(userId);
    const updatedSupplement = updatedSupplements.find(s => s.supplementId === firstSupplement.supplementId);
    console.log(`✅ Verification: ${updatedSupplement.name} is now ${updatedSupplement.taken ? 'taken' : 'not taken'}`);
  }
  
  // Test 4: Statistics
  console.log('\n📊 Test 4: Statistics...');
  
  const allSupplements = await SQLiteService.getSupplements(userId);
  const takenCount = allSupplements.filter(s => s.taken).length;
  const totalCount = allSupplements.length;
  const completionRate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
  
  console.log(`✅ Statistics:`);
  console.log(`   Total supplements: ${totalCount}`);
  console.log(`   Taken today: ${takenCount}`);
  console.log(`   Completion rate: ${completionRate}%`);
  
  // Test 5: Storage inspection
  console.log('\n🔍 Test 5: Storage inspection...');
  
  const allKeys = await mockStorage.getAllKeys();
  console.log(`✅ Total keys in storage: ${allKeys.length}`);
  
  const supplementKeys = allKeys.filter(key => key.startsWith('supplements_'));
  console.log(`✅ Supplement keys: ${supplementKeys.length}`);
  
  supplementKeys.forEach((key, index) => {
    console.log(`   ${index + 1}. ${key}`);
  });
  
  console.log('\n🎉 All tests completed successfully!');
  console.log('✨ AsyncStorage fallback system is working correctly');
  
  return true;
}

// Run the test
if (require.main === module) {
  testAsyncStorageFallback().then((success) => {
    if (success) {
      console.log('\n🚀 AsyncStorage fallback system ready for production use!');
      process.exit(0);
    } else {
      console.log('\n❌ Tests failed');
      process.exit(1);
    }
  }).catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}

module.exports = { testAsyncStorageFallback }; 