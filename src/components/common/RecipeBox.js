import React, { useContext, useState } from "react";
import { FirestoreContext } from '../handlers/FirestoreHandler';

/**
 * @typedef {import('../classes/Recipe').default} Recipe
 * 
 * @callback removeFromHistoryPage
 * @param {Recipe} recipe - Recipe to be removed from history page (only frontend)
 */

/**
 * Frontend component to display each individual recipe and its corresponding ingredients and URL
 * @param {Object} recipeBox
 * @param {Recipe} recipe - Recipe object to be displayed
 * @param {removeFromHistoryPage} removeFromHistoryPage - Callback function that removes the recipe from the history, if the user is on the history page
 */
export default function RecipeBox({ recipe, removeFromHistoryPage }) {
    const { addRecipeHistory, removeRecipeHistory } = useContext(FirestoreContext);
    const [clicked, setClicked] = useState(false); // state to keep track of whether or not the recipe URL was clicked

    /**
     * Adds the recipe object to our history in Firestore and redirects the user to the URL
     * @param {onClick} event - event that triggers when the recipeURL is clicked
     * @listens onClick
     */
    const addToHistoryAndRedirect = async (event) => {
        if (clicked) { // if we already clicked, do nothing. This no longer prevents the default event, allowing us to redirect.
            return;
        }

        event.preventDefault(); // prevent redirect

        await addRecipeHistory(recipe).catch(err => console.error(err)); // wait for us to add our recipe history
        setClicked(true);
        event.target.click(); // click the link again after we update our state
    };

    /**
     * Removes the recipe from our history, and calls the callback function removeFromHistoryPage
     */
    const removeFromHistory = async () => {
        await removeRecipeHistory(recipe).catch(err => console.error(err));
        removeFromHistoryPage(recipe);
    };

    // error message that will be displayed if we cannot find ingredients
    const error = (typeof recipe.ingredients === 'undefined' || typeof recipe.missingIngredients === 'undefined');

    const ingredientsElement = recipe.ingredients ?
        recipe.ingredients.map((ingredient) =>
            <div key={ingredient.spoonacularName} className="ingredient">{ingredient.name}</div>) :
        (<></>);
    
    const missingIngredientsElement = recipe.missingIngredients ?
        recipe.missingIngredients.map((ingredient) =>
            <div key={ingredient.spoonacularName} className="ingredient">{ingredient.name}</div>) :
        (<></>);

    return (
        <div className="recipe-box">
            {/* display error message if we could not load the recipe */}
            {error ? <div className="error">Error: could not load recipe</div> :
                <>
                    <div className="image-container">
                        <img className="image"
                            src={recipe.imageURL}
                            alt={recipe.name} />
                        <div className="button-container">
                            <a
                                href={recipe.recipeURL}
                                className="button"
                                onClick={addToHistoryAndRedirect}
                                target="_blank"
                                rel="noreferrer">
                                Go to Recipe
                            </a>
                            {/* only display remove button if we're on the history page */}
                            {typeof removeFromHistoryPage !== 'undefined' &&
                                <button className="button" onClick={removeFromHistory}>Remove Recipe From History</button>}
                        </div>
                    </div>
                    <div className="content-container">
                        <div className="content">
                            <div className="title">
                                <div className="name">{recipe.name}</div>
                            </div>
                            <div className="ingredients-container">
                                <div className="ingredients">
                                    <div className="text">
                                        Ingredients:
                                    </div>
                                    {ingredientsElement}
                                </div>
                                <div className="ingredients">
                                    <div className="text">
                                        Missing Ingredients:
                                    </div>
                                    {missingIngredientsElement}
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </div>
    );
}
