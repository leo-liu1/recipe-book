import Ingredient from '../classes/Ingredient.js'

export default class FirestoreHandler{
	constructor(userID){
		this.userID = userID;
	}
	
	addUserIngredient(Ingredient ingredient){
		firebase.firestore().collection('ingredient').add(ingredient.getFirestoreData());
	}
	
	removeUserIngredient(Ingredient ingredient){
		var result = firebase.firestore().collection('ingredients').where("userID", "==", this.userID).where("spoonacularName", "==", ingredient.getSpoonacularName()).get()
		    .then(snapshot => {
				snapshot.forEach(doc => {
					var deleteDoc = firebase.firestore().collection('ingredients').doc(doc.id).delete();
				});
			})
			.catch(err => {
				console.log('Error getting document', err);
			});
	}

	updateUserIngredient(Ingredient ingredient){
		firebase.firestore().collection('ingredients').where("userID", "==", this.userID).where("spoonacularName", "==", ingredient.getSpoonacularName()).get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				firebase.firestore().collection('ingredients').doc(doc.id).update(ingredient.getFirestoreData());
			});
		});
	}

	getAllUserIngredients(){
		let ingredients=[];
		firebase.firestore().collection('ingredients').where("userID", "==", this.userID).get().then(snapshot => {
			snapshot.forEach(doc => {
				ingredients.push(new Ingredient(doc.name, doc.spoonacularName, doc.type, doc.expirationDate, doc.quantity, doc.imageURL));
			});
		});
		return ingredients;
	}
	
}