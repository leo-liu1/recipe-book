import React from 'react';
import Ingredient from './../components/classes/Ingredient'
import './../css/fridge.scss';

export default function Fridge(props) {
    return (
        <div className="fridge">
            {props.ingredients.map(b => <Box key={b.name} ingredient={b} />)}
        </div>
    );
}


function Box(props) {
    return (
        <div className="box">
            {props.ingredient.name}
        </div>
    );
}
