import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2W5AM411QXG44j1WAvLZ8g1-ivNWdaDo",
  authDomain: "easy-notes-demo.firebaseapp.com",
  projectId: "easy-notes-demo",
  storageBucket: "easy-notes-demo.firebasestorage.app",
  messagingSenderId: "920940657834",
  appId: "1:920940657834:web:59695d0c695da49681a4d3",
  measurementId: "G-WG226GQZVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
