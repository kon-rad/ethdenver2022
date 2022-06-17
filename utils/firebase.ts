// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
// export const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
// const admin = require('firebase-admin');
// admin.initializeApp();


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMH2evmLnyz70rJ5DbAfYTjDyjgBcOpQU",
  authDomain: "decom-eba2a.firebaseapp.com",
  projectId: "decom-eba2a",
  storageBucket: "decom-eba2a.appspot.com",
  messagingSenderId: "340600889870",
  appId: "1:340600889870:web:05ebceea794600448d125f",
  measurementId: "G-GBG21ZXCGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// firebase = getAnalytics(firebase);

export default app;

