import React, { useContext, createContext } from "react";
import { Auth } from './FirebaseHandler';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function ProvideAuth({ children }) {
  const signup = async (email, password) => {
    const response = await Auth.createUserWithEmailAndPassword(email, password);
    return response.user;
  };

  const login = async (email, password) => {
    const response = await Auth.signInWithEmailAndPassword(email, password);
    return response.user;
  };

  const logout = async () => {
    await Auth.signOut();
  };

  const getUserID = () => {
    return new Promise((resolve) => {
      if (Auth.currentUser) {
        resolve(Auth.currentUser.uid);
      }

      const unsubscribe = Auth.onAuthStateChanged(user => {
        unsubscribe();
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null);
        }
    })});
  };

  const isUserAuthenticated = () => {
    return new Promise((resolve) => {
      const unsubscribe = Auth.onAuthStateChanged(user => {
        unsubscribe();
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
    })});
  };

  const value = {
    signup,
    login,
    logout,
    getUserID,
    isUserAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
