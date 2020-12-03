import React, { useEffect, useState, useContext } from 'react';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import Recipe from '../components/classes/Recipe';

export default function History() {
    document.title = "History";
    const { addRecipeHistory, removeRecipeHistory, getLastUpdatedRecipeHistory } = useContext(FirestoreContext);

    const [allBooked, setAllBooked] = useState([]);

    useEffect(() => {
        getBookmarkedRecipes()
    }, []);

    async function getBookmarkedRecipes(){
      getLastUpdatedRecipeHistory()
        .then((allBks) => setAllBooked(allBks))
        .catch((err)=> console.error(err));
    }

    async function addBookmarkedRecipe(likeRecipe){
      await addRecipeHistory(likeRecipe);
      getBookmarkedRecipes();
    }

    async function removeBookmarkedRecipe(toRemove){
      await removeRecipeHistory(toRemove);
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

    return (<div className="history">
        <div className="page-title">Your History</div>
        <div className="history-container">
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
        <button onClick={() => {addBookmarkedRecipe()}}>
                Add Recipe to Bookmark
        </button>
        </div>
    </div>);
}
