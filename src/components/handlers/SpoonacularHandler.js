import React, { createContext, useContext } from "react";
import { FirestoreContext } from './FirestoreHandler';

import Ingredient from '../classes/Ingredient';
import Recipe from '../classes/Recipe';

/**
 * Spoonacular context used for when we want to use functions from Spoonacular
 */
export const SpoonacularContext = createContext();

/**
 * Provides Spoonacular context for use in the app
 * @param {Object} SpoonacularProps
 * @param {*} SpoonacularProps.children - React components to be rendered 
 */
export function ProvideSpoonacular({ children }) {
	const API_Key = process.env.REACT_APP_SPOONACULAR_API_KEY; // API key from .env file

	const { getAllUserIngredients } = useContext(FirestoreContext);

	/**
	 * Returns an array of Ingredient objects that are all unique by Spoonacular name
	 * @param {Object[]} ingredientJSONArray - JSON objects that represent ingredients
	 * @returns {Ingredient[]} Array of unique Ingredients
	 */
	const getUniqueIngredients = (ingredientJSONArray) => {
		const ingredientSet = new Set();

		return ingredientJSONArray.filter((ingredientJSON) => { // filter out duplicates
			if (!ingredientSet.has(ingredientJSON.name)) { // if the name does not exist in the set, add it
				ingredientSet.add(ingredientJSON.name);
				return true;
			} else {
				return false;
			}
		}).map((ingredientJSON) => {
			let imageURL = ingredientJSON.image; // format image URL
			if (RegExp('^https://', 'g').test(imageURL)) { // if it is already a URL, make the image 250 x 250
				imageURL = imageURL.replace(/100/g, '250');
			} else {
				imageURL = `https://spoonacular.com/cdn/ingredients_250x250/${imageURL}`;
			}

			// return our new ingredient
			return new Ingredient({
				name: ingredientJSON.originalName,
				spoonacularName: ingredientJSON.name,
				type: ingredientJSON.aisle,
				expirationDate: null,
				quantity: {
					amount: ingredientJSON.measures ? ingredientJSON.measures.us.amount : ingredientJSON.amount,
					unit: ingredientJSON.measures ? ingredientJSON.measures.us.unitLong : ingredientJSON.unitLong,
				},
				imageURL: imageURL,
			});
		});
	};

	/**
	 * Returns all ingredients in the recipe that are not found in Firestore (our fridge). We check
	 * if the ingredient is in the fridge by checking the fridge ingredient's Spoonacular name and
	 * given name. If the recipe ingredient contains either string, we filter that result out.
	 * @param {Ingredient[]} recipeIngredients - Ingredients found in the recipe
	 * @param {Ingredient[]} firestoreIngredients - Ingredients inside our fridge
	 * @returns {Ingredient[]} Unique ingredients that are in the recipe but not in the fridge
	 */
	const getIngredientsNotInFirestore = (recipeIngredients, firestoreIngredients) => {
		return recipeIngredients.filter((ingredientObject) => { // filter our recipe ingredients
			// if recipe ingredient includes the firestore ingredient as a substring, remove it from the array
			return !firestoreIngredients.find((firestoreIngredientObject) => {
				return ingredientObject.spoonacularName.includes(firestoreIngredientObject.spoonacularName) ||
					ingredientObject.spoonacularName.includes(firestoreIngredientObject.name);
			});
		});
	};

	/**
	 * Throws an error if we reached the Spoonacular API rate limit. Otherwise, we return the JSON
	 * response.
	 * @param {Object[]} responseJSON - JSON object containing our response from Spoonacular
	 * @returns {Object[]} Original JSON response
	 */
	const checkSpoonacularFailure = (responseJSON) => {
		if (responseJSON.status === 'failure') { // if we reach our rate limit, throw an error
			throw new Error('Spoonacular API rate limit reached');
		} else {
			return responseJSON;
		}
	}

	/**
	 * Retrieves our Spoonacular request and Firestore request in parallel
	 * @param {string} spoonacularRequest - API endpoint for Spoonacular
	 * @returns {Promise} Promise containing a tuple of our Spoonacular request and Firestore request, respectively
	 */
	const getSpoonacularAndFirestore = (spoonacularRequest) => {
		return Promise.all([ // we can make both requests simultaneously
			fetch(spoonacularRequest, { method: 'GET' })
				.then(response => response.json())
				.then(responseJSON => { // check for failure
					return checkSpoonacularFailure(responseJSON);
				}),
			getAllUserIngredients(),
		]);
	}

	/**
	 * Returns recipe for the given recipe ID
	 * @param {Number} recipeID - ID of Recipe to search for
	 * @returns {Promise<Recipe>} Recipe associated with the ID
	 */
	const searchRecipeById = async (recipeID) => {
		const spoonacularRequest = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
		try {
			// request both Spoonacular and Firestore in parallel
			const [spoonacularResponse, firestoreIngredients] = await getSpoonacularAndFirestore(spoonacularRequest);
			
			// get the recipe ingredients and missing ingredients
			const recipeIngredients = getUniqueIngredients(spoonacularResponse.extendedIngredients);
			const fridgeMissingIngredients = getIngredientsNotInFirestore(recipeIngredients, firestoreIngredients);

			return new Recipe({
				name: spoonacularResponse.title,
				recipeID: spoonacularResponse.id,
				ingredients: recipeIngredients,
				imageURL: spoonacularResponse.image,
				recipeURL: spoonacularResponse.sourceUrl,
				missingIngredients: fridgeMissingIngredients,
			});
		} catch (err) {
			console.error(err);
			return {};
		}
	};

	/**
	 * Gets the recipe URL from the ID
	 * @param {Number} recipeID - ID for the recipe
	 * @returns {Promise<string>} Link to the recipe
	 */
	const getRecipeURL = async (recipeID) => {
		let requestString = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
		try {
			const recipeJSON = checkSpoonacularFailure(await (await fetch(requestString, { method: 'GET' })).json());

			return recipeJSON.sourceUrl;
		} catch (err) {
			console.error(err);
			return {};
		}
	};

	/**
	 * Returns an array of recipes by searching from the given ingredients
	 * @param {string[]} ingredientList - Array of ingredient names
	 * @returns {Promise<Recipe[]>} Promise containing an array of recipes
	 */
	const searchRecipeByIngredients = async (ingredientList) => {
		const ingredientsString = ingredientList.join(",+");
		const spoonacularRequest = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_Key}&ingredients=${ingredientsString}&number=5`;

		try {
			// request both Spoonacular and Firestore in parallel
			const [spoonacularResponse, firestoreIngredients] = await getSpoonacularAndFirestore(spoonacularRequest);

			const recipeArray = spoonacularResponse.map(async (recipeJSON) => {
				const missingIngredients = getUniqueIngredients(recipeJSON.missedIngredients);
				const fridgeMissingIngredients = getIngredientsNotInFirestore(missingIngredients, firestoreIngredients);
				const recipeURL = await getRecipeURL(recipeJSON.id); // we need to make another request to get the recipe URL

				return new Recipe({
					name: recipeJSON.title,
					recipeID: recipeJSON.id,
					ingredients: getUniqueIngredients(recipeJSON.usedIngredients).concat(missingIngredients),
					imageURL: recipeJSON.image,
					recipeURL: recipeURL,
					missingIngredients: fridgeMissingIngredients,
				});
			});

			// since we have to make an async request for each recipe URL, we have to wait for all to resolve
			return Promise.all(recipeArray);
		} catch (err) {
			console.error(err);
			return [];
		}
	};

	/**
	 * Returns the ingredient from searching on Spoonacular
	 * @param {string} name - Ingredient name
	 * @returns {Promise<Object>} Promise containing an object with the Spoonacular name and the image URL
	 */
	const searchIngredient = async (name) => {
		const spoonacularRequest = `https://api.spoonacular.com/food/ingredients/search?apiKey=${API_Key}&query=${name}&number=1`; // limited to only the first response
		
		try {
			const responseJSON = checkSpoonacularFailure(await (await fetch(spoonacularRequest, { method: 'GET' })).json());
			// either grab first result or set to empty object
			const ingredientJSON = (responseJSON && responseJSON.results.length > 0) ? responseJSON.results[0] : {};

			if (typeof ingredientJSON.name !== 'undefined' && typeof ingredientJSON.image !== 'undefined') {
				return {
					spoonacularName: ingredientJSON.name,
					imageURL: `https://spoonacular.com/cdn/ingredients_250x250/${ingredientJSON.image}`,
				};
			} else { // Spoonacular could not find the ingredient
				return {};
			}
		} catch (err) {
			console.error(err);
			return {};
		}
	};

	/**
	 * Search Spoonacular for similar recipes from the given recipe ID
	 * @param {Number} recipeID - ID for the recipe
	 * @returns {Promise<Recipe>} Promise containing a similar recipe to the given recipe ID
	 */
	const searchSimilarRecipes = async (recipeID) => {
		const spoonacularRequest = `https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${API_Key}&number=1`;

		try {
			const recipeJSONArray = checkSpoonacularFailure(await (await fetch(spoonacularRequest, { method: 'GET' })).json());
			const recipeObjectArray = recipeJSONArray.map((recipe_json) => {
				return recipe_json.id;
			});
			return recipeObjectArray ? recipeObjectArray[0] : null; // only grab the first result or null
		} catch (err) {
			console.error(err);
			return null;
		}
	};

	/**
     * value of all the functions that we can use in the SpoonacularContext
     */
	const value = {
		searchRecipeById,
		searchRecipeByIngredients,
		searchIngredient,
		searchSimilarRecipes,
	}

	return (
		<SpoonacularContext.Provider value={value}>
			{children}
		</SpoonacularContext.Provider>
	)
}
