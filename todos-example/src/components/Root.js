import React from "react";
import PropTypes from 'prop-types'
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <Route path="/:filter?" component={App} /* App's props: { match: { params } } *//>
        </Router>
    </Provider>
)

Root.propTypes = {
    store: PropTypes.object.isRequired
}

export default Root