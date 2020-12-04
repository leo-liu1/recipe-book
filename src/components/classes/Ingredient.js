/** Class representing a ingredient object */
export default class Ingredient {
    /**
     * Internal class used for information hiding principle, which stores information about a specific
     * ingredient, including its own image url.
     * @constructor
     * @param {Object} ingredient
     * @param {string} ingredient.name
     * @param {string|null} [ingredient.spoonacularName=null] - Used as a more Spoonacular's API friendly name, found by querying Spoonacular about its preferred name
     * @param {string} ingredient.type
     * @param {Date} ingredient.expirationDate
     * @param {{amount: number, unit: string}} ingredient.quantity
     * @param {string|null} [ingredient.imageURL=null] - Link to image
     * @param {string} [ingredient.userID=null] - User ID from Firebase
     * @param {string} [ingredient.firestoreID=null] - ID in Firestore
     */
    constructor({ name, spoonacularName, type, expirationDate, quantity, imageURL, userID, firestoreID }) {
        this.name = name;
        this.spoonacularName = spoonacularName ? spoonacularName : null;
        this.type = type;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.imageURL = imageURL ? imageURL : null;
        this.userID = userID ? userID : null;
        this.firestoreID = firestoreID ? firestoreID : null;
    }

    /**
     * @type {Object} firestoreIngredient
     * @property {string} firestoreIngredient.name
     * @property {string|null} [firestoreIngredient.spoonacularName=null] - Used as a more Spoonacular's API friendly name, found by querying Spoonacular about its preferred name
     * @property {string} firestoreIngredient.type
     * @property {Date} firestoreIngredient.expirationDate
     * @property {{amount: number, unit: string}} firestoreIngredient.quantity
     * @property {string|null} [firestoreIngredient.imageURL=null] - Link to image
     * @property {string} [firestoreIngredient.userID=null] - User ID from Firebase
     * 
     * Returns the firestore data for the ingredient
     * @returns {firestoreIngredient}
     */
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

    /**
     * Returns the type of ingredient that it is.
     * @returns {string} ingredient
     */
	getClassType() {
        return "Ingredient";
    }
}
