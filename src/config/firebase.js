import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDYMQhSuyA_Tldogm10Kc0t4L1bX3omXDs",
  authDomain: "gencerdas-1018c.firebaseapp.com",
  projectId: "gencerdas-1018c",
  storageBucket: "gencerdas-1018c.firebasestorage.app",
  messagingSenderId: "822449069912",
  appId: "1:822449069912:web:79052cf8b13b5af1a54f2d",
  measurementId: "G-6MQ06GQBMK",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  console.error('Firestore persistence error:', err);
}

// Configure Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
  display: 'popup'
});

// Export services
export { auth, db, googleProvider as provider, signInWithRedirect, database };
export default app; 