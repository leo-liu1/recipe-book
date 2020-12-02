//import React from 'react';
import React, { useRef, useState, useEffect } from 'react';
import Recipe from '../components/classes/Recipe';
import { useRecommend } from '../components/handlers/RecommendationsHandler';
import { useFirestore } from '../components/handlers/FirestoreHandler';
import Ingredient from '../components/classes/Ingredient';

export default function Recommendations() {
    document.title = "Recommendations";
    const [data, setData] = useState([]);
    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, getRecipeHistory,getRecommends } = useFirestore();
    useEffect(() => {
          getRecipeHistory().then(data => setData(data))
    });
    return (<div className="recommendations">
        <div className="page-title">Your Recommendations</div>
        <div className="recommendations-container">
        <ul>
        {data.map(el => (
          <li key={el.id}>{el.title}</li>
        ))}
      </ul>
        </div>
    </div>);
}

