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
		fetch("https://api.spoonacular.com/recipes/parseIngredients", {
			"method": "POST",
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
				"x-rapidapi-key": this.API_Key,
				"x-rapidapi-host": "spoonacular.com"
			},
			"body": {
				"ingredientList": name
			}
		})
		.then(response => {
			return response[0].name;
		})
		.catch(err => {
			console.error(err);
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