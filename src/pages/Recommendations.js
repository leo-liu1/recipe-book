import React, { useEffect, useState, useContext } from 'react';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';

import RecipeBox from '../components/common/RecipeBox';

export default function Recommendations() {
    document.title = "Recommendations";

    const { getMostFrequentRecipeHistory } = useContext(FirestoreContext);
    const { searchSimilarRecipes, searchRecipeById } = useContext(SpoonacularContext);
    const [recipesArray, setRecipesArray] = useState(null);

    useEffect(() => {
        getMostFrequentRecipeHistory().then((recipeHistory) => {
            return Promise.all(recipeHistory.map(recipeHistoryObj => {
                return searchSimilarRecipes(recipeHistoryObj.recipeID).then((similarRecipeID) => {
                    if (similarRecipeID) {
                        return searchRecipeById(similarRecipeID);
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

