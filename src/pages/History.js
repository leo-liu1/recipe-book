import React, { useContext, useEffect, useState } from 'react';

import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import RecipeBox from '../components/common/RecipeBox';

export default function History() {
    document.title = "History";

    const { getLastUpdatedRecipeHistory } = useContext(FirestoreContext);
    const [recipesDict, setRecipesDict] = useState({});

    useEffect(() => {
      getLastUpdatedRecipeHistory().then((recipes) => {
        const recipesObj = {};
        recipes.forEach((recipe) => {
          recipesObj[recipe.firestoreID] = recipe;
        });

        setRecipesDict(recipesObj);
      }).catch((err)=> console.error(err));
    }, [getLastUpdatedRecipeHistory]);

    function removeFromHistoryPage(recipe) {
      setRecipesDict({
        ...recipesDict,
        [recipe.firestoreID]: null,
      });
    }

    const recipesArray = Object.values(recipesDict).filter(recipe => recipe !== null);

    return (<div className="history">
        <div className="page-title">Your History</div>
        <div className="history-container">
          {recipesArray.length === 0 ?
            <div className="empty-history">Your search history is empty. Search for a recipe to add to your history!</div> :
            recipesArray.map((recipe, index) => (
              <RecipeBox key={index} recipe={recipe} removeFromHistoryPage={removeFromHistoryPage} />
            ))}
        </div>
    </div>);
}
