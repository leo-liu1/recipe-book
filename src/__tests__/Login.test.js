import user from '@testing-library/user-event';
import { screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Login from '../pages/Login';
import renderComponent from "./testutil/MockContext";

describe('Tests for the Login page', () => {
    it('Renders the login page correctly', async () => {
        const mockCallback = jest.fn();
        renderComponent(Login, { checkAuth: mockCallback });
        await act(() => Promise.resolve(), null);

        expect(screen.getByText('Log in')).toBeInTheDocument();
    });

    it('Can log in', async () => {
        const mockCallback = jest.fn();
        renderComponent(Login, { checkAuth: mockCallback });

        user.type(screen.getByLabelText('Email'), 'test@test.com');
        user.type(screen.getByLabelText('Password'), 'password');

        const button = screen.getByTestId('submit');
        user.click(button);
        await waitFor(() => expect(button).toHaveAttribute('disabled'));
        await waitFor(() => expect(button).not.toHaveAttribute('disabled'));

        expect(screen.getByTestId('error')).toBeEmptyDOMElement();
        expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('Handles log in errors gracefully', async () => {
        renderComponent(Login);

        user.type(screen.getByLabelText('Email'), 'test@test.com');
        user.type(screen.getByLabelText('Password'), 'password');

        const button = screen.getByTestId('submit');
        user.click(button);
        await waitFor(() => expect(button).toHaveAttribute('disabled'));
        await waitFor(() => expect(button).not.toHaveAttribute('disabled'));

        expect(screen.getByText('Failed to log in')).toBeInTheDocument();
    });
});
