import React, { useState, useEffect, useContext, createContext } from 'react';
import Recipe from '../classes/Recipe.js';
import firebase from 'firebase';
import 'firebase/firestore';

import { useAuth } from './AuthHandler';
import { useFirestore } from './FirestoreHandler';
import searchSimilarRecipes from './SpoonacularHandler';

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
    
    const getRecipeHistory = useFirestore();

    const getRecommends = () => {
        return getRecipeHistory().forEach(recipe => {
            return searchSimilarRecipes(recipe.recipeID) 
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