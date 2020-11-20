import React from 'react';
import { Link } from 'react-router-dom';

import NavbarSearch from './NavbarSearch';

import '../../css/navigation.scss';
import { ReactComponent as Fridge } from './../../assets/fridge.svg';

export default function Navbar() {
    return (<nav className="navigation">
        <div className="left">
            <Link to="/" className="icon">
                <Fridge />
            </Link>
            <Link to="/bookmarks">Bookmarks</Link>
            <Link to="/recommendations">Recommendations</Link>
        </div>
        <div className="right">
            <NavbarSearch />
        </div>
    </nav>);
}