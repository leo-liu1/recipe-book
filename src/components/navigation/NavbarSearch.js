import React from 'react';

export default function NavbarSearch() {
    function handleSearch(event) {
        // if neither enter or click do nothing; enter for input and click for button
        if (event.key !== "Enter" && event.type !== "click") {
            return;
        }
    }

    return (<div className="search">
        <input placeholder="Search for a recipe..." className="input" onKeyUp={handleSearch}/>
        <button className="button" onClick={handleSearch}>Search</button>
    </div>);
}