import React, { useEffect, useState, useContext } from 'react';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';

import RecipeBox from '../components/common/RecipeBox';

/**
 * Recommendations page that displays recipe recommendations
 */
export default function Recommendations() {
    document.title = "Recommendations";

    const { getMostFrequentRecipeHistory } = useContext(FirestoreContext);
    const { searchSimilarRecipes, searchRecipeById } = useContext(SpoonacularContext);
    const [recipesArray, setRecipesArray] = useState(null);

    useEffect(() => {
        getMostFrequentRecipeHistory(3).then((recipeHistory) => {
            return Promise.all(recipeHistory.map(recipeHistoryObj => { // wait for all our promises to resolve
                return searchSimilarRecipes(recipeHistoryObj.recipeID).then((similarRecipeID) => { // search for similar recipes
                    if (similarRecipeID) {
                        return searchRecipeById(similarRecipeID); // search the recipe by recipe ID after our query
                    } else {
                        return null;
                    }
                });
            }));
        }).then((recommendedRecipes) => {
            setRecipesArray(recommendedRecipes.filter((recipe) => recipe !== null));
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getMostFrequentRecipeHistory]);

    return (<div className="recommendations">
        <div className="page-title">Your Recommendations</div>
        {/* on first render, we do not render anything */}
        {recipesArray !== null &&
            <div className="recommendations-container">
                {recipesArray.length === 0 ?
                    <div className="empty-recommendations">You currently have no recommendations. Search for a recipe to add to your history!</div> :
                    recipesArray.map((recipe) => (
                    <RecipeBox key={recipe.recipeID} recipe={recipe} />
                    ))}
            </div>}
    </div>);
}
