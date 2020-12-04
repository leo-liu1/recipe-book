import user from '@testing-library/user-event';
import { screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Recommendation from '../pages/Recommendations';
import renderComponent from "./testutil/MockContext";

describe('Tests for the Recommendation page', () => {
    it('Renders the empty recommendation page correctly', async () => {
        renderComponent(Recommendation, {});

        expect(screen.getByText('You currently have no recommendations. Search for a recipe to add to your history!')).toBeInTheDocument();
        await act(() => Promise.resolve());
    });

    it('Renders dummy recipe', async () => {
        renderComponent(Recommendation, {});
        await act(() => Promise.resolve());

        expect(screen.getByText('MockRecipe2')).toBeInTheDocument();
        const ingredient = screen.getByText('MockIngredient3');
        expect(ingredient).toBeInTheDocument();
        user.click(screen.getByText('Go to Recipe'));
        await act(() => Promise.resolve());
    });
});
