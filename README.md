# Recipe To Cook

Created with [Create React App](https://github.com/facebook/create-react-app). Visit https://recipe-to-cook.web.app/ to see the live version.

## Directory Structure

```$xslt
root/
|  public/ # contains our icons, static html, etc.
|  src/
|  |  __tests__/
|  |  |  testutil/
|  |  |  |  MockContext.js # util helper class to mock dependency
|  |  |  Firestore.test.js # firestore component tests
|  |  |  Fridge.test.js # fridge component tests
|  |  |  History.test.js # history component tests
|  |  |  Recommendation.test.js # recommendation component tests
|  |  |  Search.test.js # search component tests
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
|  |  |  injex.js
|  README.md
|  firebase.json # firebase config file
|  firestore.indexes.json
|  firestore.rules
|  package.json # package and settings
```
## How to Deploy and Run Tests

### `npm install`

Install all packages necessary to run the application.

### `npm run tests`

 Use this command to run automated tests. We use [Jest](https://jestjs.io/) as our testing framework.

### `npm start`

This starts the server in the developer mode. You need the `.env` file in order to start the application.

Please note: Our application requires the .env file (included in the CCLE submission), and it can only handle 150 requests (to the Spoonacular Handler) per day.
