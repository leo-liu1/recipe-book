import React from 'react';
import renderer from 'react-test-renderer';
import Fridge from '../pages/Fridge';

it('renders correctly', () => {
    const tree = renderer
        .create(<Fridge />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
