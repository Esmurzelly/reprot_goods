// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBgtx6Xfxkms_DGG908-TA6eIuo9axA1k",
  authDomain: "reportgoods-435c7.firebaseapp.com",
  projectId: "reportgoods-435c7",
  storageBucket: "reportgoods-435c7.firebasestorage.app",
  messagingSenderId: "181253447107",
  appId: "1:181253447107:web:41b342be7d43eb7e68b176",
  measurementId: "G-M7JR035TFJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);