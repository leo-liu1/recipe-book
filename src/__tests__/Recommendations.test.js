import user from '@testing-library/user-event';
import { screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Recommendations from '../pages/Recommendations';
import renderComponent from "./testutil/MockContext";

describe('Tests for the Recommendations page', () => {
    it('Renders the empty recommendation page correctly', async () => {
        renderComponent(Recommendations);

        expect(screen.getByText('Your Recommendations')).toBeInTheDocument();
        await act(() => Promise.resolve());
    });

    it('Renders dummy recipe', async () => {
        renderComponent(Recommendations);
        await act(() => Promise.resolve());

        expect(screen.getByText('MockRecipe2')).toBeInTheDocument();
        const ingredient = screen.getByText('MockIngredient3');
        expect(ingredient).toBeInTheDocument();
        user.click(screen.getByText('Go to Recipe'));
        await act(() => Promise.resolve());
    });
});
