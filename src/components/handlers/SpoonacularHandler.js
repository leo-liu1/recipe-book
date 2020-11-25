export default class SpoonacularHandler{
	constructor(API_Key){
		this.API_Key = API_Key;
	}
	
	authenticate(){}
	
	searchRecipeById(recipeID){
		let requestString = "https://api.spoonacular.com/recipes/" + recipeID + "/information?apiKey="+this.API_Key;
		fetch(requestString)
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
		let requestString = "https://api.spoonacular.com/recipes/findByIngredients?apiKey="+ this.API_Key+"&ingredients=";
		requestString = requestString + ingredientsString + "&number=5";
		
		fetch(requestString)
		.then(response => {
			return response;
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchIngredient(name){
		let requestString = "https://api.spoonacular.com/food/ingredients/search?apiKey="+this.API_Key+"&query=";
		requestString = requestString + name + "&number=1";
		
		fetch(requestString)
		.then(response => {
			return response[0].id;
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
	
	searchSimilarRecipes(recipeID){
		let requestString = "https://api.spoonacular.com/recipes/" + recipeID + "/similar?apiKey="+this.API_Key+"&number=1";
		fetch(requestString)
		.then(response => {
			return response[0];
		})
		.catch(err => {
			console.error(err);
			return {};
		});
	}
}