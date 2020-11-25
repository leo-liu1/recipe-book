import React, { useState, useEffect, useContext, createContext } from 'react';
import Ingredient from '../classes/Ingredient.js';
import Recipe from '../classes/Recipe.js'
import firebase from 'firebase';
import 'firebase/firestore';

import { useAuth } from './AuthHandler';

const AuthContext = createContext();

export function useFirestore() {
	return useContext(AuthContext);
};

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
		try {
			const snapshot = await firebase.firestore()
				.collection('ingredients')
				.where("userID", "==", userID)
				.where("spoonacularName", "==", ingredient.getSpoonacularName())
				.get();

			return Promise.all(snapshot.docs.map((doc) => {
				return firebase.firestore()
					.collection('ingredients')
					.doc(doc.id)
					.delete();
			}));
		} catch (err) {
			console.error('Error removing ingredient', err);
		}
	}

	const updateUserIngredient = async (ingredient) => {
		try {
			const snapshot = await firebase.firestore()
				.collection('ingredients')
				.where("userID", "==", userID)
				.where("spoonacularName", "==", ingredient.getSpoonacularName())
				.get();

			return Promise.all(snapshot.docs.map((doc) => {
				return firebase.firestore()
					.collection('ingredients')
					.doc(doc.id)
					.update(ingredient.getFirestoreData());
			}));
		} catch (err) {
			console.error('Error updating ingredient', err);
		}
	}

	const getAllUserIngredients = async () => {
		const snapshot = await firebase.firestore()
			.collection('ingredients')
			.where("userID", "==", userID)
			.get();

		return snapshot.docs.map((doc) => {
			return new Ingredient(doc.data());
		});
	}

	const addUserBookmakedRecipes = (recipe) => {
		return firebase.firestore()
			.collection('bookmarks')
			.add({ ...recipe.getFirestoreData(), userID: userID });
	}

	const removeUserBookmakedRecipes = async (recipe) => {
		try {
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
		} catch (err) {
			console.log('Error removing recipes', err);
		}
	}

	const addRecipeHistory = async (recipe) => {
		try{
			const snapshot = await firebase.firestore()
						.collection('history')
						.where("userID", "==", userID)
						.where("recipeID", "==", recipe.getRecipeID())
						.get();
			if(snapshot.empty){
				return firebase.firestore()
						.collection('history')
						.add({ ...recipe.getFirestoreData(), userID: userID, frequency: 1});
			}
			else{
				return Promise.all(snapshot.docs.map((doc) => {
					var docRef = firebase.firestore()
							.collection("history")
							.doc(doc.id);
					return firebase.firestore().runTransaction(function(transaction) {
						return transaction.get(docRef).then(function(Doc) {
							var newfreq = Doc.data().frequency + 1;
							transaction.update(docRef, { frequency: newfreq });
						});
					});
				}));
			}
		} catch (err){
			console.log('Error removing recipes', err);
		}
	}
	
	const getRecipeHistory = async () => {
		const snapshot = await firebase.firestore()
		    .collection("history")
			.where("userID", "==", userID)
			.get();
		
		var freq_list = new Map();
		var recipes = [];
		snapshot.docs.map((doc) => {
			var name = doc.data().name;
            var recipeID = doc.data().recipeID;
            var ingredients = doc.data().ingredients;
            var imageURL = doc.data().imageURL;
            var recipeURL = doc.data().recipeURL;
            var missingIngredients = doc.data().missingIngredients;
			var recipe = new Recipe(name, recipeID, ingredients, imageURL, recipeURL, missingIngredients);
			freq_list.set(recipe, doc.data().frequency);
			recipes.push(recipe);
		});
		return recipes.sort((a,b) => freq_list.get(b) - freq_list.get(a)).slice(0,3);
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
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}
