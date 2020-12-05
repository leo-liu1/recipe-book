/** Class representing a recipe object */
class Recipe {
   /**
    * Internal class used for information hiding principle, which stores information about a specific
    * recipe, including its own image url.
    * @constructor
    * @param {Object} recipe
    * @param {string} recipe.name - Recipe title
    * @param {string} recipe.recipeID - Used to query Spoonacular for the recipe
    * @param {Ingredient[]} recipe.ingredients - Array of ingredients needed to make the recipe
    * @param {string|null} [recipe.imageURL=null] - Image URL of the recipe
    * @param {string} recipe.recipeURL - URL to the recipe
    * @param {Ingredient[]|null} [recipe.missingIngredients=null] - Array of missing ingredients that are included as part of the Recipe
    * @param {string|null} [recipe.userID=null] - User ID from Firebase
    * @param {string|null} [recipe.firestoreID=null] - ID to collection in Firestore
    * @param {number} [recipe.frequency=0] - Number of times the user has clicked the recipe
    */
   constructor({ name, recipeID, ingredients, imageURL, recipeURL, missingIngredients, userID, firestoreID, frequency }) {
      this.name = name;
      this.recipeID = recipeID;
      this.ingredients = ingredients;
      this.imageURL = imageURL ? imageURL : null;
      this.recipeURL = recipeURL;
      this.missingIngredients = missingIngredients ? missingIngredients : null;
      this.userID = userID ? userID : null;
      this.firestoreID = firestoreID ? firestoreID : null;
      this.frequency = frequency ? frequency : 0;
   }

   /**
    * @typedef {Object} firestoreRecipe
    * @property {string} firestoreRecipe.name - Recipe title
    * @property {string} firestoreRecipe.recipeID - Used to query Spoonacular for the recipe
    * @property {Ingredient[]} firestoreRecipe.ingredients - Array of ingredients needed to make the recipe
    * @property {string|null} [firestoreRecipe.imageURL=null] - Image URL of the recipe
    * @property {string} firestoreRecipe.recipeURL - URL to the recipe
    * @property {Ingredient[]|null} [firestoreRecipe.missingIngredients=null] - Array of missing ingredients that are included as part of the Recipe
    * @property {string|null} [firestoreRecipe.userID=null] - User ID from Firebase
    * @property {string|null} [firestoreRecipe.firestoreID=null] - ID to collection in Firestore
    * @property {number} [firestoreRecipe.frequency=0] - Number of times the user has clicked the recipe
    * 
    * Returns the firestore data for the recipe
    * @returns {firestoreRecipe}
    */
   getFirestoreData() {
      return {
         name: this.name,
         recipeID: this.recipeID,
         ingredients: this.ingredients.map((ingredient) => ingredient.getFirestoreData()),
         imageURL: this.imageURL,
         recipeURL: this.recipeURL,
         missingIngredients: this.missingIngredients.map((ingredient) => ingredient.getFirestoreData()),
         userID: this.userID,
         firestoreID: this.firestoreID,
         frequency: this.frequency,
      }
   }
}

export default Recipe;
