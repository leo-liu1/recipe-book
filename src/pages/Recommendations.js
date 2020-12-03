//import React from 'react';
import React, { useEffect, useState, useContext } from 'react';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';

import RecipeBox from '../components/common/RecipeBox';

export default function Recommendations() {
    document.title = "Recommendations";

    const { getMostFrequentRecipeHistory } = useContext(FirestoreContext);
    const { searchSimilarRecipes, searchRecipeById } = useContext(SpoonacularContext);
    const [recipesArray, setRecipesArray] = useState([]);

    useEffect(() => {
        getMostFrequentRecipeHistory().then((recipeHistory) => {
            return Promise.all(recipeHistory.map(recipeHistoryObj => {
                return searchSimilarRecipes(recipeHistoryObj.recipeID).then((similarRecipeID) => {
                    return searchRecipeById(similarRecipeID);
                });
            }));
        }).then((recommendedRecipes) => {
            console.log(recommendedRecipes);
            setRecipesArray(recommendedRecipes);
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getMostFrequentRecipeHistory]);

    return (<div className="recommendations">
        <div className="page-title">Your Recommendations</div>
        <div className="recommendations-container">
          {recipesArray.length === 0 ?
            <div className="empty-recommendations">You currently have no recommendations. Search for a recipe to add to your history!</div> :
            recipesArray.map((recipe, index) => (
              <RecipeBox key={index} recipe={recipe} />
            ))}
        </div>
    </div>);
}

