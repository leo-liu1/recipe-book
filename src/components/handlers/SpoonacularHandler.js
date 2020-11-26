import Ingredient from '../classes/Ingredient';
import Recipe from '../classes/Recipe';

export default class SpoonacularHandler{
	constructor(API_Key){
		this.API_Key = API_Key;
	}
	
	authenticate(){}
	
	searchRecipeById(recipeID){
		let requestString = "https://api.spoonacular.com/recipes/" + recipeID + "/information?apiKey="+this.API_Key+"&includeNutrition=false";
		return fetch( requestString,{
			method: 'GET'
		})
		.then(response => 
			response.json()).then(data => {
				const recipe_json = data;
				var ingredient_object_list = [];
				const ingredient_json_list = recipe_json.extendedIngredients;
				ingredient_json_list.forEach(ingredient_json => {
					const ingredient_object = this.searchIngredientByIdHelper(ingredient_json.id, ingredient_json.measures.us.amount, ingredient_json.measures.us.unitLong);
					ingredient_object_list.push(ingredient_object);
				});
				const recipe_object = new Recipe({ name: recipe_json.title, recipeID: recipe_json.id, ingredients: ingredient_object_list, imageURL: recipe_json.image, recipeURL: recipe_json.sourceUrl, missingIngredients: null });
				console.log("Recipe Object", recipe_object);
				return recipe_object;
			})
		.catch(err => {
			console.error(err);
			return {};
		});
	}

	searchRecipeByIdWithMissing(recipeID, missingRecipeIngredients){
		let requestString = "https://api.spoonacular.com/recipes/" + recipeID + "/information?apiKey="+this.API_Key+"&includeNutrition=false";
		return fetch( requestString,{
			method: 'GET'
		})
		.then(response => 
			response.json()).then(data => {
				const recipe_json = data;
				var ingredient_object_list = [];
				const ingredient_json_list = recipe_json.extendedIngredients;
				ingredient_json_list.forEach(ingredient_json => {
					const ingredient_object = this.searchIngredientByIdHelper(ingredient_json.id, ingredient_json.measures.us.amount, ingredient_json.measures.us.unitLong);
					ingredient_object_list.push(ingredient_object);
				});
				const recipe_object = new Recipe({ name: recipe_json.title, recipeID: recipe_json.id, ingredients: ingredient_object_list, imageURL: recipe_json.image, recipeURL: recipe_json.sourceUrl, missingIngredients: missingRecipeIngredients });
				return recipe_object;
			})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchRecipeByIngredients(Ingredient_List){
		//const ingredientsString = Ingredient_List.map(ingredient => ingredient+'%2C');
		const ingredientsString = Ingredient_List.join(",+");
		let requestString = "https://api.spoonacular.com/recipes/findByIngredients?apiKey="+ this.API_Key+"&ingredients=";
		requestString = requestString + ingredientsString + "&number=5";
		
		return fetch(requestString,{
			method: 'GET'
		})
		.then(response =>
			response.json()).then(data => {
				var recipe_object_list = [];
				const recipe_json_list = data;
				recipe_json_list.forEach(recipe_json => {		
					var missingIngredient_object_list = [];
					recipe_json.missedIngredients.forEach(ingredient_json => {
						const ingredient_object = this.searchIngredientByIdHelper(ingredient_json.id, ingredient_json.amount, ingredient_json.unitLong);
						missingIngredient_object_list.push(ingredient_object);
					});
					const recipe_object = this.searchRecipeByIdWithMissing(recipe_json.id, missingIngredient_object_list);
					recipe_object_list.push(recipe_object);
				});
				return recipe_object_list;
			})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchIngredient(name){
		let requestString = "https://api.spoonacular.com/food/ingredients/search?apiKey="+this.API_Key+"&query=";
		requestString = requestString + name + "&number=1";
		
		return fetch(requestString,{
			method: 'GET'
		})
		.then(response =>
			response.json()).then(data => {
				const ingredient_json_list = data;
				var ingredient_object_list = [];
				ingredient_json_list.forEach(ingredient_json => {	
					ingredient_object = this.searchIngredientByIdHelper(ingredient_json.id, null, null);
					ingredient_object_list.push(ingredient_object);
				});
				return ingredient_object_list;
			})
		.catch(err => {
			console.error(err);
			return {};
		});
	}

	searchIngredientByIdHelper(ingredientID, ingredientAmount, units){
		let requestString = "https://api.spoonacular.com/food/ingredients/" + ingredientID + "/information?apiKey="+this.API_Key+"&amount=1";
		
		return fetch(requestString,{
			method: 'GET'
		})
		.then(response =>
			response.json()).then(data => {
				const ingredient_json = data;
				const ingredient_object = new Ingredient({ name: ingredient_json.originalName, spoonacularName: ingredient_json.name, type: ingredient_json.aisle, expirationDate: null, quantity: {amount: ingredientAmount, unit: units }, imageURL: ingredient_json.image});
				console.log("Ingredient Object", ingredient_object);
				return ingredient_object;
			})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchSimilarRecipes(recipeID){
		let requestString = "https://api.spoonacular.com/recipes/" + recipeID + "/similar?apiKey="+this.API_Key+"&number=1";
		return fetch(requestString,{
			method: 'GET'
		})
		.then(response =>
			response.json()).then(data => {
				const recipe_json_list = data;
				var recipe_object_list = [];
				recipe_json_list.forEach(recipe_json => {	
					recipe_object = this.searchRecipeById(recipe_json.id);
					recipe_object_list.push(recipe_object);
				});
				return recipe_object_list;
			})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
}

/*
const api = api_key;
const spoon=new SpoonacularHandler(api);
spoon.searchRecipeById("716429").then(data => {
	//console.log(data);
})

spoon.searchSimilarRecipes("716429").then(data => {
	//console.log(data);
})

spoon.searchIngredient("apple").then(data => {
	//console.log(data);
})
*/