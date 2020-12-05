import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AuthContext } from '../handlers/AuthHandler';
import NavbarSearch from './NavbarSearch';

import { ReactComponent as FridgeIcon } from '../../assets/icons/fridge.svg';
import { ReactComponent as HistoryIcon } from '../../assets/icons/history.svg';
import { ReactComponent as RecommendationsIcon } from '../../assets/icons/recommendations.svg';

/**
 * @callback checkAuth
 */

/**
 * Navbar function that renders all navbar elements
 * 
 * @class
 * @param {Object} navbar
 * @param {boolean} navbar.isAuthenticated - Whether the user is authenticated or not
 * @param {checkAuth} navbar.checkAuth - Callback that rechecks user authentication
 * @param {string} navbar.searchStr - Search string resulting from a query from our fridge, to be used in NavbarSearch
 */
function Navbar({ isAuthenticated, checkAuth, searchStr }) {
    const [loggedOut, setLoggedOut] = useState(false); // state to keep track of whether we've logged out or not
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        if (loggedOut) { // if we've logged out, trigger the logout function from AuthContext and then recheck our authentication
            logout().then(() => checkAuth());
        }
    }, [loggedOut, logout, checkAuth]);

    return (<>
        {loggedOut && <Redirect push to="/" />} {/* redirect to landing after log out */}
        <nav className="navigation">
            <div className="container">
                <div className="left">
                    <Link to="/" className="title">
                        <FridgeIcon className="logo-icon"/>
                        <div className="text">
                            Recipe to Cook
                        </div>
                    </Link>
                </div>
                {isAuthenticated && <NavbarSearch searchStr={searchStr} />} {/* only show search if we are authenticated */}
                <div className="right">
                    {/* conditional logic to display unauthenticated/authenticated resources */}
                    {isAuthenticated ?
                        (<>
                            <Link to="/history" className="navbar-link history">
                                <HistoryIcon className="navbar-icon history"/>
                            </Link>
                            <Link to="/recommendations" className="navbar-link">
                                <RecommendationsIcon className="navbar-icon"/>
                            </Link>
                            <div className="logout" onClick={() => { setLoggedOut(true); }}>Logout</div>
                        </>) :
                        (<div className="login">
                            <Link to="/login">Login</Link>
                            <Link to="/signup" className="signup">Sign Up</Link>
                        </div>)}
                </div>
            </div>
        </nav>
    </>);
}

export default Navbar;
