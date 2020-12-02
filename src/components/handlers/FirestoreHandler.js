import React, { useState, useEffect, useContext, createContext } from 'react';
import Ingredient from '../classes/Ingredient.js';
import Seasoning from '../classes/Seasoning';
import Recipe from '../classes/Recipe.js';
import firebase from 'firebase/app';
import 'firebase/firestore';
import searchSimilarRecipes from './SpoonacularHandler';
import searchRecipeById from './SpoonacularHandler';

import { useAuth } from './AuthHandler';

const AuthContext = createContext();

export function useFirestore() {
	return useContext(AuthContext);
}

export function ProvideFirestore({ children }) {
	const { getUserID } = useAuth();

	const [userID, setUserID] = useState(getUserID());

	useEffect(() => {
		setUserID(getUserID);
	}, [getUserID]);
	
	const addUserIngredient = (ingredient) => {
		return firebase.firestore()
			.collection('ingredients')
			.add({ ...ingredient.getFirestoreData(), userID: userID });
	}
	
	const removeUserIngredient = async (ingredient) => {
		return await firebase.firestore()
			.collection('ingredients')
			.doc(ingredient.firestoreID)
			.delete();
	}

	const updateUserIngredient = async (ingredient) => {
		return await firebase.firestore()
			.collection('ingredients')
			.doc(ingredient.firestoreID)
			.update({ ...ingredient.getFirestoreData(), userID: userID });
	}

	const getAllUserIngredients = async () => {
		const snapshot = await firebase.firestore()
			.collection('ingredients')
			.where("userID", "==", userID)
			.get();

		return snapshot.docs.map((doc) => {
			return doc.data().quantity
				? new Ingredient({ ...doc.data(), firestoreID: doc.id })
				: new Seasoning({ ...doc.data(), firestoreID: doc.id });
		});
	}

	const addUserBookmakedRecipes = (recipe) => {
		return firebase.firestore()
			.collection('bookmarks')
			.add({ ...recipe.getFirestoreData(), userID: userID });
	}

	const removeUserBookmakedRecipes = async (recipe) => {
		const snapshot = await firebase.firestore()
			.collection('bookmarks')
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.getRecipeID())
			.get();

		return Promise.all(snapshot.docs.map((doc) => {
			return firebase.firestore()
				.collection('bookmarks')
				.doc(doc.id)
				.delete();
		}));
	}

	const addRecipeHistory = async (recipe) => {
		const snapshot = await firebase.firestore()
			.collection('history')
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.getRecipeID())
			.get();
		if (!snapshot.exists) {
			return firebase.firestore()
				.collection('history')
				.add({ ...recipe.getFirestoreData(), userID: userID, frequency: 1 });
		} else {
			return Promise.all(snapshot.docs.map((doc) => {
				let docRef = firebase.firestore()
					.collection("history")
					.doc(doc.id);
				return firebase.firestore().runTransaction((transaction) =>
					transaction.get(docRef).then(function (Doc) {
						let newFreq = Doc.data().frequency + 1;
						transaction.update(docRef, { frequency: newFreq });
				}));
			}));
		}
	}
	
	const getRecipeHistory = async () => {
		const snapshot = await firebase.firestore()
		    .collection("history")
			.where("userID", "==", userID)
			.orderBy("frequency", "desc")
			.limit(3)
			.get();
		
		return Promise.all(snapshot.docs.map((doc) => {
			return Object.assign(doc.data(), {id: doc.id});
		}));

	}
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
		addUserIngredient,
		removeUserIngredient,
		updateUserIngredient,
		getAllUserIngredients,
		addUserBookmakedRecipes,
		removeUserBookmakedRecipes,
		addRecipeHistory,
		getRecipeHistory,
		getRecommends,
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}




