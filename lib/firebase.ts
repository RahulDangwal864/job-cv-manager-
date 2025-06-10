import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "job-cv-manager-8b3b1.firebaseapp.com",
  projectId: "job-cv-manager-8b3b1",
  storageBucket: "job-cv-manager-8b3b1.firebasestorage.app",
  messagingSenderId: "896772162972",
  appId: "1:896772162972:web:5178304384a31ba1d67459",
  measurementId: "G-VY0V4TVT67"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, doc, getDoc, setDoc };
