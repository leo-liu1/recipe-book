/*
 Seasoning class for IH principle.

 name: String
 quantity: JSON object
    - Should look like:
    {
        amount: X,
        unit: Y,
    }
 */

export default class Seasoning {
    /**
     * @constructor
     * @param {Object} seasoning
     * @param {string} seasoning.name
     * @param {string|null} seasoning.spoonacularName
     * @param {string|null} ingredient.imageURL
     * @param {string} userID
     * @param {string} seasoning.firestoreID
     */
    constructor({ name, spoonacularName, userID, imageURL, firestoreID }) {
        this.name = name;
        this.spoonacularName = spoonacularName ? spoonacularName : null;
        this.imageURL = imageURL ? imageURL : null;
        this.userID = userID ? userID : null;
        this.firestoreID = firestoreID;
    }

    getFirestoreData() {
        return {
            name: this.name,
            spoonacularName: this.spoonacularName,
            imageURL: this.imageURL,
            userID: this.userID,
        }
    }

    getClassType() {
        return "Seasoning";
    }
}
