import React, { useState, useEffect } from 'react';
import { useFirestore } from '../components/handlers/FirestoreHandler';
import DatePicker from "react-datepicker";
import Ingredient from '../components/classes/Ingredient';
import Seasoning from '../components/classes/Seasoning';

import meatImage from '../assets/images/meat.jpg'
import dairyImage from '../assets/images/dairy.jpg'
import carbImage from '../assets/images/carb.jpg'
import fruitImage from '../assets/images/fruit.jpg'
import vegetableImage from '../assets/images/vegetable.jpg'
import seasoningImage from '../assets/images/seasoning.jpg'

import "react-datepicker/dist/react-datepicker.css";

const ITEM_ROW_LENGTH = 4;

export default function Fridge({ ingredients }) {
    document.title = 'Fridge';
    const ingredientTypes = [
        'Meat',
        'Dairy',
        'Vegetable',
        'Fruit',
        'Carbs',
    ];

    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, updateUserIngredient } = useFirestore();
    const [fridge, setFridge] = useState(ingredients ? ingredients : []);
    useEffect(() => {
        getAllUserIngredients()
            .then((ingredients) => setFridge(ingredients))
            .catch((err) => console.log(err));
    }, [getAllUserIngredients]);

    const [showForm, setShowForm] = useState(false);
    const [newIngredient, setNewIngredient] = useState(false);
    const [isSeasoning, setIsSeasoning] = useState(false);
    const [formData, setFormData] = useState({
        formIngredientName: '',
        formIngredientType: ingredientTypes[0],
        formIngredientExp: new Date(),
        formIngredientAmount: '',
        formIngredientUnit: '',
        formIngredientIndex: null,
        formIngredientID: null,
    });

    function editIngredient(ingredient, index) {
        setShowForm(true);
        setNewIngredient(false);
        if (ingredient.getClassType() === "Seasoning") {
            setIsSeasoning(true);
            setFormData({
                formIngredientName: ingredient.name,
                formIngredientIndex: index,
                formIngredientID: ingredient.firestoreID,
            })
        } else {
            setIsSeasoning(false);
            setFormData({
                formIngredientName: ingredient.name,
                formIngredientType: ingredient.type,
                formIngredientExp: new Date(ingredient.expirationDate),
                formIngredientAmount: ingredient.quantity.amount,
                formIngredientUnit: ingredient.quantity.unit,
                formIngredientIndex: index,
                formIngredientID: ingredient.firestoreID,
            });
        }
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
        setShowForm(false);
        clearFormData();
    }

    function handleAdd() {
        const newElement = isSeasoning
            ? new Seasoning({
                name: formData.formIngredientName,
                spoonacularName: null,
                imageURL: null,
                firestoreID: formData.formIngredientID,
            })
            : new Ingredient({
                name: formData.formIngredientName,
                spoonacularName: null,
                type: formData.formIngredientType,
                expirationDate: formData.formIngredientExp.getTime(),
                quantity: {
                    amount: formData.formIngredientAmount,
                    unit: formData.formIngredientUnit,
                },
                imageURL: null,
                firestoreID: formData.formIngredientID,
            });

        if (typeof formData.formIngredientIndex === 'number') {
            updateUserIngredient(newElement)
                .then(() => getAllUserIngredients())
                .then((userIngredients) => setFridge(userIngredients))
                .catch(err => console.log(err));
        } else {
            addUserIngredient(newElement)
                .then(() => getAllUserIngredients())
                .then((userIngredients) => setFridge(userIngredients))
                .catch(err => console.log(err));
        }
    }

    function formFilled() {
        let validate = true;
        Object.values(formData).forEach(value => {
            if (value === '') {
                validate = false;
            }
        });

        return validate;
    }

    function clearFormData() {
        setFormData({
            formIngredientName: "",
            formIngredientType: ingredientTypes[0],
            formIngredientExp: new Date(),
            formIngredientAmount: "",
            formIngredientUnit: "",
            formIngredientIndex: null,
            formIngredientID: null,
        });
    }

    function handleRemove() {
        if (typeof formData.formIngredientIndex === 'number') {
            let ingredientToRemove = fridge[formData.formIngredientIndex];
            removeUserIngredient(ingredientToRemove)
                .then(() => getAllUserIngredients())
                .then((userIngredients) => setFridge(userIngredients))
                .catch(err => console.log(err));
        }
    }

    function handleCancel() {
        clearFormData();
        setShowForm(false);
    }

    function handleCreateIngredient(type) {
        if (!showForm || !formFilled()) {
            // if the dialog is already open, do not close the form if we're switching from ingredient to seasoning or vice versa
            if (showForm && (((type === "Ingredient" && isSeasoning)) || (type === "Seasoning" && !isSeasoning))) {
                // do nothing
            } else {
                setShowForm(!showForm);
            }
        }
        setNewIngredient(true);
        type === "Ingredient" ? setIsSeasoning(false) : setIsSeasoning(true);
        clearFormData();
    }

    function renderForm() {
        return (
            <div className="form-dialog">
                <div className="form-dialog-container">
                    <div className="form-title">
                        {newIngredient ?
                            `Add a${isSeasoning ?
                                ' seasoning' :
                                'n ingredient'}` :
                            `Edit ${formData.formIngredientName}`}
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input">
                            <label>Name</label>
                            <input
                                name="formIngredientName"
                                type="text"
                                value={formData.formIngredientName}
                                onChange={handleFormChange}
                                required/>
                        </div>
                        {!isSeasoning && <div className="input">
                            <label>Type</label>
                            <select
                                name="formIngredientType"
                                value={formData.formIngredientType}
                                onChange={handleFormChange}
                                required>
                                {ingredientTypes.map((type, index) => {
                                    return (<option value={type} key={index}>{type}</option>);
                                })}
                            </select>
                        </div>}
                        {!isSeasoning && <div className="input">
                            <label>Amount</label>
                            <input
                                name="formIngredientAmount"
                                type="number"
                                value={formData.formIngredientAmount}
                                onChange={handleFormChange}
                                required/>
                        </div>}
                        {!isSeasoning && <div className="input">
                            <label>Unit</label>
                            <input
                                name="formIngredientUnit"
                                type="text"
                                value={formData.formIngredientUnit}
                                onChange={handleFormChange}
                                required/>
                        </div>}
                        {!isSeasoning && <div className="input">
                            <label>Expiration Date</label>
                            <DatePicker className="datepicker"
                                        placeholderText="Click to select date"
                                        minDate={formData.formIngredientExp}
                                        selected={formData.formIngredientExp}
                                        onChange={date => setFormData({...formData, formIngredientExp: date})} />
                        </div>}
                        <div className="button-container">
                            <button className="button add" onClick={() => handleAdd()}>{newIngredient ? "Add" : "Edit"}</button>
                            {!newIngredient && <button className="button remove" onClick={() => handleRemove()}>Remove</button>}
                            <button className="button cancel" onClick={() => handleCancel()}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // create empty elements so that the last ingredient added to the fridge is left aligned with the other ingredients in a grid
    let emptyElements = [];
    if (fridge.length % ITEM_ROW_LENGTH !== 0) {
        for (let i = 0; i < ITEM_ROW_LENGTH - (fridge.length % ITEM_ROW_LENGTH); i++) {
            emptyElements.push(<div className="empty" key={i}/>);
        }
    }

    return (
        <div className="fridge">
            <div className="fridge-container">
                {fridge.map((ingredient, index) =>
                    <Box
                        key={index}
                        ingredient={ingredient}
                        index={index}
                        fridgeClick={editIngredient}
                    />)}
                {emptyElements}
            </div>
            <div className="edit-container">
                <button className="button add-ingredient" onClick={() => handleCreateIngredient("Ingredient")}>Add Ingredient</button>
                <button className="button add-seasoning" onClick={() => handleCreateIngredient("Seasoning")}>Add Seasoning</button>
            </div>
            {showForm ? renderForm() : null}
        </div>
    );
}

function Box({ ingredient, index, fridgeClick }) {
    const isSeasoning = ingredient.getClassType() === "Seasoning";
    const expDate = isSeasoning ? null : new Date(ingredient.expirationDate).toLocaleDateString();

    function getDefaultImage(ingredient) {
        let type = ingredient.getClassType() === "Seasoning" ? "Seasoning" : ingredient.type;
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
            case "Seasoning":
                return seasoningImage;
            default:
                return carbImage;
        }
    }

    return (
        <div className="box" onClick={() => fridgeClick(ingredient, index)}>
            <img className="image"
                src={ingredient.imageURL ? ingredient.imageURL : getDefaultImage(ingredient)}
                alt="Ingredient" />
            <div className="ingredient">
                <div className="name">{ingredient.name} </div>
                {!isSeasoning && <div className="quantity">({ingredient.quantity.amount} {ingredient.quantity.unit})</div>}
            </div>
            {!isSeasoning
                ? <div className="expiration-date">Expires: {expDate}</div>
                : <div className="expiration-date">&nbsp;&nbsp;</div>
            }
        </div>
    );
}
