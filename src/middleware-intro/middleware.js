// Attempt #1: Logging Manually
function loggingManually() {
    const action = addTodo('Use Redux');
    console.log('dispatching', action);

    store.dispatch(action);
    console.log('next state', store.getState());
}

// Attempt #2: Wrapping Dispatch
function wrappingDispatch() {
    function dispatchAndLog(store, action) {
        console.log('dispatching', action);
        store.dispatch(action);
        console.log('next state', store.getState())
    }
}

// Attempt #2: Monkeypatching Dispatch
function wrappingDispatch() {
    const next = store.dispatch;
    store.dispatch = function dispatchAndLog(action) {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result
    }
}

// Attempt #4: Hiding Monkeypatching
function hidingMonkeyPatching() {
    function logger(store) {
        const next = store.dispatch;

        // Previously:
        // store.dispatch = function dispatchAndLog(action) {

        return function dispatchAndLog(action) {
            console.log('dispatching', action);
            let result = next(action);
            console.log('next state', store.getState());
            return result
        }
    }

    function applyMiddlewareByMonkeypatching(store, middlewares) {
        middlewares = middlewares.slice();
        middlewares.reverse();

        // Transform dispatch function with each middleware.
        middlewares.forEach(middleware => (store.dispatch = middleware(store)))
    }

    applyMiddlewareByMonkeypatching(store, [logger, crashReporter])
}

// Attempt #5: Removing Monkeypatching
function removingMonkeyPatching() {
    function logger(store) {
        return function wrapDispatchToAddLogging(next) {
            return function dispatchAndLog(action) {
                console.log('dispatching', action);
                let result = next(action);
                console.log('next state', store.getState());
                return result
            }
        }
    }

    const loggerES6 = store => next => action => {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result
    };

    const crashReporter = store => next => action => {
        try {
            return next(action)
        } catch (err) {
            console.error('Caught an exception!', err);
            Raven.captureException(err, {
                extra: {
                    action,
                    state: store.getState()
                }
            });
            throw err
        }
    }
}

// Attempt #6: Naïvely Applying the Middleware
function naïvelyApplyingTheMiddleware() {
    // Warning: Naïve implementation!
    // That's *not* Redux API.
    function applyMiddleware(store, middlewares) {
        middlewares = middlewares.slice();
        middlewares.reverse();
        let dispatch = store.dispatch;
        middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)));
        return Object.assign({}, store, {dispatch})
    }
}

// The Final Approach
function finalApproach() {
    const logger = store => next => action => {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result
    };

    const crashReporter = store => next => action => {
        try {
            return next(action)
        } catch (err) {
            console.error('Caught an exception!', err);
            Raven.captureException(err, {
                extra: {
                    action,
                    state: store.getState()
                }
            });
            throw err
        }
    };

    ////
    import { createStore, combineReducers, applyMiddleware } from 'redux'

    const todoApp = combineReducers(reducers);
    const store = createStore(
        todoApp,
        // applyMiddleware() tells createStore() how to handle middleware
        applyMiddleware(logger, crashReporter)
    );

    // Will flow through both logger and crashReporter middleware!
    store.dispatch(addTodo('Use Redux'))
}
