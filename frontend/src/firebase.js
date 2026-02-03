import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDCABaZBQkyM6tQSxKPbtkVTfbbhE-xfvo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'appzeto-afa29.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'appzeto-afa29',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'appzeto-afa29.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '761563654142',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:761563654142:web:e83be0c6cebb08623f42af',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XDE5YPP55W'
};

// Log Firebase config (without sensitive data)
if (import.meta.env.DEV) {
  console.log('🔥 Firebase initialized:', {
    projectId: firebaseConfig.projectId,
    messagingSenderId: firebaseConfig.messagingSenderId,
    hasApiKey: !!firebaseConfig.apiKey
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;

try {
  // Check if browser supports messaging
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.error('Firebase messaging initialization error:', error);
}

export { messaging, getToken, onMessage };
