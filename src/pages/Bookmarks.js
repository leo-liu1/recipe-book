import React from 'react';
import { useFirestore } from '../components/handlers/FirestoreHandler';
import Ingredient from '../components/classes/Ingredient';

let sampleIngredient = new Ingredient({
    name: "Test",
    spoonacularName: "spoonacularName",
    type: "type",
    expirationDate: "expirationDate",
    quantity: { amount: 2, unit: 'kg' },
});

export default function Bookmarks() {
    document.title = "Bookmarks";

    const { addUserIngredient, removeUserIngredient, getAllUserIngredients } = useFirestore();

    return (<div>
        <button onClick={() => {console.log(addUserIngredient(sampleIngredient))}}>
            Add to Firestore
        </button>
        <button onClick={() => {console.log(removeUserIngredient(sampleIngredient))}}>
            Remove from Firestore
        </button>
        <button onClick={() => {console.log(getAllUserIngredients())}}>
            Get all Ingredients
        </button>
    </div>);
}
