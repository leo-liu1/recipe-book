import React, { useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import SpoonacularHandler from '../components/handlers/SpoonacularHandler.js';

export default function Search() {
    document.title = "Search";
    const [list, setList] = useState([])

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    const ingredientList = query.split(', ');
    console.log(ingredientList);

    //const ingredientsString = ingredientList.join(",+");
    //console.log(ingredientsString);
    async function getData(){
      const API_Key=" ";
      const spoonacularObj = new SpoonacularHandler(API_Key);
      setList(await spoonacularObj.searchRecipeByIngredients(ingredientList));
    }
    useEffect(()=>{
      getData();
    },[]);

    console.log(list);

    return (<div className="search">
        <div className="page-title">
            <div className="page-title-text">You Searched for {query}</div>
        </div>
        <div className="search-container">

        </div>
    </div>);
}
