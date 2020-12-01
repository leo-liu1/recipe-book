import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Search() {
    document.title = "Search";

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');

    return (<div className="search">
        <div className="page-title">
            <div className="page-title-text">You Searched for {query}</div>
        </div>
        <div className="search-container"></div>
    </div>);
}
