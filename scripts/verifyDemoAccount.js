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

async function verifyUserData(userId) {
  try {
    console.log(`🔍 Verifying user data for: ${userId}`);
    
    // Check user document
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.log('❌ User document not found');
      return false;
    }
    
    const userData = userDoc.data();
    console.log('✅ User document found');
    console.log('   📧 Email:', userData.email);
    console.log('   👤 Name:', userData.displayName);
    console.log('   🏃 Activity Level:', userData.activityLevel);
    console.log('   🎯 Goal:', userData.goal);
    
    // Check subcollections
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
      console.log(`   📁 ${collection}: ${snapshot.docs.length} documents`);
      
      if (collection === 'dailyData' && snapshot.docs.length > 0) {
        const dailyData = snapshot.docs[0].data();
        console.log('     🍽️  Meals:', Object.keys(dailyData.meals || {}));
        console.log('     📊 Calories:', dailyData.totalCalories || 0);
      }
      
      if (collection === 'workouts' && snapshot.docs.length > 0) {
        const workoutData = snapshot.docs[0].data();
        console.log('     💪 Exercises:', workoutData.exercises?.length || 0);
        console.log('     ⏱️  Duration:', workoutData.totalDuration || 0, 'min');
      }
    }
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error verifying user data:`, error);
    return false;
  }
}

async function verifyDemoAccount() {
  try {
    console.log('🔍 Verifying demo account...');
    
    // Check Firebase Auth
    const userRecord = await auth.getUserByEmail('demo@fitapp.com');
    console.log('✅ Demo user found in Firebase Auth');
    console.log('   🆔 UID:', userRecord.uid);
    console.log('   📧 Email:', userRecord.email);
    console.log('   👤 Display Name:', userRecord.displayName);
    console.log('   📅 Created:', new Date(userRecord.metadata.creationTime).toLocaleDateString());
    console.log('   🔐 Email Verified:', userRecord.emailVerified);
    console.log('   🚫 Disabled:', userRecord.disabled);
    
    // Check Firestore data
    const isDataValid = await verifyUserData(userRecord.uid);
    
    if (isDataValid) {
      console.log('🎉 Demo account verification successful!');
      return true;
    } else {
      console.log('❌ Demo account data is incomplete or invalid');
      return false;
    }
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('❌ Demo account not found in Firebase Auth');
    } else {
      console.error('❌ Error verifying demo account:', error);
    }
    return false;
  }
}

async function verifyMultipleDemoAccounts() {
  const demoEmails = [
    'demo@fitapp.com',
    'john@fitapp.com',
    'jane@fitapp.com'
  ];
  
  let allValid = true;
  
  for (const email of demoEmails) {
    try {
      console.log(`\n🔍 Verifying account: ${email}`);
      
      const userRecord = await auth.getUserByEmail(email);
      const isValid = await verifyUserData(userRecord.uid);
      
      if (isValid) {
        console.log(`✅ Account ${email} is valid`);
      } else {
        console.log(`❌ Account ${email} has issues`);
        allValid = false;
      }
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`❌ Account ${email} not found`);
        allValid = false;
      } else {
        console.error(`❌ Error verifying account ${email}:`, error);
        allValid = false;
      }
    }
  }
  
  return allValid;
}

async function checkSecurityRules() {
  try {
    console.log('\n🔒 Checking security rules...');
    
    // This is a basic check - in production you'd want more comprehensive testing
    const testUserId = 'test-user-123';
    
    try {
      // This should fail if security rules are working
      await firestore.collection('users').doc(testUserId).get();
      console.log('⚠️  Security rules might be too permissive');
    } catch (error) {
      console.log('✅ Security rules appear to be working');
    }
    
  } catch (error) {
    console.error('❌ Error checking security rules:', error);
  }
}

async function generateHealthReport() {
  try {
    console.log('\n📊 Generating health report...');
    
    // Count total users
    const usersSnapshot = await firestore.collection('users').get();
    console.log(`👥 Total users: ${usersSnapshot.docs.length}`);
    
    // Count active users (users with recent activity)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let activeUsers = 0;
    
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      if (userData.updatedAt && userData.updatedAt.toDate() > thirtyDaysAgo) {
        activeUsers++;
      }
    }
    
    console.log(`🟢 Active users (last 30 days): ${activeUsers}`);
    
    // Check for demo accounts
    const demoUsers = usersSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.email && data.email.includes('demo') || data.email.includes('test');
    });
    
    console.log(`🧪 Demo/Test accounts: ${demoUsers.length}`);
    
    // Check analytics data
    const analyticsSnapshot = await firestore.collection('analytics').get();
    console.log(`📈 Analytics records: ${analyticsSnapshot.docs.length}`);
    
    // Check feedback data
    const feedbackSnapshot = await firestore.collection('feedback').get();
    console.log(`💬 Feedback records: ${feedbackSnapshot.docs.length}`);
    
    console.log('\n🎯 Health report complete!');
    
  } catch (error) {
    console.error('❌ Error generating health report:', error);
  }
}

// Script çalıştırma
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--multiple')) {
    const allValid = await verifyMultipleDemoAccounts();
    if (allValid) {
      console.log('\n🎉 All demo accounts are valid!');
    } else {
      console.log('\n❌ Some demo accounts have issues');
    }
  } else if (args.includes('--security')) {
    await checkSecurityRules();
  } else if (args.includes('--health')) {
    await generateHealthReport();
  } else if (args.includes('--all')) {
    await verifyDemoAccount();
    await checkSecurityRules();
    await generateHealthReport();
  } else {
    await verifyDemoAccount();
  }
}

main().then(() => {
  console.log('\n🏁 Verification script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Verification script failed:', error);
  process.exit(1);
}); 