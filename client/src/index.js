import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { Provider } from "react-redux";
import Reducer from "./reducers/Reducer";

/**
 * Creation of Store in order to use redux
 * @param  {Function} Reducer specify how the application's state changes in response to actions sent to the store.
 * @param  {Function} applyMiddleware supercharges createStore with middleware.
 */

const store = createStore(Reducer, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
