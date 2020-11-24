import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../handlers/AuthHandler';
import NavbarSearch from './NavbarSearch';

import '../../css/navigation.scss';
import { ReactComponent as Fridge } from './../../assets/fridge.svg';

export default function Navbar({ isAuthenticated }) {
    const { logout } = useAuth();

    return (<nav className="navigation">
        <div className="left">
            <Link to="/" className="title">
                <Fridge className="icon"/>
                <div className="text">
                    Recipe to Cook
                </div>
            </Link>
            <Link to="/bookmarks">Bookmarks</Link>
            <Link to="/recommendations">Recommendations</Link>
        </div>
        <NavbarSearch />
        <div className="right">
            {isAuthenticated ?
                (<div className="logout" onClick={() => {logout(); console.log("logged out")}}>Logout</div>) :
                (<div className="login">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>)}
        </div>
    </nav>);
}