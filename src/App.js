import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Firebase from 'firebase/app';

import { ProvideAuth, useAuth } from './components/handlers/AuthHandler';
import Navbar from './components/navigation/Navbar';

import Bookmarks from './pages/Bookmarks';
import Fridge from './pages/Fridge';
import Landing from './pages/Landing';
import Recommendations from './pages/Recommendations';
import Search from './pages/Search';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Ingredient from './components/classes/Ingredient'

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

// Just for testing fridge, will get rid of later
const boxes = [
  new Ingredient('beef', null, 'Meat', Date.now(), {amount: 1, unit: "cow"}, null),
  new Ingredient('beef2', null, 'Meat', Date.now(), {amount: 2, unit: "lbs"}, null),
  new Ingredient('beef3', null, 'Meat', Date.now(), {amount: 3, unit: "kg"}, null),
  new Ingredient('beef4', null, 'Meat', Date.now(), {amount: 4, unit: "poo"}, null),
  new Ingredient('beef5', null, 'Meat', Date.now(), {amount: 5, unit: "hmm"}, null),
  new Ingredient('beef6', null, 'Meat', Date.now(), {amount: 6, unit: "moo"}, null),
  new Ingredient('milk', null, 'Dairy', Date.now(), {amount: -1, unit: "oz"}, null),
  new Ingredient('corn', null, 'Vegetable', Date.now(), {amount: 1, unit: "lbs"}, null),
  new Ingredient('rice', null, 'Carbs', Date.now(), {amount: 1, unit: "?"}, null),
];

export default function App() {
  return (
    <ProvideAuth>
      <Routing />
    </ProvideAuth>
  );
}

function Routing() {
  const { isUserAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isUserAuthenticated()} />
      <Switch>
        <Route exact path="/">
          {isUserAuthenticated() ? <Fridge ingredients={boxes}/> : <Landing />}
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
        {!isUserAuthenticated() &&
        (<>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </>)}
      </Switch>
    </BrowserRouter>
  )
}
