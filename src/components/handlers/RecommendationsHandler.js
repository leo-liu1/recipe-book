import React, { useState, useEffect, useContext, createContext } from 'react';
import Ingredient from '../classes/Ingredient.js';
import Recipe from '../classes/Recipe.js';

import { AuthContext } from './AuthHandler';
import { FirestoreContext } from './FirestoreHandler';
import { SpoonacularContext } from './SpoonacularHandler';

export const RecommendationsContext = createContext();

export function ProvideRecommend({ children }) {
  const { getUserID } = useContext(AuthContext);
  const { searchSimilarRecipes, searchRecipeById } = useContext(SpoonacularContext);
	const [userID, setUserID] = useState(getUserID());

    const {getRecipeHistory} = useContext(FirestoreContext);

    const getRecommends = () => {
        return getRecipeHistory().forEach(recipe => {
            var similarRecipe = searchSimilarRecipes(recipe.recipeID);
			var recipeInfo = searchRecipeById(similarRecipe["id"]);
			var ingredients = recipeInfo.extendedIngredients.forEach(ingredient => {
				return Ingredient(ingredient.name, ingredient.name, ingredient.aisle, null, ingredient.amount, ingredient.image);
			});
				
			return Recipe(similarRecipe.title, similarRecipe.id, ingredients, similarRecipe.imageURLs[0], recipeInfo.sourceUrl);
        });
    }

    const value = {
		getRecommends,
	}
    return (
        <RecommendationsContext.Provider value={value}>
          {children}
        </RecommendationsContext.Provider>
      )
}

