import user from '@testing-library/user-event';
import { screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Signup from '../pages/Signup';
import renderComponent from "./testutil/MockContext";

describe('Tests for the Signup page', () => {
    it('Renders the signup page correctly', async () => {
        const mockCallback = jest.fn();
        renderComponent(Signup, { checkAuth: mockCallback });
        await act(() => Promise.resolve(), null);

        expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    it('Can log in', async () => {
        const mockCallback = jest.fn();
        renderComponent(Signup, { checkAuth: mockCallback });

        user.type(screen.getByLabelText('Email'), 'test@test.com');
        user.type(screen.getByLabelText('Create a password'), 'password');
        user.type(screen.getByLabelText('Confirm password'), 'password');

        const button = screen.getByTestId('submit');
        user.click(button);
        await waitFor(() => expect(button).toHaveAttribute('disabled'));
        await waitFor(() => expect(button).not.toHaveAttribute('disabled'));

        expect(screen.getByTestId('error')).toBeEmptyDOMElement();
        expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('Handles sign up errors gracefully', async () => {
        renderComponent(Signup);

        user.type(screen.getByLabelText('Email'), 'test@test.com');
        user.type(screen.getByLabelText('Create a password'), 'password');
        user.type(screen.getByLabelText('Confirm password'), 'password');

        const button = screen.getByTestId('submit');
        user.click(button);
        await waitFor(() => expect(button).toHaveAttribute('disabled'));
        await waitFor(() => expect(button).not.toHaveAttribute('disabled'));

        expect(screen.getByText('Failed to create an account')).toBeInTheDocument();
    });
});
