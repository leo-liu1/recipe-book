import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

const SEARCH_PATH = '/search';

export default function NavbarSearch({ searchStr }) {
    const [currSearch, setCurrSearch] = useState(searchStr);
    const [prevSearch, setPrevSearch] = useState('');
    const inputRef = useRef();
    const location = useLocation();
    
    // set the input value to whatever we get from the passed in search string
    useEffect(() => {
        if (typeof searchStr !== 'undefined') {
            inputRef.current.value = searchStr;
        }
    }, [searchStr]);
    
    useEffect(() => {
        if (location.pathname === SEARCH_PATH) {
            const urlParams = new URLSearchParams(location.search);
            const query = urlParams.get('q');
            if (prevSearch !== query) {
                setPrevSearch(query);
                inputRef.current.value = query;
            }
        } else if (!currSearch) {
            setPrevSearch('');
            inputRef.current.value = '';
        }
        
        if (currSearch) {
            setCurrSearch('');
        }
    }, [location.pathname, location.search, currSearch, prevSearch]);

    function handleSearch(event) {
        // set currSearch to input value if enter or click; enter for input and click for button
        if (event.key === "Enter" || event.type === "click") {
            setCurrSearch(inputRef.current.value);
        }
    }

    return (<>
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
