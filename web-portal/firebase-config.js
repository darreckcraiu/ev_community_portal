// Firebase configuration and functions for Web Portal
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, updateDoc, doc, addDoc, setDoc, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8kcWxt523f6dXTI1TRBMcVwb68KGiTlk",
  authDomain: "ev-community-portal.firebaseapp.com",
  projectId: "ev-community-portal",
  storageBucket: "ev-community-portal.appspot.com",
  messagingSenderId: "393346538474",
  appId: "1:393346538474:web:3b81a9308f3cb9b1c53093"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, updateDoc, doc, addDoc, getDoc, setDoc, query, where, deleteDoc };