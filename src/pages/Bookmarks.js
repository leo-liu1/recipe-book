import React from 'react';
import { useFirestore } from '../components/handlers/FirestoreHandler';
import { useSpoonacular } from '../components/handlers/SpoonacularHandler';
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

    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, getRecipeHistory } = useFirestore();
    const { searchRecipeById } = useSpoonacular();

    function testSpoonacular() {
        searchRecipeById("716429").then(data => {
            console.log(data);
        });
    }

    return (<div className="bookmarks">
        <div className="page-title">Your Bookmarks</div>
        <div className="bookmarks-container">
            <button onClick={() => {console.log(addUserIngredient(sampleIngredient))}}>
                Add to Firestore
            </button>
            <button onClick={() => {console.log(removeUserIngredient(sampleIngredient))}}>
                Remove from Firestore
            </button>
            <button onClick={() => {console.log(getAllUserIngredients())}}>
                Get all Ingredients
            </button>
            <button onClick={() => {console.log(getRecipeHistory())}}>
                Get Recipe History
            </button>
            <button onClick={() => {testSpoonacular()}}>
                Test Spoonacular
            </button>
        </div>
    </div>);
}
