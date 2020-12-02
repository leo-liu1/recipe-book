import React from "react";
import * as firestoreHandler from '../components/handlers/FirestoreHandler'
import Fridge from "../pages/Fridge";
import Ingredient from "../components/classes/Ingredient";
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { shallow, mount, render } from 'enzyme';
import { useFirestore } from "../components/handlers/FirestoreHandler";

Enzyme.configure({ adapter: new Adapter() });

const addUserIngredient = jest.fn().mockImplementation(ingredient => Promise.resolve());
const removeUserIngredient = jest.fn().mockImplementation(ingredient => Promise.resolve());
const updateUserIngredient = jest.fn().mockImplementation(ingredient => Promise.resolve());
const getAllUserIngredient = jest.fn().mockImplementation(ingredient => Promise.resolve([
    new Ingredient({
        name: "Mock1",
        spoonacularName: "spoon",
        type: "Meat",
        expirationDate: "12345",
        quantity: { amount: 2, unit: 'kg' },
        firestoreID: 100,
        userID: 101,
    }),
]));

describe("Tests for the Fridge", () => {
    const mockCallback = jest.fn(x => x);
    const mockUseFirestore = {
        addUserIngredient: addUserIngredient,
        removeUserIngredient: removeUserIngredient,
        updateUserIngredient: updateUserIngredient,
        getAllUserIngredients: getAllUserIngredient,
    };

    it("Renders the fridge correctly", () => {
        // These two lines have to be within the test or the tests don't compile - some dependency with mocks
        const mock = jest.spyOn(firestoreHandler, 'useFirestore');  // spy on otherFn
        mock.mockReturnValue(mockUseFirestore);

        const fridge = shallow(<Fridge populateSearch={mockCallback}/>);
        expect(fridge.find('div.page-title-text').text()).toEqual("Your Fridge");
        expect(useFirestore()).toEqual(mockUseFirestore);
    });

    it("Can open up the 'add ingredients' form", () => {
        // These two lines have to be within the test or the tests don't compile - some dependency with mocks
        const mock = jest.spyOn(firestoreHandler, 'useFirestore');  // spy on otherFn
        mock.mockReturnValue(mockUseFirestore);

        const fridge = mount(<Fridge populateSearch={mockCallback}/>);
        expect(fridge.find('div.page-title-text').text()).toEqual("Your Fridge");
    });
});
