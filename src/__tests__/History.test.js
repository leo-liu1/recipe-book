import user from '@testing-library/user-event';
import { screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import History from '../pages/History';
import renderComponent from "./testutil/MockContext";

describe('Tests for the History page', () => {
    it('Renders the empty history page correctly', async () => {
        renderComponent(History);

        expect(screen.getByText('Your History')).toBeInTheDocument();
        await act(() => Promise.resolve());
    });

    it('Renders dummy recipe and removes it from history page as requested', async () => {
        renderComponent(History);

        await act(() => Promise.resolve());
        expect(screen.getByText('MockRecipe1')).toBeInTheDocument();
        const removeButton = screen.getByText('Remove Recipe From History');
        expect(removeButton).toBeInTheDocument();
        user.click(removeButton);
        await waitForElementToBeRemoved(() => screen.getByText('MockRecipe1'));
        expect(screen.getByText('Your search history is empty. Search for a recipe to add to your history!')).toBeInTheDocument();
    });
});
