import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";


// Your Firebase config object (replace with actual keys from your project)
const firebaseConfig = {
  apiKey: "AIzaSyBAwQV-LqUpg0sRs0yp_9cHv_uZYV0z_BY",
  authDomain: "realtiechatter.firebaseapp.com",
  projectId: "realtiechatter",
  storageBucket: "realtiechatter.firebasestorage.app",
  messagingSenderId: "514258050516",
  appId: "1:514258050516:web:f56d0f705a644a29d4ca41",
  measurementId: "G-K5DBCYDHYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;