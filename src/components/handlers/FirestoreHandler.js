import React, { useState, useEffect, useContext, createContext } from 'react';
import Ingredient from '../classes/Ingredient.js';
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

			const promises = [];
			snapshot.forEach(doc => {
				promises.push(firebase.firestore().collection('ingredients').doc(doc.id).delete());
			});

			return Promise.all(promises);
		} catch (err) {
			console.log('Error getting document', err);
		}
	}

	const updateUserIngredient = async (ingredient) => {
		const snapshot = await firebase.firestore().collection('ingredients').where("userID", "==", userID).where("spoonacularName", "==", ingredient.getSpoonacularName()).get();
		snapshot.forEach(doc => {
			firebase.firestore().collection('ingredients').doc(doc.id).update(ingredient.getFirestoreData());
		});
	}

	const getAllUserIngredients = () => {
		let ingredients=[];
		firebase.firestore().collection('ingredients').where("userID", "==", userID).get().then(snapshot => {
			snapshot.forEach(doc => {
				ingredients.push(new Ingredient(doc.name, doc.spoonacularName, doc.type, doc.expirationDate, doc.quantity, doc.imageURL));
			});
		});
		return ingredients;
	}
	const addUserBookmakedRecipes = (recipe) => {
		return firebase.firestore().collection('bookmarks').add({ ...recipe.getFirestoreData(), userID: userID });
	}
	const removeUserBookmakedRecipes = (recipe) => {
		return firebase.firestore().collection('bookmarks').where("userID", "==", userID).where("recipeID", "==", recipe.getRecipeID()).get()
		    .then(snapshot => {
				snapshot.forEach(doc => {
					firebase.firestore().collection('bookmarks').doc(doc.id).delete();
				});
			})
			.catch(err => {
				console.log('Error getting document', err);
			});
	}
	const addRecipeHistory = (recipe) => {
		return firebase.firestore().collection('history').add({ ...recipe.getFirestoreData(), userID: userID });
	}

	const value = {
		addUserIngredient,
		removeUserIngredient,
		updateUserIngredient,
		getAllUserIngredients,
		addUserBookmakedRecipes,
		removeUserBookmakedRecipes,
		addRecipeHistory,
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}