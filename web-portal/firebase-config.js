// Firebase configuration and functions for Web Portal
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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
const auth = getAuth();

export { db, auth, collection, getDocs, updateDoc, doc, addDoc, signOut };