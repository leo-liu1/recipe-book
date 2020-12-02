import React, { useContext, createContext } from 'react';
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

	const checkAuth = async () => {
		return getUserID().then(userID => {
			if (userID) {
				return userID;
			}
		});
	};
	
	const addUserIngredient = async (ingredient) => {
		const userID = await checkAuth();
		return Firestore.collection('ingredients')
			.add({ ...ingredient.getFirestoreData(), userID: userID });
	}
	
	const removeUserIngredient = async (ingredient) => {
		const userID = await checkAuth();
		return await Firestore.collection('ingredients')
			.doc(ingredient.firestoreID)
			.delete();
	}

	const updateUserIngredient = async (ingredient) => {
		const userID = await checkAuth();
		return await Firestore.collection('ingredients')
			.doc(ingredient.firestoreID)
			.update({ ...ingredient.getFirestoreData(), userID: userID });
	}

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

	const addUserBookmakedRecipes = async (recipe) => {
		const userID = await checkAuth();
		return Firestore.collection('bookmarks')
			.add({ ...recipe.getFirestoreData(), userID: userID });
	}

	const removeUserBookmakedRecipes = async (recipe) => {
		const userID = await checkAuth();
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
	
	const getAllUserBookmarkedRecipes = async () => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection('bookmarks')
			.where("userID", "==", userID)
			.get();

			return snapshot.docs.map((doc) => {
				return new Recipe(doc.data());
		});
	}

	const addRecipeHistory = async (recipe) => {
		const userID = await checkAuth();
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
		const userID = await checkAuth();
		const snapshot = await Firestore.collection("history")
			.where("userID", "==", userID)
			.orderBy("frequency", "desc")
			.limit(3)
			.get();
		/*return snapshot.docs.map((doc) => {
			return new Recipe(doc.data());
		});*/
		//console.log(userID);
		return Promise.all(snapshot.docs.map((doc) => {
			return Object.assign(doc.data(), {id: doc.id});
		}));
	}

	const value = {
		addUserIngredient,
		removeUserIngredient,
		updateUserIngredient,
		getAllUserIngredients,
		addUserBookmakedRecipes,
		removeUserBookmakedRecipes,
		getAllUserBookmarkedRecipes,
		addRecipeHistory,
		getRecipeHistory,
	}

	return (
		<FirestoreContext.Provider value={value}>
			{children}
		</FirestoreContext.Provider>
	)
}