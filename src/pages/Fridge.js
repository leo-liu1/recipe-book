import React, { useState } from 'react';
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

export default function Fridge({ ingredients }) {
    document.title = 'Fridge';
    const [fridge, setFridge] = useState(ingredients ? ingredients : []);
    const [formData, setFormData] = useState({
        showForm: false,
        formIngredientName: '',
        formIngredientType: '',
        formIngredientExp: new Date(),
        formIngredientAmount: '',
        formIngredientUnit: '',
        formIngredientIndex: null,
    });

    function editIngredient(ingredient, index) {
        setFormData({
            showForm: true,
            formIngredientName: ingredient.name,
            formIngredientType: ingredient.type,
            formIngredientExp: new Date(ingredient.expirationDate),
            formIngredientAmount: ingredient.quantity.amount,
            formIngredientUnit: ingredient.quantity.unit,
            formIngredientIndex: index,
        });
    }

    function handleFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        clearFormData();
    }

    function handleAdd() {
        const newIngredient = new Ingredient({
            name: formData.formIngredientName,
            spoonacularName: null,
            type: formData.formIngredientType,
            expirationDate: formData.formIngredientExp.getTime(),
            quantity: {
                amount: formData.formIngredientAmount,
                unit: formData.formIngredientUnit,
            },
            imageURL: null,
        });

        const tempIngredients = fridge.slice();
        if (formData.formIngredientIndex) {
            tempIngredients[formData.formIngredientIndex] = newIngredient;
        } else {
            tempIngredients.push(newIngredient);
        }

        setFridge(tempIngredients);
    }

    function clearFormData() {
        setFormData({
            showForm: false,
            formIngredientName: "",
            formIngredientType: "",
            formIngredientExp: new Date(),
            formIngredientAmount: "",
            formIngredientUnit: "",
            formIngredientIndex: null,
        });
    }

    function handleRemove() {
        const tempIngredients = fridge.slice();
        if (formData.formIngredientIndex) {
            tempIngredients.splice(formData.formIngredientIndex, 1);
        }
        setFridge(tempIngredients);
    }

    function showForm() {
        return (
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="input-text">Ingredient name</label>
                        <input className="input"
                                name="formIngredientName"
                                type="text"
                                value={formData.formIngredientName}
                                onChange={handleFormChange}
                                required/>
                    </div>
                    <div>
                        <label className="input-text">Ingredient type</label>
                        <select className="input"
                                name="formIngredientType"
                                value={formData.formIngredientType}
                                onChange={handleFormChange}
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
                                value={formData.formIngredientAmount}
                                onChange={handleFormChange}
                                required/>
                    </div>
                    <div>
                        <label className="input-text">Ingredient Unit</label>
                        <input className="input"
                                name="formIngredientUnit"
                                type="text"
                                value={formData.formIngredientUnit}
                                onChange={handleFormChange}
                                required/>
                    </div>
                    <div>
                        <label className="input-text">Ingredient Expiration Date</label>
                        <DatePicker className="datepicker"
                                    placeholderText="Click to select date"
                                    minDate={formData.formIngredientExp}
                                    selected={formData.formIngredientExp}
                                    onChange={date => setFormData({...formData, formIngredientExp: date})} />
                    </div>
                    <div>
                        <button onClick={() => handleAdd()}>Submit</button>
                        <button onClick={() => handleRemove()}>Remove</button>
                        <button onClick={() => clearFormData()}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="fridge">
            {fridge.map((ingredient, index) =>
                <Box
                    ingredient={ingredient}
                    index={index}
                    fridgeClick={editIngredient}
                />)}
            {formData.showForm ? showForm() : null}
            <Fab
                icon={"+"}
                alwaysShowTitle={true}
                onClick={() => setFormData({...formData, showForm: !formData.showForm})}
            />
        </div>
    );
}

function Box({ ingredient, index, fridgeClick }) {
    const { expirationDate, imageURL, type, name, quantity } = ingredient;
    const { amount, unit } = quantity;
    const expDate = new Date(expirationDate).toLocaleDateString();

    function getDefaultImage(type) {
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

    return (
        <div className="box" onClick={() => fridgeClick(ingredient, index)}>
            <img className="image"
                src={imageURL ? imageURL : getDefaultImage(type)}
                alt="Ingredient" />
            <p className="title">{name} </p>
            <p className="subtitle">({amount} {unit})</p>
            <p className="subtitle">Expires: {expDate}</p>
        </div>
    );
}
