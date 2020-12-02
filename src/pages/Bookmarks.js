import React, { useEffect, useState, useContext } from 'react';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import Ingredient from '../components/classes/Ingredient';
import Recipe from '../components/classes/Recipe';

/*
let sampleIngredient = new Ingredient({
    name: "Test",
    spoonacularName: "spoonacularName",
    type: "type",
    expirationDate: "expirationDate",
    quantity: { amount: 2, unit: 'kg' },
});
*/
let sampleRecipe = new Recipe({
 name: "Bookmark Pancake",
 recipeID: "",
 ingredients: [],
 imageURL:"",
 recipeURL:"",
});

export default function Bookmarks() {
    document.title = "Bookmarks";
    const { addUserBookmakedRecipes, removeUserBookmakedRecipes, getAllUserBookmarkedRecipes } = useContext(FirestoreContext);

    const [allBooked, setAllBooked] = useState(getAllUserBookmarkedRecipes());

    useEffect(() => {
        getAllUserBookmarkedRecipes()
        .then((allBks) => setAllBooked(allBks))
        .catch((err) => console.error(err));
    }, [getAllUserBookmarkedRecipes]);

    function showUserBooked(){
    //  console.log(allBooked[0]);
      return allBooked;
    }

    return (<div className="bookmarks">
        <div className="page-title">Your Bookmarks</div>
        <div className="bookmarks-container">
            <button onClick={() => {console.log(showUserBooked())}}>
                Bookmarked Recipes
            </button>

        </div>
    </div>);
}
