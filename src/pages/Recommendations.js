//import React from 'react';
import React, { useRef, useState, useEffect, useContext } from 'react';
import Recipe from '../components/classes/Recipe';
import { RecommendationsContext } from '../components/handlers/RecommendationsHandler';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';
import Ingredient from '../components/classes/Ingredient';

export default function Recommendations() {
    document.title = "Recommendations";

    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, getRecipeHistory } = useContext(FirestoreContext);
    const { searchSimilarRecipes,searchRecipeById } = useContext(SpoonacularContext);


    useEffect(() => {
         getRecipeHistory().then(history => {
              for(var i = history.length-1; i >=0; i--) {
                var obj = history[i];
                searchSimilarRecipes(obj.recipeID).then(IDs => {
                	    searchRecipeById(IDs[0])
                	        .then(data => data.getFirestoreData())
                	        .then(recipe => {
                	    	    document.getElementById("test").innerHTML += `<ul><li>${recipe.name}</li></ul>`
                	        })

                });
                }
          })
    }); 

    return (<div className="recommendations">
        <div className="page-title">Your Recommendations</div>
        <div className="recommendations-container" id="test">
        </div>
    </div>);
}

