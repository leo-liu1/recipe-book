import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Firebase config using environment variables to initialize Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measureId: process.env.REACT_APP_MEASUREMENT_ID,
};

/**
 * Initialization configuration for firebase
 */
export const Firebase = firebase.initializeApp(firebaseConfig);

/**
 * Export Firestore functions
 */
export const Firestore = Firebase.firestore();

/**
 * Export Auth functions
 */
export const Auth = Firebase.auth();
