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
    constructor(name, spoonacularName = null, type, expirationDate, quantity, imageURL = null) {
        this.name = name;
        this.spoonacularName = spoonacularName;
        this.type = type;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.imageURL = imageURL;
    }

    getFirestoreData() {
        return {
            name: this.name,
            spoonacularName: this.spoonacularName,
            type: this.type,
            expirationDate: this.expirationDate,
            quantity: this.quantity,
            imageURL: this.imageURL,
        }
    }
	
	getSpoonacularName(){
		return this.spoonacularName;
	}
}
