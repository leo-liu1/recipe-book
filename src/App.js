import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import firebase from 'firebase';

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

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const isAuthenticated = true;

export default function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/">
            {isAuthenticated ? <Fridge /> : <Landing />}
          </Route>
          <Route path="/bookmarks">
            <Bookmarks />
          </Route>
          <Route path="/recommendations">
            <Recommendations />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/logout">
            <Login />
          </Route>
        </Switch>
    </BrowserRouter>
  );
}
