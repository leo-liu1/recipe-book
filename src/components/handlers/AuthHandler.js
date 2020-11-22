import { auth } from "../../App.js";
import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function ProvideAuth({ children }) {
  const [user, setuser] = useState(null);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
    .then(response => {
        setuser(response.user);
        return response.user;
      });
  };

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
    .then(response => {
        setuser(response.user);
        return response.user;
      });
  };

  function logout() {
    return auth.signOut()
    .then(() => {
        setuser(false);
    });
  };

  function getUserID(){
    if (auth.currentUser !== null){
        return auth.currentUser.uid;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setuser(user);
      }else{
        setuser(false);
      }
    });

    return unsubscribe
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    getUserID
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
