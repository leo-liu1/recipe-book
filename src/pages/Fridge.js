import React, { useState, useEffect, useContext } from 'react';
import ClassNames from 'classnames';

import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';
import DatePicker from "react-datepicker";
import Ingredient from '../components/classes/Ingredient';
import Seasoning from '../components/classes/Seasoning';

import meatImage from '../assets/images/meat.jpg';
import dairyImage from '../assets/images/dairy.jpg';
import carbImage from '../assets/images/carb.jpg';
import fruitImage from '../assets/images/fruit.jpg';
import vegetableImage from '../assets/images/vegetable.jpg';
import seasoningImage from '../assets/images/seasoning.jpg';

import "react-datepicker/dist/react-datepicker.css";

/**
 * @callback populateSearch
 * @param {string} fridgeSearchStr - string that will populate our navbar search
 */

/**
 * Fridge that renders all our user ingredients. A user can add, remove, and update ingredients or
 * seasonings from the fridge. Additionally, they can select ingredients that they would like to
 * make recipes for.
 * 
 * @class
 * @param {Object} fridge
 * @param {populateSearch} fridge.populateSearch - Callback that triggers when we select items from the fridge we want to search for
 */
function Fridge({ populateSearch }) {
    /**
     * @constant - How many items we should show per row
     * @type {number}
     * @default
     */
    const ITEM_ROW_LENGTH = 4;
        
    document.title = 'Fridge';
    const ingredientTypes = [ // list of default types of ingredients
        'Meat',
        'Dairy',
        'Vegetable',
        'Fruit',
        'Carbs',
    ];
    
    const [fridge, setFridge] = useState(null); // state to keep track of all fridge ingredients, on first render we don't render anything
    const [showForm, setShowForm] = useState(false);
    const [originalTitle, setOriginalTitle] = useState(''); // used for editing ingredients, display original ingredient name
    const [newIngredient, setNewIngredient] = useState(false);
    const [isSeasoning, setIsSeasoning] = useState(false);
    const [formData, setFormData] = useState({ // data associated with the input form
        formIngredientName: '',
        formIngredientType: ingredientTypes[0],
        formIngredientExp: new Date(),
        formIngredientAmount: '',
        formIngredientUnit: '',
        formIngredientIndex: null,
        formIngredientID: null,
    });
    const [chooseActive, setChooseActive] = useState(false); // toggles between edit and choose ingredient
    const [chosenIngredients, setChosenIngredients] = useState({});

    const { addUserIngredient, removeUserIngredient, getAllUserIngredients, updateUserIngredient } = useContext(FirestoreContext);
    useEffect(() => { // get all user ingredients on load
        getAllUserIngredients()
        .then((ingredients) => setFridge(ingredients))
        .catch((err) => console.error(err));
    }, [getAllUserIngredients]);

    const { searchIngredient } = useContext(SpoonacularContext);

    /**
     * Triggers when the user selects an ingredient to edit. Shows the form and populates it
     * based off the ingredient's information.
     * @param {Ingredient} ingredient - ingredient to edit
     * @param {number} index - index of the ingredient that is being edited
     */
    function editIngredient(ingredient, index) {
        setShowForm(true);
        setNewIngredient(false);
        setOriginalTitle(ingredient.name);
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

    /**
     * Handler for whenever the form is changed
     * @param {onChange} event - Event that triggers when the form is changed
     * @listens onChange
     */
    function handleFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    /**
     * Handler for when the form is submitted
     * @param {onSubmit} event - Event that triggers when the form is submitted
     * @listens onSubmit
     */
    function handleSubmit(event) {
        event.preventDefault();
        setShowForm(false);
        clearFormData();
    }

    /**
     * Handler when the user either edits the ingredient or adds it. Creates the ingredient if it
     * does not exist, queries Spoonacular for the name in Spoonacular, and then refreshes the
     * fridge to reflect the new edit or addition.
     */
    function handleAdd() {
        if (!formFilled()) { // if the form is not filled, return
            return;
        }        

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
        
        const name = formData.formIngredientName;

        if (typeof formData.formIngredientIndex === 'number') { // editing ingredient
            // query Spoonacular to set the ingredient's Spoonacular name
            searchIngredient(name).then(({ spoonacularName, imageURL }) => {
                if (typeof spoonacularName !== 'undefined') {
                    newElement.spoonacularName = spoonacularName;
                    newElement.imageURL = imageURL;
                }
                return updateUserIngredient(newElement);
            })
            .then(() => getAllUserIngredients()) // refresh the fridge
            .then((userIngredients) => setFridge(userIngredients))
            .catch((err) => console.error(err));
        } else { // adding new ingredient
            // query Spoonacular to set the ingredient's Spoonacular name
            searchIngredient(name).then(({ spoonacularName, imageURL }) => {
                if (typeof spoonacularName !== 'undefined') {
                    newElement.spoonacularName = spoonacularName;
                    newElement.imageURL = imageURL;
                }
                return addUserIngredient(newElement);
            }).then((docRef) => { // set the firestore ID to be the document ID
                newElement.firestoreID = docRef.id;
                return getAllUserIngredients(); // refresh the fridge
            })
            .then((userIngredients) => setFridge(userIngredients))
            .catch((err) => console.error(err));
        }
    }

    /**
     * Returns true if the form if the necessary fields for the ingredient or seasoning are filled
     * @returns {boolean} If the form was filled out correctly or not
     */
    function formFilled() {
        if (isSeasoning) {
            return formData.formIngredientName !== '';
        } // else is ingredient

        let validate = true;
        Object.values(formData).forEach(value => {
            if (value === '') {
                validate = false;
            }
        });

        return validate;
    }

    /**
     * Resets the form data
     */
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

    /**
     * Handler to remove the ingredient from the fridge and refresh the form
     */
    function handleRemove() {
        if (typeof formData.formIngredientIndex === 'number') {
            let ingredientToRemove = fridge[formData.formIngredientIndex];
            removeUserIngredient(ingredientToRemove)
                .then(() => getAllUserIngredients()) // refreshes the fridge
                .then((userIngredients) => setFridge(userIngredients))
                .catch(err => console.error(err));
        }
    }

    /**
     * Handler if the user wants to exit out of the form dialog without changes
     */
    function handleCancel() {
        clearFormData();
        setShowForm(false);
    }

    /**
     * Handles the creation of the ingredient and decides between Ingredient and Seasoning
     * @param {string} type - Ingredient or Seasoning
     */
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

    /**
     * Handler for toggling between choosing ingredients and editing ingredients
     * @param {boolean} toggleChoose - true if choose mode is active, false if we're editing ingredients
     */
    function chooseIngredients(toggleChoose) {
        setChooseActive(toggleChoose);

        if (!toggleChoose) {
            setChosenIngredients({}); // remove all chosen ingredients from our state
            populateSearch(''); // clear the search bar
        } else {
            setShowForm(false); // close the form if we're choosing
        }
    }

    /**
     * Function that populates the navbar search with the ingredients that the user chooses
     * @param {Ingredient} ingredient - Ingredient that is being clicked
     * @param {boolean} selected - If the ingredient is actively being selected or not
     */
    function chooseIngredient(ingredient, selected) {
        const newChosen = selected ? // if the ingredient was selected, we add it as a mapping from firestoreID to Ingredient
            { ...chosenIngredients, [ingredient.firestoreID]: ingredient } :
            { ...chosenIngredients, [ingredient.firestoreID]: null };
        
        setChosenIngredients(newChosen);
        const fridgeSearchStr = Object.values(newChosen).filter((ingredient) => { // get only elements that are non-null
            return ingredient !== null;
        }).map((ingredient) => { // return only the name for each ingredient
            return ingredient.spoonacularName ? ingredient.spoonacularName : ingredient.name;
        }).join(', '); // join them all together, separated by commas

        populateSearch(fridgeSearchStr); // populate the navbar search with the chosen ingredients
    }

    /**
     * Renders the form component
     */
    function renderForm() {
        return (
            <div className="form-dialog">
                <div className="form-dialog-container">
                    <div className="form-title">
                        {newIngredient ?
                            `Add a${isSeasoning ?
                                ' seasoning' :
                                'n ingredient'}` :
                            `Edit ${originalTitle}`}
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input">
                            <label htmlFor="formIngredientName">Name</label>
                            <input
                                name="formIngredientName"
                                id="formIngredientName"
                                type="text"
                                value={formData.formIngredientName}
                                onChange={handleFormChange}
                                required/>
                        </div>
                        {!isSeasoning && <div className="input">
                            <label htmlFor="formIngredientType">Type</label>
                            <select
                                name="formIngredientType"
                                id="formIngredientType"
                                value={formData.formIngredientType}
                                onChange={handleFormChange}
                                required>
                                {ingredientTypes.map((type, index) => {
                                    return (<option value={type} key={index}>{type}</option>);
                                })}
                            </select>
                        </div>}
                        {!isSeasoning && <div className="input">
                            <label htmlFor="formIngredientAmount">Amount</label>
                            <input
                                name="formIngredientAmount"
                                id="formIngredientAmount"
                                type="number"
                                value={formData.formIngredientAmount}
                                onChange={handleFormChange}
                                required/>
                        </div>}
                        {!isSeasoning && <div className="input">
                            <label htmlFor="formIngredientUnit">Unit</label>
                            <input
                                name="formIngredientUnit"
                                id="formIngredientUnit"
                                type="text"
                                value={formData.formIngredientUnit}
                                onChange={handleFormChange}
                                required/>
                        </div>}
                        {!isSeasoning && <div className="input">
                            <label htmlFor="datePicker">Expiration Date</label>
                            <DatePicker className="datepicker"
                                        id="datepicker"
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
    if (fridge && fridge.length % ITEM_ROW_LENGTH !== 0) {
        for (let i = 0; i < ITEM_ROW_LENGTH - (fridge.length % ITEM_ROW_LENGTH); i++) {
            emptyElements.push(<div className="empty" key={i}/>);
        }
    }

    const editIngredientClass = ClassNames('button', 'edit-ingredient', {
        active: !chooseActive,
        inactive: chooseActive,
    });
    const chooseIngredientClass = ClassNames('button', 'choose-ingredient', {
        active: chooseActive,
        inactive: !chooseActive,
    });
    
    const addButtonClass = ClassNames('button', {
        active: !chooseActive,
        inactive: chooseActive,
    });

    return (
        <div className="fridge">
            <div className="page-title">
                <div className="page-title-text">
                    Your Fridge
                </div>
                <div className="edit-container">
                    <button className={editIngredientClass} disabled={!chooseActive} onClick={() => chooseIngredients(false)}>Edit Ingredients</button>
                    <button className={chooseIngredientClass} disabled={chooseActive} onClick={() => chooseIngredients(true)}>Choose Ingredients</button>
                </div>
            </div>
            {/* on first render, we do not render anything */}
            {fridge !== null &&
                <div className="fridge-container">
                    {fridge.length === 0 ?
                        <div className="empty-fridge">Your fridge is currently empty. Add an ingredient to begin!</div> :
                        fridge.map((ingredient, index) =>
                            <Box
                                key={index}
                                ingredient={ingredient}
                                index={index}
                                editIngredient={editIngredient}
                                chooseActive={chooseActive}
                                chooseIngredient={chooseIngredient}
                            />)}
                    {emptyElements}
                </div>}
            <div className="add-container">
                <div className="button-background">
                    <button
                        className={addButtonClass}
                        onClick={() => handleCreateIngredient("Ingredient")}
                        disabled={chooseActive}>
                        Add Ingredient
                    </button>
                </div>
                <div className="button-background">
                    <button
                        className={addButtonClass}
                        onClick={() => handleCreateIngredient("Seasoning")}
                        disabled={chooseActive}>
                        Add Seasoning
                    </button>
                </div>
            </div>
            {showForm ? renderForm() : null}
        </div>
    );
}

/**
 * @callback editIngredient
 * @param {Ingredient} ingredient - ingredient to edit
 * @param {number} index - index of the ingredient that is being edited
 */

/** 
 * @callback chooseIngredient
 * @param {Ingredient} ingredient - Ingredient that is being clicked
 * @param {boolean} selected - If the ingredient is actively being selected or not
 */

/**
 * Helper function to Fridge that renders all the boxes that we use to show the ingredients
 * 
 * @class
 * @param {Object} box
 * @param {Ingredient} box.ingredient - Ingredient to render
 * @param {number} box.index - Index of the box
 * @param {editIngredient} box.editIngredient - Callback function from Fridge that determines what ingredient to modify
 * @param {boolean} box.chooseActive - Whether the choose mode is active or not
 * @param {chooseIngredient} box.chooseIngredient - Callback function from Fridge that determines what ingredient to choose
 */
function Box({ ingredient, index, editIngredient, chooseActive, chooseIngredient }) {
    const [selected, setSelected] = useState(false);

    // if the user switches to edit ingredient, unselect all options
    useEffect(() => {
        if (!chooseActive) {
            setSelected(false);
        }
    }, [chooseActive]);

    const isSeasoning = ingredient.getClassType() === "Seasoning";
    const expDate = isSeasoning ? null : new Date(ingredient.expirationDate).toLocaleDateString();

    /**
     * Returns default image based off what user clasifies for the ingredient
     * @param {Ingredient} ingredient - Ingredient object
     * @returns {string} Default image to be rendered
     */
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

    /**
     * Handler that triggers when the box is clicked
     * @param {Ingredient} ingredient - Ingredient that was clicked
     * @param {number} index - Index of the ingredient
     */
    function handleClick(ingredient, index) {
        if (!chooseActive) {
            editIngredient(ingredient, index);
        } else {
            chooseIngredient(ingredient, !selected);
            setSelected(!selected);
        }
    }

    const selectedClass = {
        // selected: selected && chooseActive,
        'not-selected': !selected && chooseActive,
    };
    const imageClass = ClassNames('image', selectedClass);
    const ingredientClass = ClassNames('ingredient', selectedClass);
    const expirationDateClass = ClassNames('expiration-date', selectedClass);

    return (
        <div className="box" onClick={() => handleClick(ingredient, index)}>
            <img className={imageClass}
                src={ingredient.imageURL ? ingredient.imageURL : getDefaultImage(ingredient)}
                alt="Ingredient" />
            <div className={ingredientClass}>
                <div className="name">{ingredient.name} </div>
                {!isSeasoning && <div className="quantity">({ingredient.quantity.amount} {ingredient.quantity.unit})</div>}
            </div>
            <div className={expirationDateClass}>{isSeasoning ? <>&nbsp;</> : `Expires: ${expDate}`}</div>
        </div>
    );
}

export default Fridge;
