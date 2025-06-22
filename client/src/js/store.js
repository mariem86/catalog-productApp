import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Cookies from 'js-cookie'
import rootReducer from "./reducers";


const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
  },
};
const middleware = [thunk];
const devtools =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__();

const store = createStore(
  rootReducer,initialState,
  compose(applyMiddleware(...middleware), devtools)
);

export default store;