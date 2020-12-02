import React, { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';
import RecipeBox from './RecipeBox'
import "./Recipe.css";

export default function Search() {
    document.title = "Search";
    const [list, setList] = useState([])
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    const ingredientList = query.split(',').map(ingredientName => ingredientName.trim());
    const { searchRecipeByIngredients } = useContext(SpoonacularContext);

    useEffect(()=>{
      fetchData();
    },[]);

    const fetchData = () => {
      searchRecipeByIngredients(ingredientList)
      .then(data => {
        setList(data);
      })
      .catch(err => {
        console.error(err);
        return {};
      });
    };

    return (<div className="search">
        <div className="page-title">
            <div className="page-title-text">You Searched for {query}</div>
        </div>
        <div className="search-container">
          {list.length > 0 && list.map((recipe, index) => (
            <RecipeBox key={index}
                       recipe={recipe}
            />
          ))}
        </div>
    </div>);
}
