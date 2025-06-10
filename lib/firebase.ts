import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAe_dC-197ptPwkYVn0Rcst6eYoHxHC2s4",
  authDomain: "job-cv-manager-e3dcb.firebaseapp.com",
  projectId: "job-cv-manager-e3dcb",
  storageBucket: "job-cv-manager-e3dcb.firebasestorage.app",
  messagingSenderId: "696086064375",
  appId: "1:696086064375:web:5877755e26e2ec22f9f7f2",
  measurementId: "G-N1QT7MSDL3"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, doc, getDoc, setDoc };
