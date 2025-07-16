// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "fitapp-demo.firebaseapp.com",
  projectId: "fitapp-demo",
  storageBucket: "fitapp-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

// Firebase'i initialize et
const app = initializeApp(firebaseConfig);

// Firebase servislerini al
export const auth = getAuth(app);
export const firestore = getFirestore(app);

console.log('Firebase initialized with demo config - Ready for authentication');

export default app; 