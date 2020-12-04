import React, { createContext } from "react";
import { Auth } from './FirebaseHandler';

/**
 * Auth context used for when we want to use authentication functions from Firebase
 */
export const AuthContext = createContext();

/**
 * Provides authentication context for use in the app
 * @param {Object} AuthProps
 * @param {*} AuthProps.children - React components to be rendered 
 */
export function ProvideAuth({ children }) {
  /**
   * Signs up the user through Firebase
   * @param {string} email - Email of the user
   * @param {string} password - Password of the user
   */
  const signup = async (email, password) => {
    const response = await Auth.createUserWithEmailAndPassword(email, password);
    return response.user;
  };

  /**
   * Logs in the user through Firebase
   * @param {string} email - Email of the user
   * @param {string} password - Password of the user
   */
  const login = async (email, password) => {
    const response = await Auth.signInWithEmailAndPassword(email, password);
    return response.user;
  };

  /**
   * Logs out the user through Firebase
   */
  const logout = async () => {
    await Auth.signOut();
  };

  /**
   * Listener that detects whether the user is authenticated or not. If the user is authenticated, return the user's UID.
   * Otherwise, we return null.
   * @returns {Promise<string|null>} - Promise that resolves the userID string or null if not authenticated
   */
  const isUserAuthenticated = () => {
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
      });
    });
  };

  /**
   * value of all the functions that we can use in the AuthContext
   */
  const value = {
    signup,
    login,
    logout,
    isUserAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
