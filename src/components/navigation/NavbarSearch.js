import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

const SEARCH_PATH = '/search';

export default function NavbarSearch() {
    const [searched, setSearched] = useState(false);
    const [prevSearch, setPrevSearch] = useState('');
    const inputRef = useRef();
    const location = useLocation();
    
    useEffect(() => {
        if (location.pathname === SEARCH_PATH) {
            const urlParams = new URLSearchParams(location.search);
            const query = urlParams.get('q');
            if (prevSearch !== query) {
                setPrevSearch(query);
                inputRef.current.value = query;
            }
        } else if (!searched) {
            setPrevSearch('');
            inputRef.current.value = '';
        }
        
        if (searched) {
            setSearched(false);
        }
    }, [location.pathname, location.search, searched, prevSearch]);

    function handleSearch(event) {
        // set true if enter or click; enter for input and click for button
        setSearched(event.key === "Enter" || event.type === "click");
    }

    return (<>
        {searched && <Redirect
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
