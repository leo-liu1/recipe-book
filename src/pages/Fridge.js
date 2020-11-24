import React from 'react';
import { Fab } from 'react-tiny-fab';

import meatImage from './../assets/meat.jpg'
import dairyImage from './../assets/dairy.jpg'
import carbImage from './../assets/carb.jpg'
import fruitImage from './../assets/fruit.jpg'
import vegetableImage from './../assets/vegetable.jpg'
import 'react-tiny-fab/dist/styles.css';
import './../css/fridge.scss';


export default class Fridge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: this.props.ingredients,
            showForm: false,
            formIngredientName: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createMenu(ingredient = null) {
        if (!ingredient) {
            alert("Ingredient not given");
            return;
        }
        alert(ingredient.name);
    }

    render() {
        return (
            <div className="fridge">
                {this.state.ingredients.map(ingredient => <Box
                    key={ingredient.name}
                    ingredient={ingredient}
                    fridgeClick={this.createMenu}
                />)}
                {this.state.showForm ? this.showForm() : null}
                <Fab
                    icon={"+"}
                    alwaysShowTitle={true}
                    onClick={() => this.setState({showForm: !this.state.showForm})}
                />
            </div>
        );
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        alert("Submitted form: " + this.state.formIngredientName);
        this.setState({
            showForm: false
        });
    }

    showForm = () => {
        return (
            <div className="form">
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label className="input-text">Ingredient name</label>
                        <input className="input"
                               name="formIngredientName"
                               type="text"
                               value={this.state.formIngredientName}
                               onChange={this.handleChange}/>
                    </div>
                    <div>
                        <label className="input-text">id</label>
                        <input className="input"
                               name="formIngredientName"
                               type="text"
                               value={this.state.formIngredientName}
                               onChange={this.handleChange}/>
                    </div>
                    <div>
                        <label className="input-text">Server details</label>
                        <input className="input"
                               name="formIngredientName"
                               type="text"
                               value={this.state.formIngredientName}
                               onChange={this.handleChange}/>
                    </div>
                    <div>
                        <input type="submit" value="Submit"/>
                    </div>
                </form>
            </div>
        );
    }
}

class Box extends React.Component {
    render() {
        const expDate = new Date(this.props.ingredient.expirationDate);
        return (
            <div className="box" onClick={() => this.props.fridgeClick(this.props.ingredient)}>
                <img className="image"
                     src={this.props.ingredient.imageURL
                         ? this.props.ingredient.imageURL
                         : this.getDefaultImage(this.props.ingredient.type)}
                     alt="Ingredient"/>
                <p className="title">{this.props.ingredient.name} ({this.props.ingredient.quantity.amount} {this.props.ingredient.quantity.unit})</p>
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
                return carbImage;
        }
    }
}
