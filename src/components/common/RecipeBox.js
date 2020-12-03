import React, { useContext } from "react";
import { FirestoreContext } from '../handlers/FirestoreHandler';

export default function RecipeBox({ recipe }) {
    const { addRecipeHistory } = useContext(FirestoreContext);

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const handleClick = (recipe) => {
        openInNewTab(recipe.recipeURL);
        // Send query to firestore handler to store this recipe
        addRecipeHistory(recipe)
            .catch(err => console.log(err));
    }

    const ingredientString = recipe.ingredients
        .map((recipe) => recipe.name)
        .join(', ');

    return (
        <div className="box" onClick={() => handleClick(recipe)}>
            <img className="image"
                 src={recipe.imageURL}
                 alt="Recipe" />
            <div className="title">
                <div className="name">{recipe.name}</div>
            </div>
            <div className="ingredients">
                {ingredientString}
            </div>
        </div>
    );
}
