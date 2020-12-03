import React, { useEffect, useState, useContext } from 'react';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
//import Ingredient from '../components/classes/Ingredient';
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
 name: "Slow Cooker Balsamic Roast Beef French Dip Sandwich",
 recipeID: "612367",
 ingredients: [],
 imageURL:"https://carlsbadcravings.com/wp-content/uploads/2015/12/Slow-Cooker-French-Dip-Sandwiches-main.jpg",
 recipeURL:"https://www.closetcooking.com/slow-cooker-roast-beef-french-dip/",
});

export default function Bookmarks() {
    document.title = "Bookmarks";
    const { addRecipeHistory, removeRecipesHistory, getBookmarkHistory } = useContext(FirestoreContext);

    const [allBooked, setAllBooked] = useState([]);

    useEffect(() => {
        getBookmarkedRecipes()
    }, []);

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
      getBookmarkedRecipes();
    }

    function convertObj(item){
      let convertRecipe = new Recipe({
        name:item.name,
        recipeID:item.recipeID,
        ingredients:item.ingredients,
        imageURL:item.imageURL,
        recipeURL:item.recipeURL,
        missingIngredients:item.missingIngredients,
        userID:item.userID,
        frequency:item.frequency });
        return convertRecipe;
    }

    return (<div className="bookmarks">
        <div className="page-title">Your Bookmarks</div>
        <div className="bookmarks-container">
        {allBooked.length>0 && allBooked.map((item) => (
				      <div key={item.recipeID}>
					         <h2>{item.name}</h2>
                   <p>{item.frequency}</p>
                   <img className="recipe" src={item.imageURL} alt="Recipe"/>
                   <a className="recipe" style={{display: "table-cell"}} href = {item.recipeURL} target = "_blank" rel = "noopener noreferrer">{item.recipeURL}</a>
                   <button onClick={() => {removeBookmarkedRecipe(convertObj(item))}}>
                      Remove from Bookmark
                   </button>
				      </div>
			   ))}
        <button onClick={() => {addBookmarkedRecipe(sampleRecipe)}}>
                Add Recipe to Bookmark
        </button>
        </div>
    </div>);
}
