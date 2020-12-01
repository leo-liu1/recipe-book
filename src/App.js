import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Firebase from 'firebase/app';

import { ProvideAuth, useAuth } from './components/handlers/AuthHandler';
import { ProvideFirestore } from './components/handlers/FirestoreHandler';
import Navbar from './components/navigation/Navbar';

import Bookmarks from './pages/Bookmarks';
import Fridge from './pages/Fridge';
import Landing from './pages/Landing';
import Recommendations from './pages/Recommendations';
import Search from './pages/Search';
import Signup from './pages/Signup';
import Login from './pages/Login';

import './css/App.scss';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measureId: process.env.REACT_APP_MEASUREMENT_ID,
};

export const firebase = Firebase.initializeApp(firebaseConfig);

export default function App() {
  return (
    <ProvideAuth>
      <ProvideFirestore>
        <Routing />
      </ProvideFirestore>
    </ProvideAuth>
  );
}

function Routing() {
  const { isUserAuthenticated } = useAuth();
  const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem("auth") === "true");

  useEffect(() => {
    function checkAuth() {
      isUserAuthenticated().then(auth => {
        localStorage.setItem("auth", auth);
        setAuthenticated(auth);
      });
    }
    checkAuth();

    window.addEventListener('focus', checkAuth);
  }, [isUserAuthenticated]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Navbar isAuthenticated={isAuthenticated} />
          {isAuthenticated ? <Fridge /> : <Landing />}
        </Route>
        <Route path="/bookmarks">
          <Navbar isAuthenticated={isAuthenticated} />
          {isAuthenticated ? <Bookmarks /> : <Redirect to="/login" />}
        </Route>
        <Route path="/recommendations">
          <Navbar isAuthenticated={isAuthenticated} />
          {isAuthenticated ? <Recommendations /> : <Redirect to="/login" />}
        </Route>
        <Route path="/search">
          <Navbar isAuthenticated={isAuthenticated} />
          <Search />
        </Route>
        <Route path="/signup">
          {isAuthenticated ? <Redirect to="/" /> : <Signup />}
        </Route>
        <Route path="/login">
          {isAuthenticated ? <Redirect to="/" /> : <Login />}
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
