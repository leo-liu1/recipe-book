import React, { useContext, createContext } from 'react';
import { Firestore } from './FirebaseHandler';

import Ingredient from '../classes/Ingredient.js';
import Seasoning from '../classes/Seasoning';
import Recipe from '../classes/Recipe.js';

import { AuthContext } from './AuthHandler';

/**
 * Firestore context used for when we want to use Firestore functions from Firebase
 */
export const FirestoreContext = createContext();

/**
 * Provides Firestore context for use in the app
 * @param {Object} FirestoreProps
 * @param {*} FirestoreProps.children - React components to be rendered 
 */
export function ProvideFirestore({ children }) {
	// get authentication status from Auth Context
	const { isUserAuthenticated } = useContext(AuthContext);

	/**
	 * Returns the user ID if the user is authenticated
	 * @returns {Promise<string|null>} user ID
	 */
	const checkAuth = async () => {
		return isUserAuthenticated().then(userID => {
			if (userID) {
				return userID;
			} else {
				return null;
			}
		});
	};
	
	/**
	 * Adds the user ingredient to the fridge
	 * @param {Ingredient} ingredient - ingredient object to be added
	 * @returns {Promise} Promise
	 */
	const addUserIngredient = async (ingredient) => {
		const userID = await checkAuth();
		return Firestore.collection('ingredients')
			.add({ ...ingredient.getFirestoreData(), userID: userID });
	}
	
	/**
	 * Removes the user ingredient from the fridge
	 * @param {Ingredient} ingredient - ingredient to be removed
	 * @returns {Promise} Promise
	 */
	const removeUserIngredient = async (ingredient) => {
		return await Firestore.collection('ingredients')
			.doc(ingredient.firestoreID)
			.delete();
	}

	/**
	 * Updates the user ingredient in the fridge
	 * @param {Ingredient} ingredient - ingredient to be updated
	 * @returns {Promise} Promise
	 */
	const updateUserIngredient = async (ingredient) => {
		const userID = await checkAuth();
		return await Firestore.collection('ingredients')
			.doc(ingredient.firestoreID)
			.update({ ...ingredient.getFirestoreData(), userID: userID });
	}

	/**
	 * Gets all the user's ingredients from the fridge
	 * @returns {Promise<Ingredient[]>} Promise of all user ingredients (can be Ingredient or Seasoning)
	 */
	const getAllUserIngredients = async () => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection('ingredients')
			.where("userID", "==", userID)
			.get();

		return snapshot.docs.map((doc) => {
			return doc.data().quantity
				? new Ingredient({ ...doc.data(), firestoreID: doc.id })
				: new Seasoning({ ...doc.data(), firestoreID: doc.id });
		});
	}

	/**
	 * Adds the recipe to our history
	 * @param {Recipe} recipe - recipe to be added
	 * @returns {Promise} Promise
	 */
	const addRecipeHistory = async (recipe) => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection('history') // check if the document already exists
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.recipeID)
			.get();
		let timestamp = new Date();

		if (snapshot.empty) { // if we're adding for the first time, create the document
			return Firestore.collection('history')
				.add({
					...recipe.getFirestoreData(),
					userID: userID,
					frequency: 1,
					timeUpdated: timestamp,
				});
		} else { // else, run a transaction to increment the frequency by one
			return Promise.all(snapshot.docs.map((doc) => {
				let docRef = Firestore.collection("history").doc(doc.id);

				return Firestore.runTransaction((transaction) =>
					transaction.get(docRef).then((editDoc) => {
						const newFreq = editDoc.data().frequency + 1;
						transaction.update(docRef, { frequency: newFreq, timeUpdated: timestamp });
				}));
			}));
		}
	}

	/**
	 * Removes the recipe from our history
	 * @param {Recipe} recipe - Recipe to be removed
	 */
	const removeRecipeHistory = async (recipe) => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection('history')
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.recipeID)
			.get();

		return Promise.all(snapshot.docs.map((doc) => {
			return Firestore.collection('history')
				.doc(doc.id)
				.delete();
		}));
	}
	
	/**
	 * Gets the most frequent recipes from our history
	 * @param {Number} count - the amount of recipes to retrieve
	 * @returns {Promise<Recipe[]>} Promise of our most frequent recipes
	 */
	const getMostFrequentRecipeHistory = async (count) => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection("history")
			.where("userID", "==", userID)
			.orderBy("frequency", "desc")
			.limit(count)
			.get();
		return snapshot.docs.map((doc) => {
			return new Recipe({ ...doc.data(), firestoreID: doc.id });
		});
	}

	/**
	 * Gets the 10 last updated recipes from our history
	 * @param {Number} count - the amount of recipes to retrieve
	 * @returns {Promise<Recipe[]>} Promise of our last updated recipes
	 */
	const getLastUpdatedRecipeHistory = async (count) => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection("history")
			.where("userID", "==", userID)
			.orderBy("timeUpdated", "desc")
			.limit(count)
			.get();
		
		return snapshot.docs.map((doc) => {
			return new Recipe({ ...doc.data(), firestoreID: doc.id });
		});
	}
	
	/**
     * value of all the functions that we can use in the FirestoreContext
     */
	const value = {
		addUserIngredient,
		removeUserIngredient,
		updateUserIngredient,
		getAllUserIngredients,
		addRecipeHistory,
		removeRecipeHistory,
		getMostFrequentRecipeHistory,
		getLastUpdatedRecipeHistory,
	}

	return (
		<FirestoreContext.Provider value={value}>
			{children}
		</FirestoreContext.Provider>
	)
}
