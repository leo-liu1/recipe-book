import user from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'
import { screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Search from '../pages/Search';
import renderComponent from "./testutil/MockContext";

describe('Tests for the Search page', () => {
    // Mocks the useLocation() by returning 'pork, rice' as the search query
    jest.mock("react-router-dom", () => ({
        ...jest.requireActual("react-router-dom"),
        useLocation: () => ({
            search: "?q=pork%2C%20rice"
        })
    }));

    it('Renders the search page correctly with the correct query', async () => {
        renderComponent(Search, {}, '/search?q=pork%2C%20rice',{ wrapper: BrowserRouter});
        await act(() => Promise.resolve());

        expect(screen.getByText('You Searched for pork, rice')).toBeInTheDocument();
    });

    it('Correctly renders the recipe box and buttons work as intended', async () => {
        renderComponent(Search, {}, '/search?q=pork%2C%20rice',{ wrapper: BrowserRouter});
        await act(() => Promise.resolve());

        const recipe = screen.getByText('MockRecipe1');
        expect(recipe).toBeInTheDocument();
        const ingredient = screen.getByText('MockIngredient2');
        expect(ingredient).toBeInTheDocument();
        user.click(screen.getByText('Go to Recipe'));
        await act(() => Promise.resolve());
    });
});
