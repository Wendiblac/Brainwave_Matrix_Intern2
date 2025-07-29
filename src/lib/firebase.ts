import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
// Note: These are public configuration values and safe to store in the codebase
const firebaseConfig = {
  apiKey: "AIzaSyDc3TNiFGjwK-oGxUL6VjiJN8c5REVhaiM",
  authDomain: "sparkle-chat-app.firebaseapp.com",
  projectId: "sparkle-chat-app",
  storageBucket: "sparkle-chat-app.firebasestorage.app",
  messagingSenderId: "396831159028",
  appId: "1:396831159028:web:de30598bae40cd62c824a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

// Firestore functions
export const addMessage = async (messageData: {
  text: string;
  uid: string;
  displayName: string;
  photoURL?: string;
}) => {
  try {
    await addDoc(collection(db, 'messages'), {
      ...messageData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding message: ', error);
    throw error;
  }
};

export const getMessagesQuery = () => {
  return query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
};

export const subscribeToMessages = (callback: (messages: any[]) => void) => {
  const q = getMessagesQuery();
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};