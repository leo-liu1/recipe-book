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
     * @param {{amount: number, unit: string}} seasoning.quantity
     * @param {string} userID
     * @param {string} seasoning.firestoreID
     */
    constructor({ name, quantity, userID, firestoreID }) {
        this.name = name;
        this.quantity = quantity;
        this.userID = userID;
        this.firestoreID = firestoreID;
    }

    getFirestoreData() {
        return {
            name: this.name,
            quantity: this.quantity,
            userID: this.userID,
        }
    }
}
