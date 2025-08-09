import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  /**
   * Returns the Firebase User on success, or throws on error.
   * This makes it explicit so callers can use the returned user safely.
   */
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email: user.email,
        photoURL: user.photoURL ?? null,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Account created", description: "Welcome aboard!" });
    } catch (error) {
      const err = error as FirebaseError;
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login successful", description: "Welcome back!" });
    } catch (error) {
      const err = error as FirebaseError;
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // **IMPORTANT FIX**: return the User (not `{ user }`) and handle Firestore creation here.
  const loginWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create user doc if it doesn't exist (idempotent)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName ?? null,
          email: user.email ?? null,
          photoURL: user.photoURL ?? null,
          createdAt: serverTimestamp(),
        });
      }

      toast({ title: "Login successful", description: "Welcome with Google!" });
      return user;
    } catch (error) {
      const err = error as FirebaseError;
      toast({
        title: "Google sign-in failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out", description: "You've been signed out." });
    } catch (error) {
      const err = error as FirebaseError;
      toast({
        title: "Logout error",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
