/*
 Class used to hold recipe information

 name: String
 recipeID: String
    - Used to query Spoonacular's API for their actual recipe later on
 ingredients: Ingredient[]
    - See Ingredient.js for class info
 imageURL: nullable String
 recipeURL: String
    - Holds the URL for the actual recipe (not Spoonacular's, but the one that they use to display)
 missingIngredients: nullable Ingredient[]
    - Holds data from the user of the ingredients they are missing to create this recipe
 */
export default class Recipe {
   /**
     * @constructor
     * @param {Object} recipe
     * @param {string} recipe.name
     * @param {string} recipe.recipeID 
     * @param {Ingredient[]} recipe.ingredients
     * @param {string|null} recipe.imageURL
     * @param {string} recipe.recipeURL
     * @param {Ingredient[]|null} recipe.missingIngredients
     * @param {string} recipe.userID
     * @param {Number} recipe.frequency
     */
   constructor({ name, recipeID, ingredients, imageURL, recipeURL, missingIngredients, userID, frequency }) {
      this.name = name;
      this.recipeID = recipeID;
      this.ingredients = ingredients;
      this.imageURL = imageURL ? imageURL : null;
      this.recipeURL = recipeURL;
      this.missingIngredients = missingIngredients ? missingIngredients : null;
      this.userID = userID;
      this.frequency = frequency ? frequency : 0;
   }

   getFirestoreData() {
      return {
         name: this.name,
         recipeID: this.recipeID,
         ingredients: this.ingredients,
         imageURL: this.imageURL,
         recipeURL: this.recipeURL,
         missingIngredients: this.missingIngredients,
         userID: this.userID,
         frequency: this.frequency,
      }
   }

   getRecipeID(){
      return this.recipeID;
   }
}
