import React, { useEffect, useState, useContext } from 'react';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';

/**
 * 
 * 
 * @class
 */
function Test() {
    document.title = "Test";

    const { searchSimilarRecipes, searchRecipeById,searchRecipeByIngredients,searchIngredient} = useContext(SpoonacularContext);
    const [recipesArray, setRecipesArray] = useState(null);

    searchRecipeById("74315").then(recipe => console.assert(recipe.name ==="Breaded Chicken Cutlets With Sage",{name:recipe.name,errorMsg:"fail"}));
    searchSimilarRecipes("74315").then(id=>console.assert(id ===707552,{id:id,errorMsg:"fail"}))
    searchRecipeByIngredients(["beef"]).then(recipe=>console.assert(recipe.length ===5,{length:recipe.length,errorMsg:"fail"}))
    searchIngredient("beef").then(ingredient => console.assert(ingredient.spoonacularName ==="beef",{name:ingredient.spoonacularName,errorMsg:"fail"}))
    



    return (<div className="test">Test SpoonacularHandler</div>);
}

export default Test;
