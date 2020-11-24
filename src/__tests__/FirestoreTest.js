import firebase from 'firebase';
import FirestoreHandler from '../components/handlers/FirestoreHandler';
import Ingredient from '../components/classes/Ingredient';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measureId: process.env.REACT_APP_MEASUREMENT_ID,
};
  
firebase.initializeApp(firebaseConfig);

let firestoreHandler = new FirestoreHandler("Test");
let sampleIngredient = new Ingredient(
    "name",
    "spoonacularName",
    "type",
    "expirationDate",
    "quantity",
    "imageURL"
);

test('AddIngredient', () => {
    return expect(firestoreHandler.addUserIngredient(sampleIngredient)).resolves.toBeDefined();
});

// test('UpdateIngredient', () => {
//     return expect(firestoreHandler.updateUserIngredient(sampleIngredient)).resolves.toBeDefined();
// });

// test('RemoveIngredient', () => {
//     return expect(firestoreHandler.removeUserIngredient(sampleIngredient)).resolves.toBeDefined();
// });

// test('RegisterUser', () => {
//     return expect(firestoreHandler.addUserIngredient(sampleIngredient)).resolves.toBeDefined();
// });

// test('LoginUser', () => {
//     return expect(firestoreHandler.addUserIngredient(sampleIngredient)).resolves.toBeDefined();
// });