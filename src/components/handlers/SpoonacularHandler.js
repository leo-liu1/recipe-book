export default class SpoonacularHandler{
	constructor(API_Key){
		this.API_Key = API_Key;
	}
	
	authenticate(){}
	
	searchRecipeById(recipeID){
		let requestString = "https://api.spoonacular.com/recipes/" + recipeID + "/information";
		fetch(requestString, {
			"method": "GET",
			"headers": {
				"x-rapidapi-key": this.API_Key,
				"x-rapidapi-host": "spoonacular.com"
			}
		})
		.then(response => {
			return response;
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchRecipeByIngredients(Ingredient_List){
		//const ingredientsString = Ingredient_List.map(ingredient => ingredient+'%2C');
		const ingredientsString = Ingredient_List.join(",+");
		let requestString = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
		requestString = requestString + ingredientsString + "&number=5";
		
		fetch(requestString, {
			"method": "GET",
			"headers": {
				"x-rapidapi-key": this.API_Key,
				"x-rapidapi-host": "spoonacular.com"
			}
		})
		.then(response => {
			return response;
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchIngredient(name){
		let requestString = "https://api.spoonacular.com/food/ingredients/search?query=";
		requestString = requestString + name + "&number=1";
		
		fetch(requestString, {
			"method": "GET",
			"headers": {
				"x-rapidapi-key": this.API_Key,
				"x-rapidapi-host": "spoonacular.com"
			}
		})
		.then(response => {
			return response[0].id;
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchSimilarRecipes(recipeID){
		let requestString = "https://api.spoonacular.com/recipes/" + recipeID + "/similar";
		fetch(requestString, {
			"method": "GET",
			"headers": {
				"x-rapidapi-key": this.API_Key,
				"x-rapidapi-host": "spoonacular.com"
			}
		})
		.then(response => {
			return response;
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
}