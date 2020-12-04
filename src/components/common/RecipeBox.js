import React, { useContext, useState } from "react";
import { FirestoreContext } from '../handlers/FirestoreHandler';

export default function RecipeBox({ recipe, removeFromHistoryPage }) {
    const { addRecipeHistory, removeRecipeHistory } = useContext(FirestoreContext);
    const [clicked, setClicked] = useState(false);

    const addToHistoryAndRedirect = async (event) => {
        if (clicked) {
            return;
        }

        event.preventDefault();

        await addRecipeHistory(recipe).catch(err => console.error(err));
        setClicked(true);
        event.target.click();
    };

    const removeFromHistory = async () => {
        await removeRecipeHistory(recipe).catch(err => console.error(err));
        removeFromHistoryPage(recipe);
    };

    const error = (typeof recipe.ingredients === 'undefined' || typeof recipe.missingIngredients === 'undefined');

    const ingredientsElement = recipe.ingredients
        .map((ingredient) => <div key={ingredient.spoonacularName} className="ingredient">{ingredient.name}</div>);
    
    const missingIngredientsElement = recipe.missingIngredients
        .map((ingredient) => <div key={ingredient.spoonacularName} className="ingredient">{ingredient.name}</div>);

    return (
        <div className="recipe-box">
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
                                onContextMenu={() => { return false; }}
                                target="_blank"
                                rel="noreferrer">
                                Go to Recipe
                            </a>
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
