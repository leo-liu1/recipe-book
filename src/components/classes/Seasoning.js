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
    constructor(name, quantity) {
        this.name = name;
        this.quantity = quantity;
    }
}
