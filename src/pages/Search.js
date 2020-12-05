import React, { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';
import RecipeBox from '../components/common/RecipeBox';

/**
 * Search page that is dependent on the URL search parameters to run our search.
 * 
 * @class
 */
function Search() {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');

    document.title = `${query} - Search`;

    const [recipesArray, setRecipesArray] = useState(null);
    const { searchRecipeByIngredients } = useContext(SpoonacularContext);
    const ingredientList = query.split(',').map(ingredientName => ingredientName.trim());

    useEffect(()=>{
        setRecipesArray(null); // reset state after every query
        fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]); // we rerun our search if the search parameters in the URL change

    /**
     * Search for recipes by our ingredients
     */
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
        {/* on first render, we do not render anything */}
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

export default Search;
