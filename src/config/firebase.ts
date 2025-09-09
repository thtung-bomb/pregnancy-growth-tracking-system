// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCCxv7-j7tNuqnRyONCe_b51z-xO9Ey1o",
  authDomain: "wdp301-7d704.firebaseapp.com",
  projectId: "wdp301-7d704",
  storageBucket: "wdp301-7d704.firebasestorage.app",
  messagingSenderId: "392832910333",
  appId: "1:392832910333:web:d48d00732f4ee569254f94",
  measurementId: "G-NLD3BX7VH0"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const ggProvider = new GoogleAuthProvider();
