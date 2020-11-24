import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Search() {
    document.title = "Search";

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');

    return (<>{query}</>);
}
