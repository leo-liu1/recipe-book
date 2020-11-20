import React from 'react';
import { Link } from 'react-router-dom';

import NavbarSearch from './NavbarSearch';

import '../../css/navigation.scss';
import { ReactComponent as Fridge } from './../../assets/fridge.svg';

const isAuthenticated = false;

export default function Navbar() {
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
                (<Link to="/logout">Logout</Link>) :
                (<div className="login">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>)}
        </div>
    </nav>);
}