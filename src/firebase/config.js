// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2W5AM411QXG44j1WAvLZ8g1-ivNWdaDo",
  authDomain: "easy-notes-demo.firebaseapp.com",
  projectId: "easy-notes-demo",
  storageBucket: "easy-notes-demo.appspot.com",
  messagingSenderId: "920940657834",
  appId: "1:920940657834:web:59695d0c695da49681a4d3",
  measurementId: "G-WG226GQZVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
