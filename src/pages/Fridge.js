import React from 'react';
import { Fab } from 'react-tiny-fab';
import DatePicker from "react-datepicker";
import Ingredient from '../components/classes/Ingredient'

import meatImage from '../assets/images/meat.jpg'
import dairyImage from '../assets/images/dairy.jpg'
import carbImage from '../assets/images/carb.jpg'
import fruitImage from '../assets/images/fruit.jpg'
import vegetableImage from '../assets/images/vegetable.jpg'

import 'react-tiny-fab/dist/styles.css';
import "react-datepicker/dist/react-datepicker.css";

export default class Fridge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: this.props.ingredients ? this.props.ingredients : [],
            showForm: false,
            formIngredientName: "",
            formIngredientType: "",
            formIngredientExp: new Date(),
            formIngredientAmount: "",
            formIngredientUnit: "",
            formIngredientIndex: null,
        };

        document.title = "Fridge";

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editIngredient = this.editIngredient.bind(this);
    }

    editIngredient(ingredient, index) {
        this.setState({
            showForm: true,
            formIngredientName: ingredient.name,
            formIngredientType: ingredient.type,
            formIngredientExp: new Date(ingredient.expirationDate),
            formIngredientAmount: ingredient.quantity.amount,
            formIngredientUnit: ingredient.quantity.unit,
            formIngredientIndex: index,
        });
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
        const ingredients = this.state.ingredients.slice();
        const newIngredient = new Ingredient(
            this.state.formIngredientName,
            null,
            this.state.formIngredientType,
            this.state.formIngredientExp.getTime(),
            {
                amount: this.state.formIngredientAmount,
                unit: this.state.formIngredientUnit,
            },
        );

        if (this.state.formIngredientIndex) {
            ingredients[this.state.formIngredientIndex] = newIngredient;
        } else {
            ingredients.push(newIngredient);
        }
        this.setState({
            ingredients: ingredients,
            showForm: false,
            formIngredientName: "",
            formIngredientType: "",
            formIngredientExp: new Date(),
            formIngredientAmount: "",
            formIngredientUnit: "",
            formIngredientIndex: null,
        });
    }

    render() {
        return (
            <div className="fridge">
                {this.state.ingredients.map((ingredient, index) =>
                    <Box
                        ingredient={ingredient}
                        index={index}
                        fridgeClick={this.editIngredient}
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
                               onChange={this.handleChange}
                               required/>
                    </div>
                    <div>
                        <label className="input-text">Ingredient type</label>
                        <select className="input"
                                name="formIngredientType"
                                value={this.state.formIngredientType}
                                onChange={this.handleChange}
                                required>
                            <option value="Meat">Meat</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Fruit">Fruit</option>
                            <option value="Carbs">Carbs</option>
                        </select>
                    </div>
                    <div>
                        <label className="input-text">Ingredient Amount</label>
                        <input className="input"
                               name="formIngredientAmount"
                               type="number"
                               value={this.state.formIngredientAmount}
                               onChange={this.handleChange}
                               required/>
                    </div>
                    <div>
                        <label className="input-text">Ingredient Unit</label>
                        <input className="input"
                               name="formIngredientUnit"
                               type="text"
                               value={this.state.formIngredientUnit}
                               onChange={this.handleChange}
                               required/>
                    </div>
                    <div>
                        <label className="input-text">Ingredient Expiration Date</label>
                        <DatePicker className="datepicker"
                                    placeholderText="Click to select date"
                                    minDate={this.state.formIngredientExp}
                                    selected={this.state.formIngredientExp}
                                    onChange={date => this.setState({formIngredientExp: date})} />
                    </div>
                    <div>
                        <input type="submit" value="Submit"/>
                        <button onClick={() => this.setState({
                            showForm: false,
                            formIngredientName: "",
                            formIngredientType: "",
                            formIngredientExp: new Date(),
                            formIngredientAmount: "",
                            formIngredientUnit: "",
                            formIngredientIndex: null,
                        })}>Cancel</button>
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
            <div className="box" onClick={() => this.props.fridgeClick(this.props.ingredient, this.props.index)}>
                <img className="image"
                     src={this.props.ingredient.imageURL
                         ? this.props.ingredient.imageURL
                         : this.getDefaultImage(this.props.ingredient.type)}
                     alt="Ingredient"/>
                <p className="title">{this.props.ingredient.name} </p>
                <p className="subtitle">({this.props.ingredient.quantity.amount} {this.props.ingredient.quantity.unit})</p>
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
