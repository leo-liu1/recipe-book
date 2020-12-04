import React, { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';
import RecipeBox from '../components/common/RecipeBox';

export default function Search() {
    document.title = "Search";

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');

    const [recipesArray, setRecipesArray] = useState(null);
    const { searchRecipeByIngredients } = useContext(SpoonacularContext);
    const ingredientList = query.split(',').map(ingredientName => ingredientName.trim());

    useEffect(()=>{
      setRecipesArray(null); // reset state
      fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const fetchData = () => {
      searchRecipeByIngredients(ingredientList)
      .then(data => {
        setRecipesArray(data);
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
        {recipesArray !== null && 
          <div className="search-container">
            {recipesArray.length === 0 ?
              <div className="empty-search">Your search returned no results.</div> :
              recipesArray.map((recipe) => (
                <RecipeBox key={recipe.recipeID} recipe={recipe} />
              ))}
          </div>}
    </div>);
}
