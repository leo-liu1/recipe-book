import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { AuthContext } from '../../components/handlers/AuthHandler';
import { FirestoreContext } from '../../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../../components/handlers/SpoonacularHandler';

import Ingredient from '../../components/classes/Ingredient';

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
    getAllUserIngredients:          () => Promise.resolve([
        new Ingredient({
            name: 'Mock1',
            spoonacularName: 'spoon',
            type: 'Meat',
            expirationDate: '12345',
            quantity: { amount: 2, unit: 'kg' },
            firestoreID: 100,
            userID: 101,
        }),
    ]),
    addUserBookmakedRecipes:        () => Promise.resolve(),
    removeUserBookmakedRecipes:     () => Promise.resolve(),
    getAllUserBookmarkedRecipes:    () => Promise.resolve(),
    addRecipeHistory:               () => Promise.resolve(),
    getRecipeHistory:               () => Promise.resolve(),
    getBookmarkHistory:             () => Promise.resolve(),
}

const spoonacularValue = {
    searchRecipeById:               () => Promise.resolve(),
    searchRecipeByIdWithMissing:    () => Promise.resolve(),
    searchRecipeByIngredients:      () => Promise.resolve(),
    searchIngredient:               (name) => Promise.resolve({
        spoonacularName: name,
        imageURL: 'testImage',
    }),
    searchSimilarRecipes:           () => Promise.resolve(),
}

export default function renderComponent(Component, props) {
    return render(<AuthContext.Provider value={authValue}>
        <FirestoreContext.Provider value={firestoreValue}>
            <SpoonacularContext.Provider value={spoonacularValue}>
                {React.createElement(Component, props)}
            </SpoonacularContext.Provider>
        </FirestoreContext.Provider>
    </AuthContext.Provider>);
}
