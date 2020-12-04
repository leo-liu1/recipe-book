import React, { createContext, useContext } from "react";
import { FirestoreContext } from './FirestoreHandler';

import Ingredient from '../classes/Ingredient';
import Recipe from '../classes/Recipe';

export const SpoonacularContext = createContext();

export function ProvideSpoonacular({ children }) {
	const API_Key = process.env.REACT_APP_SPOONACULAR_API_KEY;

	const { getAllUserIngredients } = useContext(FirestoreContext);

	const getUniqueIngredients = (ingredientJSONArray) => {
		const ingredientSet = new Set();

		return ingredientJSONArray.filter((ingredientJSON) => {
			if (!ingredientSet.has(ingredientJSON.name)) {
				ingredientSet.add(ingredientJSON.name);
				return true;
			} else {
				return false;
			}
		}).map((ingredientJSON) => {
			let imageURL = ingredientJSON.image;
			if (RegExp('^https://', 'g').test(imageURL)) { // if it is already a URL, make the image 250 x 250
				imageURL = imageURL.replace(/100/g, '250');
			} else {
				imageURL = `https://spoonacular.com/cdn/ingredients_250x250/${imageURL}`;
			}

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

	const getIngredientsNotInFirestore = (recipeIngredients, firestoreIngredients) => {
		return recipeIngredients.filter((ingredientObject) => { // filter our recipe ingredients
			// if recipe ingredient includes the firestore ingredient as a substring, remove it from the array
			return !firestoreIngredients.find((firestoreIngredientObject) => {
				return ingredientObject.spoonacularName.includes(firestoreIngredientObject.spoonacularName) ||
					ingredientObject.spoonacularName.includes(firestoreIngredientObject.name);
			});
		});
	};

	const checkSpoonacularFailure = (responseJSON) => {
		if (responseJSON.status === 'failure') { // if we reach our rate limit, throw an error
			throw new Error('Spoonacular API rate limit reached');
		} else {
			return responseJSON;
		}
	}

	const getSpoonacularAndFirestore = (spoonacularRequest) => {
		return Promise.all([ // we can make both requests simultaneously
			fetch(spoonacularRequest, { method: 'GET' })
				.then(response => response.json())
				.then(responseJSON => {
					return checkSpoonacularFailure(responseJSON);
				}),
			getAllUserIngredients(),
		]);
	}

	const searchRecipeById = async (recipeID) => {
		const spoonacularRequest = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
		try {
			const [spoonacularResponse, firestoreIngredients] = await getSpoonacularAndFirestore(spoonacularRequest);

			const recipeIngredients = getUniqueIngredients(spoonacularResponse.extendedIngredients);

			const fridgeMissingIngredients = getIngredientsNotInFirestore(recipeIngredients, firestoreIngredients);

			const recipeObject = new Recipe({
				name: spoonacularResponse.title,
				recipeID: spoonacularResponse.id,
				ingredients: recipeIngredients,
				imageURL: spoonacularResponse.image,
				recipeURL: spoonacularResponse.sourceUrl,
				missingIngredients: fridgeMissingIngredients,
			});
			return recipeObject;
		} catch (err) {
			console.error(err);
			return {};
		}
	};

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
	
	const searchRecipeByIngredients = async (ingredientList) => {
		const ingredientsString = ingredientList.join(",+");
		const spoonacularRequest = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_Key}&ingredients=${ingredientsString}&number=5`;

		try {
			const [spoonacularResponse, firestoreIngredients] = await getSpoonacularAndFirestore(spoonacularRequest);

			const recipeArray = spoonacularResponse.map(async (recipeJSON) => {
				const missingIngredients = getUniqueIngredients(recipeJSON.missedIngredients);
				const fridgeMissingIngredients = getIngredientsNotInFirestore(missingIngredients, firestoreIngredients);
				const recipeURL = await getRecipeURL(recipeJSON.id);

				return new Recipe({
					name: recipeJSON.title,
					recipeID: recipeJSON.id,
					ingredients: getUniqueIngredients(recipeJSON.usedIngredients).concat(missingIngredients),
					imageURL: recipeJSON.image,
					recipeURL: recipeURL,
					missingIngredients: fridgeMissingIngredients,
				});
			});

			return Promise.all(recipeArray);
		} catch (err) {
			console.error(err);
			return [];
		}
	};
	
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
			} else {
				return {};
			}
		} catch (err) {
			console.error(err);
			return {};
		}
	};
	
	const searchSimilarRecipes = async (recipeID) => {
		const spoonacularRequest = `https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${API_Key}&number=1`;

		try {
			const recipeJSONArray = checkSpoonacularFailure(await (await fetch(spoonacularRequest, { method: 'GET' })).json());
			const recipeObjectArray = recipeJSONArray.map((recipe_json) => {
				return recipe_json.id;
			});
			return recipeObjectArray ? recipeObjectArray[0] : null;
		} catch (err) {
			console.error(err);
			return null;
		}
	};

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
