import React from 'react';
import user from '@testing-library/user-event';
import { screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Fridge from '../pages/Fridge';
import renderComponent from "./testutil/MockDaddy";

describe('Tests for the Fridge', () => {
    it('Renders the fridge correctly', async () => {
        const mockCallback = jest.fn(x => x);
        renderComponent(Fridge, { populateSearch: mockCallback});

        expect(screen.getByText('Your Fridge')).toBeInTheDocument();
        expect(screen.getByText('Add Ingredient')).toBeInTheDocument();
        await act(() => Promise.resolve());
    });

    it('Can open up and add ingredients from the form', async () => {
        const mockCallback = jest.fn(x => x);
        renderComponent(Fridge, { populateSearch: mockCallback});

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
