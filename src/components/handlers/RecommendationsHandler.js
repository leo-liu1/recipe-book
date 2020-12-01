import React, { useState, useEffect, useContext, createContext } from 'react';
import Ingredient from '../classes/Ingredient.js';
import Recipe from '../classes/Recipe.js';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { useAuth } from './AuthHandler';
import { useFirestore } from './FirestoreHandler';
import searchSimilarRecipes from './SpoonacularHandler';
import searchRecipeById from './SpoonacularHandler';

const AuthContext = createContext();

export function useRecommend() {
	return useContext(AuthContext);
};

export function ProvideRecommend({ children }) {
    const { getUserID } = useAuth();
	const [userID, setUserID] = useState(getUserID());

	useEffect(() => {
		setUserID(getUserID);
    }, [getUserID]);
    
    const {getRecipeHistory} = useFirestore();

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
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      )
}

