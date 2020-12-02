import React, { useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import { useSpoonacular } from '../components/handlers/SpoonacularHandler';
import "./Recipe.css";

export default function Search() {
    document.title = "Search";
    const [list, setList] = useState([])
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    const ingredientList = query.split(', ');
    const { searchRecipeByIngredients } = useSpoonacular();

    useEffect(()=>{
      searchRecipeByIngredients(ingredientList)
        .then(data => {
          setList(data);
          console.log(data);
        })
        .catch(err => {
          console.error(err);
          return {};
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchRecipeByIngredients, ingredientList]);

    return (<div className="search">
        <div className="page-title">
            <div className="page-title-text">You Searched for {query}</div>
        </div>
        <div className="search-container">
          {list.length > 0 && list.map(recipe => (
            <div key={recipe.recipeID}>
              <h2 className="recipe">{recipe.name}</h2>
              <img className="recipe" src={recipe.imageURL} alt="Recipe"/>
              <a className="recipe" style={{display: "table-cell"}} href = {recipe.recipeURL} target = "_blank" rel = "noopener noreferrer">{recipe.recipeURL}</a>
            </div>
          ))}
        </div>
    </div>);
}
