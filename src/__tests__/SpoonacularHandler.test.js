/*
  These tests directly connect to our backend API and thus could be flakey.
*/

import Ingredient from '../components/classes/Ingredient';
import Recipe from '../components/classes/Recipe';

const API_Key = "c97dfa83d6134ce3853ff2bbd1c6f90f";

const getUniqueIngredients = (ingredientJSONArray) => {
    const ingredientSet = new Set();

    return ingredientJSONArray.filter((ingredientJSON) => { // filter out duplicates
        if (!ingredientSet.has(ingredientJSON.name)) { // if the name does not exist in the set, add it
            ingredientSet.add(ingredientJSON.name);
            return true;
        } else {
            return false;
        }
    }).map((ingredientJSON) => {
        let imageURL = ingredientJSON.image; // format image URL
        if (RegExp('^https://', 'g').test(imageURL)) { // if it is already a URL, make the image 250 x 250
            imageURL = imageURL.replace(/100/g, '250');
        } else {
            imageURL = `https://spoonacular.com/cdn/ingredients_250x250/${imageURL}`;
        }

        // return our new ingredient
        return new Ingredient({
            name: ingredientJSON.originalName,
            spoonacularName: ingredientJSON.name,
            type: ingredientJSON.aisle,
            expirationDate: null,
            quantity: {
                amount: ingredientJSON.measures ? ingredientJSON.measures.us.amount : ingredientJSON.amount,
                unit: ingredientJSON.measures ? ingredientJSON.measures.us.unitLong : ingredientJSON.unitLong,
            },
            imageURL: imageURL,
        });
    });
};
const checkSpoonacularFailure = (responseJSON) => {
    if (responseJSON.status === 'failure') { // if we reach our rate limit, throw an error
        throw new Error('Spoonacular API rate limit reached');
    } else {
        return responseJSON;
    }
}
const getSpoonacularAndFirestore = (spoonacularRequest) => {
    return Promise.all([ // we can make both requests simultaneously
        fetch(spoonacularRequest, { method: 'GET' })
            .then(response => response.json())
            .then(responseJSON => { // check for failure
                return checkSpoonacularFailure(responseJSON);
            }),
        //getAllUserIngredients(),
        fetch(spoonacularRequest, { method: 'GET' })
            .then(response => response.json())
            .then(responseJSON => { // check for failure
                return checkSpoonacularFailure(responseJSON);
            }),
    ]);
}
const searchRecipeById = async (recipeID) => {
    const spoonacularRequest = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
    try {
        // request both Spoonacular and Firestore in parallel
        const [spoonacularResponse, firestoreIngredients] = await getSpoonacularAndFirestore(spoonacularRequest);
        
        // get the recipe ingredients and missing ingredients
        const recipeIngredients = getUniqueIngredients(spoonacularResponse.extendedIngredients);
        //const fridgeMissingIngredients = getIngredientsNotInFirestore(recipeIngredients, firestoreIngredients);

        return new Recipe({
            name: spoonacularResponse.title,
            recipeID: spoonacularResponse.id,
            ingredients: recipeIngredients,
            imageURL: spoonacularResponse.image,
            recipeURL: spoonacularResponse.sourceUrl,
            missingIngredients: recipeIngredients,
        });
    } catch (err) {
        console.error(err);
        return {};
    }
};
const searchSimilarRecipes = async (recipeID) => {
    const spoonacularRequest = `https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${API_Key}&number=1`;

    try {
        const recipeJSONArray = checkSpoonacularFailure(await (await fetch(spoonacularRequest, { method: 'GET' })).json());
        const recipeObjectArray = recipeJSONArray.map((recipe_json) => {
            return recipe_json.id;
        });
        return recipeObjectArray ? recipeObjectArray[0] : null; // only grab the first result or null
    } catch (err) {
        console.error(err);
        return null;
    }
};
const searchRecipeByIngredients = async (ingredientList) => {
    const ingredientsString = ingredientList.join(",+");
    const spoonacularRequest = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_Key}&ingredients=${ingredientsString}&number=5`;

    try {
        // request both Spoonacular and Firestore in parallel
        const [spoonacularResponse, firestoreIngredients] = await getSpoonacularAndFirestore(spoonacularRequest);

        const recipeArray = spoonacularResponse.map(async (recipeJSON) => {
            const missingIngredients = getUniqueIngredients(recipeJSON.missedIngredients);
            //const fridgeMissingIngredients = getIngredientsNotInFirestore(missingIngredients, firestoreIngredients);
            const recipeURL = await getRecipeURL(recipeJSON.id); // we need to make another request to get the recipe URL

            return new Recipe({
                name: recipeJSON.title,
                recipeID: recipeJSON.id,
                ingredients: getUniqueIngredients(recipeJSON.usedIngredients).concat(missingIngredients),
                imageURL: recipeJSON.image,
                recipeURL: recipeURL,
                //missingIngredients: getUniqueIngredients(recipeJSON.usedIngredients).concat(missingIngredients),,
            });
        });

        // since we have to make an async request for each recipe URL, we have to wait for all to resolve
        return Promise.all(recipeArray);
    } catch (err) {
        console.error(err);
        return [];
    }
};
const getRecipeURL = async (recipeID) => {
    let requestString = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_Key}&includeNutrition=false`;
    try {
        const recipeJSON = checkSpoonacularFailure(await (await fetch(requestString, { method: 'GET' })).json());

        return recipeJSON.sourceUrl;
    } catch (err) {
        console.error(err);
        return {};
    }
};
const searchIngredient = async (name) => {
    const spoonacularRequest = `https://api.spoonacular.com/food/ingredients/search?apiKey=${API_Key}&query=${name}&number=1`; // limited to only the first response
    
    try {
        const responseJSON = checkSpoonacularFailure(await (await fetch(spoonacularRequest, { method: 'GET' })).json());
        // either grab first result or set to empty object
        const ingredientJSON = (responseJSON && responseJSON.results.length > 0) ? responseJSON.results[0] : {};

        if (typeof ingredientJSON.name !== 'undefined' && typeof ingredientJSON.image !== 'undefined') {
            return {
                spoonacularName: ingredientJSON.name,
                imageURL: `https://spoonacular.com/cdn/ingredients_250x250/${ingredientJSON.image}`,
            };
        } else { // Spoonacular could not find the ingredient
            return {};
        }
    } catch (err) {
        console.error(err);
        return {};
    }
};
describe('Tests for the Spoonacular', () => {
    it('searchRecipeById', async () => {
        const id = "74315"

        const recipe = await searchRecipeById(id)
        expect(recipe.recipeID).toBe(74315);

    });

    it('searchSimilarRecipes', async () => {
        const id = "74315"

        const id_received = await searchSimilarRecipes(id)
        expect(id_received).toBe(707552);

    });

    it('searchRecipeByIngredients', async () => {
        const ingredients = ["beef"]

        const recipes = await searchRecipeByIngredients(ingredients)
        expect(recipes.length).toBe(5);

    });
    it('searchIngredient', async () => {
        const ingredient = "beef"

        const ingredient_received = await searchIngredient(ingredient)
        expect(ingredient_received.spoonacularName).toBe("beef");

    });

});


