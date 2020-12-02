import React from 'react';
import user from '@testing-library/user-event';
import { render, screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { AuthContext } from '../components/handlers/AuthHandler';
import { FirestoreContext } from '../components/handlers/FirestoreHandler';
import { SpoonacularContext } from '../components/handlers/SpoonacularHandler';

import Ingredient from '../components/classes/Ingredient';
import Fridge from '../pages/Fridge';

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

function renderFridge() {
    const mockCallback = jest.fn(x => x);

    return render(<AuthContext.Provider value={authValue}>
        <FirestoreContext.Provider value={firestoreValue}>
            <SpoonacularContext.Provider value={spoonacularValue}>
                <Fridge populateSearch={mockCallback}/>
            </SpoonacularContext.Provider>
        </FirestoreContext.Provider>
    </AuthContext.Provider>);
}

describe('Tests for the Fridge', () => {
    it('Renders the fridge correctly', async () => {
        renderFridge();

        expect(screen.getByText('Your Fridge')).toBeInTheDocument();
        expect(screen.getByText('Add Ingredient')).toBeInTheDocument();
        await act(() => Promise.resolve());
    });

    it('Can open up and add ingredients from the form', async () => {
        renderFridge();

        user.click(screen.getByText('Add Ingredient'));
        const form = screen.getByText('Add an ingredient');
        expect(form).toBeInTheDocument();
        user.type(screen.getByLabelText('Name'), 'beef');
        user.type(screen.getByLabelText('Amount'), '3');
        user.type(screen.getByLabelText('Unit'), 'lbs');
        user.click(screen.getByText('Add'));
        expect(form).not.toBeInTheDocument();
        await waitForElementToBeRemoved(() => screen.getByText('Your fridge is currently empty. Add an ingredient to begin!'));
        expect(screen.getByText('Mock1')).toBeInTheDocument();
    });
});
