# Recipe To Cook

Created with [Create React App](https://github.com/facebook/create-react-app).

Visit [https://recipe-to-cook.web.app/](https://recipe-to-cook.web.app/) to see the live version and [https://leo-liu1.github.io/recipe-to-cook/](https://leo-liu1.github.io/recipe-to-cook/) for documentation.

## Directory Structure

```$xslt
root/
|  public/ # contains our icons, static html, etc.
|  src/
|  |  __tests__/
|  |  |  testutil/
|  |  |  |  MockContext.js # util helper class to mock dependency
|  |  |  FirestoreHandler.test.js # firestore component tests
|  |  |  Fridge.test.js # fridge component tests
|  |  |  History.test.js # history component tests
|  |  |  Recommendation.test.js # recommendation component tests
|  |  |  Search.test.js # search component tests
|  |  |  Login.test.js # log in component tests
|  |  |  Signup.test.js # sign up component tests
|  |  |  SpoonacularHandler.test.js # Spoonacular handler tests
|  |  |  AuthHandler.test.js # Auth handler tests
|  |  assets/ # contains our fonts, icons, images
|  |  components/
|  |  |  classes/ # contains our data classes
|  |  |  |  Ingredient.js
|  |  |  |  Recipe.js
|  |  |  |  Seasoning.js
|  |  |  common/
|  |  |  |  RecipeBox.js # component to display recipes
|  |  |  |  Navbar.js # nav bar on top of page
|  |  |  |  NavbarSearch.js # search bar in nav bar
|  |  |  handlers/
|  |  |  |  AuthHandler.js # class to handle user authentication
|  |  |  |  FirebaseHandler.js # class to handle communication w/ firestore api
|  |  |  |  FirestoreHandler.js # class to handle communication w/ firestore api
|  |  |  |  SpoonacularHandler.js # class to handle communication w/ spoonacular's spi
|  |  |  css/ # contains our css styling sheets
|  |  |  pages/
|  |  |  |  Fridge.js # main Fridge page component
|  |  |  |  History.js # user History page component
|  |  |  |  Landing.js # main Landing page component
|  |  |  |  Login.js # user Login page component
|  |  |  |  Recommendation.js # recommended recipe page component
|  |  |  |  Search.js # search page component
|  |  |  |  Signup.js # user Signups page component
|  |  |  App.js # main app file
|  |  |  index.js
|  .env # environment variable file needed to run our application
|  README.md
|  firebase.json # firebase config file
|  firestore.indexes.json # our composite indexes used in Firestore for some of our queries
|  firestore.rules # our Firestore security rules we use for authentication
|  package.json # package and settings
```
## How to Deploy and Run Tests

### `npm install`

Install all packages necessary to run the application.

### `npm run test`

 Use this command to run automated tests. We use [Jest](https://jestjs.io/) as our testing framework.

### `npm start`

This starts the server in the developer mode.

Please note: Our application requires the `.env` file (included in the CCLE submission) to be included in the root folder of the project. Included in the file contains our Firesbase API key and our Spoonacular API key, the latter of which can only handle 150 requests per day.

## API Documentation

Full API documentation can be found [here](https://leo-liu1.github.io/recipe-to-cook/).
