import React, { useState, useEffect, useContext, createContext } from 'react';
import { Firestore } from './FirebaseHandler';

import Ingredient from '../classes/Ingredient.js';
import Seasoning from '../classes/Seasoning';
import Recipe from '../classes/Recipe.js';

import { useAuth } from './AuthHandler';

const FirestoreContext = createContext();

export function useFirestore() {
	return useContext(FirestoreContext);
}

export function ProvideFirestore({ children }) {
	const { getUserID } = useAuth();

	const [userID, setUserID] = useState(getUserID());

	useEffect(() => {
		setUserID(getUserID());
	}, [getUserID]);
	
	const addUserIngredient = (ingredient) => {
		return Firestore.collection('ingredients')
			.add({ ...ingredient.getFirestoreData(), userID: userID });
	}
	
	const removeUserIngredient = async (ingredient) => {
		return await Firestore.collection('ingredients')
			.doc(ingredient.firestoreID)
			.delete();
	}

	const updateUserIngredient = async (ingredient) => {
		return await Firestore.collection('ingredients')
			.doc(ingredient.firestoreID)
			.update({ ...ingredient.getFirestoreData(), userID: userID });
	}

	const getAllUserIngredients = async () => {
		const snapshot = await Firestore.collection('ingredients')
			.where("userID", "==", userID)
			.get();

		return snapshot.docs.map((doc) => {
			return doc.data().quantity
				? new Ingredient({ ...doc.data(), firestoreID: doc.id })
				: new Seasoning({ ...doc.data(), firestoreID: doc.id });
		});
	}

	const addUserBookmakedRecipes = (recipe) => {
		return Firestore.collection('bookmarks')
			.add({ ...recipe.getFirestoreData(), userID: userID });
	}

	const removeUserBookmakedRecipes = async (recipe) => {
		const snapshot = await Firestore.collection('bookmarks')
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.getRecipeID())
			.get();

		return Promise.all(snapshot.docs.map((doc) => {
			return Firestore.collection('bookmarks')
				.doc(doc.id)
				.delete();
		}));
	}

	const addRecipeHistory = async (recipe) => {
		const snapshot = await Firestore.collection('history')
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.getRecipeID())
			.get();
		if (!snapshot.exists) {
			return Firestore.collection('history')
				.add({ ...recipe.getFirestoreData(), userID: userID, frequency: 1 });
		} else {
			return Promise.all(snapshot.docs.map((doc) => {
				let docRef = Firestore.collection("history")
					.doc(doc.id);
				return Firestore.runTransaction((transaction) =>
					transaction.get(docRef).then(function (Doc) {
						let newFreq = Doc.data().frequency + 1;
						transaction.update(docRef, { frequency: newFreq });
				}));
			}));
		}
	}
	
	const getRecipeHistory = async () => {
		const snapshot = await Firestore.collection("history")
			.where("userID", "==", userID)
			.orderBy("frequency", "desc")
			.limit(3)
			.get();
		
		return snapshot.docs.map((doc) => {
			return new Recipe(doc.data());
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
	}

	return (
		<FirestoreContext.Provider value={value}>
			{children}
		</FirestoreContext.Provider>
	)
}
