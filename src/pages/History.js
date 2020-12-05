import React, { useContext, useEffect, useState } from 'react';

import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import RecipeBox from '../components/common/RecipeBox';

/**
 * History page that displays our most recent searches
 * 
 * @class
 */
function History() {
    document.title = "History";

    const { getLastUpdatedRecipeHistory } = useContext(FirestoreContext);
    const [recipesDict, setRecipesDict] = useState(null); // dictonary to manage what recipes to display

    useEffect(() => {
      getLastUpdatedRecipeHistory(5).then((recipes) => {
        const recipesObj = {};
        recipes.forEach((recipe) => {
          recipesObj[recipe.firestoreID] = recipe;
        });

        setRecipesDict(recipesObj);
      }).catch((err)=> console.error(err));
    }, [getLastUpdatedRecipeHistory]);

    /**
     * Callback function that triggers when we want to remove a recipe from the frontend
     * @param {Recipe} recipe - Recipe object that is to be removed
     */
    function removeFromHistoryPage(recipe) {
      setRecipesDict({
        ...recipesDict,
        [recipe.firestoreID]: null,
      });
    }

    // get an array from our dict and filter out any null values
    const recipesArray = recipesDict && Object.values(recipesDict).filter(recipe => recipe !== null);

    return (<div className="history">
        <div className="page-title">Your History</div>
        {/* on first render, we do not render anything */}
        {recipesDict !== null &&
          <div className="history-container">
            {recipesArray.length === 0 ?
              <div className="empty-history">Your search history is empty. Search for a recipe to add to your history!</div> :
              recipesArray.map((recipe) => (
                <RecipeBox key={recipe.firestoreID} recipe={recipe} removeFromHistoryPage={removeFromHistoryPage} />
              ))}
          </div>}
    </div>);
}

export default History;
