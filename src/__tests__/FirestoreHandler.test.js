/*
  These tests directly connect to our backend API and thus could be flaky. This
  does not include all of our tests, as we had trouble setting up Jest to run
  everything. For our other calls, we tested the API manually by using
  Firestore's security rules playground.
*/

import { Firestore, Auth } from '../components/handlers/FirebaseHandler';
import Ingredient from '../components/classes/Ingredient';

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
	let ingredientFirestoreID = '';

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

		ingredientFirestoreID = doc.id;
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
			firestoreID: ingredientFirestoreID,
		});

		const updateIngredient = updateUserIngredient(ingredient2);
		await expect(updateIngredient).resolves.toBeUndefined();
	});
	
	it('Remove the ingredient from the fridge', async () => {
		const removeIngredient = removeUserIngredient(new Ingredient({ firestoreID: ingredientFirestoreID }));
		await expect(removeIngredient).resolves.toBeUndefined();
	});
});