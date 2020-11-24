import React from 'react';
import { useFirestore } from '../components/handlers/FirestoreHandler';
import Ingredient from '../components/classes/Ingredient';

let sampleIngredient = new Ingredient(
    "Test",
    "spoonacularName",
    "type",
    "expirationDate",
    "saDdasDasdasdas",
    "IOAJSDOIAJDIOJAW",
);

export default function Bookmarks() {
    document.title = "Bookmarks";

    const { addUserIngredient, removeUserIngredient } = useFirestore();

    return (<div>
        <button onClick={() => {console.log(addUserIngredient(sampleIngredient))}}>
            Add to Firestore
        </button>
        <button onClick={() => {console.log(removeUserIngredient(sampleIngredient))}}>
            Remove from Firestore
        </button>
    </div>);
}
