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

	const searchRecipeById = (recipeID) => {
		let requestString = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
		return fetch(requestString, {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((data) => {
			const recipe_json = data;
			const ingredient_object_list = getUniqueIngredients(recipe_json.extendedIngredients);

			const recipe_object = new Recipe({
				name: recipe_json.title,
				recipeID: recipe_json.id,
				ingredients: ingredient_object_list,
				imageURL: recipe_json.image,
				recipeURL: recipe_json.sourceUrl,
				missingIngredients: null
			});
			return recipe_object;
		})
		.catch((err) => {
			console.error(err);
			return {};
		});
	};

	const searchRecipeByIdWithMissing = (recipeID, missingRecipeIngredients) => {
		let requestString = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
		return fetch(requestString, {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((data) => {
			const recipe_json = data;
			const ingredient_object_list = getUniqueIngredients(recipe_json.extendedIngredients).filter((ingredientObject) => {
				return !missingRecipeIngredients.find((missingIngredientObject) =>
					missingIngredientObject.spoonacularName === ingredientObject.spoonacularName);
			});

			const recipe_object = new Recipe({
				name: recipe_json.title,
				recipeID: recipe_json.id,
				ingredients: ingredient_object_list,
				imageURL: recipe_json.image,
				recipeURL: recipe_json.sourceUrl,
				missingIngredients: missingRecipeIngredients
			});
			return recipe_object;
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	};
	
	const searchRecipeByIngredients = async (ingredientList) => {
		const ingredientsString = ingredientList.join(",+");
		let requestString = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_Key}&ingredients=`;
		requestString = `${requestString}${ingredientsString}&number=3`;

		try {
			const [spoonacularResponse, firestoreIngredients] = await Promise.all([
				fetch(requestString, { method: 'GET' }),
				getAllUserIngredients(),
			]);
			const data = await spoonacularResponse.json();
			let recipe_object_list = [];
			const recipe_json_list = data;
			recipe_json_list.forEach((recipe_json) => {
				const missingIngredient_object_list = getUniqueIngredients(recipe_json.missedIngredients);
				recipe_object_list.push(searchRecipeByIdWithMissing(recipe_json.id, missingIngredient_object_list));
			});

			console.log(recipe_object_list);
			return Promise.all(recipe_object_list);
		} catch (err) {
			console.error(err);
			return {};
		}
	};
	
	const searchIngredient = (name) => {
		let requestString = `https://api.spoonacular.com/food/ingredients/search?apiKey=${API_Key}&query=`;
		requestString = `${requestString}${name}&number=1`; // limited to only the first response
		
		return fetch(requestString, {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((data) => {
			// either grab first result or set to empty object
			const ingredient_json = (data && data.results.length > 0) ? data.results[0] : {};

			if (typeof ingredient_json.name !== 'undefined' && typeof ingredient_json.image !== 'undefined') {
				return {
					spoonacularName: ingredient_json.name,
					imageURL: `https://spoonacular.com/cdn/ingredients_250x250/${ingredient_json.image}`,
				};
			} else {
				return {};
			}
		})
		.catch((err) => {
			console.error(err);
			return {};
		});
	};
	
	const searchSimilarRecipes = (recipeID) => {
		const requestString = `https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${API_Key}&number=1`;
		return fetch(requestString, {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((recipe_json_list) => {
			const recipe_object_list = recipe_json_list.map((recipe_json) => {
				return recipe_json.id;
			});
			return recipe_object_list;
		})
		.catch((err) => {
			console.error(err);
			return {};
		});
	};

	const value = {
		searchRecipeById,
		searchRecipeByIdWithMissing,
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

/*
const api = "1026ca0dc757467e8c1c9e62bb994d48";
const spoon=new SpoonacularHandler(api);
console.log(spoon.searchRecipeById("716429"));
spoon.searchSimilarRecipes("716429").then(data => {
	console.log(data);
})
spoon.searchIngredient("apple").then(data => {
	//console.log(data);
})*/

