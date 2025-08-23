import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  // Mock auth functions for development (when Firebase is not configured)
  const mockSignup = async (email, password, displayName) => {
    // Simulate successful signup
    const mockUser = {
      uid: 'mock-user-id',
      email,
      displayName,
      emailVerified: true
    };
    setCurrentUser(mockUser);
    return { user: mockUser };
  };

  const mockLogin = async (email, password) => {
    // Simulate successful login
    const mockUser = {
      uid: 'mock-user-id',
      email,
      displayName: 'Demo User',
      emailVerified: true
    };
    setCurrentUser(mockUser);
    return { user: mockUser };
  };

  const mockLogout = async () => {
    setCurrentUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to import Firebase auth
        const { auth } = await import('../firebase/config');
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setLoading(false);
        }, (error) => {
          console.error('Firebase auth error:', error);
          setFirebaseError(error);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.warn('Firebase not configured, using mock auth:', error);
        setFirebaseError(error);
        setLoading(false);
        // No need to return unsubscribe for mock auth
      }
    };

    initializeAuth();
  }, []);

  const signup = async (email, password, displayName) => {
    if (firebaseError) {
      return mockSignup(email, password, displayName);
    }
    
    try {
      const { auth } = await import('../firebase/config');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    if (firebaseError) {
      return mockLogin(email, password);
    }
    
    try {
      const { auth } = await import('../firebase/config');
      return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (firebaseError) {
      return mockLogout();
    }
    
    try {
      const { auth } = await import('../firebase/config');
      return signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    firebaseError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
