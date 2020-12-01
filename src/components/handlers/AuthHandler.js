import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function ProvideAuth({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(user => {
      if (user) {
        setUser(user);
      }else{
        setUser(false);
      }
    });

    unsubscribe();
  }, []);

  const signup = async (email, password) => {
    const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
    setUser(response.user);
    return response.user;
  };

  const login = async (email, password) => {
    const response = await firebase.auth().signInWithEmailAndPassword(email, password);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    await firebase.auth().signOut();
    setUser(false);
  };

  const getUserID = () => {
    if (firebase.auth().currentUser !== null){
      return firebase.auth().currentUser.uid;
    } else {
      return null;
    }
  };

  const isUserAuthenticated = () => {
    return new Promise((resolve) => {
      const unsubscribe = firebase.auth().onIdTokenChanged(user => {
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
