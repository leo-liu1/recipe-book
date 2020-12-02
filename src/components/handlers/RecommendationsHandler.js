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

    const {getRecipeHistory} = useFirestore();

    
    const value = {
		getRecommends,
	}
    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      )
}

