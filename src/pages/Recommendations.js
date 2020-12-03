//import React from 'react';
import React, { useRef, useState, useEffect, useContext } from 'react';
import Recipe from '../components/classes/Recipe';
import { RecommendationsContext } from '../components/handlers/RecommendationsHandler';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';
import Ingredient from '../components/classes/Ingredient';

export default function Recommendations() {
    document.title = "Recommendations";
    const [posts, setPosts] = useState([]);
    const [ids, setIDs] = useState([]);
    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, getRecipeHistory } = useContext(FirestoreContext);
    const { searchSimilarRecipes } = useContext(SpoonacularContext);


    useEffect(() => {
        
          //getRecipeHistory().then(data => setPosts(data))
          /*getRecipeHistory().then(data => {
              for(var i = 0; i < data.length; i++) {
                var obj = data[i];
                searchSimilarRecipes(obj.recipeID).then(data => data[0])
                console.log(obj.recipeID);
                }
          })*/
          //searchSimilarRecipes("")
          
    }); 

    return (<div className="recommendations">
        <div className="page-title">Your Recommendations</div>
        <div className="recommendations-container">
        <ul>
        {posts.map((item) => (
				<li key={item.id}>
					<h2>{item.name}</h2>
					<p>{item.frequency}</p>
				</li>
			))}
        </ul>
        </div>
    </div>);
}

