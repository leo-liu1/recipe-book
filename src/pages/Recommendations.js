//import React from 'react';
import React, { useRef, useState, useEffect } from 'react';
import Recipe from '../components/classes/Recipe';
import { useRecommend } from '../components/handlers/RecommendationsHandler';
import { useFirestore } from '../components/handlers/FirestoreHandler';
import { useSpoonacular } from '../components/handlers/SpoonacularHandler';
import Ingredient from '../components/classes/Ingredient';

export default function Recommendations() {
    document.title = "Recommendations";
    const [posts, setPosts] = useState([]);
    const [ids, setIDs] = useState([]);
    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, getRecipeHistory } = useFirestore();
    const { searchSimilarRecipes } = useSpoonacular();
    

    useEffect(() => {
        
          //getRecipeHistory().then(data => setPosts(data))
          getRecipeHistory().then(data => {
              for(var i = 0; i < data.length; i++) {
                var obj = data[i];
                
                console.log(obj.recipeID);
}
          })
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

