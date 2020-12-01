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
     * @param {string} userID
     * @param {string} seasoning.firestoreID
     */
    constructor({ name, spoonacularName, userID, firestoreID }) {
        this.name = name;
        this.spoonacularName = spoonacularName ? spoonacularName : null;
        this.userID = userID;
        this.firestoreID = firestoreID;
    }

    getFirestoreData() {
        return {
            name: this.name,
            spoonacularName: this.spoonacularName,
            userID: this.userID,
        }
    }

    getClassType() {
        return "Seasoning"
    }
}
