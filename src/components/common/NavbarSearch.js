import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

/**
 * @constant - Path to search page
 * @type {string}
 * @default
 */

/**
 * Search bar for the navbar that we can use to find recipes from our ingredients
 * 
 * @class
 * @param {Object} navbarSearch
 * @param {string} navbarSearch.searchStr - query string that we will use to search 
 */
function NavbarSearch({ searchStr }) {
    const SEARCH_PATH = '/search';

    const [currSearch, setCurrSearch] = useState(searchStr); // track the current search as part of the state
    const [prevSearch, setPrevSearch] = useState(''); // track what we just last searched
    const inputRef = useRef();
    const location = useLocation();
    
    // set the input value to whatever we get from the passed in search string
    useEffect(() => {
        if (typeof searchStr !== 'undefined') {
            inputRef.current.value = searchStr;
        }
    }, [searchStr]);
    
    useEffect(() => {
        if (location.pathname === SEARCH_PATH) { // if we're on the search page
            const urlParams = new URLSearchParams(location.search);
            const query = urlParams.get('q');
            if (prevSearch !== query) { // if the previous search is not the current URL query, set it and populate the input value
                setPrevSearch(query);
                inputRef.current.value = query;
            }
        } else if (!currSearch) { // if we're not on the search page and there is no current search, clear prev search and the input value
            setPrevSearch('');
            inputRef.current.value = '';
        }
        
        if (currSearch) { // reset the value of curr search after our query
            setCurrSearch('');
        }
    }, [location.pathname, location.search, currSearch, prevSearch]);

    /**
     * Sets current search after the user has finished typing their search
     * @param {onClick|onEnter} event - Event that fires after search is finished
     * @listens onClick
     * @listens onEnter
     */
    function handleSearch(event) {
        // set currSearch to input value if enter or click; enter for input and click for button
        if (event.key === "Enter" || event.type === "click") {
            setCurrSearch(inputRef.current.value);
        }
    }

    return (<>
        {/* redirect only if currSearch and we have our input currently has a value */}
        {currSearch && inputRef.current && <Redirect
            push
            to={{
                pathname: SEARCH_PATH,
                search: `q=${encodeURIComponent(inputRef.current.value)}`,
            }} />}
        <div className="search">
            <input placeholder="Search for a recipe..." className="input" ref={inputRef} onKeyUp={handleSearch}/>
            <button className="button" onClick={handleSearch}>Search</button>
        </div>
    </>);
}

export default NavbarSearch;
