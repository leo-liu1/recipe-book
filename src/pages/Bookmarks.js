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
 name: "Bookmark Pie",
 recipeID: "6259",
 ingredients: [],
 imageURL:"url",
 recipeURL:"",
});

export default function Bookmarks() {
    document.title = "Bookmarks";
    const { addRecipeHistory, removeRecipesHistory, getBookmarkHistory } = useContext(FirestoreContext);

    const [allBooked, setAllBooked] = useState([]);

    useEffect(() => {
        getBookmarkHistory()
    }, []);

    function showUserBooked(){
    //  console.log(allBooked[0]);
      return allBooked;
    }

    async function getBookmarkedRecipes(){
      getBookmarkHistory()
        .then((allBks) => setAllBooked(allBks))
        .catch((err)=> console.error(err));
    }

    async function addBookmarkedRecipe(likeRecipe){
      await addRecipeHistory(likeRecipe);
      getBookmarkedRecipes();
    }

    async function removeBookmarkedRecipe(toRemove){
      await removeRecipesHistory(toRemove);
      getBookmarkHistory();
    }

    return (<div className="bookmarks">
        <div className="page-title">Your Bookmarks</div>
        <div className="bookmarks-container">
            <button onClick={() => {console.log(showUserBooked())}}>
                Bookmarked Recipes
            </button>
            <button onClick={() => {addBookmarkedRecipe(sampleRecipe)}}>
                Add Recipe to Bookmark
            </button>
            <button onClick={() => {removeBookmarkedRecipe(sampleRecipe)}}>
                Remove from Firestore
            </button>

        </div>
    </div>);
}
