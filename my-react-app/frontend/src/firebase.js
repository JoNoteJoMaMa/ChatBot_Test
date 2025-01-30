// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtLomaPM1Huj472n3jsIvlJM2nuzM0IJc",
  authDomain: "chatbot-note.firebaseapp.com",
  projectId: "chatbot-note",
  storageBucket: "chatbot-note.firebasestorage.app",
  messagingSenderId: "1040506221862",
  appId: "1:1040506221862:web:a67aa1e3790c398450fde7",
  measurementId: "G-00YPSZ20PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);