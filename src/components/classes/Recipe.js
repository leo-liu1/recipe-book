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
   constructor(name, recipeID, ingredients, imageURL = null, recipeURL, missingIngredients = null) {
      this.name = name;
      this.recipeID = recipeID;
      this.ingredients = ingredients;
      this.imageURL = imageURL;
      this.recipeURL = recipeURL;
      this.missingIngredients = missingIngredients;
   }
   getFirestoreData() {
      return {
         name: this.name,
         recipeID: this.recipeID,
         ingredients: this.ingredients,
         imageURL: this.imageURL,
         recipeURL: this.recipeURL,
         missingIngredients: this.missingIngredients,
      }
   }
   getRecipeID(){
      return this.recipeID;
   }
}
