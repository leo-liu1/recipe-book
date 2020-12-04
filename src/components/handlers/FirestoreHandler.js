import React, { useContext, createContext } from 'react';
import { Firestore } from './FirebaseHandler';

import Ingredient from '../classes/Ingredient.js';
import Seasoning from '../classes/Seasoning';
import Recipe from '../classes/Recipe.js';

import { AuthContext } from './AuthHandler';

export const FirestoreContext = createContext();

export function ProvideFirestore({ children }) {
	const { getUserID } = useContext(AuthContext);

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

	const addRecipeHistory = async (recipe) => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection('history')
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.getRecipeID())
			.get();
		let timestamp = new Date();

		if (snapshot.empty) {
			return Firestore.collection('history')
				.add({
					...recipe.getFirestoreData(),
					userID: userID,
					frequency: 1,
					timeUpdated: timestamp,
				});
		} else {
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

	const removeRecipeHistory = async (recipe) => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection('history')
			.where("userID", "==", userID)
			.where("recipeID", "==", recipe.getRecipeID())
			.get();

		return Promise.all(snapshot.docs.map((doc) => {
			return Firestore.collection('history')
				.doc(doc.id)
				.delete();
		}));
	}
	
	const getMostFrequentRecipeHistory = async () => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection("history")
			.where("userID", "==", userID)
			.orderBy("frequency", "desc")
			.limit(3)
			.get();
		return snapshot.docs.map((doc) => {
			return new Recipe({ ...doc.data(), firestoreID: doc.id });
		});
	}

	const getLastUpdatedRecipeHistory = async () => {
		const userID = await checkAuth();
		const snapshot = await Firestore.collection("history")
			.where("userID", "==", userID)
			.orderBy("timeUpdated", "desc")
			.limit(10)
			.get();
		
		return snapshot.docs.map((doc) => {
			return new Recipe({ ...doc.data(), firestoreID: doc.id });
		});
	}
	
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
