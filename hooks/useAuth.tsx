import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
    User, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: typeof signInWithEmailAndPassword;
  register: typeof createUserWithEmailAndPassword;
  logout: typeof signOut;
  signInWithGoogle: () => Promise<any>;
  resetPassword: typeof sendPasswordResetEmail;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber function that we can call on cleanup.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This listener is called whenever the user's sign-in state changes.
      // If the user is signed in, the `user` object is available.
      // If the user is signed out, `user` is `null`.
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);
  
  const value = {
    currentUser,
    loading,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    register: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
    signInWithGoogle: () => signInWithPopup(auth, googleProvider),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};