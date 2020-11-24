import React from 'react';
import Ingredient from './../components/classes/Ingredient'
import meatImage from './../assets/meat.jpg'
import dairyImage from './../assets/dairy.jpg'
import carbImage from './../assets/carb.jpg'
import fruitImage from './../assets/fruit.jpg'
import vegetableImage from './../assets/vegetable.jpg'

import './../css/fridge.scss';

export default function Fridge(props) {
    return (
        <div className="fridge">
            {props.ingredients.map(b => <Box key={b.name} ingredient={b} />)}
        </div>
    );
}

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredient: this.props.ingredient,
        };
    }

    render() {
        const expDate = new Date(this.state.ingredient.expirationDate);
        return (
            <div className="box">
                <img className="image"
                     src={this.state.ingredient.imageURL
                         ? this.state.ingredient.imageURL
                         : this.getDefaultImage(this.state.ingredient.type)}/>
                <p className="title">{this.state.ingredient.name} ({this.state.ingredient.quantity.amount} {this.state.ingredient.quantity.unit})</p>
                <p className="subtitle">Expires: {expDate.toLocaleDateString()}</p>
            </div>
        );
    }

    getDefaultImage(type) {
        switch(type) {
            case "Meat":
                return meatImage;
            case "Dairy":
                return dairyImage;
            case "Carbs":
                return carbImage;
            case "Fruit":
                return fruitImage;
            case "Vegetable":
                return vegetableImage;
            default:
                return meatImage;
        }
    }
}
