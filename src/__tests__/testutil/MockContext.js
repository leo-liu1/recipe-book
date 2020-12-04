import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { AuthContext } from '../../components/handlers/AuthHandler';
import { FirestoreContext } from '../../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../../components/handlers/SpoonacularHandler';

import Ingredient from '../../components/classes/Ingredient';
import Recipe from '../../components/classes/Recipe'
import MeatImage from '../../assets/images/meat.jpg'

const mockRecipe = new Recipe({
    name: 'MockRecipe1',
    recipeID: 1234,
    ingredients: [
        new Ingredient({
            name: 'MockIngredient2',
            spoonacularName: 'MockSpoon1',
            type: "Dairy",
            expirationDate: 1234,
            quantity: {
                amount: 1,
                unit: 'oz',
            },
            userID: 12345,
            firestoreID: 'abc'
        })
    ],
    imageURL: MeatImage,
    recipeURL: "https://www.google.com/",
    missingIngredients: [],
    userID: 12345,
    firestoreID: 'ab',
    frequency: 1
});

const mockIngredient = new Ingredient({
    name: 'Mock1',
    spoonacularName: 'spoon',
    type: 'Meat',
    expirationDate: '12345',
    quantity: { amount: 2, unit: 'kg' },
    firestoreID: 100,
    userID: 101,
});

const authValue = {
    signup:                         () => Promise.resolve(),
    login:                          () => Promise.resolve(),
    logout:                         () => Promise.resolve(),
    getUserID:                      () => Promise.resolve(),
    isUserAuthenticated:            () => Promise.resolve(),
}

const firestoreValue = {
    addUserIngredient:              (Ingredient) => Promise.resolve({
        id: 'addedIngredient',
    }),
    removeUserIngredient:           () => Promise.resolve(),
    updateUserIngredient:           () => Promise.resolve(),
    getAllUserIngredients:          () => Promise.resolve([mockIngredient]),
    addRecipeHistory:               () => Promise.resolve(),
    removeRecipeHistory:           () => Promise.resolve(),
    getMostFrequentRecipeHistory:   () => Promise.resolve(),
    getLastUpdatedRecipeHistory:    () => Promise.resolve(),
}

const spoonacularValue = {
    searchRecipeById:               () => Promise.resolve(),
    searchRecipeByIngredients:      () => Promise.resolve([mockRecipe]),
    searchIngredient:               (name) => Promise.resolve({
        spoonacularName: name,
        imageURL: 'testImage',
    }),
    searchSimilarRecipes:           () => Promise.resolve(),
}

export default function renderComponent(component, props, route='', wrapper={}) {
    if (route) {
        window.history.pushState({}, 'Test page', route)
    }
    return render(<AuthContext.Provider value={authValue}>
        <FirestoreContext.Provider value={firestoreValue}>
            <SpoonacularContext.Provider value={spoonacularValue}>
                {React.createElement(component, props)}
            </SpoonacularContext.Provider>
        </FirestoreContext.Provider>
    </AuthContext.Provider>, wrapper);
}
