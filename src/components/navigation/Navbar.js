import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AuthContext } from '../handlers/AuthHandler';
import NavbarSearch from './NavbarSearch';

import { ReactComponent as FridgeIcon } from '../../assets/icons/fridge.svg';
import { ReactComponent as HistoryIcon } from '../../assets/icons/history.svg';
import { ReactComponent as RecommendationsIcon } from '../../assets/icons/recommendations.svg';

export default function Navbar({ isAuthenticated, checkAuth, searchStr }) {
    const [loggedOut, setLoggedOut] = useState(false);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        if (loggedOut) {
            logout().then(() => checkAuth());
        }
    }, [loggedOut, logout, checkAuth]);

    return (<>
        {loggedOut && <Redirect push to="/" />}
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
                {isAuthenticated && <NavbarSearch searchStr={searchStr} />}
                <div className="right">
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