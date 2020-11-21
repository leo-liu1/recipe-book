import { auth } from "../../App.js";
import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function ProvideAuth({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  //const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
    .then(response => {
        setCurrentUser(response.user);
        return response.user;
      });
  };

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
    .then(response => {
        setCurrentUser(response.user);
        return response.user;
      });
  };

  function logout() {
    return auth.signOut()
    .then(() => {
        setCurrentUser(false);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (currentUser) {
        setCurrentUser(currentUser);
      }else{
        setCurrentUser(false);
      }
    });

    return unsubscribe
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
