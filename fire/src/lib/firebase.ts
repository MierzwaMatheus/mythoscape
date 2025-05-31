// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYBX7Ge5TXRBP6BS16NqUHl9oCuW3qSSI",
  authDomain: "mythoscape-gm.firebaseapp.com",
  databaseURL: "https://mythoscape-gm-default-rtdb.firebaseio.com",
  projectId: "mythoscape-gm",
  storageBucket: "mythoscape-gm.firebasestorage.app",
  messagingSenderId: "397198378403",
  appId: "1:397198378403:web:553dd4c2a9128d55960616",
  measurementId: "G-E31GPVB1KS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth and database instances
export const auth = getAuth(app);
export const database = getDatabase(app);

// Provedores de autenticação
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configurações adicionais dos provedores
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

appleProvider.addScope('email');
appleProvider.addScope('name');