/*
  These tests directly connect to our backend API and thus could be flaky.
*/

import { Firestore, Auth } from '../components/handlers/FirebaseHandler';
import Ingredient from '../components/classes/Ingredient';
import Seasoning from '../components/classes/Seasoning';
import Recipe from '../components/classes/Recipe';

// functions from AuthHandler, for testing purposes
const isUserAuthenticated = () => {
	return new Promise((resolve) => {
		resolve(Auth.currentUser.uid);
	});
};

const login = async (email, password) => {
	const response = await Auth.signInWithEmailAndPassword(email, password);
	return response.user;
};

const logout = async () => {
	await Auth.signOut();
};

// FirestoreHandler functions

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
 * @param {number} count - the amount of recipes to retrieve
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
 * @param {number} count - the amount of recipes to retrieve
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

// consts for testing purposes
const ingredient1 = new Ingredient({
	name: 'MockIngredient',
	spoonacularName: 'MockSpoon',
	type: 'Dairy',
	expirationDate: new Date(),
	quantity: {
		amount: 1,
		unit: 'oz',
	},
});

describe('Tests for Firestore', () => {
	let firestoreID = '';

	beforeAll(async () => {
		await login('jest@test.com', 'jesttest');
	});

	afterAll(async () => {
		await logout();
	});

    it('Add ingredient to fridge and check that it exists', async () => {
		const addIngredient = addUserIngredient(ingredient1);
		await expect(addIngredient).resolves.toBeDefined();

		const doc = await addIngredient;
		expect(doc.id).toBeDefined();

		firestoreID = doc.id;
	});

	it('Update the ingredient', async () => {
		const ingredient2 = new Ingredient({
			name: 'NewMockIngredient',
			spoonacularName: 'MockSpoon',
			type: 'Dairy',
			expirationDate: new Date(),
			quantity: {
				amount: 1,
				unit: 'oz',
			},
			firestoreID: firestoreID,
		});

		const updateIngredient = updateUserIngredient(ingredient2);
		await expect(updateIngredient).resolves.toBeUndefined();
	});
	
	it('Remove the ingredient from the fridge', async () => {
		const removeIngredient = removeUserIngredient(new Ingredient({ firestoreID: firestoreID }));
		await expect(removeIngredient).resolves.toBeUndefined();
    });
});
