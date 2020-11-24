import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../handlers/AuthHandler';
import NavbarSearch from './NavbarSearch';

import { ReactComponent as FridgeIcon } from '../../assets/icons/fridge.svg';
import { ReactComponent as BookmarksIcon } from '../../assets/icons/bookmarks.svg';
import { ReactComponent as RecommendationsIcon } from '../../assets/icons/recommendations.svg';

export default function Navbar({ isAuthenticated }) {
    const { logout } = useAuth();

    return (<nav className="navigation">
        <div className="left">
            <Link to="/" className="title">
                <FridgeIcon className="logo-icon"/>
                <div className="text">
                    Recipe to Cook
                </div>
            </Link>
        </div>
        <NavbarSearch />
        <div className="right">
            {isAuthenticated ?
                (<>
                    <Link to="/bookmarks" className="navbar-link">
                        <BookmarksIcon className="navbar-icon"/>
                    </Link>
                    <Link to="/recommendations" className="navbar-link">
                        <RecommendationsIcon className="navbar-icon"/>
                    </Link>
                    <div className="logout" onClick={() => {logout(); console.log("logged out")}}>Logout</div>
                </>) :
                (<div className="login">
                    <Link to="/login">Login</Link>
                    <Link to="/signup" className="signup">Sign Up</Link>
                </div>)}
        </div>
    </nav>);
}