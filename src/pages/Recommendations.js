//import React from 'react';
import React, { useRef, useState, useEffect } from 'react';
import Recipe from '../components/classes/Recipe';
import { useRecommend } from '../components/handlers/RecommendationsHandler';
import { useFirestore } from '../components/handlers/FirestoreHandler';
import Ingredient from '../components/classes/Ingredient';

export default function Recommendations() {
    document.title = "Recommendations";
    const [posts, setPosts] = useState([]);
    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, getRecipeHistory } = useFirestore();

    useEffect(() => {
        
          getRecipeHistory().then((res) => res).then(data => setPosts(data))
          
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

