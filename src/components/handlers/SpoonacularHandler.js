import React, { useContext, createContext } from "react";
import Ingredient from '../classes/Ingredient';
import Recipe from '../classes/Recipe';

const SpoonacularContext = createContext();

export function useSpoonacular() {
	return useContext(SpoonacularContext);
}

export function ProvideSpoonacular({ children }) {
	const API_Key = process.env.REACT_APP_SPOONACULAR_API_KEY;
	
	const searchRecipeById = (recipeID) => {
		let requestString = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
		return fetch(requestString, {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((data) => {
			const recipe_json = data;
			const ingredient_object_list = recipe_json.extendedIngredients.map((ingredient_json) => {
				return new Ingredient({
					name: ingredient_json.originalName,
					spoonacularName: ingredient_json.name,
					type: ingredient_json.aisle,
					expirationDate: null,
					quantity: {
						amount: ingredient_json.measures.us.amount,
						unit: ingredient_json.measures.us.unitLong,
					},
					imageURL: ingredient_json.image,
				});
			});
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
			const ingredient_object_list = recipe_json.extendedIngredients.map((ingredient_json) => {
				return new Ingredient({
					name: ingredient_json.originalName,
					spoonacularName: ingredient_json.name,
					type: ingredient_json.aisle,
					expirationDate: null,
					quantity: {
						amount: ingredient_json.measures.us.amount,
						unit: ingredient_json.measures.us.unitLong,
					},
					imageURL: ingredient_json.image,
				});
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
	
	const searchRecipeByIngredients = (ingredientList) => {
		const ingredientsString = ingredientList.join(",+");
		let requestString = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_Key}&ingredients=`;
		requestString = `${requestString}${ingredientsString}&number=5`;

		return fetch(requestString, {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((data) => {
			let recipe_object_list = [];
			const recipe_json_list = data;
			recipe_json_list.forEach((recipe_json) => {
				const missingIngredient_object_list = recipe_json.missedIngredients.map((ingredient_json) => {
					return new Ingredient({
						name: ingredient_json.originalName,
						spoonacularName: ingredient_json.name,
						type: ingredient_json.aisle,
						expirationDate: null,
						quantity: {
							amount: ingredient_json.amount,
							unit: ingredient_json.unitLong,
						},
						imageURL: ingredient_json.image,
					});
				});

				recipe_object_list.push(searchRecipeByIdWithMissing(recipe_json.id, missingIngredient_object_list));

			});
			return Promise.all(recipe_object_list);
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	};
	
	const searchIngredient = (name) => {
		let requestString = `https://api.spoonacular.com/food/ingredients/search?apiKey=${API_Key}&query=`;
		requestString = `${requestString}${name}&number=1`; // limited to only the first response
		
		return fetch(requestString, {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((data) => {
			const ingredient_json = (data && data.results.length > 0) ? data.results[0] : {}; // either grab first result or set to empty object

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
			const recipe_object_list = recipe_json_list.map(async (recipe_json) => {	
				return await searchRecipeById(recipe_json.id);
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

