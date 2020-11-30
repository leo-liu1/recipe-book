/*
 Internal class used for information hiding principle, which stores information about a specific ingredient, including
 its own image url.

 name: String
 spoonacularName: nullable String
    - Used as a more Spoonacular's API friendly name, found by querying Spoonacular about its preferred name
 type: String
    - Can be of 4 specific types, which can be:
        - Vegetable, Meat, Dairy, Carb
 expirationDate: Date
 quantity: JSON
    - Should look like:
    {
        amount: X,
        unit: Y,
    }
 imageURL: nullable String
 */

export default class Ingredient {
    /**
     * @constructor
     * @param {Object} ingredient
     * @param {string} ingredient.name
     * @param {string|null} ingredient.spoonacularName 
     * @param {string} ingredient.type
     * @param {Date} ingredient.expirationDate
     * @param {{amount: number, unit: string}} ingredient.quantity
     * @param {string|null} ingredient.imageURL
     * @param {string} ingredient.userID
     */
    constructor({ name, spoonacularName, type, expirationDate, quantity, imageURL, userID }) {
        this.name = name;
        this.spoonacularName = spoonacularName ? spoonacularName : null;
        this.type = type;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.imageURL = imageURL ? imageURL : null;
        this.userID = userID;
    }

    getFirestoreData() {
        return {
            name: this.name,
            spoonacularName: this.spoonacularName,
            type: this.type,
            expirationDate: this.expirationDate,
            quantity: this.quantity,
            imageURL: this.imageURL,
            userID: this.userID,
        }
    }
	
	getSpoonacularName(){
		return this.spoonacularName;
	}
}
