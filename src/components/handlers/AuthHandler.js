import React, { useState, useEffect, useContext, createContext } from "react";
import { Auth } from './FirebaseHandler';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function ProvideAuth({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = Auth.onIdTokenChanged(user => {
      if (user) {
        setUser(user);
      }else{
        setUser(false);
      }
    });

    unsubscribe();
  }, []);

  const signup = async (email, password) => {
    const response = await Auth.createUserWithEmailAndPassword(email, password);
    setUser(response.user);
    return response.user;
  };

  const login = async (email, password) => {
    const response = await Auth.signInWithEmailAndPassword(email, password);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    await Auth.signOut();
    setUser(false);
  };

  const getUserID = () => {
    if (Auth.currentUser !== null){
      return Auth.currentUser.uid;
    } else {
      return null;
    }
  };

  const isUserAuthenticated = () => {
    return new Promise((resolve) => {
      const unsubscribe = Auth.onIdTokenChanged(user => {
        unsubscribe();
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
    })});
  };

  const value = {
    user,
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
