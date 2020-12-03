import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { ProvideAuth, AuthContext } from './components/handlers/AuthHandler';
import { ProvideFirestore } from './components/handlers/FirestoreHandler';
import { ProvideSpoonacular } from './components/handlers/SpoonacularHandler';
import Navbar from './components/navigation/Navbar';

import Fridge from './pages/Fridge';
import History from './pages/History';
import Landing from './pages/Landing';
import Recommendations from './pages/Recommendations';
import Search from './pages/Search';
import Signup from './pages/Signup';
import Login from './pages/Login';

import './css/App.scss';

export default function App() {
  return (
    <ProvideAuth>
      <ProvideFirestore>
        <ProvideSpoonacular>
          <Routing />
        </ProvideSpoonacular>
      </ProvideFirestore>
    </ProvideAuth>
  );
}

function Routing() {
  const { isUserAuthenticated } = useContext(AuthContext);
  const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem("auth") === "true");
  const [searchStr, setSearchStr] = useState('');

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
          <Navbar isAuthenticated={isAuthenticated} searchStr={searchStr} />
          {isAuthenticated ? <Fridge populateSearch={(fridgeSearchStr) => setSearchStr(fridgeSearchStr)} /> : <Landing />}
        </Route>
        <Route path="/history">
          <Navbar isAuthenticated={isAuthenticated} />
          {isAuthenticated ? <History /> : <Redirect to="/login" />}
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
