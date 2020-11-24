import firebase from 'firebase';
import 'firebase/auth';
import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function ProvideAuth({ children }) {
  const [user, setuser] = useState(null);

  const signup = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(response => {
        //debugger
        setuser(response.user);
        return response.user;
      });
  };

  const login = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(response => {
      setuser(response.user);
      return response.user;
    }, error => {
        console.log(error);
    });
};

  const logout = () => {
    return firebase.auth().signOut()
    .then(() => {
        setuser(false);
    });
  };

  const getUserID = () => {
    if (firebase.auth().currentUser !== null){
      return firebase.auth().currentUser.uid;
    } else {
      return null;
    }
  };

  const isUserAuthenticated = () => {
    if (firebase.auth().currentUser){
      return true;
    }
    else{
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
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
    getUserID,
    isUserAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
