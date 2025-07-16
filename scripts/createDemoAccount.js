const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Firebase Admin SDK Initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

const auth = admin.auth();
const firestore = admin.firestore();

async function createDemoAccount() {
  try {
    console.log('🔄 Creating demo account...');

    // Demo kullanıcı oluştur
    const userRecord = await auth.createUser({
      email: 'demo@fitapp.com',
      password: 'demo123',
      displayName: 'Demo User',
      disabled: false,
    });

    console.log('✅ Demo user created:', userRecord.uid);

    // Firestore'da user profile oluştur
    await firestore.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: 'demo@fitapp.com',
      displayName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      activityLevel: 'moderate',
      goal: 'maintain',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Demo user profile created in Firestore');

    // Demo günlük verisi oluştur
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    await firestore.collection('users').doc(userRecord.uid)
      .collection('dailyData').doc(dateString).set({
      date: dateString,
      meals: {
        breakfast: [
          {
            id: 'demo-breakfast-1',
            name: 'Yumurta',
            calories: 155,
            protein: 13,
            carbs: 1,
            fat: 11,
            amount: 2,
            unit: 'adet'
          },
          {
            id: 'demo-breakfast-2',
            name: 'Tam Buğday Ekmeği',
            calories: 120,
            protein: 4,
            carbs: 20,
            fat: 2,
            amount: 1,
            unit: 'dilim'
          }
        ],
        lunch: [
          {
            id: 'demo-lunch-1',
            name: 'Tavuk Göğsü',
            calories: 231,
            protein: 43,
            carbs: 0,
            fat: 5,
            amount: 150,
            unit: 'gr'
          },
          {
            id: 'demo-lunch-2',
            name: 'Pilav',
            calories: 130,
            protein: 3,
            carbs: 28,
            fat: 0,
            amount: 100,
            unit: 'gr'
          }
        ],
        dinner: [
          {
            id: 'demo-dinner-1',
            name: 'Somon',
            calories: 208,
            protein: 22,
            carbs: 0,
            fat: 12,
            amount: 100,
            unit: 'gr'
          },
          {
            id: 'demo-dinner-2',
            name: 'Salata',
            calories: 25,
            protein: 1,
            carbs: 5,
            fat: 0,
            amount: 100,
            unit: 'gr'
          }
        ],
        snacks: [
          {
            id: 'demo-snack-1',
            name: 'Badem',
            calories: 170,
            protein: 6,
            carbs: 6,
            fat: 15,
            amount: 30,
            unit: 'gr'
          }
        ]
      },
      totalCalories: 1089,
      totalProtein: 92,
      totalCarbs: 60,
      totalFat: 45,
      waterIntake: 1500,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Demo daily data created');

    // Demo egzersiz verisi oluştur
    await firestore.collection('users').doc(userRecord.uid)
      .collection('workouts').doc(dateString).set({
      date: dateString,
      exercises: [
        {
          id: 'demo-exercise-1',
          name: 'Bench Press',
          sets: [
            { reps: 10, weight: 60, completed: true },
            { reps: 8, weight: 70, completed: true },
            { reps: 6, weight: 80, completed: true }
          ],
          duration: 15,
          completed: true
        },
        {
          id: 'demo-exercise-2',
          name: 'Squat',
          sets: [
            { reps: 12, weight: 50, completed: true },
            { reps: 10, weight: 60, completed: true },
            { reps: 8, weight: 70, completed: true }
          ],
          duration: 20,
          completed: true
        }
      ],
      totalDuration: 35,
      completed: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Demo workout data created');

    // Demo progress verisi oluştur
    await firestore.collection('users').doc(userRecord.uid)
      .collection('progress').doc(dateString).set({
      date: dateString,
      weight: 70,
      bodyFat: 15,
      muscleMass: 60,
      measurements: {
        chest: 95,
        waist: 80,
        hips: 90,
        biceps: 35,
        thighs: 55
      },
      photos: [],
      notes: 'Demo progress entry',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Demo progress data created');

    console.log('🎉 Demo account setup complete!');
    console.log('📧 Email: demo@fitapp.com');
    console.log('🔐 Password: demo123');
    console.log('🆔 User ID:', userRecord.uid);

  } catch (error) {
    console.error('❌ Error creating demo account:', error);
    
    // Hata durumunda kullanıcıyı sil
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  Demo account already exists. Skipping creation.');
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
  }
}

// Multiple demo accounts oluşturma fonksiyonu
async function createMultipleDemoAccounts() {
  const demoAccounts = [
    {
      email: 'demo@fitapp.com',
      password: 'demo123',
      displayName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      activityLevel: 'moderate',
      goal: 'maintain'
    },
    {
      email: 'john@fitapp.com',
      password: 'john123',
      displayName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: 'male',
      height: 180,
      weight: 80,
      activityLevel: 'active',
      goal: 'lose'
    },
    {
      email: 'jane@fitapp.com',
      password: 'jane123',
      displayName: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
      age: 28,
      gender: 'female',
      height: 165,
      weight: 60,
      activityLevel: 'moderate',
      goal: 'gain'
    }
  ];

  for (const account of demoAccounts) {
    try {
      console.log(`🔄 Creating account for ${account.email}...`);
      
      const userRecord = await auth.createUser({
        email: account.email,
        password: account.password,
        displayName: account.displayName,
        disabled: false,
      });

      await firestore.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: account.email,
        displayName: account.displayName,
        firstName: account.firstName,
        lastName: account.lastName,
        age: account.age,
        gender: account.gender,
        height: account.height,
        weight: account.weight,
        activityLevel: account.activityLevel,
        goal: account.goal,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Account created for ${account.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️  Account ${account.email} already exists. Skipping.`);
      } else {
        console.error(`❌ Error creating account ${account.email}:`, error.message);
      }
    }
  }
}

// Script çalıştırma
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--multiple')) {
    await createMultipleDemoAccounts();
  } else {
    await createDemoAccount();
  }
}

main().then(() => {
  console.log('🏁 Script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 