import React from 'react';
import {createStore} from 'redux';
import {render} from 'react-dom'
import todoApp from 'reducers/reducers';
import {Provider} from "react-redux";
import App from "./components/App";

const store = createStore(todoApp, window.STATE_FROM_SERVER);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
