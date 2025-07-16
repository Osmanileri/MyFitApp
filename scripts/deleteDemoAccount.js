const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Firebase Admin SDK Initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-project-id.firebaseio.com'
  });
}

const auth = admin.auth();
const firestore = admin.firestore();

async function deleteUserData(userId) {
  try {
    console.log(`🗑️  Deleting user data for: ${userId}`);
    
    // Delete user subcollections
    const collections = [
      'dailyData',
      'workouts',
      'progress',
      'reminders',
      'supplements',
      'waterIntake',
      'nutritionGoals',
      'recipes',
      'socialActivity',
      'settings'
    ];
    
    for (const collection of collections) {
      const snapshot = await firestore.collection('users').doc(userId).collection(collection).get();
      
      const batch = firestore.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      if (snapshot.docs.length > 0) {
        await batch.commit();
        console.log(`   ✅ Deleted ${snapshot.docs.length} documents from ${collection}`);
      }
    }
    
    // Delete user document
    await firestore.collection('users').doc(userId).delete();
    console.log(`   ✅ Deleted user document`);
    
  } catch (error) {
    console.error(`❌ Error deleting user data:`, error);
  }
}

async function deleteDemoAccount() {
  try {
    console.log('🔄 Deleting demo account...');
    
    // Find demo user by email
    const userRecord = await auth.getUserByEmail('demo@fitapp.com');
    console.log('📧 Found demo user:', userRecord.uid);
    
    // Delete Firestore data first
    await deleteUserData(userRecord.uid);
    
    // Delete Firebase Auth user
    await auth.deleteUser(userRecord.uid);
    console.log('✅ Demo user deleted from Firebase Auth');
    
    console.log('🎉 Demo account deletion complete!');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('⚠️  Demo account not found. Nothing to delete.');
    } else {
      console.error('❌ Error deleting demo account:', error);
    }
  }
}

async function deleteMultipleDemoAccounts() {
  const demoEmails = [
    'demo@fitapp.com',
    'john@fitapp.com',
    'jane@fitapp.com'
  ];
  
  for (const email of demoEmails) {
    try {
      console.log(`🔄 Deleting account: ${email}`);
      
      const userRecord = await auth.getUserByEmail(email);
      await deleteUserData(userRecord.uid);
      await auth.deleteUser(userRecord.uid);
      
      console.log(`✅ Account ${email} deleted successfully`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`⚠️  Account ${email} not found. Skipping.`);
      } else {
        console.error(`❌ Error deleting account ${email}:`, error);
      }
    }
  }
}

async function cleanupOrphanedData() {
  try {
    console.log('🧹 Cleaning up orphaned data...');
    
    const usersSnapshot = await firestore.collection('users').get();
    const userIds = usersSnapshot.docs.map(doc => doc.id);
    
    // Check for orphaned analytics data
    const analyticsSnapshot = await firestore.collection('analytics').get();
    const batch = firestore.batch();
    let orphanedCount = 0;
    
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId && !userIds.includes(data.userId)) {
        batch.delete(doc.ref);
        orphanedCount++;
      }
    });
    
    if (orphanedCount > 0) {
      await batch.commit();
      console.log(`✅ Cleaned up ${orphanedCount} orphaned analytics records`);
    }
    
    // Check for orphaned feedback data
    const feedbackSnapshot = await firestore.collection('feedback').get();
    const feedbackBatch = firestore.batch();
    let orphanedFeedbackCount = 0;
    
    feedbackSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId && !userIds.includes(data.userId)) {
        feedbackBatch.delete(doc.ref);
        orphanedFeedbackCount++;
      }
    });
    
    if (orphanedFeedbackCount > 0) {
      await feedbackBatch.commit();
      console.log(`✅ Cleaned up ${orphanedFeedbackCount} orphaned feedback records`);
    }
    
    console.log('🧹 Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Script çalıştırma
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--multiple')) {
    await deleteMultipleDemoAccounts();
  } else if (args.includes('--cleanup')) {
    await cleanupOrphanedData();
  } else {
    await deleteDemoAccount();
  }
}

main().then(() => {
  console.log('🏁 Delete script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Delete script failed:', error);
  process.exit(1);
}); 