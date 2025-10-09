// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVlowPBHtLVgEAZ1p6PIL67NI0kRKAIxY",
  authDomain: "socie-47465.firebaseapp.com",
  projectId: "socie-47465",
  storageBucket: "socie-47465.firebasestorage.app",
  messagingSenderId: "465243147995",
  appId: "1:465243147995:web:6e583ec961bc484726c6fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore Database
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
