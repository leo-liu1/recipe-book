import React from 'react';

export default function NavbarSearch() {
    return (<div className="search">
        <input placeholder="Search for a recipe..." className="input"/>
        <button className="button">Search</button>
    </div>);
}